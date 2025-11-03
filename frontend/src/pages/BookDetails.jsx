import { useEffect, useState } from "react";
import { fetchBook } from "../services/openLibraryFetches";

function BookDetails({ book, setShowDetails }) {
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
    const getDetails = async () => {
      try {
				setIsLoading(true);
				setError(null);
				const data = await fetchBook(book.key);
        setDetails(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

		getDetails();
  }, [book]);

	const handleClose = () => {
		setShowDetails(false);
	}

	return (
		<div className="modal-container">
      <div className="modal">
				<button className="close" onClick={handleClose}>X</button>
				{isLoading && <p className="message">Fetching data...</p>}
				{error && <p className="error">{error.message}</p>}
				{details && 
					<div className="content">
						<div>
							<h3>{details.title}</h3>
							{details.covers && <img src={`https://covers.openlibrary.org/b/id/${details.covers[0]}-M.jpg`} alt={`${details.title} cover image`} />}
							{book.author_name && <p>{book.author_name.join(', ')}</p>}
						</div>
						<div>
							{details.description && <p>{typeof details.description == 'string' ? details.description : details.description.value}</p>}
							<button>I've Read This</button>
							<button>I Want to Read This</button>
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default BookDetails;
