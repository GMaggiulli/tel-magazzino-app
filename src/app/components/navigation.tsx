
import type { JSX } from "preact";

// --------------------------------------------------------

export interface IAppNavigationMenuProps
{
	navButtons: any,
	onClickHome: () => void,
}


export const AppNavigationMenu = (props: IAppNavigationMenuProps): JSX.Element =>
{
	// Interfaccia superiore con titolo e sezioni dell'applicazione.

	const { onClickHome } = props;

	return (
	<div class="container h-100 py-2 d-flex flex-column" >
		<div class="d-flex flex-row" >
			<div >
				<a href="#" class="h1 user-select-none" style="font-family: 'Sour Gummy'; text-decoration: none;" onClick={onClickHome} >Buytopia</a>
			</div>
			<div class="py-2 d-flex flex-row gap-2" style="margin-left: auto;" children={props.navButtons} />
		</div>
	</div>
	);
}


// --------------------------------------------------------
