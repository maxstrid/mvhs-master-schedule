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
                {props.children}
                <button className='btn' onClick={close_modal}>
                    Close
                </button>
            </dialog>
            <button className='btn' onClick={open_modal}>
                {props.name}
            </button>
        </>
    )
}
