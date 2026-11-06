import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight, Award, CalendarDays, Check, ChevronDown, ChevronLeft, CircleUserRound, Compass,
  Facebook, HeartHandshake, Instagram, Mail, MapPin, Menu, MessageCircle, Minus, Mountain,
  Palette, Plus, Quote, Send, ShieldCheck, Sparkles, Users, Utensils, X
} from 'lucide-react';

type Page = 'home' | 'heritage' | 'planner';
type Go = (page: Page, sectionId?: string) => void;
type Experience = { title: string; tag: string; image: string; text: string };

/* ------------------------------------------------------------------
   SITE SETTINGS: edit these in one place
------------------------------------------------------------------- */
const WHATSAPP_NUMBER = '233249134165';
const WHATSAPP_DISPLAY = '+233 24 913 4165';
const CONTACT_EMAIL = 'charlesadusarkodie@gmail.com';

// Paste your Formspree (or Web3Forms) endpoint here, e.g. 'https://formspree.io/f/xxxxxxx'
// Leave empty and the form will open WhatsApp with the enquiry pre-filled instead.
const FORM_ENDPOINT = '';

// Add your real profile links. Icons only show when a link is set.
const SOCIALS = {
  instagram: 'https://www.instagram.com/trooptribetours/',
  facebook: 'https://www.facebook.com/groups/612329983371741'
};

const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

// Logo is embedded so it always loads (no file path needed).
const LOGO = 'data:image/png;base64,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';

const images = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5mNxkwqV4KvU7mZjW4L6w7-wnQ0IV6pX6oepxnPW__DjBrILN9fb9nHyNQDxPRSQK1vAIhoQlGA2SjkJwBzTf_Hl3GLuYWKs6efPIOfLyJU0rH0PiVHQ1z0BQ1_GRHQtlx-LXc6Vqwn-ysjcAWn3QQoja7fbWJfq6Xe8D1BKKUMWOpS37UmeZTgvv2dnDMXCtFOeYMJGM7HWBY-OVUjz4GYq7k3hwyHwiitfwi1zU',
  heritage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCxmoA5dPwGO6AuoKEGbiVpbGNs7Go8BclE6ivL4ED-xzrn39ibfjq0HgfVzcsf-eIlTDo_MxMBDosi2iGw0zoYg5jB9nWi4ghXHPq5GY6fbstq4rpprrpdFuuezs3Pp-bdn_UHlsFhEFPXd6LpGlQaJ7mxRldIlfZO2CeGoFoYbovgboBZ17tdhxUOfmZBxdChVe8TO-hbRSNTR7wKX-VxVS3dJIdyZl5O8S9y3To',
  nature: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-TagfPChCxWe4bzMw_EDenDnyDLAI6hJeL58QGCPIYtLvmdqulSyawRvsg-31diTSHDiGzT1dvI8NXT2cCOQIOm4B0Ftd0opGVbT9IVb4IOqUDXauM2Cn2dirSuw_vt8d6Z3PSPAiJbpR2H01UtWWo0wJWkoWUyKbti7rnX4L_zvpuX16QJX8GMgaQ4JdJhgfBGxsJVpL7kbs3CwqE3fl5Eh8FaK5CouT_KozYif9',
  food: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuxkC4UGt8Be7uPF-470Jw5tCsrCNQHRELIAvYNewY_ar-uqQamOudFAiHod5PfYPn1aOskTOX18T8m9Dmn5BjI452Bsrudw9Yh5_SQCBAwUSa9xb4Ql8UyN38L5ZoN0X5h98aUSNdYX3aTU6Dn72QmCnb0oTOrbyEYc1RmGEhTfioYsm0zy-brQhkMoL_25sEXg32xkgFYkkPWV4Y_i9FFuukdSkuX4fY6Imdp7PF',
  custom: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAncslo1VBDwVo8mlxI7xwXM6WF8a9_DJhoRgF4UzzOyYSRDOZJlIyAWbF3s3Xr5AfL8XnoF9ZLkrluFLGjUSmUkq5h9YZe0qACLhpEMY8ys3ywBP-1KbyCM5h1TlSLt0rqNhcpR46eOAfK3b1OD5BUptCL-ymY1ISGqg12DeOwBJSI9t7X9WQadGt8q6fUIDRQiqBsgofwFcOHkgkwQkr7-LW8jdZ65Wi-MfPwhyd6',
  castle: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuyazF7AH_L5v_7oy5CuWhl_sCwH9zp7xGJezVVONPgxNhp6HPxGhADop6LcoXyPdagrq8NnCw3DrYNaepHXvrEKVC65EiGkQtlRAsrBTvfpTtCW9fPID8yVO3MbUB3B-X-cTG_irElbB2UjxqU6Y9Rj6NjO6t6J9j2ZluNo7OG5BnyhPe9ijE9ClEAFzwjuCSBmAyhAxeqaxzaYZXj8uRatwhRJ6y3ip7KCFL-DV8',
  elmina: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6d2Zu4edtdHmCdhetBY9NxMVEEEJSSXmavP0cnY0NXg69VedKRWrd1ByhFHKi6j5pcPComPHCq6xiFzKy_tmrwq5GvbGAZOuhkfUF7QtjmmYOVj556AvbBAQHRx7_tToP0_akJ-pnZLWlRhmWhqMj-a91WHUf4gJV93bVE8J_WhvwfCazlEC4eNkfXTWHTWN0URthIgFwzASpnDaF8MXtySuPFnonpDfo0kQjmCx4',
  kakum: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNPS-DZI--hE67cmF-wqMzraXAI3ebxPqo0Y4nLJxEOxLKE_KAug7GcxDOF5W6Ua26GW-nPNM1t-7rvEIrN8CBQaea42SlHoN3oN7UirtCT1fbbyXt4pFCgVHpVkb5oRGk1qNI18UuMvtDfwS9vzynzQd8oE9HEmRKMVcr9cWhCp1S-hc--coPspox5SoXt2sxRYqKWNuWuq3xamc4DnI5ffr01-UJUjJOcN9umozn',
  kente: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL8J3mpFhr8bVciur_d-0Yb4t6uRKSKcY07quKOG17kLcP_SH8ilyxbPRFqjMvTo5MvLn4dBIDVD5G4VAGBSe42B5OJew54YSFYmHEqLDKOtd8AlYE-wwSHPA4KLlmqE12Y6ZjzrEw1J0Iefawgfq8VBdXoAdnFWVtdJSQu153HMTFZV59if2AryYPJbUbETdAVdOc5Ir2Lr7WG71_6YDTb8swlGjwPCT7OSd1QVNf'
};

