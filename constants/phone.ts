import { ItemProps } from "@/types/item";

export const PhoneLegendItems: ItemProps[] = [
  {
    title: "Active",
    text: "can send and recieve calls and texts.",
  },
  {
    title: "Inactive",
    text: "can recieve calls and texts, but will not be used for outbound calls and texts.",
  },
  {
    title: "Default",
    text: "if you do not have a phone number in a particular state, we will choose this phone number for calls and texts.",
  },
  {
    title: "Special Number",
    text: "this phone number will be used for all outbound calls made to leads that have never sent you a text message. The first time a lead texts you, the phone number used fot that lead will then be updated",
  },
  {
    title: "Used for live transfers",
    text: "this phone number is assigned to one of you leas venderors for live transfer. You must unlink this phone number from your lead vendor if you want to delete it from you account.",
  },
];

export const PhonePurchaseItems: ItemProps[] = [
  { text: "Does local id work automatically?" },
  {
    text: "Can I get multilple numbers in the same state for the area code matching?",
  },
  { text: "Can I change the caller ID number for a lead anytime?" },
  { text: "Can I get multilple numbers in states all over the country?" },
  { text: "Can I monitor the spam rate and deliverability of my numbers?" },
  {
    text: "If I dont have a number in a particular state, will my default number be used?",
  },
  { text: "Can I dedicate 1 number for calling and the rest for texting?" },
];

export const PhoneAgents: ItemProps[] = [
  {
    title: "Wilson",
    text: "6589584123",
  },
  {
    title: "Victoria",
    text: "7873096122",
  },
  {
    title: "Saundra",
    text: "3652548894",
  },
  {
    title: "Johnni",
    text: "2547845615",
  },
];