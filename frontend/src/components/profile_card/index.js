import React, {useState, useEffect} from 'react'
import "../../generic_styles.css";
import "./styles.css";

function ProfileCard(props)
{
    const[username, setUserName] = useState('');
    const[first_name, setFirstName] = useState('');
    const[last_name, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[picture_url, setPictureUrl] = useState('');

    function setUser(){
        const query = new URLSearchParams();
        query.append("user_id", props.user_id);
        console.log(`http://localhost:8000/accounts/profile?${query}`)
        fetch(`http://localhost:8000/accounts/profile?${query}`,
        { method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
        })
        .then(response => response.json())
        .then(data => {
            setUserName(data.username);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPictureUrl("http://localhost:8000" + data.picture_url);
        })

    }

    useEffect(() => {
        setUser();
    }
    , [props]);

    if (props.create_time !== undefined) {
        return(
            <div className='flexDiv'>
            <img src={picture_url} alt="avatar" width="75px" height="75px" className="inline-icon"></img>
            <div className='marginleft20'>
              <p className="medium packed-text">{username}({first_name} {last_name})</p>
              <p className="small packed-text">{props.create_time.toLocaleString('en-US')}</p>
            </div>
            </div>
        )
    }

    return(
        <div className='flexDiv'>
        <img src={picture_url} alt="Unknown Avatar" width="75px" height="75px" className="inline-icon"></img>
        <div className='marginleft20'>
          <p className="medium packed-text">{username}({first_name} {last_name})</p>
          <p className="medium packed-text">{email}</p>
        </div>
        </div>
    );

}

export default ProfileCard;