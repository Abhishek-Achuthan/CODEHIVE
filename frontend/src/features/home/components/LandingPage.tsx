import { useState } from 'react';
import Header from '../../../shared/ui/Header';
import Footer from '../../../shared/ui/Footer';
import CreateRoomModal from '../../room/components/CreateRoomModal';

import HeroSection from './HeroSection';
import FeatureHighlights from './FeatureHighlights';
import HowItWorks from './HowItWorks';
import RolePersona from './RolePersona';
import CollaborationShowcase from './CollaborationShowcase';
import PricingPreview from '../../subscription/components/PricingPreview';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
        <HeroSection onOpenModal={() => setIsModalOpen(true)} />
        <FeatureHighlights />
        <HowItWorks />
        <RolePersona />
        <CollaborationShowcase />
        <PricingPreview />
        <Testimonials />
        <FinalCTA />
      </div>
      <Footer />

      <CreateRoomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LandingPage;