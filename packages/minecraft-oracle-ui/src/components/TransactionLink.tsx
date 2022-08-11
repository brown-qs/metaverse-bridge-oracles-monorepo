import { Box, Link } from "@chakra-ui/react";
import { ReactNode } from "react";

export const TransactionLink: React.FC<{ href: string, linkText: string, children?: ReactNode }> = ({ href, linkText, children }) => {
    return (
        <Box
            w="100%"
            overflow="hidden"
            whiteSpace="nowrap"
            color="teal.200"
            textOverflow="ellipsis"
        >
            <Link
                isExternal
                href={href}
            >
                {linkText}
            </Link>
        </Box>)
};
