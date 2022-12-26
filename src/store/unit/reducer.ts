import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnitGroup } from '../../unit/models';
import { LocalStorageService } from '../../shared/services';
import { IUnitGroupState } from "./types";

const storeName = "unitGroup";
const localStorageService = new LocalStorageService();
const unitGroupJson = localStorageService.getItem(storeName);
const initialUnitGroup = unitGroupJson ? JSON.parse(unitGroupJson) : null;
const initialState: IUnitGroupState = {
    unitGroup: initialUnitGroup
}

export const slice = createSlice({
    name: storeName,
    initialState,
    reducers: {

        storeUnitGroup: (state: IUnitGroupState, action: PayloadAction<UnitGroup>) => {
            state.unitGroup = action.payload;
            localStorageService.setItem(storeName, JSON.stringify(action.payload));
        },
        clearUnitGroup: (state: IUnitGroupState) => {
            state.unitGroup = null;
            localStorageService.removeItem(storeName);
        },
    }
});

export default slice.reducer;