import React, { useState, useEffect} from "react";
import MenuItem from '../../Components/MenuItem';
import Jumbotron from '../../Components/Jumbotron';
import Navbar from '../../Components/Navbar';
import FeedbackPage from "../Reviews/Feedback";
import './Menu.css';
import { Tab, Tabs } from 'react-bootstrap';
import header from "../../Images/yummyheader7.png";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { stallName } = location.state || {};

    const [cart, setCart] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [cartStallName, setCartStallName] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    const [regNo, setRegNo] = useState('');

    useEffect(() => {
        const storedRegNo = sessionStorage.getItem('reg_no');
            if (storedRegNo) {
            setRegNo(storedRegNo);
        }
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost/MiniProject/read_items.php');
                const yummyItems = response.data.filter(item => item.stall_name === stallName);
                setMenuItems(yummyItems);
            } catch (error) {
                console.error('There was an error fetching the menu items!', error);
            }
        };

        const fetchCartData = async () => {
            try {
                const response = await axios.get('http://localhost/MiniProject/get_cart.php', { params: { reg_no: regNo } });
                const cartData = response.data;

                if (cartData && cartData.items_list && cartData.quantity_list) {
                    const items = JSON.parse(cartData.items_list);
                    const quantities = JSON.parse(cartData.quantity_list);

                    if (Array.isArray(items) && Array.isArray(quantities)) {
                        const cart = items.reduce((acc, item, index) => {
                            acc[item] = quantities[index];
                            return acc;
                        }, {});
                        setCart(cart);
                        setCartStallName(cartData.stall_name);
                    } else {
                        setCart({});
                    }
                } else {
                    setCart({});
                }
            } catch (error) {
                console.error('There was an error fetching the cart data!', error);
            }
        };

        fetchMenuItems();
        fetchCartData();
    }, [regNo, stallName]);

    const handleUpdateCart = (itemName, quantity) => {
        if (cartStallName && cartStallName !== stallName) {
            setAlertMessage('You cannot add items from a different stall. Please clear your cart first.');
            return;
        }

        setCart(prevCart => ({
            ...prevCart,
            [itemName]: parseInt(quantity, 10)
        }));

        if (!cartStallName) {
            setCartStallName(stallName);
        }
    };

    const viewCart = () => {
        const filteredCart = Object.fromEntries(Object.entries(cart).filter(([_, qty]) => qty > 0));
        const items = Object.keys(filteredCart);
        const quantities = Object.values(filteredCart);
        const prices = items.map(itemName => {
            const menuItem = menuItems.find(item => item.item_name === itemName);
            return menuItem ? menuItem.price * filteredCart[itemName] : 0;
        });

        const cartData = {
            reg_no: regNo,
            items_list: items,
            quantity_list: quantities,
            price_list: prices,
            stall_name: stallName
        };

        axios.post('http://localhost/MiniProject/save_cart.php', cartData)
            .then(response => {
                navigate('/cart');
            })
            .catch(error => {
                console.error('There was an error saving the cart!', error);
            });
    };

    return (
        <>
        <Navbar/>
        <div className = "container">
            <Jumbotron title={stallName} tagLine=".............." backgroundImage={header} />
            <Tabs defaultActiveKey="menu" id="yummy-tabs" className="mb-3 transparent-tabs">
                <Tab eventKey="menu" title="Menu" >
                    <div className="row">
                        {menuItems.map(item => (
                            <div className="col-md-5" key={item.item_name}>
                                <MenuItem
                                    itemName={item.item_name}
                                    price={item.price}
                                    quantity={cart[item.item_name] || 0}
                                    updateCart={handleUpdateCart}
                                    stallName={stallName}
                                    cartStallName={cartStallName}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="container-fluid">
                        <p>
                            Hurry up! Your tummy is hungry <button onClick={viewCart}>View Cart</button>
                        </p>
                    </div>
                </Tab>
                <Tab eventKey="reviews" title="Reviews">
                    <div className="reviews">
                        <FeedbackPage reg_no={regNo} stallName={stallName} />
                    </div>
                </Tab>
            </Tabs>
            </div>
            {alertMessage && (
                <div className="alert alert-danger" role="alert">
                    {alertMessage}
                    <button type="button" className="close" onClick={() => setAlertMessage('')}>
                        <span>&times;</span>
                    </button>
                </div>
            )}
        </>
    );
}
