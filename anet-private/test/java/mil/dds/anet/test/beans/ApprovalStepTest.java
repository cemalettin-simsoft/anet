package mil.dds.anet.test.beans;

import com.google.common.collect.ImmutableList;
import mil.dds.anet.beans.ApprovalStep;
import mil.dds.anet.beans.ApprovalStep.ApprovalStepType;
import org.junit.jupiter.api.Test;

public class ApprovalStepTest extends BeanTester<ApprovalStep> {

  // DON'T USE THIS ANYWHERE ELSE!!
  // It has all the foreign keys filled it and is dangerous!
  private static ApprovalStep getTestApprovalStep() {
    ApprovalStep as = new ApprovalStep();
    as.setUuid("42");
    as.setRelatedObjectUuid("22");
    as.setApprovers(ImmutableList.of());
    as.setNextStepUuid("9292");
    as.setType(ApprovalStepType.REPORT_APPROVAL);
    return as;
  }

  @Test
  public void serializesToJson() throws Exception {
    serializesToJson(getTestApprovalStep(), "testJson/approvalSteps/testStep.json");
  }

  @Test
  public void deserializesFromJson() throws Exception {
    deserializesFromJson(getTestApprovalStep(), "testJson/approvalSteps/testStep.json");
  }

}
