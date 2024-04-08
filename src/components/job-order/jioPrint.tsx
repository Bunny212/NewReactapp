import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-bootstrap-date-picker';
import moment from "moment";
// import { useReactToPrint } from 'react-to-print';
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
// import Print from '../common/Print';

import PropTypes from "prop-types";
import {
  JobOrderReduxProps,
  JobOrderList,
  JobOrder,
  Target,
} from "../../types/interfaces";

const JioPrint = ({
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
}: JobOrderList) => {
  const id = useParams();
  // const id = 123;
  // props.id
  // console.log("soooooo+++++++++++=", id);
  // console.log('---------', jobOrders);
  // console.log(props.id);

  useEffect(
    () => {
      // if(id !== undefined) {
      // console.log(jobOrders);
      const jid: number = id !== undefined ? +id : 0;
      //   actions.getJobOrder(jid);
      //   console.log('yes working');
      // }

      // actions.getAllJobOrders();
      // actions.getAllBuilders();
      // actions.getUsers();
      // actions.getAllHouseTypes();
      // actions.getAllCities();
      // actions.getAllDeliveredBy();
      // actions.getAllGarageStalls();
      // actions.getAllCeilingFinishes();
      // actions.getAllGarageFinishes();
      // actions.getAllVaults();
      // actions.getAllOptions();
      // actions.getJobOrder(jid);
    },
    [
      // actions.getAllJobOrders,
      // actions.getAllBuilders,
      // actions.getUsers,
      // actions.getAllHouseTypes,
      // actions.getAllCities,
      // actions.getAllDeliveredBy,
      // actions.getAllGarageStalls,
      // actions.getAllCeilingFinishes,
      // actions.getAllGarageFinishes,
      // actions.getAllVaults,
      // actions.getAllOptions,
      // actions.getJobOrder,
    ]
  );

  // // interface ParamTypes {
  // //   id: string
  // // }
  // let { id } = useParams();
  // console.log(id);
  // // var jid: number = +id;
  // // console.log(this.props.params.id);

  const setFormDataState = () => {
    if (jobOrders.activeJobOrder.id !== undefined) {
      setFormData({ ...defaultState, ...jobOrders.activeJobOrder });
    }
  };
  const jid: number = id !== undefined ? +id : 0;
  useEffect(() => {
    setOptionsData(jobOrders.activeJobOrder.options);
    console.log("joborders options =>", jobOrders.activeJobOrder.options);
    // console.log(typeof id);
    // const jid = parseInt(id);
    // const jid: number = parseInt(id, 10);
    // if(id !== undefined) {
    //   const jid: number = +id;
    // actions.getJobOrder(jid);
    setFormDataState();
    //   console.log('yes working');
    // }
  }, [
    jobOrders.activeJobOrder,
    // actions.getJobOrder
  ]);

  // console.log(id);
  const defaultState = {
    id: 0,
    builderId: 0,
    builderName: "",
    supervisorId: 0,
    name: "",
    houseTypeId: 0,
    address: "",
    cityId: 0,
    cityName: "",

    deliveryDate: "",
    deliveryTime: "",
    deliveredById: 0,
    deliveredByName: "",
    sanderDate: "",
    hangerStartDate: "",
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
    house4x12: 0,
    house4x12o: 0,
    house54: 0,
    garage4x12: 0,
    garage4x12o: 0,
    garage54: 0,

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

    houseLevels: [],

    options: [],
    additionalInfo: "",
    jobStatus: "",
    gigStatus: "",

    status: 1,
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const initOptions: any = [];
  const [optionsData, setOptionsData] = useState(initOptions);

  const clearData = () => {
    setSubmitted(false);
    setFormData({ ...defaultState });
  };

  const handleDelete = (e: any, id: number) => {
    e.preventDefault();
    actions.deleteJobOrder(id);
  };

  const handleEdit = (e: any, jobOrder: JobOrder) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...jobOrder });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const onDateChange = (date: any, name: string) => {
    setFormData({ ...formData, [name]: moment(date).format("YYYY-MM-DD") });
  };

  const onMultiSelectChange = (value: any, name: string) => {
    if (value === null) {
      setFormData({ ...formData, [name]: [] });
    } else {
      setFormData({ ...formData, [name]: [...value] });
    }
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name) {
      if (!formData.id) {
        actions.addJobOrder(formData);
      } else {
        actions.updateJobOrder(formData);
      }
    }
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

  const getDeliveredByName = (deliveredById: any, deliveredByData: any) => {
    const deliveredBy = deliveredByData.filter(
      (singleDeliveredBy: any) => singleDeliveredBy.id === deliveredById
    );
    const deliveredByName = deliveredBy.length ? deliveredBy[0].name : "";
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
  // const { options: optionsData1 } = options;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;

  // const componentRef:any = useRef();

  // const handlePrintClick = () => {
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });
  // const handlePrint = 'test';
  // console.log('yes');
  // return handlePrint;
  // };
  // const Example = () => {

  // return (
  //   <div>
  //     <ComponentToPrint ref={componentRef} />
  //     <button onClick={handlePrint}>Print this out!</button>
  //   </div>
  // );
  // };

  const [hiddenprint, sethiddenprint] = useState(true);

  const renderBillingItemsSelectList = () => {
    const items = [];
    items.push(<th style={{ border: "none", color: "blue" }}>&nbsp;</th>);

    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemsHeader(i)}</>);
    }
    return items;
  };

  const getSelectedBillingItem = (index: number) => {
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

  const renderBillingItemsHeader = (index: number) => {
    if (getSelectedBillingItem(index) !== "") {
      return (
        <th
          style={{
            textAlign: "center",
            paddingRight: "5px",
            color: "blue",
            border: "none",
          }}
        >
          {getSelectedBillingItem(index)}
        </th>
      );
    } else {
      return <></>;
    }
  };

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

  const renderBillingItemsInputList = (
    rowIndex: number,
    billingItems: any,
    readOnly: boolean = false
  ) => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(
        <>{renderBillingItemInput(rowIndex, i, billingItems, readOnly)}</>
      );
    }
    return items;
  };

  const renderBillingItemInput = (
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
    if (getSelectedBillingItem(index) !== "") {
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

  return (
    <div>
      <div
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
                {getBuilderName(formData.builderId, buildersData)}
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
                {getSupervisorName(formData.supervisorId, usersData)}
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
                {formData.name || ""}
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
                {getHouseTypeName(formData.houseTypeId, houseTypesData)}
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
                {formData.address || ""}
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
                {getCityName(formData.cityId, citiesData)}
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
                {!!formData.deliveryDate
                  ? moment(formData.deliveryDate).format("MM/DD/YYYY")
                  : null}{" "}
                &nbsp;:&nbsp;{" "}
                {!!formData.deliveryTime ? formData.deliveryTime : null}
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
                {getDeliveredByName(formData.deliveredById, deliveredByData)}
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
                {!!formData.hangerStartDate
                  ? moment(formData.hangerStartDate).format("MM/DD/YYYY")
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
                {!!formData.sanderDate
                  ? moment(formData.sanderDate).format("MM/DD/YYYY")
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
                {!!formData.paintStartDate
                  ? moment(formData.paintStartDate).format("MM/DD/YYYY")
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
                {getGarageStallName(formData.garageStallId, garageStallsData)}
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
                {!!formData.walkthroughDate
                  ? moment(formData.walkthroughDate).format("MM/DD/YYYY")
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
                {getCeilingFinishName(
                  formData.ceilingFinishId,
                  ceilingFinishesData
                )}
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
                  formData.garageFinishId,
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
                style={{ textAlign: "left", paddingLeft: "5px", color: "#000" }}
              >
                <input
                  type="checkbox"
                  name="electric"
                  checked={formData.electric === 1 ? true : false}
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
                style={{ textAlign: "left", paddingLeft: "5px", color: "#000" }}
              >
                <input
                  type="checkbox"
                  name="heat"
                  checked={formData.heat === 1 ? true : false}
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
                style={{ textAlign: "left", paddingLeft: "5px", color: "#000" }}
              >
                <input
                  type="checkbox"
                  checked={formData.basement === 1 ? true : false}
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
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "#fff 0px solid",
            }}
          >
            <tr>{renderBillingItemsSelectList()}</tr>
            {formData.houseLevels.length > 0 ? (
              formData.houseLevels.map((singleLevel: any, i: any) => (
                <>
                  <tr key={i}>
                    {renderHouseLevelTypesHeading(
                      singleLevel.rowOrder,
                      singleLevel.houseLevelTypeId
                    )}
                    {renderBillingItemsInputList(
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
                {formData.total12 || 0}
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
                {formData.total54 || 0}
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
                {formData.totalGar12 || 0}
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
                {formData.totalGar54 || 0}
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
                {formData.totalOvers || 0}
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
                {formData.totalGarage12 || 0}
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
                {formData.totalGarage54 || 0}
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
                {formData.totalGarageGar12 || 0}
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
                {formData.totalGarageGar54 || 0}
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
                {formData.totalGarageOvers || 0}
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
                  {formData.options.length > 0 ? (
                    formData.options.map((value: any) => {
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
              value={formData.additionalInfo || ""}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

JioPrint.propTypes = {
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
    getAllBuilders: bindActionCreators(BuilderActions.getAllBuilders, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
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
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JioPrint);
