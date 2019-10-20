import * as React from 'react';
import { NavMenu, UserNavMenu } from './NavMenu';
import { OnMobile, UserLoggedIn, LogoutUser, ClickElement } from '../Helpers/Functions';
import { Colours, CSSValues, UserState, Pages } from '../Helpers/Globals';
import { Link, NavLink } from 'react-router-dom';

export interface LayoutProps {
    children?: React.ReactNode;
}

interface LayoutState {
    mobileMenuOpen: boolean
}

export const burgerMenuWidth = 300;

export class Layout extends React.Component<LayoutProps, LayoutState> {
    constructor(props) {
        super(props);

        this.state = {
            mobileMenuOpen: false
        }

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    componentWillMount() {
        UserState.FetchProfile();
    }

    public render() {
        let onMobile = OnMobile();

        let outercontainerStyle: React.CSSProperties = {
            width: '100%',
            height: '100vh'
        }

        let mainContainerStyle: React.CSSProperties = {
            width: '100%'
        }

        let profileSRC = UserState.Profile.profilePic
            ? UserState.Profile.profilePic
            : `/dist/images/users/default-user.jpg`;

        return <div id="outer-container" className="row" style={outercontainerStyle}>

            <NavMenu />

            <UserNavMenu profileMenuOpen={this.state.mobileMenuOpen} toggleMenu={this.toggleMenu} />

            <div id="page-wrap" className={'col-12'} style={mainContainerStyle}>
                {
                    onMobile ? <div className="navMenuMobileTopBar" style={{
                        height: CSSValues.TopBarHeight,
                    }}>
                        <Link to='/' >
                            <img style={{
                                margin: 'auto',
                                height: '50px',
                                display: 'block',
                                padding: '2px'
                            }}
                                className="img-fluid"
                                src="/dist/images/Gym-Bay_logo.png" />
                        </Link>

                        <div className=""
                            style={{
                                position: 'absolute',
                                top: 6,
                                right: 10
                            }}>

                            <div hidden={!UserLoggedIn()} style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>

                                <a onClick={() => this.toggleMenu(!this.state.mobileMenuOpen)} >
                                    <img key={UserState.Profile.profilePic} className="avatarIcon" src={profileSRC} />
                                </a>

                            </div>

                            <NavLink hidden={UserLoggedIn()} to={Pages.dashboard} >
                                <button className="loginBtn">Login</button>
                            </NavLink>

                        </div>

                    </div>
                        : null
                }
                <div style={{
                    marginTop: `calc(${CSSValues.TopBarHeight} + ${CSSValues.SearchBarHeight})`,
                    height: `calc(100vh - ${CSSValues.TopBarHeight} - ${CSSValues.SearchBarHeight})`,
                    overflowY: 'auto'
                }}>

                    {this.props.children}
                </div>
            </div>

        </div>;
    }

    private toggleMenu(open: boolean) {
        this.setState({
            mobileMenuOpen: open
        })
    }
}