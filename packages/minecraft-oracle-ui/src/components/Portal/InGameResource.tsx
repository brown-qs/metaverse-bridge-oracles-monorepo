import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";
import { NETWORK_NAME } from "../../constants";
import { formatInGameTokenName, formatInGameTokenSuffix, InGameTokenMaybeMetadata } from "../../utils/graphqlReformatter";
import { Media } from "../Media";
import { PortalTabListItem, PortalTabListItemProps } from "./PortalTabListItem";

export type InGameResourceProps = {
    token: InGameTokenMaybeMetadata,
    children?: ReactNode
}
export const InGameResource: React.FC<InGameResourceProps> = ({ token, ...inProps }) => {
    const lineOne: string | undefined = React.useMemo(() => formatInGameTokenName(token), [token])
    const lineOneSuffix: string | undefined = React.useMemo(() => formatInGameTokenSuffix(token), [token])

    const lineTwo: string | undefined = React.useMemo(() => {
        let lineTwo = ""
        if (!!NETWORK_NAME[token.chainId]) {
            lineTwo = NETWORK_NAME[token.chainId]
        }

        if (token.inventorySummonEnabled === false) {
            if (lineTwo.length === 0) {
                lineTwo = "Summon disabled."
            } else {
                lineTwo = lineTwo + ". Summon disabled."
            }
        }

        if (lineTwo.length === 0) {
            return undefined
        }
        return lineTwo
    }, [token])
    const props: PortalTabListItemProps = {
        mediaUrl: token?.metadata?.image ?? undefined,
        isLoading: !!token?.metadata !== true,
        lineOne,
        lineOneSuffix,
        mediaRedOutline: false,
        lineTwo,
        highlightable: true,

        onClick: undefined,

        onCheckboxChange: undefined,
        isChecked: undefined,
        checkboxValue: undefined,
        isCheckboxDisabled: undefined,

        balanceEther: token.amount,

        ...inProps
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};