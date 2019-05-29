package mil.dds.anet.search.mssql;

import mil.dds.anet.beans.Tag;
import mil.dds.anet.beans.search.ISearchQuery.SortOrder;
import mil.dds.anet.beans.search.TagSearchQuery;
import mil.dds.anet.search.AbstractSearchQueryBuilder;
import mil.dds.anet.search.AbstractTagSearcher;
import mil.dds.anet.utils.Utils;

public class MssqlTagSearcher extends AbstractTagSearcher {

  public MssqlTagSearcher() {
    super(new MssqlSearchQueryBuilder<Tag, TagSearchQuery>("MssqlTagSearch"));
  }

  @Override
  protected void buildQuery(TagSearchQuery query) {
    super.buildQuery(query);
    qb.addSelectClause("COUNT(*) OVER() AS totalCount");
  }

  @Override
  protected void addTextQuery(TagSearchQuery query) {
    // If we're doing a full-text search, add a pseudo-rank (the sum of all search ranks)
    // so we can sort on it (show the most relevant hits at the top).
    // Note that summing up independent ranks is not ideal, but it's the best we can do now.
    // See
    // https://docs.microsoft.com/en-us/sql/relational-databases/search/limit-search-results-with-rank
    qb.addSelectClause("ISNULL(c_tags.rank, 0) + ISNULL(f_tags.rank, 0) AS search_rank");
    qb.addFromClause("LEFT JOIN CONTAINSTABLE (tags, (name, description), :containsQuery) c_tags"
        + " ON tags.uuid = c_tags.[Key]"
        + " LEFT JOIN FREETEXTTABLE(tags, (name, description), :freetextQuery) f_tags"
        + " ON tags.uuid = f_tags.[Key]");
    qb.addWhereClause("c_tags.rank IS NOT NULL");
    final String text = query.getText();
    qb.addSqlArg("containsQuery", Utils.getSqlServerFullTextQuery(text));
    qb.addSqlArg("freetextQuery", text);
  }

  @Override
  protected void addOrderByClauses(AbstractSearchQueryBuilder<?, ?> qb, TagSearchQuery query) {
    if (query.isTextPresent() && !query.isSortByPresent()) {
      // We're doing a full-text search without an explicit sort order,
      // so sort first on the search pseudo-rank.
      qb.addAllOrderByClauses(Utils.addOrderBy(SortOrder.DESC, null, "search_rank"));
    }
    super.addOrderByClauses(qb, query);
  }

}
