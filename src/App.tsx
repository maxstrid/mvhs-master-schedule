import { useState, useCallback, useMemo, useEffect, createRef } from 'react';

import './App.css';

import { Schedule, SchedulePeriod } from './Schedule';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

import { ScheduleResponse, FlaskBackend } from './api';

import Papa from 'papaparse';

type DataRow = {
    "Grade 9": string,
    "Grade 10": string,
    "Grade 11": string,
    "Grade 12": string,
    "Total # of Sections": string,
    "Total # of Sections_1": string,
    "Total # of Sections_2": string,
    "Total # of Sections_3": string,
}

function App() {
    const [data, setData] = useState<ScheduleResponse | null>(null);
    const [dataCounter, setDataCounter] = useState<number>(0);
    const [grade, setGrade] = useState<number>(9);
    const [importData, setImportData] = useState<DataRow[]>([]);
    const [fileImported, setFileImported] = useState<boolean>(false);

    const fileInput = createRef<HTMLInputElement>();

    const flask_backend = useMemo<FlaskBackend>(() => {
        return new FlaskBackend("generic_id")
    }, []);

    const fetchData = useCallback(() => {
        flask_backend.generate_schedule(grade).then(schedule_response => {
            setData(schedule_response);
        });
    }, [grade, flask_backend]);

    useEffect(() => {
        setDataCounter(counter => counter + 1);
    }, [data]);

    const switchGrade = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget!);
        setGrade(parseInt(Object.fromEntries(formData.entries())['selectedGrade'].toString()));
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files![0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                setImportData(results.data);
            }
        })
        setFileImported(true);

    }, []);

    const sendFileData = useCallback(() => {
        const grade_9: string[] = [];
        const grade_10: string[] = [];
        const grade_11: string[] = [];
        const grade_12: string[] = [];

        for (const row of importData) {
            if (row["Grade 9"] != "") {
                grade_9.push(row["Grade 9"]);
            }
            if (row["Grade 10"] != "") {
                grade_10.push(row["Grade 10"]);
            }
            if (row["Grade 11"] != "") {
                grade_11.push(row["Grade 11"]);
            }
            if (row["Grade 12"] != "") {
                grade_12.push(row["Grade 12"]);
            }
        }

        flask_backend.import_grade_level_classes({
            grade_9: grade_9,
            grade_10: grade_10,
            grade_11: grade_11,
            grade_12: grade_12
        });
    }, [importData, flask_backend]);

    useEffect(() => fetchData(), [fetchData, grade]);

    useEffect(() => {
        if (fileImported) sendFileData()
    }, [importData, fileImported, sendFileData]);

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
                    <Schedule flask_backend={flask_backend} schedule={data.body.schedule.map((element: {
                        period: number;
                        classes: string[][];
                    }): SchedulePeriod => {
                        return {
                            period: element.period,
                            classes: element.classes.map((className: string[]) => ({
                                name: className[1],
                                // TOOD(max): Make this use a classid returned from the api
                                id: className[0],
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
                <button className='btn' onClick={() => fileInput?.current?.click()}>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <input ref={fileInput} type="file" accept=".csv" onChange={handleFileUpload} hidden></input>
            </div>
        </div >
    );
}

export default App;
