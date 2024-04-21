import { useState, useCallback, useEffect, useRef } from 'react';

import './App.css';

import { Schedule, SchedulePeriod } from './Schedule';
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';

import Papa from 'papaparse';

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
    const [importData, setImportData] = useState<any[]>([]);

    const fileInput = useRef();

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

    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: any) => {
                console.log(results);
                setImportData(results.data);
            }
        })
        // fetch(import.meta.env.VITE_BACKEND_URL + "/api/import_csv_data", {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(periods[i].classes)
        // }).then(res => res.json())
        //     .then(currentPeriod =>
        //         setClassConflicts(classConflicts => [...classConflicts, {
        //             period: i,
        //             total_conflicts: currentPeriod.conflicts,
        //         }])
        //     );
        console.log(importData[0][0]);
    }, [importData]);

    useEffect(() => fetchData(), [fetchData, grade]);

    return (
        <div className='flex flex-col m-auto'>
            <div className='text-center'>
                <h1 className='m-auto font-bold text-5xl mb-5'>Schedule</h1>
                <form className='flex justify-center' onSubmit={switchGrade}>
                    <label className='btn hover:bg-yellow-300 m-1'>
                        <p className='mr-2'>Grade</p>
                        <select className='bg-yellow-300 rounded-md' name="selectedGrade" defaultValue="9">
                            {[9, 10, 11, 12].map(grade =>
                                <option value={grade} key={grade}>{grade}</option>
                            )}
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
                <button className='btn' onClick={()=>fileInput.current.click()}>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <input ref={fileInput} type="file" accept=".csv" onChange={handleFileUpload} hidden></input>
                <button className='btn'>
                    <ArrowUpTrayIcon className='h-6 w-6' />
                    <span>Export</span>
                </button>
            </div>
            <h1>{importData}</h1>
        </div >
    );
}

export default App;
