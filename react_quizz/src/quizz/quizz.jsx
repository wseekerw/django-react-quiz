import { useState, useEffect } from "react";
import AddEditQuizModal from './quizzModal'
import { useSelector } from 'react-redux';
import '../App.css'
import { useDispatch } from 'react-redux';
import { addQuizAction, deleteQuizAction, setQuestionsAction, updateQuizAction, setQuizzesAction } from "../state/quizzesSlice";
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, createQuiz, deleteQuiz, updateQuiz } from '../api/quizzes'
import { fetchDeletedQuestions } from '../api/questions'

const QuizzComponent = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchQuizzes()
      .then(res => {
        //console.log(res)
        dispatch(setQuizzesAction(res.quizzes));
        dispatch(setQuestionsAction(res.deleted_questions));
      })
      .catch(err => console.error(err));
  }, [dispatch]);

  const quizzes = useSelector((state) => state.quizzes.quizzes);
  const questions = useSelector((state) => state.quizzes.questions);

  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleDeleteQuiz = (quiz) => { 

    let quizForDeletion = quiz

    deleteQuiz(quizForDeletion.id).then(res => {
        
        dispatch(setQuizzesAction(res))
        fetchDeletedQuestions().then(res=>{
          dispatch(setQuestionsAction(res));
        }).catch(error=>{
          console.log(error)
        })
    }).catch(error => {
      console.log(error)
    })
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null); 
  };

  const addQuiz = (createdQuiz) => {
    //console.log(createdQuiz)
    if(createdQuiz.id) {
      //Edit the quiz
      let id = createdQuiz.id
      updateQuiz(id, createdQuiz).then(res => {
          //console.log(res)
          dispatch(updateQuizAction(res.quiz));
          dispatch(setQuestionsAction(res.deleted_questions));
      })

    } else {
      //Add new quiz
      createQuiz(createdQuiz).then(
        res => {
          dispatch(addQuizAction(res));
        }
      ).catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <div>
      
      {/* {quizzes.map(quizz => (
        <p key={quizz.id}>{quizz.name}</p>
      ))} */}

      <div className="container">
        <div className="row mb-5">
          <div className="offset-lg-4 col-lg-4 offset-md-4 col-md-4 offset-sm-4 col-sm-4 text-center">
            <button onClick={() => handleEditQuiz(null)} className="btn btn-primary mt-2">
              Add new quiz
            </button>

             { showModal && <AddEditQuizModal addQuiz={addQuiz} quiz={selectedQuiz} show={showModal} onHide={handleCloseModal} />}
            
            
            <div>Number of saved questions: {questions.length}</div>
          </div>
        </div>
        <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-lg-6 col-md-6 col-sm-12">
            
            <div onClick={() => handleEditQuiz(quiz)} className="quiz-list card mb-5">
              <div className="card-body">
                <h5 className="card-title">{ quiz.title }</h5>
                <p className="card-text">
                  Number of questions: { quiz.questions.length }
                </p>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <button
                      className="btn btn-warning mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigate(`/quizzes/${quiz.id}`);
                      }}                                          
                    >
                      Start quiz
                    </button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <button
                      className="btn btn-danger mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDeleteQuiz(quiz); 
                      }}
                    >
                      Delete quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        </div>
      </div>

   
    </div>
  );
};

export default QuizzComponent;