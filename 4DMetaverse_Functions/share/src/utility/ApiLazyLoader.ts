import * as path from "path";
import * as functions from "firebase-functions";

let libPath = "";

export const setLibPath = (path: string): void => {
    libPath = path
}

//lazy loading api entry
const ApiLazyLoader = (entryFilePath: string): ((req: functions.https.Request, res: functions.Response<any>) => Promise<void>) => {
    return async (req: functions.https.Request, res: functions.Response<any>): Promise<void> => {
        await (require(path.join(libPath, entryFilePath))).default(req, res);
    }
}

export default ApiLazyLoader;
