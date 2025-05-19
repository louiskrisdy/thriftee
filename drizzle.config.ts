import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/migrations",
  schema: "./server/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
// export default {
//   out: "./server/migrations",
//   schema: "./server/schema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     connectionString: process.env.POSTGRES_URL!,
//   },
// } satisfies Config;