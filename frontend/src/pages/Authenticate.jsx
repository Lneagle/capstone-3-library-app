import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, login } from "../services/localFetches";
import { AuthContext } from "../components/AuthContext";

function Authenticate({ type }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVerify, setPasswordVerify] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const context = useContext(AuthContext);

	const handleUserChange = (event) => {
		setUsername(event.target.value);
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	}

	const handlePasswordVerifyChange = (event) => {
		setPasswordVerify(event.target.value);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		if (type == 'signup') {
			if (password != passwordVerify) {
				setError('Password fields must match!');
			} else {
				try {
					const response = await signUp(JSON.stringify({"username": username, "password": password}));
					context.login(response);
					navigate('/');
				} catch (err) {
					console.log(err);
					setError(err);
				} finally {
					setUsername('');
					setPassword('');
					setPasswordVerify('');
				}
			}
		} else {
			try {
				const response = await login(JSON.stringify({"username": username, "password": password}));
				context.login(response);
				navigate('/');
			} catch (err) {
				console.log(err);
				setError(err);
			} finally {
				setUsername('');
				setPassword('');
				setPasswordVerify('');
			}
		}
	}

	return (
		<main>
			<h1 className="logo">MyLibrary</h1>
			<p>Welcome to MyLibrary!  Keep track of books you've read or books you want to read.  Happy reading!</p>
			<form className="vertical" onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input id="username" type="text" value={username} onChange={handleUserChange} />
				<label htmlFor="password">Password:</label>
				<input id="password" type="password" value={password} onChange={handlePasswordChange} required />
				{type == 'signup' && 
					<>
						<label htmlFor="password-verify">Type password again:</label>
						<input id="password-verify" type="password" value={passwordVerify} onChange={handlePasswordVerifyChange} required />
					</>
				}
				<input type="submit" value="Submit" />
				{error && <p className="error">{error}</p>}
				<p>{type == 'login' ? <Link to='/signup'>New user? Sign up here</Link> : <Link to='/login'>Returning user? Log in here</Link>}</p>
			</form>
		</main>
	)
}

export default Authenticate;
