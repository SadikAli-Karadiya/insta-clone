import React,{useState} from "react";
import "../css/signup.css";
import {useHistory } from "react-router-dom";
import axios from 'axios';

function ResetPassword() {
  const history = useHistory();
  const [res, setRes] = useState("");
  const [userEmail, setUserEmail] = useState('');

  const setInput = (event) => {
    setUserEmail(event.target.value)
  };

  const submitDetail = (event) => {
    event.preventDefault();
    const email = userEmail
    axios.put("/resetpassword", {email})
    .then((res) => {
      if (res.data == '* Check your email'){
        setUserEmail('')
      }
      setRes(res.data);
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
          <img src="https://img.icons8.com/dotty/110/000000/private2.png" />
          </h2>

          <div className="signup_card_body mt-3">
            <div className="">
              <input type="text" placeholder="Enter Email" name="email" onChange={setInput} value={userEmail} />
            </div>

          <button className="btn btn-primary mt-3 w-75 mb-4" onClick={submitDetail}>Reset Password</button>
          <span className="mt-2 mb-3" style={{ fontSize: "14px", color: "red" }}>
              {res}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
