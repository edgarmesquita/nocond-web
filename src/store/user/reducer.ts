import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageService } from '../../shared/services';
import { IUser, IUserState } from "./types";

const localStorageService = new LocalStorageService();
const userJson = localStorageService.getItem('user');
const initialUser = userJson ? JSON.parse(userJson) : null;
const initialState: IUserState = {
    user: initialUser,
    isLoadingUser: false
}

export const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadingUser: (state: IUserState) => {
            state.isLoadingUser = true;
        },
        storeUser: (state: IUserState, action: PayloadAction<IUser>) => {
            state.isLoadingUser = false;
            state.user = action.payload;
            localStorageService.setItem('user', JSON.stringify(action.payload));
        },
        clearUser: (state: IUserState) => {
            state.isLoadingUser = false;
            state.user = null;
            localStorageService.removeItem('user');
        },
    }
});

export default slice.reducer;