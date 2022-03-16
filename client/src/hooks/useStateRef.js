import {useState, useRef} from 'react';

export const useStateRef = (initialValue) => {
    const [value, _setValue] = useState(initialValue)
    const valueRef = useRef(value);
    const setValue = x => {
        valueRef.current = x;
        _setValue(x);
    }



    return [value, valueRef, setValue]
}