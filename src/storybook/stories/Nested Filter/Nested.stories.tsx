import type { Meta } from '@storybook/react';

import { Button, Grid2 } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { useRef, useState } from 'react';
import Filters, { FilterItems, FilterRef, MuiCheckboxSizes } from './../../../components/Filter/Filters';
import { breedMapping, PetBreed, PetType, sort, Overrides } from './data/data';
import NestedFilter from './../../../components/Filter/NestedFilter';
import StandaloneFilter from './../../../components/Filter/StandaloneFilter';
import styled from 'styled-components';

const NestedFilterWrapped = styled(NestedFilter)`
    .parent-filter-item {
    }

    .child-filter-item {
        .checkbox {
        }
        .label {
        }
    }
`;

const StandaloneFilterWrapped = styled(StandaloneFilter)``;

const meta: Meta<Record<string, unknown>> = {
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
};

interface TemplateProps {
    replaceChildrenWithParentOnAllChecked: boolean;
    checkboxSize: MuiCheckboxSizes;
}

export default meta;

const Template = (args: TemplateProps) => {
    const ref = useRef<FilterRef>(null);
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

    const clearFilters = () => {
        ref.current?.clearFilters();
    };

    return (
        <Grid2 container>
            <Grid2 size={{ xs: 6 }}>
                <Filters
                    ref={ref}
                    {...restArgs}
                    checkboxSize={args.checkboxSize}
                    onFilterChange={handleFilterChange}
                    options={updatedOptions}
                >
                    <NestedFilterWrapped
                        filterKey="PetTypeBreed"
                        items={PetType}
                        childItems={PetBreed}
                        mapping={breedMapping}
                        labelOverrides={Overrides}
                        parentSort={sort}
                        includeOther
                    />
                    <StandaloneFilterWrapped filterKey="PetTypeBreed" title="Other" value="OTHER" />
                    <StandaloneFilter filterKey="somethingElse" title="Something Else" value="2" />
                </Filters>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
                <Button variant="contained" onClick={clearFilters}>
                    Clear
                </Button>
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
