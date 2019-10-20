import * as React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/dashNavMenu.css';
import { Pages } from '../../Helpers/Globals';
import { OnMobile } from '../../Helpers/Functions';

export class DashboardNav extends React.Component<{}, {}> {
    public render() {
        return <div hidden={true} className='dashmenuContainer'>
            <NavLink className="dashMenuLink" to={Pages.profile} exact activeClassName='dashMenuActive' >
                <span className='glyphicon glyphicon-home'></span> Profile
                            </NavLink>
            <NavLink className="dashMenuLink" to={Pages.mygym} exact activeClassName='dashMenuActive' >
                <span className='glyphicon glyphicon-home'></span> My Gym
                            </NavLink>
            <NavLink className="dashMenuLink" to={Pages.forum} activeClassName='dashMenuActive' >
                <span className='glyphicon glyphicon-education'></span> Gym Forum
                            </NavLink>
            <NavLink className="dashMenuLink" to={Pages.gymshop} activeClassName='dashMenuActive' >
                <span className='glyphicon glyphicon-education'></span> Gym Shop
                            </NavLink>
            <NavLink className="dashMenuLink" to={Pages.gymreview} activeClassName='dashMenuActive' >
                <span className='glyphicon glyphicon-education'></span> Reviews
                            </NavLink>

        </div>
    }
}