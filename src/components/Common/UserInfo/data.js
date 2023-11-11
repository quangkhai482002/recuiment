const country_list = ["Vietnam", "China", "Japan", "United States", "England", "England with Spaces", "Wales", "Scotland", "Northern Ireland"];
const cityVN_list = [
    "An Giang",
    "Bac Giang",
    "Bac Kan",
    "Bac Lieu",
    "Bac Ninh",
    "Ba Ria-Vung Tau",
    "Ben Tre",
    "Binh Dinh",
    "Binh Duong",
    "Binh Phuoc",
    "Binh Thuan",
    "Ca Mau",
    "Cao Bang",
    "Dac Lak",
    "Dac Nong",
    "Dien Bien",
    "Dong Nai",
    "Dong Thap",
    "Gia Lai",
    "Ha Giang",
    "Hai Duong",
    "Ha Nam",
    "Ha Tay",
    "Ha Tinh",
    "Hau Giang",
    "Hoa Binh",
    "Hung Yen",
    "Khanh Hoa",
    "Kien Giang",
    "Kon Tum",
    "Lai Chau",
    "Lam Dong",
    "Lang Son",
    "Lao Cai",
    "Long An",
    "Nam Dinh",
    "Nghe An",
    "Ninh Binh",
    "Ninh Thuan",
    "Phu Tho",
    "Phu Yen",
    "Quang Binh",
    "Quang Nam",
    "Quang Ngai",
    "Quang Ninh",
    "Quang Tri",
    "Soc Trang",
    "Son La",
    "Tay Ninh",
    "Thai Binh",
    "Thai Nguyen",
    "Thanh Hoa",
    "Thua Thien-Hue",
    "Tien Giang",
    "Tra Vinh",
    "Tuyen Quang",
    "Vinh Long",
    "Vinh Phuc",
    "Yen Bai",
    "Can Tho",
    "Da Nang",
    "Hai Phong",
    "Hanoi",
    "Ho Chi Minh"
];
const cityJP_list = [
    "Aichi",
    "Akita",
    "Aomori",
    "Chiba",
    "Ehime",
    "Fukui",
    "Fukuoka",
    "Fukushima",
    "Gifu",
    "Gumma",
    "Hiroshima",
    "Hokkaido",
    "Hyogo",
    "Ibaraki",
    "Ishikawa",
    "Iwate",
    "Kagawa",
    "Kagoshima",
    "Kanagawa",
    "Kochi",
    "Kumamoto",
    "Kyoto",
    "Mie",
    "Miyagi",
    "Miyazaki",
    "Nagano",
    "Nagasaki",
    "Nara",
    "Niigata",
    "Oita",
    "Okayama",
    "Okinawa",
    "Osaka",
    "Saga",
    "Saitama",
    "Shiga",
    "Shimane",
    "Shizuoka",
    "Tochigi",
    "Tokushima",
    "Tokyo",
    "Tottori",
    "Toyama",
    "Wakayama",
    "Yamagata",
    "Yamaguchi",
    "Yamanashi"
];
const cityCN_list = [
    "Guangdong",
    "Liaoning",
    "Shanghai",
    "Jiangsu",
    "Shandong",
    "Heilongjiang",
    "Hubei",
    "Henan",
    "Hebei",
    "Jilin",
    "Sichuan",
    "Beijing",
    "Anhui",
    "Zhejiang",
    "Hunan",
    "Shaanxi",
    "Shanxi",
    "Chongqing",
    "Tianjin",
    "Xinjiang",
    "Jiangxi",
    "Fujian",
    "Guangxi",
    "Nei Mongol",
    "Guizhou",
    "Gansu",
    "Yunnan",
    "Hainan",
    "Ningxia",
    "Qinghai",
    "Xizang",
];
const cityUS_list = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District Of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
];
const cityEL_list = [
    'Avon',
    'Bedfordshire',
    'Berkshire',
    'Buckinghamshire',
    'Cambridgeshire',
    'Cheshire',
    'Cleveland',
    'Cornwall',
    'Cumbria',
    'Derbyshire',
    'Devon',
    'Dorset',
    'Durham',
    'East-Sussex',
    'Essex',
    'Gloucestershire',
    'Hampshire',
    'Herefordshire',
    'Hertfordshire',
    'Isle-of-Wight',
    'Kent',
    'Lancashire',
    'Leicestershire',
    'Lincolnshire',
    'London',
    'Merseyside',
    'Middlesex',
    'Norfolk',
    'Northamptonshire',
    'Northumberland',
    'North-Humberside',
    'North-Yorkshire',
    'Nottinghamshire',
    'Oxfordshire',
    'Rutland',
    'Shropshire',
    'Somerset',
    'South-Humberside',
    'South-Yorkshire',
    'Staffordshire',
    'Suffolk',
    'Surrey',
    'Tyne-and-Wear',
    'Warwickshire',
    'West-Midlands',
    'West-Sussex',
    'West-Yorkshire',
    'Wiltshire',
    'Worcestershire'
];
const cityELWS_list = [
    'Avon',
    'Bedfordshire',
    'Berkshire',
    'Buckinghamshire',
    'Cambridgeshire',
    'Cheshire',
    'Cleveland',
    'Cornwall',
    'Cumbria',
    'Derbyshire',
    'Devon',
    'Dorset',
    'Durham',
    'East Sussex',
    'Essex',
    'Gloucestershire',
    'Hampshire',
    'Herefordshire',
    'Hertfordshire',
    'Isle of Wight',
    'Kent',
    'Lancashire',
    'Leicestershire',
    'Lincolnshire',
    'London',
    'Merseyside',
    'Middlesex',
    'Norfolk',
    'Northamptonshire',
    'Northumberland',
    'North Humberside',
    'North Yorkshire',
    'Nottinghamshire',
    'Oxfordshire',
    'Rutland',
    'Shropshire',
    'Somerset',
    'South Humberside',
    'South Yorkshire',
    'Staffordshire',
    'Suffolk',
    'Surrey',
    'Tyne and Wear',
    'Warwickshire',
    'West Midlands',
    'West Sussex',
    'West Yorkshire',
    'Wiltshire',
    'Worcestershire'
];
const cityWL_list = [
    'Clwyd',
    'Dyfed',
    'Gwent',
    'Gwynedd',
    'Mid-Glamorgan',
    'Powys',
    'South-Glamorgan',
    'West-Glamorgan'
];
const citySL_list = [
    'Aberdeenshire',
    'Angus',
    'Argyll',
    'Ayrshire',
    'Banffshire',
    'Berwickshire',
    'Bute',
    'Caithness',
    'Clackmannanshire',
    'Dumfriesshire',
    'Dunbartonshire',
    'East-Lothian',
    'Fife',
    'Inverness-shire',
    'Kincardineshire',
    'Kinross-shire',
    'Kirkcudbrightshire',
    'Lanarkshire',
    'Midlothian',
    'Moray',
    'Nairnshire',
    'Orkney',
    'Peeblesshire',
    'Perthshire',
    'Renfrewshire',
    'Ross-shire',
    'Roxburghshire',
    'Selkirkshire',
    'Shetland',
    'Stirlingshire',
    'Sutherland',
    'West Lothian',
    'Wigtownshire'
];
const cityNI_list = [
    'Antrim',
    'Armagh',
    'Down',
    'Fermanagh',
    'Londonderry',
    'Tyrone'
];

