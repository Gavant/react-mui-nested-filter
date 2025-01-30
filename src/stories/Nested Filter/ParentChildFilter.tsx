import FilterItem from './FilterItem.tsx';
import enumToReadable from '../../util/enumToReadable.ts';
import { CheckboxSizes } from './Filters.tsx';
import { useMemo } from 'react';
import { ChildType, MappingKey, ParentType } from './NestedFilter.tsx';

interface ParentChildFilterProps<P extends ParentType, C extends ChildType, ParentKey extends keyof P, ChildKey extends keyof C> {
    parentKey: keyof P;
    parentValue: MappingKey<P>;
    pid: string;
    childItems: MappingKey<C>[] | undefined;
    overrides?: Partial<Record<P[ParentKey] | C[ChildKey], string>>;
    childReverseLookup: (value: MappingKey<C>) => keyof C;
    childSort: ((a: C[ChildKey], b: C[ChildKey]) => number) | undefined;
    size: CheckboxSizes;
    checkedItems: Set<string>;
    onCheckedChange: (parentKey: ParentKey, childKey: ChildKey | undefined, value: string, isChecked: boolean) => void;
    formChildId: (parentId: string, child: string) => string;
}

function ParentChildFilter<P extends ParentType, C extends ChildType>({
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
}: ParentChildFilterProps<P, C, keyof P, keyof C>) {
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
            title={overrides?.[parentValue as keyof P] ?? enumToReadable(parentValue as string)}
        >
            {(childItems || []).sort(childSort).map((child: C[keyof C]) => {
                const childKey = childReverseLookup(child);
                return (
                    <FilterItem
                        size={size}
                        isChecked={checkedItems.has(child) || checkedItems.has(parentValue)}
                        onChecked={(isChecked: boolean) => onCheckedChange(parentKey, childKey, child, isChecked)}
                        title={overrides?.[childKey] ?? enumToReadable(childKey as string)}
                        itemId={formChildId(pid, childKey as string)}
                    />
                );
            })}
        </FilterItem>
    );
}

export default ParentChildFilter;
