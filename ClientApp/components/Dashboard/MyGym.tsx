import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { GymFinderGym, HttpResult, CityGeo, CityGeoBasic } from '../../data/serverModels';
import { ClickElement, GymImagesArray, OnMobile, CreatePostObject, AdminLoggedIn, UserLoggedIn, GetUserID } from '../../Helpers/Functions';
import { CitiesAutosuggest } from '../Geo/CitiesAutosuggest';
import '../../css/gymfinderAddGym.css';
import { CenterTitleWithLine, Icon, IconType } from '../Widgets/Widgets';
import { GymFinderGymView } from '../GymFinder/GymFinderGymView';
import { Loader } from '../Widgets/Loaders';
import { Pages, SiteDetails, CSSValues, Colours } from '../../Helpers/Globals';
import { DashboardNav } from './DashboardNav';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Crop } from './Profile';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';

interface ModuleState {
    Gym: GymFinderGym
    SelectedCity: CityGeoBasic
    Loading: boolean
    Images: ImageDetails[]
    ValidationString: string
    Saving: boolean
    Finished: boolean
    KeyCount: number //increment each time new key is added, for resetting CitiesAutoselect amd <form> area
    Crop: Crop;//continuously updates while dragging crop area
    FinalCrop: Crop;//final value of crop
    OnPreview: boolean;
}

interface ModuleProps {
    Gym: GymFinderGym
    Props: RouteComponentProps<any>
}

export class ImageDetails {
    ImageSRC: string = "";
    ImageFile: File = new File([], "New");
    Label: ImageLabel = ImageLabel.None
}

enum ImageLabel {
    Logo,
    Image1,
    Image2,
    Image3,   
    None,
}

const newImagesArray = [
    { ImageFile: new File([], "0"), ImageSRC: "", Label: ImageLabel.Logo, },
    { ImageFile: new File([], "1"), ImageSRC: "", Label: ImageLabel.Image1, },
    { ImageFile: new File([], "2"), ImageSRC: "", Label: ImageLabel.Image2, },
    { ImageFile: new File([], "3"), ImageSRC: "", Label: ImageLabel.Image3, }
]

export class MyGym extends React.Component<ModuleProps, ModuleState> {

    constructor(props) {
        super(props);

        //try getting from state sent via Link
        let gym = this.props.Props.location.state as GymFinderGym;
        let selectedCity = new CityGeoBasic();

        //if no luck, get from props instead
        if (gym == undefined)
            gym = this.props.Gym;
        else {    
            selectedCity.cityName = gym.locationCityName;
            selectedCity.countryName = gym.locationCountryName;
        }

        this.state = {
            Gym: gym,
            Images: this.createImageDetails(gym),
            SelectedCity: selectedCity,
            Loading: false,
            ValidationString: "",
            Saving: false,
            Finished: false,
            KeyCount: 0,
            Crop: new Crop,
            FinalCrop: new Crop,
            OnPreview: false
        };

       // this.Add = this.Add.bind(this);
        this.Save = this.Save.bind(this);
        this.CitySelected = this.CitySelected.bind(this);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.SaveImages = this.SaveImages.bind(this);
        this.DeselectImage = this.DeselectImage.bind(this);
        this.GetMyGym = this.GetMyGym.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
        this.onSelectedImage = this.onSelectedImage.bind(this);
    }

    componentDidMount() {

        if (!AdminLoggedIn() && !UserLoggedIn()) {
            this.props.Props.history.push(Pages.dashboard)
        }
        else if (AdminLoggedIn()) {

        }
        else if (this.state.Gym.id == 0)//not on edit gym, so check elsewhere
        {
            this.GetMyGym();
        }

    }

    private createImageDetails(gym: GymFinderGym): ImageDetails[] {
        let gymImages = newImagesArray;
        if (gym != null) {
            //create array of images whose file name match the imageLocation of each on GymFinderGym being edited
            //For comparing with stored files when uploaded. If names matching, files are ignored. Else files are saved/deleted/overwritten
            gymImages[0].ImageFile = gym.imageLocationLogo && gym.imageLocationLogo.length > 0 ? new File([], gym.imageLocationLogo) : new File([], "0");
            gymImages[1].ImageFile = gym.imageLocation1 && gym.imageLocation1.length > 0 ? new File([], gym.imageLocation1) : new File([], "1");
            gymImages[2].ImageFile = gym.imageLocation2 && gym.imageLocation2.length > 0 ? new File([], gym.imageLocation2) : new File([], "2");
            gymImages[3].ImageFile = gym.imageLocation3 && gym.imageLocation3.length > 0 ? new File([], gym.imageLocation3) : new File([], "3");
        }
        return gymImages
    }

