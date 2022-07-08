import { Alert, AlertColor, CircularProgress, Stack } from "@mui/material"
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
    <Stack direction="column" alignItems='stretch' textAlign='center' spacing={2}>
      {!!props?.alert && !props.loading
        ?
        <Stack direction="column" spacing={6} margin={2} alignContent='center' textAlign='center'>
          <Alert sx={{ margin: "auto" }} severity={props.alert.severity as AlertColor} onClose={props.handleAlertClose}>{props.alert.text}</Alert>
        </Stack>

        :
        <>
          <Stack direction="column" alignContent='center' textAlign='center'>
            <h1>{props.title}</h1>
          </Stack>
          {props.loading
            ?
            <Stack direction="row">
              <CircularProgress />
            </Stack>
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

