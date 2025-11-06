function BookCard({ listEntry, book, setSelectedEntry, setSelectedBook, setShowDetails }) {
	const handleViewDetails = () => {
		setSelectedBook(book);
		if (listEntry) {
			setSelectedEntry(listEntry);
		}
		setShowDetails(true);
	}

	return (
		<div className="book-card">
			<h3>{book.title}</h3>
			<img src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`: (book.cover_image ? book.cover_image : 'https://placehold.co/180x290.png?text=No%20Image')} alt={`${book.title} cover image`} />
			<p>{book.author_name ? book.author_name.join(', ') : book.authors.map((author) => author.name).join(', ')}</p>
			<button onClick={handleViewDetails}>View Details</button>
		</div>
	)
}

export default BookCard;
