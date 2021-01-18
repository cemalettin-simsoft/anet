package mil.dds.anet.beans;

import io.leangen.graphql.annotations.GraphQLInputField;
import io.leangen.graphql.annotations.GraphQLQuery;
import java.util.Objects;
import mil.dds.anet.views.AbstractCustomizableAnetBean;

public class CustomSensitiveInformation extends AbstractCustomizableAnetBean
    implements RelatableObject {

  @GraphQLQuery
  @GraphQLInputField
  private String relatedObjectUuid;

  @GraphQLQuery
  @GraphQLInputField
  private String relatedObjectType;

  @GraphQLQuery
  @GraphQLInputField
  private String customField;


  public String getRelatedObjectUuid() {
    return relatedObjectUuid;
  }

  public void setRelatedObjectUuid(String relatedObjectUuid) {
    this.relatedObjectUuid = relatedObjectUuid;
  }

  public String getRelatedObjectType() {
    return relatedObjectType;
  }

  public void setRelatedObjectType(String relatedObjectType) {
    this.relatedObjectType = relatedObjectType;
  }

  public String getCustomField() {
    return customField;
  }

  public void setCustomField(String customField) {
    this.customField = customField;
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof CustomSensitiveInformation)) {
      return false;
    }
    final CustomSensitiveInformation csi = (CustomSensitiveInformation) o;
    return Objects.equals(csi.getUuid(), uuid)
        && Objects.equals(csi.getCustomFields(), customField);
  }

  @Override
  public int hashCode() {
    return Objects.hash(uuid, customField);
  }

  @Override
  public String toString() {
    return String.format("[uuid:%s]", uuid);
  }
}
