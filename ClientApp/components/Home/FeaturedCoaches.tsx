import * as React from 'react';
import { HttpResult, FeaturedCoach } from '../../data/serverModels';
import ReactTooltip from 'react-tooltip'
import { InlineLoader } from '../Widgets/Loaders';
import '../../css/featured.css';
import { RouteComponentProps } from 'react-router';
import { Pages } from '../../Helpers/Globals';

interface ModuleState {
    Coaches: FeaturedCoach[]
    Loading: boolean
}

interface ModuleProps {
    Props: RouteComponentProps<any>
}

export class FeaturedCoaches extends React.Component<ModuleProps, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            Coaches: [],
            Loading: true
        }

        fetch('api/CoachFinder/GetFeaturedCoaches')
            .then(response => response.json() as Promise<HttpResult<FeaturedCoach[]>>)
            .then(data => {
                if (data.ok) {
                    this.setState({
                        Coaches: data.data,
                        Loading: false,
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
                    Loading: false,
                });
                alert(e.message);
            });
    }

    public render() {
        return this.state.Loading
            ? <div className="text-center"><InlineLoader Loading Text="Loading..." /></div>
            : <div className="featuredItemHomeContainer">
                <ReactTooltip />
                {this.state.Coaches.map(c => <div className="featuredItemHomeSingleContainer" data-tip={`<div>${c.coachName}<br/>${c.location}</div>`} data-place="left" data-html={true}
                    style={{ backgroundImage: `url(${c.imageUrl})` }}
                    onClick={() => this.props.Props.history.push(`${Pages.viewCoach}/${c.coachId}/${c.coachName}`)}
                >

                </div>)}
            </div>
    }
}