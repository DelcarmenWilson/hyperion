"use client";
import React, { ReactNode, useState } from "react";
import { useLead, useLeadIntakeActions } from "@/hooks/use-lead";

import {
  IntakeMedicalInfoSchemaType,
  IntakeOtherInfoSchemaType,
  IntakePersonalInfoSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Button } from "@/components/ui/button";

import { PersonalInfoForm } from "./personal-info-form";
import { DoctorInfoForm } from "./doctor-info-form";
import { BankInfoForm } from "./bank-info-form";
import { OtherInfoForm } from "./other-info-form";
import { PolicyInfoForm } from "../policy-info-form";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextGroup } from "@/components/reusable/text-group";

import { formatDate, formatDob } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";
import { USDollar } from "@/formulas/numbers";

import { MedicalInfoForm } from "./medical-info-form";
//TODO need to add all the form data and updates into the useLeadIntakeActions
export const IntakeForm = () => {
  const {
    isIntakeFormOpen,
    onIntakeFormClose,
    leadId,
    leadFullName,
    dialogType,
    isIntakeDialogOpen,
    onIntakeDialogOpen,
    onIntakeDialogClose,
  } = useLead();
  const { getIntakeData } = useLeadIntakeActions(leadId as string);
  const {
    personal,
    personalIsFectching,
    beneficiaries,
    beneficiariesIsFectching,
    doctor,
    doctorIsFectching,
    bank,
    bankIsFectching,
    other,
    otherIsFectching,
    policy,
    policyIsFectching,
    medical,
    medicalIsFectching,
  } = getIntakeData();

  if (!personal || !leadId) return null;
  return (
    <>
      <Dialog open={isIntakeDialogOpen} onOpenChange={onIntakeDialogClose}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h4 className="text-2xl font-semibold py-2 capitalize">
            {dialogType} Info -
            <span className="text-primary">{`${personal.firstName} ${personal.lastName}`}</span>
          </h4>
          {dialogType == "personal" && (
            <PersonalInfoForm
              info={personal as IntakePersonalInfoSchemaType}
              onClose={onIntakeDialogClose}
            />
          )}

          {dialogType == "doctor" && (
            <DoctorInfoForm
              leadId={leadId}
              info={doctor}
              onClose={onIntakeDialogClose}
            />
          )}

          {dialogType == "bank" && (
            <BankInfoForm
              leadId={leadId}
              info={bank}
              onClose={onIntakeDialogClose}
            />
          )}
          {dialogType == "other" && (
            <OtherInfoForm
              info={other as IntakeOtherInfoSchemaType}
              onClose={onIntakeDialogClose}
            />
          )}

          {dialogType == "policy" && (
            <PolicyInfoForm
              policyInfo={policy as LeadPolicySchemaType}
              onClose={onIntakeDialogClose}
            />
          )}
          {dialogType == "medical" && (
            <MedicalInfoForm
              leadId={leadId}
              info={medical as IntakeMedicalInfoSchemaType}
              onClose={onIntakeDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isIntakeFormOpen} onOpenChange={onIntakeFormClose}>
        <DialogContent className="flex flex-col justify-start h-full max-w-screen-lg">
          <h3 className="text-2xl font-semibold py-2">
            Intake Form - <span className="text-primary">{leadFullName}</span>
          </h3>
          <ScrollArea className="pe-2">
            {/* PERSONAL INFORMATION */}
            <SkeletonWrapper isLoading={personalIsFectching}>
              <SectionWrapper
                title="Personal Information"
                button={
                  <Button
                    size="sm"
                    onClick={() => onIntakeDialogOpen("personal")}
                  >
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-2 gap-2 border-b">
                  <div className="space-y-2">
                    <TextGroup label="First Name" value={personal.firstName} />
                    <TextGroup label="Last Name" value={personal.lastName} />
                    <TextGroup
                      label="Address"
                      value={`${personal.address} ${personal.city} ${personal.state} ${personal.zipCode}`}
                      className="col-span-2"
                    />
                    <TextGroup
                      label="Home Phone"
                      value={
                        personal.homePhone
                          ? formatPhoneNumber(personal.homePhone)
                          : ""
                      }
                    />
                    <TextGroup
                      label="Cell Phone"
                      value={
                        personal.cellPhone
                          ? formatPhoneNumber(personal.cellPhone)
                          : ""
                      }
                    />

                    <TextGroup
                      label="Marital Status"
                      value={personal.maritalStatus}
                    />
                    <TextGroup label="Email" value={personal.email} />
                    <TextGroup
                      label="Date of Birth"
                      value={formatDob(personal.dateOfBirth)}
                    />
                    <TextGroup
                      label="Place of Birth"
                      value={personal.placeOfBirth}
                    />
                    <TextGroup
                      label="Birth State"
                      value={personal.stateOfBirth}
                    />
                  </div>
                  <div className="space-y-2">
                    <TextGroup label="SSN" value={personal.ssn} />
                    <TextGroup
                      label="Driver's Lic"
                      value={personal.licenseNumber}
                    />
                    <TextGroup label="State" value={personal.licenseState} />
                    <TextGroup
                      label="Exp"
                      value={formatDate(personal.licenseExpires!, "MM-dd-yyyy")}
                    />
                    <Separator />
                    <TextGroup label="Employer" value={personal.employer} />
                    <TextGroup
                      label="Address"
                      value={personal.employerAddress}
                    />
                    <TextGroup
                      label="Phone"
                      value={
                        personal.employerPhone
                          ? formatPhoneNumber(personal.employerPhone)
                          : ""
                      }
                    />
                    <TextGroup label="Occupation" value={personal.occupation} />
                    <TextGroup label="Experience" value={personal.experience} />
                    <TextGroup
                      label="Annual Income"
                      value={USDollar.format(personal.annualIncome)}
                    />
                    <TextGroup
                      label="Net Worth"
                      value={USDollar.format(personal.netWorth)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {personal.citizenShip == "citizen" ? (
                    <TextGroup
                      label="Citizenship"
                      value={personal.citizenShip}
                    />
                  ) : (
                    <>
                      <TextGroup
                        label="Green Card#"
                        value={personal.greenCardNum}
                      />
                      <TextGroup
                        label="# of years in the US"
                        value={personal.yearsInUs.toString()}
                      />
                    </>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <TextGroup
                    label="Parents Living"
                    value={personal.parentLiving}
                  />
                  {personal.parentLiving == "yes" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <TextGroup
                        label="Age: Father"
                        value={personal.fatherAge.toString()}
                      />
                      <TextGroup
                        label="Mother"
                        value={personal.motherAge.toString()}
                      />
                    </div>
                  ) : (
                    <TextGroup
                      label="If no: Cause of Death"
                      value={personal.cuaseOfDeath}
                    />
                  )}
                </div>
                {/* <div className="grid grid-cols-2 gap-2">
              <TextGroup label="First Name" value={personal.firstName} />
              <TextGroup label="Last Name" value={personal.lastName} />
              <TextGroup
                label="Address"
                value={`${personal.address} ${personal.city} ${personal.state} ${personal.zipCode}`}
                className="col-span-2"
              />
              <TextGroup
                label="Home Phone"
                value={
                  personal.homePhone
                    ? formatPhoneNumber(personal.homePhone)
                    : ""
                }
              />
              <TextGroup
                label="Cell Phone"
                value={
                  personal.cellPhone
                    ? formatPhoneNumber(personal.cellPhone)
                    : ""
                }
              />

              <TextGroup
                label="Marital Status"
                value={personal.maritalStatus}
              />
              <TextGroup label="Email" value={personal.email} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <TextGroup
                label="Date of Birth"
                value={
                  personal.dateOfBirth
                    ? format(personal.dateOfBirth!, "MM-dd-yyyy")
                    : "N/A"
                }
              />
              <TextGroup label="Place of Birth" value={personal.placeOfBirth} />
              <TextGroup label="State" value={personal.stateOfBirth} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <TextGroup label="SSN" value={personal.ssn} />
              <TextGroup label="Driver's Lic" value={personal.licenseNumber} />
              <TextGroup label="State" value={personal.licenseNumber} />
              <TextGroup
                label="Exp"
                value={
                  personal.licenseExpires
                    ? format(personal.licenseExpires!, "MM-dd-yyyy")
                    : "N/A"
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextGroup
                label="Annual Income"
                value={personal.annualIncome.toString()}
              />
              <TextGroup label="Experience" value={personal.experience} />
              <TextGroup
                label="Net Worth"
                value={personal.netWorth.toString()}
              />
              <TextGroup
                className="col-span-2"
                label="Employer Name"
                value={personal.employer}
              />
              <TextGroup label="Phone" value={personal.employerPhone} />
              <TextGroup
                className="col-span-3"
                label="Adress"
                value={personal.employerAddress}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextGroup label="Occupation" value={personal.occupation} />
              <TextGroup label="Green Card#" value={personal.greenCardNum} />
              <TextGroup label="Citizenship" value={personal.citizenShip} />
              <TextGroup
                label="# of years in the US"
                value={personal.yearsInUs.toString()}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextGroup
                  label="Parents Living"
                  value={personal.parentLiving}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextGroup
                    label="Age: Father"
                    value={personal.fatherAge.toString()}
                  />
                  <TextGroup
                    label="Mother"
                    value={personal.motherAge.toString()}
                  />
                </div>
              </div>
              <TextGroup
                label="If no: Cause of Death"
                value={personal.cuaseOfDeath}
              />
            </div> */}
              </SectionWrapper>
            </SkeletonWrapper>

            {/* PRIMARY BENEFICIARIES AND  CONTINGENT BENEFICIARIES*/}
            {["Primary", "Contingent"].map((type, i) => (
              <SkeletonWrapper key={i} isLoading={beneficiariesIsFectching}>
                <SectionWrapper title={`${type} Beneficiaries`}>
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
                    <TableBody className="font-bold">
                      {beneficiaries
                        ?.filter((e) => e.type == type)
                        ?.map((bene) => (
                          <TableRow key={bene.id}>
                            <TableCell>{`${bene.firstName} ${bene.lastName}`}</TableCell>
                            <TableCell>{bene.share}</TableCell>
                            <TableCell>{bene.relationship}</TableCell>
                            <TableCell>{formatDob(bene.dateOfBirth)}</TableCell>
                            <TableCell>{bene.ssn}</TableCell>
                            <TableCell>
                              {bene.cellPhone
                                ? formatPhoneNumber(bene.cellPhone)
                                : ""}
                            </TableCell>
                            <TableCell>{bene.address}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </SectionWrapper>
              </SkeletonWrapper>
            ))}

            {/* OTHER INFORMATION*/}
            <SkeletonWrapper isLoading={otherIsFectching}>
              <SectionWrapper
                title="OTHER INFORMATION"
                button={
                  <Button size="sm" onClick={() => onIntakeDialogOpen("other")}>
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <TextGroup
                    label="Tobacco"
                    value={other?.smoker ? "Yes" : "No"}
                  />
                  <TextGroup
                    label="Number Years of Use:"
                    value={other?.yearsSmoking.toString()}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <TextGroup label="Height" value={other?.height} />
                  <TextGroup label="Weight This Year" value={other?.weight} />
                  <TextGroup
                    label="Weight Last Year"
                    value={other?.weightLastYear}
                  />
                </div>
                <TextGroup
                  label="Foreign countries visited in the last 2 years with dates
"
                  value={other?.foreignVisited}
                />
              </SectionWrapper>
            </SkeletonWrapper>

            {/* DOCTOR INFORMATION*/}
            <SkeletonWrapper isLoading={doctorIsFectching}>
              <SectionWrapper
                title="Doctor Information"
                button={
                  <Button
                    size="sm"
                    onClick={() => onIntakeDialogOpen("doctor")}
                  >
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-3 gap-2">
                  <TextGroup
                    className="col-span-2"
                    label="Doctor's Name"
                    value={doctor?.name}
                  />
                  <TextGroup
                    label="Phone"
                    value={doctor?.phone ? formatPhoneNumber(doctor.phone) : ""}
                  />
                  <TextGroup
                    className="col-span-3"
                    label="Address"
                    value={doctor?.address}
                  />
                  <TextGroup
                    className="col-span-2"
                    label="Last Date Visited"
                    value={formatDate(doctor?.lastVisit)}
                  />
                  <TextGroup
                    label="Reason for Visit"
                    value={doctor?.reasonForVisit}
                  />
                </div>
              </SectionWrapper>
            </SkeletonWrapper>

            {/* BANK INFORMATION*/}
            <SkeletonWrapper isLoading={bankIsFectching}>
              <SectionWrapper
                title="Bank Information"
                button={
                  <Button size="sm" onClick={() => onIntakeDialogOpen("bank")}>
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="gap-2">
                    <TextGroup label="Bank Name " value={bank?.name} />
                    <TextGroup label="Routing #" value={bank?.routing} />
                  </div>
                  <div>
                    By signing below, client agrees to have $_________________
                    drafted from their account on the designated draft date.
                  </div>
                  <TextGroup label="Account #" value={bank?.account} />
                  <TextGroup label="Signature" value={bank?.signature} />
                  <TextGroup
                    label="Draft Date:"
                    value={formatDate(bank?.draftDate)}
                  />
                  <TextGroup
                    label="Date"
                    value={formatDate(bank?.signedDate)}
                  />
                </div>
              </SectionWrapper>
            </SkeletonWrapper>

            {/* FOR PRODUCERS ONLY*/}
            <SkeletonWrapper isLoading={policyIsFectching}>
              <SectionWrapper
                title="For Producers Only"
                button={
                  <Button
                    size="sm"
                    onClick={() => onIntakeDialogOpen("policy")}
                  >
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <TextGroup label="Carrier" value={policy?.carrier} />
                  <TextGroup
                    label="Policy Number"
                    value={policy?.policyNumber}
                  />
                  <TextGroup label="Status" value={policy?.status} />
                  <TextGroup
                    label="Ap"
                    value={USDollar.format(parseInt(policy?.ap as string))}
                  />
                  <TextGroup
                    label="Commision"
                    value={USDollar.format(
                      parseInt(policy?.commision as string)
                    )}
                  />
                  <TextGroup
                    label="Coverage Amount"
                    value={USDollar.format(
                      parseInt(policy?.coverageAmount as string)
                    )}
                  />
                  <TextGroup
                    label="Start Date"
                    value={formatDate(policy?.startDate)}
                  />
                </div>
              </SectionWrapper>
            </SkeletonWrapper>
            {/*MEDICAL QUESTIONS*/}

            <SkeletonWrapper isLoading={medicalIsFectching}>
              <SectionWrapper
                title="MEDICAL QUESTIONS"
                button={
                  <Button
                    size="sm"
                    onClick={() => onIntakeDialogOpen("medical")}
                  >
                    Edit
                  </Button>
                }
              >
                <Question
                  label="1.Do you have any health issues or concerns you’re going through?
              Any medications, hospitalizations, surgeries, doctors’ visits?"
                  value={medical?.healthIssues as boolean}
                />

                <Question
                  label="2. Have you been prescribed any medication in the past year that
              you are not taking?"
                  value={medical?.prescription as boolean}
                />
                <Question
                  label="3. Any heart attacks, heart failures, strokes, TIA, or stints in
              the last five years?"
                  value={medical?.heartAttacks as boolean}
                />
                <Question
                  label=" 4. Are you on blood thinners? (Plavix or Warfarin) or heart
              medication (Nitrostat, Nitroglycerin, Eliquis)?"
                  value={medical?.bloodThinners as boolean}
                />
                <Question
                  label="5. Any cancer in the last five years? What kind? How long have you
              been in remission?"
                  value={medical?.cancer as boolean}
                />
                <Question
                  label="6. Any diabetes?"
                  value={medical?.diabetes as boolean}
                />
                <Question
                  label="7. Are you taking gabapentin?"
                  value={medical?.gabapentin as boolean}
                />
                <Question
                  label="8. Have you ever experienced any complications related to
              diabetes? (Diabetic Coma, Diabetic Neuropathy, Diabetic
              Retinopathy, Diabetic Nephropathy, Insulin Shock, Amputation)"
                  value={medical?.complications as boolean}
                />
                {/* <Question
              label="9. Would you happen to know the date that you were diagnosed with
              diabetes?"
              value={medical?.dateDisgnosed as boolean}/>
            <Question
              label="10. Would you happen to know your last A1C Reading? Is it less
              than 7?"
              value={medical?.a1cReading as boolean}/> */}
                <Question
                  label="11. Have you been diagnosed with AIDS, HIV, or ARC?"
                  value={medical?.aids as boolean}
                />
                <Question
                  label="12. Any high blood pressure? Are you taking lisinopril,
              metoprolol, or amlodipine?"
                  value={medical?.highBloodPressure as boolean}
                />
                <Question
                  label="13. Any lupus/RA/Asthma? Are you on any inhalers?"
                  value={medical?.asthma as boolean}
                />
                <Question
                  label="14. Any breathing complications or COPD? Are you on oxygen?"
                  value={medical?.copd as boolean}
                />
                <Question
                  label="15. Any anxiety or depression? Are you taking Prozac or Seroquel?"
                  value={medical?.anxiety as boolean}
                />
                <Question
                  label="16. Are you bipolar or schizophrenic? Are you taking Sertraline,
              Abilify, or dialysis?"
                  value={medical?.bipolar as boolean}
                />
                <Question
                  label="17. Any hospitalizations in the last year for 48 hours or more?"
                  value={medical?.hospitalizations as boolean}
                />
              </SectionWrapper>
            </SkeletonWrapper>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

type QuestionProps = {
  label: string;
  value: boolean;
};
const Question = ({ label, value }: QuestionProps) => {
  return (
    <div className="flex justify-between items-center">
      <p>{label}</p>
      <div className="flex gap-2 items-center">{value ? "Yes" : "No"}</div>
    </div>
  );
};

type SectionWrapperProps = {
  title: string;
  button?: ReactNode;
  children: ReactNode;
};

const SectionWrapper = ({ title, button, children }: SectionWrapperProps) => {
  return (
    <>
      <div className=" flex justify-between items-center gap-2 mb-1">
        <p className="text-muted-foreground uppercase">{title}</p>
        {button}
      </div>
      <div className="border space-y-2 text-sm mb-2 p-2 rounded-md">
        {children}
      </div>
    </>
  );
};
