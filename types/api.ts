export interface ApiUserInfo {
  email: string;
  firstName?: string;
  flags: number;
  id: string;
  kyc: boolean;
  lastName?: string;
  middleName?: string;
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
  currentValue: number;
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
  type: OrderType;
  unit: number;
}

export enum OrderType {
  Buy = "BUY",
  Sell = "SELL",
}

export enum OrderState {
  Closed = "CLOSED",
  Completed = "COMPLETED",
  Open = "OPEN",
}

export enum OrderBaseType {
  Asset = "ASSET",
  Fiat = "FIAT",
}

export interface IP2POrder {
  _id: string;
  assetId: string;
  createdAt: Date;
  custodialAccountId: string;
  orderType: string;
  price: number;
  quantity: number;
  quantityRemaining: number;
  status: OrderState;
  updatedAt: Date;
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
  createdAt: string;
  id: string;
  orderType: OrderType;
  price: number;
  quantity: number;
  quantityRemaining: number;
  reason?: string;
  status: OrderState;
  updatedAt: string;
}

export interface P2PTransaction {
  _id: string;
  buyOrderId: string;
  createdAt: string;
  executedPrice: number;
  executedQuantity: number;
  sellOrderId: string;
  tradeId: string;
  updatedAt: string;
}
