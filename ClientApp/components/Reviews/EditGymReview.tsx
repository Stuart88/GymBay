import * as React from 'react';
import { HttpResult, GymReview, GymFinderBasic } from '../../data/serverModels';
import { CreatePostObject, EnterPressed, UserLoggedIn } from '../../Helpers/Functions';
import '../../css/gymfinderAddGym.css';
import { CenterTitleWithLine, Icon, IconType } from '../Widgets/Widgets';
import { Loader } from '../Widgets/Loaders';
import { CSSValues, Pages, SiteDetails } from '../../Helpers/Globals';
import { GymSearchAutosuggest } from '../Widgets/GymSearchAutosuggest';
import { RouteComponentProps } from 'react-router';
import { DashboardNav } from '../Dashboard/DashboardNav';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';

interface ModuleState {
    Review: GymReview
    GoodPoints: Array<string>
    BadPoints: Array<string>
    GoodPointInput: string
    BadPointInput: string
    SelectedGym: GymFinderBasic
    Loading: boolean
    ValidationString: string
    Saving: boolean
    Finished: boolean
    KeyCount: number //increment each time new key is added, for resetting CitiesAutoselect amd <form> area
}

interface ModuleProps {
    //SelectedGym: GymFinderGym
    Props: RouteComponentProps<any>
}

export class EditGymReview extends React.Component<ModuleProps, ModuleState> {
    constructor(props) {
        super(props);

        let reviewFromLinkState = this.props.Props.location.state.review as GymReview;
        let goodPoints = reviewFromLinkState ? reviewFromLinkState.goodPoints.split(';;;') : [];
        let badPoints = reviewFromLinkState ? reviewFromLinkState.badPoints.split(';;;') : [];

        let gymFromLinkState = this.props.Props.location.state.gym as GymFinderBasic;

        if (reviewFromLinkState && gymFromLinkState) {
            reviewFromLinkState.gymId = gymFromLinkState.id;
        }

        this.state = {
            Review: reviewFromLinkState ? reviewFromLinkState : new GymReview,
            GoodPoints: goodPoints,
            BadPoints: badPoints,
            GoodPointInput: "",
            BadPointInput: "",
            SelectedGym: gymFromLinkState ? gymFromLinkState : new GymFinderBasic(),
            Loading: false,
            ValidationString: "",
            Saving: false,
            Finished: false,
            KeyCount: 0
        };
        this.GetReview = this.GetReview.bind(this);
        this.Validate = this.Validate.bind(this);
        this.Save = this.Save.bind(this);
        this.Delete = this.Delete.bind(this);
        this.GymSelected = this.GymSelected.bind(this);
        this.RatingSelected = this.RatingSelected.bind(this);
        this.AddGoodPoint = this.AddGoodPoint.bind(this);
        this.AddBadPoint = this.AddBadPoint.bind(this);
        this.ResetForm = this.ResetForm.bind(this);

        if (reviewFromLinkState) {
            this.GetReview(reviewFromLinkState.gymId);
        }
    }

    private GetReview(gymid: number) {
        this.setState({
            ValidationString: "Loading...",
            Saving: true
        })

        fetch('/api/Reviews/GetMyGymReview?gymID=' + gymid)
            .then(response => response.json() as Promise<HttpResult<GymReview>>)
            .then(data => {
                if (data.ok) {
                    this.setState({
                        Review: data.data,
                        KeyCount: this.state.KeyCount + 1,
                        GoodPoints: data.data.goodPoints.split(';;;'),
                        BadPoints: data.data.goodPoints.split(';;;'),
                        ValidationString: "",
                        Saving: false
                    });
                }
                else {
                    console.log("GetReview: " + data.message);
                    this.setState({
                        ValidationString: "",
                        Saving: false
                    })
                }
            });
    }

    private Validate(r: GymReview): { valid: boolean, message: string } {
        let valid = true;
        let message = "";

        if (r.gymId == 0) {
            message += "No gym selected\n";
        }
        if (r.title.length == 0) {
            message += "Review Title\n";
        }
        if (r.mainReview.length == 0) {
            message += "Review Text\n";
        }
        if (r.mainReview.length > 1000) {
            message += "Review too long!\n";
        }
        if (r.goodPoints.length == 0) {
            message += "Please add at least one Good Bit\n";
        }
        if (r.badPoints.length == 0) {
            message += "Please add at least one Bad Bit\n";
        }

        valid = message.length == 0;

        return { valid, message };
    }

    private Save() {
        //Catch any good/bad points that user left in entry area expecting it to automatically save
        this.AddGoodPoint();
        this.AddBadPoint();
        let r = this.state.Review;
        r.goodPoints = this.state.GoodPoints.join(';;;');
        r.badPoints = this.state.BadPoints.join(';;;');

        let validation = this.Validate(this.state.Review);

        if (validation.valid) {
            this.setState({
                Review: r,
                ValidationString: "Saving...",
                Saving: true
            })

            fetch('api/Reviews/AddEditGymReview', CreatePostObject(this.state.Review))
                .then(response => response.json() as Promise<HttpResult<GymReview>>)
                .then(data => {
                    if (data.ok) {
                        this.props.Props.history.push(`${Pages.viewgym}/${data.data.gymId}/${this.state.SelectedGym.name}`)
                    }
                    else {
                        this.setState({
                            ValidationString: data.message,
                            Saving: false,
                        })
                    }
                }).catch((e: Error) => this.setState({
                    ValidationString: e.message,
                    Saving: false
                }));
        }
        else {
            this.setState({
                ValidationString: "Required: \n" + validation.message,
                Saving: false
            })
        }
    }

