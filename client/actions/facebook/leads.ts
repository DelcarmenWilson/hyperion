"use server";
import { db } from "@/lib/db";
import { LeadSchemaType } from "@/schemas/lead";
import { generateTextCode } from "@/formulas/phone";
import { states } from "@/constants/states";
import { Amm_Leads_Import } from "@/formulas/lead";
import { Ad } from "@/lib/facebook/config";
import { sendSocketData } from "@/services/socket-service";

//ACTIONS
const campaignLeadsImport = async (
  adId: string,
  userId: string,
  values: LeadSchemaType[]
) => {
  let duplicates = 0;

  const ad = await db.campaignAd.findUnique({ where: { id: adId } });
  if (!ad) return { error: "Ad does not exisst.!" };

  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: userId, status: { not: "Deactive" } },
  });

  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  for (let i = 0; i < values.length; i++) {
    const {
      adId,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone,
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
      weight,
      height,
      income,
      policyAmount,
      smoker,
      currentlyInsured,
      currentInsuranse,
      type,
      vendor,
      status,
      recievedAt,
      notes,
    } = values[i];

    const st = states.find(
      (e) =>
        e.state.toLowerCase() == state.toLowerCase() ||
        e.abv.toLowerCase() == state.toLowerCase()
    );
    const phoneNumber = phoneNumbers.find((e) => e.state == state);
    const existingLead = await db.lead.findUnique({ where: { cellPhone } });
    if (existingLead) {
      duplicates++;
      await db.lead.update({
        where: { id: existingLead.id },
        data: {
          adId,
        },
      });
    } else {
      ///Gnerate a new Text code
      let code = generateTextCode(firstName, lastName, cellPhone);

      //If the textcode already exist in the db generate a new text code with the first 4 digitis of the phone number
      const exisitingCode = await db.lead.findFirst({
        where: { textCode: code },
      });
      if (exisitingCode)
        code = generateTextCode(firstName, lastName, cellPhone, true);

      await db.lead.create({
        data: {
          adId,
          firstName,
          lastName,
          address,
          city,
          state: st?.abv ? st.abv : state,
          zipCode,
          homePhone,
          cellPhone,
          gender,
          maritalStatus,
          email,
          dateOfBirth,
          weight,
          height,
          income,
          policyAmount,
          smoker,
          currentlyInsured,
          currentInsuranse,
          type,
          vendor,
          recievedAt:
            Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
          defaultNumber: phoneNumber
            ? phoneNumber.phone
            : defaultNumber?.phone!,
          userId,
          status,
          notes,
          textCode: code,
        },
      });
    }
  }

  const leadCount = values.length - duplicates;
  await db.campaignAd.update({
    where: { id: ad.id },
    data: {
      lead_count: ad.lead_count + leadCount,
    },
  });
  return {
    success: leadCount,
  };
};

export const getLeadsToImport = async (
  adid: string,
  userid: string,
  params: any
) => {
  const fields = ["id", "ad_id", "created_time", "field_data"];

  const formattedLeads: any = [];

  const formatLead = (lead: any) => {
    const { ad_id, created_time, field_data, id } = lead;
    const leadData: { [key: string]: string } = {};
    field_data.forEach((data: any) => {
      leadData[data.name] = data.values[0];
    });
    formattedLeads.push({ ad_id, created_time, field_data, id, ...leadData });
  };
  const ad = new Ad(adid);
  let leads = await ad.getLeads(fields, params);

  leads.forEach(formatLead);
  while (leads.hasNext()) {
    leads = await leads.next();
    leads.forEach(formatLead);
  }

  const leadsToImport = Amm_Leads_Import(formattedLeads);
  const importedLeads = await campaignLeadsImport(adid, userid, leadsToImport);
  return importedLeads;
};
//SCHEDULE
export const scheduleLeadsToImport = async () => {
  const currentDate = new Date();
  const filterDate = new Date(currentDate);
  filterDate.setMinutes(filterDate.getMinutes() - 35);

  const params: any = {
    filtering: [
      {
        field: "time_created",
        operator: "GREATER_THAN",
        value: filterDate.getTime() / 1000,
      },
    ],
  };
  const ads = await db.campaignAd.findMany({
    where: { status: "Active" },
    select: {
      id: true,
      adset: {
        select: { campaign: { select: { user_id: true } } },
      },
    },
  });
  if (ads.length == 0) return { error: "All ads are paused" };
  const summary: { userId: string; count: number }[] = [];

  for (const ad of ads) {
    const leads = await getLeadsToImport(
      ad.id,
      ad.adset.campaign.user_id,
      params
    );

    if (leads.success) {
      summary.push({ userId: ad.adset.campaign.user_id, count: leads.success });
    }
  }

  for (const sm of summary) {
    await sendSocketData(sm.userId, "leads:new", sm.count);
  }

  return {
    success: "Leads retrieved succesfully",
  };
};
