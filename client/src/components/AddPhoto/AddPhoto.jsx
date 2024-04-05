import React, { useState } from "react";
import "./AddPhoto.css";
import { instanceApi } from "../../axios/request";

export const AddPhoto = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [nameFile, setNameFile] = useState(null);
    const [sizeFile, setSizeFile] = useState(null);
    const [lastModified, setLastModified] = useState(null);

    const saveImage = async () => {
        await instanceApi.postForm("/photo", {file: selectedImage}).then((response) => {
            console.log(response);
        });
    };

    return (
        <div>
            {selectedImage === null ? (
                <div className="load-window">
                    <div className="load-window-text">
                        открывается проводник...
                    </div>
                    {selectedImage && (
                        <div>
                            <img
                                alt="not found"
                                width={"250px"}
                                src={URL.createObjectURL(selectedImage)}
                            />
                            <br />
                            <button>Remove</button>
                        </div>
                    )}

                    <br />
                    <br />

                    <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                            setSelectedImage(event?.target?.files[0]);
                            setNameFile(event?.target?.files[0].name);
                            setSizeFile(event?.target?.files[0].size / 1024);
                            setLastModified(
                                event?.target?.files[0].lastModified
                            );
                            console.log(event?.target?.files[0]);
                        }}
                    />
                </div>
            ) : (
                <div class="for-centering">
                    <div class="img-container">
                        <div class="img-column">
                            <img src={URL.createObjectURL(selectedImage)} />

                            <div className="apcc">
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    class="return-btn"
                                >
                                    отмена
                                </button>

                                <button
                                    onClick={() => saveImage()}
                                    class="return-btn"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                        <div class="info-column">
                            <div class="title-img">Имя файла: {nameFile} </div>
                            <div class="size-img">150х150px</div>
                            <div class="weight-img">
                                Размер файла: {sizeFile}
                            </div>
                            <div class="date-img">
                                {new Date(lastModified).getDate() +
                                    "." +
                                    new Date(lastModified).getMonth() +
                                    "." +
                                    new Date(lastModified).getFullYear()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
