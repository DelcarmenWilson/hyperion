import cron from "node-cron";

const testJob = cron.schedule("* * * * *", () => {
  console.log("Cron job running every minute");
});

const bluePrintTargets = cron.schedule("0 0 * * 1", () => {
  console.log("Cron job running every 2minutes");
});

const bluePrintTargetsTest = cron.schedule("* * * * *", () => {
    console.log("blueprints targets :",new Date());
  });

export const runJobs = () => {
//   testJob.start();
  bluePrintTargets.start();
  bluePrintTargetsTest.start()
};
