import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { UserLoggedIn, CreateAuthHeaderObject, LogoutUser, OnMobile } from '../../Helpers/Functions';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { HttpResult, UserStatus } from '../../data/serverModels';
import { Loader } from '../Widgets/Loaders';
import { SiteDetails, Pages, UserState } from '../../Helpers/Globals';
import { DashboardNav } from './DashboardNav';
import { Icon, IconType } from '../Widgets/Widgets';
import '../../css/loginPage.css';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';

interface ModuleState {
    SignupValidationText: string;
    Loading: boolean;
    LoggedIn: boolean; //need this here ( instead of UserLoggedIn() ) so state change can be recognised after login complete
    NewUser: boolean;//set to true/false after login
    ReturnTo: string;
    ReturnState: any;
}

export enum LoginOptionsEnum {
    General = "",
    Gym = "addgym",
    Coach = "coach"
}

export class Dashboard extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);

        if (UserLoggedIn())
            this.props.history.push(Pages.home);

        let returnTo = this.props.location.state ? this.props.location.state.returnPath : Pages.home;
        let returnState = this.props.location.state && this.props.location.state.returnState
            ? this.props.location.state.returnState
            : {};

        console.log(returnTo);

        this.state = {
            SignupValidationText: "",
            Loading: false,
            LoggedIn: UserLoggedIn(),
            NewUser: false,
            ReturnTo: returnTo,
            ReturnState: returnState
        }

        this.FBresponse = this.FBresponse.bind(this);
        this.LogoutSuccess = this.LogoutSuccess.bind(this);
        this.GoogleResponse = this.GoogleResponse.bind(this);
    }

    private GoogleResponse(response: any) {
        //console.log(response);
        if (!response.profileObj) {
            this.setState({
                SignupValidationText: "Login failed!"
            })
        }
        else {
            let loginData = new GoogleLoginData();
            loginData.Name = response.profileObj.name;
            loginData.PicURL = response.profileObj.imageUrl;

            let email = response.profileObj.email;

            this.setState({
                Loading: true,
                SignupValidationText: "",
            })

            let authHeader = CreateAuthHeaderObject(email, "", loginData.ToForm());

            fetch('api/User/GoogleLogin', authHeader)
                .then(response => response.json() as Promise<HttpResult<{ newUser: boolean }>>)
                .then(data => {
                    if (data.ok) {
                        UserState.FetchProfile();

                        this.props.history.push({ pathname: this.state.ReturnTo, state: this.state.ReturnState });
                    }
                    else {
                        this.setState({
                            SignupValidationText: data.message,
                            Loading: false
                        })
                    }
                }).catch((e: Error) => {
                    this.setState({
                        SignupValidationText: e.message,
                    })
                })
        }
    }

    private FBresponse(response: any) {
        if (!response.email) {
            this.setState({
                SignupValidationText: "Facebook login failed!",
            })
        }
        else {
            let fbData = new FBLoginData();
            fbData.FirstName = response.first_name;
            fbData.LastName = response.last_name;
            fbData.PicURL = `http://graph.facebook.com/${response.id}/picture?type=large`;
            let email = response.email;

            this.setState({
                Loading: true,
                SignupValidationText: "",
            })

            let authHeader = CreateAuthHeaderObject(email, "", fbData.ToForm());

            fetch('api/User/FacebookLogin', authHeader)
                .then(response => response.json() as Promise<HttpResult<{ newUser: boolean }>>)
                .then(data => {
                    if (data.ok) {
                        UserState.FetchProfile();

                        this.props.history.push({ pathname: this.state.ReturnTo, state: this.state.ReturnState });
                        this.props.history.push({ pathname: this.state.ReturnTo, state: this.state.ReturnState });
                    }
                    else {
                        this.setState({
                            SignupValidationText: data.message,
                            Loading: false
                        })
                    }
                }).catch((e: Error) => {
                    this.setState({
                        SignupValidationText: e.message,
                    })
                })
        }
    }

    componentDidMount() {
        if (location.search.indexOf("code") > -1)
            location.search = 'dashboard';//remove code stuff from browser URL after oauth login, otherwise page refresh throws error
    }

    private LinkedInLoginStart() {
        var data = {
            response_type: 'code',
            client_id: '81jgok12c4g7jl',
            redirect_uri: location.href.indexOf('localhost') > -1 ? 'http://localhost:59850/' : `${SiteDetails.SiteURL}`,
            state: "",
            scope: 'r_emailaddress%20r_liteprofile'
        };

        window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=${data.response_type}&client_id=${data.client_id}&redirect_uri=${data.redirect_uri}&state=&scope=${data.scope}`, '_self');
    }

    private LogoutSuccess() {
        this.setState({
            LoggedIn: false,
            NewUser: false,
            Loading: false
        })
    }

    public render() {
        let googleStyle: React.CSSProperties = {
            backgroundColor: 'rgb(234, 39, 39)',
            color: 'white',
            opacity: 0.9
        }

        let googleLogin = <GoogleLogin

            style={googleStyle}
            clientId="494990878218-qj14itjmckd44gf002pb2racnjlpd5sq.apps.googleusercontent.com"
            buttonText="Google Login"
            onSuccess={this.GoogleResponse}
            onFailure={this.GoogleResponse}
            cookiePolicy={'single_host_origin'}
            //responseType='code'
            //uxMode='redirect'
            className="googleLoginArea"
        />;

        let facebookLogin = <div className="facebookLoginArea">
            <table className="full-width">
                <tbody>
                    <tr>
                        <td>
                            <Icon Type={IconType.Social} Name="001-facebook" Class="facebookIcon" Hidden={false} />
                        </td>
                        <td>
                            <FacebookLogin
                                appId="2386518895007514"
                                autoLoad={false}
                                fields="first_name,last_name,email"
                                size="small"
                                callback={this.FBresponse}
                                version="3.2"
                                //redirectUri="https://gym-bay.com"
                                redirectUri={location.href.indexOf('localhost') > -1 ? 'localhost:59850' : `${SiteDetails.SiteURL}`}
                                isMobile={false}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

        let linkedInLogin = <div className="linkedinLoginArea">
            <img
                className="hover-pointer linkedinloginImg"
                src='/dist/social/linkedInSignIn.png'
                alt="Log in with Linked In"
                onClick={this.LinkedInLoginStart}
            />
        </div>

        return <div>

            <HeaderSearchBarArea Props={this.props} />

            <div hidden={this.state.Loading} className="text-center">

                <div className="loginContainer text-center">

                    <h5 hidden={this.state.ReturnTo != Pages.mygym}>Your gym on Gym Bay</h5>

                    <h5 hidden={this.state.ReturnTo != Pages.profile}>Your coach profile on Gym Bay</h5>

                    <br />

                    <img src="/dist/images/Gym-Bay_logo.png" className="img-fluid gymbayLoginLogo" />

                    <br />

                    <h4>Login or Register today</h4>

                    <h5>It's easy!</h5>

                    <br />

                    {facebookLogin}

                    <br />

                    {googleLogin}

                    <br />

                    {linkedInLogin}

                    <hr />

                    <div className="browserSuggestDiv">
                        <span>Having trouble logging in?</span><br />
                        Try opening the site in Chrome or Firefox.
                    </div>

                    <div className="noPasswordDiv">
                        <span>Why no password login?</span> gym-bay.com prefers to use social media login options. Using this method, the only thing
                        we ever gain access to is your email address. It's more secure for you, and doesn't require a new password.
                    </div>
                </div>

            </div>

            <div className="text-center" style={{ color: 'red' }}>{this.state.SignupValidationText}</div>

            <div hidden={!this.state.Loading}>
                <Loader CentreAlign ContainerMargin="25px 0 25px 0" Height="80px" />
            </div>

        </div>
    }
}

class FBLoginData {
    FirstName: string = "";
    LastName: string = "";
    PicURL: string = "";

    public ToForm(): FormData {
        let form = new FormData();
        form.append("FirstName", this.FirstName);
        form.append("LastName", this.LastName);
        form.append("PicURL", this.PicURL);
        return form;
    }
}
class GoogleLoginData {
    Name: string = "";
    PicURL: string = "";

    public ToForm(): FormData {
        let form = new FormData();
        form.append("Name", this.Name);
        form.append("PicURL", this.PicURL);
        return form;
    }
}