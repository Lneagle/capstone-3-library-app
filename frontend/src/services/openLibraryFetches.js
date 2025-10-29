const SEARCH_URL = 'https://openlibrary.org/search.json?';
const MAIN_URL = 'https://openlibrary.org'
const SEARCH_FIELDS = '&fields=title,key,author_name,author_key,cover_i,ratings_average'

export const fetchSearchResults = async (searchTerm) => {
	try {
		const response = await fetch(`${SEARCH_URL}${searchTerm}${SEARCH_FIELDS}`);
		if (!response.ok) {
			throw new Error('Could not fetch search results')
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching results:', error)
		throw error;
	}
}

export const fetchBook = async (key) => {
	try {
		const response = await fetch(`${MAIN_URL}${key}.json`);
		if (!response.ok) {
			throw new Error('Could not fetch book')
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching book:', error)
		throw error;
	}
}