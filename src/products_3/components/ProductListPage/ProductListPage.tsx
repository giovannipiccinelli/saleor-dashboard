import Card from "@material-ui/core/Card";
import Container from "@saleor/components/Container";
import { ProductListColumns } from "@saleor/config";
import {
  GridAttributes_availableInGrid_edges_node,
  GridAttributes_grid_edges_node
} from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import {
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage
} from "@saleor/types";
import React from "react";

import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
import { ProductFilterKeys, ProductListFilterOpts } from "./filters";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
    FetchMoreProps,
    SortPage<ProductListUrlSortField> {
  activeAttributeSortId: string;
  availableInGridAttributes: GridAttributes_availableInGrid_edges_node[];
  currencySymbol: string;
  gridAttributes: GridAttributes_grid_edges_node[];
  totalGridAttributes: number;
  products: ProductList_products_edges_node[];
  onExport: () => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    currencySymbol,
    currentTab,
    defaultSettings,
    gridAttributes,
    availableInGridAttributes,
    filterOpts,
    hasMore,
    initialSearch,
    settings,
    tabs,
    totalGridAttributes,
    onAdd,
    onAll,
    onExport,
    onFetchMore,
    onFilterChange,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    ...listProps
  } = props;

  return (
    <Container>
      <Card>
        <ProductList
          {...listProps}
          gridAttributes={gridAttributes}
          settings={settings}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
