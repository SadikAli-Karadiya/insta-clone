import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import "../css/createPost.css"

function CreatePost() {

    const history = useHistory()

    const [titleBodyDetail, setTitleBodyDetail] = useState({title:'',body:''});
    const [image, setImage] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState('');

    useEffect(()=>{
        if(imageUrl){
            axios.post("/createpost",{titleBodyDetail, imageUrl}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
            .then(res=>{
                if(res.data == 'post created'){
                    return history.push('/allposts')
                }
               setError(res.data);
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[imageUrl])

    const createPostData = (event) =>{
        const {name,value} = event.target;
        setTitleBodyDetail((prevData)=>{
            return {
                ...prevData,
                [name]:value
            }
        })
    }
    const SubmitPost = ()=>{

        if(!image || !titleBodyDetail.title || !titleBodyDetail.body){
           return setError('* All fields required')
        }
        const formData = new FormData;
        formData.append("file",image);
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
    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="create_post_div col-lg-7 col-md-8 col-sm-10 col-12">
                <div className="mb-4">
                    <h5>Create Post</h5>
                </div>
                <div>
                    <input type="text" placeholder="Title" className="inputText" name="title" onChange={createPostData} value={titleBodyDetail.title} />
                </div>
                <div>
                    <input type="text" placeholder="Body" className="inputText" name="body" onChange={createPostData} value={titleBodyDetail.body} />
                </div>
                <div className="chooseFile_button">
                    <input type="file" className="inputFile" name="image" id="file" onChange={(e)=> setImage(e.target.files[0])} />
                </div>
                    
                <button className="btn btn-primary mt-4" onClick={SubmitPost} style={{width:"100%"}}>POST</button>
                <label className="pt-3" style={{ fontSize: "14px", color: "red" }}>
              {error}
          </label>

            </div>
        </div>
    )
}

export default CreatePost
