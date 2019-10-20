import * as React from 'react';
import { UserLoggedIn } from '../../Helpers/Functions';
import { UserState} from '../../Helpers/Globals';
import { UpvoteItems, HttpResult } from '../../data/serverModels';
import ReactTooltip from 'react-tooltip'



interface ModuleProps {
    UpvoteItem: UpvoteItems
    ItemID: number
    onVoteComplete: Function
    Upvotes: string
    BelongsToUser: boolean
}


export class UpvoteComponent extends React.Component<ModuleProps, {}> {

    constructor(props) {
        super(props);

        this.SubmitVote = this.SubmitVote.bind(this);
    }


    public render() {

        //to deal with risk of 'value undefined' error
        let voteString = this.props.Upvotes ? this.props.Upvotes : "";

        let uservoted = UserLoggedIn() && voteString.split(',').filter(v => Number(v) == UserState.Profile.id).length > 0;

        let voteCount = voteString.split(',').filter(v => v.length > 0).length;

        let imgSrc = uservoted
            ? '/dist/general/upvote-solid.svg'
            : '/dist/general/upvote.svg';

        let voteBtnStyle: React.CSSProperties = {
            padding: '2px 10px',
            lineHeight: 1,
            borderBottomLeftRadius: '.2rem',
            borderBottomRightRadius: '.2rem',
            borderTopLeftRadius: '.2rem',
            borderTopRightRadius: '.2rem',
            opacity: uservoted ? 1 : 0.6,
            backgroundColor: uservoted ? '#1a9e00' : '#007bff'
        }

        let dataTip: string | null = null;

        if (!UserLoggedIn())
            dataTip = 'Please login to vote';
        if (this.props.BelongsToUser)
            dataTip = "You can't upvote your own content!"

        return <div style={{ display: 'inline-block', maxWidth: '100px', float: 'right', textAlign: 'center' }}>

            <ReactTooltip />

            <a data-tip={dataTip}
                className="btn btn-primary btn-sm"
                onClick={this.SubmitVote}
                style={voteBtnStyle}
            >

                <img className="hover-pointer upvoteIcon" src={imgSrc} />

            </a>

            <div style={{ color: 'var(--black)', fontSize: '13px' }}>
                {voteCount} upvotes
            </div>

        </div>;

    }

        
    private SubmitVote() {


        if (UserLoggedIn() && !this.props.BelongsToUser) {
            fetch(`api/User/Upvote?itemType=${this.props.UpvoteItem}&itemID=${this.props.ItemID}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: null
                })
                .then(response => response.json() as Promise<HttpResult<string>>)
                .then(res => {

                    if (res.ok) {
                        this.props.onVoteComplete(res.data)
                    }
                    else {
                        alert(res.message);
                    }
                })
                .catch((e: Error) => alert(e.message));

        }
    }
}