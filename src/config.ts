import os from "node:os";
import fs from "node:fs";
import path from "node:path";
export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(name: string) {
  const filePath = getFullPath();
  const config = readConfig();
  config.currentUserName = name;
  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(filePath, data, { encoding: "utf-8" });
}

export function readConfig(): Config {
  const fullPath = getFullPath();
  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

function validateConfig(rawData: any) {
  if (!rawData.db_url || typeof rawData.db_url !== "string") {
    throw new Error("db_url is required in config file.");
  }
  if (
    !rawData.current_user_name ||
    typeof rawData.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file.");
  }
  const config: Config = {
    dbUrl: rawData.db_url,
    currentUserName: rawData.current_user_name,
  };
  return config;
}
function getFullPath() {
  const configFileName = ".gatorconfig.json";
  return path.join(os.homedir(), configFileName);
}
