import FilterItem from './FilterItem.tsx';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { createDefaultBuckets } from './Filters.tsx';
import { CSSProperties } from 'styled-components';
import { useFilterContext } from './Filter.context.tsx';
import { useCallback } from 'react';

export interface FilterItemInterface extends Omit<TreeItemProps, 'title' | 'id' | 'itemId'> {
    id: string;
    onChecked?: (checked: boolean) => void;
    filterKey: string;
    groupWithChildren?: boolean;
    title: string;
    key?: string;
    value: string;
    className?: string;
    style?: CSSProperties;
    labelProps?: {
        className?: string;
        style?: CSSProperties;
    };
}

function StandaloneFilter({ id, filterKey, title, value, groupWithChildren = false }: FilterItemInterface) {
    const { checkedItems, onItemChecked, defaultBuckets, checkboxSize } = useFilterContext();
    const thisFilterItems = checkedItems?.[filterKey] ?? createDefaultBuckets();

    const getBucket = useCallback(() => (groupWithChildren ? defaultBuckets.child : defaultBuckets.parent), [groupWithChildren]);

    const onCheckedChange = (isChecked: boolean) => {
        const checkedUpdate = thisFilterItems;
        if (isChecked) {
            checkedUpdate?.[getBucket()].add(value);
        } else {
            checkedUpdate?.[getBucket()].delete(value);
        }

        onItemChecked(filterKey, thisFilterItems);
    };

    return (
        <FilterItem
            size={checkboxSize}
            title={title}
            itemId={id}
            id={id} //TODO: Drop and replace with `value`? Or use same logic ParentChild uses
            isChecked={thisFilterItems?.[getBucket()].has(value)}
            onChecked={onCheckedChange}
        />
    );
}

export default StandaloneFilter;
