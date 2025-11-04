import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookSearch from './pages/BookSearch';
import ListContainer from './pages/ListContainer';

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<BookSearch />} />
			<Route path="/:listType" element={<ListContainer />} />
		</Routes>
	</BrowserRouter>
)

export default App
