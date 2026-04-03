import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import RegisterParent from './pages/RegisterParent';
import RegisterChild from './pages/RegisterChild';
import Dashboard from './pages/Dashboard';
import ChildTaskPage from './pages/ChildTaskPage';
import StudySession from './pages/StudySession';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="register-parent" element={<RegisterParent />} />
          <Route path="register-child" element={<RegisterChild />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="child/:childId" element={<ChildTaskPage />} />
          <Route path="study-session/:sessionId" element={<StudySession />} />
          <Route path="analytics/:childId" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
