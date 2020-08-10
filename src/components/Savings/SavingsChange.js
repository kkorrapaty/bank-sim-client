import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Redirect after delete
import { Redirect } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

// allow savings api call
import { savings, changeSavings, deleteSavings } from '../../api/saving'
import { createTransaction } from '../../api/transaction'

const save = require('../../save')

class SavingsChange extends Component {
  constructor (props) {
    super(props)
    // set amount in account to 0
    this.state = {
      // savings id
      savingId: 0,
      // amount in bank
      amount: 0,
      commaSepAmmount: 0,
      // amount to take out / put in
      additions: '',
      removal: '',
      // Any issues that arise
      display: null,
      // Toggle User ID
      showID: true,
      show: '',
      id: 0,
      // Remove Account -- Using a modal
      remove: false,
      route: false
    }
  }

  componentDidMount () {
    const { user } = this.props

    savings(user)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            savingId: res.data[0].id,
            amount: res.data[0].amount,
            display: '',
            id: '***' + user.userid.toString().substring(11),
            show: 'Show ID'
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
        // const depWith = save.depWith
        // console.log(user, deposit, withdraw)

        changeSavings(user, total.toFixed(2), this.state.savingId)
          .then(res => {
            this.setState({
              amount: total.toFixed(2)
            })
          })
          .then(() => {
            const change = '-' + removal
            const currTotal = this.state.amount

            createTransaction(user, (parseFloat(change)).toFixed(2), parseFloat(currTotal), this.state.savingId)
              .then((res) => {
                console.log(res)
                save.depWith = res.data
                this.setState({
                  display: '',
                  removal: ''
                })
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

      if (total < 50) {
        return this.setState({
          display: 'Need at least $50 in account',
          removal: ''
        })
      } else {
        // const depWith = save.depWith

        changeSavings(user, total.toFixed(2), this.state.savingId)
          .then(res => {
            this.setState({
              amount: total.toFixed(2),
              display: '',
              additions: ''
            })
          })
          .then(() => {
            const change = '+' + additions
            const currTotal = this.state.amount

            createTransaction(user, (parseFloat(change)).toFixed(2), parseFloat(currTotal), this.state.savingId)
              .then((res) => {
                console.log(res)
                save.depWith = res.data.dep_with
                this.setState({
                  display: '',
                  removal: ''
                })
              })
          })
          .catch(console.error)
      }
    }

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

    // Modal is shown (DElETE was clicked)
    handleShow = event => {
      this.setState({
        remove: true
      })
    }

    // Cancel was clicked
    handleClose = event => {
      this.setState({
        remove: false
      })
    }

    // Remove was clicked
    handleRemove = event => {
      const { user } = this.props

      deleteSavings(user, this.state.savingId)
        .then((res) => {
          console.log(res)
          // (user, this.state.savingId)
          //   .catch(console.error)
        })
        .then(this.setState({
          remove: false,
          route: true
        }))
        .catch(console.error)
    }

    render () {
      let jsx
      // Include commas
      const nf = new Intl.NumberFormat()

      const { route, amount, additions, removal, display, id, remove } = this.state

      if (route) {
        return <Redirect to='/' />
      }

      if (display === null) {
        jsx = <p className = "loader"></p>
      } else {
        jsx = (
          <div>
            <h1>
              Savings  <Button size='sm' variant='danger' onClick={this.handleShow}>X</Button>
            </h1>

            <Modal
              show={remove}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Remove Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are You Sure?</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={this.handleRemove}>
                  Remove
                </Button>
                <Button variant="primary" onClick={this.handleClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

            <h4 onClick={(res) => {
              this.display()
            }}>
              Account ID: {id}<i className="fa fa-eye"></i>
            </h4>

            <h3>Balance: ${nf.format(amount)}</h3>
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

export default SavingsChange
