import { CheckboxSizes, MuiCheckboxSizes } from './Filters';
import { Checkbox, Typography } from '@mui/material';
import styled, { CSSProperties } from 'styled-components';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { ReactNode, useEffect, useState } from 'react';

const Title = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 1px;
`;

const Label = styled.div<{ $padding: CSSProperties['padding'] | undefined }>`
    display: flex;
    vertical-align: center;
    align-content: center;
    align-items: center;
    > span {
        padding: ${({ $padding }) => $padding ?? 0};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const CheckboxSize: Record<CheckboxSizes, { caretSize: string; fontSize: string; size: MuiCheckboxSizes }> = {
    large: {
        caretSize: '2rem',
        fontSize: '1.15rem',
        size: 'large' as MuiCheckboxSizes,
    },
    medium: {
        caretSize: '1.125rem',
        fontSize: '1rem',
        size: 'medium' as MuiCheckboxSizes,
    },
    small: {
        caretSize: '1rem',
        fontSize: '.8rem',
        size: 'small' as MuiCheckboxSizes,
    },
};

export interface FilterItemInterface extends Omit<TreeItemProps, 'title'> {
    isChecked?: boolean;
    size: CheckboxSizes;
    onChecked?: (checked: boolean) => void;
    indeterminate?: boolean;
    title: string;
    className?: string;
    style?: CSSProperties;
    labelProps?: {
        className?: string;
        style?: CSSProperties;
    };
}

type FilterItemProps = FilterItemInterface &
    (
        | { children: ReactNode; indeterminate: boolean } // `indeterminate` is required if `children` are passed
        | { children?: undefined; indeterminate?: never } // `indeterminate` is not allowed if `children` are not passed
    );

function FilterItem({ id, indeterminate, itemId, isChecked, size, onChecked, title, children, labelProps, className }: FilterItemProps) {
    return (
        <TreeItem
            itemId={itemId}
            id={id}
            className={className}
            label={
                <Label $padding={0}>
                    <Checkbox
                        className={'checkbox'}
                        style={labelProps?.style}
                        checked={isChecked}
                        indeterminate={indeterminate}
                        size={CheckboxSize[size].size}
                        value={isChecked}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChecked?.((e.target as HTMLInputElement).checked);
                        }}
                    />
                    &nbsp;
                    <Title
                        className={labelProps?.className ?? 'label'}
                        onClick={() => onChecked?.(!isChecked)}
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        <Typography fontSize={CheckboxSize[size].fontSize} noWrap variant="caption">
                            {title} - {`${indeterminate}`}
                        </Typography>
                    </Title>
                </Label>
            }
        >
            {children}
        </TreeItem>
    );
}

export default FilterItem;
