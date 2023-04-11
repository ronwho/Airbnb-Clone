
import React,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Restify
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ErrorMessage({ message }) {
    return (
        <Alert severity="error" sx={{mt:2}}>
          {message}
        </Alert>

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

export default function SignIn() {
    const navigate = useNavigate()
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorDNE, setErrorDNE] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      for (const [key, value] of Array.from(formData.entries())) {
        if (value === '') {
          formData.delete(key);
        }else{
          console.log(`${key}: ${value}`);
        }
      }

      fetch('http://localhost:8000/accounts/login/', {
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
            setErrorPassword("");
            setErrorUsername("");
            setErrorDNE("")
            localStorage.setItem('accessToken', data['access']);
            setSuccess("Logging you in!")
            navigate("/")
            window.location.reload();
          })
          .catch(error => {
              error.json().then(errorJson => {
                let passwordError = ''
                let usernameError = ''
                let accountDNE = ''
                  console.log("error:", errorJson);
                  if (typeof errorJson['username'] !== 'undefined'){
                      usernameError = errorJson['username'][0]
                  }
                  if (typeof errorJson['password'] !== 'undefined'){
                      passwordError = errorJson['password'][0]
                  }
                  if (typeof errorJson['detail'] !== 'undefined'){
                      accountDNE = errorJson['detail']
                  }
                  if (passwordError != ''){
                    setErrorPassword(passwordError)
                  }else{
                    setErrorPassword('')
                  }
                  if (usernameError != ''){
                    setErrorUsername(usernameError)
                  }else{
                    setErrorUsername('')
                  }

                  if (accountDNE != ''){
                    setErrorDNE(accountDNE)
                  }else{
                    setErrorDNE('')
                  }
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
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              error= {Boolean(errorUsername)}
              helperText={errorUsername}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              error= {Boolean(errorPassword)}
              helperText={errorPassword}
              autoComplete="current-password"
            />

            {errorDNE && <ErrorMessage message={errorDNE}/>}
            {success && <SuccessMessage message={success}/>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
            <Link href="/signup" variant="body2" sx={{m:1}}>
                {"Don't have an account? Create an account!"}
            </Link>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
