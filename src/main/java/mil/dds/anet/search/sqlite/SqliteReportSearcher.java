package mil.dds.anet.search.sqlite;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.skife.jdbi.v2.Handle;

import jersey.repackaged.com.google.common.base.Joiner;
import mil.dds.anet.beans.Report;
import mil.dds.anet.beans.search.ReportSearchQuery;
import mil.dds.anet.database.PersonDao;
import mil.dds.anet.database.ReportDao;
import mil.dds.anet.database.mappers.ReportMapper;
import mil.dds.anet.search.IReportSearcher;

public class SqliteReportSearcher implements IReportSearcher {

	public List<Report> runSearch(ReportSearchQuery query, Handle dbHandle) { 
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT " + ReportDao.REPORT_FIELDS + "," + PersonDao.PERSON_FIELDS);
		sql.append(" FROM reports, people WHERE reports.authorId = people.id ");
		sql.append("AND reports.id IN ( SELECT reports.id FROM reports ");
		
		String commonTableExpression = null;
		Map<String,Object> args = new HashMap<String,Object>();
		List<String> whereClauses = new LinkedList<String>();
		
		if (query.getAuthorId() != null) { 
			whereClauses.add("reports.authorId = :authorId");
			args.put("authorId", query.getAuthorId());
		}
		
		String text = query.getText();
		if (text != null && text.trim().length() > 0) {
			whereClauses.add("(text LIKE '%' || :text || '%' OR "
					+ "intent LIKE '%' || :text || '%' OR "
					+ "keyOutcomesSummary LIKE '%' || :text || '%' OR "
					+ "keyOutcomes LIKE '%' || :text || '%' OR "
					+ "nextStepsSummary LIKE '%' || :text || '%' OR "
					+ "nextSteps LIKE '%' || :text || '%'"
					+ ")");
			args.put("text", text);
		}
		
		DateTimeFormatter sqlitePattern = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
		
		if (query.getEngagementDateStart() != null) { 
			whereClauses.add("reports.engagementDate >= DateTime(:startDate)");
			args.put("startDate", sqlitePattern.print(query.getEngagementDateStart()));
		}
		if (query.getEngagementDateEnd() != null) { 
			whereClauses.add("reports.engagementDate <= DateTime(:endDate)");
			args.put("endDate", sqlitePattern.print(query.getEngagementDateEnd()));
		}
		
		if (query.getCreatedAtStart() != null) { 
			whereClauses.add("reports.createdAt >= DateTime(:startCreatedAt)");
			args.put("startCreatedAt", sqlitePattern.print(query.getCreatedAtStart()));
		}
		if (query.getCreatedAtEnd() != null) { 
			whereClauses.add("reports.createdAt <= DateTime(:endCreatedAt)");
			args.put("endCreatedAt", sqlitePattern.print(query.getCreatedAtEnd()));
		}
		
		if (query.getAttendeeId() != null) { 
			 whereClauses.add("reports.id IN (SELECT reportId from reportPeople where personId = :attendeeId)");
			 args.put("attendeeId", query.getAttendeeId());
		}
		
		if (query.getPoamId() != null) { 
			whereClauses.add("reports.id IN (SELECT reportId from reportPoams where poamId = :poamId)");
			args.put("poamId", query.getPoamId());
		}
		
		if (query.getAuthorOrgId() != null) { 
			//TODO: this is known to be wrong when the author has moved positions or when the author is not from the Advisor Organization
			// need to coordinate with the team on if the later happens and if it's worth either
			// a) storing the advisorOrg and principalOrg on the report table
			// b) running an indexing job that stores this somewhere else and takes the time to do the past math. 
			//    (is it even possible? ie: does a position get removed from an orgaization and then the fact that it was connected then lost forever?)
			if (query.isIncludeAuthorOrgChildren()) { 
				commonTableExpression = "WITH RECURSIVE parent_orgs(id) AS ( "
						+ "SELECT id FROM organizations WHERE id = :authorOrgId "
					+ "UNION ALL "
						+ "SELECT o.id from parent_orgs po, organizations o WHERE o.parentOrgId = po.id "
					+ ") ";
				whereClauses.add("reports.authorId IN "
					+ "(SELECT currentPersonId FROM positions WHERE organizationId IN (SELECT id from parent_orgs))");
				args.put("authorOrgId", query.getAuthorOrgId());
			} else { 
				whereClauses.add("reports.authorId in (select currentPersonId from positions where organizationId = :authorOrgId)");
				args.put("authorOrgId", query.getAuthorOrgId());
			}
		}
		
		if (query.getPrincipalOrgId() != null) { 
			if (query.isIncludePrincipalOrgChildren()) { 
				//TODO
			} else { 
				//TODO
			}
		}
		
		if (query.getLocationId() != null) { 
			whereClauses.add("locationId = :locationId");
			args.put("locationId", query.getLocationId());
		}
		
		if (query.getPendingApprovalOf() != null) {
			whereClauses.add("reports.approvalStepId IN "
				+ "(SELECT id from approvalSteps where approverGroupId IN "
				+ "(SELECT groupId FROM groupMemberships where personId=:approverId))");
			args.put("approverId", query.getPendingApprovalOf());
		}
		
		sql.append(" WHERE ");
		sql.append(Joiner.on(" AND ").join(whereClauses));
		sql.append(" LIMIT :limit OFFSET :offset)");
		
		if (commonTableExpression != null) { 
			sql.insert(0, commonTableExpression);
		}
		
		return dbHandle.createQuery(sql.toString())
				.bindFromMap(args)
				.bind("offset", query.getPageSize() * query.getPageNum())
				.bind("limit", query.getPageSize())
				.map(new ReportMapper())
				.list();
	}
	
	
}
