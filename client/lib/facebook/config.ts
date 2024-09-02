import * as sdk from "facebook-nodejs-business-sdk";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config({ path: ".env.example" });
}

type config = {
  accountId: string;
  apiToken: string;
  appId: string;
  appToken:string;
  pageId:string
  appSecret: string;
};

export const fbCfg: config = {
  accountId: process.env.FACEBOOK_ACCOUNT_ID!,
  apiToken: process.env.FACEBOOK_API_TOKEN!,
  appId: process.env.FACEBOOK_APP_ID!,
  appToken:process.env.FACEBOOK_APP_TOKEN!,
  pageId:process.env.FACEBOOK_PAGE_ID!,
  appSecret: process.env.FACEBOOK_APP_SECRET!,
};

sdk.FacebookAdsApi.init(fbCfg.apiToken);
//sdk.FacebookAdsApi.init(`${fbCfg.appId}|${fbCfg.appSecret}`);

export const initFbApi=(token:string)=>{
  sdk.FacebookAdsApi.init(token);
}

export const AdAccount = sdk.AdAccount;
export const account = new AdAccount(`act_${fbCfg.accountId}`);
export const Page = sdk.Page;
export const page = new Page(`${fbCfg.pageId}`);

export const Campaign = sdk.Campaign;
export const AdSet = sdk.AdSet;
export const Ad = sdk.Ad;
export const Lead = sdk.Lead;





