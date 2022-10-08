import React, { ReactNode } from "react";
import { BridgeTabListItemCheckable, BridgeTabListItemCheckableProps } from "./BridgeTabListItem";

export const InGameItem: React.FC<BridgeTabListItemCheckableProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemCheckable
            {...props}
        ></BridgeTabListItemCheckable>
    )
};