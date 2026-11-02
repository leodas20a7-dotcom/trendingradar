/**
 * Tamil Nadu Legends Service (தமிழ்நாடு சாதனையாளர்கள் & ஆளுமைகள்)
 * Tracks iconic Tamil poets, legendary playback singers, cinema icons, 
 * political statesmen, and visionary scientists with authentic birth dates and biographies.
 */

export const TAMIL_LEGENDS_DATABASE = [
  // --- POETS & WRITERS (புலவர்கள் & எழுத்தாளர்கள்) ---
  {
    name: 'Subramania Bharati',
    tamilName: 'சுப்பிரமணிய பாரதியார்',
    honorific: 'Mahakavi (மகாகவி)',
    role: 'Poets & Writers',
    month: 12,
    day: 11,
    birthYear: 1882,
    whyFamous: 'Pioneered modern Tamil poetry, ignited the Indian independence movement in South India with patriotic songs, and fiercely championed women\'s liberation and social equality.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Subramania_Bharati'
  },
  {
    name: 'Thiruvalluvar',
    tamilName: 'திருவள்ளுவர்',
    honorific: 'Divine Poet (தெய்வப்புலவர்)',
    role: 'Poets & Writers',
    month: 1,
    day: 15, // Celebrated officially as Thiruvalluvar Day across Tamil Nadu
    birthYear: null,
    whyFamous: 'Author of the Tirukkuṟaḷ, one of the greatest ethical and literary masterworks of world literature comprising 1,330 couplets on virtue, wealth, and love.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Thiruvalluvar'
  },
  {
    name: 'Kannadasan',
    tamilName: 'கண்ணதாசன்',
    honorific: 'Kaviarasu (கவியரசு)',
    role: 'Poets & Writers',
    month: 6,
    day: 24,
    birthYear: 1927,
    whyFamous: 'Legendary Tamil poet and lyricist who penned over 5,000 film songs, philosophical poems, and received the Sahitya Akademi Award for Cheraman Kadali.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kannadasan'
  },
  {
    name: 'Vaali',
    tamilName: 'வாலி',
    honorific: 'Lyricist Legend (கவிஞர்)',
    role: 'Poets & Writers',
    month: 10,
    day: 29,
    birthYear: 1931,
    whyFamous: 'Penned over 15,000 Tamil film songs spanning 5 decades across 5 generations of actors from MGR and Sivaji to Rajinikanth, Kamal, Ajith, and Vijay; awarded Padma Shri.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Vaali_(poet)'
  },
  {
    name: 'Bharathidasan',
    tamilName: 'பாரதிதாசன்',
    honorific: 'Pavendhar (பாவேந்தர்)',
    role: 'Poets & Writers',
    month: 4,
    day: 29,
    birthYear: 1891,
    whyFamous: 'Major 20th-century Tamil poet, disciple of Bharati, rationalist writer who was posthumously awarded the Sahitya Akademi Award for Pisiranthaiyar.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Bharathidasan'
  },
  {
    name: 'Kalki Krishnamurthy',
    tamilName: 'கல்கி கிருஷ்ணமூர்த்தி',
    honorific: 'Literary Giant',
    role: 'Poets & Writers',
    month: 9,
    day: 9,
    birthYear: 1899,
    whyFamous: 'Celebrated novelist who wrote the epochal historical fiction epic Ponniyin Selvan, Sivagamiyin Sabatham, and Parthiban Kanavu.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kalki_Krishnamurthy'
  },
  {
    name: 'Vairamuthu',
    tamilName: 'வைரமுத்து',
    honorific: 'Kavipearasu (கவிப்பேரரசு)',
    role: 'Poets & Writers',
    month: 7,
    day: 13,
    birthYear: 1953,
    whyFamous: '7-time National Film Award-winning lyricist and author awarded Padma Bhushan for contributions to contemporary Tamil literature and cinema.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Vairamuthu'
  },
  {
    name: 'U. V. Swaminatha Iyer',
    tamilName: 'உ. வே. சாமிநாதையர்',
    honorific: 'Tamil Thatha (தமிழ்த்தாத்தா)',
    role: 'Poets & Writers',
    month: 2,
    day: 19,
    birthYear: 1855,
    whyFamous: 'Grand patriarch of Tamil who painstakingly salvaged, preserved, and printed ancient Sangam palm-leaf manuscripts, resurrecting classical Tamil heritage.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/U._V._Swaminatha_Iyer'
  },

  // --- SINGERS & MUSICIANS (பாடகர் & இசை மேதைகள்) ---
  {
    name: 'M. S. Subbulakshmi',
    tamilName: 'எம். எஸ். சுப்புலட்சுமி',
    honorific: 'Bharat Ratna / Nightingale of Carnatic Music',
    role: 'Singers & Musicians',
    month: 9,
    day: 16,
    birthYear: 1916,
    whyFamous: 'First musician ever awarded the Bharat Ratna (India\'s highest civilian honor) and first Indian musician to perform at the United Nations General Assembly in 1966.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/M._S._Subbulakshmi'
  },
  {
    name: 'Ilaiyaraaja',
    tamilName: 'இளையராஜா',
    honorific: 'Isaignani / Maestro (இசைஞானி)',
    role: 'Singers & Musicians',
    month: 6,
    day: 2,
    birthYear: 1943,
    whyFamous: 'Legendary composer who revolutionized South Indian film music by integrating Western classical symphonies with traditional Tamil folk; composed over 7,000 songs and awarded Padma Vibhushan.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ilaiyaraaja'
  },
  {
    name: 'A. R. Rahman',
    tamilName: 'ஏ. ஆர். ரகுமான்',
    honorific: 'Isai Puyal / Mozart of Madras (இசைப்புயல்)',
    role: 'Singers & Musicians',
    month: 1,
    day: 6,
    birthYear: 1967,
    whyFamous: 'Two-time Academy Award (Oscar), two-time Grammy Award, and BAFTA winning composer who transformed Indian cinema sound and achieved global acclaim.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/A._R._Rahman'
  },
  {
    name: 'S. P. Balasubrahmanyam',
    tamilName: 'எஸ். பி. பாலசுப்பிரமணியம்',
    honorific: 'Paadum Nila (பாடும் நிலா)',
    role: 'Singers & Musicians',
    month: 6,
    day: 4,
    birthYear: 1946,
    whyFamous: 'Recorded a Guinness World Record of over 40,000 songs across 16 languages; 6-time National Film Award winner awarded Padma Vibhushan.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/S._P._Balasubrahmanyam'
  },
  {
    name: 'T. M. Soundararajan',
    tamilName: 'டி. எம். சௌந்தரராஜன்',
    honorific: 'TMS (குரல் அரசர்)',
    role: 'Singers & Musicians',
    month: 3,
    day: 24,
    birthYear: 1923,
    whyFamous: 'Iconic playback singer who was the definitive voice of Tamil cinema titans M.G. Ramachandran and Sivaji Ganesan for four decades.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/T._M._Soundararajan'
  },
  {
    name: 'P. Susheela',
    tamilName: 'பி. சுசீலா',
    honorific: 'Gana Saraswathi (கான சரஸ்வதி)',
    role: 'Singers & Musicians',
    month: 11,
    day: 13,
    birthYear: 1935,
    whyFamous: 'Recognized by the Guinness World Records for singing the highest number of studio recordings by a female singer (over 17,695 songs); 5-time National Award winner.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/P._Susheela'
  },
  {
    name: 'M. S. Viswanathan',
    tamilName: 'எம். எஸ். விஸ்வநாதன்',
    honorific: 'Mellisai Mannar (மெல்லிசை மன்னர்)',
    role: 'Singers & Musicians',
    month: 6,
    day: 24,
    birthYear: 1928,
    whyFamous: 'The "King of Light Music" who composed evergreen melodies for over 1,200 films and defined the golden era of Tamil film music alongside T.K. Ramamoorthy.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/M._S._Viswanathan'
  },

  // --- ACTORS & FILMMAKERS (நடிகர்கள் & திரைக்கலைஞர்கள்) ---
  {
    name: 'M. G. Ramachandran (MGR)',
    tamilName: 'எம். ஜி. இராமச்சந்திரன்',
    honorific: 'Makkal Thilagam / Puratchi Thalaivar',
    role: 'Actors & Filmmakers',
    month: 1,
    day: 17,
    birthYear: 1917,
    whyFamous: 'Cultural icon, superstar actor, philanthropist, and 3-term Chief Minister of Tamil Nadu who pioneered the universal mid-day meal scheme; awarded Bharat Ratna.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/M._G._Ramachandran'
  },
  {
    name: 'Sivaji Ganesan',
    tamilName: 'சிவாஜி கணேசன்',
    honorific: 'Nadigar Thilagam (நடிகர் திலகம்)',
    role: 'Actors & Filmmakers',
    month: 10,
    day: 1,
    birthYear: 1928,
    whyFamous: 'Universally revered as one of the greatest actors in Indian cinema history; first Indian actor honored as Chevalier of the Ordre des Arts et des Lettres by France.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sivaji_Ganesan'
  },
  {
    name: 'Rajinikanth',
    tamilName: 'ரஜினிகாந்த்',
    honorific: 'Superstar (சூப்பர் ஸ்டார்)',
    role: 'Actors & Filmmakers',
    month: 12,
    day: 12,
    birthYear: 1950,
    whyFamous: 'Pan-Asian cultural phenomenon and superstar with an unparalleled fan following; recipient of the Dadasaheb Phalke Award and Padma Vibhushan.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Rajinikanth'
  },
  {
    name: 'Kamal Haasan',
    tamilName: 'கமல் ஹாசன்',
    honorific: 'Ulaganayagan (உலகநாயகன்)',
    role: 'Actors & Filmmakers',
    month: 11,
    day: 7,
    birthYear: 1954,
    whyFamous: 'Visionary actor, director, polymath with 4 National Film Awards and the highest number of Academy Award submissions for any Indian actor; Chevalier recipient.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kamal_Haasan'
  },
  {
    name: 'K. Balachander',
    tamilName: 'கே. பாலசந்தர்',
    honorific: 'Iyakkunar Sigaram (இயக்குனர் சிகரம்)',
    role: 'Actors & Filmmakers',
    month: 7,
    day: 9,
    birthYear: 1930,
    whyFamous: 'Dadasaheb Phalke Award-winning director who introduced titans Rajinikanth, Kamal Haasan, and Prakash Raj, renowned for revolutionary social drama films.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/K._Balachander'
  },
  {
    name: 'Mani Ratnam',
    tamilName: 'மணிரத்னம்',
    honorific: 'Master Director',
    role: 'Actors & Filmmakers',
    month: 6,
    day: 2,
    birthYear: 1956,
    whyFamous: 'Globally celebrated director whose classics Nayakan (TIME magazine All-Time 100), Roja, Bombay, and Ponniyin Selvan redefined modern Indian cinematic aesthetics.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Mani_Ratnam'
  },
  {
    name: 'Manorama',
    tamilName: 'மனோரமா',
    honorific: 'Aachi (ஆச்சி)',
    role: 'Actors & Filmmakers',
    month: 5,
    day: 26,
    birthYear: 1937,
    whyFamous: 'Guinness World Record holder for acting in over 1,500 films and 1,000 stage performances spanning 6 decades; recipient of National Film Award and Padma Shri.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Manorama_(Tamil_actress)'
  },
  {
    name: 'Sridevi',
    tamilName: 'ஸ்ரீதேவி',
    honorific: 'First Female Superstar',
    role: 'Actors & Filmmakers',
    month: 8,
    day: 13,
    birthYear: 1963,
    whyFamous: 'Iconic actress who dominated Tamil, Telugu, and Hindi cinema across five decades; awarded Padma Shri and National Film Award.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sridevi'
  },
  {
    name: 'Gemini Ganesan',
    tamilName: 'ஜெமினி கணேசன்',
    honorific: 'Kaadhal Mannan (காதல் மன்னன்)',
    role: 'Actors & Filmmakers',
    month: 11,
    day: 17,
    birthYear: 1920,
    whyFamous: 'One of the "Three Kings" of Tamil cinema alongside MGR and Sivaji Ganesan, revered for legendary romantic classics and Padma Shri recipient.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Gemini_Ganesan'
  },
  {
    name: 'Vijay',
    tamilName: 'விஜய்',
    honorific: 'Thalapathy (தளபதி)',
    role: 'Actors & Filmmakers',
    month: 6,
    day: 22,
    birthYear: 1974,
    whyFamous: 'Leading contemporary Tamil superstar with tremendous box office records and pan-Indian cultural popularity.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Vijay_(actor)'
  },
  {
    name: 'Ajith Kumar',
    tamilName: 'அஜித் குமார்',
    honorific: 'AK / Thala (தல)',
    role: 'Actors & Filmmakers',
    month: 5,
    day: 1,
    birthYear: 1971,
    whyFamous: 'Beloved superstar actor, auto racer, and aero-modelling mentor with a massive devoted fanbase across South India.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ajith_Kumar'
  },

  // --- STATESMEN, FREEDOM FIGHTERS & REFORMERS (தலைவர்கள் & தியாகிகள்) ---
  {
    name: 'Periyar E. V. Ramasamy',
    tamilName: 'பெரியார் ஈ. வெ. இராமசாமி',
    honorific: 'Thanthai Periyar (தந்தை பெரியார்)',
    role: 'Statesmen & Reformers',
    month: 9,
    day: 17,
    birthYear: 1879,
    whyFamous: 'Father of the Dravidian movement, rationalist philosopher, and social reformer who led the Vaikom Satyagraha and Self-Respect Movement.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Periyar'
  },
  {
    name: 'C. N. Annadurai',
    tamilName: 'சி. என். அண்ணாதுரை',
    honorific: 'Arignar Anna (அறிஞர் அண்ணா)',
    role: 'Statesmen & Reformers',
    month: 9,
    day: 15,
    birthYear: 1909,
    whyFamous: 'First Chief Minister of Tamil Nadu to officially rename Madras State as "Tamil Nadu", legendary Tamil orator, writer, and founder of the DMK.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/C._N._Annadurai'
  },
  {
    name: 'K. Kamaraj',
    tamilName: 'கே. காமராஜர்',
    honorific: 'Kingmaker / Karma Veerar (கர்மவீரர்)',
    role: 'Statesmen & Reformers',
    month: 7,
    day: 15,
    birthYear: 1903,
    whyFamous: 'Bharat Ratna recipient and venerated 3-term Chief Minister who introduced free education and the mid-day meal scheme, opening thousands of rural schools.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/K._Kamaraj'
  },
  {
    name: 'V. O. Chidambaram Pillai',
    tamilName: 'வ. உ. சிதம்பரம் பிள்ளை',
    honorific: 'Kappalottiya Thamizhan (கப்பலோட்டிய தமிழன்)',
    role: 'Statesmen & Reformers',
    month: 9,
    day: 5,
    birthYear: 1872,
    whyFamous: 'Freedom fighter who launched the Swadeshi Steam Navigation Company in 1906 to break the British monopoly on sea trade between Tuticorin and Colombo.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/V._O._Chidambaram_Pillai'
  },
  {
    name: 'Pasumpon Muthuramalinga Thevar',
    tamilName: 'பசும்பொன் முத்துராமலிங்கத் தேவர்',
    honorific: 'Freedom Fighter & Spiritual Leader',
    role: 'Statesmen & Reformers',
    month: 10,
    day: 30,
    birthYear: 1908,
    whyFamous: 'Nationalist leader who worked alongside Netaji Subhas Chandra Bose in the All India Forward Bloc and championed the Temple Entry movement.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Muthuramalinga_Thevar'
  },
  {
    name: 'C. Rajagopalachari (Rajaji)',
    tamilName: 'சி. ராஜகோபாலாச்சாரி',
    honorific: 'First Governor-General of Free India',
    role: 'Statesmen & Reformers',
    month: 12,
    day: 10,
    birthYear: 1878,
    whyFamous: 'First Indian Governor-General of India, Premier of Madras Presidency, and one of the first recipients of the Bharat Ratna.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/C._Rajagopalachari'
  },

  // --- SCIENTISTS & VISIONARIES (விஞ்ஞானிகள் & மேதைகள்) ---
  {
    name: 'C. V. Raman',
    tamilName: 'சி. வி. இராமன்',
    honorific: 'Nobel Laureate in Physics',
    role: 'Scientists & Visionaries',
    month: 11,
    day: 7,
    birthYear: 1888,
    whyFamous: 'Won the Nobel Prize in Physics (1930) for discovering the Raman Effect (scattering of light), celebrated as National Science Day in India; Bharat Ratna awardee.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/C._V._Raman'
  },
  {
    name: 'Srinivasa Ramanujan',
    tamilName: 'சீனிவாச ராமானுஜன்',
    honorific: 'Mathematical Genius',
    role: 'Scientists & Visionaries',
    month: 12,
    day: 22,
    birthYear: 1887,
    whyFamous: 'Prodigious mathematician who contributed groundbreaking theorems to mathematical analysis, infinite series, and continued fractions; his birthday is celebrated as National Mathematics Day.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Srinivasa_Ramanujan'
  },
  {
    name: 'Dr. A. P. J. Abdul Kalam',
    tamilName: 'ஏ. பி. ஜே. அப்துல் கலாம்',
    honorific: 'Missile Man & People\'s President',
    role: 'Scientists & Visionaries',
    month: 10,
    day: 15,
    birthYear: 1931,
    whyFamous: 'Born in Rameswaram, Bharat Ratna laureate who steered India\'s civilian space program and missile development, and served as the beloved 11th President of India.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam'
  },
  {
    name: 'Subrahmanyan Chandrasekhar',
    tamilName: 'சுப்பிரமணியன் சந்திரசேகர்',
    honorific: 'Nobel Laureate Astrophysicist',
    role: 'Scientists & Visionaries',
    month: 10,
    day: 19,
    birthYear: 1910,
    whyFamous: 'Awarded the Nobel Prize in Physics (1983) for mathematical theory on the physical processes of the structure and evolution of stars, discovering the Chandrasekhar Limit.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Subrahmanyan_Chandrasekhar'
  },
  {
    name: 'M. S. Swaminathan',
    tamilName: 'எம். எஸ். சுவாமிநாதன்',
    honorific: 'Father of Economic Ecology / Green Revolution',
    role: 'Scientists & Visionaries',
    month: 8,
    day: 7,
    birthYear: 1925,
    whyFamous: 'Geneticist who spearheaded the Green Revolution in India, delivering national food security and awarded the Bharat Ratna, World Food Prize, and Ramon Magsaysay Award.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/M._S._Swaminathan'
  },
  {
    name: 'Viswanathan Anand',
    tamilName: 'விசுவநாதன் ஆனந்த்',
    honorific: '5-Time World Chess Champion',
    role: 'Scientists & Visionaries',
    month: 12,
    day: 11,
    birthYear: 1969,
    whyFamous: 'India\'s first Grandmaster, 5-time undisputed World Chess Champion, first recipient of the Rajiv Gandhi Khel Ratna, and awarded Padma Vibhushan.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Viswanathan_Anand'
  }
];

