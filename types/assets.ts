export type AssetListItem = {
  assetId: string;
  code: string;
  name: string;
  transferType: string;
};

export const assetsList: AssetListItem[] = [
  {
    assetId: "798debbc-ec84-43ea-8096-13e2ebcf4749",
    code: "BTC",
    name: "BTC",
    transferType: "bitcoin",
  },
  {
    assetId: "27552c2e-7ddb-4144-81e3-23f87c94da3f",
    code: "LTC",
    name: "LTC",
    transferType: "litecoin",
  },
  {
    assetId: "e63b0367-c47b-49be-987a-f14036b230cd",
    code: "ETH",
    name: "ETH",
    transferType: "ethereum",
  },
  {
    assetId: "a923fa2a-2b15-4020-a643-8516cbad6129",
    code: "ADA",
    name: "ADA",
    transferType: "digital_asset",
  },
  {
    assetId: "0d552ccf-7e61-4e1e-9d0c-f0dee2c24ab1",
    code: "UST",
    name: "UST",
    transferType: "terra",
  },
  {
    assetId: "9b964e36-8509-4088-b908-141071087301",
    code: "USDT",
    name: "USDT(ERC-20)",
    transferType: "ethereum",
  },
  {
    assetId: "5c825b29-4d0c-44ae-803e-bdee9c454fae",
    code: "USDC",
    name: "USDC(ERC-20)",
    transferType: "digital_asset",
  },
];