    private Delete() {
        if (confirm('Delete Review: Are you sure?')) {
            fetch('api/Reviews/DeleteGymReview/' + this.state.Review.id,
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
                        this.props.Props.history.push(`${Pages.viewgym}/'${this.state.SelectedGym.id}/${this.state.SelectedGym.name}`);
                    }
                    else {
                        alert(res.message);
                    }
                })
                .catch((e: Error) => alert(e.message));
        }
    }

    private GymSelected(g: GymFinderBasic) {
        let r = new GymReview;
        r.gymId = g.id;

        this.setState({
            Review: r,
            GoodPoints: [],
            BadPoints: [],
            GoodPointInput: "",
            BadPointInput: "",
            SelectedGym: g,
        })

        this.GetReview(g.id);
    }

    public render() {
        let s = this.state.SelectedGym;
        let hideFormAreas = this.state.SelectedGym.id == 0 && this.state.Review.id == 0;

        let ratingsOptions: Array<JSX.Element> = [];

        for (let i = 1; i <= SiteDetails.MaxRating; i++) {
            ratingsOptions.push(<label className={`hover-pointer ratingLabel ${i <= this.state.Review.rating ? 'ratingSelected' : ''}`} htmlFor={`rating${i}`}>
                <input hidden id={`rating${i}`} type="radio" value={`${i}`} checked={this.state.Review.rating == i} name="group1" onChange={(e) => this.RatingSelected(e.target.value)} />
                ★
                                </label>);
        }

        console.log(this.state.KeyCount);
        return <div>

            <HeaderSearchBarArea Props={this.props.Props} />

            <DashboardNav />

            <div id="reviewWholePage" style={{ padding: '10px', maxWidth: '700px', margin: 'auto', paddingBottom: '80px', marginTop: CSSValues.DashNavHeight }}>

                <h3 className="text-center" style={{ color: 'var(--black)' }}>Gym Review</h3>

                <form key={this.state.KeyCount} hidden={this.state.Finished || this.state.Saving}>

                    <div hidden={!hideFormAreas}>

                        <CenterTitleWithLine Title="Gym" LineColour="cornflowerblue" />

                        <div className="row">
                            <div className="col-md-6">
                                <GymSearchAutosuggest GymSelected={this.GymSelected} />
                            </div>
                            <div className="col-md-6" hidden={this.state.SelectedGym.id > 0 && this.state.Review.id == 0}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: '10px'
                                }}
                            >
                                Select a gym to review
                        </div>
                        </div>

                    </div>

                    <div hidden={hideFormAreas}>

                        <div className="text-center">
                            <button type="button" className="btn btn-primary btn-sm" onClick={this.ResetForm}>Change Gym</button>
                        </div>

                        <br />
                        <br />
                        <br />

                        <div className="text-right">
                            <button type="button" className="btn btn-primary btn-sm" style={{ marginRight: '4px' }} onClick={this.Save}>Save</button>
                            <button hidden={this.state.Review.id == 0} type="button" className="btn btn-danger btn-sm" onClick={this.Delete}>Delete</button>
                        </div>

                        <CenterTitleWithLine Title="Reviewing Gym" LineColour="cornflowerblue" />

                        <div className="row">
                            <div className="col-md-12">
                                <div style={{ fontWeight: 'bold', color: '#666' }}>

                                    <div hidden={this.state.Review.id == 0} style={{ marginBottom: '20px' }}>
                                        You have already reviewed this gym
                                    </div>

                                    {
                                        this.state.SelectedGym.id > 0
                                            ? <table className="full-width">
                                                <tbody>
                                                    <tr>
                                                        <td width="70px">
                                                            <img style={{ height: '50px', width: '50px', margin: 'auto', display: 'block' }}
                                                                src={s.logo && s.logo.length > 0
                                                                    ? s.logo
                                                                    : '/dist/images/gymfinder/default-gym.svg'} />
                                                        </td>
                                                        <td>
                                                            <div style={{ color: 'var(--black)' }}>{s.name}</div>
                                                            <div style={{ color: '#666', fontSize: '13px' }}>{s.cityName}, {s.countryName}</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            : null
                                    }</div>
                            </div>

                        </div>

                        <CenterTitleWithLine Title="Title" LineColour="cornflowerblue" />

                        <div className="row">
                            <div className="col-md-12">
                                <input className="form-control searchInput" placeholder="Review Title"
                                    value={this.state.Review.title}
                                    onChange={(e) => { this.state.Review.title = e.target.value; this.setState({ Review: this.state.Review }) }} />

                            </div>
                        </div>

                        <CenterTitleWithLine Title="Rating" LineColour="cornflowerblue" />

                        <div className="reviewStarsContainer">
                            <fieldset id="ratingsGroup" defaultValue={this.state.Review.rating.toString()}>
                                {ratingsOptions}
                            </fieldset>

                            <h4 className="text-center">{this.state.Review.rating.toString()} <span style={{ fontSize: '70%' }}>/ {SiteDetails.MaxRating}</span></h4>

                        </div>

                        <CenterTitleWithLine Title="Review" LineColour="cornflowerblue" />

                        <textarea className="form-control" style={{ minHeight: '150px' }} value={this.state.Review.mainReview}
                            onChange={(e) => {
                                this.state.Review.mainReview = e.target.value; this.setState({ Review: this.state.Review })
                            }}
                            placeholder="Main review text..."
                        ></textarea>
                        Characters: <span style={{ color: this.state.Review.mainReview.length > 1000 ? 'red' : 'initial' }}>
                            {this.state.Review.mainReview.length}
                        </span> / 1000

                </div>

                    <div hidden={hideFormAreas}>

                        <CenterTitleWithLine Title="Good Bits " LineColour="cornflowerblue" />

                        <div className="row">
                            <div className="col-md-12">
                                <table className="full-width">
                                    <tbody>
                                        {
                                            this.state.GoodPoints.filter(x => x.length > 0).map((p, i) =>
                                                <tr>
                                                    <td>
                                                        <Icon Hidden={false} Type={IconType.Iconic} Name="plus" Class="" />
                                                    </td>
                                                    <td>
                                                        {p}
                                                    </td>
                                                    <td className="text-right">
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                                            let points = this.state.GoodPoints.filter(point => point != p);
                                                            this.setState({ GoodPoints: points });
                                                        }}>Remove</button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                <table className="full-width">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input className="form-control searchInput" value={this.state.GoodPointInput}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            GoodPointInput: e.target.value
                                                        })
                                                    }}
                                                    placeholder="Start your list here"
                                                    onKeyUp={(e) => EnterPressed(e, this.AddGoodPoint)} />
                                            </td>
                                            <td className="text-right">
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={this.AddGoodPoint}>Add</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <CenterTitleWithLine Title="Bad Bits" LineColour="cornflowerblue" />

                        <div className="row">

                            <div className="col-md-12">
                                <table className="full-width">
                                    <tbody>
                                        {
                                            this.state.BadPoints.filter(x => x.length > 0).map((p, i) =>
                                                <tr>
                                                    <td>
                                                        <Icon Hidden={false} Type={IconType.Iconic} Name="minus" Class="" />
                                                    </td>
                                                    <td>
                                                        {p}
                                                    </td>
                                                    <td className="text-right">
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                                            let points = this.state.BadPoints.filter(point => point != p);
                                                            this.setState({ BadPoints: points });
                                                        }}>Remove</button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                <table className="full-width">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input className="form-control searchInput" value={this.state.BadPointInput}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            BadPointInput: e.target.value
                                                        })
                                                    }}
                                                    placeholder="Start your list here"
                                                    onKeyUp={(e) => EnterPressed(e, this.AddBadPoint)} />
                                            </td>
                                            <td className="text-right">
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={this.AddBadPoint}>Add</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <br />

                        <CenterTitleWithLine Title="" LineColour="cornflowerblue" />

                        <div className="text-right">
                            <br />
                            <button type="button" className="btn btn-primary" onClick={this.Save}>Save</button>
                        </div>
                    </div>

                </form>

                <div className="text-center" hidden={!this.state.Saving} >
                    <Loader CentreAlign ContainerMargin='20px 0 20px 0' Height='80px' />
                </div>

                <div className="text-center">
                    <br />
                    <span className="hasLineBreaks" style={{ color: 'red' }}>{this.state.ValidationString}</span>
                </div>

            </div>

        </div>
    }

    private ResetForm() {
        this.setState({
            Review: new GymReview,
            GoodPoints: [],
            BadPoints: [],
            GoodPointInput: "",
            BadPointInput: "",
            SelectedGym: new GymFinderBasic(),
            Loading: false,
            ValidationString: "",
            Saving: false,
            Finished: false,
            KeyCount: this.state.KeyCount + 1
        });
    }

    private AddGoodPoint() {
        if (this.state.GoodPointInput.length > 0) {
            this.state.GoodPoints.push(this.state.GoodPointInput);
            this.setState({
                GoodPoints: this.state.GoodPoints,
                GoodPointInput: ""
            })
        }
    }

    private AddBadPoint() {
        if (this.state.BadPointInput.length > 0) {
            this.state.BadPoints.push(this.state.BadPointInput);
            this.setState({
                BadPoints: this.state.BadPoints,
                BadPointInput: ""
            })
        }
    }

    private RatingSelected(value: string): void {
        {
            this.state.Review.rating = Number(value);
            this.setState({
                Review: this.state.Review
            })
        }
    }
}