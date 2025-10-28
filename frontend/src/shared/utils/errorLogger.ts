export function logErrorToService(error:Error,info?:object) {
    if(import.meta.env.MODE ==='production'){
        console.log('Logging error to service:',{error,info});
    }else{
        console.error('Error logged (dev)',error,info);
    }
}