import * as React from 'react';
import { GymImagesArray, UserLoggedIn, GetUserID, toGymFinderBasic, OnMobile } from '../../Helpers/Functions';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { GymFinderGym, HttpResult, GymReviewPublic, GymReview } from '../../data/serverModels';
import { RouteComponentProps, Link } from 'react-router-dom';
import { GymFinderGymView } from './GymFinderGymView';
import { GymReviewComponent } from '../Reviews/GymReviewComponent';
import { Pages } from '../../Helpers/Globals';
import { Loader } from '../Widgets/Loaders';


interface ModuleState {
    Gym: GymFinderGym
    Reviews: Array<GymReviewPublic>
    GymID: number
    Loading: boolean
}

export class GymSinglePage extends React.Component<RouteComponentProps<{}>, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            Gym: new GymFinderGym,
            Reviews: [],
            GymID: Number(this.props.match.params["gymID"]),
            Loading: true
        }
        
        this.GetGym = this.GetGym.bind(this);
        this.GetReviews = this.GetReviews.bind(this);
    }

    componentDidMount() {
        this.GetGym();
    }

    componentDidUpdate(prevProps, prevSate) {

        if (Number(this.props.match.params["gymID"]) != prevSate.GymID) {
            this.setState({
                GymID: Number(this.props.match.params["gymID"])
            })
            this.GetGym();
        }
           
    }

    shouldComponentUpdate(nextProps, nextState) {

        //console.log(this.props.match.params["gymID"] != nextProps.match.params["gymID"]
        //    || this.state != nextState)

        return this.props.match.params["gymID"] != nextProps.match.params["gymID"]
            || this.state != nextState;
    }

    public render() {


        let g = this.state.Gym;

        let r = this.state.Reviews;


        return <div style={{ backgroundColor: 'rgb(243, 243, 243)', minHeight: '100%', paddingBottom: '70px', paddingTop: OnMobile() ? null : '30px' }}>

            <HeaderSearchBarArea Props={this.props} />

            <div hidden={this.state.Loading} className="max-width" style={{ marginBottom: '100px' }}>


                <GymFinderGymView BackgroundColor='white' Gym={g} Hidden={false} imageViewerSRCs={GymImagesArray(g)} ListView={false} />

                <br/>
                <h3 className="text-center">Reviews</h3>

                <div className="reviewContainer text-center" hidden={g.ownerID == GetUserID()}>
                    <Link
                        
                        className="btn btn-primary" 
                        to={UserLoggedIn()
                            ? {
                                pathname: Pages.gymreview,
                                state: { review: new GymReview, gym: toGymFinderBasic(g) }
                                }   
                            : {
                                pathname: Pages.dashboard,
                                state: { returnPath: Pages.gymreview, returnState: { review: new GymReview, gym: toGymFinderBasic(g) } }
                              }
                            } 

                    >{r.filter(x => x.review.reviewerId == GetUserID()).length > 0
                        ? 'Edit my Review'
                        : 'Add Review'}
                    </Link>

                   
                </div>

                {
                    r.map(review => <GymReviewComponent Review={review} Props={this.props} Gym={toGymFinderBasic(g)} />)
                }

                <Link to={{
                    pathname: Pages.dashboard,
                    state: { returnPath: Pages.mygym }
                }}
                    hidden={UserLoggedIn()} className="btn btn-lg specialLoginBtn">
                    Add My Gym
                    </Link>

            </div>

            <div hidden={!this.state.Loading} style={{ paddingTop: '50px' }}>
                <Loader CentreAlign ContainerMargin="0" Height="80px" />
            </div>

        </div>
    }

    private GetGym() {

        this.setState({
            Loading: true
        });

        fetch('/api/GymFinder/GetGym?gymID=' + this.state.GymID)
            .then(response => response.json() as Promise<HttpResult<GymFinderGym>>)
            .then(data => {

                if (data.ok) {
                    this.setState({
                        Gym: data.data,
                    });

                    this.GetReviews();
                }
                else {
                    console.log("GetGym: " + data.message);
                    this.props.history.push(Pages.gymfinder)
                }


            });
    }

    private GetReviews() {

        fetch('/api/Reviews/GetGymReviews?gymID=' + this.state.GymID)
            .then(response => response.json() as Promise<HttpResult<GymReviewPublic[]>>)
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


