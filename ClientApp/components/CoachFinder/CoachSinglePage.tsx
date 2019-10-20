import * as React from 'react';
import { UserLoggedIn, GetUserID, toCoachBasic, OnMobile } from '../../Helpers/Functions';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { HttpResult, CoachReviewPublic, CoachReview, UserProfile } from '../../data/serverModels';
import { RouteComponentProps, Link } from 'react-router-dom';
import { CoachReviewComponent } from '../Reviews/CoachReviewComponent';
import { Pages } from '../../Helpers/Globals';
import { Loader } from '../Widgets/Loaders';
import { CoachFinderCoachView } from './CoachFinderCoachView';


interface ModuleState {
    Coach: UserProfile
    Reviews: Array<CoachReviewPublic>
    CoachID: number
    Loading: boolean
}

export class CoachSinglePage extends React.Component<RouteComponentProps<{}>, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            Coach: new UserProfile,
            Reviews: [],
            CoachID: Number(this.props.match.params["coachID"]),
            Loading: true
        }
        
        this.GetCoach = this.GetCoach.bind(this);
        this.GetReviews = this.GetReviews.bind(this);
    }

    componentDidMount() {
        this.GetCoach();
    }

    componentDidUpdate(prevProps, prevSate) {


        if (Number(this.props.match.params["coachID"]) != prevSate.CoachID) {
            this.setState({
                CoachID: Number(this.props.match.params["coachID"])
            })
            this.GetCoach();
        }
           
    }

    shouldComponentUpdate(nextProps, nextState) {

        
        return this.props.match.params["coachID"] != nextProps.match.params["coachID"]
            || this.state != nextState;
    }

    public render() {


        let c = this.state.Coach;

        let r = this.state.Reviews;


        return <div style={{ backgroundColor: 'rgb(243, 243, 243)', minHeight: '100%', paddingBottom: '70px', paddingTop: OnMobile() ? null :'30px' }}>

            <HeaderSearchBarArea Props={this.props} />

            <div hidden={this.state.Loading} className="max-width" style={{ marginBottom: '100px' }}>

               

                <CoachFinderCoachView  BackgroundColor="white" coach={c} ListView={false} />

                <br/>
                <h3 className="text-center">Reviews</h3>

                <div className="reviewContainer text-center" hidden={c.id == GetUserID()}>
                    <Link

                        className="btn btn-primary"
                        to={UserLoggedIn()
                            ? {
                                pathname: Pages.coachreview,
                                state: { review: new CoachReview, coach: toCoachBasic(c) }
                            }
                            : {
                                pathname: Pages.dashboard,
                                state: { returnPath: Pages.coachreview, returnState: { review: new CoachReview, coach: toCoachBasic(c) } }
                            }
                        }

                    >{r.filter(x => x.review.reviewerId == GetUserID()).length > 0
                        ? 'Edit my Review'
                        : 'Add Review'}
                    </Link>

                   
                </div>

                {
                    r.map(review => <CoachReviewComponent Review={review} Props={this.props} Coach={toCoachBasic(c)} />)
                }

                <Link to={{
                    pathname: Pages.dashboard,
                    state: { returnPath: Pages.profile }
                }}
                    hidden={UserLoggedIn()} className="btn btn-lg specialLoginBtn">
                    I am a Coach
                    </Link>

            </div>

            <div hidden={!this.state.Loading} style={{ paddingTop: '50px' }}>
                <Loader CentreAlign ContainerMargin="0" Height="80px" />
            </div>

        </div>
    }

    private GetCoach() {

        this.setState({
            Loading: true
        });

        fetch('/api/User/GetCoach?userID=' + this.state.CoachID)
            .then(response => response.json() as Promise<HttpResult<UserProfile>>)
            .then(data => {

                if (data.ok) {
                    this.setState({
                        Coach: data.data,
                    });

                    this.GetReviews();
                }
                else {
                    console.log("GetCoach: " + data.message);
                    this.props.history.push(Pages.coachfinder)
                }


            });
    }

    private GetReviews() {

        fetch('/api/Reviews/GetCoachReviews?coachID=' + this.state.CoachID)
            .then(response => response.json() as Promise<HttpResult<CoachReviewPublic[]>>)
            .then(data => {

                if (data.ok) {
                    this.setState({
                        Reviews: data.data,
                        Loading: false
                    });
                }
                else {
                    console.log("Get Reviews: " + data.message);
                }


            });
    }

  
}


