import axios from 'axios';

const API = axios.create({ 
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
API.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url, config.method);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
API.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

export const login = async (credentials) => {
    try {
        const response = await API.post('/login', credentials);
        return response;
    } catch (error) {
        throw error;
    }
};

// Message endpoints
export const sendMessage = (messageData) => API.post('/messages', messageData);
export const getUserMessages = (userId) => API.get(`/messages/user/${userId}`);
export const markMessageAsRead = (messageId) => API.patch(`/messages/${messageId}/read`);

// Dashboard endpoints
export const getTeacherDashboard = async (id) => {
    try {
        console.log('Fetching teacher dashboard for ID:', id);
        const response = await API.get(`/teachers/dashboard/${id}`);
        return response.data;
    } catch (error) {
        console.error('Teacher dashboard error:', error.response?.data || error.message);
        throw error;
    }
};
export const getStudentDashboard = (id) => API.get(`/students/dashboard/${id}`);

// Other endpoints
export const signup = (data) => API.post('/signup', data);
export const getStudentData = (id) => API.get(`/students/${id}`);
export const getTeacherData = (id) => API.get(`/teachers/${id}`);

export default API;
