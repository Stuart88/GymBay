
export interface HttpResult<T>  {
    ok: boolean;
    data: T;
    message: string;
}

export class Shop {
    id: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    email: string = "";
    phone: string = "";
    contactPerson: string = "";
    shopName: string = "";
    countryId: number = 0;
    cityId: number = 0;
    countryName: string = "";
    cityName: string = "";
    description: string = "";
    status: number = 0
}

export class CityGeo {
    geonameId: number = 0;
    countryGeonameId: number = 0;
    countryName: string = "";
    cityName: string = "";
    continentName: string = "";
    latitude: number = 0.0;
    longitude: number = 0.0;
    localeCode: string = "";
    continentCode: string = "";
    isoCode: string = "";
    timeZone: string = "";
    id: number = 0;
}

export class CountryGeo {
    countryGeonameId: number = 0;
    countryName: string = "";
    continentName: string = "";
    localeCode: string = "";
    continentCode: string = "";
    isoCode: string = "";
    iso3Code: string = "";
    timeZone: string = "";
    currency: string = "";
    id: number = 0;
}

export class CitySearchResult {
    cityId: number = 0;
    cityName: string = "";
    nearestCity: string = "";
}
export class CityGeoBasic {
    id: number = 0;
    cityGeoId: number = 0;
    cityName: string = "";
    nearestCity: string = "";
    countryName: string = "";
}

export class GymFinderGym {
    id: number = 0;
    name: string = "";
    phone: string = "";
    website: string = "";
    facebook: string = "";
    twitter: string = "";
    instagram: string = "";
    description: string = "";
    streetAddress: string = "";
    imageLocationLogo: string = "";
    imageLocation1: string = "";
    imageLocation2: string = "";
    imageLocation3: string = "";
    averageRating: number = 0;
    powerlifting: number = 0;
    crossfit: number = 0;
    olympicLifting: number = 0;
    freeWeightsDumbbells: number = 0;
    freeWeightsBarsPlates: number = 0;
    resistanceMachines: number = 0;
    cardioMachines: number = 0;
    cafe: number = 0;
    vendingMachine: number = 0;
    twentyFourHour: number = 0;
    toilets: number = 0;
    changingRooms: number = 0;
    classesAvailable: number = 0;
    membersOnly: number = 0;
    noMembershipRequired: number = 0;
    sauna: number = 0;
    swimmingPool: number = 0;
    physio: number = 0;
    other: number = 0;
    locationCityName: string = "";
    locationCountryName: string = "";
    locationCityId: number = 0;
    locationCountryId: number = 0;
    locationLat: number = 0.0;
    locationLong: number = 0.0;
    ownerID: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    status: number = GymStatus.Pending;
    lockers: number = 0;
    strongman: number = 0;
    whatsapp: string = "";
    linkedin: string = "";
    googlePlus: string = "";
    snapchat: string = "";
    skype: string = "";
    youtube: string = "";
    featured: number = 0;
    
}

export class GymFinderBasic {
    id: number = 0;
    name: string = "";
    cityName: string = "";
    countryName: string = "";
    logo: string = "";
    allData: string = ""; //a combined string of name, city and country all together, needed for filter to work against in filter="contains" in <DropdownList>
}

export class CoachBasic {
    id: number = 0;
    name: string = "";
    cityName: string = "";
    countryName: string = "";
    pic: string = "";
    isVerified: number = 0;
    allData: string = ""; //a combined string of name, city and country all together, needed for filter to work against in filter="contains" in <DropdownList>
}

export enum GymStatus {
    Pending,
    Live,
    Any,
}

export enum ForumCategory {
    General
}
export enum ForumPostLevel {
    Base,
    Second,
    Third,
    Max
}
export enum PostStatus {
    Live,
    DeletedByUser,
    DeletedByModerator,
}

export enum UpvoteItems {
    GymReview,
    CoachReview,
    NewsFeedPost,
    NewsFeedComment
}

export enum FeaturedState {
    NotFeatured,
    Featured,
}

export enum UserStatus {
    Inactive,
    Active
}

export enum VerifiedSatus {
    NotVerified,
    Verfifed
}

export class GymSearch {
    page: number = 0;
    keywords: string = "";
    averageRating: number = 0;
    cityId: number = 0;
    powerlifting: number = 0;
    crossfit: number = 0;
    olympicLifting: number = 0;
    freeWeightsDumbbells: number = 0;
    freeWeightsBarsPlates: number = 0;
    resistanceMachines: number = 0;
    cardioMachines: number = 0;
    cafe: number = 0;
    vendingMachine: number = 0;
    twentyFourHour: number = 0;
    toilets: number = 0;
    changingRooms: number = 0;
    classesAvailable: number = 0;
    membersOnly: number = 0;
    noMembershipRequired: number = 0;
    sauna: number = 0;
    swimmingPool: number = 0;
    physio: number = 0;
    strongman: number = 0;
    lockers: number = 0;
    isAdmin: boolean = false;
    status: number = GymStatus.Any;
}

