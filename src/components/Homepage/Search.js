import React, { Component } from 'react';


export default class Search extends Component {
  render () {
    return (
    <form className="search-container">
      <input 
        placeholder="enter 'orange county' to access sample data"
        onChange={this.props.handleChange}
        value={this.props.value}
        style={{
        width: "50%",
        marginLeft: "25%",
        marginRight: 5,
        marginTop: 40}}
        className="img-fluid rounded pl-2" 
        type="text" 
        id="search-bar" 
      />

      <button
        className="search-button"
        type="submit"
        onClick={this.props.handleSubmit}
        >
          <img 
            className="search-icon" 
            src="http://findicons.com/files/icons/1254/flurry_system/256/search.png" 
            width="35" 
            height="35"
            alt="search-button"
          />
      </button>
      
    </form>
    )
  }
};
