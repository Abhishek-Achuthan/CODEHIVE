import { useState } from "react";
import { SessionService } from "../../../services/sessionService";

export function useFetchSessions () {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const [sessions,setSessions] = useState([]);

    async function fetchSessions (userId:string) {
        
        if(!userId) {
            throw new Error('User id is not provided');
        };

        try {
            const response = await SessionService.getBookedSessions();
            setSessions(response.sessions);
        } catch (error) {
            
        }
    }
}