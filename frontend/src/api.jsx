import axios from 'axios';

const url = 'http://localhost:3000/api/messages';
const header = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const api = {
    messages: {
        getAllMessages: () => axios.get(url, header),
        createMessage: (data) => axios.post(url, data, header),
        updateMessage: (data) => axios.put(`${url}/${data.id}`, data, header)
    }
};

export default api;