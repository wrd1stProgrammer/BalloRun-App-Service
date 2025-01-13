import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import  menuSlice  from '../reducers/menuSlice';
import  orderSlice  from '../reducers/orderSlice';

const rootReducer = combineReducers({
    user: userSlice,
    menu: menuSlice,
    order: orderSlice
    
});

export default rootReducer;