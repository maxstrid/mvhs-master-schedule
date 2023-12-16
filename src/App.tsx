import { useState, useCallback, useEffect } from 'react';

import './App.css';

import SchedulePeriod from './SchedulePeriod';
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';

type SchedulePeriodResponse = {
    period: number;
    classes: string[];
}

type ScheduleResponse = {
    body: SchedulePeriodResponse[];
}

function App() {
    const [data, setData] = useState<ScheduleResponse | null>(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/generate_schedule").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
            }
        )
    }, []);


    const regenerate = useCallback(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/generate_schedule").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
            }
        )
    }, []);

    return (
        <div className='flex flex-col m-auto'>
            <div className='m-auto mb-20'>
                {(data == null) ? (
                    <h1>Loading...</h1>
                ) : (
                    data?.body.map((period: SchedulePeriodResponse, i: number) => {
                        return <SchedulePeriod key={i} classes={period.classes} period={period.period} />
                    })
                )}
            </div>

            <div className='m-auto'>
                <button className='btn' onClick={regenerate} >
                    <ArrowPathIcon className='h-6 w-6' />
                    <span>Regenerate</span>
                </button>
                <button className='btn'>
                    <ArrowUpTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <button className='btn'>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Export</span>
                </button>
            </div>
        </div >
    );
}

export default App;
