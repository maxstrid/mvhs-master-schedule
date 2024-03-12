import React from 'react'

export type SchedulePeriod = {
    period: number;
    classes: {
        name: string;
        id: string;
    }[];
}

export type ScheduleProps = {
    periods: SchedulePeriod[];
};

export class Schedule extends React.Component<ScheduleProps> {
    periods: SchedulePeriod[];

    constructor(props: ScheduleProps) {
        super(props);

        this.periods = props.periods;
    }

    render() {
        return (
            <div className='m-auto'>
                {this.periods.map((period: SchedulePeriod, i: number) => {
                    return (
                        <div className='flex' key={i}>
                            <div className='mr-4 mb-1 mt-1 p-2 rounded-md bg-yellow-100'>
                                Period {period.period}
                            </div>
                            {period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                                return (
                                    <div key={j} className='m-auto p-2 mr-1 ml-1 bg-gray-300 rounded-md'>
                                        {schedule_class.name}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

