import React, { Component } from 'react';



class App extends Component {
  constructor(props){
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.updateSearchCriteria = this.updateSearchCriteria.bind(this);
    this.state = {
      vehicle : {
        location: '',
        vehicle_make: '', 
        vehicle_type: 'Consumer'
      },
      cars:[],
      searching: false
    }
  }
  updateSearchCriteria(location, vehicle_make, vehicle_type){

    this.setState(()=>{
        
      return {
          vehicle:{
            location: location,
            vehicle_make: vehicle_make,
            vehicle_type: vehicle_type
          }
      }
    })
  }
  fetchData(location, vehicle_make, vehicle_type){

    fetch('https://app.joindrover.com/api/web/vehicles', 
    {
      headers: {
        'content-type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        "vehicle_type":vehicle_type,
         "location": location,
         "vehicle_make":vehicle_make
      })
    }
    )
    .then(response => {
      return response.json();
      })
    .then(body => {

      this.setState(()=> {
        return {
          cars: body.data,
          searching: true
        }
      })      
    })
    .catch(error => console.log('error'))
   
  }
  render() {
    return(
      <div>
        <SearchDisplay fetchData={this.fetchData} 
                       updateSearchCriteria={this.updateSearchCriteria}
                       vehicle={this.state.vehicle}/>
        <ResultDisplay fetchData={this.fetchData} cars={this.state.cars} searching={this.state.searching}  />
      </div>
      )
  }
}

class SearchDisplay extends Component{
  constructor(props){
    super(props);
    this.handleFetch = this.handleFetch.bind(this);
  }
 
  handleFetch(e){
    e.preventDefault(); 
    const location = e.target.elements.location.value.trim();
    const vehicle_make = e.target.elements.vehicle_make.value.trim();
    const vehicle_type = e.target.elements.vehicle_type.value.trim();
  
    this.props.updateSearchCriteria(location, vehicle_make, vehicle_type);
    this.props.fetchData(location, vehicle_make, vehicle_type);
   
  }
  render(){ 
    return(      
      <form onSubmit={this.handleFetch}>
        <div className="columns">
          <div className="column" />
          <div className="column">
            <label className="label">Location</label>
            <input className="input is-info" type="text"  name="location" />
            </div>
            <div className="column">
            <label className="label">Vehicle make</label>
            <input className="input is-info" type="text" name="vehicle_make" />
            </div>
            <div className="column">
            <label className="label">Vehicle type</label>
            <select name="vehicle_type" >
              <option key="consumer_key" defaultValue="Consumer">Consumer</option>
              <option key="PCO_key" value="PCO">PCO</option>
            </select>
            <button className="submit-btn button is-primary" size="large" >Submit</button>
            </div>
          </div>
        </form>
    )
  }
}
class ResultDisplay extends Component{
  constructor(props){
    super(props);
  }

  getCarsMap(){

    let rows = [];
    for (let i=0, j = this.props.cars.length; i<j; i+=3) {
        rows.push( this.props.cars.slice(i,i+3) ) 
    }
    return rows;
  }

  render(){ 

    if(this.props.searching && this.props.cars == 0) {
      return <div>Nothing found</div>
    }

    return (
      <div className="column">
        {
          this.getCarsMap().map((rows, index) =>
          <div className="columns"> 
            { 
              rows.map((car) =>
                <div className="column"> 
                <img src={car.images[2]?car.images[2].small_image_url:"No image"} />
                <label className="label">{car.vehicle_make}</label>
                <p> {car.vehicle_model}</p>
                <p><b>Year </b>{car.year}</p>
                <p><b>Color </b>{car.color}</p>
              </div>
              )
            }
          </div>
          )
        }
      </div>
      )  
    }
}

export default App;
