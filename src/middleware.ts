import { CommandHandler, User } from "./commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const fullUser = await getUser(readConfig().currentUserName);
    if (!fullUser) {
      throw new Error("no user logged in");
    }
    await handler(cmdName, fullUser, ...args);
  };
}
