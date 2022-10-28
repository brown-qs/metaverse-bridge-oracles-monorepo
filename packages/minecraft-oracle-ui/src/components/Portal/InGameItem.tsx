import React, { ReactNode } from "react";
import { InGameTokenMaybeMetadata } from "../../utils/graphqlReformatter";
import { PortalTabListBalanceProps, PortalTabListCheckableProps, PortalTabListClickableProps, PortalTabListItem, PortalTabListItemProps } from "./PortalTabListItem";

export type InGameItemProps = {
    token: InGameTokenMaybeMetadata,
    children?: ReactNode
} & PortalTabListCheckableProps & PortalTabListClickableProps

export const InGameItem: React.FC<InGameItemProps> = ({ token, ...inProps }) => {
    const props: PortalTabListItemProps = {
        token
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};