import './App.css';
import QuizzComponent from './quizz/quizz';
import StartQuiz from './quizz/startQuiz'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Router>
        {/* <nav>
          <Link to="/">Home</Link> |  
        </nav> */}

        <Routes>

          {/* This is your default route equivalent to Angular's '' redirect */}
          <Route path="/" element={<Navigate to="/quizzes" replace />} />
          
          {/* Your main quizzes route */}
          <Route path="/quizzes" element={<QuizzComponent />} />

          <Route path="/quizzes/:id" element={<StartQuiz />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
