

export interface IProfile
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


const FAKE_ACCOUNT_DATABASE: Map<String, IProfile> = new Map();


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
		return null;
	}

	const name: string = data["name"];
	const password: number = data["password"];

	if (typeof name !== 'string'
		|| typeof password !== 'number')
	{
		return null;
	}

	return { name, password };
}


const ErrorAccess = (): Error =>
	new Error(`Disconnected. Try again.`);


const ErrorNoProfile = (name: string): Error =>
	new Error(`Error: profile ${name} doesn't exist!`);


export const LoadAllProfiles = (storage: Storage) =>
{
	const usersString = storage.getItem("__users");

	if (typeof usersString === 'string')
	{
		let userArray;

		try { userArray = JSON.parse(usersString); }
		catch (e) { console.error(e); }

		if (userArray instanceof Array)
		{
			for (const user of userArray)
			{
				if (typeof user !== 'object')
				{
					continue;
				}

				const name = user["name"],
					profileString = user["profile"];
				
				if (typeof name !== 'string' || typeof profileString !== 'string')
				{
					continue;
				}

				let profile;

				try { profile = JSON.parse(profileString); }
				catch (e) { console.error(e); continue; }

				if (typeof profile !== 'object')
				{
					continue;
				}

				let favourites = new Set<number>();
				let birth_date;

				try { birth_date = new Date(Date.parse(profile["birth_date"] ?? "")); }
				catch (e) { console.warn(e); }

				try
				{
					for (const product_id of profile["favourites"])
					{
						if (Number.isInteger(product_id))
						{
							favourites.add(product_id);
						}
					}
				}
				catch (e) { console.warn(e); }

				FAKE_ACCOUNT_DATABASE.set(name, {
					first_name: profile["first_name"] ?? "Error",
					last_name: profile["last_name"] ?? "Error",
					birth_date: birth_date,
					favourites: favourites,
					password: profile["password"],
				} as IProfile);
			}
		}
	}
}


export const SaveAllProfiles = (storage: Storage) =>
{
	const obj = [...FAKE_ACCOUNT_DATABASE.entries()]
		.map(([name, profile]) => ({ profile: JSON.stringify({
			password: profile.password,
			birth_date: profile.birth_date.toUTCString(),
			first_name: profile.first_name,
			last_name: profile.last_name,
			favourites: [...profile.favourites],
		}), name: name }));
	
	storage.setItem("__users", JSON.stringify(obj));
}


export const isValidEmail = (value: string): boolean =>
{
	return value.split("@").length === 1;
}


export class AccountManager
{
	#__name: string;

	#__profile: IProfile;

	#__storage: Storage;

	#__is_access: boolean;


	private constructor (name: string, account: IProfile, storage: Storage)
	{
		this.#__name		= name;
		this.#__profile		= account;
		this.#__storage		= storage;
		this.#__is_access	= true;
	}


	public getName (): string
	{
		return this.#__name;
	}


	public getProfile (): IProfile
	{
		return this.#__profile;
	}


	/**
	 * attemps connection to database.
	 */
	public static async tryConnection (): Promise<void>
	{
		LoadAllProfiles(localStorage);
	}


	/**
	 * create a new account and returns an access object.
	 * if the account already exists will throw an error.
	 */
	public static async fromRegister (
		storage: Storage,
		email: string,
		password: string,
		first_name: string,
		last_name: string,
		birth_date: string
	): Promise<AccountManager>
	{
		if (email.length < 3 || email.length > 40)
		{
			throw new Error(`Invalid name!`);
		}

		if (password.length < 4)
		{
			throw new Error(`Password too short!`);
		}

		if (!isValidEmail(email))
		{
			throw new Error(`Provided email is invalid!`);
		}

		if (FAKE_ACCOUNT_DATABASE.has(email))
		{
			throw new Error(`Name ${email} already taken!`);
		}

		const account: IProfile = {
			password: passwordHash(password),
			first_name: first_name,
			last_name: last_name,
			birth_date: new Date(birth_date),
			favourites: new Set(),
		};

		FAKE_ACCOUNT_DATABASE.set(email, account);
		SaveAllProfiles(localStorage);

		return new AccountManager(email, account, storage);
	}


	/**
	 * recovers the previous access from the device.
	 */
	public static async fromStorage (
		storage: Storage
	): Promise<AccountManager | null>
	{
		const prevAccess: IAccountStorage | null =
			parseAccountString(`${storage.getItem('account')}`);

		if (prevAccess)
		{
			const account: IProfile | undefined =
				FAKE_ACCOUNT_DATABASE.get(prevAccess.name);

			if (account && account.password == prevAccess.password)
			{
				return new AccountManager(prevAccess.name, account, storage);
			}
		}

		return null;
	}


	/**
	 * log-in
	 */
	public static async fromLogin (
		storage: Storage,
		name: string,
		password: string
	): Promise<AccountManager>
	{
		const profile = FAKE_ACCOUNT_DATABASE.get(name);

		if (!profile || passwordHash(password) !== profile.password)
		{		// mostra account non esistente se passwrod è sbagliata.
			throw ErrorNoProfile(name);
		}

		return new AccountManager(name, profile, storage);
	}


	public saveAccess (): void
	{
		if (!this.#__is_access)
		{
			throw ErrorAccess();
		}

		this.#__storage.setItem('account', JSON.stringify({
			name: this.#__name,
			password: this.#__profile.password,
		}));
	}


	/**
	 * exits the current access of the account.
	 */
	public leaveAccess (): void
	{
		if (!this.#__is_access)
		{
			throw ErrorAccess();
		}

		this.#__is_access = false;
		sessionStorage.removeItem('account');
	}


	public async addFavorite (product_id: number): Promise<void>
	{
		if (!this.#__is_access)
		{
			throw ErrorAccess();
		}

		const profile = this.#__profile;

		if (profile.favourites.has(product_id))
		{
			throw new Error(`Favourite already exist.`);
		}

		profile.favourites.add(product_id);
		SaveAllProfiles(localStorage);
	}


	public async removeFavourite (product_id: number): Promise<boolean>
	{
		if (!this.#__is_access)
		{
			throw ErrorAccess();
		}

		let changed = this.#__profile.favourites.delete(product_id);

		SaveAllProfiles(localStorage);

		return changed;
	}


	public async isFavourite (
		product_id: number
	): Promise<boolean>
	{
		return this.#__profile.favourites.has(product_id);
	}

}

