import { useCallback, useEffect, useState } from 'react';
import { useFetchUrlCallback } from 'hooks/useFetchUrlCallback/useFetchUrlCallback';
import uriToHttp from 'utils/uriToHttp';

export type CollectionMeta = {
  name: string;
  description: string;
  image: string;
  imageRaw: string;
  external_link: string;
};

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useFetchCollectionMeta(
  uris: { contractURI: string }[] | undefined
): (CollectionMeta | undefined)[] {
  const [metas, setMetas] = useState<(CollectionMeta | undefined)[]>([]);

  const cb = useFetchUrlCallback();

  const fetchMetas = useCallback(async () => {
    if (!uris) {
      setMetas([]);
      return;
    }

    const promises = uris.map(async (uri) => {
      let meta = await cb<CollectionMeta>(uri.contractURI);

      if (meta) {
        meta.external_link = uriToHttp(meta.external_link, false)?.[0];
        meta.image = uriToHttp(meta.image, false)?.[0];
        meta.imageRaw = meta.image ?? undefined
      }
      return meta;
    });

    const metas = await Promise.all(promises);

    setMetas(metas);
  }, [uris, cb]);

  useEffect(() => {
    if (uris) {
      fetchMetas();
    }
  }, [uris]);

  return metas;
}
