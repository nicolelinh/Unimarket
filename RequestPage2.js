import React, { useState } from 'react';

const RequestItem = () => {
  const [item, setItem] = useState({ name: '', description: '', price: 0 });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(item);
    // Submit the item data to database
    setItem({ name: '', description: '', price: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Item Name:
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={item.price}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RequestItem;
