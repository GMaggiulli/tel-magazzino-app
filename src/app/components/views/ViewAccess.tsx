
import { UserAccess } from "@/app/components/contexts";
import { AccountManager } from "@/scripts/AccountsManager";
import { useContext, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";


// --------------------------------------------------------

export interface IViewAccountButtonProps
{
	onClick: () => void,
}

export const ViewAccountButton = (props: IViewAccountButtonProps): JSX.Element =>
{
	const { onClick } = props;

	const { account } = useContext(UserAccess)!;

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

export const ViewAccessRegister = (): JSX.Element =>
{
	const { changeAccount } = useContext(UserAccess)!;

	const [firstName, setFirst] = useState<string>("");
	const [lastName, setLast] = useState<string>("");
	const [birthday, setBirthday] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password1, setPassword1] = useState<string>("");
	const [password2, setPassword2] = useState<string>("");


	const onClickRegister = (): void =>
	{
		AccountManager.fromRegister(sessionStorage, email, password1, firstName, lastName, birthday)
		.then(account =>
			{
				account.saveAccess();
				changeAccount(account);
			})
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

			<div class="mb-4 d-flex flex-column gap-2">
				<input type="text" class="form-control" placeholder="Password"
					value={password1} onInput={ev => setPassword1((ev.target as HTMLInputElement).value)} />
				<input type="text" class="form-control" placeholder="Ripeti Password"
					value={password2} onInput={ev => setPassword2((ev.target as HTMLInputElement).value)} />
				
				{password1.length > 0 || password2.length > 0 ?
					password1 === password2
						? <span class="text-success" >Ok!</span>
						: <span >Password non identiche!</span>
					: null}
			</div>

			<button type="submit" class="btn btn-primary" onClick={onClickRegister} >
				Registrati
			</button>
		</form>
	</div>
	);
}


// --------------------------------------------------------

export const ViewAccessLogin = (): JSX.Element =>
{
	const { changeAccount } = useContext(UserAccess)!;

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
			.then(access =>
			{		// accesso ad account esistente ottenuto!
				changeAccount(access);
				access.saveAccess();
			})
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
	const { onLogout } = props;

	return (
	<div class="container" >
		<button class="btn btn-danger" onClick={onLogout} >Esci</button>
	</div>
	);
}


// --------------------------------------------------------

export const ViewAccess = (): JSX.Element =>
{
	const { account, changeAccount } = useContext(UserAccess)!;

	if (account)
	{
		const onLogout = (): void =>
		{
			account.leaveAccess();
			changeAccount(null);
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
