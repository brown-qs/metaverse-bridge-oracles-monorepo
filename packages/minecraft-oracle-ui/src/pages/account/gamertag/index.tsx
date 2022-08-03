import React, { useRef, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios';
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react';
const GamerTagChangePage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [gamerTag, setGamerTag] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")
  const navigate = useNavigate();

  const recaptchaEl = useRef<any>(null)

  const isValidGamerTag = (email: string) => {
    return (typeof email === "string") && (email.length > 0)
  }

  const submitGamerTag = async (ema: string) => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/user/gamertag`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        data: { gamerTag }
      });
      //redirect
      navigate('/account')

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
    setDirtyTextField(false)
    setGamerTag("")
    setIsLoading(false)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
  }

  const gamerTagControls = () => {
    return <Stack alignItems="center" spacing={2}>

      <FormControl isInvalid={dirtyTextField && !isValidGamerTag(gamerTag)} maxW="300px">
        <FormLabel>Gamer Tag</FormLabel>
        <Input
          isDisabled={isLoading}
          value={gamerTag}
          onChange={(e) => {
            setGamerTag(e.target.value)
          }}
          onFocus={() => setDirtyTextField(true)}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && !isLoading && isValidGamerTag(gamerTag)) {
              submitGamerTag(gamerTag)
            }
          }}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
        />
        {dirtyTextField && !isValidGamerTag(gamerTag) ? (
          <FormErrorMessage sx={{}}>Invalid gamer tag.</FormErrorMessage>

        ) : (
          <FormHelperText>
            &nbsp;
          </FormHelperText>
        )}
      </FormControl>
      <Button isLoading={isLoading} disabled={!isValidGamerTag(gamerTag)} onClick={(e) => submitGamerTag(gamerTag)} >SET GAMER TAG</Button>
    </Stack >
  }

  let alert
  let alertClose: (() => void) | undefined = handleAlertClose
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <>
      <AuthLayout title="SET GAMER TAG" loading={false} alert={alert} handleAlertClose={alertClose}> {gamerTagControls()}
      </AuthLayout >
    </>
  );
};

export default GamerTagChangePage;
