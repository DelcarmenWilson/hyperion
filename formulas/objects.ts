export const formatObject = (object: FormData) => {
  var obj: any = {};
  object.forEach((value, key) => {
    key =
      key.replace('"', "").replaceAll(" ", "").charAt(0).toLowerCase() +
      key.slice(1);
    obj[key] = value;
  });
  return obj;
};

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
