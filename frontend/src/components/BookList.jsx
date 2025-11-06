import { useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

function BookList({ books, fromDB }) { // 'books' are actually list entries if they come from the DB
	const [showDetails, setShowDetails] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [selectedEntry, setSelectedEntry] = useState(null);

	return (
		<div className="book-list">
      {books.map(book => (
				<BookCard key={fromDB ? book.book.olid : book.key.substring(7)} listEntry={fromDB ? book : null} book={fromDB ? book.book : book} setSelectedEntry={setSelectedEntry} setSelectedBook={setSelectedBook} setShowDetails={setShowDetails} />
			))}

			{showDetails && <BookDetails entry={selectedEntry} setSelectedEntry={setSelectedEntry} book={selectedBook} setShowDetails={setShowDetails} fromDB={fromDB} />}
		</div>
	)
}

export default BookList;
