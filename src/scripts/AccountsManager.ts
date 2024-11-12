

export interface IAccount
{
	password: number,
	first_name: string,
	last_name: string,
	birth_date: Date,
	favourites: Set<number>,
}


export interface IAccountStorage
{
	name: string,
	password: number,
}


const FAKE_ACCOUNT_DATABASE: Map<String, IAccount> = new Map();


export const passwordHash = (password: string) =>
	password
		.split('')
		.reduce((prev, value) => prev + value.charCodeAt(0), 0);


export const parseAccountString = (jsonstring: string): IAccountStorage | null =>
{
	let data: any;

	try
	{
		data = JSON.parse(jsonstring);
	}
	catch (e)
	{
		console.error(e);
		return null;
	}

	if (!(data instanceof Object))
	{
		console.error("no");
		return null;
	}

	const name: string = data["name"];
	const password: number = data["password"];

	if (typeof name !== 'string'
		|| typeof password !== 'number')
	{
		console.error("no");
		return null;
	}

	return { name, password };
}


export const noAccessError = (): Error =>
	new Error(`Disconnected from account! Please login again.`);


export class AccountManager
{
	private name: string;

	private account: IAccount | null;


	private constructor (name: string, account: IAccount)
	{
		this.name = name;
		this.account = account;
	}


	/**
	 * create a new account and returns an access object.
	 * if the account already exists will throw an error.
	 */
	public static async fromNew (
		name: string,
		password: string,
		first_name: string,
		last_name: string,
		birth_date: Date,
	): Promise<AccountManager>
	{
		if (name.length < 3 || name.length > 40)
		{
			throw new Error(`Invalid name!`);
		}

		if (password.length < 4)
		{
			throw new Error(`Password too short!`);
		}

		if (FAKE_ACCOUNT_DATABASE.has(name))
		{
			throw new Error(`Name ${name} already taken!`);
		}

		const account: IAccount = {
			password: passwordHash(password),
			first_name: first_name,
			last_name: last_name,
			birth_date: birth_date,
			favourites: new Set(),
		};

		FAKE_ACCOUNT_DATABASE.set(name, account);

		return new AccountManager(name, account);
	}


	/**
	 * recovers the previous access from the device.
	 */
	public static async fromStorage (): Promise<AccountManager | null>
	{
		const prevAccess: IAccountStorage | null =
			parseAccountString(`${sessionStorage.getItem('account')}`);

		if (prevAccess)
		{
			const account: IAccount | undefined =
				FAKE_ACCOUNT_DATABASE.get(prevAccess.name);
			
			if (account && account.password == prevAccess.password)
			{
				return new AccountManager(prevAccess.name, account);
			}
		}

		return null;
	}


	public saveAccess (): void
	{
		const account = this.account;

		if (!account)
		{
			throw noAccessError();
		}

		sessionStorage.setItem('account', JSON.stringify({
			name: this.name,
			password: account.password,
		}));
	}


	public getAccount (): IAccount | null
	{
		return this.account;
	}


	/**
	 * exits the current access of the account.
	 */
	public leaveAccess (): void
	{
		if (!this.account)
		{
			throw noAccessError();
		}

		this.account = null;
		sessionStorage.removeItem('account');
	}


	public async addFavorite (product_id: number): Promise<void>
	{
		const account = this.account;

		if (!account)
		{
			throw noAccessError();
		}

		if (account.favourites.has(product_id))
		{
			throw new Error(`Favourite already exist.`);
		}

		account.favourites.add(product_id);
	}


	public async removeFavourite (product_id: number): Promise<boolean>
	{
		const account = this.account;

		if (!account)
		{
			throw noAccessError();
		}

		return account.favourites.delete(product_id);
	}

}
