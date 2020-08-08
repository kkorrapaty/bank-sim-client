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

export const changeSavings = (user, total) => {
  return axios({
    method: 'patch',
    url: apiUrl + `/savings/${user.id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      saving: {
        amount: total
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

export const deleteSavings = (user) => {
  return axios({
    method: 'delete',
    url: apiUrl + `/savings/${user.id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}