export class UserProfile{
    id: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    email: string = "";
    shopId: number = 0;
    username: string = "";
    cityId: number = 0;
    countryId: number = 0;
    isCoach: number = 0;
    isVerified: number = 0;
    firstName: string = "";
    lastName: string = "";
    bio: string = "";
    cityName: string = "";
    countryName: string = "";
    phone: string = "";
    facebook: string = "";
    twitter: string = "";
    youtube: string = "";
    instagram: string = "";
    coachBio: string = "";
    bodyBuilding: number = 0;
    powerlifting: number = 0;
    crossfit: number = 0;
    weightLifting: number = 0;
    strongManWoman: number = 0;
    calisthenics: number = 0;
    boxing: number = 0;
    kickboxing: number = 0;
    mma: number = 0;
    endurance: number = 0;
    gymnastics: number = 0;
    profilePic: string = "";
    averageRating: number = 0.0;
    coachBodybuilding: number = 0;
    coachClasses: number = 0;
    coachCrossfit: number = 0;
    coachDance: number = 0;
    coachMasseuse: number = 0;
    coachNutrition: number = 0;
    coachOlympicLifting: number = 0;
    coachOneOnOne: number = 0;
    coachOnlineAvailable: number = 0;
    coachOnlineOnly: number = 0;
    coachPhysio: number = 0;
    coachPowerlifting: number = 0;
    coachProgramOnly: number = 0;
    coachWeightLoss: number = 0;
    coachStrongman: number = 0;
    coachOther: number = 0;
    whatsapp: string = "";
    linkedin: string = "";
    googlePlus: string = "";
    snapchat: string = "";
    skype: string = "";
    website: string = "";
    featuredCoach: number = 0;

   
}

export class CoachSearch {
    page: number = 0;
    keywords: string = "";
    cityId: number = 0;
    averageRating: number = 0.0;
    isVerfied: number = 0;
    coachBodybuilding: number = 0;
    coachClasses: number = 0;
    coachCrossfit: number = 0;
    coachDance: number = 0;
    coachMasseuse: number = 0;
    coachNutrition: number = 0;
    coachOlympicLifting: number = 0;
    coachOneOnOne: number = 0;
    coachOnlineAvailable: number = 0;
    coachOnlineOnly: number = 0;
    coachPhysio: number = 0;
    coachPowerlifting: number = 0;
    coachProgramOnly: number = 0;
    coachWeightLoss: number = 0;
    coachStrongman: number = 0;
    coachOther: number = 0;
    isAdmin: boolean = false;
    status: number = UserStatus.Active;
}

export class NewsFeedPost {
    
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    id: number = 0;
    title: string = "";
    imageUrl: string = "";
    videoUrl: string = "";
    content: string = "";
    postDate: Date = new Date("1990-01-01");
    status: number = 0;
    upvotes: string = "";
}

export class NewsFeedComment {
    creationDate: Date = new Date("1990-01-01");
    id: number = 0;
    comment: string = "";
    authorId: number = 0;
    status: number = 0;
    postId: number = 0;
    upvotes: string = "";
}

export class NewsFeedCommentPublic {
    creationDate: Date = new Date("1990-01-01");
    id: number = 0;
    comment: string = "";
    authorId: number = 0;
    authorName: string = "";
    authorPic: string = "";
    status: number = 0;
    postId: number = 0;
    upvotes: string = "";
}

export class NewsFeedPostSingle {
    newsFeedPost: NewsFeedPost = new NewsFeedPost();
    comments: Array<NewsFeedCommentPublic> = []
    commentsCount: number = 0;
}

export class GymReview {
    id: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    gymId: number = 0;
    reviewerId: number = 0;
    rating: number = 7.0;
    title: string = "";
    mainReview: string = "";
    goodPoints: string = "";
    badPoints: string = "";
    upvotes: string = "";
}

export class GymReviewPublic {
    review: GymReview = new GymReview;
    reviewerName: string = "";
    reviewerPic: string = "";
    upvotes: string = "";
}

export class CoachReview {
    id: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    coachId: number = 0;
    reviewerId: number = 0;
    rating: number = 7.0;
    title: string = "";
    mainReview: string = "";
    goodPoints: string = "";
    badPoints: string = "";
    upvotes: string = "";
}

export class CoachReviewPublic {
    review: CoachReview = new CoachReview;
    reviewerName: string = "";
    reviewerPic: string = "";
    upvotes: string = "";
}

export class FeaturedGym {
    gymId: number = 0;
    gymName: string = "";
    imageUrl: string = ""; 
    location: string = "";
}

export class FeaturedCoach {
    coachId: number = 0;
    coachName: string = "";
    imageUrl: string = "";
    location: string = "";
}

export class ForumPostPublic {
    id: number = 0;
    creationDate: Date = new Date("1990-01-01");
    modifiedDate: Date = new Date("1990-01-01");
    authorId: number = 0;
    authorName: string = "";
    authorPic: string = "";
    category: number = 0;
    postLevel: number = 0;
    title: string = "";
    content: string = "";
    upvotes: string = "";
    parentId: number = 0;
    status: number = 0;

    childPosts: Array<ForumPostPublic> = [];
}

export class FullThread {
    posts: Array<ForumPostPublic> = [];
    replies: number = 0;
    upvotes: number = 0;
}