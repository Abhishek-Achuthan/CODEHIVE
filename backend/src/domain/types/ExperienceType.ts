export type Experience =  {
    id:string;
    type:'job' | 'freelance' | 'open_source' | 'teaching' | 'self_learning';
    title:string;
    organization?:string | undefined;
    startDate?:string | undefined;
    endDate?:string | undefined;
    isCurrent?:boolean | undefined
}