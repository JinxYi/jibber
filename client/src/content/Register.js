
import React from "react";
import "../styles/form.css";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cfmPasswordError: "",
            passwordError: "",
        };
    }

    handleSignUp = event => {

    }

    render() {
        return (
            <div className="register-form-section">
                <h1 className="form-header">Sign Up</h1>
                <form method="POST" action="">
                    <fieldset id="credentialsSection" className="form-wrapper">
                        <div className="form-wrapper">
                            <div className="form-input-wrapper">
                                <label htmlFor="usernameInput">Username</label>
                                <input className="form-input" name="usernameInput" id="usernameInput" type="text" placeholder="Username" />
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="emailInput">Email</label>
                                <input className="form-input" name="emailInput" id="emailInput" type="email" placeholder="Email" />
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="passwordInput">Password</label>
                                <input className="form-input" id="passwordInput" name="passwordInput" type="text" placeholder="Password" />
                                <span className="form-input-error">{this.state.PasswordError}</span>
                            </div>
                            <div className="form-input-wrapper">
                                <label htmlFor="confirmPasswordInput">Confirm Password</label>
                                <input className="form-input" id="confirmPasswordInput" name="confirmPasswordInput" type="text" placeholder="Re-enter Password" />
                                <span className="form-input-error">{this.state.cfmPasswordError}</span>
                            </div>
                            {/* <input id="phoneInput" type="text" placeholder="Phone Number" /> */}
                        <span className="form-footer">By signing up, you agree to the Terms and Conditions and Jibber's Privacy Policy</span>
                        </div>
                        <input className="full-button" type="button" value="Sign Up" onClick={this.handleSignUp}/>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default Register;