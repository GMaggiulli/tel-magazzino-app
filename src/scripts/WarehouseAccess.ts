

export interface IDbProduct
{
	product_id: number,
	name: string,
	description: string,
	category_id: number,
	url_image: string,
	avaiable: boolean,
	create_at: Date,
	updated_at: Date,
	deleted_at: Date | null,
}


const FOLDER_IMAGES: string = "images/";

const FAKE_PRODUCTS_DATABASE: IDbProduct[] = [];

const fakeDatabaseRaw = localStorage.getItem('__products');

if (!fakeDatabaseRaw)
{
	const FAKE_NAMES: string[] =
	[
		"Motorola G",
		"Motorola A",
		"Motorola B",
		"Samsung A",
		"Samsung S",
		"Samsung Fold ",
		"Apple IPhone ",
	];


	const FAKE_DESCRIPTION: string[] =
	[
		"Il telefono ideale per chi cerca un dispositivo semplice e accessibile. Dotato di funzionalità basiche come chiamate, SMS e navigazione web.",
		"Il telefono perfetto per gli appassionati di giochi. Dotato di un processore potente, una batteria lunga durata e una grafica di alta qualità.",
		"Il telefono ideale per gli amanti della fotografia. Dotato di una fotocamera di alta qualità con funzionalità avanzate come zoom ottico e stabilizzazione dell'immagine.",
		"Il telefono perfetto per gli imprenditori e i professionisti. Dotato di funzionalità avanzate come email, calendario e accesso a documenti cloud.",
		"Il telefono ideale per chi cerca un dispositivo resistente e duraturo. Dotato di una costruzione robusta e funzionalità come resistenza all'acqua e alla polvere.",
	]


	for (let i = 0; i < 100; ++i)
	{
		FAKE_PRODUCTS_DATABASE.push({
			product_id: i,
			avaiable: Math.random() > 0.5,
			category_id: 0,
			create_at: new Date(Date.now() - 5_000),
			deleted_at: null,
			name: `${FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]}${i + 1 + Math.floor(Math.random() * 20)}`,
			description: FAKE_DESCRIPTION[Math.floor(Math.random() * FAKE_DESCRIPTION.length)],
			updated_at: new Date(),
			url_image: `IMG00${Math.floor(1 + (Math.random() * 8))}.jpg`,
		});
	}

	localStorage.setItem('__products', JSON.stringify(FAKE_PRODUCTS_DATABASE));
}
else
{
	FAKE_PRODUCTS_DATABASE.push(...JSON.parse(fakeDatabaseRaw)!);
}


export class CatalogueAccess
{

	public async searchProducts (
		search: string
	): Promise<IDbProduct[]>
	{
		await new Promise(res => setTimeout(res, Math.random() * 1_000));
		
		let storage = FAKE_PRODUCTS_DATABASE;

		if (search.length !== 0)
		{
			search = search
				.trim().toLowerCase();

			if (search.length < 3)
			{
				throw new Error('Ricerca troppo corta!');
			}
			else if (search.length > 100)
			{
				throw new Error('Ricerca troppo lunga!');
			}

			storage = storage
				.filter(output => output.name.trim().toLowerCase().startsWith(search));
		}

		return storage
			.filter(product => product.deleted_at === null)
			.map(product => ({ ...product, url_image: `${FOLDER_IMAGES}${product.url_image}` }));
	}

}
