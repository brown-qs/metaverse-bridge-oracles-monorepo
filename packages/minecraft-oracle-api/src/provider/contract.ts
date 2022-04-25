import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { ProviderToken } from './token';
import { MULTICALL_ABI } from '../common/contracts/Multicall';
import { METAVERSE_ABI } from '../common/contracts/Metaverse';
import { ChainService } from '../chain/chain.service';
import { ContractType } from '../common/enums/ContractType';

export type TypeContractsCallbackProvider = (chainId: number, contractType: ContractType) => Promise<Contract | undefined>

export const ContractsCallbackProvider: FactoryProvider<(chainId: number, contractType: ContractType) => Promise<Contract | undefined>> = {
    provide: ProviderToken.CONTRACT_CHAIN_CALLBACK,
    useFactory: (configService: ConfigService, chainService: ChainService, client: ethers.providers.Provider[]) => {
        const getContract = async (chainId: number, contractType: ContractType) => {
            const chain = await chainService.findOne({ chainId })
            if (!chain) {
                return undefined
            }
            const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
            const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');
            const oracle = new ethers.Wallet(oraclePrivateKey, provider);

            if (contractType.valueOf() === ContractType.MULTICALL.valueOf()) {
                return (new Contract(chain.multicallAddress, MULTICALL_ABI, oracle))
            } else if (contractType.valueOf() === ContractType.MULTIVERSE_V1.valueOf()) {
                return (new Contract(chain.multicallAddress, METAVERSE_ABI, oracle))
            } else {
                return undefined
            }
        }
        return getContract;
    },
    inject: [ConfigService, ChainService],
    scope: Scope.DEFAULT
};
