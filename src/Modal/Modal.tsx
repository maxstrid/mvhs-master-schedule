import { Bars4Icon, XCircleIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useRef, useState } from 'react';

export function Modal(props: { name: string, children: React.ReactNode }) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (modalOpen) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [modalOpen]);

    const close_modal = useCallback(() => {
        setModalOpen(false);
    }, [setModalOpen]);

    const open_modal = useCallback(() => {
        setModalOpen(true);
    }, [setModalOpen]);

    return (
        <>
            <dialog ref={ref} onCancel={close_modal} className='p-4 rounded-md'>
                <div className='flex flex-col justify-between'>
                    {props.children}
                    <button className='btn' onClick={close_modal} >
                        <XCircleIcon className='h-6 w-6' />
                        <span>Close</span>
                    </button>
                </div>
            </dialog>
            <button className='btn' onClick={open_modal} >
                <Bars4Icon className='h-6 w-6' />
                <span>{props.name}</span>
            </button>
        </>
    )
}
