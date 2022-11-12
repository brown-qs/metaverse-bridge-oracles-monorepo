import { useCallback, useEffect, useState } from 'react';
import { fromStream } from 'file-type/browser';
import { FileTypeResult } from 'file-type/core';
import { PINATA_GATEWAY } from './../../constants';
import { isFirefox } from '../../utils';
import { useUriToHttp } from 'hooks/useUriToHttp/useUriToHttp';

type MediaType = 'image' | 'video' | 'audio' | 'xml' | 'other' | undefined;

const mediaArray: MediaType[] = ['audio', 'image', 'video', 'xml'];

export const useFileType = (uri?: string) => {
  let DEBUG = false
  if (uri?.startsWith("/static")) {
    DEBUG = false
  }
  if (DEBUG) console.log(`useFileType:: uri: ${uri}`)
  const [fileType, setFileType] = useState<FileTypeResult | undefined>(
    undefined
  );
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const url = useUriToHttp(uri);

  const getMediaType = useCallback(() => {
    if (DEBUG) console.log(`useFileType:: getMediaType: start`)

    if (fileType) {
      if (DEBUG) console.log(`useFileType:: getMediaType: fileType:${fileType}`)

      const [media, secondOne] = fileType.mime.split('/');
      if (mediaArray.includes(media as MediaType)) {
        return media;
      }

      if (mediaArray.includes(secondOne as MediaType)) {
        return secondOne;
      }
      return 'other';
    } else if (url?.toLowerCase().includes(".svg")) {
      if (DEBUG) console.log(`useFileType:: getMediaType: hard coded as svg`)

      return 'image'
    }
  }, [fileType]);

  useEffect(() => {
    const getFileType = async () => {
      setMediaUrl(url);
      setIsLoading(true);
      if (DEBUG) console.log(`useFileType:: getFileType: before fetch url: ${url}`)

      const res = url ? await fetch(url) : undefined;
      if (DEBUG) console.log(`useFileType:: getFileType: after fetch`)

      if (res?.body) {
        if (DEBUG) console.log(`useFileType:: getFileType: inside res?.body`)

        let type = await fromStream(res?.body);
        if (DEBUG) console.log(`useFileType:: getFileType: after from stream`)


        try {
          await res.body.cancel();
        } catch (e) {
          // TODO: See why firefox crashes here.
          console.log(`getFileType:: error: ${e}`)
          if (
            isFirefox &&
            e instanceof TypeError &&
            e.message === "'cancel' can't be called on a locked stream."
          ) {
            console.error(
              'Firefox related error:\n' + e.name + ': ' + e.message
            );
          } else {
            throw e;
          }
        } finally {
          setIsLoading(false);
        }
        setFileType(type);
      } else {
        if (DEBUG) console.log(`useFileType:: getFileType: res?.body not defined`, res)

      }
    };
    getFileType();
  }, [url]);

  //console.log({ fileType, getMediaType, mediaUrl });
  return { fileType, getMediaType, mediaUrl, isLoading };
};
