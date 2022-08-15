import { createSlice } from '@reduxjs/toolkit'

export const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState: {
    currentPath: '',
    parrentPath: '',
    fileTree: [],
  },
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload
    },
    setParentPath: (state, action) => {
      state.parrentPath = action.payload
    },
    setFileTree: (state, action) => {
      state.fileTree = action.payload
    },
    removeFromFileTree: (state, action) => {
      state.fileTree = state.fileTree.filter(
        (item) => item.name !== action.payload
      )
    },
    changeVisibilityInFileTree: (state, action) => {
      state.fileTree = state.fileTree.map((item) => {
        if (item.id === action.payload) {
          item.visible = !item.visible
        }
        return item
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setCurrentPath,
  setParentPath,
  setFileTree,
  removeFromFileTree,
  changeVisibilityInFileTree,
} = fileSystemSlice.actions

export default fileSystemSlice.reducer
