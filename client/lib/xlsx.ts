import { formatDate } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";
import { Lead } from "@prisma/client";
import xlsx, { IJsonSheet } from "json-as-xlsx";
import { jsPDF } from "jspdf";
export const exportLeads = (fileType: string, leads: Lead[],fileName?:string) => {
  switch (fileType.toLowerCase()) {
    case "excel":
      exportLeadsToExcel(leads,fileName);
      break;
    default:
      exportLeadsToPdf(leads,fileName);
      break;
  }
};
function exportLeadsToExcel(leads: Lead[],fileName?:string) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Leads",
      columns: [
        { label: "Lead Id", value: "id" },
        { label: "First Name", value: "firstName" },
        { label: "Last Name", value: "lastName" },
        { label: "Address", value: "address" },
        { label: "City", value: "city" },
        { label: "State", value: "state" },
        { label: "Zip Code", value: "zipCode" },
        { label: "Home Phone", value: "homePhone" },
        { label: "Cell Phone", value: "cellPhone" },
        { label: "Gender", value: "gender" },
        { label: "Marital Status", value: "maritalStatus" },
        { label: "Email", value: "email" },
        { label: "DateOfBirth", value: "dateOfBirth" },
        { label: "Weight", value: "weight" },
        { label: "Height", value: "height" },
        { label: "Income", value: "income" },
        { label: "Policy Amount", value: "policyAmount" },
        { label: "Smoker", value: "smoker" },
        { label: "Currently Insured", value: "currentlyInsured" },
        { label: "Current Insuranse", value: "currentInsuranse" },
        { label: "Vendor", value: "vendor" },
        { label: "Type", value: "type" },
        { label: "Status", value: "status" },
        { label: "Quote", value: "quote" },
        { label: "Ap", value: "ap" },
        //THESE NEXT THREE COLUMNS WILL BE REMOVED
        { label: "Commision", value: "commisionOld" },
        { label: "Coverage Amount", value: "coverageAmountOld" },
        { label: "DefaultNumber", value: "defaultNumberOld" },
        { label: "Notes", value: "notes" },
        { label: "Recieved Date", value: "recievedAt" },
        { label: "Created Date", value: "createdAt" },
        { label: "Updated Date", value: "updatedAt" },
      ],
      content: leads,
    },
  ];
  let settings = {
    fileName: `Hyperion Lead ${fileName?` - ${fileName}`:"s"}`,
  };
  xlsx(columns, settings);
}
function exportLeadsToPdf(leads: Lead[],fileName?:string) {
  const doc = new jsPDF();
  doc.deletePage(1);
  leads.forEach((lead) => {
    const page = doc.addPage();
    page
      .setFontSize(25)
      .setFont("Arial", undefined, "bold")
      .text(`Hyperion Lead - ${lead.firstName} ${lead.lastName}`, 10, 10);

    page
      .setFontSize(18)
      .setFont("Arial", undefined, "normal")
      .text(
        [
          `Lead Id: ${lead.id}`,
          `First Name: ${lead.firstName}`,
          `Last Name: ${lead.lastName}`,
          `Address: ${lead.address}`,
          `City: ${lead.city}`,
          `State: ${lead.state}`,
          `Zip Code: ${lead.zipCode}`,
          `Home Phone: ${formatPhoneNumber(lead.homePhone!)}`,
          `Cell Phone: ${formatPhoneNumber(lead.cellPhone!)}`,
          `Gender: ${lead.gender}`,
          `Marital Status: ${lead.maritalStatus}`,
          `Email: ${lead.email}`,
          `DateOfBirth: ${lead.dateOfBirth}`,
          `Weight: ${lead.weight}`,
          `Height: ${lead.height}`,
          `Income: ${lead.income}`,
          `Policy Amount: ${lead.policyAmount}`,
          `Smoker: ${lead.smoker}`,
          `Currently Insured: ${lead.currentlyInsured}`,
          `Current Insuranse: ${lead.currentInsuranse}`,
          `Vendor: ${lead.vendor}`,
          `Type: ${lead.type}`,
          `Status: ${lead.status}`,
          `Quote: ${lead.quote}`,
          //THESE NEXT THREE COLUMNS WILL BE REMOVED
          `Ap: ${lead.apOld}`,
          `Commision: ${lead.commisionOld}`,
          `CoverageAmount: ${lead.coverageAmountOld}`,
          //   `DefaultNumber: ${lead.defaultNumber}`,
          `Notes: ${lead.notes}`,
          `Recieved Date: ${formatDate(lead.recievedAt)}`,
          `Created Date: ${formatDate(lead.createdAt)}`,
          `Updated Date: ${formatDate(lead.updatedAt)}`,
        ],
        10,
        20,
        { lineHeightFactor: 1.25 }
      );
  });
  doc.save(`Hyperion Lead ${fileName?` - ${fileName}`:"s"}.pdf`);
}
