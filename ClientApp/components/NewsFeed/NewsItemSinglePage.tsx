import * as React from 'react';
import { UserLoggedIn, AdminLoggedIn, CreatePostObject, GetUserID } from '../../Helpers/Functions';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { HttpResult, NewsFeedPostSingle, NewsFeedComment, NewsFeedCommentPublic, PostStatus, UpvoteItems } from '../../data/serverModels';
import { RouteComponentProps, Link } from 'react-router-dom';
import { UserState, Pages } from '../../Helpers/Globals';
import { Loader } from '../Widgets/Loaders';
import { NewsfeedItem } from './NewsfeedItem';
import * as moment from 'moment';
import { UpvoteComponent } from '../Widgets/UpvoteComponent';

interface ModuleState {
    NewsItem: NewsFeedPostSingle
    LoadingAll: boolean
    CommentText: string
    ValidationString: string
}

export class NewsItemSinglePage extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            NewsItem: new NewsFeedPostSingle,
            LoadingAll: true,
            CommentText: "",
            ValidationString: ""
        }

        this.GetNewsItem = this.GetNewsItem.bind(this);
        this.PostComment = this.PostComment.bind(this);
        this.Delete = this.Delete.bind(this);
    }

    componentDidMount() {
        this.GetNewsItem(Number(this.props.match.params["itemID"]));
    }

    public render() {
        let comments = this.state.NewsItem.comments;

        let userLoggedIn = UserLoggedIn();

        return <div style={{ backgroundColor: 'rgb(243, 243, 243)', minHeight: '100%', paddingBottom: '50px' }}>

            <HeaderSearchBarArea Props={this.props} />

            <div hidden={this.state.LoadingAll} className="max-width">

                <NewsfeedItem key={this.state.NewsItem.newsFeedPost.id} Index={0} Post={this.state.NewsItem} OnNewsFeed={false} Props={this.props} InEditor={false} />

                <h3 className="text-center">Comments</h3>

                <br />

                <div className="addCommentContainer" >
                    <br />
                    <h5>Join the discussion <Link hidden={userLoggedIn} className="btn btn-primary btn-sm" to={{
                        pathname: Pages.dashboard,
                        state: { returnPath: this.props.location.pathname }
                    }} >Login</Link></h5>

                    <textarea disabled={!userLoggedIn} className="form-control" style={{ minHeight: '150px' }} value={this.state.CommentText}
                        onChange={(e) => {
                            this.setState({ CommentText: e.target.value })
                        }}
                        placeholder={userLoggedIn ? "Start writing..." : "Please sign in to post comments"}
                    ></textarea>
                    <div hidden={!userLoggedIn}>
                        Characters: <span style={{ color: this.state.CommentText.length > 1024 ? 'red' : 'initial' }}>
                            {this.state.CommentText.length}
                        </span> / 1024
                    </div>

                    <div className="text-right">
                        <button hidden={!userLoggedIn} className="btn btn-primary" onClick={this.PostComment}>Post</button>
                        <br />
                        <span style={{ color: 'blue' }}>{this.state.ValidationString}</span>
                    </div>

                </div>

                {
                    comments.map((c, i) => <div className="commentContainer">

                        <div className="commentAuthorTable">
                            <table className="full-width">
                                <tbody>
                                    <tr>
                                        <td width="36px">
                                            <img className="profileSocialIcon" src={c.authorPic} />
                                        </td>
                                        <td>
                                            <div className="commentAuthor">
                                                {c.authorName}
                                            </div>
                                            <div className="commentDate">
                                                {moment(c.creationDate).format('Do MMM YYYY[,  ]HH:mm')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-right" hidden={this.IsButtonHidden(c)}>

                                                <button className={`btn btn-sm ${c.status != PostStatus.Live ? 'btn-info' : 'btn-danger'}`} onClick={() => this.Delete(c)}>
                                                    {c.status != PostStatus.Live ? 'Restore' : 'Delete'}
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={`commentText hasLineBreaks ${c.status != PostStatus.Live ? 'commentDeleted' : null}`}>
                            {c.comment}
                        </div>

                        <div hidden={c.status != PostStatus.Live} style={{ display: 'flow-root' }}>
                            <UpvoteComponent ItemID={c.id} UpvoteItem={UpvoteItems.NewsFeedComment} Upvotes={c.upvotes} BelongsToUser={c.authorId == GetUserID()}
                                onVoteComplete={(voteString) => {
                                    let updatingComment = c;
                                    updatingComment.upvotes = voteString;
                                    let index = this.state.NewsItem.comments.indexOf(updatingComment);
                                    this.state.NewsItem.comments[index] = updatingComment;

                                    this.setState({ NewsItem: this.state.NewsItem })
                                }} />
                        </div>

                    </div>)
                }

            </div>

            <div hidden={!this.state.LoadingAll} style={{ paddingTop: '100px' }}>
                <Loader CentreAlign ContainerMargin="0 0 0 0" Height="80px" />
            </div>

        </div>
    }

    private IsButtonHidden(c: NewsFeedCommentPublic): boolean {
        //admin can see
        if (AdminLoggedIn())
            return false;

        //admin moderated post
        if (!AdminLoggedIn() && c.status == PostStatus.DeletedByModerator)
            return true;

        //user can see
        else if (c.authorId == UserState.Profile.id && UserLoggedIn())
            return false;

        else
            return true;
    }

    private GetNewsItem(itemID: number) {
        this.setState({
            LoadingAll: true
        });

        fetch('/api/News/NewsFeedPost?postID=' + itemID)
            .then(response => response.json() as Promise<HttpResult<NewsFeedPostSingle>>)
            .then(data => {
                if (data.ok) {
                    this.setState({
                        NewsItem: data.data,
                        LoadingAll: false
                    });
                }
                else {
                    alert(data.message)
                    console.log("GetGym: " + data.message);
                }
            });
    }

    private PostComment() {
        let comment = new NewsFeedComment();
        comment.authorId = UserState.Profile.id;
        comment.postId = this.state.NewsItem.newsFeedPost.id;
        comment.comment = this.state.CommentText;

        this.setState({
            CommentText: "",
            ValidationString: "Posting..."
        })

        if (this.state.CommentText.length <= 1024 && this.state.CommentText.length > 0) {
            fetch('api/News/AddEditComment', CreatePostObject(comment))
                .then(response => response.json() as Promise<HttpResult<NewsFeedCommentPublic>>)
                .then(data => {
                    if (data.ok) {
                        this.state.NewsItem.comments.push(data.data);

                        this.setState({
                            NewsItem: this.state.NewsItem,
                            CommentText: "",
                            ValidationString: ""
                        })
                    }
                    else {
                        this.setState({
                            CommentText: comment.comment,
                            ValidationString: data.message,
                        })
                    }
                }).catch((e: Error) => this.setState({
                    ValidationString: e.message,
                    CommentText: comment.comment
                }));
        }
        else {
            this.setState({
                CommentText: comment.comment,
                ValidationString: "Check comment length!"
            })
        }
    }

    private Delete(comment: NewsFeedCommentPublic) {
        fetch('api/News/ToggleDeleteComment/', CreatePostObject(comment))
            .then(response => response.json() as Promise<HttpResult<NewsFeedCommentPublic>>)
            .then(res => {
                if (res.ok) {
                    let updated = this.state.NewsItem.comments.filter(c => c.id == res.data.id)[0];
                    let index = this.state.NewsItem.comments.indexOf(updated);

                    this.state.NewsItem.comments[index] = res.data;

                    this.setState({
                        NewsItem: this.state.NewsItem
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .catch((e: Error) => alert(e.message));
    }
}