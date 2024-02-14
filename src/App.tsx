import { useState, useCallback, useEffect, MouseEventHandler, ChangeEvent } from 'react';
import Papa from 'papaparse';

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

//TODO(max): Add the real type
function App(this: unknown) {
    const [data, setData] = useState<ScheduleResponse | null>(null);
    const [csvFile, setCSV] = useState([]);

    const fetchData = useCallback(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/generate_schedule")
            .then(res => res.json())
            .then(data => setData(data))
    }, []);

    useEffect(() => fetchData, [fetchData]);

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        console.log(file);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const columnArray = [];
                const valuesArray = [];

                results.data.map((d) => {
                    columnArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                setData(results.data)
            },
        });
    }

    return (
        <div className='flex flex-col m-auto'>
            <h1 className='m-auto font-bold text-5xl mb-5'>Schedule</h1>
            <div className='m-auto mb-8'>
                {(data == null) ? (
                    <h1>Loading...</h1>
                ) : (
                    data?.body.map((period: SchedulePeriodResponse, i: number) => {
                        return <SchedulePeriod key={i} classes={period.classes} period={period.period} />
                    })
                )}
            </div>

            <div className='m-auto'>
                <button className='btn' onClick={fetchData} >
                    <ArrowPathIcon className='h-6 w-6' />
                    <span>Regenerate</span>
                </button>
                <input id="selectFile" type="file" accept=".csv" onClick={() => handleFile} style={{display:"none"}}></input>
                <button className='btn' onClick={() => document.querySelector('input[id=selectFile]')?.click()}>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <button className='btn'>
                    <ArrowUpTrayIcon className='h-6 w-6' />
                    <span>Export</span>
                </button>
            </div>
        </div >
    );
}

export default App;
