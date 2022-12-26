import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IToolsState } from "./types";
import { LocalStorageService } from "../../shared/services";

const localStorageService = new LocalStorageService();
const interfaceJson = localStorageService.getItem('interface');
const initialState: IToolsState = interfaceJson ? JSON.parse(interfaceJson) : {
    drawerOpened: false
}

export const slice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        toggleDrawer: (state: IToolsState) => {
            state.drawerOpened = !state.drawerOpened;
            localStorageService.setItem('interface', JSON.stringify(state));
        },
        setDrawer: (state: IToolsState, action: PayloadAction<boolean>) => {
            state.drawerOpened = action.payload;
            localStorageService.setItem('interface', JSON.stringify(state));
        },
    }
});

export default slice.reducer;