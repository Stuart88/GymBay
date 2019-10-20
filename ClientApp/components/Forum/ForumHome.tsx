import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CSSValues, Pages } from '../../Helpers/Globals';
import '../../css/home.css';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';
import InfiniteScroll from 'react-infinite-scroller';
import { HttpResult, NewsFeedPostSingle, ForumPostPublic, ForumCategory } from '../../data/serverModels';
import { Loader } from '../Widgets/Loaders';
import { NewsfeedItem } from '../NewsFeed/NewsfeedItem';
import { OnMobile } from '../../Helpers/Functions';
import { NavLink, Link } from 'react-router-dom';

interface ModuleState {
    Threads: ForumPostPublic[]
    Loading: boolean,
    MaxResults: number,
    PageNum: number
    PageTotal: number
    Category: ForumCategory,
}

export class ForumHome extends React.Component<RouteComponentProps<{}>, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            Threads: [],
            Loading: true,
            MaxResults: 0,
            PageNum: 0,
            PageTotal: 0,
            Category: ForumCategory.General
        }

        this.GetThreads = this.GetThreads.bind(this);
        this.NextPage = this.NextPage.bind(this);
        this.PreviousPage = this.PreviousPage.bind(this);
    }

    componentDidMount() {
        this.GetThreads();
    }

    public render() {
        let threads = this.state.Threads;

        return <div style={{ backgroundColor: '#f3f3f3' }}>
            <HeaderSearchBarArea Props={this.props} />

            <div className="max-width forumContainer">

                <div>Top bit... something goes here...</div>

                {
                    threads.map(t => OnMobile()
                        ? <div>

                        </div>
                        : <div></div>)
                }

            </div>

        </div>;
    }

    private NextPage() {
        if (this.state.PageNum < this.state.PageTotal) {
            this.setState({
                PageNum: this.state.PageNum + 1
            });
            this.GetThreads;
        }
    }
    private PreviousPage() {
        if (this.state.PageNum >= 0) {
            this.setState({
                PageNum: this.state.PageNum - 1
            });
            this.GetThreads;
        }
    }

    private GetThreads() {
        if (!this.state.Loading) {
            this.setState({
                Loading: true,
            });

            fetch(`api/Forum/GetThreads?page=${this.state.PageNum}&category=${this.state.Category}`)
                .then(response => response.json() as Promise<HttpResult<{ threads: ForumPostPublic[], total: number, pages: number }>>)
                .then(data => {
                    if (data.ok) {
                        this.setState({
                            Threads: data.data.threads,
                            Loading: false,
                            MaxResults: data.data.total,
                            PageTotal: data.data.pages,
                        });
                    }
                    else {
                        alert(data.message);
                        this.setState({
                            Loading: false,
                        });
                        alert(data.message);
                    }
                }).catch((e: Error) => {
                    this.setState({
                        Loading: false
                    });
                    alert(e.message);
                });
        }
    }
}