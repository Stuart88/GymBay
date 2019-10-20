import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CreateAuthHeaderObject, AdminLoggedIn, LogoutAdmin } from '../../Helpers/Functions';
import { HttpResult } from '../../data/serverModels';
import { Link } from 'react-router-dom';
import { Pages } from '../../Helpers/Globals';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';

interface ModuleState {
    Email: string;
    Password: string;
    ResponseMessage: string;
}

export class Admin extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            Email: "",
            Password: "",
            ResponseMessage: ""
        }

        this.AdminLogin = this.AdminLogin.bind(this);
        this.Reset = this.Reset.bind(this);
    }

    public render() {
        let adminLinkStyle: React.CSSProperties = {
            color: 'white',
            background: 'var(--blue)',
            padding: '10px',
            margin: '4px',
            display: 'block'
        }

        return <div>
            <HeaderSearchBarArea Props={this.props} />
            <div className="max-width full-centred" style={{ height: '100%' }}>

                <div style={{ margin: 'auto' }} className="text-center">
                    <h1>Admin Login</h1>
                    <form hidden={AdminLoggedIn()}>
                        <input className="form-control" type="text"
                            placeholder="Email"
                            value={this.state.Email} onChange={(e) => this.setState({ Email: e.target.value })}
                            onKeyUp={(e) => { if (e.keyCode == 13) this.AdminLogin() }}
                            autoComplete="username"
                        />

                        <input className="form-control" type="password"
                            placeholder="Password"
                            value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })}
                            onKeyUp={(e) => { if (e.keyCode == 13) this.AdminLogin() }}
                            autoComplete="current-password"
                        />

                        <br />
                        <br />

                        <button type="button" className="btn btn-primary" onClick={this.AdminLogin}>Submit</button>

                    </form>

                    <br />
                    <br />

                    <div style={{ color: 'blue' }}>{this.state.ResponseMessage}</div>

                    <br />
                    <br />

                    <div hidden={!AdminLoggedIn()} style={{ color: 'blue' }}>

                        You are logged in.<br />

                        <div style={{ margin: '10px auto', padding: '10px' }}>

                            <Link style={adminLinkStyle} to={Pages.newsfeedpost}>Add Newsfeed Post</Link>

                            <Link style={adminLinkStyle} to={Pages.mygym}>Add Gym</Link>

                            <Link style={adminLinkStyle} to={Pages.home} onClick={() => LogoutAdmin(this.Reset)}>Logout</Link>

                        </div>
                    </div>

                </div>
            </div>

        </div>;
    }

    private Reset() {
        this.setState({
            Email: "",
            Password: "",
            ResponseMessage: ""
        })
    }
    private AdminLogin() {
        if (this.state.Email.length > 0 && this.state.Password.length > 0) {
            this.setState({
                ResponseMessage: "Logging in..."
            })

            fetch('api/Admin/AdminLogin', CreateAuthHeaderObject(this.state.Email, this.state.Password, null))
                .then(response => response.json() as Promise<HttpResult<any>>)
                .then(data => {
                    this.setState({
                        ResponseMessage: data.ok ? "Success! You can now see admin controls on the site." : data.message
                    })
                })
        }
        else {
            this.setState({
                ResponseMessage: "Email/Password field empty!"
            })
        }
    }
}