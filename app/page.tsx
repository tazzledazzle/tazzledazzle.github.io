import HeroSection from "./components/HeroSection";
import FeaturedProjects from "./components/FeatureProjects";
import LatestPosts from "./components/LatestPosts";
import ContactCTA from "./components/ContactCTA";

export default function Home() {
    return (
        <div className="space-y-12">
            <HeroSection/>
            <FeaturedProjects/>
            <LatestPosts/>
            <ContactCTA/>
        </div>
    )
}