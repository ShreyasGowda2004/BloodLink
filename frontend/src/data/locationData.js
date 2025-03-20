// src/data/locationData.js

export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 
  'Brazil', 'Canada', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 
  'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 
  'Kenya', 'South Korea', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 
  'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia', 
  'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sweden', 'Switzerland', 
  'Thailand', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
];

export const states = {
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming'
  ],
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ],
  'Australia': [
    'New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 
    'Western Australia', 'Australian Capital Territory', 'Northern Territory'
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 
    'Quebec', 'Saskatchewan', 'Yukon'
  ],
  'China': [
    'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 
    'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 
    'Inner Mongolia', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Ningxia', 
    'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 
    'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang'
  ],
  'Japan': [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
  ],
  'Germany': [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
    'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
    'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
  ],
  'France': [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
    'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy',
    'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
  ]
};

export const cities = {
  // United States
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Oakland', 'Sacramento', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'],
  'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Irving'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines'],
  'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Peoria', 'Elgin', 'Waukegan'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia'],
  
  // India
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Navi Mumbai', 'Amravati', 'Kolhapur', 'Ulhasnagar', 'Vasai-Virar', 'Kalyan-Dombivli', 'Panvel', 'Mira-Bhayandar', 'Bhiwandi', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Ambarnath', 'Bhusawal', 'Nanded'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shivamogga', 'Tumakuru', 'Raichur', 'Bidar', 'Hassan', 'Gadag', 'Udupi', 'Dharwad', 'Bagalkot', 'Haveri', 'Vijayapura', 'Kolar', 'Mandya', 'Chikmagalur', 'Chitradurga', 'Chamarajanagar', 'Kodagu', 'Yadgir', 'Koppal', 'Uttara Kannada', 'Chickballapur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Tiruvannamalai', 'Nagercoil', 'Kanchipuram', 'Karur', 'Hosur', 'Neyveli', 'Cuddalore', 'Kumbakonam', 'Pollachi', 'Rajapalayam', 'Sivakasi', 'Pudukkottai', 'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Karaikudi'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Ghaziabad', 'Noida', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Faizabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Budaun', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Ayodhya', 'Jaunpur', 'Firozabad', 'Etawah', 'Mirzapur', 'Rae Bareli', 'Bahraich', 'Orai', 'Sitapur'],
  'Delhi': ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Vasant Kunj', 'Connaught Place', 'Nehru Place', 'Karol Bagh', 'Saket', 'Lajpat Nagar', 'Hauz Khas', 'Rajouri Garden', 'Greater Kailash', 'South Extension', 'Mayur Vihar', 'Paschim Vihar', 'Ashok Vihar', 'Preet Vihar', 'Punjabi Bagh', 'Kalkaji', 'Uttam Nagar', 'Shahdara', 'Model Town'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Gandhidham', 'Bharuch', 'Vapi', 'Porbandar', 'Godhra', 'Patan', 'Veraval', 'Mehsana', 'Bhuj', 'Ankleshwar', 'Botad', 'Amreli', 'Palanpur', 'Dahod', 'Jetpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Sri Ganganagar', 'Jhunjhunu', 'Pali', 'Kishangarh', 'Beawar', 'Hanumangarh', 'Dhaulpur', 'Gangapur City', 'Sawai Madhopur', 'Churu', 'Chittorgarh', 'Tonk', 'Nagaur', 'Hindaun', 'Banswara', 'Bundi', 'Baran', 'Barmer'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Balurghat', 'Ranaghat', 'Haldia', 'Raiganj', 'Jalpaiguri', 'Krishna Nagar', 'Barrackpore', 'Serampore', 'Howrah', 'Bolpur', 'Darjeeling', 'Midnapore', 'Cooch Behar', 'Bankura', 'Barasat', 'Purulia', 'Jangipur', 'Kalyani'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Kasaragod', 'Malappuram', 'Pathanamthitta', 'Idukki', 'Wayanad'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Rajahmundry', 'Tirupati', 'Eluru', 'Anantapur', 'Kakinada', 'Vizianagaram', 'Machilipatnam', 'Adoni', 'Proddatur', 'Chittoor', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Gudur', 'Srikakulam', 'Tadepalligudem', 'Ongole', 'Tenali'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Jagtial', 'Nirmal', 'Kamareddy', 'Bodhan', 'Siddipet', 'Wanaparthy', 'Kothagudem', 'Bhongir', 'Medak', 'Vikarabad', 'Jangaon'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Ratlam', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Dewas', 'Mandsaur', 'Damoh', 'Khandwa', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi', 'Sehore', 'Khargone', 'Burhanpur', 'Singrauli'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Malerkotla', 'Khanna', 'Phagwara', 'Firozpur', 'Kapurthala', 'Abohar', 'Gurdaspur', 'Sangrur', 'Barnala', 'Ropar', 'Nangal', 'Nawanshahr', 'Fatehgarh Sahib'],
  'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Fatehabad', 'Hansi', 'Narnaul', 'Mahendragarh'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Karimganj', 'Hailakandi', 'Diphu', 'Sivasagar', 'Dhubri', 'Barpeta', 'Goalpara', 'Nalbari', 'North Lakhimpur', 'Mangaldoi', 'Bongaigaon', 'Dhemaji', 'Lanka'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Dumka', 'Phusro', 'Chirkunda', 'Medininagar', 'Chaibasa', 'Sahibganj', 'Lohardaga', 'Gumla', 'Garhwa', 'Koderma', 'Jhumri Tilaiya', 'Pakur'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Ramnagar', 'Mussoorie', 'Nainital', 'Almora', 'Kotdwara', 'Jaspur', 'Manglaur', 'Sitarganj', 'Champawat'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri', 'Dongargarh', 'Kanker', 'Bhatapara', 'Naila Janjgir', 'Tilda Newra', 'Mungeli'],
  'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Canacona', 'Curchorem', 'Cuncolim', 'Sanguem', 'Sanquelim', 'Pernem', 'Quepem', 'Valpoi'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Nahan', 'Bilaspur', 'Chamba', 'Hamirpur', 'Una', 'Kullu', 'Palampur', 'Kangra', 'Baddi', 'Sundernagar', 'Paonta Sahib', 'Nalagarh', 'Parwanoo'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Belonia', 'Kailasahar', 'Khowai', 'Teliamura', 'Bishalgarh', 'Sabroom', 'Ambassa', 'Amarpur', 'Kamalpur'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Kakching', 'Ukhrul', 'Churachandpur', 'Moirang', 'Yairipok', 'Jiribam', 'Lilong', 'Nambol', 'Moreh'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Khliehriat', 'Nongpoh', 'Mawkyrwat'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Aalo', 'Namsai', 'Roing', 'Khonsa', 'Changlang'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Kiphire', 'Longleng', 'Peren'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Saiha', 'Mamit', 'Khawzawl', 'Saitual'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Singtam', 'Jorethang', 'Naya Bazar', 'Rangpo', 'Gezing', 'Ravangla'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Angul', 'Bargarh', 'Rayagada', 'Jeypore', 'Sundargarh', 'Paradip', 'Bhawanipatna', 'Dhenkanal', 'Kendujhar', 'Koraput', 'Phulbani'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur', 'Sopore', 'Poonch', 'Kupwara', 'Pulwama', 'Kulgam', 'Budgam', 'Handwara', 'Bandipore', 'Bhaderwah', 'Ganderbal', 'Rajouri', 'Shopian'],
  'Ladakh': ['Leh', 'Kargil', 'Drass', 'Khaltse', 'Nubra', 'Zanskar', 'Sankoo', 'Padum', 'Nyoma', 'Diskit', 'Kharu'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Mayabunder', 'Diglipur', 'Rangat', 'Havelock Island', 'Car Nicobar', 'Little Andaman', 'Neil Island', 'Kamorta', 'Campbell Bay'],
  'Chandigarh': ['Chandigarh', 'Manimajra', 'Mohali', 'Panchkula'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu', 'Vapi', 'Khanvel', 'Amli', 'Naroli'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy', 'Andrott', 'Kalpeni', 'Kiltan', 'Kadmat', 'Amini', 'Bitra', 'Chetlat'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai', 'Villianur', 'Ariyankuppam', 'Bahour', 'Nedungadu', 'Thirunallar'],
  
  // United Kingdom
  'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Plymouth', 'Southampton', 'Oxford', 'Cambridge'],
  'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness', 'Perth', 'Stirling', 'St Andrews', 'Paisley', 'Falkirk', 'Ayr', 'Dunfermline'],
  'Wales': ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'St Davids', 'Wrexham', 'Aberystwyth', 'Bridgend', 'Llandudno', 'Merthyr Tydfil'],
  'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh', 'Bangor', 'Craigavon', 'Newtownabbey', 'Coleraine', 'Omagh'],
  
  // Australia
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Coffs Harbour', 'Wagga Wagga', 'Albury', 'Port Macquarie', 'Tamworth', 'Dubbo', 'Bathurst'],
  'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Mildura', 'Warrnambool', 'Traralgon', 'Wangaratta', 'Horsham'],
  'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Mackay', 'Rockhampton', 'Bundaberg', 'Hervey Bay'],
  'Western Australia': ['Perth', 'Bunbury', 'Geraldton', 'Albany', 'Kalgoorlie', 'Broome', 'Port Hedland', 'Busselton', 'Mandurah', 'Karratha'],
  'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Port Lincoln', 'Victor Harbor', 'Murray Bridge', 'Port Pirie', 'Gawler'],
  
  // Canada
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Windsor', 'Vaughan', 'Kitchener', 'Markham', 'Brampton', 'Kingston', 'Oshawa'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke', 'Trois-Rivieres', 'Saguenay', 'Levis', 'Longueuil', 'Saint-Jean-sur-Richelieu'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Coquitlam', 'Kelowna', 'Kamloops', 'Nanaimo', 'Prince George'],
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Fort McMurray', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove'],
  
  // China
  'Beijing': ['Dongcheng', 'Xicheng', 'Chaoyang', 'Haidian', 'Fengtai', 'Shijingshan', 'Mentougou', 'Fangshan', 'Tongzhou', 'Shunyi'],
  'Shanghai': ['Huangpu', 'Xuhui', 'Changning', 'Jing\'an', 'Putuo', 'Hongkou', 'Yangpu', 'Minhang', 'Baoshan', 'Pudong New'],
  'Guangdong': ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhongshan', 'Zhuhai', 'Huizhou', 'Jiangmen', 'Zhaoqing', 'Shantou'],
  'Zhejiang': ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou', 'Shaoxing', 'Jinhua', 'Quzhou', 'Zhoushan', 'Taizhou'],
  
  // Japan
  'Tokyo': ['Shinjuku', 'Shibuya', 'Minato', 'Chiyoda', 'Toshima', 'Bunkyo', 'Sumida', 'Taito', 'Koto', 'Chuo'],
  'Osaka': ['Osaka City', 'Sakai', 'Higashiosaka', 'Takatsuki', 'Yao', 'Suita', 'Ibaraki', 'Hirakata', 'Kadoma', 'Moriguchi'],
  'Hokkaido': ['Sapporo', 'Asahikawa', 'Hakodate', 'Obihiro', 'Kushiro', 'Kitami', 'Tomakomai', 'Iwamizawa', 'Wakkanai', 'Muroran'],
  
  // Germany
  'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Ingolstadt', 'Würzburg', 'Fürth', 'Erlangen', 'Bayreuth', 'Bamberg'],
  'North Rhine-Westphalia': ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bonn', 'Münster', 'Mönchengladbach'],
  'Berlin': ['Mitte', 'Friedrichshain-Kreuzberg', 'Pankow', 'Charlottenburg-Wilmersdorf', 'Spandau', 'Steglitz-Zehlendorf', 'Tempelhof-Schöneberg', 'Neukölln', 'Treptow-Köpenick', 'Marzahn-Hellersdorf'],
  
  // France
  'Île-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Versailles', 'Nanterre', 'Argenteuil', 'Créteil', 'Évry', 'Cergy', 'Melun'],
  'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes', 'Antibes', 'La Seyne-sur-Mer', 'Hyères', 'Arles']
};

// Helper function to get states for a country
export const getStatesForCountry = (country) => {
  return states[country] || [];
};

// Common cities in India that can be returned when a specific state doesn't have cities defined
const commonIndianCities = [
  'New Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad', 
  'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 
  'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
];

// Helper function to get cities for a state
export const getCitiesForState = (state) => {
  // Return cities for the selected state if available
  if (cities[state]) {
    return cities[state];
  }
  
  // If no cities are defined for this state, return a placeholder
  return ["No cities available"];
};

export default {
  countries,
  states,
  cities,
  getStatesForCountry,
  getCitiesForState
}; 