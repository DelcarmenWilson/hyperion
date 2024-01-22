export function formatPhoneNumber(phoneNumberString:string) {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '').replace('+1','');
    if(cleaned.substring(0,1)=="1"){
        cleaned=cleaned.replace('1','')
    }
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  export const reFormatPhoneNumber = (str: string) => {
    let cleaned = ("" + str).replace(/\D/g, "").replace('+1','').replace('+','');

    if(cleaned.substring(0,1)=="1"){
      cleaned=cleaned.replace('1','')
  }
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  
    if (match) {
      let intlCode = "+1";
      return [
        intlCode,
        match[2],
        match[3],
        match[4],
      ].join("");
    }  
    return "";
  };