import React, { Component, useContext } from 'react';
import config from '../../config';
import RideContext from '../../context/RideContext';
import UserContext from '../../context/UserContext';
import Gmaps from '../../components/Maps/Gmaps';
import moment from 'moment';
import TokenService from '../../services/token-service';
import PassengerApiService from '../../services/RidesService/rides-passenger-service';
import DriverApiService from '../../services/RidesService/rides-driver-service';
import './RideDetails.css';
import EditModal from '../../components/EditModal/EditModal';

export default class RideDetails extends Component {
    static contextType = RideContext;
  
    state = {
      error: null,
      message: null,
      isEditing: false
    };

    componentDidMount() {
      fetch(`${config.API_ENDPOINT}/rides/${this.props.match.params.ride_id}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `bearer ${TokenService.getAuthToken()}`
        }
      })
        .then(res => res.json())
        .then(data => this.context.setRide(data))
        .then(() => {
          let startLat = this.context.ride.startCoorLat;
          let startLng = this.context.ride.startCoorLong;
          this.context.setStartingC(startLat, startLng);
          let destLat = this.context.ride.destCoorLat;
          let destLng = this.context.ride.destCoorLong;
          this.context.setDestinationC(destLat, destLng);
        });
    }

    handleJoin = (ride_id) => {
      PassengerApiService.passengerJoinRide(ride_id)
        .then(() => this.setState({ message: 'You have joined this ride' }))
        .catch(res => this.setState({error: res.error}));
    }
    
    handleCancel = (ride_id) => {
      PassengerApiService.passengerCancelRide(ride_id)
        .then(() => this.setState({message: 'You have left this ride'}))
        .catch(res => this.setState({error: res.error}));
    }

    handleDelete = (ride_id) => {
      this.context.deleteRide(ride_id);

      return DriverApiService.deleteRide(ride_id)
        .catch(res => (res.error) ? this.setState({error: res.error}) : this.props.history.push('/rides')
        );
    }

    handleErrorClose = () => {
      this.setState({ error: null });
    }

    handleMessageClose = () => {
      this.setState({ message: null});
    
      // .then(()=>{this.props.history.push('/rides');
        
    }

    createEditForm = () => {
      this.setState({isEditing: true});
    }

    closeEditForm = () => {
      this.setState({isEditing: false});
    }

    handleEditForm = () => {
      let ride_id = this.context.ride.id;
      let description = document.getElementById('newDescription').value;
      let starting = document.getElementById('newStarting').value;
      let destination = document.getElementById('newDestination').value;
      let date = document.getElementById('newDate').value;
      let time = document.getElementById('newTime').value;

      console.log(date, time);

      let updatedDetails = {starting, destination, description, date, time};
      DriverApiService.editRideDetails(ride_id, updatedDetails)
        .then(res => {
          this.context.setRide(res);
          console.log(this.context.ride);
          this.setState({isEditing: false});
        })
        .catch(res => this.setState({error: res.error}));
    }

    render() {
      const { error, message } = this.state;
      const { id, starting, destination, date_time, capacity, driver_name, description } = this.context.ride;
      let dateStr = new Date(date_time).toLocaleString();
      let newStr = dateStr.split(', ');
      let dateFormat = newStr[0];
      let time = newStr[1];
      let timeFormat = '';
      if(!time) {
        timeFormat = 'Invalid Date';
      } else {
        let timeArr = time.split(':');
        let amPM = timeArr[2].split(' ');
        timeFormat = `${timeArr[0]}:${timeArr[1]} ${amPM[1]}`; 
      }

      let remainingSeats = 0;
      let count = 0;

      let sRArray = Object.keys(this.context.ride);

      for(let i = 6; i < sRArray.length; i++){
        count++;
        if(capacity < count){
          break;
        }

        if(this.context.ride[sRArray[i]] === null){
          remainingSeats++;
        }
      }

      if(remainingSeats === 0) {
        remainingSeats = 'This ride is full';
      }

      //Div#map for Maps container, styles in gmaps.css in component folder
      if(!this.context.ride) {
        return <div>Loading</div>;
      } else {
        return ( 
          <UserContext.Consumer>{(userContext) => {
            const {user_id} = userContext.user;
            return (
              <>
                <h2>Ride Details</h2>
                <div className="google-map">
                  <Gmaps />
                </div>
                {message && <div className='messageBox'>{message}<button className='messageButton' aria-label='close' onClick={() => this.handleMessageClose()}>X</button></div>}
                {error && <div className='errorBox'>{error}<button className='errorButton' aria-label='close' onClick={() => this.handleErrorClose()}>X</button></div>}
                <div className='ride-details'>
                  <p>Driver: {driver_name}</p>
                  <p>Meetup Address: {starting}</p>
                  <p>Destination: {destination}</p>
                  <p>Meetup Date: {dateFormat}</p>
                  <p>Meetup Time: {timeFormat}</p>
                  <p>Capacity: {capacity}</p>
                  <p>Remaining Seats: {remainingSeats}</p>
                  <h4>Ride Description:</h4>
                  <p>{description}</p>
                  {this.context.ride.driver_id === user_id 
                    ? <><button type="button" onClick={() => this.handleDelete(id)}>Delete Ride</button> 
                        <button type="button" onClick={() => this.createEditForm()}>Edit Details</button>
                      </>
                    : <><button type="button" onClick={() => this.handleJoin(id)}>Join</button>
                      <button type="button" onClick={() => this.handleCancel(id)}>Cancel Ride</button>
                    </>}
                  {this.state.isEditing && <EditModal handleEditForm = {this.handleEditForm} closeEditForm = {this.closeEditForm} timeFormat={timeFormat} dateFormat={dateFormat} />}
                  
                </div>
              </>
            ); 
          }}
          </UserContext.Consumer>
        );
      }
    }
}
