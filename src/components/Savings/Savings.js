import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

// allow savings api call
import { savings } from '../../api/saving'
// allow checkings api call
import { checkings } from '../../api/checking'

const save = require('../../save')

class Savings extends Component {
  constructor (props) {
    super(props)
    // set amount in account to 0
    this.state = {
      // amount in bank
      amount: 0,
      // amount in checking account
      checkAmountList: [],
      // button to move forward to savings withdraw/deposit site -> or create a savings account
      moveOn: null,
      // set a route to move to withdraw/deposit site
      route: false,
      // route to create a new savings account
      createAccRoute: false,
      // Toggle User ID for Savings
      showID: true,
      show: '',
      id: 0,
      // Toggle User ID for Checkings
      checkingshowID: true,
      checkingshow: '',
      checkingId: [],
      // No checkings account but there is a savings account
      checkingStatus: false,
      // Trans Route
      routeToTrans: false,
      // Route to create Checkings account
      createCheckAccRoute: false,
      // Route to change Checkings account
      changeCheckRoute: false,
      // checking account index
      checkingAccountIndex: 0
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
            moveOn: 'Savings',
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

    checkings(user)
      .then(res => {
        // console.log(res)
        if (res.data.length > 0) {
          const shallowCopy = [...res.data]
          shallowCopy.map(val => {
            val.index = '***'
          })
          // console.log(shallowCopy)

          this.setState({
            checkAmountList: res.data,
            checkingId: shallowCopy
          })
        } else {
          this.setState({
            checkingStatus: true
          })
        }
      })
  }

  // Savings Account
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

  // Checkings Account
  moveCheck (bool, index) {
    // const { checkingStatus } = this.state

    // if there is no Checkings account)
    if (bool) {
      this.setState({
        createCheckAccRoute: true,
        checkingAccountIndex: index
      })
      save.checkingsId = index
    } else {
      // If account was created
      this.setState({
        changeCheckRoute: true
      })
    }
  }

  // Show or Hide Account ID - Savings
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

  // Show or Hide Account ID - Checkings
  displayCheckings (index) {
    const shallowCopy = this.state.checkingId

    // const { checkingshowID } = this.state
    const { user } = this.props

    if (shallowCopy[index].index === '***') {
      shallowCopy[index].index = user.userid + index + 1

      this.setState({
        checkingshow: 'Hide ID',
        checkingId: shallowCopy,
        checkingshowID: false
      })
    } else {
      shallowCopy[index].index = '***'

      this.setState({
        checkingshow: 'Show ID',
        checkingId: shallowCopy,
        checkingshowID: true
      })
    }
  }

  render () {
    const nf = new Intl.NumberFormat()

    let jsx
    // if API has not responded yet
    const { amount, moveOn, route, createAccRoute, createCheckAccRoute, changeCheckRoute, id, checkAmountList, checkingId } = this.state
    // const { user } = this.props

    // deposit/withdraw into savings account
    if (route) {
      return <Redirect to='/savings-change/transactions' />
    // creating savings account
    } else if (createAccRoute) {
      return <Redirect to='/savings-create/' />
    // creating checkings account
    } else if (createCheckAccRoute) {
      return <Redirect to='/checkings-create' />
    // deposit/withdraw into checkings account
    } else if (changeCheckRoute) {
      return <Redirect to={'/checkings-change/' + save.checkingsId} />
    }

    if (moveOn === null) {
      jsx = <p className = "loader"></p>
    } else if (amount === 0) {
      jsx = (
        <div>
          <center>
            <h3>No Savings Account</h3>
            <Button variant="primary" onClick={() => {
              this.move()
            }}>{moveOn}</Button>
          </center>
        </div>
      )
    } else {
      jsx = (
        <div>
          <Row lg={12}>
            <div className='saving-transaction'>
              <Button variant="link" size='lg' onClick={() => {
                this.move()
              }}>{moveOn}</Button>
              <h4 onClick={(res) => {
                this.display()
              }}>
                Account ID: {id}<i className="fa fa-eye"></i>
              </h4> <br />                 <h4>Balance: ${amount}</h4>
            </div>
            <div>
              {checkAmountList.map((item, index) => {
                const checkId = checkingId[index].index

                return (
                  <Col lg={12} key={index}>
                    <div className='saving-transaction' key={index}>
                      <Button variant="link" size='lg' onClick={(res) => {
                        this.moveCheck(false, item.id)
                        save.checkingsId = item.id
                      }}>Checkings: {index + 1}</Button>
                      <h4 onClick={(res) => {
                        this.displayCheckings(index)
                      }}>
                        Account ID: {checkId}<i className="fa fa-eye"></i>
                      </h4> <br />  <h4>Balance: ${nf.format(item.amount)}</h4>
                    </div>
                  </Col>
                )
              })}
            </div>
          </Row>
          <div>
            <center>
              <Button variant="primary" onClick={(res) => {
                this.moveCheck(true, 0)
              }}>Create Checkings Account</Button>
            </center>
          </div>
        </div>
      )
    }
    return (
      <div>
        <center>
          <h1>Accounts</h1>
          <br />
        </center>
        {jsx}
      </div>
    )
  }
}

export default Savings
