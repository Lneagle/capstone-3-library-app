import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signUp, login } from "../services/localFetches";

function Authenticate({ type }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVerify, setPasswordVerify] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

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
					localStorage.setItem("token", response.token);
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
				localStorage.setItem("token", response.token);
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
		<>
      <form onSubmit={handleSubmit}>
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
				<input type="submit" value="submit" />
				{type == 'login' ? <Link to='/signup'>New user? Sign up here</Link> : <Link to='/login'>Returning user? Log in here</Link>}
			</form>
			{error && <p className="error">{error}</p>}
		</>
	)
}

export default Authenticate;
