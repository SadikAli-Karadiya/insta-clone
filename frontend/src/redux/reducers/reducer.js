const initialState = null
const reducer = (state = initialState, action) => {
    if(action.type == 'USER'){
        return action.payload
    }

    if(action.type == 'LOGOUT'){
        return null
    }

    // if(action.type == 'UPDATE_FOLLOWERS_FOLLOWINGS'){
    //     return{
    //         ...state,
    //         followers: action.payload.followers,
    //         followings: action.payload.followings
    //     }
    // }

    return state;
}

export default reducer
