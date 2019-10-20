import * as React from 'react';
import { CoachBasic } from '../../data/serverModels';

import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import { Icon, IconType } from './Widgets';

interface ModuleState {
    Coaches: Array<CoachBasic>
    SelectedCoach: CoachBasic
    LoadingCoaches: boolean
    SearchTerm: string
    LastSearchTerm: string

}

interface ModuleProps {
    CoachSelected: Function
}


export class CoachSearchAutosuggest extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            Coaches: [],
            SelectedCoach: new CoachBasic,
            LoadingCoaches: false,
            SearchTerm: "",
            LastSearchTerm: ""
        }

        this.QueryCoaches = this.QueryCoaches.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.SearchPoll = this.SearchPoll.bind(this);

        
    }

    componentDidMount() {
        let component = this;

        setInterval(function () { component.SearchPoll(); }, 900);

       
    }

    

    private SearchPoll() {
        if (this.state.SearchTerm != this.state.LastSearchTerm && this.state.SearchTerm.length > 0) {
            this.QueryCoaches(this.state.SearchTerm);
            this.setState({ LastSearchTerm: this.state.SearchTerm });
        }
    }

  

    private QueryCoaches(q: string) {

        if (q.length > 0) {
            this.setState({
                LoadingCoaches: true
            });



            fetch(`api/CoachFinder/QuickSearch?q=${q}`)
                .then(response => response.json() as Promise<Array<CoachBasic>>)
                .then(data => {

                    for (let i = 0; i < data.length; i++) {
                        data[i].allData = `${data[i].name} ${data[i].cityName} ${data[i].countryName}`;
                    }

                    this.setState({
                        Coaches: data,
                        LoadingCoaches: false,
                    });

                });
        }

    }


    private onSearch(searchTerm: string):void {


        this.setState({
            SearchTerm: searchTerm,
        })
    }
   
    public render() {

        let GroupHeading = ({ item }) => (
            <strong style={{color: 'orange'}}>{item.cityName}</strong>
        );

        let ListItem = ({ item }) => (
            <table className="full-width">
                <tbody>
                    <tr>
                        <td width="70px">
                            <img style={{ height: '50px', width: '50px', margin: 'auto', display: 'block' }}
                                src={item.pic && item.pic.length > 0
                                    ? item.pic
                                    : '/dist/images/coachfinder/default-coach.jpg'} />
                        </td>
                        <td>
                            <div style={{ color: 'var(--black)' }}>{item.name}</div>
                            <div style={{ color: '#666', fontSize:'13px' }}>{item.cityName}, {item.countryName}</div>
                        </td>
                        <td width="40px">
                            {
                                item.isVerified == 1
                                    ? <div style={{ textAlign: 'center' }}>
                                        <Icon Class="profileSocialIconTiny" Type={IconType.CoachFinder} Name="verified" Hidden={false} />
                                        <div style={{ fontSize: '12px', color: 'var(--blue)' }}>Verified</div>

                                    </div>
                                    : null
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        );

        let messages = {
            open: "Open",
            emptyList: "",
            emptyFilter: this.state.LoadingCoaches ? "Loading..." : "No results",
            filterPlaceholder: "enter coach name or location"
    }
       
        return <div>

            <DropdownList
                filter="contains"
                messages={messages}
                data={this.state.Coaches}
                valueField='id'
                textField='allData'
                defaultValue={this.state.SelectedCoach.name}
                onChange={(c) => { if (c.id > 0) this.props.CoachSelected(c); }}
                //groupComponent={GroupHeading}
                //groupBy={c => c.cityName}
                onSearch={this.onSearch}
                busy={this.state.LoadingCoaches}
                busySpinner={
                    <span className="spinner-border spinner-border-sm" role="status" />
                }
                selectIcon={<Icon Hidden={false} Class="" Type={IconType.Iconic} Name="caret-bottom" />}
                itemComponent={ListItem}
                placeholder={"Coach Search "}
                containerClassName="form-control searchInput"
            />
        </div>

    }

}

