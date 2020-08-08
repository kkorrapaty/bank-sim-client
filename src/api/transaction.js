import apiUrl from '../apiConfig'
import axios from 'axios'

export const transactions = user => {
  return axios({
    method: 'get',
    url: apiUrl + '/transactions/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}

export const createTransaction = (user, amount) => {
  return axios({
    method: 'post',
    url: apiUrl + '/transactions/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      transaction: {
        deposit: [amount],
        withdraw: []
      }
    }
  })
}

export const updateDepositTransaction = (user, input) => {
  return axios({
    method: 'patch',
    url: apiUrl + `/transactions/${user.id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      transaction: {
        deposit: input
      }
    }
  })
}

export const updateWithdrawTransaction = (user, output) => {
  return axios({
    method: 'patch',
    url: apiUrl + `/transactions/${user.id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      transaction: {
        withdraw: output
      }
    }
  })
}
