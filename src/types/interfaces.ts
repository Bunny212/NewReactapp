import { E_ERROR } from './enum';


// Config
export interface ConfigHeaders {
  headers: {
    [index: string]: string;
  };
  params?: any
}


// General
export interface Action {
  type: string;
  payload?: any;
}

export interface Target {
  target: {
    value: React.SetStateAction<string>;
    name: string;
    checked?: boolean;
  };
  preventDefault: () => void;
}

// Components
export interface IUser {
  id?: string;
  firstname: string;
  lastname: string;
}

export interface ExistingUser {
  id: number;
  name: string;
  firstname: string;
  email: string;
  password?: string;
  phone?: string;
  status: number;
  userTypes: UserType[];
  invoiceLevels?: InvoiceLevel[];
}

export interface UserList {
  users: {
    users: ExistingUser[];
    loading: boolean;
    error: any | null;
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
  meta?: any;
  actions: {
    getUserList: (options?: any) => void;
    getUsers: () => void;
    addUser: (user: ExistingUser) => void;
    updateUser: (user: ExistingUser) => void;
    deleteUser: (id: number) => void;
    getAllUserTypes: () => void;
  };
}

export interface UserReduxProps extends IAuthReduxProps {
  users: {
    users: ExistingUser[];
    meta?: any;
    loading: boolean;
    error: any | null;
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
}

export interface IArticleList {
  articles: {
    articles: IExistingArticle[];
  };
  actions: {
    getArticles: () => void;
    addArticle: (article: IArticle) => void;
    deleteArticle: (id: number) => void;
  };
}


// AUTH
export interface IAuthUser {
  name?: string;
  email: string;
  password: string;
}

export interface IAuthForm {
  isAuthenticated?: boolean;
  error: IError;
  actions: {
    clearErrors: () => void;
  }
}

export interface ILoginPage extends IAuthForm {
  actions: {
    clearErrors: () => void;
    login: (user: IAuthUser) => void;
  }
}


export interface IError {
  id: E_ERROR;
  // msg: IMsg;
  msg: string | any;
}

export interface IAuthReduxProps {
  auth: {
    isAuthenticated: boolean
  },
  error: IError
}


export interface IExistingArticle {
  id: number;
  title: string;
  body: string;
}

export interface IArticleReduxProps extends IAuthReduxProps {
  articles: {
    articles: IExistingArticle[];
  };
}


export interface IArticle {
  id?: number;
  title: string;
  body: string;
}




// ERRORS
export interface IMsg {
  msg: string | any;
}

export interface IAuthFunction {
  name?: string;
  email: string;
  password: string;
}

export interface ILogoutProps {
  actions: {
    logout: () => void;
  }
}

// NAVBAR
export interface INavbar {
  auth?: {
    isAuthenticated: boolean;
    user: IUser;
  };
}

/*
_____________________
City
_____________________
*/
export interface City {
  id: number;
  name: string;
  status: number;
}

export interface CityList {
  cities: {
    loading: boolean;
    error: any | null;
    cities: City[];
  };
  meta?: any;
  actions: {
    getAllCities: () => void;
    getCity: (id: number) => void;
    addCity: (city: City) => void;
    updateCity: (city: City) => void;
    getCityList: (options?: any) => void;

    // updateJobOrder: (jobOrder: JobOrder) => (dispatch: any, state: any) => void;
    // updateJobOrder: (jobOrder: JobOrder) => Promise<any | any[]>; //Promise<any | any[]>; // (dispatch: any, state: any) => void; //

    // getRatePlanItems: (id: number) => (dispatch: any, state: any) => void;
    // getRatePlanItems: (id: number) => Promise<any | any[]>;

    deleteCity: (id: number) => void;
  };
}

export interface CityReduxProps extends IAuthReduxProps {
  cities: {
    loading: boolean;
    error: any | null;
    cities: City[];
    meta?: any;
  };
}


/*
_____________________
Filters
_____________________
*/
export interface Filter {
  id: number;
  s_garage_filter: number;
  s_address: string | null;
}

export interface FilterList {
  filters: {
    loading: boolean;
    error: any | null;
    data: Filter[];
  };
  meta?: any;
  actions: {
    getAllFilters: () => void;
    getFilter: (id: number) => void;
    deleteFilter: (id: number) => void;
    getFilterList: (options?: any) => void;
  };
}

export interface FilterReduxProps extends IAuthReduxProps {
  filters: {
    loading: boolean;
    error: any | null;
    filterItems: Filter[];
    meta?: any;
  };
}




/*
_____________________
DeliveredBy
_____________________
*/
export interface DeliveredBy {
  id: number;
  name: string;
  email: string;
  status: number;
}

export interface DeliveredByList {
  deliveredBy: {
    deliveredBy: DeliveredBy[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getDeliveredByList: (options?: any) => void;
    getAllDeliveredBy: () => void;
    getDeliveredBy: (id: number) => void;
    addDeliveredBy: (deliveredBy: DeliveredBy) => void;
    updateDeliveredBy: (deliveredBy: DeliveredBy) => void;
    deleteDeliveredBy: (id: number) => void;
  };
}

export interface DeliveredByReduxProps extends IAuthReduxProps {
  deliveredBy: {
    deliveredBy: DeliveredBy[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
GarageFinish
_____________________
*/
export interface GarageFinish {
  id: number;
  name: string;
  status: number;
}

export interface GarageFinishList {
  garageFinishes: {
    garageFinishes: GarageFinish[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getGarageFinishList: (options?: any) => void;
    getAllGarageFinishes: () => void;
    getGarageFinish: (id: number) => void;
    addGarageFinish: (garageFinish: GarageFinish) => void;
    updateGarageFinish: (garageFinish: GarageFinish) => void;
    deleteGarageFinish: (id: number) => void;
  };
}

export interface GarageFinishReduxProps extends IAuthReduxProps {
  garageFinishes: {
    garageFinishes: GarageFinish[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
GarageStall
_____________________
*/
export interface GarageStall {
  id: number;
  name: string;
  status: number;
}

export interface GarageStallList {
  garageStalls: {
    garageStalls: GarageStall[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getGarageStallList: (options?: any) => void;
    getAllGarageStalls: () => void;
    getGarageStall: (id: number) => void;
    addGarageStall: (garageStall: GarageStall) => void;
    updateGarageStall: (garageStall: GarageStall) => void;
    deleteGarageStall: (id: number) => void;
  };
}

export interface GarageStallReduxProps extends IAuthReduxProps {
  garageStalls: {
    garageStalls: GarageStall[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
HouseType
_____________________
*/
export interface HouseType {
  id: number;
  name: string;
  status: number;
}

export interface HouseTypeList {
  houseTypes: {
    houseTypes: HouseType[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getHouseTypeList: (options?: any) => void;
    getAllHouseTypes: () => void;
    getHouseType: (id: number) => void;
    addHouseType: (houseType: HouseType) => void;
    updateHouseType: (houseType: HouseType) => void;
    deleteHouseType: (id: number) => void;
  };
}

export interface HouseTypeReduxProps extends IAuthReduxProps {
  houseTypes: {
    houseTypes: HouseType[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
Option
_____________________
*/
export interface Option {
  id: number;
  name: string;
  status?: number;
}

export interface OptionList {
  options: {
    options: Option[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getOptionList: (options?: any) => void;
    getAllOptions: () => void;
    getOption: (id: number) => void;
    addOption: (option: Option) => void;
    updateOption: (option: Option) => void;
    deleteOption: (id: number) => void;
  };
}

export interface OptionReduxProps extends IAuthReduxProps {
  options: {
    options: Option[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
UserType
_____________________
*/
export interface UserType {
  id: number;
  name: string;
}

export interface UserTypeList {
  userTypes: {
    userTypes: UserType[];
  };
  actions: {
    getAllUserTypes: () => void;
    getUserType: (id: number) => void;
    addUserType: (userType: UserType) => void;
    updateUserType: (userType: UserType) => void;
    deleteUserType: (id: number) => void;
  };
}

export interface UserTypeReduxProps extends IAuthReduxProps {
  userTypes: {
    userTypes: UserType[];
  };
}

/*
_____________________
Vault
_____________________
*/
export interface Vault {
  id: number;
  name: string;
  status: number;
}

export interface VaultList {
  vaults: {
    vaults: Vault[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getVaultList: (options?: any) => void;
    getAllVaults: () => void;
    getVault: (id: number) => void;
    addVault: (vault: Vault) => void;
    updateVault: (vault: Vault) => void;
    deleteVault: (id: number) => void;
  };
}

export interface VaultReduxProps extends IAuthReduxProps {
  vaults: {
    vaults: Vault[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
Rate Plan
_____________________
*/
export interface RatePlanItem {
  id: number;
  billingItemName: string;
  rate: any;
}

export interface RatePlan {
  id: number;
  ratePlanName: string;
  ratePlanPrice: number;
  jobId: number;
  job: number;
}

export interface RatePlanList {
  ratePlans: {
    ratePlans: RatePlan[];
    ratePlanItems?: any;
    loading: boolean;
    error: any | null;
  };
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[] | any;
  };
  billingItems: {
    billingItems: BillingItem[];
  };
  meta?: any;
  actions: {
    getRatePlanList: (options?: any) => void;
    getAllRatePlans: () => void;
    getRatePlan: (id: number) => void;
    addRatePlan: (ratePlan: RatePlan) => void;
    updateRatePlan: (ratePlan: RatePlan) => void;
    deleteRatePlan: (id: number) => void;
    getAllRatePlanJobs: () => void;
    // getRatePlanItems: (id: number) => (dispatch: any, state: any) => void;
    // getRatePlanItems: (id: number) => Promise<any | any[]>;

    getRatePlanItems: (id: number) => any;
    updateRatePlanItems: (id: number, ratePlanIems: any) => any;
    getAllBillingItems: () => void;

    // remove: (item: Item) => () => void;
    // remove: (item: Item) => void;
  };
}

export interface RatePlanReduxProps extends IAuthReduxProps {
  ratePlans: {
    ratePlans: RatePlan[];
    ratePlanItems?: any;
    meta?: any;
    loading: boolean;
    error: any | null;
  };
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[] | any;
  };
  billingItems: {
    billingItems: BillingItem[];
  };
}

/*
_____________________
Rate Plan Job
_____________________
*/
export interface RatePlanJob {
  id: number;
  job: string;
  orderNumber: number;
  status?: number;
}

export interface RatePlanJobList {
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[];
  };
  actions: {
    getAllRatePlanJobs: () => void;
    getRatePlanJob: (id: number) => void;
    addRatePlanJob: (ratePlanJob: RatePlanJob) => void;
    updateRatePlanJob: (ratePlanJob: RatePlanJob) => void;
    deleteRatePlanJob: (id: number) => void;
  };
}

export interface RatePlanJobReduxProps extends IAuthReduxProps {
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[];
  };
}

/*
_____________________
Rate Plan
_____________________
*/
export interface RatePlans {
  id: number;
  rate_plan_name: string;
  job_id: number;
  job: string;
}

export interface RatePlanLists {
  rateplan: {
    rateplan: RatePlans[];
  };
  actions: {
    getAllRatePlan: () => void;
    getRatePlan: (id: number) => void;
    addRatePlan: (rateplan: RatePlans) => void;
    updateRatePlan: (rateplan: RatePlans) => void;
    deleteRatePlan: (id: number) => void;
  };
}

export interface InvoiceallList {
  invoiceall: {
    // invoices: Invoices[];
  };
  actions: {
    // getAllRatePlan: () => void;
    // getRatePlan: (id: number) => void;
    // addRatePlan: (rateplan: RatePlan) => void;
    // updateRatePlan: (rateplan: RatePlan) => void;
    // deleteRatePlan: (id: number) => void;
  };
}
export interface RatePlanReduxPropss extends IAuthReduxProps {
  rateplan: {
    rateplan: RatePlans[];
  };
}

/*
_____________________
Invoices
_____________________
*/
export interface InvoiceLevel {
  id: number;
  userId: number;
  userTypeId: number;
  ratePlanLevelId: number;
  levelId: number;
}

export interface InvoicesList {
  invoices: {
    // invoices: Invoices[];
  };
  users: {
    users: ExistingUser[];
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
  ratePlans: {
    ratePlans: RatePlan[];
    ratePlanItems?: any;
  };
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[] | any;
    ratePlanJobLevels?: any;
  };
  actions: {
    getAllRatePlanJobs: () => void;
    getUsers: () => void;
    getAllUserTypes: () => void;
    getAllRatePlans: () => void;
    getRatePlanJobLevels: (id: number) => any;
    updateRatePlanJobLevels: (id: number, ratePanJobLevels: any) => any;
    // getAllRatePlan: () => void;
    // getRatePlan: (id: number) => void;
    // addRatePlan: (rateplan: RatePlan) => void;
    // updateRatePlan: (rateplan: RatePlan) => void;
    // deleteRatePlan: (id: number) => void;
  };
}

export interface InvoicesReduxProps extends IAuthReduxProps {
  invoices: {
    // invoices: Invoices[];
  };
  users: {
    users: ExistingUser[];
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
  ratePlans: {
    ratePlans: RatePlan[];
    ratePlanItems?: any;
  };
  ratePlanJobs: {
    ratePlanJobs: RatePlanJob[] | any;
    ratePlanJobLevels?: any;
  };
}

/*
_____________________
Builder
_____________________
*/
export interface Builder {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  contactName: string;
  email: string;
  phone: string;
  status: number;
}

export interface BuilderList {
  builders: {
    builders: Builder[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getBuilderList: (options?: any) => void;
    getAllBuilders: () => void;
    getBuilder: (id: number) => void;
    addBuilder: (builder: Builder) => void;
    updateBuilder: (builder: Builder) => void;
    deleteBuilder: (id: number) => void;
  };
}

export interface BuilderReduxProps extends IAuthReduxProps {
  builders: {
    builders: Builder[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
Vault
_____________________
*/
export interface CeilingFinish {
  id: number;
  name: string;
  definition: string;
  type: string;
  fogged: number;
  status: number;
}

export interface CeilingFinishList {
  ceilingFinishes: {
    ceilingFinishes: CeilingFinish[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getCeilingFinishList: (options?: any) => void;
    getAllCeilingFinishes: () => void;
    getCeilingFinish: (id: number) => void;
    addCeilingFinish: (ceilingFinish: CeilingFinish) => void;
    updateCeilingFinish: (ceilingFinish: CeilingFinish) => void;
    deleteCeilingFinish: (id: number) => void;
  };
}

export interface CeilingFinishReduxProps extends IAuthReduxProps {
  ceilingFinishes: {
    ceilingFinishes: CeilingFinish[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
PurchaseOrder
_____________________
*/
export interface InvoiceBillingItem {
  id: number;
  billingItemId: number;
  billingItemName: string;
  quantity: number;
  originalPrice: number;
  unitPrice: number;
  totalPrice: number;
  rowOrder: number;
  columnOrder: number;
};

export interface PurchaseOrder {
  id?: number;
  discount?: number;
  discountPercentage?: number;
  total?: number;
  jobOrderId: number;
  userId: number;
  userTypeId: number;
  userType: string;
  items?: InvoiceBillingItem[] | any;
  isSystemOrder?: number;
  reCreate?: number;
};

// export interface PurchaseOrderInput {
//   jobOrderId: number;
//   userId: number;
//   userTypeId: number;
//   userType: string;
// };

/*
_____________________
JobOrder
_____________________
*/
export interface JioBillingItem {
  billingItemId: number;
  itemValue: string;
  columnOrder: number;
  remainingValue?: string | any;
  totalValue?: string | any
}
export interface JioHouseLevel {
  houseLevelTypeId: number;
  rowOrder: number
  billingItems?: JioBillingItem[] | any;
  houseTypeName?: string | any;
  // jobOrderId: number;
}

export interface HouseLevelStock {
  houseLevelTypeId: number;
  rowOrder: number
  billingItems?: JioBillingItem[] | any
}
export interface JioHouseLevelStock {
  jobOrderId: number;
  houseLevelStock?: HouseLevelStock[] | any;

  // jobOrderId: number;
}

export interface JobOrderDirection {
  id: number;
  jobOrderId: number;
  userType: string;
  directions: string;
}

export interface billingItemsGroupsCount {
  groupId: number | any;
  total: number;
}

export interface JobOrder {
  id: number;
  builderId: number;
  builderName: string;
  supervisorId: number;
  name: string;
  houseTypeId: number;
  address: string;
  cityId: number;
  data?: any;



  deliveryDate: string;
  deliveryTime: string;
  deliveredById: number;
  deliveredByName: string;

  startDate: string;
  closeDate: string;
  paintStartDate: string;
  garageStallId: number;
  garageStallName: string;
  cityName: string;
  walkthroughDate: string;
  ceilingFinishId: number;
  ceilingFinishName: string;
  ceilingFinishFogged: any;
  garageFinishId: number;
  garageFinishName: string,
  electric: number;
  heat: number;
  basement: number;
  up58: number;
  upHs: number;
  up12: number;
  up5412: number;
  up5458: number;
  main58: number;
  mainHs: number;
  main12: number;
  main5412: number;
  main5458: number;
  l358: number;
  l3Hs: number;
  l312: number;
  l35412: number;
  l35458: number;
  g58: number;
  gHs: number;
  g12: number;
  g54: number;
  g5412: number;
  g5458: number;
  house4x12o: number;
  garage4x12o: number;


  house54?: number,
  houseOver8?: number,
  house4x12?: number,
  garage54?: number,
  garage96?: number,
  garage4x12?: number,



  houseLevels?: JioHouseLevel[] | any;

  options?: Option[] | any;
  grade?: string;
  additionalInfo: string;

  hangerStartDate?: string;
  hangerEndDate?: string;
  scrapDate?: string;
  taperStartDate?: string;
  taperEndDate?: string;
  sprayerDate?: string;
  sanderDate?: string;
  paintDate?: string;
  fogDate?: string;

  total12?: number;
  total54?: number;
  totalOvers?: number;
  totalGar12?: number;
  totalGar54?: number;
  totalGarOvers?: number;

  totalGarage12?: number;
  totalGarage54?: number;
  totalGarageOvers?: number;
  totalGarageGar12?: number;
  totalGarageGar54?: number;
  totalGarageGarOvers?: number;

  users?: JobOrderUser[] | any;
  directions?: JobOrderDirection[] | any;
  isVerified?: number;
  jobStatus: string;
  gigStatus: string;
  pageTrack?: number;
  status: number;

  billingItemsGroupsCount?: billingItemsGroupsCount[] | any;
  isPaid?: number;
  editUnverified?: number;
}

export interface JobOrderUser {
  id: number;
  name: string;
  firstname: string;
  jobOrderId: number;
  jobOrderUserType: string;
}

export interface PurchaseOrderEmail {
  id: number;
  userId: number;
  emailTo: string;
  emailMessage: string;
}

export interface JobOrderEmail {
  id: number;
  emailTo: string;
  emailMessage: string;
}

export interface JobOrderPageList {
  jobOrders: {
    jobOrders: JobOrder[] | any;
    activeJobOrder: JobOrder;
    activeHouseLevelStock?: JioHouseLevelStock | any;
  };
  builders: {
    builders: Builder[];
  };
  users: {
    users: ExistingUser[];
  };
  houseTypes: {
    houseTypes: HouseType[];
  };
  cities: {
    cities: City[];
  };
  deliveredBy: {
    deliveredBy: DeliveredBy[];
  };
  garageStalls: {
    garageStalls: GarageStall[];
  };
  ceilingFinishes: {
    ceilingFinishes: CeilingFinish[];
  };
  garageFinishes: {
    garageFinishes: GarageFinish[];
  };
  vaults: {
    vaults: Vault[];
  };
  options: {
    options: Option[];
  };
  billingItems: {
    billingItems: NBillingItem[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
  meta?: any;
  actions: {
    getAllJobOrders: (options?: any) => void;
    getJobOrder: (id: number) => void;
    addJobOrder: (jobOrder: JobOrder) => void;
    updateJobOrder: (jobOrder: JobOrder) => void;
    // updateJobOrder: (jobOrder: JobOrder) => (dispatch: any, state: any) => void;
    // updateJobOrder: (jobOrder: JobOrder) => Promise<any | any[]>; //Promise<any | any[]>; // (dispatch: any, state: any) => void; //

    // getRatePlanItems: (id: number) => (dispatch: any, state: any) => void;
    // getRatePlanItems: (id: number) => Promise<any | any[]>;


    deleteJobOrder: (id: number) => void;
    sendJobOrderEmail?: (jobOrderEmail: JobOrderEmail) => void;
    getHouseLevelStock?: (id: number) => void;
    updateHouseLevelStock?: (id: number, houseLevelStock: JioHouseLevelStock) => void;

    getAllBuilders: () => void;
    getAllHouseTypes: (options?: any) => void;
    getUsers: () => void;
    getUsersByType?: (options?: any) => void;
    getAllCities: (options?: any) => void;
    getAllDeliveredBy: () => void;
    getAllGarageStalls: () => void;
    getAllCeilingFinishes: () => void;
    getAllGarageFinishes: () => void;
    getAllVaults: () => void;
    getAllOptions: () => void;
    getAllBillingItems: () => void;
    getAllHouseLevelTypes: () => void;
    updateJobOrderUser?: (JobOrderUser: JobOrderUser) => void;
    getAllGarageJobOrders?: () => void;
    addPurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    addHouseType?: (houseType: HouseType) => void;
    // updatePurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
  };
}

export interface JobOrderList {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
    activeHouseLevelStock?: JioHouseLevelStock | any;
  };
  builders: {
    builders: Builder[];
  };
  users: {
    users: ExistingUser[];
  };
  houseTypes: {
    houseTypes: HouseType[];
  };
  cities: {
    cities: City[];
  };
  deliveredBy: {
    deliveredBy: DeliveredBy[];
  };
  garageStalls: {
    garageStalls: GarageStall[];
  };
  ceilingFinishes: {
    ceilingFinishes: CeilingFinish[];
  };
  garageFinishes: {
    garageFinishes: GarageFinish[];
  };
  vaults: {
    vaults: Vault[];
  };
  options: {
    options: Option[];
  };
  billingItems: {
    billingItems: NBillingItem[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
  meta?: any;
  actions: {
    getAllJobOrders: (options?: any) => void;
    getJobOrder: (id: number) => void;
    addJobOrder: (jobOrder: JobOrder) => void;
    updateJobOrder: (jobOrder: JobOrder) => void;
    // updateJobOrder: (jobOrder: JobOrder) => Promise<any | any[]>;
    deleteJobOrder: (id: number) => void;
    sendJobOrderEmail?: (jobOrderEmail: JobOrderEmail) => void;
    getHouseLevelStock?: (id: number) => void;
    updateHouseLevelStock?: (id: number, houseLevelStock: JioHouseLevelStock) => void;

    getAllBuilders: () => void;
    getAllHouseTypes: () => void;
    getUsers: () => void;
    getAllCities: (options?: any) => void;
    getAllDeliveredBy: () => void;
    getAllGarageStalls: () => void;
    getAllCeilingFinishes: () => void;
    getAllGarageFinishes: () => void;
    getAllVaults: () => void;
    getAllOptions: () => void;
    getAllBillingItems: () => void;
    getAllHouseLevelTypes: () => void;
    updateJobOrderUser?: (JobOrderUser: JobOrderUser) => void;
    getAllGarageJobOrders?: () => void;
    addPurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    // updatePurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
  };
}

export interface JobOrderReduxProps extends IAuthReduxProps {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
  };
  builders: {
    builders: Builder[];
  };
  users: {
    users: ExistingUser[];
  };
  houseTypes: {
    houseTypes: HouseType[];
  };
  cities: {
    cities: City[];
  };
  deliveredBy: {
    deliveredBy: DeliveredBy[];
  };
  garageStalls: {
    garageStalls: GarageStall[];
  };
  ceilingFinishes: {
    ceilingFinishes: CeilingFinish[];
  };
  garageFinishes: {
    garageFinishes: GarageFinish[];
  };
  vaults: {
    vaults: Vault[];
  };
  options: {
    options: Option[];
  };
  billingItems: {
    billingItems: NBillingItem[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
}

/*
_____________________
BillingItemGroup
_____________________
*/
export interface BillingItemGroup {
  id: number;
  groupName: string;
  status: number;
}

/*
_____________________
BillingItem
_____________________
*/
export interface BillingItem {
  id: number;
  billingItemName: string;
  unit: string;
  measurementUnit: string;
  height: number;
  heightUnits: number;
  heightUnitName: string;
  length: number;
  lengthUnits: number;
  lengthUnitName: string;
  width: string;
  sqft: number;
  itemPrice: number;
  fogType: number;
  groupId: number;
  groupName: string;
  status: number;
  sprayer: number,
  taper: number,
  hanger: number,
  sander: number,
}

export interface NBillingItem {
  id: number;
  billingItemName: string;
  groupName?: string;
  status: number;
}

export interface Unit {
  id: number;
  unitName: string;
}
export interface BillingItemList {
  billingItems: {
    billingItems: BillingItem[];
    units: Unit[];
    billingItemGroups: BillingItemGroup[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getBillingItemList: (options?: any) => void;
    getAllBillingItems: (options?: any) => void;
    getBillingItem: (id: number) => void;
    addBillingItem: (billingItem: BillingItem) => void;
    updateBillingItem: (billingItem: BillingItem) => void;
    deleteBillingItem: (id: number) => void;
    getAllUnits: () => void;
    getAllBillingItemGroups: () => void;
  };
}

export interface BillingItemReduxProps extends IAuthReduxProps {
  billingItems: {
    billingItems: BillingItem[];
    units: Unit[];
    billingItemGroups: BillingItemGroup[];
    meta?: any;
    loading: boolean;
    error: any | null;
  };
}

/*
_____________________
HouseLevelType
_____________________
*/
export interface HouseLevelType {
  id: number;
  houseTypeName: string;
  status: number;
  isFireBarrier?: number;
  garage?: number;
}

// export interface HouseLevelType {
//   id: number;
//   house_type_name: string;
//   status: number;
// }

export interface NHouseLevelType {
  id: number;
  houseTypeName: string;
  status: number;
}

export interface HouseLevelTypeList {
  houseLevelTypes: {
    houseLevelTypes: HouseLevelType[];
    loading: boolean;
    error: any | null;
  };
  meta?: any;
  actions: {
    getHouseLevelTypeList: (options?: any) => void;
    getAllHouseLevelTypes: () => void;
    getHouseLevelType: (id: number) => void;
    addHouseLevelType: (houseLevelType: HouseLevelType) => void;
    updateHouseLevelType: (houseLevelType: HouseLevelType) => void;
    deleteHouseLevelType: (id: number) => void;
  };
}

export interface HouseLevelTypeReduxProps extends IAuthReduxProps {
  houseLevelTypes: {
    houseLevelTypes: HouseLevelType[];
    loading: boolean;
    error: any | null;
    meta?: any;
  };
}

/*
_____________________
Schedules
_____________________
*/
export interface JobOrderFilter {
  address: string,
  hangerId: number,
  taperId: number,
  sprayerId: number,
  sanderId: number,
  sGarageFilter: number,
  dateFrom: string,
  dateTo: string,
  garage: boolean,
  jobStatus: string,
  gigStatus: string,
  submitted: false,
  pageTrack: number,
}

export interface ScheduleList {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
    activeHouseLevelStock?: JioHouseLevelStock | any;
  };
  searchData: {
    searchData: any[];
  },
  users: {
    users: ExistingUser[];
  };
  billingItems: {
    billingItems: NBillingItem[];
    billingItemGroups: BillingItemGroup[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
  meta?: any;
  data?: any;
  actions: {
    getAllJobOrders?: (options?: any) => void;
    searchJobOrders: (jobOrderFilter: JobOrderFilter, options?: any) => void;
    getJobOrder: (id: number) => void;
    addJobOrder: (jobOrder: JobOrder) => void;
    saveFilterSearch: (jobOrder: any) => void;
    getFilterSearch: () => void;
    updateJobOrder: (jobOrder: JobOrder) => void;
    deleteJobOrder: (id: number) => void;
    sendJobOrderEmail?: (jobOrderEmail: JobOrderEmail) => void;
    getHouseLevelStock?: (id: number) => void;
    updateHouseLevelStock?: (id: number, houseLevelStock: JioHouseLevelStock) => void;

    getUsers: () => void;
    getAllBillingItems: () => void;
    getAllHouseLevelTypes: () => void;
    updateJobOrderUser?: (JobOrderUser: JobOrderUser) => void;
    getAllGarageJobOrders?: (options?: any) => void;
    addPurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    // updatePurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    getAllBillingItemGroups?: () => void;
  };
}

export interface ScheduleReduxProps extends IAuthReduxProps {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
    meta?: any;
    data?: any;
  };
  searchData: {
    searchData: any[];
  },
  users: {
    users: ExistingUser[];
  };
  billingItems: {
    billingItems: NBillingItem[];
    billingItemGroups: BillingItemGroup[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
}

/*
_____________________
Reports
_____________________
*/
export interface ReportFilter {
  reportType: string;
  userId: any;
  userTypeList: string[];
  userType: string;
  dateFrom: string;
  dateTo: string;
  jobStatus: string;
  gigStatus: string;
  submitted: boolean,
};
export interface ReportList {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
    activeHouseLevelStock?: JioHouseLevelStock | any;
  };
  users: {
    users: ExistingUser[];
  };
  billingItems: {
    billingItems: NBillingItem[];
    billingItemGroups: BillingItemGroup[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
  formData?: JobOrder;
  columnFilters?: any;
  filterFormData?: any;
  filterFormDataSubmitted?: any;
  meta?: any;
  actions: {
    getReportJobOrders: (jobOrderFilterReport: ReportFilter) => void;
    getAllJobOrders?: (options?: any) => void;
    searchJobOrders: (jobOrderFilter: JobOrderFilter, options?: any) => void;
    getJobOrder: (id: number) => void;
    addJobOrder: (jobOrder: JobOrder) => void;
    updateJobOrder: (jobOrder: JobOrder) => void;
    deleteJobOrder: (id: number) => void;
    sendJobOrderEmail?: (jobOrderEmail: JobOrderEmail) => void;
    getHouseLevelStock?: (id: number) => void;
    updateHouseLevelStock?: (id: number, houseLevelStock: JioHouseLevelStock) => void;

    getUsers: () => void;
    getAllBillingItems: () => void;
    getAllHouseLevelTypes: () => void;
    updateJobOrderUser?: (JobOrderUser: JobOrderUser) => void;
    getAllGarageJobOrders?: () => void;
    addPurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    // updatePurchaseOrder?: (purchaseOrder: PurchaseOrder) => void;
    getAllBillingItemGroups?: () => void;
    getAllUserTypes: () => void;
  };
  getPrintButton?: () => void;
}

export interface ReportReduxProps extends IAuthReduxProps {
  jobOrders: {
    jobOrders: JobOrder[];
    activeJobOrder: JobOrder;
  };
  users: {
    users: ExistingUser[];
  };
  billingItems: {
    billingItems: NBillingItem[];
    billingItemGroups: BillingItemGroup[];
  };
  houseLevelTypes: {
    houseLevelTypes: NHouseLevelType[];
  };
  purchaseOrders?: {
    purchaseOrders: PurchaseOrder[];
    activePurchaseOrder: PurchaseOrder;
  };
  userTypes: {
    userTypes: UserType[] | any;
  };
}
