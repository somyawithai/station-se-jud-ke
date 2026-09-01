const fs = require('fs');
const path = require('path');

// Authoritative data extracted directly from Metro-LIST.xlsx
const CITIES_CONFIG = {
  agra: {
    id: 'agra',
    name: 'Agra',
    hindiName: 'आगरा',
    state: 'Uttar Pradesh',
    systemName: 'Agra Metro (UPMRC)',
    operator: 'Uttar Pradesh Metro Rail Corporation',
    activeLines: 1,
    totalStations: 6,
    interchanges: 0,
    establishedYear: 2024,
    networkLengthKm: 5.2,
    dailyRidership: '15,000+',
    centerCoordinates: [27.1767, 78.0081],
    tagline: 'Rapid transit serving the UNESCO Heritage corridor and historic city of Agra',
    description: 'Operational Yellow Line Priority section spanning Taj East Gate to Mankameshwar.',
    popularStations: ['agr-yel-taj-east-gate', 'agr-yel-taj-mahal', 'agr-yel-agra-fort', 'agr-yel-mankameshwar'],
    lines: [
      {
        id: 'agr-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन',
        code: 'L1',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Taj East Gate',
          'Shahid Captain Shubham Gupta (Basai)',
          'Fatehabad Road',
          'Taj Mahal',
          'Agra Fort',
          'Mankameshwar'
        ]
      }
    ]
  },

  ahmedabad: {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    hindiName: 'अहमदाबाद',
    state: 'Gujarat',
    systemName: 'Ahmedabad Metro (GMRC)',
    operator: 'Gujarat Metro Rail Corporation',
    activeLines: 4,
    totalStations: 57,
    interchanges: 3,
    establishedYear: 2019,
    networkLengthKm: 40.03,
    dailyRidership: '130,000+',
    centerCoordinates: [23.0225, 72.5714],
    tagline: 'Connecting Ahmedabad and Gandhinagar twin cities across 4 active metro corridors',
    description: '4 active lines spanning East-West, North-South, GNLU-Gift City and Mahatma Mandir corridors with 3 interchanges.',
    popularStations: ['ahm-blu-old-high-court', 'ahm-red-motera-stadium', 'ahm-vio-gnlu', 'ahm-blu-kalupur'],
    lines: [
      {
        id: 'ahm-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन',
        code: 'EW',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Thaltej Gam', 'Thaltej', 'Doordarshan Kendra', 'Gurukul Road', 'Gujarat University',
          'Commerce Six Road', 'SP Stadium', 'Old High Court', 'Shahpur', 'Ghee Kanta',
          'Kalupur', 'Kankaria East', 'Apparel Park', 'Amraivadi', 'Rabari Colony',
          'Vastral', 'Nirant Cross Road', 'Vastral Gam'
        ]
      },
      {
        id: 'ahm-red',
        name: 'Red Line',
        hindiName: 'रेड लाइन',
        code: 'NS',
        color: '#EF4444',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Motera Stadium', 'Sabarmati', 'AEC', 'Sabarmati Railway Station', 'Ranip',
          'Vadaj', 'Vijay Nagar', 'Usmanpura', 'Old High Court', 'Gandhigram',
          'Paldi', 'Shreyas', 'Rajiv Nagar', 'Jivraj Park', 'APMC'
        ]
      },
      {
        id: 'ahm-violet',
        name: 'Violet Line',
        hindiName: 'वायलेट लाइन',
        code: 'VIO',
        color: '#8B5CF6',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'GNLU', 'PDPU', 'Gift City'
        ]
      },
      {
        id: 'ahm-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन',
        code: 'YEL',
        color: '#F59E0B',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Mahatma Mandir', 'Sector 24', 'Sector 16', 'Juna Sachivalaya', 'Akshardham',
          'Sachivalaya', 'Sector 10A', 'Sector 1', 'Infocity', 'Dholakuva Circle',
          'Randesan', 'Raysan', 'GNLU', 'Koba Gam', 'Juna Koba',
          'Koba Circle', 'Narmada Canal', 'Tapovan Circle', 'Vishwakarma College', 'Koteshwar Road',
          'Motera Stadium'
        ]
      }
    ]
  },

  pune: {
    id: 'pune',
    name: 'Pune',
    hindiName: 'पुणे',
    state: 'Maharashtra',
    systemName: 'Pune Metro (Maha Metro)',
    operator: 'Maharashtra Metro Rail Corporation Limited',
    activeLines: 2,
    totalStations: 30,
    interchanges: 1,
    establishedYear: 2022,
    networkLengthKm: 33.2,
    dailyRidership: '140,000+',
    centerCoordinates: [18.5204, 73.8567],
    tagline: 'Connecting PCMC to Swargate and Vanaz to Ramwadi through the iconic Civil Court underground interchange',
    description: 'Spanning Aqua Line (Line 2) and Purple Line (Line 1) intersecting at Civil Court interchange.',
    popularStations: ['pun-aqu-civil-court', 'pun-pur-swargate', 'pun-aqu-pune-railway-station', 'pun-pur-pcmc-bhavan'],
    lines: [
      {
        id: 'pun-aqua',
        name: 'Aqua Line',
        hindiName: 'एक्वा लाइन',
        code: 'L2',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Vanaz', 'Anand Nagar', 'Ideal Colony', 'Nal Stop', 'Garware College',
          'Deccan Gymkhana', 'Chhatrapati Sambhaji Udyan', 'PMC Bhavan', 'Civil Court',
          'Mangalwar Peth', 'Pune Railway Station', 'Ruby Hall Clinic', 'Bund Garden',
          'Yerwada', 'Kalyani Nagar', 'Ramwadi'
        ]
      },
      {
        id: 'pun-purple',
        name: 'Purple Line',
        hindiName: 'पर्पल लाइन',
        code: 'L1',
        color: '#9333EA',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'PCMC Bhavan', 'Sant Tukaram Nagar', 'Nashik Phata', 'Kasarwadi', 'Phugewadi',
          'Dapodi', 'Bopodi', 'Khadki', 'Range Hills', 'Shivaji Nagar',
          'Civil Court', 'Kasba Peth', 'Mandai', 'Swargate'
        ]
      }
    ]
  },

  patna: {
    id: 'patna',
    name: 'Patna',
    hindiName: 'पटना',
    state: 'Bihar',
    systemName: 'Patna Metro (PMRC)',
    operator: 'Patna Metro Rail Corporation',
    activeLines: 1,
    totalStations: 3,
    interchanges: 0,
    establishedYear: 2025,
    networkLengthKm: 3.5,
    dailyRidership: '10,000+',
    centerCoordinates: [25.5941, 85.1376],
    tagline: 'Priority metro corridor serving Patna Bhootnath to New ISBT terminal',
    description: 'Operational Blue Line Priority section connecting Bhootnath, Zero Mile and New ISBT.',
    popularStations: ['pat-blu-new-isbt', 'pat-blu-zero-mile', 'pat-blu-bhootnath'],
    lines: [
      {
        id: 'pat-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन',
        code: 'L2',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Bhootnath',
          'Zero Mile',
          'New ISBT'
        ]
      }
    ]
  },

  noida: {
    id: 'noida',
    name: 'Noida',
    hindiName: 'नोएडा',
    state: 'Uttar Pradesh',
    systemName: 'Noida Metro (NMRC)',
    operator: 'Noida Metro Rail Corporation',
    activeLines: 1,
    totalStations: 22,
    interchanges: 0,
    establishedYear: 2019,
    networkLengthKm: 29.7,
    dailyRidership: '60,000+',
    centerCoordinates: [28.5355, 77.3910],
    tagline: 'Aqua Line connecting Sector 51 Noida to Greater Noida Depot',
    description: '29.7 km elevated corridor with 22 stations serving key tech parks, residential sectors and Greater Noida.',
    popularStations: ['noi-aqu-noida-sec-52', 'noi-aqu-pari-chowk', 'noi-aqu-noida-sec-137', 'noi-aqu-depot'],
    lines: [
      {
        id: 'noi-aqua',
        name: 'Aqua Line',
        hindiName: 'एक्वा लाइन',
        code: 'AQ',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Noida Sector 52', 'Noida Sector 51', 'Noida Sector 50', 'Noida Sector 76',
          'Noida Sector 101', 'Noida Sector 81', 'NSEZ', 'Noida Sector 83',
          'Noida Sector 137', 'Noida Sector 142', 'Noida Sector 143', 'Noida Sector 144',
          'Noida Sector 145', 'Noida Sector 146', 'Noida Sector 147', 'Noida Sector 148',
          'Knowledge Park II', 'Pari Chowk', 'Alpha 1', 'Delta 1', 'GNIDA Office', 'Depot'
        ]
      }
    ]
  },

  'navi-mumbai': {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    hindiName: 'नवी मुंबई',
    state: 'Maharashtra',
    systemName: 'Navi Mumbai Metro (CIDCO / Maha Metro)',
    operator: 'City and Industrial Development Corporation (CIDCO)',
    activeLines: 1,
    totalStations: 11,
    interchanges: 0,
    establishedYear: 2023,
    networkLengthKm: 11.1,
    dailyRidership: '30,000+',
    centerCoordinates: [19.033, 73.0297],
    tagline: 'Line 1 connecting CBD Belapur through Kharghar nodes to Pendhar Taloja',
    description: '11.1 km elevated line serving 11 stations from Belapur Terminal to Pendhar.',
    popularStations: ['nvm-l1-belapur-terminal', 'nvm-l1-utsav-chowk', 'nvm-l1-central-park', 'nvm-l1-pendhar'],
    lines: [
      {
        id: 'nvm-line1',
        name: 'Line 1',
        hindiName: 'लाइन 1',
        code: 'L1',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Belapur Terminal', 'RBI Colony', 'Belpada', 'Utsav Chowk', 'Kendriya vihar',
          'Kharghar village', 'Central park', 'Pethpada', 'Amandoot', 'Pethali taloja', 'Pendhar'
        ]
      }
    ]
  },

  nagpur: {
    id: 'nagpur',
    name: 'Nagpur',
    hindiName: 'नागपुर',
    state: 'Maharashtra',
    systemName: 'Nagpur Metro (Maha Metro)',
    operator: 'Maharashtra Metro Rail Corporation Limited',
    activeLines: 2,
    totalStations: 38,
    interchanges: 1,
    establishedYear: 2019,
    networkLengthKm: 38.2,
    dailyRidership: '95,000+',
    centerCoordinates: [21.1458, 79.0882],
    tagline: 'Connecting Orange and Aqua corridors with a 4-level interchange at Sitabuldi',
    description: '38 stations across Aqua Line (East-West) and Orange Line (North-South) intersecting at Sitabuldi.',
    popularStations: ['nag-aqu-sitabuldi', 'nag-ora-airport', 'nag-aqu-nagpur-railway-station', 'nag-ora-zero-mile'],
    lines: [
      {
        id: 'nag-aqua',
        name: 'Aqua Line',
        hindiName: 'एक्वा लाइन',
        code: 'EW',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Prajapati Nagar', 'Vaishnodevi Square', 'Ambedkar Square', 'Telephone Exchange',
          'Chitar Oli Square', 'Agrasen Square', 'Dosar Vaishya Square', 'Nagpur Railway Station',
          'Cotton Market', 'Sitabuldi', 'Jhasi Rani Square', 'Institute of Engineers',
          'Shankar Nagar Square', 'LAD Square', 'Dharampeth College', 'Subhash Nagar',
          'Rachana Ring Road Junction', 'Vasudev Nagar', 'Bansi Nagar', 'Lokmanya Nagar'
        ]
      },
      {
        id: 'nag-orange',
        name: 'Orange Line',
        hindiName: 'ऑरेंज लाइन',
        code: 'NS',
        color: '#F97316',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Automative Square', 'Nari Road', 'Indora Square', 'Kadvi Square',
          'Gaddigodam Square', 'Kasturchand Park', 'Zero Mile', 'Sitabuldi',
          'Congress Nagar', 'Rahate Colony', 'Ajni Square', 'Chhatrapati Square',
          'Jaiprakash Nagar', 'Ujjwal Nagar', 'Airport', 'Airport South',
          'New Airport', 'Khapri'
        ]
      }
    ]
  },

  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    hindiName: 'मुंबई',
    state: 'Maharashtra',
    systemName: 'Mumbai Metro (MMRDA / MMMOCL)',
    operator: 'Maha Mumbai Metro Operations Corporation',
    activeLines: 4,
    totalStations: 74,
    interchanges: 2,
    establishedYear: 2014,
    networkLengthKm: 59.1,
    dailyRidership: '1.2+ Million',
    centerCoordinates: [19.076, 72.8777],
    tagline: 'Connecting Mumbai across Blue, Yellow, Red and underground Aqua corridors',
    description: '74 stations across 4 operational lines with key interchanges at Dahisar East and Marol Naka.',
    popularStations: ['mum-blu-marol-naka', 'mum-yel-dahisar-east', 'mum-aqu-bandra-kurla-complex', 'mum-aqu-csmi-airport-t2', 'mum-blu-andheri', 'mum-blu-ghatkopar'],
    lines: [
      {
        id: 'mum-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन (लाइन 1)',
        code: 'L1',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Versova', 'DN Nagar', 'Azad Nagar', 'Andheri', 'Western Express Highway',
          'Chakala JB Nagar', 'Airport Road', 'Marol Naka', 'Saki Naka', 'Asalpha',
          'Jagruti Nagar', 'Ghatkopar'
        ]
      },
      {
        id: 'mum-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन (लाइन 2A)',
        code: 'L2A',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Dahisar East', 'Anand Nagar', 'Kandarpada', 'Mandapeshwar', 'Eksar',
          'Borivali West', 'Shimpoli', 'Kandivali West', 'Dahanukarwadi', 'Valnai',
          'Malad West', 'Lower Malad', 'Bangur Nagar', 'Goregaon West', 'Oshiwara',
          'Lower Oshiwara', 'Andheri West'
        ]
      },
      {
        id: 'mum-red',
        name: 'Red Line',
        hindiName: 'रेड लाइन (लाइन 7)',
        code: 'L7',
        color: '#EF4444',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Kashigaon', 'Miragaon', 'Pandhurang Wadi', 'Dahisar East', 'Ovaripada',
          'Rashtriya Udyan', 'Devipada', 'Magathane', 'Poisar', 'Akurli',
          'Kurar', 'Dindoshi', 'Aarey', 'Goregaon East', 'Jogeshwari East',
          'Mogra', 'Gundavali'
        ]
      },
      {
        id: 'mum-aqua',
        name: 'Aqua Line',
        hindiName: 'एक्वा लाइन (लाइन 3)',
        code: 'L3',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Aarey JVLR', 'SEEPZ', 'MIDC Andheri', 'Marol Naka', 'CSMI Airport T2',
          'Sahar Road', 'CSMI Airport T1', 'Santacruz', 'Bandra Colony', 'Bandra Kurla Complex',
          'Dharavi', 'Shitla Devi Mandir', 'Dadar', 'Siddhivinayak', 'Worli',
          'Acharya Atre Chowk', 'Science Museum', 'Mahalaxmi', 'Jagannath Shankar Sheth', 'Grant Road',
          'Girgaon', 'Kalbadevi', 'Chhatrapati Shivaji Maharaj Terminus (CST)', 'Hutatma Chowk', 'Churchgate',
          'Vidhan Bhavan', 'Badhwar Park', 'Cuffe Parade'
        ]
      }
    ]
  },

  lucknow: {
    id: 'lucknow',
    name: 'Lucknow',
    hindiName: 'लखनऊ',
    state: 'Uttar Pradesh',
    systemName: 'Lucknow Metro (UPMRC)',
    operator: 'Uttar Pradesh Metro Rail Corporation',
    activeLines: 1,
    totalStations: 21,
    interchanges: 0,
    establishedYear: 2017,
    networkLengthKm: 22.87,
    dailyRidership: '85,000+',
    centerCoordinates: [26.8467, 80.9462],
    tagline: 'North-South Corridor linking CCS Airport to Munshipulia',
    description: '22.87 km corridor with 21 stations serving Charbagh, Hazratganj, KD Singh Babu Stadium, and Indira Nagar.',
    popularStations: ['luc-red-ccs-airport', 'luc-red-charbagh', 'luc-red-hazratganj', 'luc-red-munshipulia'],
    lines: [
      {
        id: 'luc-red',
        name: 'Red Line',
        hindiName: 'रेड लाइन',
        code: 'NS',
        color: '#EF4444',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'CCS Airport', 'Amausi', 'Transport Nagar', 'Krishna Nagar', 'Singar Nagar',
          'Alambagh', 'Alambagh Bus Stand', 'Mawaiya', 'Durgapuri', 'Charbagh',
          'Hussainganj', 'Sachivalaya', 'Hazratganj', 'KD Singh Babu Stadium', 'Lucknow University',
          'IT College', 'Badshah Nagar', 'Lekhraj Market', 'Bhootnath Market', 'Indira Nagar',
          'Munshipulia'
        ]
      }
    ]
  },

  kolkata: {
    id: 'kolkata',
    name: 'Kolkata',
    hindiName: 'कोलकाता',
    state: 'West Bengal',
    systemName: 'Kolkata Metro (Metro Railway / KMRCL)',
    operator: 'Ministry of Railways (Metro Railway Kolkata)',
    activeLines: 5,
    totalStations: 58,
    interchanges: 3,
    establishedYear: 1984,
    networkLengthKm: 59.4,
    dailyRidership: '750,000+',
    centerCoordinates: [22.5726, 88.3639],
    tagline: 'India first metro system featuring the historic Blue Line and the underwater Green Line under the Hooghly River',
    description: '58 stations across 5 active lines with 3 interchanges at Esplanade, Kavi Subhash, and Noapara.',
    popularStations: ['kol-blu-esplanade', 'kol-gre-howrah', 'kol-blu-kavi-subhash-new-garia', 'kol-blu-noapara', 'kol-blu-dum-dum'],
    lines: [
      {
        id: 'kol-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन (लाइन 1)',
        code: 'L1',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Dakshineswar', 'Baranagar', 'Noapara', 'Dum Dum', 'Belgachhia',
          'Shyambazaar', 'Shobhabazar Sutanuti', 'Girish Park', 'Mahatma Gandhi Road', 'Central',
          'Chandni Chowk', 'Esplanade', 'Park Street', 'Maidan', 'Rabindra Sadan',
          'Netaji Bhavan', 'Jatin Das Park', 'Kalighat', 'Rabindra Sarobar', 'Mahanayak Uttam Kumar (Tollygunge)',
          'Netaji', 'Masterda Surya Sen', 'Gitanjali', 'Kavi Nazrul', 'Shahid Khudiram',
          'Kavi Subhash (New Garia)'
        ]
      },
      {
        id: 'kol-green',
        name: 'Green Line',
        hindiName: 'ग्रीन लाइन (लाइन 2)',
        code: 'L2',
        color: '#22C55E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Salt Lake Sector V', 'Karunamoyee', 'Central Park', 'City Centre', 'Bengal Chemical',
          'Salt Lake Stadium', 'Phoolbagan', 'Sealdah', 'Esplanade', 'Mahakaran',
          'Howrah', 'Howrah Maidan'
        ]
      },
      {
        id: 'kol-orange',
        name: 'Orange Line',
        hindiName: 'ऑरेंज लाइन (लाइन 6)',
        code: 'L6',
        color: '#F97316',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Beliaghata', 'Barun Sengupta', 'Ritwik Ghatak', 'VIP Bazaar', 'Hemanta Mukhopadhyay',
          'Kavi Sukanta', 'Jyotirindra Nandi', 'Satyajit Ray', 'Kavi Subhash (New Garia)'
        ]
      },
      {
        id: 'kol-purple',
        name: 'Purple Line',
        hindiName: 'पर्पल लाइन (लाइन 3)',
        code: 'L3',
        color: '#A855F7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Joka', 'Thakurpukur', 'Sakherbazar', 'Behala Chowrasta', 'Behala Bazar',
          'Taratala', 'Majerhat'
        ]
      },
      {
        id: 'kol-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन (लाइन 4)',
        code: 'L4',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Noapara', 'Dum Dum Cantonment', 'Jessore Road', 'Jai Hind (Airport)'
        ]
      }
    ]
  },

  kochi: {
    id: 'kochi',
    name: 'Kochi',
    hindiName: 'कोच्चि',
    state: 'Kerala',
    systemName: 'Kochi Metro (KMRL)',
    operator: 'Kochi Metro Rail Limited',
    activeLines: 1,
    totalStations: 25,
    interchanges: 0,
    establishedYear: 2017,
    networkLengthKm: 28.1,
    dailyRidership: '100,000+',
    centerCoordinates: [9.9312, 76.2673],
    tagline: 'Line 1 connecting Aluva to Tripunithura Terminal via MG Road and Vyttila mobility hub',
    description: '25 stations along the major transport spine of Greater Kochi.',
    popularStations: ['koc-l1-aluva', 'koc-l1-mg-road', 'koc-l1-vyttila', 'koc-l1-tripunithura-terminal'],
    lines: [
      {
        id: 'koc-line1',
        name: 'Line 1',
        hindiName: 'लाइन 1',
        code: 'L1',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom',
          'Kalamassery Town', 'Cochin University', 'Pathadipalam', 'Edappally', 'Changampuzha Park',
          'Palarivattom', 'JLN Stadium', 'Kaloor', 'Town Hall', 'MG Road',
          'Maharajas College', 'Ernakulam South', 'Kadavanthra', 'Elamkulam', 'Vyttila',
          'Thykoodam', 'Petta', 'Vadakkekotta', 'SN Junction', 'Tripunithura Terminal'
        ]
      }
    ]
  },

  kanpur: {
    id: 'kanpur',
    name: 'Kanpur',
    hindiName: 'कानपुर',
    state: 'Uttar Pradesh',
    systemName: 'Kanpur Metro (UPMRC)',
    operator: 'Uttar Pradesh Metro Rail Corporation',
    activeLines: 1,
    totalStations: 14,
    interchanges: 0,
    establishedYear: 2021,
    networkLengthKm: 16.0,
    dailyRidership: '35,000+',
    centerCoordinates: [26.4499, 80.3319],
    tagline: 'Orange Line connecting IIT Kanpur to Kanpur Central Railway Station',
    description: '14 operational stations connecting IIT Kanpur, Motijheel, and Kanpur Central.',
    popularStations: ['kan-ora-iit-kanpur', 'kan-ora-kanpur-central', 'kan-ora-motijheel', 'kan-ora-rawatpur'],
    lines: [
      {
        id: 'kan-orange',
        name: 'Orange Line',
        hindiName: 'ऑरेंज लाइन',
        code: 'L1',
        color: '#F97316',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'IIT Kanpur', 'Kalyanpur', 'SPM Hospital', 'Vishwavidyalaya', 'Gurudev Chauraha',
          'Geeta Nagar', 'Rawatpur', 'LLR Hospital', 'Motijheel', 'Chunniganj',
          'Naveen Market', 'Bada Chauraha', 'Nayaganj', 'Kanpur Central'
        ]
      }
    ]
  },

  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    state: 'Rajasthan',
    systemName: 'Jaipur Metro (JMRC)',
    operator: 'Jaipur Metro Rail Corporation',
    activeLines: 1,
    totalStations: 11,
    interchanges: 0,
    establishedYear: 2015,
    networkLengthKm: 12.0,
    dailyRidership: '60,000+',
    centerCoordinates: [26.9124, 75.7873],
    tagline: 'Pink Line connecting Mansarovar to Badi Chaupar in the historic Pink City',
    description: '11 stations serving Mansarovar, Railway Station, Sindhi Camp, Chandpole and Badi Chaupar.',
    popularStations: ['jai-pnk-badi-chaupar', 'jai-pnk-sindhi-camp', 'jai-pnk-railway-station', 'jai-pnk-mansarovar'],
    lines: [
      {
        id: 'jai-pink',
        name: 'Pink Line',
        hindiName: 'पिंक लाइन',
        code: 'L1',
        color: '#EC4899',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Mansarovar', 'New Aatish Market', 'Vivek Vihar', 'Shyam Nagar', 'Ram Nagar',
          'Civil Lines', 'Railway Station', 'Sindhi Camp', 'Chandpole', 'Chhoti Chaupar',
          'Badi Chaupar'
        ]
      }
    ]
  },

  indore: {
    id: 'indore',
    name: 'Indore',
    hindiName: 'इंदौर',
    state: 'Madhya Pradesh',
    systemName: 'Indore Metro (MPMRCL)',
    operator: 'Madhya Pradesh Metro Rail Corporation Limited',
    activeLines: 1,
    totalStations: 5,
    interchanges: 0,
    establishedYear: 2024,
    networkLengthKm: 5.9,
    dailyRidership: '20,000+',
    centerCoordinates: [22.7196, 75.8577],
    tagline: 'Yellow Line Priority Corridor connecting Airport Terminal and Super Corridor',
    description: '5 stations from Devi Ahilya Bai Holkar Terminal to Veerangana Jhalkari Bai.',
    popularStations: ['ind-yel-devi-ahilya-bai-holkar-terminal', 'ind-yel-veerangana-jhalkari-bai', 'ind-yel-maharani-lakshmi-bai'],
    lines: [
      {
        id: 'ind-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन',
        code: 'L3',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Devi Ahilya Bai Holkar Terminal',
          'Maharani Lakshmi Bai',
          'Rani Avanti Bai Lodhi',
          'Rani Durgavati',
          'Veerangana Jhalkari Bai'
        ]
      }
    ]
  },

  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    hindiName: 'हैदराबाद',
    state: 'Telangana',
    systemName: 'Hyderabad Metro (HMRL / L&T)',
    operator: 'L&T Metro Rail (Hyderabad) Limited',
    activeLines: 3,
    totalStations: 59,
    interchanges: 3,
    establishedYear: 2017,
    networkLengthKm: 69.2,
    dailyRidership: '520,000+',
    centerCoordinates: [17.385, 78.4867],
    tagline: 'Elevated metro network across Red, Blue, and Green Corridors with major interchanges at Ameerpet, JBS, and MGBS',
    description: '59 stations across 3 lines with 3 interchanges connecting IT corridors, Secunderabad and Old City.',
    popularStations: ['hyd-blu-ameerpet', 'hyd-blu-hitec-city', 'hyd-blu-raidurg', 'hyd-red-mg-bus-station', 'hyd-blu-jbs-parade-ground'],
    lines: [
      {
        id: 'hyd-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन (लाइन 3)',
        code: 'L3',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Nagole', 'Uppal', 'Stadium', 'NGRI', 'Habsiguda',
          'Tarnaka', 'Mettuguda', 'Secunderabad East', 'JBS Parade Ground', 'Paradise',
          'Rasoolpura', 'Prakash Nagar', 'Begumpet', 'Ameerpet', 'Madhura Nagar',
          'Yousufguda', 'Road No 5 Jubilee Hills', 'Jubilee Hills Check Post', 'Peddamma Gudi', 'Madhapur',
          'Durgam Cheruvu', 'Hitec City', 'Raidurg'
        ]
      },
      {
        id: 'hyd-green',
        name: 'Green Line',
        hindiName: 'ग्रीन लाइन (लाइन 2)',
        code: 'L2',
        color: '#22C55E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'JBS Parade Ground', 'Secunderabad West', 'Gandhi Hospital', 'Musheerabad', 'RTC X Roads',
          'Chikkadpally', 'Narayanguda', 'Sultan Bazar', 'MG Bus Station'
        ]
      },
      {
        id: 'hyd-red',
        name: 'Red Line',
        hindiName: 'रेड लाइन (लाइन 1)',
        code: 'L1',
        color: '#EF4444',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Miyapur', 'JNTU College', 'KPHB Colony', 'Kukatpally', 'Balanagar',
          'Moosapet', 'Bharat Nagar', 'Erragadda', 'ESI Hospital', 'SR Nagar',
          'Ameerpet', 'Punjagutta', 'Errum Manzil', 'Khairatabad', 'Lakdi Ka Pul',
          'Assembly', 'Nampally', 'Gandhi Bhavan', 'Osmania Medical College', 'MG Bus Station',
          'Malakpet', 'New Market', 'Musarambagh', 'Dilsukhnagar', 'Chaitanyapuri',
          'Victoria Memorial', 'LB Nagar'
        ]
      }
    ]
  },

  gurgaon: {
    id: 'gurgaon',
    name: 'Gurgaon',
    hindiName: 'गुड़गांव',
    state: 'Haryana',
    systemName: 'Gurgaon Rapid Metro (DMRC / RMGL)',
    operator: 'Delhi Metro Rail Corporation',
    activeLines: 1,
    totalStations: 11,
    interchanges: 0,
    establishedYear: 2013,
    networkLengthKm: 12.15,
    dailyRidership: '75,000+',
    centerCoordinates: [28.4595, 77.0266],
    tagline: 'Rapid Line loop connecting Cyber City, DLF phases, and Sector 55-56',
    description: '11 stations along CyberHub, Golf Course Road and Sikandarpur.',
    popularStations: ['gur-rap-cyber-city', 'gur-rap-sikandarpur', 'gur-rap-sector-55-56', 'gur-rap-phase-3'],
    lines: [
      {
        id: 'gur-rapid',
        name: 'Rapid Line',
        hindiName: 'रैपिड लाइन',
        code: 'RM',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Sector 55 56', 'Sector 54 Chowk', 'Sector 53 54', 'Sector 42 43', 'Phase 1',
          'Sikandarpur', 'Phase 2', 'Belvedere Towers', 'Cyber City', 'Moulsari Avenue', 'Phase 3'
        ]
      }
    ]
  },

  chennai: {
    id: 'chennai',
    name: 'Chennai',
    hindiName: 'चेन्नई',
    state: 'Tamil Nadu',
    systemName: 'Chennai Metro (CMRL)',
    operator: 'Chennai Metro Rail Limited',
    activeLines: 2,
    totalStations: 43,
    interchanges: 2,
    establishedYear: 2015,
    networkLengthKm: 54.1,
    dailyRidership: '310,000+',
    centerCoordinates: [13.0827, 80.2707],
    tagline: 'Connecting Chennai Airport to Wimco Nagar Depot and St Thomas Mount with interchanges at Alandur & Chennai Central',
    description: '43 stations across Blue and Green Lines with interchanges at Arignar Anna Alandur and MGR Central.',
    popularStations: ['che-blu-mgr-central-chennai-central', 'che-blu-arignar-anna-alandur', 'che-blu-chennai-international-airport', 'che-gre-koyambedu'],
    lines: [
      {
        id: 'che-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन (लाइन 1)',
        code: 'L1',
        color: '#0284C7',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Wimco Nagar Depot', 'Wimco Nagar', 'Thiruvottriyur', 'Thiruvottriyur Theradi', 'Kaladipet',
          'Tollgate', 'New Washermanpet', 'Tondiarpet', 'Sir Theagaraya College', 'Washermanpet',
          'Mannadi', 'High Court', 'MGR Central (Chennai Central)', 'Government Estate', 'LIC',
          'Thousand Lights', 'AG DMS', 'Teynampet', 'Nandanam', 'Saidapet',
          'Little Mount', 'Guindy', 'Arignar Anna Alandur', 'Nanganallur Road', 'Meenambakkam',
          'Chennai International Airport'
        ]
      },
      {
        id: 'che-green',
        name: 'Green Line',
        hindiName: 'ग्रीन लाइन (लाइन 2)',
        code: 'L2',
        color: '#22C55E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'MGR Central (Chennai Central)', 'Egmore', 'Nehru Park', 'Kilpauk Medical College', 'Pachaiyappa College',
          'Shenoy Nagar', 'Anna Nagar East', 'Anna Nagar Tower', 'Thirumangalam', 'Koyambedu',
          'CMBT', 'Arumbakkam', 'Vadapalani', 'Ashok Nagar', 'Ekkattuthangal',
          'Arignar Anna Alandur', 'St Thomas Mount'
        ]
      }
    ]
  },

  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    hindiName: 'बेंगलुरु',
    state: 'Karnataka',
    systemName: 'Namma Metro (BMRCL)',
    operator: 'Bangalore Metro Rail Corporation Limited',
    activeLines: 3,
    totalStations: 85,
    interchanges: 2,
    establishedYear: 2011,
    networkLengthKm: 73.8,
    dailyRidership: '850,000+',
    centerCoordinates: [12.9716, 77.5946],
    tagline: 'Connecting India Silicon Valley across Green, Purple, and Yellow Lines intersecting at Majestic and RV Road',
    description: '85 stations across Green, Purple and Yellow Lines with interchanges at Majestic and Rashtreeya Vidyalaya Road.',
    popularStations: ['blr-pur-nadaprabhu-kempegowda-station-majestic', 'blr-grn-rashtreeya-vidyalaya-road', 'blr-pur-mg-road', 'blr-pur-whitefield-kadugodi', 'blr-yel-electronic-city'],
    lines: [
      {
        id: 'blr-green',
        name: 'Green Line',
        hindiName: 'ग्रीन लाइन',
        code: 'GRN',
        color: '#22C55E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Madavara (BIEC)', 'Chikkabidarakallu', 'Manjunatha Nagara', 'Nagasandra', 'Dasarahalli',
          'Jalahalli', 'Peenya Industry', 'Peenya', 'Goraguntepalya', 'Yeshwanthpur',
          'Sandal Soap Factory', 'Mahalakshmi', 'Rajajinagar', 'Kuvempu Road', 'Srirampura',
          'Sampige Road', 'Nadaprabhu Kempegowda station (Majestic)', 'Chickpete', 'Krishna Rajendra Market', 'National College',
          'Lalbagh Botanical Garden', 'South End Circle', 'Jayanagara', 'Rashtreeya Vidyalaya Road', 'Banashankari',
          'Jaya Prakash Nagara', 'Yelachenahalli', 'Konanakunte Cross', 'Doddakallasandra', 'Vajarahalli',
          'Thalaghattapura', 'Silk Institute'
        ]
      },
      {
        id: 'blr-purple',
        name: 'Purple Line',
        hindiName: 'पर्पल लाइन',
        code: 'PUR',
        color: '#9333EA',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Whitefield (Kadugodi)', 'Hopefarm Channasandra', 'Kadugodi Tree Park', 'Pattanduru Agrahara', 'Sri Sathya Sai Hospital',
          'Nallurhalli', 'Kundalahalli', 'Seetharamapalya', 'Hoodi', 'Garudacharpalya',
          'Singayyanapalya', 'Krishnarajapura (K.R.Pura)', 'Benniganahalli', 'Baiyappanahalli', 'Swami Vivekananda Road',
          'Indiranagar', 'Halasuru', 'Trinity', 'MG Road', 'Cubbon Park',
          'Dr. BR. Ambedkar Station (Vidhana Soudha)', 'Sir M. Visveshwaraya Station (Central College)', 'Nadaprabhu Kempegowda station (Majestic)', 'City Railway station', 'Magadi Road',
          'Sri Balagangadharanatha Swamiji Station (Hosahalli)', 'Vijayanagara', 'Attiguppe', 'Deepanjali Nagar', 'Mysuru Road',
          'Pantharapalya (Nayandahalli)', 'Rajarajeshwari Nagar', 'Jnanabharathi', 'Pattanagere', 'Kengeri Bus Terminal',
          'Kengeri', 'Challaghatta'
        ]
      },
      {
        id: 'blr-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन',
        code: 'YEL',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Rashtreeya Vidyalaya Road', 'Ragigudda', 'Jayadeva Hospital', 'BTM Layout', 'Central Silk Board',
          'Bommanahalli', 'Hongasandra', 'Kudlu Gate', 'Singasandra', 'Hosa Road',
          'Beratena Agarhara', 'Electronic City', 'Infosys Foundation Konappana Agrahara', 'Huskur Road', 'Biocon Hebbagodi',
          'Delta Electronics Bommasandra'
        ]
      }
    ]
  },

  delhi: {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    state: 'Delhi / Haryana / Uttar Pradesh',
    systemName: 'Delhi Metro (DMRC)',
    operator: 'Delhi Metro Rail Corporation',
    activeLines: 12,
    totalStations: 327,
    interchanges: 23,
    establishedYear: 2002,
    networkLengthKm: 393.1,
    dailyRidership: '6.0+ Million',
    centerCoordinates: [28.6139, 77.209],
    tagline: 'Lifeline of the National Capital Region across 12 active lines with 23 major interchange hubs',
    description: '327 stations listed in the authoritative workbook spanning Red, Yellow, Blue, Green, Violet, Pink, Magenta, Grey, and Orange corridors.',
    popularStations: ['del-blu-rajiv-chowk', 'del-red-kashmere-gate', 'del-yel-hauz-khas', 'del-blu-botanical-garden', 'del-yel-central-secretariat', 'del-pnk-lajpat-nagar'],
    lines: [
      {
        id: 'del-red',
        name: 'Red Line',
        hindiName: 'रेड लाइन',
        code: 'L1',
        color: '#DC2626',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Shaheed Sthal (New Bus Adda)', 'Hindon River', 'Arthala', 'Mohan Nagar', 'Shyam park',
          'Major Mohit Sharma Rajendra Nagar', 'Raj Bagh', 'Shaheed Nagar', 'Dilshad Garden', 'Jhilmil',
          'Mansarovar Park', 'Shahdara', 'Welcome', 'Seelampur', 'Shastri Park',
          'Kashmere Gate', 'Tis Hazari', 'Pulbangash', 'Pratap Nagar', 'Shastri Nagar',
          'Inderlok', 'Kanhaiya Nagar', 'Keshav Puram', 'Netaji Subhash Place', 'Kohat Enclave',
          'Madhuban Chowk (Pitampura)', 'Rohini East', 'Rohini West', 'Rithala'
        ]
      },
      {
        id: 'del-yellow',
        name: 'Yellow Line',
        hindiName: 'येलो लाइन',
        code: 'L2',
        color: '#EAB308',
        textColor: '#1C1917',
        status: 'operational',
        stationNames: [
          'Samaypur Badli', 'Rohini Sector 18 19', 'Haiderpur Badli Mor', 'Jahangirpuri', 'Adarsh Nagar',
          'Azadpur', 'Model Town', 'GTB Nagar', 'Vishwavidyalaya', 'Vidhan Sabha',
          'Civil Lines', 'Kashmere Gate', 'Chandni Chowk', 'Chawri Bazar', 'New Delhi',
          'Rajiv Chowk', 'Patel Chowk', 'Central Secretariat', 'Seva Teerth (Udyog Bhawan)', 'Lok Kalyan Marg',
          'Jor Bagh', 'Dilli Haat INA', 'AIIMS', 'Green Park', 'Hauz Khas',
          'Malviya Nagar', 'Saket', 'Qutab Minar', 'Chhatarpur', 'Sultanpur',
          'Ghitorni', 'Arjan Garh', 'Guru Dronacharya', 'Sikandarpur', 'MG Road',
          'IFFCO Chowk', 'Millennium City Centre (HUDA City Centre)'
        ]
      },
      {
        id: 'del-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन',
        code: 'L3',
        color: '#2563EB',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Noida Electronic City', 'Noida Sector 62', 'Noida Sector 59', 'Noida Sector 61', 'Noida Sector 52',
          'Noida Sector 34', 'Noida City Centre', 'Golf Course', 'Botanical Garden', 'Noida Sector 18',
          'Noida Sector 16', 'Noida Sector 15', 'New Ashok Nagar', 'Mayur Vihar Extension', 'Mayur Vihar I',
          'Akshardham', 'Yamuna Bank', 'Indraprastha', 'Supreme Court (Pragati Maidan)', 'Mandi House',
          'Barakhambha Road', 'Rajiv Chowk', 'RK Ashram Marg', 'Jhandewalan', 'Karol Bagh',
          'Rajendra Place', 'Patel Nagar', 'Shadipur', 'Kirti Nagar', 'Moti Nagar',
          'Ramesh Nagar', 'Rajouri Garden', 'Tagore Garden', 'Subhash Nagar', 'Tilak Nagar',
          'Janakpuri East', 'Janakpuri West', 'Uttam Nagar East', 'Uttam Nagar West', 'Nawada',
          'Dwarka Mor', 'Dwarka', 'Dwarka Sector 14', 'Dwarka Sector 13', 'Dwarka Sector 12',
          'Dwarka Sector 11', 'Dwarka Sector 10', 'Dwarka Sector 9', 'Dwarka Sector 8', 'Dwarka Sector 21'
        ]
      },
      {
        id: 'del-blue-branch',
        name: 'Blue Branch Line',
        hindiName: 'ब्लू ब्रांच लाइन',
        code: 'L4',
        color: '#3B82F6',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Vaishali', 'Kaushambi', 'Anand Vihar ISBT', 'Karkarduma', 'Preet Vihar',
          'Nirman Vihar', 'Laxmi Nagar', 'Yamuna Bank', 'Indraprastha', 'Supreme Court (Pragati Maidan)',
          'Mandi House', 'Barakhambha Road', 'Rajiv Chowk', 'RK Ashram Marg', 'Jhandewalan',
          'Karol Bagh', 'Rajendra Place', 'Patel Nagar', 'Shadipur', 'Kirti Nagar',
          'Moti Nagar', 'Ramesh Nagar', 'Rajouri Garden', 'Tagore Garden', 'Subhash Nagar',
          'Tilak Nagar', 'Janakpuri East', 'Janakpuri West', 'Uttam Nagar East', 'Uttam Nagar West',
          'Nawada', 'Dwarka Mor', 'Dwarka', 'Dwarka Sector 14', 'Dwarka Sector 13',
          'Dwarka Sector 12', 'Dwarka Sector 11', 'Dwarka Sector 10', 'Dwarka Sector 9', 'Dwarka Sector 8',
          'Dwarka Sector 21'
        ]
      },
      {
        id: 'del-green',
        name: 'Green Line',
        hindiName: 'ग्रीन लाइन',
        code: 'L5',
        color: '#16A34A',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Inderlok', 'Ashok Park Main', 'Punjabi Bagh', 'Punjabi Bagh West', 'Shivaji Park',
          'Madipur', 'Paschim Vihar East', 'Paschim Vihar West', 'Peeragarhi', 'Udyog Nagar',
          'Maharaja Surajmal Stadium', 'Nangloi', 'Nangloi Railway Station', 'Rajdhani Park', 'Mundka',
          'Mundka Industrial Area', 'Ghevra', 'Tikri Kalan', 'Tikri Border', 'Pandit Shree Ram Sharma',
          'Bahadurgarh City', 'Brigadier Hoshiar Singh'
        ]
      },
      {
        id: 'del-green-branch',
        name: 'Green Branch Line',
        hindiName: 'ग्रीन ब्रांच लाइन',
        code: 'L5B',
        color: '#22C55E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Kirti Nagar', 'Satguru Ram Singh Marg', 'Ashok Park Main', 'Punjabi Bagh', 'Punjabi Bagh West',
          'Shivaji Park', 'Madipur', 'Paschim Vihar East', 'Paschim Vihar West', 'Peeragarhi',
          'Udyog Nagar', 'Maharaja Surajmal Stadium', 'Nangloi', 'Nangloi Railway Station', 'Rajdhani Park',
          'Mundka', 'Mundka Industrial Area', 'Ghevra', 'Tikri Kalan', 'Tikri Border',
          'Pandit Shree Ram Sharma', 'Bahadurgarh City', 'Brigadier Hoshiar Singh'
        ]
      },
      {
        id: 'del-grey',
        name: 'Grey Line',
        hindiName: 'ग्रे लाइन',
        code: 'L9',
        color: '#6B7280',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Dwarka', 'Nangli', 'Najafgarh', 'Dhansa Bus Stand'
        ]
      },
      {
        id: 'del-magenta',
        name: 'Magenta Line',
        hindiName: 'मजेंटा लाइन',
        code: 'L8',
        color: '#D946EF',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Majlis Park', 'Bhalswa Lake', 'Haiderpur Badli Mor', 'Pitampura North', 'North Pitampura (Prashant Vihar)',
          'Madhuban Chowk (Pitampura)', 'Deepali Chowk', 'Krishna Park Extension', 'Janakpuri West', 'Dabri Mor Janakpuri South',
          'Dashrathpuri', 'Palam', 'Sadar Bazar Cantonment', 'Terminal 1 IGI Airport', 'Shankar Vihar',
          'Vasant Vihar', 'Munirka', 'RK Puram', 'IIT', 'Hauz Khas',
          'Panchsheel Park', 'Chirag Delhi', 'Greater Kailash', 'Nehru Enclave', 'Kalkaji Mandir',
          'Okhla NSIC', 'Sukhdev Vihar', 'Jamia Milia Islamiya', 'Okhla Vihar', 'Jasola Vihar Shaheen Bagh',
          'Kalindi Kunj', 'Okhla Bird Sanctuary', 'Botanical Garden'
        ]
      },
      {
        id: 'del-orange',
        name: 'Orange Line',
        hindiName: 'ऑरेंज लाइन (एयरपोर्ट एक्सप्रेस)',
        code: 'AE',
        color: '#EA580C',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'New Delhi', 'Shivaji Stadium', 'Dhaula Kuan', 'Delhi Aerocity', 'IGI Airport',
          'Dwarka Sector 21', 'Yashobhoomi Dwarka Sector 25'
        ]
      },
      {
        id: 'del-pink',
        name: 'Pink Line',
        hindiName: 'पिंक लाइन',
        code: 'L7',
        color: '#EC4899',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Maujpur Babarpur', 'Jafrabad', 'Welcome', 'East Azad Nagar', 'Krishna Nagar',
          'Karkarduma Court', 'Karkarduma', 'Anand Vihar ISBT', 'IP Extension', 'Mandawali West Vinod Nagar',
          'East Vinod Nagar Mayur Vihar II', 'Trilokpuri Sanjay Lake', 'Shri Ram Mandir Mayur Vihar (Pocket I)', 'Mayur Vihar I', 'Sarai Kale Khan Nizamuddin',
          'Ashram', 'Vinobapuri', 'Lajpat Nagar', 'South Extension', 'Dilli Haat INA',
          'Sarojini Nagar', 'Bhikaji Cama Place', 'Sir Vishweshwaraiah Moti Bagh', 'Durgabai Deshmukh South Campus', 'Delhi Cantt',
          'Naraina Vihar', 'Mayapuri', 'Rajouri Garden', 'ESI Basaidarapur', 'Punjabi Bagh West',
          'Shakurpur', 'Netaji Subhash Place', 'Shalimar Bagh', 'Azadpur', 'Majlis Park',
          'Burari', 'Jharoda Majra', 'Wazirabad (Jagatpur)', 'Soorghat', 'Nanaksar (Sonia Vihar)',
          'Khajuri Khas', 'Bhajanpura', 'Yamuna Vihar'
        ]
      },
      {
        id: 'del-pink-branch',
        name: 'Pink Branch Line',
        hindiName: 'पिंक ब्रांच लाइन',
        code: 'L7B',
        color: '#F43F5E',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Shiv Vihar', 'Johri Enclave', 'Gokulpuri', 'Maujpur Babarpur'
        ]
      },
      {
        id: 'del-violet',
        name: 'Violet Line',
        hindiName: 'वायलेट लाइन',
        code: 'L6',
        color: '#7C3AED',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Kashmere Gate', 'Lal Quila', 'Jama Masjid', 'Delhi Gate', 'ITO',
          'Mandi House', 'Janpath', 'Central Secretariat', 'Khan Market', 'JLN Stadium',
          'Jangpura', 'Lajpat Nagar', 'Moolchand', 'Kailash Colony', 'Nehru Place',
          'Kalkaji Mandir', 'Govind Puri', 'Harkesh Nagar Okhla', 'Jasola Apollo', 'Sarita Vihar',
          'Mohan Estate', 'Tughlakabad Station', 'Badarpur Border', 'Sarai', 'NHPC Chowk',
          'Mewala Maharajpur', 'Sector 28', 'Badkal Mor', 'Old Faridabad', 'Neelam Chowk Ajronda',
          'Bata Chowk', 'Escorts Mujesar', 'Sant Surdas Sihi', 'Raja Nahar Singh Ballabhgarh'
        ]
      }
    ]
  },

  bhopal: {
    id: 'bhopal',
    name: 'Bhopal',
    hindiName: 'भोपाल',
    state: 'Madhya Pradesh',
    systemName: 'Bhopal Metro (Bhoj Metro / MPMRCL)',
    operator: 'Madhya Pradesh Metro Rail Corporation Limited',
    activeLines: 2,
    totalStations: 29,
    interchanges: 1,
    establishedYear: 2024,
    networkLengthKm: 27.87,
    dailyRidership: '25,000+',
    centerCoordinates: [23.2599, 77.4126],
    tagline: 'Orange Line priority corridor and Blue Line alignment intersecting at Pul Bogda',
    description: 'Orange Line (priority section operational) and Blue Line project (under construction) with central interchange at Pul Bogda.',
    popularStations: ['bho-org-pul-bogda', 'bho-org-subhash-nagar', 'bho-org-rani-kamalapati-railway-station', 'bho-org-aiims', 'bho-blu-jawahar-chowk'],
    lines: [
      {
        id: 'bho-orange',
        name: 'Orange Line',
        hindiName: 'ऑरेंज लाइन',
        code: 'L2',
        color: '#F97316',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Karond Chauraha', 'Krishi Upaj Mandi', 'DIG Bungalow', 'Sindhi Colony', 'Nadra Bus Stand',
          'Bhopal Railway Station', 'Aishbagh', 'Pul Bogda', 'Subhash Nagar', 'Kendriya Vidyalaya',
          'Board Office Chauraha', 'MP Nagar', 'Rani Kamalapati Railway Station', 'DRM Office', 'Alkapuri',
          'AIIMS'
        ]
      },
      {
        id: 'bho-blue',
        name: 'Blue Line',
        hindiName: 'ब्लू लाइन (निर्माणाधीन)',
        code: 'L1',
        color: '#3B82F6',
        textColor: '#FFFFFF',
        status: 'under-construction',
        stationNames: [
          'Bhadbhada Chauraha', 'Depot Chauraha', 'Jawahar Chowk', 'Roshanpura Chauraha', 'Kushabhau Thakre Hall',
          'Parade Ground', 'Pul Bogda', 'Prabhat Chauraha', 'Govindpura', 'Govindpura Industrial Area',
          'JK Road', 'Indrapuri', 'Piplani', 'Ratnagiri Tiraha'
        ]
      }
    ]
  },

  meerut: {
    id: 'meerut',
    name: 'Meerut',
    hindiName: 'मेरठ',
    state: 'Uttar Pradesh',
    systemName: 'Meerut Metro (NCRTC)',
    operator: 'National Capital Region Transport Corporation (NCRTC)',
    activeLines: 1,
    totalStations: 12,
    interchanges: 4,
    establishedYear: 2024,
    networkLengthKm: 23.6,
    dailyRidership: '40,000+',
    centerCoordinates: [28.9845, 77.7064],
    tagline: 'High-speed urban metro line operating on dedicated RRTS infrastructure with 4 Namo Bharat interchanges',
    description: '12 operational stations from Meerut South to Modipuram with 4 integrated interchanges connecting to Delhi–Meerut Namo Bharat.',
    popularStations: ['mee-met-begumpul', 'mee-met-meerut-south', 'mee-met-shatabdi-nagar', 'mee-met-modipuram', 'mee-met-bhaisali'],
    lines: [
      {
        id: 'mee-metro',
        name: 'Meerut Metro',
        hindiName: 'मेरठ मेट्रो',
        code: 'MM',
        color: '#EF4444',
        textColor: '#FFFFFF',
        status: 'operational',
        stationNames: [
          'Meerut South', 'Partapur', 'Rithani', 'Shatabdi Nagar', 'Brahmapuri',
          'Meerut Central', 'Bhaisali', 'Begumpul', 'MES Colony', 'Daurli',
          'Meerut North', 'Modipuram'
        ]
      }
    ]
  }
};

