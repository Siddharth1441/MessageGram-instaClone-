import { api } from "../../shared/services/api"


export async function login(username,password){
    const response = await api.post('/auth/login',{
        username,
        password
    })

    return response.data
}

export async function register(username,email,password) {
    const response =  await api.post('/auth/register',{
        username,
        email,
        password
    })
    
    return response.data
}

export async function getMe() {
    const response = await api.get('/auth/get-me')
    return response.data
}

export async function logout() {
    const response = await api.post('/auth/logout')
    return response.data
}
