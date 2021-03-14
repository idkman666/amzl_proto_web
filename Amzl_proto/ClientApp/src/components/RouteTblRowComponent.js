import React, { Component } from 'react';

import './RouteTblRowStyle.css';

export class RouteTblRowComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cx: props.Cx,
            status: props.Status,
            name: props.Name,
            zone: props.Zone,
            wave: props.Wave,
            dsp: props.Dsp,
            id: props.Id,
            isDropped: false
        }
        this.handleDropAction = this.handleDropAction.bind(this);
    }

    handleDropAction(event) {
        const { cx, name, zone, wave, dsp, id } = this.state;
        let routeModel = {
            cx: cx,
            status: "dropped",
            name: name,
            zone: zone,
            wave: wave,
            dsp: dsp,
            id: id
        }

        fetch('/DropRouteFromDb', {
            method: "Post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(routeModel)
        }).then((e) => {
            window.alert("success");            
        });
        this.setState({
            status: "dropped"
        })
    }

    render() {
        const isDropped = this.state;
        return (
            <div className="route-cards">
                <div id="innerContainer">
                    <div id="cx-status">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">{this.state.cx}</li>
                            <li className="list-group-item">{this.state.status}</li>
                        </ul>
                    </div>
                    <div id="zone-names">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Zone: {this.state.zone}</li>
                            <li className="list-group-item">DSP: {this.state.dsp}</li>
                            <li className="list-group-item">Name: {this.state.name}</li>
                        </ul>
                    </div>
                    <div id="wave-status">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Wave: {this.state.wave}</li>
                            <li className="list-group-item"><a onClick={this.handleDropAction}> Drop </a> </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
