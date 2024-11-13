

export interface IProduct
{
	id: number,
	title: string,
	imgSrc: string,
}


const FOLDER_IMAGES: string = "images/";


const FAKE_PRODUCTS_DATABASE: IProduct[] =
[
	{
		id: 0,
		title: "Telefono 1",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 1,
		title: "Telefono 2",
		imgSrc: "IMG002.jpg"
	},
	{
		id: 2,
		title: "Telefono 3",
		imgSrc: "IMG003.jpg"
	},
	{
		id: 3,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 4,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 5,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 6,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 7,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 8,
		title: "Telefono 3",
		imgSrc: "IMG001.jpg"
	},
	{
		id: 9,
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
