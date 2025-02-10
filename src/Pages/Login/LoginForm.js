import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ title }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/MiniProject/login.php', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        if (response.data.type === 'student') {
          sessionStorage.setItem('reg_no', response.data.reg_no);
          navigate('/restaurants');
        } else if (response.data.type === 'vendor') {
          sessionStorage.setItem('stall_name', response.data.stall_name);
          navigate('/Adminhome');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>{title} Login</h1>
        <div className="input-box">
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
