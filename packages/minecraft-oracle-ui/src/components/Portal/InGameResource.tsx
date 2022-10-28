import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { InGameTokenMaybeMetadata } from "../../utils/graphqlReformatter";
import { Media } from "../Media";
import { PortalTabListItem } from "./PortalTabListItem";

export type InGameResourceProps = {
    token: InGameTokenMaybeMetadata,
    children?: ReactNode
}
export const InGameResource: React.FC<InGameResourceProps> = ({ ...inProps }) => {
    const props = {
        ...inProps,
    }
    return (
        <PortalTabListItem
            {...props}
        ></PortalTabListItem>
    )
};