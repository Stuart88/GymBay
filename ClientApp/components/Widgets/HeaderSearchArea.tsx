import * as React from "react";
import { OnMobile, UserLoggedIn, LogoutUser } from "../../Helpers/Functions";
import { UserState, Pages } from "../../Helpers/Globals";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { CoachSearchAutosuggest } from "./CoachSearchAutosuggest";
import { GymSearchAutosuggest } from "./GymSearchAutosuggest";
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import '../../css/searchBar.css';
import { UserNavMenu } from "../NavMenu";
import { Icon, IconType } from "./Widgets";

interface HeaderBarProps {
    Props: RouteComponentProps<any>
}

interface HeaderBarState {
    ToggleChecked: boolean
    UserMenuOpen: boolean
}


export class HeaderSearchBarArea extends React.Component<HeaderBarProps, HeaderBarState>{

    constructor(props) {
        super(props);

        this.state = {
            ToggleChecked: false,
            UserMenuOpen: false
        }

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    public render() {
        return OnMobile()
            ? this.renderMobile()
            : this.renderDesktop();
    }

    public renderDesktop() {

        let profileSRC = UserState.Profile.profilePic
            ? UserState.Profile.profilePic
            : `/dist/images/users/default-user.jpg`;

        return <div>
            <UserNavMenu profileMenuOpen={this.state.UserMenuOpen} toggleMenu={this.toggleMenu} />

            <div className="homeSearchBar">


            <div className="searchBarDesktopRow" >

                <div className="" style={{ padding: '0' }}>
                    <NavLink to={Pages.home}>
                        <img className="searchBarLogo" src="/dist/images/Gym-Bay_logo.png" />
                    </NavLink>
                    <NavLink className="searchBarLink" exact to={Pages.home} activeClassName='searchBarLinkActive' >
                        Home
                            </NavLink>
                    <NavLink className="searchBarLink" to={Pages.gymfinder} activeClassName='searchBarLinkActive' >
                         Gyms
                            </NavLink>
                    <NavLink className="searchBarLink" to={Pages.coachfinder} activeClassName='searchBarLinkActive' >
                        Coaches
                            </NavLink>
                </div>


                <div className="" >

                    <div className="" style={{ minWidth: '300px', }}>
                        {
                            this.state.ToggleChecked
                                    ? <CoachSearchAutosuggest CoachSelected={(c) => this.props.Props.history.push(`${Pages.viewCoach}/${c.id}/${c.name}`)} />
                                    : <GymSearchAutosuggest GymSelected={(g) => this.props.Props.history.push(`${Pages.viewgym}/${g.id}/${g.name}`)} />
                        }
                    </div>
                    

                    <label className="homeToggleLabel">
                        <Toggle
                            className="homeGymToggle"
                            defaultChecked={this.state.ToggleChecked}
                            icons={{
                                checked: <div className="homeGymToggleIcon">C</div>,
                                unchecked: <div className="homeGymToggleIcon">G</div>,
                            }}
                            onChange={() => {
                                this.setState({
                                    ToggleChecked: !this.state.ToggleChecked
                                })
                            }} />
                    </label>
                </div>
              
                <div className="" style={{ padding: '0' }}>

                    <div hidden={!UserLoggedIn()} style={{
                        display: 'flex',
                        alignItems: 'center'
                        }}>
                            <a className="hover-pointer" onClick={() => this.toggleMenu(!this.state.UserMenuOpen)} >
                                <img className="avatarIcon" style={{ backgroundColor: 'white' }} src={profileSRC} />
                        </a>

                        <div className="logoutBtn" onClick={() => LogoutUser(() => this.props.Props.history.push(Pages.home))}>Logout</div>

                    </div>



                        <NavLink className="loginBtn" hidden={UserLoggedIn()} to={{
                            pathname: Pages.dashboard,
                            state: { returnPath: this.props.Props.location.pathname }
                        }} >
                        Login
                        </NavLink>

                       
                    </div>

                    <div className="socialBtnsContainer">
                        <a href="https://www.facebook.com/thegymbay" className="" target="_blank">
                            <Icon Hidden={false} Name="facebook" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                        </a>
                        <a href="https://www.instagram.com/the_gymbay" className="" target="_blank">
                            <Icon Hidden={false} Name="instagram" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                        </a>
                        <a href="mailto:thegymbay@gmail.com" className="" target="_blank">
                            <Icon Hidden={false} Name="email" Class="profileSocialIcon" Type={IconType.SocialWhite} />
                        </a>
                    </div>
            </div>
            </div>
        </div>
    }

    public renderMobile() {
        return <div className="homeSearchBar">
            <div className="row" style={{ width: '100%' }}>


                <div className="col-9" style={{ padding: '0 2%' }}>
                    {
                        this.state.ToggleChecked
                            ? <CoachSearchAutosuggest CoachSelected={(c) => this.props.Props.history.push(`${Pages.viewCoach}/${c.id}/${c.name}`)} />
                            : <GymSearchAutosuggest GymSelected={(g) => this.props.Props.history.push(`${Pages.viewgym}/${g.id}/${g.name}`)} />
                    }
                </div>

                <div className="col-3" style={{ padding: '0 2%' }}>
                    <label className="adminGymToggleLabel">
                        <Toggle
                            className="homeGymToggle"
                            defaultChecked={this.state.ToggleChecked}
                            icons={{
                                checked: <div className="homeGymToggleIcon">C</div>,
                                unchecked: <div className="homeGymToggleIcon">G</div>,
                            }}
                            onChange={() => {
                                this.setState({
                                    ToggleChecked: !this.state.ToggleChecked
                                })
                            }} />
                    </label>

                   
                </div>

            </div>
        </div>
    }

    private toggleMenu(open: boolean) {
        this.setState({
            UserMenuOpen: open
        })
    }
}