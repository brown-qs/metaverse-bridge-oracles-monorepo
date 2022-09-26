import { Box, Button, Checkbox, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Media } from "../Media";
import { BridgeTabListItemCheckableProps, BridgeTabListItemCheckable } from "./BridgeTabListItem";

export const OnChainItem: React.FC<BridgeTabListItemCheckableProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemCheckable
            {...props}
        ></BridgeTabListItemCheckable>
    )
};