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
	const [listChanged, setListChanged] = useState(false);

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
        setEntries(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
				//setListChanged(false);
      }
    };

    getList();
  }, [list_type, listChanged]);

	if (!['have-read', 'want-to-read'].includes(list_type)){
		return (<h1>Page Not Found</h1>)
	}

	return (
		<>
			<NavBar />
      <h1>{list_type == 'have-read' ? 'Books I Have Read' : 'Books I Want To Read'}</h1>
			{isLoading && <p className="message">Fetching data...</p>}
			{error && <p className="error">{error.message}</p>}
			{entries && <BookList books={entries.data} fromDB={true} setListChanged={setListChanged} />}
		</>
	)
}

export default ListContainer;
