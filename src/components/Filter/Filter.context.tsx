import { createContext, SyntheticEvent, useContext } from 'react';
import { CheckboxSizes } from './Filters';
import { CheckboxProps, TypographyProps } from '@mui/material';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';

export const OTHER_DEFAULT = 'OTHER';

export type FilterOptions = {
    replaceChildrenWithParentOnAllChecked?: boolean;
    combineChildrenAndParentItems?: boolean; //TODO: ditch this
    filterSortNameOverrides?: { parent?: string; child?: string };
    childOptions?: {
        childOtherTitleOverride?: string;
        childItemProps?: TreeItemProps; //TODO: Implement
    };
    otherRename?: string;
    checkboxProps?: CheckboxProps; //TODO: Implement
    labelProps?: TypographyProps; //TODO: Implement
    parentItemProps?: TreeItemProps; //TODO: Implement
};

export type NestedItemsType = Record<string, Set<string>>;
export type CheckedItemsType = Record<string, NestedItemsType>;

export const FilterContext = createContext<{
    checkboxSize: CheckboxSizes;
    expandedItems: Set<string>;
    checkedItems: CheckedItemsType;
    defaultBuckets: { parent: string; child: string };
    onItemChecked: (key: string, update: NestedItemsType) => void;
    onItemExpansionToggle: (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => void;
    options?: FilterOptions;
}>({
    checkboxSize: 'medium',
    expandedItems: new Set<string>(),
    checkedItems: { default: { default: new Set() } },
    defaultBuckets: { parent: 'parent', child: 'child' },
    onItemChecked: () => {},
    onItemExpansionToggle: () => {},
    options: { combineChildrenAndParentItems: false },
});

export const useFilterContext = () => {
    const context = useContext(FilterContext) as unknown as {
        checkboxSize: CheckboxSizes;
        expandedItems: Set<string>;
        checkedItems: CheckedItemsType;
        defaultBuckets: { parent: string; child: string };
        onItemChecked: (key: string, update: NestedItemsType) => void;
        onItemExpansionToggle: (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => void;
        options: FilterOptions;
    };

    if (!context) {
        throw new Error('useFilterContext must be used within a <Filters> component.');
    }
    return context;
};
