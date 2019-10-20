import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CSSValues, Pages } from '../../Helpers/Globals';
import '../../css/home.css';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import InfiniteScroll from 'react-infinite-scroller';
import { HttpResult, NewsFeedPostSingle } from '../../data/serverModels';
import { Loader } from '../Widgets/Loaders';
import { NewsfeedItem } from '../NewsFeed/NewsfeedItem';
import { OnMobile } from '../../Helpers/Functions';
import { NavLink, Link } from 'react-router-dom';
import { FeaturedGyms } from './FeaturedGyms';
import { FeaturedCoaches } from './FeaturedCoaches';

interface ModuleState {
    InitialLoad: boolean //for inifinite scroller
    NewsFeed: NewsFeedPostSingle[]
    LoadingPosts: boolean,
    MaxResults: number,
    PageNum: number
    Tab: HomeTabEnum
}

enum HomeTabEnum {
    Updates,
    NewsFeed,
    Featured
}

export class Home extends React.Component<RouteComponentProps<{}>, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            InitialLoad: true,
            NewsFeed: [],
            LoadingPosts: false,
            MaxResults: 0,
            PageNum: 0,
            Tab: HomeTabEnum.NewsFeed
        }

        this.GetNewsFeedPosts = this.GetNewsFeedPosts.bind(this);
    }

    componentDidMount() {
        this.GetNewsFeedPosts();
    }

    public render() {



        let posts = this.state.NewsFeed;


        return <div style={{ backgroundColor: '#f3f3f3'}}>
            <HeaderSearchBarArea Props={this.props} />

            <NavLink id="adminnn" hidden={OnMobile()} className="hover-pointer" to={Pages.admin} style={{ opacity: 0, position: 'absolute', bottom: '0', left: '0', color: '#eaeaea', zIndex: 1 }}>
                Admin
            </NavLink>

            <div className="mobileTabsArea" hidden={!OnMobile()}>

                <div id="tabNews" className={`mobileTab ${this.state.Tab == HomeTabEnum.NewsFeed ? 'hometabSelected' : ''}`} onClick={() => this.setState({ Tab: HomeTabEnum.NewsFeed })}>
                    Newsfeed
                    </div>
                <div id="tabUpdates" className={`mobileTab ${this.state.Tab == HomeTabEnum.Updates ? 'hometabSelected' : ''}`} onClick={() => this.setState({ Tab: HomeTabEnum.Updates })}>
                    Updates
                    </div>
                <div id="tabFeatured" className={`mobileTab ${this.state.Tab == HomeTabEnum.Featured ? 'hometabSelected' : ''}`} onClick={() => this.setState({ Tab: HomeTabEnum.Featured })}>
                    Featured
                    </div>

            </div>

            <div className="row">

                <div className={OnMobile() ? '' : "col-3"} style={{ paddingLeft: OnMobile() ? '0px' : '5px' }} hidden={OnMobile() && this.state.Tab != HomeTabEnum.Updates}>

                    <div className="welcomeContainer">
                        <h5 className="text-center">Welcome to<br/>Gym-Bay.com</h5>

                        <img className="welcomeImg img-fluid" src="/dist/images/Gym-Bay_logo.png" />

                        <div className="welcomeText">

                            <h5 className="text-center">Updates</h5>

                            <div className="newUpdateContainer">
                                <p>
                                    <b>06-Sept-2019</b>
                            </p>

                                <p>
                                    Logged-in users can now add comments and/or upvotes to the following:

                                    <ul>
                                        <li>News Items</li>
                                        <li>Gym Reviews</li>
                                        <li>Coach Reviews</li>
                                    </ul>
                                </p>


                                
                            </div>


                            <div className="newUpdateContainer">
                                <p>
                                    <b>03-Aug-2019</b>
                            <br />
                                    Gym-Bay.com is now live.
                            </p>

                                <p>
                                    Click <Link className="linkWhite" to={Pages.dashboard}>Login</Link> to create a free account.
                            </p>

                                <p>
                                    Upload your local gym so others can find it.
                            </p>

                                <p>
                                    When we have enough users, we will feature the top-rated gyms and coaches.
                            </p>

                                <p>
                                    User message board will be live soon to discuss any hot topics.
                            </p>

                                <p>
                                    Please see the <Link className="linkWhite" to={Pages.about}>About</Link> page for a full statement.
                            </p>

                                <p>
                                    That's all for now.
                            </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={OnMobile() ? "" : "col-6"} hidden={OnMobile() && this.state.Tab != HomeTabEnum.NewsFeed}>
                    <div style={{ height: `calc(100vh - ${CSSValues.TopBarHeight}`, width:'100%', overflowY: 'auto' }} >

                        <InfiniteScroll
                            initialLoad={this.state.InitialLoad}
                            pageStart={0}
                            loadMore={() => this.GetNewsFeedPosts()}
                            hasMore={this.state.NewsFeed.length != this.state.MaxResults}
                            loader={null}
                            useWindow={false}
                        >

                            {
                                //backgroundCollection

                            }

                            <div id="homeMainArea" >


                                <div className="max-width">



                                    {
                                        posts.map((p, i) => <NewsfeedItem Props={this.props} Post={p} OnNewsFeed={true} Index={i} InEditor={false} />)
                                    }

                                    <div hidden={this.state.LoadingPosts}>

                                        <hr />

                                        <br />
                                        <h4 className="text-center">That's all for now!</h4>
                                        <br />
                                        <br />
                                    </div>

                                    <div className="text-center" style={{ margin: 'auto', display:'block' }} hidden={!this.state.LoadingPosts}>
                                        <Loader CentreAlign ContainerMargin="20px 0 20px 0" Height="40px" />
                                    </div>

                                </div>


                            </div>

                        </InfiniteScroll>







                    </div>
                </div>

                <div className={OnMobile() ? '' : "col-3"} style={{
                    paddingRight: OnMobile() ? '0px' : '5px',
                    overflowY: 'auto',
                    maxHeight: OnMobile() ? null : 'calc(100% - 65px)',
                    minHeight: OnMobile() ? '100vh' : null,
                    width: OnMobile() ? '100vw' : 'auto'
                }} hidden={OnMobile() && this.state.Tab != HomeTabEnum.Featured}>

                    <div className="featuredContainer">
                        
                        <h5 className="">Top Gyms</h5>

                        <FeaturedGyms Props={this.props} />

                        <h5 className="">Top Coaches</h5>

                        <FeaturedCoaches Props={this.props} />

                     
                       
                    </div>

                </div>
            </div>
      
        </div>;
    }

  

    private GetNewsFeedPosts() {

        if (!this.state.LoadingPosts) {
            
            this.setState({
                LoadingPosts: true,
            });

            fetch('api/News/NewsFeed?page=' + this.state.PageNum)
                .then(response => response.json() as Promise<HttpResult<{ posts: NewsFeedPostSingle[], total: number }>>)
                .then(data => {

                    if (data.ok) {
                        let postList = new Array<NewsFeedPostSingle>();

                        postList = this.state.NewsFeed.concat(data.data.posts);

                        
                        //increments page here, but is reset back to 0 if incrementPage is false in next call

                        this.setState({
                            NewsFeed: postList,
                            LoadingPosts: false,
                            MaxResults: data.data.total,
                            PageNum: this.state.PageNum + 1,
                            InitialLoad: false,
                        });
                    }
                    else {
                        alert(data.message);
                        this.setState({
                            LoadingPosts: false,
                        });
                        alert(data.message);
                    }
                }).catch((e: Error) => {
                    this.setState({
                        LoadingPosts: false
                    });
                    alert(e.message);
                });
        }

    }

    
}
