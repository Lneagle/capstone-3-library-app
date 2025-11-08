import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookSearch from './pages/BookSearch';
import ListContainer from './pages/ListContainer';
import Authenticate from './pages/Authenticate';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<BookSearch />} />
			</Route>
			<Route path="/login" element={<Authenticate type={'login'} />} />
			<Route path="/signup" element={<Authenticate type={'signup'} />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/:listType" element={<ListContainer />} />
			</Route>
		</Routes>
	</BrowserRouter>
)

export default App
