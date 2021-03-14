import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import { Tabs } from './Tabs';

export class Dashboard extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div>
                <h3>Dashbord from react</h3>
                <Tabs>
                </Tabs>
            </div>
        );
    }
}