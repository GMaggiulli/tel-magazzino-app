import type { AccountManager } from "@/scripts/AccountsManager";
import { CatalogueAccess } from "@/scripts/CatalogueAccess";
import { createContext } from "preact";


export const ProfileContent = createContext<{
	account: AccountManager | null,
	changeAccount: (account: FakeAccountManager | null) => void,
	showAccessPage: () => void,
} | null>(null);


export const CatalogueContent = createContext<{
	catalogue: CatalogueAccess,
} | null>(null);
