import { useEffect, useState } from "react";
import { fetchBook } from "../services/openLibraryFetches";
import { useParams } from "react-router-dom";

function BookDetails() {
	const { id } = useParams();
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
    const getDetails = async () => {
      try {
				setIsLoading(true);
				setError(null);
				const data = await fetchBook(`/works/${id}`);
        setDetails(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

		getDetails();
  }, [id]);

	return (
		<>
      {isLoading && <p className="message">Fetching data...</p>}
			{error && <p className="error">{error.message}</p>}
			{details && 
				<>
					<h3>{details.title}</h3>
					{details.covers && <img src={`https://covers.openlibrary.org/b/id/${details.covers[0]}-M.jpg`} alt={`${details.title} cover image`} />}
					{details.author_name && <p>{details.author_name.join(', ')}</p>}
				</>}
		</>
	)
}

export default BookDetails;
