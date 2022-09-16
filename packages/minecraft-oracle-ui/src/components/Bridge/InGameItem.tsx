import { Box, Checkbox, HStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Media } from "../Media";
import { InGameItemWithStatic } from "../../hooks/multiverse/useInGameItems";
import { BridgeTabListItemCheckable, BridgeTabListItemCheckableProps } from "./BridgeTabListItem";


export const InGameItem: React.FC<BridgeTabListItemCheckableProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemCheckable
            {...props}
        ></BridgeTabListItemCheckable>
    )
};