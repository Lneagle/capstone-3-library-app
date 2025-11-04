import { useEffect, useState } from "react";
import { fetchOLBook } from "../services/openLibraryFetches";
import { fetchDBBook, postToList } from "../services/localFetches";

function BookDetails({ book, setShowDetails, fromDB }) {
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
    const getDetails = async () => {
      try {
				setIsLoading(true);
				setError(null);
				let data;
				if (fromDB) {
					data = await fetchDBBook(book.id);
					data = data.data;
				} else {
					data = await fetchOLBook(book.key);
				}
        setDetails(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

		getDetails();
  }, [book, fromDB]);

	const handleClose = () => {
		setShowDetails(false);
	}

	const handleAdd = async (list_type) => {
		const olid = book.olid || book.key.substring(7)
		const cover_image = document.querySelector('.modal img').src;
		const description = details.description ? (typeof details.description == 'string' ? details.description : details.description.value) : null;
		const rating = book.ratings_average || details.rating || null;
		let authors;
		if (details.authors && details.authors[0]['olid']) {
			authors = details.authors;
		} else {
			authors = book.author_name.map((element, index) => {
				return {"name": element, "olid": book.author_key[index]}
			})
		}
		
		const body = JSON.stringify({
			"title": book.title,
			"cover_image": cover_image,
			"olid": olid,
			"description": description,
			"rating": rating,
			"authors": authors
		});

		try {
			await postToList(list_type, body);
		} catch (err) {
			setError(err);
		}
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
							<img src={details.covers ? `https://covers.openlibrary.org/b/id/${details.covers[0]}-M.jpg` : (book.cover_image ? book.cover_image : 'https://placehold.co/180x290.png?text=No%20Image')} alt={`${details.title} cover image`} />
							<p>{book.author_name ? book.author_name.join(', ') : book.authors.map((author) => author.name).join(', ')}</p>
						</div>
						<div>
							{details.description && <p>{typeof details.description == 'string' ? details.description : details.description.value}</p>}
							<button onClick={() => handleAdd('have_read')}>I've Read This</button>
							<button onClick={() => handleAdd('want_to_read')}>I Want to Read This</button>
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default BookDetails;
