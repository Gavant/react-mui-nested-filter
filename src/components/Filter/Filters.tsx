import { CheckboxProps } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { ReactNode, SyntheticEvent, useState } from 'react';
import { CheckedItemsType, FilterContext, FilterOptions } from './Filter.context.tsx';

export type MuiCheckboxSizes = Pick<CheckboxProps, 'size'>['size'];

export type CheckboxSizes = 'small' | 'medium' | 'large';
export type FilterItems = CheckedItemsType;

const DEFAULT_BUCKETS = { default: 'combined', parent: 'parent', child: 'child' };
export const createDefaultBuckets = () => ({
    [DEFAULT_BUCKETS.default]: new Set<string>(), //TODO: Ditch default bucket.
    [DEFAULT_BUCKETS.parent]: new Set<string>(),
    [DEFAULT_BUCKETS.child]: new Set<string>(),
});

export interface FilterProps {
    checkboxSize: MuiCheckboxSizes;
    initialCheckedItems?: CheckedItemsType;
    controlledCheckedItems?: CheckedItemsType;
    onFilterChange: (updatedFilters: CheckedItemsType) => void;
    options?: FilterOptions; // Add a specific type for options
    children: ReactNode | ReactNode[];
}

function Filters<T extends boolean>({
    checkboxSize = 'medium',
    initialCheckedItems,
    onFilterChange,
    controlledCheckedItems,
    options = { replaceChildrenWithParentOnAllChecked: true, combineChildrenAndParentItems: true } as FilterOptions & {
        combineChildrenAndParentItems: T;
    },
    children,
}: FilterProps) {
    const isControlled = controlledCheckedItems !== undefined;
    const [items, setItems] = useState<Record<string, { isExpanded: boolean }>>({});
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [checkedItems, setCheckedItemsWrapped] = useState<CheckedItemsType>(() => initialCheckedItems ?? {});
    const currentCheckedItems = isControlled ? controlledCheckedItems : checkedItems;

    const setCheckedItems = (key: string, updateItems: Set<string> | Record<string, Set<string>>) => {
        const result = { [key]: { ...(updateItems as Record<string, Set<string>>) }, ...currentCheckedItems };
        if (!isControlled) {
            setCheckedItemsWrapped(result);
        }
        return result;
    };

    const handleItemExpansionToggle = (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => {
        const updateItems = items;
        if (updateItems[itemId]) {
            updateItems[itemId].isExpanded = isExpanded;
        } else {
            updateItems[itemId] = {
                isExpanded: isExpanded,
            };
        }

        setExpandedItems(new Set(Object.keys(items).filter((key) => items[key].isExpanded)));
        setItems(updateItems);
    };

    const onItemChecked = (key: string, update: Record<string, Set<string>>) => {
        const result = setCheckedItems(key, update);

        onFilterChange(result);
    };

    const contextValue = {
        checkboxSize,
        expandedItems,
        checkedItems: currentCheckedItems,
        onItemExpansionToggle: handleItemExpansionToggle,
        onItemChecked,
        options,
        defaultBuckets: DEFAULT_BUCKETS,
        createDefaultBuckets,
    };

    return (
        <FilterContext.Provider value={contextValue}>
            <SimpleTreeView expandedItems={Array.from(expandedItems)} onItemExpansionToggle={handleItemExpansionToggle}>
                {children}
            </SimpleTreeView>
        </FilterContext.Provider>
    );
}

export default Filters;
