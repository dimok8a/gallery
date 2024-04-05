import React, { FC, useContext, useState } from "react";
import ExampleContext from "../../Provider";
import "./SavePhoto.module.css";

export const SavePhoto = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { state, setState } = useContext(ExampleContext);

    return (
        <div>
            <div class="for-centering">
                <div class="img-container">
                    <div class="img-column">
                        <img src={state} />
                        <button class="return-btn">отмена</button>
                    </div>
                    <div class="info-column">
                        <div class="title-img">Имя файла</div>
                        <div class="size-img">150х150px</div>
                        <div class="weight-img">1 Гб</div>
                        <div class="date-img">01.04.2024</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
