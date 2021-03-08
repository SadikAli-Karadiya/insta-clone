const action = (message) =>({
    type: "USER",
    payload: message
})

export const deleteAction = () =>({
    type: 'LOGOUT',
})

// export const updateFollowersFollowings = (data) =>({
//     type: 'UPDATE_FOLLOWERS_FOLLOWINGS',
//     payload: {
//         followers: data.followers,
//         followings: data.followings
//     }
// })
export default action;