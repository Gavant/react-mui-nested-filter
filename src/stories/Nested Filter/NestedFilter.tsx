import { CheckboxSizes } from './Filters.tsx';
import { useMemo, useRef } from 'react';
import ParentChildFilter from './ParentChildFilter.tsx';

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

type ParentFilterOptions = {
    replaceChildrenWithParentOnAllChecked?: boolean;
};
export interface ParentType extends Record<string, string> {}
export interface ChildType extends Record<string, string> {}

type Value<V> = V[keyof V];

export type MappingKey<I> = Value<I>;
type MappingValue<C> = Array<C[keyof C]>;
type MappingType<I extends ParentType, C extends ChildType> = Partial<Record<MappingKey<I>, MappingValue<C>>>;
interface ParentFilterProps<I extends ParentType, C extends ChildType, M extends MappingType<I, C>> {
    items: I;
    childItems: C;
    mapping: M;
    size: CheckboxSizes;
    expandedItems: Set<string>;
    // Sort the parent by value
    parentSort?: Record<Value<I>, number>;
    // Sort the child by value
    childSort?: Record<Value<I>, number>;
    // Display string overrides for a given value - both parent and child
    overrides?: Partial<Record<Value<I> | Value<C>, string>>;
    onChecked: (update: Set<string>) => void;
    checked: Set<string>;
    options?: ParentFilterOptions;
}

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

function NestedFilter<I extends ParentType, C extends ChildType, M extends MappingType<I, C>>({
    items,
    childItems,
    mapping,
    size,
    parentSort,
    childSort,
    overrides,
    onChecked,
    checked,
    options = { replaceChildrenWithParentOnAllChecked: true },
}: ParentFilterProps<I, C, M>) {
    const sortParent = useRef(sortFunction(parentSort));
    const sortChild = useRef(sortFunction(childSort));

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

    const onCheckedChange = (parentKey: keyof I, childKey: keyof C | undefined, value: string, isChecked: boolean) => {
        const checkedUpdate = checked;
        const children = mapping[items[parentKey]] as MappingValue<C>;
        const parentValue = items[parentKey];

        if (isChecked) {
            // adding
            if (childKey) {
                checkedUpdate.add(value);
                if (children.every((item) => checkedUpdate.has(item)) && options.replaceChildrenWithParentOnAllChecked) {
                    // Every child is checked - replace with parent
                    children.forEach((item) => checkedUpdate.delete(item));
                    checkedUpdate.add(parentValue);
                }
            } else {
                const checkedChildItems = children.filter((b) => checkedUpdate.has(b));
                checkedChildItems.forEach((childItem) => checkedUpdate.delete(childItem));
                checkedUpdate.add(value); //Add Parent
            }
        } else {
            // removing
            if (childKey) {
                // Child
                if (checkedUpdate.has(childItems[childKey])) {
                    // If the child key is already there then we have a straight-forward removal
                    checkedUpdate.delete(value);
                } else if (checkedUpdate.has(parentValue)) {
                    // The parent is standing in for all individual items - so we have to remove the parent, add all the children
                    // excluding our checked item
                    children.forEach((item) => checkedUpdate.add(item));
                    checkedUpdate.delete(parentValue);
                    checkedUpdate.delete(value);
                }
            } else {
                // Remove parent + all children
                const checkedChildItems = children.filter((b) => checkedUpdate.has(b));
                checkedChildItems.forEach((childItem) => checkedUpdate.delete(childItem));
                checkedUpdate.delete(value);
            }
        }

        onChecked(checkedUpdate);
    };

    return (
        <>
            {Object.keys(mapping)
                .sort(sortParent.current)
                .map((key) => {
                    const parentValue = key as MappingKey<I>;

                    return (
                        <ParentChildFilter<I, C>
                            parentKey={reverseLookup(parentValue, itemReverseLookup)}
                            parentValue={parentValue}
                            pid={formParentId(parentValue)}
                            childItems={mapping[parentValue]}
                            childReverseLookup={(value: Value<C>) => reverseLookup(value, childItemReverseLookup)}
                            childSort={sortChild.current}
                            overrides={overrides}
                            size={size}
                            checkedItems={checked}
                            onCheckedChange={onCheckedChange}
                            formChildId={formChildId}
                        />
                    );
                })}
        </>
    );
}

export default NestedFilter;
