import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config()

const BASEURL=process.env.APP_URL||"https://hperioncrm.com"

const axiosCall=(type:string)=>{
  axios.post(`${BASEURL}/api/cron`,{type})
}

// const testJob = cron.schedule("* * * * *", () => {
//   console.log("Cron job running every minute",process.env.APP_URL);
// });

//Run every monday at 12AM - creates a new weekly blueprint
const bluePrintTargets = cron.schedule("0 0 * * 1", () => {
  axiosCall("createWeeklyBlueprint")
});

//Run everyday at 12am - gets a new randowm quote to display on the dashboard
const newQouteJob = cron.schedule("0 0 * * *", () => {  
  axiosCall("newQuote")
});

//Run every 30min
const halfHourJob = cron.schedule("30 * * * *", () => {
  //gets leads from facebook
  axiosCall("newLeads")
  //closed all the open scheduled appointments that were not fullfilled
  axiosCall("closeOpenAppointments")
  //hide deleted messages from chat
  axiosCall("hideDeletedMessages")
});


//Run everyminute - send todo reminders
const todoReminderJob = cron.schedule("* * * * *", () => {  
  axiosCall("todoReminder")
});
export const runJobs = () => {
  //  testJob.start();
  bluePrintTargets.start();
  newQouteJob.start()
  halfHourJob.start()
  todoReminderJob.start()
  
};
