import React, { FC, useContext, useEffect, useState } from "react";
import { Image } from "../Image/Image";
import { instanceApi } from "../../axios/request";
import ExampleContext from "../../Provider";
import { Link } from "react-router-dom";

export const ListImage: FC = () => {
    const [listImage, setListImage] = useState<string[]>([]);
    const { state, setState } = useContext<any>(ExampleContext);

    useEffect(() => {
        instanceApi
            .request({
                method: "get",
                url: "/photo",
            })
            .then((response): any => {
                setListImage(response.data.photos)
                setState(response.data.photos);
            });
    }, []);

    return (
        <div>
            <Link to="/add_photo"><button className="add-btn">+</button></Link>
            {listImage.map((item, index) => {
                return <Image imgsrc={item} index={index} />;
            })}
        </div>
    );
};
