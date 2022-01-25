import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your Devconnector Account</p>
              <form action="login.html">
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" required/>

                </div>
                <div>
                <input type="password" className="form-control form-control-lg" placeholder="Password" name="password" required/>
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4"/>

              </form>


            </div>

          </div>
        </div>
      </div>

    );
  }
}
export default Login;
