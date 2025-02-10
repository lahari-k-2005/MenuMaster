import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

function AdminItems(props) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ item_name: '', price: '' });
    const [editItem, setEditItem] = useState(null);
    const stallName = props.stallName; // Hardcoded to "Yummy"

    useEffect(() => {
        fetchItems();
    }, );

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost/MiniProject/read_items.php');
            const filteredItems = response.data.filter(item => item.stall_name === stallName);
            setItems(filteredItems);
        } catch (error) {
            console.error('There was an error fetching the items!', error);
        }
    };

    const handleCreate = async () => {
        // Input validation
        if (!newItem.item_name || !newItem.price) {
            alert('Please fill in both item name and price');
            return;
        }
        
        try {
            const newItemWithStall = { ...newItem, stall_name: stallName, is_in_menu: 1 };
            const response = await axios.post('http://localhost/MiniProject/create_item.php', newItemWithStall);
            console.log(response.data.message);
            fetchItems();
            setNewItem({ item_name: '', price: '' });
        } catch (error) {
            console.error('There was an error creating the item!', error);
        }
    };

    const handleUpdate = async () => {
        // Input validation
        if (!editItem.item_name || !editItem.price) {
            alert('Please fill in both item name and price');
            return;
        }

        try {
            const response = await axios.put('http://localhost/MiniProject/update_item.php', editItem);
            console.log(response.data.message);
            fetchItems();
            setEditItem(null);
        } catch (error) {
            console.error('There was an error updating the item!', error);
        }
    };

    const handleDelete = async (item_name) => {
        try {
            const response = await axios.delete('http://localhost/MiniProject/delete_item.php', { data: { item_name, stall_name: stallName } });
            console.log(response.data.message);
            fetchItems();
        } catch (error) {
            console.error('There was an error deleting the item!', error);
        }
    };

    return (
       <div className = "container">
            <div>
                <h3>Add New Item</h3>
                <div>
                <input
                    type="text1"
                    placeholder="Item Name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                />
                </div>
                <div>
                <input
                    type="number1"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                </div>
                <button onClick={handleCreate}>Add Item</button>
            </div>

            <div>
                <h3>Menu Items</h3>
                <ul>
                    {items.map((item) => (
                        <li key={item.item_name}>
                            {editItem && editItem.item_name === item.item_name ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editItem.item_name}
                                        onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={editItem.price}
                                        onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                    />
                                    <button onClick={handleUpdate}>Update</button>
                                    <button onClick={() => setEditItem(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    {item.item_name} - {item.price}/-
                                    <button onClick={() => setEditItem(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.item_name)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminItems;