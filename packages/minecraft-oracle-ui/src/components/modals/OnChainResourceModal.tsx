import { Box, Button, CircularProgress, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { SUB_ASSETS } from "../../constants";
import useAddTokenToMetamask from "../../hooks/useAddTokenToMetamask/useAddTokenToMetamask";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { closeOnChainResourceModal, selectOnChainResource, selectOnChainResourceModalOpen } from "../../state/slices/onChainResourceModalSlice";
import { AddressDisplayComponent } from "../form/AddressDisplayComponent";

export function OnChainResourceModal() {
    const onChainResource = useSelector(selectOnChainResource)

    const subAsset = SUB_ASSETS.find(s => s.assetAddress === onChainResource?.assetAddress && s.assetId === onChainResource?.numericId)
    const { addToken } = useAddTokenToMetamask({
        address: subAsset?.subAssetAddress,
        decimals: 18,
        symbol: subAsset?.symbol,
        image: subAsset?.imageUrl
    })
    return (<ReduxModal
        title="Hybrid token details"
        isOpenSelector={selectOnChainResourceModalOpen}
        closeActionCreator={closeOnChainResourceModal}
    >
        <VStack alignItems="center" spacing="0">
            {!!onChainResource &&
                <SimpleGrid columns={2} spacing={1} w="100%" paddingBottom="16px">
                    <Box >Type</Box>
                    <Box >{onChainResource?.assetType}</Box>
                    <Box >ID</Box>
                    <Box>{onChainResource?.numericId}</Box>
                    <Box>Address</Box>
                    <Box>
                        <AddressDisplayComponent
                            copyTooltipLabel={'Copy address'}
                            charsShown={5}
                        >
                            {onChainResource?.assetAddress ?? '?'}
                        </AddressDisplayComponent>
                    </Box>
                </SimpleGrid>
            }

            {subAsset &&
                <Box w="100%">
                    <SimpleGrid columns={2} spacing={1} paddingBottom="16px" w="100%">
                        <Box >Type</Box>
                        <Box >ERC20</Box>
                        <Box>Address</Box>
                        <Box>
                            <AddressDisplayComponent
                                copyTooltipLabel={'Copy address'}
                                charsShown={5}
                            >
                                {subAsset.subAssetAddress}
                            </AddressDisplayComponent>
                        </Box>
                    </SimpleGrid>
                    <Button
                        w="100%"
                        onClick={() => {
                            addToken()
                        }}
                        disabled={false}
                    //startIcon={<Avatar src={MetamaskLogo}>Add to Metamask</Avatar>}
                    >
                        ADD TO METAMASK
                    </Button>
                </Box>
            }

        </VStack>

    </ReduxModal >)
}