const experiences: Experience[] = [
  { title: 'Heritage & History', tag: 'Cultural Roots', image: images.heritage, text: "Explore Ghana's deep roots, ancestral castles, and regal Ashanti customs across Cape Coast, Elmina, and Kumasi." },
  { title: 'Nature & Adventure', tag: 'Eco & Adventure', image: images.nature, text: 'Rainforest canopy walks at Kakum, cascading Wli waterfalls, scenic Volta Lake retreats, and coastal hiking trails.' },
  { title: 'Food & Culture', tag: 'Living Traditions', image: images.food, text: 'Authentic flavors of jollof and waakye, vibrant Makola textile visits, cutting-edge art galleries, and live highlife music.' },
  { title: 'Your Ghana, Your Way', tag: 'Tailor-Made', image: images.custom, text: 'Bespoke journeys built around your personal vision, milestone celebration, or diaspora homecoming schedule.' }
];

function IconLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <span className="icon-label">{icon}{children}</span>;
}

/* ------------------------------------------------------------------
   HEADER (with working mobile drawer)
------------------------------------------------------------------- */
function Header({ page, go, menuOpen, setMenuOpen }: { page: Page; go: Go; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return <>
    <header className="site-header">
      <div className="nav-wrap">
        <button className="brand" aria-label="TroopTribe home" onClick={() => go('home')}><img className="brand-logo" src={LOGO} alt="TroopTribe – Explore Ghana" width={421} height={93} /></button>
        <nav className="desktop-nav" aria-label="Main">
          <button className={page === 'home' ? 'active' : ''} onClick={() => go('home')}>Home</button>
          <button className={page === 'heritage' ? 'active' : ''} onClick={() => go('heritage')}>Experiences</button>
          <button onClick={() => go('home', 'why-us')}>Why Us</button>
          <button onClick={() => go('home', 'faqs')}>FAQs</button>
          <button onClick={() => go(page, 'contact')}>Contact</button>
        </nav>
        <div className="nav-actions">
          <a className="whatsapp-link" href={waLink()} {...EXTERNAL}><MessageCircle size={15} /> Chat on WhatsApp</a>
          <button className="button button-primary compact" onClick={() => go('planner')}>Plan Your Trip</button>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-drawer" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
    {menuOpen && <nav id="mobile-drawer" className="mobile-drawer" aria-label="Mobile">
      <button className="drawer-link" onClick={() => go('home')}>Home</button>
      <button className="drawer-link" onClick={() => go('heritage')}>Experiences</button>
      <button className="drawer-link" onClick={() => go('home', 'why-us')}>Why Us</button>
      <button className="drawer-link" onClick={() => go('home', 'faqs')}>FAQs</button>
      <button className="drawer-link" onClick={() => go(page, 'contact')}>Contact</button>
      <div className="drawer-actions">
        <button className="button button-primary" onClick={() => go('planner')}>Plan Your Trip <ArrowRight size={16} /></button>
        <a className="button button-green" href={waLink()} {...EXTERNAL}><MessageCircle size={16} /> Chat on WhatsApp</a>
      </div>
    </nav>}
  </>;
}

/* ------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------- */
function Footer({ go }: { go: Go }) {
  return <footer id="contact" className="footer">
    <div className="footer-grid">
      <div>
        <button className="footer-brand" aria-label="TroopTribe home" onClick={() => go('home')}><img className="brand-logo" src={LOGO} alt="TroopTribe – Explore Ghana" width={421} height={93} /></button>
        <p>Personalised Ghana travel and experiences crafted for curious global explorers, diaspora returnees, and discerning travelers seeking cultural grounding and modern African warmth.</p>
        <div className="socials">
          {SOCIALS.instagram && <a href={SOCIALS.instagram} aria-label="Instagram" {...EXTERNAL}><Instagram size={18} /></a>}
          {SOCIALS.facebook && <a href={SOCIALS.facebook} aria-label="Facebook" {...EXTERNAL}><Facebook size={18} /></a>}
          <a href={waLink()} aria-label="WhatsApp" {...EXTERNAL}><MessageCircle size={18} /></a>
        </div>
      </div>
      <div>
        <h4>Curated Journeys</h4>
        <button className="footer-link" onClick={() => go('home')}>Home Overview</button>
        <button className="footer-link" onClick={() => go('heritage')}>Tailored Experiences</button>
        <button className="footer-link" onClick={() => go('home', 'why-us')}>Our Philosophy & Story</button>
        <button className="footer-link" onClick={() => go('home', 'faqs')}>Travel Advisory & FAQs</button>
        <button className="footer-link" onClick={() => go('planner')}>Custom Expedition Enquiry</button>
      </div>
      <div>
        <h4>Accra Concierge Desk</h4>
        <p><MapPin size={14} /> Based in Accra, Greater Accra, Ghana</p>
        <p><Mail size={14} /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        <p><MessageCircle size={14} /> <a href={waLink()} {...EXTERNAL}>{WHATSAPP_DISPLAY} (WhatsApp Hotline)</a></p>
        <div className="footer-note"><strong>Private & Diaspora Reassurance</strong><br />Your information remains confidential. Every booking is accompanied by accredited on-ground Ghanaian logistics.</div>
      </div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} TroopTribe Tours Limited. Crafted with genuine Ghanaian hospitality.</span><span>Privacy Policy &nbsp;&nbsp; Terms of Exploration &nbsp;&nbsp; Contact</span></div>
  </footer>;
}

