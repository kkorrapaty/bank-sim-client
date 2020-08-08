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
  const [deposit, setDeposit] = useState([])
  const [withdraw, setWithdraw] = useState([])

  const [showHistory, setShow] = useState('d-none')

  useEffect(() => {
    // Get amount from account
    savings(props.user)
      .then(res => {
        if (res.data.length > 0) {
          console.log(res.data[0].amount)
          setAmount(parseFloat(res.data[0].amount))
        }
      })

    // Get transactions
    transactions(props.user)
      .then(res => {
        if (res.data.length > 0) {
          console.log(amount)
          setDeposit(res.data[0].deposit)
          setWithdraw(res.data[0].withdraw)
          setTrans('Show Transaction History')
          save.deposit = res.data[0].deposit
          save.withdraw = res.data[0].withdraw
        } else {
          setTrans('')
        }
      })
  }, [])

  const handleShow = () => {
    setShow('')
    setTrans('Transaction History')
  }

  let jsx

  // Include commas
  const nf = new Intl.NumberFormat()

  if (trans === null) {
    jsx = <p className = "loader"></p>
  } else if (trans === '') {
    jsx = <p>No History</p>
  } else {
    jsx = (
      <div>
        <Container>
          <center>
            <Button onClick={handleShow}>{trans}</Button>
            <Row sm={12} className={showHistory}>
              {deposit.reverse().map((item, index) => {
                return (
                  <Col sm={12} key={index}>
                    <h3>
                      Trans{index}:  +${item} -- Total: ${nf.format(parseFloat(amount) + parseFloat(item))}
                    </h3>
                    <br />
                  </Col>
                )
              })}
            </Row>
            <Row sm={12} className={showHistory}>
              {withdraw.reverse().map((item, index) => {
                return (
                  <Col sm={12} key={index}>
                    <h3>
                      Trans{index}:  -${item} -- Total: ${nf.format(parseFloat(amount) - parseFloat(item))}
                    </h3>
                    <br />
                  </Col>
                )
              })}
            </Row>
          </center>
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
