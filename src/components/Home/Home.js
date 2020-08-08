import React, { Component } from 'react'
import Carousel from 'react-bootstrap/Carousel'

class Home extends Component {
  render () {
    const jsx = (
      <Carousel className='home-page'>
        <Carousel.Item>
          <h2>Made Easy</h2>
          <h2>For you</h2>
          <br />
        </Carousel.Item>

        <Carousel.Item>
          <h5>No Overdraft</h5> <br />
          <h5>No Late Fee</h5> <br />
          <h5>No Hassle</h5> <br />
        </Carousel.Item>

        <Carousel.Item>
          <h3>Steps:</h3> <br />
          <p>Sign Up</p>
          <p>Create Savings Account</p>
          <p>Track Funds</p>
        </Carousel.Item>

      </Carousel>
    )
    return (
      <div>
        <h1>All Your Banking Needs</h1>
        {jsx}
      </div>
    )
  }
}

export default Home
