import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const server = async () => {
  try {
    const app = await buildApp();
    await app.listen({ host: "0.0.0.0", port: env.PORT });

    console.log("Http server is running");
  } catch (error) {
    console.error(error);
  }
};

server();
