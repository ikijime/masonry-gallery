import './App.css';
import React from "react";
import Filemanager from "./components/file-manager/FileManager";
import Imagefeed from  "./components/image-feed/ImageFeed";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return(
    <div className="container">
      <Routes>
          <Route path="filemanager" element={<Filemanager />} />
          <Route path="/" element={<Imagefeed />} />
          <Route path="/logout" element={
            () => fetch('/logout')
          } />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>nothing here</p>
              </main>
            }
          />
      </Routes>
    </div>
  )
}
