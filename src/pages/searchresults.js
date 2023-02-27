import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Searchresults = props => {
    // get user inputted search by parsing url
    const did = window.location.pathname.split("/")[2];
    did = did.replace(/_/g, ' ');
    
    document.title="Search Results";

    return (
        <div>
            <h3>Search Page??? </h3>
            <div className="listings-cont">
                        <h3 className="listings-title"><em>Search results for: {did}</em></h3>

                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                props?.map((data, i)=>(
                                    // only allow 4 listings per column by dividing col by 3
                                    <div className="col-3">
                                        <Listing
                                        title={data.title}
                                        description={data.description}
                                        price={data.price}
                                        photo={data.photo}
                                        docid={data.id}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                        
                    </div>
        </div>
    )
}

export default Searchresults;