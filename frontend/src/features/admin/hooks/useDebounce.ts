import { useState,useEffect } from "react";


export function useDebounce<T>(value:T,delay:number) :T {
    const [debouncedValue,setDebouncedValue] = useState(value);

    useEffect(()=> {
        const hanlder = setTimeout(() => {
            setDebouncedValue(value);
        },delay);

        return () => {
            clearTimeout(hanlder);
        }
    },[value,delay]);

    return debouncedValue;
}