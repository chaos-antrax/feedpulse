export const logger = {
  info(message: string) {
    console.info(`[FeedPulse] ${message}`);
  },
  error(message: string, error?: unknown) {
    console.error(`[FeedPulse] ${message}`, error);
  },
};
