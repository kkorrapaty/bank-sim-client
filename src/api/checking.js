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

export const checkingAcc = (user, index) => {
  return axios({
    method: 'get',
    url: apiUrl + `/checkings/${index}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}

export const changeCheckings = (user, total, id) => {
  return axios({
    method: 'patch',
    url: apiUrl + `/checkings/${id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      checking: {
        amount: total
      }
    }
  })
}
