import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import "./styles.css";
import ImageViewer from "../../components/image_viewer/index.js";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import PriceViewer from '../../components/pricing_viewer';
import ProfileCard from '../../components/profile_card'
import Comment from '../../components/comment'

function ViewProperty() {
    const property_id = useParams().property_id;

    const [property_name, setPropertyName] = useState('');
    const [description, setDescription] = useState(''); 
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');    
    const [postal_code, setPostalCode] = useState('');
    const [max_guests, setMaxGuests] = useState('');    
    const [image_urls, setImageUrls] = useState([]);
    const [amenities, setAmenities] = useState('');
    const [comments, setComments] = useState({"reviews": [], "average_rating": 0});   
    const [owner_id, setOwnerId] = useState('');
    const [lastReservation, setLastReservation] = useState({});
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const [commentPage, setCommentPage] = useState(1);
    const [commentTotalPages, setCommentTotalPages] = useState(1);
    const [error, setError] = useState('');

    const rating = comments.average_rating;

    function handleErrors(error) {
        error.json().then(errorJson => {            
            var errorMessage = "";
            for (var key in errorJson) {
                errorMessage += key + ": " + errorJson[key] + "\n";
            }
            setError(errorMessage);
        });
    }

    function getPropertyData() {
        
        fetch(`http://localhost:8000/properties/${property_id}/update/`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
        })
        .then(response => {
            if(!response.ok) {
                throw response;
            }
            //console.log("success")
            return response.json();
        })
        .then(data => {
            console.log(data)
            setPropertyName(data.name);
            setDescription(data.description);
            setAddress(data.address);
            setCity(data.city);
            setState(data.state);
            setCountry(data.country);
            setPostalCode(data.postal_code);
            setMaxGuests(data.max_guests);
            //here we want to preppend the backend's base url to the image urls
            setImageUrls(data.images.map((url) => {
                return "http://localhost:8000" + url;
            }));
            //console.log(data.images);
            //console.log(typeof data.images);                     
            setAmenities(data.amenities);
            setOwnerId(data.owner_id);            
        })
        .catch(error => {
            handleErrors(error);
        });
    }

    function getComments() {
        const query = new URLSearchParams({
            property_id: property_id,
            page: commentPage,
            depth: 1
        }).toString();        

        fetch(`http://localhost:8000/comments/property_reviews?${query}`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },            
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setComments(data);
            setCommentTotalPages(data.pages);
        })
    }

    function getLastReservation() {
        fetch(`http://localhost:8000/comments/last_uncommented_reservation?property_id=${property_id}`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setLastReservation(data);
        })
    }

    function submitComment() {
        const data = new FormData();
        data.append('reservation_id', lastReservation.reservation_id);
        data.append('stars', stars);
        data.append('message', comment);
        
        fetch(`http://localhost:8000/comments/property_reviews/`,
        { method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data
        })
        .then(response => {
            if(response.ok) {
                getComments();
                getLastReservation();
            }
            else if(response.status === 400) {
                setError("Please enter a comment and rating.");
            }
        })
    }

    function incPage() {
        if (commentPage < commentTotalPages) {
            setCommentPage(commentPage + 1);
        }
    }

    function decPage() {
        if (commentPage > 1) {
            setCommentPage(commentPage - 1);
        }
    }
            


    useEffect(() => {       
        getPropertyData();
        getComments();
        getLastReservation();
    }, []);

    let add_comment = <></>
    if (lastReservation !== null && lastReservation !== undefined && lastReservation.reservation_id !== undefined) {
        add_comment = 
        <>
        <p className="small bottom20 top25">Rate and leave a comment for your last reservation from {lastReservation.start_date} to {lastReservation.end_date}?</p>
        <div className="vertical-aligned">
            <span className="small bold">Ratings: </span>
            <ReactStars count={5} onChange={(newRating) => setStars(newRating)} size={24} activeColor="#ffd700"/>
        </div>
       
        <div className="two-col justifyLeft">            
            <input className="reply-input" type="text" wrap="soft" placeholder="Add a comment..." id="replyBox" onChange={(e) => setComment(e.target.value)}/>
            <button className="small gold-button" id="replyButton" onClick={submitComment}>Add</button>
        </div>
        <p className="small warning">{error}</p>
        </>
    }
    else{
        add_comment = <></>
    }

    return (
        <div className="content-container">
            <p className="large_emphasis">{property_name}</p>
            <h4 id="addressText">{address}, {city}, {state}, {country} ({postal_code})</h4>
            <ImageViewer image_urls={image_urls}/>

            <div className="two-col marginTop50" id="info-and-rates">    

                <div id="general-info">
                    <div className="two-col underlined-div">                                                                               
                        <div className="vertical-aligned">
                            <p className="medium bold zero-bottom-margin marginright200">Max Guests: {max_guests}</p>
                            <span className="medium bold zero-bottom-margin">Average Rating: {rating}</span>
                            
                            
                        </div>                        
                    </div>

                    <p className="top25">{description}</p>

                    <p className="underlined-div subtitles">Amentities</p>
                    <p className="medium">{amenities}</p>

                    <p className="underlined-div subtitles">Contacts</p>
                    <ProfileCard user_id={owner_id}/>                   

                </div>


                <PriceViewer property_id={property_id} />               
            </div>

            <p className="underlined-div subtitles">Comments</p>
            {                
                comments.reviews.map((comment) => {                    
                    return <Comment key={comment.id} created_at={comment.created_at} id={comment.id} message={comment.message} user_id={comment.user_id} />
                })
            }            

            <div className="flex-spaced">
                <a className="small orange-underline-button" onClick={decPage}>Previous Comments</a>
                <span className="small bold">Page {commentPage} of {commentTotalPages}</span>
                <a className="small orange-underline-button" onClick={incPage}>Next Comments</a>
            </div>

            {add_comment}
            
        </div>   
    
    );
}

export default ViewProperty;
