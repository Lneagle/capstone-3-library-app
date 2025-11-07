import { useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

function BookList({ items, setEntries, fromDB }) { // items are books if they come from Open Library, list entries if they come from db
	const [showDetails, setShowDetails] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [selectedEntry, setSelectedEntry] = useState(null);

	const removeEntry = (id) => {
		setEntries(items.filter(item => {
			return item.id !== id;
		}))
	}

	return (
		<div className="book-list">
			{items.map(item => (
				<BookCard key={fromDB ? item.book.olid : item.key.substring(7)} listEntry={fromDB ? item : null} book={fromDB ? item.book : item} setSelectedEntry={setSelectedEntry} setSelectedBook={setSelectedBook} setShowDetails={setShowDetails} />
			))}

			{showDetails && <BookDetails entry={selectedEntry} setSelectedEntry={setSelectedEntry} book={selectedBook} setShowDetails={setShowDetails} fromDB={fromDB} removeEntry={removeEntry} />}
		</div>
	)
}

export default BookList;
