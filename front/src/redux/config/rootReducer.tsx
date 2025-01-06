import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import  menuSlice  from '../reducers/menuSlice';

const rootReducer = combineReducers({
    user: userSlice,
    menu: menuSlice
    
});

export default rootReducer;