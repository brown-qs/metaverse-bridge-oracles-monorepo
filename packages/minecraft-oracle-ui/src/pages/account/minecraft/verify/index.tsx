import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const MinecraftVerifyPage = () => {
  //react strict mode in dev will render this twice...need to use a ref to prevent that
  const { authData, setAuthData } = useAuth();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [failureMessage, setFailureMessage] = useState("")
  const { search } = useLocation()
  const verifyMinecraft = async () => {

    setIsLoading(true)
    try {
      const result = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/link`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        params: Object.fromEntries(new URLSearchParams(search))
      });
      navigate("/account")
      return
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
    verifyMinecraft()

  }, [])



  const handleAlertClose = () => {
    navigate(`/account`)
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="MINECRAFT LINK" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}>

    </AuthLayout >
  );
};

export default MinecraftVerifyPage;
