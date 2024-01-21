import axios from "axios";
import twilio from "twilio"

let device;
let token:string;
// SETUP STEP 1:
// Browser client should be started after a user gesture
// to avoid errors in the browser console re: AudioContext

// SETUP STEP 2: Request an Access Token
export const startupClient = async () => {
  try {
    const response = await axios.get("api/voice");
    const data = response.data;
    token = data.token;
    intitializeDevice();
    return { success: data };
  } catch (err) {
    return { error: err };
  }
};

// SETUP STEP 3:
// Instantiate a new Twilio.Device
function intitializeDevice() {
  // logDiv.classList.remove("hide");
  // log("Initializing device");

//   device = new Twilio.Device(token, {
//     logLevel:1,
//     codecPreferences: ["opus", "pcmu"],
//   });

//   addDeviceListeners(device);
  // device.register();
}

// SETUP STEP 4:
// Listen for Twilio.Device states
function addDeviceListeners(device: any) {
  //     device.on("registered", function () {
  //       log("Twilio.Device Ready to make and receive calls!");
  //       callControlsDiv.classList.remove("hide");
  //     });
  //     device.on("error", function (error) {
  //       log("Twilio.Device Error: " + error.message);
  //     });
  //     device.on("incoming", handleIncomingCall);
  //     device.audio.on("deviceChange", updateAllAudioDevices.bind(device));
  //     // Show audio selection UI if it is supported by the browser.
  //     if (device.audio.isOutputSelectionSupported) {
  //       audioSelectionDiv.classList.remove("hide");
  //     }
}
