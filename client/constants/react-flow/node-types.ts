
import { PaymentCountry } from "@/components/react-flow/payment-country";
import { PaymentInit } from "@/components/react-flow/payment-init";
import { PaymentProvider } from "@/components/react-flow/payment-provider";
import { CustomEdge } from "@/components/react-flow/custom-edge";
import TriggerComponent from "@/components/react-flow/trigger-component";

export const NODE_TYPES = {
    paymentInit: PaymentInit,
    paymentCountry: PaymentCountry,
    paymentProvider: PaymentProvider,
    trigger:TriggerComponent
  };

 export const EDGE_TYPES = {
    customEdge: CustomEdge,
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