/* ------------------------------------------------------------------
   HOME
------------------------------------------------------------------- */
function Home({ go }: { go: Go }) {
  return <>
    <section className="hero" style={{ backgroundImage: `url(${images.hero})` }}><div className="hero-inner"><span className="eyebrow eyebrow-light"><span className="pulse-dot" /> Locally planned. Personally experienced.</span><h1>Discover Ghana.<br /><em>Your Way.</em></h1><p>From meaningful cultural journeys to unforgettable adventures, we curate personalised Ghana experiences across Accra, Cape Coast, and beyond — taking meticulous care of every detail.</p><div className="hero-actions"><button className="button button-primary" onClick={() => go('planner')}>Plan My Trip <ArrowRight size={17} /></button><button className="button button-glass" onClick={() => go('home', 'experiences')}>Explore Experiences <ArrowRight size={17} /></button></div><div className="trust-strip"><IconLabel icon={<Compass size={15} />}>Bespoke Custom Itineraries</IconLabel><IconLabel icon={<Users size={15} />}>Solo Seekers to 60+ Heritage Groups</IconLabel><IconLabel icon={<ShieldCheck size={15} />}>Accredited On-the-Ground Coordination</IconLabel></div></div></section>
    <section id="experiences" className="section"><div className="section-heading split"><div><span className="eyebrow">Curated Pathways</span><h2>What Would You Love to Experience?</h2></div><p>Crafted around your curiosity, pace, and travel style. These are experience categories, not rigid fixed packages.</p></div><div className="experience-grid">{experiences.map((item) => {
      const isHeritage = item.title === 'Heritage & History';
      return <article className="experience-card" key={item.title} onClick={() => { if (isHeritage) go('heritage'); }}><div className="card-image" style={{ backgroundImage: `linear-gradient(0deg, rgba(11,46,22,.78), transparent 65%), url(${item.image})` }}><span className="tag">{item.tag}</span></div><div className="card-content"><div><h3>{item.title}</h3><p>{item.text}</p></div><button onClick={(event) => { event.stopPropagation(); go(isHeritage ? 'heritage' : 'planner'); }}>{isHeritage ? 'Explore Experience' : 'Enquire About This'} <ArrowRight size={15} /></button></div></article>;
    })}</div></section>
    <section id="why-us" className="section section-muted"><div className="center-heading"><span className="eyebrow">The TroopTribe Standard</span><h2>More Exploring. Less Planning.</h2><p>You enjoy the heartbeat of Ghana. We quietly take care of every detail.</p></div><div className="pillar-grid"><Pillar icon={<Palette />} title="Personalised Itineraries">No cookie-cutter tour buses. Every itinerary is individually calibrated around your preferred rhythm, dates, comfort level, and cultural interests.</Pillar><Pillar icon={<Compass />} title="Local Knowledge & Warmth">Discover Ghana through trusted local insiders who know the unwritten courtesies, peaceful coastal hideaways, and culinary gems.</Pillar><Pillar icon={<ShieldCheck />} title="Hassle-Free Coordination">From seamless airport greetings and private drivers to hand-selected boutique lodges and museum passes, travel with complete peace of mind.</Pillar></div><div className="impact-bar"><HeartHandshake size={22} /><span><strong>Direct Community Impact:</strong> Our tours empower independent local storytellers, artisan co-ops, and small Ghanaian family businesses.</span><button onClick={() => go(  'home', 'contact')}>Get in Touch →</button></div></section>
    <HowItWorks go={go} /><Testimonials /><section className="section final-cta"><div className="cta-panel"><span className="eyebrow eyebrow-light">Begin Your Journey</span><h2>Your Ghana Story Starts Here.</h2><p>Whether it’s a family reunion, a solo adventure, or an intimate cultural getaway — tell us what you have in mind and let our local team handle the details.</p><div className="hero-actions"><button className="button button-primary" onClick={() => go('planner')}>Start Planning <CalendarDays size={16} /></button><a className="button button-green" href={waLink()} {...EXTERNAL}><MessageCircle size={16} /> Chat on WhatsApp</a></div></div></section>
  </>;
}

