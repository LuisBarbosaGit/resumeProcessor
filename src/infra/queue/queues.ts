import { Queue } from "bullmq";
import { queueConnection } from "./connection.js";

export const resumeQueue = new Queue("resume-processing", {
  connection: queueConnection,
});