// Interchange directory from Interchanges sheet
const INTERCHANGES_CONFIG = {
  ahmedabad: {
    'GNLU': ['Violet Line', 'Yellow Line'],
    'Motera Stadium': ['Red Line', 'Yellow Line'],
    'Old High Court': ['Blue Line', 'Red Line']
  },
  pune: {
    'Civil Court': ['Aqua Line', 'Purple Line']
  },
  nagpur: {
    'Sitabuldi': ['Aqua Line', 'Orange Line']
  },
  mumbai: {
    'Dahisar East': ['Yellow Line', 'Red Line'],
    'Marol Naka': ['Blue Line', 'Aqua Line']
  },
  kolkata: {
    'Esplanade': ['Blue Line', 'Green Line'],
    'Kavi Subhash (New Garia)': ['Blue Line', 'Orange Line'],
    'Noapara': ['Blue Line', 'Yellow Line']
  },
  hyderabad: {
    'Ameerpet': ['Blue Line', 'Red Line'],
    'JBS Parade Ground': ['Blue Line', 'Green Line'],
    'MG Bus Station': ['Green Line', 'Red Line']
  },
  chennai: {
    'Arignar Anna Alandur': ['Blue Line', 'Green Line'],
    'MGR Central (Chennai Central)': ['Blue Line', 'Green Line']
  },
  bengaluru: {
    'Nadaprabhu Kempegowda station (Majestic)': ['Green Line', 'Purple Line'],
    'Rashtreeya Vidyalaya Road': ['Green Line', 'Yellow Line']
  },
  delhi: {
    'Azadpur': ['Yellow Line', 'Pink Line'],
    'Botanical Garden': ['Blue Line', 'Magenta Line'],
    'Central Secretariat': ['Yellow Line', 'Violet Line'],
    'Dilli Haat INA': ['Yellow Line', 'Pink Line'],
    'Dwarka': ['Blue Line', 'Grey Line'],
    'Dwarka Sector 21': ['Blue Line', 'Orange Line'],
    'Haiderpur Badli Mor': ['Yellow Line', 'Magenta Line'],
    'Hauz Khas': ['Yellow Line', 'Magenta Line'],
    'Inderlok': ['Red Line', 'Green Line'],
    'Janakpuri West': ['Blue Line', 'Magenta Line'],
    'Kalkaji Mandir': ['Magenta Line', 'Violet Line'],
    'Kashmere Gate': ['Red Line', 'Yellow Line', 'Violet Line'],
    'Lajpat Nagar': ['Pink Line', 'Violet Line'],
    'Madhuban Chowk (Pitampura)': ['Red Line', 'Magenta Line'],
    'Majlis Park': ['Magenta Line', 'Pink Line'],
    'Mandi House': ['Blue Line', 'Violet Line'],
    'Mayur Vihar I': ['Blue Line', 'Pink Line'],
    'Netaji Subhash Place': ['Red Line', 'Pink Line'],
    'New Delhi': ['Yellow Line', 'Orange Line'],
    'Punjabi Bagh West': ['Green Line', 'Pink Line'],
    'Rajiv Chowk': ['Yellow Line', 'Blue Line'],
    'Rajouri Garden': ['Blue Line', 'Pink Line'],
    'Welcome': ['Red Line', 'Pink Line']
  },
  bhopal: {
    'Pul Bogda': ['Orange Line', 'Blue Line']
  },
  meerut: {
    'Meerut South': ['Meerut Metro', 'Delhi–Meerut Namo Bharat (RRTS)'],
    'Shatabdi Nagar': ['Meerut Metro', 'Delhi–Meerut Namo Bharat (RRTS)'],
    'Begumpul': ['Meerut Metro', 'Delhi–Meerut Namo Bharat (RRTS)'],
    'Modipuram': ['Meerut Metro', 'Delhi–Meerut Namo Bharat (RRTS)']
  }
};

