
import React,{useState,useEffect,useRef} from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Card from '@mui/material/Card'
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom';

const theme = createTheme()

export default function EditProfile(){

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading,setLoading] = useState(true)
  const usernameRef = useRef(null)
  const passwordRef = useRef(null) 
  const passwordRef2 = useRef(null) 
  const [isFocused, setFocus] = useState(false)
  const [isFocusedPass, setFocusPass] = useState(false)
  const [isFocusedPass2, setFocusPass2] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [open,setOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const matches = useMediaQuery('(min-width:800px)');
  const navigate = useNavigate()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log('hello')
      let formData = new FormData()
      formData.append('picture',event.target.files[0])
      
      fetch('http://localhost:8000/accounts/profile/', {
      method: 'POST',
      body:formData,
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
        console.log("returned data:", data);
        setSuccess('Sucessfully edited profile!')
        if(uploaded == true){
          setUploaded(false)
        }else{
          setUploaded(true)
        }
      })
      .catch(error => {            
          error.json().then(errorJson => {
              console.log("error:", errorJson);
          });
      });
    }
   }

  const onImageDelete = () => {
    let formData = new FormData()
    formData.append('picture',null)
    
    fetch('http://localhost:8000/accounts/profile/', {
      method: 'POST',
      body:formData,
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
        console.log("returned data:", data);
        setSuccess('Sucessfully edited profile!')
        if(uploaded == true){
          setUploaded(false)
        }else{
          setUploaded(true)
        }
        document.getElementById('image_input').value=''
      })
      .catch(error => {            
          error.json().then(errorJson => {
              console.log("error:", errorJson);
          });
    });
   }

  function ErrorMessage({ message }) {
    return (
      <Grid sx={{width:'100%'}}>
        <Alert severity="error" sx={{mt:2}}>
          {message}
        </Alert>
      </Grid>
    );
  }

  
  function getUserData(){
    fetch('http://localhost:8000/accounts/profile/', {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }, 
    })
    .then(response => {
        if(!response.ok) {
            throw response;
        }
    //   console.log(response.json())
        return response.json();
    })
    .then(data=>{
      console.log('data:', data)
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setUsername(data.username)
      setPassword(data.password)
      setEmail(data.email)
      if(data.picture_url != null){
        setImage('http://localhost:8000' + data.picture_url)
      }else{
        setImage(null)
      }
      setLoading(false)
    })
  }

  const setInputFocus = (state,ref,setRef)=>{
    const notEmpty = !!ref.current?.value;

    if(notEmpty) return setRef(true)

    setRef(state)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    for (const [key, value] of Array.from(formData.entries())) {
      if (value === '') {
        formData.delete(key);
      }
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    fetch('http://localhost:8000/accounts/profile/', {
      method: 'POST',
      body:formData,
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
        console.log("returned data:", data);
        usernameRef.current.value = ''
        usernameRef.current.blur();
        setInputFocus(false,usernameRef,setFocus)
        passwordRef.current.value = ''
        passwordRef.current.blur();
        setInputFocus(false,passwordRef, setFocusPass)
        passwordRef2.current.value = ''
        passwordRef2.current.blur();
        setInputFocus(false,passwordRef2, setFocusPass2)
        getUserData();
        setError('')
        setOpen(true)
        setSuccess('Sucessfully edited profile!')
      })
      .catch(error => {            
          error.json().then(errorJson => {
              console.log("error:", errorJson);
              var errorMessage = "";
              for (var key in errorJson) {
                  errorMessage += errorJson[key] + "\n";
              }
              setError(errorMessage)
              setOpen(false)
              getUserData();
          });
      });
  }
  
  useEffect(() =>{
    getUserData();
  },[uploaded,image])

    
  return(
    <ThemeProvider theme={theme}>
        <CssBaseline>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{display:'flex',justifyContent:'center',mt:5}}>
            Your <AccountBoxIcon fontSize='inherit' sx={{ml:1,mr:1,mt:0.5}}/> Profile
          </Typography>
          
          {matches && <Box
          sx={{
              marginTop: 6,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent:'center',
          }}
          >
            <Box sx={{ mr:10,width:'100%', display:'flex',alignItems:'center', justifyContent:'center',flexDirection:'column'}}>
                <Typography fontWeight={'medium'} sx={{mb:3}} variant="h2">
                  {username}
                </Typography>
                {image &&
                  <Avatar sx={{height:300,width:300}} alt="profile=picture" src={image}/>
                }
                {!image &&
                  <Avatar sx={{height:300,width:300}} alt="profile=picture"/>
                }
                <Box sx={{display:'flex'}}>
                  <Button sx={{mt:2,mr:2}} variant="contained" component="label">
                    Upload
                    <input id="image_input" hidden accept="image/*" onChange={onImageChange} multiple type="file" />
                  </Button>
                {image &&
                  <Button sx={{mt:2}} variant="contained" onClick={onImageDelete} component="label">
                      Delete
                  </Button>
                }
                </Box>
            </Box>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container sx={{width:'60%'}} spacing={1}>  
                <Divider textAlign="left" sx={{mt:2}} style={{width:'100%'}}>
                  Edit Account Info
                </Divider>
              
                <TextField
                margin="normal"
                fullWidth
                id="username_id"
                label="New Username"
                name="username"
                autoComplete="username"
                inputRef={usernameRef}
                InputLabelProps={{shrink: isFocused}}
                onFocus={()=>setInputFocus(true,usernameRef,setFocus)}
                onBlur={()=>setInputFocus(false,usernameRef,setFocus)}
                />
                
                <TextField
                margin="normal"
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
                InputLabelProps={{shrink: isFocusedPass}}
                onFocus={()=>setInputFocus(true,passwordRef,setFocusPass)}
                onBlur={()=>setInputFocus(false,passwordRef,setFocusPass)}
                />

                <TextField
                margin="normal"
                fullWidth
                name="password2"
                label="Confirm New Password"
                type="password"
                id="password2"
                inputRef={passwordRef2}
                InputLabelProps={{shrink: isFocusedPass2}}
                onFocus={()=>setInputFocus(true,passwordRef2,setFocusPass2)}
                onBlur={()=>setInputFocus(false,passwordRef2,setFocusPass2)}
                />

                <Divider textAlign="left" sx={{mt:5}} style={{width:'100%'}}>
                  Edit Basic Info
                </Divider>

                {loading ? (
                  <CircularProgress />
                ) : (
                <TextField
                  margin="normal"
                  defaultValue= {firstName}
                  autoComplete="given-name"
                  name="first_name"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  />
                )}


                {loading ? (
                  <CircularProgress />
                ) : (
                <TextField
                  margin="normal"
                  fullWidth
                  id="lastName"
                  defaultValue= {lastName}
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  />
                )}

                {loading ? (
                  <CircularProgress />
                ) : (
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  defaultValue= {email}
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  />
                )}

                {error && <ErrorMessage message={error}/>}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 15 }}
                >
                  Edit
                </Button>

              </Grid>
            </Box>
          </Box>}
          {!matches && <Box
            sx={{
                marginTop: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center'
            }}
            >
              <Box sx={{ m:0,width:'100%', display:'flex',alignItems:'center', justifyContent:'center',flexDirection:'column'}}>
              {/* <Card> */}
                  <Typography sx={{mb:3}} variant="h2">
                    {username}
                  </Typography>
                  {image &&
                    <Avatar sx={{height:300,width:300}} alt="profile=picture" src={image}/>
                  }
                  {!image &&
                    <Avatar sx={{height:300,width:300}} alt="profile=picture"/>
                  }
                  <Button sx={{mt:2}} variant="contained" component="label">
                    Upload
                    <input hidden accept="image/*" onChange={onImageChange} multiple type="file" />
                  </Button>
                  {image && 
                    <Button sx={{mt:2}} onClick={onImageDelete} variant="contained" component="label">
                      Delete
                    </Button>
                  }
              </Box>
              {/* </Card> */}
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container sx={{width:'100%'}} spacing={1}>  
                  <Divider textAlign="left" sx={{mt:2}} style={{width:'100%'}}>
                    Edit Account Info
                  </Divider>
                
                  <TextField
                  margin="normal"
                  fullWidth
                  id="username_id"
                  label="New Username"
                  name="username"
                  autoComplete="username"
                  inputRef={usernameRef}
                  InputLabelProps={{shrink: isFocused}}
                  onFocus={()=>setInputFocus(true,usernameRef,setFocus)}
                  onBlur={()=>setInputFocus(false,usernameRef,setFocus)}
                  />
                  
                  <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  inputRef={passwordRef}
                  InputLabelProps={{shrink: isFocusedPass}}
                  onFocus={()=>setInputFocus(true,passwordRef,setFocusPass)}
                  onBlur={()=>setInputFocus(false,passwordRef,setFocusPass)}
                  />

                <TextField
                margin="normal"
                fullWidth
                name="password2"
                label="Confirm New Password"
                type="password"
                id="password2"
                inputRef={passwordRef2}
                InputLabelProps={{shrink: isFocusedPass2}}
                onFocus={()=>setInputFocus(true,passwordRef2,setFocusPass2)}
                onBlur={()=>setInputFocus(false,passwordRef2,setFocusPass2)}
                />
  
                  <Divider textAlign="left" sx={{mt:5}} style={{width:'100%'}}>
                    Edit Basic Info
                  </Divider>
  
                  {loading ? (
                    <CircularProgress />
                  ) : (
                  <TextField
                    margin="normal"
                    defaultValue= {firstName}
                    autoComplete="given-name"
                    name="first_name"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    />
                  )}
  
  
                  {loading ? (
                    <CircularProgress />
                  ) : (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="lastName"
                    defaultValue= {lastName}
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    />
                  )}
  
                  {loading ? (
                    <CircularProgress />
                  ) : (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    defaultValue= {email}
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    />
                  )}
  
                  {error && <ErrorMessage message={error}/>}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 15 }}
                  >
                    Edit
                  </Button>
  
                </Grid>
              </Box>
            </Box>}
        </Container>
                {success && 
                <Snackbar open={open} 
                autoHideDuration={1000}
                onClose={handleClose}
                anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
                  <Alert onClose={handleClose}>
                    {success}
                  </Alert>
                </Snackbar>
                }
        </CssBaseline>
    </ThemeProvider>
  )
}
