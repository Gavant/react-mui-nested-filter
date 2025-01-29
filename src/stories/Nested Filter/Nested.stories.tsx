import type { Meta, StoryObj } from '@storybook/react';
import { Grid2 } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import Filters, { FilterProps } from './Filters.tsx';

const meta = {
    title: 'Example/NestedFilter',
    component: Filters,
    tags: ['autodocs'],
    argTypes: {
        checkboxSize: {
            options: ['small', 'medium', 'large'],
        },
        replaceChildrenWithParentOnAllChecked: {
            control: 'boolean',
            description: 'Replace children with parent when all are checked',
        },
        options: {
            control: false,
            disable: true,
        },
        onFilterChange: {
            disable: true,
        },
    },
} satisfies Meta<any>;

export default meta;

const Template = (args: FilterProps) => {
    // Destructure args to get the individual properties
    const { options, ...restArgs } = args;

    const [filters, setFilters] = useState<Set<string>>(new Set());

    const handleFilterChange = (newFilters: Set<string>) => {
        setFilters(newFilters);
        action('onFilterChange')(newFilters); // This logs the emitted filters
    };

    // Ensure that options contains the updated values, including 'replaceChildrenWithParentOnAllChecked'

    const updatedOptions = {
        ...options,
        // @ts-ignore
        replaceChildrenWithParentOnAllChecked: args['options.replaceChildrenWithParentOnAllChecked'],
    };

    return (
        <Grid2 container>
            <Grid2 size={{ xs: 6 }}>
                <Filters {...restArgs} options={updatedOptions} onFilterChange={handleFilterChange} />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
                <pre>{JSON.stringify(Array.from(filters), null, 2)}</pre> {/* Display the filters */}
            </Grid2>
        </Grid2>
    );
};

export const Default = Template.bind({});
