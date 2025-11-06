import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import BookList from "../components/BookList";
import { fetchHaveRead, fetchWantToRead } from "../services/localFetches";

function ListContainer() {
	const params = useParams();
	const list_type = params.listType;
	const [entries, setEntries] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedSort, setSelectedSort] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
    const getList = async () => {
			setIsLoading(true);
			setEntries(null);
			try {
				let data;
				if (list_type == 'have-read') {
					data = await fetchHaveRead();
				} else {
					data = await fetchWantToRead();
				}
				setEntries(data.data);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		getList();
  }, [list_type]);

	if (!['have-read', 'want-to-read'].includes(list_type)){
		return (<h1>Page Not Found</h1>)
	}

	let sortedEntries;
	if (entries) {
		sortedEntries = entries.filter(entry => {
			return entry.book.title.toLowerCase().includes(searchTerm.toLowerCase()) || entry.book.authors.filter(author => {
				return author.name.toLowerCase().includes(searchTerm.toLowerCase())
			}).length > 0
		});

		sortedEntries.sort((a, b) => {
			if (selectedSort == 'title') {
				a = a.book.title;
				b = b.book.title;
			} else if (selectedSort == 'author') {
				a = a.book.authors[0].name;
				b = b.book.authors[0].name;
			} else if (selectedSort == 'rating') {
				a = a.book.rating;
				b = b.book.rating;
				return b - a;
			} else {
				a = a.id;
				b = b.id;
			}
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		});
	}

	const handleSortChange = (event) => {
		setSelectedSort(event.target.value);
	}

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	}

	return (
		<>
			<NavBar />

			<h1>{list_type == 'have-read' ? 'Books I Have Read' : 'Books I Want To Read'}</h1>

			{isLoading && <p className="message">Fetching data...</p>}
			{error && <p className="error">{error.message}</p>}

			{sortedEntries && 
				<>
					<form>
						<label htmlFor="sort">Sort by:</label>
						<select id="sort" value={selectedSort} onChange={handleSortChange}>
							<option value=''>--Sort Type--</option>
							<option value='title'>Title</option>
							<option value='author'>Author (full name)</option>
							<option value='rating'>Rating (high to low)</option>
						</select>

						<label htmlFor="search">Search</label>
						<input type="text" id="search" value={searchTerm} onChange={handleSearchChange} />
					</form>
					<BookList books={sortedEntries} fromDB={true} />
				</>
			}
		</>
	)
}

export default ListContainer;
