import { useParams } from "react-router-dom";
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
import { Alert, CardMedia } from '@mui/material';
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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom';
import Rating from "@mui/material/Rating";


const theme = createTheme()

export default function UserProfile(){
    const user_id = useParams().user_id;
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading,setLoading] = useState(true)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const [isFocused, setFocus] = useState(false)
    const [isFocusedPass, setFocusPass] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [open,setOpen] = useState(false)
    const [image, setImage] = useState(null)
    const [uploaded, setUploaded] = useState(false)
    const matches = useMediaQuery('(min-width:800px)');
    const navigate = useNavigate()

    function getUserData(){
        let formData = new FormData()
        let request_url = 'http://localhost:8000/accounts/profile/'.concat('?user_id=').concat(user_id)
        fetch(request_url, {
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

    useEffect(()=>{
        getUserData()
    },[])

return(
    <ThemeProvider theme={theme}>
        <CssBaseline>
        <Container maxWidth="lg">
            <Container sx={{ py: 10}}>
                <Grid container>
                    <Grid item md={4}>
                        <Card sx={{backgroundColor:'lightblue',p:2}}>
                            <CardMedia sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                            {image &&
                                <Avatar sx={{height:200,width:200}} alt="profile=picture" src={image}/>
                            }
                            {!image &&
                                <Avatar sx={{height:200,width:200}} alt="profile=picture"/>
                            }
                            </CardMedia>
                            <CardContent sx={{ flexGrow: 1}}>
                                <Box sx={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                                    <Typography variant="h6" component="h2">
                                            @{username}
                                    </Typography>
                                    {/* <Rating
                                    name="simple-controlled"
                                    /> */}
                                </Box>
                                <Typography variant="h6" component="h2">
                                    {firstName}&nbsp;{lastName}
                                </Typography>
                                <Typography variant="h6" component="h2">
                                    {email}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Container>
        </CssBaseline>
    </ThemeProvider>
  )
}
