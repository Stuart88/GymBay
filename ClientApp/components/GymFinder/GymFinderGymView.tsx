import * as React from 'react';
import { OnMobile, AdminLoggedIn } from '../../Helpers/Functions';
import { Icon, IconType } from '../Widgets/Widgets';
import { GymFinderGym, GymStatus, HttpResult, FeaturedState } from '../../data/serverModels';
import $ from 'jquery';
import LazyLoad from 'react-lazy-load';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import { ImageDecorator } from 'react-viewer/lib/ViewerProps';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import { Pages, SiteDetails } from '../../Helpers/Globals';

interface ModuleProps {
    Gym: GymFinderGym
    BackgroundColor: string
    ListView: boolean
    imageViewerSRCs: Array<ImageDecorator>
    Hidden: boolean
}

interface ModuleState {
    imageViewerOpen: boolean
    imageViewerIndex: number
    toggleChecked: boolean
    featuredToggleChecked: boolean
}

export class GymFinderGymView extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            imageViewerOpen: false,
            imageViewerIndex: 0,
            toggleChecked: this.props.Gym.status == GymStatus.Live,
            featuredToggleChecked: this.props.Gym.featured == FeaturedState.Featured
        }
        
        this.ToggleStatus = this.ToggleStatus.bind(this);
        this.ToggleFeatured = this.ToggleFeatured.bind(this);
        this.Delete = this.Delete.bind(this);
    }

    shouldComponentUpdate() {
        return true;
    }

    public render() {

        let g = this.props.Gym;

        let ratingStars: Array<JSX.Element> = [];

        for (let i = 1; i <= SiteDetails.MaxRating; i++) {
            ratingStars.push(<span className={`ratingStar ${i <= g.averageRating ? 'ratingStarHighlighted' : ''}`} >★</span>);
        }



        let photos = this.props.imageViewerSRCs.length > 0
            ? <div style={{ padding: '1px', height: '100%'}}>
                <div className="gymInfoBox" style={{ padding: '5px' }}>
                    <div className="row" style={{ margin: '10px 0' }}>
                        {
                            this.props.imageViewerSRCs.map((img, i) => <div className="col-4" style={{ display: 'flex', alignItems: 'center' }}>
                                <div key={i} style={{
                                    //height: OnMobile() ? 'auto' : '150px',
                                    border: '1px solid #eaeaea',
                                    backgroundColor: '#eaeaea',
                                    width: '100%'
                                }}>
                                    <LazyLoad offsetVertical={500}>


                                        <img key={img.src} className="img-fluid hover-pointer gymImage img-centred"
                                            style={{
                                                maxHeight: OnMobile() ? '60px' : '72px'
                                            }}
                                            onClick={() => this.setState({ imageViewerOpen: true, imageViewerIndex: i })}
                                            src={img.src} />
                                    </LazyLoad>


                                </div>

                            </div>)
                        }
                    </div>
                </div>
            </div>
            : null

        return <div id={`gymSearchRow-${g.id}`} className="gymSearchRow max-width" style={{ backgroundColor: this.props.BackgroundColor }}>

            <div hidden={g.status != GymStatus.Pending} 
                style={{
                    padding: '5px',
                    backgroundColor: '#eee',
                    textAlign: 'right'
                }}>
                <table className="full-width">
                    <tr>
                        <td className="text-left">
                            <div>{g.name}, {g.locationCityName}</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>This gym has not yet been approved</div>
                        </td>
                        <td className="text-right">
                            <button onClick={() => { $(`#gymviewArea-${g.id}`).slideToggle(); }} className="btn btn-secondary btn-sm">View Gym</button>
                        </td>
                    </tr>
                </table>
                
            </div>

           

            <div id={`gymviewArea-${g.id}`} style={{ display: this.props.Hidden ? 'none' : 'initial' }}>

               
                {
                    AdminLoggedIn() && location.href.indexOf(Pages.mygym) == -1
                        ? <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--blue)',
                            padding: '5px 0'
                        }}>
                            <label className="adminGymToggleLabel">
                                <Toggle
                                    className="adminGymToggle"
                                    defaultChecked={this.state.toggleChecked}
                                    onChange={this.ToggleStatus} />
                                <span>{this.state.toggleChecked ? ' Live' : ' Pending'}</span>
                            </label>

                            <label className="adminGymToggleLabel">
                                <Toggle
                                    className="adminGymToggle"
                                    defaultChecked={this.state.featuredToggleChecked}
                                    onChange={this.ToggleFeatured} />
                                <span>{this.state.featuredToggleChecked ? ' Featured' : ' Normal'}</span>
                            </label>

                            <Link className="btn btn-primary btn-sm" to={{
                                pathname: Pages.mygym,
                                state: g
                            }} keyParams={JSON.stringify(g)}
                                style={{
                                    marginLeft: 'auto'
                                }}> Edit </Link>

                            <button className="btn btn-danger btn-sm" onClick={this.Delete}
                                style={{
                                    marginLeft: '15px'
                                }}>Delete</button>

                        </div>
                        : null
                }

                <div className="row">
                    <div className="col-3" style={{ padding: '1px' }}>
                        <div className="gymInfoBox" style={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
                            <div className="logoRatingArea">
                                <div className="gymImageLogoContainer">
                                    <LazyLoad offsetVertical={500}>
                                        <img
                                            style={{
                                                width: OnMobile() ? '65px' : '100px',
                                                height: OnMobile() ? '65px' : '100px'
                                            }}
                                            src={g.imageLocationLogo && g.imageLocationLogo.length > 0 ? g.imageLocationLogo : '/dist/images/gymfinder/default-gym.svg'}
                                            className="img-fluid gymImageLogo img-centred" />
                                    </LazyLoad>

                                </div>
                                <div >

                                    <progress hidden={!OnMobile()} className="gymRating" value={g.averageRating / SiteDetails.MaxRating} />

                                    <div hidden={OnMobile()}>
                                        {ratingStars}
                                    </div>
                                    <div className="gymRatingText text-center">Rating: {Math.round(10 * g.averageRating) / 10}</div>
                                </div>
                            </div>

                            
                        </div>

                    </div>
                    <div className={OnMobile() ? 'col-9' : 'col-4'} style={{ padding: '1px'}}>

                        <div className="gymInfoBox" style={{ padding: '10px' }}>
                            <table className={`gymInfo ${OnMobile() ? 'full-width' : ''}`}>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            <div className="gymName">{g.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <a href={`https://www.google.com/maps/search/${encodeURIComponent(g.streetAddress)}/`} target="_blank">
                                                <Icon Hidden={false} Name="map-marker" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="gymAddress">
                                                {g.locationCityName}, {g.locationCountryName}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="smallGymIcons">

                                <ReactTooltip />

                                <div className="smallGymIconContainer" data-tip="24 Hour" hidden={g.twentyFourHour != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="24-hour" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Bars and Plates" hidden={g.freeWeightsBarsPlates != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Bars-Plates" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Dumbbells" hidden={g.freeWeightsDumbbells != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Dumbbells" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Strongman" hidden={g.strongman != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Strongman" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Resistance Machines" hidden={g.resistanceMachines != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Resistance-Machines" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Cardio Machines" hidden={g.cardioMachines != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cardio" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Crossfit" hidden={g.crossfit != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Crossfit" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Olympic Lifting" hidden={g.olympicLifting != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Olympic-Lifting" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Powerlifting" hidden={g.powerlifting != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Powerlifting" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Physio" hidden={g.physio != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Physio" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Classes Available" hidden={g.classesAvailable != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Classes" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Sauna" hidden={g.sauna != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Sauna" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Swimmig Pool" hidden={g.swimmingPool != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Pool" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Changing Rooms" hidden={g.changingRooms != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Changing-Rooms" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Toilets" hidden={g.toilets != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Toilets" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Food and Drink Available" hidden={g.vendingMachine != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Food-Drink" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Cafe" hidden={g.cafe != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cafe" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Members Only" hidden={g.membersOnly != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Members-only" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Day Pass Available" hidden={g.noMembershipRequired != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Day-Pass-available" />
                                </div>
                                <div className="smallGymIconContainer" data-tip="Lockers" hidden={g.lockers != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Lockers" />
                                </div>
                            </div>
                        </div>



                    </div>

                    {
                        OnMobile()
                            ? null
                            : <div className="col-5">
                                {photos}
                            </div>
                    }

                </div>


                {OnMobile() ? photos : null}

                <div className="seeMoreToggle" hidden={!this.props.ListView}>

                    <Link className="btn btn-primary btn-sm"
                        to={`${Pages.viewgym}/${g.id}/${g.name}`}

                    >Reviews</Link>

                    <button className="btn btn-primary btn-sm"
                        style={{ marginLeft: '2px' }}
                        onClick={() => this.ToggleMoreInfo(`#moreInfo-${g.id}`)}
                    >Details ▼</button>
                </div>

                <div className="moreInfoArea gymInfoBox" id={`moreInfo-${g.id}`} style={{ display: this.props.ListView ? 'none' : 'block' }}>

                    <div className="aboutGymTitle text-center col-md-9 offset-md-3">
                        About {g.name}
                    </div>

                    <hr/>

                    <div className="row">
                        <div className="col-md-3">

                            <table className={`gymInfo ${OnMobile() ? 'full-width' : ''}`}>
                                <tbody>

                                    <tr hidden={!g.streetAddress || g.streetAddress.length == 0}>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <a href={`https://www.google.com/maps/search/${encodeURIComponent(g.streetAddress)}/`} target="_blank">
                                                <Icon Hidden={false} Name="map-marker" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="gymAddress">
                                                <a href={`https://www.google.com/maps/search/${encodeURIComponent(g.streetAddress)}/`} target="_blank">
                                                    {g.streetAddress}
                                                </a>

                                            </div>
                                        </td>
                                    </tr>

                                    <tr hidden={!g.phone || g.phone.length == 0}>
                                        <td width="20px" style={{ paddingRight: '4px' }}>
                                            <a href={`tel:${g.phone}`} target="_blank">
                                                <Icon Hidden={false} Name="phone" Type={IconType.Iconic} Class="icon-general hover-pointer" />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="gymAddress">
                                                <a href={`tel:${g.phone}`} target="_blank">
                                                    {g.phone}
                                                </a>

                                            </div>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>

                            <div className="socialIconsContainer">

                                <a data-tip={g.facebook} className="" hidden={!g.facebook || g.facebook.length == 0} href={g.facebook} target="_blank">
                                    <Icon Hidden={false} Name="001-facebook" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={g.instagram} href={g.instagram} className="" hidden={!g.instagram || g.instagram.length == 0} target="_blank">
                                    <Icon Hidden={false} Name="002-instagram" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={g.youtube} className="" hidden={!g.youtube || g.youtube.length == 0} href={g.youtube} target="_blank">
                                    <Icon Hidden={false} Name="003-youtube" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <a data-tip={g.twitter} className="" hidden={!g.twitter || g.twitter.length == 0} href={g.twitter} target="_blank">
                                    <Icon Hidden={false} Name="004-twitter" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <span data-tip={g.whatsapp} className="" hidden={!g.whatsapp || g.whatsapp.length == 0} href={g.facebook} target="_blank">
                                    <Icon Hidden={false} Name="005-whatsapp" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <a data-tip={g.linkedin} className="" hidden={!g.linkedin || g.linkedin.length == 0} href={g.linkedin} target="_blank">
                                    <Icon Hidden={false} Name="006-linkedin" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                                <span data-tip={g.googlePlus} className="" hidden={!g.googlePlus || g.googlePlus.length == 0} href={g.googlePlus} target="_blank">
                                    <Icon Hidden={false} Name="007-google-plus" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <span data-tip={g.snapchat} className="" hidden={!g.snapchat || g.snapchat.length == 0} href={g.snapchat} target="_blank">
                                    <Icon Hidden={false} Name="008-snapchat" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <span data-tip={g.skype} className="" hidden={!g.skype || g.skype.length == 0} href={g.skype} target="_blank">
                                    <Icon Hidden={false} Name="009-skype" Class="profileSocialIcon" Type={IconType.Social} />
                                </span>
                                <a data-tip={g.website} className="" hidden={!g.website || g.website.length == 0} href={g.website} target="_blank">
                                    <Icon Hidden={false} Name="010-website" Class="profileSocialIcon" Type={IconType.Social} />
                                </a>
                            </div>



                        </div>
                        <div className="col-md-9">
                            <div className="allGymIcons text-center">
                                <div className="gymIconContainer" hidden={g.twentyFourHour != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="24-hour" />
                                    <span className="gymIconLabel">24-hour</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.freeWeightsBarsPlates != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Bars-Plates" />
                                    <span className="gymIconLabel">Bars/Plates</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.freeWeightsDumbbells != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Dumbbells" />
                                    <span className="gymIconLabel">Dumbbells</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.strongman != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Strongman" />
                                    <span className="gymIconLabel">Strongman</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.resistanceMachines != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Resistance-Machines" />
                                    <span className="gymIconLabel">Resistance Machines</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.cardioMachines != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cardio" />
                                    <span className="gymIconLabel">Cardio</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.crossfit != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Crossfit" />
                                    <span className="gymIconLabel">Crossfit</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.olympicLifting != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Olympic-Lifting" />
                                    <span className="gymIconLabel">Olympic Lifting</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.powerlifting != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Powerlifting" />
                                    <span className="gymIconLabel">Powerlifting</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.physio != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Physio" />
                                    <span className="gymIconLabel">Physio</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.classesAvailable != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Classes" />
                                    <span className="gymIconLabel">Classes</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.sauna != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Sauna" />
                                    <span className="gymIconLabel">Sauna</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.swimmingPool != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Pool" />
                                    <span className="gymIconLabel">Pool</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.changingRooms != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Changing-Rooms" />
                                    <span className="gymIconLabel">Changing Rooms</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.toilets != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Toilets" />
                                    <span className="gymIconLabel">Toilets</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.vendingMachine != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Food-Drink" />
                                    <span className="gymIconLabel">Food & Drink Available</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.cafe != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cafe" />
                                    <span className="gymIconLabel">Cafe</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.membersOnly != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Members-only" />
                                    <span className="gymIconLabel">Members Only</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.noMembershipRequired != 1}>
                                     <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Day-Pass-available" />
                                    <span className="gymIconLabel">Day Passes Available</span>
                                </div>
                                <div className="gymIconContainer" hidden={g.lockers != 1}>
                                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Lockers" />
                                    <span className="gymIconLabel">Lockers</span>
                                </div>
                            </div>
                            <div className="aboutGym hasLineBreaks text-center">
                                {g.description}
                            </div>

                            

                        </div>
                    </div>



                </div>

                <Viewer
                    visible={this.state.imageViewerOpen}
                    onClose={() => { this.setState({ imageViewerOpen: false }); }}
                    images={this.props.imageViewerSRCs}
                    activeIndex={this.state.imageViewerIndex}
                    onMaskClick={() => { this.setState({ imageViewerOpen: false }); }}
                    rotatable={false}
                    changeable={false}

                />
            </div>

        </div>
    }

    private ToggleMoreInfo(id: string) {
        $(id).slideToggle()
    }

    private ToggleStatus() {
        fetch('api/GymFinder/ToggleGymStatus/' + this.props.Gym.id,
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
        fetch('api/GymFinder/ToggleFeatured/' + this.props.Gym.id,
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

    private Delete() {
        if (confirm("Delete: Are you sure?")) {


            fetch('api/GymFinder/DeleteGymFinderGym/' + this.props.Gym.id,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: null
                })
                .then(response => response.json() as Promise<HttpResult<any>>)
                .then(res => {

                    if (res.ok) {
                        $(`#gymSearchRow-${this.props.Gym.id}`).html('');
                        $(`#gymSearchRow-${this.props.Gym.id}`).removeClass('gymSearchRow');
                        
                    }
                    else {
                        alert(res.message);
                    }
                })
                .catch((e: Error) => alert(e.message));
        }
    }
}


