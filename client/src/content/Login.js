
import React from "react";
import "../styles/form.css";
import PasswordInput from "../component/PasswordInput.tsx";
import { loginUser } from "../api.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            formError: ""
        };
        this.emailInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleErrorDismiss = _event => this.setState({ formError: "" });
    

    handleFormSubmit = () => {
        if(this.state.email === "") {
            this.emailInputRef.current.focus();
            return;
        }
        if(this.state.password === "") {
            this.passwordInputRef.current.focusInput();
            return;
        }
        const body = {
            "email": this.state.email,
            "password": this.state.password
        }
        loginUser(body)
            .then(result => {
                window.location.replace("/");
            })
            .catch(error => {
                if (error.response) {
                    if(error.response.status === 401 && error.response.data.code === "INVALID_CREDENTIALS") {
                        this.setState({ formError: "Email or password is incorrect" });
                        return;
                    }
                    this.setState({ formError: "Sorry, an unexpected error occured" });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    this.setState({ formError: "Sorry, an unexpected error occured on the server" });
                } else {
                    console.log("An unexpected error occured on the client side", error);
                    this.setState({ formError: "Sorry, an unexpected error occured while sending request" });
                }
            });
    }

    render() {
        return (
            <div className="login-form-section">
                <h1 className="form-header">Sign In</h1>
                <form>
                    <div id="loginSection" className="form-wrapper">
                    {
                    this.state.formError === "" ?
                        ""
                        :
                        <div className="form-input-error">
                            <FontAwesomeIcon className="form-input-error-icon" icon={faCircleExclamation} />
                            <div className="form-input-error-message">{this.state.formError}</div>
                            <div className="form-input-error-dismiss-wrapper" onClick={this.handleErrorDismiss}>
                                <FontAwesomeIcon className="form-input-error-dismiss-icon" icon={faXmark} />
                            </div>
                        </div>
                    }
                        <div className="form-input-wrapper">
                            <label htmlFor="emailInput">Email</label>
                            <input className="form-input" name="email" id="emailInput" type="email" placeholder="Email" required={true} value={this.state.email} onChange={this.handleInputChange} ref={this.emailInputRef}/>
                        </div>
                        <div className="form-input-wrapper">
                            <label htmlFor="passwordInput">Password</label>
                            <PasswordInput className="form-input" name="password" id="passwordInput" required={true} value={this.state.password} onChange={this.handleInputChange}  ref={this.passwordInputRef}/>
                        </div>
                        {/* <input id="phoneInput" type="text" placeholder="Phone Number" /> */}
                    </div>
                    <span className="form-footer">By signing in, you agree to the Jibber's Terms and Conditions and Privacy Policy</span>
                    <button className="full-button" type="button" onClick={this.handleFormSubmit}>Sign In</button>
                </form>
                <span className="form-redirect">Do not have an account? <a href="/r">Sign up here</a></span>
            </div>
        )
    }
}

export default Login;