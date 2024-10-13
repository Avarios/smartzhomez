
import { Cron } from "croner";
import { processLambdaData } from './lambdaProcessing.ts';


Cron("*/30 * * * * *", async () => {
  await processLambdaData();
  console.log("LAMBDA: Runs every 30 seks")
})