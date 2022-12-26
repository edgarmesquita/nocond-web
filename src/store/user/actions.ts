import axios from 'axios';
import { AppThunk, RootState } from "..";
import { slice } from "./reducer";
import { IUser } from "./types";

const { clearUser, loadingUser, storeUser } = slice.actions;

export const setStoreUser = (user: IUser): AppThunk => dispatch => {
    axios.defaults.headers.common['Authorization'] = user.access_token ? 'Bearer ' + user.access_token : ''
    dispatch(storeUser(user));
};

export const setLoadingUser = (): AppThunk => dispatch => {
    dispatch(loadingUser());
};

export const setClearUser = (): AppThunk => dispatch => {
    dispatch(clearUser());
};

export const getUser = (state: RootState) => state.user.user;
