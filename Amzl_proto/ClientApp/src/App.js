import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import DashboardHooks from './components/DashBoardHooks';
import Parser from './components/Parser';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Route exact path='/' component={DashboardHooks} />             
                <Route path='/dashboard' component={DashboardHooks} />
                <Route path='/addRoutes' component={Parser} />
            </Layout>
        );
    }
}
