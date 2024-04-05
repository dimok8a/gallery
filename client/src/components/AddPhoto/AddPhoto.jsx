import React, { useState } from "react";
import "./AddPhoto.css";
import { SavePhotoForm } from "../PhotoSave/SavePhotoForm";

export const AddPhoto = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [nameFile, setNameFile] = useState(null);
    const [sizeFile, setSizeFile] = useState(null);
    const [lastModified, setLastModified] = useState(null);

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
                <SavePhotoForm
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    lastModified={lastModified}
                    nameFile={nameFile}
                    sizeFile={sizeFile}
                />
            )}
        </div>
    );
};
