/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from submission-forms.xml
 */

export type SubmissionValuePair = {
  displayedValue?: string;
  storedValue?: string;
};

export type SubmissionValuePairsConfig = {
  name: string;
  dcTerm?: string;
  pairs: SubmissionValuePair[];
};

export const SUBMISSION_VALUE_PAIRS: Record<string, SubmissionValuePairsConfig> = {
  patent_types: {
    name: "patent_types",
    dcTerm: "patent_types",
    pairs: [
      {
        displayedValue: "Use by owner",
        storedValue: "Use by owner"
      },
      {
        displayedValue: "Licensing",
        storedValue: "Licensing"
      },
      {
        displayedValue: "Sale",
        storedValue: "Sale"
      },
      {
        displayedValue: "Other",
        storedValue: "Other"
      }
    ]
  },
  common_identifiers: {
    name: "common_identifiers",
    dcTerm: "common_identifiers",
    pairs: [
      {
        displayedValue: "DOI",
        storedValue: "doi"
      },
      {
        displayedValue: "Scopus ID",
        storedValue: "scopus"
      },
      {
        displayedValue: "WOS ID",
        storedValue: "isi"
      },
      {
        displayedValue: "Pubmed ID",
        storedValue: "pmid"
      },
      {
        displayedValue: "arXiv ID",
        storedValue: "arxiv"
      },
      {
        displayedValue: "Other",
        storedValue: "other"
      },
      {
        displayedValue: "ISMN",
        storedValue: "ismn"
      },
      {
        displayedValue: "Gov't Doc #",
        storedValue: "govdoc"
      },
      {
        displayedValue: "URI",
        storedValue: "uri"
      },
      {
        displayedValue: "ISBN",
        storedValue: "isbn"
      },
      {
        displayedValue: "Ads Code",
        storedValue: "adsbibcode"
      }
    ]
  },
  common_types: {
    name: "common_types",
    dcTerm: "common_types",
    pairs: [
      {
        displayedValue: "Animation",
        storedValue: "Animation"
      },
      {
        displayedValue: "Article",
        storedValue: "Article"
      },
      {
        displayedValue: "Book",
        storedValue: "Book"
      },
      {
        displayedValue: "Book chapter",
        storedValue: "Book chapter"
      },
      {
        displayedValue: "Dataset",
        storedValue: "Dataset"
      },
      {
        displayedValue: "Learning Object",
        storedValue: "Learning Object"
      },
      {
        displayedValue: "Image",
        storedValue: "Image"
      },
      {
        displayedValue: "Image, 3-D",
        storedValue: "Image, 3-D"
      },
      {
        displayedValue: "Map",
        storedValue: "Map"
      },
      {
        displayedValue: "Musical Score",
        storedValue: "Musical Score"
      },
      {
        displayedValue: "Plan or blueprint",
        storedValue: "Plan or blueprint"
      },
      {
        displayedValue: "Preprint",
        storedValue: "Preprint"
      },
      {
        displayedValue: "Presentation",
        storedValue: "Presentation"
      },
      {
        displayedValue: "Recording, acoustical",
        storedValue: "Recording, acoustical"
      },
      {
        displayedValue: "Recording, musical",
        storedValue: "Recording, musical"
      },
      {
        displayedValue: "Recording, oral",
        storedValue: "Recording, oral"
      },
      {
        displayedValue: "Software",
        storedValue: "Software"
      },
      {
        displayedValue: "Technical Report",
        storedValue: "Technical Report"
      },
      {
        displayedValue: "Thesis",
        storedValue: "Thesis"
      },
      {
        displayedValue: "Video",
        storedValue: "Video"
      },
      {
        displayedValue: "Working Paper",
        storedValue: "Working Paper"
      },
      {
        displayedValue: "Other",
        storedValue: "Other"
      }
    ]
  },
  common_iso_languages: {
    name: "common_iso_languages",
    dcTerm: "common_iso_languages",
    pairs: [
      {
        displayedValue: "N/A",
        storedValue: undefined
      },
      {
        displayedValue: "English (United States)",
        storedValue: "en_US"
      },
      {
        displayedValue: "English",
        storedValue: "en"
      },
      {
        displayedValue: "Spanish",
        storedValue: "es"
      },
      {
        displayedValue: "German",
        storedValue: "de"
      },
      {
        displayedValue: "French",
        storedValue: "fr"
      },
      {
        displayedValue: "Italian",
        storedValue: "it"
      },
      {
        displayedValue: "Japanese",
        storedValue: "ja"
      },
      {
        displayedValue: "Chinese",
        storedValue: "zh"
      },
      {
        displayedValue: "Turkish",
        storedValue: "tr"
      },
      {
        displayedValue: "(Other)",
        storedValue: "other"
      }
    ]
  },
  dataset_types: {
    name: "dataset_types",
    dcTerm: "dataset_types",
    pairs: [
      {
        displayedValue: "Dataset",
        storedValue: "Dataset"
      }
    ]
  },
  publication_types: {
    name: "publication_types",
    dcTerm: "publication_types",
    pairs: [
      {
        displayedValue: "Text",
        storedValue: "text"
      },
      {
        displayedValue: "Annotation",
        storedValue: "annotation"
      },
      {
        displayedValue: "Bibliography",
        storedValue: "bibliography"
      },
      {
        displayedValue: "Book",
        storedValue: "book"
      },
      {
        displayedValue: "Book Part",
        storedValue: "book part"
      },
      {
        displayedValue: "Conference Object",
        storedValue: "conference object"
      },
      {
        displayedValue: "Conference Proceedings",
        storedValue: "conference proceedings"
      },
      {
        displayedValue: "Conference Paper",
        storedValue: "conference paper"
      },
      {
        displayedValue: "Conference Poster",
        storedValue: "conference poster"
      },
      {
        displayedValue: "Conference Paper not in Proceedings",
        storedValue: "conference paper not in proceedings"
      },
      {
        displayedValue: "Conference Poster not in Proceedings",
        storedValue: "conference poster not in proceedings"
      },
      {
        displayedValue: "Lecture",
        storedValue: "lecture"
      },
      {
        displayedValue: "Letter",
        storedValue: "letter"
      },
      {
        displayedValue: "Periodical",
        storedValue: "periodical"
      },
      {
        displayedValue: "Journal",
        storedValue: "journal"
      },
      {
        displayedValue: "Contribution to Journal",
        storedValue: "contribution to journal"
      },
      {
        displayedValue: "Journal Article",
        storedValue: "journal article"
      },
      {
        displayedValue: "Review Article",
        storedValue: "review article"
      },
      {
        displayedValue: "Research Article",
        storedValue: "research article"
      },
      {
        displayedValue: "Editorial",
        storedValue: "editorial"
      },
      {
        displayedValue: "Data Paper",
        storedValue: "data paper"
      },
      {
        displayedValue: "Letter to the Editor",
        storedValue: "letter to the editor"
      },
      {
        displayedValue: "Preprint",
        storedValue: "preprint"
      },
      {
        displayedValue: "Report",
        storedValue: "report"
      },
      {
        displayedValue: "Report Part",
        storedValue: "report part"
      },
      {
        displayedValue: "Internal Report",
        storedValue: "internal report"
      },
      {
        displayedValue: "Memorandum",
        storedValue: "memorandum"
      },
      {
        displayedValue: "Other Type of Report",
        storedValue: "other type of report"
      },
      {
        displayedValue: "Policy Report",
        storedValue: "policy report"
      },
      {
        displayedValue: "Project Deliverable",
        storedValue: "project deliverable"
      },
      {
        displayedValue: "Report to Funding Agency",
        storedValue: "report to funding agency"
      },
      {
        displayedValue: "Research Report",
        storedValue: "research report"
      },
      {
        displayedValue: "Technical Report",
        storedValue: "technical report"
      },
      {
        displayedValue: "Research Proposal",
        storedValue: "research proposal"
      },
      {
        displayedValue: "Review",
        storedValue: "review"
      },
      {
        displayedValue: "Book Review",
        storedValue: "book review"
      },
      {
        displayedValue: "Technical Documentation",
        storedValue: "technical documentation"
      },
      {
        displayedValue: "Working Paper",
        storedValue: "working paper"
      },
      {
        displayedValue: "Thesis",
        storedValue: "thesis"
      },
      {
        displayedValue: "Bachelor Thesis",
        storedValue: "bachelor thesis"
      },
      {
        displayedValue: "Doctoral Thesis",
        storedValue: "doctoral thesis"
      },
      {
        displayedValue: "Master Thesis",
        storedValue: "master thesis"
      },
      {
        displayedValue: "Musical Notation",
        storedValue: "musical notation"
      }
    ]
  },
  currency: {
    name: "currency",
    dcTerm: "currency",
    pairs: [
      {
        displayedValue: "Euro",
        storedValue: "Euro"
      },
      {
        displayedValue: "Albanian lek",
        storedValue: "Albanian lek"
      },
      {
        displayedValue: "Armenian dram",
        storedValue: "Armenian dram"
      },
      {
        displayedValue: "Azerbaijan manat",
        storedValue: "Azerbaijan manat"
      },
      {
        displayedValue: "Belarusian ruble",
        storedValue: "Belarusian ruble"
      },
      {
        displayedValue: "Bosnia and Herzegovina convertible mark",
        storedValue: "Bosnia and Herzegovina convertible mark"
      },
      {
        displayedValue: "Bulgarian lev",
        storedValue: "Bulgarian lev"
      },
      {
        displayedValue: "Croatian kuna",
        storedValue: "Croatian kuna"
      },
      {
        displayedValue: "Czech koruna",
        storedValue: "Czech koruna"
      },
      {
        displayedValue: "Danish krone",
        storedValue: "Danish krone"
      },
      {
        displayedValue: "Faroese krona",
        storedValue: "Faroese krona"
      },
      {
        displayedValue: "Georgian lari",
        storedValue: "Georgian lari"
      },
      {
        displayedValue: "Gibraltar pound",
        storedValue: "Gibraltar pound"
      },
      {
        displayedValue: "Guernsey pound",
        storedValue: "Guernsey pound"
      },
      {
        displayedValue: "Hungarian forint",
        storedValue: "Hungarian forint"
      },
      {
        displayedValue: "Icelandic krona",
        storedValue: "Icelandic krona"
      },
      {
        displayedValue: "Manx pound",
        storedValue: "Manx pound"
      },
      {
        displayedValue: "Jersey pound",
        storedValue: "Jersey pound"
      },
      {
        displayedValue: "Kazakhstani tenge",
        storedValue: "Kazakhstani tenge"
      },
      {
        displayedValue: "Moldovan leu",
        storedValue: "Moldovan leu"
      },
      {
        displayedValue: "Macedonian denar",
        storedValue: "Macedonian denar"
      },
      {
        displayedValue: "Norwegian krone",
        storedValue: "Norwegian krone"
      },
      {
        displayedValue: "Polish zloty",
        storedValue: "Polish zloty"
      },
      {
        displayedValue: "Romanian leu",
        storedValue: "Romanian leu"
      },
      {
        displayedValue: "Russian ruble",
        storedValue: "Russian ruble"
      },
      {
        displayedValue: "Serbian dinar",
        storedValue: "Serbian dinar"
      },
      {
        displayedValue: "Swedish krona",
        storedValue: "Swedish krona"
      },
      {
        displayedValue: "Swiss franc",
        storedValue: "Swiss franc"
      },
      {
        displayedValue: "Turkish lira",
        storedValue: "Turkish lira"
      },
      {
        displayedValue: "Ukrainian hryvnia",
        storedValue: "Ukrainian hryvnia"
      },
      {
        displayedValue: "Pound sterling",
        storedValue: "Pound sterling"
      }
    ]
  },
  gender: {
    name: "gender",
    dcTerm: "gender",
    pairs: [
      {
        displayedValue: "Male",
        storedValue: "m"
      },
      {
        displayedValue: "Woman",
        storedValue: "f"
      },
      {
        displayedValue: "Unspecified",
        storedValue: "n/a"
      }
    ]
  },
  orgunit_identifiers: {
    name: "orgunit_identifiers",
    dcTerm: "orgunit_identifiers",
    pairs: [
      {
        displayedValue: "CrossRef Funder ID",
        storedValue: "crossrefid"
      },
      {
        displayedValue: "Research Organization Registry",
        storedValue: "ror"
      },
      {
        displayedValue: "International Standard Name Identifier",
        storedValue: "isni"
      },
      {
        displayedValue: "Ringgold identifier",
        storedValue: "rin"
      },
      {
        displayedValue: "Legal Entity Identifier",
        storedValue: "lei"
      },
      {
        displayedValue: "Generic ID",
        storedValue: undefined
      }
    ]
  },
  truefalse: {
    name: "truefalse",
    dcTerm: "truefalse",
    pairs: [
      {
        displayedValue: "True",
        storedValue: "true"
      },
      {
        displayedValue: "False",
        storedValue: "false"
      }
    ]
  },
  orgunit_types: {
    name: "orgunit_types",
    dcTerm: "orgunit_types",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "Academic Institute",
        storedValue: "Academic Institute"
      },
      {
        displayedValue: "University",
        storedValue: "University"
      },
      {
        displayedValue: "University College",
        storedValue: "University College"
      },
      {
        displayedValue: "Research Institute",
        storedValue: "Research Institute"
      },
      {
        displayedValue: "Strategic Research Institute",
        storedValue: "Strategic Research Insitute"
      },
      {
        displayedValue: "Company",
        storedValue: "Company"
      },
      {
        displayedValue: "SME",
        storedValue: "SME"
      },
      {
        displayedValue: "Government",
        storedValue: "Government"
      },
      {
        displayedValue: "Higher Education",
        storedValue: "Higher Education"
      },
      {
        displayedValue: "Private non-profit",
        storedValue: "Private non-profit"
      },
      {
        displayedValue: "Intergovernmental",
        storedValue: "Intergovernmental"
      },
      {
        displayedValue: "Charity",
        storedValue: "Charity"
      },
      {
        displayedValue: "National Health Service",
        storedValue: "National Health Service"
      },
      {
        displayedValue: "Education",
        storedValue: "Education"
      },
      {
        displayedValue: "Healthcare",
        storedValue: "Healthcare"
      },
      {
        displayedValue: "Archive",
        storedValue: "Archive"
      },
      {
        displayedValue: "Nonprofit",
        storedValue: "Nonprofit"
      },
      {
        displayedValue: "Funder",
        storedValue: "Funder"
      },
      {
        displayedValue: "Facility",
        storedValue: "Facility"
      },
      {
        displayedValue: "Other",
        storedValue: "Other"
      }
    ]
  },
  project_types: {
    name: "project_types",
    dcTerm: "project_types",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "basic research",
        storedValue: "basic research"
      },
      {
        displayedValue: "applied research",
        storedValue: "applied research"
      },
      {
        displayedValue: "experimental development",
        storedValue: "experimental development"
      }
    ]
  },
  funding_types: {
    name: "funding_types",
    dcTerm: "funding_types",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "Gift",
        storedValue: "Gift"
      },
      {
        displayedValue: "Internal Funding",
        storedValue: "Internal Funding"
      },
      {
        displayedValue: "Contract",
        storedValue: "Contract"
      },
      {
        displayedValue: "Award",
        storedValue: "Award"
      },
      {
        displayedValue: "Grant",
        storedValue: "Grant"
      }
    ]
  },
  event_types: {
    name: "event_types",
    dcTerm: "event_types",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "Conference",
        storedValue: "Conference"
      },
      {
        displayedValue: "Workshop",
        storedValue: "Workshop"
      }
    ]
  },
  common_iso_countries: {
    name: "common_iso_countries",
    dcTerm: "common_iso_countries",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "Afghanistan",
        storedValue: "AF"
      },
      {
        displayedValue: "Åland Islands",
        storedValue: "AX"
      },
      {
        displayedValue: "Albania",
        storedValue: "AL"
      },
      {
        displayedValue: "Algeria",
        storedValue: "DZ"
      },
      {
        displayedValue: "American Samoa",
        storedValue: "AS"
      },
      {
        displayedValue: "Andorra",
        storedValue: "AD"
      },
      {
        displayedValue: "Angola",
        storedValue: "AO"
      },
      {
        displayedValue: "Anguilla",
        storedValue: "AI"
      },
      {
        displayedValue: "Antarctica",
        storedValue: "AQ"
      },
      {
        displayedValue: "Antigua and Barbuda",
        storedValue: "AG"
      },
      {
        displayedValue: "Argentina",
        storedValue: "AR"
      },
      {
        displayedValue: "Armenia",
        storedValue: "AM"
      },
      {
        displayedValue: "Aruba",
        storedValue: "AW"
      },
      {
        displayedValue: "Australia",
        storedValue: "AU"
      },
      {
        displayedValue: "Austria",
        storedValue: "AT"
      },
      {
        displayedValue: "Azerbaijan",
        storedValue: "AZ"
      },
      {
        displayedValue: "Bahrain",
        storedValue: "BH"
      },
      {
        displayedValue: "Bahamas",
        storedValue: "BS"
      },
      {
        displayedValue: "Bangladesh",
        storedValue: "BD"
      },
      {
        displayedValue: "Barbados",
        storedValue: "BB"
      },
      {
        displayedValue: "Belarus",
        storedValue: "BY"
      },
      {
        displayedValue: "Belgium",
        storedValue: "BE"
      },
      {
        displayedValue: "Belize",
        storedValue: "BZ"
      },
      {
        displayedValue: "Benin",
        storedValue: "BJ"
      },
      {
        displayedValue: "Bermuda",
        storedValue: "BM"
      },
      {
        displayedValue: "Bhutan",
        storedValue: "BT"
      },
      {
        displayedValue: "Bolivia, Plurinational State of",
        storedValue: "BO"
      },
      {
        displayedValue: "Bonaire, Sint Eustatius and Saba",
        storedValue: "BQ"
      },
      {
        displayedValue: "Bosnia and Herzegovina",
        storedValue: "BA"
      },
      {
        displayedValue: "Botswana",
        storedValue: "BW"
      },
      {
        displayedValue: "Bouvet Island",
        storedValue: "BV"
      },
      {
        displayedValue: "Brazil",
        storedValue: "BR"
      },
      {
        displayedValue: "British Indian Ocean Territory",
        storedValue: "IO"
      },
      {
        displayedValue: "Brunei Darussalam",
        storedValue: "BN"
      },
      {
        displayedValue: "Bulgaria",
        storedValue: "BG"
      },
      {
        displayedValue: "Burkina Faso",
        storedValue: "BF"
      },
      {
        displayedValue: "Burundi",
        storedValue: "BI"
      },
      {
        displayedValue: "Cambodia",
        storedValue: "KH"
      },
      {
        displayedValue: "Cameroon",
        storedValue: "CM"
      },
      {
        displayedValue: "Canada",
        storedValue: "CA"
      },
      {
        displayedValue: "Cape Verde",
        storedValue: "CV"
      },
      {
        displayedValue: "Cayman Islands",
        storedValue: "KY"
      },
      {
        displayedValue: "Central African Republic",
        storedValue: "CF"
      },
      {
        displayedValue: "Chad",
        storedValue: "TD"
      },
      {
        displayedValue: "Chile",
        storedValue: "CL"
      },
      {
        displayedValue: "China",
        storedValue: "CN"
      },
      {
        displayedValue: "Christmas Island",
        storedValue: "CX"
      },
      {
        displayedValue: "Cocos (Keeling) Islands",
        storedValue: "CC"
      },
      {
        displayedValue: "Colombia",
        storedValue: "CO"
      },
      {
        displayedValue: "Comoros",
        storedValue: "KM"
      },
      {
        displayedValue: "Congo",
        storedValue: "CG"
      },
      {
        displayedValue: "Congo, the Democratic Republic of the",
        storedValue: "CD"
      },
      {
        displayedValue: "Cook Islands",
        storedValue: "CK"
      },
      {
        displayedValue: "Costa Rica",
        storedValue: "CR"
      },
      {
        displayedValue: "Côte d'Ivoire",
        storedValue: "CI"
      },
      {
        displayedValue: "Croatia",
        storedValue: "HR"
      },
      {
        displayedValue: "Cuba",
        storedValue: "CU"
      },
      {
        displayedValue: "Curaçao",
        storedValue: "CW"
      },
      {
        displayedValue: "Cyprus",
        storedValue: "CY"
      },
      {
        displayedValue: "Czech Republic",
        storedValue: "CZ"
      },
      {
        displayedValue: "Denmark",
        storedValue: "DK"
      },
      {
        displayedValue: "Djibouti",
        storedValue: "DJ"
      },
      {
        displayedValue: "Dominica",
        storedValue: "DM"
      },
      {
        displayedValue: "Dominican Republic",
        storedValue: "DO"
      },
      {
        displayedValue: "Ecuador",
        storedValue: "EC"
      },
      {
        displayedValue: "Egypt",
        storedValue: "EG"
      },
      {
        displayedValue: "El Salvador",
        storedValue: "SV"
      },
      {
        displayedValue: "Equatorial Guinea",
        storedValue: "GQ"
      },
      {
        displayedValue: "Eritrea",
        storedValue: "ER"
      },
      {
        displayedValue: "Estonia",
        storedValue: "EE"
      },
      {
        displayedValue: "Ethiopia",
        storedValue: "ET"
      },
      {
        displayedValue: "Falkland Islands (Malvinas)",
        storedValue: "FK"
      },
      {
        displayedValue: "Faroe Islands",
        storedValue: "FO"
      },
      {
        displayedValue: "Fiji",
        storedValue: "FJ"
      },
      {
        displayedValue: "Finland",
        storedValue: "FI"
      },
      {
        displayedValue: "France",
        storedValue: "FR"
      },
      {
        displayedValue: "French Guiana",
        storedValue: "GF"
      },
      {
        displayedValue: "French Polynesia",
        storedValue: "PF"
      },
      {
        displayedValue: "French Southern Territories",
        storedValue: "TF"
      },
      {
        displayedValue: "Gabon",
        storedValue: "GA"
      },
      {
        displayedValue: "Gambia",
        storedValue: "GM"
      },
      {
        displayedValue: "Georgia",
        storedValue: "GE"
      },
      {
        displayedValue: "Germany",
        storedValue: "DE"
      },
      {
        displayedValue: "Ghana",
        storedValue: "GH"
      },
      {
        displayedValue: "Gibraltar",
        storedValue: "GI"
      },
      {
        displayedValue: "Greece",
        storedValue: "GR"
      },
      {
        displayedValue: "Greenland",
        storedValue: "GL"
      },
      {
        displayedValue: "Grenada",
        storedValue: "GD"
      },
      {
        displayedValue: "Guadeloupe",
        storedValue: "GP"
      },
      {
        displayedValue: "Guam",
        storedValue: "GU"
      },
      {
        displayedValue: "Guatemala",
        storedValue: "GT"
      },
      {
        displayedValue: "Guernsey",
        storedValue: "GG"
      },
      {
        displayedValue: "Guinea",
        storedValue: "GN"
      },
      {
        displayedValue: "Guinea-Bissau",
        storedValue: "GW"
      },
      {
        displayedValue: "Guyana",
        storedValue: "GY"
      },
      {
        displayedValue: "Haiti",
        storedValue: "HT"
      },
      {
        displayedValue: "Heard Island and McDonald Islands",
        storedValue: "HM"
      },
      {
        displayedValue: "Holy See (Vatican City State)",
        storedValue: "VA"
      },
      {
        displayedValue: "Honduras",
        storedValue: "HN"
      },
      {
        displayedValue: "Hong Kong",
        storedValue: "HK"
      },
      {
        displayedValue: "Hungary",
        storedValue: "HU"
      },
      {
        displayedValue: "Iceland",
        storedValue: "IS"
      },
      {
        displayedValue: "India",
        storedValue: "IN"
      },
      {
        displayedValue: "Indonesia",
        storedValue: "ID"
      },
      {
        displayedValue: "Iran, Islamic Republic of",
        storedValue: "IR"
      },
      {
        displayedValue: "Iraq",
        storedValue: "IQ"
      },
      {
        displayedValue: "Ireland",
        storedValue: "IE"
      },
      {
        displayedValue: "Isle of Man",
        storedValue: "IM"
      },
      {
        displayedValue: "Israel",
        storedValue: "IL"
      },
      {
        displayedValue: "Italy",
        storedValue: "IT"
      },
      {
        displayedValue: "Jamaica",
        storedValue: "JM"
      },
      {
        displayedValue: "Japan",
        storedValue: "JP"
      },
      {
        displayedValue: "Jersey",
        storedValue: "JE"
      },
      {
        displayedValue: "Jordan",
        storedValue: "JO"
      },
      {
        displayedValue: "Kazakhstan",
        storedValue: "KZ"
      },
      {
        displayedValue: "Kenya",
        storedValue: "KE"
      },
      {
        displayedValue: "Kiribati",
        storedValue: "KI"
      },
      {
        displayedValue: "Korea, Democratic People's Republic of",
        storedValue: "KP"
      },
      {
        displayedValue: "Korea, Republic of",
        storedValue: "KR"
      },
      {
        displayedValue: "Kuwait",
        storedValue: "KW"
      },
      {
        displayedValue: "Kyrgyzstan",
        storedValue: "KG"
      },
      {
        displayedValue: "Lao People's Democratic Republic",
        storedValue: "LA"
      },
      {
        displayedValue: "Latvia",
        storedValue: "LV"
      },
      {
        displayedValue: "Lebanon",
        storedValue: "LB"
      },
      {
        displayedValue: "Lesotho",
        storedValue: "LS"
      },
      {
        displayedValue: "Liberia",
        storedValue: "LR"
      },
      {
        displayedValue: "Libya",
        storedValue: "LY"
      },
      {
        displayedValue: "Liechtenstein",
        storedValue: "LI"
      },
      {
        displayedValue: "Lithuania",
        storedValue: "LT"
      },
      {
        displayedValue: "Luxembourg",
        storedValue: "LU"
      },
      {
        displayedValue: "Macao",
        storedValue: "MO"
      },
      {
        displayedValue: "Macedonia, the Former Yugoslav Republic of",
        storedValue: "MK"
      },
      {
        displayedValue: "Madagascar",
        storedValue: "MG"
      },
      {
        displayedValue: "Malawi",
        storedValue: "MW"
      },
      {
        displayedValue: "Malaysia",
        storedValue: "MY"
      },
      {
        displayedValue: "Maldives",
        storedValue: "MV"
      },
      {
        displayedValue: "Mali",
        storedValue: "ML"
      },
      {
        displayedValue: "Malta",
        storedValue: "MT"
      },
      {
        displayedValue: "Marshall Islands",
        storedValue: "MH"
      },
      {
        displayedValue: "Martinique",
        storedValue: "MQ"
      },
      {
        displayedValue: "Mauritania",
        storedValue: "MR"
      },
      {
        displayedValue: "Mauritius",
        storedValue: "MU"
      },
      {
        displayedValue: "Mayotte",
        storedValue: "YT"
      },
      {
        displayedValue: "Mexico",
        storedValue: "MX"
      },
      {
        displayedValue: "Micronesia, Federated States of",
        storedValue: "FM"
      },
      {
        displayedValue: "Moldova, Republic of",
        storedValue: "MD"
      },
      {
        displayedValue: "Monaco",
        storedValue: "MC"
      },
      {
        displayedValue: "Mongolia",
        storedValue: "MN"
      },
      {
        displayedValue: "Montenegro",
        storedValue: "ME"
      },
      {
        displayedValue: "Montserrat",
        storedValue: "MS"
      },
      {
        displayedValue: "Morocco",
        storedValue: "MA"
      },
      {
        displayedValue: "Mozambique",
        storedValue: "MZ"
      },
      {
        displayedValue: "Myanmar",
        storedValue: "MM"
      },
      {
        displayedValue: "Namibia",
        storedValue: "NA"
      },
      {
        displayedValue: "Nauru",
        storedValue: "NR"
      },
      {
        displayedValue: "Nepal",
        storedValue: "NP"
      },
      {
        displayedValue: "Netherlands",
        storedValue: "NL"
      },
      {
        displayedValue: "New Caledonia",
        storedValue: "NC"
      },
      {
        displayedValue: "New Zealand",
        storedValue: "NZ"
      },
      {
        displayedValue: "Nicaragua",
        storedValue: "NI"
      },
      {
        displayedValue: "Niger",
        storedValue: "NE"
      },
      {
        displayedValue: "Nigeria",
        storedValue: "NG"
      },
      {
        displayedValue: "Niue",
        storedValue: "NU"
      },
      {
        displayedValue: "Norfolk Island",
        storedValue: "NF"
      },
      {
        displayedValue: "Northern Mariana Islands",
        storedValue: "MP"
      },
      {
        displayedValue: "Norway",
        storedValue: "NO"
      },
      {
        displayedValue: "Oman",
        storedValue: "OM"
      },
      {
        displayedValue: "Pakistan",
        storedValue: "PK"
      },
      {
        displayedValue: "Palau",
        storedValue: "PW"
      },
      {
        displayedValue: "Palestine, State of",
        storedValue: "PS"
      },
      {
        displayedValue: "Panama",
        storedValue: "PA"
      },
      {
        displayedValue: "Papua New Guinea",
        storedValue: "PG"
      },
      {
        displayedValue: "Paraguay",
        storedValue: "PY"
      },
      {
        displayedValue: "Peru",
        storedValue: "PE"
      },
      {
        displayedValue: "Philippines",
        storedValue: "PH"
      },
      {
        displayedValue: "Pitcairn",
        storedValue: "PN"
      },
      {
        displayedValue: "Poland",
        storedValue: "PL"
      },
      {
        displayedValue: "Portugal",
        storedValue: "PT"
      },
      {
        displayedValue: "Puerto Rico",
        storedValue: "PR"
      },
      {
        displayedValue: "Qatar",
        storedValue: "QA"
      },
      {
        displayedValue: "Réunion",
        storedValue: "RE"
      },
      {
        displayedValue: "Romania",
        storedValue: "RO"
      },
      {
        displayedValue: "Russian Federation",
        storedValue: "RU"
      },
      {
        displayedValue: "Rwanda",
        storedValue: "RW"
      },
      {
        displayedValue: "Saint Barthélemy",
        storedValue: "BL"
      },
      {
        displayedValue: "Saint Helena, Ascension and Tristan da Cunha",
        storedValue: "SH"
      },
      {
        displayedValue: "Saint Kitts and Nevis",
        storedValue: "KN"
      },
      {
        displayedValue: "Saint Lucia",
        storedValue: "LC"
      },
      {
        displayedValue: "Saint Martin (French part)",
        storedValue: "MF"
      },
      {
        displayedValue: "Saint Pierre and Miquelon",
        storedValue: "PM"
      },
      {
        displayedValue: "Saint Vincent and the Grenadines",
        storedValue: "VC"
      },
      {
        displayedValue: "Samoa",
        storedValue: "WS"
      },
      {
        displayedValue: "San Marino",
        storedValue: "SM"
      },
      {
        displayedValue: "Sao Tome and Principe",
        storedValue: "ST"
      },
      {
        displayedValue: "Saudi Arabia",
        storedValue: "SA"
      },
      {
        displayedValue: "Senegal",
        storedValue: "SN"
      },
      {
        displayedValue: "Serbia",
        storedValue: "RS"
      },
      {
        displayedValue: "Seychelles",
        storedValue: "SC"
      },
      {
        displayedValue: "Sierra Leone",
        storedValue: "SL"
      },
      {
        displayedValue: "Singapore",
        storedValue: "SG"
      },
      {
        displayedValue: "Sint Maarten (Dutch part)",
        storedValue: "SX"
      },
      {
        displayedValue: "Slovakia",
        storedValue: "SK"
      },
      {
        displayedValue: "Slovenia",
        storedValue: "SI"
      },
      {
        displayedValue: "Solomon Islands",
        storedValue: "SB"
      },
      {
        displayedValue: "Somalia",
        storedValue: "SO"
      },
      {
        displayedValue: "South Africa",
        storedValue: "ZA"
      },
      {
        displayedValue: "South Georgia and the South Sandwich Islands",
        storedValue: "GS"
      },
      {
        displayedValue: "South Sudan",
        storedValue: "SS"
      },
      {
        displayedValue: "Spain",
        storedValue: "ES"
      },
      {
        displayedValue: "Sri Lanka",
        storedValue: "LK"
      },
      {
        displayedValue: "Sudan",
        storedValue: "SD"
      },
      {
        displayedValue: "Suriname",
        storedValue: "SR"
      },
      {
        displayedValue: "Svalbard and Jan Mayen",
        storedValue: "SJ"
      },
      {
        displayedValue: "Swaziland",
        storedValue: "SZ"
      },
      {
        displayedValue: "Sweden",
        storedValue: "SE"
      },
      {
        displayedValue: "Switzerland",
        storedValue: "CH"
      },
      {
        displayedValue: "Syrian Arab Republic",
        storedValue: "SY"
      },
      {
        displayedValue: "Taiwan, Province of China",
        storedValue: "TW"
      },
      {
        displayedValue: "Tajikistan",
        storedValue: "TJ"
      },
      {
        displayedValue: "Tanzania, United Republic of",
        storedValue: "TZ"
      },
      {
        displayedValue: "Thailand",
        storedValue: "TH"
      },
      {
        displayedValue: "Timor-Leste",
        storedValue: "TL"
      },
      {
        displayedValue: "Togo",
        storedValue: "TG"
      },
      {
        displayedValue: "Tokelau",
        storedValue: "TK"
      },
      {
        displayedValue: "Tonga",
        storedValue: "TO"
      },
      {
        displayedValue: "Trinidad and Tobago",
        storedValue: "TT"
      },
      {
        displayedValue: "Tunisia",
        storedValue: "TN"
      },
      {
        displayedValue: "Turkey",
        storedValue: "TR"
      },
      {
        displayedValue: "Turkmenistan",
        storedValue: "TM"
      },
      {
        displayedValue: "Turks and Caicos Islands",
        storedValue: "TC"
      },
      {
        displayedValue: "Tuvalu",
        storedValue: "TV"
      },
      {
        displayedValue: "Uganda",
        storedValue: "UG"
      },
      {
        displayedValue: "Ukraine",
        storedValue: "UA"
      },
      {
        displayedValue: "United Arab Emirates",
        storedValue: "AE"
      },
      {
        displayedValue: "United Kingdom",
        storedValue: "GB"
      },
      {
        displayedValue: "United States",
        storedValue: "US"
      },
      {
        displayedValue: "United States Minor Outlying Islands",
        storedValue: "UM"
      },
      {
        displayedValue: "Uruguay",
        storedValue: "UY"
      },
      {
        displayedValue: "Uzbekistan",
        storedValue: "UZ"
      },
      {
        displayedValue: "Vanuatu",
        storedValue: "VU"
      },
      {
        displayedValue: "Venezuela, Bolivarian Republic of",
        storedValue: "VE"
      },
      {
        displayedValue: "Viet Nam",
        storedValue: "VN"
      },
      {
        displayedValue: "Virgin Islands, British",
        storedValue: "VG"
      },
      {
        displayedValue: "Virgin Islands, U.S.",
        storedValue: "VI"
      },
      {
        displayedValue: "Wallis and Futuna",
        storedValue: "WF"
      },
      {
        displayedValue: "Western Sahara",
        storedValue: "EH"
      },
      {
        displayedValue: "Yemen",
        storedValue: "YE"
      },
      {
        displayedValue: "Zambia",
        storedValue: "ZM"
      },
      {
        displayedValue: "Zimbabwe",
        storedValue: "ZW"
      }
    ]
  },
  bitstream_types: {
    name: "bitstream_types",
    dcTerm: "bitstream_types",
    pairs: [
      {
        displayedValue: "Unspecified",
        storedValue: undefined
      },
      {
        displayedValue: "Logo",
        storedValue: "logo"
      },
      {
        displayedValue: "Main Article",
        storedValue: "main article"
      },
      {
        displayedValue: "Personal Picture",
        storedValue: "personal picture"
      }
    ]
  }
};

export function getSubmissionValuePairs(name: string): SubmissionValuePairsConfig | undefined {
  return SUBMISSION_VALUE_PAIRS[name];
}