// Generates an ID slug for a station name
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Generate code for a city
function generateCityCode(cityKey, cityData) {
  const interchanges = INTERCHANGES_CONFIG[cityKey] || {};
  const cityId = cityData.id;

  // Track stations by slug to deduplicate for multi-line stations (like interchanges)
  const stationMap = new Map();
  const rawStationEntries = [];

  // Generate schematic geographic coordinates layout along each line
  const linesCount = cityData.lines.length;

  cityData.lines.forEach((line, lineIdx) => {
    const totalInLine = line.stationNames.length;
    const lineSlug = slugify(line.id);

    // Calculate angle or geometry for this line to spread stations nicely across canvas
    let angleRad = (lineIdx * (Math.PI / (linesCount || 1))) + (Math.PI / 8);
    if (linesCount === 1) angleRad = Math.PI / 4; // 45 deg diagonal
    if (linesCount === 2) angleRad = lineIdx === 0 ? 0.35 : -0.35; // Crossing angle

    line.stationNames.forEach((stationName, idx) => {
      const stationSlug = `${cityId.substring(0, 3)}-${line.code.toLowerCase()}-${slugify(stationName)}`;
      const isInterchange = Boolean(interchanges[stationName]);
      const connectedLines = interchanges[stationName] || [];
      const isTerminal = idx === 0 || idx === totalInLine - 1;

      // Base geographic spread around city center
      const centerLat = cityData.centerCoordinates[0];
      const centerLng = cityData.centerCoordinates[1];

      // Station progression factor: -0.5 to +0.5
      const progress = totalInLine > 1 ? (idx / (totalInLine - 1)) - 0.5 : 0;
      const spreadDist = 0.12; // ~13km span

      const lat = centerLat + Math.sin(angleRad) * progress * spreadDist + (lineIdx * 0.015);
      const lng = centerLng + Math.cos(angleRad) * progress * spreadDist + (lineIdx * 0.015);

      // Check if station was already registered (for interchange node)
      const existing = stationMap.get(stationName);
      if (existing) {
        if (!existing.lineIds.includes(line.id)) {
          existing.lineIds.push(line.id);
        }
        if (isInterchange) {
          existing.isInterchange = true;
          existing.interchangeLines = connectedLines;
        }
      } else {
        const stationObj = {
          id: stationSlug,
          name: stationName,
          cityId: cityId,
          lineIds: [line.id],
          latitude: Number(lat.toFixed(5)),
          longitude: Number(lng.toFixed(5)),
          isInterchange,
          interchangeLines: isInterchange ? connectedLines : undefined,
          isTerminal,
          status: line.status || 'operational'
        };
        stationMap.set(stationName, stationObj);
        rawStationEntries.push(stationObj);
      }
    });
  });

  // Prepare line configs
  const linesConfig = cityData.lines.map((line) => {
    const stationIds = line.stationNames.map((name) => {
      const st = stationMap.get(name);
      return st ? st.id : `${cityId.substring(0, 3)}-${slugify(name)}`;
    });

    return {
      id: line.id,
      name: line.name,
      hindiName: line.hindiName,
      code: line.code,
      color: line.color,
      textColor: line.textColor || '#FFFFFF',
      strokeWidth: 6,
      status: line.status,
      stationIds
    };
  });

  const cityCode = `import { RawStationGeoData } from '../rawStationGeoData';
import { MetroLine } from '../../types';

export const ${cityKey.toUpperCase().replace(/-/g, '_')}_RAW_STATIONS: RawStationGeoData[] = ${JSON.stringify(rawStationEntries, null, 2)};

export const ${cityKey.toUpperCase().replace(/-/g, '_')}_LINES_CONFIG: MetroLine[] = ${JSON.stringify(linesConfig, null, 2)};
`;

  return cityCode;
}

// Build all city files
const citiesDir = path.join(__dirname, '../src/data/cities');
if (!fs.existsSync(citiesDir)) {
  fs.mkdirSync(citiesDir, { recursive: true });
}

let totalCitiesCount = 0;
let totalStationsSum = 0;

for (const [cityKey, cityData] of Object.entries(CITIES_CONFIG)) {
  const code = generateCityCode(cityKey, cityData);
  const fileName = `${cityKey.replace(/-/g, '')}.ts`;
  const filePath = path.join(citiesDir, fileName);
  fs.writeFileSync(filePath, code, 'utf-8');

  // Count total listed stations in workbook
  const listedCount = cityData.lines.reduce((acc, l) => acc + l.stationNames.length, 0);
  console.log(`Generated ${cityData.name} (${fileName}): ${cityData.lines.length} lines, ${listedCount} listed stations (Workbook Summary: ${cityData.totalStations})`);
  totalCitiesCount++;
  totalStationsSum += listedCount;
}

console.log(`\nSUCCESS: Generated all ${totalCitiesCount} cities with ${totalStationsSum} total listed station records!`);
