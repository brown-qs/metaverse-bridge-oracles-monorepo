export type OauthLoginContextType = {
  oauthData: OauthDataType;
  setOauthData: React.Dispatch<React.SetStateAction<OauthDataType>>;
};

export type OauthDataType = {
  appName: string
  scopes: { scope: string, prettyScope: string }[],
  params: URLSearchParams,
} | null