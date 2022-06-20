

import React from "react";
import "../styles/form.css";

import ImageInput from "../component/ImageInput.js";

class SetupProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cfmPasswordError: "",
            passwordError: "",
        };
    }

    render() {
        return (
            <div className="register-form-section">
                <form method="POST" action="#">
                    <fieldset id="profileSection" className="form-wrapper">
                        <legend className="legend-label">Setting Up Profile</legend>
                        <div className="form-input-wrapper">
                            <ImageInput />
                        </div>
                        <div className="form-input-wrapper">
                            <label htmlFor="usernameInput">Username</label>
                            <input className="form-input" name="usernameInput" id="usernameInput" type="text" placeholder="Username" />
                        </div>
                        <div className="form-input-wrapper">
                            <label htmlFor="aboutInput">About</label>
                            <textarea className="form-input" name="aboutInput" id="aboutInput" type="text" placeholder="Say something about yourself..."></textarea>
                        </div>
                        <input className="full-button" type="button" value="Create Profile" />
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default SetupProfile;