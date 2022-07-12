import { useRef, useState } from "react";

export default function BottomMenu(props) {
  const hiddenFileInput = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { path, setPath, parent, setLoading, setFiletree } = props;

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

  function returnBack() {
    if (!(path === "")) {
      setFiletree([]);
    }
    setPath(parent);
  }

  return (
    <>
      <button
        className="button-83 "
        onClick={() => returnBack()}
      >
        Return
      </button>
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
        <button className="button-83" style={{ marginRight: 10 }} onClick={chooseFilesHandle}>
          Select files
        </button>
        <button className="button-83" type="submit">
          Upload files
        </button>
      </form>
      <div className="selected-files-count">Files to upload: {selectedFiles.length}</div>
  </>
  );
}
