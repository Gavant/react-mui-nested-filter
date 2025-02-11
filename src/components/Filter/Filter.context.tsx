import { createContext, SyntheticEvent, useContext } from 'react';
import { CheckboxSizes } from './Filters';
import { CheckboxProps, TypographyProps } from '@mui/material';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';

export type FilterOptions = {
    replaceChildrenWithParentOnAllChecked?: boolean;
    combineChildrenAndParentItems?: boolean; //TODO: ditch this
    filterSortNameOverrides?: { default?: string; parent?: string; child?: string };
    checkboxProps?: CheckboxProps; //TODO: Implement
    labelProps?: TypographyProps; //TODO: Implement
    childItemProps?: TreeItemProps; //TODO: Implement
    parentItemProps?: TreeItemProps; //TODO: Implement
};

export type NestedItemsType = Record<string, Set<string>>;
export type CheckedItemsType = Record<string, NestedItemsType>;

export const FilterContext = createContext<{
    checkboxSize: CheckboxSizes;
    expandedItems: Set<string>;
    checkedItems: CheckedItemsType;
    defaultBuckets: { default: string; parent: string; child: string };
    onItemChecked: (key: string, update: NestedItemsType) => void;
    onItemExpansionToggle: (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => void;
    options?: FilterOptions;
}>({
    checkboxSize: 'medium',
    expandedItems: new Set<string>(),
    checkedItems: { default: { default: new Set() } },
    defaultBuckets: { default: 'combined', parent: 'parent', child: 'child' },
    onItemChecked: () => {},
    onItemExpansionToggle: () => {},
    options: { combineChildrenAndParentItems: false },
});

export const useFilterContext = () => {
    const context = useContext(FilterContext) as unknown as {
        checkboxSize: CheckboxSizes;
        expandedItems: Set<string>;
        checkedItems: CheckedItemsType;
        defaultBuckets: { default: string; parent: string; child: string };
        onItemChecked: (key: string, update: NestedItemsType) => void;
        onItemExpansionToggle: (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => void;
        options: FilterOptions;
    };

    if (!context) {
        throw new Error('useFilterContext must be used within a <Filters> component.');
    }
    return context;
};
