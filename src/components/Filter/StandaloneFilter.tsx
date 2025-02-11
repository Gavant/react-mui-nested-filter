import FilterItem from './FilterItem';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { createDefaultBuckets } from './Filters';
import { CSSProperties } from 'styled-components';
import { useFilterContext } from './Filter.context';
import { useCallback } from 'react';

const formId = (identifier: any) => `standalone-${identifier}`;

export interface FilterItemInterface extends Omit<TreeItemProps, 'title' | 'id' | 'itemId'> {
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

function StandaloneFilter({ filterKey, title, value, groupWithChildren = false }: FilterItemInterface) {
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
            itemId={formId(value)}
            id={formId(value)}
            isChecked={thisFilterItems?.[getBucket()].has(value)}
            onChecked={onCheckedChange}
        />
    );
}

export default StandaloneFilter;
