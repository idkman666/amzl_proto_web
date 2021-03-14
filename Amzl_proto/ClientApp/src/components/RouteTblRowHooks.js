import React, { useState, useEffect } from 'react';
import './RouteTblRowStyle.css';

export const RouteTblRowHooks= (data) => {
    const [props, setProps] = useState(data);

    function handleDropAction(event) {        
        let routeModel = {
            cx: props.Cx,
            status: "dropped",
            name: props.Name,
            zone: props.Zone,
            wave: props.Wave,
            dsp: props.Dsp,
            id: props.Id
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

    return (
        <div className="route-cards">
            <div id="innerContainer">
                <div id="cx-status">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{props.Cx}</li>
                        <li className="list-group-item">{props.Status}</li>
                    </ul>
                </div>
                <div id="zone-names">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Zone: {props.Zone}</li>
                        <li className="list-group-item">DSP: {props.Dsp}</li>
                        <li className="list-group-item">Name: {props.Name}</li>
                    </ul>
                </div>
                <div id="wave-status">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Wave: {props.Wave}</li>
                        <li className="list-group-item"><a onClick={handleDropAction}> Drop </a> </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}