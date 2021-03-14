import React, { Component, useState, useEffect } from 'react';
import { RouteTblRowComponent } from './RouteTblRowComponent';
import './RouteTblRowStyle.css';
import 'firebase/auth';
import 'firebase/firestore';


export class RouteTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            waveRoutes: [],
            selectedWave: "",
            searchTerm: "",
        }
        this.handleWaveNumberChange = this.handleWaveNumberChange.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);        
    }

    componentDidMount() {
        this.populateRoutes();
    }
    
    async populateRoutes() {
        fetch('/GetRoutesFromDb', {
            method: "GET",
        }).then(e => e.json()).then(
            data => {
                this.setState({
                    //get all data and depending on wave number, store in a different array
                    waveRoutes: data
                })
            });

    }
  
    populateRouteTable(props) {
        let searchTerm = this.state.searchTerm;
        return props.map((data, key) => {
            //search using wave selection
            if (searchTerm == "" || searchTerm == null) {
                if (String(data.wave) === this.state.selectedWave) {
                    return (                     
                        <tr>
                            <RouteTblRowComponent cx={data.cx} status={data.status}
                                name={data.name} wave={data.wave}
                                zone={data.zone} dsp={data.dsp} id={data.id} key={data.id} />
                        </tr>
                    );
                }
            } else {
                //search using search bar
                if (searchTerm.length > 1 ? searchTerm[0].toLowerCase() != "c" && searchTerm[0].toLowerCase() != "i"
                    : searchTerm[0].toLowerCase() != "c") {
                    if (String(data.name).toLowerCase().includes(searchTerm.toLowerCase())) {
                        return (
                            <tr>
                                <RouteTblRowComponent cx={data.cx} status={data.status}
                                    name={data.name} wave={data.wave}
                                    zone={data.zone} dsp={data.dsp} id={data.id} key={data.id} />
                            </tr>
                        );
                    }
                    //searching for name
                }
                //search by cx
                if (String(data.cx).toLowerCase().includes(searchTerm.toLowerCase())) {
                    return (
                        <tr>
                            <RouteTblRowComponent cx={data.cx} status={data.status}
                                name={data.name} wave={data.wave}
                                zone={data.zone} dsp={data.dsp} id={data.id} key={data.id} />
                        </tr>
                    );
                }
            }
        });
    }

    handleWaveNumberChange(event) {
        this.setState({
            selectedWave: event.target.value
        })
    }

    handleSearchTermChange(event) {
        this.setState({
            searchTerm: event.target.value
        });
    }    

    render() {    
        const routes = this.state.waveRoutes;
        let waveTable = this.populateRouteTable(routes);
        return (
            <div>
                <h2>Table here</h2>
                <div className="wavebtns">
                    <select onChange={this.handleWaveNumberChange}>
                        <option value="0">N/A</option>
                        <option value="1">Wave 1 </option>
                        <option value="2">Wave 2 </option>
                        <option value="3">Wave 3 </option>
                        <option value="4">Wave 4 </option>
                        <option value="5">Wave 5 </option>
                    </select>
                    <input type="text" placeholder="search for CX number" onChange={this.handleSearchTermChange}></input>
                </div>
                <table>
                    <tbody>
                        {waveTable}
                    </tbody>
                </table>
            </div>
        );
    }

}