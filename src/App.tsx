import { useState, useCallback, useMemo, useEffect, createRef } from 'react';

import './App.css';

import { Schedule, SchedulePeriod } from './Schedule';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

import { ScheduleResponse, FlaskBackend } from './api';

import { v4 as uuidv4 } from 'uuid';

import { Modal } from './Modal';

enum ImportType {
    GradeLevelClasses = "GradeLevelClasses",
    ConflictMatrix = "ConflictMatrix",
}

function App() {
    const [data, setData] = useState<ScheduleResponse | null>(null);
    const [dataCounter, setDataCounter] = useState<number>(0);
    const [grade, setGrade] = useState<number>(9);
    const [importType, setImportType] = useState<ImportType>(ImportType.GradeLevelClasses);

    const fileInput = createRef<HTMLInputElement>();

    const flask_backend = useMemo<FlaskBackend>(() => {
        let id = localStorage.getItem('id')

        if (id == null) {
            id = uuidv4();
            localStorage.setItem('id', id!);
        }

        return new FlaskBackend(id!);
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

        file.text().then(text => {
            switch (importType) {
                case ImportType.GradeLevelClasses:
                    flask_backend.import_grade_level_classes(text);
                    break;
                case ImportType.ConflictMatrix:
                    flask_backend.import_conflict_matrix(text);
                    break;
            }
        });


    }, [importType, flask_backend]);

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
                <Modal name="Import">
                    <button className='btn' onClick={() => {
                        setImportType(ImportType.GradeLevelClasses);
                        fileInput?.current?.click();
                    }}>
                        <ArrowDownTrayIcon className='h-6 w-6' />
                        <span>Grade Level Classes</span>
                    </button>
                    <button className='btn' onClick={() => {
                        setImportType(ImportType.ConflictMatrix);
                        fileInput?.current?.click();
                    }}>
                        <ArrowDownTrayIcon className='h-6 w-6' />
                        <span>Conflict Matrix</span>
                    </button>
                    <input ref={fileInput} type="file" accept=".*" onChange={handleFileUpload} hidden></input>
                </Modal>
                <button className='btn' onClick={fetchData} >
                    <ArrowPathIcon className='h-6 w-6' />
                    <span>Regenerate</span>
                </button>
            </div>
        </div >
    );
}

export default App;
