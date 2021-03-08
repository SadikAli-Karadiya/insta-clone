import React,{useState} from "react";
import { Switch, Route, NavLink, useHistory, Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Home from "./Home";
import AllPosts from './AllPosts'
import OtherUserProfile from './OtherUserProfile'
import ResetPassword from './ResetPassword'
import NewPassword from './NewPassword'
import "../css/navbar.css";
import CreatePost from "./CreatePost";
import {useSelector,useDispatch} from 'react-redux';
import * as actions from '../redux/actions/action';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import {FaUsers} from 'react-icons/fa';
import axios from 'axios'

function Navbar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentState = useSelector(state=> state);
  const [searchData, setSearchData] = useState([]);

  const searchUser = (data)=>{
    const searchQuery = data
    if(searchQuery==''){
      setSearchData()
    }
    axios.post('/search-user', {searchQuery}, {headers:{ Authorization:'Bearer ' + localStorage.getItem('jwt')}})
    .then(res=>{
      setSearchData(res.data)
    })
    .catch(error=>{
      console.log(error)
    })
    
  }

  const showAndHideLinks = () =>{
    if(currentState){
      return [
        <div className='search' key='0'>
          <input type="text" className='input_search' placeholder='search' onChange={(e)=>{searchUser(e.target.value)}}/>
          <div className='searchBox_div'>
            <table className='position-absolute bg-light w-100 text-center mt-4 border'> 
              {
                searchData 
                ?
                    searchData=='User not found'
                    ?
                      <tr>
                        <td>
                          <p>user not found</p>
                        </td>
                      </tr>
                    :
                      searchData.map((data)=>{
                        return(
                          <>
                            <tr className='border'>
                              <td  key={data._id}>
                                  {
                                    data._id==localStorage.getItem('USER_ID') 
                                    ? 
                                      null
                                    : 
                                      <Link to={`/profile/${data._id}`} className='searchedUser_link text-decoration-none'>
                                        {data.email}
                                      </Link>
                                  }
                              </td>
                            </tr>
                          </>
                        )
                      })
                : 
                  null
              }
            </table>
          </div>
        </div>,
        <NavLink exact activeClassName="navLinkActive" to="/" className="nav-link" key="1"><HomeOutlinedIcon style={{fontSize:'30px'}}/></NavLink>,
        <NavLink exact activeClassName="navLinkActive" to="/allposts" className="nav-link" key="2"><FaUsers style={{fontSize:'30px'}}/></NavLink>,
        <NavLink exact activeClassName="navLinkActive" to="/createpost" className="nav-link" key="3"><PostAddOutlinedIcon style={{fontSize:'30px'}}/></NavLink>,
        <NavLink exact activeClassName="navLinkActive" to="/profile" className="nav-link" key="4"><PersonOutlinedIcon style={{fontSize:'30px'}}/> </NavLink>,
        <button className="logout_btn mt-2 ml-2 font-weight-bold" key="5"
          onClick={()=>{
            localStorage.clear();
            dispatch(actions.deleteAction());
          }}>Logout
        </button>
        
      ]
    }
    
  }
  return (
    <>
      <div className="main_div container-fluid border-bottom">
        <div className="d-flex flex-row align-items-center justify-content-between">
          <h2
            style={{
              fontFamily: "Grand Hotel",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize:40,
              marginLeft:'20px'
            }}
          >
            Instagram
          </h2>
          <div className="nav w-100">
                                        {/* Can access reset password page without signin */}
            { currentState? history.push('/') : !history.location.pathname.startsWith('/resetpassword')?history.push('/signin'):null} 
              
            {showAndHideLinks()}
  
          </div> 
        </div>
      </div>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/createpost" component={CreatePost} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/allposts" component={AllPosts} />
        <Route exact path="/profile/:userId" component={OtherUserProfile} />
        <Route exact path="/resetpassword" component={ResetPassword} />
        <Route exact path="/resetpassword/:token" component={NewPassword} />
      </Switch>
    </>
  );
}

export default Navbar;
