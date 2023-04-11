import { React, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Index() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filters, showFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");
  const errorsArr = []
  function getListingData() {
    setLoading(true);
    const filterParams = new URLSearchParams({ page: page });
    const params = [
      { address: address },
      { city: city },
      { state: state },
      { country: country },
      { postal_code: zip },
      { start_date: startDate },
      { end_date: endDate },
      { rate_per_day: maxPrice },
      { max_guests: guests },
      { order_by: orderBy },
    ];
    for (const obj of params) {
      for (const [key, value] of Object.entries(obj)) {
        if (value) {
          if (key === "start_date" || key === "end_date") {
            filterParams.append(key, value.toLocaleDateString("fr-CA"));
          } else if (key === "rate_per_day" || key === "max_guests") {
            filterParams.append(key, parseFloat(value));
          } else {
            filterParams.append(key, value);
          }
        }
      }
    }
    console.log(...filterParams);
    fetch(`http://localhost:8000/properties/listings/search?${filterParams}`)
      .then((response) => response.json())
      .then((data) => {
        setListings(data.listings);
        setLoading(false);
      })
      .then(error => {
        setListings([]);
        setLoading(false);
        const validationErrors = error.response.data.errors;
        console.log('Validation errors:', validationErrors);
      })
  }
  const toggleFilters = () => {
    showFilters(!filters);
  };
  useEffect(() => {
    getListingData();
  }, []);

  return (
    <>
      <Form>
        <Container style={{ marginTop: 35, paddingLeft: 0, paddingRight: 0 }}>
          <Form.Group className="mb-3 d-flex" id="searchRow">
            <Form.Control
              type="address"
              placeholder="Address"
              onChange={(address) => setAddress(address.target.value)}
            />
            <Form.Control
              type="address"
              placeholder="City"
              onChange={(city) => setCity(city.target.value)}
            />
            <Form.Control
              type="address"
              placeholder="State"
              onChange={(state) => setState(state.target.value)}
            />
            <Form.Control
              type="address"
              placeholder="Country"
              onChange={(country) => setCountry(country.target.value)}
            />
            <Form.Control
              type="address"
              placeholder="Zip"
              onChange={(zip) => setZip(zip.target.value)}
            />
            <Button variant="secondary" onClick={toggleFilters}>
              Filters
            </Button>
            <Form.Select onChange={(order) => setOrderBy(order.target.value)}>
              <option value="">Order by</option>
              <option value="rate_per_day">Rate Per Day</option>
              <option value="max_guests">Max Guests</option>
            </Form.Select>
            <Button variant="primary" type="submit" onClick={getListingData}>
              Search
            </Button>
          </Form.Group>
          {filters && (
            <Form.Group className="mb-3 d-flex" id="filterRow">
              <DatePicker
                wrapperClassName="datePicker"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
              />
              <DatePicker
                wrapperClassName="datePicker"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="End Date"
              />
              <Form.Control
                type="number"
                min={0}
                placeholder="Max Price"
                onChange={(price) => setMaxPrice(price.target.value)}
              />
              <Form.Control
                type="number"
                min={0}
                placeholder="No of Guests"
                onChange={(guests) => setGuests(guests.target.value)}
              />
            </Form.Group>
          )}
        </Container>
      </Form>
      {errorsArr && errorsArr.map((val) =>{
        <div>
          {val}
        </div>
      })}
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        listings.map((listing, index) => (
          <div key={index}>
            <p>Property ID: {listing.property_id}</p>
            <p>Address: {listing.address}</p>
            <p>City: {listing.city}</p>
            <p>State: {listing.state}</p>
            <p>Postal Code: {listing.postal_code}</p>
            <p>Country: {listing.country}</p>
            <p>Max Guests: {listing.max_guests}</p>
            <p>Amenities: {listing.amenities}</p>
            <p>Listing ID: {listing.listing_id}</p>
            <p>Start Date: {listing.start_date}</p>
            <p>End Date: {listing.end_date}</p>
            <p>Rate per Day: {listing.rate_per_day}</p>
          </div>
        ))
      )}
    </>
  );
}

export default Index;
