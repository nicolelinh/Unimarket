import React, { useEffect, useState } from "react";
import {collection, getDocs} from "firebase/firestore";
import test from '../images/nintendo-switch-console.png';
import './listing.css';
import { db } from '../firebaseConfig';

const Listing = () => {
    const [info, setInfo] = useState([]);

    window.addEventListener('load', () => {
        Fetchdata();
    });

    const Fetchdata = async () => {
        // db.collection('marketListings').get().then((querySnapshot) => {
        //     querySnapshot.forEach(element => {
        //         var data = element.data();
        //         setInfo(arr => [...arr, data]);
        //     });
        // })
        await getDocs(collection(db, "marketListings")).then((querySnapshot)=>{
            const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
            setInfo(newData);
            console.log(info, newData);
        })
        
    }
    useEffect(()=>{
        Fetchdata();
    }, [])

    return (
        <div class="card card-spacing" style={{"width": "18rem"}}>
            <img src={test} class="card-img-top" alt="..."/>
            <div class="card-body">
                {
                    info?.map((data, i)=>(
                        <div>
                        <div class="card-title diamond-shape"><h5 className="listing-price">{ data.price }</h5></div>
                        <p class="card-text">{ data.description }</p>
                        <a href="#" >{data.title}</a>
    
                        </div>
                    ))
                }
            </div>
        </div>
        
    );
}

// const Frame = ({title, description, price}) => {
//     console.log(title + " " + description + " " + price);
//     return (
//         <div>
//                 <div class="card-title diamond-shape"><h5 className="listing-price">{ price }</h5></div>
//                 <p class="card-text">{ description }</p>
//                 <a href="#" >{title}</a>
//         </div>
//     );
// }

export default Listing;