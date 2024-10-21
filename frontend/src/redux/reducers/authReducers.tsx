import { 
	SET_CURRENT_USER, 
	LOG_OUT
} from "../actions/types"

const isEmpty = require("is-empty");

interface UserState {
  isAuthenticated: Boolean;
  user: object;
}

const initialState: UserState = {
    isAuthenticated: false, 
    user: {}
}

const userReducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };

    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };

    default:
      return state;
  }
};

export default userReducer;