
import { UserAccess } from "@/app/components/contexts";
import { useContext, useLayoutEffect, useMemo, useState } from "preact/hooks";
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
	<div class="w-100 px-2 my-2 px-4" >
		<div class="alert alert-danger fade-in" role="alert">
			<span class="user-select-none" >Nessun prodotto trovato!</span>
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
		<div class="w-100 h-100 overflow-y-scroll px-4" >
			<div class="px-2 d-grid gap-2" style="height: fit-content; grid-template-columns: repeat(auto-fit, 260px);" children={props.children} />
		</div>
	);
}


// --------------------------------------------------------

export interface IFavoriteButtonProps
{
	productId: number,
}

export const FavoriteButton = (props: IFavoriteButtonProps): JSX.Element | null =>
{
	const { account } = useContext(UserAccess)!;

	const [isFavUi, setFavUi]	= useState<boolean>(false);
	const [isFav, setFav]		= useState<boolean>(false);

	useLayoutEffect(() =>
	{		// recupera se preferito da account.
		if (!account)
		{
			return;
		}

		account.isFavourite(props.productId)
			.then(setFav)
			.catch(err => console.error(err));
	}, [account]);

	// assicura che ui è sincronizzato con il vero valore.
	useLayoutEffect(() => setFavUi(isFav), [isFav]);


	const onClick = (): void =>
	{
		if (!account)
		{
			return;
		}

		const value = !isFavUi;

		setFavUi(value);

		const failed = (err: any): void =>
		{
			console.error(err);
			setFavUi(isFav);
		}

		if (value)
		{
			account.addFavorite(props.productId)
				.then(() => setFav(value))
				.catch(failed);
		}
		else
		{
			account.removeFavourite(props.productId)
				.then(() => setFav(value))
				.catch(failed);
		}
	}

	if (!account)
	{		// no pulsante se nessun account.
		return null;
	}

	return (
	<button class="btn btn-outline-primary" onClick={onClick} >
		{isFavUi
			? <i class="bi bi-star-fill"></i>
			: <i class="bi bi-star"></i>}
	</button>
	);
}


export interface IProductGridProps
{
	productId: number,
	title: string,
	imgSrc: string,
};

export const ItemProduct = (props: IProductGridProps): JSX.Element =>
{
	return (
	<div class="card" >
		<div class="card-img-top d-flex justify-content-center py-2">
			<img class="user-select-none" height={150} src={props.imgSrc} />
		</div>
		<div class="card-body">
			<p class="card-title">{props.title}</p>
			<p class="card-text">Descrizione</p>
			<div class="px-2 d-flex flex-row gap-1" >
				<button class="btn btn-primary">
					<i class="bi bi-bag"></i>
					<span class="m-1" >Scopri</span>
				</button>
				<FavoriteButton productId={props.productId} />
			</div>
		</div>
	</div>
	);
}


// --------------------------------------------------------
