
import { AccountManager } from "@/scripts/AccountsManager";
import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";


// --------------------------------------------------------

export interface IViewAccountButtonProps
{
	onClick: () => void,
	account?: AccountManager | null,
}

export const ViewAccountButton = (props: IViewAccountButtonProps): JSX.Element =>
{
	const { onClick } = props;

	return (
	<button class="btn btn-info d-flex flex-row gap-2 align-content-center justify-content-center"
	onClick={onClick} >
		<i class="bi bi-person-circle"></i>
		<span class="fs-6" >{props.account
			? `Bentornato ${props.account.getAccount()?.first_name}`
			: "Accedi"}</span>
	</button>
	);
}


// --------------------------------------------------------

export interface IViewAccessRegisterProps
{
	onChangeAccount: (account: AccountManager) => void,
}

export const ViewAccessRegister = (props: IViewAccessRegisterProps): JSX.Element =>
{
	const { onChangeAccount } = props;

	const [firstName, setFirst] = useState<string>("");
	const [lastName, setLast] = useState<string>("");
	const [birthday, setBirthday] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password1, setPassword1] = useState<string>("");
	const [password2, setPassword2] = useState<string>("");


	const onClickRegister = (): void =>
	{
		AccountManager.fromNew(email, password1, firstName, lastName, new Date(Date.parse(birthday)))
		.then(account =>
			{
				account.saveAccess();
				onChangeAccount(account);
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

export interface IViewAccessLoginProps
{
	onChangeAccount: (account: AccountManager) => void,
}

export const ViewAccessLogin = (props: IViewAccessLoginProps): JSX.Element =>
{
	const { onChangeAccount } = props;

	const onRecoverPassword = (): void =>
	{
		alert("Errore: perfavore inserisci 100 € nel computer.");
	}

	return (
	<div class="border border-primary-subtle w-100 rounded p-3" style="height: 400px;" >
		<form class="d-flex flex-column w-100 h-100" name="account-register" onSubmit={ev => ev.preventDefault()} >
			<p class="fw-bold fs-2 mx-auto user-select-none" >Accedi</p>

			<div class="mb-3">
				<label for="login-email" class="form-label user-select-none">Email</label>
				<input type="email" class="form-control" id="login-email" placeholder="name@example.com" />
			</div>

			<div class="mb-3">
				<label for="login-password" class="form-label user-select-none">Password</label>
				<input type="password" class="form-control" id="login-password" />
			</div>

			<button class="btn btn-primary mb-3" >
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

export interface IViewAccessProps
{
	account?: AccountManager | null,
	onChangeAccount: (account: AccountManager | null) => void,
}

export const ViewAccess = (props: IViewAccessProps): JSX.Element =>
{
	const { onChangeAccount } = props;

	if (props.account)
	{
		const onLogout = (): void =>
		{
			props.account!.leaveAccess();
			onChangeAccount(null);
		}

		return (<ViewAccount account={props.account}
			onLogout={onLogout} />);
	}

	return (
	<div class="d-flex flex-row gap-4 px-4 w-100 h-100 align-items-center" style="max-width: 1000px;" >
		<ViewAccessRegister onChangeAccount={onChangeAccount} />
		<ViewAccessLogin onChangeAccount={onChangeAccount} />
	</div>);
}


// --------------------------------------------------------
