type SchedulePeriodProps = {
    period: number;
    classes: string[];
}

function schedule_period(props: SchedulePeriodProps) {
    return (
        <div>
            <div>
                Period {props.period}
            </div>
            {props.classes.map((schedule_class: string, i: number) => {
                return (
                    <div key={i}>
                        {schedule_class}
                    </div>
                );
            })}
        </div>
    )
}

export default schedule_period
