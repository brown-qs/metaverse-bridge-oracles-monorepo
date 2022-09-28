import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import { save, load } from 'redux-localstorage-simple';
import { bridgeApi } from './api/bridgeApi';
import { api as generatedSquidMarketplaceApi } from './api/generatedSquidMarketplaceApi';
import { api as generatedSquidRaresamaApi } from './api/generatedSquidRaresamaApi';
import application from './application/reducer';
import { updateVersion } from './global/actions';
import authSlice from './slices/authSlice';
import emailCodeModalSlice from './slices/emailCodeModalSlice';
import emailLoginModalSlice from './slices/emailLoginModalSlice';
import exportModalSlice from './slices/exportModalSlice';
import importEnraptureModalSlice from './slices/importEnraptureModalSlice';
import inGameItemModalSlice from './slices/inGameItemModalSlice';
import kiltLoginModalSlice from './slices/kiltLoginModalSlice';
import oauthSlice from './slices/oauthSlice';
import summonModalSlice from './slices/summonModalSlice';
import transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['transactions'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    auth: authSlice,
    importEnraptureModal: importEnraptureModalSlice,
    inGameItemModal: inGameItemModalSlice,
    emailCodeModal: emailCodeModalSlice,
    emailLoginModal: emailLoginModalSlice,
    kiltLoginModal: kiltLoginModalSlice,
    exportModal: exportModalSlice,
    summonModal: summonModalSlice,
    oauth: oauthSlice,
    [bridgeApi.reducerPath]: bridgeApi.reducer,
    [generatedSquidMarketplaceApi.reducerPath]: generatedSquidMarketplaceApi.reducer,
    [generatedSquidRaresamaApi.reducerPath]: generatedSquidRaresamaApi.reducer

  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), bridgeApi.middleware, generatedSquidMarketplaceApi.middleware], //, save({ states: PERSISTED_KEYS })
});
//  preloadedState: load({ states: PERSISTED_KEYS }),
//store.dispatch(updateVersion());

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
