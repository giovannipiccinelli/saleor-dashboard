import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListActions } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import {
  ProductDetails_product,
  ProductDetails_product_images
} from "../../types/ProductDetails";
import { getChoices, ProductUpdatePageFormData } from "../../utils/data";
import { ProductAttributeInput } from "../ProductAttributes";
import ProductImages from "../ProductImages";
import { ProductStockInput } from "../ProductStocks";
import ProductUpdateForm from "./form";

export interface ProductUpdatePageProps extends ListActions {
  placeholderImage: string;
  images: ProductDetails_product_images[];
  product: ProductDetails_product;
  header: string;
  warehouses: WarehouseFragment[];
  taxTypes: TaxTypeFragment[];
  onImageDelete: (id: string) => () => void;
  onSubmit: (data: ProductUpdatePageSubmitData) => SubmitPromise;
  onBack?();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onSeoClick?();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
  attributes: ProductAttributeInput[];
  collections: string[];
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  images,
  header,
  placeholderImage,
  product,
  warehouses,
  taxTypes,
  onBack,
  onImageDelete,
  onImageEdit,
  onImageReorder,
  onImageUpload,
  onSubmit
}) => {
  const intl = useIntl();

  const [selectedCollections, setSelectedCollections] = useStateFromProps(
    getChoices(maybe(() => product.collections, []))
  );

  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  return (
    <ProductUpdateForm
      onSubmit={onSubmit}
      product={product}
      selectedCollections={selectedCollections}
      setSelectedCollections={setSelectedCollections}
      taxTypes={taxTypeChoices}
      warehouses={warehouses}
    >
      {() => (
        <>
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.products)}
            </AppHeader>
            <PageHeader title={header} />
            <Grid>
              <div>
                <CardSpacer />
                <ProductImages
                  images={images}
                  placeholderImage={placeholderImage}
                  onImageDelete={onImageDelete}
                  onImageReorder={onImageReorder}
                  onImageEdit={onImageEdit}
                  onImageUpload={onImageUpload}
                />
                <CardSpacer />
              </div>
            </Grid>
          </Container>
        </>
      )}
    </ProductUpdateForm>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default ProductUpdatePage;
