import { log } from "console";
import { readConfig, setUser } from "./config";
import { createUser, getUser, getUsers, resetDb } from "./lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;
export type CommandsRegistry = {
  [commandName: string]: CommandHandler;
};

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args || typeof args[0] !== "string") {
    throw new Error("enter valid command");
  }
  const user = await getUser(args[1]);
  if (!user.name) {
    throw new Error("user unknown...");
    process.exit(1);
  }
  setUser(args[1]);
  console.log(args[1]);
  console.log("user has been set seccessfuly.");
}
export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args[1]) {
    throw new Error("enter a username");
  }
  const name = args[1];
  const user = await getUser(name);
  if (user) {
    throw new Error("user already exists...");
  }
  await createUser(name);
  setUser(args[1]);
  console.log(`user ${name} created successfully.`);
}
export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}
export async function handlerReset(cmdName: string, ...args: string[]) {
  await resetDb();
}
export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  const config = readConfig();
  for (const user of users) {
    if (config.currentUserName === user.name) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${handler}`);
  }
  await handler(cmdName, ...args);
}
