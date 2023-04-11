import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('http://localhost:8000/accounts/logout/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch(error => console.log(error))
        .finally(() => {
          localStorage.clear();
          navigate("/")
          window.location.reload();
        });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <h1>Logging Out</h1>
  );
}

export default Logout;
