import React from 'react'
import './styles.css';

function BasicInfoFields(props) {

    return(         
        <>
        <div>
          <label className="medium marginRight10">Property Name:</label>
          <input className="edit-input" value={props.property_name} onChange = {(e) => props.setPropertyName(e.target.value)}></input>
        </div>   
        <div>
            <label className="medium marginRight80">Address:</label>
            <input className="edit-input" value={props.address} onChange = {(e) => props.setAddress(e.target.value)}></input>
        </div>
        <div>
            <label className="medium marginRight120">City:</label>
            <input className="edit-input" value={props.city} onChange = {(e) => props.setCity(e.target.value)}></input>
        </div>
        <div>
            <label className="medium marginRight110">State:</label>
            <input className="edit-input" value={props.state} onChange = {(e) => props.setState(e.target.value)}></input>
        </div>
        <div>
            <label className="medium marginRight80">Country:</label>
            <input className="edit-input" value={props.country} onChange = {(e) => props.setCountry(e.target.value)}></input>
        </div>
        <div>
            <label className="medium marginRight40">Postal Code:</label>
            <input className="edit-input" value={props.postal_code} onChange = {(e) => props.setPostalCode(e.target.value)}></input>
        </div>
        <div>
            <label className="medium marginRight45">Max Guests:</label>
            <input className="edit-input" value={props.max_guests} onChange = {(e) => props.setMaxGuests(e.target.value)}></input>
        </div>
        
        </>     
    );
}

export default BasicInfoFields;
