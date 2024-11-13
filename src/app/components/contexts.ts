import type { AccountManager } from "@/scripts/AccountsManager";
import { createContext } from "preact";

export type TAccountOrNone = AccountManager | null;

export type TChangeAccountCallback = (account: TAccountOrNone) => void;


export const UserAccess = createContext<{
	account: TAccountOrNone,
	changeAccount: TChangeAccountCallback
} | null>(null);
