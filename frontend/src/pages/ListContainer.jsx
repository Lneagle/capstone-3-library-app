import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import BookList from "../components/BookList";
import { fetchHaveRead, fetchWantToRead } from "../services/localFetches";

function ListContainer() {
	const params = useParams();
	const list_type = params.listType;
	const [books, setBooks] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
    const getTasks = async () => {
			setIsLoading(true);
			setBooks(null);
      try {
				let data;
				if (list_type == 'have_read') {
					data = await fetchHaveRead();
				} else {
	        data = await fetchWantToRead();
				}
        setBooks(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getTasks();
  }, [list_type]);

	if (!['have_read', 'want_to_read'].includes(list_type)){
		return (<h1>Page Not Found</h1>)
	}

	return (
		<>
			<NavBar />
      <h1>{list_type == 'have_read' ? 'Books I Have Read' : 'Books I Want To Read'}</h1>
			{isLoading && <p className="message">Fetching data...</p>}
			{error && <p className="error">{error.message}</p>}
			{books && <BookList books={books.data} fromDB={true} />}
		</>
	)
}

export default ListContainer;
