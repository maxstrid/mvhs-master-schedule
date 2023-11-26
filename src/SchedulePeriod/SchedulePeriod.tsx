type SchedulePeriodProps = {
    period: number;
    classes: string[];
}

function schedule_period(props: SchedulePeriodProps) {
    return (
        <div className='flex'>
            <div className='m-10 p-2 rounded-md bg-yellow-100 shadow-md'>
                Period {props.period}
            </div>
            {props.classes.map((schedule_class: string, i: number) => {
                return (
                    <div key={i} className='m-auto p-2 mr-5 ml-5 bg-gray-300 rounded-md shadow-md'>
                        {schedule_class}
                    </div>
                );
            })}
        </div>
    )
}

export default schedule_period
