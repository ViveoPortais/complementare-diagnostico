import axios from 'axios'

const consumerKey = process.env.CONSUMER_KEY
const consumerSecret = process.env.CONSUMER_SECRET
const tokenUrl = 'https://gateway.apiserpro.serpro.gov.br/token'

const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
  'base64'
)

const axiosConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${credentials}`,
  },
}

const formData = new URLSearchParams()
formData.append('grant_type', 'client_credentials')

const getAccessToken = async () => {
  try {
    const response = await axios.post(tokenUrl, formData, axiosConfig)
    const accessToken = response.data.access_token
    return accessToken
  } catch (error) {
    console.error('Erro ao obter token:', error)
    throw error
  }
}

export default getAccessToken
