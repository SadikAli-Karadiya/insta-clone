import {React, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import '../css/profile.css'
import axios from 'axios';

function OtherUserProfile() {
    const [userProfile, setUserProfile] = useState({user:"", posts:""})
    const [just, setJust] = useState(1) // This is just to run useEffect when follow or unfollow btn pressed. So followers and following updates
    const [chngFollowUnfollowBtn, setChngFollowUnfollowBtn]  = useState()
    const{userId} = useParams()
    const currentUserId = localStorage.getItem('USER_ID')

    useEffect(()=>{
        axios.get(`/profile/${userId}`, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res) => {
            const {user, posts} = res.data

            if(user[0].followers.includes(currentUserId)){
                setChngFollowUnfollowBtn(true)
            }
            else(
                setChngFollowUnfollowBtn(false)
            )

            setUserProfile((prevData)=>{
                return{
                    ...prevData,
                    user: user[0],
                    posts
                }
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    },[just])

    const follow = (id) =>{
        const followId = id
        axios.put('/follow', {followId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}} )
        .then((res)=>{
            setJust(just+1)   // This is just to run useEffect when follow or unfollow btn pressed. So followers and following updates
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const unfollow = (id) =>{
        const unfollowId = id
        axios.put('/unfollow', {unfollowId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}} )
        .then((res)=>{
            setJust(just-1)
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    
    return (
        <>
            
            <div className="container mt-4">
                <div className="d-flex pl-5" style={{borderBottom:"1px solid lightgray"}}>
                
                    <div className='profile_img_div'>
                            <img src={userProfile.user.profilePic} width="100%" height="100%" />
                    </div>

                    <div className="profile_content_div">
                        <h1>{userProfile.user.name}</h1>
                        <h5>{userProfile.user.email}</h5>
                        <div className="d-flex mt-4">
                            <h6 className="pr-3">{userProfile.posts.length} Posts</h6>
                            <h6 className="pr-3">{userProfile.user.followers ? userProfile.user.followers.length : 0} Followers</h6>
                            <h6 className="pr-3">{userProfile.user.followings ? userProfile.user.followings.length : 0} Following</h6>
                        </div>                        
                    </div>

                    <div className=''>
                        {
                            chngFollowUnfollowBtn == true
                            ?
                                <button className='otherUserProfileFollow_btn btn btn-primary mt-1' onClick={()=>{unfollow(userProfile.user._id)}}>
                                    Unfollow
                                </button>
                            :
                                <button className='otherUserProfileFollow_btn btn btn-primary mt-1' onClick={()=>{follow(userProfile.user._id)}}>
                                    Follow
                                </button>
                        }
                    </div>
                </div>
                <div className="profile_gallery mt-4 mb-5">
                    <div className='profile_gallery_img_div'>
                         {
                            userProfile.posts?
                            userProfile.posts.map((data)=>{
                                
                                return(<>
                                    
                                    <img key={data._id} src={data.photo} height='240px' className='mt-4 col-lg-3 col-md-6 col-sm-8 col-10'  />
                                </>)
                            })
                            :
                            <h4 style={{'color':'rgb(191, 190, 189)', 'marginTop':'130px'}}>No Posts</h4>
                        } 
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default OtherUserProfile
