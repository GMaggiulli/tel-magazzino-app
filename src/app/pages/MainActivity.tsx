
import type { JSX } from "preact/jsx-runtime";
import styles from "@/app/pages/MainActivity.module.css";
import { SearchQuery } from "@/app/components/SearchQuery";
import { useMemo, useState } from "preact/hooks";
import { ProductGrid } from "@/app/components/ProductGrid";
import { DatabaseAccess } from "@/scripts/DatabaseAccess";
import "@/app/styles/animations.css";


// --------------------------------------------------------


const ViewEmptyQueryWarning = (): JSX.Element =>
{
	return (
	<div class="alert alert-danger fade-in" role="alert">
		<span>Nessun prodotto trovato!</span>
	</div>
	);
}


export const MainActivity = (): JSX.Element =>
{
	const [queryString, changeQuery] = useState<string>('');

	const db = useMemo(() => new DatabaseAccess(), []);

	const products = db.findByName(queryString)
		.map(product => (<ProductGrid title={product.title} imgSrc={product.imgSrc} />));

	return (
	<div class="w-100 h-100" >
		<div class="container h-100" >

			<div class="row" style="height: 128px;" >
				<header class="col py-3" >
					<h1 style="margin: 0px auto 9px 28px; width: fit-content; font-family: 'Sour Gummy';" >Buytopia</h1>

					<SearchQuery name="string-query-products"
						value={queryString} onChange={changeQuery} />
				</header>
			</div>

			<div class="row" style="height: 300px;" >
				<div class="col d-flex flex-column" style="overflow-y: scroll; height: 300px;" >
					<div style="display: flex; gap: 9px; height: 500px;" children={products} />
				</div>

				<aside class="col p-0" style="max-width: 240px;" >
					{products.length === 0 ? <ViewEmptyQueryWarning /> : null}
				</aside>
			</div>

		</div>
	</div>
	);
}


// --------------------------------------------------------
