import { useState } from "react";
import '../Login.scss'
import { Form, Button } from "react-bootstrap";
import { login } from "../actions/actions";
import { Navigate } from "react-router-dom";
import styled from "styled-components";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    await login(email, password);
    setEmail('');
    setPassword('');
  }

  const [view, setView] = useState('createAccount')

  const handleLoginViewClick = () => {
    setView('login');
  }

  const handleCreateAccountClick = () => {
    setView('createAccount')
  }

  const activeView = () => {
    switch (view) {
      case 'createAccount':
        return(
          <StyledLoginForm>
            <h2>Move with the World</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label for='email'>Email:</label>
                  <input type='text' id="email" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </li>
                <li>
                  <label for='password'>Password:</label>
                  <input type='text' id="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </li>
              </ul>
            </fieldset>
            <button onClick={handleClick}>Submit</button>
            <button type="button" onClick={handleLoginViewClick}>Already have an Account?</button>
          </StyledLoginForm>
        )
        case 'login':
          return(
            <StyledLoginForm>
              <h2>Move with the World</h2>
              <fieldset>
                <legend>Login</legend>
                <ul>
                  <li>
                    <label for='username'>Username:</label>
                    <input type='text' id="username" required></input>
                  </li>
                  <li>
                    <label for='email'>Email:</label>
                    <input type='text' id="email" required></input>
                  </li>
                  <li>
                    <label for='password'>Password:</label>
                    <input type='text' id="password" required></input>
                  </li>
                </ul>
              </fieldset>
              <button>Submit</button>
              <button type="button" onClick={handleCreateAccountClick}>Don't have an Account?</button>
            </StyledLoginForm>
          )
          default:
            return (
              <h1>hi</h1>
            )
    }
  }

  return(
    <>
    <section id="entry-page">
      {activeView()}
      {localStorage.token &&
      <Navigate to="/" replace={true}/>
    }
    </section>
    {/* <Form>
      <Form.Group className="mb-3" controlId="formBasicText">
        <Form.Label>Movement Title</Form.Label>
        <Form.Control type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicTextArea">
        <Form.Label>Movement Description</Form.Label>
        <Form.Control type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </Form.Group>
      
      <Button variant="primary" type="submit" onClick={handleClick}>
        Submit
      </Button>
    </Form>
    {localStorage.token &&
      <>
      <p>hi!</p>
      <Navigate to="/" replace={true}/>
      </>
    } */}

    </>
  )
}

const StyledFieldset = styled.fieldset`
  margin: auto auto;
`
const StyledLoginForm = styled.form`
  backgroundColor: rgba(255, 255, 255, 0.9)
`

export default Login;