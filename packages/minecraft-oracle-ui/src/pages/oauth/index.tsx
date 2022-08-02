import React, { useContext, useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { useNavigate, useLocation } from 'react-router-dom';

import axios, { AxiosError } from 'axios';
import { useOauthLogin } from '../../hooks/useOauthLogin/useOauthLogin';
const OauthPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
  let navigate = useNavigate();
  const { search } = useLocation()
  const { oauthData, setOauthData } = useOauthLogin()

  const getOauthCode = async () => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams(search)
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/oauth2/client/${searchParams.get("client_id")}/public`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        }
      });
      setOauthData({ ...result.data, params: searchParams })
      navigate("oauth/confirm")
    } catch (e) {
      const err = e as AxiosError;

      if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
      //null out any oauth data if request fails
      setOauthData(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getOauthCode()
  }, [])


  const handleAlertClose = () => {
    setFailureMessage("")
    getOauthCode()
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="OAUTH" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}> </AuthLayout >
  );
}
export default OauthPage;
