import * as React from "react";
import { GymSearch, CoachSearch } from "../../data/serverModels";
import { Icon, IconType } from "./Widgets";
import '../../css/searchfitlers.css';

interface GymFilterProps {
    queryObject: GymSearch
    searchPage: any
    onSearch: Function
    onClear: Function
}

export class GymSearchFilter extends React.Component<GymFilterProps, {}>{
    constructor(props) {
        super(props);
    }

    public render() {
        let q = this.props.queryObject;

        let page = this.props.searchPage;

        return <div className="filtersContainer">

            <div className={`filterOptionContainer ${q.powerlifting == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="powerLifting">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Powerlifting" />
                    <input className="checkbox-inline" type="checkbox" id="powerLifting" onChange={(e) => { q.powerlifting = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Power Lifting
                </label>
            </div>
            <div className={`filterOptionContainer ${q.crossfit == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="Crossfit">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Crossfit" />
                    <input className="checkbox-inline" type="checkbox" id="Crossfit" onChange={(e) => { q.crossfit = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />

                    Crossfit</label>
            </div>
            <div className={`filterOptionContainer ${q.olympicLifting == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="OlympicLifting">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Olympic-Lifting" />
                    <input className="checkbox-inline" type="checkbox" id="OlympicLifting" onChange={(e) => { q.olympicLifting = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Olympic Lifting</label>
            </div>
            <div className={`filterOptionContainer ${q.freeWeightsDumbbells == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="FreeWeightsDumbbells">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Dumbbells" />
                    <input className="checkbox-inline" type="checkbox" id="FreeWeightsDumbbells" onChange={(e) => { q.freeWeightsDumbbells = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Dumbbells</label>
            </div>
            <div className={`filterOptionContainer ${q.strongman == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="strongman">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Strongman" />
                    <input className="checkbox-inline" type="checkbox" id="strongman" onChange={(e) => { q.strongman = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Strongman</label>
            </div>
            <div className={`filterOptionContainer ${q.freeWeightsBarsPlates == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="FreeWeightsBarsPlates">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Bars-Plates" />
                    <input className="checkbox-inline" type="checkbox" id="FreeWeightsBarsPlates" onChange={(e) => { q.freeWeightsBarsPlates = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Bars/Plates</label>
            </div>
            <div className={`filterOptionContainer ${q.resistanceMachines == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="ResistanceMachines">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Resistance-Machines" />
                    <input className="checkbox-inline" type="checkbox" id="ResistanceMachines" onChange={(e) => { q.resistanceMachines = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Resistance Machines</label>
            </div>
            <div className={`filterOptionContainer ${q.cardioMachines == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="CardioMachines">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cardio" />
                    <input className="checkbox-inline" type="checkbox" id="CardioMachines" onChange={(e) => { q.cardioMachines = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Cardio Machines</label>
            </div>
            <div className={`filterOptionContainer ${q.cafe == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="Cafe">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Cafe" />
                    <input className="checkbox-inline" type="checkbox" id="Cafe" onChange={(e) => { q.cafe = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Cafe</label>
            </div>
            <div className={`filterOptionContainer ${q.vendingMachine == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="VendingMachine">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Food-Drink" />
                    <input className="checkbox-inline" type="checkbox" id="VendingMachine" onChange={(e) => { q.vendingMachine = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Food & Drink Available</label>
            </div>
            <div className={`filterOptionContainer ${q.twentyFourHour == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="TwentyFourHour">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="24-hour" />
                    <input className="checkbox-inline" type="checkbox" id="TwentyFourHour" onChange={(e) => { q.twentyFourHour = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    24 Hour</label>
            </div>
            <div className={`filterOptionContainer ${q.toilets == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="Toilets">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Toilets" />
                    <input className="checkbox-inline" type="checkbox" id="Toilets" onChange={(e) => { q.toilets = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Toilets</label>
            </div>
            <div className={`filterOptionContainer ${q.changingRooms == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="ChangingRooms">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Changing-Rooms" />
                    <input className="checkbox-inline" type="checkbox" id="ChangingRooms" onChange={(e) => { q.changingRooms = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Changing Rooms</label>
            </div>
            <div className={`filterOptionContainer ${q.classesAvailable == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="ClassesAvailable">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Classes" />
                    <input className="checkbox-inline" type="checkbox" id="ClassesAvailable" onChange={(e) => { q.classesAvailable = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Classes Available</label>
            </div>
            <div className={`filterOptionContainer ${q.membersOnly == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="MembersOnly">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Members-only" />
                    <input className="checkbox-inline" type="checkbox" id="MembersOnly" onChange={(e) => { q.membersOnly = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Members Only</label>
            </div>
            <div className={`filterOptionContainer ${q.noMembershipRequired == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="NoMembershipRequired">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Day-Pass-available" />
                    <input className="checkbox-inline" type="checkbox" id="NoMembershipRequired" onChange={(e) => { q.noMembershipRequired = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Day Passes Available</label>
            </div>
            <div className={`filterOptionContainer ${q.sauna == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="Sauna">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Sauna" />
                    <input className="checkbox-inline" type="checkbox" id="Sauna" onChange={(e) => { q.sauna = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Sauna</label>
            </div>
            <div className={`filterOptionContainer ${q.swimmingPool == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="SwimmingPool">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Pool" />
                    <input className="checkbox-inline" type="checkbox" id="SwimmingPool" onChange={(e) => { q.swimmingPool = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Swimming Pool</label>
            </div>
            <div className={`filterOptionContainer ${q.physio == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="Physio">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Physio" />
                    <input className="checkbox-inline" type="checkbox" id="Physio" onChange={(e) => { q.physio = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Physio</label>
            </div>
            <div className={`filterOptionContainer ${q.lockers == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="lockers">
                    <Icon Hidden={false} Class="smallGymIcon" Type={IconType.GymFinder} Name="Lockers" />
                    <input className="checkbox-inline" type="checkbox" id="lockers" onChange={(e) => { q.lockers = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Lockers</label>
            </div>

            <div className="text-center" style={{ marginTop: '15px' }}>
                <button className="btn btn-primary btn-sm" style={{ marginRight: '2px', width: '65px' }} onClick={() => this.props.onClear()}>Clear</button>
                <button className="btn btn-primary btn-sm" style={{ width: '65px' }} onClick={() => this.props.onSearch()}>OK</button>
            </div>

        </div>
    }
    private renderMobile() {
        return <div></div>
    }
}

interface CoachFilterProps {
    queryObject: CoachSearch
    searchPage: any
    onSearch: Function
    onClear: Function
}

export class CoacSearchFilter extends React.Component<CoachFilterProps, {}>{
    constructor(props) {
        super(props);
    }

    public render() {
        let q = this.props.queryObject;

        let page = this.props.searchPage;

        return <div className="filtersContainer">

            <div className={`filterOptionContainer ${q.coachBodybuilding == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachBodybuilding">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="BodybuildingCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachBodybuilding" onChange={(e) => { q.coachBodybuilding = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Bodybuilding</label>
            </div>
            <div className={`filterOptionContainer ${q.coachPowerlifting == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachPowerlifting">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PowerliftingCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachPowerlifting" onChange={(e) => { q.coachPowerlifting = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Powerlifting</label>
            </div>
            <div className={`filterOptionContainer ${q.coachCrossfit == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachCrossfit">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="CrossfitCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachCrossfit" onChange={(e) => { q.coachCrossfit = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Crossfit</label>
            </div>
            <div className={`filterOptionContainer ${q.coachWeightLoss == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachWeightLoss">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="WeightlossCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachWeightLoss" onChange={(e) => { q.coachWeightLoss = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Weight Loss</label>
            </div>
            <div className={`filterOptionContainer ${q.coachStrongman == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachStrongman">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="StrongmanCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachStrongman" onChange={(e) => { q.coachStrongman = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Strongman</label>
            </div>
            <div className={`filterOptionContainer ${q.coachClasses == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachClasses">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ClassesCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachClasses" onChange={(e) => { q.coachClasses = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Classes Available</label>
            </div>
            <div className={`filterOptionContainer ${q.coachDance == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachDance">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="DanceCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachDance" onChange={(e) => { q.coachDance = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Dance</label>
            </div>
            <div className={`filterOptionContainer ${q.coachMasseuse == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachMasseuse">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="MasseueseCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachMasseuse" onChange={(e) => { q.coachMasseuse = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Massage</label>
            </div>
            <div className={`filterOptionContainer ${q.coachNutrition == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachNutrition">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="NutritionCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachNutrition" onChange={(e) => { q.coachNutrition = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Nutrition</label>
            </div>
            <div className={`filterOptionContainer ${q.coachOlympicLifting == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachOlympicLifting">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OlympicLiftingCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachOlympicLifting" onChange={(e) => { q.coachOlympicLifting = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Olympic Lifting</label>
            </div>
            <div className={`filterOptionContainer ${q.coachOneOnOne == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachOneOnOne">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OneOnOneCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachOneOnOne" onChange={(e) => { q.coachOneOnOne = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    One on One</label>
            </div>
            <div className={`filterOptionContainer ${q.coachOnlineAvailable == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachOnlineAvailable">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineCoachingAvaialbleCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachOnlineAvailable" onChange={(e) => { q.coachOnlineAvailable = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Online Available</label>
            </div>
            <div className={`filterOptionContainer ${q.coachOnlineOnly == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachOnlineOnly">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="OnlineOnlyCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachOnlineOnly" onChange={(e) => { q.coachOnlineOnly = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Online Only</label>
            </div>
            <div className={`filterOptionContainer ${q.coachPhysio == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachPhysio">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="PhysioCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachPhysio" onChange={(e) => { q.coachPhysio = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Physio</label>
            </div>
            <div className={`filterOptionContainer ${q.coachProgramOnly == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachProgramOnly">
                    <Icon Hidden={false} Class="smallCoachIcon" Type={IconType.CoachFinder} Name="ProgramOnlyCoach" />
                    <input className="checkbox-inline" type="checkbox" id="coachProgramOnly" onChange={(e) => { q.coachProgramOnly = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Programs Only</label>
            </div>
            <div className={`filterOptionContainer ${q.coachOther == 1 ? 'filterOptionContainerChecked' : ''}`}>
                <label htmlFor="coachOther">

                    <input className="checkbox-inline" type="checkbox" id="coachOther" onChange={(e) => { q.coachOther = e.target.checked ? 1 : 0; page.setState({ Gym: q }) }} />
                    Other</label>
            </div>

            <div className="text-center" style={{ marginTop: '15px' }}>
                <button className="btn btn-primary btn-sm" style={{ marginRight: '2px', width: '65px' }} onClick={() => this.props.onClear()}>Clear</button>
                <button className="btn btn-primary btn-sm" style={{ width: '65px' }} onClick={() => this.props.onSearch()}>OK</button>
            </div>

        </div>
    }
    private renderMobile() {
        return <div></div>
    }
}