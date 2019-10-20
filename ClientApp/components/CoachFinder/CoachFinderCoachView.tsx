import * as React from 'react';
import { OnMobile, AdminLoggedIn } from '../../Helpers/Functions';
import { Icon, IconType } from '../Widgets/Widgets';
import { HttpResult, UserProfile, VerifiedSatus, FeaturedState } from '../../data/serverModels';
import $ from 'jquery';
import LazyLoad from 'react-lazy-load';
import 'react-viewer/dist/index.css';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import ReactTooltip from 'react-tooltip'
import { Pages, SiteDetails } from '../../Helpers/Globals';
import { Link } from 'react-router-dom';

interface ModuleProps {
    coach: UserProfile
    BackgroundColor: string
    ListView: boolean
    //Hidden: boolean
}

interface ModuleState {
    toggleChecked: boolean
    featuredToggleChecked: boolean
}

export class CoachFinderCoachView extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {

        super(props);

        this.state = {
            toggleChecked: this.props.coach.isVerified == VerifiedSatus.Verfifed,
            featuredToggleChecked: this.props.coach.featuredCoach == FeaturedState.Featured
        }
        
        this.ToggleStatus = this.ToggleStatus.bind(this);
        this.ToggleFeatured = this.ToggleFeatured.bind(this);
    }

    shouldComponentUpdate() {
        return true;
    }

    public render() {

        let c = this.props.coach;

        let ratingStars: Array<JSX.Element> = [];

        for (let i = 1; i <= SiteDetails.MaxRating; i++) {
            ratingStars.push(<span className={`ratingStar ${i <= c.averageRating ? 'ratingStarHighlighted' : ''}`} >★</span>);
        }

        return <div id={`coachSearchRow-${c.id}`} className="coachSearchRow max-width" style={{ backgroundColor: this.props.BackgroundColor }}>

            
            <div id={`coachviewArea-${c.id}`} >

               
                {
                    AdminLoggedIn() 
                        ? <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--blue)',
                            padding: '5px 0'
                        }}>
                            <label className="adminCoachToggleLabel">
                                <Toggle
                                    className="adminCoachToggle"
                                    defaultChecked={this.state.toggleChecked}
                                    onChange={this.ToggleStatus} />
                                <span>{this.state.toggleChecked ? ' Verified' : ' Unverified'}</span>
                            </label>

                            <label className="adminCoachToggleLabel">
                                <Toggle
                                    className="adminCoachToggle"
                                    defaultChecked={this.state.featuredToggleChecked}
                                    onChange={this.ToggleFeatured} />
                                <span>{this.state.featuredToggleChecked ? ' Featured' : ' Normal'}</span>
                            </label>

                        </div>
                        : null
                }

                <div className="row">
                    <div className="col-3" style={{ padding: '1px' }}>
                        <div className="coachInfoBox" style={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
                            <div className="logoRatingArea">
                                <div className="coachImageLogoContainer">
                                    <LazyLoad offsetVertical={500}>
                                        <img
                                            style={{
                                                width: OnMobile() ? '65px' : '100px',
                                                height: OnMobile() ? '65px' : '100px'
                                            }}
                                            src={c.profilePic && c.profilePic.length > 0 ? c.profilePic : '/dist/images/coachfinder/default-coach.jpg'}
                                            className="img-fluid coachImageLogo img-centred" />
                                    </LazyLoad>

                                    <div hidden={c.isVerified != 1} style={{ position: 'absolute', top: 1, left: 1, textAlign: 'center' }}>
                                        <Icon Class="profileSocialIconTiny" Type={IconType.CoachFinder} Name="verified" Hidden={c.isVerified != 1} />
                                        <div hidden={c.isVerified != 1 || OnMobile()} style={{ fontSize: '13px', color: 'var(--blue)' }}>Verified</div>

                                    </div>

                                </div>
                                <div >

                                    <progress hidden={!OnMobile()}  className="coachRating" value={c.averageRating / SiteDetails.MaxRating} />

                                    <div hidden={OnMobile()}>
                                        {ratingStars}
                                    </div>

                                    <div className="coachRatingText text-center">Rating: {Math.round(10 * c.averageRating) / 10}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-9' style={{ padding: '1px'}}>

                        <div className="coachInfoBox" style={{ padding: '10px' }}>
                            <table className={`coachInfo ${OnMobile() ? 'full-width' : ''}`}>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            <div className="coachName">
                                                {c.firstName} {c.lastName}

                                            </div>
                                        </td>
                                       
                                    </tr>
                                    <tr>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <Icon Hidden={false} Name="map-marker" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                        </td>
                                        <td>
                                            <div className="coachAddress">
                                                {c.cityName}, {c.countryName}
                                            </div>
                                        </td>
                                    </tr>
                                   
                                </tbody>
                            </table>

                            <div className="smallCoachIcons">

                                <ReactTooltip />

                                <div className="smallCoachIconContainer" data-tip="Bodybuilding" hidden={c.coachBodybuilding != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="BodybuildingCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Classes Available" hidden={c.coachClasses != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ClassesCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Crossfit" hidden={c.coachCrossfit != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="CrossfitCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Dance"  hidden={c.coachDance != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="DanceCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Massage"  hidden={c.coachMasseuse != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="MasseueseCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Nutrition"  hidden={c.coachNutrition != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="NutritionCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Olympic Lifting"  hidden={c.coachOlympicLifting != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OlympicLiftingCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="One on One"  hidden={c.coachOneOnOne != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OneOnOneCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Online Available"  hidden={c.coachOnlineAvailable != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineCoachingAvaialbleCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Online Only" hidden={c.coachOnlineOnly != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineOnlyCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Physio"  hidden={c.coachPhysio != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PhysioCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Powerlifting"  hidden={c.coachPowerlifting != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PowerliftingCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Programs Only"  hidden={c.coachProgramOnly != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ProgramOnlyCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Strongman"  hidden={c.coachStrongman != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="StrongmanCoach" />
                                </div>
                                <div className="smallCoachIconContainer" data-tip="Weight Loss" hidden={c.coachWeightLoss != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="WeightlossCoach" />
                                </div>
                            </div>
                        </div>



                    </div>

                </div>


                <div className="seeMoreToggle" hidden={!this.props.ListView}>
                  
                    <Link className="btn btn-primary btn-sm"
                        to={`${Pages.viewCoach}/${c.id}/${c.firstName}-${c.lastName}`}

                    >Reviews</Link>

                    <button className="btn btn-primary btn-sm"
                        style={{ marginLeft: '2px' }}
                        onClick={() => this.ToggleMoreInfo(`#moreInfo-${c.id}`)}
                    >Details ▼</button>
                </div>

                <div className="moreInfoArea coachInfoBox" id={`moreInfo-${c.id}`} style={{ display: this.props.ListView ? 'none' : 'block' }}>

                    <div className="aboutCoachTitle text-center col-md-9 offset-md-3">
                        About {c.firstName}
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <table className={`gymInfo ${OnMobile() ? 'full-width' : ''}`}>
                                <tbody>

                                    <tr hidden={!c.phone || c.phone.length == 0}>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <a href={`tel:${c.phone}`} target="_blank">
                                                <Icon Hidden={false} Name="phone" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="gymAddress">
                                                <a href={`tel:${c.phone}`} target="_blank">
                                                    {c.phone}
                                                </a>

                                            </div>
                                        </td>
                                    </tr>
                                    <tr hidden={!c.email || c.email.length == 0}>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <a href={`mailto:${c.email}`} target="_blank">
                                                <Icon Hidden={false} Name="envelope-closed" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="gymAddress">
                                                <a href={`mailto:${c.email}`} target="_blank">
                                                    {c.email}
                                                </a>

                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <div className="socialIconsContainer">

                                <a data-tip={c.facebook} className="" hidden={!c.facebook || c.facebook.length == 0} href={c.facebook} target="_blank">
                                    <Icon Hidden={false} Name="001-facebook" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={c.instagram} href={c.instagram} className="" hidden={!c.instagram || c.instagram.length == 0} target="_blank">
                                    <Icon Hidden={false} Name="002-instagram" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={c.youtube} className="" hidden={!c.youtube || c.youtube.length == 0} href={c.youtube} target="_blank">
                                    <Icon Hidden={false} Name="003-youtube" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={c.twitter} className="" hidden={!c.twitter || c.twitter.length == 0} href={c.twitter} target="_blank">
                                    <Icon Hidden={false} Name="004-twitter" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <span data-tip={c.whatsapp} className="" hidden={!c.whatsapp || c.whatsapp.length == 0} href={c.facebook} target="_blank">
                                    <Icon Hidden={false} Name="005-whatsapp" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <a data-tip={c.linkedin} className="" hidden={!c.linkedin || c.linkedin.length == 0} href={c.linkedin} target="_blank">
                                    <Icon Hidden={false} Name="006-linkedin" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <span data-tip={c.googlePlus} className="" hidden={!c.googlePlus || c.googlePlus.length == 0} href={c.googlePlus} target="_blank">
                                    <Icon Hidden={false} Name="007-google-plus" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <span data-tip={c.snapchat} className="" hidden={!c.snapchat || c.snapchat.length == 0} href={c.snapchat} target="_blank">
                                    <Icon Hidden={false} Name="008-snapchat" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <span data-tip={c.skype} className="" hidden={!c.skype || c.skype.length == 0} href={c.skype} target="_blank">
                                    <Icon Hidden={false} Name="009-skype" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <a data-tip={c.website} className="" hidden={!c.website || c.website.length == 0} href={c.website} target="_blank">
                                    <Icon Hidden={false} Name="010-website" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                               
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="allCoachIcons text-center">
                                <div className="coachIconContainer" hidden={c.coachBodybuilding != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="BodybuildingCoach" />
                                    <span className="coachIconLabel">Bodybuilding</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachClasses != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ClassesCoach" />
                                    <span className="coachIconLabel">Classes Available</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachCrossfit != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="CrossfitCoach" />
                                    <span className="coachIconLabel">Crossfit</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachDance != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="DanceCoach" />
                                    <span className="coachIconLabel">Dance</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachMasseuse != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="MasseueseCoach" />
                                    <span className="coachIconLabel">Massage</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachNutrition != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="NutritionCoach" />
                                    <span className="coachIconLabel">Nutrition</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachOlympicLifting != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OlympicLiftingCoach" />
                                    <span className="coachIconLabel">Olympic Lifting</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachOneOnOne != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OneOnOneCoach" />
                                    <span className="coachIconLabel">One on One</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachOnlineAvailable != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineCoachingAvaialbleCoach" />
                                    <span className="coachIconLabel">Online Available</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachOnlineOnly != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineOnlyCoach" />
                                    <span className="coachIconLabel">Online Only</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachPhysio != 1}>
                                     <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PhysioCoach" />
                                    <span className="coachIconLabel">Physio</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachPowerlifting != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PowerliftingCoach" />
                                    <span className="coachIconLabel">Powerlifting</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachProgramOnly != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ProgramOnlyCoach" />
                                    <span className="coachIconLabel">Programs Only</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachStrongman != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="StrongmanCoach" />
                                    <span className="coachIconLabel">Physio</span>
                                </div>
                                <div className="coachIconContainer" hidden={c.coachWeightLoss != 1}>
                                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="WeightlossCoach" />
                                    <span className="coachIconLabel">Weight Loss</span>
                                </div>
                            </div>
                            <div className="aboutCoach hasLineBreaks text-center">
                                {c.coachBio}
                            </div>
                        </div>
                    </div>



                </div>

            </div>

        </div>
    }

    private ToggleMoreInfo(id: string) {
        console.log(id);
        $(id).slideToggle()
    }

    private ToggleStatus() {
        fetch('api/CoachFinder/ToggleVerifiedStatus/' + this.props.coach.id,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: null
            })
            .then(response => response.json() as Promise<HttpResult<boolean>>)
            .then(res => {

                if (res.ok) {
                    this.setState({
                        toggleChecked: res.data
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .catch((e: Error) => alert(e.message));
    }

    private ToggleFeatured() {
        fetch('api/CoachFinder/ToggleFeatured/' + this.props.coach.id,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: null
            })
            .then(response => response.json() as Promise<HttpResult<boolean>>)
            .then(res => {

                if (res.ok) {
                    this.setState({
                        featuredToggleChecked: res.data
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .catch((e: Error) => alert(e.message));
    }
}


