import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { StandardizedOnChainTokenWithRecognizedTokenData } from "../../utils/graphqlReformatter";
import { Media } from "../Media";
import { PortalTabListBalanceProps, PortalTabListCheckableProps, PortalTabListItem } from "./PortalTabListItem";

export type OnChainItemProps = {
    token: StandardizedOnChainTokenWithRecognizedTokenData,
    children?: ReactNode
} & PortalTabListCheckableProps
export const OnChainItem: React.FC<OnChainItemProps> = ({ ...inProps }) => {
    const props = {
        ...inProps,
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};