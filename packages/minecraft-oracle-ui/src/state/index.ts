import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import { save, load } from 'redux-localstorage-simple';
import { bridgeApi } from './api/bridgeApi';
import { api as generatedSquidMarketplaceApi } from './api/generatedSquidMarketplaceApi';
import application from './application/reducer';
import { updateVersion } from './global/actions';
import authSlice from './slices/authSlice';
import importEnraptureModalSlice from './slices/importEnraptureModalSlice';
import inGameItemModalSlice from './slices/inGameItemModalSlice';
import transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['transactions'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    auth: authSlice,
    importEnraptureModal: importEnraptureModalSlice,
    inGameItemModal: inGameItemModalSlice,
    [bridgeApi.reducerPath]: bridgeApi.reducer,
    [generatedSquidMarketplaceApi.reducerPath]: generatedSquidMarketplaceApi.reducer

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
