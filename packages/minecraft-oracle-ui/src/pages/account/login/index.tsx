import { AuthLayout, Loader } from 'ui';
import { Link } from 'react-router-dom'
import { Button, Stack } from '@chakra-ui/react';
const LoginPage = () => {
  return (
    <AuthLayout title="LOGIN METHOD" loading={false} >
      <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
        <Button style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} as={Link} to="/account/login/email">EMAIL LOGIN</Button>
        <Button style={{ maxWidth: '175px', width: '175px', minWidth: '175px' }} as={Link} to="/account/login/kilt">KILT LOGIN</Button>
      </Stack >
    </AuthLayout>)
};

export default LoginPage;
