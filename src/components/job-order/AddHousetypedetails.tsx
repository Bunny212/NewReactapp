import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import Select from "react-select";
import _, { toNumber } from "lodash";
import DatePicker from "react-datepicker";
import momentBusinessDays from "moment-business-days";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { NavLink } from "react-router-dom";

import {
  JobOrderReduxProps,
  JobOrderPageList,
  JobOrder,
  Target,
} from "../../types/interfaces";
import { Alert, Button } from "react-bootstrap";
import { Console } from "console";

Modal.setAppElement("#root");

// const [hidedive ] = useState(true)
const AddHousetypedetails = ({
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

  const [responseData, setResponseData] = useState<any[]>([]);
  const [dataView, setDataView] = useState<DataView | null>(null);
  const [Housetypedata, setHousetypedata] = useState<string>();
  const [builderids, setbuilderid] = useState<number>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showsavebtn, setshowsavebtn] = useState(true);
  const [showEditbtn, setshowEditbtn] = useState(true);
  const [showViewBtn, setShowBtn] = useState(true);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  type DataView = {
    id: number;
    builder_id: number;
    builder_value: string;
    house_type_id: string;
    house_type_value: string;
    garage_stalls_id: number;
    garage_stalls_value: number;
    garage_finish_id: string;
    garage_finish_name: string;
    ceiling_finish_id: string;
    ceiling_finish_name: string;
    sheet_rock_stock_house_levels: string;
    house_total_12_inch: number;
    house_total_54_inch: number;
    garage_total_12_inch: number;
    garage_total_54_inch: number;
    options_available: string;
    created_at: string;
    updated_at: string;
  };
  // const [jobOrder, setJobOrder] = useState<JobOrder>(defaultState);

  var fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        "https://2fd82c9861.nxcli.io/sdi-api/house-type-new",
        // "https://9d8d4152b6.nxcli.io/sdi-api/house-type-new",
        requestOptions
      );
      const result = await response.json();
      console.log("this is data to be sort", result.data);

      const sortedData = result.data.sort((a: any, b: any) => {
        // Check if the house_type_value starts with a number
        const startsWithNumberA = /^\d/.test(a.house_type_value);
        const startsWithNumberB = /^\d/.test(b.house_type_value);

        // If one starts with a number and the other doesn't, sort accordingly
        if (startsWithNumberA && !startsWithNumberB) {
          return -1;
        }
        if (!startsWithNumberA && startsWithNumberB) {
          return 1;
        }

        // If both start with a number or both don't, sort by house_type_id numerically
        const houseTypeIdA = parseInt(a.house_type_id);
        const houseTypeIdB = parseInt(b.house_type_id);
        if (houseTypeIdA !== houseTypeIdB) {
          return houseTypeIdA - houseTypeIdB;
        }

        // If house_type_id is the same, sort by house_type_value alphabetically
        const houseTypeValueA = a.house_type_value.toLowerCase();
        const houseTypeValueB = b.house_type_value.toLowerCase();
        if (houseTypeValueA < houseTypeValueB) {
          return -1;
        }
        if (houseTypeValueA > houseTypeValueB) {
          return 1;
        }
        return 0;
      });

      // Set the sorted data to state
      setResponseData(sortedData);
      // setResponseData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []); // Empty dependency array ensures this effect runs only once

  const handleDeleteGet = async (id: number) => {
    // Explicitly specify the type of 'id' as 'number'
    try {
      const requestOptions = {
        method: "DELETE",
      };
      const response = await fetch(
        `https://2fd82c9861.nxcli.io/sdi-api/house-type-new/${id}`,
        requestOptions
      );
      const result = await response.text();
      // console.log(result);
      // alert("Record is delted");
      toast.error("House Type Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleViewData = async (id: number) => {
    // Explicitly specify the type of 'id' as 'number'
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `https://2fd82c9861.nxcli.io/sdi-api/house-type-new/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log("get the data form the Edit ", result.data);
      // alert("Record is Edit ");
      // setformhide(false);
      setshowEditbtn(true);
      setshowsavebtn(false);
      openModal();
      setDataView(result.data);
      setHousetypedata(result.data?.house_type_value ?? "");
      setbuilderid(dataView?.builder_id ?? 0);
      setFormData((prevState) => ({
        ...prevState,
        id: result.data.id,
        builderId: parseInt(result.data.builder_id),
        builderName: result.data.builder_value,
        houseTypeId: parseInt(result.data.house_type_id),
        houseTypeValue: result.data.house_type_value,
        garageStallId: parseInt(result.data.garage_stalls_id),
        garageStallName: result.data.garage_stalls_value,
        garageFinishId: parseInt(result.data.garage_finish_id),
        garageFinishName: result.data.garage_finish_name,
        ceilingFinishId: parseInt(result.data.ceiling_finish_id),
        ceilingFinishName: result.data.ceiling_finish_name,
        houseTotal12Inch: parseInt(result.data.house_total_12_inch),
        houseTotal54Inch: parseInt(result.data.house_total_54_inch),
        garageTotal12Inch: parseInt(result.data.garage_total_12_inch),
        garageTotal54Inch: parseInt(result.data.garage_total_54_inch),
        houseLevels: JSON.parse(result.data.sheet_rock_stock_house_levels),
        options: JSON.parse(result.data.options_available ?? ""),
        // .split(", ")
        // .map((name: any) => ({ name })) as { name: string }[],
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleViewdetails = async (id: number) => {
    // Explicitly specify the type of 'id' as 'number'
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `https://2fd82c9861.nxcli.io/sdi-api/house-type-new/${id}`,
        requestOptions
      );
      const result = await response.json();
      console.log("get the data form the Edit ", result.data);
      // alert("Record is Edit ");
      // setformhide(false);
      setshowEditbtn(false);
      setshowsavebtn(false);
      openModal();
      setDataView(result.data);
      setHousetypedata(result.data?.house_type_value ?? "");
      setbuilderid(dataView?.builder_id ?? 0);
      setFormData((prevState) => ({
        ...prevState,
        id: result.data.id,
        builderId: parseInt(result.data.builder_id),
        builderName: result.data.builder_value,
        houseTypeId: parseInt(result.data.house_type_id),
        houseTypeValue: result.data.house_type_value,
        garageStallId: parseInt(result.data.garage_stalls_id),
        garageStallName: result.data.garage_stalls_value,
        garageFinishId: parseInt(result.data.garage_finish_id),
        garageFinishName: result.data.garage_finish_name,
        ceilingFinishId: parseInt(result.data.ceiling_finish_id),
        ceilingFinishName: result.data.ceiling_finish_name,
        houseTotal12Inch: parseInt(result.data.house_total_12_inch),
        houseTotal54Inch: parseInt(result.data.house_total_54_inch),
        garageTotal12Inch: parseInt(result.data.garage_total_12_inch),
        garageTotal54Inch: parseInt(result.data.garage_total_54_inch),
        houseLevels: JSON.parse(result.data.sheet_rock_stock_house_levels),
        //   options: JSON.parse(result.data.options_available ?? "")
        //     .split(", ")
        //     .map((name: any) => ({ name })) as { name: string }[],
        options: JSON.parse(result.data.options_available ?? ""),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddData = async () => {
    setHousetypedata("");
    setFormData((prevState) => ({
      ...prevState,
      id: 0,
      builderId: 0,
      builderName: "",
      houseTypeId: 0,
      houseTypeValue: "",
      garageStallId: 0,
      garageStallName: "",
      garageFinishId: 0,
      garageFinishName: "",
      ceilingFinishId: 0,
      ceilingFinishName: "",
      houseTotal12Inch: 0,
      houseTotal54Inch: 0,
      garageTotal12Inch: 0,
      garageTotal54Inch: 0,

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
    }));
    setshowEditbtn(false);
    setshowsavebtn(true);
    openModal();
  };

  // console.log("this is view data response", houseLevels);
  // console.log(
  //   "this is the value of options ",
  //   (dataView?.sheet_rock_stock_house_levels ?? "")
  //     .split(", ")
  //     .map((name: string) => ({ name })) as { name: string }[]
  // );

  // console.log("this is the value of options " , JSON.parse( dataView?.sheet_rock_stock_house_levels ?? ''));

  const defaultHouseTypeOptions: any = {
    sortBy: "dateDESC",
  };

  useEffect(() => {
    const jid: number = id !== undefined ? +id : 0;

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
  const [formhide, setformhide] = useState(true);
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

  {
    console.log("jobOrders", jobOrders);
  }

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

          // console.log("llllll");
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
  const defaultArray: [] | any = [];
  const [formData, setFormData] = useState(defaultState);
  const [selectedText, setSelectedText] = useState("");

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
    // setbuilderid({ ...formData, [e.target.name]: value })
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

    setFormData({
      ...formData,
      houseLevels: [...b],
    });
  };

  const updateTotalCounts = () => {
    const b = [...formData.houseLevels];
    const totalVals = {
      total12: 0,
      total54: 0,
      totalGarage12: 0,
      totalGarage54: 0,
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
        } else {
          if (itemGroupName === "12'") {
            totalVals.total12 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === '54"') {
            totalVals.total54 += parseInt(billItem.itemValue, 10);
          } else if (itemGroupName === "Overs") {
            // totalVals.totalOvers += parseInt(billItem.itemValue, 10);
          }
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

  const renderBillingItemsSelectList = () => {
    // let revertedArray: {
    //   houseLevelTypeId: number;
    //   garage: number;
    //   isFireBarrier: number;
    //   rowOrder: number;
    //   billingItems: {
    //     billingItemId: number;
    //     itemValue: number | string;
    //     columnOrder: number;
    //   }[];
    // }[] = [];

    // if (dataView != null && dataView.sheet_rock_stock_house_levels) {
    //   revertedArray = dataView.sheet_rock_stock_house_levels
    //     .split(",")
    //     .map((str: string) => ({
    //       houseLevelTypeId: Number(str), // Assuming you want to convert to number
    //       garage: 0, // You may need to set appropriate default values
    //       isFireBarrier: 0, // You may need to set appropriate default values
    //       rowOrder: 0, // You may need to set appropriate default values
    //       billingItems: [], // You may need to set appropriate default values
    //     }));

    //   console.log("this is ", revertedArray);
    // }

    // if (dataView != null && dataView.sheet_rock_stock_house_levels) {
    //   // Parse the JSON string into an object
    //   const parsedData = JSON.parse(dataView.sheet_rock_stock_house_levels);

    //   if (Array.isArray(parsedData)) {
    //     // If the parsed data is an array, assign it to revertedArray
    //     revertedArray = parsedData;
    //   } else {
    //     // If the parsed data is not an array, convert it to an array with one element
    //     revertedArray = [parsedData];
    //   }
    //   return revertedArray;
    // }

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
      <>
        <select
          className="form-control input-sm"
          name="ddLabel1"
          // defaultValue="0"
          value={getSelectedBillingItem(index)}
          // onChange={(e) => onItemSelectChange(e, "billing_item", index)}
          onChange={(e) => {
            const selectedValue = e.target.value;
            console.log(selectedValue); // Log the selected value to the console
            onItemSelectChange(e, "billing_item", index);
          }}
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
      </>
    );
  };

  var formdata = formData;

  // var houselaveldata = formdata.houseLevels
  //   .map(
  //     (obj: {
  //       houseLevelTypeId: number;
  //       garage: number;
  //       isFireBarrier: number;
  //       rowOrder: number;
  //       billingItems: {
  //         billingItemId: number;
  //         itemValue: number | string;
  //         columnOrder: number;
  //       }[];
  //     }) => JSON.stringify(obj)
  //   )
  //   .join(",");
  var houselaveldata = JSON.stringify(formdata.houseLevels);
  console.log("this is top formdata details ", JSON.parse(houselaveldata));

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

  const renderBillingItemsHeaderPrint = (index: number) => {
    if (getSelectedBillingItemPrint(index) !== "") {
      return (
        <th
          style={{
            textAlign: "center",
            paddingRight: "5px",
            color: "blue",
            border: "none",
          }}
        >
          {getSelectedBillingItemPrint(index)}
        </th>
      );
    } else {
      return <></>;
    }
  };

  const renderHouseLevelTypesHeadingPrint = (index: number, value: any) => {
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
  const renderBillingItemsInputListPrint = (
    rowIndex: number,
    billingItems: any,
    readOnly: boolean = false
  ) => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(
        <>{renderBillingItemInputPrint(rowIndex, i, billingItems, readOnly)}</>
      );
    }
    return items;
  };

  const renderBillingItemInputPrint = (
    rowIndex: number,
    index: number,
    billingItems: any,
    readOnly: boolean
  ) => {
    const value = billingItems.filter((item: any) => {
      return billingItemsData.some(
        (singleItem: any) => item.columnOrder == index
      );
    });

    const itemValue = value.length ? value[0].itemValue : "0";
    if (getSelectedBillingItemPrint(index) !== "") {
      return (
        <td
          key={index}
          style={{
            textAlign: "center",
            color: "#000",
            border: "1px solid #606060",
          }}
        >
          {itemValue || 0}
        </td>
      );
    } else {
      return <></>;
    }
  };

  const renderBillingItemsSelectListPrint = () => {
    const items = [];
    items.push(<th style={{ border: "none", color: "blue" }}>&nbsp;</th>);

    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemsHeaderPrint(i)}</>);
    }
    return items;
  };
  const getSelectedBillingItemPrint = (index: number) => {
    const items = formData.houseLevels
      .filter((item: any) => {
        return item.billingItems.some(
          (singleItem: any) => singleItem.columnOrder == index
        );
      })
      .map((item: any) => {
        let singleItem = Object.assign({}, item);
        return singleItem.billingItems.filter(
          (subItem: any) => subItem.columnOrder == index
        );
      })
      .flat();

    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);

    return itemName.length > 0 ? itemName[0].billingItemName : "";
  };

  var builderName = getBuilderName(formdata.builderId, buildersData);

  console.log("builderName", builderName?.props?.children);

  var CeilingFinishName = getCeilingFinishName(
    formData.ceilingFinishId,
    ceilingFinishesData
  );

  var GarageFinishName = getGarageFinishName(
    formdata.garageFinishId,
    garageFinishesData
  );

  var GarageStallNameGet = getGarageStallName(
    formdata.garageStallId,
    garageStallsData
  );

  const result = formData?.options;

  const resultString = JSON.stringify(formData?.options);

  console.log(typeof resultString);

  console.log("Comma-separated options:", resultString);

  console.log(
    "builder name data",
    // getSupervisorName(formdata.supervisorId, usersData),
    // getCityName(formdata.cityId, citiesData),
    // getHouseTypeName(formdata.houseTypeId, houseTypesData),
    selectedText,
    formdata.garageStallId,
    getGarageStallName(formdata.garageStallId, garageStallsData),
    formdata.ceilingFinishId
  );
  // let Housetypedata: string;

  const ontextchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHousetypedata(e.target.value);
    console.log("Input Value:", Housetypedata);
  };
  const postData = async () => {
    const url = "https://2fd82c9861.nxcli.io/sdi-api/house-type-new-save";
    const data = {
      builder_id: formdata?.builderId,
      builder_value: builderName?.props?.children,
      house_type_id: "1",
      house_type_value: Housetypedata,
      garage_stalls_id: formdata?.garageStallId,
      garage_stalls_value: GarageStallNameGet?.props?.children,
      garage_finish_id: formdata?.garageFinishId,
      garage_finish_name: GarageFinishName?.props?.children,
      ceiling_finish_id: formdata?.ceilingFinishId,
      ceiling_finish_name: CeilingFinishName?.props?.children,
      sheet_rock_stock_house_levels: houselaveldata,
      house_total_12_inch:
        formdata?.total12 !== undefined ? formdata.total12.toString() : "",
      house_total_54_inch:
        formdata?.total54 !== undefined ? formdata.total54.toString() : "",
      garage_total_12_inch:
        formdata?.totalGarage12 !== undefined
          ? formdata.totalGarage12.toString()
          : "",
      garage_total_54_inch:
        formdata?.totalGarage54 !== undefined
          ? formdata.totalGarage54.toString()
          : "",
      options_available: resultString,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.ok) {
        closeModal();
      }
      const result = await response.json();
      console.log("Success:", result);

      // Ensure fetchData is defined somewhere in your code
      if (typeof fetchData === "function") {
        fetchData();
      } else {
        console.warn("fetchData function is not defined");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateHouseType = async (id: any) => {
    try {
      const response = await fetch(
        `https://2fd82c9861.nxcli.io/sdi-api/house-type-new/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            builder_id:
              formdata?.builderId === 0
                ? dataView?.builder_id
                : formdata?.builderId,
            builder_value: builderName?.props?.children,
            house_type_id: "1",
            house_type_value: Housetypedata,
            garage_stalls_id: formdata?.garageStallId,
            garage_stalls_value: GarageStallNameGet?.props?.children,
            garage_finish_id: formdata?.garageFinishId,
            garage_finish_name: GarageFinishName?.props?.children,
            ceiling_finish_id: formdata?.ceilingFinishId,
            ceiling_finish_name: CeilingFinishName?.props?.children,
            sheet_rock_stock_house_levels:
              houselaveldata !== undefined ? houselaveldata.toString() : "",
            house_total_12_inch:
              formdata?.total12 !== undefined
                ? formdata.total12.toString()
                : "",
            house_total_54_inch:
              formdata?.total54 !== undefined
                ? formdata.total54.toString()
                : "",
            garage_total_12_inch:
              formdata?.totalGarage12 !== undefined
                ? formdata.totalGarage12.toString()
                : "",
            garage_total_54_inch:
              formdata?.totalGarage54 !== undefined
                ? formdata.totalGarage54.toString()
                : "",
            options_available: resultString,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update house type");
      }

      const data = await response.json();
      console.log("Updated house type:", data);
      fetchData();
      // setformhide(true);
      closeModal();

      // Handle success
    } catch (error) {
      console.error("Error updating house type:");
      // Handle error
    }
  };

  const handleEditSave = () => {
    updateHouseType(dataView?.id);
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
        // console.log("thkkhskdfsadkfsdf", formData.id === 0);

        if (formData.id === 0) {
          setTimeout(() => {
            // History.push("/");
            // alert("done done ");
            // print();
            toast.success("Job order saved successfully");

            // handlePrint?.();
          }, 1500);
        }
      } else {
        await actions.updateJobOrder(formData);
        toast.success("Job order updated successfully");
        History.push("/");
      }
    } else {
      setJobOrderError(
        "Please fill all the required highlighted fields to SAVE data"
      );
      window.scrollTo(0, 0);
    }
  };

  const componentRef: any = useRef();

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

  const handleHouseTypeModalEdit = (e: any) => {
    setIsHouseTypeModalOpen(true);
  };

  const [jiochanged, setJiochanged] = useState(false);
  const [IsVerified, setIsVerified] = useState(!!formData.isVerified);

  // Event handler for dropdown change
  const handleDropdownChange = (event: any) => {
    // Get the selected option
    const selectedOption = event.target.options[event.target.selectedIndex];

    // Get the text of the selected option
    const text = selectedOption.innerText || selectedOption.textContent;

    // Update the state with the selected text
    setSelectedText(text);
  };

  // const button1Ref = (useRef < HTMLButtonElement) | (null > null); // Explicitly specify the type
  // const button2Ref = (useRef < HTMLButtonElement) | (null > null); // Explicitly specify the type

  // Event handler for button1 click
  const handleButtonClick1 = () => {
    // Simulate a click on button2
    // button2Ref.current?.click();
  };

  return (
    <>
      <ToastContainer />
      <div className="clear pad-40" />
      <div className="container job-order-container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row ">
                <div className="col-md-6">
                  <h3>
                    Add New House Type
                    {/* <br /> */}
                  </h3>
                </div>
                <div className="col-md-6 text-right">
                  <Button
                    className="btn btn-primary btn-sm"
                    // onClick={() => setformhide(!formhide)}
                    onClick={handleAddData}
                  >
                    Add House Type
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="clear pad-5" />
              {/* 
              <div className="table-responsive">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        {Object.keys(data[0]).map((key, index) => (
                          <th key={index}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          {Object.values(item).map((value, index) => (
                            <td key={index}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Builder</th>
                      <th>House Type</th>
                      <th>Garage Stalls</th>
                      <th>Garage Finish</th>
                      <th>Ceiling Finish</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item?.builder_value}</td>
                        <td>{item?.house_type_value}</td>
                        <td>{item?.garage_stalls_value}</td>
                        <td>{item?.garage_finish_name}</td>
                        <td>{item?.ceiling_finish_name}</td>
                        <td>
                          {/* <button
                            className="btn btn-danger btn-sm mr-5"
                            onClick={() => handleDeleteGet(item.id)}
                          >
                            Delete
                          </button> */}
                          <button
                            className="btn btn-primary btn-sm mr-5"
                            onClick={() => handleViewData(item.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-primary btn-sm "
                            onClick={() => handleViewdetails(item.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  marginTop: "100px",
                }}
              >
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Example Modal"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)", // Example: semi-transparent black
                      zIndex: 1000, // Your custom z-index
                    },
                    content: {
                      top: "25px",
                      left: "25px",
                      right: "25px",
                      bottom: "25px",
                      marginTop: "25px", // Your custom style
                      padding: "20px", // Example: padding around the content
                      borderRadius: "10px", // Example: rounded corners
                      zIndex: 1000, // Your custom z-index (optional, for content itself)
                    },
                  }}
                >
                  {/* {formhide === false ? ( */}
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
                          {/* <label className="checkbox-inline verifyCls">
                          <input
                            type="checkbox"
                            name="notVerified"
                            value="1"
                            disabled
                            checked
                          />
                          Un-Verified
                        </label> */}
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
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="text_blue">Builder Details</h4>
                      <h6 style={{ cursor: "pointer" }} onClick={closeModal}>
                        X
                      </h6>
                    </div>

                    <div className="clear pad-5" />
                    <div className="row">
                      <div className="form-group col-md-6 mb-10">
                        <label className="col-md-3 control-label">
                          Builder :<span className="text_red">*</span>
                        </label>
                        <div className="col-md-9">
                          <select
                            className={`form-control input-sm ${
                              submitted && !formData.builderId
                                ? "ap-required"
                                : ""
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
                          House Type :<span className="text_red">*</span>
                        </label>
                        <div className="col-md-9">
                          {/* <select
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
                        </select> */}

                          {/* <input
                          type="text"
                          name="House Type"
                          // value={}
                          onChange={(e) => onFormNumberChange(e)}
                          className={`form-control input-sm ${
                            submitted && !formData.total12 ? "" : ""
                          }`}
                          onKeyDown={(e) => handleEnter(e)}
                        /> */}
                          <input
                            type="text"
                            value={Housetypedata}
                            name="House Type"
                            onChange={(e) => ontextchange(e)}
                            className={`form-control input-sm ${
                              submitted && !formData.builderId
                                ? "ap-required"
                                : ""
                            }`}
                            onKeyDown={(e) => handleEnter(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row"></div>
                    <div className="row">
                      {/* <div className="form-group col-md-6 mb-10">
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
                    </div> */}
                      {/* <div className="form-group col-md-6 mb-10">
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
                            citiesData
                              .sort(sortIt("name"))
                              .map((singleCity) => (
                                <option
                                  key={singleCity.id}
                                  value={singleCity.id}
                                >
                                  {singleCity.name}
                                </option>
                              ))
                          ) : (
                            <></>
                          )}
                        </select>
                      </div>
                    </div> */}
                    </div>
                    <hr />

                    {/* <hr /> */}
                    <h4 className="text_blue">Schoenberger Drywall</h4>
                    <div className="clear pad-5" />
                    <div className="row">
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
                      {/* <div className="clear pad-10" />
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
                    </div> */}
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
                      {console.log(
                        "renderBillingItemsSelectList()",
                        renderBillingItemsSelectList()
                      )}
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

                          {/* {renderBillingItemsInputList(1, [])} */}
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
                      <div className="col-md-12 mt-20 text-right">
                        {/* <button
                        type="button"
                        className="btn btn-info btn-sm mr-5"
                        onClick={() => clearData()}
                        onKeyDown={(e) => handleEnter(e)}
                      >
                        <i className="fas fa-arrow-circle-left mr-5" />
                        Return to Schedules
                      </button> */}

                        {showsavebtn ? (
                          <button
                            className="btn btn-primary btn-sm mr-5"
                            type="button"
                            onClick={postData}
                          >
                            Save Details
                          </button>
                        ) : (
                          ""
                        )}

                        {showEditbtn ? (
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={handleEditSave}
                          >
                            Update Details
                          </button>
                        ) : (
                          ""
                        )}

                        {showEditbtn ? "" : ""}

                        {/* {formdata.id === 0 ? (
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          onKeyDown={(e) => handleEnter(e)}
                          // ref={button2Ref}
                        >
                          <i className="fas fa-save mr-5" />
                          Save & Print JIO
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          onKeyDown={(e) => handleEnter(e)}
                          // ref={button2Ref}
                        >
                          <i className="fas fa-save mr-5" />
                          Save
                        </button>
                      )} */}
                      </div>
                    </div>
                    {console.log("formdata", formData)}
                    <hr />
                  </form>
                  {/* ) : (
                ""
              )} */}
                </Modal>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "none" }}>
          <>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "-10px",
              }}
            >
              <tr></tr>
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
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "#fff 0px solid",
                }}
              >
                <>{renderBillingItemsSelectListPrint()}</>
                {formdata.houseLevels.length > 0 ? (
                  formdata.houseLevels.map((singleLevel: any, i: any) => (
                    <>
                      <tr key={i}>
                        {renderHouseLevelTypesHeadingPrint(
                          singleLevel.rowOrder,
                          singleLevel.houseLevelTypeId
                        )}
                        {renderBillingItemsInputListPrint(
                          singleLevel.rowOrder,
                          singleLevel.billingItems,
                          true
                        )}
                      </tr>
                    </>
                  ))
                ) : (
                  <></>
                )}
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
          </>
        </div>
      </div>
    </>
  );
};

AddHousetypedetails.propTypes = {};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddHousetypedetails);
