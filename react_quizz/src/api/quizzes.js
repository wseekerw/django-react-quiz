import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/quizzes/';
const list = 'list/'
const create = 'create/'
const destroy = 'delete/'
const update = 'update/'

export const fetchQuizzes = async () => {
    const response = await axios.get(BASE_URL + list);
    return response.data;
};

export const createQuiz = async (quizData) => {
    const response = await axios.post(BASE_URL + create, quizData);
    return response.data;
};

export const updateQuiz = async (id, quizData) => {
    const response = await axios.put(`${BASE_URL + update}${id}/`, quizData);
    return response.data;
};

export const deleteQuiz = async (id) => {
    const response = await axios.delete(`${BASE_URL + destroy}${id}/`);
    return response.data
};