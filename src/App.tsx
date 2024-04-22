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
    const [fileImported, setFileImported] = useState<boolean>(false);

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
        setFileImported(true);
        
    }, [importData]);
    
    const sendFileData = useCallback(() => {
        if (fileImported == true) {
            let grade9Classes: string[] = [];
            let grade10Classes: string[] = [];
            let grade11Classes: string[] = [];
            let grade12Classes: string[] = [];
        
            for (var row of importData) {
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
                <button className='btn' onClick={()=>fileInput.current.click()}>
                    <ArrowDownTrayIcon className='h-6 w-6' />
                    <span>Import</span>
                </button>
                <input ref={fileInput} type="file" accept=".csv" onChange={handleFileUpload} hidden></input>
                <button className='btn'>
                    <ArrowUpTrayIcon className='h-6 w-6' />
                    <span>Export</span>
                </button>
                <h1>{importData.length ? importData[0]["Grade 9"] : null}</h1>
            </div>
            {importData.length ? (
                <table>
                    <tbody>
                        {importData.map((row, index) => (
                            <tr key={index}>
                                <td>{row["Grade 9"]}</td>
                                <td>{row["Grade 10"]}</td>
                                <td>{row["Grade 11"]}</td>
                                <td>{row["Grade 12"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
        </div >
    );
}

export default App;