    private GetMyGym() {

        fetch('/api/GymFinder/GetMyGym')
            .then(response => response.json() as Promise<HttpResult<GymFinderGym>>)
            .then(data => {

                if (data.ok) {
                    this.setState({
                        Gym: data.data,
                        Images: this.createImageDetails(data.data),
                        KeyCount: this.state.KeyCount + 1
                    });
                }
                else {
                    console.log("GetMyGym: " + data.message);
                }
               

            });
    }
    

    private onFileSelect(event, label: ImageLabel) {

        let component = this;

        let images = component.state.Images;
        let thisImage = images.filter(x => x.Label == label)[0];
        let index = images.indexOf(thisImage);

        //reset in case it fails (otherwise it'll show error message but still have previous image stored)
        thisImage.ImageFile = new File([], "New");
        thisImage.ImageSRC = ""
        images[index] = thisImage;
        component.setState({
            Images: images
        });

        let files = event.target.files as Array<File>;

        if (FileReader && files && files.length) {

            if (files[0].type.indexOf("image") == -1) {
                component.setState({
                    ValidationString: "Invalid file type!"
                });
                return 0;
            }
            else if (files[0].size > 9000000) {
                component.setState({
                    ValidationString: "Max image size 9MB"
                });
                return 0;
            }
            else {
                var fr = new FileReader();
                fr.onload = function () {
                    if (fr.result != null) {
                        thisImage.ImageFile = files[0];
                        thisImage.ImageSRC = fr.result.toString();
                        images[index] = thisImage;
                        component.setState({
                            Images: images
                        });
                    }
                }
                fr.readAsDataURL(files[0]);
            }

        }
    }

    
    private SaveImages(images: ImageDetails[], stage: ImgUploadStage, gymID: number) {

        this.setState({
            Saving: true,
            ValidationString: "Uploading Images..."
        });

        let crop = this.state.FinalCrop;
        let cropDataString = `x=${crop.x}&y=${crop.y}&width=${crop.width}&height=${crop.height}`;

        const formData = new FormData();

        let g = this.state.Gym;

        for (let i = 0; i < images.length; i++) {

            let fileName = "";

            if (stage == ImgUploadStage.Images) {
                switch (i) {
                    case 0:
                        if (g.imageLocation1 == images[i].ImageFile.name && images[i].ImageFile.name.length > 0)
                            fileName = g.imageLocation1;
                        else
                            fileName = "1"
                        break;
                    case 1:
                        if (g.imageLocation2 == images[i].ImageFile.name && images[i].ImageFile.name.length > 0)
                            fileName = g.imageLocation2;
                        else
                            fileName = "2"
                        break;
                    case 2:
                        if (g.imageLocation3 == images[i].ImageFile.name && images[i].ImageFile.name.length > 0)
                            fileName = g.imageLocation3;
                        else
                            fileName = "3"
                        break;
                }
            }
            else {
                if (g.imageLocationLogo == images[0].ImageFile.name)
                    fileName = g.imageLocationLogo;
                else
                    fileName = "Logo"
            }

            formData.append(fileName, images[i].ImageFile);
        }

        

        let uri = stage == ImgUploadStage.Logo
            ? `api/GymFinder/AddUpdateGymLogo?gymID=${gymID.toString()}&${cropDataString}`
            : `api/GymFinder/AddUpdateGymImages?gymID=${gymID.toString()}`;
        fetch(uri,
            {
                method: 'POST',
                //headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            })
            .then(response => response.json() as Promise<HttpResult<GymFinderGym>>)
            .then(data => {
                try {
                   
                    if (data.ok) {

                        switch (stage) {

                            case ImgUploadStage.Logo:

                                this.DeselectImage(ImageLabel.Logo);
                                this.SaveImages(this.state.Images.filter(x => x.Label != ImageLabel.Logo), ImgUploadStage.Images, gymID);
                                break;

                            case ImgUploadStage.Images:

                                this.DeselectImage(ImageLabel.Image3);
                                this.DeselectImage(ImageLabel.Image2);
                                this.DeselectImage(ImageLabel.Image1);

                                this.setState({
                                    Images: this.createImageDetails(data.data),
                                    Gym: data.data,
                                    SelectedCity: new CityGeoBasic,
                                    Loading: false,
                                    ValidationString: "Saved Successfully!",
                                    Saving: false,
                                    Finished: true,
                                    Crop: new Crop,
                                    FinalCrop: new Crop,
                                });

                                break;

                        }
                    
                    }
                    else {
                        alert(data.message);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });

    }

    private onSelectedImage(crop) {

        this.setState({
            Crop: crop
        })
    }

    private onCropComplete(crop, pixelCrop) {

        this.setState({
            FinalCrop: pixelCrop
        })

    }

    private Validate(gym: GymFinderGym): { valid: boolean, message: string } {

        let valid = true;
        let message = "";

        if (gym.name.length == 0) {
            message += "Gym Name\n";
        }
        if (gym.streetAddress.length  == 0) {
            message += "Address\n";
        }
        if (gym.description.length > 450) {
            message += "Description too long\n";
        }

        valid = message.length == 0;

        return { valid, message};
    }

    private Save() {


        if (this.state.Gym.id == 0)
            this.state.Gym.ownerID = GetUserID();
        //New gym, so give it an owner ID (returns 0 if logged in as Admin)

        let validation = this.Validate(this.state.Gym);

        if (validation.valid) {

            this.setState({
                ValidationString: "Saving...",
                Saving: true
            })

            fetch('api/GymFinder/AddUpdateGymFinderGym', CreatePostObject(this.state.Gym))
                .then(response => response.json() as Promise<HttpResult<GymFinderGym>>)
                .then(data => {

                    if (data.ok) {

                        //set new gym for viewing afterwards
                        this.setState({
                            Gym: data.data
                        });


                        //logo (then other images upload after logo upload)
                        this.SaveImages(this.state.Images.filter(x => x.Label == ImageLabel.Logo), ImgUploadStage.Logo, data.data.id);


                        
                    }
                    else {
                        this.setState({
                            ValidationString: data.message,
                            Saving: false,
                        })
                    }
                }).catch((e: Error) => this.setState({
                    ValidationString: e.message,
                    Saving: false
                }));
        }
        else {
            this.setState({
                ValidationString: "Required: \n" + validation.message,
                Saving: false
            })
        }
       
    }



    private CitySelected(city: CityGeoBasic) {
        this.state.Gym.locationCityId = city.cityGeoId;
        this.setState({
            SelectedCity: city,
            Gym: this.state.Gym
        })
      
    }

    private GetSRC(label: ImageLabel): string {

        try {
            let g = this.state.Gym;
            let img = this.state.Images.filter(x => x.Label == label)[0];
            if (img.ImageFile.size > 10)
                return img.ImageSRC ? img.ImageSRC : "";
            else {
                switch (label) {
                    case ImageLabel.Logo:
                        return g.imageLocationLogo ? g.imageLocationLogo : "";
                    case ImageLabel.Image1:
                        return g.imageLocation1 ? g.imageLocation1 : "";
                    case ImageLabel.Image2:
                        return g.imageLocation2 ? g.imageLocation2 : "";
                    case ImageLabel.Image3:
                        return g.imageLocation3 ? g.imageLocation3 : "";
                    default:
                        return "";

                }
            }
        }
        catch (e) {
            console.log(e);
            return "";
        }
       
    }

    public render() {

        let hideFormAreas = this.state.SelectedCity.id == 0 && this.state.Gym.id == 0;

        let g = this.state.Gym;

        let editButtons = <div className="text-center">
            <br />
            <button type="button" className="btn btn-primary" onClick={this.Save}>Save</button>
            <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }} onClick={() => this.setState({ OnPreview: !this.state.OnPreview })}>

                {
                    this.state.OnPreview
                        ? 'Edit'
                        : 'Preview'
                }

            </button>
            <br />
            <span className="hasLineBreaks" style={{ color: 'red' }}>{this.state.ValidationString}</span>
        </div>

        return <div>

            <HeaderSearchBarArea Props={this.props.Props} />

            <DashboardNav />

            <div id="addGymWholePage" style={{ padding: '10px', maxWidth: '900px', margin: 'auto', paddingBottom: '80px', marginTop: CSSValues.DashNavHeight }}>

                <h3 className="text-center" style={{ color: 'var(--black)' }}>Add Gym</h3>

                <div className="text-center" style={{ color: '#666' }}>
                    This is for gym owners only. If you want to add a gym that doesn't belong to you, you can do so. However, your entry may be edited,
                    removed or transferred to the rightful owner without notice.
                    </div>


                <div hidden={!this.state.Finished || this.state.Saving}>

                    <br />
                    <div className="text-center">
                        <br />
                        <h4 className="text-center">Saved! Your updates are pending review</h4>
                        <br />

                    </div>
                </div>

                <form key={this.state.KeyCount} hidden={this.state.Saving || this.state.OnPreview}>

                    <div className="text-center" hidden={this.state.SelectedCity.id == 0 && this.state.Gym.id == 0}>
                        {editButtons}
                    </div>
                   

                    <CenterTitleWithLine Title="Location" LineColour="cornflowerblue" />

                    <div className="row">
                        <div className="col-md-6">
                            <CitiesAutosuggest key={this.state.KeyCount} CitySelected={this.CitySelected} />
                        </div>
                        <div className="col-md-6" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '10px'
                            }}
                        >
                            <span style={{ color: '#666', fontSize: '12px' }}>If your location isn't listed, please pick somewhere nearby. In the gym description, make a
                                clear note that your town/city isn't listed and we'll do our best to get it added.</span>
                        </div>
                    </div>

                    <div className="row" hidden={hideFormAreas}>
                        <div className="col-12">
                            <div style={{ fontWeight: 'bold', color: '#666' }}>Selected Location: {
                                this.state.SelectedCity.id > 0
                                    ? `${this.state.SelectedCity.cityName}, ${this.state.SelectedCity.countryName}`
                                    : `${this.state.Gym.locationCityName}, ${this.state.Gym.locationCountryName}`

                            }</div>
                        </div>
                    </div>

                    


                    <div hidden={hideFormAreas}>


                        <CenterTitleWithLine Title="Details" LineColour="cornflowerblue" />

                        <div className="row">
                            <div className="col-md-12">
                                
                                <input className="form-control searchInput" placeholder="Gym Name" value={this.state.Gym.name} onChange={(e) => { this.state.Gym.name = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <input className="form-control searchInput" value={this.state.Gym.streetAddress} placeholder="Full Address (including postcode)" onChange={(e) => { this.state.Gym.streetAddress = e.target.value; this.setState({ Gym: this.state.Gym }) }} />

                            </div>
                            <div className="col-md-6">
                                <input className="form-control searchInput" value={this.state.Gym.phone} placeholder="Phone" onChange={(e) => { this.state.Gym.phone = e.target.value; this.setState({ Gym: this.state.Gym }) }} />

                            </div>
                        </div>


                        <CenterTitleWithLine LineColour={Colours.Blue} Title="Social" />

                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="010-website" />
                                    <input placeholder="Website URL"
                                        className="form-control searchInput"
                                        value={g.website}
                                        onChange={(e) => { this.state.Gym.website = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="009-skype" />
                                    <input placeholder="Skype ID"
                                        className="form-control searchInput"
                                        value={g.skype}
                                        onChange={(e) => { this.state.Gym.skype = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="002-instagram" />
                                    <input placeholder="Instagram URL"
                                        className="form-control searchInput"
                                        value={g.instagram}
                                        onChange={(e) => { this.state.Gym.instagram = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="001-facebook" />
                                    <input placeholder="Facebook URL"
                                        className="form-control searchInput"
                                        value={g.facebook}
                                        onChange={(e) => { this.state.Gym.facebook = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="004-twitter" />
                                    <input placeholder="Twitter URL"
                                        className="form-control searchInput"
                                        value={g.twitter}
                                        onChange={(e) => { this.state.Gym.twitter = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="003-youtube" />
                                    <input placeholder="YouTube URL"
                                        className="form-control searchInput"
                                        value={g.youtube}
                                        onChange={(e) => { this.state.Gym.youtube = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="005-whatsapp" />
                                    <input placeholder="WhatsApp Number"
                                        className="form-control searchInput"
                                        value={g.whatsapp}
                                        onChange={(e) => { this.state.Gym.whatsapp = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="006-linkedin" />
                                    <input placeholder="LinkedIn URL"
                                        className="form-control searchInput"
                                        value={g.linkedin}
                                        onChange={(e) => { this.state.Gym.linkedin = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="007-google-plus" />
                                    <input placeholder="Google+ URL"
                                        className="form-control searchInput"
                                        value={g.googlePlus}
                                        onChange={(e) => { this.state.Gym.googlePlus = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputLabel socialInputContainer">
                                    <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="008-snapchat" />
                                    <input placeholder="Snapchat ID"
                                        className="form-control searchInput"
                                        value={g.snapchat}
                                        onChange={(e) => { this.state.Gym.snapchat = e.target.value; this.setState({ Gym: this.state.Gym }) }} />
                                </div>
                            </div>
                        </div>
                       



                        <div className="">
                            <CenterTitleWithLine Title="Facilities" LineColour="cornflowerblue" />

                            <div className="row" style={{ maxWidth: '700px', margin: 'auto' }}>

                                <div className={`addGymCheckBoxArea ${this.state.Gym.powerlifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="powerLifting" onChange={(e) => { this.state.Gym.powerlifting = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="powerLifting">Power Lifting</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.crossfit == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="Crossfit" onChange={(e) => { this.state.Gym.crossfit = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="Crossfit">Crossfit</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.olympicLifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="OlympicLifting" onChange={(e) => { this.state.Gym.olympicLifting = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="OlympicLifting">Olympic Lifting</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.freeWeightsDumbbells == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="FreeWeightsDumbbells" onChange={(e) => { this.state.Gym.freeWeightsDumbbells = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="FreeWeightsDumbbells">Dumbbells</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.strongman == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="strongman" onChange={(e) => { this.state.Gym.strongman = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="strongman">Strongman</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.freeWeightsBarsPlates == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="FreeWeightsBarsPlates" onChange={(e) => { this.state.Gym.freeWeightsBarsPlates = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="FreeWeightsBarsPlates">Bars/Plates</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.resistanceMachines == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="ResistanceMachines" onChange={(e) => { this.state.Gym.resistanceMachines = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="ResistanceMachines">Resistance Machines</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.cardioMachines == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="CardioMachines" onChange={(e) => { this.state.Gym.cardioMachines = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="CardioMachines">Cardio Machines</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.cafe == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="Cafe" onChange={(e) => { this.state.Gym.cafe = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="Cafe">Cafe</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.vendingMachine == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="VendingMachine" onChange={(e) => { this.state.Gym.vendingMachine = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="VendingMachine">Food & Drink Available</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.twentyFourHour == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="TwentyFourHour" onChange={(e) => { this.state.Gym.twentyFourHour = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="TwentyFourHour">24 Hour</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.toilets == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="Toilets" onChange={(e) => { this.state.Gym.toilets = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="Toilets">Toilets</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.changingRooms == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="ChangingRooms" onChange={(e) => { this.state.Gym.changingRooms = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="ChangingRooms">Changing Rooms</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.classesAvailable == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="ClassesAvailable" onChange={(e) => { this.state.Gym.classesAvailable = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="ClassesAvailable">Classes Available</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.membersOnly == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="MembersOnly" onChange={(e) => { this.state.Gym.membersOnly = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="MembersOnly">Members Only</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.noMembershipRequired == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="NoMembershipRequired" onChange={(e) => { this.state.Gym.noMembershipRequired = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="NoMembershipRequired">Day Passes Available</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.sauna == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="Sauna" onChange={(e) => { this.state.Gym.sauna = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="Sauna">Sauna</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.swimmingPool == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="SwimmingPool" onChange={(e) => { this.state.Gym.swimmingPool = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="SwimmingPool">Swimming Pool</label>
                                </div>
                                <div className={`addGymCheckBoxArea ${this.state.Gym.physio == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                    <input className="checkbox-inline" type="checkbox" id="Physio" onChange={(e) => { this.state.Gym.physio = e.target.checked ? 1 : 0; this.setState({ Gym: this.state.Gym }) }} />
                                    <label htmlFor="Physio">Physio</label>
                                </div>

                            </div>



                        </div>

                        <CenterTitleWithLine Title="Description" LineColour="cornflowerblue" />

                        <textarea className="form-control text-center" style={{ minHeight: '150px' }} value={this.state.Gym.description}
                            onChange={(e) => {
                                this.state.Gym.description = e.target.value; this.setState({ Gym: this.state.Gym })
                            }}
                            placeholder="Add opening times, specialisations and other features here (max 450 characters)"
                        ></textarea>
                        Characters: <span style={{ color: this.state.Gym.description.length > 450 ? 'red' : 'initial' }}>
                            {this.state.Gym.description.length}
                        </span> / 450
    
                </div>



                    <div hidden={hideFormAreas}>

                        <CenterTitleWithLine Title="Logo" LineColour="cornflowerblue" />

                        <div style={{ minHeight: '250px', marginBottom: '20px' }}>


                            <div className="row justify-content-center" style={{
                                minHeight: '150px'
                            }}>
                                <div className="col-md-4">
                                    <div className="addGymImageContainer addGymImageContainerLogo">
                                        {
                                            g.imageLocationLogo && g.imageLocationLogo.length > 0
                                                ? <img className="logoImage img-fluid" src={g.imageLocationLogo} />
                                                : null
                                        }
                                    </div>
                                    <label className="imgBrowseLabel">
                                        <input
                                            id="imageUploaderBrowseBtnLogo"
                                            type="file"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={(e) => this.onFileSelect(e, ImageLabel.Logo)}
                                            multiple={false}
                                            className="imgSelectInput"
                                        />
                                        <button type="button" className="btn btn-secondary bt-sm" onClick={() => ClickElement('imageUploaderBrowseBtnLogo')}>Browse</button>
                                        <button hidden={this.GetSRC(ImageLabel.Logo).length == 0}
                                            type="button" className="btn btn-danger bt-sm" onClick={() => this.DeselectImage(ImageLabel.Logo)}>✖</button>
                                    </label>
                                </div>

                                <div className="col-md-4" hidden={this.state.Images.filter(x => x.Label == ImageLabel.Logo)[0].ImageFile.size == 0}>

                                    <div style={{ color: 'blue', textAlign: 'center' }}>Click and drag across image to crop desired area</div>

                                    <div className="imageCropContainer">

                                        <ReactCrop
                                            src={this.GetSRC(ImageLabel.Logo)}
                                            onChange={this.onSelectedImage}
                                            crop={this.state.Crop}
                                            onComplete={this.onCropComplete}
                                            onImageLoaded={(image, pixelCrop) => this.onCropComplete(null, pixelCrop)}
                                        />



                                    </div>
                                   
                                </div>
                               


                            </div>

                            <CenterTitleWithLine Title="Gym Photos" LineColour="cornflowerblue" />

                            <div className="col-12" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                                You can upload up to 3 images of your gym. Landscape oriented photos are generally better. Maximum size 9MB per image.
                            </div>

                            <div className="row" style={{
                                minHeight: '150px'
                            }}>
                                <div className={OnMobile() ? 'col-md-4' : 'col-4'} >
                                    <div className="addGymImageContainer">
                                        {
                                            this.GetSRC(ImageLabel.Image1).length > 0
                                                ? <img className="addGymImage img-fluid" src={this.GetSRC(ImageLabel.Image1)} />
                                                : null
                                        }
                                    </div>

                                    <label className="imgBrowseLabel">
                                        <input
                                            id="imageUploaderBrowseBtnImg1"
                                            type="file"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={(e) => this.onFileSelect(e, ImageLabel.Image1)}
                                            multiple={false}
                                            className="imgSelectInput"
                                        />
                                        <button type="button" className="btn btn-secondary bt-sm" onClick={() => ClickElement('imageUploaderBrowseBtnImg1')}>Browse</button>
                                        <button hidden={this.GetSRC(ImageLabel.Image1).length == 0}
                                            type="button" className="btn btn-danger bt-sm" onClick={() => this.DeselectImage(ImageLabel.Image1)}>✖</button>
                                    </label>
                                </div>
                                <div className={OnMobile() ? 'col-md-4' : 'col-4'} >
                                    <div className="addGymImageContainer" >
                                        {
                                            this.GetSRC(ImageLabel.Image2).length > 0
                                                ? <img className="addGymImage img-fluid" src={this.GetSRC(ImageLabel.Image2)} />
                                                : null
                                        }
                                    </div>

                                    <label className="imgBrowseLabel" >
                                        <input
                                            id="imageUploaderBrowseBtnImg2"
                                            type="file"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={(e) => this.onFileSelect(e, ImageLabel.Image2)}
                                            multiple={false}
                                            className="imgSelectInput"

                                        />
                                        <button type="button" className="btn btn-secondary bt-sm" onClick={() => ClickElement('imageUploaderBrowseBtnImg2')}>Browse</button>
                                        <button hidden={this.GetSRC(ImageLabel.Image2).length == 0}
                                            type="button" className="btn btn-danger bt-sm" onClick={() => this.DeselectImage(ImageLabel.Image2)}>✖</button>
                                    </label>
                                </div>
                                <div className={OnMobile() ? 'col-md-4' : 'col-4'} >
                                    <div className="addGymImageContainer" >
                                        {
                                            this.GetSRC(ImageLabel.Image3).length > 0
                                                ? <img className="addGymImage img-fluid" src={this.GetSRC(ImageLabel.Image3)} />
                                                : null
                                        }
                                    </div>

                                    <label className="imgBrowseLabel" >
                                        <input
                                            id="imageUploaderBrowseBtnImg3"
                                            type="file"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={(e) => this.onFileSelect(e, ImageLabel.Image3)}
                                            multiple={false}
                                            className="imgSelectInput"

                                        />
                                        <button type="button" className="btn btn-secondary bt-sm" onClick={() => ClickElement('imageUploaderBrowseBtnImg3')}>Browse</button>
                                        <button hidden={this.GetSRC(ImageLabel.Image3).length == 0}
                                            type="button" className="btn btn-danger bt-sm" onClick={() => this.DeselectImage(ImageLabel.Image3)}>✖</button>
                                    </label>
                                </div>
                            </div>

                        </div>

                        <CenterTitleWithLine Title="" LineColour="cornflowerblue" />

                        {editButtons}
                        
                    </div>

                </form>


                <div hidden={!this.state.OnPreview} className="text-center">
                    {editButtons}
                    <div className="text-left">
                        <GymFinderGymView Hidden={false} BackgroundColor="white" Gym={this.state.Gym} imageViewerSRCs={[]} ListView={false} />
                    </div>
                </div>

                <div className="text-center" hidden={!this.state.Saving} >
                    <Loader CentreAlign ContainerMargin='20px 0 20px 0' Height='80px' />
                </div>


               
            </div>

        </div>
    }

    private DeselectImage(Label: ImageLabel): void {

        let images = this.state.Images;
        let removingImg = images.filter(x => x.Label == Label)[0];
        let index = images.indexOf(removingImg);

        images[index] = { ImageFile: new File([], Label.toString()), ImageSRC: '', Label: Label }

        switch (Label) {
            case ImageLabel.Logo:
                images[index] = { ImageFile: new File([], "delete"), ImageSRC: '', Label: ImageLabel.Logo }
                this.state.Gym.imageLocationLogo = "";
                break;
            case ImageLabel.Image1:
                //images[1] = { ImageFile: images[2].ImageFile, ImageSRC: images[2].ImageSRC, Label: ImageLabel.Image1 };
                //images[2] = { ImageFile: images[3].ImageFile, ImageSRC: images[3].ImageSRC, Label: ImageLabel.Image2 };
                //images[3] = { ImageFile: new File([], ""), ImageSRC: '', Label: ImageLabel.Image3 }
                this.state.Gym.imageLocation1 = "";
                break;
            case ImageLabel.Image2:
                //images[2] = { ImageFile: images[3].ImageFile, ImageSRC: images[3].ImageSRC, Label: ImageLabel.Image2 };
                //images[3] = { ImageFile: new File([], ""), ImageSRC: '', Label: ImageLabel.Image3 }
                this.state.Gym.imageLocation2 = "";
                break;
            case ImageLabel.Image3:
                //images[3] = { ImageFile: new File([], ""), ImageSRC: '', Label: ImageLabel.Image3 }
                this.state.Gym.imageLocation3 = "";
                break;
        }

        this.setState({
            Images: images,
            Gym: this.state.Gym
        })
    }
}

enum ImgUploadStage {
    Logo,
    Images
}