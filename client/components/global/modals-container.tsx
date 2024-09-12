import { AssistantForm } from "../lead/forms/assistant-form";
import { GeneralInfoForm } from "../lead/forms/general-info-form";
import { IntakeForm } from "../lead/forms/intake/intake-form";
import { MainInfoForm } from "../lead/forms/main-info-form";
import { PolicyInfoForm } from "../lead/forms/policy-info-form";
import { ShareForm } from "../lead/forms/share-form";
import { TransferForm } from "../lead/forms/transfer-form";

const ModalsContainer = () => {
  return (
    <>
      <MainInfoForm />
      <GeneralInfoForm />
      <PolicyInfoForm />
      <ShareForm />
      <TransferForm />
      <IntakeForm />
      <AssistantForm />
    </>
  );
};

export default ModalsContainer;
