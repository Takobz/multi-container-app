import React, {useState, useEffect } from 'react';
import axios from 'axios';

const Fibonnaci = () => {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fecthValues = async () => {
        const values = await axios.get('/api/values/current', {
            withCredentials: true
        });
        setValues(values.data);
    }

    const fetchIndexes = async () => {
        const indexes = await axios.get('/api/values/all', {
            withCredentials: true
        });
        setSeenIndexes(indexes.data)
    }

    const renderSeenIndexes = () => {
        return seenIndexes.map(({ number }) => number).join(', ');
    }

    const renderValues = () => {
        const entries = [];
        for (let key in values){
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        }
        return entries;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('/api/values', {
            index: index
        });
        setIndex('');
    }

    useEffect(() => {
        const fetchData = async () => {
            await fecthValues();
            await fetchIndexes();
        }
        
        fetchData();
    }, [index]); //zero dependencies i.e [] means this will run once after intial render, like ComponentDidMount 

    return(
    <div>
        <form onSubmit={handleSubmit}>
            <label>Enter your index:</label>
            <input
                value={index}
                onChange={event => setIndex(event.target.value)} 
            />
            <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {renderValues()}
    </div>);
}

export default Fibonnaci