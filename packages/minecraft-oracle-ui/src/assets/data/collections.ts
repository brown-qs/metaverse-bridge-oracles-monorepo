
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
  assets: [
    /*
    {
      chainId: 1285,
      address: '0xaF1F85aD24Bc45fb19f5F8B5166e1Aed41c60844',
      display_name: 'SamaMoo',
      symbol: 'SAMAMOO',
      type: 'ERC721',
      ids: undefined,
      importable: true,
      enrapturable: false,
      contractURI: 'ipfs://QmQzz765Q6j2LjWJHPmComm1i7Kpeccz27x6tpTeHFFCxg',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-test'
    },
    {
      chainId: 1285,
      address: '0x63228048121877A9e0f52020834A135074e8207C',
      display_name: 'TestCollection',
      symbol: 'TC',
      type: 'ERC1155',
      ids: ['1'],
      importable: true,
      enrapturable: false,
      contractURI: 'ipfs://QmfZtbgLDmcDNf4tvhm1LuLmbBYSASmk6zcSBY2GRzh72S',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-test'
    },
    {
      chainId: 1285,
      address: '0x63228048121877A9e0f52020834A135074e8207C',
      display_name: 'Metaverse Asset Factory',
      symbol: 'MAF',
      type: 'ERC1155',
      ids: undefined,
      importable: false,
      enrapturable: false,
      contractURI: 'ipfs://QmfZtbgLDmcDNf4tvhm1LuLmbBYSASmk6zcSBY2GRzh72S',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-testfactory'
    },
    */
    {
      chainId: 1285,
      address: '0xe4edcaaea73684b310fc206405ee80abcec73ee0',
      display_name: 'Pondsama',
      symbol: 'PONDSAMA',
      type: 'ERC721',
      ids: undefined,
      enrapturable: false,
      importable: true,
      contractURI: 'ipfs://QmdCKgexLpBjST3FdWLbPZLH2FWRtu2NXE9dk5ZirdDRGb',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/erc721-pondsama'
    },
    {
      chainId: 1285,
      address: '0xb654611F84A8dc429BA3cb4FDA9Fad236C505a1a',
      display_name: 'Moonsama',
      symbol: 'MSAMA',
      type: 'ERC721',
      ids: undefined,
      enrapturable: false,
      importable: true,
      contractURI: 'ipfs://QmPhFz5mKCtndGLLZBwGockGAWz7o7nef4Kgf37gYsTid5',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft'
    },
    {
      chainId: 1285,
      address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86',
      display_name: 'VIP Ticket',
      ids: ['1'],
      enrapturable: false,
      importable: true,
      symbol: '???',
      type: 'ERC1155',
      contractURI: 'ipfs://QmWox8YqUaYVxSSB7GRhPAuczv6auL8QrkDrkMTcqGEGKA',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-mx'
    },
    {
      chainId: 1285,
      address: '0x1974eEAF317Ecf792ff307F25A3521C35eECde86',
      display_name: 'Moonbrella',
      ids: Array.from({ length: 70 }, (_, i) => (i + 2).toString()),
      enrapturable: false,
      importable: true,
      symbol: 'Moonbrella',
      type: 'ERC1155',
      contractURI: 'ipfs://QmWox8YqUaYVxSSB7GRhPAuczv6auL8QrkDrkMTcqGEGKA',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-mx'
    },
    {
      chainId: 1285,
      address: '0x1B30A3b5744e733D8D2f19F0812E3f79152A8777', //0xEbA0bF03121B709f64CD0bC40988667cF739580F
      display_name: 'Moonsama Metaverse Asset Factory',
      symbol: 'MMAF',
      type: 'ERC1155',
      ids: undefined,
      importable: false,
      enrapturable: true,
      contractURI: 'ipfs://QmSN98qwiFYy3yGUWznm43E5ex3c5RoozkmQqpZBu69fDS',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-factory'
      //subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-test-factory'
    },
    {
      chainId: 1285,
      address: '0xdea45e7c6944cb86a268661349e9c013836c79a2',
      display_name: 'Multiverse Art',
      symbol: 'MMA',
      type: 'ERC1155',
      ids: undefined,
      importable: true,
      enrapturable: false,
      contractURI: 'ipfs://QmUCMVkJa849UQYN728hyiYm3ZJVPk8yGyiJQ6wwHfLcgz',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-multiverseart'
    },
    {
      chainId: 1285,
      address: '0xa17A550871E5F5F692a69a3ABE26e8DBd5991B75'.toLowerCase(),
      display_name: 'Moonsama Minecraft Plots Season 1',
      symbol: 'MMPLOTS1',
      ids: undefined,
      importable: true,
      enrapturable: false,
      type: 'ERC721',
      contractURI: 'ipfs://QmR8K7eLZnhFqC5qUStMyFAgawSJcpRfSvMDMffQVQFn38',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-721-mmplots1'
    },
    {
      chainId: 1285,
      address: '0x0a54845AC3743C96E582E03f26c3636ea9c00C8A'.toLowerCase(),
      display_name: 'Moonsama Embassy',
      floorDisplay: false,
      symbol: 'MEMBASSY',
      ids: undefined,
      importable: false,
      enrapturable: true,
      type: 'ERC1155',
      contractURI: 'ipfs://QmWzBDhV5nuPrud7XZo2vBLBWtTStwc6N8xSwCzuMdewd8',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft-1155-embassy'
    },
    {
      chainId: 3,
      address: '0x1d80D22D3e5adb37E528378e36b5622E97eF75bA',
      display_name: 'ExoTestCollection',
      symbol: 'ExoTest',
      type: 'ERC721',
      ids: undefined,
      enrapturable: false,
      importable: true,
      contractURI: 'ipfs://QmPhFz5mKCtndGLLZBwGockGAWz7o7nef4Kgf37gYsTid5',
      subgraph: 'https://moonriver-subgraph.moonsama.com/subgraphs/name/moonsama/nft'
    }
  ]
};

export default collections;
