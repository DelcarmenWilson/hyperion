import { ScriptForm } from "@/app/(pages)/settings/(routes)/config/components/script/form";
import { AssistantForm } from "../lead/forms/assistant-form";
import { ChatContainer } from "@/components/chat/container";
import { GeneralInfoForm } from "../lead/forms/general-info-form";
import { GroupMessageCard } from "@/components/global/group-message-card";
import { IntakeForm } from "../lead/forms/intake/intake-form";
import { LoginStatusModal } from "@/components/login-status/modal";
import { MainInfoForm } from "../lead/forms/main-info-form";
import { NewLeadForm } from "@/app/(pages)/leads/components/new-lead-form";
import { PolicyInfoForm } from "../lead/forms/policy-info-form";
import { ShareForm } from "../lead/forms/share-form";
import { TransferForm } from "../lead/forms/transfer-form";
import { TodoContainer } from "./todo/container";

const ModalsContainer = () => {
  return (
    <>
      {/* USER MODELS */}
      <TodoContainer />
      <ChatContainer />
      <LoginStatusModal />
      <GroupMessageCard />

      {/* PHONE MODALS */}
      <MainInfoForm />
      <GeneralInfoForm />
      <PolicyInfoForm />
      <ShareForm />
      <TransferForm />
      <IntakeForm />
      <AssistantForm />

      {/* //LEAD MODALS */}
      {/* //TODO - i dont thin this belons here */}
      <NewLeadForm />
      {/* SCRIPT MODAL */}
      <ScriptForm />
    </>
  );
};

export default ModalsContainer;
