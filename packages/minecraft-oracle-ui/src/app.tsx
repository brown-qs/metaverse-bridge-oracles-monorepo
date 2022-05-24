import { AppProviders } from 'providers/AppProvider';
import { AccountDialog, Layout } from 'components';
import { Routing } from 'pages';

function MyApp() {
  return (
    <AppProviders>
      <AccountDialog />
      <Layout>
        <Routing />
      </Layout>
    </AppProviders>
  );
}

export default MyApp;
