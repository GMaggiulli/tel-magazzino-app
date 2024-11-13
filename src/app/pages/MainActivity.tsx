
import type { JSX } from "preact/jsx-runtime";
import "@/app/styles/animations.css";
import { AppNavigationMenu } from "@/app/components/navigation";
import { ViewStore, ViewStoreButton } from "@/app/components/views/ViewStore";
import { ViewAccess, ViewAccountButton } from "@/app/components/views/ViewAccess";
import { useLayoutEffect, useMemo, useState } from "preact/hooks";
import { AccountManager } from "@/scripts/AccountsManager";
import { ProfileContent, CatalogueContent } from "@/app/components/contexts";
import { ViewCart, ViewCartButton } from "@/app/components/views/ViewCart";
import { CatalogueAccess } from "@/scripts/CatalogueAccess";


const ARRAY_VIEWS: (() => JSX.Element)[] =
[
	() => (<ViewStore />),
	() => (<ViewCart />),
	() => (<ViewAccess />),
];


// --------------------------------------------------------

export const MainActivity = (): JSX.Element =>
{
	const [currView, setView]	= useState<number>(0);
	const [account, setAccount]	= useState<AccountManager | null>(null);

	useLayoutEffect(() =>
	{		// tenta ri recuperare un accesso precedente.
		AccountManager.tryConnection()
			.then(async () => setAccount(await AccountManager.fromStorage(sessionStorage)))
			.catch(err => console.error(err));
	}, []);

	const catalogue = useMemo<CatalogueAccess>(() => new CatalogueAccess(), []);


	return (
	<ProfileContent.Provider value={{
		account: account, changeAccount: setAccount,
		showAccessPage: () => setView(2)
	}} >
		<div class="w-100 h-100 d-flex flex-column" >
			<header class="w-100 bg-body-secondary" style="min-height: 80px;" >
				<AppNavigationMenu
					onClickHome={() => setView(0)}
					navButtons={[
						(<ViewStoreButton onClick={() => setView(0)} />),
						(<ViewCartButton onClick={() => setView(1)} />),
						(<ViewAccountButton onClick={() => setView(2)} />)
				]} />
			</header>

			<CatalogueContent.Provider value={{
				catalogue: catalogue
			}} >
				<div class="container-fluid d-flex py-4 align-items-center justify-content-center" style="height: calc(100% - 80px);"
					children={ARRAY_VIEWS[currView]()} />
			</CatalogueContent.Provider>
		</div>
	</ProfileContent.Provider>
	);
}


// --------------------------------------------------------
