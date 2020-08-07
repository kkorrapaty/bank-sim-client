import React, { Component } from 'react'

class Home extends Component {
  render () {
    const jsx = (
      <div>
        <div className="row">
          <div className="col-sm-10 col-md-8 mx-auto mt-5">
            <center className='home-page'>
              <h1>All Your Banking Needs</h1>
              <h2>Made Easy</h2>
              <h3>For you</h3>
              <br />
            </center>
            <h5>No Overdraft</h5> <br />
            <h5>No Late Fee</h5> <br />
            <h5>No Hassle</h5> <br />
          </div>
        </div>
      </div>
    )
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default Home