const dataCityVN = [];
for (let i = 0; i < cityVN_list.length; i++) {
    dataCityVN.push({
        value: cityVN_list[i],
        label: cityVN_list[i],
    })
};

const dataCityJP = [];
for (let i = 0; i < cityJP_list.length; i++) {
    dataCityJP.push({
        value: cityJP_list[i],
        label: cityJP_list[i],
    })
};

const dataCityCN = [];
for (let i = 0; i < cityCN_list.length; i++) {
    dataCityCN.push({
        value: cityCN_list[i],
        label: cityCN_list[i],
    })
};

const dataCityUS = [];
for (let i = 0; i < cityUS_list.length; i++) {
    dataCityUS.push({
        value: cityUS_list[i],
        label: cityUS_list[i],
    })
};

const dataCityEL = [];
for (let i = 0; i < cityEL_list.length; i++) {
    dataCityEL.push({
        value: cityEL_list[i],
        label: cityEL_list[i],
    })
};

const dataCityELWS = [];
for (let i = 0; i < cityELWS_list.length; i++) {
    dataCityELWS.push({
        value: cityELWS_list[i],
        label: cityELWS_list[i],
    })
};

const dataCityWL = [];
for (let i = 0; i < cityWL_list.length; i++) {
    dataCityWL.push({
        value: cityWL_list[i],
        label: cityWL_list[i],
    })
};

const dataCitySL = [];
for (let i = 0; i < citySL_list.length; i++) {
    dataCitySL.push({
        value: citySL_list[i],
        label: citySL_list[i],
    })
};

const dataCityNI = [];
for (let i = 0; i < cityNI_list.length; i++) {
    dataCityNI.push({
        value: cityNI_list[i],
        label: cityNI_list[i],
    })
};

const dataCityOther = {
    value: "Other cities (type in address)",
    label: "Other cities (type in address)",
    city: [],
};

const dataCity = [dataCityVN, dataCityCN, dataCityJP, dataCityUS, dataCityEL, dataCityELWS, dataCityWL, dataCitySL, dataCityNI];

export const dataCountry = [];
for (let i = 0; i < country_list.length; i++) {
    dataCountry.push({
        value: country_list[i],
        label: country_list[i],
        city: dataCity[i],
    });
};
dataCountry.push(dataCityOther);
