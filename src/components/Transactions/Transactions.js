import React, { useState, useEffect } from 'react'
import { transactions } from '../../api/transaction'
import { savings } from '../../api/saving'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Row, Col } from 'react-bootstrap'
const save = require('../../save')

const Transactions = props => {
  const [amount, setAmount] = useState(0)
  const [trans, setTrans] = useState(null)
  // const [hasSavings, setHasSavings] = useState(false)
  // const [deposit, setDeposit] = useState([])
  // const [withdraw, setWithdraw] = useState([])
  const [depositWithdraw, setDepWith] = useState([])

  const [showHistory, setShow] = useState('d-none')

  useEffect(() => {
    // Get amount from account
    savings(props.user)
      .then(res => {
        if (res.data.length > 0) {
          console.log(res.data[0].amount)
          setAmount(parseFloat(res.data[0].amount))
          // Get transactions
          transactions(props.user)
            .then(res => {
              console.log(res)
              if (res.data.length > 0) {
                // console.log(res.data.amount)
                // setAmount(res.data.amount)

                // setDeposit(res.data[0].deposit)
                // setWithdraw(res.data[0].withdraw)
                setDepWith(res.data.reverse())
                setTrans('Show Transaction History')
                save.depWith = res.data
                // save.deposit = res.data[0].deposit
                // save.withdraw = res.data[0].withdraw
              }
            })
            .catch(console.error)
        } else {
          setTrans('')
        }
      })
      .catch(console.error)
  }, [])

  const handleShow = () => {
    console.log(amount)
    if (showHistory === 'd-none') {
      setShow('')
      setTrans('Hide Transaction History')
    } else {
      setShow('d-none')
      setTrans('Show Transaction History')
    }
  }

  let jsx

  // Include commas
  const nf = new Intl.NumberFormat()

  // const length = depositWithdraw.length
  let type = ''

  if (trans === null) {
    jsx = <p className = "loader"></p>
  } else if (trans === '') {
    jsx = <p>No History</p>
  } else {
    jsx = (
      <div className='saving-trans-hist'>
        <Button onClick={handleShow}>{trans}</Button>
        <Container className={showHistory}>
          <Row sm={12}>
            {depositWithdraw.map((item, index) => {
              if (parseFloat(item.change_in_amount) > 0) {
                type = 'Deposit'
              } else {
                type = 'Withdraw'
              }
              return (
                <Col sm={12} key={index}>
                  <h3>
                    {type}: ${nf.format(item.change_in_amount)} -- Total: ${nf.format(item.curr_total)}
                  </h3>
                  <br />
                </Col>
              )
            })}
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div>
      {jsx}
    </div>
  )
}

export default Transactions
