import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

export default function AdminOrders(props) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost/MiniProject/get_orders.php', { params: { stall_name: props.stallName } });
                setOrders(response.data);
            } catch (error) {
                console.error('There was an error fetching the orders!', error);
            }
        };

        fetchOrders();
    }, [props.stallName]);

    const calculateTotalPrice = (priceList) => {
        return priceList.reduce((total, price) => total + parseFloat(price), 0).toFixed(2);
    };

    return (
        <div className="Home">
            <div className="container">
                <h2>Orders for {props.stallName}</h2>
                {orders.length > 0 ? (
                    <div className="row">
                        {[...orders].reverse().filter(order => order.stall_name === props.stallName).map(order => {
                            const items = JSON.parse(order.items_list);
                            const quantities = JSON.parse(order.quantity_list);
                            const prices = JSON.parse(order.price_list);
                            const totalPrice = calculateTotalPrice(prices);

                            return (
                                <div key={order.order_id} className="col-md-6">
                                    <div className="order-card">
                                        <h3>Order ID: {order.order_id}</h3>
                                        <p><strong>Stall Name:</strong> {order.stall_name}</p>
                                        <p><strong>Order Date:</strong> {order.order_date}</p>
                                        <div>
                                            <h4>Items:</h4>
                                            <table className="order-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item}</td>
                                                            <td>{quantities[index]}</td>
                                                            <td>{parseFloat(prices[index]).toFixed(2)} /-</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <p className="total-price"><strong>Total Price: {totalPrice}/-</strong></p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No orders available.</p>
                )}
            </div>
        </div>
    );
}
