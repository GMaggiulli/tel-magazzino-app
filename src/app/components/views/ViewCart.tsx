
import { CatalogueContent, ProfileContent } from "@/app/components/contexts";
import { ViewNeedAccess } from "@/app/components/views/ViewNeedAccess";
import { useContext, useLayoutEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime"

// --------------------------------------------------------

export interface IViewCartButtonProps
{
	onClick: () => void,
}

export const ViewCartButton = (props: IViewCartButtonProps): JSX.Element =>
{
	const { onClick } = props;

	return (
	<button class="btn btn-info d-flex flex-row gap-2 align-content-center justify-content-center"
		onClick={onClick} >
		<i class="bi bi-cart"></i>
		<span class="fs-6 fw-bold" >Carrello</span>
	</button>
	);
}


// --------------------------------------------------------

export const ViewCart = (): JSX.Element =>
{
	const { account } = useContext(ProfileContent)!;
	const { catalogue } = useContext(CatalogueContent)!;

	const [cart, updateCart] = useState<[string, number][]>([]);


	useLayoutEffect(() =>
	{
		account?.getCartList().then(async (product_ids) =>
		{
			const fullList: [string, number][] = [];

			for (const product_id of product_ids)
			{
				fullList.push([
					(await catalogue.getById(product_id)).name,
					await account.getCart(product_id)]);
			}

			updateCart(fullList);
		})
		.catch(err => console.error(err));
	}, [account]);


	if (!account)
	{
		return (<ViewNeedAccess />);
	}

	const showcase = cart.map(([name, amount]) =>
	{
		return (<div class="d-flex flex-row gap-3" >
			<p>{name}</p>
			<p>x {amount}</p>
		</div>);
	});

	return (
	<div class="container" >
		<p>Lista dei prodotti nel carrello:</p>
		<div class="d-flex flex-column" >
			{showcase}
		</div>
	</div>
	);
}


// --------------------------------------------------------
