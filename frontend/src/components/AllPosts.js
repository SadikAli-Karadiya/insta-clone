import {React, useEffect, useState} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import axios from 'axios';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Parser from 'html-react-parser'

function AllPosts() {
    const [allPosts, setPosts] = useState([])
    const userId = localStorage.getItem('USER_ID')
    const currentUserName = localStorage.getItem('USER')
 
    useEffect(() => {
        axios.get("/allpost", {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res) =>{
            setPosts(res.data)
        })
        .catch((err) =>{
            console.log(err)
        });   

        
    },[])

    const likepost = (postId) =>{
        const itemId = postId
        axios.put('/like', {itemId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res)=>{
            const updatedPosts = allPosts.map((item) =>{
                if(res.data._id == item._id){
                    return res.data  //returning new post data
                }
                else{
                    return item  //returning post data as it was
                }
            })  
            setPosts(updatedPosts)          
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const unlikepost = (postId) =>{
        const itemId = postId
        axios.put('/unlike', {itemId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
        .then((res)=>{
            const updatedPosts = allPosts.map((item) =>{
                if(res.data._id == item._id){
                    return res.data
                }
                else{
                    return item
                }
            })  
            setPosts(updatedPosts) 
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const addComment = (text, itemId) =>{
        
        axios.put('/comment',{text, itemId}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}} )
        .then((res)=>{            
            const updatedPosts = allPosts.map((item) =>{
                if(res.data._id == item._id){
                    return res.data
                }
                else{
                    return item
                }
            })  
            setPosts(updatedPosts) 
        })
        .catch((error)=>{
            console.log(error)
        })
        return null
    }

    return (
        <>
            <div className="container-fluid">
                <div className="home_posts d-flex flex-column align-items-center mt-3"> 
                    { 
                        allPosts.length //if any posts
                        ?    
                            allPosts.map((post)=>{
                                return(
                                    <>
                                        <div className="card" key={post._id} style={{width:"380px", marginBottom:"30px", boxShadow:'1px 1px 2px'}}>
                                            <h4 className="p-2">
                                                <Link to={post.postedBy._id == userId ? '/profile' : `/profile/${post.postedBy._id}`} style={{textDecoration:'none',color:'black'}}>{post.postedBy.name==currentUserName?'Me':post.postedBy.name}
                                                </Link>
                                            </h4>
                                            <img src={post.photo} height='470px' />
                                            <div className="card-body">
                                                <FavoriteIcon style={{color:"red"}} />
                                                {
                                                    post.likes.includes(userId) 
                                                    ?
                                                        // BlueWrapper is variable containing css written at the bottom of this component
                                                        <Button onClick={()=>{unlikepost(post._id)}} style={{'outline':'none'}}>
                                                            <BlueWrapper>  
                                                                <ThumbUpIcon/> 
                                                            </BlueWrapper>  
                                                        </Button>
                                                    :
                                                        <Button onClick={()=> likepost(post._id)} style={{'outline':'none'}} >
                                                            <BlackWrapper>
                                                                <ThumbUpIcon />
                                                            </BlackWrapper>
                                                        </Button>
                                                }
                                                <h6 style={{color:'green', marginLeft:'30px', marginBottom:'15px'}}>{post.likes.length} likes</h6>
                                                <h4 className="card-title">{post.title}</h4>
                                                <h6 className="card-text mb-4">{post.body}</h6>
                                                
                                                {
                                                    post.comments.map((comment) =>{
                                                        console.log(comment)
                                                        return (
                                                            <>
                                                                <h6 key={comment._id}>
                                                                    <span style={{fontWeight:'bold'}}>{comment.postedBy.nam}:</span>
                                                                    <span style={{color:'gray', marginLeft:'5px'}}>{comment.text}</span> 
                                                               </h6>
                                                            </>
                                                        )
                                                    })
                                                }
                                                <form onSubmit={(event)=>{
                                                    event.preventDefault();     
                                                    event.target[0].value = addComment(event.target[0].value, post._id) //function return null, so input field become empty after submitting
                                                    
                                                }}>
                                                    <input type="text" placeholder="Comment here" name='comment' style={{border:0, borderBottom:"1px solid lightgray", outline:"none", lineHeight:"35px"}} />
                                                </form>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        :
                        
                        <h2 style={{'color':'rgb(191, 190, 189)', 'marginTop':'250px'}}>No Posts Yet</h2>
                    } 
                </div>
            </div>
        </>
    )
}

export default AllPosts

const BlueWrapper = styled.div ` color:blue; `;
const BlackWrapper = styled.div ` color:black; `
