import { useEffect, useMemo, useRef } from 'react';
import ParentChildFilter from './ParentChildFilter.tsx';
import { FilterOptions, useFilterContext } from './Filter.context.tsx';
import { createDefaultBuckets } from './Filters.tsx';

const formParentId = (identifier: any) => `parent${identifier}`;
const formChildId = (parentId: any, childId: any) => `${parentId}-node${childId}`;

function sortFunction<K extends Record<string, string>>(
    sort: Record<K[keyof K], number> | undefined
): ((a: keyof K, b: keyof K) => number) | undefined {
    if (!sort) {
        return undefined;
    }
    return (a: keyof K, b: keyof K) => {
        return sort[a as K[keyof K]] - sort[b as K[keyof K]];
    };
}

export interface ParentType extends Record<string, string> {}
export interface ChildType extends Record<string, string> {}

type Value<V> = V[keyof V];

export type MappingKey<I> = Value<I>;
type MappingValue<C> = Array<C[keyof C]>;
type MappingType<I extends ParentType, C extends ChildType> = Partial<Record<MappingKey<I>, MappingValue<C>>>;

type NestedFilterProps<I extends ParentType, C extends ChildType, M extends MappingType<I, C>> = {
    filterKey: string;
    items: I;
    childItems: C;
    mapping: M;
    parentSort?: Record<Value<I>, number>;
    childSort?: Record<Value<I>, number>;
    labelOverrides?: Partial<Record<Value<I> | Value<C>, string>>;
    options?: FilterOptions;
};

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

function NestedFilter<I extends ParentType, C extends ChildType, M extends MappingType<I, C>>({
    filterKey,
    items,
    childItems,
    mapping,
    parentSort,
    childSort,
    labelOverrides,
}: NestedFilterProps<I, C, M>) {
    const sortParent = useRef(sortFunction(parentSort));
    const sortChild = useRef(sortFunction(childSort));
    const { checkedItems, onItemChecked, defaultBuckets, options } = useFilterContext();
    const thisFilterItems = checkedItems?.[filterKey] ?? createDefaultBuckets();
    const { replaceChildrenWithParentOnAllChecked, combineChildrenAndParentItems, filterSortNameOverrides } = options;

    useEffect(() => {
        onItemChecked(filterKey, thisFilterItems);
    }, []);

    const itemReverseLookup = useMemo(() => {
        const map = new Map<Value<I>, keyof I>();
        (Object.entries(items) as Entries<I>).forEach(([key, value]) => {
            map.set(value, key);
        });
        return map;
    }, [items]);

    const childItemReverseLookup = useMemo(() => {
        const map = new Map<Value<C>, keyof C>();
        (Object.entries(childItems) as Entries<C>).forEach(([key, value]) => {
            map.set(value, key);
        });
        return map;
    }, [childItems]);

    const reverseLookup = function <V extends I | C>(value: Value<V>, map: Map<Value<V>, keyof V>): keyof V {
        // Ensure the return type is a string
        const key = map.get(value);
        if (!key) {
            throw new Error(`Key not found in map for value: ${value}`);
        }
        return key;
    };

    const bucketKey = (parentChild: 'parent' | 'child') => {
        if (filterSortNameOverrides) {
            return combineChildrenAndParentItems
                ? (filterSortNameOverrides?.default ?? defaultBuckets.default)
                : (filterSortNameOverrides[parentChild] ?? defaultBuckets[parentChild]);
        } else {
            return combineChildrenAndParentItems ? defaultBuckets.default : defaultBuckets[parentChild]!;
        }
    };

    // combineChildrenAndParentItems: false
    const onCheckedChange = (parentKey: keyof I, childKey: keyof C | undefined, value: string, isChecked: boolean) => {
        const checkedUpdate = thisFilterItems;
        const children = mapping[items[parentKey]] as MappingValue<C>;
        const parentValue = items[parentKey];

        if (isChecked) {
            // adding
            if (childKey) {
                checkedUpdate[bucketKey('child')].add(value);
                if (children.every((item) => checkedUpdate[bucketKey('child')].has(item)) && replaceChildrenWithParentOnAllChecked) {
                    // Every child is checked - replace with parent
                    children.forEach((item) => checkedUpdate[bucketKey('child')].delete(item));
                    checkedUpdate[bucketKey('parent')].add(parentValue);
                }
            } else {
                // parent
                const checkedChildItems = children.filter((item) => checkedUpdate[bucketKey('child')].has(item));
                checkedChildItems.forEach((childItem) => checkedUpdate[bucketKey('child')].delete(childItem));
                checkedUpdate[bucketKey('parent')].add(value);
            }
        } else {
            // removing
            if (childKey) {
                // Child
                if (checkedUpdate[bucketKey('child')].has(childItems[childKey])) {
                    // If the child key is already there then we have a straight-forward removal
                    checkedUpdate[bucketKey('child')].delete(value);
                } else if (checkedUpdate[bucketKey('parent')].has(parentValue)) {
                    // The parent is standing in for all individual items - so we have to remove the parent, add all the children
                    // excluding our checked item
                    // Add all children
                    children.forEach((item) => checkedUpdate[bucketKey('child')].add(item));
                    // remove the parent
                    checkedUpdate[bucketKey('parent')].delete(parentValue);
                    // remove the child we unchecked
                    checkedUpdate[bucketKey('child')].delete(value);
                }
            } else {
                // Remove parent + all children
                const checkedChildItems = children.filter((b) => checkedUpdate[bucketKey('child')].has(b));
                checkedChildItems.forEach((childItem) => checkedUpdate[bucketKey('child')].delete(childItem));
                checkedUpdate[bucketKey('parent')].delete(value);
            }
        }

        onItemChecked(filterKey, checkedUpdate);
    };

    return (
        <>
            {Object.keys(mapping)
                .sort(sortParent.current)
                .map((key) => {
                    const parentValue = key as MappingKey<I>;
                    return (
                        <ParentChildFilter<I, C>
                            key={key}
                            parentKey={reverseLookup(parentValue, itemReverseLookup)}
                            parentValue={parentValue}
                            pid={formParentId(parentValue)}
                            childItems={mapping[parentValue]}
                            childReverseLookup={(value: Value<C>) => reverseLookup(value, childItemReverseLookup)}
                            childSort={sortChild.current}
                            overrides={labelOverrides}
                            onCheckedChange={onCheckedChange}
                            formChildId={formChildId}
                            checkedItems={thisFilterItems}
                            options={options}
                        />
                    );
                })}
        </>
    );
}

export default NestedFilter;
