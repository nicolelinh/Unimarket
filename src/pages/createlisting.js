import React, { useEffect, useState } from "react";
import {collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import './tagsinput.css';
import Error from "../components/error";
import '../css/createlisting.css';

const Createlisting = () => {
    // grabs user data from local storage
    const currUser = window.localStorage.getItem('USER_EMAIL');
    // info needed to create listing
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState([]);
    const [imageURL, setImageURL] = useState([]);
    const [userTags, setUserTags] = useState([]);
    // static list of available tags user can choose from
    const [searchTags] = useState([
        "electronics", "books", "home", "furniture", "clothing & shoes", "pets", "music & movies", "video games", "school supplies"
    ]);

    useEffect(() => {
        // if no image has been uploaded, nothing will be previewed
        if (image.length < 1) return;
        const newImageURL = [];
        // adding image to array to save the URL
        image.forEach(img => newImageURL.push(URL.createObjectURL(img))); // creates temporary local source for img
        setImageURL(newImageURL);

        //photo was originally added to storage bucket here
    }, [image]);

    function onImageChange(e){
        setImage([...e.target.files]);
    }

    // sets tag user selected as "chosen" or "unchosen"
    function setSelectedTag(index) {
        const tagName = searchTags.filter((el, i) => i === index).toString();
        const clickedTag = document.getElementById(index);
        const clickedTagBG = window.getComputedStyle(clickedTag).backgroundColor;
        // if the tag is green, its currently selected, so clicking it will "unselect" it
        if (clickedTagBG === "rgb(46, 139, 87)") {
            console.log("removing tag: " + tagName + " from " + userTags);
            //remove selected tag from userTag list
            //const indexAt = userTags.findIndex((element) => element === tagName);
            const indexAt = userTags.indexOf(tagName);
            console.log(indexAt);
            setUserTags(userTags.filter((el, i) => i !== indexAt));
            // change background color so user knows its unselected
            clickedTag.style.backgroundColor="lightgray";
        } 
        // if the tag is gray, its currently not selected, so clicking it will "select" it
        else if (clickedTagBG === "rgb(211, 211, 211)") {
            console.log("adding tag: " + tagName);
            //add selected tag to userTag list
            setUserTags(userTags.concat(tagName));
            // change background color so user knows its selected
            clickedTag.style.backgroundColor="#2D564E";
            clickedTag.style.color="white";
        }
    }

    // making sure user only enters correct file types and not infinite long strings or insane prices...
    const validateData = async (e) => {
        e.preventDefault();
        console.log(userTags);

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
            const imgFileName = Date.now() + uploadFileName;
            const userImgRef = ref(storage, 'marketListings/' + imgFileName);
            const uploadTask = uploadBytesResumable(userImgRef, image[0]);
            uploadTask.on('state_changed',
            (snapshot) => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log("file at: ", downloadURL);
                    
                    // adding new document to collection
                    const docRef = await addDoc(collection(db, "marketListings"), {
                        title: title,
                        description: desc,
                        price: "$" + price,
                        seller: JSON.parse(currUser), // need to parse first or else string contains ""
                        photo: downloadURL,
                        photoFileName: imgFileName,
                        timeCreated: Timestamp.fromDate(new Date()),
                        tags: userTags, // this will either be empty if they didnt select any tags, or contains the tags that are highlighted "green"
                        views: 1
                    })
                    console.log("Document submitted successfully");
                    window.location.href='/listing-details/'+docRef.id; // on creation, redirect to the listing details user just created
                })
            })
            return true;
        }
        return false;
    }
    function cancel() {
        window.history.back();
    }

    const [email, setEmail] = useState(() => {
        // getting user details from local storage
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
    }, []);

    document.title="Create Listing";

    // if email is not empty, someone is signed in so it shows actual home page, NOT landing page
    if (email !== "") {
        return (
            <center>
            <div className="createlisting-background">
            <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
                <div className="createlisting-querycard">
                <div className="createlisting-title"><h2>Sell a Product</h2></div>
                <div className="row">
                    <div className="col">
                        {/* allows user to upload an image and will preview that image back to the user, this maps image saved to img element */}
                        { imageURL.map((imageSrc, index) => ( <img className="createlisting-jpeg" key={index} src={imageSrc}alt="something user uploaded"/> )) } 
                        <br></br>
                        <input className='createlisting-jpegbutton' id="userimg" type="file" onChange={onImageChange} required/>
                        <p>only files types "jpg, jpeg, png" allowed</p>
                    </div>
                    <div className="col">
                        <div>
                            {/* sets all listing details on change event of each input area */}
                            <form style={{marginTop:"40px" }} onSubmit={(event) => {validateData(event)}}>
                                <h5 className="createlisting-itemtitle">item title:</h5>
                                <input id="usertitle" type="text" placeholder="title"
                                onChange={(e)=>{setTitle(e.target.value)}} required/>
                                <br/><br/>
                                <h5>item description:</h5>
                                <textarea className='createlisting-description' id="userdesc" type="text" placeholder="description"
                                onChange={(e)=>{setDesc(e.target.value)}} required/>
                                <br/><br/>
                                <h5>item price:</h5>
                                <input  className="createlisting-itemprice" id="userprice" type="number" placeholder="your price"
                                onChange={(e)=>{setPrice(e.target.value)}} required/>
                                <br/><br/>
                                <h5>tags:</h5>
                                <div className="tags-input-container">
                                    { searchTags.map((tag, index) => (
                                        <div className="tag-item" id={index} key={index}>
                                            <span className="text" onClick={() => setSelectedTag(index)}>{tag}</span>
                                        </div>
                                    )) }
                                </div>
                                <br/><br/>
                                <button className='createlisting-buttons' type="submit">list item</button>
                            </form>
                            <br></br>
                            <button className='createlisting-buttons' onClick={() => cancel()}>cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
            </center>
        )
    } else {
        return(
            <Error/>
        )
    }
}

export default Createlisting;