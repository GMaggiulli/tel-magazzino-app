
import type { JSX } from "preact/jsx-runtime";
import "@/app/styles/animations.css";
import { AppNavigationMenu } from "@/app/components/navigation";
import { ViewStore, ViewStoreButton } from "@/app/components/views/ViewStore";
import { ViewAccess, ViewAccountButton } from "@/app/components/views/ViewAccess";
import { useLayoutEffect, useState } from "preact/hooks";
import { AccountManager } from "@/scripts/AccountsManager";
import { UserAccess } from "@/app/components/contexts";


const ARRAY_VIEWS: (() => JSX.Element)[] =
[
	() => (<ViewStore />),
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


	return (
	<UserAccess.Provider value={{
		account: account, changeAccount: setAccount
	}} >
		<div class="w-100 h-100 d-flex flex-column" >
			<header class="w-100 bg-body-secondary" style="min-height: 80px;" >
				<AppNavigationMenu
					onClickHome={() => setView(0)}
					navButtons={[
						(<ViewStoreButton
							onClick={() => setView(0)} />),
						(<ViewAccountButton
							onClick={() => setView(1)} />)
				]} />
			</header>

			<div class="container-fluid d-flex py-4 align-items-center justify-content-center" style="height: calc(100% - 80px);"
				children={ARRAY_VIEWS[currView]()} />
		</div>
	</UserAccess.Provider>
	);
}


// --------------------------------------------------------
