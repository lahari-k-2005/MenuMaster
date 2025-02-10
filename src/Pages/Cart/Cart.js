import React, { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);

    const [regNo, setRegNo] = useState('');

    
    useEffect(() => {
        const storedRegNo = sessionStorage.getItem('reg_no');
            if (storedRegNo) {
            setRegNo(storedRegNo);
        }
    }, []);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get('http://localhost/MiniProject/get_cart.php', { params: { reg_no: regNo } });
                setCartData(response.data);
            } catch (error) {
                console.error('There was an error fetching the cart data!', error);
            }
        };
        fetchCartData();
    }, [regNo]);

    

    const parseJSON = (data) => {
        try {
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData)) {
                return parsedData;
            } else {
                console.error('Parsed data is not an array:', parsedData);
                return [];
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return [];
        }
    };

    const placeOrder = async () => {
        if (!cartData) {
            console.error('No cart data available!');
            return;
        }

        const itemsList = parseJSON(cartData.items_list);
        const stallName = cartData.stall_name;

        try {
            const response = await axios.get('http://localhost/MiniProject/read_items.php', { params: { stall_name: stallName } });
            const menuItems = response.data;

            const itemsFromDifferentStalls = itemsList.some(item => !menuItems.some(menuItem => menuItem.item_name === item));

            if (itemsFromDifferentStalls) {
                setPopupVisible(true);
                return;
            }

            const orderData = {
                reg_no: regNo,
                items_list: itemsList,
                quantity_list: parseJSON(cartData.quantity_list),
                price_list: parseJSON(cartData.price_list),
                stall_name: stallName
            };

            const orderResponse = await axios.post('http://localhost/MiniProject/place_order.php', orderData);
            console.log('Order placed successfully:', orderResponse.data);
            setCartData(null);
            navigate('/userOrders');
        } catch (error) {
            console.error('There was an error placing the order!', error);
        }
    };

    return (
        <div className = "Home">
            <Navbar />
            <div className = "container">
            <h2>Your Cart</h2>
            {cartData ? (
                cartData.items_list && parseJSON(cartData.items_list).length > 0 ? (
                    <div>
                        <h3>Stall Name: {cartData.stall_name}</h3>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parseJSON(cartData.items_list).map((item, index) => (
                                    <tr key={index}>
                                        <td>{item}</td>
                                        <td>{parseJSON(cartData.quantity_list)[index]}</td>
                                        <td>{parseJSON(cartData.price_list)[index]} /-</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p>Total Price: {parseJSON(cartData.price_list).reduce((total, price) => total + price, 0).toFixed(2)}/-</p>
                        <button onClick={placeOrder}>Place Order</button>
                    </div>
                ) : (
                    <p>No items in the cart.</p>
                )
            ) : (
                <p>No items</p>
            )}

            {popupVisible && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Warning</h3>
                        <p>Items from different stalls cannot be ordered together. Please place separate orders for each stall.</p>
                        <button onClick={() => setPopupVisible(false)}>Close</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
