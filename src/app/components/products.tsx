
import { useMemo } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";


const RANDOM_LOADING_HINT: string[] =
[
	"Caricamento, sii paziente!",
	"Stiamo cercando il tuo prodotto.",
	"Cercando tra gli scaffali.",
	"Spolverando il magazzino...",
];


// --------------------------------------------------------

export const WaitProductLoading = (): JSX.Element =>
{
	const randomString = useMemo(() =>
		RANDOM_LOADING_HINT[Math.floor(RANDOM_LOADING_HINT.length * Math.random())], []);

	return (<div class="w-100 h-100 d-flex flex-column align-items-center" >
		<div class="spinner-border my-4" role="status" />
		<span>{randomString}</span>
	</div>);
}


// --------------------------------------------------------

export const MsgNoProducts = (): JSX.Element =>
{
	// interfaccia mostrata quando non sono stati trovati prodotti con
	// la ricerca corrente.

	return (
	<div class="w-100 px-2" >
		<div class="alert alert-danger fade-in" role="alert">
			<span>Nessun prodotto trovato!</span>
		</div>
	</div>
	);
}


// --------------------------------------------------------

export interface IContainerProducts extends JSX.ElementChildrenAttribute
{}


export const ContainerProducts = (props: IContainerProducts): JSX.Element =>
{
	// mostra la lista dei proddotti già filtrata.

	return (
		<div class="w-100 h-100 overflow-y-scroll" >
			<div class="px-2 d-grid gap-2" style="height: fit-content; grid-template-columns: repeat( auto-fit, minmax(260px, 1fr) );" children={props.children} />
		</div>
	);
}


// --------------------------------------------------------

export interface IProductGridProps
{
	title: string,
	imgSrc: string,
};


export const ItemProduct = (props: IProductGridProps): JSX.Element =>
{

	return (
	<div class="card" >
		<div class="card-img-top d-flex justify-content-center">
			<img height={150} src={props.imgSrc} />
		</div>
		<div class="card-body">
			<p class="card-title">{props.title}</p>
			<p class="card-text">Descrizione</p>
			<button class="btn btn-primary">
				<i class="bi bi-bag"></i>
				<span class="m-1" >Scopri</span>
			</button>
		</div>
	</div>
	);
}


// --------------------------------------------------------
