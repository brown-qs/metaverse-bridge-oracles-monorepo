import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Media } from "../Media";
import { InGameResourceWithStatic } from "../../hooks/multiverse/useInGameItems";
import { BridgeTabListItemWithBalanceProps, BridgeTabListItemWithBalance } from "./BridgeTabListItem";

export const InGameResource: React.FC<BridgeTabListItemWithBalanceProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemWithBalance
            {...props}
        ></BridgeTabListItemWithBalance>
    )
};