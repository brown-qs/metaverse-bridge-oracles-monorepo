import { Alert, AlertDescription, AlertIcon, AlertStatus, AlertTitle, Box, CircularProgress, CloseButton, Heading, HStack, Stack, VStack } from "@chakra-ui/react"
import { useState } from "react"

export interface AuthLayoutProps {
  title: string,
  loading: boolean,
  handleAlertClose?: () => void,
  alert?: {
    severity: string,
    text: string,
  }
}

export const AuthLayout = ({ children, ...props }: React.PropsWithChildren<AuthLayoutProps>) => {
  return (
    <Stack paddingTop="30px" color="white" direction="column" alignItems='stretch' textAlign='center' spacing={2} width={{
      base: '100%',
      sm: '500px',
    }} sx={{ margin: "auto" }}>
      {!!props?.alert && !props.loading
        ?
        <Stack direction="column" spacing={6} margin={2} alignContent='center' textAlign='center'>
          <Alert sx={{ margin: "auto" }} status={props.alert.severity as AlertStatus} textAlign="left" fontFamily="Rubik">

            <AlertIcon />
            <Box>
              <AlertDescription>
                {props.alert.text}
              </AlertDescription>
            </Box>
            {!!props.handleAlertClose && <CloseButton
              alignSelf='flex-start'
              position='relative'
              right={-1}
              top={-1}
              onClick={props.handleAlertClose}
            />}
          </Alert>
        </Stack>

        :
        <>
          <Stack direction="column" alignContent='center' textAlign='center'>
            <Heading as='h1' size='lg'>{props.title}</Heading>
          </Stack>
          {props.loading
            ?
            <VStack alignItems="center" paddingTop="30px">
              <CircularProgress isIndeterminate />
            </VStack>
            :
            <>
              {children}
            </>
          }
        </>
      }

    </Stack >
  )
}

