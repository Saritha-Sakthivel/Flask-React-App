import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../auth';

const LoginPage = () => {
  const {register,handleSubmit,watch,reset,formState:{errors}}=useForm()

  const navigate=useNavigate()

  const loginUser=(data)=>{
    console.log(data)

    const requestOptions={
      method:"POST",
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(data)
    }
    fetch('/auth/login',requestOptions)
    .then(res=>res.json())
    .then(data=>{
      console.log(data.access_token)
      login(data.access_token)

      navigate('/')
    })

    reset()
  }

  return (
    <div className="container">
      <div className="form">
        <h1>Login</h1>
        <Form onSubmit={handleSubmit(loginUser)}>
        {/* <Form.Group>
            <Form.Label>UserName</Form.Label>
            <Form.Control
              type="text"
              placeholder="user name"
              {...register('username',{required:true, maxLength:25})}
            />
          </Form.Group>
          {errors.username && <p style={{color:"red"}}><small>Username is required</small></p>}
          <br></br> */}
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...register('email',{required:true, maxLenght:80})}  
            />
          </Form.Group>
          {errors.email && <p style={{color:"red"}}><small>Email is required</small></p>}
          <br></br>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register('password',{required:true,minLength:8})}
            />
          </Form.Group>
          {errors.username && <p style={{color:"red"}}><small>Password is required</small></p>}
          <br></br>
          <Button variant="primary" type="submit">
            Login
          </Button>
          <Form.Group>
            <small>Don't have an account? <Link to="/signup">create one</Link></small>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
