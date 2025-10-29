import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookSearch from './pages/BookSearch';
import BookDetails from './pages/BookDetails';

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<BookSearch />} />
			<Route path="/details/:id" element={<BookDetails />} />
		</Routes>
	</BrowserRouter>
)

export default App
