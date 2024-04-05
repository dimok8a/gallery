import React from "react";
import { instanceApi } from "../../axios/request";
import styles from "./SavePhotoForm.module.css";

export const SavePhotoForm = ({
    nameFile,
    selectedImage,
    setSelectedImage,
    lastModified,
    sizeFile,
}) => {
    const saveImage = async () => {
        try {
            const formData = new FormData();
            formData.append("name", nameFile);
            formData.append("width", 100);
            formData.append("height", 100);
            formData.append("date", new Date().toJSON().toString());
            formData.append("file", selectedImage); 

            const response = await instanceApi.post("/photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.for_centering}>
            <div className={styles.img_container}>
                <div className={styles.img_column}>
                    <img src={URL.createObjectURL(selectedImage)} />

                    <div classNameName="apcc">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className={styles.return_btn}
                        >
                            отмена
                        </button>

                        <button onClick={() => saveImage()} className={styles.return_btn}>
                            Сохранить
                        </button>
                    </div>
                </div>
                <div className={styles.info_column}>
                    <div className={styles.title_img}>Имя файла: {nameFile} </div>
                    <div className={styles.size_img}>150х150px</div>
                    <div className={styles.weight_img}>Размер файла: {sizeFile}</div>
                    <div className={styles.date_img}>
                        {new Date(lastModified).getDate() +
                            "." +
                            new Date(lastModified).getMonth() +
                            "." +
                            new Date(lastModified).getFullYear()}
                    </div>
                </div>
            </div>
        </div>
    );
};
