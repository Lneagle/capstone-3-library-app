function BookCard({ listEntry, book, setSelectedEntry, setSelectedBook, setShowDetails }) {
	let rating = null;

	if (book.rating) {
		rating = book.rating;
	} else if (book.ratings_average) {
		rating = book.ratings_average;
	}

	const handleViewDetails = () => {
		setSelectedBook(book);
		if (listEntry) {
			setSelectedEntry(listEntry);
		}
		setShowDetails(true);
	}

	const truncate = (term) => {
		if (term.length > 35) {
			return term.slice(0, 32).concat('...');
		} else {
			return term;
		}
	}

	const findImageSrc = (book) => {
		if (book.cover_i) {
			return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
		} else {
			return book.cover_image ? book.cover_image : 'https://placehold.co/180x290.png?text=No%20Image';
		}
	}

	const findAuthorNames = (book) => {
		return book.author_name ? book.author_name.join(', ') : book.authors.map((author) => author.name).join(', ')
	}

	return (
		<div className="book-card">
			<div className="title">
				<h3>{truncate(book.title)}</h3>
			</div>
			<div className="image">
				<img src={findImageSrc(book)} alt={`${book.title} cover image`} />
			</div>
			<div className="info">
				<p>{truncate(findAuthorNames(book))}</p>
				{rating && <p>Rating: {rating.toFixed(2)}</p>}
			</div>
			<div className="view-details">
				<button onClick={handleViewDetails}>View Details</button>
			</div>
		</div>
	)
}

export default BookCard;
