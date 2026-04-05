import { createApp } from "./app";
import { connectToDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectToDatabase();

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error: unknown) => {
  logger.error("Failed to start the backend.", error);
  process.exit(1);
});
