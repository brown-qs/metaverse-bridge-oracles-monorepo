import { VStack, HStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Grid, Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { AssetChainDetails } from "../AssetChainDetails/AssetChainDetails";
import { MoonsamaModal } from "../MoonsamaModal";

export const ItemDetailsModal: React.FC<{ data: InGameItemWithStatic, isOpen: boolean, onClose: () => void, children?: ReactNode }> = ({ data, isOpen, onClose }) => {

    return (

        <MoonsamaModal title={data.recognizedAssetType} isOpen={isOpen} onClose={onClose}>
            <div >
                <Grid justifyContent="center">
                    <Grid >
                        <Box >
                            <div >
                                <div >
                                    {data.enraptured ? 'This item is enraptured.' : 'This item is imported.'}
                                </div>
                            </div>
                            <div >
                                <div >
                                    {data.exportable ? <Tooltip label={'This item can be exported back to the chain it came from to the original owner address.'}>
                                        <div>This item is exportable.</div>
                                    </Tooltip> : <Tooltip label={'This item is burned into the metaverse forever. Cannot be taken back.'}>
                                        <div>This item is not exportable.</div>
                                    </Tooltip>}
                                </div>
                            </div>
                            <div >
                                <div >
                                    {`Bridge balance: ${data.amount}`}
                                </div>
                            </div>
                            {data.exportable && <AssetChainDetails data={data} borderOn={false} />}
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </MoonsamaModal>

    )
};