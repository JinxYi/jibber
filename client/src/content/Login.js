
import React from "react";
import "../styles/form.css";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneSectionVisibility: true,
            profileSectionVisibility: false
        };
    }

    render() {
        return (
            <div className="login-form-section">
                <h1 className="form-header">Sign In</h1>
                <form method="POST" action="">
                    <div id="loginSection" className="form-wrapper">
                        <div className="form-input-wrapper">
                            <label htmlFor="emailInput">Email Address</label>
                            <input className="form-input" name="emailInput" id="emailInput" type="email" placeholder="Email" />
                        </div>
                        <div className="form-input-wrapper">
                            <label htmlFor="passwordInput">Password</label>
                            <input className="form-input" id="passwordInput" name="passwordInput" type="text" placeholder="Password" />
                        </div>
                        {/* <input id="phoneInput" type="text" placeholder="Phone Number" /> */}
                    </div>

                    <button className="full-button" type="submit">Login</button>
                </form>
            </div>
        )
    }
}

export default Login;