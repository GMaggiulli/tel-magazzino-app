

import { ProfileContent } from "@/app/components/contexts";
import { useContext } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

// --------------------------------------------------------

export const ViewNeedAccess = (): JSX.Element =>
{
	const { showAccessPage } = useContext(ProfileContent)!;

	return (
	<div class="container h-50" >
		<p class="mx-auto" style="width: fit-content;" >Devi registrarti!</p>
		<button class="btn btn-primary" style="width: 96px;" onClick={showAccessPage} >Accedi</button>
	</div>
	);
}


// --------------------------------------------------------
