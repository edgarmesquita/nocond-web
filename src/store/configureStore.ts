import { combineReducers, configureStore } from '@reduxjs/toolkit';
import InterfaceReducer from './interface/reducer';
import UserReducer from './user/reducer';
import UnitReducer from './unit/reducer';

const reducer = combineReducers({
    interface: InterfaceReducer,
    user: UserReducer,
    unit: UnitReducer
})
export const store = configureStore({ reducer });