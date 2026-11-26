import type { TeamMember, TeamPage, TeamPerson, TeamSection } from '../types';

/**
 * The MAAD Ones (/the-maad-ones) copy.
 * Layout, names and card titles follow the team page design; bios come from "People Page.docx".
 * People without a bio (some board members) render with no "See profile" affordance until one is added.
 * Portraits live in /public/team as {slug}-400.webp and {slug}-800.webp (2:3 crop).
 */
const PEOPLE = {
  'mike-kafeero': {
    name: 'Mike Kafeero',
    bio: {
      paragraphs: [
        'Mike is the man who makes things happen. Give him an idea and he’ll figure out who, how and what it takes to bring it to life. With over 24 years in creative production, he has mastered the journey from concept to finished product; bringing together craft, people, suppliers and a great eye for detail to make sure the final execution lives up to the idea.',
        'With roots in design & prepress and decades spent producing everything from print and billboards to radio, film and integrated campaigns, Mike knows what it takes to turn ambitious thinking into something real. If the creative team can dream it, Mike knows how to make it.',
      ],
      brands:
        'UNICEF, Save the Children, Mercy Corps, FHI360, RTI International, Malaria Consortium, CDFU, GIZ, UHMG, CCEDU, Foundation for Human Rights Initiative, KCCA, IFC, Movit, JESA Dairy Products, Ugachick, Coca-Cola, Uganda Breweries, Rwenzori Mineral Water, DStv, GOtv, Daily Monitor, New Vision, Unilever, Sunlight, Vaseline, Nice House of Plastics, Cairo Bank, Tropical Bank, Opportunity Bank, Bank of Africa, Western Union, Warid Telecom Uganda, Orange Uganda, Total Uganda, Cipla Quality Chemicals and Power Play.',
      projects:
        'Eyok Kiyan, Obulamu, Tusomere Wamu, Tukomye Okutuntuza! Tekugunjula, The Stop Malaria Project, Live Your Dream, Kyuusa Enfumba Yo, ECD, Spotlight Initiative, Adolescent Voices, RHITES South West, Topowa and Kampala Waste Management.',
    },
  },
  'annette-ssebba': {
    name: 'Annette Ssebba',
  },
  'joseph-bagabo': {
    name: 'Joseph Bagabo',
  },
  'marx-rukundo': {
    name: 'Marx Rukundo',
  },
  'adris-kamuli': {
    name: 'Adris Kamuli',
    bio: {
      paragraphs: [
        'Adris has spent over 25 years turning big ideas into even bigger impact. From cutting his teeth as a designer in Kampala to sharpening his creative chops in Rwanda and the USA, he has built a career and an agency on work that gets brands noticed, remembered and moving forward. Along the way, he has helped shape iconic campaigns like Pakalast, Topowa and Obulamu, and led MAAD McCann to become one of Uganda’s most awarded agencies.',
        'Now Managing Director, Adris is still a creative at heart, just with a much bigger canvas. An industry leader, mentor and champion of young talent, he believes great agencies don’t just make great work; they make great people who make great work.',
      ],
      brands:
        'UNICEF, Mastercard, GOtv, DStv, KCB, Uganda Development Bank, Unilever, Uganda Breweries Limited, Stanbic Bank, RTI International, IFC, MTN Uganda, MTN Rwanda, World Food Programme, BRD Bank, RwandAir, Bank of Africa, JESA, Save the Children, Warid Telecom, Orange Telecom, Shell, NSSF, DFCU Bank, PSI, Harley-Davidson, Porsche, Northwest Airlines and Blue Cross.',
      projects:
        'Pakalast, Topowa, Obulamu, Communication for Healthy Communities (CHC), UNICEF Integrated Communication Campaigns, RTI International Campaigns, GOtv & DStv Integrated Campaigns, Uganda Breweries Campaigns and Save the Children Campaigns.',
    },
  },
  'clare-bamwine': {
    name: 'Clare Bamwine',
    bio: {
      paragraphs: [
        'Cool, calm and always a few moves ahead, Clare has spent over 20 years mastering the art and science of media. She turns audience behaviour, market insights and data into media strategies that put brands in the right place, at the right time making every shilling work harder.',
        'As MAAD McCann’s Media Director, Clare brings an unflappable head to an industry that never stops moving. From traditional media to today’s increasingly integrated landscape, she has led strategies across markets, platforms and sectors with a philosophy that remains refreshingly simple: data talks, assumptions walk.',
      ],
      brands:
        'Unilever, Reckitt Benckiser, Nokia, East African Breweries, Guinness, P&G, Kenya Airways, BBC, UNICEF, Emirates Airlines, PSI, UHMG, KCB, Jubilee Insurance, Hima Cement, Bamburi Cement and FHI/Johns Hopkins.',
      projects:
        'Launch of 1759 Guinness, Launch of A380 Emirates Airlines, Dirt Is Good – OMO Unilever Uganda, Mothers’ Love – Geisha Unilever Uganda, Part of You From the Start – Hima & Bamburi Cement and Obulamu Campaign – FHI/Johns Hopkins.',
    },
  },
  'peter-kazibwe': {
    name: 'Peter Kazibwe',
    bio: {
      paragraphs: [
        'Great creative leaders know how to lead the work. Peter knows how to lead the people behind it too. With over 18 years in advertising, he has built a career creating culturally resonant work, guiding creative teams and proving that some of the biggest ideas can come from the calmest person in the room.',
        'Patient, approachable and relentlessly generous with his experience, Peter has a gift for getting the best out of both ideas and people. That approach has helped lead MAAD McCann to award-winning work, earned him Creative Director of the Year 2025, and now extends to shaping the wider industry as Chairperson of the Uganda Advertising Association. For Peter, raising the standard has always meant bringing people up with it.',
      ],
      brands:
        'Coca-Cola, UNICEF, GOtv, Guinness, Uganda Baati, Rwenzori Water, Facebook Africa, Jetour, Pride Bank, RTI International, FHI360, Aga Khan Foundation, ICAN/Abt Associates, VSO, UNFPA, Global Fund, GIZ and OraQuick.',
      projects:
        'Let’s End Corporal Punishment, Obulamu, End Child Marriage, UNICEF Immunization Campaigns, IDEC, Farmers’ Support Center, IPALSE, Conservation Is Our Opportunity, Our Children Our Future, Update Yo Status, Adolescent Voices, Live Your Dream, Malaria Campaigns and Kyusa Emfumba.',
    },
  },
  'aggrey-muganga': {
    name: 'Aggrey Muganga',
    bio: {
      paragraphs: [
        'For Aggrey, changing minds isn’t just the job. It’s the thing he genuinely loves doing. An SBCC specialist with over eight years of experience, he combines research, human insight and a deep understanding of communities to create communication that doesn’t just reach people, it moves them to think, feel and act differently.',
        'From co-creation sessions in communities across Uganda to leading complex national campaigns, Aggrey brings equal parts expertise, curiosity and heart to the work. He’s deeply serious about creating meaningful change, while somehow never taking himself too seriously.A combination that makes both the work and working with him better.',
      ],
      brands:
        'UNICEF, USAID, RTI International, PSI, Aga Khan Foundation, Windle International, WaterAid, Mildmay Uganda, Health Communication Capacity Collaborative (HC3) and Ohio University.',
      projects:
        'UNICEF BRMS & G4DU Campaign, Interventions for Disabilities in Early Childhood (IDEC), UNICEF Immunization Songs & Videos, UNICEF End Child Marriage Campaign, Maverick Next, Biodiversity 4 Resilience (B4R), Adolescent Girls’ Education in Crisis Initiative (AGENCI) and USAID Integrated Community Agriculture and Nutrition Activity (ICAN) – Farmer Service Hubs Campaign.',
    },
  },
  'abel-mugume': {
    name: 'Abel Mugume',
    bio: {
      paragraphs: [
        'Abel knows when it’s time for business. He also knows when it’s time for a good joke. A strategist and business development professional with over 15 years in the industry, he has built his career on understanding what brands need, spotting opportunities others might miss and turning strong client relationships into lasting business growth.',
        'Having grown through the ranks from Marketing Assistant and Account Manager to Business Unit Manager and now Head of Business Development, Abel has developed a deep understanding of brands, clients and the wider business environment across multiple industries. Easy-going by nature and serious about the work, he brings sharp strategic thinking and commercial instinct to every brief.',
        'Whether he’s shaping a brand strategy, leading a pitch, helping steer a client through a business challenge or mentoring the next generation of strategists, Abel has mastered that rare balance of keeping things light while never taking the work lightly.',
      ],
      brands:
        'Uganda Breweries Limited, Pride Bank, PostBank, UNBS, Uganda Baati, Uganda Development Bank, TOTAL, BAYER, Coca Cola, Unilever, KCB Bank Uganda, Movit Products Limited, Roofings Group, MultiChoice Uganda, GOtv, IFC, Mastercard, UNICEF, WHO, Bank of Africa, JESA Dairy Farm, HCP/Johns Hopkins and Hima Cement.',
      projects:
        'Pride Bank Rebranding Strategy, Take Pride Campaign, UNBS Rebranding Strategy, GOtv Closer Together, GOtv Ka Weekie Integrated Strategy, Aromat Kangamu, Guinness Black Shines Brightest, Tusker Lite – Turn on Your Lite, Tusker Malt Lager – Behold the Finest, V&A – Yours to Share, White Cap – Strategy, Know Together HIV Testing Campaign, Roofings Strength of a Nation and Roofings Razor Wires.',
    },
  },
  'joy-tushabe': {
    name: 'Joy Tushabe',
    bio: {
      paragraphs: [
        'If it’s happening in the digital universe, chances are Joy already knows about it. With over 10 years of experience, she brings a deep understanding of platforms, audiences, content and online culture to the table, turning what’s trending, changing and emerging into digital strategies that actually make sense for brands.',
        'As MAAD McCann’s Head of Digital, Joy combines digital know-how with sharp strategic thinking, leading teams and campaigns that build communities, spark engagement and deliver measurable results. In a world where the next big thing is always one scroll away, Joy makes sure our brands are never playing catch-up.',
      ],
      brands:
        'MAAD McCann, Creatabuzz Communications, NOMAD Advertising, WPP Scangroup, Woussei Digital, Reach A Hand Uganda, UNCDF, Coca-Cola, FLY, GOtv, Uganda Baati, Airtel Uganda, National Bank of Rwanda (BNR) and British High Commission.',
      projects:
        'MAAD Skilling and integrated digital, content and community campaigns across her brand portfolio.',
    },
  },
  'allen-suubi-ssempa': {
    name: 'Allen Suubi Ssempa',
    bio: {
      paragraphs: [
        'PR isn’t just what Allen does. It’s practically in her DNA. With over 14 years in communications, she has mastered the art of shaping narratives, building reputations and creating the kind of relationships that keep brands part of the right conversations. From media relations and stakeholder engagement to crisis communications and events, Allen knows how to make every interaction count.',
        'Cool, composed and a consummate professional, she brings clarity and confidence to even the most complex communication challenges. Whether she’s protecting a reputation, telling a compelling brand story or bringing people together, Allen knows that great PR isn’t simply about being seen, it’s about being remembered for the right reasons.',
      ],
      brands:
        'MAAD McCann, World Health Organization (WHO), Crown Beverages Limited, Equity Bank Uganda, Uganda Advertising Association (UAA), Save the Children, StrongMinds Uganda, Robertson Winery South Africa, CARE International, Global Affairs Canada, Kigezi Women in Development, Namabiro Foundation, Public Relations Association of Uganda (PRAU), Uganda Marketers Society and Chartered Institute of Public Relations (CIPR).',
      projects:
        'U-Learn Project, Clean Energy for a Better Life Campaign (Phases 1–4), World Mental Health Month Campaign, Robertson Winery Brand Communications Support, CARE International – Global Affairs Canada Launch, Echo APEAL III Mid-Term Reflection, Kigezi Women in Development Communications Strategy, Namabiro Foundation Campaigns and Northern Economic Corridor Project.',
    },
  },
  'martin-lee-otim': {
    name: 'Martin Lee Otim',
    bio: {
      paragraphs: [
        'Martin is our resident numbers aficionado. With over 20 years in finance, operations and leadership, he brings a formidable command of the numbers behind the business, from financial strategy and risk to governance, compliance and the all-important bottom line.',
        'As MAAD McCann’s Finance Director, Martin keeps the business financially sharp, operationally sound and firmly on course. He may occasionally take the scenic route through a story or two along the way, but when it comes to the numbers, Martin gets the job done and the books balanced.',
      ],
      brands:
        'MAAD McCann, Namekara Mining Co. Ltd, East African Roofings, FINCA International, Air Uganda, M-Cash Uganda Ltd, The Observer Media Limited, Monitor Publications Ltd, Car & General Uganda Ltd, NSSF Uganda, SESA and Abt Associates.',
      projects:
        'The Observer Credit & Revenue Management Turnaround, NSSF Uganda Debt & Revenue Management Training and FINCA Energy Project with donor partners including SESA and Abt Associates.',
    },
  },
  'irene-namaganda': {
    name: 'Irene Namaganda',
    bio: {
      paragraphs: [
        'Irene is often the first face you’ll see at MAAD, but keeping the front of house running is only the beginning. As Head of Operations, she’s one of the people making sure everything behind the scenes works just as smoothly, overseeing the people, processes and day-to-day operations that keep the agency moving.',
        'Her MAAD journey began in Accounts in 2015, giving her a strong financial foundation before she moved into operations leadership in 2019. Today, her remit spans HR, administration, procurement, budgets, policies, workplace operations and staff welfare. Highly organised, detail-oriented and always on top of the moving parts, Irene helps make sure everyone else can get on with making great work.',
      ],
    },
  },
  'denis-kajura': {
    name: 'Denis Kajura',
    bio: {
      paragraphs: [
        'Give Denis a blank canvas and he’ll find a hundred ways to make it interesting, along with a hilariously random story to go with it. An award-winning Senior Art Director with over 13 years in advertising, Denis brings an infectious passion for design to everything he touches, turning ideas into bold visual stories that demand attention.',
        'Behind the humour is a seriously sharp creative mind with an eye for detail, a love for the craft and an instinct for pushing an idea until it looks and feels just right. Named Art Director of the Year at the 2025 Silverback Awards and Graphic Designer of the Year at the 2025 Digital Media Awards, Denis’s accolades are testament to his creative excellence and the calibre of work he continues to deliver.',
      ],
      brands:
        'Coca-Cola, UNICEF, GOtv, Guinness, Uganda Baati and Rwenzori Water, Total Energies.',
    },
  },
  'patricia-mugisha': {
    name: 'Patricia Mugisha',
    bio: {
      paragraphs: [
        'Patricia believes there’s always a better way to say what needs to be said and she’ll probably keep writing until she finds it. With over 10 years in communications and content, she brings together strategic thinking, sharp editorial instinct and a love of language to create ideas and stories that connect with people, not just audiences.',
        'As Senior Copywriter at MAAD McCann, Patricia works across everything from the perfectly placed three-word headline to integrated campaigns, radio, film and brand storytelling. Her experience spans commercial brands, development communication and multi-country projects across East Africa, giving her an instinct for finding the human truth in even the most complex brief and turning it into something worth paying attention to.',
      ],
      brands:
        'Coca-Cola, Guinness, Tusker Lite, Tusker Malt, V&A, Pride Bank, GOtv, GIZ, Oxfam, Bloomberg Philanthropies, Vital Strategies, Aga Khan, Babolat, Mindray, Water Compass, Cacao Latitude, KCCA, East African Community Secretariat, Office of the Prime Minister, International Trade Centre (ITC), Ministry of Tourism, CWG and MAAD McCann.',
      projects:
        'Tusker Lite Neon Runs, Tusker Lite Neon Raves, Tusker Lite Rwenzori Marathon, Guinness Match Day, Rotary Cancer Run, Tembea Nyumbani – East African Community Secretariat and Speeding Kills – KCCA, Vital Strategies & Bloomberg Philanthropies.',
    },
  },
  'kirunda-charles-victor': {
    name: 'Kirunda Charles Victor',
    bio: {
      paragraphs: [
        'When Charles locks onto an idea, everything else becomes background noise. A multidisciplinary Art Director with a sharp eye and an even sharper focus, he immerses himself in every project, digging into the strategy, culture and human insight behind it before turning that thinking into work that feels fresh, intentional and impossible to overlook.',
        'His process moves comfortably between design, art, technology and culture, driven by a belief that good-looking work isn’t enough; it has to mean something too. From building visual identities to shaping campaigns and creative systems, Charles brings curiosity, craft and serious creative focus to the table, always searching for a fresher way to bring an idea to life.',
      ],
      brands:
        'Airtel, Uganda Baati, Coca-Cola Beverages, Forna Foods, UNBS, Tru Ikon, Ag-Ploutos, WPP-Scangroup and MAAD McCann.',
      projects:
        'Airtel Campaigns & Office Branding, Tru Ikon Lipstick & Clothing Campaigns, Ag-Ploutos Agricultural Campaigns, plus creative and design work for Uganda Baati, Coca-Cola Beverages, Forna Foods and UNBS.',
    },
  },
  'ritah-nakazibwe': {
    name: 'Ritah Nakazibwe',
    bio: {
      paragraphs: [
        'Agency traffic can get messy. Ritah keeps it moving and makes it look good while she’s at it. As MAAD McCann’s resident people wrangler, she keeps briefs moving, deadlines in check and teams pointed in the same direction, bringing order, energy and an impressive amount of composure to the beautiful chaos of agency life.',
        'With a background spanning advertising, film and television, Ritah understands both the creative process and what it takes to get great work across the finish line. Equal parts problem-solver, collaborator and coordinator, she has a talent for keeping people, projects and clients moving together because behind every smoothly delivered campaign is someone making sure nothing falls through the cracks.',
      ],
      brands:
        'MultiChoice, Coca-Cola, Tusker Malt Lager, Guinness, Rotary, Tusker Lite, Pride Bank, UNICEF, Uganda Baati, BellaZuri and Casabella Homeware.',
      projects:
        'Guinness Bright House, Rotary Cancer Run, MultiChoice @30 Years, Tusker Malt Open Golf, Uganda Baati Orientile Campaign, Run for the Nile, Tusker Lite Turn on Your Lite, UNICEF IDEC Campaign, BellaZuri Roots of Beauty, GOtv Tukuwadeko, Malayo ne Pride, Tusker Lite Rwenzori Marathon, Tusker Lite Neon Rave Campaign, GOtv Ffe Tulina Content, Sanyu, Threads of Tomorrow, Satire in Puppetry and Estranged.',
    },
  },
  'robert-kizito': {
    name: 'Robert Kizito',
    bio: {
      paragraphs: [
        'Robert is a storyteller who just happens to have advertising as his favourite stage. With a background in Drama and Film, he brings a storyteller’s instinct, a copywriter’s obsession with the big idea and a director’s eye for how it all comes together, crafting everything from sharp commercial campaigns to stories designed to shift behaviours and change lives.',
        'Funny, unconventional and endlessly curious, Robert has a knack for finding ideas that people don’t just see or hear but remember. His work has earned him Copywriter of the Year at both the 2025 Silverback Awards and 2025 DMA Awards, proof that behind all the wizardry is some seriously good craft.',
      ],
      brands:
        'UNICEF, UNDP, Action 4 Health Uganda, Aga Khan Foundation, VSO, RTI International, PSI, UNCDF, Human Diagnostics Uganda, Rotary Club of Uganda, Rotary Club of Kampala Central, Rotary Club of Jinja, Zero Waste Africa, CiplaQCIL, GOtv Uganda, KCB Bank Uganda, PostBank Uganda, Prudential Uganda, Ugachick, BellaZuri, Coca-Cola Beverages Uganda and Uganda Breweries Limited.',
      projects:
        'Intervention for Disability in Early Childhood (IDEC) – We All Can, Let’s Act; End Child Marriage – Put in More Time; UNICEF Immunization Songs – Why Gamble?; IPALSE – Where Do We Want to Be? / What Are We Missing?; Maverick Next – Tuteese; GOtv Ka Weekie; It’s On – Season Ewoome; Crown Your Home with Orientile; GOtv Your BFF; Tweyagale – Ffe Tulina Content; Football Madness; Nonstop Football – Pressure Ku Pressure; Home of Our Stars; Wulira Omuliro; Together We Do; Linnya Grade Neera; GOtv Supa Etuuse; Kikubire Ewaka; and Liigi Z’abanene.',
    },
  },
  'ryan-ssendagire': {
    name: 'Ryan Ssendagire',
    bio: {
      paragraphs: [
        'Ryan’s designs don\'t just catch the eye, they start conversations. A fiercely creative thinker with an instinct for ideas that get people talking, he combines bold visual thinking with strong concept development to create work that doesn’t simply look good, it has something to say.',
        'From graphic design and motion to 3D, digital media and emerging AI tools, Ryan is constantly exploring new ways to push an idea further. His process is thoughtful, his execution is sharp, and his creative ambition is impossible to miss.',
      ],
      brands:
        'Pride Bank, Rotary, UNCDF, Vision Group and MAAD McCann.',
      projects:
        'Take Pride Campaign, Malayo ne Pride Campaign, Run for the Nile 2026, Rotary Cancer Run and UNCDF Business Ku Ssimu Yo Campaign.',
    },
  },
  'victor-sengooba': {
    name: 'Victor Sengooba',
    bio: {
      paragraphs: [
        'Different brand, different brief, different canvas; Victor moves between them with ease. A multidisciplinary creative with a sharp eye for visual storytelling, he brings ideas to life across still and motion graphics, web design and UI/UX, adapting his thinking to each brand while never losing sight of what makes the work distinctive.',
        'Versatile, detail-driven and always evolving his craft, Victor has an ability to switch creative gears without missing a beat. His work on the UNICEF End Child Marriage campaign has earned recognition at the Luum Awards, Sanisss Awards and Silverback Awards, a strong testament to the quality and impact of his growing body of work.',
      ],
      brands:
        'Coca-Cola, Tusker Malt Lager, Guinness, UNICEF, Uganda Baati, CCBU, Rwenzori, Liberty Insurance, Raxio, Federation of Small & Medium Enterprises Uganda, Global Arch Investments, Ecomart Supermarket, Inspire Africa, Ajenor Hotel, Dream Architects, Capital One Group, Kahill Insights and MAAD McCann.',
      projects:
        'UNICEF End Child Marriage, Coca-Cola Easter Campaign 2026, Uganda Baati 60-Year Celebration Video, CCBU Namanve @25, Share a Coke, Ecomart Supermarket Rebranding, Ajenor Hotel Website Development, Inspire Africa Coffee Website and Dream Architects Website Development.',
    },
  },
  'shama-victor-ntambi': {
    name: 'Shama Victor Ntambi',
    bio: {
      paragraphs: [
        'Pressure doesn’t faze Shama. If anything, it sharpens his focus. Calm, hardworking and seriously creative, he brings a steady hand and a sharp design mind to every brief, turning ideas into thoughtful visual work across digital, print and motion.',
        'Behind that calm exterior is a designer who cares deeply about the craft. Shama combines strong conceptual thinking with an eye for detail, approaching every project with patience, purpose and a determination to get the work right. No matter how intense the brief gets, his creativity never seems to lose its cool.',
      ],
      brands:
        'UNICEF, Tusker Lite, Uganda Batteries, Uganda Baati, Guinness and MAAD McCann.',
      projects:
        'UNICEF IDEC, Tusker Lite Rwenzori Marathon, Dumuzaz.',
    },
  },
  'clinton-tumukunde': {
    name: 'Clinton Tumukunde',
    bio: {
      paragraphs: [
        'Clinton has a sharp eye for what’s fresh, what’s next and what actually works. A plugged-in creative with a strong instinct for contemporary design, he brings fresh thinking to every brief, combining what’s happening in culture and design with ideas that make sense for the brand.',
        'Creative, curious and seriously dependable, Clinton moves comfortably across graphic design, motion, 3D and animation, turning ideas into work that feels current without losing sight of the job it needs to do. He keeps his eye on what’s next and his mind firmly on getting the work done.',
      ],
      brands:
        'Tusker Lite, Guinness, Uganda Baati, Kaledonian, MAAD McCann, The Brand Factory and I3 Media.',
      projects:
        'Tusker Lite Mt Rwenzori Marathon, Tusker Lite Neon Raves and Runs.',
    },
  },
  'bonny-mukisa': {
    name: 'Bonny Mukisa',
    bio: {
      paragraphs: [
        'For Bonny, managing a brand means caring about it like it’s his own. Dependable, hardworking and deeply invested in the brands he looks after, he brings equal parts creativity and analytical thinking to digital; building communities, creating content and constantly looking for ways to make the work perform better.',
        'From strategy and paid media to influencer management, live event coverage and performance reporting, Bonny is the kind of digital all-rounder who sees things through from idea to impact. His work on the Pepsi Uganda Rebrand earned two Bronze wins at the Silverback Awards, recognition that reflects both the thinking behind the work and the commitment he brings to getting it right.',
      ],
      brands:
        'Pepsi, Mirinda, Sting, Nirvana, Aquafina, Mountain Dew, 7UP, Crown Beverages Limited, Coca-Cola, Fanta, Pride Bank, Tusker Lite, Uganda Baati, C-Care Uganda, KOBs Rugby Club, CEO Summit Uganda, Uganda Development Bank, Ford Uganda, Roke Telkom, PSI Uganda, Rotary and MAAD McCann.',
      projects:
        'Pepsi Uganda Rebrand, Mirinda Uganda Rebrand, Pepsi Schools Alumni Champions League Launch, University Football League, Rotary Cancer Run, Sting Uganda Boxing Champions League, Thirsty For More Launch, Pride Bank Rebrand, Fanta Pineapple Launch, Tusker Lite Mt. Rwenzori Marathon, Rwenzori 10 Liter Launch, Safal Uganda Baati Foundation, 7UP Uganda Launch, Share A Coke and Coke RGB.',
    },
  },
  'jane-asiimwe': {
    name: 'Jane Asiimwe',
    bio: {
      paragraphs: [
        'If it’s happening online, trust that Jane is in the know. As a plugged-in, true digital It Girl, she brings an infectious love for the work to every brand she touches, combining an instinct for what gets people talking with the strategic thinking to turn attention into meaningful engagement.',
        'Jane poses a detail-oriented digital mind that knows how to make content work harder. From campaign planning and community engagement to storytelling and performance, she brings equal parts enthusiasm and intention to the job. For her, digital isn’t simply where she works; it’s where she feels right at home.',
      ],
      brands:
        'GOtv, Coca-Cola Beverages, Liquid Intelligent Technologies, Pride Bank Uganda, Viya Health Uganda, Phaneroo Ministries, BellaZuri, British High Commission, Iyosa Café & Restaurant, Mulago Hospital and MAAD McCann.',
      projects:
        'GOtv Ka Weekie Subscription Campaign, Pride Bank Uganda Institutional Rebranding Campaign, Viya Health Uganda Digital Engagement Campaigns and Phaneroo Ministries Event Communication & Social Media Campaigns.',
    },
  },
  'alvin-mugisha': {
    name: 'Alvin Mugisha',
    bio: {
      paragraphs: [
        'Alvin knows a good play when he sees one. A passionate football maestro and a sharp digital operator, he brings strategy, creativity and a strong instinct for audience engagement to the brands he manages and, most importantly, he knows how to get the work over the line.',
        'His background in film and television adds another dimension to how he thinks about content, giving him an eye for storytelling that goes beyond the feed. From digital strategy and community management to content and live coverage, Alvin is adaptable, collaborative and reliably gets the job done; the kind of player every team wants in its starting eleven.',
      ],
      brands:
        'Pride Bank, Tusker Malt, Tusker Lite, Rotary, Pepsi, Mantra, Yellow Bird, MAAD McCann, Manzi Media Limited, Fun Factory Limited, Fine Media Limited and Evoke Uganda.',
      projects:
        'Pride Bank Rebrand, Rotary Cancer Run, Tusker Malt 100 Club, Tusker Lite Mt. Rwenzori Marathon, Tondeka Facility, Malayo Ne Pride, Juniors’ Drama Club Seasons 1 & 2, Popi Season 1, Patoranking Live in Kampala, Isaiah Katumwa Live in Kampala, Evoke Night, Evoke Uganda Brand Ambassador Programme, Little Rides Launch and Joe Walker Hoima Safety Walk.',
    },
  },
  'jennifer-achiro': {
    name: 'Jennifer Achiro',
    bio: {
      paragraphs: [
        'Jennifer is the kind of person you give a job to and know it’s getting done. A communications professional with a strong execution mindset, she works across PR, events and below-the-line marketing, bringing together people, plans and moving parts to deliver work that makes an impact.',
        'From media relations and stakeholder engagement to product launches, corporate communications and on-ground activations, Jennifer is comfortable seeing projects through from concept to delivery. Her experience also includes a secondment to Uganda Breweries Limited, where she worked across internal and external communications, corporate reputation and employee engagement, adding even more range to an already versatile communications toolkit.',
      ],
      brands:
        'Coca-Cola Beverages Uganda (CCBU), Cipla Quality Chemicals, Uganda Baati, Pearl Bank Uganda, Mastercard Foundation, UN Women, GIZ, Uganda Breweries Limited, UNBS, GreenLight Planet and MAAD McCann.',
      projects:
        'NAM and G77 Summit 2024, Uganda Baati @60 Stakeholder Engagement, Uganda Baati Lifestyle Campaign, E-Mobility Project Launch, 16 Days of Activism, Women in Agribusiness Exhibition – Regional, Drink IQ Campaign, Menstrual Health Symposium, Rwenzori Tusker Lite Marathon, African Girl Can Code Phase I, Elgon Basin Water Catchment Protection, Wrong Side of the Road Activation, Water O’Clock, Women Peace and Security Phase II Launch and Front Line Leadership Development Program.',
    },
  },
  'dillan-masengere': {
    name: 'Dillan Masengere',
    bio: {
      paragraphs: [
        'Dillan understands good communication should do more than get attention, it should move people. Working across PR, events and below-the-line marketing, he brings a thoughtful, strategic approach to building narratives, strengthening relationships and creating brand experiences that connect with the people they’re meant for.',
        'His experience spans commercial brands, development organisations and government, giving him a strong understanding of how communication shifts across audiences and contexts. From stakeholder engagement and media relations to activations and social-impact campaigns, Dillan combines creativity with structure to turn complex messages into clear, purposeful communication that gets the job done.',
      ],
      brands:
        'Coca-Cola Beverages Uganda (CCBU), Uganda Baati Limited, Pride Bank Limited, MultiChoice Uganda, UN Women, World Health Organization (WHO), United Nations Capital Development Fund (UNCDF), Prudential Uganda, White Cap Lager, Educate!, Forna Health Foods, Business Network International (BNI), Ministry of Agriculture, Animal Industry and Fisheries (MAAIF) and MAAD McCann.',
      projects:
        'National Oil Palm Project (NOPP), Emerging Leaders Program, Pride Bank Rebrand, Safal Women Circles, 16 Days of Activism, Uganda Climate Smart Agricultural Transformation Project (UCSATP), Food Security and Early Warning Information Dissemination, Pride Care/Malayo ne Pride, Rwenzori Tusker Lite Marathon, African Girl Can Code Phase I, National Oil Seeds Project (NOSP), Oba Fest, Winning as One, 10X MSME Digitalization and Front Line Leadership Development Program.',
    },
  },
  'eria-kitaka': {
    name: 'Eria Kitaka',
    bio: {
      paragraphs: [
        'Getting from A to B with Eria is rarely just a ride. Funny, personable and always good for a story, he has been keeping MAAD on the move since 2019, getting people and whatever else needs moving where they need to be.',
        'Reliable behind the wheel and great company along the way, Eria brings warmth and humour to even the most ordinary journey. He’s one of those people whose personality has become part of the fabric of the agency, proof that at MAAD, sometimes the best part of getting somewhere is who you’re getting there with.',
      ],
    },
  },
  'joseph-kabanda': {
    name: 'Kabanda Joseph',
    bio: {
      paragraphs: [
        'Kabanda has been part of the fabric of MAAD since 2013. A familiar face and a steady hand, he brings reliability, discretion and a natural way with people to everything he does, whether he’s dealing with clients, handling an important errand or simply helping keep the agency running smoothly.',
        'A staunch Catholic whose values are reflected in the way he carries himself and approaches his work, Kabanda is trusted for his confidentiality and his ability to deal comfortably with people from all walks of life. After more than a decade with the agency, he is much more than the work he does. He is part of the heart of this place, and quite simply, MAAD wouldn’t feel the same without him.',
      ],
    },
  },
  'ali-kigozi': {
    name: 'Ali Kigozi',
    bio: {
      paragraphs: [
        'MAAD has been in good hands with Ali since 2016, and considerably more entertaining ones too. A musician, singer, songwriter and comedian, Ali brings plenty of personality to the everyday rhythm of the agency, while quietly making sure the spaces we work, think and create in are always clean, cared for and ready for whatever the day brings.',
        'Dependable, hardworking and an important part of the MAAD family, Ali is one of those people whose contribution is felt every single day. Great work needs a great place to happen, and for nearly a decade, Ali has helped make sure we have one, along with the occasional soundtrack.',
      ],
    },
  },
  'hawa-nakatunde': {
    name: 'Hawa Nakatunde',
    bio: {
      paragraphs: [
        'Behind every great piece of work is someone making sure the numbers add up. Hawa is one of those people. Capable and detail-driven, she brings a steady approach to the financial side of the business, keeping everything from budgets and billing to reconciliations and reporting firmly on track.',
        'Since joining MAAD in 2019, Hawa has managed finance across projects for commercial brands and development organisations alike. Her work spans budgeting, costing, statutory compliance, accounts management and project reconciliation, bringing the accuracy and accountability needed to keep ambitious work moving smoothly behind the scenes.',
      ],
      brands:
        'UNICEF, Warid Telecom, Uganda Health Marketing Group (UHMG), RTI International, Jesa Farm Dairy, MultiChoice, DStv, GOtv and MAAD McCann.',
      projects:
        'UNICEF U-Report Convention, Violence Against Children, Imagine Project, Ebola Campaign, Cholera Campaign, IECD & ICHDs Campaigns; Warid Mega Bonus, Double the Fun, Kakompola, Swing Ma Beat and Pakalast; UHMG Malaria Campaign (LLIN Net Usage & Distribution), Global Fund Malaria Project; RTI Corporal Punishment Project, Early Childhood Grade Reading Project; Jesa Flavoured Milk Campaign, Full of Life Campaign, Start Your Adventure Campaign, Go Back to School & Thematic Campaigns; MultiChoice Kyaddala Campaign and Festive Season Campaign.',
    },
  },
  'mark-william-masolo': {
    name: 'Mark William Masolo',
    bio: {
      paragraphs: [
        'With Mark watching the numbers, the coffers are in safe hands. Calm, dependable and always on top of things, he brings over eight years of finance experience to the table, combining a sharp analytical mind with the steady judgement needed to keep the business financially sound.',
        'At MAAD, Mark works across financial reporting, analysis, budgeting, compliance and controls, while helping guide the wider finance team and support sound business decisions. His experience also extended beyond the agency as Deputy Treasurer of the Uganda Advertisers Association, bringing the same measured approach to governance and financial stewardship. When it comes to the numbers, Mark keeps a cool head and a very close eye.',
      ],
      brands:
        'MultiChoice, UNICEF, Pride Bank, Uganda Breweries Limited, Uganda Baati, Uganda Advertisers Association, Fireworks Advertising and MAAD McCann.',
      projects:
        'Financial management and support across MultiChoice, UNICEF, Pride Bank, Uganda Breweries Limited and Uganda Baati.',
    },
  },
  'faizal-bukenya': {
    name: 'Faizal Bukenya',
    bio: {
      paragraphs: [
        'Faizal knows that where a brand shows up can matter just as much as what it says. With over a decade of experience in media strategy, planning and buying, he combines audience insight, data and a deep understanding of the media landscape to build campaigns that reach the right people in the right places.',
        'At MAAD, Faizal has risen through the media ranks from Planner to Senior Media Planner and Media Manager, building expertise across research, negotiation, campaign optimisation and performance reporting. His portfolio spans major commercial brands and development organisations, giving him the experience to navigate complex media challenges and turn insight into impact.',
      ],
      brands:
        'UNICEF, WHO, UNDP, UNHCR, Uganda Health Marketing Group (UHMG), MultiChoice, DStv, GOtv, Emirates, Johns Hopkins University/JHU, Communication for Healthy Communities (CHC), USAID, Malaria Consortium and MAAD McCann.',
      projects:
        'SBCA by JHU, Obulamu? by CHC, Stop Malaria Project, plus media work for UNICEF, WHO, UNDP, UNHCR, UHMG, MultiChoice (DStv & GOtv), Emirates and Malaria Consortium.',
    },
  },
  'robert-mukobe': {
    name: 'Robert Mukobe',
    bio: {
      paragraphs: [
        'Robert has spent over 15 years mastering everything media. From planning and buying to negotiation, placement and campaign management, he brings deep industry knowledge and a strategic eye to making sure brands show up effectively and media plans deliver against their objectives.',
        'With experience spanning commercial brands, social marketing and development communication, Robert knows how to navigate different audiences, sectors and media challenges. At MAAD, he leads media strategy, planning and budget management, drawing on years of relationships and market knowledge to deliver campaigns with precision and purpose.',
      ],
      brands:
        'GOtv Uganda, MultiChoice, Uganda Baati, Uganda Breweries, Orange Uganda, MTN Uganda, Stanbic Bank, Uganda Wildlife Authority, Bella Zuri, Samsung, Colgate-Palmolive, UNICEF, UNCDF, UNDP, Marie Stopes, Communication for Healthy Communities (CHC), Malaria Consortium, Save the Children International Uganda, MAAD and QG Saatchi & Saatchi.',
      projects:
        'UNICEF, UNCDF, UNDP, Marie Stopes Stop Malaria Project, HCP – Safe Male Circumcision, AFFORD, National Net Distribution and media work for GOtv Uganda, Uganda Baati, Uganda Breweries, Orange Uganda, MTN Uganda, Stanbic Bank, Uganda Wildlife Authority, Bella Zuri, Samsung, Colgate-Palmolive, CHC, Malaria Consortium and Save the Children International Uganda.',
    },
  },
  'christine-nassaka': {
    name: 'Christine Nassaka',
    bio: {
      paragraphs: [
        'Tina brings bright energy to a job that runs on serious numbers. Affable, vibrant and sharp at what she does, she combines an analytical mind with a strong understanding of the media landscape to build and execute plans that put brands in front of the audiences that matter.',
        'From planning, buying, scheduling, negotiation and reporting, Tina keeps a close eye on both the detail and the bigger picture. Her experience spans commercial brands and development communication, where she uses data, audience insight and good judgement to keep campaigns running smoothly and delivering effectively.',
      ],
      brands:
        'MultiChoice, DStv, GOtv, UNICEF, Johns Hopkins University/JHU, Emirates, Forna Foods, UNCDF, Uganda Baati, Bella Zuri and MAAD McCann.',
      projects:
        'UNICEF Malaria Vaccine Campaign, UNICEF Routine Immunization Campaign, UNICEF Ebola WASH Campaign, UNICEF Red Eyes Campaign and SBCC Co-creation for Development of Immunization Songs in Mukono, plus media work for MultiChoice (DStv & GOtv), JHU, Emirates, Forna Foods, UNCDF, Uganda Baati and Bella Zuri.',
    },
  },
  'chrispus-kushemererwa': {
    name: 'Chrispus Kushemererwa',
    bio: {
      paragraphs: [
        'For Chrispus, SBCC isn’t simply an area of expertise; it’s the work he has built his career around. With over eight years of experience, he brings a deep understanding of how communication can move beyond messages to influence behaviours, strengthen communities and create meaningful, lasting change.',
        'His experience stretches from community engagement and formative research to strategy development, Human-Centered Design, message development and large-scale campaign implementation. Having worked extensively across public health, education, nutrition, early childhood development and social change, Chrispus knows that effective SBCC starts with understanding people and designing solutions with them, not just for them.',
      ],
      brands:
        'UNICEF, USAID, Family Health International (FHI 360), Communication for Healthy Communities/Obulamu, USAID Maternal Child Health and Nutrition Activity, KCCA, Government of Uganda and MAAD McCann.',
      projects:
        'End Child Marriage Campaign, Interventions for Disabilities in Early Childhood (IDEC), Immunization Songs & Videos, Public Health Emergency Message Development & Translation, Basic Requirements and Minimum Standards, Gender for Development Uganda (G4DU), USAID Communication for Healthy Communities/Obulamu, USAID Maternal Child Health and Nutrition Activity, Smart Paper COVID-19 Vaccination Data Initiative, plus SBCC interventions across family planning, HIV prevention, maternal and child health, nutrition, malaria, tuberculosis and Ebola risk communication.',
    },
  },
  'dorothy-kirabo': {
    name: 'Dorothy Kirabo',
    bio: {
      paragraphs: [
        'Kirabo brings the kind of energy that makes good work and good working relationships feel easy. Warm, capable and seriously good at what she does, she combines an instinct for people with a deep understanding of brands, strategy and the business behind the work.',
        'Her MAAD journey has taken her from managing the flow of work across the agency to leading client relationships and integrated campaigns, giving her a rare understanding of what it takes to move an idea from brief to market. And the work has the recognition to match: GOtv Kaweekie won over 19 awards, Kirabo was named Strategist of the Year 2025, and Tweyagale – Fe Tulina Content took home Campaign of the Year at the 2024 Africhoice Awards. She knows the work, knows the business and is, quite simply, an incredible asset to have in your corner.',
      ],
      brands:
        'GOtv, MultiChoice Uganda, Ugachick, KCB, Bella Zuri, Cairo Bank Uganda, MAAD Advertising, Scanad Uganda Limited and Winsor Consult Ltd.',
      projects:
        'GOtv Kaweekie Campaign, GOtv Supa+ Package Launch, Pearl Magic Launch on GOtv & DStv, Kampala Crème Launch, Home of Our Stars, GOtv Tweyagale – Fee Tulina Content Festive Campaign, Ugachick Supa Pack Launch, Cairo Bank Uganda “Growing With You” Rebrand, Tukuwaddeko, Tukuwaddeko Nera, Step Up, Linya Grade, Linya Grade Nera, Wulira Omuliro, Ndiiba Ku Ndiiba, MukkoMukko, Saawa Ya Kikuuba, Topowa and Kyaffee Daala.',
    },
  },
  'janet-nakazzi': {
    name: 'Janet Nakazzi',
    bio: {
      paragraphs: [
        'Janet doesn’t just show up for the work; she shows up for whatever the work demands. Passionate, dependable and exceptionally assured in what she does, she has spent over a decade at MAAD helping turn complex briefs into well-run campaigns, bringing clarity, structure and a steady hand to every project she leads.',
        'From managing long-standing client relationships to coordinating teams, budgets, events and large-scale communication programmes, Janet has built a reputation for seeing things through and holding the work to a high standard. Her experience cuts across commercial and development communication, with landmark assignments for UNICEF, IFC/World Bank, Ugachick, Jesa Farm Dairy and Bank of Africa; the kind of track record that only comes from years of consistent delivery.',
      ],
      brands:
        'UNICEF Uganda, IFC, World Bank, Ugachick Poultry Breeders, Jesa Farm Dairy, Bank of Africa, Uganda Insurance Commission, Orange, EACO, Warid Telecom Uganda, Airtel Uganda, Hospice Uganda, Uganda Cancer Institute and MAAD McCann.',
      projects:
        'UNICEF Communication Strategies & Campaigns (2014–2024), UNICEF Adolescent Voices Communication Strategy & Campaign, Integrated Early Childhood Development Communication Strategy & Campaign, Kampala Waste Management PPP Project – IFC/World Bank, Ugachick Brand Positioning Campaign, Jesa Farm Dairy Market Growth Campaigns, Bank of Africa Mobile Wallet Launch, Orange Expo, EACO Conference, UNICEF Youth & CRC@25 Conferences and Uganda Insurance Commission Research & Rebranding.',
    },
  },
  'ihvan-imara-nova': {
    name: 'Ihvan Imara Nova',
    bio: {
      paragraphs: [
        'Ihvan knows how to keep clients, teams and campaigns moving in the same direction. A focused and highly capable client service professional, he brings a strong understanding of brand and communication to the table translating what clients need into clear direction and making sure the work gets where it needs to go.',
        'With a background spanning client service, PR, digital communications and brand management, Ihvan is comfortable at the centre of an integrated campaign, connecting strategy, creative, media, PR, digital and production. Adaptable and delivery-focused, he understands that great client service is about more than managing an account, it’s about knowing the business, owning the process and seeing the work through.',
      ],
      brands:
        'Uganda Breweries Limited, Uganda Baati, Uganda Women Entrepreneurs Association Limited (UWEAL), Capital One Group Uganda, Public Relations Association of Uganda (PRAU) and MAAD McCann.',
      projects:
        'Uganda Breweries Premium Beer Brands Campaigns, Uganda Baati Integrated Communication Campaigns, FMCG & Telecommunications Brand Campaigns, Social and Behavioral Change Communication (SBCC) Campaigns, UWEAL Digital Visibility & Communications Initiatives and Health & Beauty Consumer Campaigns.',
    },
  },
  'eric-musinguzi': {
    name: 'Eric Musinguzi',
    bio: {
      paragraphs: [
        'Eric knows his brands beyond the brief. Cool, personable and deeply invested in the business, he combines an easy way with people with a sharp understanding of the brands he manages, making him as comfortable building client relationships as he is getting into the details of a campaign.',
        'Eric brings together brand strategy, client service, media and business development experience to keep great work moving from brief to market. Always on the ball, he understands what his clients need, what their brands stand for and what it takes to bring the two together. Eric knows his brands and he’s about the business.',
      ],
      brands:
        'Guinness Uganda, Tusker Malt Lager, Tusker Lite, Coca-Cola Beverages Uganda, Pepsi, Crown Beverages Limited, Stanbic Bank, Unilever Uganda, Africa Plantation Capital Ltd, Numb3rs Finance & Investment Ltd, Home Bliss Fort Portal, Computech System Solutions Ltd, Uganda Electricity Transmission Company Ltd, Saladin Media Advertising Ltd and MAAD McCann.',
      projects:
        'Pepsi Twangula, Pepsi Tukonectinge, plus campaign work for Guinness Uganda, Tusker Malt Lager, Tusker Lite and Coca-Cola Beverages Uganda.',
    },
  },
  'erinah-luyuyo': {
    name: 'Erinah Luyuyo',
    bio: {
      paragraphs: [
        'Erinah understands people, and that’s a pretty good place to start in business development. With over a decade of experience spanning customer service, marketing, sales and humanitarian work, she brings strong communication skills, resourcefulness and a natural ability to build relationships and solve problems.',
        'Her career has taken her from MAAD to telecoms and international development, working across client service, operations and stakeholder coordination before finding her way back to where it started. That breadth of experience gives Erinah a distinctly people-first approach to the work: listening closely, understanding what’s needed and helping turn it into solutions that work.',
      ],
      brands:
        'International Organization for Migration (IOM)/UN Migration, Airtel Uganda, Africell Uganda, Orange Uganda, Unik Promos and MAAD Advertising.',
    },
  },
  'douglas-baalaga': {
    name: 'Douglas Baalaga',
    bio: {
      paragraphs: [
        'Rain or shine, early call time or last-minute change, Doug shows up ready to get the shot. Flexible, hardworking and endlessly dependable, he brings over a decade of visual storytelling experience to MAAD, combining photography, video and design to capture moments and turn them into stories worth seeing.',
        'Doug’s versatility means he’s just as comfortable behind the camera as he is shaping the final visual output. From brand shoots and events to video production and post-production, he brings a collaborative spirit, a keen eye, the kind of work ethic every production needs and whatever it takes to bring the story to life.',
      ],
      brands:
        'Coca-Cola Beverages Uganda (CCBU), Pride Bank, Tusker Lite, V&A, Uganda Baati, Uganda Breweries Limited (UBL), ICPAU, Rotary, MAAD McCann, Efficiencie, Blanket Media, Vidiyo in Business, Calidad Images and Christos Rhema Church.',
      projects:
        'CCBU Valentine’s Content, CCBU & Uganda Baati Women’s Day Content, CCBU Employer of the Year Videos, CCBU Ascend Launch, CCBU MARK Trade Content, Bakaima & Pride Bank Photo and Video Shoot, Tusker Lite Neon Rave Video Editing, V&A Pitch Video Shoot, Uganda Baati Staff Town Hall Photoshoot, Kabaka Run Photoshoot, UBL Katikkiro Courtesy Visit Photoshoot, UBL Kamuli Showroom Launch Photoshoot, ICPAU Photoshoot, Rotary Run Photoshoot and UBL Sales Cake Cutting Photoshoot.',
    },
  },
} satisfies Record<string, TeamPerson>;

