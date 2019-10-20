import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HttpResult, UserProfile, CityGeoBasic } from '../../data/serverModels';
import { Loader } from '../Widgets/Loaders';
import { CenterTitleWithLine, Icon, IconType } from '../Widgets/Widgets';
import { Colours, CSSValues, UserState } from '../../Helpers/Globals';
import { CitiesAutosuggest } from '../Geo/CitiesAutosuggest';
import ReactCrop from 'react-image-crop';
import Toggle from 'react-toggle'
import { DashboardNav } from './DashboardNav';
import { ImageDetails } from './MyGym';
import { ClickElement, LogoutUser, CopytoClipboard } from '../../Helpers/Functions';

import '../../css/profile.css';
import "react-toggle/style.css"
import 'react-image-crop/dist/ReactCrop.css';
import { HeaderSearchBarArea } from '../Widgets/HeaderSearchArea';

interface ModuleState {
    User: UserProfile;
    Saving: boolean;
    Image: ImageDetails
    ValidationText: string;
    ImgValidation: string;
    KeyCounter: number;//for resetting empty form fields
    OriginalImageSRC: string;//for comparing against image being uploaded (if uploading img is empty but original has value, then deletion)
    Crop: Crop;//continuously updates while dragging crop area
    FinalCrop: Crop;//final value of crop
}


export class UserProfilePage extends React.Component<RouteComponentProps<{}>, ModuleState> {

    constructor(props) {
        super(props);


        this.state = {
            ValidationText: "",
            ImgValidation: "",
            Saving: true,// acts as 'loading' when in GetUser()
            User: new UserProfile(),
            KeyCounter: 0,
            Image: this.emptyImage(),
            OriginalImageSRC: '',
            Crop: new Crop,
            FinalCrop: new Crop,
        }

        this.GetUser = this.GetUser.bind(this);
        this.UpdateProfile = this.UpdateProfile.bind(this);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.SaveImage = this.SaveImage.bind(this);
        this.DeselectImage = this.DeselectImage.bind(this);
        this.onSelectedImage = this.onSelectedImage.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
        this.Validate = this.Validate.bind(this);
        this.CancelCrop = this.CancelCrop.bind(this);
    }

    private emptyImage(): ImageDetails {

        let newImage: ImageDetails = new ImageDetails();

        newImage = { ImageFile: new File([], ""), ImageSRC: "", Label: 0, };

        return newImage;
    }


    componentDidMount() {
        this.GetUser();
    }

    private GetUser() {
        fetch('/api/User/GetUser/true')
            .then(response => response.json() as Promise<HttpResult<UserProfile>>)
            .then(resp => {
                if (resp.ok) {

                    UserState.Profile = resp.data;

                    this.setState({
                        User: resp.data,
                        Saving: false,
                        Image: resp.data.profilePic && resp.data.profilePic.length > 0
                            ? { ImageFile: new File([], resp.data.profilePic), ImageSRC: '', Label: 0 }
                            : this.emptyImage(),
                        OriginalImageSRC: resp.data.profilePic
                    })
                }
                else {
                    if (resp.message == "Not logged in!") {

                        LogoutUser(() => this.props.history.push('/dashboard'));
                    }
                    else {
                        this.setState({
                            ValidationText: resp.message,
                            Saving: false,
                        })
                    }
                   
                }
            })
    }

    private Validate(): boolean {

        let validationText = '';

        let u = this.state.User;

        if (u.username.length == 0) {
            validationText += "Username, ";
        }

        if (u.isCoach == 1) {
            if (u.firstName.length == 0) {
                validationText += "First Name\n";
            }
            if (u.lastName.length == 0) {
                validationText += "Last Name\n";
            }
            if (u.cityId == 0) {
                validationText += "Location\n";
            }
            if (u.coachBio.length == 0) {
                validationText += "Coach Bio\n";
            }
        }

        if (validationText.length > 0) {
            this.setState({
                ValidationText: "Please complete the following: \n" + validationText
            });
            return false;
        }
        else {
            return true;
        }
    }

    private CancelCrop() {

        //let component = this;
        //console.log(this.state.Image.ImageFile.size);
        //this.setState({
        //    Image: this.emptyImage(),
        //    KeyCounter: this.state.KeyCounter + 1
        //}, function () {
        //    console.log(component.state.Image.ImageFile.size);

        //    });

        this.setState({
            Image: this.emptyImage(),
            KeyCounter: this.state.KeyCounter + 1
        });


    }

