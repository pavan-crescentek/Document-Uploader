import { combineReducers } from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import LoginReducer from './auth/login/reducer';
import ProfileReducer from './auth/profile/reducer';

// documents
import DocumentReducer from './documents/reducer';

// UsersList
import UsersListReducer from './userList/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Profile: ProfileReducer,
  Document: DocumentReducer,
  UsersList: UsersListReducer,
});

export default rootReducer;
