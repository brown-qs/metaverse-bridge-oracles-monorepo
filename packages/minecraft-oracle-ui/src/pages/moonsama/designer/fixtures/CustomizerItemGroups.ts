const x = [
  {
    "title": "Moonsama",
    "assetAddress": "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
    "assetIDRanges": [
      [
        1,
        1000
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC721",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "parent",
    "zIndex": 0,
    "synthetic": false,
    "dependant": false
  },
  {
    "title": "Ambience",
    "assetAddress": "0x00001",
    "assetIDRanges": [
      [
        1,
        3
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": -100,
    "synthetic": true,
    "dependant": false
  },
  {
    "title": "Foreground",
    "assetAddress": "0x00002",
    "assetIDRanges": [
      [
        1,
        2
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 100,
    "synthetic": true,
    "dependant": true
  },
  {
    "title": "Main Hand",
    "assetAddress": "0x1974eeaf317ecf792ff307f25a3521c35eecde86",
    "assetIDRanges": [
      [
        11,
        58
      ],
      [
        70,
        70
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 1,
    "synthetic": false,
    "dependant": false
  },
  {
    "title": "Main Hand",
    "assetAddress": "0x00008",
    "subtitle": "Synthetic main hands",
    "assetIDRanges": [
      [
        1,
        1
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 1,
    "synthetic": true,
    "dependant": false
  },
  {
    "title": "Off Hand",
    "subtitle": "Moonbrellas, banana, burger, rum",
    "assetAddress": "0x1974eeaf317ecf792ff307f25a3521c35eecde86",
    "assetIDRanges": [
      [
        2,
        9
      ],
      [
        59,
        61
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": -1,
    "synthetic": false,
    "dependant": false
  },
  {
    "title": "Off Hand",
    "subtitle": "Detectore & paw",
    "assetAddress": "0x1974eeaf317ecf792ff307f25a3521c35eecde86",
    "assetIDRanges": [
      [
        62,
        67
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 2,
    "synthetic": false,
    "dependant": false
  },
  {
    "title": "Off Hand",
    "subtitle": "Squid",
    "assetAddress": "0x1974eeaf317ecf792ff307f25a3521c35eecde86",
    "assetIDRanges": [
      [
        68,
        69
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 2,
    "synthetic": false,
    "dependant": false
  },
  {
    "title": "Off Hand",
    "assetAddress": "0x00005",
    "attributeCategory": true,
    "attributes": [
      "Moonfinity Gauntlet"
    ],
    "assetIDRanges": [
      [
        1,
        1
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 2,
    "synthetic": true,
    "dependant": false
  },
  {
    "title": "Weapon Hand",
    "assetAddress": "0x00003",
    "assetIDRanges": [
      [
        1,
        14
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 3,
    "synthetic": true,
    "dependant": true
  },
  {
    "title": "Special Items",
    "assetAddress": "0x00004",
    "attributeCategory": true,
    "attributes": [
      "Cheerleader Pom",
      "Champion Gloves",
      "Boxing Gloves"
    ],
    "assetIDRanges": [
      [
        1,
        3
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": 1,
    "synthetic": true,
    "dependant": false
  },
  {
    "title": "Off Hand Multipart",
    "subtitle": "Squid second halfs",
    "assetAddress": "0x00006",
    "assetIDRanges": [
      [
        1,
        2
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": -1,
    "synthetic": true,
    "dependant": true
  },
  {
    "title": "Attribute Multipart",
    "subtitle": "Hero Outfit",
    "assetAddress": "0x00007",
    "assetIDRanges": [
      [
        1,
        1
      ]
    ],
    "chainId": 1285,
    "assetType": "ERC1155",
    "uriPrefix": `${process.env.REACT_APP_COMPOSITE_MEDIA_URI_PREFIX}`,
    "uriPostfix": ".png",
    "equippableType": "child",
    "zIndex": -2,
    "synthetic": true,
    "dependant": true
  }
]

export default x
