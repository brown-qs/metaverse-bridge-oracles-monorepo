import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Media } from "../Media";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { UserCollectionElement } from "../../hooks/multiverse/useOnChainItems";
import { BridgeTabListItemCheckableProps, BridgeTabListItemCheckable } from "./BridgeTabListItem";

export const OnChainItem: React.FC<BridgeTabListItemCheckableProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemCheckable
            {...props}
        ></BridgeTabListItemCheckable>
    )
};