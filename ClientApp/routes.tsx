import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home/Home';
import { MyGym } from './components/Dashboard/MyGym';
import { GymFinderSearch } from './components/GymFinder/SearchGyms';
import { Admin } from './components/Admin/Admin';
import { GymFinderGym, NewsFeedPost } from './data/serverModels';
import { Dashboard } from './components/Dashboard/LoginAndMenu';
import { About } from './components/About';
import { UserProfilePage } from './components/Dashboard/Profile';
import { Pages } from './Helpers/Globals';
import { NewsfeedPostEdit } from './components/NewsFeed/NewsfeedPostEdit';
import { CoachSearchPage } from './components/CoachFinder/SearchCoaches';
import { GymSinglePage } from './components/GymFinder/GymSinglePage';
import { Privacy } from './components/Privacy';
import { EditCoachReview } from './components/Reviews/EditCoachReview';
import { EditGymReview } from './components/Reviews/EditGymReview';
import { CoachSinglePage } from './components/CoachFinder/CoachSinglePage';
import { NewsItemSinglePage } from './components/NewsFeed/NewsItemSinglePage';
import { ForCoaches } from './components/CoachFinder/ForCoaches';

export const routes = <Layout>
    <Route exact path={Pages.home} component={Home} />
    <Route path={Pages.mygym} render={(props) => <MyGym Gym={new GymFinderGym} Props={props} />} />
    <Route path={Pages.gymfinder} component={GymFinderSearch} />
    <Route path={Pages.coachfinder} component={CoachSearchPage} />
    <Route path={Pages.admin} component={Admin} />
    <Route path={Pages.dashboard} component={Dashboard} />
    <Route path={Pages.about} component={About} />
    <Route path={Pages.privacy} component={Privacy} />
    <Route path={Pages.profile} component={UserProfilePage} />
    <Route path={Pages.viewgym + '/:gymID'} component={GymSinglePage} />
    <Route path={Pages.viewCoach + '/:coachID'} component={CoachSinglePage} />
    <Route path={Pages.newsfeedpost} render={(props) => <NewsfeedPostEdit Post={new NewsFeedPost} Props={props} />} />
    <Route path={Pages.gymreview} render={(props) => <EditGymReview Props={props} />} />
    <Route path={Pages.coachreview} render={(props) => <EditCoachReview Props={props} />} />
    <Route path={Pages.newsItem + '/:itemID'} component={NewsItemSinglePage} />
    <Route path={Pages.forcoaches} component={ForCoaches} />
</Layout>;