import {concatMap, delay} from "rxjs/operators";
import {iif, Observable, of, throwError} from "rxjs";

export const RETRY_HANDLER = (errors: Observable<any>) => errors.pipe(
    concatMap((e, i) =>
        // If retry count is higher than 5
        iif(() => i > 5,
            // Then throw error to be handled
            throwError(e),
            // If else then retry with 500 ms delay
            of(e).pipe(delay(500))
        )
    )
)
