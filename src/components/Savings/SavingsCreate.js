import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

// allow savings api call
import { createSavings } from '../../api/saving'

class SavingsCreate extends Component {
  constructor (props) {
    super(props)

    this.state = {
      amount: '',
      route: false,
      display: null
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  componentDidMount () {
    this.setState({
      display: ''
    })
  }

  onCreate = event => {
    event.preventDefault()

    const { amount } = this.state
    const { user } = this.props
    // check if amount is below min value
    if (parseFloat(amount) < 50) {
      return this.setState({
        display: 'Need at least $50 in account'
      })
      // if enough
    } else {
      // create savings account
      createSavings(user, parseFloat(amount))
        .then(res => {
          this.setState({
            amount: amount,
            route: true
          })
        })
        .catch(console.error)
    }
  }

  render () {
    let jsx

    const { amount, display, route } = this.state
    const { user } = this.props
    // check if account was successfully created
    if (route) {
      return <Redirect to='/savings/' />
    }

    if (display === null) {
      jsx = <p className = "loader">Loading...</p>
    } else {
      jsx = (
        <div>
          <Form onSubmit={this.onCreate}>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text" pattern="[0.00-9.99]*"
                name = "amount"
                value = {amount}
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
      <div>
        <h1>Hello {user.name}, Lets Create A Savings Account</h1>
        <h4>Minimum $50 to begin with</h4>
        {jsx}
      </div>
    )
  }
}

export default SavingsCreate
