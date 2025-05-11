import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/questions/';
const list = 'deleted/' 


export const fetchDeletedQuestions = async () => {
    const response = await axios.get(BASE_URL + list);
    return response.data;
};