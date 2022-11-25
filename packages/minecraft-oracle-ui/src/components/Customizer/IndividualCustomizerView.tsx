import { Stack, Box, VStack, Image, Fade, HStack, Button, Tag, FormControl, FormLabel, NumberInput, NumberInputField, useDimensions, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Grid, SimpleGrid } from "@chakra-ui/react"
import { keyframes } from "@emotion/css"
import React, { ComponentType, memo, ReactNode, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { PhotoOff, Stack3, Wallet } from "tabler-icons-react"
import { useActiveWeb3React } from "../../hooks"
import LibraryCustomizerCard from "./LibraryCustomizerCard"
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../state/slices/authSlice"
import { useCustomizerConfigQuery, useGetInGameItemsQuery } from "../../state/api/bridgeApi"
import { useGetExosamaOnChainTokensQuery } from "../../state/api/generatedSquidExosamaApi"
import { useGetMarketplaceOnChainTokensQuery } from "../../state/api/generatedSquidMarketplaceApi"
import { StandardizedOnChainToken, standardizeMarketplaceOnChainTokens, standardizeExosamaOnChainTokens } from "../../utils/graphqlReformatter"
import LibraryVirtualList from "./LibraryVirtualList"
import { selectBlockNumbers } from "../../state/slices/blockNumbersSlice"
import { ChainId } from "../../constants"
import GhostButton from "../../pages/components/GhostButton"
import TraitCard from "../../pages/components/TraitCard/TraitCard"
import { MoonsamaSpinner } from "../MoonsamaSpinner"
import { CompositeConfigDto } from "../../state/api/types"
import TraitSection from "./TraitSection"
import CustomizerCanvas from "./CustomizerCanvas"

export type IndividualCustomizerViewProps = {
    customizerConfig: CompositeConfigDto,
}


const IndividualCustomizerView = ({ customizerConfig }: IndividualCustomizerViewProps) => {

    return (
        <Grid
            paddingTop="var(--moonsama-leftright-padding)"
            templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
            maxWidth="1536px"
            minWidth="calc(320px - var(--moonsama-leftright-padding) * 2)"
            margin="0 auto"
            gap="20px"
            w="100%"
        >
            <Box>
                <Box
                    bgImg="https://dev.static.moonsama.com/customizer-ui/exosama-preview-background.jpg"
                    bgSize="cover"
                    bgColor="rgba(255, 255, 255, 0.05)"
                    transition="0.2s"
                    position="relative"
                    _after={{ content: '""', display: 'block', paddingBottom: '100%' }}
                >
                </Box>
            </Box>
            <Box>
                <Accordion allowToggle>
                    {customizerConfig.parts.map((part) => {
                        const { name, items } = part;
                        /*
                        // Filter Expressions and Vibes based on body type
                        let filteredItems = items;
                        if (['Expression', 'Vibe'].includes(name)) {
                            filteredItems = filteredItems.filter((item) => {
                                return item.attributes.map((a) => a.value).includes(bodyType);
                            });
                        }
                        if (['Vibe'].includes(name)) {
                            filteredItems = filteredItems.filter((item) => {
                                return item.attributes
                                    .map((a) => a.value)
                                    .includes(expressionType);
                            });
                        }*/

                        return (
                            <AccordionItem key={name}>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left" fontFamily="Orbitron">
                                            {name}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel h="300px" padding="0">
                                    <TraitSection part={part}></TraitSection>
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Box>
        </Grid>
    )
}

export default IndividualCustomizerView
