import React, { useState, useEffect } from 'react';
import firebase from './Firebase.js';
import './RouteTblRowStyle.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default function RouteTbl() {

    const [routes, setRoutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);
    const [selectedWave, setSelectedWave] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [monted, setMounted] = useState(false);
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
            setMounted(true);
        }

    }, []);

    const RowComp = (props) => {
        const [routeDrop, setRouteDrop] = useState(false);
        const [waveNumber, setWaveNumber] = useState();
        const [askForWaveChange, setAskForWaveChange] = useState(false);

        function containerColor(data) {
            switch (data.Status) {
                case "WAITING":
                    return "WAITING";
                case "CHECKED IN":
                    return "CHECKED-IN";
                case "DROPPED":
                    return "DROPPED";
                default:
                    return "";
            }
        }

        async function handleDropAction(event) {
            let routeModel = {
                cx: props.Cx,
                status: "DROPPED",
                name: props.Name,
                zone: props.Zone,
                wave: props.Wave,
                dsp: props.Dsp,
                id: props.Id
            }

            await fetch('/DropRouteFromDb', {
                method: "Post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeModel)
            }).then((e) => {
                NotificationManager.success(routeModel.cx.toString() + ' has been dropped.', 'DROPPED', "", 1000);
                askRouteDrop();
            });
        }

        const HandleWaveChange = () => {
            return (
                <div>
                    <h6>Change Wave:</h6>
                    <div id="WaveSelectBar">
                        <button class="btn btn-secondary" onClick={() => setWaveNumber(1)}>1</button>
                        <button class="btn btn-secondary" onClick={() => setWaveNumber(2)}>2</button>
                        <button class="btn btn-secondary" onClick={() => setWaveNumber(3)}>3</button>
                        <button class="btn btn-secondary" onClick={() => setWaveNumber(4)}>4</button>
                        <button class="btn btn-secondary" onClick={() => setWaveNumber(5)}>5</button>
                    </div>
                    <div class="askDropMenuContainer">
                        <div id="askDropMenu">
                            <button className="btn btn-primary" onClick={submitWaveChange}>Yes</button>
                            <button className="btn btn-danger" onClick={askWaveChange}>No</button>
                        </div>
                    </div>
                </div>);
        }
        async function submitWaveChange() {
            let routeModel = {
                cx: props.Cx,
                status: props.Status,
                name: props.Name,
                zone: props.Zone,
                wave: waveNumber == 0 ? props.Wave : waveNumber,
                dsp: props.Dsp,
                id: props.Id
            }

            await fetch('/ChangeWaveInDb', {
                method: "Post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeModel)
            }).then((e) => {
                NotificationManager.success(props.Wave.toString() + ' => ' + waveNumber.toString(), 'WAVE CHANGED');
                askRouteDrop();
            });
        }

        function askWaveChange() {
            setAskForWaveChange(!askForWaveChange);
        }

        function askRouteDrop() {
            setRouteDrop(!routeDrop);
        }

        const AskDropMenu = () => {
            return (
                <div class="askDropMenuContainer">
                    <h6>Are you sure?</h6>
                    <div id="askDropMenu">
                        <button className="btn btn-primary" onClick={handleDropAction}>Yes</button>
                        <button className="btn btn-danger" onClick={askRouteDrop}>No</button>
                    </div>
                </div>

            );
        };

        return (<div className="route-cards">
            <div id="innerContainer">
                <div id="cx-status">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{props.Cx}</li>
                        <li className="list-group-item" id={containerColor(props)}><h6>{props.Status}</h6></li>
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
                        <li className="list-group-item">Wave: {props.Wave} </li>
                        <li className="list-group-item">{askForWaveChange ? <HandleWaveChange /> : <button className="btn btn-secondary" onClick={askWaveChange} >Change Wave?</button>}</li>
                        <li className="list-group-item">{routeDrop ? <AskDropMenu /> : <div>Drop Route?  <button className="btn btn-info" onClick={askRouteDrop}> Drop </button></div>} </li>
                        <NotificationContainer />
                    </ul>
                </div>
            </div>
        </div>);
    }

    const HeaderData = () => {
        return (
            <div>
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col"> </th>
                            <th scope="col"><a><h6>Wave 1 </h6></a></th>
                            <th scope="col"><a><h6>Wave 2 </h6></a></th>
                            <th scope="col"><a><h6>Wave 3 </h6></a></th>
                            <th scope="col"><a><h6>Wave 4 </h6></a ></th>
                            <th scope="col"><a><h6>Wave 5 </h6></a ></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Waiting</th>
                            <td onClick={(e) => {
                                setSelectedStatus("WAITING");
                                setSelectedWave(1);
                            }}><a><h6>{routes.filter((e) => e.Wave == 1).filter((f) => f.Status == "WAITING").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("WAITING");
                                setSelectedWave(2);
                            }}><a><h6>{routes.filter((e) => e.Wave == 2).filter((f) => f.Status == "WAITING").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("WAITING");
                                setSelectedWave(3);
                            }}><a><h6>{routes.filter((e) => e.Wave == 3).filter((f) => f.Status == "WAITING").length}</h6></a ></td>
                            <td onClick={(e) => {
                                setSelectedStatus("WAITING");
                                setSelectedWave(4);
                            }}><a><h6>{routes.filter((e) => e.Wave == 4).filter((f) => f.Status == "WAITING").length}</h6></a ></td>
                            <td onClick={(e) => {
                                setSelectedStatus("WAITING");
                                setSelectedWave(5);
                            }}><a><h6>{routes.filter((e) => e.Wave == 5).filter((f) => f.Status == "WAITING").length}</h6></a ></td>
                        </tr>
                        <tr>
                            <th scope="row">Checked In</th>
                            <td onClick={(e) => {
                                setSelectedStatus("CHECKED IN");
                                setSelectedWave(1);
                            }}><a><h6>{routes.filter((e) => e.Wave == 1).filter((f) => f.Status == "CHECKED IN").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("CHECKED IN");
                                setSelectedWave(2);
                            }}><a><h6>{routes.filter((e) => e.Wave == 2).filter((f) => f.Status == "CHECKED IN").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("CHECKED IN");
                                setSelectedWave(3);
                            }}><a><h6>{routes.filter((e) => e.Wave == 3).filter((f) => f.Status == "CHECKED IN").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("CHECKED IN");
                                setSelectedWave(4);
                            }}><a><h6>{routes.filter((e) => e.Wave == 4).filter((f) => f.Status == "CHECKED IN").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("CHECKED IN");
                                setSelectedWave(5);
                            }}><a><h6>{routes.filter((e) => e.Wave == 5).filter((f) => f.Status == "CHECKED IN").length}</h6></a></td>
                        </tr>
                        <tr>
                            <th scope="row">Dropped</th>
                            <td onClick={(e) => {
                                setSelectedStatus("DROPPED");
                                setSelectedWave(1);
                            }}><a><h6>{routes.filter((e) => e.Wave == 1).filter((f) => f.Status == "DROPPED").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("DROPPED");
                                setSelectedWave(2);
                            }}><a><h6>{routes.filter((e) => e.Wave == 2).filter((f) => f.Status == "DROPPED").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("DROPPED");
                                setSelectedWave(3);
                            }}><a><h6>{routes.filter((e) => e.Wave == 3).filter((f) => f.Status == "DROPPED").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("DROPPED");
                                setSelectedWave(4);                                
                            }}><a><h6>{routes.filter((e) => e.Wave == 4).filter((f) => f.Status == "DROPPED").length}</h6></a></td>
                            <td onClick={(e) => {
                                setSelectedStatus("DROPPED");
                                setSelectedWave(5);                              
                            }}><a><h6>{routes.filter((e) => e.Wave == 5).filter((f) => f.Status == "DROPPED").length}</h6></a></td>
                        </tr>
                    </tbody>
                </table>
            </div>);
    }


    function PopulateRouteTable() {
        return routes.map((data, key) => {
            //search using wave selection
            if (selectedStatus != null) {  
                if (selectedStatus == data.Status && selectedWave == data.Wave) {
                    return (<RowComp key={key}  {...data} />);
                }
            } else if (selectedStatus == null){
                if (searchTerm == "" || searchTerm == null) {
                    if (String(data.Wave) == selectedWave) {
                        return (
                            <RowComp key={key} {...data} />
                        );
                    }
                } else {
                    //search using search bar
                    if (searchTerm.length > 1 ? searchTerm[0].toLowerCase() != "c" && searchTerm[0].toLowerCase() != "i"
                        : searchTerm[0].toLowerCase() != "c") {
                        if (String(data.Name).toLowerCase().includes(searchTerm.toLowerCase())) {
                            return (
                                <RowComp key={key} {...data} />
                            );
                        }
                        //searching for name
                    }
                    //search by cx
                    if (String(data.Cx).toLowerCase().includes(searchTerm.toLowerCase())) {
                        return (
                            <RowComp key={key}  {...data} />
                        );
                    }
                }
            }            
        });
    }

    return (
        <div>
            <div class="headerData" >
                <HeaderData />
            </div>
            <div className="wavebtns">
                <select onChange={(e) => { setSelectedWave(e.target.value); setSelectedStatus(null); }}>
                    <option value="0">Select Wave</option>
                    <option value="1">Wave 1 </option>
                    <option value="2">Wave 2 </option>
                    <option value="3">Wave 3 </option>
                    <option value="4">Wave 4 </option>
                    <option value="5">Wave 5 </option>
                </select>
                <input type="text" id="searchField" placeholder="Search by CX number Or Name" onChange={(e) => setSearchTerm(e.target.value)}></input>
            </div>
            <div >
                {
                    <PopulateRouteTable {...routes} />
                }
            </div>

        </div>
    );
}
