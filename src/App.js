import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Weather from './components/Weather';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/weather/:city" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
