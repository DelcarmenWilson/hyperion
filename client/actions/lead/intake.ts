"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import {
  IntakePersonalSchemaType,
  IntakePersonalSchema,
  IntakeDoctorInfoSchemaType,
  IntakeDoctorInfoSchema,
  IntakeBankInfoSchemaType,
  IntakeBankInfoSchema,
  IntakeOtherInfoSchema,
  IntakeOtherInfoSchemaType,
  IntakeMedicalInfoSchemaType,
  IntakeMedicalInfoSchema,
  IntakePersonalMainSchemaType,
  IntakeGeneralSchemaType,
  IntakeGeneralSchema,
  IntakeEmploymentSchema,
  IntakeMiscSchemaType,
  IntakeMiscSchema,
  IntakeEmploymentSchemaType,
} from "@/schemas/lead";

//LEAD

//DATA
export const leadGetByIdIntakePersonalInfo = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        homePhone: true,
        cellPhone: true,
        email: true,
        maritalStatus: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        dateOfBirth: true,
        placeOfBirth: true,
        stateOfBirth: true,
        ssn: true,
        licenseNumber: true,
        licenseState: true,
        licenseExpires: true,
        annualIncome: true,
        experience: true,
        netWorth: true,
        employer: true,
        employerAddress: true,
        employerPhone: true,
        occupation: true,
        greenCardNum: true,
        citizenShip: true,
        yearsInUs: true,
        parentLiving: true,
        fatherAge: true,
        motherAge: true,
        cuaseOfDeath: true,
      },
    });
    // const lead = await db.lead.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    return lead as IntakePersonalMainSchemaType;
  } catch {
    return null;
  }
};
export const leadGetByIdIntakeDoctorInfo = async (leadId: string) => {
  try {
    const leadDoctor = await db.leadDoctor.findUnique({
      where: {
        leadId,
      },
    });
    return leadDoctor ;
  } catch {
    return null;
  }
};
export const leadGetByIdIntakeOtherInfo = async (id: string) => {
  try {
    const leadOther = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        weight: true,
        weightLastYear: true,
        height: true,
        smoker: true,
        yearsSmoking: true,
        foreignVisited: true,
      },
    });
    return leadOther as IntakeOtherInfoSchemaType;
  } catch {
    return null;
  }
};
export const leadGetByIdIntakeMedicalInfo = async (leadId: string) => {
  try {
    const leadMedical = await db.leadMedicalQuestions.findUnique({
      where: {
        leadId,
      },
    });
    return leadMedical as IntakeMedicalInfoSchemaType;
  } catch {
    return null;
  }
};
export const leadGetByIdIntakeBankInfo = async (leadId: string) => {
  try {
    const leadBank = await db.leadBank.findUnique({
      where: {
        leadId,
      },
    });
    return leadBank;
  } catch {
    return null;
  }
};

export const leadGetByIdIntakePolicyInfo = async (leadId: string) => {
  try {
    const leadPolicy = await db.leadPolicy.findUnique({
      where: {
        leadId,
      },
      include:{carrier:true}
    });
    return leadPolicy;
  } catch {
    return null;
  }
};
//ACTIONS
export const leadUpdateByIdIntakeGeneral = async (
  values: IntakeGeneralSchemaType
) => {  
  const user = await currentUser();
  if (!user?.id || !user?.email) 
    return { error: "Unauthenticated" };  

  const validatedFields = IntakeGeneralSchema.safeParse(values);
  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  
  const {
    id,
    firstName,
    lastName,
    homePhone,
    cellPhone,
    email,
    maritalStatus,
    address,
    city,
    state,
    zipCode,
    dateOfBirth,
    placeOfBirth,
    stateOfBirth,
  } = validatedFields.data;

  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) 
    return { error: "Lead does not exist" };
  
  if (user.id != existingLead.userId) 
    return { error: "Unauthorized" };

  await db.lead.update({
    where: { id },
    data: {
      firstName,
      lastName,
      homePhone,
      cellPhone,
      email,
      maritalStatus,
      address,
      city,
      state,
      zipCode,
      dateOfBirth,
      placeOfBirth,
      stateOfBirth,
    },
  });

  return { success: "lead general information updated" };
};
export const leadUpdateByIdIntakePersonal = async (
  values: IntakePersonalSchemaType
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) 
    return { error: "Unauthenticated" };
  
  const validatedFields = IntakePersonalSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    ssn,
    licenseNumber,
    licenseState,
    licenseExpires,
  } = validatedFields.data;
  
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) 
    return { error: "Lead does not exist" };  

  if (user.id != existingLead.userId) 
    return { error: "Unauthorized" };  

  await db.lead.update({
    where: { id },
    data: {
      ssn,
      licenseNumber,
      licenseState,
      licenseExpires,
    },
  });

  return { success: "lead personal information updated" };
};
export const leadUpdateByIdIntakeEmployment = async (
  values: IntakeEmploymentSchemaType
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) 
    return { error: "Unauthenticated" };
  
  const validatedFields = IntakeEmploymentSchema.safeParse(values);
  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  
  const {
    id,
    annualIncome,
    experience,
    netWorth,
    employer,
    employerAddress,
    employerPhone,
    occupation,
  } = validatedFields.data;

  
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) 
    return { error: "Lead does not exist" };  

  if (user.id != existingLead.userId) 
    return { error: "Unauthorized" };
  
  await db.lead.update({
    where: { id },
    data: {
      annualIncome,
      experience,
      netWorth,
      employer,
      employerAddress,
      employerPhone,
      occupation,
    },
  });

  return { success: "lead personal information updated" };
};
export const leadUpdateByIdIntakeMisc = async (
  values: IntakeMiscSchemaType
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) 
    return { error: "Unauthenticated" };
  
  const validatedFields = IntakeMiscSchema.safeParse(values);
  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  
  const {
    id,
    greenCardNum,
    citizenShip,
    yearsInUs,
    parentLiving,
    fatherAge,
    motherAge,
    cuaseOfDeath,
  } = validatedFields.data;

  
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) 
    return { error: "Lead does not exist" };  

  if (user.id != existingLead.userId) 
    return { error: "Unauthorized" };
  
  await db.lead.update({
    where: { id },
    data: {
      greenCardNum,
      citizenShip,
      yearsInUs,
      parentLiving,
      fatherAge,
      motherAge,
      cuaseOfDeath,
    },
  });

  return { success: "lead personal information updated" };
};

