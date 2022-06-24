
import React from "react";
import "../styles/form.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons';


interface InputProps extends React.HTMLProps<HTMLInputElement> {

}
class PasswordInput extends React.Component<InputProps, {
    textVisible: boolean,
    inputType: string,
    inputIcon: IconDefinition
}> {
    inputRef: React.RefObject<any>;
    constructor(props) {
        super(props);
        this.state = {
            textVisible: false,
            inputType: "password",
            inputIcon: faEyeSlash
        };
        this.inputRef = React.createRef();
        // this.focusInput = this.focusInput.bind(focusInput);
    }

    handlePasswordToggle = () => {
        this.setState({
            textVisible: !this.state.textVisible,
            inputType: this.state.inputType === "password" ? "text" : "password",
            inputIcon: this.state.inputIcon === faEyeSlash ? faEye : faEyeSlash
        });

    }

    focusInput = () => {
        this.inputRef.current.focus();
    }

    render() {
        // const {id, name, className, placeholder, required, value, onChange, ref} = this.props;
        return (
            <div className="password-input-container">
                <input
                    ref={this.inputRef}
                    type={this.state.inputType}
                    placeholder={this.props.placeholder? this.props.placeholder : "Password"}
                    autoComplete="off"
                    {...this.props}
                    />
                <FontAwesomeIcon className="password-input-icons" icon={this.state.inputIcon} onClick={this.handlePasswordToggle}/>
            </div>
        )
    }

}

export default PasswordInput;