package mil.dds.anet.database;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import mil.dds.anet.AnetObjectEngine;
import mil.dds.anet.beans.CustomSensitiveInformation;
import mil.dds.anet.beans.Person;
import mil.dds.anet.beans.search.AbstractSearchQuery;
import mil.dds.anet.database.mappers.CustomSensitiveInformationMapper;
import mil.dds.anet.utils.AnetAuditLogger;
import mil.dds.anet.utils.DaoUtils;
import mil.dds.anet.utils.FkDataLoaderKey;
import mil.dds.anet.utils.Utils;
import mil.dds.anet.views.ForeignKeyFetcher;
import org.jdbi.v3.core.mapper.MapMapper;
import org.jdbi.v3.core.statement.Query;
import ru.vyarus.guicey.jdbi3.tx.InTransaction;

public class CustomSensitiveInformationDao
    extends AnetBaseDao<CustomSensitiveInformation, AbstractSearchQuery<?>> {

  private static final String[] fields =
      {"uuid", "relatedObjectUuid", "relatedObjectType", "customFields", "createdAt", "updatedAt"};
  public static final String TABLE_NAME = "customSensitiveInformation";
  public static final String CUSTOM_SENSITIVE_INFORMATION_FIELDS =
      DaoUtils.buildFieldAliases(TABLE_NAME, fields, true);

  @Override
  public CustomSensitiveInformation getByUuid(String uuid) {
    return getByIds(Arrays.asList(uuid)).get(0);
  }

  static class SelfIdBatcher extends IdBatcher<CustomSensitiveInformation> {

    private static final String sql = "/* batch.getCustomSensitiveInformationByUuids */ SELECT "
        + CUSTOM_SENSITIVE_INFORMATION_FIELDS + " from " + TABLE_NAME
        + "  where uuid in ( <uuids> )";

    public SelfIdBatcher() {
      super(sql, "uuids", new CustomSensitiveInformationMapper());
    }
  }

  @Override
  public List<CustomSensitiveInformation> getByIds(List<String> uuids) {
    final IdBatcher<CustomSensitiveInformation> idBatcher =
        AnetObjectEngine.getInstance().getInjector().getInstance(SelfIdBatcher.class);
    return idBatcher.getByIds(uuids);
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
    final ForeignKeyBatcher<CustomSensitiveInformation> relatedObjectIdBatcher = AnetObjectEngine
        .getInstance().getInjector().getInstance(CustomSensitiveInformationBatcher.class);
    return relatedObjectIdBatcher.getByForeignKeys(foreignKeys);
  }

  @Override
  public CustomSensitiveInformation insertInternal(CustomSensitiveInformation csi) {
    throw new UnsupportedOperationException();
  }

  /**
   * Insert metod.
   **/
  @InTransaction
  public CustomSensitiveInformation insert(Person user, CustomSensitiveInformation csi) {
    if (csi == null || !isAuthorized(user, csi) || Utils.isEmptyHtml(csi.getCustomField())) {
      return null;
    }
    DaoUtils.setInsertFields(csi);
    getDbHandle().createUpdate("/*insertCustomSensitiveInformation*/ INSERT INTO \"" + TABLE_NAME
        + "\""
        + "(uuid, \"relatedObjectUuid\", \"relatedObjectType\", \"customFields\", \"createdAt\", \"updatedAt\") "
        + "VALUES (:uuid, :relatedObjectUuid, :relatedObjectType, :customFields, :createdAt, :updatedAt)")
        .bindBean(csi).bind("relatedObjectUuid", csi.getRelatedObjectUuid())
        .bind("relatedObjectType", csi.getRelatedObjectType())
        .bind("customFields", csi.getCustomFields())
        .bind("createdAt", DaoUtils.asLocalDateTime(csi.getCreatedAt()))
        .bind("updatedAt", DaoUtils.asLocalDateTime(csi.getUpdatedAt())).execute();
    AnetAuditLogger.log("CustomSensitiveInformation {} created by {} ", csi, user);
    return csi;
  }

  @Override
  public int updateInternal(CustomSensitiveInformation csi) {
    throw new UnsupportedOperationException();
  }

  /**
   * Update method
   **/
  @InTransaction
  public int update(Person user, CustomSensitiveInformation csi) {
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

  @InTransaction
  public CompletableFuture<CustomSensitiveInformation> getForRelatedObject(
      Map<String, Object> context, CustomSensitiveInformation csi, Person user) {
    if (!isAuthorized(user, csi)) {
      return CompletableFuture.completedFuture(null);
    }
    return new ForeignKeyFetcher<CustomSensitiveInformation>()
        .load(context, FkDataLoaderKey.RELATED_OBJECT_CUSTOM_SENSITIVE_INFORMATION, csi.getUuid())
        .thenApply(l -> {
          CustomSensitiveInformation customSensitiveInformation =
              Utils.isEmptyOrNull(l) ? null : l.get(0);
          if (customSensitiveInformation != null) {
            AnetAuditLogger.log("CustomSensitiveInformation {} retrieved by {} ",
                customSensitiveInformation, user);
          } else {
            customSensitiveInformation = new CustomSensitiveInformation();
          }
          return customSensitiveInformation;
        });
  }

  /**
   * @param user the user executing the request
   * @param csi the CustomSensitiveInformation
   * @return true if the user is allowed to access the custom sensitive information
   */
  private boolean isAuthorized(Person user, CustomSensitiveInformation csi) {
    final String userUuid = DaoUtils.getUuid(user);
    final String csiUuid = DaoUtils.getUuid(csi);
    if (userUuid == null || csiUuid == null) {
      // No user or no related object
      return false;
    }

    // Check authorization groups
    final Query query = getDbHandle()
        .createQuery("/* chekUserAuthorization*/ SELECT COUNT(*) AS count"
            + " FROM \"customSensitiveInformationAuthorizationGroups\" csi "
            + " LEFT JOIN \"authorizationGroupPositions\" agp ON agp.\"authorizationGroupUuid\" = csi.\"authorizationGroupUuid\" "
            + " LEFT JOIN positions p ON p.uuid = agp.\"positionUuid\" WHERE csi.\"customSensitiveInformationUuid\" = :customSensitiveInformationUuid"
            + " AND p.\"currentPersonUuid\" = :userUuid")
        .bind("customSensitiveInformationUuid", csiUuid).bind("userUuid", userUuid);
    final Optional<Map<String, Object>> result = query.map(new MapMapper(false)).findFirst();
    return result.isPresent() && ((Number) result.get().get("count")).intValue() > 0;
  }
}
