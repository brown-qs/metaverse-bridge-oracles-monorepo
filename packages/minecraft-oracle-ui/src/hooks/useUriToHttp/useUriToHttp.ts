import { useMemo } from 'react';
import uriToHttp from 'utils/uriToHttp';

export const useUriToHttp = (uriOrUrl?: string) => {
  return useMemo(() => {
    if (!uriOrUrl) {
      return undefined;
    }

    //relative path
    if (uriOrUrl?.startsWith("/")) {
      return uriOrUrl
    }
    return uriToHttp(uriOrUrl, false)?.[0];
  }, [uriOrUrl]);
};
