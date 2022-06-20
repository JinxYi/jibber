import React from "react";
import "../styles/imageinput.css";

class ImageInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            imageSource: ""
        };
    }

    handleImgSelect = _event => {
        this.inputRef.current.click();
    }

    handleInputChange = event => {
        const [file] = event.target.files;
        this.setState({
            imageSource: URL.createObjectURL(file)
        });
    }

    render() {
        return (
            <>
                <div className="upload-img-wrapper" onClick={this.handleImgSelect}>
                    <img className="upload-img" src={this.state.imageSource} alt=""/>
                </div>
                <input className="img-input"
                    type="file"
                    ref={this.inputRef}
                    placeholder="Upload Picture" 
                    alt="Upload Picture" 
                    accept="image/png, image/jpeg"
                    onChange={this.handleInputChange}/>
            </>
        );
    }
}

export default ImageInput;