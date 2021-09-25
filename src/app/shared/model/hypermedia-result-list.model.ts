import {PageInfo} from './page-info.model';

export interface HypermediaResultList<T> {
    // tslint:disable-next-line:variable-name
    _embedded?: T[];
    // tslint:disable-next-line:variable-name
    _links: {
        self: {
            href: string
        },
        [s: string]: {
            href: string
        }
    };
    page?: PageInfo;
}
