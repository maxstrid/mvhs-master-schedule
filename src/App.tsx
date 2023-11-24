import { useState, useCallback, useEffect } from 'react';

import SchedulePeriod from './SchedulePeriod';

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
        <div>
            <div>
                <button onClick={regenerate}>Regenerate</button>
                <button>Import</button>
                <button>Export</button>
            </div>

            <div>
                {(data == null) ? (
                    <h1>Loading...</h1>
                ) : (
                    data?.body.map((period: SchedulePeriodResponse, i: number) => {
                        return <SchedulePeriod key={i} classes={period.classes} period={period.period} />
                    })
                )}
            </div>
        </div >
    );
}

export default App;
