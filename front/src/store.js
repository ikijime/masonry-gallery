import { configureStore } from '@reduxjs/toolkit';
import fileSystemSlice from './reducers/fileSystemSlice';

export default configureStore({
    reducer: {
        fileSystem: fileSystemSlice
    }
})