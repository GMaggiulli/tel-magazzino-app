
import type { JSX } from "preact/jsx-runtime";
import 'bootstrap/'


export interface IProductGridProps
{
	title: string,
	imgSrc: string,
};


export const ProductGrid = (props: IProductGridProps): JSX.Element =>
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
