import { zhTW } from 'date-fns/locale';
import { format, utcToZonedTime } from 'date-fns-tz';

import Config from "../../config/Config";

export const nowToLocalString = (milliseconds: number, f: string = 'yyyy-MM-dd HH:mm:ss'): string => {
    return format(utcToZonedTime(milliseconds, Config.system.timeZone), f, { timeZone: Config.system.timeZone, locale: zhTW });
}
