
import type { JSX } from "preact/jsx-runtime";
import "@/app/styles/animations.css";
import { AppNavigationMenu } from "@/app/components/navigation";
import { ViewStore } from "@/app/components/views/ViewStore";


// --------------------------------------------------------

export const MainActivity = (): JSX.Element =>
{
	return (
	<div class="w-100 h-100 d-flex flex-column" >
		<header class="w-100 bg-body-secondary" style="min-height: 80px;" >
			<AppNavigationMenu />
		</header>

		<div class="container-fluid d-flex py-4" style="height: calc(100% - 80px);" >
			<ViewStore />
		</div>
	</div>
	);
}


// --------------------------------------------------------
