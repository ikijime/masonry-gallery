import './FileManager.css'
import { useState, useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import File from './File'
import Folder from './Folder'
import BottomMenu from './BottomMenu'
import Spinner from '../spinner/Spinner'
import Login from '../login/Login'

import { useSelector, useDispatch } from 'react-redux'
import {
  setParentPath,
  setFileTree,
  removeFromFileTree,
  changeVisibilityInFileTree,
} from '../../reducers/fileSystemSlice'

export default function Filemanager() {
  const dispatch = useDispatch()
  const path = useSelector((state) => state.fileSystem.currentPath)
  const fileTree = useSelector((state) => state.fileSystem.fileTree)
  const [showLoginPage, setshowLoginPage] = useState(true)
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
  const [auth, setAuth] = useState(false)
  const [loginErrors, setLoginErrors] = useState({
    loginError: false,
    loginLengthError: false,
  })
  const [loading, setLoading] = useState(true)

  // store.subscribe(remove);
  const getFileTree = () => {
    fetch(`/api/filesystem/?path=${path}`)
      .then((response) => response.json())
      .then((response) => {
        const parentLink = path.split('/').slice(0, -1).join('/')
        dispatch(setParentPath(parentLink))
        dispatch(setFileTree(response.files))
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    checkAuth()
    setLoading(true)
    getFileTree()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ignored])

  function remove(id) {
    fetch(`/api/files/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log('removed')
        console.log(id)
        dispatch(removeFromFileTree(id))
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function changeVisibility(id, folderName = false) {
    fetch(`/api/files/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderName: folderName,
      }),
    })
      .then(() => {
        dispatch(changeVisibilityInFileTree(id))
        if (folderName) getFileTree()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function checkAuth() {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((response) => {
        setAuth(response.auth)
      })
      .catch((error) => console.error(error))
  }

  function login(e, password, username = 'admin') {
    e.preventDefault()
    if (password.length > 7) {
      fetch('/api/signin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      })
        .then((response) => response.json())
        .then((response) => {
          setAuth(response.auth)
          setLoginErrors({
            loginError: !response.auth,
            loginLengthError: false,
          })
        })
    } else {
      setLoginErrors({
        loginError: false,
        loginLengthError: true,
      })
    }
  }

  function logout() {
    fetch('/api/logout').then(() => {
      setAuth(false)
    })
  }

  const RenderTree = (props) => {
    return fileTree.map((item, idx) => {
      if (item.directory) {
        if (item.name === 'thumbnails') return ''
        return (
          <div className='folders-container' key={idx}>
            <Folder
              props={props}
              folder={item}
              forceUpdate={forceUpdate}
              changeVisibility={changeVisibility}
              key={idx}
            />
          </div>
        )
      } else {
        return (
          <File
            file={item}
            remove={remove}
            changeVisibility={changeVisibility}
            key={idx}
          />
        )
      }
    })
  }

  if (!auth) {
    return (
      <Login
        target={showLoginPage}
        login={login}
        setshowLoginPage={setshowLoginPage}
        loginErrors={loginErrors}
      />
    )
  }

  return (
  <div>
    <Link to='/'><div className="image-feed-button">ImageFeed</div></Link>
    <div className='filemanager-container'>
      {loading ? <Spinner active /> : ''}


      <span className='filemanager-path'>/{path}</span>

      <div className='filemanager-tree'>
        <RenderTree />
      </div>

      <div className='bottom-menu-container'>
        <BottomMenu forceUpdate={forceUpdate} setLoading={setLoading} />
        <Link to='/' className='button-83 gray' onClick={() => logout()}>
          Logout
        </Link>
      </div>
    </div>
  </div>
  )
}
