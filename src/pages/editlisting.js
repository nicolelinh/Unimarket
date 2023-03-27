import React, { useEffect, useState } from "react";
import { updateDoc, Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

// will allow the user to edit a listing they've previously created
const Editlisting = () => {
    // get document id by parsing url
    const did = window.location.pathname.split("/")[2];
    // info needed to update listing
    const [t, setTitle] = useState("");
    const [d, setDesc] = useState("");
    const [p, setPrice] = useState("");
    const [i, setExistingURL] = useState("");
    const [details, setDetails] = useState([]);
    const [image, setImage] = useState([]);
    const [imageURL, setImageURL] = useState([]);

    useEffect(()=>{
        // grabs the single document from db based on the document ID
        // sets variables to current information thats in the listing, in case they dont make any changes
        const getDetails = async () => {
            const docRef = doc(db, "marketListings", did); // getting document reference 
            await getDoc(docRef).then((docData)=>{
                const newData = docData.data();
                setDetails(newData);
                setTitle(newData.title);
                setDesc(newData.description);
                setPrice(newData.price.split("$")[1]);
                setExistingURL(newData.photo);
            })
        }
        getDetails();
    }, []);

    // this will show the user the photo they chose
    useEffect(() => {
        // if no image has been uploaded, nothing will be previewed
        if (image.length < 1) return;
        const newImageURL = [];
        // adding image to array to save the URL
        image.forEach(img => newImageURL.push(URL.createObjectURL(img))); // creates temporary local source for img
        setImageURL(newImageURL);
    }, [image]);

    function onImageChange(e){
        setImage([...e.target.files]);
    }

    // making sure user only enters correct file types and not infinite long strings or insane prices...
    const validateData = async (e) => {
        e.preventDefault();

        var allowedExtensions = ['jpeg', 'jpg', 'png'];
        var imgExt = document.getElementById('userimg').value.split('.').pop().toLowerCase();
        var titleLimit = document.getElementById('usertitle').value.length;
        var descLimit = document.getElementById('userdesc').value.length;
        var priceLimit = document.getElementById('userprice').value;
        var isValidImg = false;
        var isValidTitle = false;
        var isValidDesc = false;
        var isValidPrice = false;

        // checking if file extension is valid, if they've uploaded a new photo
        if (image.length > 0) {
            for (var curr in allowedExtensions) {
                if (imgExt === allowedExtensions[curr]) {
                    isValidImg = true;
                    break;
                }
            }
    
            if (!isValidImg) {
                alert('Allowed extensions are: *.' + allowedExtensions.join(', *.'));
            }
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

        // if updating listing with new image
        if (isValidImg && isValidTitle && isValidDesc && isValidPrice) {
            console.log("new image has been chosen!");
            // delete old photo from storage
            const storage = getStorage();
            const photoRef = ref(storage, 'marketListings/'+details.photoFileName);
            console.log(details.photoFileName);
            // Delete the file
            //https://firebase.google.com/docs/storage/web/delete-files
            deleteObject(photoRef).then(() => {
                console.log("Photo deleted successfully!");
            }).catch((error) => {
                console.log("Error deleting photo: ", e);
            });

            // adding new image to firebase storage and creating img URL to add to firebase collection
            var uploadFileName = image[0].name;
            const imgFileName = Date.now() + uploadFileName;
            const userImgRef = ref(storage, 'marketListings/' + imgFileName);
            const uploadTask = uploadBytesResumable(userImgRef, image[0]);
            uploadTask.on('state_changed',
            (snapshot) => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log("file at: ", downloadURL);
                    console.log("title: "+t);
                    console.log("desc: "+d);
                    console.log("price: "+p);
                    // updating document in collection
                    await updateDoc(doc(db, "marketListings", did), {
                        title: t,
                        description: d,
                        price: "$" + p,
                        photo: downloadURL,
                        photoFileName: imgFileName,
                        timeUpdated: Timestamp.fromDate(new Date())
                    })
                    console.log("Document updated successfully");
                    window.location.href='/listing-details/'+did; // on update, redirect to the listing details user just created
                })
            })
            return true;

        } // if updating listing without new image
        else if(image.length === 0 & isValidTitle && isValidDesc && isValidPrice){
            console.log("inside updatelisting");
            try {
                console.log("title: "+t);
                console.log("desc: "+d);
                console.log("price: "+p);
                // updating document in collection
                await updateDoc(doc(db, "marketListings", did), {
                    title: t,
                    description: d,
                    price: "$" + p,
                    timeUpdated: Timestamp.fromDate(new Date())
                })
                console.log("Document updated successfully");
                window.location.href='/listing-details/'+did; // on update, redirect to the listing details user just created
                
            } catch (e) {
                console.error("Error updating document: ", e);
            }
            
            return true;   
        } else {
            console.log("invalid data!");
        }
        
        //return false;
    }

    function cancel() {
        window.history.back();
    }
    document.title="Edit Listing"

    return (
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
            <div className="row">
                <div className="col">
                    {/* shows original listing photo or new one if they uploaded one */}
                    { imageURL.length > 0 ? ( imageURL?.map((imageSrc, index) => (<img key={index} src={imageSrc} width="300" height="300" alt="something user uploaded"/>))) : (<img src={i} width="300" height="300" alt="something user uploaded"/>) } 
                    
                    <br></br>
                    <input id="userimg" type="file" onChange={onImageChange}/>
                    <p>only files types "jpg, jpeg, png" allowed</p>
                </div>
                <div className="col">
                    <div>
                        {/* sets all listing details on change event of each input area */}
                        <form style={{marginTop:"50px" }} onSubmit={(event) => {validateData(event)}}>
                            <h5>item title:</h5>
                            <input type="text" id="usertitle" placeholder={details.title} defaultValue={t}
                            onChange={(e)=>{setTitle(e.target.value)}} required />
                            <br/><br/>
                            <h5>item description:</h5>
                            <textarea type="text" id="userdesc" placeholder={details.description} defaultValue={d}
                            onChange={(e)=>{setDesc(e.target.value)}} required />
                            <br/><br/>
                            <h5>item price:</h5>
                            <input type="number" id="userprice" placeholder={details.price} defaultValue={p}
                            onChange={(e)=>{setPrice(e.target.value)}} required />
                            <br/><br/>
                            <button type="submit">re-list item</button>
                        </form>
                        <button onClick={() => cancel()}>cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editlisting;