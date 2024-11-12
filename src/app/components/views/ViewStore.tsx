
import { ItemProduct, WaitProductLoading, MsgNoProducts, ContainerProducts } from "@/app/components/products";
import { SearchQuery } from "@/app/components/search";
import { DatabaseAccess, IProduct } from "@/scripts/DatabaseAccess";
import { useEffect, useState } from "preact/hooks";
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
		<aside class="h-100 bg-body-secondary rounded p-2 d-flex flex-column" style="min-width: 300px;" >
			<p class="fw-bold fs-5 mx-2" >Filtri</p>
			<div class="w-100 h-100 d-flex flex-column overflow-y-auto gap-2" >

				{/* <div class="container border border-secondary rounded p-2" >
					<p class="fs-6 fw-bold m-2" >Gruppi</p>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="filter-bookmarks" />
						<label class="form-check-label user-select-none" for="filter-bookmarks">
							Preferiti
						</label>
					</div>
				</div> */}

				<div class="container border border-secondary rounded p-2" >
					<p class="fs-6 fw-bold m-2" >Dispositivi</p>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="filter-phones" />
						<label class="form-check-label user-select-none" for="filter-phones">Telefoni</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="filter-computers" />
						<label class="form-check-label user-select-none" for="filter-computers">Computer</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="filter-screens" />
						<label class="form-check-label user-select-none" for="filter-screens">Schermi</label>
					</div>
				</div>

			</div>
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
