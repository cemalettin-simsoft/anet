package mil.dds.anet.beans;

import io.leangen.graphql.annotations.GraphQLInputField;
import io.leangen.graphql.annotations.GraphQLQuery;
import java.util.Objects;
import mil.dds.anet.utils.Utils;
import mil.dds.anet.views.AbstractAnetBean;

public class Tag extends AbstractAnetBean {

  @GraphQLQuery
  @GraphQLInputField
  private String name;
  @GraphQLQuery
  @GraphQLInputField
  private String description;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = Utils.trimStringReturnNull(name);
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = Utils.trimStringReturnNull(description);
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof Tag)) {
      return false;
    }
    Tag t = (Tag) o;
    return Objects.equals(t.getUuid(), uuid) && Objects.equals(t.getName(), name)
        && Objects.equals(t.getDescription(), description);
  }

  @Override
  public int hashCode() {
    return Objects.hash(uuid, name, description);
  }

  @Override
  public String toString() {
    return String.format("(%s) - %s", uuid, name);
  }

}
