import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import Select from "react-select";
import _, { toNumber } from "lodash";
import DatePicker from "react-datepicker";
import momentBusinessDays from "moment-business-days";
import { ToastContainer } from "react-toastify";
// import 'react-datepicker/dist/react-datepicker.css';
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-bootstrap-date-picker';
import moment from "moment";
import Modal from "react-modal";
import ReactModal from "react-modal-resizable-draggable";
import { useReactToPrint } from "react-to-print";
import { confirmAlert } from "react-confirm-alert";
import * as JobOrderActions from "../../redux/actions/jobOrderActions";
import * as BuilderActions from "../../redux/actions/builderActions";
import * as HouseTypeActions from "../../redux/actions/houseTypeActions";
import * as UserActions from "../../redux/actions/userActions";
import * as CityActions from "../../redux/actions/cityActions";
import * as DeliveredByActions from "../../redux/actions/deliveredByActions";
import * as GarageStallActions from "../../redux/actions/garageStallActions";
import * as CeilingFinishActions from "../../redux/actions/ceilingFinishActions";
import * as GarageFinishActions from "../../redux/actions/garageFinishActions";
import * as VaultActions from "../../redux/actions/vaultActions";
import * as OptionActions from "../../redux/actions/optionActions";
import * as BillingItemActions from "../../redux/actions/billingItemActions";
import * as HouseLevelTypeActions from "../../redux/actions/houseLevelTypeActions";
import Print from "../common/Print";
import History from "../common/History";
import { appConfig } from "../../types/AppConfig";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactToPrint from "react-to-print";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

import {
  JobOrderReduxProps,
  JobOrderPageList,
  JobOrder,
  Target,
} from "../../types/interfaces";
import { Alert } from "react-bootstrap";

Modal.setAppElement("#root");
const emailModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "500px",
    overlfow: "scroll",
    width: "50%",
  },
};

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "500px",
    overlfow: "scroll",
    width: "50%",
  },
};

