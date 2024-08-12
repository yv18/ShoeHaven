import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const LoginSignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({username:"",email:"",password:""});

  function loginToast(){
    toast.success("Welcome");
  }

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  }

  const login = async () => {
    try {
      const response = await fetch('https://shoehaven-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-email', formData.email); // Store user email
        loginToast();
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  }

  const signup = async () => {
    try {
      const response = await fetch('https://shoehaven-backend.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-email', formData.email); // Store user email
        loginToast();
        window.location.replace("/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to signup. Please try again.');
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler} /> : <></>}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

        {state === "Login" ?
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
          : <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>}

          <p className="loginsignup-login"> Admin Login <Link to="/Adminlogin" style={{ textDecoration: "none", color:"black" }}>Click here</Link></p>

      </div>
      <ToastContainer theme="dark" />
    </div>

  );
};

export default LoginSignup;
