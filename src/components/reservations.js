import React, {Component} from 'react';
import '../App.css';
import Modal  from 'react-modal';


const SERVER_URL = "http://46.101.50.94:5000"

const customStyles = {
    content : {
      top                   : '20%',
      left                  : '20%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-20%',
      transform             : 'translate(-20%, -20%)'
    }
  };


class Reservations extends React.Component {
    constructor(props) {
        super(props)
        this.state = {reservations:[], make_reservation_dialog:false, modify:-1};
        this.make_reservation = this.make_reservation.bind(this);
        this.after_make_reservation_dialog = this.after_make_reservation_dialog.bind(this);
        this.close_make_reservation_dialog = this.close_make_reservation_dialog.bind(this);
        this.save_reservation_dialog = this.save_reservation_dialog.bind(this);
        this.modify_reservation = this.modify_reservation.bind(this);
        this.close_modify_reservation_dialog = this.close_modify_reservation_dialog.bind(this);
        this.modify_reservation_dialog = this.modify_reservation_dialog.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    modify_reservation_dialog(event) {
      event.preventDefault();
        const form_data = new FormData(event.target);
        var number_of_seats = form_data.get('number_of_seats')
        var flight_id = form_data.get('flight_id')
        var user_id = form_data.get('user_id') 

        var data = {
          "reservation_id": event.target.id,
          "user_id":user_id,
          "flight_id":flight_id,
          "number_of_seats":number_of_seats
         }


        fetch(SERVER_URL+'/v1/modify_reservation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data),
          }).then((res) => {
            this.get_reservations()
        });
        this.close_modify_reservation_dialog()

    }
  

    save_reservation_dialog(event) {
        event.preventDefault();
        const form_data = new FormData(event.target);
        var user_id = form_data.get('user_id');
        var flight_id = form_data.get('flight_id');
        var number_of_seats = form_data.get('number_of_seats');

        var data = {
            "user_id":user_id,
            "flight_id":flight_id,
            "number_of_seats":number_of_seats
         }

        fetch(SERVER_URL+'/v1/make_reservation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data),
          }).then((res) => {
              this.get_reservations();
          });
          this.close_make_reservation_dialog();
    }

    after_make_reservation_dialog() {

    }

    close_modify_reservation_dialog() {
      this.setState({modify:-1})
      this.get_reservations()
    }

    close_make_reservation_dialog() {
        this.setState({make_reservation_dialog:false})
    }

   make_reservation() {
        this.setState({make_reservation_dialog:true})
   }

   get_reservations() {
    fetch(SERVER_URL+'/v1/get_reservations')
    .then(res => res.json())
    .then((data) => {
        this.setState({ reservations: data.reservations })
    }).catch(console.log)
}


modify_reservation(event) {
    console.log("modify reservation ID:"+event.target.id);
    this.setState({modify:event.target.id})
}

onChange(event) {
  var current_reservation = this.get_current_reservation()
  if(event.target.id==="user_id") {
    current_reservation.user_id = event.target.value;
  }   
  if(event.target.id==="number_of_seats") {
    current_reservation.number_of_seats = event.target.value;
  }

  this.setState({reservations: this.state.reservations})
}

get_current_reservation() {
  for (var i = 0;i<this.state.reservations.length;i++) {
    if(this.state.reservations[i].id===parseInt(this.state.modify)) {
      return this.state.reservations[i];
    }
  }
  return null;
}


render() {
   var container = this;

   if(this.state && this.state.modify!==-1) {
    var current_reservation = this.get_current_reservation();
     
    var modify_reservation_form =  (
      <>
      <form onSubmit={this.modify_reservation_dialog} id={parseInt(this.state.modify)}>
        <div> User ID:
          <input id="user_id" name="user_id" value={current_reservation.user_id} onChange={this.onChange}></input>
        </div>
        <div> Number of Seats:
          <input id="number_of_seats" name="number_of_seats" value={current_reservation.number_of_seats} onChange={this.onChange}></input>
        </div>  
        <input type="submit" value="save" />
      </form>
      <button onClick={this.close_modify_reservation_dialog}>close</button>
      </>
      )  
    }

    
    var make_reservation_form =  (
      <>
      <form onSubmit={this.save_reservation_dialog}>
        <div> User ID:
          <input id="user_id" name="user_id"></input>
        </div>
        <div> Flight ID:
          <input id="flight_id" name="flight_id"></input>
        </div>
        <div> Number of Seats:
          <input id="number_of_seats" name="number_of_seats"></input>
        </div>  
        <input type="submit" value="save" />
      </form>
      <button onClick={this.close_make_reservation_dialog}>close</button>
      </>
      )  
    
    

    var reservation_list = (this.state.reservations && this.state.reservations.length) ? (
    this.state.reservations.map((reservation) => (
        <div class="card"  style={{background:"#FFFFFFBF"}}>
          <div class="card-body">
            <h5 class="card-title">reservation: {reservation.id}</h5>
            <h6 class="card-subtitle mb-2 text-muted">reservation:{reservation.reservation_id}</h6>
            <p class="card-text">Flight ID: {reservation.flight_id}</p>
            <p class="card-text">Number of Seats: {reservation.number_of_seats}</p>
            <p class="card-text">User ID: {reservation.user_id}</p>
            <button id={reservation.id} onClick={container.modify_reservation}>Edit</button>
          </div>
        </div>
      ))
    ) : '';
  
        
      return (
        <> 
        <Modal
          isOpen={this.state && this.state.make_reservation_dialog}
          onAfterOpen={this.after_make_reservation_dialog}
          onRequestClose={this.close_make_reservation_dialog}
          style={customStyles}
          contentLabel="Make Reservation"
        >
            <h2>Make Reservation</h2>
            {make_reservation_form}
      
    </Modal>
    <Modal
          isOpen={this.state && this.state.modify!==-1}
          onRequestClose={this.close_modify_flight_dialog}
          style={customStyles}
          contentLabel="Modify Reservation">
            <h2>Edit Reservation</h2>
            {modify_reservation_form}
          
    </Modal>


      <center><h1>Reservations List</h1></center>
            <button onClick={this.props.go_back}>Back </button>
            <button onClick={this.make_reservation}>Make Reservation </button>
            {reservation_list}         
      </>
      );
  }

    componentDidMount() {
        this.get_reservations();
  }
 
}


export default Reservations