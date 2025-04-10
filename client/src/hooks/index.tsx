
import { fetchCsrfToken } from "./axios";
import { useRefreshToken } from "./user";



export const indexFunction = (functions: Array<() => Promise<any>>, callback: (results: any[]) => void, requiresRefreshToken: boolean): void => {
    const results: any[] = [];
    let completed = 0;

    const csrfToken = fetchCsrfToken();
    const unsafeID = localStorage.getItem("unsafeID");
    const refreshToken  = useRefreshToken();


    if (!csrfToken || !unsafeID || (requiresRefreshToken && !refreshToken)) return;
    functions.forEach((func, index) => {
        func().then((result) => {
        results[index] = result;
        completed++;
    
        if (completed === functions.length) {
            callback(results);
        }
        });
    });
    }
