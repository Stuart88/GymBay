import * as React from 'react';
import { CountryGeo, CityGeo, CityGeoBasic, GymFinderBasic } from '../../data/serverModels';

import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import { Icon, IconType } from './Widgets';
import { StartsWith } from '../../Helpers/Functions';

interface ModuleState {
    Gyms: Array<GymFinderBasic>
    //FilteredGyms: Array<GymFinderBasic>
    SelectedGym: GymFinderBasic
    LoadingGyms: boolean
    SearchTerm: string
    LastSearchTerm: string
}

interface ModuleProps {
    GymSelected: Function
}

export class GymSearchAutosuggest extends React.Component<ModuleProps, ModuleState> {
    constructor(props) {
        super(props);

        this.state = {
            Gyms: [],
            //FilteredGyms: [],
            SelectedGym: new GymFinderBasic,
            LoadingGyms: false,
            SearchTerm: "",
            LastSearchTerm: ""
        }

        this.QueryGyms = this.QueryGyms.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.SearchPoll = this.SearchPoll.bind(this);
    }

    componentDidMount() {
        let component = this;

        setInterval(function () { component.SearchPoll(); }, 900);

        //this.GetAllGyms();
    }

    private SearchPoll() {
        if (this.state.SearchTerm != this.state.LastSearchTerm && this.state.SearchTerm.length > 0) {
            this.QueryGyms(this.state.SearchTerm);
            this.setState({ LastSearchTerm: this.state.SearchTerm });
        }
    }

    private GetAllGyms() {
        fetch(`api/GymFinder/GetAllGyms`)
            .then(response => response.json() as Promise<Array<GymFinderBasic>>)
            .then(data => {
                this.setState({
                    Gyms: data,
                    LoadingGyms: false,
                });
            });
    }

    private QueryGyms(q: string) {
        if (q.length > 0) {
            this.setState({
                LoadingGyms: true
            });

            fetch(`api/GymFinder/QuickSearch?q=${q}`)
                .then(response => response.json() as Promise<Array<GymFinderBasic>>)
                .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].allData = `${data[i].name} ${data[i].cityName} ${data[i].countryName}`;
                    }

                    this.setState({
                        Gyms: data,
                        LoadingGyms: false,
                    });
                });
        }
    }

    private onSearch(searchTerm: string): void {
        //let f = this.state.Gyms.filter(x =>
        //    x.name.indexOf(searchTerm) > -1
        //    || x.cityName.indexOf(searchTerm) > -1
        //    || x.countryName.indexOf(searchTerm) > -1
        //).slice(0,50);

        this.setState({
            SearchTerm: searchTerm,
            //FilteredGyms: f
        })
    }

    public render() {
        let GroupHeading = ({ item }) => (
            <strong style={{ color: 'orange' }}>{item}</strong>
        );

        let ListItem = ({ item }) => (
            <table className="full-width">
                <tbody>
                    <tr>
                        <td width="70px">
                            <img style={{ height: '50px', width: '50px', margin: 'auto', display: 'block' }}
                                src={item.logo && item.logo.length > 0
                                    ? item.logo
                                    : '/dist/images/gymfinder/default-gym.svg'} />
                        </td>
                        <td>
                            <div style={{ color: 'var(--black)' }}>{item.name}</div>
                            <div style={{ color: '#666', fontSize: '13px' }}>{item.cityName}, {item.countryName}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );

        let messages = {
            open: "Open",
            emptyList: "",
            emptyFilter: this.state.LoadingGyms ? "Loading..." : "No results",
            filterPlaceholder: "enter gym name or location"
        }

        return <div>

            <DropdownList
                filter="contains"
                messages={messages}
                data={this.state.Gyms}
                valueField='id'
                textField='allData'
                defaultValue={this.state.SelectedGym.name}
                onChange={(gym) => { if (gym.id > 0) this.props.GymSelected(gym); }}
                //groupComponent={GroupHeading}
                //groupBy={city => city.countryName}
                onSearch={this.onSearch}
                busy={this.state.LoadingGyms}
                busySpinner={
                    <span className="spinner-border spinner-border-sm" role="status" />
                }
                selectIcon={<Icon Hidden={false} Class="" Type={IconType.Iconic} Name="caret-bottom" />}
                itemComponent={ListItem}
                placeholder={"Gym Search "}
                containerClassName="form-control searchInput"
            />
        </div>
    }
}