import { MetroCity } from '../types/metro';

export const METRO_CITIES: MetroCity[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    state: 'Delhi NCR',
    region: 'North',
    coordinates: { x: 345, y: 310, lat: 28.6139, lng: 77.2090 },
    activeLinesCount: 12,
    totalStationsCount: 327,
    interchangeCount: 23,
    status: 'Operational',
    description: 'The largest rapid transit system in India, spanning Delhi, Gurgaon, Noida, Faridabad, Ghaziabad, and Bahadurgarh.',
    pdfPage: 57,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'delhi-red',
        name: 'Red Line',
        colorName: 'Red Line',
        colorHex: '#DC2626',
        status: 'Active',
        stationCount: 29,
        firstStation: 'Shaheed Sthal (New Bus Adda)',
        lastStation: 'Rithala',
        stations: [
          'Shaheed Sthal (New Bus Adda)', 'Hindon River', 'Arthala', 'Mohan Nagar', 'Shyam park',
          'Major Mohit Sharma Rajendra Nagar', 'Raj Bagh', 'Shaheed Nagar', 'Dilshad Garden',
          'Jhilmil', 'Mansarovar Park', 'Shahdara', 'Welcome', 'Seelampur', 'Shastri Park',
          'Kashmere Gate', 'Tis Hazari', 'Pulbangash', 'Pratap Nagar', 'Shastri Nagar',
          'Inderlok', 'Kanhaiya Nagar', 'Keshav Puram', 'Netaji Subhash Place', 'Kohat Enclave',
          'Madhuban Chowk (Pitampura)', 'Rohini East', 'Rohini West', 'Rithala'
        ],
        interchangeStations: ['Welcome', 'Kashmere Gate', 'Inderlok', 'Netaji Subhash Place', 'Madhuban Chowk (Pitampura)']
      },
      {
        id: 'delhi-yellow',
        name: 'Yellow Line',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 37,
        firstStation: 'Samaypur Badli',
        lastStation: 'Millennium City Centre (HUDA City Centre)',
        stations: [
          'Samaypur Badli', 'Rohini Sector 18 19', 'Haiderpur Badli Mor', 'Jahangirpuri', 'Adarsh Nagar',
          'Azadpur', 'Model Town', 'GTB Nagar', 'Vishwavidyalaya', 'Vidhan Sabha', 'Civil Lines',
          'Kashmere Gate', 'Chandni Chowk', 'Chawri Bazar', 'New Delhi', 'Rajiv Chowk', 'Patel Chowk',
          'Central Secretariat', 'Udyog Bhawan (Seva Teerth)', 'Lok Kalyan Marg', 'Jor Bagh',
          'Dilli Haat INA', 'AIIMS', 'Green Park', 'Hauz Khas', 'Malviya Nagar', 'Saket',
          'Qutab Minar', 'Chhatarpur', 'Sultanpur', 'Ghitorni', 'Arjan Garh', 'Guru Dronacharya',
          'Sikandarpur', 'MG Road', 'IFFCO Chowk', 'Millennium City Centre (HUDA City Centre)'
        ],
        interchangeStations: ['Haiderpur Badli Mor', 'Azadpur', 'Kashmere Gate', 'New Delhi', 'Rajiv Chowk', 'Central Secretariat', 'Dilli Haat INA', 'Hauz Khas', 'Sikandarpur']
      },
      {
        id: 'delhi-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 50,
        firstStation: 'Noida Electronic City',
        lastStation: 'Dwarka Sector 21',
        stations: [
          'Noida Electronic City', 'Noida Sector 62', 'Noida Sector 59', 'Noida Sector 61',
          'Noida Sector 52', 'Noida Sector 34', 'Noida City Centre', 'Golf Course', 'Botanical Garden',
          'Noida Sector 18', 'Noida Sector 16', 'Noida Sector 15', 'New Ashok Nagar', 'Mayur Vihar Extension',
          'Mayur Vihar I', 'Akshardham', 'Yamuna Bank', 'Indraprastha', 'Supreme Court (Pragati Maidan)',
          'Mandi House', 'Barakhambha Road', 'Rajiv Chowk', 'RK Ashram Marg', 'Jhandewalan', 'Karol Bagh',
          'Rajendra Place', 'Patel Nagar', 'Shadipur', 'Kirti Nagar', 'Moti Nagar', 'Ramesh Nagar',
          'Rajouri Garden', 'Tagore Garden', 'Subhash Nagar', 'Tilak Nagar', 'Janakpuri East',
          'Janakpuri West', 'Uttam Nagar East', 'Uttam Nagar West', 'Nawada', 'Dwarka Mor',
          'Dwarka', 'Dwarka Sector 14', 'Dwarka Sector 13', 'Dwarka Sector 12', 'Dwarka Sector 11',
          'Dwarka Sector 10', 'Dwarka Sector 9', 'Dwarka Sector 8', 'Dwarka Sector 21'
        ],
        interchangeStations: ['Botanical Garden', 'Mayur Vihar I', 'Mandi House', 'Rajiv Chowk', 'Kirti Nagar', 'Rajouri Garden', 'Janakpuri West', 'Dwarka', 'Dwarka Sector 21']
      },
      {
        id: 'delhi-blue-branch',
        name: 'Blue Branch Line',
        colorName: 'Blue Branch Line',
        colorHex: '#3B82F6',
        status: 'Active',
        stationCount: 41,
        firstStation: 'Vaishali',
        lastStation: 'Dwarka Sector 21',
        stations: [
          'Vaishali', 'Kaushambi', 'Anand Vihar ISBT', 'Karkarduma', 'Preet Vihar', 'Nirman Vihar',
          'Laxmi Nagar', 'Yamuna Bank', 'Indraprastha', 'Supreme Court (Pragati Maidan)', 'Mandi House',
          'Barakhambha Road', 'Rajiv Chowk', 'RK Ashram Marg', 'Jhandewalan', 'Karol Bagh',
          'Rajendra Place', 'Patel Nagar', 'Shadipur', 'Kirti Nagar', 'Moti Nagar', 'Ramesh Nagar',
          'Rajouri Garden', 'Tagore Garden', 'Subhash Nagar', 'Tilak Nagar', 'Janakpuri East',
          'Janakpuri West', 'Uttam Nagar East', 'Uttam Nagar West', 'Nawada', 'Dwarka Mor',
          'Dwarka', 'Dwarka Sector 14', 'Dwarka Sector 13', 'Dwarka Sector 12', 'Dwarka Sector 11',
          'Dwarka Sector 10', 'Dwarka Sector 9', 'Dwarka Sector 8', 'Dwarka Sector 21'
        ],
        interchangeStations: ['Anand Vihar ISBT', 'Karkarduma', 'Mandi House', 'Rajiv Chowk', 'Rajouri Garden', 'Janakpuri West', 'Dwarka', 'Dwarka Sector 21']
      },
      {
        id: 'delhi-green',
        name: 'Green Line',
        colorName: 'Green Line',
        colorHex: '#16A34A',
        status: 'Active',
        stationCount: 22,
        firstStation: 'Inderlok',
        lastStation: 'Brigadier Hoshiar Singh',
        stations: [
          'Inderlok', 'Ashok Park Main', 'Punjabi Bagh', 'Punjabi Bagh West', 'Shivaji Park',
          'Madipur', 'Paschim Vihar East', 'Paschim Vihar West', 'Peeragarhi', 'Udyog Nagar',
          'Maharaja Surajmal Stadium', 'Nangloi', 'Nangloi Railway Station', 'Rajdhani Park',
          'Mundka', 'Mundka Industrial Area', 'Ghevra', 'Tikri Kalan', 'Tikri Border',
          'Pandit Shree Ram Sharma', 'Bahadurgarh City', 'Brigadier Hoshiar Singh'
        ],
        interchangeStations: ['Inderlok', 'Punjabi Bagh West']
      },
      {
        id: 'delhi-green-branch',
        name: 'Green Branch Line',
        colorName: 'Green Branch Line',
        colorHex: '#22C55E',
        status: 'Active',
        stationCount: 23,
        firstStation: 'Kirti Nagar',
        lastStation: 'Brigadier Hoshiar Singh',
        stations: [
          'Kirti Nagar', 'Satguru Ram Singh Marg', 'Ashok Park Main', 'Punjabi Bagh', 'Punjabi Bagh West',
          'Shivaji Park', 'Madipur', 'Paschim Vihar East', 'Paschim Vihar West', 'Peeragarhi',
          'Udyog Nagar', 'Maharaja Surajmal Stadium', 'Nangloi', 'Nangloi Railway Station',
          'Rajdhani Park', 'Mundka', 'Mundka Industrial Area', 'Ghevra', 'Tikri Kalan',
          'Tikri Border', 'Pandit Shree Ram Sharma', 'Bahadurgarh City', 'Brigadier Hoshiar Singh'
        ],
        interchangeStations: ['Kirti Nagar', 'Punjabi Bagh West']
      },
      {
        id: 'delhi-grey',
        name: 'Grey Line',
        colorName: 'Grey Line',
        colorHex: '#64748B',
        status: 'Active',
        stationCount: 4,
        firstStation: 'Dwarka',
        lastStation: 'Dhansa Bus Stand',
        stations: ['Dwarka', 'Nangli', 'Najafgarh', 'Dhansa Bus Stand'],
        interchangeStations: ['Dwarka']
      },
      {
        id: 'delhi-magenta',
        name: 'Magenta Line',
        colorName: 'Magenta Line',
        colorHex: '#C026D3',
        status: 'Active',
        stationCount: 33,
        firstStation: 'Majlis Park',
        lastStation: 'Botanical Garden',
        stations: [
          'Majlis Park', 'Bhalswa Lake', 'Haiderpur Badli Mor', 'Pitampura North', 'North Pitampura (Prashant Vihar)',
          'Madhuban Chowk (Pitampura)', 'Deepali Chowk', 'Krishna Park Extension', 'Janakpuri West',
          'Dabri Mor Janakpuri South', 'Dashrathpuri', 'Palam', 'Sadar Bazar Cantonment',
          'Terminal 1 IGI Airport', 'Shankar Vihar', 'Vasant Vihar', 'Munirka', 'RK Puram',
          'IIT', 'Hauz Khas', 'Panchsheel Park', 'Chirag Delhi', 'Greater Kailash', 'Nehru Enclave',
          'Kalkaji Mandir', 'Okhla NSIC', 'Sukhdev Vihar', 'Jamia Millia Islamia', 'Okhla Vihar',
          'Jasola Vihar Shaheen Bagh', 'Kalindi Kunj', 'Okhla Bird Sanctuary', 'Botanical Garden'
        ],
        interchangeStations: ['Majlis Park', 'Haiderpur Badli Mor', 'Madhuban Chowk (Pitampura)', 'Janakpuri West', 'Hauz Khas', 'Kalkaji Mandir', 'Botanical Garden']
      },
      {
        id: 'delhi-orange',
        name: 'Orange Line (Airport Express)',
        colorName: 'Orange Line',
        colorHex: '#EA580C',
        status: 'Active',
        stationCount: 7,
        firstStation: 'New Delhi',
        lastStation: 'Yashobhoomi Dwarka Sector 25',
        stations: [
          'New Delhi', 'Shivaji Stadium', 'Dhaula Kuan', 'Delhi Aerocity', 'IGI Airport',
          'Dwarka Sector 21', 'Yashobhoomi Dwarka Sector 25'
        ],
        interchangeStations: ['New Delhi', 'Dwarka Sector 21']
      },
      {
        id: 'delhi-pink',
        name: 'Pink Line',
        colorName: 'Pink Line',
        colorHex: '#EC4899',
        status: 'Active',
        stationCount: 43,
        firstStation: 'Maujpur Babarpur',
        lastStation: 'Yamuna Vihar',
        stations: [
          'Maujpur Babarpur', 'Jafrabad', 'Welcome', 'East Azad Nagar', 'Krishna Nagar',
          'Karkarduma Court', 'Karkarduma', 'Anand Vihar ISBT', 'IP Extension', 'Mandawali West Vinod Nagar',
          'East Vinod Nagar Mayur Vihar II', 'Trilokpuri Sanjay Lake', 'Shri Ram Mandir Mayur Vihar (Pkt I)',
          'Mayur Vihar I', 'Sarai Kale Khan Nizamuddin', 'Ashram', 'Vinobapuri', 'Lajpat Nagar',
          'South Extension', 'Dilli Haat INA', 'Sarojini Nagar', 'Bhikaji Cama Place',
          'Sir Vishweshwaraiah Moti Bagh', 'Durgabai Deshmukh South Campus', 'Delhi Cantt',
          'Naraina Vihar', 'Mayapuri', 'Rajouri Garden', 'ESI Basaidarapur', 'Punjabi Bagh West',
          'Shakurpur', 'Netaji Subhash Place', 'Shalimar Bagh', 'Azadpur', 'Majlis Park',
          'Burari', 'Jharoda Majra', 'Wazirabad (Jagatpur)', 'Soorghat', 'Nanaksar (Sonia Vihar)',
          'Khajuri Khas', 'Bhajanpura', 'Yamuna Vihar'
        ],
        interchangeStations: ['Welcome', 'Karkarduma', 'Anand Vihar ISBT', 'Mayur Vihar I', 'Lajpat Nagar', 'Dilli Haat INA', 'Rajouri Garden', 'Punjabi Bagh West', 'Netaji Subhash Place', 'Azadpur', 'Majlis Park']
      },
      {
        id: 'delhi-pink-branch',
        name: 'Pink Branch Line',
        colorName: 'Pink Branch Line',
        colorHex: '#F472B6',
        status: 'Active',
        stationCount: 4,
        firstStation: 'Shiv Vihar',
        lastStation: 'Maujpur Babarpur',
        stations: ['Shiv Vihar', 'Johri Enclave', 'Gokulpuri', 'Maujpur Babarpur'],
        interchangeStations: ['Maujpur Babarpur']
      },
      {
        id: 'delhi-violet',
        name: 'Violet Line',
        colorName: 'Violet Line',
        colorHex: '#7C3AED',
        status: 'Active',
        stationCount: 34,
        firstStation: 'Kashmere Gate',
        lastStation: 'Raja Nahar Singh Ballabhgarh',
        stations: [
          'Kashmere Gate', 'Lal Quila', 'Jama Masjid', 'Delhi Gate', 'ITO', 'Mandi House',
          'Janpath', 'Central Secretariat', 'Khan Market', 'JLN Stadium', 'Jangpura',
          'Lajpat Nagar', 'Moolchand', 'Kailash Colony', 'Nehru Place', 'Kalkaji Mandir',
          'Govind Puri', 'Harkesh Nagar Okhla', 'Jasola Apollo', 'Sarita Vihar', 'Mohan Estate',
          'Tughlakabad Station', 'Badarpur Border', 'Sarai', 'NHPC Chowk', 'Mewala Maharajpur',
          'Sector 28', 'Badkal Mor', 'Old Faridabad', 'Neelam Chowk Ajronda', 'Bata Chowk',
          'Escorts Mujesar', 'Sant Surdas Sihi', 'Raja Nahar Singh Ballabhgarh'
        ],
        interchangeStations: ['Kashmere Gate', 'Mandi House', 'Central Secretariat', 'Lajpat Nagar', 'Kalkaji Mandir']
      }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    hindiName: 'मुंबई',
    state: 'Maharashtra',
    region: 'West',
    coordinates: { x: 260, y: 640, lat: 19.0760, lng: 72.8777 },
    activeLinesCount: 4,
    totalStationsCount: 74,
    interchangeCount: 2,
    status: 'Operational',
    description: 'Mumbai Metro network covering major commercial corridors with elevated and underground transit lines.',
    pdfPage: 19,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'mumbai-blue',
        name: 'Blue Line (Line 1)',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 12,
        firstStation: 'Versova',
        lastStation: 'Ghatkopar',
        stations: [
          'Versova', 'DN Nagar', 'Azad Nagar', 'Andheri', 'Western Express Highway',
          'Chakala JB Nagar', 'Airport Road', 'Marol Naka', 'Saki Naka', 'Asalpha',
          'Jagruti Nagar', 'Ghatkopar'
        ],
        interchangeStations: ['Marol Naka', 'DN Nagar', 'Andheri']
      },
      {
        id: 'mumbai-yellow',
        name: 'Yellow Line (Line 2A)',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 17,
        firstStation: 'Dahisar East',
        lastStation: 'Andheri West',
        stations: [
          'Dahisar East', 'Anand Nagar', 'Kandarpada', 'Mandapeshwar', 'Eksar',
          'Borivali West', 'Shimpoli', 'Kandivali West', 'Dahanukarwadi', 'Valnai',
          'Malad West', 'Lower Malad', 'Bangur Nagar', 'Goregaon West', 'Oshiwara',
          'Lower Oshiwara', 'Andheri West'
        ],
        interchangeStations: ['Dahisar East', 'Andheri West']
      },
      {
        id: 'mumbai-red',
        name: 'Red Line (Line 7)',
        colorName: 'Red Line',
        colorHex: '#DC2626',
        status: 'Active',
        stationCount: 17,
        firstStation: 'Kashigaon',
        lastStation: 'Gundavali',
        stations: [
          'Kashigaon', 'Miragaon', 'Pandhurang Wadi', 'Dahisar East', 'Ovaripada',
          'Rashtriya Udyan', 'Devipada', 'Magathane', 'Poisar', 'Akurli',
          'Kurar', 'Dindoshi', 'Aarey', 'Goregaon East', 'Jogeshwari East',
          'Mogra', 'Gundavali'
        ],
        interchangeStations: ['Dahisar East']
      },
      {
        id: 'mumbai-aqua',
        name: 'Aqua Line (Line 3)',
        colorName: 'Aqua Line',
        colorHex: '#06B6D4',
        status: 'Active',
        stationCount: 28,
        firstStation: 'Aarey JVLR',
        lastStation: 'Cuffe Parade',
        stations: [
          'Aarey JVLR', 'SEEPZ', 'MIDC Andheri', 'Marol Naka', 'CSMI Airport T2',
          'Sahar Road', 'CSMI Airport T1', 'Santacruz', 'Bandra Colony',
          'Bandra Kurla Complex', 'Dharavi', 'Shitla Devi Mandir', 'Dadar',
          'Siddhivinayak', 'Worli', 'Acharya Atre Chowk', 'Science Museum',
          'Mahalaxmi', 'Jagannath Shankar Sheth', 'Grant Road', 'Girgaon',
          'Kalbadevi', 'Chhatrapati Shivaji Maharaj Terminus (CST)',
          'Hutatma Chowk', 'Churchgate', 'Vidhan Bhavan', 'Badhwar Park', 'Cuffe Parade'
        ],
        interchangeStations: ['Marol Naka']
      }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    hindiName: 'बेंगलुरु',
    state: 'Karnataka',
    region: 'South',
    coordinates: { x: 375, y: 840, lat: 12.9716, lng: 77.5946 },
    activeLinesCount: 3,
    totalStationsCount: 85,
    interchangeCount: 2,
    status: 'Operational',
    description: 'Namma Metro serving the Silicon Valley of India with high-frequency Green, Purple, and Yellow corridors.',
    pdfPage: 67,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'blr-green',
        name: 'Green Line',
        colorName: 'Green Line',
        colorHex: '#16A34A',
        status: 'Active',
        stationCount: 32,
        firstStation: 'Madavara (BIEC)',
        lastStation: 'Silk Institute',
        stations: [
          'Madavara (BIEC)', 'Chikkabidarakallu', 'Manjunatha Nagara', 'Nagasandra',
          'Dasarahalli', 'Jalahalli', 'Peenya Industry', 'Peenya', 'Goraguntepalya',
          'Yeshwanthpur', 'Sandal Soap Factory', 'Mahalakshmi', 'Rajajinagar',
          'Kuvempu Road', 'Srirampura', 'Sampige Road',
          'Nadaprabhu Kempegowda station (Majestic)', 'Chickpete', 'Krishna Rajendra Market',
          'National College', 'Lalbagh Botanical Garden', 'South End Circle', 'Jayanagara',
          'Rashtreeya Vidyalaya Road', 'Banashankari', 'Jaya Prakash Nagara',
          'Yelachenahalli', 'Konanakunte Cross', 'Doddakallasandra', 'Vajarahalli',
          'Thalaghattapura', 'Silk Institute'
        ],
        interchangeStations: ['Nadaprabhu Kempegowda station (Majestic)', 'Rashtreeya Vidyalaya Road']
      },
      {
        id: 'blr-purple',
        name: 'Purple Line',
        colorName: 'Purple Line',
        colorHex: '#9333EA',
        status: 'Active',
        stationCount: 37,
        firstStation: 'Whitefield (Kadugodi)',
        lastStation: 'Challaghatta',
        stations: [
          'Whitefield (Kadugodi)', 'Hopefarm Channasandra', 'Kadugodi Tree Park',
          'Pattanduru Agrahara', 'Sri Sathya Sai Hospital', 'Nallurhalli',
          'Kundalahalli', 'Seetharamapalya', 'Hoodi', 'Garudacharpalya',
          'Singayyanapalya', 'Krishnarajapura (K.R.Pura)', 'Benniganahalli',
          'Baiyappanahalli', 'Swami Vivekananda Road', 'Indiranagar', 'Halasuru',
          'Trinity', 'MG Road', 'Cubbon Park', 'Dr. BR. Ambedkar Station (Vidhana Soudha)',
          'Sir M. Visveshwaraya Station (Central College)', 'Nadaprabhu Kempegowda station (Majestic)',
          'City Railway station', 'Magadi Road', 'Sri Balagangadharanatha Swamiji Station (Hosahalli)',
          'Vijayanagara', 'Attiguppe', 'Deepanjali Nagar', 'Mysuru Road',
          'Pantharapalya (Nayandahalli)', 'Rajarajeshwari Nagar', 'Jnanabharathi',
          'Pattanagere', 'Kengeri Bus Terminal', 'Kengeri', 'Challaghatta'
        ],
        interchangeStations: ['Nadaprabhu Kempegowda station (Majestic)']
      },
      {
        id: 'blr-yellow',
        name: 'Yellow Line',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 16,
        firstStation: 'Rashtreeya Vidyalaya Road',
        lastStation: 'Delta Electronics Bommasandra',
        stations: [
          'Rashtreeya Vidyalaya Road', 'Ragigudda', 'Jayadeva Hospital', 'BTM Layout',
          'Central Silk Board', 'Bommanahalli', 'Hongasandra', 'Kudlu Gate',
          'Singasandra', 'Hosa Road', 'Beratena Agrahara', 'Electronic City',
          'Infosys Foundation Konappana Agrahara', 'Huskur Road', 'Biocon Hebbagodi',
          'Delta Electronics Bommasandra'
        ],
        interchangeStations: ['Rashtreeya Vidyalaya Road']
      }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    hindiName: 'कोलकाता',
    state: 'West Bengal',
    region: 'East',
    coordinates: { x: 675, y: 535, lat: 22.5726, lng: 88.3639 },
    activeLinesCount: 5,
    totalStationsCount: 58,
    interchangeCount: 3,
    status: 'Operational',
    description: "India's pioneer metro railway system with underwater tunnel connectivity across the Hooghly River.",
    pdfPage: 28,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'kol-blue',
        name: 'Blue Line (Line 1)',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 26,
        firstStation: 'Dakshineswar',
        lastStation: 'Kavi Subhash (New Garia)',
        stations: [
          'Dakshineswar', 'Baranagar', 'Noapara', 'Dum Dum', 'Belgachhia',
          'Shyambazaar', 'Shobhabazar Sutanuti', 'Girish Park', 'Mahatma Gandhi Road',
          'Central', 'Chandni Chowk', 'Esplanade', 'Park Street', 'Maidan',
          'Rabindra Sadan', 'Netaji Bhavan', 'Jatin Das Park', 'Kalighat',
          'Rabindra Sarobar', 'Mahanayak Uttam Kumar (Tollygunge)', 'Netaji',
          'Masterda Surya Sen', 'Gitanjali', 'Kavi Nazrul', 'Shahid Khudiram',
          'Kavi Subhash (New Garia)'
        ],
        interchangeStations: ['Esplanade', 'Kavi Subhash (New Garia)', 'Noapara']
      },
      {
        id: 'kol-green',
        name: 'Green Line (Line 2)',
        colorName: 'Green Line',
        colorHex: '#16A34A',
        status: 'Active',
        stationCount: 12,
        firstStation: 'Salt Lake Sector V',
        lastStation: 'Howrah Maidan',
        stations: [
          'Salt Lake Sector V', 'Karunamoyee', 'Central Park', 'City Centre',
          'Bengal Chemical', 'Salt Lake Stadium', 'Phoolbagan', 'Sealdah',
          'Esplanade', 'Mahakaran', 'Howrah', 'Howrah Maidan'
        ],
        interchangeStations: ['Esplanade']
      },
      {
        id: 'kol-orange',
        name: 'Orange Line (Line 6)',
        colorName: 'Orange Line',
        colorHex: '#EA580C',
        status: 'Active',
        stationCount: 9,
        firstStation: 'Beliaghata',
        lastStation: 'Kavi Subhash (New Garia)',
        stations: [
          'Beliaghata', 'Barun Sengupta', 'Ritwik Ghatak', 'VIP Bazaar',
          'Hemanta Mukhopadhyay', 'Kavi Sukanta', 'Jyotirindra Nandi',
          'Satyajit Ray', 'Kavi Subhash (New Garia)'
        ],
        interchangeStations: ['Kavi Subhash (New Garia)']
      },
      {
        id: 'kol-purple',
        name: 'Purple Line (Line 3)',
        colorName: 'Purple Line',
        colorHex: '#9333EA',
        status: 'Active',
        stationCount: 7,
        firstStation: 'Joka',
        lastStation: 'Majerhat',
        stations: ['Joka', 'Thakurpukur', 'Sakherbazar', 'Behala Chowrasta', 'Behala Bazar', 'Taratala', 'Majerhat'],
        interchangeStations: []
      },
      {
        id: 'kol-yellow',
        name: 'Yellow Line (Line 4)',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 4,
        firstStation: 'Noapara',
        lastStation: 'Jai Hind (Airport)',
        stations: ['Noapara', 'Dum Dum Cantonment', 'Jessore Road', 'Jai Hind (Airport)'],
        interchangeStations: ['Noapara']
      }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    hindiName: 'चेन्नई',
    state: 'Tamil Nadu',
    region: 'South',
    coordinates: { x: 475, y: 840, lat: 13.0827, lng: 80.2707 },
    activeLinesCount: 2,
    totalStationsCount: 43,
    interchangeCount: 2,
    status: 'Operational',
    description: 'Chennai Metro Rail providing multi-modal connections across railway termini, airport, and IT expressway.',
    pdfPage: 60,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'che-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 26,
        firstStation: 'Wimco Nagar Depot',
        lastStation: 'Chennai International Airport',
        stations: [
          'Wimco Nagar Depot', 'Wimco Nagar', 'Thiruvottriyur', 'Thiruvottriyur Theradi',
          'Kaladipet', 'Tollgate', 'New Washermanpet', 'Tondiarpet', 'Sir Theagaraya College',
          'Washermanpet', 'Mannadi', 'High Court', 'MGR Central (Chennai Central)',
          'Government Estate', 'LIC', 'Thousand Lights', 'AG DMS', 'Teynampet',
          'Nandanam', 'Saidapet', 'Little Mount', 'Guindy', 'Arignar Anna Alandur',
          'Nanganallur Road', 'Meenambakkam', 'Chennai International Airport'
        ],
        interchangeStations: ['Arignar Anna Alandur', 'MGR Central (Chennai Central)']
      },
      {
        id: 'che-green',
        name: 'Green Line',
        colorName: 'Green Line',
        colorHex: '#16A34A',
        status: 'Active',
        stationCount: 17,
        firstStation: 'MGR Central (Chennai Central)',
        lastStation: 'St Thomas Mount',
        stations: [
          'MGR Central (Chennai Central)', 'Egmore', 'Nehru Park', 'Kilpauk Medical College',
          'Pachaiyappa College', 'Shenoy Nagar', 'Anna Nagar East', 'Anna Nagar Tower',
          'Thirumangalam', 'Koyambedu', 'CMBT', 'Arumbakkam', 'Vadapalani',
          'Ashok Nagar', 'Ekkattuthangal', 'Arignar Anna Alandur', 'St Thomas Mount'
        ],
        interchangeStations: ['Arignar Anna Alandur', 'MGR Central (Chennai Central)']
      }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    hindiName: 'हैदराबाद',
    state: 'Telangana',
    region: 'South',
    coordinates: { x: 410, y: 670, lat: 17.3850, lng: 78.4867 },
    activeLinesCount: 3,
    totalStationsCount: 59,
    interchangeCount: 3,
    status: 'Operational',
    description: 'Hyderabad Metro featuring high-capacity elevated transit connecting major IT, educational, and commercial hubs.',
    pdfPage: 46,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'hyd-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 23,
        firstStation: 'Nagole',
        lastStation: 'Raidurg',
        stations: [
          'Nagole', 'Uppal', 'Stadium', 'NGRI', 'Habsiguda', 'Tarnaka', 'Mettuguda',
          'Secunderabad East', 'JBS Parade Ground', 'Paradise', 'Rasoolpura',
          'Prakash Nagar', 'Begumpet', 'Ameerpet', 'Madhura Nagar', 'Yousufguda',
          'Road No 5 Jubilee Hills', 'Jubilee Hills Check Post', 'Peddamma Gudi',
          'Madhapur', 'Durgam Cheruvu', 'Hitec City', 'Raidurg'
        ],
        interchangeStations: ['Ameerpet', 'JBS Parade Ground']
      },
      {
        id: 'hyd-green',
        name: 'Green Line',
        colorName: 'Green Line',
        colorHex: '#16A34A',
        status: 'Active',
        stationCount: 9,
        firstStation: 'JBS Parade Ground',
        lastStation: 'MG Bus Station',
        stations: [
          'JBS Parade Ground', 'Secunderabad West', 'Gandhi Hospital', 'Musheerabad',
          'RTC X Roads', 'Chikkadpally', 'Narayanguda', 'Sultan Bazar', 'MG Bus Station'
        ],
        interchangeStations: ['JBS Parade Ground', 'MG Bus Station']
      },
      {
        id: 'hyd-red',
        name: 'Red Line',
        colorName: 'Red Line',
        colorHex: '#DC2626',
        status: 'Active',
        stationCount: 27,
        firstStation: 'Miyapur',
        lastStation: 'LB Nagar',
        stations: [
          'Miyapur', 'JNTU College', 'KPHB Colony', 'Kukatpally', 'Balanagar',
          'Moosapet', 'Bharat Nagar', 'Erragadda', 'ESI Hospital', 'SR Nagar',
          'Ameerpet', 'Punjagutta', 'Errum Manzil', 'Khairatabad', 'Lakdi Ka Pul',
          'Assembly', 'Nampally', 'Gandhi Bhavan', 'Osmania Medical College',
          'MG Bus Station', 'Malakpet', 'New Market', 'Musarambagh',
          'Dilsukhnagar', 'Chaitanyapuri', 'Victoria Memorial', 'LB Nagar'
        ],
        interchangeStations: ['Ameerpet', 'MG Bus Station']
      }
    ]
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    hindiName: 'अहमदाबाद',
    state: 'Gujarat',
    region: 'West',
    coordinates: { x: 235, y: 495, lat: 23.0225, lng: 72.5714 },
    activeLinesCount: 4,
    totalStationsCount: 57,
    interchangeCount: 3,
    status: 'Operational',
    description: 'Gujarat Metro network connecting Ahmedabad and Gandhinagar, including GIFT City and Motera Stadium.',
    pdfPage: 4,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'ahm-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 18,
        firstStation: 'Thaltej Gam',
        lastStation: 'Vastral Gam',
        stations: [
          'Thaltej Gam', 'Thaltej', 'Doordarshan Kendra', 'Gurukul Road',
          'Gujarat University', 'Commerce Six Road', 'SP Stadium', 'Old High Court',
          'Shahpur', 'Ghee Kanta', 'Kalupur', 'Kankaria East', 'Apparel Park',
          'Amraivadi', 'Rabari Colony', 'Vastral', 'Nirant Cross Road', 'Vastral Gam'
        ],
        interchangeStations: ['Old High Court']
      },
      {
        id: 'ahm-red',
        name: 'Red Line',
        colorName: 'Red Line',
        colorHex: '#DC2626',
        status: 'Active',
        stationCount: 15,
        firstStation: 'Motera Stadium',
        lastStation: 'APMC',
        stations: [
          'Motera Stadium', 'Sabarmati', 'AEC', 'Sabarmati Railway Station',
          'Ranip', 'Vadaj', 'Vijay Nagar', 'Usmanpura', 'Old High Court',
          'Gandhigram', 'Paldi', 'Shreyas', 'Rajiv Nagar', 'Jivraj Park', 'APMC'
        ],
        interchangeStations: ['Motera Stadium', 'Old High Court']
      },
      {
        id: 'ahm-violet',
        name: 'Violet Line',
        colorName: 'Violet Line',
        colorHex: '#7C3AED',
        status: 'Active',
        stationCount: 3,
        firstStation: 'GNLU',
        lastStation: 'Gift City',
        stations: ['GNLU', 'PDPU', 'Gift City'],
        interchangeStations: ['GNLU']
      },
      {
        id: 'ahm-yellow',
        name: 'Yellow Line',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 21,
        firstStation: 'Mahatma Mandir',
        lastStation: 'Motera Stadium',
        stations: [
          'Mahatma Mandir', 'Sector 24', 'Sector 16', 'Juna Sachivalaya',
          'Akshardham', 'Sachivalaya', 'Sector 10A', 'Sector 1', 'Infocity',
          'Dholakuva Circle', 'Randesan', 'Raysan', 'GNLU', 'Koba Gam',
          'Juna Koba', 'Koba Circle', 'Narmada Canal', 'Tapovan Circle',
          'Vishwakarma College', 'Koteshwar Road', 'Motera Stadium'
        ],
        interchangeStations: ['GNLU', 'Motera Stadium']
      }
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    hindiName: 'पुणे',
    state: 'Maharashtra',
    region: 'West',
    coordinates: { x: 290, y: 675, lat: 18.5204, lng: 73.8567 },
    activeLinesCount: 2,
    totalStationsCount: 30,
    interchangeCount: 1,
    status: 'Operational',
    description: 'Pune Metro linking Pimpri-Chinchwad, Shivaji Nagar, Deccan Gymkhana, and Ramwadi via modern eco-friendly lines.',
    pdfPage: 7,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'pune-aqua',
        name: 'Aqua Line',
        colorName: 'Aqua Line',
        colorHex: '#06B6D4',
        status: 'Active',
        stationCount: 16,
        firstStation: 'Vanaz',
        lastStation: 'Ramwadi',
        stations: [
          'Vanaz', 'Anand Nagar', 'Ideal Colony', 'Nal Stop', 'Garware College',
          'Deccan Gymkhana', 'Chhatrapati Sambhaji Udyan', 'PMC Bhavan', 'Civil Court',
          'Mangalwar Peth', 'Pune Railway Station', 'Ruby Hall Clinic', 'Bund Garden',
          'Yerwada', 'Kalyani Nagar', 'Ramwadi'
        ],
        interchangeStations: ['Civil Court']
      },
      {
        id: 'pune-purple',
        name: 'Purple Line',
        colorName: 'Purple Line',
        colorHex: '#9333EA',
        status: 'Active',
        stationCount: 14,
        firstStation: 'PCMC Bhavan',
        lastStation: 'Swargate',
        stations: [
          'PCMC Bhavan', 'Sant Tukaram Nagar', 'Nashik Phata', 'Kasarwadi',
          'Phugewadi', 'Dapodi', 'Bopodi', 'Khadki', 'Range Hills',
          'Shivaji Nagar', 'Civil Court', 'Kasba Peth', 'Mandai', 'Swargate'
        ],
        interchangeStations: ['Civil Court']
      }
    ]
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    hindiName: 'नागपुर',
    state: 'Maharashtra',
    region: 'Central',
    coordinates: { x: 420, y: 550, lat: 21.1458, lng: 79.0882 },
    activeLinesCount: 2,
    totalStationsCount: 38,
    interchangeCount: 1,
    status: 'Operational',
    description: 'Maha Metro Nagpur with the iconic diamond crossing interchange hub at Sitabuldi.',
    pdfPage: 18,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'nagpur-aqua',
        name: 'Aqua Line',
        colorName: 'Aqua Line',
        colorHex: '#06B6D4',
        status: 'Active',
        stationCount: 20,
        firstStation: 'Prajapati Nagar',
        lastStation: 'Lokmanya Nagar',
        stations: [
          'Prajapati Nagar', 'Vaishnodevi Square', 'Ambedkar Square', 'Telephone Exchange',
          'Chitar Oli Square', 'Agrasen Square', 'Dosar Vaishya Square', 'Nagpur Railway Station',
          'Cotton Market', 'Sitabuldi', 'Jhasi Rani Square', 'Institute of Engineers',
          'Shankar Nagar Square', 'LAD Square', 'Dharampeth College', 'Subhash Nagar',
          'Rachana Ring Road Junction', 'Vasudev Nagar', 'Bansi Nagar', 'Lokmanya Nagar'
        ],
        interchangeStations: ['Sitabuldi']
      },
      {
        id: 'nagpur-orange',
        name: 'Orange Line',
        colorName: 'Orange Line',
        colorHex: '#EA580C',
        status: 'Active',
        stationCount: 18,
        firstStation: 'Automotive Square',
        lastStation: 'Khapri',
        stations: [
          'Automotive Square', 'Nari Road', 'Indora Square', 'Kadvi Square',
          'Gaddigodam Square', 'Kasturchand Park', 'Zero Mile', 'Sitabuldi',
          'Congress Nagar', 'Rahate Colony', 'Ajni Square', 'Chhatrapati Square',
          'Jaiprakash Nagar', 'Ujjwal Nagar', 'Airport', 'Airport South',
          'New Airport', 'Khapri'
        ],
        interchangeStations: ['Sitabuldi']
      }
    ]
  },
  {
    id: 'kochi',
    name: 'Kochi',
    hindiName: 'कोच्चि',
    state: 'Kerala',
    region: 'South',
    coordinates: { x: 345, y: 960, lat: 9.9312, lng: 76.2673 },
    activeLinesCount: 1,
    totalStationsCount: 25,
    interchangeCount: 0,
    status: 'Operational',
    description: "India's first integrated transit ecosystem connecting metro rail, water metro, and feeder buses.",
    pdfPage: 33,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'kochi-line1',
        name: 'Line 1',
        colorName: 'Line 1',
        colorHex: '#0284C7',
        status: 'Active',
        stationCount: 25,
        firstStation: 'Aluva',
        lastStation: 'Tripunithura Terminal',
        stations: [
          'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom',
          'Kalamassery Town', 'Cochin University', 'Pathadipalam', 'Edappally',
          'Changampuzha Park', 'Palarivattom', 'JLN Stadium', 'Kaloor',
          'Town Hall', 'MG Road', 'Maharajas College', 'Ernakulam South',
          'Kadavanthra', 'Elamkulam', 'Vyttila', 'Thykoodam', 'Petta',
          'Vadakkekotta', 'SN Junction', 'Tripunithura Terminal'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    hindiName: 'लखनऊ',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { x: 480, y: 390, lat: 26.8467, lng: 80.9462 },
    activeLinesCount: 1,
    totalStationsCount: 21,
    interchangeCount: 0,
    status: 'Operational',
    description: 'The North-South Red Corridor connecting Chaudhary Charan Singh Airport directly to Munshipulia.',
    pdfPage: 26,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'lucknow-red',
        name: 'Red Line',
        colorName: 'Red Line',
        colorHex: '#DC2626',
        status: 'Active',
        stationCount: 21,
        firstStation: 'CCS Airport',
        lastStation: 'Munshipulia',
        stations: [
          'CCS Airport', 'Amausi', 'Transport Nagar', 'Krishna Nagar', 'Singar Nagar',
          'Alambagh', 'Alambagh Bus Stand', 'Mawaiya', 'Durgapuri', 'Charbagh',
          'Hussainganj', 'Sachivalaya', 'Hazratganj', 'KD Singh Babu Stadium',
          'Lucknow University', 'IT College', 'Badshah Nagar', 'Lekhraj Market',
          'Bhootnath Market', 'Indira Nagar', 'Munshipulia'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    hindiName: 'जयपुर',
    state: 'Rajasthan',
    region: 'North',
    coordinates: { x: 295, y: 375, lat: 26.9124, lng: 75.7873 },
    activeLinesCount: 1,
    totalStationsCount: 11,
    interchangeCount: 0,
    status: 'Operational',
    description: 'The Pink City Metro traversing historical heritage gates from Mansarovar to Badi Chaupar.',
    pdfPage: 40,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'jaipur-pink',
        name: 'Pink Line',
        colorName: 'Pink Line',
        colorHex: '#EC4899',
        status: 'Active',
        stationCount: 11,
        firstStation: 'Mansarovar',
        lastStation: 'Badi Chaupar',
        stations: [
          'Mansarovar', 'New Aatish Market', 'Vivek Vihar', 'Shyam Nagar', 'Ram Nagar',
          'Civil Lines', 'Railway Station', 'Sindhi Camp', 'Chandpole', 'Chhoti Chaupar', 'Badi Chaupar'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'noida',
    name: 'Noida',
    hindiName: 'नोएडा',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { x: 360, y: 325, lat: 28.5355, lng: 77.3910 },
    activeLinesCount: 1,
    totalStationsCount: 22,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Noida Metro Aqua Line connecting Noida Sector 51/52 to Greater Noida Depot with dedicated walkway interchange.',
    pdfPage: 12,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'noida-aqua',
        name: 'Aqua Line',
        colorName: 'Aqua Line',
        colorHex: '#06B6D4',
        status: 'Active',
        stationCount: 22,
        firstStation: 'Noida Sector 52',
        lastStation: 'Depot',
        stations: [
          'Noida Sector 52', 'Noida Sector 51', 'Noida Sector 50', 'Noida Sector 76',
          'Noida Sector 101', 'Noida Sector 81', 'NSEZ', 'Noida Sector 83',
          'Noida Sector 137', 'Noida Sector 142', 'Noida Sector 143', 'Noida Sector 144',
          'Noida Sector 145', 'Noida Sector 146', 'Noida Sector 147', 'Noida Sector 148',
          'Knowledge Park II', 'Pari Chowk', 'Alpha 1', 'Delta 1', 'GNIDA Office', 'Depot'
        ],
        interchangeStations: ['Noida Sector 52']
      }
    ]
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    hindiName: 'कानपुर',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { x: 460, y: 420, lat: 26.4499, lng: 80.3319 },
    activeLinesCount: 1,
    totalStationsCount: 14,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Kanpur Metro Orange corridor serving educational and commercial centers from IIT Kanpur to Kanpur Central.',
    pdfPage: 37,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'kanpur-orange',
        name: 'Orange Line',
        colorName: 'Orange Line',
        colorHex: '#EA580C',
        status: 'Active',
        stationCount: 14,
        firstStation: 'IIT Kanpur',
        lastStation: 'Kanpur Central',
        stations: [
          'IIT Kanpur', 'Kalyanpur', 'SPM Hospital', 'Vishwavidyalaya', 'Gurudev Chauraha',
          'Geeta Nagar', 'Rawatpur', 'LLR Hospital', 'Motijheel', 'Chunniganj',
          'Naveen Market', 'Bada Chauraha', 'Nayaganj', 'Kanpur Central'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    hindiName: 'गुरुग्राम',
    state: 'Haryana',
    region: 'North',
    coordinates: { x: 335, y: 325, lat: 28.4595, lng: 77.0266 },
    activeLinesCount: 1,
    totalStationsCount: 11,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Rapid Metro Gurgaon serving DLF Cyber City and Golf Course Road with seamless Delhi Metro interchange.',
    pdfPage: 47,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'gurgaon-rapid',
        name: 'Rapid Line',
        colorName: 'Rapid Line',
        colorHex: '#0284C7',
        status: 'Active',
        stationCount: 11,
        firstStation: 'Sector 55 56',
        lastStation: 'Phase 3',
        stations: [
          'Sector 55 56', 'Sector 54 Chowk', 'Sector 53 54', 'Sector 42 43', 'Phase 1',
          'Sikandarpur', 'Phase 2', 'Belvedere Towers', 'Cyber City', 'Moulsari Avenue', 'Phase 3'
        ],
        interchangeStations: ['Sikandarpur']
      }
    ]
  },
  {
    id: 'agra',
    name: 'Agra',
    hindiName: 'आगरा',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { x: 380, y: 370, lat: 27.1767, lng: 78.0081 },
    activeLinesCount: 1,
    totalStationsCount: 6,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Agra Metro Yellow Line serving world heritage wonders including Taj Mahal and Agra Fort.',
    pdfPage: 1,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'agra-yellow',
        name: 'Yellow Line',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 6,
        firstStation: 'Taj East Gate',
        lastStation: 'Mankameshwar',
        stations: [
          'Taj East Gate', 'Shahid Captain Shubham Gupta (Basai)', 'Fatehabad Road',
          'Taj Mahal', 'Agra Fort', 'Mankameshwar'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai',
    hindiName: 'नवी मुंबई',
    state: 'Maharashtra',
    region: 'West',
    coordinates: { x: 270, y: 648, lat: 19.0330, lng: 73.0297 },
    activeLinesCount: 1,
    totalStationsCount: 11,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Navi Mumbai Metro Line 1 linking Belapur Terminal to Pendhar across CBD Belapur and Kharghar.',
    pdfPage: 14,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'navimumbai-line1',
        name: 'Line 1',
        colorName: 'Line 1',
        colorHex: '#0D9488',
        status: 'Active',
        stationCount: 11,
        firstStation: 'Belapur Terminal',
        lastStation: 'Pendhar',
        stations: [
          'Belapur Terminal', 'RBI Colony', 'Belpada', 'Utsav Chowk',
          'Kendriya vihar', 'Kharghar village', 'Central park', 'Pethpada',
          'Amandoot', 'Pethali taloja', 'Pendhar'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'indore',
    name: 'Indore',
    hindiName: 'इंदौर',
    state: 'Madhya Pradesh',
    region: 'Central',
    coordinates: { x: 320, y: 520, lat: 22.7196, lng: 75.8577 },
    activeLinesCount: 1,
    totalStationsCount: 5,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Indore Metro Yellow Line priority corridor operating in the cleanest city of India.',
    pdfPage: 42,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'indore-yellow',
        name: 'Yellow Line',
        colorName: 'Yellow Line',
        colorHex: '#EAB308',
        textColorHex: '#78350F',
        status: 'Active',
        stationCount: 5,
        firstStation: 'Devi Ahilya Bai Holkar Terminal',
        lastStation: 'Veerangana Jhalkari Bai',
        stations: [
          'Devi Ahilya Bai Holkar Terminal', 'Maharani Lakshmi Bai',
          'Rani Avanti Bai Lodhi', 'Rani Durgavati', 'Veerangana Jhalkari Bai'
        ],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'patna',
    name: 'Patna',
    hindiName: 'पटना',
    state: 'Bihar',
    region: 'East',
    coordinates: { x: 590, y: 410, lat: 25.5941, lng: 85.1376 },
    activeLinesCount: 1,
    totalStationsCount: 3,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Patna Metro initial operational Blue Line corridor serving Bhootnath, Zero Mile, and New ISBT.',
    pdfPage: 11,
    mapType: 'Representative map from uploaded PDF',
    notes: 'Operational/active lines represented in the uploaded PDF; planned/under-construction stations are excluded from the main station database.',
    lines: [
      {
        id: 'patna-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Active',
        stationCount: 3,
        firstStation: 'Bhootnath',
        lastStation: 'New ISBT',
        stations: ['Bhootnath', 'Zero Mile', 'New ISBT'],
        interchangeStations: []
      }
    ]
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    hindiName: 'भोपाल',
    state: 'Madhya Pradesh',
    region: 'Central',
    coordinates: { x: 370, y: 495, lat: 23.2599, lng: 77.4126 },
    activeLinesCount: 1,
    totalStationsCount: 16,
    interchangeCount: 1,
    status: 'Partially Operational',
    description: 'Bhopal Metro Bhoj network with Orange Line priority section and future Blue Line intersection at Pul Bogda.',
    pdfPage: '5502.jpg',
    mapType: 'User-uploaded scan',
    notes: 'Added from uploaded Bhopal route map; Orange priority section has 8 operational stations (Karond Chauraha to AIIMS total 16). Blue line is under construction.',
    lines: [
      {
        id: 'bhopal-orange',
        name: 'Orange Line',
        colorName: 'Orange Line',
        colorHex: '#EA580C',
        status: 'Operational (Priority Section)',
        stationCount: 16,
        firstStation: 'Karond Chauraha',
        lastStation: 'AIIMS',
        stations: [
          'Karond Chauraha', 'Krishi Upaj Mandi', 'DIG Bungalow', 'Sindhi Colony',
          'Nadra Bus Stand', 'Bhopal Railway Station', 'Aishbagh', 'Pul Bogda',
          'Subhash Nagar', 'Kendriya Vidyalaya', 'Board Office Chauraha', 'MP Nagar',
          'Rani Kamalapati Railway Station', 'DRM Office', 'Alkapuri', 'AIIMS'
        ],
        interchangeStations: ['Pul Bogda']
      },
      {
        id: 'bhopal-blue',
        name: 'Blue Line',
        colorName: 'Blue Line',
        colorHex: '#2563EB',
        status: 'Under Construction',
        stationCount: 14,
        firstStation: 'Bhadbhada Chauraha',
        lastStation: 'Ratnagiri Tiraha',
        stations: [
          'Bhadbhada Chauraha', 'Depot Chauraha', 'Jawahar Chowk', 'Roshanpura Chauraha',
          'Kushabhau Thakre Hall', 'Parade Ground', 'Pul Bogda', 'Prabhat Chauraha',
          'Govindpura', 'Govindpura Industrial Area', 'JK Road', 'Indrapuri',
          'Piplani', 'Ratnagiri Tiraha'
        ],
        interchangeStations: ['Pul Bogda']
      }
    ]
  },
  {
    id: 'meerut',
    name: 'Meerut',
    hindiName: 'मेरठ',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: { x: 355, y: 285, lat: 28.9845, lng: 77.7064 },
    activeLinesCount: 1,
    totalStationsCount: 12,
    interchangeCount: 0,
    status: 'Operational',
    description: 'Meerut Metro operating dedicated urban rapid transit across 12 key stations from Meerut South to Modipuram.',
    pdfPage: '5499/5500/5501.jpg',
    mapType: 'User-uploaded scan',
    notes: 'Operational Meerut Metro urban corridor serving Meerut city.',
    lines: [
      {
        id: 'meerut-metro',
        name: 'Meerut Metro Line',
        colorName: 'Meerut Metro Line',
        colorHex: '#059669',
        status: 'Operational',
        stationCount: 12,
        firstStation: 'Meerut South',
        lastStation: 'Modipuram',
        stations: [
          'Meerut South', 'Partapur', 'Rithani', 'Shatabdi Nagar', 'Brahmapuri',
          'Meerut Central', 'Bhaisali', 'Begumpul', 'MES Colony', 'Daurli',
          'Meerut North', 'Modipuram'
        ],
        interchangeStations: []
      }
    ]
  }
];

export const ALL_INTERCHANGES = [
  { city: 'Ahmedabad', stationName: 'GNLU', connectedLines: 'Violet Line / Yellow Line', detectionNotes: 'Station-name overlap' },
  { city: 'Ahmedabad', stationName: 'Motera Stadium', connectedLines: 'Red Line / Yellow Line', detectionNotes: 'Station-name overlap' },
  { city: 'Ahmedabad', stationName: 'Old High Court', connectedLines: 'Blue Line / Red Line', detectionNotes: 'Station-name overlap' },
  { city: 'Bengaluru', stationName: 'Nadaprabhu Kempegowda station (Majestic)', connectedLines: 'Green Line / Purple Line', detectionNotes: 'Station-name overlap' },
  { city: 'Bengaluru', stationName: 'Rashtreeya Vidyalaya Road', connectedLines: 'Green Line / Yellow Line', detectionNotes: 'Station-name overlap' },
  { city: 'Chennai', stationName: 'Arignar Anna Alandur', connectedLines: 'Blue Line / Green Line', detectionNotes: 'Station-name overlap' },
  { city: 'Chennai', stationName: 'MGR Central (Chennai Central)', connectedLines: 'Blue Line / Green Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Azadpur', connectedLines: 'Yellow Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Botanical Garden', connectedLines: 'Blue Line / Magenta Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Central Secretariat', connectedLines: 'Yellow Line / Violet Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Dilli Haat INA', connectedLines: 'Yellow Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Dwarka', connectedLines: 'Blue Line / Grey Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Dwarka Sector 21', connectedLines: 'Blue Line / Orange Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Haiderpur Badli Mor', connectedLines: 'Yellow Line / Magenta Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Hauz Khas', connectedLines: 'Yellow Line / Magenta Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Inderlok', connectedLines: 'Red Line / Green Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Janakpuri West', connectedLines: 'Blue Line / Magenta Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Kalkaji Mandir', connectedLines: 'Magenta Line / Violet Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Kashmere Gate', connectedLines: 'Red Line / Yellow Line / Violet Line', detectionNotes: 'Triple-line interchange' },
  { city: 'Delhi', stationName: 'Lajpat Nagar', connectedLines: 'Pink Line / Violet Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Madhuban Chowk (Pitampura)', connectedLines: 'Red Line / Magenta Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Majlis Park', connectedLines: 'Magenta Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Mandi House', connectedLines: 'Blue Line / Violet Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Mayur Vihar I', connectedLines: 'Blue Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Netaji Subhash Place', connectedLines: 'Red Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'New Delhi', connectedLines: 'Yellow Line / Orange Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Punjabi Bagh West', connectedLines: 'Green Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Rajiv Chowk', connectedLines: 'Yellow Line / Blue Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Rajouri Garden', connectedLines: 'Blue Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Delhi', stationName: 'Welcome', connectedLines: 'Red Line / Pink Line', detectionNotes: 'Station-name overlap' },
  { city: 'Hyderabad', stationName: 'Ameerpet', connectedLines: 'Blue Line / Red Line', detectionNotes: 'Station-name overlap' },
  { city: 'Hyderabad', stationName: 'JBS Parade Ground', connectedLines: 'Blue Line / Green Line', detectionNotes: 'Station-name overlap' },
  { city: 'Hyderabad', stationName: 'MG Bus Station', connectedLines: 'Green Line / Red Line', detectionNotes: 'Station-name overlap' },
  { city: 'Kolkata', stationName: 'Esplanade', connectedLines: 'Blue Line / Green Line', detectionNotes: 'Station-name overlap' },
  { city: 'Kolkata', stationName: 'Kavi Subhash (New Garia)', connectedLines: 'Blue Line / Orange Line', detectionNotes: 'Station-name overlap' },
  { city: 'Kolkata', stationName: 'Noapara', connectedLines: 'Blue Line / Yellow Line', detectionNotes: 'Station-name overlap' },
  { city: 'Mumbai', stationName: 'Dahisar East', connectedLines: 'Yellow Line / Red Line', detectionNotes: 'Station-name overlap' },
  { city: 'Mumbai', stationName: 'Marol Naka', connectedLines: 'Blue Line / Aqua Line', detectionNotes: 'Station-name overlap' },
  { city: 'Nagpur', stationName: 'Sitabuldi', connectedLines: 'Aqua Line / Orange Line', detectionNotes: 'Station-name overlap' },
  { city: 'Pune', stationName: 'Civil Court', connectedLines: 'Aqua Line / Purple Line', detectionNotes: 'Station-name overlap' },
  { city: 'Bhopal', stationName: 'Pul Bogda', connectedLines: 'Orange Line ↔ Blue Line', detectionNotes: 'Primary Bhopal interchange' }
];
