// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage/IndexPage';
import HomePage from './pages/HomePage/HomePage';
import UserTestForm from './components/UserTestForm'; // UserTestForm 컴포넌트 임포트


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} /> {/* 루트 경로에 IndexPage 연결 */}
        <Route path="/home" element={<HomePage />} /> {/* "/home" 경로에 HomePage 연결 */}

        {/* ✅ UserTestForm을 위한 별도 테스트 경로를 만듭니다. */}
        <Route path="/user-test" element={<UserTestForm />} /> 

        {/* 나중에 다른 페이지를 추가한다면 여기에 <Route>를 추가합니다. */}
      </Routes>
    </Router>
  );
}

export default App;