import FilterItem from './FilterItem';
import enumToReadable from '~/util/enumToReadable';
import { useMemo, useRef } from 'react';
import { ChildType, MappingKey, ParentType } from './NestedFilter';
import { FilterOptions, OTHER_DEFAULT, useFilterContext } from './Filter.context';

interface ParentChildFilterProps<P extends ParentType, C extends ChildType, ParentKey extends keyof P, ChildKey extends keyof C> {
    parentKey: keyof P;
    parentValue: MappingKey<P>;
    pid: string;
    childItems: MappingKey<C>[] | undefined;
    filterKey: string;
    overrides?: Partial<Record<P[ParentKey] | C[ChildKey], string>>;
    childReverseLookup: (value: MappingKey<C>) => keyof C;
    includeOther?: boolean | Partial<Record<MappingKey<P>, boolean>>;
    childSort: ((a: C[ChildKey], b: C[ChildKey]) => number) | undefined;
    onCheckedChange: (parentKey: ParentKey, childKey: ChildKey | undefined, value: string, isChecked: boolean) => void;
    formChildId: (filterKey: string, parentId: string, child: string) => string;
    options: FilterOptions;
    buckets?: { parent: string; child: string };
    checkedItems: Record<string, Set<string>>;
}

function ParentChildFilter<P extends ParentType, C extends ChildType>({
    parentKey,
    parentValue,
    pid,
    childItems,
    filterKey,
    overrides,
    childReverseLookup,
    includeOther,
    childSort,
    onCheckedChange,
    checkedItems,
    formChildId,
    options = { replaceChildrenWithParentOnAllChecked: true, combineChildrenAndParentItems: false },
}: ParentChildFilterProps<P, C, keyof P, keyof C>) {
    const { checkboxSize, defaultBuckets } = useFilterContext();
    const { combineChildrenAndParentItems, filterSortNameOverrides, childOptions, otherRename } = options;
    const childSet = useRef<Set<string>>(new Set(childItems));
    const isIncludingOther =
        includeOther === true || (typeof includeOther === 'object' && includeOther !== null && includeOther[parentValue] === true);
    const getOtherKey = () => (otherRename ? otherRename : OTHER_DEFAULT);

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
            className="parent-filter-item"
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
                        className="child-filter-item"
                        isChecked={checkedItems[bucketKey('child')].has(child) || checkedItems[bucketKey('parent')].has(parentValue)}
                        onChecked={(isChecked: boolean) => onCheckedChange(parentKey, childKey, child, isChecked)}
                        title={overrides?.[childKey] ?? enumToReadable(child as string)}
                        itemId={formChildId(filterKey, pid, childKey as string)}
                    />
                );
            })}
            {isIncludingOther ? (
                <FilterItem
                    key={`${pid}-OTHER`}
                    size={checkboxSize}
                    className="child-filter-item"
                    isChecked={checkedItems['OTHER']?.has(parentValue) || checkedItems[bucketKey('parent')].has(parentValue)}
                    onChecked={(isChecked: boolean) => onCheckedChange(parentKey, getOtherKey(), parentValue, isChecked)}
                    title={childOptions?.childOtherTitleOverride ?? otherRename ?? 'Other'}
                    itemId={formChildId(filterKey, pid, 'OTHER')}
                />
            ) : null}
        </FilterItem>
    );
}

export default ParentChildFilter;
