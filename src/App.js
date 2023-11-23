import React, { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("/test").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, []);

    return (
        <div>
            {(typeof data.info == 'undefined') ? (
                <p>Loading...</p>
            ) : (
                data.info
            )}
        </div>
    );
}

export default App;
