import React, { Component, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Route } from "react-router-dom";
import { RouteTable } from './RouteTable';
import firebase from './Firebase.js';
import { RouteTblRowComponent } from './RouteTblRowComponent';

export class Tabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeData: "",
            wave: ""
        }
        this.handleRouteDataChange = this.handleRouteDataChange.bind(this);
        this.postRouteData = this.postRouteData.bind(this);
        this.handleWaveDataChange = this.handleWaveDataChange.bind(this);

    }

    handleRouteDataChange(event) {
        this.setState({
            routeData: event.target.value
        });
    }

    handleWaveDataChange(event) {
        this.setState({
            wave: event.target.value
        });
    }

    postRouteData(event) {
        if (this.state.wave == "" || this.state.wave == null) {
            window.alert("Wave number required");
        } else {
            let routeModel = {
                RouteDescription: this.state.routeData,
                Wave: this.state.wave
            }
            fetch('/PostRoutesToDb', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeModel)
            }).then(e => {
                window.alert("success!!");
            })
        }

    }

    render() {    

        return (
            <div>
                <form onSubmit={(e) => this.postRouteData(e)}>
                    <label className="form-check-label"> Add Routes </label>
                    <select onChange={this.handleWaveDataChange}>
                        <option value="N/A">N/A</option>
                        <option value="1">Wave 1 </option>
                        <option value="2">Wave 2 </option>
                        <option value="3">Wave 3 </option>
                        <option value="4">Wave 4 </option>
                        <option value="5">Wave 5 </option>
                    </select>
                    <textarea id="rountes" name="routes" value={this.state.routeData} onChange={this.handleRouteDataChange}>

                    </textarea>
                    <button type="submit" className="btn btn-primary" > Submit </button>
                </form>
                <div>
                    <RouteTbl></RouteTbl>
                </div>
            </div>
        );
    }   

}