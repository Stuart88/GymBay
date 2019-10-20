import * as React from 'react';
import { FeaturedGym, HttpResult } from '../../data/serverModels';
import ReactTooltip from 'react-tooltip'
import { InlineLoader } from '../Widgets/Loaders';
import '../../css/featured.css';
import { RouteComponentProps } from 'react-router';
import { Pages } from '../../Helpers/Globals';

interface ModuleState {
    Gyms: FeaturedGym[]
    Loading: boolean
}

interface ModuleProps {
    Props: RouteComponentProps<any>
}

export class FeaturedGyms extends React.Component<ModuleProps, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            Gyms: [],
            Loading: true
        }

        fetch('api/GymFinder/GetFeaturedGyms')
            .then(response => response.json() as Promise<HttpResult<FeaturedGym[]>>)
            .then(data => {
                if (data.ok) {
                    this.setState({
                        Gyms: data.data,
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
                {this.state.Gyms.map(g => <div className="featuredItemHomeSingleContainer" data-tip={`<div>${g.gymName}<br/>${g.location}</div>`} data-place="left" data-html={true}
                    style={{ backgroundImage: `url(${g.imageUrl})` }}
                    onClick={() => this.props.Props.history.push(`${Pages.viewgym}/${g.gymId}/${g.gymName}`)}
                >

                </div>)}
            </div>
    }
}