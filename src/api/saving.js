import apiUrl from '../apiConfig'
import axios from 'axios'

export const savings = user => {
  return axios({
    method: 'get',
    url: apiUrl + '/savings/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}

export const changeSavings = (user, additions) => {
  return axios({
    method: 'patch',
    url: apiUrl + `/savings/${user.id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      saving: {
        amount: additions
      }
    }
  })
}

export const createSavings = (user, amount) => {
  return axios({
    method: 'post',
    url: apiUrl + '/savings/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      saving: {
        amount: amount
      }
    }
  })
}
