import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserForm from './UserForm';

// This component renders a form that allows the user to establish a new user in the application

export default class UserSignUp extends Component {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      errors: []
    };
  }

  render() {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <UserForm
            cancel={this.cancel}
            errors={this.state.errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={this.state.firstName}
                  onChange={this.change}
                  placeholder="First Name" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={this.state.lastName}
                  onChange={this.change}
                  placeholder="Last Name" />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={this.state.emailAddress}
                  onChange={this.change}
                  placeholder="Email Address" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.change}
                  placeholder="Password" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={this.change}
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;

    let errorList = [];

    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const emailAddress = this.state.emailAddress;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    //input validators
    if (firstName === '') {
      errorList.push('First Name must be provided.');
    }
    if (lastName === '') {
      errorList.push('Last Name must be provided.');
    }
    if (emailAddress === '') {
      errorList.push('Email Address must be provided.');
    }
    if (password === '') {
      errorList.push('Password must be provided.');
    }
    else if (confirmPassword === '') {
      errorList.push('Confirm Password must be provided.');
    }
    else if (password !== confirmPassword) {
      errorList.push('Password and Confirm Password do not match.');
    }

    if (errorList.length > 0) {
      this.setState(() => {
        return { errors: errorList };
      });
    }


    else {
      // Create user
      const user = {
        firstName,
        lastName,
        emailAddress,
        password,
      };

      context.data.createUser(user)
        .then(errors => {
          if (errors.length) {
            this.setState(() => {
              return { errors: [errors] };
            });
          } else {
            context.actions.signIn(emailAddress, password)
              .then(() => {
                this.props.history.push('/');
              });
          }
        })
        .catch((err) => {
          console.log(err);
          this.props.history.push('/error');
        });
    }
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
