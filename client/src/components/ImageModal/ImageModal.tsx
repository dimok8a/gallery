import React, { FC, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ImageModal.css";
import ExampleContext from "../../Provider";

export const ImageModal: FC = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const parts = pathname.split("/");
    const partAfterPhoto = parts[2];
    const { state, _ } = useContext<any>(ExampleContext);

    return (
        <div className="img-container">
            <div className="prev-btn-div">
                <button className="prev-btn">
                    <img src="/next.png" />
                </button>
            </div>
            <div className="img-window">
                <Link to="/">
                    <button className="close-btn">✕</button>
                </Link>
                <center>
                    <img
                        src={state[partAfterPhoto]["smallFilePath"]}
                        className="img-open"
                    />
                </center>

                <button className="info-btn">...</button>
            </div>

            <div className="next-btn-div">
                <button className="next-btn">
                    <img src="/next.png" />
                </button>
            </div>
        </div>
    );
};
