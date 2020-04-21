import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ownerLogin, userError, clearError } from "../slices/userSlice";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Card, Form, Button} from "react-bootstrap";

const OWNER_LOGIN = gql`
  mutation ownerLogin($email: String!, $password: String!) {
    ownerLogin(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default (props) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(state => state.user)
  const { from } = props.location.state || { from: { pathname: '/' } }
  const [status, setStatus] = useState({
    redirectRefs: props.state || false,
  });

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
    
  const formChange = (e) => {
    e.persist()
    setForm((prevState) => {
      return { ...prevState, [e.target.name] : e.target.value }
    })
  };

  const [loginOwner] = useMutation(OWNER_LOGIN)

  const submitForm = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    let {email, password} = form
    console.log(email, password)
    try {
      const feedback = await loginOwner({
        variables: {
          email,
          password
        }
      })
      const loginFeedback = feedback.data.ownerLogin
      await dispatch(ownerLogin(loginFeedback))
      setStatus({ redirectRefs: true })
      setIsLoading(false)
    } catch (err) {
      console.log('Error here', err)
      // await dispatch(userError(err.response.data))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    dispatch(clearError())
    // console.log('isLoading is now:', isLoading)
  }, [user.isAuthenticated]);

  // const formChange = (e) => {
  //     e.persist()
  //     setForm((prevState) => {
  //         return { ...prevState, [e.target.name] : e.target.value }
  //     })
  // };

  if (isLoading) {
    return <h1>Loading...</h1>
  } else if (status.redirectRefs === true) {
    console.log('Status redirect Refs is true', from)
    return <Redirect to={from} />
  } else if (user.authenticated) {
    console.log('Enter from user.authenticated')
    return <Redirect to='/' />
  } else {
    return (
      <>
        {user.error ? <p>{JSON.stringify(user.error)}</p> : ""}
        <div className="d-flex justify-content-center">
          <Card
            className="mt-5 p-4 shadow-sm  px-5"
            style={{ borderRadius: "0.5rem" }}
          >
            <div className="d-flex justify-content-center">
              <Card
                className="px-4 pt-2 rounded-pill"
                style={{ marginTop: "-3em" }}
              >
                <h4>Login Owner</h4>
              </Card>
            </div>
            <div className="mt-5">
              {props.location.state ? (
                <p>You must log in to view this page</p>
              ) : (
                ""
              )}
              <Form>
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={formChange}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={formChange}
                  />
                </Form.Group>
                <div className="text-center">
                  <Button variant="info" type="submit" className="mt-5" onClick={submitForm}>
                    Login
                  </Button>
                </div>
              </Form>
              <div className="mt-4">
                <span>Not a room owner? </span>
                <Button
                  onClick={() => props.history.push("/login-user")}
                  className="p-0"
                >
                  Click here
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  };
}