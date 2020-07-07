import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  disabled: false,
  navigateToChannelCreate: () => undefined,
  onBack: () => undefined,
  onRemove: () => undefined,
  onRowClick: () => undefined
};

storiesOf("Views / Channels / Channels list", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsListPage {...props} />)
  .add("disabled", () => <ChannelsListPage {...props} disabled={true} />)
  .add("empty", () => <ChannelsListPage {...props} channelsList={[]} />);
