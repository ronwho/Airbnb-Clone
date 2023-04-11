import React,{useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
// Referenced: https://github.com/mui/material-ui/tree/v5.11.16/docs/data/material/getting-started/templates/album

const theme = createTheme();

export default function Units() {
    const [dataList,setDataList] = useState([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [pageCount,setPageCount] = useState(10)
    const [statusQuery, setStatusQuery] = useState('all')
    const [orderByCategory, setOrderByCategory] = useState('none')
    const [reservationAction, setReservationAction] = useState(false)
    const [reservationTerminate, setReservationTerminate] = useState(false)
    const navigate = useNavigate()

    // Reservation dialogue states
    const [openTerminateDialogue, setOpenTerminateDialogue] = useState(false)
    const [openApproveCancelDialogue, setOpenApproveCancelDialogue] = useState(false)
    const [openDenyCancelDialogue, setOpenDenyCancelDialogue] = useState(false)
    const [openApprovePendingDialogue, setApprovePendingDialogue] = useState(false)
    const [openDenyPendingDialogue, setDenyPendingDialogue] = useState(false)

    const handlePageChange = (event, value) => {
        setPage(value);
      };


    // START Diaglogue box 

    // Terminate action
    const handleClickOpenTerminate = (event, value) => {
        setOpenTerminateDialogue(true);
      };
      
    const handleCloseTerminate = (event, value) => {
        setOpenTerminateDialogue(false);
    };

    // Approve cancel action
    const handleClickOpenApproveCancel = (event, value) => {
        setOpenApproveCancelDialogue(true);
      };
      
    const handleCloseApproveCancel = (event, value) => {
        setOpenApproveCancelDialogue(false);
    };

    // Deny cancel action
    const handleClickOpenDenyCancel = (event, value) => {
        setOpenDenyCancelDialogue(true);
      };
      
    const handleCloseDenyCancel = (event, value) => {
        setOpenDenyCancelDialogue(false);
    };
    
    // Approve pending action
    const handleClickOpenApprovePending = (event, value) => {
        setApprovePendingDialogue(true);
      };
      
    const handleCloseApprovePending = (event, value) => {
        setApprovePendingDialogue(false);
    };

    // Deny pending action
    const handleClickOpenDenyPending = (event, value) => {
        setDenyPendingDialogue(true);
      };
      
    const handleCloseDenyPending = (event, value) => {
        setDenyPendingDialogue(false);
    };

    // END Dialogue box 

    const handleQueryChange = (event) => {
        setStatusQuery(event.target.value);
    };
    
    const handleCategoryChange = (event) => {
        setOrderByCategory(event.target.value);
    };

    
    function requestReservationTermination(id){
        handleCloseTerminate()
        let request_url = 'http://localhost:8000/reservations/'.concat(id).concat('/terminate/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        if(reservationAction == false){
            setReservationAction(true)
        }else{
            setReservationAction(false)
        }
        
    }
    
    function requestReservationApproveCancel(id){
        handleCloseApproveCancel()
        let request_url = 'http://localhost:8000/reservations/cancellations/'.concat(id).concat('/approve/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        if(reservationAction == false){
            setReservationAction(true)
        }else{
            setReservationAction(false)
        }
        
    }

    function requestReservationDenyCancel(id){
        handleCloseDenyCancel()
        let request_url = 'http://localhost:8000/reservations/cancellations/'.concat(id).concat('/deny/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        if(reservationAction == false){
            setReservationAction(true)
        }else{
            setReservationAction(false)
        }
        
    }
    
    function requestReservationPendingApprove(id){
        handleCloseApprovePending()
        let request_url = 'http://localhost:8000/reservations/pending/'.concat(id).concat('/approve/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        if(reservationAction == false){
            setReservationAction(true)
        }else{
            setReservationAction(false)
        }
        
    }

    function requestReservationPendingDeny(id){
        handleCloseDenyPending()
        let request_url = 'http://localhost:8000/reservations/pending/'.concat(id).concat('/deny/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        if(reservationAction == false){
            setReservationAction(true)
        }else{
            setReservationAction(false)
        }
        
    }


    function getPropertyInfo(id){
        let request_url = 'http://localhost:8000/properties/'.concat(id).concat('/update/')
        // console.log(request_url)


        let res = fetch(request_url,{
            method:'GET',
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
            return data
        })

        return res

    }

    function getUsername(id){
        let request_url = 'http://localhost:8000/accounts/profile/'
        request_url = request_url.concat("?user_id=").concat(id)
        let res = fetch(request_url, {
            method: 'GET',
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
            return {'username':data.username}
        })

        return res
    }

    function getReservations(page){
        let request_url = 'http://localhost:8000/reservations/list/'
        console.log(orderByCategory)
        request_url = request_url.concat('?page=')
                                  .concat(page)
                                  .concat('&type=host')
                                  .concat('&status=')
                                  .concat(statusQuery)
                                  .concat('&sort_by=')
                                  .concat(orderByCategory)
        
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
            return response.json();
        })
        .then(data => {
            console.log('data:', data)
            setPageCount(Math.ceil(data.count/6))
            const promises = []
            for (let reservation of data.results) {
                delete Object.assign(reservation, {['reservation_id']: reservation['id'] })['id'];
                promises.push(getPropertyInfo(reservation.property))
            }
            Promise.all(promises)
            .then(properties => {
            const full_data_results = []
            for (let i = 0; i < data.results.length; i++) {
                properties[i].images = properties[i].images.map((url) => {
                    return "http://localhost:8000" + url})
                const newObj = Object.assign({}, data.results[i], properties[i])
                newObj.modified_date = newObj.modified_date.split("T")[0]
                let link = "/edit_property/".concat(newObj.property)
                newObj.link_to_property = link
                full_data_results.push(newObj)
            }
                return full_data_results
            })
            .then(full_data => {
                const promises = []
                for(let data of full_data){
                    promises.push(getUsername(data.user))
                }
                Promise.all(promises)
                .then(usernames => {
                   const full_data_with_usernames = []
                   for (let i=0;i<full_data.length;i++){
                    const newObj = Object.assign({},full_data[i],usernames[i])
                    let link = "/profile/".concat(newObj.user)
                    newObj.link_to_profile = link
                    full_data_with_usernames.push(newObj)
                   } 
                   setDataList(full_data_with_usernames)
                   setLoading(false)
                })
            }

            )
        })
        .catch( error =>{
            navigate("*")
        }
    )
    }

    useEffect(()=>{
        getReservations(page)
    },[page,statusQuery,orderByCategory,reservationAction, reservationTerminate])

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Hero unit */}
        <Typography variant="h3" sx={{m:5,display:'flex',justifyContent:'center'}}>
            My <HomeIcon fontSize='inherit'/> Units
        </Typography>
        
        <Box sx={{ m:2,display:'flex',justifyContent:'flex-end' }}>
            <FormControl sx={{width:'25%' ,mr:2}}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                label="Status"
                value={statusQuery}
                onChange={handleQueryChange} 
                >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'pending'}>Pending for Approval</MenuItem>
                <MenuItem value={'cancel_pending'}>Pending for Cancel</MenuItem>
                <MenuItem value={'approved'}>Approved Reservations</MenuItem>
                <MenuItem value={'completed'}>Past Reservations</MenuItem>
                <MenuItem value={'expired'}>Expired</MenuItem>
                <MenuItem value={'denied'}>Denied</MenuItem>
                <MenuItem value={'canceled'}>Canceled</MenuItem>
                <MenuItem value={'terminated'}>Terminated</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width:'25%'}}>
                <InputLabel id="demo-simple-select-label">Order by</InputLabel>
                <Select
                label="Order by"
                value={orderByCategory}
                onChange={handleCategoryChange} 
                >
                <MenuItem value={'none'}>None</MenuItem> 
                <MenuItem value={'modified_date'}>Modified Date</MenuItem>
                <MenuItem value={'start_date'}>Start Date</MenuItem>
                <MenuItem value={'end_date'}>End Date</MenuItem>
                <MenuItem value={'num_of_guests'}>Guests Number</MenuItem>
                
                </Select>
            </FormControl>
        </Box>
        <Container sx={{ py: 4 }} maxWidth="md">
        
            <Grid container spacing={4}>
                {!loading && dataList.map((card,index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                    {card.status == 'expired' && 
                        <Card
                            sx={{ backgroundColor:'lightgray',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.secondary">
                                Expired <HourglassBottomIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'pending' && 
                        <Card
                            sx={{ backgroundColor:'lightgoldenrodyellow',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.secondary">
                                Pending   <PendingActionsIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={handleClickOpenApprovePending} variant="contained" color="success" size="small">
                                <CheckCircleIcon sx={{mr:1}} fontSize='small'/>  Approve
                                </Button>
                                <Dialog
                                    open={openApprovePendingDialogue}
                                    onClose={handleCloseApprovePending}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Approving reservation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want approve {card.username}s reservation requeust for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationPendingApprove(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseApprovePending} >
                                        No
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Button onClick={handleClickOpenDenyPending} variant="contained" color="error" size="small">
                                <CancelIcon sx={{mr:1}} fontSize='small'/>  Deny
                                </Button>
                                <Dialog
                                    open={openDenyPendingDialogue}
                                    onClose={handleCloseDenyPending}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Denying reservation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to deny {card.username}s reservation request for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationPendingDeny(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseDenyPending} >
                                        No
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </CardActions>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'cancel_pending' && 
                        <Card
                            sx={{ backgroundColor:'lightsalmon',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.secondary">
                                Pending Cancel Request   <CancelScheduleSendIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={handleClickOpenApproveCancel} variant="contained" color="success" size="small">
                                <CheckCircleIcon sx={{mr:1}} fontSize='small'/>  Approve
                                </Button>
                                <Dialog
                                    open={openApproveCancelDialogue}
                                    onClose={handleCloseApproveCancel}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Approving cancellation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to cancel {card.username}s approved reservation for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationApproveCancel(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseApproveCancel} >
                                        No
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <Button onClick={handleClickOpenDenyCancel} variant="contained" color="error" size="small">
                                <CancelIcon sx={{mr:1}} fontSize='small'/>  Deny
                                </Button>
                                <Dialog
                                    open={openDenyCancelDialogue}
                                    onClose={handleCloseDenyCancel}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Denying cancellation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to deny {card.username}s cancellation request for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationDenyCancel(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseDenyCancel} >
                                        No
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </CardActions>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                            
                        </Card>
                    }
                    {card.status == 'approved' && 
                        <Card
                            sx={{ backgroundColor:'lightgreen',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.primary">
                                Approved   <CheckCircleOutlineIcon  sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                                <Typography>
                                    <PeopleAltIcon/> {card.num_of_guests}
                                </Typography>
                                </CardContent>
                            <CardActions>
                                <Button onClick={handleClickOpenTerminate} variant="contained" color="error" size="small">
                                    <CancelIcon sx={{mr:1}} fontSize='small'/>  Terminate 
                                </Button>
                                <Dialog
                                    open={openTerminateDialogue}
                                    onClose={handleCloseTerminate}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Terminating reservation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to terminate {card.username}&apos;s already approved reservation?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationTermination(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseTerminate} >
                                        No
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </CardActions>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'completed' && 
                        <Card
                            sx={{ backgroundColor:'lightskyblue',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.primary">
                                Completed   <CelebrationIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'terminated' && 
                        <Card
                            sx={{ backgroundColor:'ghostwhite',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.primary">
                                Terminated   <DeleteIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'canceled' && 
                        <Card
                            sx={{ backgroundColor:'orange',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.primary">
                                Canceled   <DoDisturbIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    {card.status == 'denied' && 
                        <Card
                            sx={{ backgroundColor:'tomato',height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography sx={{m:1,display:"flex",alignItems:"center",justifyContent:"center"}} variant="body2" color="text.primary">
                                Denied   <DoDisturbIcon sx={{ml:0.5}} fontSize='inherit' /> 
                            </Typography>
                            <CardMedia
                            component="img"
                            image={card.images[0]}
                            alt="property_photo"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                                <Link href={card.link_to_property} underline="hover" color="inherit">
                                    {card.name}
                                </Link>
                            </Typography>
                            <Typography sx={{mb:1}} variant="body2" color="text.secondary">
                                {card.city}, {card.state}
                            </Typography>
                            <Box sx={{backgroundColor:'white',
                                      display:'flex',
                                      justifyContent:'center',
                                      borderRadius:'16px',
                                      mb:1,
                                      mt:1}}>
                                <Typography >
                                    {card.start_date} <ArrowForwardIcon/> {card.end_date}
                                </Typography>
                            </Box>
                            <Typography>
                                Requested by:   
                                <Link href={card.link_to_profile} sx={{ml:0.5}}>
                                    {card.username}
                                </Link>
                            </Typography>
                            <Typography>
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <Typography sx={{ ml:1}} variant="caption">
                                Last modified: {card.modified_date}
                            </Typography>
                        </Card>
                    }
                    </Grid>
                ))}
            </Grid>
        </Container>
        <Box   sx={{
            marginTop: 8,
            marginBottom:10,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Pagination count={pageCount} page={page} onChange={handlePageChange} />
        </Box>
        {/* Footer */}
        {/* End footer */}
    </ThemeProvider>
    );
}