    private UpdateProfile() {

        if (this.Validate()) {
            this.setState({
                Saving: true,
                ValidationText: ''

            });

            fetch('api/User/UpdateUser',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.User)
                })
                .then(response => response.json() as Promise<HttpResult<UserProfile>>)
                .then(data => {

                    if (data.ok) {

                        UserState.Profile = data.data;

                        this.setState({
                            Saving: false,
                            ValidationText: 'Saved successfully!',
                            KeyCounter: this.state.KeyCounter + 1
                        });

                        if (this.state.OriginalImageSRC != this.GetSRC())
                            this.SaveImage();


                    }
                    else {
                        this.setState({
                            ValidationText: data.message,
                            Saving: false,
                        })
                    }
                }).catch((e: Error) => this.setState({
                    ValidationText: e.message,
                    Saving: false
                }));
        }
       
    }

    private onFileSelect(event,) {

        let component = this;

        let thisImage = this.state.Image;

        component.setState({
            Image: { ImageFile: new File([], ""), ImageSRC: "", Label: 0, }
        });

        let files = event.target.files as Array<File>;

        if (FileReader && files && files.length) {

            if (files[0].type.indexOf("image") == -1) {
                component.setState({
                    ImgValidation: "Invalid file type!"
                });
                return 0;
            }
            else if (files[0].size > 9000000) {
                component.setState({
                    ImgValidation: "Max image size 9MB"
                });
                return 0;
            }
            else {
                var fr = new FileReader();
                fr.onload = function () {
                    if (fr.result != null) {
                        thisImage.ImageFile = files[0];
                        thisImage.ImageSRC = fr.result.toString();
                        component.setState({
                            Image: thisImage
                        });
                    }
                }
                fr.readAsDataURL(files[0]);
            }

        }
    }

    private SaveImage() {

        this.setState({
            Saving: true,
            ImgValidation: "Uploading..."
        });
        let crop = this.state.FinalCrop;
        let cropDataString = `x=${crop.x}&y=${crop.y}&width=${crop.width}&height=${crop.height}`;

        const formData = new FormData();

        let u = this.state.User;

        

        formData.append("image", this.state.Image.ImageFile);

        fetch(`/api/User/AddUpdateProfilePic?userID=${u.id}&${cropDataString}`,
            {
                method: 'POST',
                //headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            })
            .then(response => response.json() as Promise<HttpResult<UserProfile>>)
            .then(data => {
                try {

                    if (data.ok) {

                        UserState.Profile = data.data;
                        
                        this.setState({
                            Image: this.emptyImage(),
                            User: data.data,
                            Saving: false,
                            ImgValidation: "Complete!",
                            KeyCounter: this.state.KeyCounter + 1,
                            Crop: new Crop,
                            FinalCrop: new Crop,
                            OriginalImageSRC: data.data.profilePic
                        });

                    }
                    else {
                        throw (new Error(data.message))
                    }
                }
                catch (error) {
                    console.log(error);
                    this.setState({
                        Saving: false,
                        ImgValidation: data.message,
                    });
                }
            });

    }

    private DeselectImage(): void {

        this.state.User.profilePic = '';

        this.setState({
            Image: new ImageDetails(),
            User: this.state.User,
            KeyCounter: this.state.KeyCounter + 1
        })
    }


    private GetSRC(): string {

        try {
            let u = this.state.User;
            let img = this.state.Image;

            console.log(img);
            console.log(img.ImageFile.size);

            if (img.ImageFile.size > 10)
                return img.ImageSRC ? img.ImageSRC : "";
            else {
                return u.profilePic ? u.profilePic : "";

            }
        }
        catch (e) {
            return "";
        }

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

    public render() {

        let u = this.state.User;

        let profileimage =
            u.profilePic && u.profilePic.length > 0
                ? <img key={this.state.KeyCounter} className="profilepicImage img-fluid" src={u.profilePic} />
                : null;

        let coachProfileURL: string = `https://gym-bay.com/viewCoach/7/${encodeURI(u.firstName + ' ' + u.lastName)}`;

        return <div>

            <HeaderSearchBarArea Props={this.props} />

            <DashboardNav />

            <div className="max-width dashboardArea" style={{ marginTop: CSSValues.DashNavHeight }} >


                

                <div hidden={!this.state.Saving}>
                    <Loader CentreAlign Height="100px" ContainerMargin="25vh 0 20px 0" />
                </div>

                <form key={this.state.KeyCounter} hidden={this.state.Saving}
                    style={{ padding: '5px' }}>

                    <div className="text-right" style={{ backgroundColor: 'white' }} >
                        <button type="button" className="btn btn-primary" onClick={this.UpdateProfile}>Save</button>
                        <br />
                        <span style={{ color: 'red' }}>{this.state.ValidationText}</span>
                    </div>

                    <CenterTitleWithLine LineColour={Colours.Blue} Title="My Profile" />

                   

                    <div className="row">
                        <div className="col-md-4" style={{ margin: 'auto' }} hidden={this.state.Image.ImageFile.size > 0}>


                            <div className="profilePicContainer">
                                {profileimage}
                            </div>

                            <label className="imgBrowseLabel" style={{ width: '190px' }}>
                                <input
                                    id="imageUploaderBrowseBtn"
                                    type="file"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={(e) => this.onFileSelect(e)}
                                    multiple={false}
                                    className="imgSelectInput"
                                />
                                <button type="button" className="btn btn-secondary bt-sm" onClick={() => ClickElement('imageUploaderBrowseBtn')}>Browse</button>
                                <button hidden={this.GetSRC().length == 0}
                                    type="button" className="btn btn-danger bt-sm" onClick={this.DeselectImage}>Delete</button>
                               

                            </label>
                        </div>
                        <div className="col-md-4" style={{ margin: 'auto' }} hidden={this.state.Image.ImageFile.size == 0}>

                            <div style={{ color: 'blue', textAlign: 'center' }}>Click and drag across image to crop desired area, then click 'Save Image' below.</div>

                            <div  className="imageCropContainer">

                                <ReactCrop
                                    src={this.GetSRC()}
                                    onChange={this.onSelectedImage}
                                    crop={this.state.Crop}
                                    onComplete={this.onCropComplete}
                                    onImageLoaded={(image, pixelCrop) => this.onCropComplete(null, pixelCrop)}
                                />


                                
                            </div>
                            <label className="profileimgBrowseLabel">

                                <button type="button" className="btn btn-primary bt-sm" onClick={this.CancelCrop}>Cancel</button>

                                <button type="button" className="btn btn-primary bt-sm" onClick={this.SaveImage}>Save Image</button>
                                
                            </label>
                        </div>

                        

                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel">Username</div>
                            <input placeholder="Username"
                                className="form-control searchInput"
                                value={u.username}
                                onChange={(e) => { this.state.User.username = e.target.value; this.setState({ User: this.state.User }) }} />
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel">Location: <span style={{ color: Colours.Black, fontWeight: 'normal', fontSize: '17px' }}>{u.cityName}</span></div>
                            <CitiesAutosuggest CitySelected={(e: CityGeoBasic) => {
                                this.state.User.cityId = e.cityGeoId;
                                this.state.User.countryName = e.countryName;
                                this.state.User.cityName = e.cityName;
                                this.setState({ User: this.state.User })
                            }} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel">First Name</div>
                            <input placeholder="First Name"
                                className="form-control searchInput"
                                value={u.firstName}
                                onChange={(e) => { this.state.User.firstName = e.target.value; this.setState({ User: this.state.User }) }} />
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel">Last Name</div>
                            <input placeholder="Last Name"
                                className="form-control searchInput"
                                value={u.lastName}
                                onChange={(e) => { this.state.User.lastName = e.target.value; this.setState({ User: this.state.User }) }} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel">Phone</div>
                            <input placeholder="Phone"
                                className="form-control searchInput"
                                value={u.phone}
                                onChange={(e) => { this.state.User.phone = e.target.value; this.setState({ User: this.state.User }) }} />
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel">Email</div>
                            <input placeholder="Email"
                                className="form-control searchInput"
                                value={u.email}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <label className="isCoachToggleLabel">
                                <Toggle
                                    key={u.isCoach}
                                    className="adminGymToggle"
                                    
                                    defaultChecked={u.isCoach == 1}
                                    onChange={() => {
                                        this.state.User.isCoach = this.state.User.isCoach == 1
                                            ? 0
                                            : 1;
                                        this.setState({
                                            User: this.state.User
                                        });
                                    }} />
                                <span>I am a Coach</span>
                            </label>
                            <div className="profile-coachToggleInfo">

                                With this option selected, your profile will be listed in the Find a Coach database. <br />
                                
                                <div hidden={u.isCoach != 1}>
                                    Once saved, your public coach profile will be accessible via this link:
                                    <br />
                                    <div style={{ paddingTop: '4px', paddingBottom: '4px', display: 'table' }}>

                                        <div className="clipboardCopyBtn" onClick={() => CopytoClipboard(coachProfileURL)}>
                                            <span>Copy</span>
                                        </div>
                                        <div className="profileURL">{coachProfileURL}</div>
                                    </div>
                                    After your profile and/or credentials have been successfully verified, a Verified badge will appear next to your name.
                                <Icon Class="profileSocialIcon" Type={IconType.CoachFinder} Name="verified" Hidden={false} />

                                </div>
                            </div>
                        </div>
                    </div>

                    <div hidden={u.isCoach != 1}>

                        <CenterTitleWithLine LineColour={Colours.Blue} Title="My Coaching Areas" />

                        <div className="row" style={{ margin: 'auto', maxWidth: '680px' }}>

                            <div className={`addGymCheckBoxArea ${this.state.User.coachBodybuilding == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachBodybuilding" onChange={(e) => { this.state.User.coachBodybuilding = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachBodybuilding">Bodybuilding</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachPowerlifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachPowerlifting" onChange={(e) => { this.state.User.coachPowerlifting = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachPowerlifting">Powerlifting</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachCrossfit == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachCrossfit" onChange={(e) => { this.state.User.coachCrossfit = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachCrossfit">Crossfit</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachWeightLoss == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachWeightLoss" onChange={(e) => { this.state.User.coachWeightLoss = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachWeightLoss">Weight Loss</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachStrongman == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachStrongman" onChange={(e) => { this.state.User.coachStrongman = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachStrongman">Strongman</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachClasses == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachClasses" onChange={(e) => { this.state.User.coachClasses = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachClasses">Classes Available</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachDance == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachDance" onChange={(e) => { this.state.User.coachDance = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachDance">Dance</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachMasseuse == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachMasseuse" onChange={(e) => { this.state.User.coachMasseuse = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachMasseuse">Massage</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachNutrition == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachNutrition" onChange={(e) => { this.state.User.coachNutrition = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachNutrition">Nutrition</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachOlympicLifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachOlympicLifting" onChange={(e) => { this.state.User.coachOlympicLifting = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachOlympicLifting">Olympic Lifting</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachOneOnOne == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachOneOnOne" onChange={(e) => { this.state.User.coachOneOnOne = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachOneOnOne">One on One</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachOnlineAvailable == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachOnlineAvailable" onChange={(e) => { this.state.User.coachOnlineAvailable = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachOnlineAvailable">Online Available</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachOnlineOnly == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachOnlineOnly" onChange={(e) => { this.state.User.coachOnlineOnly = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachOnlineOnly">Online Only</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachPhysio == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachPhysio" onChange={(e) => { this.state.User.coachPhysio = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachPhysio">Physio</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachProgramOnly == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachProgramOnly" onChange={(e) => { this.state.User.coachProgramOnly = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachProgramOnly">Programs Only</label>
                            </div>
                            <div className={`addGymCheckBoxArea ${this.state.User.coachOther == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                                <input className="checkbox-inline" type="checkbox" id="coachOther" onChange={(e) => { this.state.User.coachOther = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                                <label htmlFor="coachOther">Other</label>
                            </div>

                            <div style={{color: 'var(--grey)'}}>If your coaching area is not listed, please select 'Other' and add further details your Coach Bio below.</div>

                        </div>

                        <CenterTitleWithLine LineColour={Colours.Blue} Title="Coach Bio" />

                        <div className="row">

                            <div className="col-md-12">
                                <textarea className="form-control text-center" style={{ minHeight: '150px' }} value={this.state.User.coachBio}
                                    onChange={(e) => {
                                        this.state.User.coachBio = e.target.value; this.setState({ User: this.state.User })
                                    }}
                                    placeholder="Write about your skills, specialisms, experiences, certifications..."
                                ></textarea>
                            </div>
                        </div>

                    </div>

                  

                    <CenterTitleWithLine LineColour={Colours.Blue} Title="What I Enjoy" />

                    <div className="row" style={{ margin: 'auto', maxWidth: '680px' }}>

                        <div className={`addGymCheckBoxArea ${this.state.User.bodyBuilding == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="bodyBuilding" onChange={(e) => { this.state.User.bodyBuilding = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="bodyBuilding">Bodybuilding</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.powerlifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="powerlifting" onChange={(e) => { this.state.User.powerlifting = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="powerlifting">Powerlifting</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.crossfit == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="crossfit" onChange={(e) => { this.state.User.crossfit = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="crossfit">Crossfit</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.weightLifting == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="weightLifting" onChange={(e) => { this.state.User.weightLifting = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="weightLifting">WeightLifting</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.strongManWoman == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="strongManWoman" onChange={(e) => { this.state.User.strongManWoman = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="strongManWoman">Strongman</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.calisthenics == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="calisthenics" onChange={(e) => { this.state.User.calisthenics = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="calisthenics">Calisthenics</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.boxing == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="boxing" onChange={(e) => { this.state.User.boxing = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="boxing">Boxing</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.kickboxing == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="kickboxing" onChange={(e) => { this.state.User.kickboxing = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="kickboxing">Kickboxing</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.mma == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="mma" onChange={(e) => { this.state.User.mma = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="mma">MMA</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.endurance == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="endurance" onChange={(e) => { this.state.User.endurance = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="endurance">Endurance</label>
                        </div>
                        <div className={`addGymCheckBoxArea ${this.state.User.gymnastics == 1 ? 'addGymCheckBoxAreaChecked' : ''}`}>
                            <input className="checkbox-inline" type="checkbox" id="gymnastics" onChange={(e) => { this.state.User.gymnastics = e.target.checked ? 1 : 0; this.setState({ User: this.state.User }) }} />
                            <label htmlFor="gymnastics">Gymnastics</label>
                        </div>

                    </div>

                    <CenterTitleWithLine LineColour={Colours.Blue} Title="Personal Bio" />

                    <div className="row">
                        
                        <div className="col-md-12">
                            <textarea className="form-control" style={{ minHeight: '150px' }} value={this.state.User.bio}
                                onChange={(e) => {
                                    this.state.User.bio = e.target.value; this.setState({ User: this.state.User })
                                }}
                                placeholder="About me..."
                            ></textarea>
                        </div>
                    </div>

                    <CenterTitleWithLine LineColour={Colours.Blue} Title="Social" />

                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="010-website" />
                                <input placeholder="Website URL"
                                    className="form-control searchInput"
                                    value={u.website}
                                    onChange={(e) => { this.state.User.website = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="009-skype" />
                                <input placeholder="Skype ID"
                                    className="form-control searchInput"
                                    value={u.skype}
                                    onChange={(e) => { this.state.User.skype = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="002-instagram" />
                                <input placeholder="Instagram URL"
                                    className="form-control searchInput"
                                    value={u.instagram}
                                    onChange={(e) => { this.state.User.instagram = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="001-facebook" />
                                <input placeholder="Facebook URL"
                                    className="form-control searchInput"
                                    value={u.facebook}
                                    onChange={(e) => { this.state.User.facebook = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="004-twitter" />
                                <input placeholder="Twitter URL"
                                    className="form-control searchInput"
                                    value={u.twitter}
                                    onChange={(e) => { this.state.User.twitter = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="003-youtube" />
                                <input placeholder="YouTube URL"
                                    className="form-control searchInput"
                                    value={u.youtube}
                                    onChange={(e) => { this.state.User.youtube = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="005-whatsapp" />
                                <input placeholder="WhatsApp Number"
                                    className="form-control searchInput"
                                    value={u.whatsapp}
                                    onChange={(e) => { this.state.User.whatsapp = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="006-linkedin" />
                                <input placeholder="LinkedIn URL"
                                    className="form-control searchInput"
                                    value={u.linkedin}
                                    onChange={(e) => { this.state.User.linkedin = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="007-google-plus" />
                                <input placeholder="Google+ URL"
                                    className="form-control searchInput"
                                    value={u.googlePlus}
                                    onChange={(e) => { this.state.User.googlePlus = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="inputLabel socialInputContainer">
                                <Icon Hidden={false} Class="profileSocialIcon" Type={IconType.Social} Name="008-snapchat" />
                                <input placeholder="Snapchat ID"
                                    className="form-control searchInput"
                                    value={u.snapchat}
                                    onChange={(e) => { this.state.User.snapchat = e.target.value; this.setState({ User: this.state.User }) }} />
                            </div>
                        </div>
                    </div>
                    

                        <br />
                    <br />


                    <div className="text-right" style={{ backgroundColor: 'white' }} >
                        <span style={{ color: 'red' }}>{this.state.ValidationText}</span>
                        <br />
                        <button type="button" className="btn btn-primary" onClick={this.UpdateProfile}>Save</button>
                    </div>
                </form>
               
            </div>

        </div>
    }
}

export class Crop {
    //All crop values are in percentages, and are relative to the image.
    x: number = 15;
    y: number = 15;
    width: number = 40;
    height: number = 40;
    //aspect ratio
    aspect: number = 1;
}