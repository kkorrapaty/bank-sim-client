import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// allow savings api call
import { savings, changeSavings } from '../../api/saving'

class Savings extends Component {
  constructor (props) {
    super(props)
    // set amount in account to 0
    this.state = {
      // amount in bank
      amount: 0,
      // amount to take out / put in
      additions: '',
      removal: '',
      // Any issues that arise
      display: ''
    }
  }

  componentDidMount () {
    savings(this.props.user)
      .then(res => {
        // console.log(res.data)
        if (res.data.length > 0) {
          this.setState({
            amount: res.data[0].amount
          })
        }
      })
      .catch(console.error)
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  onWithdraw = event => {
    event.preventDefault()

    const { amount, removal } = this.state
    const { user } = this.props
    // console.log(amount, parseInt(removal))
    // console.log(user)
    this.setState({
      removal: parseInt(removal)
    })

    if (removal > amount) {
      return this.setState({
        display: 'Not Enough Funds',
        removal: ''
      })
    } else if ((amount - removal) < 50) {
      return this.setState({
        display: 'Need at least $50 in account',
        removal: ''
      })
    } else {
      changeSavings(user, amount - removal)
        .then(res => {
          // console.log(res)
          this.setState({
            amount: this.state.amount - removal,
            display: '',
            removal: ''
          })
        })
        .catch(console.error)
    }
  }

  onDeposit = event => {
    event.preventDefault()

    const { amount, additions } = this.state
    const { user } = this.props
    // console.log(amount, parseInt(additions))
    // console.log(user)
    // set added values as an int
    this.setState({
      additions: parseInt(additions)
    })
    const total = amount + parseInt(additions)
    // console.log(total)
    if (total < 50) {
      return this.setState({
        display: 'Need at least $50 in account',
        removal: ''
      })
    } else {
      changeSavings(user, total)
        .then(res => {
          // console.log(res)
          this.setState({
            amount: total,
            display: '',
            additions: ''
          })
        })
        .catch(console.error)
    }
  }

  render () {
    const { amount, additions, removal } = this.state
    return (
      <div>
        <h1>Savings</h1>
        <h3>Amount: ${amount}</h3>
        <Form onSubmit={this.onDeposit}>
          <Form.Group controlId="additions">
            <Form.Label>Deposit</Form.Label>
            <Form.Control
              type="text"
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
              type="text"
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
}

export default Savings
