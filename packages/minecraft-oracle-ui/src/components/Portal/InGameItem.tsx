import React, { ReactNode } from "react";
import { formatInGameTokenName, formatInGameTokenSuffix, InGameTokenMaybeMetadata } from "../../utils/graphqlReformatter";
import { PortalTabListBalanceProps, PortalTabListCheckableProps, PortalTabListClickableProps, PortalTabListItem, PortalTabListItemProps } from "./PortalTabListItem";
import { BigNumber } from "@ethersproject/bignumber";

export type InGameItemProps = {
    token: InGameTokenMaybeMetadata,
    children?: ReactNode
} & PortalTabListCheckableProps & PortalTabListClickableProps

export const InGameItem: React.FC<InGameItemProps> = ({ token, ...inProps }) => {
    const lineOne: string | undefined = React.useMemo(() => formatInGameTokenName(token), [token])
    const lineOneSuffix: string | undefined = React.useMemo(() => formatInGameTokenSuffix(token), [token])
    const lineTwo: string | undefined = React.useMemo(() => token.enraptured ? "Enraptured. Not exportable." : undefined, [token])
    const props: PortalTabListItemProps = {
        mediaUrl: token?.metadata?.image ?? undefined,
        isLoading: !!token?.metadata !== true,
        lineOne,
        lineOneSuffix,
        mediaRedOutline: token.enraptured === true,
        lineTwo,
        //lineTwo: undefined,
        highlightable: true,

        balanceEther: undefined,

        ...inProps
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};