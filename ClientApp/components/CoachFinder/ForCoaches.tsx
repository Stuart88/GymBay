import * as React from 'react';
import { UserLoggedIn, GetUserID, toCoachBasic, OnMobile } from '../../Helpers/Functions';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { HttpResult, CoachReviewPublic, CoachReview, UserProfile } from '../../data/serverModels';
import { RouteComponentProps, Link } from 'react-router-dom';
import { CoachReviewComponent } from '../Reviews/CoachReviewComponent';
import { Pages, CSSValues } from '../../Helpers/Globals';
import { Loader } from '../Widgets/Loaders';
import { CoachFinderCoachView } from './CoachFinderCoachView';
import { Icon, IconType, CenterTitleWithLine, Footer } from '../Widgets/Widgets';

export class ForCoaches extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props) {
        super(props);
    }

    public render() {
        let backgroundStyle: React.CSSProperties = {
            height: `calc(80vh - ${CSSValues.TopBarHeight}`,
            position: 'absolute',
            top: 0
        }

        let titleText = <div id="home-top-title-area">

            <div id="title-line-two">Gym-Bay.com</div>

        </div>

        let backgroundImages: Array<JSX.Element> = [];
        for (let i = 1; i < 7; i++) {
            backgroundImages.push(<div
                id={`Background${i}`}
                className="home-top-section"
                style={{
                    ...backgroundStyle,
                    ...{
                        backgroundImage: `url("dist/images/backgrounds/home${i}.jpg")`,
                        opacity: i == 1 ? 1 : 0
                    }
                }}>
                {titleText}
            </div>)
        }

        let backgroundCollection = <div >

            <div style={{ position: 'relative', width: '100%' }}>
                {
                    backgroundImages.map(x => x)
                }
            </div>

        </div>

        return <div style={{ backgroundColor: 'rgb(243, 243, 243)', minHeight: '100%', paddingBottom: '70px', paddingTop: OnMobile() ? null : '1px' }}>

            <HeaderSearchBarArea Props={this.props} />

            {backgroundCollection}

            <div style={{
                position: 'relative',
                top: 'calc(80vh - 60px)',
                backgroundColor: 'white'
            }}>

                <div className="forCoaches-sections"
                    style={{
                        backgroundColor: 'rgb(243, 243, 243)'
                    }}>

                    <h2 className="text-center">Join the fastest growing gym platform in the world</h2>

                </div>

                <div className="max-width">

                    <div style={{ paddingTop: '45px' }}>
                        <CenterTitleWithLine LineColour="var(--black)" Title="Why Gym Bay?" />
                    </div>

                    <div className="row forCoaches-sections">

                        <div className='col-md-6' >

                            <ul className="customList">
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">A one-stop platform for promoting what you can do</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Build your image and ratings with client reviews</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Showcase your experience and qualifications in a simple, professional way, all in on place</div>
                                </li>
                            </ul>

                        </div>

                        <div className='col-md-6 align-middle' >

                            <img className="img-fluid img-centred "
                                style={{
                                    boxShadow: '0px 0px 8px -4px #444',
                                    border: '1px solid var(--grey)'
                                }}
                                src='/dist/images/coachfinder/examples/profile.png' />

                        </div>
                    </div>

                    <div className="forCoaches-sections text-center">

                        <p style={{ margin: OnMobile() ? '10px' : 'auto', maxWidth: '600px' }}>
                            Stand out from the others. With Gym Bay, you
                            can take it up a level with professionalism and integrity. Show your clients what you can do, and prove that you're
                            at the top of your game.
                        </p>

                        <br />

                        <p style={{ margin: OnMobile() ? '10px' : 'auto', maxWidth: '600px' }}>
                            By collecting top ratings and reviews from clients, your Gym Bay profile will stand out and put you
                            head and shoulders above the rest.
                        </p>

                    </div>

                    <div style={{ paddingTop: '45px' }}>
                        <CenterTitleWithLine LineColour="var(--black)" Title="Who uses Gym Bay?" />
                    </div>

                    <div className="row forCoaches-sections align-middle">

                        <div className='col-md-6 align-middle' >

                            <img className="img-fluid img-centred"
                                style={{
                                    boxShadow: '0px 0px 8px -4px #444',
                                    border: '1px solid var(--grey)'
                                }}
                                src='/dist/images/coachfinder/examples/workout.jpeg' />

                        </div>
                        <div className='col-md-6 order-first order-md-6 align-middle'>

                            <ul className="customList">
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Amateurs</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Professionals</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Competitors</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Bodybuilders</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Newbies</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">Everyone</div>
                                </li>
                                <li >
                                    <Icon Type={IconType.CoachFinder} Name="verified" Class="customListIcon" Hidden={false} />
                                    <div className="customListText">You</div>
                                </li>
                            </ul>

                        </div>

                    </div>

                    <div className="forCoaches-sections">

                        <p className="text-center" style={{ margin: OnMobile() ? '10px' : 'auto', maxWidth: '600px' }}>
                            Gym Bay is for everyone. It doesn't matter if you're just getting started or are a seasoned professional.
                        </p>
                        <br />
                        <h3 className="text-center">
                            <Link to={{
                                pathname: Pages.dashboard,
                                state: { returnPath: Pages.profile }
                            }}
                                hidden={UserLoggedIn()} >
                                Join Today
                    </Link></h3>
                    </div>

                </div>

                <Footer />
            </div>

            <Link to={{
                pathname: Pages.dashboard,
                state: { returnPath: Pages.profile }
            }}
                hidden={UserLoggedIn()} className="btn btn-lg specialLoginBtn">
                Sign Up Now
                    </Link>

        </div>
    }
}