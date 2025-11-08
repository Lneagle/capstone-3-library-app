import { useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

function BookList({ items, setEntries, numResults, fromDB }) { // items are books if they come from Open Library, list entries if they come from db
	const [showDetails, setShowDetails] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(items.length/numResults);
	const startIndex = (currentPage - 1) * numResults;
	const endIndex = startIndex + numResults;
	const currentItems = items.slice(startIndex, endIndex);

	const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

	const removeEntry = (id) => {
		setEntries(items.filter(item => {
			return item.id !== id;
		}))
	}

	return (
		<div className="book-list">
			{totalPages > 1 && <div className="pagination">
				<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
					<button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
						{page}
					</button>
				))}
				<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
			</div>}
			
			{currentItems.map(item => (
				<BookCard key={fromDB ? item.book.olid : item.key.substring(7)} listEntry={fromDB ? item : null} book={fromDB ? item.book : item} setSelectedEntry={setSelectedEntry} setSelectedBook={setSelectedBook} setShowDetails={setShowDetails} />
			))}

			{showDetails && <BookDetails entry={selectedEntry} setSelectedEntry={setSelectedEntry} book={selectedBook} setShowDetails={setShowDetails} fromDB={fromDB} removeEntry={removeEntry} />}
		</div>
	)
}

export default BookList;
