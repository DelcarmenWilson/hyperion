import { ScriptForm } from "@/app/(pages)/(main)/settings/(routes)/config/components/script/form";
import { AssistantForm } from "../lead/forms/assistant-form";
import { ChatContainer } from "@/components/chat/container";
import { GeneralInfoForm } from "../lead/forms/general-info-form";
import { GroupMessageCard } from "@/components/chat/group-message-card";
import { IntakeForm } from "../lead/forms/intake/intake-form";
import { LoginStatusModal } from "@/components/login-status/modal";
import { MainInfoForm } from "../lead/forms/main-info-form";
import { MiniMessageCard } from "../chat/mini-message-card";
import { NewLeadForm } from "@/app/(pages)/(main)/leads/components/new-lead-form";
import { PolicyInfoForm } from "../lead/forms/policy-info-form";
import { ShareForm } from "../lead/forms/share-form";
import { TransferForm } from "../lead/forms/transfer-form";
import { TodoContainer } from "./todo/container";
import { TodoNotification } from "./todo/notification";
import { AiGeneratorDialog } from "./ai-generator/ai-generator-dialog";
import NotificationDialog from "./notification-dialog";
import MultipleLeadsDialog from "../lead/multiple-leads-dialog";
import MultipleCallsDialog from "./multiple-calls-dialog";

const ModalsContainer = () => {
  return (
    <>
      {/* USER MODELS */}
      <TodoContainer />
      <ChatContainer />
      <LoginStatusModal />
      <GroupMessageCard />
      <MiniMessageCard />
      <TodoNotification />
      <NotificationDialog />

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
      <MultipleLeadsDialog />
      {/* SCRIPT MODAL */}
      <ScriptForm />
      {/* GLOABAL MODAL */}
      <AiGeneratorDialog />
      <MultipleCallsDialog />
    </>
  );
};

export default ModalsContainer;
