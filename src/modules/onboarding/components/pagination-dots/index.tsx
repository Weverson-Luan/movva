/**
 * IMPORTS
 */
import { View } from "react-native";
// typings
import type { PaginationDotsProps } from "./interface";
import { PaginationDot } from "./pagination-dot";
import { paginationDotsVariants } from "./pagination-dots.variants";

// Um dot por slide, centralizados.
const PaginationDots = ({ items, width, scrollX }: PaginationDotsProps) => {
  const styles = paginationDotsVariants();

  return (
    <View className={styles.container()}>
      {items.map((item, index) => (
        <PaginationDot key={item.key} index={index} width={width} scrollX={scrollX} />
      ))}
    </View>
  );
};

/**
 * EXPORTS
 */
export { PaginationDots };
