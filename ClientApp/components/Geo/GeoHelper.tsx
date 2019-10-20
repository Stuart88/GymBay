import { CountryGeo } from "../../data/serverModels";
import { default as AllCountries } from './Countries';

export function GetAllCountries(): Array<CountryGeo> {
    return AllCountries as Array<CountryGeo>;
}