type Slug = keyof typeof PEOPLE;

function member(slug: Slug, title: string): TeamMember {
  const person: TeamPerson = PEOPLE[slug];
  return {
    slug,
    title,
    ...person,
    image: {
      src: `/team/${slug}-800.webp`,
      srcSet: `/team/${slug}-400.webp 400w, /team/${slug}-800.webp 800w`,
      width: 800,
      height: 1200,
      alt: `${person.name}, ${title}`,
    },
  };
}

const section = (id: string, title: string, columns: number, members: TeamMember[]): TeamSection => ({
  id,
  title,
  columns,
  members,
});

export const team: TeamPage = {
  seo: {
    title: 'The MAAD Ones',
    description:
      'Strategists, storytellers, designers, makers, media minds and problem-solvers. Meet the people behind the MAADness at MAAD McCANN in Kampala.',
  },

  hero: {
    src: '/team/team-hero-1600.webp',
    srcSet:
      '/team/team-hero-960.webp 960w, /team/team-hero-1600.webp 1600w, /team/team-hero-2400.webp 2400w',
    width: 2400,
    height: 1305,
    alt: 'The MAAD McCANN team gathered around the boardroom table in front of a painted mural',
  },

  intro: {
    accent: 'Different minds.',
    headline: 'One beautiful MAAD way of thinking.',
    body: 'We are strategists, storytellers, designers, makers, media minds, digital natives and problem-solvers brought together by the belief that ordinary work has no business leaving this building. We think big, challenge the obvious and make ideas that move people, brands and business forward. Meet the minds behind the MAADness.',
  },

  /** Rendered top to bottom. A pair renders side by side on wide screens, as in the design. */
  rows: [
    section('board', 'Meet the Board', 5, [
      member('mike-kafeero', 'Director'),
      member('annette-ssebba', 'Board Secretary'),
      member('joseph-bagabo', 'Board Chairman'),
      member('marx-rukundo', 'Board Member'),
      member('adris-kamuli', 'Managing Director'),
    ]),
    section('management', 'Management', 5, [
      member('adris-kamuli', 'Managing Director'),
      member('clare-bamwine', 'Media Director'),
      member('mike-kafeero', 'Head Of Production'),
      member('peter-kazibwe', 'Creative Director'),
      member('aggrey-muganga', 'SBCC Manager'),
      member('abel-mugume', 'Head of Business Development'),
      member('joy-tushabe', 'Head of Digital'),
      member('allen-suubi-ssempa', 'Head of Public Relations'),
      member('martin-lee-otim', 'Finance Director'),
      member('irene-namaganda', 'Head of Operations'),
    ]),
    section('creative', 'Creative', 5, [
      member('peter-kazibwe', 'Creative Director'),
      member('denis-kajura', 'Senior Art Director'),
      member('patricia-mugisha', 'Senior Copywriter'),
      member('kirunda-charles-victor', 'Art Director'),
      member('ritah-nakazibwe', 'Traffic Manager'),
      member('robert-kizito', 'Copywriter'),
      member('ryan-ssendagire', 'Graphics Design Executive'),
      member('victor-sengooba', 'Graphics Design Executive'),
      member('shama-victor-ntambi', 'Graphics Design Executive'),
      member('clinton-tumukunde', 'Graphics Design Executive'),
    ]),
    [
      section('digital', 'Digital', 4, [
        member('joy-tushabe', 'Head of Digital'),
        member('bonny-mukisa', 'Digital Account & Community Manager'),
        member('jane-asiimwe', 'Digital Account & Community Manager'),
        member('alvin-mugisha', 'Digital Account & Community Manager'),
      ]),
      section('public-relations', 'Public Relations', 3, [
        member('allen-suubi-ssempa', 'Head of Public Relations'),
        member('jennifer-achiro', 'PR, BTL & Events Executive'),
        member('dillan-masengere', 'PR, BTL & Events Executive'),
      ]),
    ],
    [
      section('operations', 'Operations', 4, [
        member('irene-namaganda', 'Head of Operations'),
        member('eria-kitaka', 'Company Driver'),
        member('joseph-kabanda', 'Office Assistant'),
        member('ali-kigozi', 'Office Assistant'),
      ]),
      section('finance', 'Finance', 3, [
        member('martin-lee-otim', 'Finance Director'),
        member('hawa-nakatunde', 'Accountant'),
        member('mark-william-masolo', 'Accountant'),
      ]),
    ],
    [
      section('media', 'Media', 4, [
        member('clare-bamwine', 'Media Director'),
        member('faizal-bukenya', 'Media Planner'),
        member('robert-mukobe', 'Media Planner Executive'),
        member('christine-nassaka', 'Media Planner'),
      ]),
      section('sbcc', 'SBCC', 2, [
        member('aggrey-muganga', 'SBCC Manager'),
        member('chrispus-kushemererwa', 'SBCC Executive'),
      ]),
    ],
    section('business-development', 'Business Development', 6, [
      member('abel-mugume', 'Head of Business Development'),
      member('dorothy-kirabo', 'Business Development Executive'),
      member('janet-nakazzi', 'Business Development Executive'),
      member('ihvan-imara-nova', 'Business Development Executive'),
      member('eric-musinguzi', 'Business Development Executive'),
      member('erinah-luyuyo', 'Business Development Executive'),
    ]),
    section('production', 'Production', 2, [
      member('mike-kafeero', 'Head Of Production'),
      member('douglas-baalaga', 'Visual Content Creator'),
    ]),
  ],
};
