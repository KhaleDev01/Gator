import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const dbConnenct = readConfig();
export default defineConfig({
  schema: "src/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: dbConnenct.dbUrl,
  },
});
