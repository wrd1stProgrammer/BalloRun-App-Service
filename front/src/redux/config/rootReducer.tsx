import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import  menuSlice  from '../reducers/menuSlice';
import  orderSlice  from '../reducers/orderSlice';
import  locationSlice  from '../reducers/locationSlice';
import chatSlice  from '../reducers/chatSlice';

const rootReducer = combineReducers({
    user: userSlice,
    menu: menuSlice,
    order: orderSlice,
    location: locationSlice,
    chat: chatSlice,
});

export default rootReducer;