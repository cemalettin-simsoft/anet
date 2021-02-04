package mil.dds.anet.beans.lists;

import io.leangen.graphql.annotations.GraphQLInputField;
import io.leangen.graphql.annotations.GraphQLQuery;
import java.util.List;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.Query;

public class AnetBeanList<T> {

  @GraphQLQuery
  @GraphQLInputField
  List<T> list;
  @GraphQLQuery
  @GraphQLInputField
  Integer pageNum;
  @GraphQLQuery
  @GraphQLInputField
  Integer pageSize;
  @GraphQLQuery
  @GraphQLInputField
  Integer totalCount;

  public AnetBeanList() { /* Serialization Constructor */ }

  public AnetBeanList(List<T> list) {
    this(null, null, list);
    this.totalCount = list.size();
  }

  public AnetBeanList(Integer pageNum, Integer pageSize, List<T> list) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.list = list;
  }

  public AnetBeanList(Query query, int pageNum, int pageSize, RowMapper<T> mapper) {
    this(pageNum, pageSize, query.map(mapper).list());
    int resultSize = getList().size();
    if (resultSize == 0) {
      setTotalCount(0);
    } else {
      Integer foundCount = (Integer) query.getContext().getAttribute("totalCount");
      setTotalCount(foundCount == null ? resultSize : foundCount);
    }
  }

  public List<T> getList() {
    return list;
  }

  public void setList(List<T> list) {
    this.list = list;
  }

  public Integer getPageNum() {
    return pageNum;
  }

  public void setPageNum(Integer pageNum) {
    this.pageNum = pageNum;
  }

  public Integer getPageSize() {
    return pageSize;
  }

  public void setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
  }

  public Integer getTotalCount() {
    return totalCount;
  }

  public void setTotalCount(Integer totalCount) {
    this.totalCount = totalCount;
  }

}
