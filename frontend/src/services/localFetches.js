const API_URL = import.meta.env.VITE_API_URL;

export const fetchWantToRead = async (context) => {
	try {
		const response = await fetch(`/api/users/${context.user.id}/lists/want-to-read/entries`, {
			headers: {
				Authorization: `Bearer ${context.token}`,
			}
		});
		if (!response.ok) {
			if (response.status == '404') {
				throw new Error(`There are no books on your list yet! Add some from the Search Books page.`);
			} else {
				const err = await response.json();
				throw new Error(err.error.message);
			}
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching books:", error);
		throw error;
	}
}

export const fetchHaveRead = async (context) => {
	try {
		const response = await fetch(`/api/users/${context.user.id}/lists/have-read/entries`, {
			headers: {
				Authorization: `Bearer ${context.token}`,
			}
		});
		if (!response.ok) {
			if (response.status == '404') {
				throw new Error(`There are no books on your list yet! Add some from the Search Books page.`);
			} else {
				const err = await response.json();
				throw new Error(err.error.message);
			}
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching books:", error);
		throw error;
	}
}

export const postToList = async (list_type, body, context) => {
	try {
		const response = await fetch(`/api/users/${context.user.id}/lists/${list_type}/entries`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${context.token}`,
			},
			body: body,
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}

export const patchListEntry = async (list_type, entry_id, body, context) => {
	try {
		const response = await fetch(`/api/users/${context.user.id}/lists/${list_type}/entries/${entry_id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${context.token}`,
			},
			body: body,
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}

export const deleteListEntry = async(list_type, entry_id, context) => {
	try {
		const response = await fetch(`/api/users/${context.user.id}/lists/${list_type}/entries/${entry_id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${context.token}`,
			},
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};

export const fetchDBBook = async (id, context) => {
	try {
		const response = await fetch(`/api/books/${id}`, {
			headers: {
				Authorization: `Bearer ${context.token}`,
			}
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching book:", error);
		throw error;
	}
}

export const signUp = async (body) => {
	try {
		const response = await fetch(`/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: body,
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error registering:", error);
		throw error;
	}
}

export const login = async (body) => {
	try {
		const response = await fetch(`/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: body,
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error logging in:", error);
		throw error;
	}
}

export const getIdentity = async (token) => {
	try {
		const response = await fetch(`/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}