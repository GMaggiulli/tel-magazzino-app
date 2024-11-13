
import { ProfileContent } from "@/app/components/contexts";
import { AccountManager } from "@/scripts/AccountsManager";
import { useContext, useLayoutEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";


// --------------------------------------------------------

export interface IViewAccountButtonProps
{
	onClick: () => void,
}

export const ViewAccountButton = (props: IViewAccountButtonProps): JSX.Element =>
{
	const { onClick } = props;

	const { account } = useContext(ProfileContent)!;

	return (
	<button class="btn btn-info d-flex flex-row gap-2 align-content-center justify-content-center"
	onClick={onClick} >
		<i class="bi bi-person-circle"></i>
		<span class="fs-6" >{account
			? `Bentornato ${account.getProfile().first_name}`
			: "Accedi"}</span>
	</button>
	);
}


// --------------------------------------------------------

export interface IInputPasswordProps
{
	onChange: (password: string) => void,
	onValidated: (isValid: boolean) => void,
}

export const InputPassword = (props: IInputPasswordProps): JSX.Element  =>
{
	const { onChange, onValidated } = props;

	const [password1, setPassword1] = useState<string>("");
	const [password2, setPassword2] = useState<string>("");

	useLayoutEffect(() =>
	{
		if (password1.length <= 3 || password2.length <= 2)
		{
			onValidated(false);
			return;
		}

		if (password1 === password2)
		{
			onValidated(true);
			onChange(password1);
		}
		else
		{
			onValidated(false);
		}
	}, [password1, password2]);

	return (
		<div class="mb-4 d-flex flex-column gap-2">
			<input type="text" class="form-control" placeholder="Password"
				value={password1} onInput={ev => setPassword1((ev.target as HTMLInputElement).value)} />
			<input type="text" class="form-control" placeholder="Ripeti Password"
				value={password2} onInput={ev => setPassword2((ev.target as HTMLInputElement).value)} />
			
			{password1.length > 0 || password2.length > 0 ?
				password1 === password2
					? password1.length > 3
						? <span class="text-success" >Ok!</span>
						: <span >Password troppo corta!</span>
					: <span >Password non identiche!</span>
				: null}
		</div>
	);
}


// --------------------------------------------------------

export const ViewAccessRegister = (): JSX.Element =>
{
	const { changeAccount } = useContext(ProfileContent)!;

	const [password, setPassword] = useState<string | null>(null);
	const [firstName, setFirst] = useState<string>("");
	const [lastName, setLast] = useState<string>("");
	const [birthday, setBirthday] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const onClickRegister = (): void =>
	{
		if (typeof password !== 'string')
		{
			return;
		}

		AccountManager.fromRegister(sessionStorage, email, password, firstName, lastName, birthday)
			.then(changeAccount)
			.catch(err => alert(err));
	}


	return (
	<div class="bg-primary-subtle w-100 rounded p-3" style="height: 500px;" >
		<form class="d-flex flex-column w-100 h-100" name="account-register" onSubmit={ev => ev.preventDefault()} >
			<p class="fw-bold fs-2 mx-auto user-select-none" >Registrati</p>

			<div class="input-group mb-2">
				<input type="text" aria-label="First name" class="form-control" placeholder="Nome"
					value={firstName} onInput={ev => setFirst((ev.target as HTMLInputElement).value)} />
				<input type="text" aria-label="Last name" class="form-control" placeholder="Cognome"
					value={lastName} onInput={ev => setLast((ev.target as HTMLInputElement).value)} />
			</div>

			<div class="mb-2">
				<input type="date" class="form-control" placeholder="Data di nascita"
					value={birthday} onInput={ev => setBirthday((ev.target as HTMLInputElement).value)} />
			</div>

			<div class="mb-2">
				<input type="text" class="form-control" placeholder="P. IVA" />
			</div>

			<div class="mb-3">
				<input type="email" class="form-control" placeholder="Email"
					value={email} onInput={ev => setEmail((ev.target as HTMLInputElement).value)} />
			</div>

			<InputPassword onChange={setPassword}
				onValidated={valid => setPassword(valid ? password : null)} />

			<button type="submit" class="btn btn-primary" onClick={onClickRegister}
				disabled={typeof password !== 'string'} >
				Registrati
			</button>
		</form>
	</div>
	);
}


// --------------------------------------------------------

export const ViewAccessLogin = (): JSX.Element =>
{
	const { changeAccount } = useContext(ProfileContent)!;

	const [name, setName]			= useState<string>("");
	const [password, setPassword]	= useState<string>("");

	const onRecoverPassword = (): void =>
	{
		const email = window.prompt("Inserisci email, se appartiene ad un profilo verrà inviato una email per il recupero della password.");

		if (typeof email === 'string')
		{
			alert("Bene! Adesso inserisci 100 € nel computer per continuare.");
		}
	}

	const onClickLogin = (): void =>
	{
		AccountManager.fromLogin(sessionStorage, name, password)
			.then(changeAccount)
			.catch(err => alert(err));
	}

	return (
	<div class="border border-primary-subtle w-100 rounded p-3" style="height: 400px;" >
		<form class="d-flex flex-column w-100 h-100" name="account-register" onSubmit={ev => ev.preventDefault()} >
			<p class="fw-bold fs-2 mx-auto user-select-none" >Accedi</p>

			<div class="mb-3">
				<label for="login-email" class="form-label user-select-none">Email</label>
				<input type="email" class="form-control" id="login-email" placeholder="name@example.com"
					value={name} onInput={ev => setName((ev.target as HTMLInputElement).value)} />
			</div>

			<div class="mb-3">
				<label for="login-password" class="form-label user-select-none">Password</label>
				<input type="password" class="form-control" id="login-password"
					value={password} onInput={ev => setPassword((ev.target as HTMLInputElement).value)}  />
			</div>

			<button class="btn btn-primary mb-3" onClick={onClickLogin} >
				Accedi
			</button>

			<a href="#" onClick={onRecoverPassword} >Recupera password</a>
		</form>
	</div>
	);
}

// --------------------------------------------------------

export interface IViewAccountProps
{
	account: AccountManager,
	onLogout: () => void,
}

export const ViewAccount = (props: IViewAccountProps): JSX.Element =>
{
	const { account, onLogout } = props;

	const [oldPassword, setOldPassword]	= useState<string>("");
	const [password, setPassword]		= useState<string | null>(null);

	const profile = account.getProfile();


	const onChangePassword = (): void =>
	{
		if (typeof password !== 'string')
		{
			return;
		}

		account.changePassword(oldPassword, password)
			.then(() =>
			{
				window.alert("Password cambiata! Esegui di nuovo il login.");
				onLogout();
			})
			.catch(err =>
			{
				console.error(err);
				window.alert("Errore. Controlla se hai digitato corretamente la vecchia password.");
			});
	}


	const onAskLogout = (): void =>
	{
		if (!window.confirm("Sicuro di voler uscire?"))
		{
			return;
		}

		onLogout();
	}


	return (
	<div class="container-fluid h-100 d-flex flex-column gap-1" >

		<div class="d-flex flex-row gap-2" >
			<div class="bg-body-secondary rounded" style="min-width: 150px; min-height: 150px;" ></div>
			<div class="d-flex flex-column w-100" >
				<p class="user-select-none" >Bentornato utente!</p>
				<div class="d-flex flex-row gap-3" >
					<h2>{profile.first_name}</h2>
					<h2>{profile.last_name}</h2>
				</div>
			</div>
			<button class="btn btn-danger" style="min-width: 96px; height: 48px;" onClick={onAskLogout} >Esci</button>
		</div>

		<div class="container-fluid h-100 overflow-y-auto gap-2" >
			<p>Data di nascita: {profile.birth_date.toUTCString()}</p>
			
			<div class="d-flex flex-column bg-body-secondary rounded p-2" style="width: 80%; max-width: 500px;" >
				<p class="fw-bold" >Cambia la password</p>
				<input class="form-control mb-3" type="password"
					placeholder="Vecchia password"
					value={oldPassword}
					onInput={ev => setOldPassword((ev.target as HTMLInputElement).value)} />
				<InputPassword onChange={setPassword} onValidated={valid => setPassword(valid ? password : null)} />
				<button class="btn btn-outline-danger" disabled={typeof password !== 'string'} onClick={onChangePassword} >Cambia</button>
			</div>
		</div>
	</div>
	);
}


// --------------------------------------------------------

export const ViewAccess = (): JSX.Element =>
{
	const { account, changeAccount } = useContext(ProfileContent)!;

	if (account)
	{
		const onLogout = (): void =>
		{
			changeAccount(null);
			account.logout();
		}

		return (<ViewAccount account={account}
			onLogout={onLogout} />);
	}

	return (
	<div class="d-flex flex-row gap-4 px-4 w-100 h-100 align-items-center" style="max-width: 1000px;" >
		<ViewAccessRegister />
		<ViewAccessLogin />
	</div>);
}


// --------------------------------------------------------
