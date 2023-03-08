import React, { useState } from 'react';
import { storage, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const RequestItem = () => {
  const [item, setItem] = useState({
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
            name: item.name,
            description: item.description,
            price: item.price,
            quality: item.quality,
            merchant_note: item.merchant_note,
            imageUrl: imageUrl,
          });

          setItem({
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
        name: item.name,
        description: item.description,
        price: item.price,
        quality: item.quality,
        merchant_note: item.merchant_note,
        imageUrl: null,
      });

      setItem({
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

  return (
    <form>
      <h2>Request Item</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={addRequest} style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              image:
              <input type="file" name="image" onChange={handleChange} />
            </label>
            <br />
            <div style={{ marginLeft: '50px' }}>
              {item.imageUrl && <img src={item.imageUrl} alt="Uploaded item" style={{ maxWidth: '500px' }}/>}
            </div>
            <label style={{ alignSelf: 'flex-start' }}>
              price:
              <input type="number" name="price" value={item.price} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              item name:
              <input type="text" name="name" value={item.name} onChange={handleChange} required/>
            </label>
            <br />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              quality:
              <textarea name="quality" value={item.quality} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              item description:
              <textarea name="description" value={item.description} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start' }}>
              merchant note:
              <textarea name="merchant_note" value={item.merchant_note} onChange={handleChange} required/>
            </label>
            <br />
            <button type="submit" style={{backgroundColor: '#84ad97', borderRadius: '5px', padding: '10px', border: 'none', color: '#fff', cursor: 'pointer'}}>request item</button>
            <br />
          </div>
        </form>
      </div>
    </form>
  );
    
};

export default RequestItem;
