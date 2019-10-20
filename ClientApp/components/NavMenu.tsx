import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { OnMobile, AdminLoggedIn, UserLoggedIn, LogoutUser } from '../Helpers/Functions';
import '../css/burger-menu.css';
import '../css/navMenu.css';
import { burgerMenuWidth } from './Layout';
import { Pages, UserState } from '../Helpers/Globals';
import { Icon, IconType } from './Widgets/Widgets';
import { UserProfile } from '../data/serverModels';

interface MenuState {
    siteMenuOpen: boolean;
}



export class NavMenu extends React.Component<{}, MenuState> {

    constructor(props) {
        super(props);

        this.state = {
            siteMenuOpen: false
        }

        this.closeMenu = this.closeMenu.bind(this);
    }

    private closeMenu() {
        this.setState({ siteMenuOpen:false})
    }

    private renderMenuOptions() {
        return <div>
            <Link to='/' onClick={this.closeMenu}>
                <img id="menu-logo" className="img-fluid" src='/dist/images/Gym-Bay_logo.png' />
            </Link>
            <ul className='nav navbar-nav menuOptions'>
                <li>
                    <NavLink className="navMenuLink" to={Pages.home} exact activeClassName='navMenuActive' onClick={this.closeMenu}>
                         Home
                            </NavLink>
                </li>
                {
                    UserLoggedIn()
                        ? <li>
                            <NavLink className="navMenuLink" to={Pages.profile} exact activeClassName='navMenuActive' onClick={this.closeMenu}>
                                 Profile
                            </NavLink>
                        </li>
                        : <li>
                            <NavLink className="navMenuLink" to={Pages.dashboard} exact activeClassName='navMenuActive' onClick={this.closeMenu}>
                                 Dashboard
                            </NavLink>
                        </li>
                }
               
                <li>
                    <NavLink className="navMenuLink" to={Pages.gymfinder} activeClassName='navMenuActive' onClick={this.closeMenu}>
                         Gym Finder
                            </NavLink>
                </li>
                <li>
                    <NavLink className="navMenuLink" to={Pages.coachfinder} activeClassName='navMenuActive' onClick={this.closeMenu}>
                         Coach Finder
                            </NavLink>
                </li>
               
                <li>
                    <NavLink className="navMenuLink" to={Pages.about} activeClassName='navMenuActive' onClick={this.closeMenu}>
                         About
                            </NavLink>
                </li>               
            </ul>

            <div className="contactIconsDiv">
                <a href="https://www.instagram.com/the_gymbay" className=""  target="_blank">
                    <Icon Hidden={false} Name="instagram" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                </a>
                <a href="mailto:thegymbay@gmail.com" className=""  target="_blank">
                    <Icon Hidden={false} Name="email" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                </a>
                <a href="https://www.facebook.com/thegymbay" className="" target="_blank">
                    <Icon Hidden={false} Name="facebook" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                </a>
                <div style={{ marginTop: '5px', color: 'white', fontSize: '14px' }}>
                    Ⓒ {new Date().getFullYear()} gym-bay.com
                </div>
            </div>
        </div>
    }



    public render() {



        return OnMobile()
            ? < Menu
                id="publicMenu"
                //key={this.state.siteMenuOpen ? 1 : 0}
                pageWrapId={"page-wrap"}
                outerContainerId={"outer-container"}
                isOpen={this.state.siteMenuOpen}
                width={burgerMenuWidth}
                onStateChange={(newState) => this.setState({ siteMenuOpen: newState.isOpen })}
            >

                {this.renderMenuOptions()}

            </Menu>
            : null

       
    }
}



interface UserNavMenuState {
    profileMenuOpen: boolean;
}
interface UserNavMenuProps {
    toggleMenu: Function,
    profileMenuOpen: boolean
}


export class UserNavMenu extends React.Component<UserNavMenuProps, UserNavMenuState> {

    constructor(props) {
        super(props);

        this.state = {
            profileMenuOpen: this.props.profileMenuOpen
        }

        this.closeMenu = this.closeMenu.bind(this);
    }

    shouldComponentUpdate() {

        this.setState({
            profileMenuOpen: this.props.profileMenuOpen
        })

        return true;
    }

    private closeMenu() {
        this.setState({ profileMenuOpen: false })
        this.props.toggleMenu(false);
    }

    private renderMenuOptions() {
        return <div >
            <Link to={Pages.profile} onClick={this.closeMenu}>
                <img key={UserState.GetProfilePic()} id="menu-logo" className="img-fluid" src={UserState.GetProfilePic()} />
            </Link>
            <ul className='nav navbar-nav menuOptions'>
                <li>
                    <NavLink className="navMenuLink" to={Pages.profile} activeClassName='navMenuActive' onClick={this.closeMenu}>
                        My Profile
                            </NavLink>
                </li>
                

                <li>
                    <NavLink className="navMenuLink" to={Pages.mygym} activeClassName='navMenuActive' onClick={this.closeMenu}>
                        My Gym
                            </NavLink>
                </li>

                <li>
                    <NavLink className="navMenuLink" to={Pages.home} exact  onClick={() => { LogoutUser(() => { this.closeMenu() }) }}>
                        Logout
                            </NavLink>
                </li>
               
            </ul>

         
        </div>
    }



    public render() {



        return <div id = "profileMenu" >
            <Menu
                //key={this.state.siteMenuOpen ? 1 : 0}

                pageWrapId={"page-wrap"}
                outerContainerId={"outer-container"}
                isOpen={this.props.profileMenuOpen}
                width={burgerMenuWidth}
                onStateChange={(newState) => { this.setState({ profileMenuOpen: newState.isOpen }); this.props.toggleMenu(newState.isOpen) }}
                right
            >

                {this.renderMenuOptions()}

            </Menu>
            </div>


    }
}



// 20190912142514
// https://sendeyo.com/up/4da3ab229c18863b988ddb9936fa57b1.json

