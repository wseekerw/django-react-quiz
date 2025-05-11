import './App.css';
import QuizzComponent from './quizz/quizz';
import StartQuiz from './quizz/startQuiz'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/quizzes" replace />} />
          
          <Route path="/quizzes" element={<QuizzComponent />} />

          <Route path="/quizzes/:id" element={<StartQuiz />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
