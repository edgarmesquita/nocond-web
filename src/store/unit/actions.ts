import { AppThunk, RootState } from "..";
import { UnitGroup } from '../../unit/models';
import { slice } from "./reducer";

const { clearUnitGroup, storeUnitGroup } = slice.actions;

export const setStoreUnitGroup = (unitGroup: UnitGroup): AppThunk => dispatch => {
    dispatch(storeUnitGroup(unitGroup));
};

export const setClearUnitGroup = (): AppThunk => dispatch => {
    dispatch(clearUnitGroup());
};

export const getUnitGroup = (state: RootState) => state.unit.unitGroup;