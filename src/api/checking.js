import apiUrl from '../apiConfig'
import axios from 'axios'

export const checkings = user => {
  return axios({
    method: 'get',
    url: apiUrl + '/checkings/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}
