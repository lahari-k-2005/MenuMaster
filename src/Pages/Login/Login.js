import React from 'react';
import LoginForm from './LoginForm';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Login() {
  return (
    <div className="container full-screen-container">
      <div className="row1 justify-content-center align-items-center full-screen-row">
        <div className="col-md-5 col-12 custom-gap"> 
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
