import { useState, useCallback, useEffect, createRef } from 'react';

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

//TODO(max): Add the real type
function App(this: unknown) {
    const [data, setData] = useState<ScheduleResponse | null>(null);
    const [dataCounter, setDataCounter] = useState<number>(0);
    const [grade, setGrade] = useState<number>(9);
    const [importData, setImportData] = useState<DataRow[]>([]);
    const [fileImported, setFileImported] = useState<boolean>(false);

    const fileInput = createRef<HTMLInputElement>();

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

    const handleFileUpload = useCallback((e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                console.log(results);
                console.log(typeof results);
                setImportData(results.data);
            }
        })
        setFileImported(true);
        
    }, []);
    
    const sendFileData = useCallback(() => {
        if (fileImported == true) {
            const grade9Classes: string[] = [];
            const grade10Classes: string[] = [];
            const grade11Classes: string[] = [];
            const grade12Classes: string[] = [];
        
            for (const row of importData) {
                if (row["Grade 9"] != "") {
                    grade9Classes.push(row["Grade 9"]);
                }
                if (row["Grade 10"] != "") {
                    grade10Classes.push(row["Grade 10"]);
                }
                if (row["Grade 11"] != "") {
                    grade11Classes.push(row["Grade 11"]);
                }
                if (row["Grade 12"] != "") {
                    grade12Classes.push(row["Grade 12"]);
                }
            }
        
            console.log(grade9Classes);
            console.log(grade10Classes);
            console.log(grade11Classes);
            console.log(grade12Classes);
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/import_csv_data", {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({grade9Classes: grade9Classes, grade10Classes: grade10Classes, grade11Classes: grade11Classes, grade12Classes: grade12Classes})
            }).then();
        }
    }, [importData]);

    useEffect(() => fetchData(), [fetchData, grade]);
    useEffect(() => sendFileData(), [importData, fileImported]);

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
                <button className='btn' onClick={()=>fileInput?.current?.click()}>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <input ref={fileInput} type="file" accept=".csv" onChange={handleFileUpload} hidden></input>
                <button className='btn'>
                    <ArrowUpTrayIcon className='h-6 w-6' />
                    <span>Export</span>
                </button>
            </div>
        </div >
    );
}

export default App;
