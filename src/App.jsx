import React, { useState, useCallback, useEffect } from 'react';

import style from './App.module.css';
import './App.module.css';

import SchedulePeriod from './SchedulePeriod';

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("/generate_schedule").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
            }
        )
    }, []);

    const regenerate = useCallback(() => {
        fetch("/generate_schedule").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
            }
        )
    }, []);


    return (
        <div id={style.app}>
            <div id={style.buttonBar}>
                <button onClick={regenerate}>Regenerate</button>
                <button>Import</button>
                <button>Export</button>
            </div>

            <div id={style.schedule}>
                {(typeof data[1] == 'undefined') ? (
                    <h1>Loading...</h1>
                ) : (
                    Object.keys(data).map((key) => {
                        return <SchedulePeriod key={key} classes={data[key]} period={key} />
                    })
                )}
            </div>
        </div >
    );
}

export default App;
