import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';


const CreateRecipePage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createRecipe = (data) => {
    console.log(data);

    const token=localStorage.getItem('REACT_TOKEN_AUTH_KEY');
    console.log(token)
    reset(); // Reset the form after successful submission

    const requestOptions={
        method:'POST',
        headers:{
            'content-type':'application/json',
            'Authorization':`Bearer ${JSON.parse(token)}`
        },
        body:JSON.stringify(data)
    }

    fetch('/recipes/recipes',requestOptions)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        reset()
    })
       
    .catch(err=>console.log(err))
  };

  return (
    <div className="container">
      <h1>Create A Recipe</h1>
      <Form onSubmit={handleSubmit(createRecipe)}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            {...register('title', { required: true, maxLength: 25 })}
          />
        </Form.Group>
        {errors.title && <p style={{ color: "red" }}><small>Title is required</small></p>}
        {errors.title?.type === "maxLength" && <p style={{ color: "red" }}>Should not be more than 10 characters</p>}
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...register('description', { required: true, maxLength: 255 })}
          />
        </Form.Group>
        {errors.description && <p style={{ color: "red" }}><small>Description is required</small></p>}
        {errors.description?.type === "maxLength" && <p style={{ color: "red" }}>Should not be more than 255 characters</p>}
        <br />
        <Form.Group>
          <Button variant="primary" type="submit">Save</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default CreateRecipePage;
