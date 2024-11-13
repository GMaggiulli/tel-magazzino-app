
import { CatalogueContent, ProfileContent } from "@/app/components/contexts";
import { ItemProduct, WaitProductLoading, MsgNoProducts, ContainerProducts } from "@/app/components/products";
import { SearchQuery } from "@/app/components/search";
import { ViewNeedAccess } from "@/app/components/views/ViewNeedAccess";
import { CatalogueAccess, IDbProduct } from "@/scripts/CatalogueAccess";
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { useSessionStorage } from "usehooks-ts";

// --------------------------------------------------------

export interface IViewStoreButtonProps
{
	onClick: () => void,
}


export const ViewStoreButton = (props: IViewStoreButtonProps): JSX.Element =>
{
	const { onClick } = props;

	return (
	<button class="btn btn-info d-flex flex-row gap-2 align-content-center justify-content-center"
		onClick={onClick} >
		<i class="bi bi-shop"></i>
		<span class="fs-6 fw-bold" >Acquista</span>
	</button>
	);
}


// --------------------------------------------------------

export const ViewStoreSearch = (): JSX.Element =>
{
	const [queryString, changeQuery] = useSessionStorage('last-query', "");

	const [productslist, updateProducts]	= useState<IDbProduct[]>([]);
	const [working, setWorking]				= useState<boolean>(true);

	const { catalogue } = useContext(CatalogueContent)!;

	/**
	 * aggiorna la lista di prodotti visualizzati.
	 */
	const onQueryUpdate = (): void =>
	{
		setWorking(true);

		catalogue.searchProducts(queryString)
			.then(updateProducts)
			.catch((err) =>
			{
				console.error(err);
				updateProducts([]);
			})
			.finally(() => setWorking(false));
	}

	useLayoutEffect(() =>
	{
		setWorking(true);

		const keyTimeout = setTimeout(() => onQueryUpdate(),
			queryString.length > 0 ? 300 : 0);

		return () =>
		{
			clearTimeout(keyTimeout);
		}
	}, [queryString]);


	const productsGrid = productslist
		.map(product => (<ItemProduct product={product} />));

	return (<>
	<div class="container w-100 py-2" >
		<SearchQuery name="string-query-products"
			value={queryString}
			onChange={changeQuery}
			onUpdateSearch={onQueryUpdate} />
		{working
			? <p class="m-2" >Eseguendo la query...</p>
			: <p class="m-2" >Prodotti trovati: {productsGrid.length}</p>}
	</div>

	{working ? <WaitProductLoading />
		: productsGrid.length === 0
			? <MsgNoProducts />
			: <ContainerProducts children={productsGrid} />}
	</>);
}


// --------------------------------------------------------

export const ViewStore = (): JSX.Element =>
{
	const { account } = useContext(ProfileContent)!;

	if (!account)
	{
		return (<ViewNeedAccess />);
	}


	return (<>
		<main class="w-100 h-100 d-flex flex-column" >
			<ViewStoreSearch /> 
		</main>
	</>);
}


// --------------------------------------------------------
