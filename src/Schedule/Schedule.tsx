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

type ClassId = {
    i: number;
    j: number;
};

type ScheduleState = {
    selected_classes: Array<ClassId>;
    periods: SchedulePeriod[];
}

export class Schedule extends React.Component<ScheduleProps, ScheduleState> {
    constructor(props: ScheduleProps) {
        super(props);


        this.state = {
            selected_classes: new Array<ClassId>(),
            periods: props.periods,
        }
    }

    classesContaints(id: ClassId) {
        return this.state.selected_classes.some(element => element.i == id.i && element.j == id.j)
    }

    activateButton(id: ClassId) {
        if (this.state.selected_classes.length > 1 && !this.classesContaints(id)) {
            return;
        }

        this.setState((prev_state: ScheduleState) => {
            let selected_classes: Array<ClassId> = [...prev_state.selected_classes];

            if (this.classesContaints(id)) {
                selected_classes = selected_classes.filter(element =>
                    element.i != id.i || element.j != id.j
                );
            } else {
                selected_classes.push(id);
            }


            return {
                selected_classes: selected_classes
            }
        });
    }

    swapClasses() {
        this.setState((prev_state: ScheduleState) => {
            const selected_classes = prev_state.selected_classes;
            const periods = prev_state.periods.map((period: SchedulePeriod, i: number) => {
                return {
                    period: period.period,
                    classes: period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                        if (i == selected_classes[0].i && j == selected_classes[0].j) {
                            return {
                                name: prev_state.periods[selected_classes[1].i].classes[selected_classes[1].j].name,
                                id: prev_state.periods[selected_classes[1].i].classes[selected_classes[1].j].id,
                            }
                        } else if (i == selected_classes[1].i && j == selected_classes[1].j) {
                            return {
                                name: prev_state.periods[selected_classes[0].i].classes[selected_classes[0].j].name,
                                id: prev_state.periods[selected_classes[0].i].classes[selected_classes[0].j].id,
                            }
                        }

                        return {
                            name: schedule_class.name,
                            id: schedule_class.id
                        };
                    }),
                };
            });


            return {
                periods: periods,
                // Un-highlight the two classes
                selected_classes: new Array<ClassId>(),
            }
        });

    }

    render() {
        return (
            <div className='m-auto'>
                {this.state.periods.map((period: SchedulePeriod, i: number) => {
                    return (
                        <div className='flex' key={i}>
                            <div className='mr-4 mb-1 mt-1 p-2 rounded-md bg-yellow-100'>
                                Period {period.period}
                            </div>
                            {period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                                const id: ClassId = {
                                    i: i,
                                    j: j
                                };

                                return (
                                    <button key={j}
                                        className={`m-auto p-1 border-2 border-transparent mr-1 ml-1 ${this.classesContaints(id) ? 'bg-yellow-300' : 'bg-gray-300'} rounded-md`}
                                        onClick={() => { this.activateButton(id) }}
                                    >
                                        {schedule_class.name}
                                    </button>
                                )
                            })}
                        </div>
                    )
                })
                }
                {(this.state.selected_classes.length > 1) ?
                    <button className='btn m-auto justify-center pr-4 pl-4' onClick={() => { this.swapClasses() }}>Swap</button>
                    :
                    <></>
                }
            </div >
        )
    }
}

