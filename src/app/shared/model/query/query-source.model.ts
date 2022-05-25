export interface QuerySource {
    ownerId: string;
    sourceId: string;
    strategy: string;
    originId: string;
    originType: string;
    data: any;
    createDate: Date;

    // Not received in query to API, just for handling spinners in web
    isFetching: boolean;
}
