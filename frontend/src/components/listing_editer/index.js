import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import "./styles.css";

function ListingEditer(props) {
    const [listings, setListings] = useState([]);    
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newRate, setNewRate] = useState(10);
    const [error, setError] = useState("");

    function getListingData(){
        const filterParams = new URLSearchParams({
            property_id: props.property_id,
            page: 1,
        });
        fetch(`http://localhost:8000/properties/listings/search?${filterParams}`)        
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setListings(data.listings);
        })
    }

    function deleteListing(listing_id) {
        fetch(`http://localhost:8000/properties/${props.property_id}/listing/${listing_id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
        })
        .then(response => getListingData())
    }

    function addListing() {
        //first check that the dates don't overlap with any existing listings
        var overlap = false;
        listings.forEach(listing => {
            if (newStartDate < listing.end_date && newEndDate > listing.start_date) {
                overlap = true;
            }
        });

        if (overlap) {
            setError("The dates you entered have an overlap with an existing listing.");
        } else {
            const data = new FormData();
            data.append('start_date', newStartDate);
            data.append('end_date', newEndDate);
            data.append('rate_per_day', newRate);
            fetch(`http://localhost:8000/properties/${props.property_id}/listing/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: data,
            })
            .then(response => getListingData())
        }
    }

    useEffect(() => {
        getListingData();
    }, []);

    return (
        <>
        <div className="two-col underlined-div marginTop50">
            <p className="subtitles packed-text">Avaliability & Pricing</p>
        </div>

        <table className='fullWidth medium'>
            <thead>
                <tr className='underlined-div bold'>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Rate per day</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {listings.map((listing) => {
                    console.log("listing: " + listing)
                    return (
                        <tr className='small' key={listing.listing_id}>
                            <td>{listing.start_date}</td>
                            <td>{listing.end_date}</td>
                            <td>${listing.rate_per_day}</td>
                            <td><a className="orange-underline-button small" onClick={() => deleteListing(listing.listing_id)}>Delete</a></td>
                        </tr>
                    )
                })}                
                
                <tr>
                    <td><input className="small avaliability-input" type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)}></input></td>
                    <td><input className="small avaliability-input" type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)}></input></td>
                    <td><input className="small avaliability-input" value={newRate} onChange={(e) => setNewRate(e.target.value)}></input></td>
                    <td><a className="orange-underline-button small" onClick={() => 
                                                                            {addListing()
                                                                            setNewStartDate("")
                                                                            setNewEndDate("")
                                                                            setNewRate(10)
                                                                            }}>Add</a></td>
                </tr>
            </tbody>            
        </table>
        <p className='error'>{error}</p>
        </>
    )


}

export default ListingEditer;