export interface ApiUserInfo {
  email: string;
  firstName: string;
  flags: number;
  id: string;
  kyc: boolean;
  lastName: string;
  phone: string;
  phoneCountry: string;
  primeTrustAccountStatus: boolean;
}

export interface ApiFiatTotals {
  contingentHold: number;
  currencyType: number;
  disbursable: number;
  nonContingentHold: number;
  pendingSettlement: number;
  pendingTransfer: number;
  settled: number;
}

export interface ApiFiatTransaction {
  amount: number;
  comments: string[];
  createdAt: string;
  currencyType: string;
  effectiveAt: string;
  fundsTransferType: string;
  id: string;
  opsReference: string;
  settledAt: string;
  settledOn: string;
  specialType: string;
}

export interface ApiFiatBank {
  bankAccountName: string;
  id: string;
  routingNumber: string;
}

export interface ApiFiatWireInstructions {
  accountNumber: string;
  bankAddress: string;
  bankPhone: string;
  beneficiaryAddress: string;
  creditTo: string;
  depositoryBankName: string;
  notes: null;
  reference: string;
  routingNumber: string;
  swiftCode: null | string;
}

export interface ApiFiatCreditCard {
  creditCardBin: string;
  creditCardExpirationDate: string;
  creditCardName: string;
  creditCardPostalCode: string;
  creditCardType: string;
  id: string;
}

export interface ApiAssetTransaction {
  assetFee: number;
  assetTransactionType: string;
  assetTransferType: string;
  cashFee: number;
  comments: string[];
  createdAt: string;
  currencyType: string;
  data: string;
  effectiveAt: string;
  id: string;
  settledAt: string;
  settledOn: string;
  tradedOn: string;
  unitCount: number;
  unitCountActual: number;
}

export interface ApiAssetSummary {
  code: string;
  id: string;
  name: string;
  settled: number;
  settledCold: number;
  settledHot: number;
}

export interface ApiAssetDeposit {
  assetId: string;
  walletAddress: string;
}

export interface ApiAssetWithdraw {
  id: string;
  walletAddress: string;
}

export interface ApiOrder {
  assetCode: string;
  assetName: string;
  createdAt: string;
  id: string;
  makerFee: number;
  platformFee: number;
  pricePerUnit: number;
  total: number;
  totalValue: number;
  type: "buy" | "sell";
  unit: number;
}

export enum OrderType {
  Buy = "BUY",
  Sell = "SELL",
}

export enum OrderState {
  Closed = "CLOSED",
  Open = "OPEN",
}

export enum OrderBaseType {
  Asset = "ASSET",
  Fiat = "FIAT",
}

export interface IP2POrder {
  _id: string;
  assetId: string;
  custodialAccountId: string;
  orderType: string;
  price: number;
  quantity: number;
  quantityRemaining: number;
  status: OrderState;
  timestamp: Date;
  userId: string;
}

export interface P2POrderBaseCurrency {
  currency: string;
  type: OrderBaseType.Fiat;
}

export interface P2POrderBaseAsset {
  code: string;
  id: string;
  name: string;
  type: OrderBaseType.Asset;
}

export interface P2POrderRecord {
  assetCode: string;
  assetId: string;
  assetName: string;
  base: P2POrderBaseCurrency | P2POrderBaseAsset;
  id: string;
  orderType: OrderType;
  price: number;
  quantity: number;
  quantityRemaining: number;
  status: OrderState;
  timestamp: string;
}

export interface P2PTransaction {
  _id: string;
  buyOrderId: string;
  executedPrice: number;
  executedQuantity: number;
  sellOrderId: string;
  timestamp: string;
  tradeId: string;
}
