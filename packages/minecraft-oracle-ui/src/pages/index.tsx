import { Switch, Route } from 'react-router-dom';
import HomePage from './home';
import ProfilePage from './profile';
import { PurchaseDialog, BidDialog } from 'components';
import { CancelDialog } from 'components/CancelDialog/CancelDialog';
import { TransferDialog } from 'components/TransferDiaog/TransferDialog';

export const Routing = () => (
  <Switch>
    <Route exact path="/">
      <HomePage />
    </Route>
    <Route path="/profile/:type/:address/:id">
      <CancelDialog />
      <PurchaseDialog />
      <BidDialog />
      <TransferDialog />
    </Route>
    <Route path="/profile">
      <ProfilePage />
    </Route>
  </Switch>
);
