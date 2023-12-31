import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import { bridgeApi } from './api/bridgeApi';
import { api as generatedSquidMarketplaceApi } from './api/generatedSquidMarketplaceApi';
import { api as generatedSquidRaresamaApi } from './api/generatedSquidRaresamaApi';
import { api as generatedSquidExosamaApi } from './api/generatedSquidExosamaApi';
import { api as generatedSubgraphExnApi } from './api/generatedSubgraphExnApi';
import application from './application/reducer';
import { updateVersion } from './global/actions';
import authSlice from './slices/authSlice';
import blockNumbersSlice from './slices/blockNumbersSlice';
import emailCodeModalSlice from './slices/emailCodeModalSlice';
import emailLoginModalSlice from './slices/emailLoginModalSlice';
import inGameItemModalSlice from './slices/inGameItemModalSlice';
import kiltLoginModalSlice from './slices/kiltLoginModalSlice';
import oauthSlice from './slices/oauthSlice';
import summonModalSlice from './slices/summonModalSlice';
import onChainResourceModalSlice from './slices/onChainResourceModalSlice';
import transactions from './transactions/reducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import inModalSlice from './slices/inModalSlice';
import transactionsSlice from './slices/transactionsSlice';
import outModalSlice from './slices/outModalSlice';
import migrateModalSlice from './slices/migrateModalSlice';
import customizerSlice from './slices/customizerSlice';
import imageCacheSlice from './slices/imageCacheSlice'


const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['accessToken']
}

const transactionsPersistConfig = {
  key: 'transactions',
  storage: storage,
}

const newTransactionsPersistConfig = {
  key: 'newTransactions',
  storage: storage,
}

const rootReducer = combineReducers({
  application,
  transactions: persistReducer(transactionsPersistConfig, transactions),
  newTransactions: persistReducer(newTransactionsPersistConfig, transactionsSlice),
  auth: persistReducer(authPersistConfig, authSlice),
  inGameItemModal: inGameItemModalSlice,
  onChainResourceModal: onChainResourceModalSlice,
  emailCodeModal: emailCodeModalSlice,
  emailLoginModal: emailLoginModalSlice,
  kiltLoginModal: kiltLoginModalSlice,
  summonModal: summonModalSlice,
  inModal: inModalSlice,
  migrateModal: migrateModalSlice,
  outModal: outModalSlice,
  blockNumbers: blockNumbersSlice,
  customizer: customizerSlice,
  oauth: oauthSlice,
  imageCache: imageCacheSlice,
  [bridgeApi.reducerPath]: bridgeApi.reducer,
  [generatedSquidMarketplaceApi.reducerPath]: generatedSquidMarketplaceApi.reducer,
  [generatedSquidRaresamaApi.reducerPath]: generatedSquidRaresamaApi.reducer,
  [generatedSquidExosamaApi.reducerPath]: generatedSquidExosamaApi.reducer,
  [generatedSubgraphExnApi.reducerPath]: generatedSubgraphExnApi.reducer
});

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: []
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), bridgeApi.middleware, generatedSquidMarketplaceApi.middleware, generatedSquidRaresamaApi.middleware, generatedSquidExosamaApi.middleware, generatedSubgraphExnApi.middleware],
});
export const persistor = persistStore(store)
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)



export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
