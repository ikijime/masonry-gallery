import './Login.css'
import React, { Component } from 'react'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
    }
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  render() {
    const { password } = this.state
    const { login, loginErrors } = this.props
    let renderLengthError, renderError
    renderLengthError = loginErrors.loginLengthError ? (
      <span className='login-error'>Password to short</span>
    ) : null
    renderError = loginErrors.loginError ? (
      <span className='login-error'>Invalid password</span>
    ) : null

    return (
      <div className='login-container'>
        <div className='login'>
          {renderLengthError}
          {renderError}
          <form>
            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                id='inputPassword'
                value={password}
                onChange={(e) => this.onPasswordChange(e)}
                placeholder='Password'
              />
            </div>
            <button
              onClick={(e) => login(e, password)}
              className='btn mt-2
                    btn-primary'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }
}
