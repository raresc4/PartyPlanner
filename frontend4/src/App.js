import LoginPage from './Pages/LoginPage';
import { BrowserRouter, Routes, Route, Router, Navigate } from "react-router-dom";
import RegisterPage from './Pages/RegisterPage';
import CommunityPage from './Pages/CommunityPage';
import MainPage from './Pages/MainPage';
import ProfilePage from './Pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path ="/profile" element={ 
          <ProfilePage />
        } />
        <Route path="/camera/:id" element={<CommunityPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
