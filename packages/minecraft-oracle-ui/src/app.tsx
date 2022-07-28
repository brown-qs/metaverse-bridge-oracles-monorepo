import { AppProviders } from 'providers/AppProvider';
import { AccountDialog, MoonsamaLayout } from 'components';
import { Routing } from 'pages';

function MyApp() {
  return (
    <AppProviders>
      <AccountDialog />
      <MoonsamaLayout>
        <Routing />
      </MoonsamaLayout>
    </AppProviders>
  );
}

export default MyApp;
