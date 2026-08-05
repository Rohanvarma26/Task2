import axios from 'axios';

// Trailing slash ensures relative sub-paths resolve correctly
const API_URL = 'http://localhost:5000/api/employees/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getEmployees = async (params) => {
  try {
    const response = await api.get('', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getEmployee = async (id) => {
  try {
    const response = await api.get(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('', employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(id, employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export default {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
