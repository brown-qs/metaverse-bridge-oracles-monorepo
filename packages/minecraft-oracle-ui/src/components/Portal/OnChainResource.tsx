
import React from "react";
import { ReactNode } from "react";
import { formatOnChainTokenName, formatOnChainTokenSuffix, StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { PortalTabListBalanceProps, PortalTabListClickableProps, PortalTabListItem, PortalTabListItemProps } from "./PortalTabListItem";
import { BigNumber } from "@ethersproject/bignumber";

export type OnChainResourceProps = {
    token: StandardizedOnChainTokenWithRecognizedTokenData,
    children?: ReactNode
} & PortalTabListClickableProps

export const OnChainResource: React.FC<OnChainResourceProps> = ({ token, ...inProps }) => {
    const lineOne: string | undefined = React.useMemo(() => formatOnChainTokenName(token), [token])
    const lineOneSuffix: string | undefined = React.useMemo(() => formatOnChainTokenSuffix(token), [token])

    const props: PortalTabListItemProps = {
        mediaUrl: token?.metadata?.image ?? undefined,
        isLoading: false,
        lineOne,
        lineOneSuffix,
        mediaRedOutline: false,
        lineTwo: undefined,
        highlightable: false,

        onCheckboxChange: undefined,
        isChecked: undefined,
        checkboxValue: undefined,
        isCheckboxDisabled: undefined,

        balanceEther: BigNumber.from(token.balance).div(BigNumber.from(10).pow(token.decimals)),

        ...inProps
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};