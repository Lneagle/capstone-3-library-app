import { useState } from "react";
import BookList from "../components/BookList";
import { fetchSearchResults } from "../services/openLibraryFetches";

function BookSearch() {
	const [bookTitle, setBookTitle] = useState('');
	const [bookAuthor, setBookAuthor] = useState('');
	const [bookSubject, setBookSubject] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [numResults, setNumResults] = useState(20);

	const handleTitleChange = (event) => {
		setBookTitle(event.target.value);
	};

	const handleAuthorChange = (event) => {
		setBookAuthor(event.target.value);
	};

	const handleSubjectChange = (event) => {
		setBookSubject(event.target.value);
	};

	const handleNumResultsChange = (event) => {
		setNumResults(event.target.value);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		try {
			let searchString = '';
			if (bookTitle) {
				searchString += `title=${bookTitle.replace(' ', '+')}&`;
			}
			if (bookAuthor) {
				searchString += `author=${bookAuthor.replace(' ', '+')}&`;
			}
			if (bookSubject) {
				searchString += `subject=${bookSubject.replace(' ', '+')}&`;
			}
			searchString += `limit=${numResults}&page=1`;
			const data = await fetchSearchResults(searchString);
			setSearchResults(data);
		} catch (err) {
			setError(err);
		} finally {
			setIsLoading(false);
			setBookTitle('');
			setBookAuthor('');
			setBookSubject('');
		}
	}

	return (
		<>
      <h1>Book Search</h1>
			<form id="book-search" onSubmit={handleSubmit}>
				<label htmlFor="title">Title:</label>
				<input id="title" type="text" value={bookTitle} onChange={handleTitleChange} />

				<label htmlFor="author">Author:</label>
				<input id="author" type="text" value={bookAuthor} onChange={handleAuthorChange} />

				<label htmlFor="subject">Subject:</label>
				<input id="subject" type="text" value={bookSubject} onChange={handleSubjectChange} />

				<label htmlFor="per-page">Results per page:</label>
				<select id="per-page" value={numResults} onChange={handleNumResultsChange}>
					<option value={20}>20</option>
					<option value={30}>30</option>
					<option value={40}>40</option>
					<option value={50}>50</option>
				</select>

				<input type="submit" value="Submit" />
			</form>

			{isLoading && <p className="message">Fetching data...</p>}
			{error && <p className="error">{error.message}</p>}
			{searchResults && <BookList books={searchResults.docs} />}
		</>
	)
}

export default BookSearch;
