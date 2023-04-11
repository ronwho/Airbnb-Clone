import React, {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        Restify 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ErrorMessage({ message }) {
  return (
    <Grid item xs={12}>
      <Alert severity="error">
        {message}
      </Alert>
    </Grid>

  );
}
function SuccessMessage({ message }) {
  return (
    <Grid item xs={12}>
      <Alert severity="success">
        {message}
      </Alert>
    </Grid>

);
}

const theme = createTheme();

export default function Signup() {
  
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    for (const [key, value] of Array.from(formData.entries())) {
      if (value === '') {
        formData.delete(key);
      }else{
        console.log(`${key}: ${value}`);
      }
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }


    fetch('http://localhost:8000/accounts/signup/', {
            method: 'POST',
            body: formData
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
          setSuccess("Account sucessfully created!")
          navigate('/login')
        })
        .catch(error => {       
            error.json().then(errorJson => {
                console.log("error:", errorJson);
                var errorMessage = "";
                for (var key in errorJson) {
                    errorMessage += errorJson[key] + "\n";
                }
                setError(errorMessage);
                setSuccess("")
            });
          });
        
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              {error && <ErrorMessage message={error}/>}
              {success && <SuccessMessage message={'Account successfully created!'}/>}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>


            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}