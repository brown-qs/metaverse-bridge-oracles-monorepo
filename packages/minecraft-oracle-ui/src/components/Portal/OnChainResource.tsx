
import { ReactNode } from "react";
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { PortalTabListBalanceProps, PortalTabListClickableProps, PortalTabListItem } from "./PortalTabListItem";

export type OnChainResourceProps = {
    token: StandardizedOnChainTokenWithRecognizedTokenData,
    children?: ReactNode
} & PortalTabListClickableProps

export const OnChainResource: React.FC<OnChainResourceProps> = ({ ...inProps }) => {
    const props = {
        ...inProps,
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};