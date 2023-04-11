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
import NightShelterIcon from '@mui/icons-material/NightShelter';
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
import DoDisturbIcon from "@mui/icons-material/DoDisturb"
import DeleteIcon from "@mui/icons-material/Delete"
import { useNavigate } from 'react-router-dom';
// Referenced: https://github.com/mui/material-ui/tree/v5.11.16/docs/data/material/getting-started/templates/album

const theme = createTheme();

export default function Reservations() {
    const [dataList,setDataList] = useState([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [pageCount,setPageCount] = useState(10)
    const [statusQuery, setStatusQuery] = useState('all')
    const [orderByCategory, setOrderByCategory] = useState('none')
    const [cancelRequest, setCancelRequest] = useState(false)
    const [openDialogue, setOpenDialogue] = useState(false)
    const [reservationAction, setReservationAction] = useState(false)
    const [openApproveCancelDialogue, setOpenApproveCancelDialogue] = useState(false)
    const navigate = useNavigate()

    const handlePageChange = (event, value) => {
        setPage(value);
      };

    const handleClickOpen = (event, value) => {
        setOpenDialogue(true);
      };
      
    const handleClose = (event, value) => {
        setOpenDialogue(false);
    };

    const handleQueryChange = (event) => {
        setStatusQuery(event.target.value);
    };
    
    const handleCategoryChange = (event) => {
        setOrderByCategory(event.target.value);
    };

    // Approve cancel action
    const handleClickOpenApproveCancel = (event, value) => {
        setOpenApproveCancelDialogue(true);
        };
        
    const handleCloseApproveCancel = (event, value) => {
        setOpenApproveCancelDialogue(false);
    };

    function requestReservationCancel(id){
        handleClose()
        let request_url = 'http://localhost:8000/reservations/'.concat(id).concat('/cancel/')
        fetch(request_url,{
            method:'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }, 
        })
        setCancelRequest(true)
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

    function getReservations(page){
        let request_url = 'http://localhost:8000/reservations/list/'
        console.log(orderByCategory)
        request_url = request_url.concat('?page=')
                                  .concat(page)
                                  .concat('&type=guest')
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
                    let link = "/view_property/".concat(newObj.property)
                    newObj.link_to_property = link
                    full_data_results.push(newObj)
                }
                console.log('full_data_results:', full_data_results)
                setDataList(full_data_results)
                setLoading(false)
                })
        })
        .catch( error =>{
                navigate("*")
            }
        )
    }

    useEffect(()=>{
        getReservations(page)
    },[page,statusQuery,orderByCategory,cancelRequest,reservationAction])

    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Hero unit */}
        <Typography variant="h3" sx={{m:5,display:'flex',justifyContent:'center'}}>
            My <NightShelterIcon fontSize='inherit'/> Reservations
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
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'cancel_pending'}>Cancel Pending</MenuItem>
                <MenuItem value={'approved'}>Approved</MenuItem>
                <MenuItem value={'completed'}>Completed</MenuItem>
                <MenuItem value={'expired'}>Expired</MenuItem>
                <MenuItem value={'denied'}>Denied</MenuItem>
                <MenuItem value={'canceled'}>Canceled</MenuItem>
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
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={handleClickOpenApproveCancel} variant="contained" color="error" size="small">
                                    CANCEL
                                </Button>
                                <Dialog
                                    open={openApproveCancelDialogue}
                                    onClose={handleCloseApproveCancel}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Cancelling your reservation request..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to cancel your pending reservation for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationApproveCancel(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleCloseApproveCancel} >
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
                                <PeopleAltIcon/> {card.num_of_guests}
                            </Typography>
                            </CardContent>
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
                                    <PeopleAltIcon/> {card.num_of_guests}
                                </Typography>
                                </CardContent>
                            <CardActions>
                                <Button onClick={handleClickOpen} variant="contained" color="error" size="small">
                                    <CancelIcon sx={{mr:1}} fontSize='small'/>   Request Cancel
                                </Button>
                                <Dialog
                                    open={openDialogue}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Cancelling your reservation..."}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to cancel your approved reservation for {card.start_date} to {card.end_date} at {card.address}?
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button variant="outlined" color="error" onClick={()=>requestReservationCancel(card.reservation_id)}>Yes</Button>
                                    <Button variant="outlined" onClick={handleClose} >
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