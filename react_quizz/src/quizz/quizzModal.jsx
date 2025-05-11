import { Modal, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form'
import '../App.css'
import Select from 'react-select';
import { useSelector } from 'react-redux';

const AddEditQuizModal = ({ show, onHide, quiz, addQuiz }) => {

  const savedQuestions = useSelector((state) => state.quizzes.questions);

  const { register, control, handleSubmit, reset, formState: { errors, touchedFields, isSubmitted, isValid } } = useForm({
    defaultValues: {
      name: '',
      questions: [{ question: "", answer: "" }]
    },
    mode: "onChange"
  });

  const handleClose = () => {
    reset({
      title: '',
      questions: []
    })
    onHide();
  };


  useEffect(()=>{
      if(quiz) {
        reset({
          title: quiz.title,
          questions: quiz.questions
        });
        replace(quiz.questions); 
      } else {
        reset({
          title: '',
          questions: []
        })
        replace([]);
      }

  },[quiz, reset])

  

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'questions'
  });

  const onSubmit = (data) => {
    data.id = quiz?.id ?? null;
    addQuiz(data)
    handleClose()
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  const onAddQuestion = (option) => {
      append(
        { question: option.question, 
          answer: option.answer 
        }
      )
      setSelectedOption(null);
  }

  const handleAdd = () => {
    if (selectedOption) {
      onAddQuestion(selectedOption);
    }
  };

  const options = savedQuestions.map(q => ({
    label: q.question, 
    value: q.id,        
    ...q               
  }));
    
  return (<Modal show={show} onHide={onHide}>
    <Modal.Header className='col-lg-12 col-md-12 col-sm-12 modal-header d-flex align-items-center'>

    <Button onClick={() => append({ question: '', answer: '' })}
          type="button"
          className="btn btn-primary mb-4 mt-3">
          Add a question
    </Button>
    <Modal.Title>
        {quiz?.id ? 'Edit Quiz' : 'Add Quiz'}
    </Modal.Title>
    <button
          type="button"
          className="btn ms-auto"
          aria-label="Close"
          onClick={onHide} 
          >
    <h3>&times;</h3>
    </button>
      
    </Modal.Header>
    <Modal.Body>
      

    <div className="col-lg-12 col-md-12 col-sm-12">
      <label htmlFor="question">Reuse a previously saved question:</label>
      <Select
        id="question"
        options={options}
        onChange={handleChange}
        value={selectedOption}
        placeholder="Select a question"
        isClearable={false}
        isSearchable={true}
      />

      <button
        type="button"
        className="btn btn-primary mb-4 mt-3"
        disabled={!selectedOption}
        onClick={handleAdd}
      >
        Add reused question
      </button>
    </div>

    <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
      <form id="quiz-form" onSubmit={handleSubmit(onSubmit)}>

        <h3>{ quiz ? "Edit quiz" : "Add new quiz" }</h3>
        <label className="form-label mt-4">Title:</label>
        <input 
            placeholder="Enter title" 
            className="form-control" 
            {...register('title', { required: true })} />

          {errors.name && (
            <div className="text-danger mb-4">
              Quiz title is required
            </div>
          )}
        
        <p>Questions: </p>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="mb-2">
              <span>{ index + 1 }. </span>
              <label className="form-label">Question:</label><br />

              <input className="form-control"
                {...register(`questions.${index}.question`, { required: true })}
                placeholder="Question"
              />

              {((errors.questions?.[index]?.question && touchedFields.questions?.[index]?.question) || isSubmitted) && (
                <div className="text-danger mt-1">
                  Question is required
                </div>
              )}
            </div>

            <br />

            <span>{ index + 1 }. </span>
            <label className="form-label">Answer:</label><br />
            
            <input className="form-control"
              {...register(`questions.${index}.answer`, { required: true })}
              placeholder="Answer"
            />

            {((errors.questions?.[index]?.answer && touchedFields.questions?.[index]?.answer) || isSubmitted) && (
              <div className="text-danger mt-1">
                Answer is required
              </div>
            )}

            <br />
              <button onClick={() => {remove(index)}}
                type="button"
                className="btn btn-danger mb-4"
              >
                Remove { index + 1 }. question
              </button>
          </div>
        ))}

        
      </form>
    </div>
    </Modal.Body>
    <Modal.Footer className='modal-footer'>
         <button form="quiz-form" 
             disabled={!isValid || fields.length < 1}
             className="btn btn-primary mb-4 float-end"
             type="submit">
            Submit quiz
          </button>
    </Modal.Footer>
  </Modal>
  )
};

export default AddEditQuizModal