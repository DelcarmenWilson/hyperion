import axios from "axios";
const BASE_URL = process.env.PRIVATE_SOCKET_URL || "https://app.hperioncrm.com";
export const sendSocketData = (userId: string, type: string, dt: any) => {
  axios.post(`${BASE_URL}/socket`, {
    userId,
    type,
    dt,
  });
};
