import * as React from 'react';
import { OnMobile } from '../../Helpers/Functions';
import { NavLink} from 'react-router-dom';
import { Pages} from '../../Helpers/Globals';




interface IconProps {
    Name: string
    Class: string
    Type: IconType
    Hidden: boolean
}

export enum IconType {
    Iconic,
    GymFinder,
    CoachFinder,
    Social,
    SocialWhite
}

export class Icon extends React.Component<IconProps, {}> {

    constructor(props) {
        super(props);
        
    }


    public render() {
        //let iconStlye: React.CSSProperties = {
        //    width: '16px',
        //    height: '16px'
        //}


        switch (this.props.Type) {
            case IconType.Iconic:
                return <img src={`/dist/iconic/svg/${this.props.Name}.svg`}  className={this.props.Class} alt={this.props.Name} />;
            case IconType.GymFinder:
                return <img src={`/dist/images/gymfinder/${this.props.Name}.png`} className={this.props.Class} alt={this.props.Name} />
            case IconType.CoachFinder:
                return <img src={`/dist/images/coachfinder/${this.props.Name}.png`} className={this.props.Class} alt={this.props.Name} />
            case IconType.Social:
                return <img src={`/dist/images/users/${this.props.Name}.png`} className={this.props.Class} alt={this.props.Name} />
            case IconType.SocialWhite:
                return <img src={`/dist/social/${this.props.Name}.svg`} className={this.props.Class} alt={this.props.Name} />
            default:
                return null;
        }
        
    }
}

interface CenterTitleProps {
    Title: string
    LineColour: string
}
export class CenterTitleWithLine extends React.Component<CenterTitleProps, {}> {

    constructor(props) {
        super(props);

    }


    public render() {

        let titleStyle: React.CSSProperties = {
            color: '#666',
            fontSize: '18px',
            textAlign: 'center',
            margin: 'auto',
            position: "relative",
            top: '14px',
            background: 'white'
        }

        let lineStyle: React.CSSProperties = {
            borderBottom: `1px solid ${this.props.LineColour}`,
            marginBottom: OnMobile() ? '15px' : '30px',
            marginTop: OnMobile() ? '0' : '15px'
        }

        return <div style={lineStyle}>

            <table style={titleStyle}>
                <tbody>
                    <tr>
                        <td style={{ padding: '0 20px'}}>
                            {this.props.Title}
                        </td>
                    </tr>
                </tbody>
            </table>

            </div>

    }
}


export class Footer extends React.Component<{}, {}> {

    constructor(props) {
        super(props);

    }


    public render() {

        let footerStyle: React.CSSProperties = {
            backgroundColor: 'var(--black)',
            color: 'white',
            padding: '3%'
        }
        let footerSectiontitle: React.CSSProperties = {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '5px'
        }
        let footerLinkStyle: React.CSSProperties = {
            fontSize: '15px',
            color: 'white',
            display: 'block'
        }
        let footerLinkActive: React.CSSProperties = {
            textDecoration: 'underline'
        }
        let logoStyle: React.CSSProperties = {
            height: '100px',
            width: '100px',
            margin: 'auto',
            display: 'block',
            marginBottom: '10px'
        }
        return <div style={footerStyle}>

            <div className="row max-width">
                <div className={OnMobile() ? 'col-4' : 'col-3'}>
                    <div style={footerSectiontitle}>
                        Gym Bay
                    </div>
                    <NavLink to={Pages.home} style={footerLinkStyle} activeStyle={footerLinkActive} >Home</NavLink>
                    <NavLink to={Pages.gymfinder} style={footerLinkStyle} activeStyle={footerLinkActive} >Gym Finder</NavLink>
                    <NavLink to={Pages.addgym} style={footerLinkStyle} activeStyle={footerLinkActive} >Add Gym</NavLink>
                    <NavLink to={Pages.reviews} style={footerLinkStyle} activeStyle={footerLinkActive} >Reviews</NavLink>
                </div>
                <div className={OnMobile() ? 'col-4' : 'col-3'}>
                    <div style={footerSectiontitle}>
                        About
                    </div>
                    <NavLink to={Pages.about} style={footerLinkStyle} activeStyle={footerLinkActive} >About Gym Bay</NavLink>
                    <NavLink to={Pages.privacy} style={footerLinkStyle} activeStyle={footerLinkActive} >Privacy Policy</NavLink>

                </div>
                <div className={OnMobile() ? 'col-4' : 'col-3'}>
                    <div style={footerSectiontitle}>
                        Social
                    </div>
                </div>
                <div className={OnMobile() ? 'text-center' : 'col-3 text-center'}
                    style={{
                        width: OnMobile() ? '100%' : 'auto',
                        margin: OnMobile() ? '25px auto' : 'auto'
                    }}>
                    <img style={logoStyle} src='/dist/images/Gym-Bay_logo.png' />
                    © GymBay {new Date().getFullYear()}
                </div>
            </div>

        </div>

    }
}

