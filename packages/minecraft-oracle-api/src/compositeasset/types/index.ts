export type AttributeType = {
    display_type: string,
    trait_type: string,
    value: any,
    source_id?: string,
}

export type ChainAssetType = {
    chainId: number,
    assetAddress: string,
    assetId: string,
    assetType: string
}

export type CompositeMetadataType = {
    image: string
    name: string,
    description: string,
    external_url: string,
    artist?: string
    artist_url?: string
    composite?: boolean
    asset?: ChainAssetType
    layers?: string[]
    attributes?: AttributeType[]
    marketplace?: {
        currency?: ChainAssetType
    }
    plot?: any,
    background_color?: string
    animation_url?: string
    youtube_url?: string
}
