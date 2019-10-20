import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { GymFinderGym, CountryGeo, GymSearch, CityGeoBasic, HttpResult, GymStatus } from '../../data/serverModels';
import { EnterPressed, OnMobile, GymImagesArray, AdminLoggedIn, UserLoggedIn } from '../../Helpers/Functions';
import { InlineLoader, Loader } from '../Widgets/Loaders';
import { CitiesAutosuggest } from '../Geo/CitiesAutosuggest';
import '../../css/gymfinder.css';
import { GymFinderGymView } from './GymFinderGymView';
import InfiniteScroll from 'react-infinite-scroller';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { GymSearchState, Pages } from '../../Helpers/Globals';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { GymSearchFilter } from '../Widgets/SearchFilters';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { LoginOptionsEnum } from '../Dashboard/LoginAndMenu';

interface ModuleState {
    Query: GymSearch
    SelectedCity: CityGeoBasic
    Gyms: Array<GymFinderGym>
    SearchCountry: CountryGeo
    CityQuery: string
    LoadingCities: boolean,
    LoadingGyms: boolean,
    MaxResults: number
    InitialLoad: boolean //for inifinite scroller
    ValidationString: string
    ToggleChecked: boolean
    ModalOpen: boolean
}

export class GymFinderSearch extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);
        this.state = {
            Query: new GymSearch,
            SelectedCity: new CityGeoBasic,
            Gyms: [],
            SearchCountry: new CountryGeo,
            CityQuery: "",
            LoadingCities: false,
            LoadingGyms: false,
            MaxResults: 0,
            InitialLoad: true,
            ValidationString: "",
            ToggleChecked: true,
            ModalOpen: false
        };

        if (GymSearchState.HasState()) {
            this.state = GymSearchState.GetState();
        }

        this.SearchGyms = this.SearchGyms.bind(this);
        this.CitySelected = this.CitySelected.bind(this);
        this.ClearFilters = this.ClearFilters.bind(this);
    }

    componentDidMount() {
        if (!GymSearchState.HasState()) {
            this.SearchGyms();
        }
    }

    private CitySelected(city: CityGeoBasic) {
        this.state.Query.cityId = city.cityGeoId;
        this.setState({
            Query: this.state.Query,
            SelectedCity: city
        })
        this.SearchGyms();

        GymSearchState.SetState(this.state);
    }

    private SearchGyms(incrementPage: boolean = false) {
        let t = this;
        //
        this.setState({
            ValidationString: "",
            ModalOpen: false
        });

        if (!this.state.LoadingGyms) {
            if (!incrementPage)
                this.state.Query.page = 0;

            this.setState({
                LoadingGyms: true,
                Query: this.state.Query
            });
            GymSearchState.SetState(this.state);

            fetch('api/GymFinder/Search/',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.Query)
                })
                .then(response => response.json() as Promise<HttpResult<{ gyms: GymFinderGym[], total: number }>>)
                .then(data => {
                    if (data.ok) {
                        let gymsList = new Array<GymFinderGym>();

                        if (incrementPage) {
                            gymsList = this.state.Gyms.concat(data.data.gyms);
                        }
                        else {
                            gymsList = data.data.gyms;
                            //reset back to top
                            let scroller = document.getElementById('gymScroller') as HTMLDivElement;
                            if (scroller)
                                scroller.scrollTop = 0;
                        }
                        //increments page here, but is reset back to 0 if incrementPage is false in next call
                        this.state.Query.page += 1;

                        this.setState({
                            Query: this.state.Query,
                            Gyms: gymsList,
                            LoadingGyms: false,
                            MaxResults: data.data.total,
                            InitialLoad: false,
                            ValidationString: "",
                        });
                        GymSearchState.SetState(this.state);
                    }
                    else {
                        alert(data.message);
                        this.setState({
                            Query: new GymSearch(),
                            Gyms: [],
                            LoadingGyms: false,
                            ValidationString: data.message
                        });
                        GymSearchState.SetState(this.state);
                    }
                }).catch((e: Error) => {
                    alert(e.message);
                    this.setState({
                        LoadingGyms: false
                    });
                    GymSearchState.SetState(this.state);
                });
        }
    }

    private ClearFilters() {
        let q = this.state.Query;

        q.cafe = 0;
        q.cardioMachines = 0;
        q.changingRooms = 0;
        q.classesAvailable = 0;
        q.crossfit = 0;
        q.freeWeightsBarsPlates = 0;
        q.freeWeightsDumbbells = 0;
        q.lockers = 0;
        q.membersOnly = 0;
        q.noMembershipRequired = 0;
        q.olympicLifting = 0;
        q.physio = 0;
        q.powerlifting = 0;
        q.resistanceMachines = 0;
        q.sauna = 0;
        q.strongman = 0;
        q.swimmingPool = 0;
        q.toilets = 0;
        q.twentyFourHour = 0;
        q.vendingMachine = 0;

        this.setState({
            Query: q
        })
    }

    public render() {
        const modalStyles = {
            content: {
                top: '55%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                border: '3px solid var(--blue)'
            }
        };

        let gymsList = this.state.Gyms.length > 0
            ? this.state.Gyms.map((g, i) => <GymFinderGymView key={g.name + i.toString() + g.id.toString()}
                Gym={g} BackgroundColor={i % 2 == 0 ? 'White' : 'White'}
                ListView={true}
                imageViewerSRCs={GymImagesArray(g)}
                Hidden={g.status == GymStatus.Pending}
            />)
            : this.state.Gyms.length == 0 && this.state.LoadingGyms
                ? <div className="text-center" >
                    <Loader CentreAlign ContainerMargin="20px 0 20px 0" Height="80px" />
                    Searching...
                    </div>
                : <div className="text-center" >

                </div>

        return <div>
            <HeaderSearchBarArea Props={this.props} />
            <div style={{ backgroundColor: '#eaeaea' }}>

                <div style={{
                    height: !OnMobile() ? '80px' : 'auto',
                    borderTop: '2px solid white',
                    borderBottom: '2px solid #dadada',
                    padding: OnMobile() ? '5px' : '20px',
                    backgroundColor: '#b3b3b3'
                }}>

                    <div className="row max-width">
                        <div className="col-md-6">

                            <div>
                                <table className="full-width">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input className="form-control searchInput" value={this.state.Query.keywords} style={{ width: '100%', marginRight: '4px' }}
                                                    onKeyUp={(e) => { EnterPressed(e, this.SearchGyms) }}
                                                    onChange={(e) => {
                                                        this.state.Query.keywords = e.target.value;
                                                        this.setState({ Query: this.state.Query });
                                                        GymSearchState.SetState(this.state);
                                                    }} placeholder="Keywords" />

                                            </td>
                                            <td style={{ minWidth: '125px', textAlign: 'center', verticalAlign: 'middle' }}>

                                                <button hidden={this.state.LoadingGyms} className="btn btn-primary btn-sm" style={{ marginRight: '4px' }} onClick={() => this.setState({ ModalOpen: true })}>
                                                    Filters
                                            </button>

                                                <button className="btn btn-primary btn-sm" onClick={() => this.SearchGyms()}>
                                                    <InlineLoader Text="Search" Loading={this.state.LoadingGyms} />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div className="col-md-6 order-first">

                            <table className="full-width">
                                <tbody>
                                    <tr>
                                        <td width="70%">
                                            <CitiesAutosuggest CitySelected={this.CitySelected} />
                                        </td>
                                        <td hidden={!AdminLoggedIn()}>
                                            <label className="adminGymToggleLabel">
                                                <Toggle
                                                    className="adminGymToggle"
                                                    defaultChecked={this.state.ToggleChecked}
                                                    onChange={() => {
                                                        let s = this.state.Query.status;
                                                        this.state.Query.status = s == GymStatus.Pending
                                                            ? GymStatus.Any
                                                            : GymStatus.Pending;
                                                        this.setState({
                                                            Query: this.state.Query,
                                                            ToggleChecked: !this.state.ToggleChecked
                                                        });
                                                        GymSearchState.SetState(this.state);
                                                    }} />
                                                <span>{this.state.ToggleChecked ? ' All' : ' Pending'}</span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.ModalOpen}
                    onRequestClose={() => this.setState({ ModalOpen: false })}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >

                    <GymSearchFilter queryObject={this.state.Query} searchPage={this} onSearch={this.SearchGyms} onClear={this.ClearFilters} />

                </Modal>

                <div>
                    <div id="gymScroller"
                        style={{
                            height: OnMobile() ? 'calc(100vh - 70px - 80px - 60px)' : 'calc(100vh - 85px - 60px)',
                            padding: '2px',
                            overflowY: 'auto',
                        }}
                    >

                        <InfiniteScroll
                            key={this.state.Gyms.length}
                            initialLoad={this.state.InitialLoad}
                            pageStart={0}
                            loadMore={() => this.SearchGyms(true)}
                            hasMore={this.state.Gyms.length != this.state.MaxResults}
                            loader={<div className="text-center"><Loader CentreAlign ContainerMargin="20px 0 20px 0" Height="40px" /></div>}
                            useWindow={false}

                        >
                            {gymsList}
                        </InfiniteScroll>

                        <div className="text-center" style={{ color: '#666', margin: '15px 0 0 0' }} hidden={this.state.ValidationString.length == 0}>
                            {this.state.ValidationString}
                        </div>

                        <div className="text-center" hidden={this.state.LoadingGyms} style={{ display: 'flex', alignItems: 'center', height: '50%' }}>
                            {
                                this.state.Gyms.length == this.state.MaxResults
                                    && this.state.Gyms.length > 0
                                    && !this.state.InitialLoad
                                    ? <div className="text-center  full-width">'End of results!'</div>
                                    : this.state.Gyms.length == 0 && !this.state.InitialLoad && !this.state.LoadingGyms
                                        ? <div className="text-center full-width">
                                            <img id="searchpage-logo" src='/dist/images/Gym-Bay_logo.png' />
                                            'No results!'
                                    </div>
                                        : null
                            }
                        </div>
                    </div>
                </div>

                <Link to={{
                    pathname: Pages.dashboard,
                    state: { returnPath: Pages.mygym }
                }}
                    hidden={UserLoggedIn()} className="btn btn-lg specialLoginBtn">
                    Add My Gym
                    </Link>
            </div>

        </div>;
    }
}