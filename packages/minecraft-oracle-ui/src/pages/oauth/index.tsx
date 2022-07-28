import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { useNavigate, useLocation } from 'react-router-dom';

import axios, { AxiosError } from 'axios';
const OauthPage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [failureMessage, setFailureMessage] = useState("")
  let navigate = useNavigate();
  const { search } = useLocation()

  const getOauthCode = async () => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/oauth2/authorize`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        params: Object.fromEntries(new URLSearchParams(search))
      });
      window.location.href = result.data.url
    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      } else if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
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
