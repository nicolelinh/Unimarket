import React, { useState } from 'react';
import { storage, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../css/request.css';

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
    <div className='requestitem-padding1'>
      <br/>
      <div className='requestitem-content'>
      <h2>Request Item</h2>
      <Link className='requestitem-link' to="/requestdisplay">Redirect to see requested items!</Link>
        <div className='requestitem-padding2'>
        <form onSubmit={addRequest} style={{ display: 'flex', flexDirection: 'row' }}>
          <div class='col'>
            <br/>
            <label style={{ alignSelf: 'flex-start', padding: '10px' }}>
              your name:<br/> 
              <textarea className="requestitem-userinput"name="buyer" value={item.buyer} onChange={handleChange} required/>
            </label>
            <br/>
            <label style={{ alignSelf: 'flex-start', padding: '15px', paddingLeft: '60px' }}>
              image:
              <input className="requestitem-imagebtn" type="file" name="image" onChange={handleChange} />
            </label>
            <br/>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', display: 'inline-block', justifyContent: 'center' }}>
              <div style={{ background: 'white' }}>
                <div>
                  {item.imageUrl && <img src={item.imageUrl} alt="Uploaded item" style={{ maxWidth: '500px' }}/>}
                </div>
              </div>
            </div>
            <br/>
            <label style={{ alignSelf: 'flex-start' }}> 
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(-225deg, rgba(61, 114, 125, 0.7) 15.43%, rgba(214, 204, 181, 0.7) 72.66%)',
                borderRadius: '5px',
              }}>
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    transform: 'rotate(-45deg)',
                    width: 'calc(100% - 30px)',
                    height: 'calc(100% - 30px)',
                    position: 'absolute',
                    top: '12px',
                    left: '22px',
                    fontSize: '16px',
                    textAlign: 'center',
                    color: 'white'
                  }}
                  required
                />
              </div>
            </label>
            <br/>
            <label style={{ alignSelf: 'flex-start', padding: '15px' }}>
              item name:<br/>
              <textarea className="requestitem-userinput" name="name" value={item.name} onChange={handleChange} required/>
            </label>
            <br />
          </div>
          <div class='col'>
            <br />
            <label style={{ alignSelf: 'flex-start', padding: '15px'  }}>
              quality:
              <br />
              <textarea className="requestitem-userinput" name="quality" value={item.quality} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start', padding: '15px'  }}>
              item description:
              <br />
              <textarea className="requestitem-userinput" name="description" value={item.description} onChange={handleChange} required/>
            </label>
            <br />
            <label style={{ alignSelf: 'flex-start', padding: '15px'  }}>
              merchant note:
              <br />
              <textarea className="requestitem-userinput" name="merchant_note" value={item.merchant_note} onChange={handleChange} required/>
            </label>
            <br />
            <button className="requestitem-submit" type="submit">request item</button>
            <br />
          </div>
        </form>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
    
};

export default RequestItem;
