
import { PaymentCountry } from "@/components/workflow/test/payment-country";
import { PaymentInit } from "@/components/workflow/test/payment-init";
import { PaymentProvider } from "@/components/workflow/test/payment-provider";
import TriggerComponent from "@/components/workflow/triggers/component";
import ActionComponent from "@/components/workflow/actions/component";
import { CustomBezier,CustomSmoothStep,CustomStraight,CustomStep } from "@/components/workflow/edge/custom";

export const NODE_TYPES = {
    paymentInit: PaymentInit,
    paymentCountry: PaymentCountry,
    paymentProvider: PaymentProvider,
    trigger:TriggerComponent,
    action:ActionComponent

  };

 export const EDGE_TYPES = {
  customBezier: CustomBezier,
  customStraight:CustomStraight,
  customStep:CustomStep,
  customSmoothStep:CustomSmoothStep
  };

  export const PAYMENT_PROVIDER_IMAGE_MAP: { [code: string]: string } = {
    St: "/assets/react-flow/stripe.svg",
    Ap: "/assets/react-flow/apple.svg",
    Gp: "/assets/react-flow/google.svg",
    Pp: "/assets/react-flow/paypa.svg",
    Am: "/assets/react-flow/amazon.png",
  };

  export const PAYMENT_PROVIDERS = [
    { code: "St", name: "Stripe" },
    { code: "Gp", name: "Google Pay" },
    { code: "Ap", name: "Apple Pay" },
    { code: "Pp", name: "Paypal" },
    { code: "Am", name: "Amazon Pay" },
  ];