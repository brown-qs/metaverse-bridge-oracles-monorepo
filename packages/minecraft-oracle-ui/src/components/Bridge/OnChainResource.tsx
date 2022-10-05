
import { BridgeTabListItemWithBalance, BridgeTabListItemWithBalanceProps } from "./BridgeTabListItem";

export const OnChainResource: React.FC<BridgeTabListItemWithBalanceProps> = ({ ...props }) => {
    return (
        <BridgeTabListItemWithBalance
            {...props}
        ></BridgeTabListItemWithBalance>
    )
};