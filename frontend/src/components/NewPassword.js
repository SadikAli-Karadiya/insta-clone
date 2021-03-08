import React,{useState} from "react";
import "../css/signup.css";
import {useHistory, useParams } from "react-router-dom";
import axios from 'axios';

function NewPassword() {
  const history = useHistory();
  const [res, setRes] = useState("");
  const [userPassword, setUserPassword] = useState('');
  const {token} = useParams();

  const setInput = (event) => {
    const newPassword = event.target.value;
    setUserPassword(newPassword)
  };

  const submitDetail = (event) => {
    event.preventDefault();
    axios.post('/newpassword',{userPassword, token})
    .then((res) => {
        
        if(res.data == 'New password saved successfull'){
            history.push('/signin')
        }
        else{
            setRes(res.data)
        }
        
    // if (res.data){
    //   usehistory.push("/signin");
    // } else {
    //   setRes(res.data);
    // }
    })
    .catch((err) => {
    setRes(err);
    });

  };
  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-center ">
        <div className="signup_card d-flex flex-column align-items-center mt-5 col-lg-4 col-md-6 col-sm-8">
          <h2
            className="mt-4 mb-4"
            style={{
              fontFamily: "Grand Hotel",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 40,
            }}
          >
          {/* <img src="https://img.icons8.com/ios/110/000000/private2.png"/> */}
          {/* <img src="https://img.icons8.com/ios/100/000000/key-security.png"/> */}
          <img src="https://img.icons8.com/ultraviolet/100/000000/key-security.png"/>
          {/* <img src="https://img.icons8.com/fluent/110/000000/key-security.png"/> */}
          {/* <img src="https://img.icons8.com/officel/100/000000/key-security.png"/> */}
          </h2>

          <div className="signup_card_body mt-3">
            <div className="">
              <input type="password" placeholder="Enter New Password" name="newPassword" onChange={setInput} value={userPassword} />
            </div>

          <button className="btn btn-primary mt-3 w-75 mb-4" onClick={submitDetail}>Update Password</button>
          <span className="mt-2 mb-3" style={{ fontSize: "14px", color: "red" }}>
              {res}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
