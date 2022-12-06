import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from '../context/userContext/userContext';
import loginService from '../services/loginService';
import getUsers from '../services/userService';

export default function useUser() {
	const { jwt, setJWT, setUser, user } = useUserContext();

	const navigate = useNavigate();

	const [state, setState] = useState({
		loading: false,
		hasError: null,
		errorMessage: null,
		errorCode: null,
	});

	const removeUserSession = () => {
		window.sessionStorage.removeItem('jwt');
		window.sessionStorage.removeItem('user');
		setUser(null);
		setJWT(null);
	};

	const login = useCallback(
		async ({ username, password }) => {
			setState({ loading: true, error: false });
			await loginService({ username, password })
				.then(user => {
					console.log(' useUser -->  loginService: ', user);
					window.sessionStorage.setItem('user', JSON.stringify(user));
					window.sessionStorage.setItem('jwt', user.token);
					setUser(user);
					setJWT(user.token);
					setState({
						loading: false,
						error: false,
						errorCode: null,
						errorMessage: null,
					});
					navigate('/', { replace: true });
				})
				.catch(error => {
					console.log(' useUser -->  loginService: error ', error);
					setState({
						loading: false,
						hasError: true,
						errorCode: null,
						errorMessage: error.message,
					});
					removeUserSession();
				});
		},
		[setJWT]
	);

	const users = useCallback(async () => {
		setState({ loading: true, error: false });
		return await getUsers()
			.then(users => {
				setState({
					loading: false,
					error: false,
					errorCode: null,
					errorMessage: null,
				});
				console.log(' users are: ', users);
				return users;
			})
			.catch(error => {
				console.log(' Error retriving Users: ', error);
				setState({
					loading: false,
					hasError: true,
					errorCode: null,
					errorMessage: error.message,
				});
				return [];
			});
	}, []);

	const logout = useCallback(() => {
		removeUserSession();
	}, []);

	return {
		isLogged: Boolean(jwt),
		isLoading: state.loading,
		hasError: state.error,
		errorCode: state.errorCode,
		errorMessage: state.errorMessage,
		user,
		login,
		logout,
		users,
	};
}
