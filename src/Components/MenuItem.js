import React, { useState, useEffect } from "react";

const MenuItem = ({ itemName, price, quantity, updateCart, stallName, cartStallName }) => {
    const [count, setCount] = useState(quantity);

    useEffect(() => {
        setCount(quantity);
    }, [quantity]);

    const totalClicks = (num) => {
        // Check if the item is from a different stall
        if (cartStallName && cartStallName !== stallName) {
            alert('You cannot add items from a different stall. Please clear your cart first.');
            return; // Exit the function without updating the count
        }

        setCount(prevCount => {
            const newCount = prevCount + num > 0 ? prevCount + num : 0;
            updateCart(itemName, newCount);
            return newCount;
        });
    };

    return (
        <div className="item">
            <div className="item-content">
                <p>{itemName} <br /> <small>{price}/-</small></p>
            </div>
            <p>
                <button onClick={() => totalClicks(-1)}>-</button>
                <span>{count}</span>
                <button onClick={() => totalClicks(+1)}>+</button>
            </p>
        </div>
    );
};

export default MenuItem;
