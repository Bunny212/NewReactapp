import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../../redux/actions/authActions';
import PropTypes from 'prop-types';
import { Dispatch , bindActionCreators } from "redux";
import { ILogoutProps } from '../../types/interfaces';


const Logout = ({actions}: ILogoutProps) => {

    
    const handleClick = (e: any) => {
        e.preventDefault();
        actions.logout();
    };

    return (
    <>
    <li>
        <a
            href="#"
            onClick={(e) => handleClick(e)}
        >
            Logout
        </a>
    </li>
    </>
    );
};

Logout.propTypes = {
  // actions: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    logout: bindActionCreators(authActions.logout, dispatch)
  }
});

export default connect(
    null,
    mapDispatchToProps
  )(Logout);
