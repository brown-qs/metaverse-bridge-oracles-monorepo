import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Media } from "../Media";
import { UserCollectionElement } from "../../hooks/multiverse/useOnChainItems";
import { Fraction } from "../../utils/Fraction";
import { BridgeTabListItemWithBalance, BridgeTabListItemWithBalanceProps } from "./BridgeTabListItem";

export const OnChainResource: React.FC<BridgeTabListItemWithBalanceProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemWithBalance
            {...props}
        ></BridgeTabListItemWithBalance>
    )
};