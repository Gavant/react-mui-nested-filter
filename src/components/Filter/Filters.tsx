import { CheckboxProps } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { ReactNode, SyntheticEvent, useState, forwardRef, useImperativeHandle, Ref } from 'react';
import { CheckedItemsType, FilterContext, FilterOptions } from './Filter.context';
import { createDefaultBuckets, DEFAULT_BUCKETS } from '../../constants/constants';

export type MuiCheckboxSizes = Pick<CheckboxProps, 'size'>['size'];

export type CheckboxSizes = 'small' | 'medium' | 'large';
export type FilterItems = CheckedItemsType;

export interface FilterProps {
    checkboxSize: MuiCheckboxSizes;
    initialCheckedItems?: CheckedItemsType;
    controlledCheckedItems?: CheckedItemsType;
    onFilterChange: (updatedFilters: CheckedItemsType) => void;
    options?: FilterOptions;
    children: ReactNode | ReactNode[];
}

export interface FilterRef {
    clearFilters: () => void;
}

const Filters = forwardRef<FilterRef, FilterProps>(function Filters<T extends boolean>(
    {
        checkboxSize = 'medium',
        initialCheckedItems,
        onFilterChange,
        controlledCheckedItems,
        options = { replaceChildrenWithParentOnAllChecked: true, combineChildrenAndParentItems: true } as FilterOptions & {
            combineChildrenAndParentItems: T;
        },
        children,
    }: FilterProps,
    ref: Ref<FilterRef>
) {
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

    useImperativeHandle(ref, () => ({
        clearFilters: () => {
            setCheckedItemsWrapped({});
            setExpandedItems(new Set());
            setItems({});
            onFilterChange({}); // Notify parent
        },
    }));

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
});

export default Filters;
