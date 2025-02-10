import React, { useEffect, useState} from 'react';
import axios from 'axios';
import './UserOrders.css'; 
import Navbar from '../../Components/Navbar';

export default function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [regNo, setRegNo] = useState('');

    useEffect(() => {
        const storedRegNo = sessionStorage.getItem('reg_no');
            if (storedRegNo) {
            setRegNo(storedRegNo);
        }
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost/MiniProject/get_orders.php', { params: { reg_no: regNo } });
                setOrders(response.data);
            } catch (error) {
                console.error('There was an error fetching the orders!', error);
            }
        };

        if (regNo) { // Only fetch orders if regNo is available
            fetchOrders();
        }
    }, [regNo]);

    const calculateTotalPrice = (priceList) => {
        return priceList.reduce((total, price) => total + parseFloat(price), 0).toFixed(2);
    };

    const cancelOrder = async (order_id) => {
        try {
            const response = await axios.post('http://localhost/MiniProject/cancle_order.php', { order_id });
            if (response.data.message === "Order cancelled successfully!") {
                setOrders(prevOrders => prevOrders.filter(order => order.order_id !== order_id));
            } else {
                console.error('There was an error cancelling the order!');
            }
        } catch (error) {
            console.error('There was an error cancelling the order!', error);
        }
    };

    const canCancelOrder = (placedAt) => {
        const placedDate = new Date(placedAt);
        const currentDate = new Date();
        const timeDifference = (currentDate - placedDate) / (1000 * 60); // Difference in minutes
        return timeDifference <= 5;
    };

    return (
        <div className="Home">
            <Navbar />
            <div className="container">
                <h2>Your Orders</h2>
                {orders.length > 0 ? (
                    <div className="row">
                        {[...orders].reverse().map(order => {
                            const items = JSON.parse(order.items_list);
                            const quantities = JSON.parse(order.quantity_list);
                            const prices = JSON.parse(order.price_list);
                            const totalPrice = calculateTotalPrice(prices);
                            const orderTime = new Date(order.placed_at).toLocaleString();

                            return (
                                <div key={order.order_id} className="col-md-6">
                                    <div className="order-card">
                                        <h3>Order ID: {order.order_id}</h3>
                                        <p><strong>Stall Name:</strong> {order.stall_name}</p>
                                        <p><strong>Order Date:</strong> {order.order_date}</p>
                                        <p><strong>Order Time:</strong> {orderTime}</p>
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
                                        {canCancelOrder(order.placed_at) && (
                                            <button className="cancel-button" onClick={() => cancelOrder(order.order_id)}>Cancel Order</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>You have no orders.</p>
                )}
            </div>
        </div>
    );
}
