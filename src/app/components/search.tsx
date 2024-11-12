
import type { JSX } from "preact/jsx-runtime";
import { useMemo } from "preact/hooks";


const SEARCH_STRINGS: string[] =
[
	"Cosa stai cercando?",
	"Come posso servirti?",
	"Scrivi il nome di un prodotto...",
	"Inserisci il tuo termine di ricerca.",
	"Cerca qui ciò che ti interessa.",
	"Scrivi per trovare ciò che cerchi.",
	"Cosa stai cercando oggi?",
	"Digita per esplorare.",
	"Cerca e scopri.",
	"Quale informazione desideri trovare?",
	"Che cosa vuoi trovare?",
];


export interface ISearchQueryProps
{
	name: string,
	value: string,
	onChange: (newvalue: string) => void,
	onUpdateSearch: () => void,
};


export const SearchQuery = (props: ISearchQueryProps): JSX.Element =>
{
	const { onChange, onUpdateSearch } = props;

	const randomString: string = useMemo(() =>
		SEARCH_STRINGS[Math.floor(SEARCH_STRINGS.length * Math.random())], [props.value.length === 0]);

	const isEmpty: boolean = props.value.trim().length === 0;

	return (
	<div class="d-flex flex-row" >
		<div class="input-group" >

			<div class="input-group-prepend input-group-text" >
				<i class="bi bi-search"></i>
			</div>

			<input class="form-control col"
				name={props.name} value={props.value}
				placeholder={randomString}
				type="text"
				onInput={ev => onChange((ev.target as HTMLInputElement).value)} />

		</div>

		<button class="btn btn-outline-primary p-0 mx-1"
			style="min-width: 48px;"
			disabled={isEmpty}
			onClick={() => onChange("")} >
			<i class="bi bi-x"></i>
		</button>
		
		<button class="btn btn-primary"
			style="min-width: 96px;"
			disabled={isEmpty}
			onClick={() => !isEmpty ? onUpdateSearch() : null} >
			<span>Cerca</span>
		</button>
	</div>
	);
}
