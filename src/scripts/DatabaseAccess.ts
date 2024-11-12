

export interface IProduct
{
	title: string,
	imgSrc: string,
}


const FOLDER_IMAGES: string = "images/";


const FAKE_PRODUCTS_DATABASE: IProduct[] =
[
	{
		title: "Telefono 1",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 2",
		imgSrc: "IMG002.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG003.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	}
];


export class DatabaseAccess
{

	public findByName (query: string): IProduct[]
	{
		const stringQuery: string = query.trim().toLowerCase();

		return FAKE_PRODUCTS_DATABASE
			.filter(product => stringQuery.length === 0 || product.title.toLowerCase().startsWith(stringQuery))
			.map(product => ({ ...product, imgSrc: FOLDER_IMAGES + product.imgSrc }));
	}

}
