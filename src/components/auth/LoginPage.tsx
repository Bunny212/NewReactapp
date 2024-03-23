import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import * as authActions from '../../redux/actions/authActions';
import * as errorActions from '../../redux/actions/errorActions';
import PropTypes from 'prop-types';
import { Dispatch, bindActionCreators } from "redux";
import { ILoginPage, IAuthReduxProps, Target } from '../../types/interfaces';


const LoginPage = ({ isAuthenticated, error, actions }: ILoginPage) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const handleToggle = useCallback(() => {
    // Clear errors
    actions.clearErrors();
  }, [actions.clearErrors]);

  const handleChangeEmail = (e: Target) => setEmail(e.target.value);
  const handleChangePassword = (e: Target) => setPassword(e.target.value);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    actions.clearErrors();
    const user = { email, password };

    // Attempt to login
    actions.login(user);
  };

  useEffect(() => {
    // Check for register error
    const classList = document.body.classList;
    if (!classList.length && !localStorage.getItem("token")) {
      classList.add('login_bg');
    } else {
      classList.remove('login_bg');
    }

  }, []);

  useEffect(() => {
    // Check for register error
    // const classList = document.body.classList;
    // if (!classList.length && !localStorage.getItem("token")) {
    //   classList.add('login_bg');
    // }
    // else {
    //   classList.remove('login_bg');
    // }

    console.log('check', localStorage.getItem("token"));
    console.log('++++++++++++', error.msg);
    if (error.id === 'LOGIN_FAIL') {
      setMsg(error.msg);
    } else {
      setMsg(null);
    }

    // If authenticated, close modal
    // if (modal) {
    //   if (isAuthenticated) {
    //     handleToggle();
    //   }
    // }
  }, [error, handleToggle, isAuthenticated]);

  return (
    <>
      <div className="login_bg">
        <section className="login">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <h2 className="text-center"><img src="./images/logo.png" className="img-center" /></h2>
              <div className="clear pad-10"></div>
              <p className="text-center text_blck">
                Please contact us at Schoenberger Drywall, Inc. for user name and password information.
                </p>
            </div>
          </div>
          <div className="clear pad-10"></div>
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              {msg ? (
                <div className="alert alert-danger alert-dismissible">
                  <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                  <strong>Error!</strong> {msg}
                </div>
              ) : null}

              <form action="dashboard.html">
                <div className="form-group">
                  <label>User Name:</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="name"
                    placeholder="Email"
                    onChange={handleChangeEmail}
                  />
                </div>
                <div className="clear pad-5"></div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    onChange={handleChangePassword}
                  />
                </div>
                {/* <div className="row">
                        <div className="checkbox col-sm-6">
                            <label><input type="checkbox" /> Remember me here</label>
                        </div>
                        <div className="form-group col-sm-6 text-right mt-10">
                            <a href="#">Forgot Password?</a>
                        </div>
                    </div> */}
                <div className="clear pad-5"></div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block btn-rounded"
                  onClick={handleOnSubmit}
                >
                  login
                    </button>
              </form>
              <hr />
              <div className="text-center">Copyright &copy; Schoenberger Drywall, Inc. 2020</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

LoginPage.propTypes = {
  // articles: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    clearErrors: bindActionCreators(errorActions.clearErrors, dispatch),
    login: bindActionCreators(authActions.login, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
