
import type { JSX } from "preact";


// --------------------------------------------------------

export const ViewAccountButton = (): JSX.Element =>
{
	// nick non vuole la scritta... quindi è colpa sua! :P

	return (
	<button class="btn btn-info d-flex flex-column" >
		<i class="bi bi-person-circle"></i>
		{/* <span class="m-auto" style="font-size: 0.6em;" >Profilo</span> */}
	</button>
	);
}


// --------------------------------------------------------

export const AppNavigationMenu = (): JSX.Element =>
{
	// Interfaccia superiore con titolo e sezioni dell'applicazione.

	return (
	<div class="container h-100 py-2 d-flex flex-column" >
		<div class="d-flex flex-row" >
			<div >
				<h1 class="h1" style="font-family: 'Sour Gummy';" >Buytopia</h1>
			</div>
			<div class="py-2 d-flex flex-row" style="margin-left: auto;" >
				<ViewAccountButton />
			</div>
		</div>
	</div>
	);
}


// --------------------------------------------------------
