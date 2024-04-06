import React, { FC } from "react";
import { Link } from "react-router-dom";

interface ImageProps {
    imgsrc: any;
    index: number;
}

export const Image: FC<ImageProps> = ({imgsrc, index}) => {
    return (
        <div>
            <div className="container">
                <Link to={`/photo/${index}`}><img src={imgsrc.smallFilePath} className="img" /></Link>
            </div>
        </div>
    );
};
