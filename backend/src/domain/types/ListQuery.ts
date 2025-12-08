export interface ListQuery< TFilter = unknown,TSort=unknown> {
    filter?:TFilter,
    page?:number;
    limit?:number;
    sortBy?:TSort;
    search?:string;
}