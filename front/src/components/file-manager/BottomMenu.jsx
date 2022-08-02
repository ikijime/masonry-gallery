import { useRef, useState } from "react";
import Modal from "../modal/Modal";

export default function BottomMenu(props) {
  const hiddenFileInput = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { path, setPath, parent, setLoading, setFiletree, forceUpdate } = props;
  const [newFolderModal, setNewFolderModal] = useState(false);

  const chooseFilesHandle = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  const fileSelectedHandler = (e) => {
    setSelectedFiles(e.target.files);
  };

  const fileUploadHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    const len = selectedFiles.length;

    for (let i = 0; i < len; i++) {
      let file = selectedFiles[i];
      formData.append("photos", file);
    }

    formData.append("fileFolderPath", path);

    let response = await fetch(`/api/files`, {
      method: "POST",
      body: formData,
    });

    let result = await response.json();
    if (result.status === true) {
      setSelectedFiles([]);
      props.forceUpdate(0);
    }

    if (result.error) {
      console.error(result.error);
      setLoading(false);
    }
  };

  const createFolder = (name) => {
    if (!name) return;
    
    fetch(`/api/filesystem/`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path: path, name: name }),
    })
    .then(() => {
      forceUpdate();
      setNewFolderModal(!newFolderModal);
      
    })
    .catch((err) => {
      console.error(err);
    });
  };

  function returnBack() {
    if (!(path === "")) {
      setFiletree([]);
    }
    setPath(parent);
  }

  return (
    <>
      {newFolderModal ? (
        <Modal
          type="text-input"
          method={createFolder}
          closeModal={setNewFolderModal}
        />
      ) : (
        ""
      )}
      <div className="dir-control">
        <button className="button-83 " onClick={() => returnBack()}>
          Return
        </button>
        <button
          className="button-83"
          style={{ marginRight: 10 }}
          onClick={() => setNewFolderModal(!newFolderModal)}
        >
          Create Folder
        </button>
      </div>

      <div className="upload-control">
        <form
          onSubmit={fileUploadHandler}
          method="post"
          encType="multipart/form-data"
        >
          <input
            style={{ display: "none" }}
            multiple
            type="file"
            id="files"
            onChange={fileSelectedHandler}
            ref={hiddenFileInput}
          />
          <button
            className="button-83"
            style={{ marginRight: 10 }}
            onClick={chooseFilesHandle}
          >
            Select files
          </button>
          Files to upload: {selectedFiles.length} &nbsp;
          <button className="button-83" type="submit">
            Upload files
          </button>
        </form>
      </div>
    </>
  );
}
