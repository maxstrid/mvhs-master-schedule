type SchedulePeriodProps = {
    period: number;
    classes: string[];
}

function schedule_period(props: SchedulePeriodProps) {
    return (
        <div className='flex'>
            <div className='mr-4 mb-1 mt-1 p-2 rounded-md bg-yellow-100'>
                Period {props.period}
            </div>
            {props.classes.map((schedule_class: string, i: number) => {
                return (
                    <div key={i} className='m-auto p-2 mr-1 ml-1 bg-gray-300 rounded-md'>
                        {schedule_class}
                    </div>
                );
            })}
        </div>
    )
}

export default schedule_period
