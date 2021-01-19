import React from 'react';
import Modal from 'react-modal';
import TimePicker from 'react-time-picker';
import DatePicker from "react-datepicker";
import '../App.css';

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
  

class Flights extends React.Component {
    constructor(props) {
        super(props)
        this.state = {flights:[], add_flight_dialog:false, edit:-1};
        this.add_flight = this.add_flight.bind(this);
        this.after_add_flight_dialog = this.after_add_flight_dialog.bind(this);
        this.close_add_flight_dialog = this.close_add_flight_dialog.bind(this);
        this.save_flight_dialog = this.save_flight_dialog.bind(this);
        this.edit_flight = this.edit_flight.bind(this);
        this.close_edit_flight_dialog = this.close_edit_flight_dialog.bind(this);
        this.modify_flight_dialog = this.modify_flight_dialog.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    modify_flight_dialog(event) {
      event.preventDefault();
        const form_data = new FormData(event.target);
        var from_port = form_data.get('from');
        var to_port = form_data.get('to');
        var depature = form_data.get('departure')
        var capacity = form_data.get('capacity')
        var landing = form_data.get('landing')
            

        var data = {
            "flight_id": this.state.edit,
            "source":from_port,
            "destination":to_port,
            "departure":depature,
            "landing":landing,
            "capacity":parseInt(capacity)
         }


        fetch(SERVER_URL+'/v1/modify_flight', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data),
          }).then((res) => {
            this.get_flights()
        });
        this.close_edit_flight_dialog()

    }

    save_flight_dialog(event) {
        event.preventDefault();
        const form_data = new FormData(event.target);
        var from_port = form_data.get('from');
        var to_port = form_data.get('to');
        var depature = form_data.get('departure')
        var capacity = form_data.get('capacity')
        var landing = form_data.get('landing')
            

        var data = {
            "source":from_port,
            "destination":to_port,
            "departure":depature,
            "landing":landing,
            "capacity":parseInt(capacity)
         }


        fetch(SERVER_URL+'/v1/add_flight', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data),
          }).then((res) => {
            this.get_flights()
        });
          this.close_add_flight_dialog()
    }

    after_add_flight_dialog() {

    }

    close_add_flight_dialog() {
        this.setState({add_flight_dialog:false})
    }

   add_flight() {
        this.setState({add_flight_dialog:true})
   }

   close_edit_flight_dialog() {
      this.setState({edit:-1})
      this.get_flights()
   }

   
   componentDidMount() {
    this.get_flights();
}
    get_flights() {
        fetch(SERVER_URL+'/v1/get_flights')
        .then(res => res.json())
        .then((data) => {
            this.setState({ flights: data.flights })
        }).catch(console.log)
    }


    edit_flight(event) {
        console.log("Edit flight ID:"+event.target.id);
        this.setState({edit:event.target.id})
    }

    onChange(event) {
      var current_flight = this.get_current_flight()
      if(event.target.id==="from") {
        current_flight.from = event.target.value;
      }
      if(event.target.id==="to") {
        current_flight.to = event.target.value;
      }     
      if(event.target.id==="capacity") {
        current_flight.capacity = event.target.value;
      }

      if(event.target.id==="departure") {
        current_flight.departure = event.target.value;
      }

      if(event.target.id==="landing") {
        current_flight.landing = event.target.value;
      }

      this.setState({flights: this.state.flights})
    }

    get_current_flight() {
      for (var i = 0;i<this.state.flights.length;i++) {
        if(this.state.flights[i].id===parseInt(this.state.edit)) {
          return this.state.flights[i];
              
        }
      }
      return null;
    }

    render() {
       var container = this;

       if(this.state && this.state.edit!==-1) {
        var current_flight = this.get_current_flight();
         
        var edit_flight_form =  (
          <>
          <form onSubmit={this.modify_flight_dialog}>
            <div> From:
              <input id="from" name="from" value={current_flight.from} onChange={this.onChange}></input>
            </div>
            <div> To:
              <input id="to" name="to" value={current_flight.to} onChange={this.onChange}></input>
            </div>
            <div> Capacity:
              <input id="capacity" name="capacity" value={current_flight.capacity} onChange={this.onChange}></input>
            </div>
            <div> Departure:
              <input id="departure" name="departure" value={current_flight.departure} onChange={this.onChange}></input>
            </div>  
            <div> Landing:
              <input id="landing" name="landing" value={current_flight.landing} onChange={this.onChange}></input>
            </div>  
            <input type="submit" value="save" />
          </form>
          <button onClick={this.close_edit_flight_dialog}>close</button>
          </>
          )  
        }

        var add_flight_form = (
          <>
          <form onSubmit={this.save_flight_dialog}>
            <div> From:
              <input id="from" name="from" ></input>
            </div>
            <div> To:
               <input id="to" name="to"></input>
            </div>
            <div> Capacity:
              <input id="capacity" name="capacity"></input>
            </div>
            <div> Departure:
              <input id="departure" name="departure"></input>
            </div>  
            <div> Landing:
              <input id="landing" name="landing"></input>
            </div>  
              <input type="submit" value="save" />
          </form>
          <button onClick={this.close_add_flight_dialog}>close</button>
          </>
          );
      

       var flight_list = (this.state && this.state.flights) ? (
        this.state.flights.map((flight) => (
            <div key={flight.id} class="card"  style={{background:"#FFFFFFBF"}}>
              <div class="card-body">
                <h5 class="card-title">Flight: {flight.id}</h5>
                <h6 class="card-subtitle mb-2 text-muted">From {flight.from} To {flight.to}</h6>
                <p class="card-text">On {flight.departure}</p>
                <p class="card-text">Lands {flight.landing}</p>
                <button id={flight.id} onClick={container.edit_flight}>Edit</button>
              </div>
            </div>
          ))
        ) : '';

      
        
        return (
            <> 
            <Modal
              isOpen={this.state && this.state.add_flight_dialog}
              onAfterOpen={this.after_add_flight_dialog}
              onRequestClose={this.close_add_flight_dialog}
             style={customStyles}
             contentLabel="Add Flight"
            >
               <h2>Add Flight</h2>
               {add_flight_form}
          
        </Modal>
        <Modal
              isOpen={this.state && this.state.edit!==-1}
              onRequestClose={this.close_edit_flight_dialog}
              style={customStyles}
              contentLabel="Edit Flight">
                <h2>Edit Flight</h2>
                {edit_flight_form}
              
        </Modal>


         <center><h1>Flights List</h1></center>
                <button onClick={this.props.go_back}>Back </button>
                <button onClick={this.add_flight}>Add Flight </button>
                {flight_list}         
          </>
        )
    }
}


export default Flights