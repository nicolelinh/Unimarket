import React, { useState } from 'react';

const RequestItemPage = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // send the request item to the server for processing
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Request Item</h2>
      <div>
        <label htmlFor="itemName">Item Name:</label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="itemDescription">Item Description:</label>
        <textarea
          id="itemDescription"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="itemQuantity">Item Quantity:</label>
        <input
          type="number"
          id="itemQuantity"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RequestItemPage;
