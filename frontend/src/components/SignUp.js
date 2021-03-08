import React, { useState } from "react";
import "../css/signup.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const usehistory = useHistory();
  const [res, setRes] = useState("");
  const [userDetail, setUserDetail] = useState({
    name: "",
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
      .post("/signup", userDetail)
      .then((res) => {
        if (res.data == "SignUp successfully") {
          usehistory.push("/signin");
        } else {
          setRes(res.data);
        }
      })
      .catch((err) => {
        setRes(err);
      });
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
            <div className="mt-3">
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                value={userDetail.name}
                onChange={setInput}
              />
            </div>

            <div className="">
              <input
                type="text"
                placeholder="Enter Email"
                name="email"
                value={userDetail.email}
                onChange={setInput}
              />
            </div>

            <div className="">
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={userDetail.password}
                onChange={setInput}
              />
            </div>

            <button
              className="btn btn-primary mt-4 w-75"
              onClick={submitDetail}
            >
              Sign up
            </button>
            <span className="pt-4" style={{ fontSize: "14px", color: "red" }}>
              {res}
            </span>

            <div className="mt-4">
              <span style={{ fontSize: "14px", color: "#666666" }}>
                Already have an account?
                <Link exact to="/signin" className='text-decoration-none' style={{fontWeight:'600'}}>
                  {' '}
                  SignIn
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
