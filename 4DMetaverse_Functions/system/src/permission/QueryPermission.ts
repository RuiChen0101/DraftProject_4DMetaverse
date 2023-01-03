import IAuth from '../share/entities/IAuth';
import { logger } from 'firebase-functions';
import IQueryJson from '../utility/IQueryJson';
import EShopStatus from '../share/enum/EShopStatus';
import { isWhereContain } from './PermissionUtility';
import { isAdmin } from '../share/utility/RoleValidator';
import ESalePlanStatus from '../share/enum/ESalePlanStatus';
import EShopGroupStatus from '../share/enum/EShopGroupStatus';

const queryPermissionConfig: { [key: string]: (payload: IQueryJson, auth?: IAuth) => Promise<boolean> } = {
    "user": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) || isWhereContain(payload, 'user.id', '=', auth!.id);
    },
    "shop_group": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) || isWhereContain(payload, 'shop_group.status', '=', EShopGroupStatus.Show);
    },
    "shop": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) || isWhereContain(payload, 'shop.status', '=', EShopStatus.Show);
    },
    "shop_image": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) || isWhereContain(payload, 'shop_image.shop_id', '=');
    },
    "sale_plan": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) ||
            (isWhereContain(payload, 'sale_plan.shop_id', '=') &&
                (isWhereContain(payload, 'sale_plan.status', '=', ESalePlanStatus.Show) ||
                    isWhereContain(payload, 'sale_plan.status', '=', ESalePlanStatus.Ready) ||
                    isWhereContain(payload, 'sale_plan.status', 'IN', [ESalePlanStatus.Show, ESalePlanStatus.Ready])));
    },
    "collection": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth);
    },
    "unlocked_collection": async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
        return isAdmin(auth) || isWhereContain(payload, 'unlocked_collection.user_id', '=', auth!.id);
    },
};

export const checkQueryPermission = async (payload: IQueryJson, auth?: IAuth): Promise<boolean> => {
    logger.info(`Start checking query permission: ${payload}`);
    const permissionFunc = queryPermissionConfig[payload.query.split('.')[0]];
    try {
        if (permissionFunc === undefined || !(await permissionFunc(payload, auth))) {
            logger.error(`Insufficient query permission: ${payload.query}`);
            return false;
        }
        return true;
    } catch (e: any) {
        logger.error(`Exception has been throw during query permission check: ${e.message}`);
        return false;
    }
}