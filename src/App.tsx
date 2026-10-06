/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface Vessel {
  name: string;
  info: string;
  imageUrl: string;
}

interface CsrItem {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  fitMode?: 'cover' | 'contain';
}

const fleet: Vessel[] = [
  {
    name: 'Chapel',
    info: 'IMO: 9254070 | DWT: 47,015 | Build: 2003',
    imageUrl:
      'https://static.vesselfinder.net/ship-photo/9254070-220557000-209e5177ab569ad49e8b6e712baf95c4/1?v1',
  },
  {
    name: 'Montagu',
    info: 'IMO: 9289764 | DWT: 44,999 | Build: 2006',
    imageUrl:
      'https://static.vesselfinder.net/ship-photo/9289764-565152000-43705309b1046fa72de7abcb43581cbd/1?v1',
  },
  {
    name: 'MT Rathbone',
    info: 'IMO: 9341380 | DWT: 12,279 | Build: 2007',
    imageUrl: 'https://api.maritimeoptima.com/vesselpictures/9341380',
  },
];

const csrCards: CsrItem[] = [
  {
    id: 'sustainability',
    title: 'Sustainability',
    text: 'Tetra Maritime is striving to create a positive social impact in Nigeria by providing opportunities in the maritime sector.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_2142883efe0c43d39bf949a3ecd0c968~mv2.jpg/v1/fill/w_155,h_155,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/R_edited_edited.jpg',
    fitMode: 'cover',
  },
  {
    id: 'philanthropy',
    title: 'Philanthropy',
    text: 'We have donated hundreds of high-quality life jackets to the sector at the artisanal, state, and federal government levels.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_68bdcafa785c4fdcb027d1c612a440eb~mv2.png/v1/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/970_-_Charity-512_edited_edited_edited_p.png',
    fitMode: 'contain',
  },
  {
    id: 'development',
    title: 'Development',
    text: 'Tetra established strong relationships in the Nigerian maritime sector and continue to innovate ways to enhance the experience for Nigerian stakeholders.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_c12701d66a254e0bb00566c6300b5e3c~mv2.jpg/v1/fill/w_120,h_120,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/growth-vector-icon_edited_edited_edited_.jpg',
    fitMode: 'cover',
  },
  {
    id: 'social-impact',
    title: 'Social Impact',
    text: 'Our sister company, Goodwork Marine Services Nigeria Limited, exemplifies our commitment to the training, development, and employment of Nigerian seafarers.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_ab363e15da9443c78436b85af27e539a~mv2.png/v1/fill/w_140,h_140,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/why-us_edited_edited_edited_edited.png',
    fitMode: 'contain',
  },
  {
    id: 'fair-labour',
    title: 'Fair Labour Practices',
    text: 'Goodwork is the largest private crewing company in West Africa and currently has a total of 596 Nigerians in their pool of seafarers, 176 Nigerian officers of different cadres, 383 ratings, and 37 deck and engine cadets.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_a239505bcefb422e80f7085521c81471~mv2.jpg/v1/fill/w_120,h_120,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/OIP%20(1)_edited_edited_edited_edited.jpg',
    fitMode: 'cover',
  },
  {
    id: 'impact-investing',
    title: 'Impact Investing',
    text: 'We aim to double this number within the next five years and are confident that with the support of NIMASA, we will achieve this goal.',
    imageUrl:
      'https://static.wixstatic.com/media/883ec1_043c62c069c8438a9c0a8557c4ca6168~mv2.png/v1/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/R_edited_edited.png',
    fitMode: 'contain',
  },
];

