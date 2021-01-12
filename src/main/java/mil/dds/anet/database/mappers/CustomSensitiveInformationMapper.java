package mil.dds.anet.database.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;
import mil.dds.anet.beans.CustomSensitiveInformation;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

public class CustomSensitiveInformationMapper implements RowMapper<CustomSensitiveInformation> {

  @Override
  public CustomSensitiveInformation map(ResultSet rs, StatementContext ctx) throws SQLException {
    final CustomSensitiveInformation csi = new CustomSensitiveInformation();
    MapperUtils.setCommonBeanFields(csi, rs, "customSensitiveInformation");
    csi.setCustomFields(rs.getString("customSensitiveInformation_customField"));

    /**
     * Diger DB alanlarını da burada set etmem gerekebilir! şimdilik sadece customField alanı set
     * ettim...
     **/
    return csi;
  }

}
