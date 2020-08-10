import { useChannelsList } from "@saleor/channels/queries";
import { ChannelData, createChannelsData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

import ProductCreatePage, {
  ProductCreatePageSubmitData
} from "../components/ProductCreatePage";
import { TypedProductCreateMutation } from "../mutations";
import { ProductCreate } from "../types/ProductCreate";
import { productListUrl, productUrl } from "../urls";

export const ProductCreateView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const {
    loadMore: loadMoreCategories,
    search: searchCategory,
    result: searchCategoryOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollection,
    result: searchCollectionOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreProductTypes,
    search: searchProductTypes,
    result: searchProductTypesOpts
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelData[] = createChannelsData(channelsData?.channels);
  const [currentChannels, setCurrentChannels] = useStateFromProps(allChannels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelData>(currentChannels, (a, b) => a.id === b.id);

  const [isChannelsModalOpen, setChannelsModalOpen] = React.useState(false);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsConfirm = () => {
    if (channelListElements.length) {
      setCurrentChannels(channelListElements);
    } else {
      setChannels(currentChannels);
    }
    setChannelsModalOpen(false);
  };

  const handleBack = () => navigate(productListUrl());

  const handleSuccess = (data: ProductCreate) => {
    if (data.productCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Product created"
        })
      });
      navigate(productUrl(data.productCreate.product.id));
    }
  };

  return (
    <TypedProductCreateMutation onCompleted={handleSuccess}>
      {(productCreate, productCreateOpts) => {
        const handleSubmit = (formData: ProductCreatePageSubmitData) => {
          productCreate({
            variables: {
              attributes: formData.attributes.map(attribute => ({
                id: attribute.id,
                values: attribute.value
              })),
              category: formData.category,
              chargeTaxes: formData.chargeTaxes,
              collections: formData.collections,
              descriptionJson: JSON.stringify(formData.description),
              name: formData.name,
              productType: formData.productType,
              seo: {
                description: formData.seoDescription,
                title: formData.seoTitle
              }
            }
          });
        };

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create Product",
                description: "window title"
              })}
            />
            {!!allChannels?.length && (
              <ChannelsAvailabilityDialog
                isSelected={isChannelSelected}
                channels={allChannels}
                onChange={channelsToggle}
                onClose={handleChannelsModalClose}
                open={isChannelsModalOpen}
                title={intl.formatMessage({
                  defaultMessage: "Manage Products Channel Availability"
                })}
                confirmButtonState="default"
                onConfirm={handleChannelsConfirm}
              />
            )}
            <ProductCreatePage
              allChannelsCount={allChannels?.length}
              currentChannels={currentChannels}
              hasChannelChanged={
                allChannels?.length !== currentChannels?.length
              }
              currency={shop?.defaultCurrency}
              categories={
                searchCategoryOpts?.data?.search?.edges ||
                [].map(edge => edge.node)
              }
              collections={
                searchCollectionOpts?.data?.search?.edges ||
                [].map(edge => edge.node)
              }
              disabled={productCreateOpts.loading}
              errors={productCreateOpts.data?.productCreate.errors || []}
              fetchCategories={searchCategory}
              fetchCollections={searchCollection}
              fetchProductTypes={searchProductTypes}
              header={intl.formatMessage({
                defaultMessage: "New Product",
                description: "page header"
              })}
              productTypes={searchProductTypesOpts?.data?.search?.edges?.map(
                edge => edge.node
              )}
              onBack={handleBack}
              onSubmit={handleSubmit}
              saveButtonBarState={productCreateOpts.status}
              fetchMoreCategories={{
                hasMore:
                  searchCategoryOpts?.data?.search?.pageInfo?.hasNextPage,
                loading: searchCategoryOpts.loading,
                onFetchMore: loadMoreCategories
              }}
              fetchMoreCollections={{
                hasMore:
                  searchCollectionOpts?.data?.search?.pageInfo?.hasNextPage,
                loading: searchCollectionOpts.loading,
                onFetchMore: loadMoreCollections
              }}
              fetchMoreProductTypes={{
                hasMore:
                  searchProductTypesOpts?.data?.search?.pageInfo?.hasNextPage,
                loading: searchProductTypesOpts.loading,
                onFetchMore: loadMoreProductTypes
              }}
              warehouses={
                warehouses.data?.warehouses.edges.map(edge => edge.node) || []
              }
              openChannelsModal={() => setChannelsModalOpen(true)}
            />
          </>
        );
      }}
    </TypedProductCreateMutation>
  );
};
export default ProductCreateView;
