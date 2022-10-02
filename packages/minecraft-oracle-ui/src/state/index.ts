import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import { bridgeApi } from './api/bridgeApi';
import { api as generatedSquidMarketplaceApi } from './api/generatedSquidMarketplaceApi';
import { api as generatedSquidRaresamaApi } from './api/generatedSquidRaresamaApi';
import application from './application/reducer';
import { updateVersion } from './global/actions';
import authSlice from './slices/authSlice';
import blockNumbersSlice from './slices/blockNumbersSlice';
import emailCodeModalSlice from './slices/emailCodeModalSlice';
import emailLoginModalSlice from './slices/emailLoginModalSlice';
import exportModalSlice from './slices/exportModalSlice';
import importEnraptureModalSlice from './slices/importEnraptureModalSlice';
import inGameItemModalSlice from './slices/inGameItemModalSlice';
import kiltLoginModalSlice from './slices/kiltLoginModalSlice';
import oauthSlice from './slices/oauthSlice';
import summonModalSlice from './slices/summonModalSlice';
import transactions from './transactions/reducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'




const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['accessToken']
}

const rootReducer = combineReducers({
  application,
  transactions,
  auth: persistReducer(authPersistConfig, authSlice),
  importEnraptureModal: importEnraptureModalSlice,
  inGameItemModal: inGameItemModalSlice,
  emailCodeModal: emailCodeModalSlice,
  emailLoginModal: emailLoginModalSlice,
  kiltLoginModal: kiltLoginModalSlice,
  exportModal: exportModalSlice,
  summonModal: summonModalSlice,
  blockNumbers: blockNumbersSlice,
  oauth: oauthSlice,
  [bridgeApi.reducerPath]: bridgeApi.reducer,
  [generatedSquidMarketplaceApi.reducerPath]: generatedSquidMarketplaceApi.reducer,
  [generatedSquidRaresamaApi.reducerPath]: generatedSquidRaresamaApi.reducer
});

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: []
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), bridgeApi.middleware, generatedSquidMarketplaceApi.middleware, generatedSquidRaresamaApi.middleware],
});
export const persistor = persistStore(store)
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)



export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
