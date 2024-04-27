"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FullLeadNoConvo } from "@/types";
type IntakeFormProps = {
  lead: FullLeadNoConvo;
};
export const IntakeForm = ({ lead }: IntakeFormProps) => {
  return (
    <div className="h-full overflow-y-auto">
      {/* PERSONAL INFORMATION */}
      <p className="text-muted-foreground">Personal Information</p>
      <div className="border space-y-2 text-sm mb-2">
        <div className="grid grid-cols-2 gap-2">
          <TextGroup label="First Name" value={lead.firstName} />
          <TextGroup label="Last Name" value={lead.lastName} />
          <TextGroup
            label="Address"
            value={lead.address}
            className="col-span-2"
          />
          <TextGroup label="Home Phone" value={lead.homePhone} />
          <TextGroup label="Cell Phone" value={lead.cellPhone} />

          <TextGroup label="Marital Status" value={lead.maritalStatus} />
          <TextGroup label="Email" value={lead.email} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <TextGroup
            label="Date of Birth"
            value={format(lead.dateOfBirth!, "MM-dd-yyyy")}
          />
          <TextGroup label="Place of Birth" value="NEED TO FILL" />
          <TextGroup label="State" value="NEED TO FILL" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <TextGroup label="SSN" value="NEED TO FILL" />
          <TextGroup label="Driver's Lic" value="NEED TO FILL" />
          <TextGroup label="State" value="NEED TO FILL" />
          <TextGroup label="Exp" value="NEED TO FILL" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TextGroup label="Annual Income" value="NEED TO FILL" />
          <TextGroup label="Experience" value="NEED TO FILL" />
          <TextGroup label="Net Worth" value="NEED TO FILL" />
          <TextGroup
            className="col-span-2"
            label="Employer Name"
            value="NEED TO FILL"
          />
          <TextGroup label="Phone" value="NEED TO FILL" />
          <TextGroup
            className="col-span-3"
            label="Adress"
            value="NEED TO FILL"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TextGroup label="Occupation" value="NEED TO FILL" />
          <TextGroup label="Green Card#" value="NEED TO FILL" />
          <TextGroup label="Citizenship" value="NEED TO FILL" />
          <TextGroup label="# of years in the US" value="NEED TO FILL" />
          <div className="grid grid-cols-2 gap-2">
            <TextGroup label="Parents Living" value="NEED TO FILL" />
            <div className="grid grid-cols-2 gap-2">
              <TextGroup label="Age: Father" value="NTF" />
              <TextGroup label="Mother" value="NTF" />
            </div>
          </div>
          <TextGroup label="If no: Cause of Death" value="NEED TO FILL" />
        </div>
      </div>
      {/* PRIMARY BENEFICIARIES*/}
      <p className="text-muted-foreground">Primary Beneficiaries</p>
      <div className="border space-y-2 text-sm mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>% Share</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>SSN</TableHead>
              <TableHead>Cell</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lead.beneficiaries
              ?.filter((e) => e.type == "Primary")
              ?.map((bene) => (
                <TableRow key={bene.id}>
                  <TableCell className="font-medium">{`${bene.firstName} ${bene.lastName}`}</TableCell>
                  <TableCell>{bene.share}</TableCell>
                  <TableCell>{bene.relationship}</TableCell>
                  <TableCell>{bene.dateOfBirth}</TableCell>
                  <TableCell>{bene.ssn}</TableCell>
                  <TableCell>{bene.cellPhone}</TableCell>
                  <TableCell>{bene.address}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {/* CONTINGENT BENEFICIARIES*/}
      <p className="text-muted-foreground">Contingent Beneficiaries</p>
      <div className="border space-y-2 text-sm mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>% Share</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>SSN</TableHead>
              <TableHead>Cell</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lead.beneficiaries
              ?.filter((e) => e.type == "Contingent")
              ?.map((bene) => (
                <TableRow key={bene.id}>
                  <TableCell className="font-medium">{`${bene.firstName} ${bene.lastName}`}</TableCell>
                  <TableCell>{bene.share}</TableCell>
                  <TableCell>{bene.relationship}</TableCell>
                  <TableCell>{bene.dateOfBirth}</TableCell>
                  <TableCell>{bene.ssn}</TableCell>
                  <TableCell>{bene.cellPhone}</TableCell>
                  <TableCell>{bene.address}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* OTHER INFORMATION*/}
      <p className="text-muted-foreground">OTHER INFORMATION</p>
      <div className="border space-y-2 text-sm mb-2">
        <div className="grid grid-cols-2 gap-2">
          <TextGroup label="Tobacco" value={lead.smoker ? "YES" : "NO"} />
          <TextGroup label="Number Years of Use:" value="NEED TO FILL" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TextGroup label="Height" value={lead.height} />
          <TextGroup label="Weight this year" value={lead.weight} />
          <TextGroup label="Weight Last Year" value="NEED TO FILL" />
        </div>
        <TextGroup
          label="Foreign countries visited in the last 2 years with dates
"
          value="NEED TO FILL"
        />
      </div>
      {/* DOCTOR INFORMATION*/}
      <p className="text-muted-foreground">Doctor Information</p>
      <div className="border space-y-2 text-sm mb-2">
        <div className="grid grid-cols-3 gap-2">
          <TextGroup
            className="col-span-2"
            label="Doctor's Name"
            value="NEED TO FILL"
          />
          <TextGroup label="Phone" value="NEED TO FILL" />
          <TextGroup
            className="col-span-3"
            label="Address"
            value="NEED TO FILL"
          />
          <TextGroup
            className="col-span-2"
            label="Last Date Visited"
            value="NEED TO FILL"
          />
          <TextGroup label="Reason for Visit" value="NEED TO FILL" />
        </div>
      </div>
      {/* BANK INFORMATION*/}
      <p className="text-muted-foreground">Bank Information</p>
      <div className="border space-y-2 text-sm mb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="gap-2">
            <TextGroup label="Bank Name " value="NEED TO FILL" />
            <TextGroup label="Routing #" value="NEED TO FILL" />
          </div>
          <div>
            By signing below, client agrees to have $_________________ drafted
            from their account on the designated draft date.
          </div>
          <TextGroup label="Account #" value="NEED TO FILL" />
          <TextGroup label="Signature" value="NEED TO FILL" />
          <TextGroup label="Draft Date:" value="NEED TO FILL" />
          <TextGroup label="Date" value="NEED TO FILL" />
        </div>
      </div>
      {/* FOR PRODUCERS ONLY*/}
      <p className="text-muted-foreground">For Producers Only</p>
      <div className="border space-y-2 text-sm mb-2">
        <div className="grid grid-cols-2 gap-2">
          <TextGroup label="Life Insurance Plan" value="NEED TO FILL" />
          <TextGroup label="Premium" value="NEED TO FILL" />
          <TextGroup label="Face Amount" value="NEED TO FILL" />
          <TextGroup label="Term Rider Amount" value="NEED TO FILL" />
          <TextGroup label="LTC Amount" value="NEED TO FILL" />
          <TextGroup label="Rating" value="NEED TO FILL" />
        </div>
      </div>
      {/*MEDICAL QUESTIONS*/}
      <p className="text-muted-foreground">MEDICAL QUESTIONS</p>
      <div className="border space-y-2 text-sm mb-2">
        <p>
          1.Do you have any health issues or concerns you’re going through? Any
          medications, hospitalizations, surgeries, doctors’ visits? YES NO
        </p>
        <p>
          2. Have you been prescribed any medication in the past year that you
          are not taking? YES NO
        </p>
        <p>
          3. Any heart attacks, heart failures, strokes, TIA, or stints in the
          last five years? YES NO
        </p>
        <p>
          4. Are you on blood thinners? (Plavix or Warfarin) or heart medication
          (Nitrostat, Nitroglycerin, Eliquis)? YES NO
        </p>
        <p>
          5. Any cancer in the last five years? What kind? How long have you
          been in remission?YES NO
        </p>
        <p>6. Any diabetes? YES NO</p>
        <p>7. Are you taking gabapentin? YES NO</p>
        <p>
          8. Have you ever experienced any complications related to diabetes?
          (Diabetic Coma, Diabetic Neuropathy, Diabetic Retinopathy, Diabetic
          Nephropathy, Insulin Shock, Amputation) YES NO
        </p>
        <p>
          9. Would you happen to know the date that you were diagnosed with
          diabetes?
        </p>
        <p>
          10. Would you happen to know your last A1C Reading? Is it less than 7?
        </p>
        <p>11. Have you been diagnosed with AIDS, HIV, or ARC? YES NO</p>
        <p>
          12. Any high blood pressure? Are you taking lisinopril, metoprolol, or
          amlodipine? YES NO
        </p>
        <p>13. Any lupus/RA/Asthma? Are you on any inhalers? YES NO</p>
        <p>
          14. Any breathing complications or COPD? Are you on oxygen? YES NO
        </p>
        <p>
          15. Any anxiety or depression? Are you taking Prozac or Seroquel? YES
          NO
        </p>
        <p>
          16. Are you bipolar or schizophrenic? Are you taking Sertraline,
          Abilify, or dialysis? YES NO
        </p>
        <p>
          17. Any hospitalizations in the last year for 48 hours or more? YES NO
        </p>
      </div>
    </div>
  );
};

type TextGroupProps = {
  label: string;
  value: string | null;
  className?: string;
};
const TextGroup = ({ label, value, className }: TextGroupProps) => {
  return (
    <div className={cn("w-full", className)}>
      <span>{label}: </span>
      <span className="font-bold">{value}</span>
    </div>
  );
};
