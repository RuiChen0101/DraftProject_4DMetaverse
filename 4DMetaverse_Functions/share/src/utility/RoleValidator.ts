import IAuth from "../entities/IAuth";
import EUserRole from "../enum/EUserRole";

export const isAdmin = (auth?: IAuth): boolean => {
    return auth !== undefined && auth.role >= EUserRole.Admin;
}