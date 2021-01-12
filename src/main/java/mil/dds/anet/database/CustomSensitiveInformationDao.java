package mil.dds.anet.database;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import mil.dds.anet.AnetObjectEngine;
import mil.dds.anet.beans.CustomSensitiveInformation;
import mil.dds.anet.beans.Person;
import mil.dds.anet.beans.search.AbstractSearchQuery;
import mil.dds.anet.database.mappers.CustomSensitiveInformationMapper;
import mil.dds.anet.utils.AnetAuditLogger;
import mil.dds.anet.utils.DaoUtils;
import mil.dds.anet.utils.Utils;
import org.jdbi.v3.core.mapper.MapMapper;
import org.jdbi.v3.core.statement.Query;

public class CustomSensitiveInformationDao
    extends AnetBaseDao<CustomSensitiveInformation, AbstractSearchQuery<?>> {

  private static final String[] fields =
      {"uuid", "relatedObjectUuid", "relatedObjectType", "customFields", "createdAt", "updatedAt"};
  public static final String TABLE_NAME = "customSensitiveInformation";
  public static final String CUSTOM_SENSITIVE_INFORMATION_FIELDS =
      DaoUtils.buildFieldAliases(TABLE_NAME, fields, true);

  @Override
  public CustomSensitiveInformation getByUuid(String uuid) {
    throw new UnsupportedOperationException();
  }

  @Override
  public List<CustomSensitiveInformation> getByIds(List<String> relatedObjectUuid) {
    throw new UnsupportedOperationException();
  }

  @Override
  public CustomSensitiveInformation insertInternal(CustomSensitiveInformation csi) {
    throw new UnsupportedOperationException();
  }

  @Override
  public int updateInternal(CustomSensitiveInformation csi) {
    throw new UnsupportedOperationException();
  }

  static class CustomSensitiveInformationBatcher
      extends ForeignKeyBatcher<CustomSensitiveInformation> {

    private static final String sql =
        "/* batch.getCustomSensitiveInformationByRelatedObjectUuids*/ SELECT "
            + CUSTOM_SENSITIVE_INFORMATION_FIELDS + " FROM \"" + TABLE_NAME + "\""
            + " WHERE \"relatedObjectUuid\" IN ( <foreignKeys> )";

    public CustomSensitiveInformationBatcher() {
      super(sql, "foreignKeys", new CustomSensitiveInformationMapper(),
          "customSensitiveInformation_relatedObjectUuid");
    }
  }

  public List<List<CustomSensitiveInformation>> getCustomSensitiveInformation(
      List<String> foreignKeys) {
    final ForeignKeyBatcher<CustomSensitiveInformation> relatedObjectId = AnetObjectEngine
        .getInstance().getInjector().getInstance(CustomSensitiveInformationBatcher.class);
    return relatedObjectId.getByForeignKeys(foreignKeys);
  }

  /**
   * Insert metod.
   **/
  private CustomSensitiveInformation insert(Person user, CustomSensitiveInformation csi) {
    if (csi == null || !isAuthorized(user, csi) || Utils.isEmptyHtml(csi.getCustomFields())) {
      return null;
    }
    DaoUtils.setInsertFields(csi);
    getDbHandle().createUpdate("/*insertCustomSensitiveInformation*/ INSERT INTO \"" + TABLE_NAME
        + "\""
        + "(uuid, \"relatedObjectUuid\", \"relatedObjectType\", \"customFields\", \"createdAt\", \"updatedAt\") "
        + "VALUES (:uuid, :relatedObjectUuid, :relatedObjectType, :customFields, :createdAt, :updatedAt)")
        .bindBean(csi).bind("createdAt", DaoUtils.asLocalDateTime(csi.getCreatedAt()))
        .bind("updatedAt", DaoUtils.asLocalDateTime(csi.getUpdatedAt())).execute();
    // .bind("relatedObjectUuid", ).bind("relatedObjectType", ).bind("customFields", ).execute();
    AnetAuditLogger.log("CustomSensitiveInformation {} created by {} ", csi, user);
    return csi;
  }

  /**
   * Update method
   **/
  private int update(Person user, CustomSensitiveInformation csi) {
    if (csi == null || !isAuthorized(user, csi)) {
      return 0;
    }

    final int numRows;
    if (Utils.isEmptyHtml(csi.getCustomFields())) {
      numRows = getDbHandle().createUpdate("/* deleteCustomSensitiveInformation */ DELETE FROM \""
          + TABLE_NAME + "\" WHERE uuid = : uuid ").bind("uuid", csi.getUuid()).execute();
      AnetAuditLogger.log("Empty CustomSensitiveInformation {} deleted by {} ", csi, user);
    } else {
      csi.setUpdatedAt(Instant.now());
      numRows = getDbHandle()
          .createUpdate("/* updateCustumSensitiveInformation */ UPDATE \"" + TABLE_NAME + "\""
              + " SET customFields = :customFields, \"updatedAt\" = :updatedAt WHERE uuid = :uuid")
          .bindBean(csi).bind("updatedAt", DaoUtils.asLocalDateTime(csi.getUpdatedAt())).execute();
      AnetAuditLogger.log("CustomSensitiveInformation {} updated by {} ", csi, user);
    }
    return numRows;
  }

  public Object insertOrUpdate(CustomSensitiveInformation csi, Person user) {
    return (DaoUtils.getUuid(csi) == null) ? insert(user, csi) : update(user, csi);
  }

  /**
   * Update metodu oluşturulacak !!!
   **/

  /**
   * Açıklaması yazılacak !!! MAk
   *
   * @param user the user executing the request
   * @param csi the CustomSensitiveInformation
   * @return true if the user is allowed to access the report's sensitive information
   */
  private boolean isAuthorized(Person user, CustomSensitiveInformation csi) {
    final String userUuid = DaoUtils.getUuid(user);
    if (userUuid == null) {
      // No user
      return false;
    }

    // Check authorization groups
    final Query query = getDbHandle()
        .createQuery("/* chekUserAuthorization*/ SELECT COUNT(*) AS count"
            + " FROM \"customSensitiveInformationAuthorizationGroups\" csi "
            + " LEFT JOIN \"authorizationGroupPositions\" agp ON agp.\"authorizationGroupUuid\" = csi.\"authorizationGroupUuid\" "
            + " LEFT JOIN positions p ON p.uuid = agp.\"positionUuid\" WHERE csi.\"customSensitiveInformationUuid\" = :customSensitiveInformationUuid"
            + " AND p.\"currentPersonUuid\" = :userUuid")
        .bind("customSensitiveInformationUuid", csi.getRelatedObjectUuid())
        .bind("userUuid", userUuid);
    final Optional<Map<String, Object>> result = query.map(new MapMapper(false)).findFirst();
    return result.isPresent() && ((Number) result.get().get("count")).intValue() > 0;
  }
}
