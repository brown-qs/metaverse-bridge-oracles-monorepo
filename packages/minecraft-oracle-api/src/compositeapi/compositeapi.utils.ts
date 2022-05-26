import axios from "axios";
import uriToHttp from "../nftapi/nftapi.utils";

export const fetchImageBufferCallback = () => {
    const cb = async <T>(uriOrUrl?: string, tryHttpToHttps = true) => {
      if (!uriOrUrl) {
        return undefined;
      }
      const url = uriToHttp(uriOrUrl, tryHttpToHttps);
        try {
          const response = await axios.get(url, {responseType: 'arraybuffer'});
          if (response.status === 200) {
            console.log(url)
            console.log(typeof response.data)
            return response.data as T;
          }
        } catch (err) {
          console.log('Fetch failed for URL: ' + url);
        }
      return undefined;
    };
    return cb;
  };