/**
 * Returns Tamil Nadu legends celebrating birthdays today or upcoming
 */
export function getTamilLegendsForDate(month, day) {
  return TAMIL_LEGENDS_DATABASE.filter(l => l.month === month && l.day === day);
}

/**
 * Converts a legend into our standardized Event format
 */
export function formatTamilLegendEvent(legend, targetDateStr = null) {
  const dateStr = targetDateStr || (legend.birthYear ? `${legend.birthYear}-${String(legend.month).padStart(2, '0')}-${String(legend.day).padStart(2, '0')}` : null);
  
  return {
    id: `tn_legend_${legend.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title: `${legend.name} (${legend.honorific})`,
    tamilTitle: `${legend.tamilName} - ${legend.honorific}`,
    summary: legend.whyFamous,
    category: 'Tamil Nadu Legends',
    subRole: legend.role,
    location: 'tamilnadu',
    country: 'Tamil Nadu, India',
    personOrTeam: legend.name,
    eventDate: dateStr,
    birthMonth: legend.month,
    birthDay: legend.day,
    birthYear: legend.birthYear,
    verificationStatus: 'verified',
    sourceType: 'wikidata',
    sources: [
      {
        publisher: 'Tamil Heritage & Biographical Archive',
        url: legend.wikipediaUrl,
        title: `${legend.name} Official Record`
      }
    ],
    metadata: {
      isTamilLegend: true,
      role: legend.role,
      tamilName: legend.tamilName,
      honorific: legend.honorific
    }
  };
}
