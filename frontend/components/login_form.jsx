const React = require('react');
const hashHistory = require('react-router').hashHistory;

const SessionActions = require('./../actions/session_actions');
const SessionStore = require('./../stores/session_store');
const ErrorStore = require('./../stores/error_store');

module.exports = React.createClass({
  render(){
    // oh jeez, I'm using only one form
    // how/why are we extracting only the appropriate errors?
    // TODO: figure out errors!
    const baseErrors = this.state.errors ? this.state.errors.base : "";
    const usernameErrors = this.state.errors ? this.state.errors.username : "";
    const passwordErrors = this.state.errors ? this.state.errors.password : "";

    return(
      <form onSubmit={this._onSubmit}>
        <label>Username:
          <input type="text" id="username"
                 onChange={this._onChange}></input>
        </label>
        {usernameErrors}
        <br></br>

        <label>Password:
          <input type="password" id="password"
                 onChange={this._onChange}></input>
        </label>
        {passwordErrors}
        <br></br>
        {baseErrors}
        {baseErrors ? <br></br> : ""}

        <input type="submit" value="Log In" onClick={this._whichSubmit}></input>
        <input type="submit" value="Sign Up" onClick={this._whichSubmit}></input>
        <input type="submit" value="Demo Login" onClick={this._whichSubmit}></input>
      </form>
    );
  },

  getInitialState(){
    // TODO: any concerns about having password stored as string?
    return {username: "", password: "", errors: ErrorStore.formErrors("login")};
  },

  componentDidMount(){
    SessionStore.addListener(this._onSessionChange);
    ErrorStore.addListener(this._onErrorChange);
  },

  _onSessionChange(){
    if(SessionStore.isUserLoggedIn) hashHistory.push("/");
  },
  _onErrorChange(){
    this.setState({errors: ErrorStore.formErrors("login")});
  },

  _onChange(e){
    this.setState({[e.target.id]: e.target.value})
  },

  _onSubmit(e){
    e.preventDefault();
    switch (this.submit) {
      case "Log In":
        SessionActions.logIn({username: this.state.username,
                               password: this.state.password});
        break;
      case "Sign Up":
        SessionActions.signUp({username: this.state.username,
                               password: this.state.password});
        break;
      case "Demo Login":
        SessionActions.logIn({username:"jyllian", password:"demoaccount"});
        break;
    }
  },

  _whichSubmit(e){
    this.submit = e.currentTarget.value;
  }
});