function Pillar({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) { return <article className="pillar"><div className="pillar-icon">{icon}</div><h3>{title}</h3><p>{children}</p></article>; }
function HowItWorks({ go }: { go: Go }) { return <section className="section"><div className="section-heading"><span className="eyebrow">Seamless Planning</span><h2>How Your Journey Takes Shape</h2></div><div className="steps"><article><b>01</b><h3>Tell Us Your Plans</h3><p>Share your travel window, party size, must-see landmarks, and pacing preferences.</p><small>Takes less than 3 minutes</small></article><article><b>02</b><h3>We Design Your Experience</h3><p>Our Accra travel designers build a bespoke day-by-day itinerary proposal with transparent options.</p><small>Iterate until it feels perfect</small></article><article><b>03</b><h3>Explore Ghana With Ease</h3><p>Step off the aircraft knowing private drivers, certified guides, and concierge assistance are arranged.</p><small>Akwaaba — You are home</small></article></div><div className="center-action"><button className="button button-dark" onClick={() => go('planner')}>Start Your Custom Itinerary <ArrowRight size={16} /></button></div></section>; }
function Testimonials() { return <section className="section section-muted" id="faqs"><div className="section-heading split"><div><span className="eyebrow">Unfiltered Perspectives</span><h2>Stories From Our Travelers</h2></div><p>Honest reflections from diaspora returnees, curious first-timers, and private family expeditions.</p></div><div className="testimonial-grid">{['Bringing three generations of our family home to Ghana felt daunting. TroopTribe handled the multi-city logistics with grace, dignity, and unbelievable patience.', 'As a solo female traveler visiting West Africa for the first time, safety and cultural immersion were my top priorities. My guide felt like trusted family within two hours.', 'We brought a group of 14 designers and artists to experience Kente weaving in Bonwire and contemporary galleries in Jamestown. The pacing was thoughtful.'].map((quote, i) => <article className="testimonial" key={quote}><IconLabel icon={<Quote size={17} />}>{['Family Heritage Journey', 'Solo Exploration', 'Cultural Group Expedition'][i]}</IconLabel><blockquote>“{quote}”</blockquote><div className="testimonial-author"><strong>{['Marcus & Elena O.', 'Maya S.', 'Devon T. & Collective'][i]}</strong><span>{['London, UK • 8-Day Private Tour', 'Toronto, Canada • 10-Day Solo Route', 'Atlanta, USA • Cultural Arts Group'][i]}</span></div></article>)}</div></section>; }

/* ------------------------------------------------------------------
   HERITAGE
------------------------------------------------------------------- */
function Heritage({ go }: { go: Go }) {
  const highlights = [
    { title: 'Cape Coast Castle & The Door of Return', image: images.castle, text: 'An emotional, deeply grounding walk guided by specialist resident docents through the castle, dungeons, and ancestral shrine.' },
    { title: "Elmina Castle & St. George's Fortress", image: images.elmina, text: "Discover centuries of layered history, followed by an intimate walking tour through Elmina's vibrant fishing harbor." },
    { title: 'Kakum Rainforest Canopy Walkway', image: images.kakum, text: 'Suspended 40 meters above virgin tropical forest across 350 meters of bridges, balanced with reflective historical immersion.' },
    { title: 'Ashanti Kingdom & Manhyia Palace', image: images.kente, text: 'Inspect royal regalia, learn court protocol, and try hands-on Adinkra stamping and Kente weaving in Kumasi.' }
  ];
  return <>
    <div className="breadcrumbs">Home / Experiences / <strong>Heritage & History</strong><button onClick={() => go('home')}><ChevronLeft size={15} /> Back to All Experiences</button></div>
    <section className="detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(11,46,22,.96), rgba(11,46,22,.7)), url(${images.castle})` }}><div><span className="eyebrow eyebrow-light">Heritage, Ancestry & Culture • Central & Greater Accra</span><h1>Heritage & History</h1><p>Walk through pivotal centuries of Ghanaian history, connect with ancestral roots, and experience vibrant living traditions across coastal fortresses and sacred royal kingdoms.</p><div className="detail-trust"><IconLabel icon={<Award size={14} />}>UNESCO World Heritage Sites</IconLabel><IconLabel icon={<Users size={14} />}>Diaspora Ancestral Connections</IconLabel><IconLabel icon={<Compass size={14} />}>Bespoke Pacing</IconLabel></div></div></section>
    <div className="detail-layout">
      <div className="detail-main">
        <span className="eyebrow">Narrative & Cultural Immersion</span>
        <h2>A Journey of Reverence, Memory & Enduring Dignity</h2>
        <p>Ghana stands at the epicentre of the trans-Atlantic diaspora journey. Our Heritage & History expeditions approach these sacred geographies with mindful reverence, historic accuracy, and emotional sanctuary.</p>
        <p>Under the accompaniment of certified Ghanaian historians and elder storytellers, explore UNESCO-inscribed fortresses, discover traditional chieftaincy protocol, and witness enduring craft practices.</p>
        <div className="notice"><Sparkles size={20} /><div><strong>Theme-Based Framework, Bespoke Itinerary</strong><p>This is an experience theme, not a rigid boxed tour. Durations, overnight stays, transit types, and pacing are personalized to your preferences.</p></div></div>
        <div className="subheading"><span className="eyebrow">Curated Pillar Highlights</span><h2>Pivotal Historical Encounters</h2></div>
        <div className="highlight-grid">{highlights.map((item) => <article className="highlight-card" key={item.title}><img src={item.image} alt={item.title} loading="lazy" /><div><span className="mini-tag">Ghana</span><h3>{item.title}</h3><p>{item.text}</p><IconLabel icon={<Check size={14} />}>Private historical accompaniment</IconLabel></div></article>)}</div>
        <div className="included"><span className="eyebrow">The TroopTribe Standard</span><h2>What Every Curated Heritage Trip Includes</h2><div className="included-cols"><div><h3><Check size={17} /> Inclusions & Accompaniment</h3>{['Accredited historian and native English/local dialect docents', 'Private, climate-controlled premium SUV or executive van', 'Traditional diaspora naming ceremonies upon request', 'Curated farm-to-table lunch stops and fresh coconuts', 'All site conservation fees and permits'].map(item => <p key={item}><Check size={14} />{item}</p>)}</div><div><h3><Users size={17} /> Ideal Travelers & Group Dynamics</h3><div className="soft-list"><p><strong>Suitable For</strong><br />Diaspora returnees, multigenerational families, universities, and first-timers</p><p><strong>Party Size Options</strong><br />Solo journeys, private couples, or groups up to 60 explorers</p><p><strong>Physical Pacing</strong><br />Gentle walking pace with shaded rest breaks</p></div></div></div></div>
        <div className="green-callout"><div><span className="eyebrow eyebrow-light">Meaningful Connection</span><h3>Traditional Akan Naming Ceremony</h3><p>For diaspora explorers desiring deeper ancestral communion, our team coordinates authentic naming ceremonies in accordance with Akan customary traditions.</p></div><button className="button button-primary" onClick={() => go('planner')}>Request Ceremony</button></div>
      </div>
      <aside className="detail-aside"><div className="conversion"><span className="eyebrow">Start Designing</span><h3>Love This Experience?</h3><p>Every detail is shaped around your dates, desired depth of immersion, and travel style.</p><div className="chips"><span>Coastal Castles</span><span>Rainforest Walk</span><span>Ashanti Craft</span><span>Ancestral Roots</span></div><button className="button button-primary full" onClick={() => go('planner')}>Add to My Trip Interests</button><button className="button button-dark full" onClick={() => go('planner')}>Request Custom Itinerary</button><a className="button button-soft full" href={waLink()} {...EXTERNAL}><MessageCircle size={16} /> WhatsApp Our Concierge</a><div className="aside-note"><ShieldCheck size={17} /><strong>No Upfront Booking Obligation</strong><p>We design and refine your proposal first. Secure payments are only handled after you approve the final routing.</p></div><div className="concierge"><CircleUserRound size={26} /><span><strong>Kwame & The TroopTribe Desk</strong><small>Typical response within 2 hours</small></span></div></div><div className="paired"><span className="eyebrow">Frequently Paired With</span><p><Utensils size={18} /> Culinary & Market Tastings</p><p><Compass size={18} /> Coastal Drift & Escapes</p></div></aside>
    </div>
  </>;
}

/* ------------------------------------------------------------------
   PLANNER (enquiry form, now fully wired)
------------------------------------------------------------------- */
const DURATIONS = ['3–5 Days', '1 Week', '10–14 Days', '2+ Weeks', 'Custom'];
const DYNAMICS = ['Couple / Duo', 'Solo Journey', 'Family', 'Friends Squad', 'Diaspora / Homecoming'];
const INTERESTS = ['Culture & Heritage', 'Nature & Adventure', 'Food & Local Life', 'Relaxation & Beaches', 'Family-Friendly', 'Nightlife & Arts'];
const CHANNELS = ['WhatsApp', 'Email', 'Phone Call'];
const ACCOMMODATION = ['Recommend & book boutique hotels', 'Recommend vetted options only', 'I already arranged lodging'];
const CHAUFFEUR = ['Private chauffeur & VIP airport pickup', 'Airport pickup only', 'Not needed', 'Not sure yet'];
const BUDGET = ['Let’s discuss', 'Comfortable mid-range', 'Premium', 'Luxury'];
const PLANNER_FAQS = [
  { q: 'How far in advance should we plan?', a: 'For peak periods like December, we recommend reaching out 3 to 6 months ahead. Shorter notice can still work, so send your enquiry and we will tell you what is possible.' },
  { q: 'Can you accommodate solo travelers or large groups?', a: 'Yes. We plan private journeys for solo travelers, couples, families, and groups of up to 60.' },
  { q: 'Do you arrange airport pickups and hotels?', a: 'Yes. We can arrange airport pickup and private transport, and either recommend hotels or book them for you, depending on what you prefer.' }
];

type Enquiry = {
  arrival: string; flexible: boolean; duration: string; adults: number; children: number; from: string;
  dynamic: string; interests: string[]; accommodation: string; chauffeur: string; budget: string;
  name: string; email: string; whatsapp: string; channel: string; notes: string;
};
const emptyEnquiry: Enquiry = {
  arrival: '', flexible: false, duration: '1 Week', adults: 2, children: 0, from: '',
  dynamic: '', interests: [], accommodation: '', chauffeur: '', budget: '',
  name: '', email: '', whatsapp: '', channel: 'WhatsApp', notes: ''
};

function buildMessage(f: Enquiry) {
  const lines = [
    'Hello TroopTribe! I would like a custom Ghana itinerary.',
    '',
    `Name: ${f.name || '-'}`,
    `Travelling from: ${f.from || '-'}`,
    `Arrival: ${f.arrival || '-'}${f.flexible ? ' (flexible ±3 days)' : ''}`,
    `Duration: ${f.duration}`,
    `Travellers: ${f.adults} adult(s), ${f.children} child(ren)`,
    `Travel style: ${f.dynamic || 'Not specified'}`,
    `Interests: ${f.interests.length ? f.interests.join(', ') : 'Not specified'}`,
    `Accommodation: ${f.accommodation || 'Not specified'}`,
    `Transport: ${f.chauffeur || 'Not specified'}`,
    `Budget: ${f.budget || 'Not specified'}`,
    '',
    `Email: ${f.email || '-'}`,
    `WhatsApp: ${f.whatsapp || '-'}`,
    `Preferred channel: ${f.channel}`
  ];
  if (f.notes.trim()) lines.push('', `Notes: ${f.notes.trim()}`);
  return lines.join('\n');
}

function Planner() {
  const [form, setForm] = useState<Enquiry>(emptyEnquiry);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [faq, setFaq] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const locked = status === 'sending' || status === 'sent';
  const message = buildMessage(form);

  function set<K extends keyof Enquiry>(key: K, value: Enquiry[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function toggleInterest(item: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(item) ? prev.interests.filter((i) => i !== item) : [...prev.interests, item]
    }));
  }
  function reset() { setForm(emptyEnquiry); setStatus('idle'); }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked) return;
    if (!FORM_ENDPOINT) {
      // No form service configured yet: hand the enquiry to WhatsApp, pre-filled.
      window.open(waLink(message), '_blank', 'noopener');
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, interests: form.interests.join(', '), message })
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return <>
    <section className="planner-intro"><span className="eyebrow">Tailored West Africa Expeditions</span><h1>Let’s Plan Your Ghana Experience.</h1><p>Tell us a little about your trip, and we’ll help you put together something memorable. No rigid packages, no upfront payment — just thoughtful local planning.</p><div className="trust-card"><ShieldCheck size={18} /><strong>Curated by Accra Locals</strong><span>Response within 24 hours • Expert local planners • Dedicated WhatsApp concierge</span></div></section>
    <div className="planner-layout">
      <form className="planner-form" onSubmit={submit}>
        <fieldset className="planner-fieldset" disabled={locked}>
          <div className="form-card">
            <FormTitle number="01" title="Your Trip Vision & Logistics" subtitle="Help us map the rhythm and focus of your journey" />
            <div className="form-grid two">
              <Field label="Expected Arrival Date"><input required type="date" min={today} value={form.arrival} onChange={(e) => set('arrival', e.target.value)} /></Field>
              <label className="check-line"><input type="checkbox" checked={form.flexible} onChange={(e) => set('flexible', e.target.checked)} /> My travel dates are flexible (±3 days)</label>
            </div>
            <span className="field-label">Duration of Stay</span>
            <div className="option-row">{DURATIONS.map((option) => <button type="button" key={option} aria-pressed={form.duration === option} className={form.duration === option ? 'option selected' : 'option'} onClick={() => set('duration', option)}>{option}</button>)}</div>
            <div className="form-grid three">
              <Counter label="Adults (12+ yrs)" value={form.adults} setValue={(v) => set('adults', v)} min={1} />
              <Counter label="Children (0–11 yrs)" value={form.children} setValue={(v) => set('children', v)} min={0} />
              <Field label="Travelling From"><input required placeholder="e.g. London, Atlanta" autoComplete="country-name" value={form.from} onChange={(e) => set('from', e.target.value)} /></Field>
            </div>
            <span className="field-label">Travel Dynamic</span>
            <div className="chips selectable">{DYNAMICS.map((item) => <button type="button" key={item} className="chip" aria-pressed={form.dynamic === item} onClick={() => set('dynamic', form.dynamic === item ? '' : item)}>{item}</button>)}</div>
            <span className="field-label">Experiences You Crave <small>Select all that inspire you</small></span>
            <div className="interest-grid">{INTERESTS.map((item) => <label key={item}><input type="checkbox" checked={form.interests.includes(item)} onChange={() => toggleInterest(item)} /><span>{item}</span></label>)}</div>
            <div className="form-grid three">
              <Select label="Accommodation Guidance?" value={form.accommodation} onChange={(v) => set('accommodation', v)} options={ACCOMMODATION} />
              <Select label="Chauffeur & Airport Pickup?" value={form.chauffeur} onChange={(v) => set('chauffeur', v)} options={CHAUFFEUR} />
              <Select label="Budget Preference (Optional)" value={form.budget} onChange={(v) => set('budget', v)} options={BUDGET} />
            </div>
          </div>
          <div className="form-card">
            <FormTitle number="02" title="Contact & Proposal Delivery" subtitle="Where our Accra itinerary designer will send your custom plan" />
            <div className="form-grid two">
              <Field label="Full Name"><input required placeholder="e.g. Dr. Maya Johnson" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Email Address"><input required type="email" placeholder="maya.johnson@example.com" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
            </div>
            <div className="form-grid two">
              <Field label="WhatsApp Number (with country code)"><input required type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 019 2831" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></Field>
              <div><span className="field-label">Preferred Channel</span><div className="option-row">{CHANNELS.map((option) => <button type="button" key={option} aria-pressed={form.channel === option} className={form.channel === option ? 'option selected' : 'option'} onClick={() => set('channel', option)}>{option}</button>)}</div></div>
            </div>
            <Field label="Special Requests & Personal Notes"><textarea rows={3} placeholder="Share dietary needs, mobility considerations, ancestry pilgrimages, or surprise milestones..." value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
            <div className="submit-row"><button className="button button-primary" type="submit" disabled={locked}><Send size={16} /> {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Enquiry Sent' : 'Send My Trip Enquiry'}</button><span><ShieldCheck size={15} /> We respect your privacy. Your details are solely used for your tailored proposal.</span></div>
          </div>
        </fieldset>
        {status === 'sent' && <div className="form-status ok" role="status"><Check size={20} /><div>
          <strong>{FORM_ENDPOINT ? 'Thank you — your enquiry has been sent.' : 'Almost done — send your enquiry in WhatsApp.'}</strong>
          <span>{FORM_ENDPOINT ? 'A dedicated Accra curator will review your ideas and contact you within 24 hours.' : 'WhatsApp should have opened with your details ready. Just tap send. If it did not open, use the button below.'}</span>
          <div className="status-actions"><a className="button button-green" href={waLink(message)} {...EXTERNAL}><MessageCircle size={16} /> {FORM_ENDPOINT ? 'Also message us on WhatsApp' : 'Open WhatsApp'}</a><button type="button" className="text-button" onClick={reset}>Start a new enquiry</button></div>
        </div></div>}
        {status === 'error' && <div className="form-status error" role="alert"><X size={20} /><div>
          <strong>We couldn’t send your enquiry.</strong>
          <span>Please try again, or send the same details on WhatsApp instead.</span>
          <div className="status-actions"><a className="button button-green" href={waLink(message)} {...EXTERNAL}><MessageCircle size={16} /> Send on WhatsApp</a></div>
        </div></div>}
        <div className="whatsapp-strip"><MessageCircle size={24} /><span><strong>Prefer to brainstorm in real time?</strong><small>Speak directly with our concierge lead in Accra on WhatsApp.</small></span><a href={waLink()} {...EXTERNAL}>Open WhatsApp <ArrowRight size={14} /></a></div>
      </form>
      <aside className="planner-aside">
        <div className="aside-photo" style={{ backgroundImage: `linear-gradient(0deg, rgba(11,46,22,.78), transparent), url(${images.castle})` }}><span>Handcrafted Journeys</span><strong>Akwaaba to genuine warmth.</strong></div>
        <div className="planner-benefits"><Benefit icon={<ShieldCheck />} title="Zero Commitment Inquiries" text="Receiving a customized proposal is completely free." /><Benefit icon={<Mountain />} title="Accredited Local Navigators" text="Licensed chauffeurs, safe transports, and vetted guides." /><Benefit icon={<HeartHandshake />} title="Cultural Integrity" text="Direct economic benefit to local communities." /></div>
        <div className="quote-photo" style={{ backgroundImage: `linear-gradient(rgba(11,46,22,.28), rgba(11,46,22,.5)), url(${images.kente})` }}>“Travel isn't about ticking boxes. It's about feeling the pulse of the soil.”</div>
        <div className="faq-mini">{PLANNER_FAQS.map((item, index) => <div key={item.q}><button type="button" aria-expanded={faq === index} onClick={() => setFaq(faq === index ? null : index)}>{item.q}<ChevronDown size={15} /></button>{faq === index && <p>{item.a}</p>}</div>)}</div>
      </aside>
    </div>
  </>;
}

