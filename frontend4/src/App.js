import LoginPage from './Pages/LoginPage';
import { BrowserRouter, Routes, Route, Router, Navigate } from "react-router-dom";
import RegisterPage from './Pages/RegisterPage';
import CommunityPage from './Pages/CommunityPage';
import MainPage from './Pages/MainPage';
import BaseLayout from './Layouts/BaseLayout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <BaseLayout>
          <CommunityPage />
          </BaseLayout>
          } />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
