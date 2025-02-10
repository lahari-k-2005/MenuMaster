import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import AdminItems from './AdminItems';
import AdminOrders from './AdminOrders';
import AdminReviews from './AdminReviews';
import './AdminPage.css'; // Import the custom CSS

function AdminHome() {
  const [stallName, setStallName] = useState('');

  useEffect(() => {
    const storedStallName = sessionStorage.getItem('stall_name');
    if (storedStallName) {
      setStallName(storedStallName);
    }
  }, []);

  return (
    <div className="Admin">
      <h2>Admin Page for {stallName}</h2> {/* Display stall name */}
      
      <div className="container">
        <Tabs defaultActiveKey="items" id="admin-tabs" className="mb-3 transparent-tabs">
          <Tab eventKey="items" title="Items">
            <AdminItems stallName={stallName} />
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <AdminOrders stallName={stallName} />
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <AdminReviews stallName={stallName} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminHome;
