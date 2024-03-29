export type TwilioNumber={
    friendlyName: string,
      phoneNumber: string,
      lata: string,
      locality: string,
      rateCenter: string,
      latitude: string,
      longitude: string,
      region: string,
      postalCode:string,
      isoCountry: string,
      addressRequirements: string,
      beta: boolean,
      capabilities: { voice: boolean, SMS: boolean, MMS: boolean }
      onPurchase?:(e:string)=>void
  }