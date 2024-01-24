import axios from "axios";
import { Device } from "twilio-client";

let token: string;

export const startupClient = async () => {
  try {
    const response = await axios.get("/api/token");
    const data = response.data;
    token = data.token;
    const device = new Device(data.token, {
      logLevel: 1,
    });
    return device;
  } catch (err) {
    console.log(err);
    return null;
  }
};
