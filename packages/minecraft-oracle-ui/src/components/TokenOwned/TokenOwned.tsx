
import { Media } from 'components';
import { useActiveWeb3React } from 'hooks';
import { Asset } from 'hooks/marketplace/types';
import { TokenMeta } from 'hooks/useFetchTokenUri.ts/useFetchTokenUri.types';
import { StaticTokenData } from 'hooks/useTokenStaticDataCallback/useTokenStaticDataCallback';
import { useNavigate } from 'react-router-dom';
import { truncateHexString } from 'utils';
import { StringAssetType } from 'utils/subgraph';
import { useClasses } from 'hooks';
import { styles } from './TokenOwned.styles';
import LootBox from '../../assets/images/loot-box.png';
import { Box, Text } from '@chakra-ui/react';

export const TokenOwned = ({
  meta,
  staticData,
  asset,
}: {
  meta: TokenMeta | undefined;
  staticData: StaticTokenData;
  asset: Asset;
}) => {
  const {
    container,
    image,
    imageContainer,
    nameContainer,
    stockContainer,
    tokenName,
    mr,
    lastPriceContainer,
  } = useClasses(styles);
  const navigate = useNavigate();

  const { chainId } = useActiveWeb3React();

  //console.log('FRESH', {asset, action, actionColor})

  const handleImageClick = () => {
    navigate(`/token/${asset.assetType}/${asset.assetAddress}/${asset.assetId}`);
  };

  const isErc721 =
    asset.assetType.valueOf() === StringAssetType.ERC721.valueOf();
  const sup = staticData?.totalSupply?.toString();
  const totalSupplyString = isErc721
    ? 'unique'
    : sup
      ? `${sup} pieces`
      : undefined;

  return (
    <Box className={container}>
      <div
        role="button"
        className={imageContainer}
        onClick={handleImageClick}
        onKeyPress={handleImageClick}
        tabIndex={0}
      >
        <Media uri={meta?.image} />
        {/*<img src={LootBox} style={{width: '100%', height: 'auto'}}/>*/}
      </div>
      <div className={nameContainer}>
        <Text className={tokenName}>
          {meta?.name ?? truncateHexString(asset.assetId)}
        </Text>
      </div>
      <div className={stockContainer}>
        {staticData?.symbol && (
          <Text color="textSecondary">{staticData.symbol}</Text>
        )}
        {totalSupplyString && (
          <Text color="textSecondary">{totalSupplyString}</Text>
        )}
      </div>
    </Box>
  );
};
