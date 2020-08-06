import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

// allow savings api call
import { savings } from '../../api/saving'

class Savings extends Component {
  constructor (props) {
    super(props)
    // set amount in account to 0
    this.state = {
      // amount in bank
      amount: 0,
      // button to move forward to savings withdraw/deposit site -> or create a savings account
      moveOn: null,
      // set a route to move to withdraw/deposit site
      route: false,
      // route to create a new savings account
      createAccRoute: false
    }
  }

  componentDidMount () {
    savings(this.props.user)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            amount: res.data[0].amount,
            moveOn: 'Go To Savings'
          })
        } else {
          this.setState({
            moveOn: 'Create Savings Account'
          })
        }
      })
      .catch(console.error)
  }

  move () {
    const { amount } = this.state
    // if there is no savings account
    if (amount === 0) {
      this.setState({
        createAccRoute: true
      })
    } else {
      // If an account has been created
      this.setState({
        route: true
      })
    }
  }

  render () {
    let jsx
    // if API has not responded yet
    const { amount, moveOn, route, createAccRoute } = this.state

    if (route) {
      return <Redirect to='/savings-change/' />
    } else if (createAccRoute) {
      return <Redirect to='/savings-create/' />
    }

    if (moveOn === null) {
      jsx = <p className = "loader">Loading...</p>
    } else if (amount === 0) {
      jsx = (
        <div>
          <h3>No Savings Account</h3>
          <Button variant="primary" onClick={() => {
            this.move()
          }}>{moveOn}</Button>
        </div>
      )
    } else {
      jsx = (
        <div>
          <h3>Amount: ${amount}</h3>
          <Button variant="success" onClick={() => {
            this.move()
          }}>{moveOn}</Button>
        </div>
      )
    }
    return (
      <div>
        <h1>Savings</h1>
        {jsx}
      </div>
    )
  }
}

export default Savings
