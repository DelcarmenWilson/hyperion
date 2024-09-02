import {
    
    Campaign,
    CampaignAd,
    CampaignAdset,
    CampaignCreative
  } from "@prisma/client";

 
  type FullAdset=CampaignAdset &{
    ads?:CampaignAd[]
  }
  export type FullCampaign = Campaign & {
   adsets?:FullAdset[]
  };

  export type FullAd=CampaignAd &{
    creative?:CampaignCreative|null
  }
  

  
 
  

  
  