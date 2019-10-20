import { GymFinderGym, HttpResult, GymFinderBasic, CoachBasic, UserProfile } from "../data/serverModels";
import { ImageDecorator } from "react-viewer/lib/ViewerProps";
import  Cookie from 'universal-cookie';
const cookies = new Cookie();

export function OnMobile() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
}

export function EnterPressed(event: React.KeyboardEvent<any>, functionToDo: any) {
    if (event.keyCode == 13) {
        event.preventDefault();
        functionToDo();
    }
}

export function StartsWith(s: string, startsWith: string): boolean {
    if (s.length < startsWith.length)
        return false;

    return s.substr(0, startsWith.length) == startsWith;
        
}

export function GymImagesArray(g: GymFinderGym): Array<ImageDecorator> {

    let images = new Array<ImageDecorator>();


    if (g.imageLocation1 && g.imageLocation1.length > 0)
        images.push({ src: g.imageLocation1, alt: g.name });

    if (g.imageLocation2 && g.imageLocation2.length > 0)
        images.push({ src: g.imageLocation2, alt: g.name });

    if (g.imageLocation3 && g.imageLocation3.length > 0)
        images.push({ src: g.imageLocation3, alt: g.name });


    return images;
}

///Clicks given element. Does nothing if element does not exist 
export function ClickElement(id: string) {


    let element = document.getElementById(id) as HTMLElement

    if (element != null) {
        element.click();
    }
    else {
        console.log(`'${id}' not found!`);
    }
}

interface AuthHeaderObj {
    method: string;
    headers: {};
    credentials: string
}

export function CreateAuthHeaderObject(email: string, pass: string, body: any): RequestInit  {

    let authHeader = 'Basic ' + btoa(`${email}:${pass}`);

    return {
        method: 'POST',
        headers: {
            'authorisation': authHeader,
            //'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'same-origin',
        body: body,
    };
}

export function CreatePostObject(postObject: any): RequestInit {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postObject)
    }
}

export function AdminLoggedIn(): boolean {
    return cookies.get('AdminUserID') > 0;
}

export function LogoutAdmin(onSuccess: Function) {
    fetch(`api/Admin/AdminLogout/`,
        {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(response => response.json() as Promise<HttpResult<any>>)
        .then(data => {
            if (data.ok) {
                cookies.remove('AdminUserID');
                cookies.remove('AdminSessionID');
                onSuccess();
            }
            else {
                alert(data.message);
            }
        })
}

export function LogoutUser(onSuccess: Function) {
    fetch(`api/User/UserLogout/`,
        {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(response => response.json() as Promise<HttpResult<any>>)
        .then(data => {
            if (data.ok) {
                cookies.remove('UserID');
                cookies.remove('SessionID');
                onSuccess();
            }
            else {
                alert(data.message);
            }
        })
}

export function UserLoggedIn(): boolean {
    return cookies.get('UserID') > 0;
}

export function GetUserID(): number{
    if (UserLoggedIn()) {
        return cookies.get('UserID');
    }
    else
        return 0;
}
export function toGymFinderBasic(g: GymFinderGym): GymFinderBasic {

    return {
        name: g.name,
        cityName: g.locationCityName,
        countryName: g.locationCountryName,
        id: g.id,
        logo: g.imageLocationLogo,
        allData: '' //user in autosuggest  '{name} {cityName} {countryName}'
    }
}

export function toCoachBasic(c: UserProfile): CoachBasic {
    return {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        cityName: c.cityName,
        countryName: c.countryName,
        pic: c.profilePic,
        isVerified: c.isVerified,
        allData: ''//user in autosuggest: '{fistName} {lastName} {cityName},{PcountryName}'
    }
}

export function CopytoClipboard(text):void {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)

    if (result)
        alert("Copied!");
    else
        alert("Error!");
}