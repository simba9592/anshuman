import axios from 'axios'
export const SERVER_URL = process.env.REACT_APP_BACKEND_URL

const headers = {
	Authorization: `Bearer ${localStorage.getItem('token')}`,
	'Content-Type': 'application/json'
}
// User
const signup = (data:any) => axios.post(`${SERVER_URL}/api/users/register`, data)
const login = (data:any) => axios.post(`${SERVER_URL}/api/users/login`, data)
const getUsers = () => axios.get(`${SERVER_URL}/api/users/getUsers`, { headers })
const getCurrentUser = () => axios.get(`${SERVER_URL}/api/users/`, { headers })
const deleteUser = (data:any) => axios.post(`${SERVER_URL}/api/users/delete`, data, { headers })
const calculateCount = (data:any) => axios.post(`${SERVER_URL}/api/users/calculateCount`, data, { headers })
const updateUserByAdmin = (data:any) => axios.post(`${SERVER_URL}/api/users/updateByAdmin`, data, { headers })

// Countries
const createCountries = (data:any) => axios.post(`${SERVER_URL}/api/countries/create`, data)
const getCountries = () => axios.get(`${SERVER_URL}/api/countries`)

// Models Assumptions
const createAssumptions = (data:any) => axios.post(`${SERVER_URL}/api/assumptions/create`, data)
const getAssumptions = () => axios.get(`${SERVER_URL}/api/assumptions`)

export const apis = {
	signup, 
	login, 
	getUsers,
	getCurrentUser,
	deleteUser,
	calculateCount, 
	updateUserByAdmin,
	createCountries, 
	getCountries, 
	createAssumptions, 
	getAssumptions
}