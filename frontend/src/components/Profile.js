import {React, useEffect, useState} from 'react'
import '../css/profile.css'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadSharpIcon from '@material-ui/icons/CloudUploadSharp';

function Profile() {
    const [myPosts, setMyPosts] = useState([])
    const [userProfile, setUser] = useState({user:""})
    const [profilePic, setProfilePic] = useState(null)
    const [imageUrl, setImageUrl] = useState('')
    const currentUser = localStorage.getItem('USER')

    useEffect(()=>{
        axios.get('/mypost', {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res) => {
            const {posts, user} = res.data
            posts.map((data)=>{
                myPosts.push(data)   //setMyPosts
            })
            setUser((prevData)=>{
                return{
                    ...prevData,
                    user:user[0]
                }
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])

    useEffect(()=>{
        if(!imageUrl){
            return
        }
        axios.post('/uploadProfilePic', {imageUrl}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res) => {
            setUser((prevData)=>{
                return{
                    ...prevData,
                    user:res.data
                }
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    },[imageUrl])

    const uploadProfilePic = ()=>{

        if(!profilePic){
           return
        }
        const formData = new FormData;
        formData.append("file",profilePic);
        formData.append("upload_preset","insta-clone");
        formData.append("cloud_name","cloundssk");

        axios.post("https://api.cloudinary.com/v1_1/cloudssk/image/upload", formData)
        .then(res=>{
            setImageUrl(res.data.secure_url);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (id) =>{

        const itemId = id
        axios.post('/deletepost', {itemId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res)=>{
            setMyPosts(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    return (
        <>
            <div className="container mt-4">
                <div className="d-flex pl-5" style={{borderBottom:"1px solid lightgray"}}>
                    <div className='profile_img_div'>
                            <img src={userProfile.user.profilePic} width="100%" height="100%" />
                        <div className='profile_img_overlay'>
                            <input type='file' onChange={(e)=> setProfilePic(e.target.files[0])}></input>
                            <Button className='upload_btn text-white mr-3 mt-2' onClick={()=>uploadProfilePic()}>
                                <CloudUploadSharpIcon/> <span style={{textTransform:'lowercase', marginLeft:'5px'}}> upload</span>
                            </Button>                            
                        </div>
                    </div>
                    <div className="profile_content_div">
                        <h1>{currentUser}</h1>
                        <h5>{userProfile.user.email}</h5>
                        <div className="d-flex mt-4">
                            <h6 className="pr-3">{myPosts.length} Posts</h6>
                            <h6 className="pr-3">{userProfile.user.followers ? userProfile.user.followers.length : 0} Followers</h6>
                            <h6 className="pr-3">{userProfile.user.followings ? userProfile.user.followings.length : 0} Following</h6>
                        </div>
                    </div>
                </div>
                <div className="profile_gallery mt-4">
                    <div className='gallery_img_outerdiv'>
                        {
                            myPosts.length?
                            myPosts.map((data)=>{
                                return(
                                    <div className='gallery_img_innerdiv mb-2 mt-4 col-lg-3 col-md-6 col-sm-8 col-10'>
                                        <img key={data._id} src={data.photo} height='240px' width='100%'/>
                                        <div className='gallery_img_overlay'>
                                            <Button className='gallery_img_deleteBtn bg-dark' onClick={()=> deletePost(data._id)}>
                                                <DeleteIcon className='text-primary' />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <h4 style={{'color':'rgb(191, 190, 189)', 'marginTop':'130px'}}>You've Not Created Any Post</h4>
                        }
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Profile
