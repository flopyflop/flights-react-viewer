//import logo from './logo.svg';
import './App.css';
import Flights from './components/flights';

import React, {Component} from 'react';
import Reservations from './components/reservations';



class App extends Component {

  state = {
    flights : [],
    reservations : [],
    menuselection: -1
  }

  constructor(props) {
    super(props);
    this.showFlights = this.showFlights.bind(this)
    this.showReservations = this.showReservations.bind(this)
    this.back = this.back.bind(this)
   }

  showFlights() {
    this.setState({menuselection:0})
  }

  showReservations() {
    this.setState({menuselection:1})
  }

 
  render() {
    var flights_component = (<Flights go_back={this.back}/>)
    var reservations_component = (<Reservations go_back={this.back}/>)

    if (this.state.menuselection === 0) {
      return (
        <div style={{backgroundImage:"url(/flights_background.jpg)" }}>
          {flights_component}
        </div>
       );
    }
    
    if (this.state.menuselection === 1) {
      return (
        <div style={{backgroundImage:"url(/flights_background.jpg)" }}>
          {reservations_component}
        </div>
       );
    }

    if(this.state.menuselection === -1) {
      return (
        <div style={{backgroundImage:"url(/flights_background.jpg)", backgroundPosition: "center", backgounedRepeat:"no-repeat", backgroundSize:"cover", padding:"25%" }}>
          <button type="button" class="btn btn-primary btn-lg btn-block" style={{marginTop:"0%",marginLeft:"25%", width:"25%"}} onClick={this.showFlights}>Flights</button>
          <button type="button" class="btn btn-primary btn-lg btn-block" style={{marginTop:"5%",marginLeft:"25%", width:"25%"}} onClick={this.showReservations}>Reservations</button>
        </div>
      )
    }


  }

  back(){
    this.setState({menuselection:-1})
  }

  
}


export default App;
