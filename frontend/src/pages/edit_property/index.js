import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import BasicInfoFields from '../../components/basic_info_fields/index.js';
import ImageViewer from "../../components/image_viewer/index.js";
import ImageUploader from "../../components/image_uploader/index.js";
import ListingEditer from "../../components/listing_editer/index.js";
import { useParams } from "react-router-dom";

function EditProperty() {
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
    const [error, setError] = useState('');

    function handleErrors(error) {
        error.json().then(errorJson => {            
            var errorMessage = "";
            for (var key in errorJson) {
                errorMessage += key + ": " + errorJson[key] + "\n";
            }
            setError(errorMessage);
        });
    }

    function handleDeleteImage(image_url) {        
        //get rid of the leading http://localhost:8000
        image_url = image_url.substring(21);
        //console.log("delete_image:", image_url);
        const data = new FormData(); 
        data.append('delete_images', image_url);

        fetch(`http://localhost:8000/properties/${property_id}/update/`,
        { method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data
        })
        .then(response => getPropertyData())

    }

    //get property data from backend 
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
            return response.json();
        })
        .then(data => {
            console.log(data);
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
        })
        .catch(error => {
            handleErrors(error);
        });
    }

    function handleImageUpload(file) {
        const data = new FormData();
        data.append('update_images', file);

        fetch(`http://localhost:8000/properties/${property_id}/update/`,
        { method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data
        })
        .then(response => getPropertyData())
    }

    function handleSubmit() {
        const data = new FormData();
        data.append('name', property_name);
        data.append('description', description);
        data.append('address', address);
        data.append('city', city);
        data.append('state', state);
        data.append('country', country);
        data.append('postal_code', postal_code);
        data.append('max_guests', max_guests);
        var amentities_val = amenities;
        if (amenities[amenities.length - 1] !== ',') {
            amentities_val += ',';
        }
        data.append('amenities', amentities_val);

        fetch(`http://localhost:8000/properties/${property_id}/update/`,
        { method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data
        })
        .then(response => {
            if(!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            handleErrors(error);
        });
    }
    
    useEffect(() => {       
        getPropertyData();

    }, []);

    return(
        <div className='content-container'>
            <div className="two-col underlined-div">
                <p className="subtitles packed-text">Basic Information <span className='redColor'>(Mandatory)</span></p>            
            </div>
            <BasicInfoFields property_name={property_name} setPropertyName={setPropertyName} address={address} setAddress={setAddress} city={city} setCity={setCity} state={state} setState={setState} country={country} setCountry={setCountry} postal_code={postal_code} setPostalCode={setPostalCode} max_guests={max_guests} setMaxGuests={setMaxGuests} />

            <ListingEditer property_id={property_id} />

            <div className="two-col marginTop50">
                <p className="subtitles packed-text">Description</p>
            </div>
            <textarea className="small midTextBox" id="feedback" rows="5" cols="100" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

            <div className="two-col underlined-div margintop50">
                <p className="subtitles packed-text">Photos</p>            
            </div>
            
            <ImageViewer image_urls={image_urls} deleteImage={handleDeleteImage} />
            <ImageUploader property_id={property_id} image_urls={image_urls} setImageUrls={setImageUrls} handleFileUpload = {handleImageUpload}/>  
            
            <div className="two-col marginTop50">
                <p className="subtitles packed-text">Amentities</p>        
            </div>
            <textarea className="small midTextBox" id="feedback" rows="5" cols="100" value={amenities} placeholder="Eg: TV, Wifi" onChange={(e) => setAmenities(e.target.value)}></textarea>

            <p className="error">{error}</p>
            <a className="gold-button medium" type="submit" onClick={handleSubmit}>Save</a>
        </div>
    );

}

export default EditProperty;