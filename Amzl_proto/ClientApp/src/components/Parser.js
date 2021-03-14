import React, { useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './ParserStyle.css';
import firebase from './Firebase.js';

export default function Parser() {

    const [routeData, setRouteData] = useState([]);
    const [wave, setWave] = useState([]);
    const [deleteRoutes, setDeleteRoutes] = useState(false);
    async function postRouteData(event) {
        if (wave == "N/A" || wave == null || wave.length < 1) {
            NotificationManager.warning('Wave # required!!', 'SELECT WAVE');
            event.preventDefault();
            return false;
        }
        let routeModel = {
            RouteDescription: routeData,
            Wave: wave
        }
        await fetch('/PostRoutesToDb', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(routeModel),
            mode: 'cors',
        }).then((e) => {
            event.preventDefault();
            NotificationManager.success('Routes have been Added', 'DATA ADDED', "", 1000);
        }).catch((error) => {
            console.error('Error:', error);
        });

    }

    const AddRouteForm = () => {
        return (<form onSubmit={(e) => postRouteData(e)}>
            <div className="parserBody">
                <div className="formContent">
                    <ul className="no-bullets">
                        <li>
                            <div className="addRouteHeader">
                                <label className="form-check-label"><h3> ADD ROUTES </h3> </label>
                            </div>
                        </li>
                        <li>
                            <textarea id="routes" name="routes" value={routeData} onChange={(e) => setRouteData(e.target.value)}>

                            </textarea>
                        </li>
                        <li>
                            <div>
                                <label className="form-check-label"><h6> Choose Wave: </h6></label>
                                <select onChange={(e) => setWave(e.target.value)}>
                                    <option value="N/A">Select Wave</option>
                                    <option value="1">Wave 1 </option>
                                    <option value="2">Wave 2 </option>
                                    <option value="3">Wave 3 </option>
                                    <option value="4">Wave 4 </option>
                                    <option value="5">Wave 5 </option>
                                </select>
                            </div>
                        </li>
                        <li className="submitButton">
                            <button type="submit" className="btn btn-primary" > Submit </button>
                        </li>
                    </ul>
                </div>
            </div>
        </form>);
    }

    return (
        <div>
            <NotificationContainer />
            <button className="btn btn-danger" onClick={() => setDeleteRoutes(!deleteRoutes)}>{deleteRoutes == true ?"Back" : "Delete Routes"}</button>
            { deleteRoutes == true ? <DeleteRoutes /> : <AddRouteForm />}
        </div>
    );
}

const DeleteRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const ref = firebase.firestore().collection("RouteList");
    useEffect(() => {
        let unmounted = false;
        async function getRoutes(unmounted) {
            await ref.onSnapshot((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((doc) => {
                    let routeModel = {
                        Cx: doc.data().Cx,
                        Status: doc.data().Status,
                        Name: doc.data().Name,
                        Zone: doc.data().Zone,
                        Wave: doc.data().Wave,
                        Dsp: doc.data().Dsp,
                        Id: doc.id
                    }

                    data.push(routeModel);
                });
                if (!unmounted) {
                    setRoutes(data);
                }
            });
        }
        getRoutes(unmounted);
        return () => {
            unmounted = true;
        }
    }, [])

    function handleDeleteRoute(waveNumber) {
        routes.forEach((e) => {
            if (e.Wave == waveNumber) {
                ref.doc(e.Id).delete();
            }
        });
        NotificationManager.warning('Routes for Wave ' + waveNumber + ' Deleted!!', 'DATA DELETED', "", 1900);
    }

    return (<div>
        <div className="header"><h3>Delete Routes</h3></div>
        <table className="table table-striped table-dark">
            <tbody>
                <tr>
                    <th scope="row">WAVE 1</th>
                    <td><h6>{routes.map((e) => e.Wave == 1).filter((f) => f == true).length}</h6></td>
                    <td onClick={() => handleDeleteRoute(1)}><h6>DELETE</h6></td>
                </tr>
                <tr>
                    <th scope="row">WAVE 2</th>
                    <td><h6>{routes.map((e) => e.Wave == 2).filter((f) => f == true).length}</h6></td>
                    <td onClick={() => handleDeleteRoute(2)}><h6>DELETE</h6></td>
                </tr>
                <tr>
                    <th scope="row">WAVE 3</th>
                    <td><h6>{routes.map((e) => e.Wave == 3).filter((f) => f == true).length}</h6></td>
                    <td onClick={() => handleDeleteRoute(3)}><h6>DELETE</h6></td>
                </tr>
                <tr>
                    <th scope="row">WAVE 4</th>
                    <td><h6>{routes.map((e) => e.Wave == 4).filter((f) => f == true).length} </h6></td>
                    <td onClick={() => handleDeleteRoute(4)}><h6>DELETE</h6></td>
                </tr>
                <tr>
                    <th scope="row">WAVE 5</th>
                    <td><h6>{routes.map((e) => e.Wave == 5).filter((f) => f == true).length}</h6></td>
                    <td onClick={() => handleDeleteRoute(5)}><h6>DELETE</h6></td>
                </tr>
            </tbody>
        </table>
    </div>);
}