export default function App() {
  const logoUrl =
    'https://static.wixstatic.com/media/883ec1_2ae664126f564a70ab2d62297f255f24~mv2.png/v1/fill/w_183,h_83,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tetra%20logo.png';
  const headerImageUrl =
    'https://static.wixstatic.com/media/883ec1_93381a277b97473eb69ad7f0839e6be0~mv2.jpg/v1/fill/w_980,h_1117,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/883ec1_93381a277b97473eb69ad7f0839e6be0~mv2.jpg';

  const [currentVesselIndex, setCurrentVesselIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'csr', label: 'CSR' },
    { id: 'contact', label: 'Contact' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Ignore scroll events during programmatic smooth scroll to avoid intermediate section flicker
      if (isManualScrollRef.current) {
        return;
      }

      const scrollPosition = window.scrollY + 140;

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const id = navLinks[i].id;
        if (id === 'about' && window.scrollY < 300) {
          setActiveSection('about');
          break;
        }
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // 1. Immediately change active indicator state so it starts animating at click time
    setActiveSection(sectionId);

    // 2. Lock scroll listener while the page animates so intermediate sections don't cause jitter
    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      isManualScrollRef.current = false;
    }, 1000);

    // 3. Smoothly animate the viewport to the target position
    if (sectionId === 'about') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', '#about');
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 8000);
    }, 600);
  };

  const prevVessel = () => {
    setCurrentVesselIndex((prev) => (prev === 0 ? fleet.length - 1 : prev - 1));
  };

  const nextVessel = () => {
    setCurrentVesselIndex((prev) => (prev === fleet.length - 1 ? 0 : prev + 1));
  };

  const currentVessel = fleet[currentVesselIndex];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="flex items-center cursor-pointer"
          >
            <img
              src={logoUrl}
              alt="TETRAMARITIME"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </a>
          <nav className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm uppercase tracking-wider font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`relative px-2.5 sm:px-3 py-1.5 font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-emerald-800'
                      : 'text-zinc-600 hover:text-emerald-800'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-700 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 35,
                        mass: 0.8,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile: Full Hero Image below navbar */}
      <div className="lg:hidden w-full relative overflow-hidden bg-zinc-100">
        <img
          src={headerImageUrl}
          alt="TETRAMARITIME vessel"
          className="w-full h-[52vh] sm:h-[65vh] object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <main id="about" className="max-w-6xl mx-auto px-6 py-12 md:py-20 scroll-mt-20">
        {/* Desktop View: Original Two-Column Hero Layout */}
        <div className="hidden lg:block">
          <section className="grid grid-cols-12 gap-16 items-center mb-24">
            {/* Visual Header Image */}
            <div className="col-span-6">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-emerald-100 via-transparent to-emerald-50 -z-10" />
                <div className="overflow-hidden rounded-xl border border-zinc-100 shadow-sm bg-zinc-50">
                  <img
                    src={headerImageUrl}
                    alt="TETRAMARITIME vessel"
                    className="w-full h-[540px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>
              </div>
            </div>

            {/* Intro Title & Text */}
            <div className="col-span-6 space-y-6">
              <h1 className="text-5xl xl:text-6xl font-light tracking-tight text-zinc-950 uppercase leading-[1.1]">
                TETRA<span className="font-semibold text-emerald-800">MARITIME</span>
              </h1>

              <div className="w-16 h-1 bg-emerald-600 rounded-full" />

              <p className="text-xl text-zinc-600 font-light leading-relaxed">
                Tetra Maritime is a leading Nigerian ship owner and operator, providing comprehensive and tailor-made solutions across the oil and gas supply chain, including upstream, midstream, and downstream.
              </p>
            </div>
          </section>

          {/* Desktop Story Continuation */}
          <section className="border-t border-zinc-100 pt-16 max-w-4xl mx-auto">
            <div className="space-y-8 text-zinc-700 text-lg leading-relaxed font-normal">
              <p>
                With a fleet of Nigerian-flagged vessels operating across the African continent, and a strategic partnership with Union Maritime, a UK-based ship owner with global acclaim, we are committed to delivering end-to-end logistics solutions to our clients.
              </p>

              <p>
                Established in 2007 as Beta Shipping, we have evolved to become a premier provider of marine logistics solutions in the Nigerian oil and gas sector, striving to meet and exceed client expectations through the implementation of best practices.
              </p>

              {/* Vision Highlight */}
              <div className="mt-12 p-10 border-l-2 border-emerald-600 bg-zinc-50/50">
                <p className="text-zinc-900 text-xl font-light leading-relaxed">
                  Our vision is to be the premier destination for all-in-one marine logistics solutions in the Nigerian oil and gas sector, delivering optimal returns to all stakeholders while remaining socially responsible.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Mobile View: Clean single-column layout below full hero image */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 uppercase leading-[1.1]">
              TETRA<span className="font-semibold text-emerald-800">MARITIME</span>
            </h1>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mt-5" />
          </div>

          <div className="space-y-8 text-zinc-700 text-base sm:text-lg leading-relaxed font-normal">
            <p className="text-zinc-900 font-medium text-lg leading-relaxed">
              Tetra Maritime is a leading Nigerian ship owner and operator, providing comprehensive and tailor-made solutions across the oil and gas supply chain, including upstream, midstream, and downstream.
            </p>

            <p>
              With a fleet of Nigerian-flagged vessels operating across the African continent, and a strategic partnership with Union Maritime, a UK-based ship owner with global acclaim, we are committed to delivering end-to-end logistics solutions to our clients.
            </p>

            <p>
              Established in 2007 as Beta Shipping, we have evolved to become a premier provider of marine logistics solutions in the Nigerian oil and gas sector, striving to meet and exceed client expectations through the implementation of best practices.
            </p>

            {/* Vision Highlight */}
            <div className="mt-10 p-7 border-l-2 border-emerald-600 bg-zinc-50/50">
              <p className="text-zinc-900 text-base sm:text-lg font-light leading-relaxed">
                Our vision is to be the premier destination for all-in-one marine logistics solutions in the Nigerian oil and gas sector, delivering optimal returns to all stakeholders while remaining socially responsible.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* The Fleet Header */}
      <section id="fleet" className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-8 md:pb-12 scroll-mt-20">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 uppercase leading-[1.1]">
          THE <span className="font-semibold text-emerald-800">FLEET</span>
        </h2>
        <div className="w-16 h-1 bg-emerald-600 rounded-full mt-4" />
      </section>

      {/* Fleet Showcase Section (Exact Design from screenshots) */}
      <section className="w-full bg-[#0e8c4e] text-white py-14 md:py-20 relative overflow-hidden select-none">
        <div className="max-w-6xl mx-auto px-10 md:px-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVessel.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
            >
              {/* Left Column: Vessel Info */}
              <div className="md:col-span-5 text-center md:text-left space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
                  {currentVessel.name}
                </h3>
                <p className="text-sm sm:text-base text-white/95 font-light tracking-wide">
                  {currentVessel.info}
                </p>
              </div>

              {/* Right Column: Vessel Image */}
              <div className="md:col-span-7 flex justify-center md:justify-end">
                <div className="overflow-hidden bg-black/10 shadow-2xl max-w-lg w-full">
                  <img
                    src={currentVessel.imageUrl}
                    alt={currentVessel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-64 sm:h-72 md:h-80 object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Previous Arrow */}
          <button
            onClick={prevVessel}
            aria-label="Previous vessel"
            className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextVessel}
            aria-label="Next vessel"
            className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-3 mt-10 md:mt-12">
            {fleet.map((vessel, index) => (
              <button
                key={vessel.name}
                onClick={() => setCurrentVesselIndex(index)}
                aria-label={`Go to ${vessel.name}`}
                className={`transition-all cursor-pointer rounded-full ${
                  currentVesselIndex === index
                    ? 'w-2.5 h-2.5 bg-white ring-2 ring-white/50'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Write-up */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-light leading-relaxed">
          Tetra Maritime now has seven international-quality vessels under the Nigerian flag. Further strengthening our commitment to the sustainable development of the Nigerian maritime sector.
        </p>
      </section>

      {/* Corporate Social Responsibility Section */}
      <section id="csr" className="border-t border-zinc-100 bg-zinc-50/50 scroll-mt-20">
        {/* CSR Header */}
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-6 md:pb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 uppercase leading-[1.1]">
            CORPORATE SOCIAL <span className="font-semibold text-emerald-800">RESPONSIBILITY</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-600 rounded-full mt-4" />
        </div>

        {/* CSR Body Text */}
        <div className="max-w-4xl mx-auto px-6 pb-12 md:pb-16">
          <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-light leading-relaxed">
            Tetra Maritime is dedicated to the sustainable development of the Nigerian maritime sector, as evident in our contributions to the artisanal boating industry and the regulatory bodies in Lagos State, Nigeria.
          </p>
        </div>

        {/* CSR 6 Circular Info Cards */}
        <div className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {csrCards.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl p-8 border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Subtle top emerald bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Circular Image Container */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white border-2 border-zinc-200/90 shadow-sm flex items-center justify-center p-2.5 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-600 group-hover:shadow-md ring-4 ring-emerald-50/60">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full rounded-full transition-transform duration-300 ${
                        card.fitMode === 'cover' ? 'object-cover' : 'object-contain p-1'
                      }`}
                    />
                  </div>
                </div>

                {/* Small Header */}
                <h3 className="text-xl sm:text-2xl font-medium text-zinc-900 tracking-tight mb-3 group-hover:text-emerald-800 transition-colors">
                  {card.title}
                </h3>

                {/* Decorative Accent Divider */}
                <div className="w-8 h-0.5 bg-emerald-600/40 rounded-full mb-4 group-hover:w-12 group-hover:bg-emerald-600 transition-all duration-300" />

                {/* Detailed Text */}
                <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-zinc-100 bg-white scroll-mt-20">
        {/* Contact Header */}
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-6 md:pb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 uppercase leading-[1.1]">
            GET IN <span className="font-semibold text-emerald-800">TOUCH</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-600 rounded-full mt-4" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
          {/* Contact Details & Send Message Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 md:mb-20">
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-base sm:text-lg text-zinc-600 font-light leading-relaxed">
                Reach out to our operations desk for vessel inquiries, commercial partnerships, or general questions.
              </p>

              <div className="space-y-4 pt-1">
                {/* Office Address */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 hover:border-emerald-600/30 hover:bg-white transition-all shadow-xs">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">
                      Office Address
                    </h4>
                    <p className="text-zinc-900 font-medium text-sm sm:text-base leading-snug">
                      25B Marine Rd, Apapa, 102272, Lagos, Nigeria
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=25B+Marine+Rd,+Apapa,+102272,+Lagos,+Nigeria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium mt-2.5 hover:underline"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 hover:border-emerald-600/30 hover:bg-white transition-all shadow-xs">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">
                      Phone Number
                    </h4>
                    <a
                      href="tel:+2347042806141"
                      className="text-zinc-900 font-medium hover:text-emerald-800 transition-colors text-base"
                    >
                      +234 704 280 6141
                    </a>
                    <p className="text-xs text-zinc-500 mt-1">Direct Operations Line</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 hover:border-emerald-600/30 hover:bg-white transition-all shadow-xs">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">
                      Email Address
                    </h4>
                    <a
                      href="mailto:operations@tetramaritime.com"
                      className="text-zinc-900 font-medium hover:text-emerald-800 transition-colors text-sm sm:text-base break-all"
                    >
                      operations@tetramaritime.com
                    </a>
                    <p className="text-xs text-zinc-500 mt-1">Commercial & Vessel Management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: User Details Message Form */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-50/70 border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-medium text-zinc-900 tracking-tight">
                    Send Us a Message
                  </h3>
                  <p className="text-sm text-zinc-600 font-light mt-1">
                    Fill out the form below and our team will get back to you promptly.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-medium text-emerald-900">Message Sent Successfully</h4>
                    <p className="text-sm text-emerald-800/90 font-light max-w-md mx-auto">
                      Thank you for contacting Tetra Maritime. Our operations desk has received your inquiry and will be in touch shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline pt-2 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                          Full Name <span className="text-emerald-700">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                          Email Address <span className="text-emerald-700">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+234..."
                          className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                          Subject / Inquiry
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="General Inquiry, Fleet, Logistics"
                          className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Your Message <span className="text-emerald-700">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#0e8c4e] hover:bg-[#0c7843] text-white text-sm font-medium tracking-wide uppercase rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Below all that: Google Map View & Link to Address */}
          <div className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-light text-zinc-950 uppercase tracking-tight">
                  OFFICE <span className="font-semibold text-emerald-800">LOCATION</span>
                </h3>
                <p className="text-sm text-zinc-600 font-light mt-0.5">
                  25B Marine Rd, Apapa, 102272, Lagos, Nigeria
                </p>
              </div>

              {/* Direct Link to Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=25B+Marine+Rd,+Apapa,+102272,+Lagos,+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium transition-colors self-start sm:self-auto shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Google Map View Embed */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100">
              <iframe
                title="Tetra Maritime Office Location - 25B Marine Rd, Apapa, Lagos"
                src="https://maps.google.com/maps?q=25B+Marine+Rd,+Apapa,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="cursor-pointer"
          >
            <img
              src={logoUrl}
              alt="TETRAMARITIME"
              className="h-8 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-5 sm:gap-6 text-xs text-zinc-500 uppercase tracking-wider font-medium">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-xs text-zinc-400 uppercase tracking-widest">
            © {new Date().getFullYear()} TETRAMARITIME
          </div>
        </div>
      </footer>
    </div>
  );
}
