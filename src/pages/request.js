import React, { useState } from 'react';
import { storage, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const RequestItem = () => {
  const [item, setItem] = useState({
    buyer: '',
    name: '',
    description: '',
    price: 0,
    quality: '',
    merchant_note: '',
    imageUrl: null,
    image: null,
  });

  const handleChange = (event) => {
    if (event.target.name === 'image') {
      const file = event.target.files[0];
      setItem({ ...item, image: file, imageUrl: URL.createObjectURL(file) });
    } else {
      setItem({ ...item, [event.target.name]: event.target.value });
    }
  };

  const addRequest = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    if (item.image) {
      const storageRef = ref(storage, `item-images/${item.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, item.image);

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => console.error(error),
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add item data (including image URL) to Firestore
          const docRef = await addDoc(collection(db, 'requestListings'), {
            buyer: item.buyer,
            name: item.name,
            description: item.description,
            price: item.price,
            quality: item.quality,
            merchant_note: item.merchant_note,
            imageUrl: imageUrl,
          });

          setItem({
            buyer: '',
            name: '',
            description: '',
            price: 0,
            quality: '',
            merchant_note: '',
            imageUrl: null,
            image: null,
          });
        }
      );
    } else {
      // If no image was selected, just add item data to Firestore
      const docRef = await addDoc(collection(db, 'requestListings'), {
        buyer: item.buyer,
        name: item.name,
        description: item.description,
        price: item.price,
        quality: item.quality,
        merchant_note: item.merchant_note,
        imageUrl: null,
      });

      setItem({
        buyer: '',
        name: '',
        description: '',
        price: 0,
        quality: '',
        merchant_note: '',
        imageUrl: null,
        image: null,
      });
    }
  };

  /*
  <label style={{ alignSelf: 'flex-start' }}>
    price:
      <input type="number" name="price" value={item.price} onChange={handleChange} required style={{ transform: 'rotate(45deg)', background: '#e0e0e0', border: 'none', padding: '10px', borderRadius: '5px' }}/>
  </label>
  */

  return (
    <div>
      <br />
      <div style={{ background: 'linear-gradient(rgb(132, 173, 151), white)', borderRadius: '20px', padding: '20px', display: 'inline-block', justifyContent: 'center' }}>
      <h2>Request Item</h2>
      <Link to="/requestdisplay">Redirect to see requested items!</Link>
        <form onSubmit={addRequest} style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              your name:
              <textarea name="buyer" value={item.buyer} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              image:
              <input type="file" name="image" onChange={handleChange} />
            </label>
            <br />
            <div style={{ background: 'linear-gradient(gray, white)', borderRadius: '20px', padding: '20px', display: 'inline-block', justifyContent: 'center' }}>
              <div style={{ background: 'white' }}>
                <div style={{ marginLeft: '50px' }}>
                  {item.imageUrl && <img src={item.imageUrl} alt="Uploaded item" style={{ maxWidth: '500px' }}/>}
                </div>
              </div>
            </div>
            <label style={{ alignSelf: 'flex-start' }}> 
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                width: '80px',
                height: '80px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
              }}>
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  style={{
                    background: '#e0e0e0',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    transform: 'rotate(-45deg)',
                    width: 'calc(100% - 30px)',
                    height: 'calc(100% - 30px)',
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    fontSize: '16px',
                    textAlign: 'center',
                  }}
                  required
                />
              </div>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              item name:
              <textarea name="name" value={item.name} onChange={handleChange} required/>
            </label>
            <br />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              quality:
              <br />
              <textarea name="quality" value={item.quality} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              item description:
              <br />
              <textarea name="description" value={item.description} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              merchant note:
              <br />
              <textarea name="merchant_note" value={item.merchant_note} onChange={handleChange} required/>
            </label>
            <br />
            <button type="submit" style={{backgroundColor: '#84ad97', borderRadius: '5px', padding: '10px', border: 'none', color: '#fff', cursor: 'pointer'}}>request item</button>
            <br />
          </div>
        </form>
      </div>
      <br />
      <br />
    </div>
  );
    
};

export default RequestItem;