export const leadInsertIntakeDoctorInfo = async (
  values: IntakeDoctorInfoSchemaType
) => {
  const validatedFields = IntakeDoctorInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, name, address, lastVisit, phone, reasonForVisit } =
    validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadDoctor.findUnique({ where: { leadId } });

  if (existingLead) {
    return { error: "Lead already exist!!" };
  }

  await db.leadDoctor.create({
    data: {
      leadId,
      name,
      address,
      lastVisit,
      phone,
      reasonForVisit,
    },
  });

  return { success: "lead doctor information created" };
};
export const leadInsertIntakeMedicalInfo = async (
  values: IntakeMedicalInfoSchemaType
) => {
  const validatedFields = IntakeMedicalInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    leadId,
    healthIssues,
    prescription,
    heartAttacks,
    bloodThinners,
    cancer,
    gabapentin,
    diabetes,
    complications,
    dateDisgnosed,
    a1cReading,
    aids,
    highBloodPressure,
    asthma,
    copd,
    anxiety,
    bipolar,
    hospitalizations,
  } = validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadMedicalQuestions.findUnique({
    where: { leadId },
  });

  if (existingLead) {
    return { error: "Lead already exist!!" };
  }

  await db.leadMedicalQuestions.create({
    data: {
      leadId,
      healthIssues,
      prescription,
      heartAttacks,
      bloodThinners,
      cancer,
      gabapentin,
      diabetes,
      complications,
      dateDisgnosed,
      a1cReading,
      aids,
      highBloodPressure,
      asthma,
      copd,
      anxiety,
      bipolar,
      hospitalizations,
    },
  });

  return { success: "lead medical questions created" };
};
export const leadUpdateByIdIntakeDoctorInfo = async (
  values: IntakeDoctorInfoSchemaType
) => {
  const validatedFields = IntakeDoctorInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, name, address, lastVisit, phone, reasonForVisit } =
    validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadDoctor.findUnique({ where: { leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.leadDoctor.update({
    where: { leadId },
    data: {
      name,
      address,
      lastVisit,
      phone,
      reasonForVisit,
    },
  });

  return { success: "lead doctor information updated" };
};
export const leadInsertIntakeBankInfo = async (
  values: IntakeBankInfoSchemaType
) => {
  const validatedFields = IntakeBankInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, name, routing, account, draftDate, signature, signedDate } =
    validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadBank.findUnique({ where: { leadId } });

  if (existingLead) {
    return { error: "Bank information already exist!!" };
  }

  await db.leadBank.create({
    data: {
      leadId,
      name,
      routing,
      account,
      draftDate,
      signature,
      signedDate,
    },
  });

  return { success: "lead bank information created" };
};
export const leadUpdateByIdIntakeBankInfo = async (
  values: IntakeBankInfoSchemaType
) => {
  const validatedFields = IntakeBankInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, name, routing, account, draftDate, signature, signedDate } =
    validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadBank.findUnique({ where: { leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.leadBank.update({
    where: { leadId },
    data: {
      name,
      routing,
      account,
      draftDate,
      signature,
      signedDate,
    },
  });

  return { success: "lead banking information updated" };
};

export const leadUpdateByIdIntakeOtherInfo = async (
  values: IntakeOtherInfoSchemaType
) => {
  const validatedFields = IntakeOtherInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    weight,
    weightLastYear,
    height,
    smoker,
    yearsSmoking,
    foreignVisited,
  } = validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id },
    data: {
      weight,
      weightLastYear,
      height,
      smoker,
      yearsSmoking,
      foreignVisited,
    },
  });

  return { success: "lead other information updated" };
};
export const leadUpdateByIdIntakeMedicalInfo = async (
  values: IntakeMedicalInfoSchemaType
) => {
  const validatedFields = IntakeMedicalInfoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    leadId,
    healthIssues,
    prescription,
    heartAttacks,
    bloodThinners,
    cancer,
    gabapentin,
    diabetes,
    complications,
    dateDisgnosed,
    a1cReading,
    aids,
    highBloodPressure,
    asthma,
    copd,
    anxiety,
    bipolar,
    hospitalizations,
  } = validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.leadMedicalQuestions.findUnique({
    where: { leadId },
  });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.leadMedicalQuestions.update({
    where: { leadId },
    data: {
      healthIssues,
      prescription,
      heartAttacks,
      bloodThinners,
      cancer,
      gabapentin,
      diabetes,
      complications,
      dateDisgnosed,
      a1cReading,
      aids,
      highBloodPressure,
      asthma,
      copd,
      anxiety,
      bipolar,
      hospitalizations,
    },
  });

  return { success: "lead medical questions updated" };
};
