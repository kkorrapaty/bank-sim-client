import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// allow savings api call
import { savings, changeSavings } from '../../api/saving'

class SavingsChange extends Component {
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
      display: null
    }
  }

  componentDidMount () {
    savings(this.props.user)
      .then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.setState({
            amount: res.data[0].amount,
            display: ''
          })
        }
      })
      .catch(console.error)
  }

    handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value
      })
    }

    onWithdraw = event => {
      event.preventDefault()

      const { amount, removal } = this.state
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
        console.log(total.toFixed(2))
        changeSavings(user, total.toFixed(2))
          .then(res => {
            console.log(res)
            this.setState({
              amount: total.toFixed(2),
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

      const total = parseFloat(amount) + parseFloat(additions)
      console.log(total)

      if (total < 50) {
        return this.setState({
          display: 'Need at least $50 in account',
          removal: ''
        })
      } else {
        changeSavings(user, total.toFixed(2))
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
      let jsx

      const { amount, additions, removal, display } = this.state

      if (display === null) {
        jsx = <p className = "loader">Loading...</p>
      } else {
        jsx = (
          <div>
            <h3>Amount: ${amount}</h3>
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
            <h1>Savings</h1>
            {jsx}
          </div>
        </div>
      )
    }
}

export default SavingsChange
