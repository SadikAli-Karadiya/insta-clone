import React,{useState} from "react";
import "../css/signup.css";
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import action from '../redux/actions/action'
import {useDispatch} from 'react-redux'

function SignIn() {
  const dispatch = useDispatch();
  const usehistory = useHistory();
  const [res, setRes] = useState("");
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const setInput = (event) => {
    const { name, value } = event.target;

    setUserDetail((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const submitDetail = (event) => {
    event.preventDefault();
    axios
      .post("/signin", userDetail)
      .then((res) => {
        if (res.data.name){ 
          const name = res.data.name
          const _id = res.data._id
          localStorage.setItem("jwt",res.data.token)
          localStorage.setItem("USER", res.data.name)
          localStorage.setItem("USER_ID", res.data._id)
          localStorage.setItem("EXPIRY_DATE", (Date.now() + 86400000).toLocaleString() )
          dispatch(action({name, _id}))
          usehistory.push("/");
        } else {
          setRes(res.data);
        }
      })
      .catch((err) => {
        setRes(err);
      });

      // setUserDetail({
      //   email: "",
      //   password: "",
      // });

  };
  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-center ">
        <div className="signup_card d-flex flex-column align-items-center col-lg-4 col-md-6 col-sm-8">
          <h2
            className="mt-4 mb-4"
            style={{
              fontFamily: "Grand Hotel",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 40,
            }}
          >
            Instagram
          </h2>

          <div className="signup_card_body">
            <div className="">
              <input type="text" placeholder="Enter Email" name="email" onChange={setInput} value={userDetail.email} />
            </div>

            <div className="">
              <input type="password" placeholder="Enter Password" name="password" onChange={setInput} value={userDetail.password}/>
            </div>

            <div className="mt-3">
              <span
                style={{
                  fontSize: "13px",
                  color: "#666666",
                  cursor: "pointer",
                }}
              >
              <Link to='/resetpassword' className='text-dark text-decoration-none'>Forgot Password?</Link>
                
              </span>
            </div>

          <button className="btn btn-primary mt-3 w-75" onClick={submitDetail}>Sign in</button>
          <span className="pt-4" style={{ fontSize: "14px", color: "red" }}>
              {res}
          </span>

            <div className="mt-4">
              <span style={{ fontSize: "14px", color: "#666666"}}>
                Don't have an account?
                <Link exact to="/signup" className='text-decoration-none' style={{fontWeight:'600'}}>
                  {" "}
                  SignUp
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
