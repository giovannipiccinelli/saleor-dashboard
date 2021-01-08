import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ColumnPicker, {
  ColumnPickerChoice
} from "@saleor/components/ColumnPicker";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { ProductListColumns } from "@saleor/config";
import { sectionNames } from "@saleor/intl";
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
import { FormattedMessage, useIntl } from "react-intl";

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

const useStyles = makeStyles(
  theme => ({
    columnPicker: {
      margin: theme.spacing(0, 3)
    }
  }),
  { name: "ProductListPage" }
);

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
    loading,
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
  const intl = useIntl();
  const classes = useStyles(props);

  const handleSave = (columns: ProductListColumns[]) =>
    onUpdateListSettings("columns", columns);

  const columns: ColumnPickerChoice[] = [
    {
      label: intl.formatMessage({
        defaultMessage: "Status",
        description: "product status"
      }),
      value: "isPublished" as ProductListColumns
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Prezzo",
        description: "product price"
      }),
      value: "price" as ProductListColumns
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Tipologia",
        description: "product type"
      }),
      value: "productType" as ProductListColumns
    },
    ...availableInGridAttributes.map(attribute => ({
      label: attribute.name,
      value: `attribute:${attribute.id}`
    }))
  ];

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.products)}>
        <ColumnPicker
          className={classes.columnPicker}
          columns={columns}
          defaultColumns={defaultSettings.columns}
          hasMore={hasMore}
          loading={loading}
          initialColumns={settings.columns}
          total={
            columns.length -
            availableInGridAttributes.length +
            totalGridAttributes
          }
          onFetchMore={onFetchMore}
          onSave={handleSave}
        />
        <Button
          onClick={onAdd}
          color="primary"
          variant="contained"
          data-test="add-product"
        >
          <FormattedMessage
            defaultMessage="Crea Prodotto"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <ProductList
          {...listProps}
          loading={loading}
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
