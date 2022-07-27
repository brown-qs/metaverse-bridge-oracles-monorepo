export type OauthLoginContextType = {
  oauthData: OauthDataType;
  setOauthData: React.Dispatch<React.SetStateAction<OauthDataType>>;
};

export type OauthDataType = {
  appName: string
  scopes: string[],
  params: URLSearchParams,
} | null