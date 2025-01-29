import { CheckboxProps } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SyntheticEvent, useState } from 'react';
import NestedFilter from './NestedFilter.tsx';

export enum PetType {
    Bird = 'BIRD',
    Cat = 'CAT',
    Dog = 'DOG',
    Fish = 'FISH',
    Horse = 'HORSE',
    Lizard = 'LIZARD',
    Other = 'OTHER',
    SmallMammal = 'SMALL_MAMMAL',
}

function getBreedsByType(petType: PetType): PetBreed[] {
    return Object.entries(petBreedMapping)
        .filter(([_, value]) => value === petType)
        .map(([key]) => key as PetBreed);
}

export enum PetBreed {
    Abyssinian = 'ABYSSINIAN',
    AfricanCichlid = 'AFRICAN_CICHLID',
    AmericanLonghair = 'AMERICAN_LONGHAIR',
    AmericanQuarterHorse = 'AMERICAN_QUARTER_HORSE',
    AmericanShorthair = 'AMERICAN_SHORTHAIR',
    Angelfish = 'ANGELFISH',
    Appaloosa = 'APPALOOSA',
    Arabian = 'ARABIAN',
    Arowana = 'AROWANA',
    AustralianShepherd = 'AUSTRALIAN_SHEPHERD',
    Barb = 'BARB',
    Beagle = 'BEAGLE',
    BeardedDragon = 'BEARDED_DRAGON',
    Bengal = 'BENGAL',
    BerneseMountainDog = 'BERNESE_MOUNTAIN_DOG',
    Betta = 'BETTA',
    Birman = 'BIRMAN',
    BorderCollie = 'BORDER_COLLIE',
    BostonTerrier = 'BOSTON_TERRIER',
    Boxer = 'BOXER',
    BritishShorthair = 'BRITISH_SHORTHAIR',
    Bulldog = 'BULLDOG',
    Canary = 'CANARY',
    Catfish = 'CATFISH',
    CavalierKingCharlesSpaniel = 'CAVALIER_KING_CHARLES_SPANIEL',
    Chameleon = 'CHAMELEON',
    Chihuahua = 'CHIHUAHUA',
    Chinchilla = 'CHINCHILLA',
    Clown = 'CLOWN',
    CockerSpaniel = 'COCKER_SPANIEL',
    Conure = 'CONURE',
    Corgi = 'CORGI',
    CornishRex = 'CORNISH_REX',
    CrestedGeko = 'CRESTED_GEKO',
    Dachshund = 'DACHSHUND',
    Danios = 'DANIOS',
    DevonRex = 'DEVON_REX',
    DobermanPinscher = 'DOBERMAN_PINSCHER',
    DomesticNonPedigreedCat = 'DOMESTIC_NON_PEDIGREED_CAT',
    Dove = 'DOVE',
    Draft = 'DRAFT',
    DwarfCichlid = 'DWARF_CICHLID',
    EnglishSpringerSpaniel = 'ENGLISH_SPRINGER_SPANIEL',
    ExoticShorthair = 'EXOTIC_SHORTHAIR',
    Ferret = 'FERRET',
    Finch = 'FINCH',
    FrenchBulldog = 'FRENCH_BULLDOG',
    Gaited = 'GAITED',
    Gerbil = 'GERBIL',
    GermanShepherd = 'GERMAN_SHEPHERD',
    GoldenRetriever = 'GOLDEN_RETRIEVER',
    Goldfish = 'GOLDFISH',
    Gourami = 'GOURAMI',
    GradeHorse = 'GRADE_HORSE',
    GreatDane = 'GREAT_DANE',
    GreenAnole = 'GREEN_ANOLE',
    GuineaPig = 'GUINEA_PIG',
    Guppy = 'GUPPY',
    Hamster = 'HAMSTER',
    Havanese = 'HAVANESE',
    Iguana = 'IGUANA',
    Killifish = 'KILLIFISH',
    Koi = 'KOI',
    LabradorRetriever = 'LABRADOR_RETRIEVER',
    LeopardGecko = 'LEOPARD_GECKO',
    Lovebird = 'LOVEBIRD',
    Macaw = 'MACAW',
    MainCoonCat = 'MAIN_COON_CAT',
    MixedBreed = 'MIXED_BREED',
    Molly = 'MOLLY',
    Monitor = 'MONITOR',
    Morgan = 'MORGAN',
    Mouse = 'MOUSE',
    NeonTetra = 'NEON_TETRA',
    NewWorldCichlid = 'NEW_WORLD_CICHLID',
    NorwegianForestCat = 'NORWEGIAN_FOREST_CAT',
    OrientalShorthair = 'ORIENTAL_SHORTHAIR',
    Other = 'OTHER',
    Parakeet = 'PARAKEET',
    Parrot = 'PARROT',
    Persian = 'PERSIAN',
    Platy = 'PLATY',
    Pomeranian = 'POMERANIAN',
    Pony = 'PONY',
    Poodle = 'POODLE',
    PoodleMix = 'POODLE_MIX',
    Puffer = 'PUFFER',
    Rabbit = 'RABBIT',
    Ragdoll = 'RAGDOLL',
    Rainbow = 'RAINBOW',
    Rasbora = 'RASBORA',
    Rat = 'RAT',
    Rottweiler = 'ROTTWEILER',
    RussianBlue = 'RUSSIAN_BLUE',
    Schnauzer = 'SCHNAUZER',
    ScottishFold = 'SCOTTISH_FOLD',
    SelkirkRex = 'SELKIRK_REX',
    ShetlandSheepdog = 'SHETLAND_SHEEPDOG',
    ShihTzu = 'SHIH_TZU',
    ShorthairedPointer = 'SHORTHAIRED_POINTER',
    Siamese = 'SIAMESE',
    Siberian = 'SIBERIAN',
    SiberianHusky = 'SIBERIAN_HUSKY',
    Skink = 'SKINK',
    Sphynx = 'SPHYNX',
    SugarGlider = 'SUGAR_GLIDER',
    Swordtail = 'SWORDTAIL',
    Tegu = 'TEGU',
    Thoroughbred = 'THOROUGHBRED',
    Uromastyx = 'UROMASTYX',
    Warmblood = 'WARMBLOOD',
    YorkshireTerrier = 'YORKSHIRE_TERRIER',
}