function FormTitle({ number, title, subtitle }: { number: string; title: string; subtitle: string }) { return <div className="form-title"><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="field"><span className="field-label">{label}</span>{children}</label>; }
function Counter({ label, value, setValue, min }: { label: string; value: number; setValue: (value: number) => void; min: number }) { return <div className="counter"><span className="field-label">{label}</span><div><button type="button" aria-label={`Decrease ${label}`} onClick={() => setValue(Math.max(min, value - 1))}><Minus size={15} /></button><strong>{value}</strong><button type="button" aria-label={`Increase ${label}`} onClick={() => setValue(value + 1)}><Plus size={15} /></button></div></div>; }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <Field label={label}><select value={value} onChange={(e) => onChange(e.target.value)}><option value="">Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>; }
function Benefit({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="benefit"><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div></div>; }

/* ------------------------------------------------------------------
   APP
------------------------------------------------------------------- */
export default function App() {
  const [nav, setNav] = useState<{ page: Page; id?: string; n: number }>({ page: 'home', n: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const { page } = nav;

  // Navigate to a page and optionally to a section on it (works across pages).
  const go: Go = (nextPage, id) => {
    setMenuOpen(false);
    setNav((prev) => ({ page: nextPage, id, n: prev.n + 1 }));
  };

  // Lock page scroll while the mobile menu is open; close it with Escape.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // After each navigation, scroll to the requested section or back to the top.
  useEffect(() => {
    if (nav.n === 0) return;
    if (nav.id) document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav]);

  return <div>
    <Header page={page} go={go} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main>
      {page === 'home' && <Home go={go} />}
      {page === 'heritage' && <Heritage go={go} />}
      {page === 'planner' && <Planner />}
    </main>
    <Footer go={go} />
    <a className="floating-whatsapp" href={waLink()} {...EXTERNAL}><MessageCircle size={17} /> WhatsApp Concierge</a>
    <div className="mobile-bar">
      <a href={waLink()} {...EXTERNAL}><MessageCircle size={16} /> WhatsApp</a>
      <button onClick={() => go('planner')}><CalendarDays size={16} /> Plan Trip</button>
    </div>
  </div>;
}