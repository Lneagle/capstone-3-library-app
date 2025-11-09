import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchOLBook } from "../services/openLibraryFetches";
import { deleteListEntry, fetchDBBook, patchListEntry, postToList } from "../services/localFetches";
import { AuthContext } from "./AuthContext";

function BookDetails({ entry, setSelectedEntry, book, setShowDetails, fromDB, removeEntry }) {
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [editNotes, setEditNotes] = useState(false);
	const [notes, setNotes] = useState(entry ? entry.notes : '');
	const location = useLocation();
	const context = useContext(AuthContext);
	
	useEffect(() => {
		const getDetails = async () => {
			try {
				setIsLoading(true);
				setError(null);
				let data;
				if (fromDB) {
					data = await fetchDBBook(book.id, context);
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
		if (location.pathname == '/want-to-read' && list_type == 'have-read') {
			try {
				const body = JSON.stringify({"list_type": "have-read"});
				await patchListEntry('want-to-read', entry.id, body, context);
				document.querySelector('.modal-action').innerHTML = `Added to "Books I've Read"`;
				setTimeout(handleClose, 2500);
				removeEntry(entry.id);
			} catch (err) {
				setError(err);
			}
		} else {
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
				await postToList(list_type, body, context);
				document.querySelector('.modal-action').innerHTML = `Added to "${list_type == 'want-to-read' ? 'Books I Want to Read' : 'Books I\'ve Read'}"`;
				setTimeout(handleClose, 2500);
			} catch (err) {
				setError(err);
			}
		}
	}

	const handleNotesChange = (event) => {
		setNotes(event.target.value);
	}

	const handleNotesSubmit = async (event) => {
		event.preventDefault();
		const body = JSON.stringify({"notes": notes});
		try {
			const updated_entry = await patchListEntry('have-read', entry.id, body, context);
			setSelectedEntry(updated_entry.data);
		} catch (err) {
			setError(err);
		} finally {
			setEditNotes(false);
		}
	}

	const handleDelete = async () => {
		try {
			await deleteListEntry(location.pathname.substring(1), entry.id, context);
			document.querySelector('.modal-action').innerHTML = 'Entry deleted';
			setTimeout(handleClose, 1500);
			removeEntry(entry.id);
		} catch (err) {
			setError(err);
		}
	}

	let rating = null;

	if (book.rating) {
		rating = book.rating;
	} else if (book.ratings_average) {
		rating = book.ratings_average;
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
							{rating &&<p>Rating: {rating.toFixed(2)}</p>}
						</div>
						<div>
							{details.description && <p>{typeof details.description == 'string' ? details.description : details.description.value}</p>}
							<p className="modal-action">
								{location.pathname != '/have-read' && <button onClick={() => handleAdd('have-read')}>I've Read This</button>}
								{location.pathname == '/' && <button onClick={() => handleAdd('want-to-read')}>I Want to Read This</button>}
								{location.pathname != '/' && <button onClick={handleDelete}>Delete</button>}
							</p>
							{location.pathname == '/have-read' && <div>
								{entry.notes && !editNotes && 
								<>
									<p>My notes:</p>
									<p>{entry.notes}</p>
								</>
								}
								{editNotes && <form onSubmit={handleNotesSubmit}>
									<textarea id="bookNotes" value={notes} onChange={handleNotesChange}></textarea>	
									<input type="submit" value="Save" />
								</form>}
								{!editNotes && <button onClick={() => setEditNotes(true)}>{entry.notes ? 'Edit Notes' : 'Add Notes'}</button>}
							</div>}
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default BookDetails;
