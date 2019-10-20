import * as React from 'react';
import { CountryGeo } from '../../data/serverModels';
import { default as AllCountries } from './Countries';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

interface ModuleState {
    SelectedCountry: CountryGeo
}
interface ModuleProps {
    CountrySelected: Function
}


export class CountriesAutosuggest extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        this.state = {
            SelectedCountry: new CountryGeo
        }
    }


    public render() {

     
        return <DropdownList
            filter
            data={(AllCountries as Array<CountryGeo>)}
            valueField='id'
            textField='countryName'
            defaultValue={this.state.SelectedCountry.countryName}
            onChange={(c) => this.props.CountrySelected(c)}
        />
        
    }
}
