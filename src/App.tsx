import { useState, useCallback, useEffect } from 'react';

import './App.css';

import SchedulePeriod from './SchedulePeriod';
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';

type SchedulePeriodResponse = {
    period: number;
    classes: string[];
}

type ScheduleResponse = {
    body: {
        grade: number,
        schedule: SchedulePeriodResponse[]
    };
}

//TODO(max): Add the real type
function App(this: unknown) {
    const [data, setData] = useState<ScheduleResponse | null>(null);
    const [grade, setGrade] = useState<number>(9)

    const fetchData = useCallback(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/generate_schedule/grade=" + grade)
            .then(res => res.json())
            .then(data => setData(data))
    }, [grade]);

    useEffect(() => fetchData, [fetchData]);


    return (
        <div className='flex flex-col m-auto'>
            <h1 className='m-auto font-bold text-5xl mb-5'>Schedule</h1>
            <div className='m-auto mb-8'>
                {(data == null) ? (
                    <h1>Loading...</h1>
                ) : (
                    data?.body.schedule.map((period: SchedulePeriodResponse, i: number) => {
                        return <SchedulePeriod key={i} classes={period.classes} period={period.period} />
                    })
                )}
            </div>

            <div className='m-auto'>
                <button className='btn' onClick={fetchData} >
                    <ArrowPathIcon className='h-6 w-6' />
                    <span>Regenerate</span>
                </button>
                <button className='btn'>
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
