import axios from 'axios';
import type { customizationType } from 'pages/moonsama/designer/index'
import type { asset as assetType } from 'pages/moonsama/designer/index'
import type { assetIdentifier } from 'pages/moonsama/designer/index'
import type { AuthData } from 'context/auth/AuthContext/AuthContext.types';

const downloadAsImage = (layers: Array<assetType>) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 1280;
  let numImagesDrawn = 0
  const ctx = canvas.getContext('2d');

  layers.sort((a, b) => a.zIndex === b.zIndex ? 1 : (a.zIndex < b.zIndex ? -1 : 1)).forEach(layer => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = layer.fullSizeUrl;

    image.addEventListener('load', e => {
      ctx?.drawImage(image, 0, 0, 1280, 1280);
      numImagesDrawn = numImagesDrawn + 1;

      if (numImagesDrawn === layers.length) {
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  });
}

const saveCustomization = async ({parent, children}: customizationType, authData: AuthData) => {
  const payload = {
    compositeChildren: children.map((childAsset: assetIdentifier) => ({
      assetAddress: childAsset.assetAddress,
      assetId: childAsset.assetID,
      assetType: childAsset.assetType,
      chainId: childAsset.chainID,
    })),
    compositeParent: {
      assetAddress: parent?.assetAddress,
      assetId: parent?.assetID,
      assetType: parent?.assetType,
      chainId: parent?.chainID,
    }
  }

  return await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/composite/save`, payload, {
    headers: { Authorization: `Bearer ${authData?.jwt}` }
  }).catch(console.error);
}

const shareCustomization = async ({parent, children}: customizationType, authData: AuthData, setShowShareModal: (show: boolean) => void) => {
  await saveCustomization({parent, children}, authData)

  if (navigator.share) {
    await navigator.share({
      title: 'Check out my customized Moonsama!',
      url: (new URL(`/moonsama/designer/${parent?.assetAddress}/${parent?.assetID}`, `${window.location.protocol}//${window.location.host}`)).href
    })
  } else {
    setShowShareModal(true)
  }
}

export { downloadAsImage, saveCustomization, shareCustomization };
