import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import "./styles.css";

function PriceViewer(props){
    const [price, setPrice] = useState("NA");
    const [startDate, setStartDate] = useState("NA");
    const [endDate, setEndDate] = useState("NA");
    const [num_guests, setNumGuests] = useState(1);
    const [error, setError] = useState('');    
    const [success, setSuccess] = useState('');

    function getPriceHelper(previousPrice, start_date, end_date) {
        //check if the dates are the same
        if (start_date === end_date) {
            setPrice(previousPrice);
            return;
        }

        //otherwise, get the price for the start date, add to previous price, and call this function again with the next day
        const query = new URLSearchParams();
        query.append("start_date", start_date);
        query.append("end_date", start_date);
        query.append("property_id", props.property_id);
        query.append("date_inclusive", "true")
        query.append("page", 1)

        fetch(`http://localhost:8000/properties/listings/search?${query}`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },   
        })
        .then(response => response.json())
        .then(data => {            
            let newPrice = previousPrice + data.listings[0].rate_per_day;
            let newDate = new Date(start_date);
            newDate.setDate(newDate.getDate() + 1);
            let nextDate = newDate.toISOString().split('T')[0];
            getPriceHelper(newPrice, nextDate, end_date);
        })
        .catch(error => {
            setPrice("NA");
        });

    }

    function getPrice() {
        
        if(startDate === "NA" || endDate === "NA") {
            setPrice("NA");            
            return;
        }

        getPriceHelper(0, startDate, endDate);
    }

    function makeReservation() {
        if(startDate === "NA" || endDate === "NA") {
            setError("Please select a start and end date.");
            return;
        }

        if(price === "NA") {
            setError("The dates you selected are not available.");
            return;
        }

        const data = new FormData();
        data.append('start_date', startDate);
        data.append('end_date', endDate);
        data.append('num_of_guests', num_guests);
        data.append('property', props.property_id);

        fetch(`http://localhost:8000/reservations/reserve/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: data,
        })
        .then(response => {
            if (response.ok) {
                setSuccess("Reservation made successfully!");
                setError('');
            } else {
                throw response;
            }            
        })
        .catch(error => {            
            error.json().then(errorJson => {
                console.log("error:", errorJson);
                var errorMessage = "";
                for (var key in errorJson) {
                    errorMessage += key + ": " + errorJson[key] + "\n";
                }
                setError(errorMessage);
                setSuccess('');
            });
        });

    }


    useEffect(() => {        
        getPrice();
      }, [startDate, endDate]);

    function roundNumber(number) {
        const rounded = Number(number).toFixed(2);
        return rounded;
    }

    let priceInfo = <></>;
    if (price !== "NA" && startDate !== "NA" && endDate !== "NA") {
        const start = new Date(startDate);
        const end = new Date(endDate);       
        
        priceInfo = 
            <>
                <p className="small">Subtotal: ${roundNumber(price)}</p>
                <p className="small">Tax: ${roundNumber(price * 0.13)}</p>
                <p className="small" id="totalPrice">Total: ${roundNumber(price * 1.13)}</p>
            </>
    }

    return(
        <div id="pricing">
            <div id="pricing-container">
                <div id="priceText">
                    <span className="large_emphasis">${price}</span>                    
                </div>
                <form id="datepick-form">
                    <div id="input-fields">
                        <div>
                            <label className="medium">Check In:</label>
                            <input className="price-input" type="date" onChange={e => setStartDate(e.target.value)}></input>
                        </div>
                        <div>
                            <label className="medium">Check Out:</label>
                            <input className="price-input" type="date" onChange={e => setEndDate(e.target.value)}></input>
                        </div>
                    </div>
                        <div>
                            <label className="medium">Guests:</label>
                            <input className="price-input" type="number" min="1" value={num_guests} onChange={e => setNumGuests(e.target.value)}></input>
                        </div>
                        <p className="error">{error}</p>
                        <p className="success">{success}</p>
                        <div className="center-div">
                            <a className="medium gold-button" id="reserveButton" onClick={makeReservation}>Reserve</a>
                        </div>
                        {priceInfo}
                    
                </form>
            </div>
        </div>
    );
}

export default PriceViewer;

