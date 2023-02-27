import React, { useEffect, useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import { db } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Createlisting = () => {
    // grabs user data from local storage
    const currUser = window.localStorage.getItem('USER_EMAIL');
    // info needed to create listing
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState([]);
    const [imageURL, setImageURL] = useState([]);
    const [imgURL, setImgURL] = useState([]);

    useEffect(() => {
        // if no image has been uploaded, nothing will be previewed
        if (image.length < 1) return;
        const newImageURL = [];
        // adding image to array to save the URL
        image.forEach(img => newImageURL.push(URL.createObjectURL(img))); // creates temporary local source for img
        setImageURL(newImageURL);

        //TO-DO: Move this into addListing
        // adding image to firebase storage and creating img URL to add to firebase collection
        // var uploadFileName = image[0].name;
        // const storage = getStorage();
        // const userImgRef = ref(storage, 'marketListings/' + Date.now() + uploadFileName);
        // const uploadTask = uploadBytesResumable(userImgRef, image[0]);
        // uploadTask.on('state_changed',
        // (snapshot) => {
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //         console.log("file at: ", downloadURL);
        //         setImgURL(downloadURL);
        //         console.log(imgURL[0]);
        //     })
        // })
    }, [image]);

    function onImageChange(e){
        setImage([...e.target.files]);
    }

    async function validateData(e) {
        var allowedExtensions = ['jpeg', 'jpg', 'png'];
        var imgExt = document.getElementById('userimg').value.split('.').pop().toLowerCase();
        var titleLimit = document.getElementById('usertitle').value.length;
        var descLimit = document.getElementById('userdesc').value.length;
        var priceLimit = document.getElementById('userprice').value;
        var isValidImg = false;
        var isValidTitle = false;
        var isValidDesc = false;
        var isValidPrice = false;

        for (var curr in allowedExtensions) {
            if (imgExt === allowedExtensions[curr]) {
                isValidImg = true;
                break;
            }
        }

        if (!isValidImg) {
            alert('Allowed extensions are: *.' + allowedExtensions.join(', *.'));
        }
        
        if (titleLimit <= 40) {
            isValidTitle = true;
        } else {
            alert('Title character limit is 40 characters.');
        }

        if (descLimit <= 250) {
            isValidDesc = true;
        } else {
            alert('Description character limit is 250.');
        }

        if (priceLimit < 9999) {
            isValidPrice = true;
        } else {
            alert('Price limit is 9999.');
        }

        if (isValidImg && isValidTitle && isValidDesc && isValidPrice) {
            // adding image to firebase storage and creating img URL to add to firebase collection
            var uploadFileName = image[0].name;
            const storage = getStorage();
            const userImgRef = ref(storage, 'marketListings/' + Date.now() + uploadFileName);
            const uploadTask = uploadBytesResumable(userImgRef, image[0]);
            uploadTask.on('state_changed',
            (snapshot) => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("file at: ", downloadURL);
                    setImgURL(downloadURL);
                    console.log(imgURL[0]);
                })
            })
            console.log("inside validate data" + imgURL);
            //To-Do: move the code inside of addListing here instead of calling the function
            // so theres no issues with the photoURL being empty bc it didn't get a chance to post
            addListing(e)

        } else {
            return e; // needed?
        }
        
    }
    // adds listing to marketListings collection in database
    const addListing = async (e) => {
        e.preventDefault();

        try {
            // adding new document to collection
            console.log("inside add listing" + imgURL);
            const docRef = await addDoc(collection(db, "marketListings"), {
                title: title,
                description: desc,
                price: "$" + price,
                seller: JSON.parse(currUser), // need to parse first or else string contains ""
                photo: imgURL,
                timeCreated: Date().toLocaleString()
            })
            console.log("Document submitted successfully");
            window.location.href='/listing-details/'+docRef.id; // on creation, redirect to the listing details user just created
            
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    document.title="Create Listing";
    return (
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
            <div className="row">
                <div className="col">
                    {/* allows user to upload an image and will preview that image back to the user, this maps image saved to img element */}
                    { imageURL.map(imageSrc => <img src={imageSrc} width="300" height="300" />) } 
                    <br></br>
                    <input id="userimg" type="file" onChange={onImageChange} required/>
                    <p>only files types "jpg, jpeg, png" allowed</p>
                </div>
                <div className="col">
                    <div>
                        {/* sets all listing details on change event of each input area */}
                        <form style={{marginTop:"50px" }} onSubmit={(event) => {validateData(event)}}>
                            <h5>item title:</h5>
                            <input id="usertitle" type="text" placeholder="title"
                            onChange={(e)=>{setTitle(e.target.value)}} required/>
                            <br/><br/>
                            <h5>item description:</h5>
                            <textarea id="userdesc" type="text" placeholder="description"
                            onChange={(e)=>{setDesc(e.target.value)}} required/>
                            <br/><br/>
                            <h5>item price:</h5>
                            <input id="userprice" type="number" placeholder="your price"
                            onChange={(e)=>{setPrice(e.target.value)}} required/>
                            <br/><br/>
                            <button type="submit">list item</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Createlisting;