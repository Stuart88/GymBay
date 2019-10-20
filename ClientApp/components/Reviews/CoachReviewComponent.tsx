import * as React from 'react';
import { CoachReviewPublic, CoachBasic, UpvoteItems } from '../../data/serverModels';
import { Icon, IconType } from '../Widgets/Widgets';
import '../../css/review.css'
import { GetUserID, AdminLoggedIn } from '../../Helpers/Functions';
import { RouteComponentProps } from 'react-router';
import { Pages, SiteDetails } from '../../Helpers/Globals';
import { UpvoteComponent } from '../Widgets/UpvoteComponent';

interface ModuleProps {
    Review: CoachReviewPublic
    Props: RouteComponentProps<any>
    Coach: CoachBasic
}

interface Modulestate {
    Review: CoachReviewPublic
}

export class CoachReviewComponent extends React.Component<ModuleProps, Modulestate> {
    constructor(props) {
        super(props);
        this.state = {
            Review: this.props.Review
        }
    }

    public render() {
        let r = this.state.Review;

        return <div className="reviewContainer">

            <div hidden={r.review.reviewerId != GetUserID() && !AdminLoggedIn()} className="text-right">
                <button className="btn btn-primary btn-sm" onClick={() => this.props.Props.history.push(Pages.coachreview, { review: r.review, coach: this.props.Coach })}>Edit</button>
            </div>

            <table className="reviewerName">
                <tbody>
                    <tr>
                        <td width="70px">
                            <img style={{ height: '40px', width: '40px', margin: 'auto', display: 'block' }}
                                src={r.reviewerPic && r.reviewerPic.length > 0
                                    ? r.reviewerPic
                                    : '/dist/images/coachfinder/default-coach.jpg'} />
                        </td>
                        <td>
                            <div style={{ color: 'var(--grey)' }}>by {r.reviewerName}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h4 className="reviewTitle">{r.review.title}</h4>

            <div className="reviewScore">
                <progress className="gymRating" value={r.review.rating / SiteDetails.MaxRating} />
                {r.review.rating} / {SiteDetails.MaxRating}
            </div>

            <div className="mainReview hasLineBreaks">
                {r.review.mainReview}
            </div>

            <hr />

            <div className="row">
                <div className="col-md-6">
                    <div className="goodBadPoints">
                        <div style={{ color: 'Green', fontWeight: 'bold' }}>Good</div>
                        {
                            r.review.goodPoints.length > 0
                                ? r.review.goodPoints.split(';;;').filter(x => x.length > 0).map(p => <div><Icon Hidden={false} Name="plus" Type={IconType.Iconic} Class="" /> {p}</div>)
                                : null
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="goodBadPoints">
                        <div style={{ color: 'Red', fontWeight: 'bold' }}>Bad</div>
                        {
                            r.review.badPoints.length > 0
                                ? r.review.badPoints.split(';;;').filter(x => x.length > 0).map(p => <div><Icon Hidden={false} Name="minus" Type={IconType.Iconic} Class="" /> {p}</div>)
                                : null
                        }
                    </div>
                </div>
            </div>

            <div style={{ display: 'flow-root' }}>
                <UpvoteComponent ItemID={r.review.id} UpvoteItem={UpvoteItems.CoachReview} Upvotes={r.review.upvotes} BelongsToUser={r.review.reviewerId == GetUserID()}
                    onVoteComplete={(voteString) => { this.state.Review.review.upvotes = voteString; this.setState({ Review: this.state.Review }) }} />
            </div>
        </div>
    }
}