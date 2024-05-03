import { useState, useCallback, useEffect } from 'react';

import { CSVLink } from "react-csv";

import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';

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

type SwapAction = {
    first: ClassId,
    second: ClassId
}

type ScheduleExportPeriodIds = {
    period1ClassIds: string;
    period2ClassIds: string;
    period3ClassIds: string;
    period4ClassIds: string;
    period5ClassIds: string;
    period6ClassIds: string;
    period7ClassIds: string;
};

export function Schedule(props: ScheduleProps) {
    const [highlightedClasses, setHighlightedClasses] = useState<ClassId[]>([]);
    const [periods, setPeriods] = useState<SchedulePeriod[]>(props.periods);
    const [classConflicts, setClassConflicts] = useState<number[]>([]);
    const [swapCounter, setSwapCounter] = useState<number>(0);
    const [outlinedClasses, setOutlinedClasses] = useState<ClassId[]>([]);
    const [actionList, setActionList] = useState<SwapAction[]>([]);
    const [undoIndex, setUndoIndex] = useState<number | null>(null);

    useEffect(() => {
        setClassConflicts([])

        for (let i = 0; i < periods.length; i++) {
            (function(index: number) {
                fetch(import.meta.env.VITE_BACKEND_URL + "/api/calculate_conflicts", {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(periods[index].classes)
                }).then(res => res.json())
                    .then(currentPeriod => {
                        setClassConflicts(classConflicts => {
                            const classConflict = [...classConflicts]

                            classConflict[index] = currentPeriod.conflicts

                            return classConflict;
                        })
                    })
            })(i);
        }

    }, [periods]);

    const classesContains = useCallback((id: ClassId) => {
        return highlightedClasses.some(element => element.i == id.i && element.j == id.j);
    }, [highlightedClasses]);

    const outlinedClassesContains = useCallback((id: ClassId) => {
        return outlinedClasses.some(element => element.i == id.i && element.j == id.j);
    }, [outlinedClasses]);

    const swapClasses = useCallback((class_one: ClassId, class_two: ClassId) => {
        setOutlinedClasses([class_one, class_two]);

        setPeriods(prevPeriods => prevPeriods.map((period: SchedulePeriod, i: number) => {
            return {
                period: period.period,
                classes: period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                    let class_id: ClassId | null = null;

                    if (i == class_one.i && j == class_one.j) {
                        class_id = class_two;
                    } else if (i == class_two.i && j == class_two.j) {
                        class_id = class_one;
                    }

                    const new_schedule_class = (class_id != null) ?
                        prevPeriods[class_id.i].classes[class_id.j] : schedule_class;

                    return {
                        name: new_schedule_class.name,
                        id: new_schedule_class.id,
                    }
                }),
            }
        }));
    }, []);

    const redo = useCallback(() => {
        if (undoIndex == null) {
            return;
        }

        if (undoIndex == actionList.length) {
            return;
        }

        const actionItem = actionList.at(undoIndex)!;

        swapClasses(actionItem.first, actionItem.second);

        setUndoIndex(undoIndex => undoIndex! + 1);
    }, [undoIndex, actionList, swapClasses]);

    const undo = useCallback(() => {
        let newUndoIndex = undoIndex;

        if (newUndoIndex == null) {
            newUndoIndex = actionList.length - 1;
        } else {
            newUndoIndex = undoIndex! - 1;
        }

        if (newUndoIndex < 0) {
            setUndoIndex(-1);
            return;
        }

        const actionItem = actionList.at(newUndoIndex)!;

        swapClasses(actionItem.first, actionItem.second);

        setUndoIndex(newUndoIndex);
    }, [undoIndex, actionList, swapClasses]);

    const swapHighlightedClasses = useCallback(() => {
        swapClasses(highlightedClasses[0], highlightedClasses[1]);

        setHighlightedClasses([]);

        setActionList((action_list: SwapAction[]) => {
            const new_action_list = undoIndex != null ? action_list.slice(0, undoIndex!) : action_list;

            new_action_list.push({
                first: highlightedClasses[0],
                second: highlightedClasses[1]
            })

            return new_action_list;
        });

        setUndoIndex(null);

        setSwapCounter(swapCounter => swapCounter + 1);
    }, [highlightedClasses, setActionList, undoIndex, swapClasses]);

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

    const onKeyPressHandler = useCallback((e: KeyboardEvent) => {
        if (e.key == 'y' && e.ctrlKey) {
            redo()
        } else if (e.key == 'z' && e.ctrlKey) {
            undo()
        }
    }, [undo, redo]);

    const exportSchedule = useCallback(() => {
        let scheduleRows: ScheduleExportPeriodIds[] = [];
        let highestLength: number = 0;
        periods.forEach((value) => {
            if (value["classes"].length > highestLength) {
                highestLength = value["classes"].length;
            }
        });

        for (let i = 0; i < highestLength; i++) {
            scheduleRows.push({
                period1ClassIds: periods[0]["classes"][i]["id"] ? periods[0]["classes"][i]["id"] : "",
                period2ClassIds: periods[1]["classes"][i]["id"] ? periods[1]["classes"][i]["id"] : "",
                period3ClassIds: periods[2]["classes"][i]["id"] ? periods[2]["classes"][i]["id"] : "",
                period4ClassIds: periods[3]["classes"][i]["id"] ? periods[3]["classes"][i]["id"] : "",
                period5ClassIds: periods[4]["classes"][i]["id"] ? periods[4]["classes"][i]["id"] : "",
                period6ClassIds: periods[5]["classes"][i]["id"] ? periods[5]["classes"][i]["id"] : "",
                period7ClassIds: periods[6]["classes"][i]["id"] ? periods[6]["classes"][i]["id"] : "",
            })
        }

        console.log(scheduleRows);

        const csvContent = "data:text/csv;charset=utf-8," + scheduleRows.map(item => Object.values(item).join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
    }, []);

    document.onkeydown = onKeyPressHandler;

    return (
        <div className='m-auto flex flex-col'>
            <div className='flex flex-row m-2 bg-gray-50 shadow-md rounded-xl p-4'>
                {periods.map((period: SchedulePeriod, i: number) => {
                    return (
                        <div className='mr-2 ml-2 mb-1 mt-1 p-2 text-center rounded-xl shadow-md bg-gray-100' key={swapCounter + i}>
                            <div>
                                <p>Period {period.period}</p>
                                <p>Conflicts: {(classConflicts.length != 0 && classConflicts[period.period - 1] != undefined) ? classConflicts[period.period - 1] : 0}</p>
                            </div>
                            {period.classes.map((schedule_class: { name: string, id: string }, j: number) => {
                                const id: ClassId = {
                                    i: i,
                                    j: j
                                };

                                return (
                                    <div key={swapCounter + i + j}>
                                        <button
                                            className={`p-1 border-2 border-transparent mt-1 mb-1 ${classesContains(id) ?
                                                'bg-yellow-300' : outlinedClassesContains(id) ? 'border-yellow-300' : 'bg-gray-300'}  rounded-md w-full`}
                                            onClick={() => { toggleClass(id) }}
                                        >
                                            {schedule_class.name}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
                }
            </div>
            {
                (highlightedClasses.length > 1) ?
                    <button className='btn absolute top-0 right-0 justify-center pr-4 pl-4' onClick={swapHighlightedClasses}>Swap</button>
                    :
                    <></>
            }
            <button className='btn h-10 w-40 justify-center self-center' onClick={exportSchedule}>
                <ArrowUpTrayIcon className='h-6 w-6' />
                <span>Export</span>
            </button>
        </div >

    )
}
