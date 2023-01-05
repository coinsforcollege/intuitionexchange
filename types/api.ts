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
  assetId: string;
  contingentHold: number;
  disbursable: number;
  disbursableCold: number;
  disbursableHot: number;
  id: string;
  name: string;
  nonContingentHold: number;
  nonContingentHoldCold: number;
  nonContingentHoldHot: number;
  pendingSettlement: number;
  pendingTransfer: number;
  pendingTransferCold: number;
  pendingTransferHot: number;
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
