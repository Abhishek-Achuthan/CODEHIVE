export function logErrorToService(error: Error, info?: object) {
    if (import.meta.env.MODE !== 'production') {
        console.error('Error logged (dev)', error, info);
    }
}