const petBreedMapping: Record<PetBreed, PetType> = {
    ABYSSINIAN: PetType.Cat,
    AFRICAN_CICHLID: PetType.Fish,
    AMERICAN_LONGHAIR: PetType.Cat,
    AMERICAN_QUARTER_HORSE: PetType.Horse,
    AMERICAN_SHORTHAIR: PetType.Cat,
    ANGELFISH: PetType.Fish,
    APPALOOSA: PetType.Horse,
    ARABIAN: PetType.Horse,
    AROWANA: PetType.Fish,
    AUSTRALIAN_SHEPHERD: PetType.Dog,
    BARB: PetType.Fish,
    BEAGLE: PetType.Dog,
    BEARDED_DRAGON: PetType.Lizard,
    BENGAL: PetType.Cat,
    BERNESE_MOUNTAIN_DOG: PetType.Dog,
    BETTA: PetType.Fish,
    BIRMAN: PetType.Cat,
    BORDER_COLLIE: PetType.Dog,
    BOSTON_TERRIER: PetType.Dog,
    BOXER: PetType.Dog,
    BRITISH_SHORTHAIR: PetType.Cat,
    BULLDOG: PetType.Dog,
    CANARY: PetType.Bird,
    CATFISH: PetType.Fish,
    CAVALIER_KING_CHARLES_SPANIEL: PetType.Dog,
    CHAMELEON: PetType.Lizard,
    CHIHUAHUA: PetType.Dog,
    CHINCHILLA: PetType.SmallMammal,
    CLOWN: PetType.Fish,
    COCKER_SPANIEL: PetType.Dog,
    CONURE: PetType.Bird,
    CORGI: PetType.Dog,
    CORNISH_REX: PetType.Cat,
    CRESTED_GEKO: PetType.Lizard,
    DACHSHUND: PetType.Dog,
    DANIOS: PetType.Fish,
    DEVON_REX: PetType.Cat,
    DOBERMAN_PINSCHER: PetType.Dog,
    DOMESTIC_NON_PEDIGREED_CAT: PetType.Cat,
    DOVE: PetType.Bird,
    DRAFT: PetType.Horse,
    DWARF_CICHLID: PetType.Fish,
    ENGLISH_SPRINGER_SPANIEL: PetType.Dog,
    EXOTIC_SHORTHAIR: PetType.Cat,
    FERRET: PetType.SmallMammal,
    FINCH: PetType.Bird,
    FRENCH_BULLDOG: PetType.Dog,
    GAITED: PetType.Horse,
    GERBIL: PetType.SmallMammal,
    GERMAN_SHEPHERD: PetType.Dog,
    GOLDEN_RETRIEVER: PetType.Dog,
    GOLDFISH: PetType.Fish,
    GOURAMI: PetType.Fish,
    GRADE_HORSE: PetType.Horse,
    GREAT_DANE: PetType.Dog,
    GREEN_ANOLE: PetType.Lizard,
    GUINEA_PIG: PetType.SmallMammal,
    GUPPY: PetType.Fish,
    HAMSTER: PetType.SmallMammal,
    HAVANESE: PetType.Dog,
    IGUANA: PetType.Lizard,
    KILLIFISH: PetType.Fish,
    KOI: PetType.Fish,
    LABRADOR_RETRIEVER: PetType.Dog,
    LEOPARD_GECKO: PetType.Lizard,
    LOVEBIRD: PetType.Bird,
    MACAW: PetType.Bird,
    MAIN_COON_CAT: PetType.Cat,
    MIXED_BREED: PetType.Dog,
    MOLLY: PetType.Fish,
    MONITOR: PetType.Lizard,
    MORGAN: PetType.Horse,
    MOUSE: PetType.SmallMammal,
    NEON_TETRA: PetType.Fish,
    NEW_WORLD_CICHLID: PetType.Fish,
    NORWEGIAN_FOREST_CAT: PetType.Cat,
    ORIENTAL_SHORTHAIR: PetType.Cat,
    OTHER: PetType.Other,
    PARAKEET: PetType.Bird,
    PARROT: PetType.Bird,
    PERSIAN: PetType.Cat,
    PLATY: PetType.Fish,
    POMERANIAN: PetType.Dog,
    PONY: PetType.Horse,
    POODLE: PetType.Dog,
    POODLE_MIX: PetType.Dog,
    PUFFER: PetType.Fish,
    RABBIT: PetType.SmallMammal,
    RAGDOLL: PetType.Cat,
    RAINBOW: PetType.Fish,
    RASBORA: PetType.Fish,
    RAT: PetType.SmallMammal,
    ROTTWEILER: PetType.Dog,
    RUSSIAN_BLUE: PetType.Cat,
    SCHNAUZER: PetType.Dog,
    SCOTTISH_FOLD: PetType.Cat,
    SELKIRK_REX: PetType.Cat,
    SHETLAND_SHEEPDOG: PetType.Dog,
    SHIH_TZU: PetType.Dog,
    SHORTHAIRED_POINTER: PetType.Dog,
    SIAMESE: PetType.Cat,
    SIBERIAN: PetType.Cat,
    SIBERIAN_HUSKY: PetType.Dog,
    SKINK: PetType.Lizard,
    SPHYNX: PetType.Cat,
    SUGAR_GLIDER: PetType.SmallMammal,
    SWORDTAIL: PetType.Fish,
    TEGU: PetType.Lizard,
    THOROUGHBRED: PetType.Horse,
    UROMASTYX: PetType.Lizard,
    WARMBLOOD: PetType.Horse,
    YORKSHIRE_TERRIER: PetType.Dog,
};

