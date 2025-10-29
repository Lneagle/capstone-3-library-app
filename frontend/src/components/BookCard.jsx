import { Link } from "react-router-dom";

function BookCard({ book }) {

	return (
		<Link to={`/details/${book.key.substring(7)}`}>
			<div >
				<h3>{book.title}</h3>
				<img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={`${book.title} cover image`} />
				<p>{book.author_name.join(', ')}</p>
			</div>
		</Link>
	)
}

export default BookCard;
