import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const MinecraftUnlinkPage = () => {
  const { authData, setAuthData } = useAuth();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [failureMessage, setFailureMessage] = useState("")
  const unlinkMinecraft = async () => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'delete',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/minecraft/unlink`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
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
    unlinkMinecraft()
  }, [])



  const handleAlertClose = () => {
    navigate(`/account`)
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="MINECRAFT UNLINK" loading={isLoading} alert={alert} handleAlertClose={handleAlertClose}>

    </AuthLayout >
  );
};

export default MinecraftUnlinkPage;
