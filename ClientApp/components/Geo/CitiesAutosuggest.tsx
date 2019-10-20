import * as React from 'react';
import { CountryGeo, CityGeo, CityGeoBasic } from '../../data/serverModels';

import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import { IconType, Icon } from '../Widgets/Widgets';

interface ModuleState {
    Cities: Array<CityGeoBasic>
    SelectedCity: CityGeo
    SearchCountry: CountryGeo
    LoadingCities: boolean
    SearchTerm: string
    LastSearchTerm: string

}

interface ModuleProps {
    CitySelected: Function
}


export class CitiesAutosuggest extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            Cities: [],
            SelectedCity: new CityGeo,
            SearchCountry: new CountryGeo,
            LoadingCities: false,
            SearchTerm: "",
            LastSearchTerm: ""
        }

        this.QueryCities = this.QueryCities.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.SearchPoll = this.SearchPoll.bind(this);

        
    }

    componentDidMount() {
        let component = this;

        setInterval(function () { component.SearchPoll(); }, 900);
    }

    

    private SearchPoll() {
        if (this.state.SearchTerm != this.state.LastSearchTerm && this.state.SearchTerm.length > 0) {
            this.QueryCities(this.state.SearchTerm);
            this.setState({ LastSearchTerm: this.state.SearchTerm });
        }
    }

    private QueryCities(q: string) {

        if (q.length > 0) {
            this.setState({
                LoadingCities: true
            });

            fetch(`api/Geo/QueryCities?q=${q}`)
                .then(response => response.json() as Promise<Array<CityGeoBasic>>)
                .then(data => {

                    this.setState({
                        Cities: data,
                        LoadingCities: false,
                    });


                });
        }


    }


    private onSearch(searchTerm: string, metadata: { action, lastSearchTerm, originalEvent?}) {
        //if (searchTerm != metadata.lastSearchTerm && searchTerm.length > 0) {
        //    this.QueryCities(searchTerm);
        //}
        this.setState({ SearchTerm: searchTerm })
    }
   
    public render() {

        let GroupHeading = ({ item }) => (
            <strong style={{color: 'orange'}}>{item}</strong>
        );

        let ListItem = ({ item }) => (
            <span>
                <strong>{item.cityName}</strong>
                <span style={{ fontSize: '12px' }}>{" near " + item.nearestCity}</span>
            </span>
        );

        let messages = {
            open: "Open",
            emptyList: "",
            emptyFilter: this.state.LoadingCities ? "Loading..." : "No results",
            filterPlaceholder: "Type to search cities"
    }
       
        return <div>

            <DropdownList
                filter="contains"
                messages={messages}
                data={this.state.Cities}
                valueField='cityGeoId'
                textField='cityName'
                defaultValue={this.state.SelectedCity.cityName}
                onChange={(city) => { if (city.id > 0) this.props.CitySelected(city); }}
                groupComponent={GroupHeading}
                groupBy={city => city.countryName}
                onSearch={this.onSearch}
                busy={this.state.LoadingCities}
                busySpinner={
                    <span className="spinner-border spinner-border-sm" role="status" />
                }
                selectIcon={<Icon Hidden={false} Class="" Type={IconType.Iconic} Name="caret-bottom" />}
                itemComponent={ListItem}
                placeholder={"City Search "}
                containerClassName="form-control searchInput"
            />
        </div>

    }

}

