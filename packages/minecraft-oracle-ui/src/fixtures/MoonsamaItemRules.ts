export const MOONSAMA_CATEGORY_INCOMPATIBILITIES: {[key: string]: string[]} = {
    'Main Hand': ['Special Items'],
    'Off Hand': ['Special Items'],
    'Special Items': ['Main Hand', 'Off Hand'],
}

// individual item overrides for certain parents
export const MOONSAMA_PARENT_CHILDREN_OVERRIDES: {[key: string]: {[key: string]: string}} = {
    '1285-0xb654611f84a8dc429ba3cb4fda9fad236c505a1a-545': {
        '1285-0x00005-1': '1285-0x00006-1'
    },
    '1285-0xb654611f84a8dc429ba3cb4fda9fad236c505a1a-605': {
        '1285-0x00004-1': '1285-0x00006-2'
    }
}

export default MOONSAMA_CATEGORY_INCOMPATIBILITIES