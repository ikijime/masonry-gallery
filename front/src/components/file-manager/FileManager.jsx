import "./FileManager.css";
import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import File from "./File";
import Folder from "./Folder";
import BottomMenu from "./BottomMenu";
import Spinner from "../spinner/Spinner";
import Login from "../login/Login";

export default function Filemanager() {
  const [showLoginPage, setshowLoginPage] = useState(true);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [parent, setParent] = useState("/");
  const [path, setPath] = useState("");
  const [filetree, setFiletree] = useState({
    files: [],
  });
  const [auth, setAuth] = useState(false);
  const [loginErrors, setLoginErrors] = useState({
    loginError: false,
    loginLengthError: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setLoading(true);
    getFileTree();
  }, [path, ignored]);

  function getFileTree() {
    fetch(`/api/filesystem/?path=${path}`)
      .then((response) => response.json())
      .then((response) => {
        const parentLink = path.split("/").slice(0, -1).join("/");
        setParent(parentLink);
        setFiletree(response);
        setLoading(false);
      })
      .catch(console.error);
  }

  function removeFile(id) {
    console.log(id)
    fetch(`/api/files/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        forceUpdate(1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function changeVisibility(id) {
    fetch(`/api/files/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ visibility: 0 }),
    })
    .then(() => {
      forceUpdate(1);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function checkAuth() {
    fetch("/api/auth")
      .then((response) => response.json())
      .then((response) => {
        setAuth(response.auth);
      })
      .catch((error) => console.error(error));
  }

  function login(e, password, username = 'admin') {
    e.preventDefault();
    if (password.length > 7) {
      fetch("/api/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      })
        .then((response) => response.json())
        .then((response) => {
          setAuth(response.auth);
          setLoginErrors({
            loginError: !response.auth,
            loginLengthError: false,
          });
        });
    } else {
      setLoginErrors({
        loginError: false,
        loginLengthError: true,
      });
    }
  }

  function logout() {
    fetch("/api/logout").then((response) => {
      setAuth(false);
    });
  }

  function RenderTree(props) {
    const { files, path, setPath, removeFile } = props;
    
    return files.map((item, idx) => {
      if (item.directory) {
        if (item.name === 'thumbnails') return;
        return (
          <div className="folders-container">
            <Folder
              props={props}
              folder={item}
              path={path}
              setPath={setPath}
              setFiletree={setFiletree}
              removeFile={removeFile}
              key={idx}
            />
          </div>
        );
      } else {
        return (
          <File
            file={item}
            path={path}
            removeFile={removeFile}
            changeVisibility={changeVisibility}
            key={idx}
          />
        );
      }
    });
  }

  if (!auth) {
    return (
      <Login
        target={showLoginPage}
        login={login}
        setshowLoginPage={setshowLoginPage}
        loginErrors={loginErrors}
      />
    );
  }

  return (
    <div className="filemanager-container">
      {loading ? <Spinner active /> : ""}
      <Link to="/">Image feed</Link>
      <span className="filemager-path">/{path}</span>
      <div className="filemanager-tree">
        {filetree.files && (
          <RenderTree
            files={filetree.files}
            path={path}
            setPath={setPath}
            removeFile={removeFile}
          />
        )}
      </div>
      <div className="bottom-menu-container">
        <BottomMenu
          path={path}
          setPath={setPath}
          parent={parent}
          forceUpdate={forceUpdate}
          removeFile={removeFile}
          setLoading={setLoading}
          setFiletree={setFiletree}
        />
      <Link to="/" className="button-83 gray" onClick={() => logout()}>
          Logout
      </Link>
      </div>
    </div>
  );
}
