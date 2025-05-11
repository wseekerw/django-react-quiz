import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray, getValues } from 'react-hook-form'
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css'

const StartQuiz = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const quiz = useSelector((state) =>
        state.quizzes.quizzes.find((q) => q.id === parseInt(id))
    );
    const [quizzForSolving, setQuizzForSolving] = useState({
        questions: [],
        name: '',
    });

    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [questionsCorrect, setQuestionsCorrect] = useState(0);
    const [questionsLength, setQuestionsLength] = useState(0);
    
    
    useEffect(()=>{

        if (quiz) {
            const deepCopiedQuiz = JSON.parse(JSON.stringify(quiz)); // Create deep copy
        
            // Modify the deep copy
            deepCopiedQuiz.questions = deepCopiedQuiz.questions.map((q) => ({
              ...q,
              answered: false,
              correct: false,
              showAnswer: false,
              lastSlide: false,
            }));
        
            deepCopiedQuiz.questions.push({
              question: '',
              answer: '',
              lastSlide: true,
              answered: false,
              correct: false,
              showAnswer: false,
            });
        
            setQuizzForSolving(deepCopiedQuiz);
            setQuestionsLength(deepCopiedQuiz.questions.length - 1)
          }
          
          
    },[quiz])

    const { register, handleSubmit, control, formState: { errors, touchedFields }, getValues, watch } = useForm({
        defaultValues: {
            submittedAnswers: Array.from({ length: quizzForSolving.questions.length }, () => ''),
          },
      });
    
    const { fields } = useFieldArray({
        control,
        name: "submittedAnswers"
    });

    const setAnsweredAndCorrectQuestions = (questions) => {
        let answered = 0;
        let correct = 0;
      
        for (let question of questions) {
          if (question.answered) answered += 1;
          if (question.correct) correct += 1;
        }
      
        setQuestionsAnswered(answered);
        setQuestionsCorrect(correct);
      };
    
    const onSubmitAnswer = (question, answer, index) => {
        //console.log(question, answer, index);
        let answerFromQuestion = question.answer.toLowerCase();
        let submittedAnswer = answer.toLowerCase();

        let isCorrect = submittedAnswer.includes(answerFromQuestion);

        // Create a new copy of the questions array
        let updatedQuestions = [...quizzForSolving.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            answered: true,
            correct: isCorrect,
        };

        // Update state with the new questions array
        setQuizzForSolving(prev => ({
            ...prev,
            questions: updatedQuestions,
        }));

        setAnsweredAndCorrectQuestions(updatedQuestions);
    };

    const showAnswer = (questionToUpdate) => {
        setQuizzForSolving(previousState => {
          const updatedQuestions = previousState.questions.map(previousQuestion =>
            previousQuestion === questionToUpdate ? { ...previousQuestion, showAnswer: true } : previousQuestion
          );
          return {
            ...previousState,
            questions: updatedQuestions,
          };
        });
      };

    return (
        <div>
            <button
                role="button"
                type="button"
                onClick={()=>{navigate(`/quizzes`)}}
                className="btn btn-warning quizzes-back">
                Back to quizzes
            </button>
            <form>
                <Carousel interval={null} indicators={true} wrap={false} fade={false}>
                    {quizzForSolving.questions.map((question, i) =>{ 
                    const answer = watch(`submittedAnswers.${i}`);
                    return (
                    <Carousel.Item key={i}>
                        <div className="p-4">
                        {!question.lastSlide ? (
                            <>
                            <p className="text-center">{question.question}</p>
                            <span className="text">Answer: </span>
                            <input
                                disabled={question.answered}
                                className="form-control"
                                {...register(`submittedAnswers.${i}`)}
                                onKeyDown={(e) => {
                                    if (e.code === 'Space') e.stopPropagation();
                                }}
                            />
                            {errors.submittedAnswers?.[i] && touchedFields.submittedAnswers?.[i] && (
                                <div className="text-danger">Please provide an answer</div>
                            )}

                            <div className="text-center mt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={question.answered || !answer || answer.trim() === ""}
                                    onClick={() => {
                                        const values = getValues();
                                        //console.log(values)
                                        const answer = values.submittedAnswers[i];
                                        onSubmitAnswer(question, answer, i)
                                      }}
                                    >
                                Submit answer
                                </button>
                            </div>
                            {question.answered && (
                                question.correct ? (
                                    <div className="text-center text text-correct">
                                    Congratulations your answer is correct!
                                    </div>
                                ) : (
                                    <div className="text-center text text-correct">
                                        <p className="text-not-correct">Answer is not correct!</p>
                                        <button type="button" className="btn btn-primary" onClick={() => showAnswer(question)}>
                                            Show answer
                                        </button>
                                        {question.showAnswer && (
                                            <div>
                                                <p>{question.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                                )}

                            </>
                        ) : (
                            <div className="text-center">
                            <p>Questions answered: {questionsAnswered} / {questionsLength}</p>
                            <p>Questions correct: {questionsCorrect} / {questionsLength}</p>

                            {questionsAnswered === questionsLength ? (
                                <p className="last-page-text text-correct">
                                    Congratulations you have finished the {quizzForSolving.name} quizz
                                </p>
                            ) : questionsAnswered < questionsLength ? (
                                <p className="text-center last-page-text text-warning">
                                    You have not finished the quizz. You still have {questionsLength - questionsAnswered} questions to answer.
                                </p>
                            ) : null}
                            
                            <button role="button"
                                type="button"
                                onClick={()=>{navigate(`/quizzes`)}} 
                                className="btn btn-warning">End quiz</button>
                            </div>
                        )}
                        </div>
                    </Carousel.Item>
                    )}
                    )}
                </Carousel>
            </form>
        </div>
    )
}

export default StartQuiz