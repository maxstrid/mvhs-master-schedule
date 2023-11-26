type ActionButtonProps = {
    content: string;
    onClick: () => void;
}

function ActionButton(props: ActionButtonProps) {
    return (
        <button onClick={props.onClick} className='p-3 m-4 ml-20 mr-20 rounded-md shadow-lg bg-yellow-300 hover:bg-yellow-400 active:shadow-md'>
            {props.content}
        </button>
    )
}

export default ActionButton
