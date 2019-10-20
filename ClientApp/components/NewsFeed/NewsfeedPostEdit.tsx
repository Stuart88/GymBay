import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CreatePostObject, AdminLoggedIn } from '../../Helpers/Functions';
import { HttpResult, NewsFeedPost } from '../../data/serverModels';
import { Loader } from '../Widgets/Loaders';
import * as moment from 'moment';
import { Pages, toolbarOptions_Admin } from '../../Helpers/Globals';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import { NewsfeedItem } from './NewsfeedItem';




interface ModuleState {
    Post: NewsFeedPost;
    ResponseMessage: string;
    Saving: boolean;
    KeyCounter: number
}

interface ModuleProps {
    Props: RouteComponentProps<any>
    Post: NewsFeedPost
}

export class NewsfeedPostEdit extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);


        let postFromLinkState = this.props.Props.location.state as NewsFeedPost;
        this.state = {
            Post: postFromLinkState ? postFromLinkState : this.props.Post,
            ResponseMessage: "",
            Saving: false,
            KeyCounter: 0
        }

        if (!AdminLoggedIn())
            this.props.Props.history.push(Pages.dashboard);

        this.PostItem = this.PostItem.bind(this);
        this.PostValid = this.PostValid.bind(this);
    }

    public render() {

        let p = this.state.Post;

        return <div>
            <HeaderSearchBarArea Props={this.props.Props} />
            <div className="max-width full-centred" style={{ height: '100%', marginTop: '25px' }}>



            <div  className="max-width">

                <h1>Newsfeed Post</h1>

                <form hidden={this.state.Saving}>
                    <div className="row">
                        <div className="col-md-12">
                            Title
                            <input type="text" placeholder="Title" className="form-control" value={p.title} onChange={(e) => { this.state.Post.title = e.target.value; this.setState({ Post: this.state.Post }) }} />
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-md-12">
                                Image URL <span style={{ color: '#666', fontSize: '14px' }}>(if video URL is also entered, the post will show the video and this image will be used for social media sharing)</span>
                            <input type="text" placeholder="Image URL" className="form-control" value={p.imageUrl} onChange={(e) => { this.state.Post.imageUrl = e.target.value; this.setState({ Post: this.state.Post }) }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            Video URL
                            <input type="text" placeholder="e.g: https://www.youtube.com/embed/jUjh4DE8FZA" className="form-control" value={p.videoUrl} onChange={(e) => { this.state.Post.videoUrl = e.target.value; this.setState({ Post: this.state.Post }) }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            Publish Date:
                            <input type="datetime-local" className="form-control" value={moment(p.postDate).format('YYYY[-]MM[-]DD[T]HH:mm')}
                                    onChange={(e) => {
                                        //console.log(moment(p.postDate).format('YYYY[-]MM[-]DD[T]HH:mm'));
                                        //console.log(e.target.value);
                                        this.state.Post.postDate = e.target.value ? new Date(e.target.value) : new Date();
                                        this.setState({ Post: this.state.Post })
                                    }} />

                               
                            </div>
                          
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            Content
                            <ReactQuill theme="snow"
                                onChange={(value) => { this.state.Post.content = value; this.setState({ Post: this.state.Post }) }}
                                value={p.content}
                                modules={{ toolbar: toolbarOptions_Admin }} />
                        </div>
                    </div>

                    <div>
                        <button type="button" className="btn btn-primary" onClick={this.PostItem}>Save</button>
                    </div>
                    
                </form>

                <div hidden={!this.state.Saving}>
                    <Loader CentreAlign ContainerMargin="30px 0 0 0" Height="50px" />
                </div>

                <div style={{ color: 'blue' }}>{this.state.ResponseMessage}</div>

                    <hr />
                    <h3 className="text-center">Preview</h3>

                    <NewsfeedItem Index={0} OnNewsFeed={false} Post={{ newsFeedPost: p, comments: [], commentsCount: 0 }} Props={this.props.Props} InEditor={true} />
            </div>
            </div>



        </div>;
    }

   
    private PostItem() {

        this.setState({
            ResponseMessage: ""
        })

        if (this.PostValid()) {

            this.setState({
                Saving: true,
                ResponseMessage: "Posting..."
            })

            fetch('api/News/EditNewsfeedPost', CreatePostObject(this.state.Post))
                .then(response => response.json() as Promise<HttpResult<NewsFeedPost>>)
                .then(data => {

                    let finalMessage = this.state.Post.id == 0
                        ? "Saved!"
                        : "Edit Saved!";

                    this.setState({
                        Saving: false,
                        ResponseMessage: data.ok ? finalMessage : data.message,
                        Post: data.data,
                        KeyCounter: data.ok ? this.state.KeyCounter + 1 : this.state.KeyCounter
                    })

                })
        }
        
    }

    private PostValid(): boolean {
        let p = this.state.Post;
        let validationStr = "The following cannot be left blank: "
        let vLen = validationStr.length;

        if (p.title.length == 0)
            validationStr += "Title, ";

        if (p.content.length == 0)
            validationStr += "Post Content, "
        console.log(moment(p.postDate).year());
        if (moment(p.postDate).year() == 1990)//default year, according to serverModels.tsx
            validationStr += "Post Date. "

        

        if (validationStr.length > vLen) {
            this.setState({
                ResponseMessage: validationStr
            })
            return false;
        }
        else {
            return true;
        }
    }
}
