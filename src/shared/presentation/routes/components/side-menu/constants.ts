/**
 * IMPORTS
 */
import type { ViewStyle } from "react-native";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// className não chega no contentContainer do DrawerContentScrollView;
// flexGrow deixa o rodapé no fim mesmo com poucos itens.
const SCROLL_CONTENT_STYLE: ViewStyle = { flexGrow: 1 };

/**
 * EXPORTS
 */
export { HIT_SLOP, SCROLL_CONTENT_STYLE };
