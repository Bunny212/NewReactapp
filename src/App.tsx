import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/common/Header";
import History from "./components/common/History";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/auth/LoginPage";
import PageNotFound from "./components/PageNotFound";
import ArticleList from "./components/ArticleList";
import UserPage from "./components/UserPage";
import CityPage from "./components/city/CityPage";
import RatePlanPage from "./components/rate-plan/RatePlanPage";
import RatePlanPages from "./components/rate-plan/RatePlanPages";
import InvoicePage from "./components/invoices/InvoicePage";
import InvoiceallPage from "./components/invoiceall/InvoiceallPage";
import DeliveredByPage from "./components/delivered-by/DeliveredByPage";
import HouseTypePage from "./components/house-type/HouseTypePage";
import GarageFinishPage from "./components/garage-finish/GarageFinishPage";
import GarageStallPage from "./components/garage-stall/GarageStallPage";
import OptionPage from "./components/option/OptionPage";
import VaultPage from "./components/vault/VaultPage";
import BuilderPage from "./components/builder/BuilderPage";
import CeilingFinish from "./components/ceiling-finish/CeilingFinishPage";
import JobOrderPage from "./components/job-order/JobOrderPage";
import SchedulePage from "./components/schedule/SchedulePage";
import HangerPage from "./components/hanger/HangerPage";
import SprayerPage from "./components/sprayer/SprayerPage";
import GaragePage from "./components/garage/GaragePage";
import BillingItemPage from "./components/billing-item/BillingItemPage";
import HouseLevelTypePage from "./components/house-level-type/HouseLevelTypePage";
import ReportPage from "./components/report/ReportPage";
// for every call, get user details
import store from "./redux/store";
import { loadUser } from "./redux/actions/authActions";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./Bootstrap.css";
import "./Style.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// const protectedComponent = () => {
//   if (!localStorage.getItem("token"))
//     return (<><Redirect to='/login' /></>)
//   }
// }
// const loginRedirect = () => {
//   if (!localStorage.getItem("token")) {
//     return (
//       <>
//         <Redirect to='/login' />
//       </>
//     );
//   }
// };

const App = () => {
  // const protectedComponent = () => {
  //   if (!localStorage.getItem("token"))
  //     return (<><Redirect to='/login' /></>)
  //   }
  // }
  // useEffect(() => {

  //   if (!localStorage.getItem("token") && window.location.pathname !== '/login') {
  //   // console.log(location.pathname);

  //     window.location.href = '/login';
  //     // return History.push('/login');
  //     // return <Redirect to='/login' />
  //   }
  //   // loginRedirect();
  //   store.dispatch(loadUser());
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && window.location.pathname !== "/login") {
      History.push("/login");
    }

    store.dispatch(loadUser());
  }, [localStorage.getItem("token")]);

  return (
    <>
      <Router history={History}>
        <Header />
        <ToastContainer />
        <Switch>
          <PrivateRoute path="/home" component={HomePage} />
          <Route exact path="/" component={SchedulePage} />
          {/* <Route exact path="/" component={HomePage} /> */}
          <PublicRoute path="/login" component={LoginPage} />
          <PrivateRoute path="/users" component={UserPage} />
          <PrivateRoute path="/articles" component={ArticleList} />
          <PrivateRoute path="/cities" component={CityPage} />
          <PrivateRoute path="/rate-plan" component={RatePlanPages} />
          <PrivateRoute path="/rate-plans" component={RatePlanPage} />
          <PrivateRoute path="/invoices" component={InvoicePage} />
          <PrivateRoute
            path="/invoiceall/:job_id?"
            component={InvoiceallPage}
          />
          <PrivateRoute path="/delivered-by" component={DeliveredByPage} />
          <PrivateRoute path="/house-types" component={HouseTypePage} />
          <PrivateRoute path="/garage-finishes" component={GarageFinishPage} />
          <PrivateRoute path="/garage-stalls" component={GarageStallPage} />
          <PrivateRoute path="/options" component={OptionPage} />
          <PrivateRoute path="/vaults" component={VaultPage} />
          <PrivateRoute path="/builders" component={BuilderPage} />
          <PrivateRoute path="/ceiling-finishes" component={CeilingFinish} />
          <PrivateRoute path="/job-orders/:id?" component={JobOrderPage} />
          <PrivateRoute path="/garage" component={GaragePage} />
          <PrivateRoute path="/billing-items" component={BillingItemPage} />
          <PrivateRoute
            path="/house-level-types"
            component={HouseLevelTypePage}
          />
          <PrivateRoute path="/reports" component={ReportPage} />

          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
