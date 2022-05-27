import axios from 'axios';
import type { CustomizationType } from 'pages/moonsama/designer/index'
import type { Asset as AssetType } from 'pages/moonsama/designer/index'
import type { AssetIdentifier } from 'pages/moonsama/designer/index'
import type { AuthData } from 'context/auth/AuthContext/AuthContext.types';


const downloadAsImage = (layers: Array<AssetType>) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 1280;
  let numImagesDrawn = 0;
  let samaNumber: string;

  layers.sort((a, b) => a.zIndex === b.zIndex ? 0 : (a.zIndex < b.zIndex ? -1 : 1)).forEach(layer => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = (new URL(layer.fullSizeUrl)).href;

    if (layer.zIndex === 0) {
      samaNumber = layer.assetId
    }

    image.addEventListener('load', e => {
      ctx?.drawImage(image, 0, 0, 1280, 1280);
      numImagesDrawn = numImagesDrawn + 1;

      if (numImagesDrawn === layers.length) {
        var link = document.createElement('a');
        link.download = `Moonsama ${samaNumber}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  });
}

const saveCustomization = async ({parent, children}: CustomizationType, authData: AuthData) => {
  const payload = {
    compositeChildren: children.map((childAsset: AssetIdentifier) => ({
      assetAddress: childAsset.assetAddress,
      assetId: childAsset.assetId,
      assetType: childAsset.assetType,
      chainId: childAsset.chainId,
    })),
    compositeParent: {
      assetAddress: parent?.assetAddress,
      assetId: parent?.assetId,
      assetType: parent?.assetType,
      chainId: parent?.chainId,
    }
  }

  return await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/composite/save`, payload, {
    headers: { Authorization: `Bearer ${authData?.jwt}` }
  }).catch(e => {
    alert('Something went wrong while saving your customization.\n\nPlease try again.')
  });
}

const shareCustomization = async ({parent, children}: CustomizationType, authData: AuthData, setShowShareModal: (show: boolean) => void) => {
  await saveCustomization({parent, children}, authData)

  if (navigator.share) {
    await navigator.share({
      title: 'Check out my customized Moonsama!',
      url: (new URL(`/moonsama/designer/${parent?.assetAddress}/${parent?.assetId}`, `${window.location.protocol}//${window.location.host}`)).href
    })
  } else {
    setShowShareModal(true)
  }
}

export { downloadAsImage, saveCustomization, shareCustomization };
