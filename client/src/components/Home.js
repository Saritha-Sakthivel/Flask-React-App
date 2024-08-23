import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import Recipe from './Recipe';

const LoggedInHome=()=>{
    const[recipes,setRecipes]=useState([]);
    const [show,setShow]=useState(false)
    const {register,reset,handleSubmit,setValue,formState:{errors}}=useForm()
    const [recipeId,setRecipeId]=useState(0);

    useEffect(
        ()=>{
            fetch('/recipes/recipes')
            .then(res=>res.json())
            .then(data=>{
                // console.log(data)
            setRecipes(data)
        })
            .catch(err=>console.log(err))
        },[]
    );

    const getAllRecipes=()=>{
        fetch('/recipes/recipes')
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
        setRecipes(data)
    })
        .catch(err=>console.log(err))

    }

    

    const closeModal=()=>{
        setShow(false)
    }

    const showModal=(id)=>{
        console.log("Hello"+id);
        setShow(true)
        setRecipeId(id)

        recipes.map(
            (recipe)=>{
                if(recipe.id==id){
                    // console.log(recipe)
                    setValue('title',recipe.title);
                    setValue('description',recipe.description);
                }
            }
        )
    }

    let token=localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const updateRecipe=(data)=>{
        console.log(data)
        
        
        const requestOptions={
            method:'PUT',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            },
            body:JSON.stringify(data)

        }
        fetch(`/recipes/recipe/${recipeId}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            const reload=window.location.reload()
            reload()
            closeModal()
            reset();
        })
        .catch(err=>console.log(err))

        console.log(token)

        console.log(recipeId)
    }

    const deleteRecipe=(id)=>{
        console.log(id)

        const requestOptions={
            method:'DELETE',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            }

        }

        fetch(`/recipes/recipe/${id}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            getAllRecipes()


        })
        .catch(err=>console.log(err))
    }

    return(
        <div className="recipes container">
            <Modal show={show}
            size="lg"
            onHide={closeModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(updateRecipe)}>
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
        </Modal.Body>
            </Modal>
            <h1>List of Recipes</h1>
            {
                recipes.map(
                    (recipe,index)=>(
                        <Recipe key={index} 
                        title={recipe.title} 
                        description={recipe.description} 
                        onClick={()=>{showModal(recipe.id)}}

                        onDelete={()=>{deleteRecipe(recipe.id)}}
                        />
                    )
                )
            }
        </div>
    )
}

const LoggedOutHome=()=>{
    return(
        <div className="home container">
        <h1>Welcome to Recipes</h1>
        <Link to='/signup' className='btn btn-primary'>Get Started</Link>
        </div>

    )
}

const HomePage=()=>{

    const [logged]=useAuth()

    return(
        <div>
        {logged?<LoggedInHome/>:<LoggedOutHome/>}
        </div>
    )
}


export default HomePage