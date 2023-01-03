import { Query } from "4dmetaverse_admin_sdk/database";

enum FilterType {
    inputEq,
    inputLike,
    dropdown,
}

enum FilterComparator {
    equal,
    like,
    in,
    bitEnable,
}

interface FilterOption {
    text: string;
    value: string | number;
}

interface FilterSetting {
    key: string;
    text: string;
    type?: FilterType;
    options?: FilterOption[];
}

interface FilterItem {
    key: string;
    comparator: FilterComparator;
    value: string | number | string[] | number[];
}

const buildFilterDbQuery = (item: FilterItem, query: Query): void => {
    switch (item.comparator) {
        case FilterComparator.equal:
            query.where(item.key, '=', item.value as string | number);
            break;
        case FilterComparator.like:
            query.where(item.key, 'LIKE', `%${item.value}%`);
            break;
        case FilterComparator.bitEnable:
            let bit = 0;
            for (const b of item.value as number[]) {
                bit |= b;
            }
            query.where(`${item.key} & ${bit}`, '!=', 0);
            break;
    }
}

const buildFilterText = (setting: FilterSetting[], item: FilterItem): string => {
    const itemSetting = setting.find((value) => value.key === item.key)!;
    const text: string[] = [itemSetting.text, ':'];

    switch (item.comparator ?? FilterComparator.equal) {
        case FilterComparator.equal:
            text.push('等於');
            break;
        default:
            text.push('包含');
            break
    }

    switch (itemSetting.type ?? FilterType.inputLike) {
        case FilterType.inputLike:
        case FilterType.inputEq:
            text.push(`${item.value}`);
            break;
        case FilterType.dropdown:
            text.push(_findOptionText(itemSetting.options ?? [], item.value as string | number));
            break;
    }

    return text.join(' ');
}

const _findOptionText = (options: FilterOption[], value: number | string): string => {
    return options.find((v: FilterOption) => v.value === value)?.text ?? "";
}

export { FilterType, FilterComparator, buildFilterText, buildFilterDbQuery };
export type { FilterSetting, FilterItem, FilterOption }