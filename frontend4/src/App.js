import LoginPage from './Pages/LoginPage';
import { BrowserRouter, Routes, Route, Router, Navigate } from "react-router-dom";
import RegisterPage from './Pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
