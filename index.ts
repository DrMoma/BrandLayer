/**
 * Higgsfield Seedance 2.5 text-to-video example.
 *
 * Run with: npm run generate:video
 *
 * Requires HF_CREDENTIALS=<key-id>:<key-secret> in .env.local (gitignored).
 * Credentials stay server-side: they are read from the environment at runtime
 * and never logged.
 */
import { config as configureHiggsfield, higgsfield } from "@higgsfield/client/v2";
import { config as loadEnvFile } from "dotenv";

loadEnvFile({ path: ".env.local" });

const MODEL = "bytedance/seedance-2.5/text-to-video";

/** Terminal states that are not a success, mapped to something readable. */
const FAILURE_REASONS: Record<string, string> = {
  failed: "generation failed",
  nsfw: "blocked by content moderation",
  canceled: "the request was canceled",
  cancelled: "the request was canceled",
};

async function main(): Promise<void> {
  const credentials = process.env.HF_CREDENTIALS;
  if (!credentials) {
    throw new Error(
      "HF_CREDENTIALS is not set. Add HF_CREDENTIALS=<key-id>:<key-secret> to .env.local",
    );
  }

  configureHiggsfield({
    credentials,
    // Video takes longer than the SDK's 5-minute default polling window.
    maxPollTime: 15 * 60 * 1000,
  });

  console.log(`Submitting ${MODEL} ...`);

  const result = await higgsfield.subscribe(MODEL, {
    input: {
      prompt: "A cinematic scene at sunset",
      duration: 5,
      resolution: "720p",
      aspect_ratio: "16:9",
    },
    withPolling: true,
  });

  // subscribe() resolves on any terminal status, including failures,
  // so success has to be checked explicitly rather than assumed.
  const status: string = result.status;
  if (status !== "completed") {
    const reason = FAILURE_REASONS[status] ?? `unexpected status "${status}"`;
    throw new Error(`Request ${result.request_id}: ${reason}.`);
  }

  const videoUrl = result.video?.url;
  if (!videoUrl) {
    throw new Error(`Request ${result.request_id} completed without a video URL.`);
  }

  console.log(`Video URL: ${videoUrl}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
