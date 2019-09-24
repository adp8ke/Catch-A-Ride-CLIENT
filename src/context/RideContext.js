import React, { Component } from 'react';

const RideContext = React.createContext({
  rides: [],
  ride: {},
  passengerRides: [],
  driverRides: [],
  error: null,
  destination: '',
  starting: '',
  setRides: () => { },
  setRide: () => { },
  setDestination: () => { },
  setStarting: () => { },
  setPassengerRides: () => { },
  setDriverRides: () => { }
});

export default RideContext;

export class RideProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      ride: {},
      destination: '',
      starting: '',
      passengerRides: [],
      driverRides: []
    };
  }

  setRides = (rides) => {
    this.setState({ rides });
  }
  deleteRide=(rideid)=>{
    const newRides=this.state.rides.filter(ride=>ride.id!==rideid);
    this.setState({rides:newRides});
  }

  setRide = (ride) => {
    this.setState({ ride });
  }

  setDestination = (destination) => {
    this.setState({ destination });
  }

  setStarting = (starting) => {
    console.log(starting.length);
    console.log(typeof starting);
    this.setState({ starting });
    console.log(this.state.starting);
  }

  setError = error => {
    console.error(error);
    this.setState({ error });
  }

  clearError = () => {
    this.setState({ error: null });
  }

  setPassengerRides = (passengerRides) => {
    this.setState({ passengerRides });
  }

  setDriverRides = (driverRides) => {
    this.setState({ driverRides });
  }

  render() {
    const value = {
      rides: this.state.rides,
      ride: this.state.ride,
      destination: this.state.destination,
      starting: this.state.starting,
      setRides: this.setRides,
      setRide: this.setRide,
      setDestination: this.setDestination,
      setStarting: this.setStarting,
      passengerRides: this.state.passengerRides,
      driverRides: this.state.driverRides,
      setPassengerRides: this.setPassengerRides,
      setDriverRides: this.setDriverRides,
      deleteRide:this.deleteRide
    };
    return (
      <RideContext.Provider value={value}>
        {this.props.children}
      </RideContext.Provider>
    );
  }
}