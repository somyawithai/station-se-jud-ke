import { ExcelDatasetAudit } from '../types/metro';

export const EXCEL_AUDIT_DATA: ExcelDatasetAudit = {
  citiesDetected: 21, // 21 operational metro city systems (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune, Nagpur, Noida, Gurugram, Jaipur, Lucknow, Kochi, Kanpur, Agra, Navi Mumbai, Indore, Patna, Bhopal, Meerut)
  metroLinesDetected: 51, // Active metro lines across 21 cities
  totalStationRecords: 942, // Active line-station rows across 21 individual metro cities
  columnsFound: [
    {
      sheetName: 'City Summary / PDF Mapping (Sheets 1 & 2 / Pages 13-14)',
      columns: [
        'City',
        'Active Lines Included',
        'Stations Listed',
        'Notes',
        'Map Page',
        'Interchange Count',
        'Map Sheet Link'
      ]
    },
    {
      sheetName: 'Metro Line Details & Station Registry (Sheets 3 & 4 / Pages 15-20, 21-39)',
      columns: [
        'City',
        'Metro Line',
        'Status',
        'Station Count / Station No.',
        'First Station',
        'Last Station',
        'Stations (in order) / Station Name',
        'Source',
        'Interchange Stations / Interchange / Interlink With',
        'Interchange Sheet Link',
        'Map Page'
      ]
    },
    {
      sheetName: 'Interchanges (Pages 41-42)',
      columns: [
        'City',
        'Interchange / Interlink Station',
        'Connected Lines',
        'Detection Notes',
        'Go to Station Details'
      ]
    },
    {
      sheetName: 'Map Register & Scan Log (Pages 59-60)',
      columns: [
        'Scan File',
        'Subject',
        'Duplicate?',
        'Extracted / verified data',
        'Source',
        'Notes',
        'Map Image'
      ]
    },
    {
      sheetName: 'Regional Transit / Namo Bharat (Pages 61-62)',
      columns: [
        'Network',
        'Service',
        'Status',
        'Station No.',
        'Station',
        'Visibility in uploaded scan',
        'Verified source',
        'Interchange / Note'
      ]
    }
  ],
  missingDataNotes: [
    'Delhi-Meerut Namo Bharat RRTS: Duhai Depot and Modipuram Depot have missing numeric Station No. entries because they are train maintenance depots rather than commercial passenger boarding stations.',
    'Bhopal Metro: Blue Line (14 stations) and parts of the Orange Line outside the priority section are labeled as Under Construction in the workbook, so only the priority operational corridor is active.',
    'Several source links in the Excel omit full URL paths (e.g., "https://yometro.com/" without station endpoint suffix) on some rows.',
    'The uploaded primary PDF was image-based without a machine-readable text layer, necessitating YoMetro and NCRTC cross-verification as documented in the workbook.'
  ],
  duplicateDataNotes: [
    'Uploaded Scan Duplicates: Scan files 5499.jpg, 5500.jpg, and 5501.jpg are marked as duplicate Delhi–Meerut RRTS route maps in the map register.',
    'Shared Branch Line Station Duplication (Delhi): Delhi Blue Line (50 stations) and Blue Branch Line (41 stations) duplicate 34 shared stations between Yamuna Bank and Dwarka Sector 21. Delhi Green Line (22 stations) and Green Branch Line (23 stations) duplicate 20 shared stations between Ashok Park Main and Brigadier Hoshiar Singh. Pink Line and Pink Branch Line share Maujpur Babarpur station.',
    'Interchange Stations appearing across multiple lines within the same city (e.g., Rajiv Chowk in Delhi Blue & Yellow, Kashmere Gate in Red, Yellow & Violet, Sitabuldi in Nagpur, Majestic in Bengaluru, Ameerpet in Hyderabad, Old High Court in Ahmedabad).'
  ]
};
