import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './MainNavigation.css';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

const MainNavigation = props => {
    const [drawerIsOpen, setDrawerOpen] = useState(false);

    const openSideDrawerHandler = () => {
        setDrawerOpen(true);
    };

    const closeSideDrawerHandler = () => {
        setDrawerOpen(false);
    };

    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeSideDrawerHandler}/>}
            <SideDrawer show={drawerIsOpen} onClick={closeSideDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer> 
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openSideDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;