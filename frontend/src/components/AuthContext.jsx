import { createContext, useState, useEffect } from 'react';
import { getIdentity } from '../services/localFetches';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);

 	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const getUser = async () => {
			if (storedToken) {
				setToken(storedToken);
				try {
					const response = await getIdentity(storedToken);
					setUser(response.data);
				} catch (error) {
					console.error('ERROR:', error);
					//localStorage.removeItem('token');
				}
			}
		};

		getUser();
	}, [token]);

const logout = () => {
	setToken(null);
	localStorage.removeItem('token');
	setUser(null);
}; 

	return (
		<AuthContext.Provider value={{ token, user, logout }}>
			{children}
		</AuthContext.Provider>
	);
};