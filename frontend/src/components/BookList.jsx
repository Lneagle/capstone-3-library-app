import { useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

function BookList({ books, fromDB }) {
	const [showDetails, setShowDetails] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);

	return (
		<div className="book-list">
      {books.map(book => (
				<BookCard key={fromDB ? book.book.olid : book.key.substring(7)} book={fromDB ? book.book : book} setSelectedBook={setSelectedBook} setShowDetails={setShowDetails} />
			))}

			{showDetails && <BookDetails book={selectedBook} setShowDetails={setShowDetails} fromDB={fromDB} />}
		</div>
	)
}

export default BookList;
