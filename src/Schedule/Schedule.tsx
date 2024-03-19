import { useState, useCallback } from 'react';

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

export function Schedule(props: ScheduleProps) {
    const [highlightedClasses, setHighlightedClasses] = useState<ClassId[]>([]);
    const [periods, setPeriods] = useState<SchedulePeriod[]>(props.periods);

    const classesContains = useCallback((id: ClassId) => {
        return highlightedClasses.some(element => element.i == id.i && element.j == id.j);
    }, [highlightedClasses]);

    const swapClasses = useCallback(() => {
        setPeriods(prevPeriods => prevPeriods.map((period: SchedulePeriod, i: number) => {
            return {
                period: period.period,
                classes: period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                    let index: number | null = null;

                    if (i == highlightedClasses[0].i && j == highlightedClasses[0].j) {
                        index = 1;
                    } else if (i == highlightedClasses[1].i && j == highlightedClasses[1].j) {
                        index = 0;
                    }

                    const new_schedule_class = (index != null) ?
                        prevPeriods[highlightedClasses[index].i].classes[highlightedClasses[index].j] : schedule_class;

                    return {
                        name: new_schedule_class.name,
                        id: new_schedule_class.id,
                    }
                }),
            }
        }));

        setHighlightedClasses([]);
    }, [highlightedClasses]);

    const toggleClass = useCallback((id: ClassId) => {
        if (highlightedClasses.length > 1 && !classesContains(id)) {
            return;
        }

        if (!classesContains(id)) {
            setHighlightedClasses([...highlightedClasses, id]);
        } else {
            setHighlightedClasses(highlightedClasses.filter(element =>
                element.i != id.i || element.j != id.j
            ));
        }

    }, [highlightedClasses, classesContains]);

    return (
        <div className='m-auto flex flex-col'>
            <table className='flex flex-row m-auto ml-2 mr-2'>
                {periods.map((period: SchedulePeriod, i: number) => {
                    return (
                        <td className='mr-2 ml-2 mb-1 mt-1 p-2 text-center rounded-md bg-yellow-100' key={i}>
                            Period {period.period}
                            {period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                                const id: ClassId = {
                                    i: i,
                                    j: j
                                };

                                return (
                                    <tr>
                                        <button key={j}
                                            className={`p-1 border-2 border-transparent mt-1 mb-1 ${classesContains(id) ?
                                                'bg-yellow-300' : 'bg-gray-300'} rounded-md w-full`}
                                            onClick={() => { toggleClass(id) }}
                                        >
                                            {schedule_class.name}
                                        </button>
                                    </tr>
                                )
                            })}
                        </td>
                    )
                })
                }
            </table>
            {(highlightedClasses.length > 1) ?
                <button className='btn m-auto justify-center pr-4 pl-4' onClick={swapClasses}>Swap</button>
                :
                <></>
            }
        </div >

    )
}
