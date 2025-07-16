export interface country {
    name: string;
    code: string;
    currencyCode: string;
    currencySymbol: string;
    phoneCode: string;
}

export const countries: country[] = [
    // India
  { name: 'India', code: 'IN', currencyCode: 'INR', currencySymbol: '₹', phoneCode: '+91' },

  // USA
  { name: 'United States', code: 'US', currencyCode: 'USD', currencySymbol: '$', phoneCode: '+1' },

  // Europe (selected countries)
  { name: 'Austria', code: 'AT', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+43' },
  { name: 'Belgium', code: 'BE', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+32' },
  { name: 'Bulgaria', code: 'BG', currencyCode: 'BGN', currencySymbol: 'лв', phoneCode: '+359' },
  { name: 'Croatia', code: 'HR', currencyCode: 'HRK', currencySymbol: 'kn', phoneCode: '+385' },
  { name: 'Cyprus', code: 'CY', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+357' },
  { name: 'Czech Republic', code: 'CZ', currencyCode: 'CZK', currencySymbol: 'Kč', phoneCode: '+420' },
  { name: 'Denmark', code: 'DK', currencyCode: 'DKK', currencySymbol: 'kr', phoneCode: '+45' },
  { name: 'Estonia', code: 'EE', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+372' },
  { name: 'Finland', code: 'FI', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+358' },
  { name: 'France', code: 'FR', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+33' },
  { name: 'Germany', code: 'DE', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+49' },
  { name: 'Greece', code: 'GR', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+30' },
  { name: 'Hungary', code: 'HU', currencyCode: 'HUF', currencySymbol: 'Ft', phoneCode: '+36' },
  { name: 'Iceland', code: 'IS', currencyCode: 'ISK', currencySymbol: 'kr', phoneCode: '+354' },
  { name: 'Ireland', code: 'IE', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+353' },
  { name: 'Italy', code: 'IT', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+39' },
  { name: 'Latvia', code: 'LV', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+371' },
  { name: 'Lithuania', code: 'LT', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+370' },
  { name: 'Luxembourg', code: 'LU', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+352' },
  { name: 'Malta', code: 'MT', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+356' },
  { name: 'Netherlands', code: 'NL', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+31' },
  { name: 'Norway', code: 'NO', currencyCode: 'NOK', currencySymbol: 'kr', phoneCode: '+47' },
  { name: 'Poland', code: 'PL', currencyCode: 'PLN', currencySymbol: 'zł', phoneCode: '+48' },
  { name: 'Portugal', code: 'PT', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+351' },
  { name: 'Romania', code: 'RO', currencyCode: 'RON', currencySymbol: 'lei', phoneCode: '+40' },
  { name: 'Slovakia', code: 'SK', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+421' },
  { name: 'Slovenia', code: 'SI', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+386' },
  { name: 'Spain', code: 'ES', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+34' },
  { name: 'Sweden', code: 'SE', currencyCode: 'SEK', currencySymbol: 'kr', phoneCode: '+46' },
  { name: 'Switzerland', code: 'CH', currencyCode: 'CHF', currencySymbol: 'Fr', phoneCode: '+41' },
  { name: 'United Kingdom', code: 'GB', currencyCode: 'GBP', currencySymbol: '£', phoneCode: '+44' },

  // South America (selected countries)
  { name: 'Argentina', code: 'AR', currencyCode: 'ARS', currencySymbol: '$', phoneCode: '+54' },
  { name: 'Bolivia', code: 'BO', currencyCode: 'BOB', currencySymbol: 'Bs.', phoneCode: '+591' },
  { name: 'Brazil', code: 'BR', currencyCode: 'BRL', currencySymbol: 'R$', phoneCode: '+55' },
  { name: 'Chile', code: 'CL', currencyCode: 'CLP', currencySymbol: '$', phoneCode: '+56' },
  { name: 'Colombia', code: 'CO', currencyCode: 'COP', currencySymbol: '$', phoneCode: '+57' },
  { name: 'Ecuador', code: 'EC', currencyCode: 'USD', currencySymbol: '$', phoneCode: '+593' },
  { name: 'Guyana', code: 'GY', currencyCode: 'GYD', currencySymbol: 'G$', phoneCode: '+592' },
  { name: 'Paraguay', code: 'PY', currencyCode: 'PYG', currencySymbol: '₲', phoneCode: '+595' },
  { name: 'Peru', code: 'PE', currencyCode: 'PEN', currencySymbol: 'S/.', phoneCode: '+51' },
  { name: 'Suriname', code: 'SR', currencyCode: 'SRD', currencySymbol: '$', phoneCode: '+597' },
  { name: 'Uruguay', code: 'UY', currencyCode: 'UYU', currencySymbol: '$U', phoneCode: '+598' },
  { name: 'Venezuela', code: 'VE', currencyCode: 'VES', currencySymbol: 'Bs.S.', phoneCode: '+58' },
];


export const states: { [countryCode: string]: { name: string; code: string }[] } = {
  IN: [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Assam', code: 'AS' },
    { name: 'Bihar', code: 'BR' },
    { name: 'Chhattisgarh', code: 'CG' },
    { name: 'Goa', code: 'GA' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Himachal Pradesh', code: 'HP' },
    { name: 'Jharkhand', code: 'JH' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Kerala', code: 'KL' },
    { name: 'Madhya Pradesh', code: 'MP' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Manipur', code: 'MN' },
    { name: 'Meghalaya', code: 'ML' },
    { name: 'Mizoram', code: 'MZ' },
    { name: 'Nagaland', code: 'NL' },
    { name: 'Odisha', code: 'OR' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Sikkim', code: 'SK' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Telangana', code: 'TG' },
    { name: 'Tripura', code: 'TR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Uttarakhand', code: 'UT' },
    { name: 'West Bengal', code: 'WB' },
    { name: 'Andaman and Nicobar Islands', code: 'AN' },
    { name: 'Chandigarh', code: 'CH' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Jammu and Kashmir', code: 'JK' },
    { name: 'Ladakh', code: 'LA' },
    { name: 'Lakshadweep', code: 'LD' },
    { name: 'Puducherry', code: 'PY' },
  ],

  US: [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Delaware', code: 'DE' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' },
    { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' },
    { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' },
  ],

  // Europe — some selected countries with states/provinces
  AT: [ // Austria - States (Bundesländer)
    { name: 'Burgenland', code: 'BL' },
    { name: 'Carinthia', code: 'KN' },
    { name: 'Lower Austria', code: 'NO' },
    { name: 'Upper Austria', code: 'OO' },
    { name: 'Salzburg', code: 'SZ' },
    { name: 'Styria', code: 'ST' },
    { name: 'Tyrol', code: 'TR' },
    { name: 'Vorarlberg', code: 'VL' },
    { name: 'Vienna', code: 'WI' },
  ],

  BE: [ // Belgium - Regions
    { name: 'Brussels-Capital Region', code: 'BRU' },
    { name: 'Flemish Region', code: 'VLG' },
    { name: 'Walloon Region', code: 'WAL' },
  ],

  BG: [ // Bulgaria - Provinces
    { name: 'Blagoevgrad', code: '01' },
    { name: 'Burgas', code: '02' },
    { name: 'Varna', code: '03' },
    { name: 'Veliko Tarnovo', code: '04' },
    { name: 'Vidin', code: '05' },
    { name: 'Vratsa', code: '06' },
    { name: 'Gabrovo', code: '07' },
    { name: 'Dobrich', code: '08' },
    { name: 'Kardzhali', code: '09' },
    { name: 'Kyustendil', code: '10' },
    { name: 'Lovech', code: '11' },
    { name: 'Montana', code: '12' },
    { name: 'Pazardzhik', code: '13' },
    { name: 'Pernik', code: '14' },
    { name: 'Pleven', code: '15' },
    { name: 'Plovdiv', code: '16' },
    { name: 'Razgrad', code: '17' },
    { name: 'Ruse', code: '18' },
    { name: 'Silistra', code: '19' },
    { name: 'Sliven', code: '20' },
    { name: 'Smolyan', code: '21' },
    { name: 'Sofia', code: '22' },
    { name: 'Sofia City', code: '23' },
    { name: 'Stara Zagora', code: '24' },
    { name: 'Targovishte', code: '25' },
    { name: 'Haskovo', code: '26' },
    { name: 'Shumen', code: '27' },
    { name: 'Yambol', code: '28' },
  ],

  // Germany (DE) states (Bundesländer)
  DE: [
    { name: 'Baden-Württemberg', code: 'BW' },
    { name: 'Bavaria', code: 'BY' },
    { name: 'Berlin', code: 'BE' },
    { name: 'Brandenburg', code: 'BB' },
    { name: 'Bremen', code: 'HB' },
    { name: 'Hamburg', code: 'HH' },
    { name: 'Hesse', code: 'HE' },
    { name: 'Lower Saxony', code: 'NI' },
    { name: 'Mecklenburg-Vorpommern', code: 'MV' },
    { name: 'North Rhine-Westphalia', code: 'NW' },
    { name: 'Rhineland-Palatinate', code: 'RP' },
    { name: 'Saarland', code: 'SL' },
    { name: 'Saxony', code: 'SN' },
    { name: 'Saxony-Anhalt', code: 'ST' },
    { name: 'Schleswig-Holstein', code: 'SH' },
    { name: 'Thuringia', code: 'TH' },
  ],

  ES: [ // Spain - Autonomous communities
    { name: 'Andalusia', code: 'AN' },
    { name: 'Aragon', code: 'AR' },
    { name: 'Asturias', code: 'AS' },
    { name: 'Balearic Islands', code: 'IB' },
    { name: 'Basque Country', code: 'PV' },
    { name: 'Canary Islands', code: 'CN' },
    { name: 'Cantabria', code: 'CB' },
    { name: 'Castile and León', code: 'CL' },
    { name: 'Castilla-La Mancha', code: 'CM' },
    { name: 'Catalonia', code: 'CT' },
    { name: 'Extremadura', code: 'EX' },
    { name: 'Galicia', code: 'GA' },
    { name: 'La Rioja', code: 'RI' },
    { name: 'Madrid', code: 'MD' },
    { name: 'Murcia', code: 'MC' },
    { name: 'Navarre', code: 'NC' },
    { name: 'Valencian Community', code: 'VC' },
  ],

  FR: [ // France - Regions (as of 2016 reform)
    { name: 'Auvergne-Rhône-Alpes', code: 'ARA' },
    { name: 'Bourgogne-Franche-Comté', code: 'BFC' },
    { name: 'Brittany', code: 'BRE' },
    { name: 'Centre-Val de Loire', code: 'CVL' },
    { name: 'Corsica', code: 'COR' },
    { name: 'Grand Est', code: 'GES' },
    { name: 'Hauts-de-France', code: 'HDF' },
    { name: 'Île-de-France', code: 'IDF' },
    { name: 'Normandy', code: 'NOR' },
    { name: 'Nouvelle-Aquitaine', code: 'NAQ' },
    { name: 'Occitanie', code: 'OCC' },
    { name: 'Pays de la Loire', code: 'PDL' },
    { name: 'Provence-Alpes-Côte d\'Azur', code: 'PAC' },
  ],

  IT: [ // Italy - Regions
    { name: 'Abruzzo', code: 'ABR' },
    { name: 'Aosta Valley', code: 'VAL' },
    { name: 'Apulia', code: 'PUG' },
    { name: 'Basilicata', code: 'BAS' },
    { name: 'Calabria', code: 'CAL' },
    { name: 'Campania', code: 'CAM' },
    { name: 'Emilia-Romagna', code: 'EMR' },
    { name: 'Friuli Venezia Giulia', code: 'FVG' },
    { name: 'Lazio', code: 'LAZ' },
    { name: 'Liguria', code: 'LIG' },
    { name: 'Lombardy', code: 'LOM' },
    { name: 'Marche', code: 'MAR' },
    { name: 'Molise', code: 'MOL' },
    { name: 'Piedmont', code: 'PIE' },
    { name: 'Sardinia', code: 'SAR' },
    { name: 'Sicily', code: 'SIC' },
    { name: 'Trentino-Alto Adige', code: 'TAA' },
    { name: 'Tuscany', code: 'TOS' },
    { name: 'Umbria', code: 'UMB' },
    { name: 'Veneto', code: 'VEN' },
  ],

  // South America - selected countries with states/provinces

  AR: [ // Argentina - Provinces
    { name: 'Buenos Aires', code: 'B' },
    { name: 'Catamarca', code: 'K' },
    { name: 'Chaco', code: 'H' },
    { name: 'Chubut', code: 'U' },
    { name: 'Córdoba', code: 'X' },
    { name: 'Corrientes', code: 'W' },
    { name: 'Entre Ríos', code: 'E' },
    { name: 'Formosa', code: 'P' },
    { name: 'Jujuy', code: 'Y' },
    { name: 'La Pampa', code: 'L' },
    { name: 'La Rioja', code: 'F' },
    { name: 'Mendoza', code: 'M' },
    { name: 'Misiones', code: 'N' },
    { name: 'Neuquén', code: 'Q' },
    { name: 'Río Negro', code: 'R' },
    { name: 'Salta', code: 'A' },
    { name: 'San Juan', code: 'J' },
    { name: 'San Luis', code: 'D' },
    { name: 'Santa Cruz', code: 'Z' },
    { name: 'Santa Fe', code: 'S' },
    { name: 'Santiago del Estero', code: 'G' },
    { name: 'Tierra del Fuego', code: 'V' },
    { name: 'Tucumán', code: 'T' },
  ],

  BR: [ // Brazil - States
    { name: 'Acre', code: 'AC' },
    { name: 'Alagoas', code: 'AL' },
    { name: 'Amapá', code: 'AP' },
    { name: 'Amazonas', code: 'AM' },
    { name: 'Bahia', code: 'BA' },
    { name: 'Ceará', code: 'CE' },
    { name: 'Distrito Federal', code: 'DF' },
    { name: 'Espírito Santo', code: 'ES' },
    { name: 'Goiás', code: 'GO' },
    { name: 'Maranhão', code: 'MA' },
    { name: 'Mato Grosso', code: 'MT' },
    { name: 'Mato Grosso do Sul', code: 'MS' },
    { name: 'Minas Gerais', code: 'MG' },
    { name: 'Pará', code: 'PA' },
    { name: 'Paraíba', code: 'PB' },
    { name: 'Paraná', code: 'PR' },
    { name: 'Pernambuco', code: 'PE' },
    { name: 'Piauí', code: 'PI' },
    { name: 'Rio de Janeiro', code: 'RJ' },
    { name: 'Rio Grande do Norte', code: 'RN' },
    { name: 'Rio Grande do Sul', code: 'RS' },
    { name: 'Rondônia', code: 'RO' },
    { name: 'Roraima', code: 'RR' },
    { name: 'Santa Catarina', code: 'SC' },
    { name: 'São Paulo', code: 'SP' },
    { name: 'Sergipe', code: 'SE' },
    { name: 'Tocantins', code: 'TO' },
  ],

  CL: [ // Chile - Regions
    { name: 'Arica and Parinacota', code: 'AP' },
    { name: 'Tarapacá', code: 'TA' },
    { name: 'Antofagasta', code: 'AN' },
    { name: 'Atacama', code: 'AT' },
    { name: 'Coquimbo', code: 'CO' },
    { name: 'Valparaíso', code: 'VS' },
    { name: 'Metropolitan Region of Santiago', code: 'RM' },
    { name: 'O’Higgins', code: 'LI' },
    { name: 'Maule', code: 'ML' },
    { name: 'Ñuble', code: 'NB' },
    { name: 'Biobío', code: 'BI' },
    { name: 'La Araucanía', code: 'AR' },
    { name: 'Los Ríos', code: 'LR' },
    { name: 'Los Lagos', code: 'LL' },
    { name: 'Aysén', code: 'AI' },
    { name: 'Magallanes', code: 'MA' },
  ],

  CO: [ // Colombia - Departments
    { name: 'Amazonas', code: 'AMA' },
    { name: 'Antioquia', code: 'ANT' },
    { name: 'Arauca', code: 'ARA' },
    { name: 'Atlántico', code: 'ATL' },
    { name: 'Bolívar', code: 'BOL' },
    { name: 'Boyacá', code: 'BOY' },
    { name: 'Caldas', code: 'CAL' },
    { name: 'Caquetá', code: 'CAQ' },
    { name: 'Casanare', code: 'CAS' },
    { name: 'Cauca', code: 'CAU' },
    { name: 'Cesar', code: 'CES' },
    { name: 'Chocó', code: 'CHO' },
    { name: 'Córdoba', code: 'COR' },
    { name: 'Cundinamarca', code: 'CUN' },
    { name: 'Guainía', code: 'GUA' },
    { name: 'Guaviare', code: 'GUV' },
    { name: 'Huila', code: 'HUI' },
    { name: 'La Guajira', code: 'LAG' },
    { name: 'Magdalena', code: 'MAG' },
    { name: 'Meta', code: 'MET' },
    { name: 'Nariño', code: 'NAR' },
    { name: 'Norte de Santander', code: 'NSA' },
    { name: 'Putumayo', code: 'PUT' },
    { name: 'Quindío', code: 'QUI' },
    { name: 'Risaralda', code: 'RIS' },
    { name: 'San Andrés and Providencia', code: 'SAP' },
    { name: 'Santander', code: 'SAN' },
    { name: 'Sucre', code: 'SUC' },
    { name: 'Tolima', code: 'TOL' },
    { name: 'Valle del Cauca', code: 'VAC' },
    { name: 'Vaupés', code: 'VAU' },
    { name: 'Vichada', code: 'VID' },
  ],
};


export const timezones = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/Madrid',
  'Atlantic/Canary',
  'Europe/Paris',
  'Europe/Rome',
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Campo_Grande',
  'America/Boa_Vista',
  'America/Eirunepe',
  'America/Rio_Branco',
  'America/Fortaleza',
  'America/Recife',
  'America/Araguaina',
  'America/Maceio',
  'America/Bahia',
  'America/Cuiaba',
  'America/Santarem',
  'America/Porto_Velho',
  'America/Santiago',
  'Pacific/Easter',
  'America/Bogota',
];

export const locales = [
  'en-US',    // English - United States
  'en-GB',    // English - United Kingdom
  'hi-IN',    // Hindi - India
  'es-ES',    // Spanish - Spain
  'fr-FR',    // French - France
  'it-IT',    // Italian - Italy
  'pt-BR',    // Portuguese - Brazil
  'es-AR',    // Spanish - Argentina
  'es-CL',    // Spanish - Chile
  'es-CO',    // Spanish - Colombia
  'de-DE',    // German - Germany
  'en-IN',    // English - India
  'en-CA',    // English - Canada
  'en-AU',    // English - Australia
  'pt-PT',    // Portuguese - Portugal
  'fr-BE',    // French - Belgium
  'nl-NL',    // Dutch - Netherlands
  'sv-SE',    // Swedish - Sweden
  'no-NO',    // Norwegian - Norway
];

export const phoneCodes = [
  '+91',   // India
  '+1',    // United States, Canada
  '+44',   // United Kingdom
  '+34',   // Spain
  '+33',   // France
  '+39',   // Italy
  '+55',   // Brazil
  '+54',   // Argentina
  '+56',   // Chile
  '+57',   // Colombia
  '+49',   // Germany
  '+61',   // Australia
  '+46',   // Sweden
  '+47',   // Norway
  '+31',   // Netherlands
  '+32',   // Belgium
];

