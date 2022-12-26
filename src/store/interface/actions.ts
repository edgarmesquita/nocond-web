import { AppThunk, RootState } from "..";
import { slice } from "./reducer";

const { setDrawer } = slice.actions;

export const setDrawerOpened = (opened: boolean): AppThunk => dispatch => {
    dispatch(setDrawer(opened));
};

export const drawerIsOpened = (state: RootState) => state.interface.drawerOpened;