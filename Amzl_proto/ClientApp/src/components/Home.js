import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { auth } from './Auth';
import { Redirect } from "react-router-dom";

export class Home extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            authenticated: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        
    }

    handleSubmit(event) {              
       auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((authUser) => {                
                //fetch("/Dashboard", {
                //    method: 'POST',
                //});
                this.setState({ authenticated: true });
                this.props.history.push('/dashboard');
                                
            }).catch((error) => { alert("error") });
        
    };
 
    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }
    render() {
        return (
            <div>
                <div>
                    <form onSubmit={ this.handleSubmit}>
                        <input type="text" id="email" className="input-group mb-3" placeholder="email" onChange={this.handleEmailChange} value={ this.state.email}></input>
                        <input type="password" id="password" className="input-group mb-3" placeholder="password" onChange={this.handlePasswordChange} value={ this.state.password }></input>
                        <div>
                            <button type="submit" className="btn btn-primary"> Submit </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
