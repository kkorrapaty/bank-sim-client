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

export const createTransaction = (user, amount, total, id) => {
  // console.log('IN Axios', user, amount)
  return axios({
    method: 'post',
    url: apiUrl + '/transactions/',
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: {
      transaction: {
        account: id,
        change_in_amount: amount,
        curr_total: total
      }
    }
  })
}

export const deleteTransactions = (user, id) => {
  return axios({
    method: 'delete',
    url: apiUrl + `/transactions/${id}`,
    headers: {
      'Authorization': `Token ${user.token}`,
      'Content-Type': 'application/json'
    }
  })
}

// export const updateTransaction = (user, change, total) => {
//   console.log(user)
//   return axios({
//     method: 'patch',
//     url: apiUrl + `/transactions/${user.id}`,
//     headers: {
//       'Authorization': `Token ${user.token}`,
//       'Content-Type': 'application/json'
//     },
//     data: {
//       transaction: {
//         account: user.id,
//         change_in_amount: change,
//         curr_total: total
//       }
//     }
//   })
// }
//
// export const updateWithdrawTransaction = (user, output) => {
//   return axios({
//     method: 'patch',
//     url: apiUrl + `/transactions/${user.id}`,
//     headers: {
//       'Authorization': `Token ${user.token}`,
//       'Content-Type': 'application/json'
//     },
//     data: {
//       transaction: {
//         withdraw: output
//       }
//     }
//   })
// }
