export const collections = {
  name: 'MoonSama List',
  timestamp: '2021-08-18T00:00:00.000Z',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  keywords: [
    'susu',
    'carbonswap',
    'marketplace',
    'finance',
    'dex',
    'green',
    'sustainable',
  ],
  logoURI: 'https://',
  tags: {
    wrapped: {
      name: 'wrapped',
      description:
        'Assets that are a wrapped version of their original, holding the same value',
    },
    bridged: {
      name: 'bridged',
      description: 'Assets that are bridged over from another chain',
    },
    meme: {
      name: 'meme',
      description: 'Assets that were created with no specific purpose, for fun',
    },
    native: {
      name: 'native',
      description: 'Assets that are native to Moonriver',
    },
  },
  types: ['ERC20', 'ERC721', 'ERC1155'],
  indexing: ['none', 'sequential'],
  collections: [
    /* 
    {
      chainId: 1285,
      address: '0xaF1F85aD24Bc45fb19f5F8B5166e1Aed41c60844',
      display_name: 'SamaMoo',
      symbol: 'SAMAMOO',
      type: 'ERC721',
      contractURI: 'ipfs://QmQzz765Q6j2LjWJHPmComm1i7Kpeccz27x6tpTeHFFCxg',
    },
    {
      chainId: 1285,
      address: '0x63228048121877A9e0f52020834A135074e8207C',
      display_name: 'TestCollection',
      symbol: 'TC',
      type: 'ERC1155',
      decimals: 0,
      contractURI: 'ipfs://QmfZtbgLDmcDNf4tvhm1LuLmbBYSASmk6zcSBY2GRzh72S',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-test'
      
    },
    */
    {
      chainId: 1284,
      address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86',
      display_name: '???',
      minId: 1,
      maxId: 2,
      idSearchOn: true,
      symbol: 'MEGG',
      type: 'ERC721',
      contractURI: 'ipfs://QmX4yW2AiMUieGCufkJtvqqVVbgiVBXHoJWywXeEfGs9tm',
    },
    {
      chainId: 1285,
      address: '0xb654611F84A8dc429BA3cb4FDA9Fad236C505a1a',
      display_name: 'Moonsama',
      minId: 1,
      maxId: 1001,
      idSearchOn: true,
      symbol: 'MSAMA',
      type: 'ERC721',
      contractURI: 'ipfs://QmPhFz5mKCtndGLLZBwGockGAWz7o7nef4Kgf37gYsTid5',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft',
    },
    {
      chainId: 1285,
      address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86',
      display_name: '???',
      minId: 1,
      maxId: 59,
      idSearchOn: true,
      decimals: 0,
      symbol: '???',
      type: 'ERC1155',
      contractURI: 'ipfs://QmWox8YqUaYVxSSB7GRhPAuczv6auL8QrkDrkMTcqGEGKA',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-mx',
    },
    {
      chainId: 1285,
      address: '0x1b30a3b5744e733d8d2f19f0812e3f79152a8777',
      display_name: 'Multiverse Asset Factory',
      symbol: 'MMAF',
      minId: 1,
      maxId: 10,
      idSearchOn: true,
      type: 'ERC1155',
      contractURI: 'ipfs://Qmc97e79xzzrdNuU3RumGXcK5FYh8PWTb6GyxxHMyRvUYm',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-factory',
    },
    {
      chainId: 1285,
      address: '0xdea45e7c6944cb86a268661349e9c013836c79a2',
      display_name: 'Multiverse Art',
      minId: 1,
      maxId: 28,
      idSearchOn: true,
      symbol: 'MMA',
      type: 'ERC1155',
      auction: {
        ids: ['1', '4', '7', '10', '13', '16', '19', '22', '25'],
        deadline: '1641056400', // 1.1.2022 17 utc
      },
      subcollections: [
        {
          id: '1', // subcollection ID yumi
          uri: 'ipfs://QmTChNyLJqqrJGeafZZpg7ShfMjPEPcNkgrqHqVCyVFrtt',
          tokens: [1, 2, 3],
        },
        {
          id: '2', // subcollection ID tiff
          uri: 'ipfs://QmTgEUjfD6PodGXfUMFQzmyG1NwL2bafVFTrwtfWkdQeRj',
          tokens: [4, 5, 6],
        },
        {
          id: '3', // subcollection ID marlua
          uri: 'ipfs://QmWbyqCZaWQRySmwDSseCaC9RpPJZjwWPXD1TFBAgizASL',
          tokens: [7, 8, 9],
        },
        {
          id: '4', // subcollection ID bmc
          uri: 'ipfs://QmRu9G1D9jDg3QGNZs5G6vtseet4H4fP8jBzkLWSNWMdbY',
          tokens: [10, 11, 12],
        },
        {
          id: '5', // subcollection ID Majan
          uri: 'ipfs://QmaPCumjynv9FPyFALdDQLvARLyvHQuDTisKqK6qSr8yGz',
          tokens: [13, 14, 15],
        },
        {
          id: '6', // subcollection ID ksmk
          uri: 'ipfs://QmUd5MFYPSwzWzQ1vWpbpN65XUMerasbLG2s9ryV17XqEC',
          tokens: [16, 17, 18],
        },
        {
          id: '7', // subcollection ID - wangdoodle
          uri: 'ipfs://QmcRoxnA2zJK4HJpxTUAgmbbTTp1i22adqsgecJCXkA1vZ',
          tokens: [19, 20, 21],
        },
        {
          id: '8', // subcollection ID - tako
          uri: 'ipfs://QmY1o1dXRyJkf4RwddoTWz3cUQFaP5HcuwYjquotVjxs7q',
          tokens: [22, 23, 24],
        },
        {
          id: '9', // subcollection ID - ruben
          uri: 'ipfs://QmSMo4rR7JMGmRMZQzho1aMnxF3Jai6R2YVgSH2TeYhZNb',
          tokens: [25, 26, 27],
        },
        /*
       {
            id: "1", // subcollection ID yumi
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [1,2,3]
        },
        {
            id: "2", // subcollection ID tiff
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [4,5,6]
        },
        {
            id: "3", // subcollection ID marlua
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [7,8,9]
        },
        {
            id: "4", // subcollection ID bmc
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [10,11,12]
        },
        {
            id: "5", // subcollection ID Majan
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [13,14,15]
        },
        {
            id: "6", // subcollection ID ksmk
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [16,17,18]
        },
        {
            id: "7", // subcollection ID - wangdoodle
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [19,20,21]
        },
        {
            id: "8", // subcollection ID - tako
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [22,23,24]
        },
        {
            id: "9", // subcollection ID - ruben
            uri: "ipfs://QmV3fabvS878WXdAS9LpZu7mAsBqjmvM2rNsqHKt3vpR6L",
            tokens: [25,26,27]
        }
        */
      ],
      contractURI: 'ipfs://QmUCMVkJa849UQYN728hyiYm3ZJVPk8yGyiJQ6wwHfLcgz',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-multiverseart',
    },
    {
      chainId: 1285,
      address: '0xa17A550871E5F5F692a69a3ABE26e8DBd5991B75',
      display_name: 'Msama MC Plots S1',
      plot: true,
      plotMap: 'https://mcapi.moonsama.com/plot',
      symbol: 'MMPLOTS1',
      minId: 1,
      maxId: 338,
      idSearchOn: true,
      type: 'ERC721',
      contractURI: 'ipfs://QmR8K7eLZnhFqC5qUStMyFAgawSJcpRfSvMDMffQVQFn38',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-721-mmplots1',
    },
    {
      chainId: 1285,
      address: '0xd335417999Ff2b9b59737244e554370264B3F877',
      display_name: 'Sama Box',
      symbol: 'SAMABOX',
      minId: 1,
      maxId: 2,
      type: 'ERC1155',
      contractURI: 'ipfs://QmPisJNXRvd1h8BBiBs1PHu8666HTDWVJWkAf2AS7c4zkM',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-samabox'
    },
    {
      chainId: 1285,
      address: '0xfEd9e29b276C333b2F11cb1427142701d0D9f7bf',
      display_name: 'BlvckMarketNFT',
      minId: 0,
      maxId: 1333,
      idSearchOn: true,
      symbol: 'BMANFT',
      type: 'ERC721',
      contractURI: 'ipfs://QmVQPRFZq7XZNk79C75ynqPRPdpPaX8bmH4Cb9KhrN1PfH',
      subgraph:
        'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-blvck',
    },
  ],
};

export default collections;
