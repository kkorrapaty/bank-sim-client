import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

// allow savings api call
import { savings } from '../../api/saving'

const save = require('../../save')

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
      createAccRoute: false,
      // Toggle User ID
      showID: true,
      show: '',
      id: 0,
      // Trans Route
      routeToTrans: false
    }
  }

  componentDidMount () {
    const { user } = this.props

    savings(user)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            amount: parseFloat(res.data[0].amount).toLocaleString('en-US'),
            // amount: res.data[0].amount,
            moveOn: 'Go To Savings',
            id: '***' + user.userid.toString().substring(11),
            show: 'Show ID',
            routeToTrans: true
          })
          save.amount = this.state.amount
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

  // Show or Hide Account ID
  display () {
    const { showID } = this.state
    const { user } = this.props
    if (showID) {
      this.setState({
        show: 'Hide ID',
        id: user.userid,
        showID: false
      })
    } else {
      this.setState({
        show: 'Show ID',
        id: '***' + user.userid.toString().substring(11),
        showID: true
      })
    }
  }

  render () {
    let jsx
    // if API has not responded yet
    const { amount, moveOn, route, createAccRoute, id } = this.state
    // const { user } = this.props

    if (route) {
      return <Redirect to='/savings-change/' />
    } else if (createAccRoute) {
      return <Redirect to='/savings-create/' />
    }

    if (moveOn === null) {
      jsx = <p className = "loader"></p>
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
          <h2>Savings</h2>
          <h4 onClick={(res) => {
            this.display()
          }}>
            Account ID: {id}<i className="fa fa-eye"></i>
          </h4>
          <h4>Balance: ${amount}</h4>
          <Button variant="success" onClick={() => {
            this.move()
          }}>{moveOn}</Button>
        </div>
      )
    }
    return (
      <div>
        <center>
          <h1>Accounts</h1>
          <br />
          {jsx}
        </center>
      </div>
    )
  }
}

export default Savings
