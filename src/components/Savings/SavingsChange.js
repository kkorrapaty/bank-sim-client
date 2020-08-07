import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Redirect after delete
import { Redirect } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

// allow savings api call
import { savings, changeSavings, deleteSavings } from '../../api/saving'

class SavingsChange extends Component {
  constructor (props) {
    super(props)
    // set amount in account to 0
    this.state = {
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
        changeSavings(user, total.toFixed(2))
          .then(res => {
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

      deleteSavings(user)
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

      const { route, amount, additions, removal, display, id, show, remove } = this.state

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

            <h2 onClick={(res) => {
              this.display()
            }}>
              Account ID: {id}   <Button size='sm' variant='outline-info' onClick={(res) => {
                this.display()
              }}>{show}</Button>
            </h2>
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
