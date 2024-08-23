import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const SignupPage = () => {
  const { register, watch, handleSubmit, formState: { errors }, reset } = useForm();
  const [show,setShow]=useState(false)
  const [serverResponse,setServerResponse]=useState('')

  const submitForm = (data) => {
    // console.log(data.username);

    // console.log(data.email)
    // console.log(data.password)
    // console.log(data.confirmPassword)

    if(data.password === data.confirmPassword){

    const body={
      username:data.username,
      email:data.email,
      password:data.password
    }
    const requestOptions={
      method:"POST",
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(body)
    }

    fetch('/auth/signup',requestOptions)
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      setServerResponse(data.message)
      console.log(serverResponse)

      setShow(true)

    })
    
    .catch(err=>console.log(err))

    reset()
  }
  else{
    alert("Password do not match")
  }
  };

  const responseGoogle = (response) => {
    if (response.error) {
      console.error("Google Login Error:", response.error);
      return;
    }
    console.log("Google Login Success:", response);

    const body = {
      tokenId: response.tokenId
    };

    fetch('/auth/google-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setServerResponse(data.message);
      setShow(true);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <div className="form">
        {show?
        <>
        <h1>Sign Up</h1>
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
        
        <p>
          {serverResponse}
        </p>
        </Alert>
        </>
        :
        <h1>Sign Up</h1>

      }
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="User name"
              {...register("username", { required: true, maxLength: 25 })}
            />
            {errors.username && <span style={{ color: "red" }}><small>Username is required</small></span>}
            {errors.username?.type==="maxLength" && <span style={{ color: "red" }}><small>Max character should be 25</small></span>}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="User email"
              {...register("email", { required: true, maxLength: 88 })}
            />
            {errors.email && <span style={{ color: "red" }}><small>Email is required</small></span>}
            {errors.email?.type==="maxLength" && <span style={{ color: "red" }}><small>Max character should be 80</small></span>}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && <span style={{ color: "red" }}><small>Password is required</small></span>}
            {errors.password?.type==="minLength" && <span style={{ color: "red" }}><small>Password must be at least 8 characters</small></span>}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", { required: true, minLength: 8 })}
            />
            {errors.confirmPassword && <span style={{ color: "red" }}><small>Password confirmation is required</small></span>}
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form.Group>
          <Form.Group>
            <small>Already have an account? <Link to="/login">Login</Link></small>
          </Form.Group>
        </Form>
        <GoogleLogin
  clientId="YOUR_GOOGLE_CLIENT_ID"
  buttonText="Login with Google"
  onSuccess={responseGoogle}
  onFailure={responseGoogle}
  cookiePolicy={'single_host_origin'}
/>
      </div>
    </div>
  );
};

export default SignupPage;
