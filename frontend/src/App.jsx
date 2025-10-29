import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookSearch from './pages/BookSearch';

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<BookSearch />} />
		</Routes>
	</BrowserRouter>
)

export default App
