import React, {useState} from 'react'
import './styles.css';
import BasicInfoFields from '../../components/basic_info_fields/index.js';
import ImageEditFields from '../../components/image_edit_fields';

function CreateProperty() {
    const [property_name, setPropertyName] = useState('');
    const [description, setDescription] = useState(''); 
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');    
    const [postal_code, setPostalCode] = useState('');
    const [max_guests, setMaxGuests] = useState('');
    const [image_files, setImageFiles] = useState([]);
    const [image_urls, setImageUrls] = useState([]);
    const [amenities, setAmenities] = useState('');
    const [error, setError] = useState('');

    function handleSubmit() {    
        const data = new FormData();    
        data.append('name', property_name);
        data.append('description', description);
        data.append('address', address);        
        data.append('country', country);
        data.append('city', city);
        data.append('state', state);
        data.append('postal_code', postal_code);
        data.append('max_guests', max_guests);
        //if amentities don't end with a comma, add one
        var amentities_val = amenities;
        if (amenities[amenities.length - 1] !== ',') {
            amentities_val += ',';
        }
        data.append('amenities', amentities_val);
        //console.log("image file length:", image_files.length)
        for (let i = 0; i < image_files.length; i++) {            
            data.append('images', image_files[i]);
          }        
    
          for (let pair of data.entries()) {
            //console.log(pair[0]+ ', ' + pair[1]); 
          }
        
    
        fetch('http://localhost:8000/properties/create/', {
            method: 'POST',
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
            console.log("returned data:", data);
            setError("");
        })
        .catch(error => {            
            error.json().then(errorJson => {
                console.log("error:", errorJson);
                var errorMessage = "";
                for (var key in errorJson) {
                    errorMessage += key + ": " + errorJson[key] + "\n";
                }
                setError(errorMessage);
            });
        });
    
    }

    return(
    <div className='content-container'>
        <div className="two-col underlined-div">
            <p className="subtitles packed-text">Basic Information <span className='redColor'>(Mandatory)</span></p>            
        </div>
        <BasicInfoFields property_name={property_name} setPropertyName={setPropertyName} address={address} setAddress={setAddress} city={city} setCity={setCity} state={state} setState={setState} country={country} setCountry={setCountry} postal_code={postal_code} setPostalCode={setPostalCode} max_guests={max_guests} setMaxGuests={setMaxGuests} />

        <div className="two-col marginTop50">
            <p className="subtitles packed-text">Description</p>
        </div>
        <textarea className="small midTextBox" id="feedback" rows="5" cols="100" placeholder="Eg: A beautiful house with a great view" onChange={(e) => setDescription(e.target.value)}></textarea>

        <div className="two-col underlined-div margintop50">
            <p className="subtitles packed-text">Photos</p>            
        </div>
        <ImageEditFields image_files={image_files} setImageFiles={setImageFiles} image_urls={image_urls} setImageUrls={setImageUrls} />

        <div className="two-col marginTop50">
            <p className="subtitles packed-text">Amentities</p>        
        </div>
        <textarea className="small midTextBox" id="feedback" rows="5" cols="100" placeholder="Eg: TV, Wifi" onChange={(e) => setAmenities(e.target.value)}></textarea>

        <p className='error medium marginTop50'>{error}</p>
        <a className="gold-button medium" type="submit" onClick={() => handleSubmit()}>Create Property</a>
    </div>);
}



export default CreateProperty