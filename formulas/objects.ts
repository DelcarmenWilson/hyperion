export const formatObject=((object:FormData)=>{
    var obj: any = {};
    object.forEach((value,key)=>{
        key = key.replace('"', "").charAt(0).toLowerCase() + key.slice(1);
        obj[key] = value;
    })
    return obj;
})