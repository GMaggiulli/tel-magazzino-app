
import { ItemProduct, WaitProductLoading, MsgNoProducts, ContainerProducts } from "@/app/components/products";
import { SearchQuery } from "@/app/components/search";
import { DatabaseAccess, IProduct } from "@/scripts/DatabaseAccess";
import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

// --------------------------------------------------------

export const ViewStore = (): JSX.Element =>
{
	const [queryString, changeQuery] = useState<string>('');
	const [isLoading, setLoading] = useState<boolean>(true);
	const [foundProducts, setProducts] = useState<IProduct[]>([]);

	const productsGrid = foundProducts
		.map(product => (<ItemProduct title={product.title} imgSrc={product.imgSrc} />));


	useEffect(() =>
		{
			const db = new DatabaseAccess();
	
			// finto caricamento / lag del database.
	
			let fakeTimeout: NodeJS.Timeout | null = null;
	
			const timeout = setTimeout(() =>
			{
	
				fakeTimeout = setTimeout(() =>
				{
					setProducts(db.findByName(queryString));
					setLoading(false);
				}, Math.random() * 500);
	
			}, 200);
	
			return () =>
			{
				clearTimeout(timeout);
	
				if (fakeTimeout)
				{
					clearTimeout(fakeTimeout);
				}
	
				setLoading(true);
			}
		}, [queryString]);


	return (<>
	<aside class="h-100 bg-body-secondary rounded p-2" style="min-width: 300px;" >
				<p class="fw-bold" style="font-size: 1.3em;" >Filtri</p>
			</aside>

			<main class="w-100 h-100 d-flex flex-column" >

				<div class="container w-100 py-2" >
					<SearchQuery name="string-query-products"
						value={queryString} onChange={changeQuery} />
				</div>

				{isLoading ? <WaitProductLoading />
					: productsGrid.length === 0
						? <MsgNoProducts />
						: <ContainerProducts children={productsGrid} />}
			</main>
	</>);
}


// --------------------------------------------------------
