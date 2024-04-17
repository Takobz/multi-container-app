import React, {useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fecthValues = async () => {
        const values = await axios.get('/api/values/current');
        setValues(values.data);
    }

    const fetchIndexes = async () => {
        const indexes = await axios.get('/api/values/all');
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
        fecthValues();
        fetchIndexes();
    }, []); //zero dependencies i.e [] means this will run once after intial render, like ComponentDidMount 

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
