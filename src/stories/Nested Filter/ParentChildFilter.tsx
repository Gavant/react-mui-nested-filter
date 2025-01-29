import FilterItem from './FilterItem.tsx';
import enumToReadable from '../../util/enumToReadable.ts';
import { CheckboxSizes } from './Filters.tsx';
import { useMemo } from 'react';

interface ParentChildFilterProps<ParentKey extends string, ChildKey extends string> {
    parentKey: ParentKey;
    parentValue: string;
    pid: string;
    childItems: ChildKey[] | undefined;
    overrides?: Partial<Record<ParentKey | ChildKey, string>>;
    childReverseLookup: (value: ChildKey) => string;
    childSort: (a: ChildKey, b: ChildKey) => number;
    size: CheckboxSizes;
    checkedItems: Set<string>;
    onCheckedChange: (parentValue: ParentKey, childValue: ChildKey | undefined, value: string, isChecked: boolean) => void;
    formChildId: (parentId: string, child: string) => string;
}

function ParentChildFilter<ParentKey extends string, ChildKey extends string>({
    parentKey,
    parentValue,
    pid,
    childItems,
    overrides,
    childReverseLookup,
    childSort,
    size,
    checkedItems,
    onCheckedChange,
    formChildId,
}: ParentChildFilterProps<ParentKey, ChildKey>) {
    const hasAnyItemsChecked = useMemo(() => {
        return (childItems ?? []).some((item) => checkedItems.has(item));
    }, [childItems, checkedItems]);

    return (
        <FilterItem
            id={pid}
            itemId={pid}
            size={size}
            isChecked={checkedItems.has(parentValue)}
            indeterminate={hasAnyItemsChecked}
            onChecked={(isChecked: boolean) => onCheckedChange(parentKey, undefined, parentValue, isChecked)}
            title={(overrides?.[parentValue as ParentKey] ?? enumToReadable(parentValue as string)) as string}
        >
            {(childItems || []).sort(childSort).map((child: ChildKey) => {
                const childKey = childReverseLookup(child) as ChildKey;
                return (
                    <FilterItem
                        size={size}
                        isChecked={checkedItems.has(child) || checkedItems.has(parentValue)}
                        onChecked={(isChecked: boolean) => onCheckedChange(parentKey, childKey, child, isChecked)}
                        title={(overrides?.[childKey] ?? enumToReadable(childKey)) as string}
                        itemId={formChildId(pid, childKey)}
                    />
                );
            })}
        </FilterItem>
    );
}

export default ParentChildFilter;
