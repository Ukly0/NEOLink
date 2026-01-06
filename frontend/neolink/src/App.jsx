import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import Login from './pages/login.jsx';
import { AuthContext } from './components/AuthContext.jsx';
import PersonalPage from './pages/personal_page.jsx';
import CreateItem from './pages/create_item.jsx';
import Items from './pages/items.jsx';

function App() {
  return (
      <Router basename='/neolink'>
        <Routes>
          <Route basename={'/neolink'} path='*' element={<Homepage />} /> 
          <Route basename={'/neolink'} path='/login' element={<Login />} /> 
          <Route basename={'/neolink'} path='/personal-page' element={<PersonalPage />} />
          <Route basename={'/neolink'} path="/create-item" element={<CreateItem />} />
          <Route basename={'/neolink'} path="/items" element={<Items />} />
        </Routes>
      </Router>
  );
}

export default App;
