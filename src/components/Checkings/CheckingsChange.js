import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { checkingAcc, changeCheckings } from '../../api/checking'

const save = require('../../save')

class CheckingsChange extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // account id
      id: 0,
      // amount in bank
      amount: 0,
      // viewing
      moveOn: null,
      // additions to deposit
      additions: '',
      removal: ''
    }
  }

  componentDidMount () {
    const { user } = this.props

    checkingAcc(user, save.checkingsId)
      .then(res => {
        console.log(res)
        this.setState({
          amount: res.data.amount,
          moveOn: true,
          id: save.checkingsId
        })
      })
      .catch(console.error)
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onDeposit = event => {
    event.preventDefault()

    const { amount, additions, id } = this.state
    const { user } = this.props

    const total = parseFloat(amount) + parseFloat(additions)

    if (total < 50) {
      return this.setState({
        display: 'Need at least $50 in account',
        removal: ''
      })
    } else {
      // const depWith = save.depWith
      changeCheckings(user, total.toFixed(2), id)
        .then(res => {
          this.setState({
            amount: total.toFixed(2),
            display: '',
            additions: ''
          })
        })
        .catch(console.error)
    }
  }

  onWithdraw = event => {
    event.preventDefault()

    const { amount, removal, id } = this.state
    const { user } = this.props

    const total = parseFloat(amount) - parseFloat(removal)

    if (total < 0) {
      return this.setState({
        display: 'Not Enough Funds',
        removal: ''
      })
    } else if (total < 50) {
      return this.setState({
        display: 'Need at least $50 in account',
        removal: ''
      })
    } else {
      changeCheckings(user, total.toFixed(2), id)
        .then(res => {
          this.setState({
            amount: total.toFixed(2),
            display: '',
            additions: ''
          })
        })
        .catch(console.error)
    }
  }

  render () {
    const { amount, moveOn, additions, removal } = this.state
    let jsx
    // Include commas
    const nf = new Intl.NumberFormat()

    if (moveOn === null) {
      jsx = <p className = "loader"></p>
    } else {
      jsx = (
        <div>
          <h1>Inside Checkings</h1>

          <h4>Balance: ${nf.format(amount)}</h4>
          <Form onSubmit={this.onDeposit}>
            <Form.Group controlId="additions">
              <Form.Label>Deposit</Form.Label>
              <Form.Control
                type="text" pattern="[0.00-9.99]*"
                name="additions"
                value={additions}
                placeholder="Enter Amount"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >Submit</Button>
          </Form>
          <Form onSubmit={this.onWithdraw}>
            <Form.Group controlId="removal">
              <Form.Label>Withdraw</Form.Label>
              <Form.Control
                type="text" pattern="[0.00-9.99]*"
                name="removal"
                value={removal}
                placeholder="Enter Amount"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >Submit</Button>
          </Form>
          <h2>{this.state.display}</h2>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">
          {jsx}
        </div>
      </div>
    )
  }
}

export default CheckingsChange
