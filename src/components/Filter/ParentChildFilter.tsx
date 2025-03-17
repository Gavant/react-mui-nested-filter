import FilterItem from './FilterItem';
import enumToReadable from '../../util/enumToReadable';
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
    const { filterSortNameOverrides, childOptions, otherRename } = options;
    const childSet = useRef<Set<string>>(new Set(childItems));
    const isIncludingOther =
        includeOther === true || (typeof includeOther === 'object' && includeOther !== null && includeOther[parentValue] === true);
    const getOtherKey = () => (otherRename ? otherRename : OTHER_DEFAULT);

    const bucketKey = (parentChild: 'parent' | 'child') => {
        if (filterSortNameOverrides) {
            return filterSortNameOverrides[parentChild] ?? defaultBuckets[parentChild];
        } else {
            return defaultBuckets[parentChild]!;
        }
    };

    const checkedItemsRef = useMemo(() => {
        return new Map(Object.entries(checkedItems).map(([key, set]) => [key, new Set(set)]));
    }, [Object.keys(checkedItems).join(','), ...Object.values(checkedItems).map((set) => Array.from(set).join(','))]);

    const otherChecked = useMemo(() => checkedItemsRef.get('OTHER')?.has(parentValue) ?? false, [checkedItemsRef, parentValue]);

    const indeterminateOther = useMemo(() => (isIncludingOther ? otherChecked : false), [isIncludingOther, otherChecked]);

    const hasAnyItemsChecked = useMemo(
        () => (childItems ?? []).some((item) => checkedItemsRef.get(bucketKey('child'))?.has(item)) || indeterminateOther,
        [checkedItemsRef, childItems, indeterminateOther]
    );

    const allChildrenChecked = useMemo(
        () =>
            childSet.current?.isSubsetOf(checkedItemsRef.get(bucketKey('child')) ?? new Set()) ||
            checkedItemsRef.get(bucketKey('parent'))?.has(parentValue) ||
            false,
        [checkedItemsRef, parentValue]
    );

    const indeterminateAllChildren = useMemo(
        () => (isIncludingOther ? allChildrenChecked && indeterminateOther : allChildrenChecked),
        [isIncludingOther, allChildrenChecked, indeterminateOther]
    );

    const indeterminateValue = useMemo(
        () => (hasAnyItemsChecked && !indeterminateAllChildren) ?? false,
        [hasAnyItemsChecked, indeterminateAllChildren]
    );

    return (
        <FilterItem
            id={pid}
            itemId={pid}
            size={checkboxSize}
            className="parent-filter-item"
            isChecked={checkedItems[bucketKey('parent')]?.has(parentValue) || allChildrenChecked}
            indeterminate={indeterminateValue}
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
                    isChecked={otherChecked}
                    onChecked={(isChecked: boolean) => onCheckedChange(parentKey, getOtherKey(), parentValue, isChecked)}
                    title={childOptions?.childOtherTitleOverride ?? otherRename ?? 'Other'}
                    itemId={formChildId(filterKey, pid, 'OTHER')}
                />
            ) : null}
        </FilterItem>
    );
}

export default ParentChildFilter;
