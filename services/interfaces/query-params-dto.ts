export interface QueryParamsDto {
    search: string;
    orderBy?: [string, 'ASC' | 'DESC'];
    currentPage: number;
    resultsPerPage: number;
}