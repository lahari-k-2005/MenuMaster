import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordBoxOpen, setPasswordBoxOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [regNo, setRegNo] = useState('');

  const toggleDropdown = (event) => {
    event.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const togglePasswordBox = () => {
    setPasswordBoxOpen(!passwordBoxOpen);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    // try {
      const response = await fetch('http://localhost/MiniProject/update_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reg_no: regNo,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Password updated successfully');
      } else {
        setMessage(result.message || 'Error updating password');
      }
    // } catch (error) {
    //   setMessage('An error occurred. Please try again.');
    // }
  };

  useEffect(() => {
    const storedRegNo = sessionStorage.getItem('reg_no');
    if (storedRegNo) {
      setRegNo(storedRegNo);
    }
  }, []);

  return (
    <header>
      <div className="logo">Menu Master</div>
      <nav>
        <ul>
          <li><Link to="/Restaurants"><i className="fas fa-home"></i>Home</Link></li>
          <li className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">Profile</button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={togglePasswordBox}>Change Password</li>
              </ul>
            )}
          </li>
          <li><Link to="/userOrders">My Orders</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
      </nav>
      {passwordBoxOpen && (
        <div className="modal-overlay" onClick={togglePasswordBox}>
          <div className="password-box" onClick={(event) => event.stopPropagation()}>
            <form onSubmit={handleUpdatePassword}>
              <label>Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />
              <br />
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <br />
              <button type="submit">Update Password</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
