import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CountryGeo, CityGeoBasic, HttpResult, UserProfile, CoachSearch, VerifiedSatus } from '../../data/serverModels';
import { EnterPressed, OnMobile, GymImagesArray, AdminLoggedIn, UserLoggedIn } from '../../Helpers/Functions';
import { InlineLoader, Loader } from '../Widgets/Loaders';
import { CitiesAutosuggest } from '../Geo/CitiesAutosuggest';
import '../../css/coachfinder.css';
import InfiniteScroll from 'react-infinite-scroller';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { CoachFinderCoachView } from './CoachFinderCoachView';
import { CoachSearchState, Pages } from '../../Helpers/Globals';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import Modal from 'react-modal';
import { CoacSearchFilter } from '../Widgets/SearchFilters';
import { Link } from 'react-router-dom';

interface ModuleState {
    Query: CoachSearch
    SelectedCity: CityGeoBasic
    Coaches: Array<UserProfile>
    SearchCountry: CountryGeo
    CityQuery: string
    LoadingCities: boolean,
    LoadingCoaches: boolean,
    MaxResults: number
    InitialLoad: boolean //for inifinite scroller
    ValidationString: string
    ToggleChecked: boolean
    ModalOpen: boolean
}

export class CoachSearchPage extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);
        this.state = {
            Query: new CoachSearch(),
            SelectedCity: new CityGeoBasic,
            Coaches: [],
            SearchCountry: new CountryGeo,
            CityQuery: "",
            LoadingCities: false,
            LoadingCoaches: false,
            MaxResults: 0,
            InitialLoad: true,
            ValidationString: "",
            ToggleChecked: false,
            ModalOpen: false
        };

        if (CoachSearchState.HasState()) {
            this.state = CoachSearchState.GetState();
        }

        this.SearchCoaches = this.SearchCoaches.bind(this);
        this.CitySelected = this.CitySelected.bind(this);
        this.ClearFilters = this.ClearFilters.bind(this);
    }

    componentDidMount() {
        if (!CoachSearchState.HasState()) {
            this.SearchCoaches();
        }
    }

    private ClearFilters() {
        let q = this.state.Query;

        q.coachBodybuilding = 0;
        q.coachClasses = 0;
        q.coachCrossfit = 0;
        q.coachDance = 0;
        q.coachMasseuse = 0;
        q.coachNutrition = 0;
        q.coachOlympicLifting = 0;
        q.coachOneOnOne = 0
        q.coachOnlineAvailable = 0;
        q.coachOnlineOnly = 0;
        q.coachOther = 0;
        q.coachPhysio = 0;
        q.coachPowerlifting = 0;
        q.coachProgramOnly = 0;
        q.coachStrongman = 0;
        q.coachWeightLoss = 0;

        this.setState({
            Query: q
        })
    }

    private CitySelected(city: CityGeoBasic) {
        this.state.Query.cityId = city.cityGeoId;
        this.setState({
            Query: this.state.Query,
            SelectedCity: city
        })
        this.SearchCoaches();

        CoachSearchState.SetState(this.state);
    }

    private SearchCoaches(incrementPage: boolean = false) {
        //
        this.setState({
            ValidationString: "",
            ModalOpen: false
        });
        CoachSearchState.SetState(this.state);

        if (!this.state.LoadingCoaches) {
            if (!incrementPage)
                this.state.Query.page = 0;

            this.setState({
                LoadingCoaches: true,
                Query: this.state.Query
            });
            CoachSearchState.SetState(this.state);

            fetch('api/CoachFinder/Search/',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.Query)
                })
                .then(response => response.json() as Promise<HttpResult<{ coaches: UserProfile[], total: number }>>)
                .then(data => {
                    if (data.ok) {
                        let coachList = new Array<UserProfile>();

                        if (incrementPage) {
                            coachList = this.state.Coaches.concat(data.data.coaches);
                        }
                        else {
                            coachList = data.data.coaches;
                            //reset back to top
                            let scroller = document.getElementById('coachScroller') as HTMLDivElement;
                            if (scroller)
                                scroller.scrollTop = 0;
                        }

                        //increments page here, but is reset back to 0 if incrementPage is false in next call
                        this.state.Query.page += 1;

                        this.setState({
                            Query: this.state.Query,
                            Coaches: coachList,
                            LoadingCoaches: false,
                            MaxResults: data.data.total,
                            InitialLoad: false,
                            ValidationString: "",
                        });
                        CoachSearchState.SetState(this.state);
                    }
                    else {
                        alert(data.message);
                        this.setState({
                            Query: new CoachSearch(),
                            Coaches: [],
                            LoadingCoaches: false,
                            ValidationString: data.message
                        });
                        CoachSearchState.SetState(this.state);
                    }
                }).catch((e: Error) => {
                    alert(e.message);
                    this.setState({
                        LoadingCoaches: false
                    });
                    CoachSearchState.SetState(this.state);
                });
        }
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
        let coachList = this.state.Coaches.length > 0
            ? this.state.Coaches.map((c, i) => <CoachFinderCoachView key={i.toString() + c.id.toString()}
                coach={c} BackgroundColor={i % 2 == 0 ? 'White' : 'White'}
                ListView={true}
            />)
            : this.state.Coaches.length == 0 && this.state.LoadingCoaches
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
                    <div className="row max-width" >
                        <div className="col-md-6">

                            <div>
                                <table className="full-width">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input className="form-control searchInput" value={this.state.Query.keywords}
                                                    style={{ width: '100%', marginRight: '4px' }}
                                                    onKeyUp={(e) => { EnterPressed(e, this.SearchCoaches) }}
                                                    onChange={(e) => {
                                                        this.state.Query.keywords = e.target.value;
                                                        this.setState({ Query: this.state.Query });
                                                        CoachSearchState.SetState(this.state);
                                                    }} placeholder="Keywords" />

                                            </td>
                                            <td style={{ minWidth: '125px', textAlign: 'center', verticalAlign: 'middle' }}>

                                                <button hidden={this.state.LoadingCoaches} className="btn btn-primary btn-sm" style={{ marginRight: '4px' }} onClick={() => this.setState({ ModalOpen: true })}>
                                                    Filters
                                            </button>

                                                <button className="btn btn-primary btn-sm" onClick={() => this.SearchCoaches()}>
                                                    <InlineLoader Text="Search" Loading={this.state.LoadingCoaches} />
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
                                        <td >
                                            <label className="adminGymToggleLabel">
                                                <Toggle
                                                    className="adminGymToggle"
                                                    defaultChecked={this.state.ToggleChecked}
                                                    onChange={() => {
                                                        let s = this.state.Query.isVerfied;
                                                        this.state.Query.isVerfied = s == VerifiedSatus.Verfifed
                                                            ? VerifiedSatus.NotVerified
                                                            : VerifiedSatus.Verfifed;
                                                        this.setState({
                                                            Query: this.state.Query,
                                                            ToggleChecked: !this.state.ToggleChecked
                                                        });
                                                        CoachSearchState.SetState(this.state);
                                                    }} />
                                                <span>{this.state.ToggleChecked ? ' Verified' : ' All'}</span>
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

                    <CoacSearchFilter queryObject={this.state.Query} searchPage={this} onSearch={this.SearchCoaches} onClear={this.ClearFilters} />

                </Modal>

                <div >
                    <div id="coachScroller"
                        style={{
                            height: OnMobile() ? 'calc(100vh - 70px - 80px - 60px)' : 'calc(100vh - 85px - 60px)',
                            margin: '2px',
                            overflowY: 'auto'
                        }}>

                        <InfiniteScroll
                            initialLoad={this.state.InitialLoad}
                            pageStart={0}
                            loadMore={() => this.SearchCoaches(true)}
                            hasMore={this.state.Coaches.length != this.state.MaxResults}
                            loader={<div className="text-center"><Loader CentreAlign ContainerMargin="20px 0 20px 0" Height="40px" /></div>}
                            useWindow={false}
                        >
                            {coachList}
                        </InfiniteScroll>

                        <div className="text-center" style={{ color: '#666', margin: '15px 0 0 0' }} hidden={this.state.ValidationString.length == 0}>
                            {this.state.ValidationString}
                        </div>

                        <div className="text-center" hidden={this.state.LoadingCoaches} style={{ display: 'flex', alignItems: 'center', height: '50%' }}>
                            {
                                this.state.Coaches.length == this.state.MaxResults
                                    && this.state.Coaches.length > 0
                                    && !this.state.InitialLoad
                                    ? <div className="text-center  full-width">'End of results!'</div>
                                    : this.state.Coaches.length == 0 && !this.state.InitialLoad && !this.state.LoadingCoaches
                                        ? <div className="text-center full-width">
                                            <img id="searchpage-logo" src='/dist/images/Gym-Bay_logo.png' />
                                            'No results!'
                                    </div>
                                        : <img id="searchpage-logo" src='/dist/images/Gym-Bay_logo.png' />
                            }
                        </div>
                    </div>
                </div>

                <Link to={{
                    pathname: Pages.dashboard,
                    state: { returnPath: Pages.profile }
                }}
                    hidden={UserLoggedIn()} className="btn btn-lg specialLoginBtn">
                    I am a Coach
                    </Link>

            </div>

        </div>;
    }
}