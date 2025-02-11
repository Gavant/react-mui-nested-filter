import FilterItem from './FilterItem';
import enumToReadable from '~/util/enumToReadable';
import { useMemo, useRef } from 'react';
import { ChildType, MappingKey, ParentType } from './NestedFilter';
import { FilterOptions, useFilterContext } from './Filter.context';

interface ParentChildFilterProps<P extends ParentType, C extends ChildType, ParentKey extends keyof P, ChildKey extends keyof C> {
    parentKey: keyof P;
    parentValue: MappingKey<P>;
    pid: string;
    childItems: MappingKey<C>[] | undefined;
    overrides?: Partial<Record<P[ParentKey] | C[ChildKey], string>>;
    childReverseLookup: (value: MappingKey<C>) => keyof C;
    childSort: ((a: C[ChildKey], b: C[ChildKey]) => number) | undefined;
    onCheckedChange: (parentKey: ParentKey, childKey: ChildKey | undefined, value: string, isChecked: boolean) => void;
    formChildId: (parentId: string, child: string) => string;
    options: FilterOptions;
    buckets?: { parent: string; child: string };
    checkedItems: Record<string, Set<string>>;
}

function ParentChildFilter<P extends ParentType, C extends ChildType>({
    parentKey,
    parentValue,
    pid,
    childItems,
    overrides,
    childReverseLookup,
    childSort,
    onCheckedChange,
    checkedItems,
    formChildId,
    options = { replaceChildrenWithParentOnAllChecked: true, combineChildrenAndParentItems: false },
}: ParentChildFilterProps<P, C, keyof P, keyof C>) {
    const { checkboxSize, defaultBuckets } = useFilterContext();
    const { combineChildrenAndParentItems, filterSortNameOverrides } = options;
    const childSet = useRef<Set<string>>(new Set(childItems));

    const bucketKey = (parentChild: 'parent' | 'child') => {
        if (filterSortNameOverrides) {
            return combineChildrenAndParentItems
                ? (filterSortNameOverrides?.default ?? defaultBuckets.default)
                : (filterSortNameOverrides[parentChild] ?? defaultBuckets[parentChild]);
        } else {
            return combineChildrenAndParentItems ? defaultBuckets.default : defaultBuckets[parentChild]!;
        }
    };

    const hasAnyItemsChecked = useMemo(() => {
        return (childItems ?? []).some((item) => checkedItems[bucketKey('child')].has(item));
    }, [childItems, checkedItems]);

    const allChildrenChecked = () => childSet.current?.isSubsetOf(checkedItems[bucketKey('child')]);
    return (
        <FilterItem
            id={pid}
            itemId={pid}
            size={checkboxSize}
            isChecked={checkedItems[bucketKey('parent')]?.has(parentValue) || allChildrenChecked()}
            indeterminate={hasAnyItemsChecked && !allChildrenChecked()}
            onChecked={(isChecked: boolean) => onCheckedChange(parentKey, undefined, parentValue, isChecked)}
            title={overrides?.[parentValue as keyof P] ?? enumToReadable(parentValue as string)}
        >
            {(childItems || []).sort(childSort).map((child: C[keyof C]) => {
                const childKey = childReverseLookup(child);
                return (
                    <FilterItem
                        key={child}
                        size={checkboxSize}
                        isChecked={checkedItems[bucketKey('child')].has(child) || checkedItems[bucketKey('parent')].has(parentValue)}
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
