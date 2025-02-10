import React from "react";
import './Jumbotron.css';

export default function Jumbotron(props) {
    const { title, tagLine, backgroundImage } = props;

    const jumbotronStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    return (
        <div className="jumbotron" style={jumbotronStyle}>
            {/* <div className="steam"></div>
            <div className="steam"></div> */}
            <h1>{title}</h1>
            <p>{tagLine}</p>
        </div>
    );
}
