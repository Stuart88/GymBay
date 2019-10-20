import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Pages } from '../Helpers/Globals';
import { Footer } from './Widgets/Widgets';

import '../css/about.css';
import { Link } from 'react-router-dom';
import { HeaderSearchBarArea } from './Widgets/HeaderSearchArea';

export class About extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        let backGround = <div id="about-background">

        </div>

        return <div >

            <HeaderSearchBarArea Props={this.props} />

            {backGround}
            <div id="about-text-area" className="max-width">

                <div className="text-center">
                    <h1 >About Gym-Bay</h1>
                </div>

                <br />
                <br />
                <h3>Community</h3>
                <br />

                <p>
                    Gym-Bay.com is a community for all gym goers, worldwide, whatever your skill level or discipline,
                    where you can find anything you possibly need for your training - all in one place.
                <br />
                    <br />
                    Use the <Link to={Pages.gymfinder}>Gym Search</Link> or <Link to={Pages.coachfinder}>Coach Search</Link> to find a coach or a gym in your area, then filter by specifics to
                    match your needs or requirements. Or, search through the <Link to={Pages.gymshop}>Gym Shop</Link> (still in development) to find the
                    correct clothing and equipment required for your training.
                <br />
                    <br />
                    We encourage users to rate and review the gyms, coaches and equipment they buy. This will give
                    the wider community a much better idea of what is genuinely the best on offer to them.
                <br />
                    <br />
                    The greatest part of this project is that it is totally free. Free to sign up, free to review and even free
                    to advertise your gym, yourself or your products to every single other user.
                <br />
                    <br />
                    The gym users of the world need a community hub they can call on for anything. This is it.
                <br />
                    <br />
                </p>
                <hr />

                <h3>Gyms, Coaches & Sellers</h3>
                <br />

                <p>
                    We're reaching out to any gym owners, coaches, or shop owners and asking you to sign up and
                    advertise yourselves on this site. The bigger the community gets, the more users we get, the more
                    you can gain from being part of it.
                <br />
                    <br />
                    As above, this is a totally free project. The only time we will ever look at costs is if sellers want prime
                    placement. This would not affect user reviews. The reviews are what will make you really stand out,
                    and that is totally up to you.
                <br />
                    <br />
                    Reviews will be monitored for fakes and spam. We will also background check any gym, coach
                    and seller accounts to avoid fakes, as this will dilute the authenticity of the site.
                <br />
                    <br />
                </p>
                <hr />

                <h3>Everyone</h3>
                <br />

                <p>
                    Please, spread the word of this site. We have an extremely small team and rely on word of mouth to
                    gain popularity.
                     <br />
                    <br />
                    Remember - The more popular this site is, the more each member can gain from it.
            </p>

                <p className="text-center">
                    <br />
                    <br />
                    Thanks
                <br />
                    <br />
                    The <u>Gym-Bay.com</u> team
                    <br />
                </p>

            </div>

            <Footer />

        </div>
    }
}