import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManuscriptListPage from '@/pages/ManuscriptListPage';
import EditorPage from '@/pages/EditorPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManuscriptListPage />} />
        <Route path="/manuscript/:id" element={<EditorPage />} />
        <Route path="*" element={<ManuscriptListPage />} />
      </Routes>
    </Router>
  );
}
