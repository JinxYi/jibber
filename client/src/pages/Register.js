
import React from "react";
import "../styles/form.css";
import PasswordInput from "../component/PasswordInput.tsx";
import { registerUser } from "../api.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { isFilled, isEmail, isStrongPassword } from "../validation.js";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formError: "",
            username: {
                value: "",
                error: "",
            },
            email: {
                value: "",
                error: "",
            },
            password: {
                value: "",
                error: "",
            },
            confirmPassword: {
                value: "",
                error: "",
            },
        };
        this.usernameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.cfmPasswordRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState(prevState => ({
            [name]: {
                ...prevState[name],
                value: value,
                error: ""
            }
        }));
    }

    handleSignUp = event => {
        if (!isFilled(this.state.username.value)) {
            this.usernameRef.current.focus();
            return;
        }
        else if (!isFilled(this.state.email.value)) {
            this.emailRef.current.focus();
            return;
        }
        else if (!isFilled(this.state.password.value)) {
            this.passwordRef.current.focusInput();
            return;
        }
        else if (!isFilled(this.state.confirmPassword.value)) {
            this.cfmPasswordRef.current.focusInput();
            return;
        }
        else if (!isEmail(this.state.email.value)) {
            console.log("plaes enter valid email");
            this.emailRef.current.focus();
            this.setState(prevState => ({
                email: {
                    ...prevState.emali,
                    error: "Please enter a valid email address"
                }
            }));
            return;
        }
        else if (!isStrongPassword(this.state.password.value)) {
            this.passwordRef.current.focusInput();
            this.setState(prevState => ({
                password: {
                    ...prevState.password,
                    error: "Must be at least characters, at least one uppercase letter, one lowercase letter, one number and one special character"
                }
            }));
            return;
        }
        else if (this.state.password.value !== this.state.confirmPassword.value) {
            this.setState(prevState => ({
                confirmPassword: {
                    ...prevState.confirmPassword,
                    error: "Passwords do not match"
                }
            }));
            return;
        }

        registerUser({
            "username": this.state.username.value,
            "email": this.state.email.value,
            "password": this.state.password.value
        })
            .then(_result => {
                window.location.replace("/r/profile");
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 422 && error.response.data.code === "USER_EXISTS") {
                        this.setState(prevState => ({
                            email: {
                                ...prevState.emali,
                                error: "Email is already in use"
                            }
                        }));
                        return;
                    }
                    this.setState({ formError: "Sorry, an unexpected error occured" });
                } else if (error.request) {
                    this.setState({ formError: "Sorry, an unexpected error occured on the server" });
                } else {
                    console.log("An unexpected error occured on the client side", error);
                    this.setState({ formError: "Sorry, an unexpected error occured while sending request" });
                }
            });
    }

    render() {
        return (
            <div className="register-form-section">
                <h1 className="form-header">Sign Up</h1>
                <form method="POST" action="/api/user/register">
                    {
                        this.state.formError === "" ?
                            ""
                            :
                            <div className="form-input-error">
                                <FontAwesomeIcon className="form-input-error-icon" icon={faCircleExclamation} />
                                <div className="form-input-error-message">{this.state.formError}</div>
                                <div className="form-input-error-dismiss-wrapper" onClick={this.setState({ formError: "" })}>
                                    <FontAwesomeIcon className="form-input-error-dismiss-icon" icon={faXmark} />
                                </div>
                            </div>
                    }
                    <fieldset id="credentialsSection" className="form-wrapper">
                        <div className="form-wrapper">
                            <div className="form-input-wrapper">
                                <label htmlFor="usernameInput">Username</label>
                                <input ref={this.usernameRef} className="form-input" name="username" id="usernameInput" type="text" placeholder="Username" required={true} onChange={this.handleInputChange} value={this.state.username.value} />
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="emailInput">Email</label>
                                <input
                                    ref={this.emailRef}
                                    className={this.state.email.error === "" ? "form-input" : "form-input error"}
                                    name="email"
                                    id="emailInput"
                                    type="email"
                                    placeholder="Email"
                                    required={true}
                                    onChange={this.handleInputChange}
                                    value={this.state.email.value} />
                                <span className="form-field-input-error">{this.state.email.error}</span>
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="passwordInput">Password</label>
                                <PasswordInput ref={this.passwordRef}
                                    className={this.state.password.error === "" ? "form-input" : "form-input error"}
                                    name="password"
                                    id="passwordInput"
                                    required={true}
                                    onChange={this.handleInputChange}
                                    value={this.state.password.value} />
                                <span className="form-field-input-error">{this.state.password.error}</span>
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="confirmPasswordInput">Confirm Password</label>
                                <PasswordInput
                                    ref={this.cfmPasswordRef}
                                    className={this.state.confirmPassword.error === "" ? "form-input" : "form-input error"}
                                    name="confirmPassword"
                                    id="confirmPasswordInput"
                                    placeholder="Re-enter Password"
                                    required={true} onChange={this.handleInputChange}
                                    value={this.state.confirmPassword.value} />
                                <span className="form-field-input-error">{this.state.confirmPassword.error}</span>
                            </div>
                            {/* <input id="phoneInput" type="text" placeholder="Phone Number" /> */}
                            <span className="form-footer">By signing up, you agree to the Jibber's Terms and Conditions and Privacy Policy</span>
                        </div>
                        <input className="full-button" type="button" value="Sign Up" onClick={this.handleSignUp} />
                    </fieldset>
                </form>
                <span className="form-redirect">Already have an account? <a href="/l">Sign in</a></span>
            </div>
        )
    }
}

export default Register;