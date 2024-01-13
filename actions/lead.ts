import * as z from "zod";
import { db } from "@/lib/db";
import { LeadSchema } from "@/schemas";

export const leadUpdateById = async (values: z.infer<typeof LeadSchema>) => {

const {id}=values
const existingLead=await db.lead.findUnique({where:{id}})

  if(!existingLead){
    return {error:"Lead does not exist"}
  }
 
  const updateduser=await db.lead.update({
    where: { id:existingLead.id },
    data: {
        ...values
    //   address,
    //   city,
    //   state,
    //   zipCode,
    //   county,
    //   homePhone,
    //   cellPhone,
    //   gender,
    //   maritalStatus,
    //   email,
    //   updatedBy,
    },
  });
  

  return { success: "lead has been updated" };
};

export const leadInsert = async (values: z.infer<typeof LeadSchema>) => {
    const validatedFields = LeadSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      county,
      homePhone,
      cellPhone,
      gender,
      maritalStatus,
      email,
    } = validatedFields.data;
  
    await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        county,
        homePhone,
        cellPhone,
        gender: gender || "",
        maritalStatus: maritalStatus || "",
        email,
        //TODO need to get the current logged in user
        createdBy: "wilson",
      },
    });
  
    return { success: "Lead created!" };
  };
  
  export const leadsImport = async (values: z.infer<typeof LeadSchema>[]) => {
  
      for (let i = 0; i < values.length; i++) {
      const {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        county,
        homePhone,
        cellPhone,
        gender,
        maritalStatus,
        email,
        createdBy
      } = values[i];
  
      await db.lead.create({
        data: {
          firstName,
          lastName,
          address,
          city,
          state,
          zipCode,
          county,
          homePhone,
          cellPhone,
          gender: gender || "",
          maritalStatus: maritalStatus || "",
          email,
          createdBy,
        },
      });
    
        
    }
  
    // await db.lead.createMany(data)
    return { success: "Fields have been validated" };
  };
