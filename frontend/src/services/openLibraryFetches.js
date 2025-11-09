const SEARCH_URL = 'https://openlibrary.org/search.json?';
const MAIN_URL = 'https://openlibrary.org'
const SEARCH_FIELDS = '&fields=title,key,author_name,author_key,cover_i,ratings_average&limit=500' // I chose to retrieve up to 500 results up front and paginate client-side rather than make multiple requests to Open Library; most queries will not return this many, nor will most users choose to page through more than 500 results if they do exist

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

export const fetchOLBook = async (key) => {
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