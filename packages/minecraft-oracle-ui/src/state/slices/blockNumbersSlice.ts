import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from ".."
import { ChainId } from "../../constants"

export type BlockNumbersSlice = { [chainId in ChainId]?: number }

const blockNumbersSlice = createSlice({
  name: "blockNumbersSlice",
  initialState: {} as BlockNumbersSlice,
  reducers: {
    setBlockNumber: (state, action: PayloadAction<{ chainId: ChainId, blockNumber: number }>) => {
      const { chainId, blockNumber } = action.payload
      if (!chainId) {
        return
      }
      if (typeof state[chainId] !== 'number') {
        state[chainId] = blockNumber;
      } else {
        state[chainId] = Math.max(
          blockNumber ?? -1,
          state[chainId] ?? -1
        );
      }
    }
  }
})

export const { setBlockNumber } = blockNumbersSlice.actions
export default blockNumbersSlice.reducer

export const selectBlockNumbers = (state: AppState) => state?.blockNumbers
