export interface IRequestItem {
    id: number;
    createdBy: string;
    createdOn: string;
    createdOnBehalfBy: string;
    modifiedOnBehalfBy: string;
    modifiedBy: string;
    modifiedOn: string;
    msnfpDescription: string;
    msnfpGeoreference: string;
    importSequenceNumber: string;
    msnfpItemId: number;
    msnfpItemCode: string;
    msnfpItemGroup: string;
    msnfpItemName: string;
    msnfpItemNumber: number;
    msnfpItemStatus: string;
    msnfpItemType: string;
    msnfpLongitude: string;
    msnfpLatitude: string;
    ownerId: string;
    owningBusinessUnit: string;
    owningTeam: string;
    owningUser: string;
    msnfpPolygon: string;
    msnfpPurchaseCategory: string;
    overriddenCreatedOn: string;
    stateCode: number;
    msnfpSupplierId: string;
    timeZoneRuleVersionNumber: string;
    itccpnVersionTimeZoneCode: string;
    versionNumber: string;
    deliverOn: string;
    hashString: string; 
    acceptedBy: string;
  }

export interface IAcceptedItem {
    createdDate?: string;
    hashString?: string; 
    partner?: string;
    expectedDate?: string;
    methodDelivery?: string;
    poc?: string;
    needsToPickup: boolean;
    addressToPickup?: string;
    facilityHoursPickUp?: string;
    poOrRelease?: string;
    productType?: string;
    expirationDate?: string;
    unitType?: string;
    quantityByUnit: number
    quantityDimensionPallets: number
    weightProduct: number
    retailValue: number
}