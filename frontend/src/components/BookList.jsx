import { useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "../pages/BookDetails";

function BookList({ books }) {
	const [showDetails, setShowDetails] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);

	return (
		<div className="book-list">
      {books.map(book => (
				<BookCard key={book.key.substring(7)} book={book} setSelectedBook={setSelectedBook} setShowDetails={setShowDetails} />
			))}

			{showDetails && <BookDetails book={selectedBook} setShowDetails={setShowDetails} />}
		</div>
	)
}

export default BookList;