export const breedMapping: Record<Exclude<PetType, PetType.Other>, PetBreed[]> = {
    [PetType.Bird]: getBreedsByType(PetType.Bird),
    [PetType.Cat]: getBreedsByType(PetType.Cat),
    [PetType.Dog]: getBreedsByType(PetType.Dog),
    [PetType.Fish]: getBreedsByType(PetType.Fish),
    [PetType.Horse]: getBreedsByType(PetType.Horse),
    [PetType.Lizard]: getBreedsByType(PetType.Lizard),
    [PetType.SmallMammal]: getBreedsByType(PetType.SmallMammal),
};

// Provision it such that sorting is a property of the mapping? I like the idea of keeping the mapping lighter and having each
// controllable portion being separate from another. This keeps the mapping light if we don't need it to be thick.
const sort = {
    [PetType.Bird]: 1,
    [PetType.Cat]: 2,
    [PetType.Dog]: 3,
    [PetType.Fish]: 4,
    [PetType.Horse]: 5,
    [PetType.Lizard]: 6,
    [PetType.SmallMammal]: 7,
    [PetType.Other]: 8,
};

export type MuiCheckboxSizes = Pick<CheckboxProps, 'size'>['size'];

export type CheckboxSizes = 'small' | 'medium' | 'large';

const Overrides = {
    [PetType.SmallMammal]: 'Little Furry Guys',
};

type FilterOptions = {
    replaceChildrenWithParentOnAllChecked: boolean;
};

export interface FilterProps {
    checkboxSize: MuiCheckboxSizes;
    onFilterChange: (updatedFilters: Set<string>) => void;
    options?: FilterOptions;
}

function Filters({ checkboxSize = 'medium', onFilterChange, options = { replaceChildrenWithParentOnAllChecked: true } }: FilterProps) {
    console.log(options?.replaceChildrenWithParentOnAllChecked);
    const [items, setItems] = useState<Record<string, { isExpanded: boolean }>>({});
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [checkedItems, setCheckedItemsWrapped] = useState<Set<string>>(new Set([]));
    const setCheckedItems = (items: Set<string>) => setCheckedItemsWrapped(new Set(items));

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

    const onItemChecked = (update: Set<string>) => {
        setCheckedItems(update);
        onFilterChange(update);
    };

    console.log(checkedItems);

    return (
        <>
            <SimpleTreeView expandedItems={Array.from(expandedItems)} onItemExpansionToggle={handleItemExpansionToggle}>
                <NestedFilter
                    items={PetType}
                    childItems={PetBreed}
                    mapping={breedMapping}
                    overrides={Overrides}
                    parentSort={sort}
                    checked={checkedItems}
                    onChecked={onItemChecked}
                    expandedItems={expandedItems}
                    size={checkboxSize}
                    options={options}
                />
            </SimpleTreeView>
        </>
    );
}

export default Filters;
