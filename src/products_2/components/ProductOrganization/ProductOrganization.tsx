import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { FormSpacer } from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { maybe } from "@saleor/misc";
import { FetchMoreProps } from "@saleor/types";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
}

const useStyles = makeStyles(
  theme => ({
    card: {
      overflow: "visible"
    },
    cardSubtitle: {
      fontSize: "1rem",
      marginBottom: theme.spacing(0.5)
    },
    label: {
      marginBottom: theme.spacing(0.5)
    }
  }),
  { name: "ProductOrganization" }
);

interface ProductOrganizationProps {
  canChangeType: boolean;
  categories?: SingleAutocompleteChoiceType[];
  categoryInputDisplayValue: string;
  collections?: MultiAutocompleteChoiceType[];
  data: {
    category: string;
    collections: string[];
    productType?: ProductType;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  productType?: ProductType;
  productTypeInputDisplayValue?: string;
  productTypes?: SingleAutocompleteChoiceType[];
  fetchCategories: (query: string) => void;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes?: FetchMoreProps;
  fetchProductTypes?: (data: string) => void;
  onCategoryChange: (event: ChangeEvent) => void;
  onProductTypeChange?: (event: ChangeEvent) => void;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = props => {
  const {
    canChangeType,
    categories,
    categoryInputDisplayValue,
    data,
    disabled,
    errors,
    fetchCategories,
    fetchMoreCategories,
    fetchMoreProductTypes,
    fetchProductTypes,
    productType,
    productTypeInputDisplayValue,
    productTypes,
    onCategoryChange,
    onProductTypeChange
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(
    ["productType", "category", "collections"],
    errors
  );

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Classificazione Prodotto",
          description: "section header"
        })}
      />
      <CardContent>
        {canChangeType ? (
          <SingleAutocompleteSelectField
            displayValue={productTypeInputDisplayValue}
            error={!!formErrors.productType}
            helperText={getProductErrorMessage(formErrors.productType, intl)}
            name="productType"
            disabled={disabled}
            label={intl.formatMessage({
              defaultMessage: "Tipologia di Prodotto"
            })}
            choices={productTypes}
            value={data.productType?.id}
            onChange={onProductTypeChange}
            fetchChoices={fetchProductTypes}
            data-test="product-type"
            {...fetchMoreProductTypes}
          />
        ) : (
          <>
            <Typography className={classes.label} variant="caption">
              <FormattedMessage defaultMessage="Tipologia di Prodotto" />
            </Typography>
            <Typography>{maybe(() => productType.name, "...")}</Typography>
            <CardSpacer />
            <Typography className={classes.label} variant="caption">
              <FormattedMessage defaultMessage="Tipologia di Prodotto" />
            </Typography>
            <Typography>
              {maybe(
                () =>
                  productType.hasVariants
                    ? intl.formatMessage({
                        defaultMessage: "Configurabile",
                        description: "product is configurable"
                      })
                    : intl.formatMessage({
                        defaultMessage: "Semplice",
                        description: "product is not configurable"
                      }),
                "..."
              )}
            </Typography>
          </>
        )}
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <SingleAutocompleteSelectField
          displayValue={categoryInputDisplayValue}
          error={!!formErrors.category}
          helperText={getProductErrorMessage(formErrors.category, intl)}
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "Categoria"
          })}
          choices={disabled ? [] : categories}
          name="category"
          value={data.category}
          onChange={onCategoryChange}
          fetchChoices={fetchCategories}
          data-test="category"
          {...fetchMoreCategories}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
      </CardContent>
    </Card>
  );
};
ProductOrganization.displayName = "ProductOrganization";
export default ProductOrganization;
