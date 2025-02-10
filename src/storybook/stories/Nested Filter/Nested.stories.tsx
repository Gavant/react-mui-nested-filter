import type { Meta } from '@storybook/react';

import { Grid2 } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import Filters, { FilterItems, MuiCheckboxSizes } from '../../../components/Filter/Filters.tsx';
import { breedMapping, PetBreed, PetType, sort, Overrides } from './data/data.ts';
import NestedFilter from '../../../components/Filter/NestedFilter.tsx';
import StandaloneFilter from '../../../components/Filter/StandaloneFilter.tsx';

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
        initialCheckedItems: {
            control: 'object',
            description: 'Sets the initial checked values on render',
        },
        children: {
            control: false,
            disable: true,
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

interface TemplateProps {
    replaceChildrenWithParentOnAllChecked: boolean;
    checkboxSize: MuiCheckboxSizes;
}

export default meta;

const Template = (args: TemplateProps) => {
    // Destructure args to get the individual properties
    const { ...restArgs } = args;

    const [filters, setFilters] = useState<FilterItems>({ filters: {} });

    const handleFilterChange = (newFilters: FilterItems) => {
        setFilters(newFilters);
        action('onFilterChange')(newFilters); // This logs the emitted filters
    };

    // Ensure that options contains the updated values, including 'replaceChildrenWithParentOnAllChecked'

    const updatedOptions = {
        replaceChildrenWithParentOnAllChecked: args.replaceChildrenWithParentOnAllChecked as boolean,
    };

    return (
        <Grid2 container>
            <Grid2 size={{ xs: 6 }}>
                <Filters {...restArgs} checkboxSize={args.checkboxSize} onFilterChange={handleFilterChange} options={updatedOptions}>
                    <NestedFilter
                        filterKey="PetTypeBreed"
                        items={PetType}
                        childItems={PetBreed}
                        mapping={breedMapping}
                        labelOverrides={Overrides}
                        parentSort={sort}
                    />
                    <StandaloneFilter filterKey="PetTypeBreed" title="Other" value="OTHER" />
                </Filters>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
                {Object.keys(filters).map((key) => (
                    <pre key={key}>
                        {key}:
                        {Object.keys(filters?.[key]).map((pc) => (
                            <pre key={`${key}-${pc}`} style={{ marginLeft: '5px' }}>
                                {pc}:{JSON.stringify(Array.from(filters?.[key]?.[pc]))}
                            </pre>
                        ))}
                    </pre>
                ))}
            </Grid2>
        </Grid2>
    );
};

export const Default = Template.bind({});
