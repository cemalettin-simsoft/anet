package mil.dds.anet.database.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.joda.time.DateTime;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import mil.dds.anet.beans.Organization;
import mil.dds.anet.beans.Person;
import mil.dds.anet.beans.Position;
import mil.dds.anet.beans.Position.PositionType;
import mil.dds.anet.beans.geo.Location;
import mil.dds.anet.views.AbstractAnetView.LoadLevel;

public class PositionMapper implements ResultSetMapper<Position> {

	@Override
	public Position map(int index, ResultSet r, StatementContext ctx) throws SQLException {
		//This hits when we do a join but there's no Billet record. 
		if (r.getObject("positions_id") == null) { return null; }
				
		Position p = new Position();
		p.setId(r.getInt("positions_id"));
		p.setName(r.getString("positions_name"));
		p.setCode(r.getString("positions_code"));
		p.setType(MapperUtils.getEnumIdx(r, "positions_type", PositionType.class));
		Integer orgId = MapperUtils.getInteger(r, "positions_organizationId");
		if (orgId != null) { 
			p.setOrganization(Organization.createWithId(orgId));
		}
		Integer personId = MapperUtils.getInteger(r, "positions_currentPersonId");
		if (personId != null) {
			Person person = Person.createWithId(personId);
			try { 
				//TODO: This is terrible,f ix this. 
				r.getString("person_firstName"); //This will throw a SQLException if the column doesn't exist.
				PersonMapper.<Person>fillInFields(person, r);
			} catch (SQLException e) {}
			p.setPerson(person);
		}
		
		Integer locationId = MapperUtils.getInteger(r, "positions_locationId");
		if (locationId != null) { 
			p.setLocation(Location.createWithId(locationId));
		}
		
		p.setCreatedAt(new DateTime(r.getTimestamp("positions_createdAt")));
		p.setLoadLevel(LoadLevel.PROPERTIES);
		return p;
	}

}
