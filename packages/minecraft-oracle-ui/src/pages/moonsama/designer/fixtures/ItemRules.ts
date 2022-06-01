import { reverseMap } from "../utils"
import { ATTRIBUTE_MULTIPART_MAP, BACKGROUND_TO_FOREGROUND_MAP, BIRD_TO_WEAPON_HAND_MAP, OFFHAND_MULTIPART_MAP } from "./SyntheticPairing"

export type PairingMap = { [key: string]: string }
export type PairingType = { (key: string): string }

export const MOONSAMA_CATEGORY_INCOMPATIBILITIES: { [key: string]: string[] } = {
    'Main Hand': ['Special Items'],
    'Off Hand': ['Special Items'],
    'Special Items': ['Main Hand', 'Off Hand'],
}

// individual item overrides for certain parents
export const MOONSAMA_PARENT_CHILDREN_OVERRIDES: { [key: string]: { [key: string]: string } } = {
    '1285-0xb654611f84a8dc429ba3cb4fda9fad236c505a1a-545': {
        '1285-0x00005-1': '1285-0x00006-1'
    },
    '1285-0xb654611f84a8dc429ba3cb4fda9fad236c505a1a-605': {
        '1285-0x00004-1': '1285-0x00006-2'
    }
}

type AdditionalLayersConfigType = {
    requirement: { [key: string]: { other: string, map: PairingType, otherAddress: string, otherChainId: number } }
}

export const ADDITIONAL_CHILD_LAYERS_CONFIG: AdditionalLayersConfigType = {
    requirement: {
        "Off Hand": {
            other: 'Off Hand Multipart',
            otherAddress: '0x00006',
            otherChainId: 1285,
            map: (id: string) => OFFHAND_MULTIPART_MAP[id],
        },
        "Ambience": {
            other: 'Foreground',
            otherAddress: '0x00002',
            otherChainId: 1285,
            map: (id: string) => BACKGROUND_TO_FOREGROUND_MAP[id],
        },
        "Special Items": {
            other: 'Attribute Multipart',
            otherAddress: '0x00007',
            otherChainId: 1285,
            map: (id: string) => BACKGROUND_TO_FOREGROUND_MAP[id],
        }
    }
}

export const ADDITIONAL_PARENT_LAYERS_CONFIG: AdditionalLayersConfigType = {
    requirement: {
        'Main Hand': {
            other: 'Weapon Hand',
            otherAddress: '0x00003',
            otherChainId: 1285,
            map: (id: string) => BIRD_TO_WEAPON_HAND_MAP[id]
        },
        "*": {
            other: 'Attribute Multipart',
            otherAddress: '0x00007',
            otherChainId: 1285,
            map: (id: string) => ATTRIBUTE_MULTIPART_MAP[id]
        }
    }
}
