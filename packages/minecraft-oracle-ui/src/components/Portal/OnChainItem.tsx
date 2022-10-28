import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";
import { formatOnChainTokenName, formatOnChainTokenSuffix, StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { Media } from "../Media";
import { PortalTabListBalanceProps, PortalTabListCheckableProps, PortalTabListItem, PortalTabListItemProps } from "./PortalTabListItem";
import { BigNumber } from "@ethersproject/bignumber";

export type OnChainItemProps = {
    token: StandardizedOnChainTokenWithRecognizedTokenData,
    children?: ReactNode
} & PortalTabListCheckableProps
export const OnChainItem: React.FC<OnChainItemProps> = ({ token, ...inProps }) => {
    const lineOne: string | undefined = React.useMemo(() => formatOnChainTokenName(token), [token])
    const lineOneSuffix: string | undefined = React.useMemo(() => formatOnChainTokenSuffix(token), [token])

    const lineTwo: string | undefined = React.useMemo(() => token.enrapturable ? "This item will be burned into your account." : undefined, [token])

    const props: PortalTabListItemProps = {
        mediaUrl: token?.metadata?.image ?? undefined,
        isLoading: false,
        lineOne,
        lineOneSuffix,
        mediaRedOutline: token.enrapturable === true,
        lineTwo,
        highlightable: true,

        onClick: undefined,

        balanceEther: token.treatAsFungible ? BigNumber.from(token.balance).div(BigNumber.from(10).pow(token.decimals)) : undefined,

        ...inProps
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};