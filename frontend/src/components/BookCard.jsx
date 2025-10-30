function BookCard({ book, setSelectedBook, setShowDetails }) {
	const handleViewDetails = () => {
		setSelectedBook(book);
		setShowDetails(true);
	}

	return (
		<div className="book-card">
			<h3>{book.title}</h3>
			<img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={`${book.title} cover image`} />
			<p>{book.author_name.join(', ')}</p>
			<button onClick={handleViewDetails}>View Details</button>
		</div>
	)
}

export default BookCard;
