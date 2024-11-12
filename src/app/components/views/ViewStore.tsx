
import { ItemProduct, WaitProductLoading, MsgNoProducts, ContainerProducts } from "@/app/components/products";
import { SearchQuery } from "@/app/components/search";
import { DatabaseAccess, IProduct } from "@/scripts/DatabaseAccess";
import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { useSessionStorage } from "usehooks-ts";

// --------------------------------------------------------

export const ViewStore = (): JSX.Element =>
{
	const [queryString, changeQuery] = useSessionStorage('last-query', "");
	const [isLoading, setLoading] = useState<boolean>(true);
	const [foundProducts, setProducts] = useState<IProduct[]>([]);

	const productsGrid = foundProducts
		.map(product => (<ItemProduct title={product.title} imgSrc={product.imgSrc} />));


	const updateQuery = (): NodeJS.Timeout =>
	{
		const db = new DatabaseAccess();

		setLoading(true);

		return setTimeout(() =>
		{
			setProducts(db.findByName(queryString));
			setLoading(false);
		}, Math.random() * 500);
	}


	useEffect(() =>
	{
		// finto caricamento / lag del database.

		let fakeTimeout: null | NodeJS.Timeout = null;

		// evitiamo di inviare una richiesta per ogni carattere scritto.
		// piccolo delay per rimuovere flickering.
		const keyTimeout = setTimeout(() =>
		{		// hack! delay ridotto a 0 se la query è vuota.
			fakeTimeout = updateQuery();
		}, queryString.length > 0 ? 300 : 0);

		return () =>
		{
			clearTimeout(keyTimeout);

			if (fakeTimeout)
			{
				clearTimeout(fakeTimeout);
			}
		}
	}, [queryString]);


	return (<>
		<aside class="h-100 bg-body-secondary rounded p-2" style="min-width: 300px;" >
			<p class="fw-bold" style="font-size: 1.3em;" >Filtri</p>
		</aside>

		<main class="w-100 h-100 d-flex flex-column" >

			<div class="container w-100 py-2" >
				<SearchQuery name="string-query-products"
					value={queryString}
					onChange={changeQuery}
					onUpdateSearch={updateQuery} />
			</div>

			{isLoading ? <WaitProductLoading />
				: productsGrid.length === 0
					? <MsgNoProducts />
					: <ContainerProducts children={productsGrid} />}
		</main>
	</>);
}


// --------------------------------------------------------
