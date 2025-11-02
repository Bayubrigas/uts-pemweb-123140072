import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import CoinDetail from './components/CoinDetail/CoinDetail';

function App() {
  return (
    <div className="app"> {/* Ini memberi background gradient */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetail />} /> {/* Pastikan ini ada */}
      </Routes>
    </div>
  );
}

export default App;