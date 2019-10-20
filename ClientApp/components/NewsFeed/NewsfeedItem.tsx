import * as React from 'react';
import {   HttpResult, NewsFeedPostSingle, UpvoteItems, NewsFeedPost } from '../../data/serverModels';
import * as moment from 'moment';
import '../../css/newsFeed.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, RouteComponentProps, NavLink } from 'react-router-dom';
import { Pages } from '../../Helpers/Globals';
import { AdminLoggedIn, OnMobile } from '../../Helpers/Functions';
import $ from 'jquery';
import { UpvoteComponent } from '../Widgets/UpvoteComponent';


interface ModuleProps {
    Post: NewsFeedPostSingle
    Index: number;
    OnNewsFeed: boolean;
    InEditor: boolean;
    Props: RouteComponentProps<any>
}

interface ModuleState {
    Post: NewsFeedPost
}

export class NewsfeedItem extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            Post: this.props.Post.newsFeedPost
        }

        this.Delete = this.Delete.bind(this);
    }

    public render() {

        let p = this.state.Post;

        if ((!p.imageUrl && !p.videoUrl) || (p.imageUrl.length == 0 && p.videoUrl.length == 0))
            return this.renderTextOnly();
        else
            return this.renderWithPicVideo();
    }

    private renderTextOnly() {

        let p = this.state.Post;

        let postDate = moment(p.postDate).format('Do MMM YYYY[, ]HH:mm');

        return <div key={p.id} id={`newsfeed-Item-${p.id}`} style={{ maxWidth: '600px', margin: 'auto', paddingTop: '10px' }} >


            <div className="feedItemContainer">

                <div hidden={!AdminLoggedIn() || this.props.InEditor}>
                    <Link className="btn btn-primary btn-sm" to={{
                        pathname: Pages.newsfeedpost,
                        state: p
                    }} keyParams={JSON.stringify(p)}
                        style={{
                            marginLeft: 'auto'
                        }}> Edit </Link>

                    <button className="btn btn-danger btn-sm" onClick={this.Delete}
                        style={{
                            marginLeft: '15px'
                        }}>Delete</button>
                </div>

                <div className="row home-row">
                    <div className='col-12' >

                        <h2 className="text-center">{p.title}</h2>

                        <div className="feedItemDate text-center">{postDate}</div>

                        <div className="feedItemContent">
                            <ReactQuill theme="snow"
                                modules={{ toolbar: null }}
                                value={p.content}
                                className="quill-newsfeed"
                                readOnly />
                        </div>


                        <div style={{ display: 'flow-root' }}>


                            <UpvoteComponent ItemID={p.id} UpvoteItem={UpvoteItems.NewsFeedPost} Upvotes={p.upvotes} BelongsToUser={false}
                                onVoteComplete={(voteString) => { this.state.Post.upvotes = voteString; this.setState({ Post: this.state.Post }) }}
                            />
                            <div hidden={!this.props.OnNewsFeed} className="text-right" style={{ float: 'right', marginRight: OnMobile() ? '30%' : '20px' }}>
                                <NavLink to={`${Pages.newsItem}/${p.id}/${p.title}`} className="btn btn-primary btn-sm" style={{ marginRight: '5px' }} >
                                    Read More
                            </NavLink>


                                <NavLink to={`${Pages.newsItem}/${p.id}/${p.title}`} className="btn btn-primary btn-sm" >
                                    {this.props.Post.commentsCount} Comments
                            </NavLink>
                            </div>
                        </div>

                        


                    </div>
                   
                </div>

            </div>




        </div>;
    }

    private renderWithPicVideo() {

        let p = this.state.Post;

        let postDate = moment(p.postDate).format('Do MMM YYYY[, ]HH:mm');


        let adminBtns = <div hidden={!AdminLoggedIn() || this.props.InEditor}>
            <Link className="btn btn-primary btn-sm" to={{
                pathname: Pages.newsfeedpost,
                state: p
            }} keyParams={JSON.stringify(p)}
                style={{
                    marginLeft: 'auto'
                }}> Edit </Link>

            <button className="btn btn-danger btn-sm" onClick={this.Delete}
                style={{
                    marginLeft: '15px'
                }}>Delete</button>
        </div>

        

        let showvid = Boolean(p.videoUrl && p.videoUrl.length > 0);


        let titleSection = <div className={showvid ? 'text-center' : ''}>
            <h2>{p.title}</h2>

            <div className="feedItemDate">{postDate}</div>

        </div>

        let picSection = <div hidden={showvid} style={{ display: 'flex' }} >
            {p.imageUrl && p.imageUrl.length > 0
                ? <div  className="feedItemImage" style={{ backgroundImage: `url('${p.imageUrl}')` }}></div>
                : null}

        </div>

        let vidSection = <div hidden={!showvid} className="videoWrapper">
            {p.videoUrl && p.videoUrl.length > 0
                ? <iframe  src={p.videoUrl}></iframe>
        : null}
        </div>

        let textSection = <div className="feedItemContent">
            <ReactQuill theme="snow"
                modules={{ toolbar: null }}
                value={p.content}
                readOnly
                className="quill-newsfeed" />
        </div>

        let commentsBtn = <div hidden={!this.props.OnNewsFeed} className={OnMobile() ? 'text-center' : "text-right"} style={{ float: 'right', marginRight: OnMobile() ? '30%' : '20px' }}>

            <NavLink to={`${Pages.newsItem}/${p.id}/${p.title}`} className="btn btn-primary btn-sm" style={{ marginRight: '5px' }} >
            Read More
                            </NavLink>


            <NavLink to={`${Pages.newsItem}/${p.id}/${p.title}`} className="btn btn-primary btn-sm" >
                {this.props.Post.commentsCount} Comments
                            </NavLink>
        </div>

        return <div key={p.id} id={`newsfeed-Item-${p.id}`} className="max-width" style={{ paddingTop: '10px' }} >


            <div className="feedItemContainer">

                {adminBtns}

                {
                    this.props.Index % 2 == 0
                        ? <div className="row home-row">
                            <div hidden={showvid} className='col-md-6' style={{ padding: '5px' }}>


                                {picSection}
                               

                            </div>

                            <div className='col-md-6' style={{ padding: '2%', margin: 'auto' }}>

                                {titleSection}

                            </div>
                        </div>

                        : <div className="row home-row">
                            <div className='col-md-6' style={{ padding: '2%', margin: 'auto' }}>

                                {titleSection}

                            </div>
                            <div hidden={showvid} className='col-md-6 order-first order-md-6' style={{ padding: '5px' }}>

                                {picSection}

                            </div>

                        </div>
                }



                {vidSection}

                {textSection}


                <div style={{ display: 'flow-root' }}>
                    <UpvoteComponent ItemID={p.id} UpvoteItem={UpvoteItems.NewsFeedPost} Upvotes={p.upvotes} BelongsToUser={false}
                        onVoteComplete={(voteString) => { this.state.Post.upvotes = voteString; this.setState({ Post: this.state.Post }) }}
                    />
                    {commentsBtn}
                </div>

            </div>




        </div>;
    }

    private Delete() {
        if (confirm("Delete: Are you sure?")) {


            fetch('api/News/DeleteNewsfeedPost/' + this.props.Post.newsFeedPost.id,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: null
                })
                .then(response => response.json() as Promise<HttpResult<NewsfeedItem>>)
                .then(res => {

                    if (res.ok) {
                        $(`#newsfeed-Item-${this.props.Post.newsFeedPost.id}`).html('');
                    }
                    else {
                        alert(res.message);
                    }
                })
                .catch((e: Error) => alert(e.message));
        }
    }
  
}