// const [hidedive ] = useState(true)
const JobOrderPage = ({
  jobOrders,
  builders,
  users,
  houseTypes,
  cities,
  deliveredBy,
  garageStalls,
  ceilingFinishes,
  garageFinishes,
  vaults,
  options,
  billingItems,
  houseLevelTypes,
  actions,
}: JobOrderPageList & { match: any }) => {
  const { id } = useParams();
  const history = useHistory;
  const billingItemsLimit = 6;

  const defaultHouseTypeOptions: any = {
    sortBy: "dateDESC",
  };

  useEffect(() => {
    // if(id !== undefined) {
    const jid: number = id !== undefined ? +id : 0;
    //   actions.getJobOrder(jid);
    //   console.log('yes working');
    // }

    actions.getAllJobOrders();
    actions.getAllBuilders();
    if (actions.getUsersByType !== undefined) {
      actions.getUsersByType({ userType: "Supervisor" });
    }
    actions.getAllHouseTypes({ ...defaultHouseTypeOptions });
    actions.getAllCities({ all: true });
    actions.getAllDeliveredBy();
    actions.getAllGarageStalls();
    actions.getAllCeilingFinishes();
    actions.getAllGarageFinishes();
    actions.getAllVaults();
    actions.getAllOptions();
    actions.getAllBillingItems();
    actions.getAllHouseLevelTypes();
    actions.getJobOrder(jid);
  }, [
    actions.getAllJobOrders,
    actions.getAllBuilders,
    actions.getUsersByType,
    actions.getAllHouseTypes,
    actions.getAllCities,
    actions.getAllDeliveredBy,
    actions.getAllGarageStalls,
    actions.getAllCeilingFinishes,
    actions.getAllGarageFinishes,
    actions.getAllVaults,
    actions.getAllOptions,
    actions.getAllBillingItems,
    actions.getAllHouseLevelTypes,
    // actions.getJobOrder,
  ]);

  const [hidden, sethidden] = useState(true);
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "30px",
      // height: '30px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any, state: any) => ({
      ...provided,
      // height: '30px',
      padding: "0 6px",
    }),

    input: (provided: any, state: any) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state: any) => ({
      display: "none",
    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      height: "30px",
    }),
  };

  const setFormDataState = () => {
    if (jobOrders.activeJobOrder.id !== undefined) {
      // setFormData({...formData.houseLevels, ...defaultState.houseLevels})
      if (!jobOrders.activeJobOrder.houseLevels.length) {
        // console.log("setting value");
        // console.log(defaultState.houseLevels);
        // setFormData({ ...formData.activeJobOrder, houseLevels: [...defaultState.houseLevels] });
        // setFormData({ ...formData, houseLevels: [...defaultState.houseLevels] });
        const x = { ...jobOrders.activeJobOrder };
        x.houseLevels = defaultState.houseLevels;
        setFormData({ ...defaultState, ...x });
      } else {
        const x = { ...jobOrders.activeJobOrder };
        const y = x.houseLevels.map((item: any) => {
          item.billingItems.map((billItem: any) => {
            billItem.billingItemId = parseInt(billItem.billingItemId, 10);
            billItem.columnOrder = parseInt(billItem.columnOrder, 10);
          });

          console.log("llllll");
          console.log(item);
          item.houseLevelTypeId = parseInt(item.houseLevelTypeId, 10);
          return item;
        });
        setFormData({ ...defaultState, ...jobOrders.activeJobOrder });
      }

      const uniqueBillingItemsList: any = [];
      jobOrders.activeJobOrder.houseLevels.map((item: any) =>
        item.billingItems.map((singleItem: any) => {
          if (
            !uniqueBillingItemsList.find(
              (uItem: any) =>
                uItem.value == singleItem.billingItemId &&
                uItem.index == singleItem.columnOrder
            )
          ) {
            const uniqueItem = {
              index: singleItem.columnOrder,
              value: parseInt(singleItem.billingItemId, 10),
            };
            uniqueBillingItemsList.push(uniqueItem);
          }
        })
      );
      setUniqueBillingItems([...uniqueBillingItemsList]);

      const uniqueHouseLevelTypesList: any = [];
      jobOrders.activeJobOrder.houseLevels.map((item: any) => {
        if (
          !uniqueHouseLevelTypesList.find(
            (hItem: any) =>
              hItem.value == item.houseLevelTypeId &&
              hItem.index == item.rowOrder
          )
        ) {
          const uniqueItem = {
            index: item.rowOrder,
            value: parseInt(item.houseLevelTypeId, 10),
            garage: item.garage,
            isFireBarrier: item.isFireBarrier,
          };
          uniqueHouseLevelTypesList.push(uniqueItem);
        }
        return item;

        // return item.billingItems.map((singleItem: any) => {
        //   if (!uniqueBillingItemsList.find((uItem: any) => uItem.value == singleItem.billingItemId && uItem.index == singleItem.columnOrder)) {
        //     const uniqueItem = {
        //       index: singleItem.columnOrder,
        //       value: parseInt(singleItem.billingItemId, 10)
        //     };
        //     // console.log('so now what');
        //     // console.log(uniqueItem);
        //     uniqueHouseLevelTypesList.push(uniqueItem);
        //   }
        // })
      });
      setUniqueHouseLevelTypes([...uniqueHouseLevelTypesList]);
    }
  };
  const jid: number = id !== undefined ? +id : 0;

  useEffect(() => {
    setFormDataState();
  }, [jobOrders.activeJobOrder]);

  // console.log(id);
  const defaultState: JobOrder = {
    id: 0,
    builderId: 0,
    builderName: "",
    supervisorId: 0,
    name: "",
    houseTypeId: 0,
    address: "",
    cityId: 0,

    deliveryDate: "",
    deliveryTime: "",
    deliveredById: 0,
    deliveredByName: "",

    startDate: "",
    closeDate: "",
    paintStartDate: "",
    garageStallId: 0,
    garageStallName: "",
    walkthroughDate: "",
    ceilingFinishId: 0,
    ceilingFinishName: "",
    ceilingFinishFogged: "",
    garageFinishId: 0,
    garageFinishName: "",
    cityName: "",
    electric: 0,
    heat: 0,
    basement: 0,

    up58: 0,
    upHs: 0,
    up12: 0,
    up5412: 0,
    up5458: 0,
    main58: 0,
    mainHs: 0,
    main12: 0,
    main5412: 0,
    main5458: 0,
    l358: 0,
    l3Hs: 0,
    l312: 0,
    l35412: 0,
    l35458: 0,
    g58: 0,
    gHs: 0,
    g12: 0,
    g54: 0,
    g5412: 0,
    g5458: 0,
    house4x12o: 0,
    garage4x12o: 0,

    house54: 0,
    houseOver8: 0,
    house4x12: 0,
    garage54: 0,
    garage96: 0,
    garage4x12: 0,

    houseLevels: [
      {
        houseLevelTypeId: 0,
        garage: 0,
        isFireBarrier: 0,
        rowOrder: 1,
        billingItems: [
          {
            billingItemId: 0,
            itemValue: "0",
            columnOrder: 1,
          },
          {
            billingItemId: appConfig.billingItems.highSheets.id,
            itemValue: "0",
            columnOrder: 9,
          },
          {
            billingItemId: appConfig.billingItems.garageHighSheets.id,
            itemValue: "0",
            columnOrder: 10,
          },
        ],
      },
    ],

    options: [],
    additionalInfo: "",

    hangerStartDate: "",
    hangerEndDate: "",
    scrapDate: "",
    taperStartDate: "",
    taperEndDate: "",
    sprayerDate: "",
    sanderDate: "",
    paintDate: "",
    fogDate: "",

    total12: 0,
    total54: 0,
    totalOvers: 0,
    totalGar12: 0,
    totalGar54: 0,
    totalGarOvers: 0,

    totalGarage12: 0,
    totalGarage54: 0,
    totalGarageOvers: 0,
    totalGarageGar12: 0,
    totalGarageGar54: 0,
    totalGarageGarOvers: 0,

    directions: "",
    jobStatus: "",
    gigStatus: "",

    status: 1,
    isVerified: 0,
    isPaid: 0,
    editUnverified: 0,
  };

  const mailDefaultState = {
    id: 0,
    emailTo: "",
    emailMessage: "",
  };

  const defaultArray: [] | any = [];
  const [formData, setFormData] = useState(defaultState);
  const [uniqueBillingItems, setUniqueBillingItems] = useState(defaultArray);
  const [uniqueHouseLevelTypes, setUniqueHouseLevelTypes] = useState(
    defaultArray
  );
  const [submitted, setSubmitted] = useState(false);

  const clearData = () => {
    setSubmitted(false);
    // setTimeout(() => {
    //   History.push('/schedules');
    // }, 1500);
    History.push("/");
    setFormData({ ...defaultState });
  };

  const handleDelete = (e: any, id: number) => {
    e.preventDefault();
    actions.deleteJobOrder(id);
    setTimeout(() => {
      History.push("/");
    }, 1500);
  };

  const handleEdit = (e: any, jobOrder: JobOrder) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...jobOrder });
  };

  const onFormChange = (e: Target) => {
    const { value } = e.target;
    if (e.target.name === "houseTypeId" && value === "add_new") {
      handleHouseTypeModalEdit(true);
      return;
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onCeilingFinishChange = (e: Target) => {
    // const current = ceilingFinishesData.filter((singleCeilingFinish: any) => singleCeilingFinish.id === e.target.value);

    const current = ceilingFinishesData.filter(
      (item: any) => item.id == e.target.value
    );

    let fogged = false;
    if (current.length) {
      fogged = !!current[0].fogged;
    }

    let fieldObj: any = {};
    if (formData.deliveryDate) {
      // fieldObj = getCalculatedDate(formData.deliveryDate, fogged, '');
      fieldObj = getCalculatedDate(formData.hangerStartDate, fogged, "");
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        ceilingFinishFogged: fogged,
        ...fieldObj,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        ceilingFinishFogged: fogged,
      });
    }
  };

  const onFormNumberChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onCheckboxChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const getCalculatedDate = (
    date: any,
    fogged = false,
    dateFieldName: string
  ) => {
    const fieldObj: any = {};
    // const isFogged = formData.ceilingFinishFogged || fogged;
    const isFogged = fogged;
    console.log(isFogged);
    // Start date
    let startDate = formData.startDate || "0000-00-00";
    console.log("startDate => ", formData.startDate);

    if (
      dateFieldName === "hangerStartDate" ||
      dateFieldName === "deliveryDate"
    ) {
      startDate = moment(date).format("YYYY-MM-DD");
      if (dateFieldName === "deliveryDate") {
        startDate = momentBusinessDays(date)
          .businessAdd(1, "days")
          .format("YYYY-MM-DD");
      }

      fieldObj.startDate = startDate;
    }

    const sanderDateInterval = isFogged ? 7 : 6;
    // Sander date
    let sanderDate = momentBusinessDays(startDate)
      .businessAdd(sanderDateInterval, "days")
      .format("YYYY-MM-DD");
    fieldObj.sanderDate = moment(sanderDate).format("YYYY-MM-DD");

    // Override if sanderDate changed
    if (dateFieldName === "sanderDate") {
      sanderDate = moment(date).format("YYYY-MM-DD");
      fieldObj.sanderDate = sanderDate;
    }

    // Paint date
    let paintStartDate = momentBusinessDays(sanderDate)
      .businessAdd(1, "days")
      .format("YYYY-MM-DD");
    fieldObj.paintStartDate = moment(paintStartDate).format("YYYY-MM-DD");

    // Override if paintStartDate changed
    if (dateFieldName === "paintStartDate") {
      paintStartDate = moment(date).format("YYYY-MM-DD");
      fieldObj.paintStartDate = paintStartDate;
    }

    // Hanger start date
    let hangerStartDate = momentBusinessDays(startDate)
      .businessAdd(0, "days")
      .format("YYYY-MM-DD");
    fieldObj.hangerStartDate = moment(hangerStartDate).format("YYYY-MM-DD");

    // Override if hangerStartDate changed
    if (dateFieldName === "hangerStartDate") {
      hangerStartDate = moment(date).format("YYYY-MM-DD");
      fieldObj.hangerStartDate = hangerStartDate;
    }

    // Hanger end date
    const hangerEndDate = momentBusinessDays(hangerStartDate)
      .businessAdd(1, "days")
      .format("YYYY-MM-DD");
    fieldObj.hangerEndDate = moment(hangerEndDate).format("YYYY-MM-DD");

    // Taper start date
    const taperStartDate = momentBusinessDays(hangerEndDate)
      .businessAdd(1, "days")
      .format("YYYY-MM-DD");
    fieldObj.taperStartDate = moment(taperStartDate).format("YYYY-MM-DD");

    // Taper end date
    const taperEndDate = momentBusinessDays(taperStartDate)
      .businessAdd(2, "days")
      .format("YYYY-MM-DD");
    fieldObj.taperEndDate = moment(taperEndDate).format("YYYY-MM-DD");

    // Sprayer start date
    let sprayerDate = momentBusinessDays(taperEndDate)
      .businessAdd(1, "days")
      .format("YYYY-MM-DD");
    fieldObj.sprayerDate = moment(sprayerDate).format("YYYY-MM-DD");

    // let sDateGneric = sanderDate;
    if (isFogged) {
      // Fog date
      const fogDate = momentBusinessDays(taperEndDate)
        .businessAdd(1, "days")
        .format("YYYY-MM-DD");
      fieldObj.fogDate = moment(fogDate).format("YYYY-MM-DD");

      // Update sprayerDate in case of fog
      sprayerDate = momentBusinessDays(fogDate)
        .businessAdd(1, "days")
        .format("YYYY-MM-DD");
      fieldObj.sprayerDate = moment(sprayerDate).format("YYYY-MM-DD");

      // Update sanderDate in case of fog
      // let sanderDate = momentBusinessDays(sprayerDate).businessAdd(1, 'days').format('YYYY-MM-DD');
      // fieldObj.sanderDate = moment(sanderDate).format('YYYY-MM-DD');

      // sDateGneric = sanderDateUp;
    }

    // Scrap date
    const scrapDate = momentBusinessDays(hangerEndDate)
      .businessAdd(1, "days")
      .format("YYYY-MM-DD");
    fieldObj.scrapDate = moment(scrapDate).format("YYYY-MM-DD");

    // Close date
    let closeDate = momentBusinessDays(startDate)
      .businessAdd(6, "days")
      .format("YYYY-MM-DD");
    fieldObj.closeDate = moment(closeDate).format("YYYY-MM-DD");
    closeDate = fieldObj.closeDate;
    fieldObj.closeDate = closeDate;

    // Paint date
    let paintDate = moment(sanderDate).add("days", 1).format("YYYY-MM-DD");
    if (moment(paintDate).day() == 6) {
      console.log("day 6 => ", moment(paintDate).day());
      fieldObj.paintDate = moment(paintDate)
        .add("days", 2)
        .format("YYYY-MM-DD");
    } else if (moment(paintDate).day() == 0) {
      fieldObj.paintDate = moment(paintDate)
        .add("days", 1)
        .format("YYYY-MM-DD");
    } else {
      fieldObj.paintDate = moment(paintDate).format("YYYY-MM-DD");
    }
    paintDate = fieldObj.paintDate;
    fieldObj.paintDate = paintDate;

    return fieldObj;

    console.log(fieldObj);
  };

  const onDateChange = (date: any, name: string) => {
    if (!date) return;
    let fieldObj: any = {};
    if (
      name === "deliveryDate" ||
      name === "hangerStartDate" ||
      name === "sanderDate" ||
      name === "paintStartDate"
    ) {
      fieldObj = getCalculatedDate(date, false, name);
      console.log(fieldObj);
    }

    fieldObj[name] = moment(date).format("YYYY-MM-DD");

    if (name === "paintStartDate") {
      const paintStDate = moment(date).format("YYYY-MM-DD");

      if (fieldObj.sanderDate >= paintStDate) {
        toast.error("Delinquent Job", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return false;
      }
    }
    setFormData({
      ...formData,
      ...fieldObj,
    });
  };

  const onMultiSelectChange = (value: any, name: string) => {
    if (value == null) {
      setFormData({ ...formData, [name]: [] });
    } else {
      setFormData({ ...formData, [name]: [...value] });
    }
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
  };

  const onItemSelectChange = (e: any, itemType: string, index: number) => {
    setJiochanged(true);
    const value: any = parseInt(e.target.value, 10);
    console.log("Testing 1");
    console.log(typeof value);
    if (itemType == "billing_item") {
      const items = [...uniqueBillingItems];
      if (!value) {
        const b = [...formData.houseLevels];
        const y = b.map((item) => {
          const z = item.billingItems.filter(
            (billItem: any) => billItem.columnOrder !== index
          );
          item.billingItems = z;
          return item;
        });

        setFormData({ ...formData, houseLevels: [...y] });

        const itemsList = items.filter((item) => item.index !== index);
        setUniqueBillingItems([...itemsList]);
      } else {
        const b = [...formData.houseLevels];

        console.log("-----");
        console.log(b);
        console.log("-----");
        const y = b.filter((item) =>
          item.billingItems.some(
            (billItem: any) => billItem.columnOrder == index
          )
        );

        console.log("Filter billing items");
        console.log(y);
        if (y.length > 0) {
          const x = b.map((item) => {
            item.billingItems.map((billItem: any) => {
              if (billItem.columnOrder == index) {
                billItem.billingItemId = parseInt(value, 0);
              }
            });
            return item;
          });
        } else {
          const x = b.map((item) => {
            const z = {
              billingItemId: parseInt(e.target.value, 0),
              columnOrder: index,
              itemValue: "0",
            };
            item.billingItems.push(z);
            return item;
          });
        }

        setFormData({ ...formData, houseLevels: [...b] });

        const itemsList = items.filter((item) => item.index !== index);
        const item = {
          index,
          value,
        };
        setUniqueBillingItems([...itemsList, item]);
      }
    } else {
      const items = [...uniqueHouseLevelTypes];
      if (!value) {
        const b = [...formData.houseLevels];

        const x = b.map((item) => {
          if (item.rowOrder == index) {
            item.houseLevelTypeId = 0;
          }
          return item;
        });
        setFormData({ ...formData, houseLevels: [...b] });

        const itemsList = items.filter((item) => item.index !== index);
        console.log(itemsList);
        setUniqueHouseLevelTypes([...itemsList]);
      } else {
        const b = [...formData.houseLevels];
        const y = b.filter((item) => item.rowOrder == index);

        if (y.length > 0) {
          const x = b.map((item) => {
            if (item.rowOrder == index) {
              console.log("-----here");
              console.log(item);
              item.houseLevelTypeId = parseInt(value, 0);
              item.garage = getHouseLevelTypeItemValue(value, "garage");
              item.isFireBarrier = getHouseLevelTypeItemValue(
                value,
                "isFireBarrier"
              );
            }
            return item;
          });
        } else {
        }
        setFormData({ ...formData, houseLevels: [...b] });

        const itemsList = items.filter((item) => item.index !== index);
        const item: any = {
          index,
          value,
          garage: getHouseLevelTypeItemValue(value, "garage"),
          isFireBarrier: getHouseLevelTypeItemValue(value, "isFireBarrier"),
        };
        // console.log(item);
        setUniqueHouseLevelTypes([...itemsList, item]);
      }
    }
  };

  const getHouseLevelTypeItemValue = (levelId: any, keyName: string) => {
    const houseLevelType: { [key: string]: any } = houseLevelTypesData.filter(
      (item: any) => item.id == levelId
    );
    let value = 0;
    // console.log(houseLevelType);
    if (houseLevelType.length) {
      value = houseLevelType[0][keyName];
    }
    return value;
  };

  const onBillingItemInputChange = (
    e: any,
    rowIndex: number,
    index: number
  ) => {
    setJiochanged(true);
    let { value } = e.target;
    value = Math.round(value);
    const b = [...formData.houseLevels];

    //console.log('rrrr', value)
    // console.log('Row, column and value', rowIndex, index, value);
    // console.log(b);

    const y = b.filter(
      (item) =>
        item.rowOrder == rowIndex &&
        item.billingItems.some((billItem: any) => billItem.columnOrder == index)
    );
    // console.log('After filter');
    // console.log(y);

    let currentBillingItemId = 0;
    if (y.length > 0) {
      // console.log('length found');
      // console.log(y);
      const v = uniqueBillingItems.filter((vv: any) => vv.index == index);

      const x = b.map((item, i) => {
        if (i == rowIndex - 1) {
          item.billingItems.map((billItem: any) => {
            if (billItem.columnOrder == index) {
              billItem.itemValue = value;
              if (!billItem.billingItemId) {
                //console.log('not billing item');
                billItem.billingItemId = v.length
                  ? parseInt(v[0].value, 10)
                  : 0;
              }
              currentBillingItemId = billItem.billingItemId;
              // console.log('yes updating existing value', billItem);
            }
          });
        }
        return item;
      });
    } else {
      // console.log('length not found');
      // console.log(y);
      const v = uniqueBillingItems.filter((vv: any) => vv.index == index);
      // console.log(v);
      const x = b.map((item, i) => {
        const z = {
          billingItemId: v.length ? parseInt(v[0].value, 10) : 0,
          columnOrder: index,
          itemValue: Math.round(value),
        };
        if (i == rowIndex - 1) {
          // console.log('yes pushing new value', z);
          item.billingItems.push(z);
          currentBillingItemId = z.billingItemId;
        }
        return item;
      });
    }

    // const b = [...formData.houseLevels];
    // const totalVals = {
    //   total12: 0,
    //   total54: 0,
    //   totalOvers: 0,
    //   totalGar12: 0,
    //   totalGar54: 0,
    //   totalGarOvers: 0,
    //   totalGarage12: 0,
    //   totalGarage54: 0,
    //   totalGarageOvers: 0,
    //   totalGarageGar12: 0,
    //   totalGarageGar54: 0,
    //   totalGarageGarOvers: 0
    // };

    // b.map((item, i) => {
    //   console.log('item inside-------', item);
    //     item.billingItems
    //       .map((billItem: any) => {
    //         // console.log('inside-------------', billItem);
    //         const itemGroupName = getBillingItemsGroupName(billItem.billingItemId);
    //         console.log(itemGroupName);
    //         if (!item.houseLevelTypeId) {
    //           return;
    //         }
    //         if (item.garage) {
    //           if (itemGroupName === '12\'') {
    //             totalVals.totalGarage12 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === '54\"') {
    //             totalVals.totalGarage54 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Overs') {
    //             totalVals.totalGarageOvers += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar 12\'') {
    //             totalVals.totalGarageGar12 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar 54\"') {
    //             totalVals.totalGarageGar54 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar Overs') {
    //             totalVals.totalGarageGarOvers += parseInt(billItem.itemValue, 10);
    //           }
    //         } else {
    //           if (itemGroupName === '12\'') {
    //             totalVals.total12 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === '54\"') {
    //             totalVals.total54 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Overs') {
    //             totalVals.totalOvers += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar 12\'') {
    //             totalVals.totalGar12 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar 54\"') {
    //             totalVals.totalGar54 += parseInt(billItem.itemValue, 10);
    //           } else if (itemGroupName === 'Gar Overs') {
    //             totalVals.totalGarOvers += parseInt(billItem.itemValue, 10);
    //           }
    //         }
    //       });
    //   return item;
    // });
    // console.log(totalVals);

    // const billingItemGroupName = getBillingItemsGroupName(currentBillingItemId);

    // console.log(currentBillingItemId);
    // const itemGroupName = getBillingItemsGroupName(currentBillingItemId);
    // console.log(itemGroupName);
    // let totalGroupsVal = {};
    // if (itemGroupName === '12\'') {
    //   totalGroupsVal.total12 += parseInt(billItem.itemValue, 10);
    // } else if (itemGroupName === '54\"') {
    //   totalGroupsVal.total54 += parseInt(billItem.itemValue, 10);
    // } else if (itemGroupName === 'Overs') {
    //   totalGroupsVal.totalOvers += parseInt(billItem.itemValue, 10);
    // } else if (itemGroupName === 'Gar 12\'') {
    //   totalGroupsVal.totalGar12 += parseInt(billItem.itemValue, 10);
    // } else if (itemGroupName === 'Gar 54\"') {
    //   totalGroupsVal.totalGar54 += parseInt(billItem.itemValue, 10);
    // } else if (itemGroupName === 'Gar Overs') {
    //   totalGroupsVal.totalGarOvers += parseInt(billItem.itemValue, 10);
    // }

    setFormData({
      ...formData,
      houseLevels: [...b],
      // ...totalVals
      // total12: totalVals.total12,
      // total54: totalVals.total54,
      // totalOvers: totalVals.totalOvers,
      // totalGar12: totalVals.totalGar12,
      // totalGar54: totalVals.totalGar54,
      // totalGarOvers: totalVals.totalGarOvers,
    });
  };

  const updateTotalCounts = () => {
    const b = [...formData.houseLevels];
    const totalVals = {
      total12: 0,
      total54: 0,
      // totalOvers: 0,
      // totalGar12: 0,
      // totalGar54: 0,
      // totalGarOvers: 0,
      totalGarage12: 0,
      totalGarage54: 0,
      // totalGarageOvers: 0,
      // totalGarageGar12: 0,
      // totalGarageGar54: 0,
      // totalGarageGarOvers: 0
    };

    b.map((item, i) => {
      console.log("item inside-------", item);
      item.billingItems.map((billItem: any) => {
        const itemGroupName = getBillingItemsGroupName(billItem.billingItemId);
        console.log(itemGroupName);
        if (!item.houseLevelTypeId) {
          return;
        }
        if (item.garage) {
          if (itemGroupName === "Gar 12'") {
            totalVals.totalGarage12 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === 'Gar 54"') {
            totalVals.totalGarage54 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === "Gar Overs") {
            // totalVals.totalGarageOvers += parseInt(billItem.itemValue, 10);
          }
          // else if (itemGroupName === 'Gar 12\'') {
          //   totalVals.totalGarageGar12 += parseInt(billItem.itemValue, 10);
          // } else if (itemGroupName === 'Gar 54\"') {
          //   totalVals.totalGarageGar54 += parseInt(billItem.itemValue, 10);
          // } else if (itemGroupName === 'Gar Overs') {
          //   totalVals.totalGarageGarOvers += parseInt(billItem.itemValue, 10);
          // }
        } else {
          if (itemGroupName === "12'") {
            totalVals.total12 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === '54"') {
            totalVals.total54 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === "Overs") {
            // totalVals.totalOvers += parseInt(billItem.itemValue, 10);
          }
          // else if (itemGroupName === 'Gar 12\'') {
          //   totalVals.totalGar12 += parseInt(billItem.itemValue, 10);
          // } else if (itemGroupName === 'Gar 54\"') {
          //   totalVals.totalGar54 += parseInt(billItem.itemValue, 10);
          // } else if (itemGroupName === 'Gar Overs') {
          //   totalVals.totalGarOvers += parseInt(billItem.itemValue, 10);
          // }
        }
      });
      return item;
    });

    setFormData({
      ...formData,
      ...totalVals,
    });
  };

  useEffect(() => {
    updateTotalCounts();
  }, [formData.houseLevels]);

  const getBillingItemsGroupName = (billingItemId: any) => {
    const billingItems = billingItemsData.filter(
      (item) => billingItemId === item.id
    );
    return billingItems.length ? billingItems[0].groupName : "";
  };
  const addNewRow = (e: any) => {
    e.preventDefault();
    setJiochanged(true);
    const billItems: any = [];
    const item1 = {
      billingItemId: 0,
      itemValue: "0",
      columnOrder: 1,
    };
    const item2 = {
      billingItemId: appConfig.billingItems.highSheets.id,
      itemValue: "0",
      columnOrder: 9,
    };
    const item3 = {
      billingItemId: appConfig.billingItems.garageHighSheets.id,
      itemValue: "0",
      columnOrder: 10,
    };
    billItems.push(item1, item2, item3);

    const item = {
      houseLevelTypeId: 0, // formData.houseLevels.length + 1,
      garage: 0,
      isFireBarrier: 0,
      rowOrder: formData.houseLevels.length + 1,
      billingItems: billItems,
    };

    const houseLevels = [...formData.houseLevels];
    if (houseLevels.length <= 10) {
      setFormData({ ...formData, houseLevels: [...houseLevels, item] });
    }
  };

  const deleteRow = (e: any) => {
    e.preventDefault();
    setJiochanged(true);
    const houseLevels = [...formData.houseLevels];
    houseLevels.splice(-1, 1);
    setFormData({ ...formData, houseLevels: [...houseLevels] });
  };

  const getBillingItemsOptions = () => {
    const billingItems = billingItemsData.filter(
      (item) => !uniqueBillingItems.includes(item.id)
    );
    return billingItems;
  };

  const renderBillingItemsSelectList = () => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(
        <div
          className={i > 1 ? "col-md-1" : "col-md-offset-2 col-md-2"}
          style={{
            width: "10.333333%",
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        >
          {renderBillingItemsSelect(i)}
        </div>
      );
    }
    return items;
  };

  const getSelectedBillingItem = (index: number) => {
    const items = formData.houseLevels
      .filter((item: any) =>
        item.billingItems.some(
          (singleItem: any) => singleItem.columnOrder == index
        )
      )
      .map((item: any) => {
        const singleItem = { ...item };
        return singleItem.billingItems.filter(
          (subItem: any) => subItem.columnOrder == index
        );
      })
      .flat();

    return items.length > 0 ? items[0].billingItemId : 0;
  };

  const renderBillingItemsSelect = (index: number) => {
    const billingItems = billingItemsData.filter(
      (item) =>
        !uniqueBillingItems.some(
          (singleItem: any) =>
            singleItem.value == item.id && singleItem.index !== index
        )
    );

    return (
      <select
        className="form-control input-sm"
        name="ddLabel1"
        // defaultValue="0"
        value={getSelectedBillingItem(index)}
        onChange={(e) => onItemSelectChange(e, "billing_item", index)}
        onKeyDown={(e) => handleEnter(e)}
      >
        <option value="0">Select</option>
        {billingItems.length > 0 ? (
          billingItems.map((item: any, index: any) => {
            if (
              item.id !== appConfig.billingItems.highSheets.id &&
              item.id !== appConfig.billingItems.garageHighSheets.id
            ) {
              return (
                <option key={index} value={item.id}>
                  {item.billingItemName}
                </option>
              );
            }
          })
        ) : (
          <></>
        )}
      </select>
    );
  };

  var formdata = formData;

  const getSelectedHouseLevelType = (index: number) => {
    console.log(uniqueHouseLevelTypes);
    const item = uniqueHouseLevelTypes.filter(
      (item: any) => item.index == index
    );
    return item && item.length ? item[0].value.toString() : "0";
  };
  const renderHouseLevelTypesSelect = (index: number, value: any) => {
    const houseLevelTypes = houseLevelTypesData.filter(
      (item) =>
        !uniqueHouseLevelTypes.some(
          (singleItem: any) =>
            singleItem.value == item.id && singleItem.index !== index
        )
    );

    return (
      <select
        className="form-control input-sm"
        name="ddLabel1"
        value={value || getSelectedHouseLevelType(index)}
        onChange={(e) => onItemSelectChange(e, "house_level_type", index)}
        onKeyDown={(e) => handleEnter(e)}
      >
        <option value="0">Select</option>
        {houseLevelTypes.length > 0 ? (
          houseLevelTypes.map((item: any, index: any) => (
            <option key={index} value={item.id}>
              {item.houseTypeName}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
    );
  };

  const renderBillingItemsInputList = (rowIndex: number, billingItems: any) => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemInput(rowIndex, i, billingItems)}</>);
    }
    return items;
  };

  const renderBillingItemInput = (
    rowIndex: number,
    index: number,
    billingItems: any
  ) => {
    const value = billingItems.filter((item: any) =>
      billingItemsData.some((singleItem: any) => item.columnOrder == index)
    );
    const itemValue = value.length ? value[0].itemValue : "0";
    return (
      <div
        key={index}
        className="col-md-2"
        style={{ width: "10.333333%", paddingLeft: "5px", paddingRight: "5px" }}
      >
        <input
          type="text"
          name="billingItemId"
          value={itemValue || 0}
          onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
          className="form-control input-sm"
          onKeyDown={(e) => handleEnter(e)}
        />
      </div>
    );
  };

  const handleOkay = () => {
    alert("so what");
  };

  const handlePrintSubmit = () => {
    // e.preventDefault();

    setSubmitted(true);
    if (formData.name) {
      if (!formData.id) {
        actions.addJobOrder(formData);
      } else {
        actions.updateJobOrder(formData);
      }
    }
  };

  const [jobOrderError, setJobOrderError] = useState("");
  const [mailFormData, setMailFormData] = useState(mailDefaultState);
  const [isMailModalOpen, setIsMailModalOpen] = React.useState(false);
  const [mailSubmitted, setMailSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setJobOrderError("");

    setSubmitted(true);
    if (
      formData.builderId &&
      formData.supervisorId &&
      formData.houseTypeId &&
      formData.address &&
      formData.cityId &&
      // eslint-disable-next-line max-len
      formData.deliveryDate &&
      formData.deliveredById &&
      formData.startDate &&
      formData.paintStartDate &&
      formData.garageStallId &&
      formData.ceilingFinishId &&
      formData.garageFinishId
    ) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (jiochanged && formData.isVerified) {
        confirmAlert({
          title: "Confirm to submit",
          // eslint-disable-next-line max-len
          message:
            "It looks like you have made changes to Sheet Rock Stock, this will result in making your job as Un-Verified. Do you still want to proceed?",
          buttons: [
            {
              label: "Yes",
              onClick: () => {
                if (!formData.id) {
                  actions.addJobOrder(formData);
                  console.log("this if form data", formData);
                  toast.success("Job order added successfully!");
                  History.push("/");
                } else {
                  formData.isVerified = 0;
                  formData.editUnverified = 1;
                  actions.updateJobOrder(formData);
                  toast.success("Job order updated successfully");
                  History.push("/");
                }
              },
            },
            {
              label: "No",
              onClick: () => {},
            },
          ],
        });
      } else if (!formData.id) {
        actions.addJobOrder(formData);
        setTimeout(() => {
          // History.push("/job-orders/123");
          // alert("done done ");
          // print();
          toast.success("Job order saved successfully now you can print ");
        }, 1500);
      } else {
        await actions.updateJobOrder(formData);
        toast.success("Job order updated successfully");
        // History.push("/");
      }
    } else {
      setJobOrderError(
        "Please fill all the required highlighted fields to SAVE data"
      );
      window.scrollTo(0, 0);
    }
  };

  const closeModal = () => {
    setIsMailModalOpen(false);
    setMailSubmitted(false);
  };
  const handleMailModal = () => {
    setIsMailModalOpen(true);
    setMailFormData({ ...mailFormData, id: jid });
  };
  const onMailFormChange = (e: Target) => {
    setMailFormData({ ...mailFormData, [e.target.name]: e.target.value });
  };
  const handleMailSubmit = (e: any) => {
    e.preventDefault();
    setTimeout(() => {
      closeModal();
    }, 1000);

    if (
      mailFormData.emailTo &&
      mailFormData.emailMessage &&
      actions.sendJobOrderEmail !== undefined
    ) {
      actions.sendJobOrderEmail(mailFormData);
    }
  };

  const { jobOrders: jobOrdersData } = jobOrders;
  const { builders: buildersData } = builders;
  const { users: usersData } = users;
  const { houseTypes: houseTypesData } = houseTypes;
  const { cities: citiesData } = cities;
  const { deliveredBy: deliveredByData } = deliveredBy;
  const { garageStalls: garageStallsData } = garageStalls;
  const { ceilingFinishes: ceilingFinishesData } = ceilingFinishes;
  const { garageFinishes: garageFinishesData } = garageFinishes;
  const { vaults: vaultsData } = vaults;
  const { options: optionsData } = options;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;

  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // interface Props extends Omit<ReactDatePickerProps, 'onChange'> {
  //   onClick?(): void;
  //   onChange?(): void;
  // }

  // const ExampleCustomInput = ({ value, onClick }) => (
  //   <button className="example-custom-input" onClick={onClick}>see
  //     {value}
  //   </button>
  // );

  const renderHouseLevelTypesHeading = (index: number, value: any) => {
    // const houseLevelName = formData.houseLevels.filter((item: any) => item.id == value);

    const houseLevelName = houseLevelTypesData.filter(
      (item: any) => item.id == value
    );
    const houseName =
      houseLevelName.length > 0 ? houseLevelName[0].houseTypeName : "N.A";

    return (
      <th
        style={{
          textAlign: "left",
          paddingRight: "5px",
          color: "blue",
          border: "none",
        }}
      >
        {houseName}
      </th>
    );
  };

  const getBuilderName = (builderId: any, buildersData: any) => {
    const builder = buildersData.filter(
      (singleBuilder: any) => singleBuilder.id == builderId
    );
    const builderName = builder.length ? builder[0].name : "";
    return <>{builderName}</>;
  };

  const getHouseTypeName = (houseTypeId: any, houseTypesData: any) => {
    const houseType = houseTypesData.filter(
      (singleHouseType: any) => singleHouseType.id == houseTypeId
    );
    const houseTypeName = houseType.length ? houseType[0].name : "";
    return <>{houseTypeName}</>;
  };

  // const getDeliveredByName = (deliveredById: any, deliveredByData: any) => {
  //   const deliveredBy = deliveredByData.filter(
  //     (singleDeliveredBy: any) => singleDeliveredBy.id === deliveredById
  //   );
  //   const deliveredByName = deliveredBy.length ? deliveredBy[0].name : "";
  //   return <>{deliveredByName}</>;
  // };

  const getDeliveredByName = (deliveredById: any, deliveredByData: any) => {
    const deliveredBy = deliveredByData.filter(
      (singleDeliveredBy: any) => singleDeliveredBy.id === deliveredById
    );
    const deliveredByName = deliveredBy.length ? deliveredBy[0].name : "";
    console.log("fsdafsdfsdfsdafsfsdfsadf", deliveredBy);
    return <>{deliveredByName}</>;
  };

  const getSupervisorName = (supervisorId: any, usersData: any) => {
    const supervisor = usersData.filter(
      (singleUser: any) => singleUser.id == supervisorId
    );
    const supervisorName = supervisor.length ? supervisor[0].name : "";
    return <>{supervisorName}</>;
  };

  const getCityName = (cityId: any, citiesData: any) => {
    const city = citiesData.filter(
      (singleCity: any) => singleCity.id == cityId
    );
    const cityName = city.length ? city[0].name : "";
    return <>{cityName}</>;
  };

  const getGarageStallName = (garageStallId: any, garageStallsData: any) => {
    const garageStall = garageStallsData.filter(
      (singleGarageStall: any) => singleGarageStall.id == garageStallId
    );
    const garageStallName = garageStall.length ? garageStall[0].name : "";
    return <>{garageStallName}</>;
  };

  const getCeilingFinishName = (
    ceilingFinishId: any,
    ceilingFinishesData: any
  ) => {
    const ceilingFinish = ceilingFinishesData.filter(
      (singleCeilingFinish: any) => singleCeilingFinish.id == ceilingFinishId
    );
    const ceilingFinishName = ceilingFinish.length ? ceilingFinish[0].name : "";
    return <>{ceilingFinishName}</>;
  };

  const getGarageFinishName = (
    garageFinishId: any,
    garageFinishesData: any
  ) => {
    const garageFinish = garageFinishesData.filter(
      (singleGarageFinish: any) => singleGarageFinish.id == garageFinishId
    );
    const garageFinishName = garageFinish.length ? garageFinish[0].name : "";
    return <>{garageFinishName}</>;
  };

  const DateCustomInput = ({
    onChange,
    placeholder,
    value,
    onClick,
    customClassName,
  }: any) => (
    <>
      <div className="input-group">
        <input
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          className={customClassName}
          onKeyDown={(e) => handleEnter(e)}
        />
        <span className="input-group-addon btn-cs-hvr" onClick={onClick}>
          <i className="far fa-calendar-alt" />
        </span>
      </div>
      {/* <button className="example-custom-input" onClick={onClick}>see

      </button> */}
    </>
  );

  const handleEnter = (event: any) => {
    if (event.keyCode === 13) {
      const { form } = event.target;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  const sortIt = (sortBy: any) => (a: any, b: any) => {
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  };

  const defaultHouseTypeModalState: any = {
    id: 0,
    name: "",
    status: 1,
  };
  const [isHouseTypeModalOpen, setIsHouseTypeModalOpen] = React.useState(false);
  const [houseTypeModalFormData, setHouseTypeModalFormData] = useState(
    defaultHouseTypeModalState
  );
  const [housLevelModalSubmitted, setHousLevelModalSubmitted] = useState(false);
  const closeHouseLevelModal = () => {
    setHouseTypeModalFormData({
      ...houseTypeModalFormData,
      ...defaultHouseTypeModalState,
    });
    setIsHouseTypeModalOpen(false);
  };

  const onHouseTypeFormChange = (e: Target) => {
    setHouseTypeModalFormData({
      ...houseTypeModalFormData,
      [e.target.name]: e.target.value,
    });
  };

  const onHouseTypeStatusChange = (e: any) => {
    setHouseTypeModalFormData({
      ...houseTypeModalFormData,
      [e.target.name]: parseInt(e.target.value, 10),
    });
  };

  const handleHouseTypeModalEdit = (e: any) => {
    setIsHouseTypeModalOpen(true);
  };

  const handleHouseLevelModalSubmit = async (e: any) => {
    e.preventDefault();
    setHousLevelModalSubmitted(true);
    if (houseTypeModalFormData.name && actions.addHouseType !== undefined) {
      await actions.addHouseType(houseTypeModalFormData);
      closeHouseLevelModal();
    }
  };
  const [jiochanged, setJiochanged] = useState(false);
  const [IsVerified, setIsVerified] = useState(!!formData.isVerified);
  const onFormCheckboxChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const [selectedText, setSelectedText] = useState("");

  // Event handler for dropdown change
  const handleDropdownChange = (event: any) => {
    // Get the selected option
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Get the text of the selected option
    const text = selectedOption.innerText || selectedOption.textContent;

    // Update the state with the selected text
    setSelectedText(text);
  };
  return (
    <>
      <ToastContainer />
      <div className="clear pad-40" />
      <div className="container job-order-container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Schoenberger Drywall Inc.
                    <br />
                    <small>Job Initiation Order</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                  <button
                    type="button"
                    className="btn btn-info btn-sm mr-5"
                    onClick={() => clearData()}
                  >
                    <i className="fas fa-arrow-circle-left mr-5" />
                    Return to Schedules
                  </button>

                  {jid && jid > 0 ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm mr-5"
                        onClick={(e) => handleDelete(e, jid)}
                      >
                        Delete
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm mr-5"
                        onClick={() => handleMailModal()}
                      >
                        Email JIO
                      </button>

                      <Print
                        id={id}
                        label="Save & Print JIO"
                        componentName="jio"
                        className="mr-5 btn-sm"
                        handlePrintSubmit={handlePrintSubmit}
                      />
                      <Print
                        id={id}
                        label="Print Drywall Final"
                        className="mr-5 btn-sm"
                        componentName="drywall"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <>
                    <button
                      form="jio-form"
                      type="submit"
                      className="btn btn-primary btn-sm"
                      style={{ marginRight: "5px" }}
                    >
                      <i className="fas fa-save mr-5" />
                      Save
                    </button>

                    <ReactToPrint
                      trigger={() => (
                        <button
                          className="btn btn-primary btn-sm ml-2 mr-2"
                          onClick={handlePrint}
                        >
                          Print
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
                  </>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form
                id="jio-form"
                className="form-horizontal"
                onSubmit={(e) => handleSubmit(e)}
              >
                {jobOrderError !== "" ? (
                  <div className="alert alert-danger" role="alert">
                    {jobOrderError}
                  </div>
                ) : (
                  <></>
                )}
                {!!(
                  formData.builderId &&
                  !formData.isVerified &&
                  formData.id
                ) && (
                  <div className="row">
                    <div className="form-group col-md-6 mb-10" />
                    <div className="form-group col-md-6 mb-10">
                      <label className="col-md-3 control-label">
                        <span className="text_red" />
                      </label>
                      <label className="checkbox-inline verifyCls">
                        <input
                          type="checkbox"
                          name="notVerified"
                          value="1"
                          disabled
                          checked
                        />
                        Un-Verified
                      </label>
                    </div>
                  </div>
                )}
                {!!(formData.builderId && formData.isVerified) && (
                  <div className="row">
                    <div className="form-group col-md-6 mb-10" />
                    <div className="form-group col-md-6 mb-10">
                      <label className="col-md-3 control-label">
                        <span className="text_red" />
                      </label>
                      <label className="checkbox-inline verifyCls">
                        <input
                          type="checkbox"
                          name="isVerified"
                          value="1"
                          disabled
                          checked
                        />
                        Verified
                      </label>
                    </div>
                    <div className="form-group col-md-6 mb-10" />
                    <div className="form-group col-md-6 mb-10 markPaidOCls">
                      <label className="col-md-3 control-label">
                        <span className="text_red" />
                      </label>
                      {/* <label className="checkbox-inline verifyCls">
                      <input type="checkbox" name="isPaid" value="1" checked={!!formData.isPaid} onChange={(e) => onFormCheckboxChange(e)} />
                      Mark as Paid
                    </label> */}
                    </div>
                  </div>
                )}
                <h4 className="text_blue">Builder Details</h4>
                <div className="clear pad-5" />
                <div className="row">
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Builder :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.builderId ? "ap-required" : ""
                        }`}
                        name="builderId"
                        value={formData.builderId || 0}
                        onChange={(e) => onFormChange(e)}
                        autoFocus
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Builder</option>

                        {buildersData.length > 0 ? (
                          buildersData
                            .sort(sortIt("name"))
                            .map((singleBuilder) => (
                              <option
                                key={singleBuilder.id}
                                value={singleBuilder.id}
                              >
                                {singleBuilder.name}
                              </option>
                            ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Supervisor :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.supervisorId
                            ? "ap-required"
                            : ""
                        }`}
                        name="supervisorId"
                        value={formData.supervisorId || 0}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Supervisor</option>

                        {usersData.length > 0 ? (
                          usersData.sort(sortIt("name")).map((singleUser) => (
                            <option key={singleUser.id} value={singleUser.id}>
                              {singleUser.name}
                            </option>
                          ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">H/O Name :</label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.name ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      House Type :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.houseTypeId
                            ? "ap-required"
                            : ""
                        }`}
                        name="houseTypeId"
                        value={formData.houseTypeId || 0}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select House Type</option>
                        <option value="add_new">Add New</option>
                        {/* {houseTypesData.length > 0 ? houseTypesData.sort(sortIt('name')).map((singleHouseType) => (
                          <option key={singleHouseType.id} value={singleHouseType.id}>{singleHouseType.name}</option>
                        )) : (<></>)} */}
                        {houseTypesData.length > 0 ? (
                          houseTypesData.map((singleHouseType) => (
                            <option
                              key={singleHouseType.id}
                              value={singleHouseType.id}
                            >
                              {singleHouseType.name}
                            </option>
                          ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Address :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.address ? "ap-required" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      City :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.cityId ? "ap-required" : ""
                        }`}
                        name="cityId"
                        value={formData.cityId || 0}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select City</option>

                        {citiesData.length > 0 ? (
                          citiesData.sort(sortIt("name")).map((singleCity) => (
                            <option key={singleCity.id} value={singleCity.id}>
                              {singleCity.name}
                            </option>
                          ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Name :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div> */}
                  {/* <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Status :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status.toString() || '1'}
                        onChange={(e) => onStatusChange(e)}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>In-Active</option>
                      </select>
                    </div>
                  </div> */}
                </div>

                <hr />
                <h4 className="text_blue">Sheet Rock Stock</h4>
                <div className="row">
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Delivery Date :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-5">
                      <DatePicker
                        name="deliveryDate"
                        selected={
                          formData.deliveryDate
                            ? moment(formData.deliveryDate).toDate()
                            : null
                        }
                        onChange={(date) => onDateChange(date, "deliveryDate")}
                        // className={`form-control ${submitted && !formData.deliveryDate ? 'ap-required' : ''}`}
                        customInput={
                          <DateCustomInput
                            customClassName={`form-control input-sm ${
                              submitted && !formData.deliveryDate
                                ? "ap-required"
                                : ""
                            }`}
                          />
                        }
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-control input-sm"
                        name="deliveryTime"
                        value={formData.deliveryTime || ""}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Please Select</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Delivered By :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.deliveredById
                            ? "ap-required"
                            : ""
                        }`}
                        name="deliveredById"
                        value={formData.deliveredById || 0}
                        // onChange={handleDropdownChange}
                        // onChange={(e) => onFormChange(e)}
                        onChange={(e) => {
                          handleDropdownChange(e);
                          onFormChange(e); // Pass a default value if e is falsy
                        }}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Delivered By</option>

                        {deliveredByData.length > 0 ? (
                          deliveredByData
                            .sort(sortIt("name"))
                            .map((singleDeliveredBy) => (
                              <option
                                key={singleDeliveredBy.id}
                                value={singleDeliveredBy.id}
                              >
                                {singleDeliveredBy.name}
                              </option>
                            ))
                        ) : (
                          <></>
                        )}
                      </select>
                      {/* <div>Selected Text: {selectedText}</div> */}
                    </div>
                  </div>
                </div>

                <hr />
                <h4 className="text_blue">Schoenberger Drywall</h4>
                <div className="clear pad-5" />
                <div className="row">
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Start Date :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <DatePicker
                        name="hangerStartDate"
                        selected={
                          formData.hangerStartDate
                            ? moment(formData.hangerStartDate).toDate()
                            : null
                        }
                        onChange={(date) =>
                          onDateChange(date, "hangerStartDate")
                        }
                        // className={`form-control ${submitted && !formData.startDate ? 'ap-required' : ''}`}
                        customInput={
                          <DateCustomInput
                            customClassName={`form-control make-disabled input-sm ${
                              submitted && !formData.startDate
                                ? "ap-required"
                                : ""
                            }`}
                          />
                        }
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Sander's End Date:
                    </label>
                    <div className="col-md-9">
                      <DatePicker
                        name="sanderDate"
                        selected={
                          formData.sanderDate
                            ? moment(formData.sanderDate).toDate()
                            : null
                        }
                        onChange={(date) => onDateChange(date, "sanderDate")}
                        onKeyDown={(e) => handleEnter(e)}
                        // className={`form-control `}
                        // onDateChange(date, 'sanderDate')
                        customInput={
                          <DateCustomInput customClassName="form-control make-disabled input-sm " />
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Paint Date :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <DatePicker
                        name="paintStartDate"
                        selected={
                          formData.paintStartDate
                            ? moment(formData.paintStartDate).toDate()
                            : null
                        }
                        onChange={(date) =>
                          onDateChange(date, "paintStartDate")
                        }
                        onKeyDown={(e) => handleEnter(e)}
                        // className={`form-control ${submitted && !formData.paintStartDate ? 'ap-required' : ''}`}
                        customInput={
                          <DateCustomInput
                            customClassName={`form-control make-disabled input-sm ${
                              submitted && !formData.paintStartDate
                                ? "ap-required"
                                : ""
                            }`}
                          />
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Fog Date :
                    </label>
                    <div className="col-md-9">
                        <DatePicker
                          name="paintStartDate"
                          selected={!!formData.fogDate ? moment(formData.fogDate).toDate() : null}
                          onChange={(date) => onDateChange(date, 'fogDate')}
                          // className={`form-control ${submitted && !formData.paintStartDate ? 'ap-required' : ''}`}
                          customInput={<DateCustomInput customClassName={`form-control input-sm ${submitted && !formData.fogDate ? 'ap-required' : ''}`} />}
                        />
                    </div>
                  </div> */}
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Garage Stalls :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.garageStallId
                            ? "ap-required"
                            : ""
                        }`}
                        name="garageStallId"
                        value={formData.garageStallId || 0}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Garage Stall</option>

                        {garageStallsData.length > 0 ? (
                          garageStallsData
                            .sort(sortIt("name"))
                            .map((singleGarageStall) => (
                              <option
                                key={singleGarageStall.id}
                                value={singleGarageStall.id}
                              >
                                {singleGarageStall.name}
                              </option>
                            ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Walkthrough Date :
                    </label>
                    <div className="col-md-9">
                      <DatePicker
                        name="walkthroughDate"
                        selected={
                          formData.walkthroughDate
                            ? moment(formData.walkthroughDate).toDate()
                            : null
                        }
                        onChange={(date) =>
                          onDateChange(date, "walkthroughDate")
                        }
                        onKeyDown={(e) => handleEnter(e)}
                        // className={`form-control`}
                        customInput={
                          <DateCustomInput customClassName="form-control input-sm" />
                        }
                      />
                    </div>
                  </div>
                  <div className="clear" />
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Ceiling Finish :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.ceilingFinishId
                            ? "ap-required"
                            : ""
                        }`}
                        name="ceilingFinishId"
                        value={formData.ceilingFinishId || 0}
                        onChange={(e) => onCeilingFinishChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Ceiling Finish</option>

                        {ceilingFinishesData.length > 0 ? (
                          ceilingFinishesData
                            .sort(sortIt("name"))
                            .map((singleCeilingFinish) => (
                              <option
                                key={singleCeilingFinish.id}
                                value={singleCeilingFinish.id}
                              >
                                {singleCeilingFinish.name}
                              </option>
                            ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-10">
                    <label className="col-md-3 control-label">
                      Garage Finish :<span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control input-sm ${
                          submitted && !formData.garageFinishId
                            ? "ap-required"
                            : ""
                        }`}
                        name="garageFinishId"
                        value={formData.garageFinishId || 0}
                        onChange={(e) => onFormChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <option value="">Select Garage Finsh</option>

                        {garageFinishesData.length > 0 ? (
                          garageFinishesData
                            .sort(sortIt("name"))
                            .map((singleGarageFinish) => (
                              <option
                                key={singleGarageFinish.id}
                                value={singleGarageFinish.id}
                              >
                                {singleGarageFinish.name}
                              </option>
                            ))
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="clear pad-10" />
                  <div className="col-md-offset-2 col-md-4 mb-5">
                    <label>
                      <input
                        type="checkbox"
                        name="electric"
                        checked={!!formData.electric}
                        onChange={(e) => onCheckboxChange(e)}
                        className={`${
                          submitted && !formData.electric ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                      Electrical Svc Hooked Up
                    </label>
                  </div>
                  <div className="col-md-3 mb-5">
                    <label>
                      <input
                        type="checkbox"
                        name="heat"
                        checked={!!formData.heat}
                        onChange={(e) => onCheckboxChange(e)}
                        className={`${submitted && !formData.heat ? "" : ""}`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                      Heat at Jobsite
                    </label>
                  </div>
                  <div className="col-md-3 mb-5">
                    <label>
                      <input
                        type="checkbox"
                        name="basement"
                        checked={!!formData.basement}
                        onChange={(e) => onCheckboxChange(e)}
                        className={`${
                          submitted && !formData.basement ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                      Basement
                    </label>
                  </div>
                </div>

                <hr />

                <h4 className="text_blue">Sheet Rock Stock House</h4>
                <div className="clear pad-5" />
                <div className="row">
                  {/* {billingItemsData.length > 0 ? billingItemsData.map((item: any, index: any) => (
                    <div key={index} className={index > 0 ? 'col-md-2 text-center' : 'col-md-offset-2 col-md-2 text-center'}>
                      <h5>{item.billingItemName}</h5>
                    </div>
                  )) : (<></>)} */}

                  {renderBillingItemsSelectList()}
                  <div className="clear pad-5" />
                  {/* <div className="col-md-offset-2 col-md-2">
                    {renderBillingItemsSelect(1)}
                  </div>
                  <div className="col-md-2">
                    {renderBillingItemsSelect(2)}
                  </div>
                  <div className="col-md-2">
                    {renderBillingItemsSelect(3)}
                  </div>
                  <div className="col-md-2">
                    {renderBillingItemsSelect(4)}
                  </div>
                  <div className="col-md-1">
                    {renderBillingItemsSelect(5)}
                  </div>
                  <div className="col-md-1">
                    {renderBillingItemsSelect(6)}
                  </div> */}
                </div>

                <div className="form-group row">
                  {formData.houseLevels.length > 0 ? (
                    formData.houseLevels.map((singleLevel: any, i: any) => (
                      <>
                        <div key={i} className="col-md-2">
                          {renderHouseLevelTypesSelect(
                            singleLevel.rowOrder,
                            singleLevel.houseLevelTypeId
                          )}
                        </div>

                        {renderBillingItemsInputList(
                          singleLevel.rowOrder,
                          singleLevel.billingItems
                        )}
                        {/* {singleLevel.billingItems.length > 0 ? formData.houseLevels.map((singleLevel: any, index: any) => (
                        <div key={index} className="col-md-2" style={{ width: '13.333333%' }}>
                          <input
                            type="text"
                            name="billingItemId"
                            value={singleLevel.itemValue || ''}
                            // onChange={(e) => onFormChange(e)}
                            className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                          />
                        </div>
                      )) : (<></>)} */}
                        <div className="clear pad-5" />
                      </>
                    ))
                  ) : (
                    <>
                      <div key={1} className="col-md-2">
                        {renderHouseLevelTypesSelect(1, 0)}
                      </div>

                      {renderBillingItemsInputList(1, [])}
                      <div className="clear pad-5" />
                    </>
                  )}

                  {/* {billingItemsData.length > 0 ? billingItemsData.map((item: any, i: any) => (
                    <div className="col-md-2">
                      <input
                        type="text"
                        name="billingItemId"
                        value={item.itemValue || ''}
                        // onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                      />
                    </div>
                  )) : (<></>)} */}
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="pull-right top10">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm right-10"
                        onClick={(e) => deleteRow(e)}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        Delete Last Row
                      </button>
                      <button
                        type="button"
                        className="btn btn-info btn-sm mr-5"
                        onClick={(e) => addNewRow(e)}
                        disabled={formData.houseLevels.length > 9}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        Add New Row
                      </button>
                    </div>
                  </div>
                </div>

                <div className="clear pad-10" />

                <h4 className="text_blue">House</h4>
                <div className="row">
                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total 12' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="total12"
                        value={formData.total12 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.total12 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total 54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="total54"
                        value={formData.total54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.total54 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10 h-30-px">
                    {/* <label className="col-md-6 control-label">
                      Total Overs :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalOvers"
                        value={formData.totalOvers || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.totalOvers ? '' : ''}`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div> */}
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Used 12' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGar12"
                        value={formData.totalGar12 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGar12 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Used 54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGar54"
                        value={formData.totalGar54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGar54 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Overs :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalOvers"
                        value={formData.totalOvers || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalOvers ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <h4 className="text_blue">Garage</h4>
                <div className="row">
                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Gar 12' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarage12"
                        value={formData.totalGarage12 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGarage12 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Gar 54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarage54"
                        value={formData.totalGarage54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGarage54 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10 h-30-px">
                    {/* <label className="col-md-6 control-label">
                      Total Gar Overs :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarageOvers"
                        value={formData.totalGarageOvers || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.totalGarageOvers ? '' : ''}`}
                        onKeyDown={(e) => handleEnter(e)}
                      />
                    </div> */}
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Used Gar 12' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarageGar12"
                        value={formData.totalGarageGar12 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGarageGar12 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Used Gar 54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarageGar54"
                        value={formData.totalGarageGar54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGarageGar54 ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Total Gar Overs :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="totalGarageOvers"
                        value={formData.totalGarageOvers || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${
                          submitted && !formData.totalGarageOvers ? "" : ""
                        }`}
                        onKeyDown={(e) => handleEnter(e)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="clear pad-10"></div>


                <h4 className="text_blue">
                  House
                </h4>

                <div className="row">
                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      4x12 :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="house4x12"
                        value={formData.house4x12 || 0}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control input-sm ${submitted && !formData.house4x12 ? '' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Over 8' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="houseOver8"
                        value={formData.houseOver8 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.houseOver8 ? '' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="house54"
                        value={formData.house54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.house54 ? '' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <h4 className="text_blue">
                  Garage
                </h4>

                <div className="row">
                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      4x12 :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="garage4x12"
                        value={formData.garage4x12 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.garage4x12 ? '' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      Over 9.6' :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="garage96"
                        value={formData.garage96 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.garage96 ? '' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-4 mb-10">
                    <label className="col-md-6 control-label">
                      54" :
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="garage54"
                        value={formData.garage54 || 0}
                        onChange={(e) => onFormNumberChange(e)}
                        className={`form-control input-sm ${submitted && !formData.garage54 ? '' : ''}`}
                      />
                    </div>
                  </div>
                </div> */}

                <table className="modaltbl">
                  {/* <thead>
                    <tr>
                      {billingItemsData.length > 0 ? billingItemsData.map((item:any, index:any) => (
                        <th>{item.billingItemName}</th>
                      )) : (<></>)}
                    </tr>
                  </thead> */}
                  {/* <tbody>
                    {modalFormData.rpItems.length > 0 ? modalFormData.rpItems.map((dt: any, i: any) => (
                      <tr key={i}>
                        <td>{dt.id}</td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={dt.billitem}
                            name="billitem"
                            style={{ display: activetxt ? 'block' : 'none' }}
                            onChange={(e) => { updateModalFormData(dt, 'billitem', e.target.value) }}
                          />
                          <select
                            className="form-control"
                            name="billitem"
                            value={dt.bill_id}
                            style={{ display: !activetxt ? 'block' : 'none' }}
                            onChange={(e) => updateModalFormData(dt, 'billitem', e.target.value)}
                          >
                            <option value={0}>select...</option>
                            <option value={'new'}>New</option>
                            {dt.jbi_items.length > 0 ? dt.jbi_items.map((jd: any, i: any) => (
                              <option key={i} value={jd?.id}>{jd?.billitem_id}</option>
                            )) : (
                                <option value={0}>select...</option>
                              )}
                          </select>
                        </td>
                        <td><input className="form-control" type="text" value={dt.rate} name="rate" onChange={(e) => { updateModalFormData(dt, 'rate', e.target.value) }} /></td>
                      </tr>
                    )) : (
                        <tr>
                          <td colSpan={4}>Sorry! no data available...</td>
                        </tr>
                      )}
                  </tbody> */}
                </table>
                {/* <div className="pull-right top10">
            <button type="button" className="btn btn-danger right-10" onClick={(e) => deleteRow(e)}>
              Delete Last Row
                    </button>
            <button type="button" className="btn btn-info mr-5" onClick={(e) => addNewRow(e)}>
              Add New Row
          </button>
          </div>
          <div className="pull-left top10">
            <button type="submit" className="btn btn-primary" onClick={(e) => saveModalData(e)}>
              <i className="fas fa-save mr-5" />
              Save
          </button>
          </div> */}

                <hr />
                {/* <div className="form-group row">
                  <label className="col-md-2 text_blue control-label text_20">
                    Garage
                  </label>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="g58"
                      value={formData.g58 || ''}
                      onChange={(e) => onFormChange(e)}
                      className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="gHs"
                      value={formData.gHs || ''}
                      onChange={(e) => onFormChange(e)}
                      className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="g12"
                      value={formData.g12 || ''}
                      onChange={(e) => onFormChange(e)}
                      className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="g5458"
                      value={formData.g5458 || ''}
                      onChange={(e) => onFormChange(e)}
                      className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      name="g5412"
                      value={formData.g5412 || ''}
                      onChange={(e) => onFormChange(e)}
                      className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                    />
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-md-4 control-label">
                        OPTIONS:
                        <br />
                        <small>Available</small>
                      </label>
                      <div className="col-md-8">
                        <Select
                          isMulti
                          options={optionsData.sort(sortIt("name"))}
                          getOptionLabel={(option: any) => option.name}
                          getOptionValue={(option: any) => option.id}
                          value={formData.options}
                          onChange={(value) =>
                            onMultiSelectChange(value, "options")
                          }
                          styles={customStyles}
                          onKeyDown={(e) => handleEnter(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="clear pad-10" />
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-md-4 control-label">
                        Additional Info:
                      </label>
                      <div className="col-md-8">
                        <textarea
                          className="form-control"
                          rows={5}
                          name="additionalInfo"
                          value={formData.additionalInfo || ""}
                          onChange={(e) => onFormChange(e)}
                          onKeyDown={(e) => handleEnter(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clear pad-15" />

                <div className="row">
                  <div className="col-md-12 mt-20 text-center">
                    <button
                      type="button"
                      className="btn btn-info btn-sm mr-5"
                      onClick={() => clearData()}
                      onKeyDown={(e) => handleEnter(e)}
                    >
                      <i className="fas fa-arrow-circle-left mr-5" />
                      Return to Schedules
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      onKeyDown={(e) => handleEnter(e)}
                    >
                      <i className="fas fa-save mr-5" />
                      Save
                    </button>
                  </div>
                </div>

                <hr />
                {/* <div className="clear pad-15" /> */}

                {/* <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    <div className="row">
                      <div className="col-sm-6 mb-5">
                        <button type="button" className="btn btn-info btn-block btn-lg">
                          <i className="fas fa-arrow-circle-left mr-5" />
                          Return to Schedule
                        </button>
                      </div>
                      <div className="col-sm-6">
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                          <i className="fas fa-save mr-5" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">

              <h4 className="text_blue">
                JobOrders
              </h4>
              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>
                        Name
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOrdersData.length > 0 ? jobOrdersData.map((jobOrder) => (
                      <tr key={jobOrder.id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <strong>{jobOrder.name}</strong>
                        </td>
                        <td>
                          {jobOrder.status == 1 ? 'Active' : 'In-Active'}
                        </td>
                        <td>
                          <a
                            href="#"
                            title="Edit"
                            className="text_grey_d"
                            onClick={(e) => handleEdit(e, jobOrder)}
                          >
                            <i className="fa fa-edit fa-lg" />
                          </a>
                          <a
                            href="#"
                            title="Edit"
                            className="text_red"
                            onClick={(e) => handleDelete(e, jobOrder.id)}
                          >
                            <i className="fa fa-times-circle fa-lg" />
                          </a>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No record found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                { jobOrdersData.length < 1 }
                <ul className="pagination center-block">
                  <li><a href="#">«</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">»</a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div> */}

      <ReactModal
        isOpen={isMailModalOpen}
        onRequestClose={closeModal}
        style={emailModalStyles}
        contentLabel="Email JIO"
        initHeight={500}
        initWidth={500}
      >
        <div className="clear pad-15" />
        <h3>Email JIO</h3>
        <form className="form-horizontal" onSubmit={(e) => handleMailSubmit(e)}>
          <div className="row">
            <div className="col-md-12">
              <label className="control-label">
                To:
                <span className="text_red">*</span>
              </label>
              <input
                type="text"
                name="emailTo"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control input-sm ${
                  mailSubmitted && !mailFormData.emailTo ? "ap-required" : ""
                }`}
              />
            </div>
            <div className="clear pad-15" />
            <div className="col-md-12">
              <label className="control-label">Message:</label>
              <textarea
                rows={5}
                name="emailMessage"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control input-sm ${
                  mailSubmitted && !mailFormData.emailMessage
                    ? "ap-required"
                    : ""
                }`}
              />
            </div>
          </div>
          <div className="clear pad-15" />
          <div className="pull-right">
            <button
              className="btn btn-default btn-sm mr-5"
              onClick={closeModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info btn-sm">
              Send
            </button>
          </div>
        </form>
      </ReactModal>

      <ReactModal
        isOpen={isHouseTypeModalOpen}
        onRequestClose={closeHouseLevelModal}
        style={modalCustomStyles}
        contentLabel="House Level TYpe"
        initHeight={500}
        initWidth={800}
      >
        <form
          className="form-horizontal"
          onSubmit={(e) => handleHouseLevelModalSubmit(e)}
        >
          <h4 className="text_blue">House Type Details</h4>
          <div className="clear pad-5" />
          <div className="row">
            <div className="form-group col-md-6 mb-20">
              <label className="col-md-3 control-label">
                Name :<span className="text_red">*</span>
              </label>
              <div className="col-md-9">
                <input
                  type="text"
                  name="name"
                  value={houseTypeModalFormData.name || ""}
                  onChange={(e) => onHouseTypeFormChange(e)}
                  className={`form-control input-sm ${
                    housLevelModalSubmitted && !houseTypeModalFormData.name
                      ? "ap-required"
                      : ""
                  }`}
                />
              </div>
            </div>

            <div className="form-group col-md-6 mb-20">
              <label className="col-md-3 control-label">Status :</label>
              <div className="col-md-9">
                <select
                  className="form-control"
                  name="status"
                  value={houseTypeModalFormData.status.toString() || "1"}
                  onChange={(e) => onHouseTypeStatusChange(e)}
                >
                  <option value={1}>Active</option>
                  <option value={0}>In-Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mt-20 text-right">
              <button
                type="button"
                className="btn btn-info btn-sm mr-5"
                onClick={() => clearData()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="fas fa-save mr-5" />
                Save
              </button>
            </div>
          </div>
          <hr />
        </form>
      </ReactModal>

      {console.log("formdata", formdata)}

      <div style={{ display: "none" }}>
        <>
          <div
            ref={componentRef}
            style={{
              width: "97%",
              margin: "12px",
              padding: "5px",
              border: "1px solid #606060",
              fontFamily: "Arial",
            }}
          >
            <div style={{ textAlign: "center", marginTop: "-25px" }}>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Schoenberger Drywall, Inc.
              </h2>
              <p style={{ marginTop: "-10px", fontSize: "18px" }}>
                JOB INITIATION ORDER
              </p>
            </div>
            <div style={{ padding: "5px" }}>
              {/* <div style={{ textAlign: 'right', color: '#ff0000', marginTop: '-25px' }}>* Required Fields</div> */}

              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Builders Details:
              </h3>

              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "-10px",
                }}
              >
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      width: "23%",
                      fontWeight: "bold",
                    }}
                  >
                    Builder&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {formdata.builderName}

                    {getBuilderName(formdata.builderId, buildersData)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Supervisor&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {getSupervisorName(formdata.supervisorId, usersData)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    H/O Name&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {formdata.name || ""}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    House Type&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {getHouseTypeName(formdata.houseTypeId, houseTypesData)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Address&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {formdata.address || ""}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    City&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {getCityName(formdata.cityId, citiesData)}
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ padding: "5px", marginTop: "-10px" }}>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Sheet Rock Stock:
              </h3>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "-5px",
                }}
              >
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Delivery Date: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {!!formdata.deliveryDate
                      ? moment(formdata.deliveryDate).format("MM/DD/YYYY")
                      : null}{" "}
                    &nbsp;:&nbsp;{" "}
                    {!!formdata.deliveryTime ? formdata.deliveryTime : null}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Delivered By&nbsp;:&nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {/* {getDeliveredByName(
                      formdata.deliveredById,
                      deliveredByData
                    )} */}
                    {selectedText}
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px", marginTop: "-10px" }}>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Schoenberger Drywall:
              </h3>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Start Date: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {!!formdata.hangerStartDate
                      ? moment(formdata.hangerStartDate).format("MM/DD/YYYY")
                      : null}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Sander's End Date: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {!!formdata.sanderDate
                      ? moment(formdata.sanderDate).format("MM/DD/YYYY")
                      : null}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Paint Date: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {!!formdata.paintStartDate
                      ? moment(formdata.paintStartDate).format("MM/DD/YYYY")
                      : null}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Garage Stalls: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {formdata.garageStallId}
                    {getGarageStallName(
                      formdata.garageStallId,
                      garageStallsData
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Walkthrough Date: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {!!formdata.walkthroughDate
                      ? moment(formdata.walkthroughDate).format("MM/DD/YYYY")
                      : null}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "#000",
                    }}
                  >
                    {" "}
                    &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                    }}
                  ></td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "23%",
                    }}
                  >
                    Ceiling Finish: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                    }}
                  >
                    {formdata.ceilingFinishId}
                    {/* {getCeilingFinishName(
                  formData.ceilingFinishId,
                  ceilingFinishesData
                )} */}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Garage Finish: &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "25%",
                      border: "1px solid #606060",
                    }}
                  >
                    {getGarageFinishName(
                      formdata.garageFinishId,
                      garageFinishesData
                    )}
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "left",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "28%",
                    }}
                  >
                    Electrical Svc Hooked Up:
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      paddingLeft: "5px",
                      color: "#000",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="electric"
                      checked={formdata.electric === 1 ? true : false}
                    />
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "20%",
                    }}
                  >
                    Heat at Jobsite:
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      paddingLeft: "5px",
                      color: "#000",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="heat"
                      checked={formdata.heat === 1 ? true : false}
                    />
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "20%",
                    }}
                  >
                    Basement:
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      paddingLeft: "5px",
                      color: "#000",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formdata.basement === 1 ? true : false}
                    />
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px", marginTop: "-6px" }}>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Sheet Rock Stocked:
              </h3>
              {/* <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                border: "#fff 0px solid",
              }}
            >
              <tr>{renderBillingItemsSelectList()}</tr>
              {formdata.houseLevels.length > 0 ? (
                formdata.houseLevels.map((singleLevel: any, i: any) => (
                  <>
                    <tr key={i}>
                      {renderHouseLevelTypesHeading(
                        singleLevel.rowOrder,
                        singleLevel.houseLevelTypeId
                      )}
                      {renderBillingItemsInputList(
                        singleLevel.rowOrder,
                        singleLevel.billingItems
                        // true
                      )}
                    </tr>
                  </>
                ))
              ) : (
                <></>
              )}
            </table> */}
            </div>
            <div style={{ padding: "5px", marginTop: "-6px" }}>
              <h3
                style={{
                  marginLeft: "25px",
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                House
              </h3>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total 12' :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.total12 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total 54" :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.total54 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  ></td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      width: "10%",
                    }}
                  ></td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Used 12' :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGar12 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Used 54" :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGar54 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Overs :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalOvers || 0}
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px", marginTop: "-6px" }}>
              <h3
                style={{
                  marginLeft: "25px",
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Garage
              </h3>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Gar 12' :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGarage12 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Gar 54" :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGarage54 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  ></td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  ></td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Used Gar 12' :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGarageGar12 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Used Gar 54" :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGarageGar54 || 0}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "5px",
                      color: "blue",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    Total Gar Overs :
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      color: "#000",
                      border: "1px solid #606060",
                      width: "10%",
                    }}
                  >
                    {formdata.totalGarageOvers || 0}
                  </td>
                </tr>
              </table>
            </div>
            <div style={{ padding: "5px", marginTop: "-6px" }}>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Options:
              </h3>
              <div className="col-md-12">
                <div className=" css-2b097c-container">
                  <div
                    className=" css-yy9inb-control"
                    style={{ borderColor: "#606060" }}
                  >
                    <div
                      className=" css-xmx1yn-ValueContainer"
                      style={{ padding: "5px" }}
                    >
                      {formdata.options.length > 0 ? (
                        formdata.options.map((value: any) => {
                          return (
                            <div className="css-1rhbuit-multiValue">
                              <div className="css-12jo7m5">{value.name}</div>
                              <div className="css-xb97g8">
                                <svg
                                  height="14"
                                  width="14"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                  focusable="false"
                                  className="css-6q0nyr-Svg"
                                >
                                  <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                                </svg>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ clear: "both" }}></div>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#aa4444",
                  marginTop: "5px",
                }}
              >
                Additional Info:{" "}
              </h3>
              <div className="col-md-8">
                <textarea
                  className="form-control"
                  name="additionalInfo"
                  value={formdata.additionalInfo || ""}
                ></textarea>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

JobOrderPage.propTypes = {
  // jobOrders: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};

const mapStateToProps = (state: JobOrderReduxProps) => ({
  jobOrders: state.jobOrders,
  builders: state.builders,
  users: state.users,
  houseTypes: state.houseTypes,
  cities: state.cities,
  deliveredBy: state.deliveredBy,
  garageStalls: state.garageStalls,
  ceilingFinishes: state.ceilingFinishes,
  garageFinishes: state.garageFinishes,
  vaults: state.vaults,
  options: state.options,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getAllJobOrders: bindActionCreators(
      JobOrderActions.getAllJobOrders,
      dispatch
    ),
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
    addJobOrder: bindActionCreators(JobOrderActions.addJobOrder, dispatch),
    updateJobOrder: bindActionCreators(
      JobOrderActions.updateJobOrder,
      dispatch
    ),
    deleteJobOrder: bindActionCreators(
      JobOrderActions.deleteJobOrder,
      dispatch
    ),
    sendJobOrderEmail: bindActionCreators(
      JobOrderActions.sendJobOrderEmail,
      dispatch
    ),
    getAllBuilders: bindActionCreators(BuilderActions.getAllBuilders, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getUsersByType: bindActionCreators(UserActions.getUsersByType, dispatch),
    getAllHouseTypes: bindActionCreators(
      HouseTypeActions.getAllHouseTypes,
      dispatch
    ),
    getAllCities: bindActionCreators(CityActions.getAllCities, dispatch),
    getAllDeliveredBy: bindActionCreators(
      DeliveredByActions.getAllDeliveredBy,
      dispatch
    ),
    getAllGarageStalls: bindActionCreators(
      GarageStallActions.getAllGarageStalls,
      dispatch
    ),
    getAllCeilingFinishes: bindActionCreators(
      CeilingFinishActions.getAllCeilingFinishes,
      dispatch
    ),
    getAllGarageFinishes: bindActionCreators(
      GarageFinishActions.getAllGarageFinishes,
      dispatch
    ),
    getAllVaults: bindActionCreators(VaultActions.getAllVaults, dispatch),
    getAllOptions: bindActionCreators(OptionActions.getAllOptions, dispatch),
    getAllBillingItems: bindActionCreators(
      BillingItemActions.getAllBillingItems,
      dispatch
    ),
    getAllHouseLevelTypes: bindActionCreators(
      HouseLevelTypeActions.getAllHouseLevelTypes,
      dispatch
    ),
    addHouseType: bindActionCreators(HouseTypeActions.addHouseType, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JobOrderPage);
