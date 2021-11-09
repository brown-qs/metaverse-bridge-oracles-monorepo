import { useCallback, useState } from 'react'
import { useActiveWeb3React } from 'hooks'

export default function useAddTokenToMetamask(
  assetToAdd: {address?: string, symbol?: string, decimals?: number, image?: string} | undefined
): { addToken: () => void; success: boolean | undefined } {
  const { library, chainId } = useActiveWeb3React()

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (library && library.provider.isMetaMask && library.provider.request) {
      if (!assetToAdd || !assetToAdd.address || !assetToAdd.decimals || !assetToAdd.symbol) {
          setSuccess(false)
          return
      }
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            // eslint-disable-next-line
            //@ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: assetToAdd?.address,
              symbol: assetToAdd.symbol,
              decimals: assetToAdd.decimals,
              image: assetToAdd.image
            }
          }
        })
        .then(success => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [library, JSON.stringify(assetToAdd)])

  return { addToken, success }
}
