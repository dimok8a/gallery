import React, { FC, createContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ImageSrc } from "./pages/ImageSrc";
import { HomePage } from "./pages/HomePage";
import { ExampleProvider } from "./Provider";
import { AddPhotoPage } from "./pages/AddPhotoPage";
import { SavePhoto } from "./components/SavePhoto/SavePhoto";

const App: FC = () => {
    return (
        <ExampleProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/photo/:id" element={<ImageSrc />} />
                    <Route path="/add_photo" element={<AddPhotoPage />} />
                </Routes>
            </BrowserRouter>
        </ExampleProvider>
    );
};

export default App;
