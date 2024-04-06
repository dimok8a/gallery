import React, { createContext, useState, useEffect } from "react";
import { instanceApi } from "./axios/request";

export const ExampleContext = createContext(null);

export const ExampleProvider = ({ children }) => {
    const [state, setState] = useState();

    useEffect(() => {
        instanceApi
            .request({
                method: "get",
                url: "/photo",
            })
            .then((response) => {
                setState(response.data.photos);
            });
    }, []);

    return (
        <ExampleContext.Provider value={{ state, setState }}>
            {children}
        </ExampleContext.Provider>
    );
};

export default ExampleContext;
