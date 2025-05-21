import axios, { AxiosHeaders } from 'axios'
import getAccessToken from './get-access-token'

const serproAPI = axios.create({
  baseURL: 'https://gateway.apiserpro.serpro.gov.br/',
  headers: { 'Content-Type': 'application/json' },
})

serproAPI.interceptors.request.use(async (config) => {
  try {
    const token = await getAccessToken()
    // Constrói um AxiosHeaders a partir dos headers atuais
    const headers = new AxiosHeaders(config.headers)
    // Faz o set corretamente
    headers.set('Authorization', `Bearer ${token}`)
    // Substitui config.headers pela instância correta
    config.headers = headers
  } catch {
    // opcional: toast.error('Não foi possível obter token GOV')
  }
  return config
})

export default serproAPI
