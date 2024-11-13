

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

for (let i = 0; i < 200; i++)
{		// genera dei prodotti artificialmente.
	FAKE_PRODUCTS_DATABASE.push({
		product_id: i,
		avaiable: Math.random() > 0.5,
		category_id: 0,
		create_at: new Date(),
		deleted_at: Math.random() > 0.8 ? new Date(Date.now() + 3000) : null,
		name: `Telefono ${i + 1}`,
		description: "Ciao!",
		updated_at: new Date(),
		url_image: `IMG00${Math.floor(1 + (Math.random() * 8))}.jpg`,
	});
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
