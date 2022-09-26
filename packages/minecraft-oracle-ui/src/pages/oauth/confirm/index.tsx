import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useOauthLogin } from '../../../hooks/useOauthLogin/useOauthLogin';
import { Button, Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../../state/slices/authSlice';
const OauthConfirmPage = () => {
  const accessToken = useSelector(selectAccessToken)
  const [isLoading, setIsLoading] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  let navigate = useNavigate();
  const { search } = useLocation()
  const { oauthData, setOauthData } = useOauthLogin()


  const getOauthCode = async () => {
    console.log("OAUTH CONFIRM")
    setIsLoading(true)
    try {
      console.log(oauthData?.params)
      if (!(oauthData?.params instanceof URLSearchParams)) {
        throw new Error("Oauth params invalid. Please start over.")
      }
      console.log(Object.fromEntries(oauthData.params))
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/oauth2/authorize`,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        params: Object.fromEntries(oauthData?.params)
      });
      setOauthData(null)
      window.location.href = result.data.url
      //window.location.href continue to execute code until the page loads, put return statement
      return
    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        //      window.localStorage.removeItem('authData');
        //    setAuthData(undefined);
      } else if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    //   getOauthCode()
  }, [])

  const handleAlertClose = () => {
    setFailureMessage("")
    getOauthCode()
  }

  const declineOauth = () => {
    setOauthData(null)
    navigate("/account")
  }

  const acceptOauth = () => {
    getOauthCode()
  }

  let alert
  let alertClose
  if (!oauthData?.appName) {
    alertClose = undefined
    alert = { severity: "error", text: "Oauth session is gone, please start over from app" }
  } else if (failureMessage) {
    alertClose = handleAlertClose
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="AUTHORIZE APP" loading={isLoading} alert={alert} handleAlertClose={alertClose}>
      <Stack direction="column" alignItems='center' textAlign='center' spacing={0}>
        <h3>{oauthData?.appName} is requesting access to:</h3>
        {oauthData?.scopes.map(scope => {
          return <div>{scope.prettyScope}</div>
        })}
        <Button isDisabled={isLoading} style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { acceptOauth() }} >ACCEPT</Button>
        <Button isDisabled={isLoading} style={{ marginTop: "10px", maxWidth: '200px', width: '200px', minWidth: '200px' }} onClick={() => { declineOauth() }} >DECLINE</Button>
      </Stack>
    </AuthLayout >
  );
}
export default OauthConfirmPage;
