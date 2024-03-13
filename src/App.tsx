import { useState, useCallback, useEffect } from 'react';

import './App.css';

import { Schedule, SchedulePeriod } from './Schedule';
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
    const [dataCounter, setDataCounter] = useState<number>(0);
    const [grade, setGrade] = useState<number>(9);

    const fetchData = useCallback(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/generate_schedule/grade=" + grade)
            .then(res => res.json())
            .then(data => setData(data));

        setDataCounter(prevDataCounter => prevDataCounter + 1);
    }, [grade]);

    function switchGrade(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget!);
        setGrade(parseInt(Object.fromEntries(formData.entries())['selectedGrade'].toString()));
    }

    useEffect(() => fetchData(), [fetchData, grade]);

    return (
        <div className='flex flex-col m-auto'>
            <div className='text-center'>
                <h1 className='m-auto font-bold text-5xl mb-5'>Schedule</h1>
                <form className='flex justify-center' onSubmit={switchGrade}>
                    <label className='btn hover:bg-yellow-300 m-1'>
                        <p className='mr-2'>Grade</p>
                        <select className='bg-yellow-300 rounded-md' name="selectedGrade" defaultValue="9">
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </label>
                    <button className='btn bg-yellow-300 m-1' type="submit">Switch</button>
                </form>
            </div>
            <div className='m-auto mb-8'>
                {(data == null) ? (
                    <h1>Loading...</h1>
                ) : (
                    <Schedule periods={data.body.schedule.map((element: SchedulePeriodResponse): SchedulePeriod => {
                        return {
                            period: element.period,
                            classes: element.classes.map((className: string) => ({
                                name: className,
                                // TOOD(max): Make this use a classid returned from the api
                                id: className,
                            })),
                        };
                    })} key={dataCounter} />
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
