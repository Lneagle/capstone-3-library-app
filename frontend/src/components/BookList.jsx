import BookCard from "./BookCard";

function BookList({ books }) {

	return (
		<>
      {books.map(book => (
				<BookCard book={book} key={book.key.substring(7)} />
			))}
		</>
	)
}

export default BookList;
