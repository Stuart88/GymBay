import { OnMobile, UserLoggedIn } from "./Functions";
import { UserProfile, HttpResult } from "../data/serverModels";

export class Colours {
    static Blue: string = 'var(--blue)';
    static Black: string = 'var(--black)';
}

export class UserState {
    public static Profile: UserProfile = new UserProfile();

    public static GetProfilePic(): string {
        if (this.Profile.profilePic && this.Profile.profilePic.length > 0) {
            return this.Profile.profilePic;
        }
        else {
            return '/dist/images/users/default-user.jpg';
        }
    }

    public static FetchProfile(): void {
        if (UserLoggedIn()) {
            fetch('/api/User/GetUser/false')
                .then(response => response.json() as Promise<HttpResult<UserProfile>>)
                .then(resp => {
                    if (resp.ok) {
                        UserState.Profile = resp.data;
                    }
                })
        }
    }
}

export class GymSearchState {
    private static GymState: any = undefined;

    public static HasState(): boolean {
        return this.GymState != undefined;
    }

    public static SetState(state: any): void {
        GymSearchState.GymState = state;
    }

    public static GetState(): any {
        return GymSearchState.GymState;
    }
}

export class CoachSearchState {
    private static CoachState: any = undefined;

    public static HasState(): boolean {
        return this.CoachState != undefined;
    }

    public static SetState(state: any): void {
        CoachSearchState.CoachState = state;
    }

    public static GetState(): any {
        return CoachSearchState.CoachState;
    }
}

export class Pages {
    static home: string = '/';
    static newsItem: string = '/newsItem';
    static gymfinder: string = '/gymfinder';
    static viewgym: string = '/viewgym';
    static coachfinder: string = '/coachfinder';
    static viewCoach: string = '/viewCoach';
    static addgym: string = '/addgym';
    static admin: string = '/admin';
    static dashboard: string = '/dashboard';
    static about: string = '/about';
    static privacy: string = '/privacy';
    static profile: string = '/profile';
    static reviews: string = '/reviews';
    static gymreview: string = '/gymreview';
    static coachreview: string = '/coachreview';
    static gymshop: string = '/gymshop';
    static forum: string = '/gymforum';
    static mygym: string = '/mygym';
    static forcoaches: string = '/forcoaches'

    //Admin
    static newsfeedpost: string = '/newsfeedpost';
}

export class SiteDetails {
    static SiteURL: string = 'https://gym-bay.com'
    static MaxRating: number = 10.0;
}

export class CSSValues {
    static TopBarHeight: string = OnMobile() ? '50px' : '60px'
    static SearchBarHeight: string = OnMobile() ? '60px' : '0px';//search bar is incorporated into TopBar on desktop
    static DashNavHeight: string = OnMobile() ? '0px' : '40px'
}

export const toolbarOptions_Admin = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'/*, 'strike'*/],        // toggled buttons
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    //  [{ 'font': [] }],

    ['clean']                                         // remove formatting button
];