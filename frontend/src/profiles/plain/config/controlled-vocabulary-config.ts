/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from controlled-vocabularies/*.xml
 */

export type ControlledVocabularyNode = {
  id: string;
  label: string;
  note?: string;
  children?: ControlledVocabularyNode[];
};

export type ControlledVocabularyConfig = {
  name: string;
  source: string;
  root: ControlledVocabularyNode;
};

export const CONTROLLED_VOCABULARIES: ControlledVocabularyConfig[] = [
  {
    name: "coar-types-v3",
    source: "coar-types-v3.xml",
    root: {
      id: "http://purl.org/coar/resource_type/scheme",
      label: "Resource Types",
      children: [
        {
          id: "c_12cc",
          label: "cartographic material",
          note: "Any material representing the whole or part of the earth or any celestial body at any scale. Cartographic materials include two- and three-dimensional maps and plans (including maps of imaginary places); aeronautical, navigational, and celestial charts; atlases; globes; block diagrams; sections; aerial photographs with a cartographic purpose; bird's-eye views (map views), etc. [Source: http://www.loc.gov/marc/cfmap.html]",
          children: [
            {
              id: "c_12cd",
              label: "map",
              note: "Defined as a representation normally to scale and on a flat medium, of a selection of material or abstract features on, or in relation to, the surface of the earth or of another celestial body. [Source: https://www.loc.gov/marc/bibliographic/bd007a.html]"
            }
          ]
        },
        {
          id: "c_ddb1",
          label: "dataset",
          note: "A collection of related facts and data encoded in a defined structure. [Source: Adapted from http://purl.org/spar/fabio/Dataset]",
          children: [
            {
              id: "ACF7-8YT9",
              label: "aggregated data",
              note: "Statistics that relate to broad classes, groups, or categories. The data are averaged, totaled, or otherwise derived from individual-level data, and it is no longer possible to distinguish the characteristics of individuals within those classes, groups, or categories. For example, the number and age group of the unemployed in specific geographic regions, or national level statistics on the occurrence of specific offences, originally derived from the statistics of individual police districts. [Source: https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "c_cb28",
              label: "clinical trial data",
              note: "Data resulting from a research study in which one or more human subjects are prospectively assigned to one or more interventions (which may include placebo or other control) to evaluate the effects of those interventions on health-related biomedical or behavioral outcomes. [Source: Adapted from https://grants.nih.gov/policy/clinical-trials/definition.htm]"
            },
            {
              id: "FXF3-D3G7",
              label: "compiled data",
              note: "Data collected or assembled from multiple, often heterogeneous sources that have one or more reference points in common, and at least one of the sources was originally produced for other purposes. The data are incorporated in a new entity. For example, providing data on the number of universities in the last 150 years using a variety of available sources (e.g. finance documents, official statistics, university registers), combining survey data with information about geographical areas from official statistics (e.g. population density, doctors per capita, etc.), or using RSS to collect blog posts or tweets, etc. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "AM6W-6QAW",
              label: "encoded data",
              note: "Qualitative data (textual, video, audio or still-image) originally produced for other purposes into quantitative data (expressed in unit-by-variable matrices) by using coding techniques in accordance with pre-defined categorization schemes. For example, coded party manifesto data like the \"European Parliament Election Study 2009, Manifesto Study\" (doi:10.4232/1.10204)\". [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "63NG-B465",
              label: "experimental data",
              note: "Data resulting from the experimental research method involving the manipulation of some or all of the independent variables included in the hypotheses. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "A8F1-NPV9",
              label: "genomic data",
              note: "Genomic data refers to the genome and DNA data of an organism. They are used in bioinformatics for collecting, storing and processing the genomes of living things. Genomic data is a more extensive term than sequencing data. However genomic data mostly come from sequencing techniques. It may include non-sequencing data such as data from microarrays, data from real-time PCR panels and data from pharmacogenomics studies. [Source: Adapted from https://www.techopedia.com/definition/31247/genomic-data]"
            },
            {
              id: "2H0M-X761",
              label: "geospatial data",
              note: "Discrete geospatial data are usually represented using vector data consisting of points, lines and polygons, while continuous geospatial data are usually represented by raster data, consisting of a grid of cells that each has its own value. Any number of applications in a wide range of areas produce geospatial data, such as GIS, Remote Sensing equipment, GPS units, archaeological total stations, manual mapping and computer-aided design (CAD), in a number of formats, including images, vector, text, and tabular data. Vector-based geospatial data include tables listing archaeological sites along with their coordinates, text-based files (e.g., XML) containing coordinates and topology for historic road networks, voting figures for political parties by administrative area. Raster-based geospatial data include satellite images, aerial photographs, scanned maps, and digital maps of elevations, vegetation, land-use, sea surface temperatures, air pollution, soil-types, etc. [Source: https://ddialliance.org/Specification/DDI-CV/GeneralDataFormat_2.0.html]"
            },
            {
              id: "H41Y-FW7B",
              label: "laboratory notebook",
              note: "A laboratory notebook (colloq. lab notebook or lab book) is a primary record of research. Researchers use a lab notebook to document their hypotheses, experiments and initial analysis or interpretation of these experiments. This label is used both for traditional and electronic laboratory notebook. [Source: Adapted from https://en.wikipedia.org/wiki/Lab_notebook]"
            },
            {
              id: "DD58-GFSX",
              label: "measurement and test data",
              note: "Data resulting from assessing specific properties (or characteristics) of beings, things, phenomena, (and/ or processes) by applying pre-established standards and/or specialized instruments or techniques. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "FF4C-28RK",
              label: "observational data",
              note: "Data resulting from observational research, which involves collecting observations as they occur (for example, observing behaviors, events, development of condition or disease, etc.), without attempting to manipulate any of the independent variables. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "CQMR-7K63",
              label: "recorded data",
              note: "Data registered by mechanical or electronic means, in a form that allows the information to be retrieved and/or reproduced. For example, images or sounds on disc or magnetic tape. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "W2XT-7017",
              label: "simulation data",
              note: "Data resulting from modeling or imitative representation of real-world processes, events, or systems, often using computer programs. For example, a program modeling household consumption responses to indirect tax changes; or a dataset on hypothetical patients and their drug exposure, background conditions, and known adverse events. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "NHD0-W6SY",
              label: "survey data",
              note: "Data resulting from a survey, which is defined as an investigation about the characteristics of a given population by means of collecting data from a sample of that population and estimating their characteristics through the systematic use of statistical methodology. Included are censuses, sample surveys, the collection of data from administrative records and derived statistical activities as well as questionnaires. [Source: Adapted from https://stats.oecd.org/glossary/detail.asp?ID=2620]"
            }
          ]
        },
        {
          id: "542X-3S04",
          label: "design",
          note: "Plans, drawing or set of drawings showing how something e.g. building, product is to be made and how it will work and look. [Source: Adapted from https://dictionary.cambridge.org/dictionary/english/design]",
          children: [
            {
              id: "JBNF-DYAD",
              label: "industrial design",
              note: "Industrial designs are applied to a wide variety of industrial products and handicrafts. They refer to the ornamental or aesthetic aspects of a useful article,including compositions of lines or colors or any three-dimensional forms that give a special appearance to a product or handicraft. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "BW7T-YM2G",
              label: "layout design",
              note: "Layout-design (topography) means the three-dimensional disposition, however expressed, of the interconnections of an integrated circuit, or such a three-dimensional disposition prepared for an integrated circuit intended for manufacture the elements of an integrated circuit (at least one of which is an active element) and of some or all. [Source: https://www.wipo.int/edocs/lexdocs/laws/en/hk/hk028en.pdf]"
            }
          ]
        },
        {
          id: "c_c513",
          label: "image",
          note: "A visual representation other than text, including all types of moving image and still image. [Source: Adapted from http://purl.org/dc/dcmitype/Image]",
          children: [
            {
              id: "c_8a7e",
              label: "moving image",
              note: "A moving display, either generated dynamically by a computer program or formed from a series of pre-recorded still images imparting an impression of motion when shown in succession. [Source: http://purl.org/spar/fabio/MovingImage]",
              children: [
                {
                  id: "c_12ce",
                  label: "video",
                  note: "A recording of visual images, usually in motion and with sound accompaniment. [Source: http://www.ifla.org/files/assets/cataloguing/isbd/isbd-cons_20110321.pdf ]"
                }
              ]
            },
            {
              id: "c_ecc8",
              label: "still image",
              note: "A recorded static visual representation. This class of image includes diagrams, drawings, graphs, graphic designs, plans, photographs and prints. [Source: Adapted from http://purl.org/spar/fabio/StillImage]"
            }
          ]
        },
        {
          id: "c_e9a0",
          label: "interactive resource",
          note: "A resource requiring interaction from the user to be understood, executed, or experienced. Examples include forms on Web pages, applets, multimedia learning objects, chat services, or virtual reality environments. Source: http://purl.org/dc/dcmitype/InteractiveResource",
          children: [
            {
              id: "c_7ad9",
              label: "website",
              note: "A collection of related web pages containing text, images, videos and/or other digital assets that are addressed relative to a common Uniform Resource Locator (URL). A web site is hosted on at least one web server, accessible via a network such as the Internet or a private local area network. [Source: http://purl.org/spar/fabio/WebSite]"
            }
          ]
        },
        {
          id: "c_e059",
          label: "learning object",
          note: "A digital resource that can be reused to enhance teaching and learning. [Source: https://icas-ca.org/archive/projects/coerc/oer-glossary]"
        },
        {
          id: "c_1843",
          label: "other",
          note: "A resource type that is not included in existing terms. [COAR definition]"
        },
        {
          id: "c_15cd",
          label: "patent",
          note: "A set of exclusive rights granted by law to applicants for inventions that are new, non-obvious and commercially applicable. A patent is valid for a limited period (generally 20 years), during which time patent holders can commercially exploit their inventions on an exclusive basis. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]",
          children: [
            {
              id: "SB3Y-W4EH",
              label: "PCT application",
              note: "A patent application filed through the WIPO-administered Patent Cooperation Treaty (PCT), also known as an international application. [Source: Adapted from https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "C53B-JCY5",
              label: "design patent",
              note: "A patent granted to any person who has invented any new and non-obvious ornamental design for an article of manufacture. The design patent protects only the appearance of an article, but not its structural or functional features. [Source: Adapted from https://www.uspto.gov/patents/basics/types-patent-applications/design-patent-application-guide#def]"
            },
            {
              id: "Z907-YMBB",
              label: "plant patent",
              note: "A patent granted to anyone who has invented or discovered and asexually reproduced any distinct and new variety of plant, including cultivated sports, mutants, hybrids, and newly found seedlings, other than a tuber-propagated plant or a plant found in an uncultivated state. [Source: Adapted from https://www.uspto.gov/patents/basics/types-patent-applications/general-information-about-35-usc-161#heading-1]"
            },
            {
              id: "GPQ7-G5VE",
              label: "plant variety protection",
              note: "Plant variety protection, also called a \"plant breeder's right\" (PBR), is a form of intellectual property right granted to the breeder of a new plant variety . According to this right, certain acts concerning the exploitation of the protected variety require the prior authorization of the breeder. Plant variety protection is an independent sui generis form of protection, tailored to protect new plant varieties and has certain features in common with other intellectual property rights. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "MW8G-3CR8",
              label: "software patent",
              note: "In order to obtain a patent, a software invention must not fall under other non-patentable subject matter (for example, abstract ideas or mathematical theories) and has to fulfill the other substantive patentability criteria (for example, novelty, inventive step [non-obviousness] and industrial applicability [usefulness]). [Source: https://www.wipo.int/patents/en/faq_patents.html]"
            },
            {
              id: "9DKX-KSAF",
              label: "utility model",
              note: "A special form of patent right granted by a state or jurisdiction to an inventor or the inventor’s assignee for a fixed period of time. The terms and conditions for granting a utility model are slightly different from those for normal patents (including a shorter term of protection and less stringent patentability requirements). The term can also describe what are known in certain countries as “petty patents,” “short-term patents” or “innovation patents.” [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            }
          ]
        },
        {
          id: "c_5ce6",
          label: "software",
          note: "A computer program in source code (text) or compiled form. [Source: http://purl.org/dc/dcmitype/Software]",
          children: [
            {
              id: "c_c950",
              label: "research software",
              note: "Software that is used to generate, process or analyse results that you intend to appear in a publication (either in a journal, conference paper, monograph, book or thesis). Research software can be anything from a few lines of code written by yourself, to a professionally developed software package. [Source: https://datashare.ed.ac.uk/handle/10283/785]"
            },
            {
              id: "QH80-2R4E",
              label: "source code",
              note: "Source code is any collection of code, with or without comments, written using a human-readable programming language, usually as plain text. [Source: https://en.wikipedia.org/wiki/Source_code]"
            }
          ]
        },
        {
          id: "c_18cc",
          label: "sound",
          note: "A resource primarily intended to be heard. Examples include a music playback file format, an audio compact disc, and recorded speech or sounds. [Source: http://dublincore.org/documents/dcmi-terms/#dcmitype-Sound]",
          children: [
            {
              id: "c_18cd",
              label: "musical composition",
              note: "Musical composition can refer to an original piece of music, the structure of a musical piece, or the process of creating a new piece of music. [Source: https://en.wikipedia.org/wiki/Musical_composition ]"
            }
          ]
        },
        {
          id: "c_18cf",
          label: "text",
          note: "A resource consisting primarily of words for reading. Examples include books, letters, dissertations, poems, newspapers, articles, archives of mailing lists. Note that facsimiles or images of texts are still of the genre Text. [Source: http://purl.org/dc/dcmitype/Text]",
          children: [
            {
              id: "c_1162",
              label: "annotation",
              note: "An annotation in the sense of a legal note is a legally explanatory comment on a decision handed down by a court or arbitral tribunal. [Source: DRIVER info:eu-repo definition]"
            },
            {
              id: "c_86bc",
              label: "bibliography",
              note: "A list of the books and articles that have been used by someone when writing a particular book or article [Source: https://dictionary.cambridge.org/dictionary/english/bibliography]"
            },
            {
              id: "c_6947",
              label: "blog post",
              note: "A piece of writing or other item of content published on a blog. [Source: https://www.lexico.com/definition/blog_post]"
            },
            {
              id: "c_2f33",
              label: "book",
              note: "A non-serial publication that is complete in one volume or a designated finite number of volumes. [Source: Adapted from http://purl.org/eprint/type/Book]",
              children: [
                {
                  id: "c_3248",
                  label: "book part",
                  note: "A defined chapter or section of a book, usually with a separate title or number. [Source: http://purl.org/spar/fabio/BookChapter]"
                }
              ]
            },
            {
              id: "c_c94f",
              label: "conference output",
              note: "All kind of digital resources contributed to a conference, like conference presentation (slides), conference report, conference lecture, abstracts, demonstrations. For conference papers, posters or proceedings the specific sub-concepts should be used. [COAR definition]",
              children: [
                {
                  id: "c_18cp",
                  label: "conference paper not in proceedings",
                  note: "A paper, typically the realization of a research paper reporting original research findings. Use this label when the paper is not published in a proceeding. [Source: Adapted from http://purl.org/spar/fabio/ConferencePaper]"
                },
                {
                  id: "c_18co",
                  label: "conference poster not in proceedings",
                  note: "A display poster, typically containing text with illustrative figures and/or tables, usually reporting research results or proposing hypotheses, submitted for acceptance to and/or presented at a conference, seminar, symposium, workshop or similar event. Use this label when the poster is not published in a proceeding. [Source: http://purl.org/spar/fabio/ConferencePoster]"
                },
                {
                  id: "R60J-J5BD",
                  label: "conference presentation",
                  note: "A set of slides containing text, tables or figures, designed to communicate ideas or research results, for projection and viewing by an audience at a conference, symposium, seminar, lecture, workshop or other gatherings. [Source: Adapted from http://purl.org/spar/fabio/Presentation]"
                },
                {
                  id: "c_f744",
                  label: "conference proceedings",
                  note: "Conference proceedings is the official record of a conference meeting. It is a collection of documents which corresponds to the presentations given at the conference. It may include additional content. [Source: http://www.ieee.org/documents/confprocdefined.pdf ]",
                  children: [
                    {
                      id: "c_5794",
                      label: "conference paper",
                      note: "A paper, published within a conference proceeding, typically the realization of a research paper reporting original research findings. [Source: Adapted from http://purl.org/spar/fabio/ConferencePaper]"
                    },
                    {
                      id: "c_6670",
                      label: "conference poster",
                      note: "A display poster, published within a conference proceeding, typically containing text with illustrative figures and/or tables, usually reporting research results or proposing hypotheses, submitted for acceptance to and/or presented at a conference, seminar, symposium, workshop or similar event. [Source: Adapted http://purl.org/spar/fabio/ConferencePoster]"
                    }
                  ]
                }
              ]
            },
            {
              id: "c_0640",
              label: "journal",
              note: "A journal is a serial publication devoted to disseminating original research and current developments on a subject. (Adapted from ODLIS) [Source: http://dspacecris.eurocris.org/cris/classcerif/classcerif00422]",
              children: [
                {
                  id: "c_b239",
                  label: "editorial",
                  note: "A brief essay expressing the opinion or position of the chief editor(s) of a (academic) journal with respect to a current political, social, cultural, or professional issue. [Source: Adapted from ODLIS [Source: http://www.abc-clio.com/ODLIS/odlis_e.aspx ]"
                },
                {
                  id: "c_6501",
                  label: "journal article",
                  note: "An article, typically the realization of a research paper reporting original research findings, published in a journal issue. [Source: http://purl.org/spar/fabio/JournalArticle]",
                  children: [
                    {
                      id: "c_7acd",
                      label: "corrigendum",
                      note: "A formal correction to an error introduced by the author into a previously published document. (adapted from https://sparontologies.github.io/fabio/current/fabio.html#d4e2712)"
                    },
                    {
                      id: "c_beb9",
                      label: "data paper",
                      note: "A data paper is a scholarly publication describing a particular dataset or group of dataset, published in the form of a peer-reviewed article in a scholarly journal. The main purpose of a data paper is to describe data, the circumstances of their collection, and information related to data features, access and potential reuse. Adapted from https://en.wikipedia.org/wiki/Data_paper and http://www.gbif.org/publishing-data/data-papers"
                    },
                    {
                      id: "c_2df8fbb1",
                      label: "research article",
                      note: "A research article is a primary source, that is, it reports the methods and results of an original study performed by the authors. (adapted from http://apus.libanswers.com/faq/2324)"
                    },
                    {
                      id: "c_dcae04bc",
                      label: "review article",
                      note: "A review article is a secondary source, that is, it is written about other articles, and does not report original research of its own. [Source: Adapted from http://apus.libanswers.com/faq/2324]"
                    },
                    {
                      id: "c_7bab",
                      label: "software paper",
                      note: "A software paper should include the rationale for the development of the tool and details of the code used for its construction. [Source: Adapted from https://f1000research.com/for-authors/article-guidelines/software-tool-articles ]"
                    }
                  ]
                },
                {
                  id: "c_545b",
                  label: "letter to the editor",
                  note: "A letter addressed to the editor and comments on or discussed an item previously published by that periodical, or of interest to its readership. [Source: Adapted from http://purl.org/spar/fabio/Letter]"
                }
              ]
            },
            {
              id: "c_8544",
              label: "lecture",
              note: "Transcription of an oral presentation/talk intended to present information or teach people about a particular subject, for example by a university or college teacher. [Source: Adopted from https://en.wikipedia.org/wiki/Lecture]"
            },
            {
              id: "c_0857",
              label: "letter",
              note: "A brief description of important new research, also known as “communication”. [Source: https://cerif.eurocris.org/vocab/html/OutputTypes.html#Letter]"
            },
            {
              id: "c_2cd9",
              label: "magazine",
              note: "A popular interest periodical usually containing articles on a variety of topics, written by various authors in a nonscholarly style or a trade publication, unlike a consumer publication, covers a specific topic for people who work in that particular field or industry. [Source: Adapted from https://www.thebalance.com/what-is-a-trade-publication-exactly-2316039 and http://www.abc-clio.com/ODLIS/odlis_m.aspx]"
            },
            {
              id: "c_0040",
              label: "manuscript",
              note: "A manuscript is a work of any kind (text, inscription, music score, map, etc.) written entirely by hand. [Source: https://products.abc-clio.com/ODLIS/odlis_m.aspx]"
            },
            {
              id: "c_18cw",
              label: "musical notation",
              note: "Symbols used to write music, as in a music score, and to express mathematical concepts. [Source: Adapted from https://products.abc-clio.com/ODLIS/odlis_n.aspx]"
            },
            {
              id: "c_2fe3",
              label: "newspaper",
              note: "A non-peer reviewed periodical, usually published daily or weekly, consisting primarily of editorials and news items concerning current or recent events and matters of public interest. [Source: http://purl.org/spar/fabio/Newspaper]",
              children: [
                {
                  id: "c_998f",
                  label: "newspaper article",
                  note: "Work consisting of a news item appearing in a general-interest newspaper or other general news periodical, containing information of current and timely interest in a field. (Adapted from http://www.reference.md/files/D018/mD018431.html )"
                }
              ]
            },
            {
              id: "QX5C-AR31",
              label: "other periodical",
              note: "A resource type that is not included in existing terms under the top concept \"Text\". [COAR definition]"
            },
            {
              id: "c_816b",
              label: "preprint",
              note: "A preprint is a scientific manuscript without peer-review and has not yet been accepted by a journal, typicaly submitted to a public server/ repository by the author. [Source: Adapted from https://asapbio.org/preprint-info/preprint-faq#qaef-637]"
            },
            {
              id: "c_93fc",
              label: "report",
              note: "A report is a separately published record of research findings, research still in progress, policy developments and events, or other technical findings, usually bearing a report number and sometimes a grant number assigned by the funding agency. Also, an official record of the activities of a committee or corporate entity, the proceedings of a government body, or an investigation by an agency, whether published or private, usually archived or submitted to a higher authority, voluntarily or under mandate. In a more general sense, any formal account of facts or information related to a specific event or phenomenon, sometimes given at regular intervals. [Source: http://lu.com/odlis/odlis_R.cfm#report ]",
              children: [
                {
                  id: "c_7877",
                  label: "clinical study",
                  note: "A work that reports on the results of a research study to evaluate interventions or exposures on biomedical or health-related outcomes. The two main types of clinical studies are interventional studies (clinical trials) and observational studies. While most clinical studies concern humans, this publication type may be used for clinical veterinary articles meeting the requisites for humans. [Source: https://www.ncbi.nlm.nih.gov/mesh/2009830]"
                },
                {
                  id: "c_ab20",
                  label: "data management plan",
                  note: "A formal statement describing how research data will be managed and documented throughout a research project and the terms regarding the subsequent deposit of the data with a data repository for long-term management and preservation. [Source: https://casrai.org/rdm-glossary]"
                },
                {
                  id: "c_18wz",
                  label: "memorandum",
                  note: "A formal note distributed internally to one or more persons in a company, agency, organization, or institution, with a header indicating the date it was sent and stating to whom it is addressed (To:), from whom it is sent (From:), and the subject of the text (Re:). Unlike a letter, a memo does not require a full salutation or signature at the end of the text--the sender may simply initial his or her name in the header. [Source: https://products.abc-clio.com/ODLIS/odlis_m.aspx#memorandum]"
                },
                {
                  id: "c_186u",
                  label: "policy report",
                  note: "A policy report presents what is known about a particular issue or problem. It assembles facts and evidence to help readers understand complex issues and form a response. It might aim to be neutral, or it might aim to persuade readers in a particular direction. [Source: https://www.uow.edu.au/student/learning-co-op/assessments/policy-report/#]"
                },
                {
                  id: "c_18op",
                  label: "project deliverable",
                  note: "A document containing a project report, intended to be delivered to a customer or funding agency describing the results achieved within a specific project. [Source: http://purl.org/spar/fabio/ProjectReportDocument]"
                },
                {
                  id: "YZ1N-ZFT9",
                  label: "research protocol",
                  note: "The protocol is a detailed plan of the research study including a project summary, project description covering the rationale, objectives, methodology, data management and analysis, ethical considerations, gender issues and references. [Source: Adapted from https://www.who.int/publications/i/item/a-practical-guide-for-health-researchers]"
                },
                {
                  id: "c_18ws",
                  label: "research report",
                  note: "It is publication that reports on the findings of a research project or alternatively scientific observations on or about a subject. [Source: Adapted from https://en.wikipedia.org/wiki/Research_report]"
                },
                {
                  id: "c_18gh",
                  label: "technical report",
                  note: "A document that describes the process, progress, or results of technical or scientific research or the state of a technical or scientific research problem. It might also include recommendations and conclusions of the research. [Source: http://guides.library.cornell.edu/ecommons/types]"
                }
              ]
            },
            {
              id: "c_baaf",
              label: "research proposal",
              note: "A research proposal is a document proposing a research project, generally in the sciences or academia, and generally constitutes a request for sponsorship of that research. [Source: https://en.wikipedia.org/wiki/Research_proposal]"
            },
            {
              id: "c_efa0",
              label: "review",
              note: "A review of others' published work. [Source: Adapted from http://purl.org/spar/fabio/Review]",
              children: [
                {
                  id: "c_ba08",
                  label: "book review",
                  note: "A written review and critical analysis of the content, scope and quality of a book or other monographic work. [Source: http://purl.org/spar/fabio/BookReview]"
                },
                {
                  id: "D97F-VB57",
                  label: "commentary",
                  note: "A commentary is a more in-depth analysis written to draw attention to a work already published. Commentaries are somewhat like “reviews” in that the author presents his or her analysis of a work and why it would be of interest to a specific audience. [Source: https://www.enago.com/academy/perspective-opinion-and-commentary-pieces]"
                },
                {
                  id: "H9BQ-739P",
                  label: "peer review",
                  note: "An evaluation of scientific, academic, or professional work by others working in the same field. [Source: Adopted from https://schema.datacite.org/meta/kernel-4.4/doc/DataCite-MetadataKernel_v4.4.pdf]"
                }
              ]
            },
            {
              id: "c_71bd",
              label: "technical documentation",
              note: "Technical documentation refers to any type of documentation that describes handling, functionality and architecture of a technical product or a product under development or use. [Source: https://en.wikipedia.org/wiki/Technical_documentation]"
            },
            {
              id: "c_46ec",
              label: "thesis",
              note: "A book authored by a student containing a formal presentations of research outputs submitted for examination in completion of a course of study at an institution of higher education, to fulfil the requirements for an academic degree. Also know as a dissertation. [Source: http://purl.org/spar/fabio/Thesis]",
              children: [
                {
                  id: "c_7a1f",
                  label: "bachelor thesis",
                  note: "A thesis reporting a research project undertaken as part of an undergraduate course of education leading to a bachelor's degree. [Source: http://purl.org/spar/fabio/BachelorsThesis]"
                },
                {
                  id: "c_db06",
                  label: "doctoral thesis",
                  note: "A thesis reporting the research undertaken during a period of graduate study leading to a doctoral degree. [Source: http://purl.org/spar/fabio/DoctoralThesis]"
                },
                {
                  id: "c_bdcc",
                  label: "master thesis",
                  note: "A thesis reporting a research project undertaken as part of a graduate course of education leading to a master's degree. [Source: http://purl.org/spar/fabio/MastersThesis]"
                }
              ]
            },
            {
              id: "6NC7-GK9S",
              label: "transcription",
              note: "A written record of words spoken in court proceedings or in a speech, interview, broadcast, or sound recording. [Source: Adapted from https://products.abc-clio.com/ODLIS/odlis_t.aspx]"
            },
            {
              id: "c_8042",
              label: "working paper",
              note: "A working or discussion paper circulated publicly or among a group of peers. Certain disciplines, for example economics, issue working papers in series. [Source: http://www.ukoln.ac.uk/repositories/digirep/index/Eprints_Type_Vocabulary_Encoding_Scheme#:~:text=http%3A//purl.org/eprint/type/WorkingPaper]"
            }
          ]
        },
        {
          id: "H6QP-SC1X",
          label: "trademark",
          note: "A sign used to distinguish the goods or services of one undertaking from those of others. A trademark may consist of words and combinations of words (for instance, names or slogans), logos, figures and images, letters, numbers, sounds, or, in rare instances, smells or moving images, or a combination thereof. [Source: https://www.wipo.int/trademarks/en]"
        },
        {
          id: "c_393c",
          label: "workflow",
          note: "A recorded sequence of connected steps, which may be automated, specifying a reliably repeatable sequence of operations to be undertaken when conducting a particular job, for example an in silico investigation that extracts and processes information from a number of bioinformatics databases. [Source: Adapted from http://purl.org/spar/fabio/Workflow]"
        }
      ]
    }
  },
  {
    name: "nsi",
    source: "nsi.xml",
    root: {
      id: "VDP",
      label: "VDP",
      children: [
        {
          id: "000",
          label: "Humaniora: 000",
          children: [
            {
              id: "010",
              label: "Språkvitenskapelige fag: 010",
              children: [
                {
                  id: "011",
                  label: "Allmenn språkvitenskap og fonetikk: 011"
                },
                {
                  id: "012",
                  label: "Anvendt språkvitenskap: 012"
                },
                {
                  id: "013",
                  label: "Tegnspråk: 013"
                },
                {
                  id: "018",
                  label: "Nordiske språk: 018"
                },
                {
                  id: "019",
                  label: "Norrøn filologi: 019"
                },
                {
                  id: "020",
                  label: "Engelsk språk: 020"
                },
                {
                  id: "021",
                  label: "Tysk språk: 021"
                },
                {
                  id: "022",
                  label: "Nederlandsk språk: 022"
                },
                {
                  id: "023",
                  label: "Andre germanske språk: 023"
                },
                {
                  id: "024",
                  label: "Fransk språk: 024"
                },
                {
                  id: "025",
                  label: "Italiensk språk: 025"
                },
                {
                  id: "026",
                  label: "Spansk språk: 026"
                },
                {
                  id: "027",
                  label: "Andre romanske språk: 027"
                },
                {
                  id: "028",
                  label: "Russisk språk: 028"
                },
                {
                  id: "029",
                  label: "Andre slaviske språk: 029"
                },
                {
                  id: "030",
                  label: "Finsk-ugriske språk: 030"
                },
                {
                  id: "031",
                  label: "Samisk språk: 031"
                },
                {
                  id: "032",
                  label: "Klassisk filologi: 032"
                },
                {
                  id: "033",
                  label: "Indoeuropeiske språk: 033"
                },
                {
                  id: "034",
                  label: "Østasiatiske språk: 034"
                },
                {
                  id: "035",
                  label: "Semittiske språk: 035"
                },
                {
                  id: "036",
                  label: "Afrikanske språk: 036"
                },
                {
                  id: "037",
                  label: "Stillehavsspråk: 037"
                },
                {
                  id: "038",
                  label: "Tyrkiske språk: 038"
                },
                {
                  id: "039",
                  label: "Andre språkvitenskapelige fag: 039"
                }
              ]
            },
            {
              id: "040",
              label: "Litteraturvitenskapelige fag: 040",
              children: [
                {
                  id: "041",
                  label: "Allmenn litteraturvitenskap: 041"
                },
                {
                  id: "042",
                  label: "Nordisk litteratur: 042"
                },
                {
                  id: "043",
                  label: "Engelsk litteratur: 043"
                },
                {
                  id: "044",
                  label: "Tysk litteratur: 044"
                },
                {
                  id: "045",
                  label: "Annen germansk litteratur: 045"
                },
                {
                  id: "046",
                  label: "Fransk litteratur: 046"
                },
                {
                  id: "047",
                  label: "Italiensk litteratur: 047"
                },
                {
                  id: "048",
                  label: "Spansk litteratur: 048"
                },
                {
                  id: "049",
                  label: "Annen romansk litteratur: 049"
                },
                {
                  id: "050",
                  label: "Russisk litteratur: 050"
                },
                {
                  id: "051",
                  label: "Annen slavisk litteratur: 051"
                },
                {
                  id: "052",
                  label: "Finsk litteratur: 052"
                },
                {
                  id: "053",
                  label: "Samisk litteratur: 053"
                },
                {
                  id: "054",
                  label: "Klassisk litteratur: 054"
                },
                {
                  id: "055",
                  label: "Indoeuropeisk litteratur: 055"
                },
                {
                  id: "056",
                  label: "Østasiatisk litteratur: 056"
                },
                {
                  id: "057",
                  label: "Semittisk litteratur: 057"
                },
                {
                  id: "058",
                  label: "Afrikansk litteratur: 058"
                },
                {
                  id: "059",
                  label: "Andre litteraturvitenskapelige fag: 059"
                }
              ]
            },
            {
              id: "060",
              label: "Kulturvitenskap: 060",
              children: [
                {
                  id: "061",
                  label: "Nordisk kulturvitenskap: 061"
                },
                {
                  id: "062",
                  label: "Germansk kulturvitenskap: 062"
                },
                {
                  id: "063",
                  label: "Romansk kulturvitenskap: 063"
                },
                {
                  id: "064",
                  label: "Slavisk kulturvitenskap: 064"
                },
                {
                  id: "065",
                  label: "Klassisk kulturvitenskap: 065"
                },
                {
                  id: "066",
                  label: "Indoeuropeisk kulturvitenskap: 066"
                },
                {
                  id: "067",
                  label: "Østasiatisk kulturvitenskap: 067"
                },
                {
                  id: "068",
                  label: "Angloamerikansk kulturvitenskap: 068"
                },
                {
                  id: "069",
                  label: "Annen kulturvitenskap: 069"
                }
              ]
            },
            {
              id: "070",
              label: "Historie: 070",
              children: [
                {
                  id: "071",
                  label: "Politisk historie: 071"
                },
                {
                  id: "072",
                  label: "Sosialhistorie: 072"
                },
                {
                  id: "073",
                  label: "Kvinnehistorie: 073"
                },
                {
                  id: "074",
                  label: "Økonomisk historie: 074"
                },
                {
                  id: "075",
                  label: "Kulturhistorie: 075"
                },
                {
                  id: "080",
                  label: "Oldtidens historie: 080"
                },
                {
                  id: "081",
                  label: "Middelalderhistorie: 081"
                },
                {
                  id: "082",
                  label: "Nyere tids historie (før 1800): 082"
                },
                {
                  id: "083",
                  label: "Moderne historie (etter 1800): 083"
                },
                {
                  id: "084",
                  label: "Samtidshistorie (etter 1945): 084"
                },
                {
                  id: "085",
                  label: "Ikke-europeisk/-vestlig historie: 085"
                },
                {
                  id: "089",
                  label: "Annen historie: 089"
                }
              ]
            },
            {
              id: "090",
              label: "Arkeologi: 090",
              children: [
                {
                  id: "091",
                  label: "Nordisk arkeologi: 091"
                },
                {
                  id: "092",
                  label: "Klassisk arkeologi: 092"
                },
                {
                  id: "099",
                  label: "Annen arkeologi: 099"
                }
              ]
            },
            {
              id: "100",
              label: "Folkloristikk, etnologi: 100",
              children: [
                {
                  id: "101",
                  label: "Folkloristikk: 101"
                },
                {
                  id: "102",
                  label: "Etnologi: 102"
                }
              ]
            },
            {
              id: "110",
              label: "Musikkvitenskap: 110",
              children: [
                {
                  id: "111",
                  label: "Musikkhistorie: 111"
                },
                {
                  id: "112",
                  label: "Musikkteori: 112"
                },
                {
                  id: "113",
                  label: "Musikkterapi: 113"
                },
                {
                  id: "114",
                  label: "Musikkpedagogikk: 114"
                },
                {
                  id: "119",
                  label: "Annen musikkvitenskap: 119"
                }
              ]
            },
            {
              id: "120",
              label: "Kunsthistorie: 120",
              children: [
                {
                  id: "121",
                  label: "Skulptur: 121"
                },
                {
                  id: "122",
                  label: "Maleri, tegning, grafikk: 122"
                },
                {
                  id: "123",
                  label: "Folkekunst, kunsthåndverk: 123"
                },
                {
                  id: "124",
                  label: "Konservering og restaurering: 124"
                },
                {
                  id: "125",
                  label: "Antikkens kunsthistorie: 125"
                },
                {
                  id: "126",
                  label: "Middelalderkunsthistorie: 126"
                },
                {
                  id: "127",
                  label: "Fra renessanse‑ t.o.m. barokk: 127"
                },
                {
                  id: "128",
                  label: "Nyere tids kunsthistorie: 128"
                },
                {
                  id: "129",
                  label: "Moderne kunsthistorie: 129"
                },
                {
                  id: "130",
                  label: "Ikke‑europeisk kunsthistorie: 130"
                },
                {
                  id: "139",
                  label: "Annen kunsthistorie: 139"
                }
              ]
            },
            {
              id: "140",
              label: "Arkitektur og design: 140",
              children: [
                {
                  id: "141",
                  label: "Arkitektur- og designhistorie: 141"
                },
                {
                  id: "142",
                  label: "Arkitektur- og designteori: 142"
                },
                {
                  id: "143",
                  label: "Prosjekterings‑ og formgivningsmetodikk: 143"
                },
                {
                  id: "147",
                  label: "Landskapsarkitektur: 147"
                }
              ]
            },
            {
              id: "150",
              label: "Teologi og religionsvitenskap: 150",
              children: [
                {
                  id: "151",
                  label: "Teologi: 151"
                },
                {
                  id: "152",
                  label: "Kristendomskunnskap: 152"
                },
                {
                  id: "153",
                  label: "Religionsvitenskap, religionshistorie: 153"
                }
              ]
            },
            {
              id: "160",
              label: "Filosofiske fag: 160",
              children: [
                {
                  id: "161",
                  label: "Filosofi: 161"
                },
                {
                  id: "162",
                  label: "Idéhistorie: 162"
                },
                {
                  id: "163",
                  label: "Logikk: 163"
                },
                {
                  id: "164",
                  label: "Etikk: 164"
                },
                {
                  id: "169",
                  label: "Andre filosofiske fag: 169"
                }
              ]
            },
            {
              id: "170",
              label: "Film- og teatervitenskap: 170",
              children: [
                {
                  id: "171",
                  label: "Filmvitenskap: 171"
                },
                {
                  id: "172",
                  label: "Teatervitenskap: 172"
                }
              ]
            }
          ]
        },
        {
          id: "200",
          label: "Samfunnsvitenskap: 200",
          children: [
            {
              id: "210",
              label: "Økonomi: 210",
              children: [
                {
                  id: "212",
                  label: "Samfunnsøkonomi: 212"
                },
                {
                  id: "213",
                  label: "Bedriftsøkonomi: 213"
                },
                {
                  id: "214",
                  label: "Økonometri: 214"
                }
              ]
            },
            {
              id: "230",
              label: "Urbanisme og fysisk planlegging: 230",
              children: [
                {
                  id: "231",
                  label: "Planleggingshistorie, -teori og -metodikk: 231"
                },
                {
                  id: "234",
                  label: "Bebyggelses‑ og reguleringsplanlegging: 234"
                },
                {
                  id: "236",
                  label: "Landskapsplanlegging: 236"
                },
                {
                  id: "237",
                  label: "Urbanisme: 237"
                },
                {
                  id: "238",
                  label: "Romlig, territoriell planlegging: 238"
                }
              ]
            },
            {
              id: "240",
              label: "Statsvitenskap og organisasjonsteori: 240",
              children: [
                {
                  id: "241",
                  label: "Sammenlignende politikk: 241"
                },
                {
                  id: "242",
                  label: "Offentlig og privat administrasjon: 242"
                },
                {
                  id: "243",
                  label: "Internasjonal politikk: 243"
                }
              ]
            },
            {
              id: "260",
              label: "Psykologi: 260",
              children: [
                {
                  id: "261",
                  label: "Biologisk psykologi: 261"
                },
                {
                  id: "262",
                  label: "Klinisk psykologi: 262"
                },
                {
                  id: "263",
                  label: "Sosial- og arbeidspsykologi: 263"
                },
                {
                  id: "264",
                  label: "Personlighetspsykologi: 264"
                },
                {
                  id: "265",
                  label: "Utviklingspsykologi: 265"
                },
                {
                  id: "267",
                  label: "Kognitiv psykologi: 267"
                },
                {
                  id: "268",
                  label: "Organisasjonspsykologi: 268"
                },
                {
                  id: "279",
                  label: "Andre psykologiske fag: 279"
                }
              ]
            },
            {
              id: "280",
              label: "Pedagogiske fag: 280",
              children: [
                {
                  id: "281",
                  label: "Allmennpedagogikk: 281"
                },
                {
                  id: "282",
                  label: "Spesialpedagogikk: 282"
                },
                {
                  id: "283",
                  label: "Fagdidaktikk: 283"
                },
                {
                  id: "289",
                  label: "Andre pedagogiske fag: 289"
                }
              ]
            },
            {
              id: "320",
              label: "Biblioteks- og informasjonsvitenskap: 320",
              children: [
                {
                  id: "321",
                  label: "Informasjons- og kommunikasjonssystemer: 321"
                },
                {
                  id: "322",
                  label: "Informasjonspolitikk: 322"
                },
                {
                  id: "323",
                  label: "Kunnskapsgjenfinning og organisering: 323"
                },
                {
                  id: "324",
                  label: "Bibliometri: 324"
                },
                {
                  id: "325",
                  label: "Dokumentasjonsvitenskap: 325"
                },
                {
                  id: "326",
                  label: "Arkivistikk: 326"
                }
              ]
            },
            {
              id: "330",
              label: "Samfunnsvitenskapelige idrettsfag: 330",
              children: [
                {
                  id: "331",
                  label: "Integreringsfag: 331"
                },
                {
                  id: "332",
                  label: "Aktivitetslære: 332"
                },
                {
                  id: "333",
                  label: "Idrettspedagogikk og -psykologi: 333"
                },
                {
                  id: "339",
                  label: "Andre idrettsfag: 339"
                }
              ]
            },
            {
              id: "340",
              label: "Rettsvitenskap: 340",
              children: [
                {
                  id: "341",
                  label: "Allmenn rettsvitenskap: 341"
                },
                {
                  id: "342",
                  label: "Privatrett: 342"
                },
                {
                  id: "343",
                  label: "Offentlig rett: 343"
                },
                {
                  id: "344",
                  label: "Folkerett: 344"
                },
                {
                  id: "346",
                  label: "Rettsinformatikk: 346"
                },
                {
                  id: "347",
                  label: "Miljørett: 347"
                },
                {
                  id: "348",
                  label: "Fiskerirett: 348"
                },
                {
                  id: "349",
                  label: "Andre rettsvitenskapelige fag: 349"
                }
              ]
            },
            {
              id: "220",
              label: "Sosiologi: 220"
            },
            {
              id: "250",
              label: "Sosialantropologi: 250"
            },
            {
              id: "290",
              label: "Samfunnsgeografi: 290"
            },
            {
              id: "300",
              label: "Demografi: 300"
            },
            {
              id: "310",
              label: "Medievitenskap og journalistikk: 310"
            },
            {
              id: "350",
              label: "Kriminologi: 350"
            },
            {
              id: "360",
              label: "Sosialt arbeid: 360"
            },
            {
              id: "370",
              label: "Kvinne- og kjønnsstudier: 370"
            }
          ]
        },
        {
          id: "400",
          label: "Matematikk og Naturvitenskap: 400",
          children: [
            {
              id: "410",
              label: "Matematikk: 410",
              children: [
                {
                  id: "411",
                  label: "Analyse: 411"
                },
                {
                  id: "412",
                  label: "Statistikk: 412"
                },
                {
                  id: "413",
                  label: "Anvendt matematikk: 413"
                },
                {
                  id: "414",
                  label: "Algebra/algebraisk analyse: 414"
                },
                {
                  id: "415",
                  label: "Topologi/geometri: 415"
                },
                {
                  id: "416",
                  label: "Logikk: 416"
                },
                {
                  id: "417",
                  label: "Forsikringsmatematikk og risikoanalyse: 417"
                }
              ]
            },
            {
              id: "420",
              label: "Informasjons- og kommunikasjonsvitenskap: 420",
              children: [
                {
                  id: "421",
                  label: "Teoretisk databehandling, programmeringsspråk og -teori: 421"
                },
                {
                  id: "422",
                  label: "Algoritmer og beregnbarhetsteori: 422"
                },
                {
                  id: "423",
                  label: "Kommunikasjon og distribuerte systemer: 423"
                },
                {
                  id: "424",
                  label: "Sikkerhet og sårbarhet: 424"
                },
                {
                  id: "425",
                  label: "Kunnskapsbaserte systemer: 425"
                },
                {
                  id: "426",
                  label: "Systemutvikling og – arbeid: 426"
                },
                {
                  id: "427",
                  label: "Matematisk modellering og numeriske metoder: 427"
                },
                {
                  id: "428",
                  label: "Databaser og multimediasystemer: 428"
                },
                {
                  id: "429",
                  label: "Simulering, visualisering, signalbehandling, bildeanalyse: 429"
                }
              ]
            },
            {
              id: "430",
              label: "Fysikk: 430",
              children: [
                {
                  id: "431",
                  label: "Kjerne- og elementærpartikkelfysikk: 431"
                },
                {
                  id: "433",
                  label: "Atomfysikk, molekylfysikk: 433"
                },
                {
                  id: "434",
                  label: "Elektromagnetisme, akustikk, optikk: 434"
                },
                {
                  id: "435",
                  label: "Elektronikk: 435"
                },
                {
                  id: "436",
                  label: "Kondenserte fasers fysikk: 436"
                },
                {
                  id: "437",
                  label: "Rom- og plasmafysikk: 437"
                },
                {
                  id: "438",
                  label: "Astrofysikk, astronomi: 438"
                }
              ]
            },
            {
              id: "440",
              label: "Kjemi: 440",
              children: [
                {
                  id: "441",
                  label: "Organisk kjemi: 441"
                },
                {
                  id: "442",
                  label: "Uorganisk kjemi: 442"
                },
                {
                  id: "443",
                  label: "Fysikalsk kjemi: 443"
                },
                {
                  id: "444",
                  label: "Teoretisk kjemi, kvantekjemi: 444"
                },
                {
                  id: "445",
                  label: "Analytisk kjemi: 445"
                },
                {
                  id: "446",
                  label: "Miljøkjemi, naturmiljøkjemi: 446"
                },
                {
                  id: "447",
                  label: "Kjernekjemi: 447"
                },
                {
                  id: "448",
                  label: "Legemiddelkjemi: 448"
                }
              ]
            },
            {
              id: "450",
              label: "Geofag: 450",
              children: [
                {
                  id: "451",
                  label: "Faste jords fysikk: 451"
                },
                {
                  id: "452",
                  label: "Oseanografi: 452"
                },
                {
                  id: "453",
                  label: "Meteorologi: 453"
                },
                {
                  id: "454",
                  label: "Hydrologi: 454"
                },
                {
                  id: "455",
                  label: "Naturgeografi: 455"
                },
                {
                  id: "456",
                  label: "Sedimentologi: 456"
                },
                {
                  id: "461",
                  label: "Stratigrafi og paleontologi: 461"
                },
                {
                  id: "462",
                  label: "Mineralogi, petrologi, geokjemi: 462"
                },
                {
                  id: "463",
                  label: "Tektonikk: 463"
                },
                {
                  id: "464",
                  label: "Petroleumsgeologi og -geofysikk: 464"
                },
                {
                  id: "465",
                  label: "Kvartærgeologi, glasiologi: 465"
                },
                {
                  id: "466",
                  label: "Marin geologi: 466"
                },
                {
                  id: "467",
                  label: "Hydrogeologi: 467"
                },
                {
                  id: "468",
                  label: "Geometrikk: 468"
                },
                {
                  id: "469",
                  label: "Andre geofag: 469"
                }
              ]
            },
            {
              id: "470",
              label: "Basale biofag: 470",
              children: [
                {
                  id: "471",
                  label: "Cellebiologi: 471"
                },
                {
                  id: "472",
                  label: "Generell mikrobiologi: 472"
                },
                {
                  id: "473",
                  label: "Molekylærbiologi: 473"
                },
                {
                  id: "474",
                  label: "Genetikk og genomikk: 474"
                },
                {
                  id: "475",
                  label: "Bioinformatikk: 475"
                },
                {
                  id: "476",
                  label: "Biokjemi: 476"
                },
                {
                  id: "477",
                  label: "Biofysikk: 477"
                },
                {
                  id: "478",
                  label: "Generell immunologi: 478"
                }
              ]
            },
            {
              id: "480",
              label: "Zoologiske og botaniske fag: 480",
              children: [
                {
                  id: "481",
                  label: "Zoologisk anatomi: 481"
                },
                {
                  id: "482",
                  label: "Embryologi: 482"
                },
                {
                  id: "483",
                  label: "Zoofysiologi og komparativ fysiologi: 483"
                },
                {
                  id: "484",
                  label: "Parasittologi: 484"
                },
                {
                  id: "485",
                  label: "Etologi: 485"
                },
                {
                  id: "486",
                  label: "Zoogeografi: 486"
                },
                {
                  id: "487",
                  label: "Systematisk zoologi: 487"
                },
                {
                  id: "488",
                  label: "Økologi: 488"
                },
                {
                  id: "489",
                  label: "Økotoksikologi: 489"
                },
                {
                  id: "491",
                  label: "Planteanatomi: 491"
                },
                {
                  id: "492",
                  label: "Plantefysiologi: 492"
                },
                {
                  id: "493",
                  label: "Systematisk botanikk: 493"
                },
                {
                  id: "495",
                  label: "Vegetasjonshistorie: 495"
                },
                {
                  id: "496",
                  label: "Plantegeografi: 496"
                },
                {
                  id: "497",
                  label: "Marinbiologi: 497"
                },
                {
                  id: "498",
                  label: "Limnologi: 498"
                }
              ]
            }
          ]
        },
        {
          id: "500",
          label: "Teknologi: 500",
          children: [
            {
              id: "510",
              label: "Berg‑ og petroleumsfag: 510",
              children: [
                {
                  id: "511",
                  label: "Bergteknologi: 511"
                },
                {
                  id: "512",
                  label: "Petroleumsteknologi: 512"
                },
                {
                  id: "513",
                  label: "Geoteknikk: 513"
                },
                {
                  id: "519",
                  label: "Andre berg‑ og petroleumsfagg: 519"
                }
              ]
            },
            {
              id: "520",
              label: "Materialteknologi: 520",
              children: [
                {
                  id: "521",
                  label: "Metallurgi: 521"
                },
                {
                  id: "522",
                  label: "Funksjonelle materialer: 522"
                },
                {
                  id: "523",
                  label: "Plast- og  komposittmaterialer: 523"
                },
                {
                  id: "525",
                  label: "Bygningsmaterialer: 525"
                },
                {
                  id: "529",
                  label: "Annen materialteknologi: 529"
                }
              ]
            },
            {
              id: "530",
              label: "Bygningsfag: 530",
              children: [
                {
                  id: "531",
                  label: "Arkitektur og bygningsteknologi: 531"
                },
                {
                  id: "532",
                  label: "Bygg-, anleggs-  og transportteknologi: 532"
                },
                {
                  id: "533",
                  label: "Konstruksjonsteknologi: 533"
                },
                {
                  id: "534",
                  label: "Kart og oppmåling: 534"
                },
                {
                  id: "535",
                  label: "Fysisk planlegging: 535"
                },
                {
                  id: "537",
                  label: "Geoteknologi: 537"
                },
                {
                  id: "538",
                  label: "Hydroteknologi: 538"
                }
              ]
            },
            {
              id: "540",
              label: "Elektrotekniske fag: 540",
              children: [
                {
                  id: "541",
                  label: "Elektronikk: 541"
                },
                {
                  id: "542",
                  label: "Elkraft: 542"
                },
                {
                  id: "549",
                  label: "Andre elektrotekniske fag: 549"
                }
              ]
            },
            {
              id: "550",
              label: "Informasjons- og kommunikasjonsteknologi: 550",
              children: [
                {
                  id: "551",
                  label: "Datateknologi: 551"
                },
                {
                  id: "552",
                  label: "Telekommunikasjon: 552"
                },
                {
                  id: "553",
                  label: "Teknisk kybernetikk: 553"
                },
                {
                  id: "555",
                  label: "Geografiske informasjonssystemer: 555"
                },
                {
                  id: "559",
                  label: "Annen informasjonsteknologi: 559"
                }
              ]
            },
            {
              id: "560",
              label: "Kjemisk teknologi: 560",
              children: [
                {
                  id: "561",
                  label: "Elektrokjemi: 561"
                },
                {
                  id: "562",
                  label: "Kjemisk prosessteknologi: 562"
                },
                {
                  id: "563",
                  label: "Kjemiteknikk: 563"
                },
                {
                  id: "568",
                  label: "Farmasøytisk formulering og teknologi: 568"
                },
                {
                  id: "569",
                  label: "Annen kjemisk teknologi: 569"
                }
              ]
            },
            {
              id: "570",
              label: "Maskinfag: 570",
              children: [
                {
                  id: "571",
                  label: "Maskinkonstruksjon og materialteknologi: 571"
                },
                {
                  id: "572",
                  label: "Produksjon og driftsteknologi: 572"
                },
                {
                  id: "573",
                  label: "Maskinteknisk energi- og miljøteknologi: 573"
                },
                {
                  id: "574",
                  label: "Mekaniske og strømningstekniske fag: 574"
                },
                {
                  id: "579",
                  label: "Andre maskinfag: 579"
                }
              ]
            },
            {
              id: "580",
              label: "Marin teknologi: 580",
              children: [
                {
                  id: "581",
                  label: "Offshoreteknologi: 581"
                },
                {
                  id: "582",
                  label: "Skipsteknologi: 582"
                },
                {
                  id: "589",
                  label: "Annen marin teknologi: 589"
                }
              ]
            },
            {
              id: "590",
              label: "Bioteknologi: 590"
            },
            {
              id: "600",
              label: "Næringsmiddelteknologi: 600"
            },
            {
              id: "610",
              label: "Miljøteknologi: 610"
            },
            {
              id: "620",
              label: "Medisinsk teknologi: 620"
            },
            {
              id: "630",
              label: "Nanoteknologi: 630"
            },
            {
              id: "640",
              label: "Industri- og produktdesign: 640"
            }
          ]
        },
        {
          id: "700",
          label: "Medisinske Fag: 700",
          children: [
            {
              id: "710",
              label: "Basale medisinske, odontologiske og veterinærmedisinske fag: 710",
              children: [
                {
                  id: "711",
                  label: "Medisinsk molekylærbiologi: 711"
                },
                {
                  id: "714",
                  label: "Medisinsk genetikk: 714"
                },
                {
                  id: "715",
                  label: "Medisinsk mikrobiologi: 715"
                },
                {
                  id: "716",
                  label: "Medisinsk immunologi: 716"
                },
                {
                  id: "717",
                  label: "Anatomi, fysisk antropologi: 717"
                },
                {
                  id: "718",
                  label: "Human og veterinærmedisinsk fysiologi: 718"
                },
                {
                  id: "719",
                  label: "Generell patologi, patologisk anatomi: 719"
                },
                {
                  id: "720",
                  label: "Rettsmedisin, rettsodontologi: 720"
                },
                {
                  id: "721",
                  label: "Patofysiologi: 721"
                },
                {
                  id: "725",
                  label: "Klinisk kjemi: 725"
                },
                {
                  id: "726",
                  label: "Medisinsk biokjemi: 726"
                },
                {
                  id: "728",
                  label: "Farmakologi: 728"
                },
                {
                  id: "730",
                  label: "Toksikologi: 730"
                },
                {
                  id: "736",
                  label: "Biofarmasi: 736"
                },
                {
                  id: "738",
                  label: "Farmakognosi: 738"
                },
                {
                  id: "739",
                  label: "Klinisk farmakologi: 739"
                }
              ]
            },
            {
              id: "750",
              label: "Klinisk medisinske fag: 750",
              children: [
                {
                  id: "751",
                  label: "Allmennmedisin: 751"
                },
                {
                  id: "752",
                  label: "Nevrologi: 752"
                },
                {
                  id: "753",
                  label: "Dermatologi og venerologi: 753"
                },
                {
                  id: "754",
                  label: "Oftalmologi: 754"
                },
                {
                  id: "755",
                  label: "Otorhinolaryngologi: 755"
                },
                {
                  id: "756",
                  label: "Gynekologi og obstetrikk: 756"
                },
                {
                  id: "757",
                  label: "Psykiatri, barnepsykiatri: 757"
                },
                {
                  id: "758",
                  label: "Rettspsykiatri: 758"
                },
                {
                  id: "759",
                  label: "Reumatologi: 759"
                },
                {
                  id: "760",
                  label: "Pediatri: 760"
                },
                {
                  id: "761",
                  label: "Tropemedisin: 761"
                },
                {
                  id: "762",
                  label: "Onkologi: 762"
                },
                {
                  id: "763",
                  label: "Radiologi og bildediagnostikk: 763"
                },
                {
                  id: "764",
                  label: "Fysikalsk medisin og rehabilitering: 764"
                },
                {
                  id: "765",
                  label: "Anestesiologi: 765"
                },
                {
                  id: "770",
                  label: "Generell indremedisin: 770"
                },
                {
                  id: "771",
                  label: "Kardiologi: 771"
                },
                {
                  id: "772",
                  label: "Nefrologi, urologi: 772"
                },
                {
                  id: "773",
                  label: "Gasteroenterologi: 773"
                },
                {
                  id: "774",
                  label: "Endokrinologi: 774"
                },
                {
                  id: "775",
                  label: "Hematologi: 775"
                },
                {
                  id: "776",
                  label: "Infeksjonsmedisin: 776"
                },
                {
                  id: "777",
                  label: "Lungesykdommer: 777"
                },
                {
                  id: "778",
                  label: "Geriatri: 778"
                },
                {
                  id: "780",
                  label: "Generell kirurgi: 780"
                },
                {
                  id: "781",
                  label: "Gasteroenterologisk kirurgi: 781"
                },
                {
                  id: "782",
                  label: "Kar- og thoraxkirurgi: 782"
                },
                {
                  id: "783",
                  label: "Traumatologi: 783"
                },
                {
                  id: "784",
                  label: "Ortopedisk kirurgi: 784"
                },
                {
                  id: "785",
                  label: "Plastisk kirurgi: 785"
                },
                {
                  id: "786",
                  label: "Nevrokirurgi: 786"
                },
                {
                  id: "787",
                  label: "Kjevekirurgi: 787"
                },
                {
                  id: "788",
                  label: "Endokrin kirurgi: 788"
                },
                {
                  id: "799",
                  label: "Andre klinisk medisinske fag: 799"
                }
              ]
            },
            {
              id: "800",
              label: "Helsefag: 800",
              children: [
                {
                  id: "801",
                  label: "Samfunnsmedisin, sosialmedisin: 801"
                },
                {
                  id: "802",
                  label: "Samfunnsodontologi: 802"
                },
                {
                  id: "803",
                  label: "Epidemiologi medisinsk og odontologisk statistikk: 803"
                },
                {
                  id: "804",
                  label: "Forebyggende medisin: 804"
                },
                {
                  id: "805",
                  label: "Medisinsk/odontologisk etikk, atferdsfag, historie: 805"
                },
                {
                  id: "806",
                  label: "Helsetjeneste- og helseadministrasjonsforskning: 806"
                },
                {
                  id: "807",
                  label: "Fysioterapi: 807"
                },
                {
                  id: "808",
                  label: "Sykepleievitenskap: 808"
                },
                {
                  id: "809",
                  label: "Yrkesmedisin: 809"
                },
                {
                  id: "810",
                  label: "Bedriftsmedisin: 810"
                },
                {
                  id: "811",
                  label: "Ernæring: 811"
                },
                {
                  id: "812",
                  label: "Samfunnsfarmasi: 812"
                },
                {
                  id: "813",
                  label: "Næringsmiddelhygiene: 813"
                },
                {
                  id: "829",
                  label: "Andre helsefag: 829"
                }
              ]
            },
            {
              id: "830",
              label: "Klinisk odontologiske fag: 830",
              children: [
                {
                  id: "831",
                  label: "Konserverende tannpleie: 831"
                },
                {
                  id: "832",
                  label: "Protetikk og bitt funksjon: 832"
                },
                {
                  id: "833",
                  label: "Kjeveortopedi: 833"
                },
                {
                  id: "834",
                  label: "Barnetannpleie og kariesprofylakse: 834"
                },
                {
                  id: "835",
                  label: "Oral kirurgi: 835"
                },
                {
                  id: "835",
                  label: "Oral medisin: 835"
                },
                {
                  id: "836",
                  label: "Oral radiologi: 836"
                },
                {
                  id: "837",
                  label: "Periodonti: 837"
                },
                {
                  id: "849",
                  label: "Andre kliniske odontologiske fag: 849"
                }
              ]
            },
            {
              id: "850",
              label: "Idrettsmedisinske fag: 850",
              children: [
                {
                  id: "851",
                  label: "Treningslære: 851"
                },
                {
                  id: "852",
                  label: "Bevegelseslære: 852"
                },
                {
                  id: "853",
                  label: "Doping/idrettsfarmakologi: 853"
                }
              ]
            }
          ]
        },
        {
          id: "900",
          label: "Landbruks- og Fiskerifag: 900",
          children: [
            {
              id: "910",
              label: "Landbruksfag: 910",
              children: [
                {
                  id: "911",
                  label: "Planteforedling, hagebruk, plantevern, plantepatologi: 911"
                },
                {
                  id: "912",
                  label: "Husdyravl, oppdrett, forplantning: 912"
                },
                {
                  id: "913",
                  label: "Jordfag: 913"
                },
                {
                  id: "914",
                  label: "Naturressursforvaltning: 914"
                },
                {
                  id: "915",
                  label: "Skogbruk: 915"
                },
                {
                  id: "916",
                  label: "Landbruksteknologi: 916"
                },
                {
                  id: "918",
                  label: "Fôring: 918"
                },
                {
                  id: "919",
                  label: "Andre landbruksfag: 919"
                }
              ]
            },
            {
              id: "920",
              label: "Fiskerifag: 920",
              children: [
                {
                  id: "921",
                  label: "Ressursbiologi: 921"
                },
                {
                  id: "922",
                  label: "Akvakultur: 922"
                },
                {
                  id: "923",
                  label: "Fiskehelse: 923"
                },
                {
                  id: "924",
                  label: "Fiskeriteknologi: 924"
                },
                {
                  id: "925",
                  label: "Fangst: 925"
                },
                {
                  id: "929",
                  label: "Andre fiskerifag: 929"
                }
              ]
            },
            {
              id: "950",
              label: "Klinisk veterinærmedisinske fag: 950",
              children: [
                {
                  id: "951",
                  label: "Reproduksjon: 951"
                },
                {
                  id: "952",
                  label: "Obstetrikk: 952"
                },
                {
                  id: "953",
                  label: "Kirurgi: 953"
                },
                {
                  id: "954",
                  label: "Indremedisin: 954"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    name: "oecd",
    source: "oecd.xml",
    root: {
      id: "oecd",
      label: "oecd",
      children: [
        {
          id: "1.00.00",
          label: "Natural sciences",
          children: [
            {
              id: "1.01.00",
              label: "Mathematics",
              children: [
                {
                  id: "1.01.01",
                  label: "Pure mathematics"
                },
                {
                  id: "1.01.02",
                  label: "Applied mathematics"
                },
                {
                  id: "1.01.03",
                  label: "Statistics and probability"
                }
              ]
            },
            {
              id: "1.02.00",
              label: "Computer and information sciences",
              children: [
                {
                  id: "1.02.01",
                  label: "Computer sciences"
                },
                {
                  id: "1.02.02",
                  label: "Information science"
                },
                {
                  id: "1.02.03",
                  label: "Bioinformatics"
                }
              ]
            },
            {
              id: "1.03.00",
              label: "Physical sciences",
              children: [
                {
                  id: "1.03.01",
                  label: "Atomic, molecular and chemical physics"
                },
                {
                  id: "1.03.02",
                  label: "Condensed matter physics"
                },
                {
                  id: "1.03.03",
                  label: "Particles and fields physics"
                },
                {
                  id: "1.03.04",
                  label: "Nuclear physics"
                },
                {
                  id: "1.03.05",
                  label: "Fluids and plasma physics"
                },
                {
                  id: "1.03.06",
                  label: "Optics"
                },
                {
                  id: "1.03.07",
                  label: "Acoustics"
                },
                {
                  id: "1.03.08",
                  label: "Astronomy"
                }
              ]
            },
            {
              id: "1.04.00",
              label: "Chemical sciences",
              children: [
                {
                  id: "1.04.01",
                  label: "Organic chemistry"
                },
                {
                  id: "1.04.02",
                  label: "Inorganic and nuclear chemistry"
                },
                {
                  id: "1.04.03",
                  label: "Physical chemistry"
                },
                {
                  id: "1.04.04",
                  label: "Polymer science"
                },
                {
                  id: "1.04.05",
                  label: "Electrochemistry"
                },
                {
                  id: "1.04.06",
                  label: "Colloid chemistry"
                },
                {
                  id: "1.04.07",
                  label: "Analytical chemistry"
                }
              ]
            },
            {
              id: "1.05.00",
              label: "Earth and related Environmental sciences",
              children: [
                {
                  id: "1.05.01",
                  label: "Geosciences, multidisciplinary"
                },
                {
                  id: "1.05.02",
                  label: "Mineralogy"
                },
                {
                  id: "1.05.03",
                  label: "Palaeontology"
                },
                {
                  id: "1.05.04",
                  label: "Geochemistry and geophysics"
                },
                {
                  id: "1.05.05",
                  label: "Physical geography"
                },
                {
                  id: "1.05.06",
                  label: "Geology"
                },
                {
                  id: "1.05.07",
                  label: "Volcanology"
                },
                {
                  id: "1.05.08",
                  label: "Environmental sciences"
                },
                {
                  id: "1.05.09",
                  label: "Meteorology and atmospheric sciences"
                },
                {
                  id: "1.05.10",
                  label: "climatic research"
                },
                {
                  id: "1.05.11",
                  label: "Oceanography, Hydrology, Water resources"
                }
              ]
            },
            {
              id: "1.06.00",
              label: "Biological sciences",
              children: [
                {
                  id: "1.06.01",
                  label: "Cell biology, Microbiology"
                },
                {
                  id: "1.06.02",
                  label: "Virology"
                },
                {
                  id: "1.06.03",
                  label: "Biochemistry and molecular biology"
                },
                {
                  id: "1.06.04",
                  label: "Biochemical research methods"
                },
                {
                  id: "1.06.05",
                  label: "Mycology"
                },
                {
                  id: "1.06.06",
                  label: "Biophysics"
                },
                {
                  id: "1.06.07",
                  label: "Genetics and heredity"
                },
                {
                  id: "1.06.08",
                  label: "Reproductive biology"
                },
                {
                  id: "1.06.09",
                  label: "Developmental biology"
                },
                {
                  id: "1.06.10",
                  label: "Plant sciences, botany"
                },
                {
                  id: "1.06.11",
                  label: "Zoology, Ornithology, Entomology, Behavioural sciences biology"
                },
                {
                  id: "1.06.12",
                  label: "Marine biology, freshwater biology, limnology"
                },
                {
                  id: "1.06.13",
                  label: "Ecology"
                },
                {
                  id: "1.06.14",
                  label: "Biodiversity conservation"
                },
                {
                  id: "1.06.15",
                  label: "Biology (theoretical, mathematical, thermal, cryobiology, biological rhythm), Evolutionary biology"
                },
                {
                  id: "1.06.16",
                  label: "Other biological topics"
                }
              ]
            },
            {
              id: "1.07.00",
              label: "Other natural sciences"
            }
          ]
        },
        {
          id: "2.00.00",
          label: "Engineering and technology",
          children: [
            {
              id: "2.01.00",
              label: "Civil engineering",
              children: [
                {
                  id: "2.01.01",
                  label: "Civil engineering"
                },
                {
                  id: "2.01.02",
                  label: "Architecture engineering"
                },
                {
                  id: "2.01.03",
                  label: "Construction engineering"
                },
                {
                  id: "2.01.04",
                  label: "Municipal and structural engineering"
                },
                {
                  id: "2.01.05",
                  label: "Transport engineering"
                }
              ]
            },
            {
              id: "2.02.00",
              label: "Electrical engineering, Electronic engineering, Information engineering",
              children: [
                {
                  id: "2.02.01",
                  label: "Electrical and electronic engineering"
                },
                {
                  id: "2.02.02",
                  label: "Robotics and automatic control"
                },
                {
                  id: "2.02.03",
                  label: "Automation and control systems"
                },
                {
                  id: "2.02.04",
                  label: "Communication engineering and systems"
                },
                {
                  id: "2.02.05",
                  label: "Telecommunications"
                },
                {
                  id: "2.02.06",
                  label: "Computer hardware and architecture"
                }
              ]
            },
            {
              id: "2.03.00",
              label: "Mechanical engineering",
              children: [
                {
                  id: "2.03.01",
                  label: "Mechanical engineering"
                },
                {
                  id: "2.03.02",
                  label: "Applied mechanics"
                },
                {
                  id: "2.03.03",
                  label: "Thermodynamics"
                },
                {
                  id: "2.03.04",
                  label: "Aerospace engineering"
                },
                {
                  id: "2.03.05",
                  label: "Nuclear related engineering"
                },
                {
                  id: "2.03.06",
                  label: "Audio engineering, reliability analysis"
                }
              ]
            },
            {
              id: "2.04.00",
              label: "Chemical engineering",
              children: [
                {
                  id: "2.04.01",
                  label: "Chemical engineering (plants, products)"
                },
                {
                  id: "2.04.02",
                  label: "Chemical process engineering"
                }
              ]
            },
            {
              id: "2.05.00",
              label: "Materials engineering",
              children: [
                {
                  id: "2.05.01",
                  label: "Materials engineering"
                },
                {
                  id: "2.05.02",
                  label: "Ceramics"
                },
                {
                  id: "2.05.03",
                  label: "Coating and films"
                },
                {
                  id: "2.05.04",
                  label: "Composites (including laminates, reinforced plastics, cermets, combined natural and synthetic fibre fabrics filled composites)"
                },
                {
                  id: "2.05.05",
                  label: "Paper and wood"
                },
                {
                  id: "2.05.06",
                  label: "Textiles"
                },
                {
                  id: "2.05.07",
                  label: "Including synthetic dyes, colours, fibres"
                }
              ]
            },
            {
              id: "2.06.00",
              label: "Medical engineering",
              children: [
                {
                  id: "2.06.01",
                  label: "Medical engineering"
                },
                {
                  id: "2.06.02",
                  label: "Medical laboratory technology (including laboratory samples analysis diagnostic technologies)"
                }
              ]
            },
            {
              id: "2.07.00",
              label: "Environmental engineering",
              children: [
                {
                  id: "2.07.01",
                  label: "Environmental and geological engineering"
                },
                {
                  id: "2.07.02",
                  label: "Geotechnics"
                },
                {
                  id: "2.07.03",
                  label: "Petroleum engineering, (fuel, oils), Energy and fuels"
                },
                {
                  id: "2.07.04",
                  label: "Remote sensing"
                },
                {
                  id: "2.07.05",
                  label: "Mining and mineral processing"
                },
                {
                  id: "2.07.06",
                  label: "Marine engineering, sea vessels"
                },
                {
                  id: "2.07.07",
                  label: "Ocean engineering"
                }
              ]
            },
            {
              id: "2.08.00",
              label: "Environmental biotechnology",
              children: [
                {
                  id: "2.08.01",
                  label: "Environmental biotechnology"
                },
                {
                  id: "2.08.02",
                  label: "Bioremediation, diagnostic biotechnologies (DNA chips and biosensing devices) in environmental management"
                },
                {
                  id: "2.08.03",
                  label: "Environmental biotechnology related ethics"
                }
              ]
            },
            {
              id: "2.09.00",
              label: "Industrial biotechnology",
              children: [
                {
                  id: "2.09.01",
                  label: "Industrial biotechnology"
                },
                {
                  id: "2.09.02",
                  label: "Bioprocessing technologies (industrial processes relying on biological agents to drive the process) biocatalysis, fermentation"
                },
                {
                  id: "2.09.03",
                  label: "bioproducts (products that are manufactured using biological material as feedstock) biomaterials, bioplastics, biofuels, bioderived bulk and fine chemicals, bio-derived novel materials"
                }
              ]
            },
            {
              id: "2.10.00",
              label: "Nano-technology",
              children: [
                {
                  id: "2.10.01",
                  label: "Nano-materials [production and properties]"
                },
                {
                  id: "2.10.02",
                  label: "Nano-processes [applications on nano-scale]"
                }
              ]
            },
            {
              id: "2.11.00",
              label: "Other engineering and technologies",
              children: [
                {
                  id: "2.11.01",
                  label: "Food and beverages"
                },
                {
                  id: "2.11.02",
                  label: "Other engineering and technologies"
                }
              ]
            }
          ]
        },
        {
          id: "3.00.00",
          label: "Medical and Health sciences",
          children: [
            {
              id: "3.01.00",
              label: "Basic medicine",
              children: [
                {
                  id: "3.01.01",
                  label: "Anatomy and morphology"
                },
                {
                  id: "3.01.02",
                  label: "Human genetics"
                },
                {
                  id: "3.01.03",
                  label: "Immunology"
                },
                {
                  id: "3.01.04",
                  label: "Neurosciences (including psychophysiology)"
                },
                {
                  id: "3.01.05",
                  label: "Pharmacology and pharmacy"
                },
                {
                  id: "3.01.06",
                  label: "Medicinal chemistry"
                },
                {
                  id: "3.01.07",
                  label: "Toxicology"
                },
                {
                  id: "3.01.08",
                  label: "Physiology (including cytology)"
                },
                {
                  id: "3.01.09",
                  label: "Pathology"
                }
              ]
            },
            {
              id: "3.02.00",
              label: "Clinical medicine",
              children: [
                {
                  id: "3.02.01",
                  label: "Andrology"
                },
                {
                  id: "3.02.02",
                  label: "Obstetrics and gynaecology"
                },
                {
                  id: "3.02.03",
                  label: "Paediatrics"
                },
                {
                  id: "3.02.04",
                  label: "Cardiac and Cardiovascular systems"
                },
                {
                  id: "3.02.05",
                  label: "Peripheral vascular disease"
                },
                {
                  id: "3.02.06",
                  label: "Hematology"
                },
                {
                  id: "3.02.07",
                  label: "Respiratory systems"
                },
                {
                  id: "3.02.08",
                  label: "Critical care medicine and Emergency medicine"
                },
                {
                  id: "3.02.09",
                  label: "Anaesthesiology"
                },
                {
                  id: "3.02.10",
                  label: "Orthopaedics"
                },
                {
                  id: "3.02.11",
                  label: "Surgery"
                },
                {
                  id: "3.02.12",
                  label: "Radiology, nuclear medicine and medical imaging"
                },
                {
                  id: "3.02.13",
                  label: "Transplantation"
                },
                {
                  id: "3.02.14",
                  label: "Dentistry, oral surgery and medicine"
                },
                {
                  id: "3.02.15",
                  label: "Dermatology and venereal diseases"
                },
                {
                  id: "3.02.16",
                  label: "Allergy"
                },
                {
                  id: "3.02.17",
                  label: "Rheumatology"
                },
                {
                  id: "3.02.18",
                  label: "Endocrinology and metabolism (including diabetes, hormones)"
                },
                {
                  id: "3.02.19",
                  label: "Gastroenterology and hepatology"
                },
                {
                  id: "3.02.20",
                  label: "Urology and nephrology"
                },
                {
                  id: "3.02.21",
                  label: "Oncology"
                },
                {
                  id: "3.02.22",
                  label: "Ophthalmology"
                },
                {
                  id: "3.02.23",
                  label: "Otorhinolaryngology"
                },
                {
                  id: "3.02.24",
                  label: "Psychiatry"
                },
                {
                  id: "3.02.25",
                  label: "Clinical neurology"
                },
                {
                  id: "3.02.26",
                  label: "Geriatrics and gerontology"
                },
                {
                  id: "3.02.27",
                  label: "General and internal medicine"
                },
                {
                  id: "3.02.28",
                  label: "Other clinical medicine subjects"
                },
                {
                  id: "3.02.29",
                  label: "Integrative and complementary medicine (alternative practice systems)"
                }
              ]
            },
            {
              id: "3.03.00",
              label: "Health sciences",
              children: [
                {
                  id: "3.03.01",
                  label: "Health care sciences and services (including hospital administration, health care financing)"
                },
                {
                  id: "3.03.02",
                  label: "Health policy and services"
                },
                {
                  id: "3.03.03",
                  label: "Nursing"
                },
                {
                  id: "3.03.04",
                  label: "Nutrition, Dietetics"
                },
                {
                  id: "3.03.05",
                  label: "Public and environmental health"
                },
                {
                  id: "3.03.06",
                  label: "Tropical medicine"
                },
                {
                  id: "3.03.07",
                  label: "Parasitology"
                },
                {
                  id: "3.03.08",
                  label: "Infectious diseases"
                },
                {
                  id: "3.03.09",
                  label: "Epidemiology"
                },
                {
                  id: "3.03.10",
                  label: "Occupational health"
                },
                {
                  id: "3.03.11",
                  label: "Sport and fitness sciences"
                },
                {
                  id: "3.03.12",
                  label: "Social biomedical sciences (includes family planning, sexual health, psycho-oncology, political and social effects of biomedical research)"
                },
                {
                  id: "3.03.13",
                  label: "Medical ethics"
                },
                {
                  id: "3.03.14",
                  label: "Substance abuse"
                }
              ]
            },
            {
              id: "3.04.00",
              label: "Medical biotechnology",
              children: [
                {
                  id: "3.04.01",
                  label: "Health-related biotechnology"
                },
                {
                  id: "3.04.02",
                  label: "Technologies involving the manipulation of cells, tissues, organs or the whole organism (assisted reproduction)"
                },
                {
                  id: "3.04.03",
                  label: "Technologies involving identifying the functioning of DNA, proteins and enzymes and how they influence the onset of disease and maintenance of well-being (gene-based diagnostics and therapeutic interventions (pharmacogenomics, gene-based therapeutics)"
                },
                {
                  id: "3.04.04",
                  label: "Biomaterials (as related to medical implants, devices, sensors)"
                },
                {
                  id: "3.04.05",
                  label: "Medical biotechnology related ethics"
                }
              ]
            },
            {
              id: "3.05.00",
              label: "Other medical sciences",
              children: [
                {
                  id: "3.05.01",
                  label: "Forensic science"
                },
                {
                  id: "3.05.02",
                  label: "Other medical sciences"
                }
              ]
            }
          ]
        },
        {
          id: "4.00.00",
          label: "Agricultural sciences",
          children: [
            {
              id: "4.01.00",
              label: "Agriculture, Forestry, and Fisheries",
              children: [
                {
                  id: "4.01.01",
                  label: "Agriculture"
                },
                {
                  id: "4.01.02",
                  label: "Forestry"
                },
                {
                  id: "4.01.03",
                  label: "Fishery"
                },
                {
                  id: "4.01.04",
                  label: "Soil science"
                },
                {
                  id: "4.01.05",
                  label: "Horticulture, viticulture"
                },
                {
                  id: "4.01.06",
                  label: "Agronomy"
                },
                {
                  id: "4.01.07",
                  label: "plant breeding and plant protection"
                }
              ]
            },
            {
              id: "4.02.00",
              label: "Animal and Dairy science",
              children: [
                {
                  id: "4.02.01",
                  label: "Animal and Dairy science"
                },
                {
                  id: "4.02.02",
                  label: "Husbandry"
                },
                {
                  id: "4.02.03",
                  label: "Pets"
                }
              ]
            },
            {
              id: "4.03.00",
              label: "Veterinary science",
              children: [
                {
                  id: "4.03.01",
                  label: "Veterinary science"
                }
              ]
            },
            {
              id: "4.04.00",
              label: "Agricultural biotechnology",
              children: [
                {
                  id: "4.04.01",
                  label: "Agricultural biotechnology and food biotechnology"
                },
                {
                  id: "4.04.02",
                  label: "GM technology (crops and livestock), livestock cloning, marker assisted selection, diagnostics (DNA chips and biosensing devices for the early/accurate detection of diseases) biomass feedstock production technologies, biopharming"
                },
                {
                  id: "4.04.03",
                  label: "Agricultural biotechnology related ethics"
                }
              ]
            },
            {
              id: "4.05.00",
              label: "Other agricultural sciences"
            }
          ]
        },
        {
          id: "5.00.00",
          label: "Social sciences",
          children: [
            {
              id: "5.01.00",
              label: "Psychology",
              children: [
                {
                  id: "5.01.01",
                  label: "Psychology (including human - machine relations)"
                },
                {
                  id: "5.01.02",
                  label: "Psychology, special (including therapy for learning, speech, hearing, visual and other physical and mental disabilities)"
                }
              ]
            },
            {
              id: "5.02.00",
              label: "Economics and Business",
              children: [
                {
                  id: "5.02.01",
                  label: "Economics"
                },
                {
                  id: "5.02.02",
                  label: "Econometrics"
                },
                {
                  id: "5.02.03",
                  label: "Industrial relations"
                },
                {
                  id: "5.02.04",
                  label: "Business and Management"
                }
              ]
            },
            {
              id: "5.03.00",
              label: "Educational sciences",
              children: [
                {
                  id: "5.03.01",
                  label: "Education, general (including training, pedagogy, didactics)"
                },
                {
                  id: "5.03.02",
                  label: "Education, special (to gifted persons, those with learning disabilities)"
                }
              ]
            },
            {
              id: "5.04.00",
              label: "Sociology",
              children: [
                {
                  id: "5.04.01",
                  label: "Sociology"
                },
                {
                  id: "5.04.02",
                  label: "Demography"
                },
                {
                  id: "5.04.03",
                  label: "Anthropology"
                },
                {
                  id: "5.04.04",
                  label: "Ethnology"
                },
                {
                  id: "5.04.05",
                  label: "Social topics (Womenís and gender studies; Social issues; Family studies, Social work)"
                }
              ]
            },
            {
              id: "5.05.00",
              label: "Law",
              children: [
                {
                  id: "5.05.01",
                  label: "Law"
                },
                {
                  id: "5.05.02",
                  label: "Penology"
                },
                {
                  id: "5.05.03",
                  label: "Criminology"
                }
              ]
            },
            {
              id: "5.06.00",
              label: "Political science",
              children: [
                {
                  id: "5.06.01",
                  label: "Political science"
                },
                {
                  id: "5.06.02",
                  label: "Public administration;"
                },
                {
                  id: "5.06.03",
                  label: "Organisation theory"
                }
              ]
            },
            {
              id: "5.07.00",
              label: "Social and economic geography",
              children: [
                {
                  id: "5.07.01",
                  label: "Environmental sciences (social aspects)"
                },
                {
                  id: "5.07.02",
                  label: "Cultural and economic geography"
                },
                {
                  id: "5.07.03",
                  label: "Urban studies (Planning and development)"
                },
                {
                  id: "5.07.04",
                  label: "Transport planning and social aspects of transport"
                }
              ]
            },
            {
              id: "5.08.00",
              label: "Media and communications",
              children: [
                {
                  id: "5.08.01",
                  label: "Journalism"
                },
                {
                  id: "5.08.02",
                  label: "Information science (social aspects)"
                },
                {
                  id: "5.08.03",
                  label: "Library science"
                },
                {
                  id: "5.08.04",
                  label: "Media and socio-cultural communication"
                }
              ]
            },
            {
              id: "5.09.00",
              label: "Other social sciences",
              children: [
                {
                  id: "5.09.01",
                  label: "Social sciences, interdisciplinary"
                },
                {
                  id: "5.09.02",
                  label: "Other social sciences"
                }
              ]
            }
          ]
        },
        {
          id: "6.00.00",
          label: "Humanities",
          children: [
            {
              id: "6.01.00",
              label: "History and Archaeology",
              children: [
                {
                  id: "6.01.01",
                  label: "History"
                },
                {
                  id: "6.01.02",
                  label: "Archaeology"
                }
              ]
            },
            {
              id: "6.02.00",
              label: "Languages and Literature",
              children: [
                {
                  id: "6.02.01",
                  label: "General language studies"
                },
                {
                  id: "6.02.02",
                  label: "Specific languages"
                },
                {
                  id: "6.02.03",
                  label: "General literature studies"
                },
                {
                  id: "6.02.04",
                  label: "Literary theory"
                },
                {
                  id: "6.02.05",
                  label: "Specific literatures"
                },
                {
                  id: "6.02.06",
                  label: "Linguistics"
                }
              ]
            },
            {
              id: "6.03.00",
              label: "Philosophy, Ethics and Religion",
              children: [
                {
                  id: "6.03.01",
                  label: "Philosophy"
                },
                {
                  id: "6.03.02",
                  label: "History and philosophy of science and technology"
                },
                {
                  id: "6.03.04",
                  label: "Ethics (except ethics related to specific subfields)"
                },
                {
                  id: "6.03.05",
                  label: "Theology"
                },
                {
                  id: "6.03.06",
                  label: "Religious studies"
                }
              ]
            },
            {
              id: "6.04.00",
              label: "Arts (arts, history of arts, performing arts, music)",
              children: [
                {
                  id: "6.04.01",
                  label: "Arts"
                },
                {
                  id: "6.04.02",
                  label: "Art history"
                },
                {
                  id: "6.04.03",
                  label: "Architectural design"
                },
                {
                  id: "6.04.04",
                  label: "Performing arts studies (Musicology, Theater science, Dramaturgy)"
                },
                {
                  id: "6.04.05",
                  label: "Folklore studies"
                },
                {
                  id: "6.04.06",
                  label: "Studies on Film, Radio and Television"
                }
              ]
            },
            {
              id: "6.05.00",
              label: "Other humanities",
              children: [
                {
                  id: "6.05.01",
                  label: "Other humanities"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    name: "patent-coar-types",
    source: "patent-coar-types.xml",
    root: {
      id: "http://purl.org/coar/resource_type/scheme",
      label: "Resource Types",
      children: [
        {
          id: "c_15cd",
          label: "patent",
          note: "A set of exclusive rights granted by law to applicants for inventions that are new, non-obvious and commercially applicable. A patent is valid for a limited period (generally 20 years), during which time patent holders can commercially exploit their inventions on an exclusive basis. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]",
          children: [
            {
              id: "SB3Y-W4EH",
              label: "PCT application",
              note: "A patent application filed through the WIPO-administered Patent Cooperation Treaty (PCT), also known as an international application. [Source: Adapted from https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "C53B-JCY5",
              label: "design patent",
              note: "A patent granted to any person who has invented any new and non-obvious ornamental design for an article of manufacture. The design patent protects only the appearance of an article, but not its structural or functional features. [Source: Adapted from https://www.uspto.gov/patents/basics/types-patent-applications/design-patent-application-guide#def]"
            },
            {
              id: "Z907-YMBB",
              label: "plant patent",
              note: "A patent granted to anyone who has invented or discovered and asexually reproduced any distinct and new variety of plant, including cultivated sports, mutants, hybrids, and newly found seedlings, other than a tuber-propagated plant or a plant found in an uncultivated state. [Source: Adapted from https://www.uspto.gov/patents/basics/types-patent-applications/general-information-about-35-usc-161#heading-1]"
            },
            {
              id: "GPQ7-G5VE",
              label: "plant variety protection",
              note: "Plant variety protection, also called a \"plant breeder's right\" (PBR), is a form of intellectual property right granted to the breeder of a new plant variety . According to this right, certain acts concerning the exploitation of the protected variety require the prior authorization of the breeder. Plant variety protection is an independent sui generis form of protection, tailored to protect new plant varieties and has certain features in common with other intellectual property rights. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "MW8G-3CR8",
              label: "software patent",
              note: "In order to obtain a patent, a software invention must not fall under other non-patentable subject matter (for example, abstract ideas or mathematical theories) and has to fulfill the other substantive patentability criteria (for example, novelty, inventive step [non-obviousness] and industrial applicability [usefulness]). [Source: https://www.wipo.int/patents/en/faq_patents.html]"
            },
            {
              id: "9DKX-KSAF",
              label: "utility model",
              note: "A special form of patent right granted by a state or jurisdiction to an inventor or the inventor’s assignee for a fixed period of time. The terms and conditions for granting a utility model are slightly different from those for normal patents (including a shorter term of protection and less stringent patentability requirements). The term can also describe what are known in certain countries as “petty patents,” “short-term patents” or “innovation patents.” [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            }
          ]
        }
      ]
    }
  },
  {
    name: "product-coar-types",
    source: "product-coar-types.xml",
    root: {
      id: "http://purl.org/coar/resource_type/scheme",
      label: "Resource Types",
      children: [
        {
          id: "c_12cc",
          label: "cartographic material",
          note: "Any material representing the whole or part of the earth or any celestial body at any scale. Cartographic materials include two- and three-dimensional maps and plans (including maps of imaginary places); aeronautical, navigational, and celestial charts; atlases; globes; block diagrams; sections; aerial photographs with a cartographic purpose; bird's-eye views (map views), etc. [Source: http://www.loc.gov/marc/cfmap.html]",
          children: [
            {
              id: "c_12cd",
              label: "map",
              note: "Defined as a representation normally to scale and on a flat medium, of a selection of material or abstract features on, or in relation to, the surface of the earth or of another celestial body. [Source: https://www.loc.gov/marc/bibliographic/bd007a.html]"
            }
          ]
        },
        {
          id: "c_ddb1",
          label: "dataset",
          note: "A collection of related facts and data encoded in a defined structure. [Source: Adapted from http://purl.org/spar/fabio/Dataset]",
          children: [
            {
              id: "ACF7-8YT9",
              label: "aggregated data",
              note: "Statistics that relate to broad classes, groups, or categories. The data are averaged, totaled, or otherwise derived from individual-level data, and it is no longer possible to distinguish the characteristics of individuals within those classes, groups, or categories. For example, the number and age group of the unemployed in specific geographic regions, or national level statistics on the occurrence of specific offences, originally derived from the statistics of individual police districts. [Source: https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "c_cb28",
              label: "clinical trial data",
              note: "Data resulting from a research study in which one or more human subjects are prospectively assigned to one or more interventions (which may include placebo or other control) to evaluate the effects of those interventions on health-related biomedical or behavioral outcomes. [Source: Adapted from https://grants.nih.gov/policy/clinical-trials/definition.htm]"
            },
            {
              id: "FXF3-D3G7",
              label: "compiled data",
              note: "Data collected or assembled from multiple, often heterogeneous sources that have one or more reference points in common, and at least one of the sources was originally produced for other purposes. The data are incorporated in a new entity. For example, providing data on the number of universities in the last 150 years using a variety of available sources (e.g. finance documents, official statistics, university registers), combining survey data with information about geographical areas from official statistics (e.g. population density, doctors per capita, etc.), or using RSS to collect blog posts or tweets, etc. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "AM6W-6QAW",
              label: "encoded data",
              note: "Qualitative data (textual, video, audio or still-image) originally produced for other purposes into quantitative data (expressed in unit-by-variable matrices) by using coding techniques in accordance with pre-defined categorization schemes. For example, coded party manifesto data like the \"European Parliament Election Study 2009, Manifesto Study\" (doi:10.4232/1.10204)\". [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "63NG-B465",
              label: "experimental data",
              note: "Data resulting from the experimental research method involving the manipulation of some or all of the independent variables included in the hypotheses. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "A8F1-NPV9",
              label: "genomic data",
              note: "Genomic data refers to the genome and DNA data of an organism. They are used in bioinformatics for collecting, storing and processing the genomes of living things. Genomic data is a more extensive term than sequencing data. However genomic data mostly come from sequencing techniques. It may include non-sequencing data such as data from microarrays, data from real-time PCR panels and data from pharmacogenomics studies. [Source: Adapted from https://www.techopedia.com/definition/31247/genomic-data]"
            },
            {
              id: "2H0M-X761",
              label: "geospatial data",
              note: "Discrete geospatial data are usually represented using vector data consisting of points, lines and polygons, while continuous geospatial data are usually represented by raster data, consisting of a grid of cells that each has its own value. Any number of applications in a wide range of areas produce geospatial data, such as GIS, Remote Sensing equipment, GPS units, archaeological total stations, manual mapping and computer-aided design (CAD), in a number of formats, including images, vector, text, and tabular data. Vector-based geospatial data include tables listing archaeological sites along with their coordinates, text-based files (e.g., XML) containing coordinates and topology for historic road networks, voting figures for political parties by administrative area. Raster-based geospatial data include satellite images, aerial photographs, scanned maps, and digital maps of elevations, vegetation, land-use, sea surface temperatures, air pollution, soil-types, etc. [Source: https://ddialliance.org/Specification/DDI-CV/GeneralDataFormat_2.0.html]"
            },
            {
              id: "H41Y-FW7B",
              label: "laboratory notebook",
              note: "A laboratory notebook (colloq. lab notebook or lab book) is a primary record of research. Researchers use a lab notebook to document their hypotheses, experiments and initial analysis or interpretation of these experiments. This label is used both for traditional and electronic laboratory notebook. [Source: Adapted from https://en.wikipedia.org/wiki/Lab_notebook]"
            },
            {
              id: "DD58-GFSX",
              label: "measurement and test data",
              note: "Data resulting from assessing specific properties (or characteristics) of beings, things, phenomena, (and/ or processes) by applying pre-established standards and/or specialized instruments or techniques. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "FF4C-28RK",
              label: "observational data",
              note: "Data resulting from observational research, which involves collecting observations as they occur (for example, observing behaviors, events, development of condition or disease, etc.), without attempting to manipulate any of the independent variables. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "CQMR-7K63",
              label: "recorded data",
              note: "Data registered by mechanical or electronic means, in a form that allows the information to be retrieved and/or reproduced. For example, images or sounds on disc or magnetic tape. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "W2XT-7017",
              label: "simulation data",
              note: "Data resulting from modeling or imitative representation of real-world processes, events, or systems, often using computer programs. For example, a program modeling household consumption responses to indirect tax changes; or a dataset on hypothetical patients and their drug exposure, background conditions, and known adverse events. [Source: Adapted from https://ddialliance.org/Specification/DDI-CV/ModeOfCollection_3.0.html]"
            },
            {
              id: "NHD0-W6SY",
              label: "survey data",
              note: "Data resulting from a survey, which is defined as an investigation about the characteristics of a given population by means of collecting data from a sample of that population and estimating their characteristics through the systematic use of statistical methodology. Included are censuses, sample surveys, the collection of data from administrative records and derived statistical activities as well as questionnaires. [Source: Adapted from https://stats.oecd.org/glossary/detail.asp?ID=2620]"
            }
          ]
        },
        {
          id: "542X-3S04",
          label: "design",
          note: "Plans, drawing or set of drawings showing how something e.g. building, product is to be made and how it will work and look. [Source: Adapted from https://dictionary.cambridge.org/dictionary/english/design]",
          children: [
            {
              id: "JBNF-DYAD",
              label: "industrial design",
              note: "Industrial designs are applied to a wide variety of industrial products and handicrafts. They refer to the ornamental or aesthetic aspects of a useful article,including compositions of lines or colors or any three-dimensional forms that give a special appearance to a product or handicraft. [Source: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_943_2018.pdf]"
            },
            {
              id: "BW7T-YM2G",
              label: "layout design",
              note: "Layout-design (topography) means the three-dimensional disposition, however expressed, of the interconnections of an integrated circuit, or such a three-dimensional disposition prepared for an integrated circuit intended for manufacture the elements of an integrated circuit (at least one of which is an active element) and of some or all. [Source: https://www.wipo.int/edocs/lexdocs/laws/en/hk/hk028en.pdf]"
            }
          ]
        },
        {
          id: "c_c513",
          label: "image",
          note: "A visual representation other than text, including all types of moving image and still image. [Source: Adapted from http://purl.org/dc/dcmitype/Image]",
          children: [
            {
              id: "c_8a7e",
              label: "moving image",
              note: "A moving display, either generated dynamically by a computer program or formed from a series of pre-recorded still images imparting an impression of motion when shown in succession. [Source: http://purl.org/spar/fabio/MovingImage]",
              children: [
                {
                  id: "c_12ce",
                  label: "video",
                  note: "A recording of visual images, usually in motion and with sound accompaniment. [Source: http://www.ifla.org/files/assets/cataloguing/isbd/isbd-cons_20110321.pdf ]"
                }
              ]
            },
            {
              id: "c_ecc8",
              label: "still image",
              note: "A recorded static visual representation. This class of image includes diagrams, drawings, graphs, graphic designs, plans, photographs and prints. [Source: Adapted from http://purl.org/spar/fabio/StillImage]"
            }
          ]
        },
        {
          id: "c_e9a0",
          label: "interactive resource",
          note: "A resource requiring interaction from the user to be understood, executed, or experienced. Examples include forms on Web pages, applets, multimedia learning objects, chat services, or virtual reality environments. Source: http://purl.org/dc/dcmitype/InteractiveResource",
          children: [
            {
              id: "c_7ad9",
              label: "website",
              note: "A collection of related web pages containing text, images, videos and/or other digital assets that are addressed relative to a common Uniform Resource Locator (URL). A web site is hosted on at least one web server, accessible via a network such as the Internet or a private local area network. [Source: http://purl.org/spar/fabio/WebSite]"
            }
          ]
        },
        {
          id: "c_e059",
          label: "learning object",
          note: "A digital resource that can be reused to enhance teaching and learning. [Source: https://icas-ca.org/archive/projects/coerc/oer-glossary]"
        },
        {
          id: "c_1843",
          label: "other",
          note: "A resource type that is not included in existing terms. [COAR definition]"
        },
        {
          id: "c_5ce6",
          label: "software",
          note: "A computer program in source code (text) or compiled form. [Source: http://purl.org/dc/dcmitype/Software]",
          children: [
            {
              id: "c_c950",
              label: "research software",
              note: "Software that is used to generate, process or analyse results that you intend to appear in a publication (either in a journal, conference paper, monograph, book or thesis). Research software can be anything from a few lines of code written by yourself, to a professionally developed software package. [Source: https://datashare.ed.ac.uk/handle/10283/785]"
            },
            {
              id: "QH80-2R4E",
              label: "source code",
              note: "Source code is any collection of code, with or without comments, written using a human-readable programming language, usually as plain text. [Source: https://en.wikipedia.org/wiki/Source_code]"
            }
          ]
        },
        {
          id: "c_18cc",
          label: "sound",
          note: "A resource primarily intended to be heard. Examples include a music playback file format, an audio compact disc, and recorded speech or sounds. [Source: http://dublincore.org/documents/dcmi-terms/#dcmitype-Sound]",
          children: [
            {
              id: "c_18cd",
              label: "musical composition",
              note: "Musical composition can refer to an original piece of music, the structure of a musical piece, or the process of creating a new piece of music. [Source: https://en.wikipedia.org/wiki/Musical_composition ]"
            }
          ]
        },
        {
          id: "H6QP-SC1X",
          label: "trademark",
          note: "A sign used to distinguish the goods or services of one undertaking from those of others. A trademark may consist of words and combinations of words (for instance, names or slogans), logos, figures and images, letters, numbers, sounds, or, in rare instances, smells or moving images, or a combination thereof. [Source: https://www.wipo.int/trademarks/en]"
        },
        {
          id: "c_393c",
          label: "workflow",
          note: "A recorded sequence of connected steps, which may be automated, specifying a reliably repeatable sequence of operations to be undertaken when conducting a particular job, for example an in silico investigation that extracts and processes information from a number of bioinformatics databases. [Source: Adapted from http://purl.org/spar/fabio/Workflow]"
        }
      ]
    }
  },
  {
    name: "publication-coar-types",
    source: "publication-coar-types.xml",
    root: {
      id: "http://purl.org/coar/resource_type/scheme",
      label: "Resource Types",
      children: [
        {
          id: "c_18cf",
          label: "text",
          note: "A resource consisting primarily of words for reading. Examples include books, letters, dissertations, poems, newspapers, articles, archives of mailing lists. Note that facsimiles or images of texts are still of the genre Text. [Source: http://purl.org/dc/dcmitype/Text]",
          children: [
            {
              id: "c_1162",
              label: "annotation",
              note: "An annotation in the sense of a legal note is a legally explanatory comment on a decision handed down by a court or arbitral tribunal. [Source: DRIVER info:eu-repo definition]"
            },
            {
              id: "c_86bc",
              label: "bibliography",
              note: "A list of the books and articles that have been used by someone when writing a particular book or article [Source: https://dictionary.cambridge.org/dictionary/english/bibliography]"
            },
            {
              id: "c_6947",
              label: "blog post",
              note: "A piece of writing or other item of content published on a blog. [Source: https://www.lexico.com/definition/blog_post]"
            },
            {
              id: "c_2f33",
              label: "book",
              note: "A non-serial publication that is complete in one volume or a designated finite number of volumes. [Source: Adapted from http://purl.org/eprint/type/Book]",
              children: [
                {
                  id: "c_3248",
                  label: "book part",
                  note: "A defined chapter or section of a book, usually with a separate title or number. [Source: http://purl.org/spar/fabio/BookChapter]"
                }
              ]
            },
            {
              id: "c_c94f",
              label: "conference output",
              note: "All kind of digital resources contributed to a conference, like conference presentation (slides), conference report, conference lecture, abstracts, demonstrations. For conference papers, posters or proceedings the specific sub-concepts should be used. [COAR definition]",
              children: [
                {
                  id: "c_18cp",
                  label: "conference paper not in proceedings",
                  note: "A paper, typically the realization of a research paper reporting original research findings. Use this label when the paper is not published in a proceeding. [Source: Adapted from http://purl.org/spar/fabio/ConferencePaper]"
                },
                {
                  id: "c_18co",
                  label: "conference poster not in proceedings",
                  note: "A display poster, typically containing text with illustrative figures and/or tables, usually reporting research results or proposing hypotheses, submitted for acceptance to and/or presented at a conference, seminar, symposium, workshop or similar event. Use this label when the poster is not published in a proceeding. [Source: http://purl.org/spar/fabio/ConferencePoster]"
                },
                {
                  id: "R60J-J5BD",
                  label: "conference presentation",
                  note: "A set of slides containing text, tables or figures, designed to communicate ideas or research results, for projection and viewing by an audience at a conference, symposium, seminar, lecture, workshop or other gatherings. [Source: Adapted from http://purl.org/spar/fabio/Presentation]"
                },
                {
                  id: "c_f744",
                  label: "conference proceedings",
                  note: "Conference proceedings is the official record of a conference meeting. It is a collection of documents which corresponds to the presentations given at the conference. It may include additional content. [Source: http://www.ieee.org/documents/confprocdefined.pdf ]",
                  children: [
                    {
                      id: "c_5794",
                      label: "conference paper",
                      note: "A paper, published within a conference proceeding, typically the realization of a research paper reporting original research findings. [Source: Adapted from http://purl.org/spar/fabio/ConferencePaper]"
                    },
                    {
                      id: "c_6670",
                      label: "conference poster",
                      note: "A display poster, published within a conference proceeding, typically containing text with illustrative figures and/or tables, usually reporting research results or proposing hypotheses, submitted for acceptance to and/or presented at a conference, seminar, symposium, workshop or similar event. [Source: Adapted http://purl.org/spar/fabio/ConferencePoster]"
                    }
                  ]
                }
              ]
            },
            {
              id: "c_0640",
              label: "journal",
              note: "A journal is a serial publication devoted to disseminating original research and current developments on a subject. (Adapted from ODLIS) [Source: http://dspacecris.eurocris.org/cris/classcerif/classcerif00422]",
              children: [
                {
                  id: "c_b239",
                  label: "editorial",
                  note: "A brief essay expressing the opinion or position of the chief editor(s) of a (academic) journal with respect to a current political, social, cultural, or professional issue. [Source: Adapted from ODLIS [Source: http://www.abc-clio.com/ODLIS/odlis_e.aspx ]"
                },
                {
                  id: "c_6501",
                  label: "journal article",
                  note: "An article, typically the realization of a research paper reporting original research findings, published in a journal issue. [Source: http://purl.org/spar/fabio/JournalArticle]",
                  children: [
                    {
                      id: "c_7acd",
                      label: "corrigendum",
                      note: "A formal correction to an error introduced by the author into a previously published document. (adapted from https://sparontologies.github.io/fabio/current/fabio.html#d4e2712)"
                    },
                    {
                      id: "c_beb9",
                      label: "data paper",
                      note: "A data paper is a scholarly publication describing a particular dataset or group of dataset, published in the form of a peer-reviewed article in a scholarly journal. The main purpose of a data paper is to describe data, the circumstances of their collection, and information related to data features, access and potential reuse. Adapted from https://en.wikipedia.org/wiki/Data_paper and http://www.gbif.org/publishing-data/data-papers"
                    },
                    {
                      id: "c_2df8fbb1",
                      label: "research article",
                      note: "A research article is a primary source, that is, it reports the methods and results of an original study performed by the authors. (adapted from http://apus.libanswers.com/faq/2324)"
                    },
                    {
                      id: "c_dcae04bc",
                      label: "review article",
                      note: "A review article is a secondary source, that is, it is written about other articles, and does not report original research of its own. [Source: Adapted from http://apus.libanswers.com/faq/2324]"
                    },
                    {
                      id: "c_7bab",
                      label: "software paper",
                      note: "A software paper should include the rationale for the development of the tool and details of the code used for its construction. [Source: Adapted from https://f1000research.com/for-authors/article-guidelines/software-tool-articles ]"
                    }
                  ]
                },
                {
                  id: "c_545b",
                  label: "letter to the editor",
                  note: "A letter addressed to the editor and comments on or discussed an item previously published by that periodical, or of interest to its readership. [Source: Adapted from http://purl.org/spar/fabio/Letter]"
                }
              ]
            },
            {
              id: "c_8544",
              label: "lecture",
              note: "Transcription of an oral presentation/talk intended to present information or teach people about a particular subject, for example by a university or college teacher. [Source: Adopted from https://en.wikipedia.org/wiki/Lecture]"
            },
            {
              id: "c_0857",
              label: "letter",
              note: "A brief description of important new research, also known as “communication”. [Source: https://cerif.eurocris.org/vocab/html/OutputTypes.html#Letter]"
            },
            {
              id: "c_2cd9",
              label: "magazine",
              note: "A popular interest periodical usually containing articles on a variety of topics, written by various authors in a nonscholarly style or a trade publication, unlike a consumer publication, covers a specific topic for people who work in that particular field or industry. [Source: Adapted from https://www.thebalance.com/what-is-a-trade-publication-exactly-2316039 and http://www.abc-clio.com/ODLIS/odlis_m.aspx]"
            },
            {
              id: "c_0040",
              label: "manuscript",
              note: "A manuscript is a work of any kind (text, inscription, music score, map, etc.) written entirely by hand. [Source: https://products.abc-clio.com/ODLIS/odlis_m.aspx]"
            },
            {
              id: "c_18cw",
              label: "musical notation",
              note: "Symbols used to write music, as in a music score, and to express mathematical concepts. [Source: Adapted from https://products.abc-clio.com/ODLIS/odlis_n.aspx]"
            },
            {
              id: "c_2fe3",
              label: "newspaper",
              note: "A non-peer reviewed periodical, usually published daily or weekly, consisting primarily of editorials and news items concerning current or recent events and matters of public interest. [Source: http://purl.org/spar/fabio/Newspaper]",
              children: [
                {
                  id: "c_998f",
                  label: "newspaper article",
                  note: "Work consisting of a news item appearing in a general-interest newspaper or other general news periodical, containing information of current and timely interest in a field. (Adapted from http://www.reference.md/files/D018/mD018431.html )"
                }
              ]
            },
            {
              id: "QX5C-AR31",
              label: "other periodical",
              note: "A resource type that is not included in existing terms under the top concept \"Text\". [COAR definition]"
            },
            {
              id: "c_816b",
              label: "preprint",
              note: "A preprint is a scientific manuscript without peer-review and has not yet been accepted by a journal, typicaly submitted to a public server/ repository by the author. [Source: Adapted from https://asapbio.org/preprint-info/preprint-faq#qaef-637]"
            },
            {
              id: "c_93fc",
              label: "report",
              note: "A report is a separately published record of research findings, research still in progress, policy developments and events, or other technical findings, usually bearing a report number and sometimes a grant number assigned by the funding agency. Also, an official record of the activities of a committee or corporate entity, the proceedings of a government body, or an investigation by an agency, whether published or private, usually archived or submitted to a higher authority, voluntarily or under mandate. In a more general sense, any formal account of facts or information related to a specific event or phenomenon, sometimes given at regular intervals. [Source: http://lu.com/odlis/odlis_R.cfm#report ]",
              children: [
                {
                  id: "c_7877",
                  label: "clinical study",
                  note: "A work that reports on the results of a research study to evaluate interventions or exposures on biomedical or health-related outcomes. The two main types of clinical studies are interventional studies (clinical trials) and observational studies. While most clinical studies concern humans, this publication type may be used for clinical veterinary articles meeting the requisites for humans. [Source: https://www.ncbi.nlm.nih.gov/mesh/2009830]"
                },
                {
                  id: "c_ab20",
                  label: "data management plan",
                  note: "A formal statement describing how research data will be managed and documented throughout a research project and the terms regarding the subsequent deposit of the data with a data repository for long-term management and preservation. [Source: https://casrai.org/rdm-glossary]"
                },
                {
                  id: "c_18wz",
                  label: "memorandum",
                  note: "A formal note distributed internally to one or more persons in a company, agency, organization, or institution, with a header indicating the date it was sent and stating to whom it is addressed (To:), from whom it is sent (From:), and the subject of the text (Re:). Unlike a letter, a memo does not require a full salutation or signature at the end of the text--the sender may simply initial his or her name in the header. [Source: https://products.abc-clio.com/ODLIS/odlis_m.aspx#memorandum]"
                },
                {
                  id: "c_186u",
                  label: "policy report",
                  note: "A policy report presents what is known about a particular issue or problem. It assembles facts and evidence to help readers understand complex issues and form a response. It might aim to be neutral, or it might aim to persuade readers in a particular direction. [Source: https://www.uow.edu.au/student/learning-co-op/assessments/policy-report/#]"
                },
                {
                  id: "c_18op",
                  label: "project deliverable",
                  note: "A document containing a project report, intended to be delivered to a customer or funding agency describing the results achieved within a specific project. [Source: http://purl.org/spar/fabio/ProjectReportDocument]"
                },
                {
                  id: "YZ1N-ZFT9",
                  label: "research protocol",
                  note: "The protocol is a detailed plan of the research study including a project summary, project description covering the rationale, objectives, methodology, data management and analysis, ethical considerations, gender issues and references. [Source: Adapted from https://www.who.int/publications/i/item/a-practical-guide-for-health-researchers]"
                },
                {
                  id: "c_18ws",
                  label: "research report",
                  note: "It is publication that reports on the findings of a research project or alternatively scientific observations on or about a subject. [Source: Adapted from https://en.wikipedia.org/wiki/Research_report]"
                },
                {
                  id: "c_18gh",
                  label: "technical report",
                  note: "A document that describes the process, progress, or results of technical or scientific research or the state of a technical or scientific research problem. It might also include recommendations and conclusions of the research. [Source: http://guides.library.cornell.edu/ecommons/types]"
                }
              ]
            },
            {
              id: "c_baaf",
              label: "research proposal",
              note: "A research proposal is a document proposing a research project, generally in the sciences or academia, and generally constitutes a request for sponsorship of that research. [Source: https://en.wikipedia.org/wiki/Research_proposal]"
            },
            {
              id: "c_efa0",
              label: "review",
              note: "A review of others' published work. [Source: Adapted from http://purl.org/spar/fabio/Review]",
              children: [
                {
                  id: "c_ba08",
                  label: "book review",
                  note: "A written review and critical analysis of the content, scope and quality of a book or other monographic work. [Source: http://purl.org/spar/fabio/BookReview]"
                },
                {
                  id: "D97F-VB57",
                  label: "commentary",
                  note: "A commentary is a more in-depth analysis written to draw attention to a work already published. Commentaries are somewhat like “reviews” in that the author presents his or her analysis of a work and why it would be of interest to a specific audience. [Source: https://www.enago.com/academy/perspective-opinion-and-commentary-pieces]"
                },
                {
                  id: "H9BQ-739P",
                  label: "peer review",
                  note: "An evaluation of scientific, academic, or professional work by others working in the same field. [Source: Adopted from https://schema.datacite.org/meta/kernel-4.4/doc/DataCite-MetadataKernel_v4.4.pdf]"
                }
              ]
            },
            {
              id: "c_71bd",
              label: "technical documentation",
              note: "Technical documentation refers to any type of documentation that describes handling, functionality and architecture of a technical product or a product under development or use. [Source: https://en.wikipedia.org/wiki/Technical_documentation]"
            },
            {
              id: "c_46ec",
              label: "thesis",
              note: "A book authored by a student containing a formal presentations of research outputs submitted for examination in completion of a course of study at an institution of higher education, to fulfil the requirements for an academic degree. Also know as a dissertation. [Source: http://purl.org/spar/fabio/Thesis]",
              children: [
                {
                  id: "c_7a1f",
                  label: "bachelor thesis",
                  note: "A thesis reporting a research project undertaken as part of an undergraduate course of education leading to a bachelor's degree. [Source: http://purl.org/spar/fabio/BachelorsThesis]"
                },
                {
                  id: "c_db06",
                  label: "doctoral thesis",
                  note: "A thesis reporting the research undertaken during a period of graduate study leading to a doctoral degree. [Source: http://purl.org/spar/fabio/DoctoralThesis]"
                },
                {
                  id: "c_bdcc",
                  label: "master thesis",
                  note: "A thesis reporting a research project undertaken as part of a graduate course of education leading to a master's degree. [Source: http://purl.org/spar/fabio/MastersThesis]"
                }
              ]
            },
            {
              id: "6NC7-GK9S",
              label: "transcription",
              note: "A written record of words spoken in court proceedings or in a speech, interview, broadcast, or sound recording. [Source: Adapted from https://products.abc-clio.com/ODLIS/odlis_t.aspx]"
            },
            {
              id: "c_8042",
              label: "working paper",
              note: "A working or discussion paper circulated publicly or among a group of peers. Certain disciplines, for example economics, issue working papers in series. [Source: http://www.ukoln.ac.uk/repositories/digirep/index/Eprints_Type_Vocabulary_Encoding_Scheme#:~:text=http%3A//purl.org/eprint/type/WorkingPaper]"
            }
          ]
        },
        {
          id: "c_1843",
          label: "other",
          note: "A resource type that is not included in existing terms. [COAR definition]"
        }
      ]
    }
  },
  {
    name: "srsc",
    source: "srsc.xml",
    root: {
      id: "ResearchSubjectCategories",
      label: "Research Subject Categories",
      note: "Ämneskategorier för vetenskapliga publikationer",
      children: [
        {
          id: "SCB11",
          label: "HUMANITIES and RELIGION",
          note: "HUMANIORA och RELIGIONSVETENSKAP",
          children: [
            {
              id: "SCB110",
              label: "Religion/Theology",
              note: "Religionsvetenskap/Teologi",
              children: [
                {
                  id: "VR110102",
                  label: "History of religion",
                  note: "Religionshistoria"
                },
                {
                  id: "VR110103",
                  label: "Church studies",
                  note: "Kyrkovetenskap"
                },
                {
                  id: "VR110104",
                  label: "Missionary studies",
                  note: "Missionsvetenskap"
                },
                {
                  id: "VR110105",
                  label: "Systematic theology",
                  note: "Systematisk teologi"
                },
                {
                  id: "VR110106",
                  label: "Islamology",
                  note: "Islamologi"
                },
                {
                  id: "VR110107",
                  label: "Faith and reason",
                  note: "Tros- och livsåskådningsvetenskap"
                },
                {
                  id: "VR110108",
                  label: "Sociology of religion",
                  note: "Religionssociologi"
                },
                {
                  id: "VR110109",
                  label: "Psychology of religion",
                  note: "Religionspsykologi"
                },
                {
                  id: "VR110110",
                  label: "Philosophy of religion",
                  note: "Religionsfilosofi"
                },
                {
                  id: "VR110111",
                  label: "New Testament exegesis",
                  note: "Nya testamentets exegetik"
                },
                {
                  id: "VR110112",
                  label: "Old Testament exegesis",
                  note: "Gamla testamentets exegetik"
                },
                {
                  id: "VR110113",
                  label: "Dogmatics with symbolics",
                  note: "Dogmatik med symbolik"
                }
              ]
            },
            {
              id: "SCB111",
              label: "History and philosophy subjects",
              note: "Historisk-filosofiska ämnen",
              children: [
                {
                  id: "SCB1111",
                  label: "Philosophy subjects",
                  note: "Filosofiämnen",
                  children: [
                    {
                      id: "VR111101",
                      label: "Logic",
                      note: "Logik"
                    },
                    {
                      id: "VR111102",
                      label: "Practical philosophy",
                      note: "Praktisk filosofi"
                    },
                    {
                      id: "VR111103",
                      label: "Theoretical philosophy",
                      note: "Teoretisk filosofi"
                    },
                    {
                      id: "VR111104",
                      label: "Theory of science",
                      note: "Vetenskapsteori"
                    }
                  ]
                },
                {
                  id: "SCB1112",
                  label: "Archaeology subjects",
                  note: "Arkeologiämnen",
                  children: [
                    {
                      id: "VR111201",
                      label: "Archaeology",
                      note: "Arkeologi"
                    },
                    {
                      id: "VR111202",
                      label: "Archaeology, classical",
                      note: "Arkeologi, klassisk"
                    },
                    {
                      id: "VR111203",
                      label: "Archaeology, medieval",
                      note: "Arkeologi, medeltid"
                    },
                    {
                      id: "VR111204",
                      label: "Archaeology, North European",
                      note: "Arkeologi, nordeuropeisk"
                    },
                    {
                      id: "VR111205",
                      label: "Archaeology, Non-European",
                      note: "Arkeologi, utomeuropeisk"
                    },
                    {
                      id: "VR111206",
                      label: "African and comparative archaelogy",
                      note: "Afrikansk och jämförande arkeologi"
                    },
                    {
                      id: "VR111207",
                      label: "Historical osteology",
                      note: "Historisk osteologi"
                    }
                  ]
                },
                {
                  id: "SCB1113",
                  label: "History subjects",
                  note: "Historieämnen",
                  children: [
                    {
                      id: "VR111301",
                      label: "History",
                      note: "Historia"
                    },
                    {
                      id: "VR111302",
                      label: "History of science and ideas",
                      note: "Idé- o lärdomshistoria"
                    },
                    {
                      id: "VR111303",
                      label: "Economic history",
                      note: "Ekonomisk historia"
                    },
                    {
                      id: "VR111304",
                      label: "Church history",
                      note: "Kyrkohistoria"
                    },
                    {
                      id: "VR111305",
                      label: "History of technology",
                      note: "Teknikhistoria"
                    },
                    {
                      id: "VR111306",
                      label: "Technology and culture",
                      note: "Teknik och kultur"
                    },
                    {
                      id: "VR111307",
                      label: "History of technology and industry",
                      note: "Teknik- och industrihistoria"
                    },
                    {
                      id: "VR111308",
                      label: "History of science",
                      note: "Vetenskapshistoria"
                    },
                    {
                      id: "VR111309",
                      label: "Legal history",
                      note: "Rättshistoria"
                    },
                    {
                      id: "VR111310",
                      label: "History of medicine",
                      note: "Medicinens historia"
                    },
                    {
                      id: "VR111311",
                      label: "Agricultural history",
                      note: "Agrarhistoria"
                    },
                    {
                      id: "VR111312",
                      label: "Book and library history",
                      note: "Bok- och bibliotekshistoria"
                    }
                  ]
                },
                {
                  id: "SCB1114",
                  label: "Ethnology",
                  note: "Etnologi",
                  children: [
                    {
                      id: "VR111402",
                      label: "Human ecology",
                      note: "Humanekologi"
                    },
                    {
                      id: "VR111405",
                      label: "Cultural anthropology",
                      note: "Kulturantropologi"
                    }
                  ]
                },
                {
                  id: "SCB1115",
                  label: "Historical cultures",
                  note: "Historiska kulturer",
                  children: [
                    {
                      id: "VR111503",
                      label: "Classical archaeology and ancient history",
                      note: "Antikens kultur och samhälle"
                    },
                    {
                      id: "VR111505",
                      label: "Byzantinology",
                      note: "Bysantinologi"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB112",
              label: "Aesthetic subjects",
              note: "Estetiska ämnen",
              children: [
                {
                  id: "VR112101",
                  label: "Aesthetics",
                  note: "Estetik"
                },
                {
                  id: "VR112102",
                  label: "Film",
                  note: "Filmvetenskap"
                },
                {
                  id: "VR112103",
                  label: "Art",
                  note: "Konstvetenskap"
                },
                {
                  id: "VR112104",
                  label: "Literature",
                  note: "Litteraturvetenskap"
                },
                {
                  id: "VR112105",
                  label: "Music",
                  note: "Musikvetenskap"
                },
                {
                  id: "VR112106",
                  label: "Rhetoric",
                  note: "Retorik"
                },
                {
                  id: "VR112107",
                  label: "Theatre",
                  note: "Teatervetenskap"
                },
                {
                  id: "VR112108",
                  label: "Settlement studies",
                  note: "Bebyggelseforskning"
                }
              ]
            },
            {
              id: "SCB113",
              label: "Languages and linguistics",
              note: "Språkvetenskap",
              children: [
                {
                  id: "SCB1131",
                  label: "Scandinavian languages",
                  note: "Nordiska språk",
                  children: [
                    {
                      id: "VR113102",
                      label: "Swedish language",
                      note: "Svenska språket"
                    },
                    {
                      id: "VR113103",
                      label: "Sami language",
                      note: "Samiska"
                    },
                    {
                      id: "VR113104",
                      label: "Norwegian language",
                      note: "Norska språket"
                    },
                    {
                      id: "VR113105",
                      label: "Danish language",
                      note: "Danska språket"
                    }
                  ]
                },
                {
                  id: "SCB1132",
                  label: "Other Germanic languages",
                  note: "Övriga germanska språk",
                  children: [
                    {
                      id: "VR113200",
                      label: "Germanic languages",
                      note: "Germanistik"
                    },
                    {
                      id: "VR113201",
                      label: "English language",
                      note: "Engelska språket"
                    },
                    {
                      id: "VR113202",
                      label: "German language",
                      note: "Tyska språket"
                    },
                    {
                      id: "VR113203",
                      label: "Dutch language",
                      note: "Nederländska"
                    }
                  ]
                },
                {
                  id: "SCB1133",
                  label: "Romance languages",
                  note: "Romanska språk",
                  children: [
                    {
                      id: "VR113301",
                      label: "French language",
                      note: "Franska språket"
                    },
                    {
                      id: "VR113302",
                      label: "Italian language",
                      note: "Italienska språket"
                    },
                    {
                      id: "VR113304",
                      label: "Spanish language",
                      note: "Spanska språket"
                    },
                    {
                      id: "VR113305",
                      label: "Portugese language",
                      note: "Portugisiska"
                    },
                    {
                      id: "VR113306",
                      label: "Romanian language",
                      note: "Rumänska"
                    }
                  ]
                },
                {
                  id: "SCB1134",
                  label: "Finno-Ugric languages",
                  note: "Finsk-ugriska språk",
                  children: [
                    {
                      id: "VR113402",
                      label: "Finnish language",
                      note: "Finska språket"
                    },
                    {
                      id: "VR113403",
                      label: "Estonian language",
                      note: "Estniska språket"
                    }
                  ]
                },
                {
                  id: "SCB1135",
                  label: "Slavic languages",
                  note: "Slaviska språk",
                  children: [
                    {
                      id: "VR113502",
                      label: "Russian language",
                      note: "Ryska språket"
                    },
                    {
                      id: "VR113503",
                      label: "Polish language",
                      note: "Polska språket"
                    }
                  ]
                },
                {
                  id: "SCB1136",
                  label: "Classical philology",
                  note: "Klassiska språk",
                  children: [
                    {
                      id: "VR113601",
                      label: "Latin language",
                      note: "Latin"
                    },
                    {
                      id: "VR113602",
                      label: "Classical Greek language",
                      note: "Klassisk grekiska"
                    },
                    {
                      id: "VR113603",
                      label: "Modern Greek language",
                      note: "Nygrekiska"
                    }
                  ]
                },
                {
                  id: "SCB1137",
                  label: "Other languages",
                  note: "Övriga språk",
                  children: [
                    {
                      id: "VR113701",
                      label: "Sanskrit language with Indo-European lingustics",
                      note: "Sanskrit med indoeuropeisk språkforskning"
                    },
                    {
                      id: "VR113702",
                      label: "Celtic languages",
                      note: "Keltiska språk"
                    },
                    {
                      id: "VR113703",
                      label: "Baltic languages",
                      note: "Baltiska språk"
                    },
                    {
                      id: "VR113704",
                      label: "East Asian languages",
                      note: "Östasiatiska språk"
                    },
                    {
                      id: "VR113705",
                      label: "Turkic languages",
                      note: "Turkiska språk"
                    },
                    {
                      id: "VR113706",
                      label: "Iranian languages",
                      note: "Iranska språk"
                    },
                    {
                      id: "VR113707",
                      label: "Arabic language",
                      note: "Arabiska"
                    },
                    {
                      id: "VR113708",
                      label: "Chinese language",
                      note: "Kinesiska"
                    },
                    {
                      id: "VR113709",
                      label: "Egyptology",
                      note: "Egyptologi"
                    },
                    {
                      id: "VR113710",
                      label: "Indonesian language",
                      note: "Indonesiska"
                    },
                    {
                      id: "VR113711",
                      label: "African languages",
                      note: "Afrikanska språk"
                    },
                    {
                      id: "VR113712",
                      label: "Bantu languages",
                      note: "Bantuistik"
                    },
                    {
                      id: "VR113713",
                      label: "Caucasian languages",
                      note: "Kaukasiska språk"
                    },
                    {
                      id: "VR113714",
                      label: "Semitic languages",
                      note: "Semitiska språk"
                    },
                    {
                      id: "VR113715",
                      label: "Altaic languages",
                      note: "Altaistik"
                    },
                    {
                      id: "VR113716",
                      label: "Assyriology",
                      note: "Assyriologi"
                    },
                    {
                      id: "VR113717",
                      label: "Indology",
                      note: "Indologi"
                    },
                    {
                      id: "VR113719",
                      label: "Japanology",
                      note: "Japanologi"
                    },
                    {
                      id: "VR113720",
                      label: "Koreanology",
                      note: "Koreanologi"
                    }
                  ]
                },
                {
                  id: "SCB1138",
                  label: "Sign language",
                  note: "Teckenspråk"
                },
                {
                  id: "SCB1139",
                  label: "Linguistic subjects",
                  note: "Lingvistikämnen",
                  children: [
                    {
                      id: "VR113901",
                      label: "Linguistics",
                      note: "Lingvistik"
                    },
                    {
                      id: "VR113902",
                      label: "Phonetics",
                      note: "Fonetik"
                    },
                    {
                      id: "VR113903",
                      label: "Children's language",
                      note: "Barnspråk"
                    },
                    {
                      id: "VR113904",
                      label: "Bilingualism",
                      note: "Tvåspråkighet"
                    },
                    {
                      id: "VR113905",
                      label: "Language technology",
                      note: "Språkteknologi"
                    },
                    {
                      id: "VR113906",
                      label: "Computational linguistics",
                      note: "Datorlingvistik"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB119",
              label: "Other humanities and religion",
              note: "Övrig humaniora och religionsvetenskap"
            }
          ]
        },
        {
          id: "SCB12",
          label: "LAW/JURISPRUDENCE",
          note: "RÄTTSVETENSKAP/JURIDIK",
          children: [
            {
              id: "SCB1201",
              label: "Public law",
              note: "Offentlig rätt",
              children: [
                {
                  id: "VR120103",
                  label: "Administrative law",
                  note: "Förvaltningsrätt"
                },
                {
                  id: "VR120104",
                  label: "Constitutional law",
                  note: "Konstitutionell rätt"
                },
                {
                  id: "VR120105",
                  label: "Social welfare law",
                  note: "Socialrätt"
                }
              ]
            },
            {
              id: "SCB1202",
              label: "Procedural law",
              note: "Processrätt",
              children: [
                {
                  id: "VR120201",
                  label: "Civil procedure",
                  note: "Civilprocess"
                },
                {
                  id: "VR120202",
                  label: "Criminal procedure",
                  note: "Straffprocess"
                },
                {
                  id: "VR120203",
                  label: "Administrative procedure",
                  note: "Förvaltningsprocess"
                },
                {
                  id: "VR120204",
                  label: "Arbitration",
                  note: "Skiljemannarätt"
                }
              ]
            },
            {
              id: "SCB1203",
              label: "Criminal law",
              note: "Straffrätt"
            },
            {
              id: "SCB1204",
              label: "Financial law",
              note: "Finansrätt"
            },
            {
              id: "SCB1205",
              label: "Private law",
              note: "Civilrätt",
              children: [
                {
                  id: "VR120502",
                  label: "Contract law",
                  note: "Allmän avtalsrätt"
                },
                {
                  id: "VR120503",
                  label: "Labour law",
                  note: "Arbetsrätt"
                },
                {
                  id: "VR120504",
                  label: "Commercial and company law",
                  note: "Affärsrätt"
                },
                {
                  id: "VR120505",
                  label: "Company law",
                  note: "Bolagsrätt"
                },
                {
                  id: "VR120506",
                  label: "Insurance law",
                  note: "Försäkringsrätt"
                },
                {
                  id: "VR120507",
                  label: "Intellectual property law",
                  note: "Immaterialrätt"
                },
                {
                  id: "VR120508",
                  label: "Property and real estate law",
                  note: "Sakrätt"
                },
                {
                  id: "VR120509",
                  label: "Tort law",
                  note: "Skadeståndsrätt"
                },
                {
                  id: "VR120510",
                  label: "Contract law",
                  note: "Speciell avtalsrätt"
                }
              ]
            },
            {
              id: "SCB1209",
              label: "Other law",
              note: "Övrig rätt",
              children: [
                {
                  id: "VR120901",
                  label: "Jurisprudence",
                  note: "Allmän rättslära"
                },
                {
                  id: "VR120902",
                  label: "European law",
                  note: "EU-rätt"
                },
                {
                  id: "VR120903",
                  label: "International law",
                  note: "Folkrätt"
                },
                {
                  id: "VR120904",
                  label: "International private law and international procedural law",
                  note: "Internationell privat- och processrätt"
                },
                {
                  id: "VR120905",
                  label: "Comparative law",
                  note: "Komparativ rätt"
                },
                {
                  id: "VR120906",
                  label: "Competition law",
                  note: "Marknads- och konkurrensrätt"
                },
                {
                  id: "VR120907",
                  label: "Environmental law",
                  note: "Miljörätt"
                }
              ]
            }
          ]
        },
        {
          id: "SCB13",
          label: "SOCIAL SCIENCES",
          note: "SAMHÄLLSVETENSKAP",
          children: [
            {
              id: "SCB131",
              label: "Social sciences",
              note: "Socialvetenskap",
              children: [
                {
                  id: "SCB1311",
                  label: "Education",
                  note: "Pedagogik",
                  children: [
                    {
                      id: "VR131102",
                      label: "Subject didactics",
                      note: "Ämnesdidaktik"
                    },
                    {
                      id: "VR131103",
                      label: "Nursing education",
                      note: "Vårdpedagogik"
                    },
                    {
                      id: "VR131104",
                      label: "Music education",
                      note: "Musikpedagogik"
                    },
                    {
                      id: "VR131105",
                      label: "International education",
                      note: "Internationell pedagogik"
                    }
                  ]
                },
                {
                  id: "SCB1312",
                  label: "Psychology",
                  note: "Psykologi",
                  children: [
                    {
                      id: "VR131202",
                      label: "Applied psychology",
                      note: "Tillämpad psykologi"
                    },
                    {
                      id: "VR131203",
                      label: "Environmental psychology",
                      note: "Miljöpsykologi"
                    },
                    {
                      id: "VR131204",
                      label: "Cognitive science",
                      note: "Kognitionsforskning"
                    }
                  ]
                },
                {
                  id: "SCB1313",
                  label: "Social anthropology/ethnography",
                  note: "Socialantrolopologi/etnografi",
                  children: [
                    {
                      id: "VR131301",
                      label: "Social anthropology",
                      note: "Socialantropologi"
                    },
                    {
                      id: "VR131302",
                      label: "Ethnography",
                      note: "Etnografi"
                    }
                  ]
                },
                {
                  id: "SCB1314",
                  label: "Social work",
                  note: "Socialt arbete",
                  children: [
                    {
                      id: "VR131402",
                      label: "Family research",
                      note: "Familjeforskning"
                    },
                    {
                      id: "VR131403",
                      label: "Youth research",
                      note: "Ungdomsforskning"
                    },
                    {
                      id: "VR131404",
                      label: "Disability research",
                      note: "Handikappsforskning"
                    },
                    {
                      id: "VR131405",
                      label: "Sports research",
                      note: "Idrottsforskning"
                    }
                  ]
                },
                {
                  id: "SCB1315",
                  label: "Criminology",
                  note: "Kriminologi",
                  children: [
                    {
                      id: "VR131502",
                      label: "Criminal science",
                      note: "Kriminalvetenskap"
                    }
                  ]
                },
                {
                  id: "SCB1316",
                  label: "Sociology",
                  note: "Sociologi",
                  children: [
                    {
                      id: "VR131602",
                      label: "Sociology of Law",
                      note: "Rättssociologi"
                    }
                  ]
                },
                {
                  id: "SCB1317",
                  label: "Demography",
                  note: "Demografi"
                },
                {
                  id: "SCB1318",
                  label: "Political science",
                  note: "Statsvetenskap",
                  children: [
                    {
                      id: "VR131803",
                      label: "Peace and conflict research",
                      note: "Freds- och konfliktforskning"
                    },
                    {
                      id: "VR131804",
                      label: "Peace and development research",
                      note: "Freds- och utvecklingsforskning"
                    },
                    {
                      id: "VR131805",
                      label: "Empirical conflict research",
                      note: "Empirisk konfliktforskning"
                    },
                    {
                      id: "VR131806",
                      label: "Research on Europe",
                      note: "Forskning om Europa"
                    }
                  ]
                },
                {
                  id: "SCB1319",
                  label: "Pedgogical work",
                  note: "Pedagogiskt arbete"
                }
              ]
            },
            {
              id: "SCB132",
              label: "Business and economics",
              note: "Ekonomi",
              children: [
                {
                  id: "SCB1321",
                  label: "Business studies",
                  note: "Företagsekonomi"
                },
                {
                  id: "SCB1322",
                  label: "Human geography, economic geography",
                  note: "Kulturgeografi, ekonomisk geografi",
                  children: [
                    {
                      id: "VR132201",
                      label: "Human geography",
                      note: "Kulturgeografi"
                    },
                    {
                      id: "VR132202",
                      label: "Economic geography",
                      note: "Ekonomisk geografi"
                    }
                  ]
                },
                {
                  id: "SCB1323",
                  label: "Economics",
                  note: "Nationalekonomi",
                  children: [
                    {
                      id: "VR132302",
                      label: "Econometrics",
                      note: "Ekonometri"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB133",
              label: "Statistics, computer and systems science",
              note: "Statistik, data- och systemvetenskap",
              children: [
                {
                  id: "SCB1331",
                  label: "Informatics, computer and systems science",
                  note: "Informatik, data- och systemvetenskap",
                  children: [
                    {
                      id: "VR133101",
                      label: "Informatics",
                      note: "Informatik"
                    },
                    {
                      id: "VR133102",
                      label: "Informatics and systems science",
                      note: "Informatik och systemvetenskap"
                    },
                    {
                      id: "VR133103",
                      label: "ADP",
                      note: "ADB"
                    },
                    {
                      id: "VR133104",
                      label: "Computer and systems science",
                      note: "Data- och systemvetenskap"
                    },
                    {
                      id: "VR133105",
                      label: "Databases",
                      note: "Databaser"
                    },
                    {
                      id: "VR133106",
                      label: "Data processing",
                      note: "Databehandling"
                    },
                    {
                      id: "VR133107",
                      label: "Information and language technology",
                      note: "Informations- och språkteknologi"
                    },
                    {
                      id: "VR133108",
                      label: "Information processing",
                      note: "Informationsbehandling"
                    },
                    {
                      id: "VR133109",
                      label: "Information technology",
                      note: "Informationsteknologi"
                    }
                  ]
                },
                {
                  id: "SCB1332",
                  label: "Statistics",
                  note: "Statistik",
                  children: [
                    {
                      id: "VR133202",
                      label: "Biostatistics",
                      note: "Biostatistik"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB139",
              label: "Other social sciences",
              note: "Övrig samhällsvetenskap",
              children: [
                {
                  id: "VR139901",
                  label: "Mass communication",
                  note: "Masskommunikation"
                },
                {
                  id: "VR139902",
                  label: "Media and communication studies",
                  note: "Medie- och kommunikationsvetenskap"
                },
                {
                  id: "VR139903",
                  label: "Library and information science",
                  note: "Biblioteks- och informationsvetenskap"
                },
                {
                  id: "VR139904",
                  label: "Labour market research",
                  note: "Arbetsmarknadsforskning"
                },
                {
                  id: "VR139905",
                  label: "European research cooperation",
                  note: "Europeiskt forskningssamarbete"
                },
                {
                  id: "VR139907",
                  label: "Public sector research",
                  note: "Forskning om offentlig sektor"
                },
                {
                  id: "VR139908",
                  label: "Research policy",
                  note: "Forskningspolitik"
                },
                {
                  id: "VR139910",
                  label: "Military intelligence and security service",
                  note: "Militär underrättelse- och säkerhetstjänst"
                }
              ]
            }
          ]
        },
        {
          id: "SCB14",
          label: "MATHEMATICS",
          note: "MATEMATIK",
          children: [
            {
              id: "SCB1401",
              label: "Algebra, geometry and mathematical analysis",
              note: "Algebra, geometri och analys",
              children: [
                {
                  id: "VR140102",
                  label: "Algebra and geometry",
                  note: "Algebra och geometri"
                },
                {
                  id: "VR140103",
                  label: "Mathematical analysis",
                  note: "Analys"
                },
                {
                  id: "VR140104",
                  label: "Mathematical logic",
                  note: "Matematisk logik"
                },
                {
                  id: "VR140105",
                  label: "Discrete mathematics",
                  note: "Diskret matematik"
                }
              ]
            },
            {
              id: "SCB1402",
              label: "Applied mathematics",
              note: "Tillämpad matematik",
              children: [
                {
                  id: "VR140202",
                  label: "Numerical analysis",
                  note: "Numerisk analys"
                },
                {
                  id: "VR140203",
                  label: "Mathematical statistics",
                  note: "Matematisk statistik"
                },
                {
                  id: "VR140204",
                  label: "Optimization, systems theory",
                  note: "Optimeringslära, systemteori"
                },
                {
                  id: "VR140205",
                  label: "Theoretical computer science",
                  note: "Teoretisk datalogi"
                }
              ]
            },
            {
              id: "SCB1409",
              label: "Other mathematics",
              note: "Övrig matematik"
            }
          ]
        },
        {
          id: "SCB15",
          label: "NATURAL SCIENCES",
          note: "NATURVETENSKAP",
          children: [
            {
              id: "SCB150",
              label: "Physics",
              note: "Fysik",
              children: [
                {
                  id: "SCB1501",
                  label: "Elementary particle physics",
                  note: "Elementarpartikelfysik",
                  children: [
                    {
                      id: "VR150102",
                      label: "Astroparticle physics",
                      note: "Astropartikelfysik"
                    },
                    {
                      id: "VR150103",
                      label: "Ion physics",
                      note: "Jonfysik"
                    }
                  ]
                },
                {
                  id: "SCB1502",
                  label: "Nuclear physics",
                  note: "Kärnfysik",
                  children: [
                    {
                      id: "VR150202",
                      label: "Heavy ion physics",
                      note: "Tungjonsfysik"
                    },
                    {
                      id: "VR150203",
                      label: "Middle energy physics",
                      note: "Mellanenergifysik"
                    },
                    {
                      id: "VR150204",
                      label: "Low energy physics",
                      note: "Lågenergifysik"
                    }
                  ]
                },
                {
                  id: "SCB1503",
                  label: "Atomic and molecular physics",
                  note: "Atom- och molekylfysik",
                  children: [
                    {
                      id: "VR150301",
                      label: "Atomic physics",
                      note: "Atomfysik"
                    },
                    {
                      id: "VR150302",
                      label: "Molecular physics",
                      note: "Molekylfysik"
                    },
                    {
                      id: "VR150303",
                      label: "Chemical physics",
                      note: "Kemisk fysik"
                    }
                  ]
                },
                {
                  id: "SCB1504",
                  label: "Condensed matter physics",
                  note: "Kondenserade materiens fysik",
                  children: [
                    {
                      id: "VR150401",
                      label: "Magnetism",
                      note: "Magnetism"
                    },
                    {
                      id: "VR150402",
                      label: "Surfaces and interfaces",
                      note: "Ytor och mellanytor"
                    },
                    {
                      id: "VR150403",
                      label: "Semiconductor physics",
                      note: "Halvledarfysik"
                    },
                    {
                      id: "VR150404",
                      label: "Electronic structure",
                      note: "Elektronstruktur"
                    },
                    {
                      id: "VR150405",
                      label: "Superconductivity",
                      note: "Supraledning"
                    },
                    {
                      id: "VR150406",
                      label: "Defects and diffusion",
                      note: "Defekter och diffusion"
                    },
                    {
                      id: "VR150407",
                      label: "Structural and vibration physics",
                      note: "Struktur- och vibrationsfysik"
                    },
                    {
                      id: "VR150408",
                      label: "Critical phenomena (phase transitions)",
                      note: "Kritiska fenomen (fasövergångar)"
                    },
                    {
                      id: "VR150409",
                      label: "Liquid physics",
                      note: "Vätskefysik"
                    },
                    {
                      id: "VR150410",
                      label: "Low temperature physics",
                      note: "Lågtemperaturfysik"
                    },
                    {
                      id: "VR150411",
                      label: "Macromolecular physics",
                      note: "Makromolekylfysik"
                    },
                    {
                      id: "VR150412",
                      label: "Mesoscopic physics",
                      note: "Mesoskopisk fysik"
                    },
                    {
                      id: "VR150413",
                      label: "Biological physics",
                      note: "Biologisk fysik"
                    }
                  ]
                },
                {
                  id: "SCB1505",
                  label: "Astronomy and astrophysics",
                  note: "Astronomi och astrofysik",
                  children: [
                    {
                      id: "VR150501",
                      label: "Astronomy",
                      note: "Astronomi"
                    },
                    {
                      id: "VR150502",
                      label: "Astroparticle physics",
                      note: "Astropartikelfysik"
                    },
                    {
                      id: "VR150503",
                      label: "High energy astrophysics",
                      note: "Högenergiastrofysik"
                    },
                    {
                      id: "VR150504",
                      label: "Solar physics",
                      note: "Solfysik"
                    },
                    {
                      id: "VR150505",
                      label: "Planetary system",
                      note: "Planetsystemet"
                    },
                    {
                      id: "VR150506",
                      label: "Galactical astronomy",
                      note: "Galaktisk astronomi"
                    },
                    {
                      id: "VR150507",
                      label: "Extragalactical astronomy",
                      note: "Extragalaktisk astronomi"
                    },
                    {
                      id: "VR150508",
                      label: "Formation and development of stars",
                      note: "Stjärnors bildning och utveckling"
                    },
                    {
                      id: "VR150509",
                      label: "Cosmology",
                      note: "Kosmologi"
                    }
                  ]
                },
                {
                  id: "SCB1506",
                  label: "Geocosmophysics and plasma physics",
                  note: "Geokosmofysik och plasmafysik",
                  children: [
                    {
                      id: "VR150601",
                      label: "Space physics",
                      note: "Rymdfysik"
                    },
                    {
                      id: "VR150602",
                      label: "Plasma physics",
                      note: "Plasmafysik"
                    },
                    {
                      id: "VR150603",
                      label: "Fusion",
                      note: "Fusion"
                    }
                  ]
                },
                {
                  id: "SCB1509",
                  label: "Other physics",
                  note: "Övrig fysik",
                  children: [
                    {
                      id: "VR150901",
                      label: "Optics",
                      note: "Optik"
                    },
                    {
                      id: "VR150902",
                      label: "Geophysics",
                      note: "Geofysik"
                    },
                    {
                      id: "VR150903",
                      label: "Mathematical physics",
                      note: "Matematisk fysik"
                    },
                    {
                      id: "VR150904",
                      label: "Computational physics",
                      note: "Beräkningsfysik"
                    },
                    {
                      id: "VR150905",
                      label: "Theory of relativity, gravitation",
                      note: "Relativitetsteori, gravitation"
                    },
                    {
                      id: "VR150906",
                      label: "Statistical physics",
                      note: "Statistisk fysik"
                    },
                    {
                      id: "VR150907",
                      label: "Non-linear dynamics, chaos",
                      note: "Icke-linjär dynamik, kaos"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB151",
              label: "Chemistry",
              note: "Kemi",
              children: [
                {
                  id: "SCB1511",
                  label: "Theoretical chemistry",
                  note: "Teoretisk kemi",
                  children: [
                    {
                      id: "VR151102",
                      label: "Quantum chemistry",
                      note: "Kvantkemi"
                    },
                    {
                      id: "VR151103",
                      label: "Statistical mechanics",
                      note: "Statistisk mekanik"
                    },
                    {
                      id: "VR151104",
                      label: "Bioinformatics",
                      note: "Bioinformatik"
                    }
                  ]
                },
                {
                  id: "SCB1512",
                  label: "Physical chemistry",
                  note: "Fysikalisk kemi",
                  children: [
                    {
                      id: "VR151202",
                      label: "Biophysical chemistry",
                      note: "Biofysikalisk kemi"
                    },
                    {
                      id: "VR151203",
                      label: "Kinetics",
                      note: "Kinetik"
                    },
                    {
                      id: "VR151204",
                      label: "Spectroscopy",
                      note: "Spektroskopi"
                    },
                    {
                      id: "VR151205",
                      label: "Surface and colloid chemistry",
                      note: "Yt- och kolloidkemi"
                    },
                    {
                      id: "VR151206",
                      label: "Chemical physics",
                      note: "Kemisk fysik"
                    }
                  ]
                },
                {
                  id: "SCB1513",
                  label: "Analytical chemistry",
                  note: "Analytisk kemi",
                  children: [
                    {
                      id: "VR151301",
                      label: "Separation methods",
                      note: "Separationsmetoder"
                    },
                    {
                      id: "VR151302",
                      label: "Electrochemistry",
                      note: "Elektrokemi"
                    },
                    {
                      id: "VR151303",
                      label: "Spectroscopy",
                      note: "Spektroskopi"
                    }
                  ]
                },
                {
                  id: "SCB1514",
                  label: "Molecular biophysics",
                  note: "Molekylär biofysik"
                },
                {
                  id: "SCB1515",
                  label: "Inorganic chemistry",
                  note: "Oorganisk kemi",
                  children: [
                    {
                      id: "VR151502",
                      label: "Coordination chemistry",
                      note: "Koordinationskemi"
                    },
                    {
                      id: "VR151503",
                      label: "Solution chemistry",
                      note: "Lösningskemi"
                    },
                    {
                      id: "VR151504",
                      label: "Solid state chemistry",
                      note: "Fasta tillståndets kemi"
                    },
                    {
                      id: "VR151505",
                      label: "Bio-inorganic chemistry",
                      note: "Bio-oorganisk kemi"
                    }
                  ]
                },
                {
                  id: "SCB1516",
                  label: "Organic chemistry",
                  note: "Organisk kemi",
                  children: [
                    {
                      id: "VR151602",
                      label: "Organic synthesis",
                      note: "Organisk syntes"
                    },
                    {
                      id: "VR151603",
                      label: "Physical organic chemistry",
                      note: "Fysikalisk organisk kemi"
                    },
                    {
                      id: "VR151604",
                      label: "Bioorganic chemistry",
                      note: "Bioorganisk kemi"
                    },
                    {
                      id: "VR151605",
                      label: "Polymer chemistry",
                      note: "Polymerkemi"
                    },
                    {
                      id: "VR151606",
                      label: "Pharmaceutical chemistry",
                      note: "Läkemedelskemi"
                    }
                  ]
                },
                {
                  id: "SCB1517",
                  label: "Biochemistry",
                  note: "Biokemi",
                  children: [
                    {
                      id: "VR151702",
                      label: "Molecular biology",
                      note: "Molekylärbiologi"
                    },
                    {
                      id: "VR151703",
                      label: "Toxicology",
                      note: "Toxikologi"
                    },
                    {
                      id: "VR151704",
                      label: "Structural biology",
                      note: "Strukturbiologi"
                    },
                    {
                      id: "VR151705",
                      label: "Functional genomics",
                      note: "Funktionsgenomik"
                    }
                  ]
                },
                {
                  id: "SCB1518",
                  label: "Environmental chemistry",
                  note: "Miljökemi",
                  children: [
                    {
                      id: "VR151801",
                      label: "Persistent organic compounds",
                      note: "Persistenta organiska föreningar"
                    },
                    {
                      id: "VR151802",
                      label: "Heavy metals and other metals",
                      note: "Tungmetaller och övriga metaller"
                    },
                    {
                      id: "VR151803",
                      label: "Environmental toxicology",
                      note: "Miljötoxikologi"
                    }
                  ]
                },
                {
                  id: "SCB1519",
                  label: "Other chemistry",
                  note: "Övrig kemi"
                }
              ]
            },
            {
              id: "SCB152",
              label: "Biology",
              note: "Biologi",
              children: [
                {
                  id: "SCB1521",
                  label: "Terrestrial, freshwater and marine ecology",
                  note: "Terrestisk, limnisk och marin ekologi",
                  children: [
                    {
                      id: "VR152101",
                      label: "Terrestrial ecology",
                      note: "Terrestisk ekologi"
                    },
                    {
                      id: "VR152102",
                      label: "Freshwater ecology",
                      note: "Limnisk ekologi"
                    },
                    {
                      id: "VR152103",
                      label: "Marine ecology",
                      note: "Marin ekologi"
                    },
                    {
                      id: "VR152104",
                      label: "Ethology and behavioural ecology",
                      note: "Etologi och beteendeekologi"
                    }
                  ]
                },
                {
                  id: "SCB1522",
                  label: "Organism biology",
                  note: "Organismbiologi",
                  children: [
                    {
                      id: "VR152201",
                      label: "Microbiology",
                      note: "Mikrobiologi"
                    },
                    {
                      id: "VR152202",
                      label: "Morphology",
                      note: "Morfologi"
                    },
                    {
                      id: "VR152203",
                      label: "Systematics and phylogenetics",
                      note: "Systematik och fylogeni"
                    },
                    {
                      id: "VR152204",
                      label: "Plant physiology",
                      note: "Växtfysiologi"
                    },
                    {
                      id: "VR152205",
                      label: "Animal physiology",
                      note: "Zoofysiologi"
                    },
                    {
                      id: "VR152206",
                      label: "Developmental biology",
                      note: "Utvecklingsbiologi"
                    }
                  ]
                },
                {
                  id: "SCB1523",
                  label: "Cell and molecular biology",
                  note: "Cell- och molekylärbiologi",
                  children: [
                    {
                      id: "VR152301",
                      label: "Cell biology",
                      note: "Cellbiologi"
                    },
                    {
                      id: "VR152302",
                      label: "Molecular biology",
                      note: "Molekylärbiologi"
                    },
                    {
                      id: "VR152303",
                      label: "Immunology",
                      note: "Immunologi"
                    },
                    {
                      id: "VR152304",
                      label: "Toxicology",
                      note: "Toxikologi"
                    },
                    {
                      id: "VR152305",
                      label: "Neurobiology",
                      note: "Neurobiologi"
                    },
                    {
                      id: "VR152306",
                      label: "Genetics",
                      note: "Genetik"
                    }
                  ]
                },
                {
                  id: "SCB1529",
                  label: "Other biology",
                  note: "Övrig biologi",
                  children: [
                    {
                      id: "VR152400",
                      label: "Bioinformatics",
                      note: "Bioinformatik"
                    },
                    {
                      id: "VR152500",
                      label: "Functional genomics",
                      note: "Funktionsgenomik"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB153",
              label: "Earth sciences",
              note: "Geovetenskap",
              children: [
                {
                  id: "SCB1531",
                  label: "Endogenous earth sciences",
                  note: "Endogen geovetenskap",
                  children: [
                    {
                      id: "VR153101",
                      label: "Solid earth geology and petrology",
                      note: "Berggrundsgeologi och petrologi"
                    },
                    {
                      id: "VR153102",
                      label: "Mineralogy",
                      note: "Mineralvetenskap"
                    },
                    {
                      id: "VR153103",
                      label: "Solid earth physics",
                      note: "Fasta jordens fysik"
                    }
                  ]
                },
                {
                  id: "SCB1532",
                  label: "Exogenous earth sciences",
                  note: "Exogen geovetenskap",
                  children: [
                    {
                      id: "VR153201",
                      label: "History of geology and palaeontology",
                      note: "Historisk geologi och paleontologi"
                    },
                    {
                      id: "VR153202",
                      label: "Quaternary geology",
                      note: "Kvartärgeologi"
                    },
                    {
                      id: "VR153203",
                      label: "Physical geography",
                      note: "Naturgeografi"
                    },
                    {
                      id: "VR153204",
                      label: "Exogenous geochemistry",
                      note: "Exogen geokemi"
                    },
                    {
                      id: "VR153205",
                      label: "Sedimentology",
                      note: "Sedimentologi"
                    }
                  ]
                },
                {
                  id: "SCB1533",
                  label: "Atmosphere and hydrosphere sciences",
                  note: "Atmosfärs- och hydrosfärsvetenskap",
                  children: [
                    {
                      id: "VR153301",
                      label: "Meteorology",
                      note: "Meteorologi"
                    },
                    {
                      id: "VR153302",
                      label: "Hydrology",
                      note: "Hydrologi"
                    },
                    {
                      id: "VR153303",
                      label: "Oceanography",
                      note: "Oceanografi"
                    },
                    {
                      id: "VR153304",
                      label: "Climatology",
                      note: "Klimatologi"
                    }
                  ]
                },
                {
                  id: "SCB1539",
                  label: "Other earth sciences",
                  note: "Övrig geovetenskap"
                }
              ]
            }
          ]
        },
        {
          id: "SCB16",
          label: "TECHNOLOGY",
          note: "TEKNIKVETENSKAP",
          children: [
            {
              id: "SCB160",
              label: "Information technology",
              note: "Informationsteknik",
              children: [
                {
                  id: "SCB1601",
                  label: "Computer science",
                  note: "Datavetenskap",
                  children: [
                    {
                      id: "VR160101",
                      label: "Computer science",
                      note: "Datalogi"
                    },
                    {
                      id: "VR160102",
                      label: "Software engineering",
                      note: "Programvaruteknik"
                    },
                    {
                      id: "VR160103",
                      label: "Cognitive science",
                      note: "Kognitionsvetenskap"
                    }
                  ]
                },
                {
                  id: "SCB1602",
                  label: "Automatic control",
                  note: "Reglerteknik"
                },
                {
                  id: "SCB1603",
                  label: "Telecommunication",
                  note: "Telekommunikation",
                  children: [
                    {
                      id: "VR160301",
                      label: "Telecommunication theory",
                      note: "Telekommunikationsteori"
                    },
                    {
                      id: "VR160302",
                      label: "Teletransmission theory",
                      note: "Teletransmissionsteori"
                    },
                    {
                      id: "VR160303",
                      label: "Teletraffic systems",
                      note: "Teletrafiksystem"
                    },
                    {
                      id: "VR160304",
                      label: "Datatransmission",
                      note: "Datatransmission"
                    }
                  ]
                },
                {
                  id: "SCB1604",
                  label: "Signal processing",
                  note: "Signalbehandling"
                },
                {
                  id: "SCB1605",
                  label: "Image analysis",
                  note: "Bildanalys"
                },
                {
                  id: "SCB1606",
                  label: "Computer engineering",
                  note: "Datorteknik"
                },
                {
                  id: "SCB1607",
                  label: "Systems engineering",
                  note: "Systemteknik"
                },
                {
                  id: "SCB1609",
                  label: "Other information technology",
                  note: "Övrig informationsteknik"
                }
              ]
            },
            {
              id: "SCB161",
              label: "Engineering physics",
              note: "Teknisk fysik",
              children: [
                {
                  id: "VR161101",
                  label: "Optical physics",
                  note: "Optisk fysik"
                },
                {
                  id: "VR161102",
                  label: "Acoustics",
                  note: "Akustik"
                },
                {
                  id: "VR161103",
                  label: "Material physics with surface physics",
                  note: "Materialfysik med ytfysik"
                },
                {
                  id: "VR161104",
                  label: "Plasma physics with fusion",
                  note: "Plasmafysik med fusion"
                },
                {
                  id: "VR161105",
                  label: "Biophysics",
                  note: "Biofysik"
                },
                {
                  id: "VR161900",
                  label: "Other engineering physics",
                  note: "Övrig teknisk fysik"
                }
              ]
            },
            {
              id: "SCB162",
              label: "Electrical engineering, electronics and photonics",
              note: "Elektroteknik, elektronik och fotonik",
              children: [
                {
                  id: "SCB1621",
                  label: "Electrical engineering",
                  note: "Elektroteknik"
                },
                {
                  id: "SCB1622",
                  label: "Electronics",
                  note: "Elektronik"
                },
                {
                  id: "SCB1623",
                  label: "Electrophysics",
                  note: "Elektrofysik"
                },
                {
                  id: "SCB1624",
                  label: "Photonics",
                  note: "Fotonik"
                },
                {
                  id: "SCB1625",
                  label: "Electronic measurement and instrumentation",
                  note: "Elektronisk mät- och apparatteknik"
                },
                {
                  id: "SCB1626",
                  label: "Electric power engineering",
                  note: "Elkraftteknik"
                },
                {
                  id: "SCB1629",
                  label: "Other electrical engineering, electronics and photonics",
                  note: "Övrig elektroteknik, elektronik och fotonik"
                }
              ]
            },
            {
              id: "SCB163",
              label: "Chemical engineering",
              note: "Kemiteknik",
              children: [
                {
                  id: "SCB1631",
                  label: "Chemical process and manufacturing engineering",
                  note: "Kemisk process- och produktionsteknik",
                  children: [
                    {
                      id: "VR163101",
                      label: "Process chemistry",
                      note: "Processkemi"
                    },
                    {
                      id: "VR163102",
                      label: "Catalysis",
                      note: "Katalys"
                    },
                    {
                      id: "VR163103",
                      label: "Molecular transport processes in chemical process engineering",
                      note: "Molekylära transportprocesser i kemisk processteknik"
                    },
                    {
                      id: "VR163104",
                      label: "Chemical energy engineering",
                      note: "Kemisk energiteknik"
                    },
                    {
                      id: "VR163105",
                      label: "Cellulose and paper engineering",
                      note: "Cellulosa- och pappersteknik"
                    },
                    {
                      id: "VR163106",
                      label: "Materials chemistry",
                      note: "Materialkemi"
                    },
                    {
                      id: "VR163107",
                      label: "Electrochemistry",
                      note: "Elektrokemi"
                    },
                    {
                      id: "VR163108",
                      label: "Surface and colloid chemistry",
                      note: "Yt- och kolloidkemi"
                    },
                    {
                      id: "VR163109",
                      label: "Nuclear chemistry",
                      note: "Kärnkemi"
                    },
                    {
                      id: "VR163110",
                      label: "Chemical process equipment",
                      note: "Kemisk apparatteknik"
                    },
                    {
                      id: "VR163111",
                      label: "Chemical manufacturing engineering",
                      note: "Kemisk produktionsteknik"
                    }
                  ]
                },
                {
                  id: "SCB1632",
                  label: "Metallurgical process and manufacturing engineering",
                  note: "Metallurgisk process- och produktionsteknik",
                  children: [
                    {
                      id: "VR163201",
                      label: "Metallurgical process engineering",
                      note: "Metallurgisk processteknik"
                    },
                    {
                      id: "VR163202",
                      label: "Metallurgical manufacturing engineering",
                      note: "Metallurgisk produktionsteknik"
                    }
                  ]
                },
                {
                  id: "SCB1633",
                  label: "Food technology",
                  note: "Livsmedelsteknik"
                },
                {
                  id: "SCB1639",
                  label: "Other chemical engineering",
                  note: "Övrig kemiteknik"
                }
              ]
            },
            {
              id: "SCB164",
              label: "Bioengineering",
              note: "Bioteknik",
              children: [
                {
                  id: "VR164101",
                  label: "Genetic engineering including functional genomics",
                  note: "Genteknik inkl. funktionsgenomik"
                },
                {
                  id: "VR164102",
                  label: "Structural biochemistry",
                  note: "Strukturbiokemi"
                },
                {
                  id: "VR164103",
                  label: "Biochemical process engineering",
                  note: "Biokemisk och bioteknisk processteknik"
                },
                {
                  id: "VR164104",
                  label: "Enzyme engineering",
                  note: "Enzymteknik"
                },
                {
                  id: "VR164105",
                  label: "Immunology engineering",
                  note: "Immunteknik"
                },
                {
                  id: "VR164106",
                  label: "Biotechnological separation",
                  note: "Bioteknisk separation"
                },
                {
                  id: "VR164107",
                  label: "Bioanalytical engineering",
                  note: "Bioanalytisk teknik"
                },
                {
                  id: "VR164108",
                  label: "Bioorganical synthesis",
                  note: "Bioorganisk syntes"
                },
                {
                  id: "VR164109",
                  label: "Plant biotechnology",
                  note: "Växtbioteknik"
                },
                {
                  id: "VR164110",
                  label: "Bioinformatics",
                  note: "Bioinformatik"
                },
                {
                  id: "VR164900",
                  label: "Other bioengineering",
                  note: "Övrig bioteknik"
                }
              ]
            },
            {
              id: "SCB165",
              label: "Engineering mechanics",
              note: "Teknisk mekanik",
              children: [
                {
                  id: "SCB1651",
                  label: "Solid mechanics",
                  note: "Fastkroppsmekanik"
                },
                {
                  id: "SCB1652",
                  label: "Fluid mechanics",
                  note: "Strömningsmekanik"
                },
                {
                  id: "SCB1653",
                  label: "Construction engineering",
                  note: "Konstruktionsteknik"
                },
                {
                  id: "SCB1654",
                  label: "Mechanical manufacturing engineering",
                  note: "Mekanisk tillverkningsteknik"
                },
                {
                  id: "SCB1655",
                  label: "Mechanical and thermal engineering",
                  note: "Mekanisk och termisk energiteknik",
                  children: [
                    {
                      id: "VR165501",
                      label: "Mechanical energy engineering",
                      note: "Mekanisk energiteknik"
                    },
                    {
                      id: "VR165502",
                      label: "Thermal energy engineering",
                      note: "Termisk energiteknik"
                    }
                  ]
                },
                {
                  id: "SCB1656",
                  label: "Vehicle engineering",
                  note: "Farkostteknik"
                },
                {
                  id: "SCB1659",
                  label: "Other engineering mechanics",
                  note: "Övrig teknisk mekanik"
                }
              ]
            },
            {
              id: "SCB166",
              label: "Materials science",
              note: "Teknisk materialvetenskap",
              children: [
                {
                  id: "SCB1661",
                  label: "Functional materials",
                  note: "Funktionella material"
                },
                {
                  id: "SCB1662",
                  label: "Construction materials",
                  note: "Konstruktionsmaterial"
                },
                {
                  id: "SCB1663",
                  label: "Surface engineering",
                  note: "Ytbehandlingsteknik"
                },
                {
                  id: "SCB1664",
                  label: "Other processing/assembly",
                  note: "Övrig bearbetning/sammanfogning"
                },
                {
                  id: "SCB1669",
                  label: "Other materials science",
                  note: "Övrig teknisk materialvetenskap"
                }
              ]
            },
            {
              id: "SCB167",
              label: "Civil engineering and architecture",
              note: "Samhällsbyggnadsteknik och arkitektur",
              children: [
                {
                  id: "SCB1671",
                  label: "Geoengineering and mining engineering",
                  note: "Geoteknik och gruvteknik",
                  children: [
                    {
                      id: "VR167101",
                      label: "Geoengineering",
                      note: "Geoteknik"
                    },
                    {
                      id: "VR167102",
                      label: "Mining engineering",
                      note: "Gruvteknik"
                    }
                  ]
                },
                {
                  id: "SCB1672",
                  label: "Building engineering",
                  note: "Byggnadsteknik"
                },
                {
                  id: "SCB1673",
                  label: "Building manufacturing engineering",
                  note: "Byggproduktionsteknik"
                },
                {
                  id: "SCB1674",
                  label: "Water engineering",
                  note: "Vattenteknik"
                },
                {
                  id: "SCB1675",
                  label: "Surveying",
                  note: "Lantmäteri"
                },
                {
                  id: "SCB1676",
                  label: "Architecture and architectural conservation and restoration",
                  note: "Arkitektur och bebyggelsevård",
                  children: [
                    {
                      id: "VR167601",
                      label: "Architecture",
                      note: "Arkitektur"
                    },
                    {
                      id: "VR167602",
                      label: "Architectural conservation and restoration",
                      note: "Bebyggelsevård"
                    }
                  ]
                },
                {
                  id: "SCB1679",
                  label: "Other civil engineering and architecture",
                  note: "Övrig samhällsbyggnadsteknik och arkitektur"
                }
              ]
            },
            {
              id: "SCB168",
              label: "Industrial engineering and economy",
              note: "Industriell teknik och ekonomi",
              children: [
                {
                  id: "SCB1681",
                  label: "Manufacturing engineering and work sciences",
                  note: "Produktion och arbetsvetenskap",
                  children: [
                    {
                      id: "VR168101",
                      label: "Manufacturing engineering",
                      note: "Produktionsteknik"
                    },
                    {
                      id: "VR168102",
                      label: "Work sciences and ergonomics",
                      note: "Arbetsvetenskap och ergonomi"
                    }
                  ]
                },
                {
                  id: "SCB1682",
                  label: "Industrial organisation, administration and economics",
                  note: "Industriell organisation, administration och ekonomi"
                },
                {
                  id: "SCB1683",
                  label: "Physical planning",
                  note: "Fysisk planläggning"
                },
                {
                  id: "SCB1689",
                  label: "Other industrial engineering and economics",
                  note: "Övrig industriell teknik och ekonomi"
                }
              ]
            },
            {
              id: "SCB169",
              label: "Other technology",
              note: "Övriga teknikvetenskaper",
              children: [
                {
                  id: "SCB1691",
                  label: "Medical engineering",
                  note: "Medicinsk teknik"
                },
                {
                  id: "SCB1692",
                  label: "Environmental engineering",
                  note: "Miljöteknik"
                },
                {
                  id: "SCB1693",
                  label: "Space engineering",
                  note: "Rymdteknik"
                }
              ]
            }
          ]
        },
        {
          id: "SCB17",
          label: "FORESTRY, AGRICULTURAL SCIENCES and LANDSCAPE PLANNING",
          note: "SKOGS- och JORDBRUKSVETENSKAP samt LANDSKAPSPLANERING",
          children: [
            {
              id: "SCB171",
              label: "Soil science",
              note: "Markvetenskap",
              children: [
                {
                  id: "SCB1711",
                  label: "Soil physics",
                  note: "Markfysik"
                },
                {
                  id: "SCB1712",
                  label: "Soil chemistry",
                  note: "Markkemi"
                },
                {
                  id: "SCB1713",
                  label: "Soil biology",
                  note: "Markbiologi"
                },
                {
                  id: "SCB1714",
                  label: "Pedology",
                  note: "Jordmånslära"
                }
              ]
            },
            {
              id: "SCB172",
              label: "Plant production",
              note: "Växtproduktion",
              children: [
                {
                  id: "SCB1721",
                  label: "Plant breeding",
                  note: "Växtförädling"
                },
                {
                  id: "SCB1722",
                  label: "Horticulture",
                  note: "Trädgårdsväxtodling"
                },
                {
                  id: "SCB1723",
                  label: "Agronomy",
                  note: "Jordbruksväxtodling"
                },
                {
                  id: "SCB1724",
                  label: "Forestry",
                  note: "Skogsskötsel"
                },
                {
                  id: "SCB1725",
                  label: "Plant and forest protection",
                  note: "Växt- och skogsskydd"
                }
              ]
            },
            {
              id: "SCB173",
              label: "Animal production",
              note: "Animalieproduktion",
              children: [
                {
                  id: "SCB1731",
                  label: "Animal breeding",
                  note: "Husdjursförädling"
                },
                {
                  id: "SCB1732",
                  label: "Animal nutrition and management",
                  note: "Husdjurens utfodring och vård"
                },
                {
                  id: "SCB1733",
                  label: "Aquaculture",
                  note: "Vattenbruk"
                },
                {
                  id: "SCB1734",
                  label: "Fishery",
                  note: "Fiske"
                }
              ]
            },
            {
              id: "SCB174",
              label: "Product science",
              note: "Produktforskning",
              children: [
                {
                  id: "SCB1741",
                  label: "Food science",
                  note: "Livsmedelsvetenskap"
                },
                {
                  id: "SCB1742",
                  label: "Wood fibre and forest products",
                  note: "Träfiber- och virkeslära"
                },
                {
                  id: "SCB1743",
                  label: "Phytochemistry including algae and industrial bio-raw materials",
                  note: "Fytokemi inklusive alger och industribioråvaror"
                }
              ]
            },
            {
              id: "SCB175",
              label: "Landscape planning",
              note: "Landskapsplanering",
              children: [
                {
                  id: "SCB1751",
                  label: "Landscape architecture",
                  note: "Landskapsarkitektur"
                },
                {
                  id: "SCB1752",
                  label: "Planting design",
                  note: "Vegetationsbyggnad"
                },
                {
                  id: "SCB1753",
                  label: "Nature conservation and landscape management",
                  note: "Natur- och landskapsvård"
                },
                {
                  id: "SCB1754",
                  label: "Comprehensive planning",
                  note: "Översiktlig planering"
                }
              ]
            },
            {
              id: "SCB176",
              label: "Area technology",
              note: "Areell teknik",
              children: [
                {
                  id: "SCB1761",
                  label: "Agricultural engineering",
                  note: "Jordbruksteknik"
                },
                {
                  id: "SCB1762",
                  label: "Agricultural building engineering",
                  note: "Jordbrukets byggnadsteknik"
                },
                {
                  id: "SCB1763",
                  label: "Forest engineering",
                  note: "Skogsteknik"
                },
                {
                  id: "SCB1764",
                  label: "Remote sensing",
                  note: "Fjärranalys"
                }
              ]
            },
            {
              id: "SCB177",
              label: "Area economics",
              note: "Areell ekonomi",
              children: [
                {
                  id: "SCB1771",
                  label: "Agricultural economics",
                  note: "Jordbruksekonomi"
                },
                {
                  id: "SCB1772",
                  label: "Forest economics",
                  note: "Skogsekonomi"
                },
                {
                  id: "SCB1773",
                  label: "Forest mensuration",
                  note: "Skogsuppskattning och skogsindelning"
                },
                {
                  id: "SCB1774",
                  label: "Information science",
                  note: "Informationslära"
                }
              ]
            }
          ]
        },
        {
          id: "SCB18",
          label: "MEDICINE",
          note: "MEDICIN",
          children: [
            {
              id: "SCB180",
              label: "Surgery",
              note: "Kirurgi",
              children: [
                {
                  id: "SCB1801",
                  label: "Anaesthetics and intensive care",
                  note: "Anestesiologi och intensivvård",
                  children: [
                    {
                      id: "VR180101",
                      label: "Anaesthetics",
                      note: "Anestesiologi"
                    },
                    {
                      id: "VR180102",
                      label: "Intensive care",
                      note: "Intensivvård"
                    },
                    {
                      id: "VR180103",
                      label: "Diasaster medicine",
                      note: "Katastrofmedicin"
                    },
                    {
                      id: "VR180104",
                      label: "Traumatology",
                      note: "Traumatologi"
                    }
                  ]
                },
                {
                  id: "SCB1802",
                  label: "Surgical research",
                  note: "Kirurgisk forskning",
                  children: [
                    {
                      id: "VR180201",
                      label: "Endocrine surgery",
                      note: "Endokrin kirurgi"
                    },
                    {
                      id: "VR180202",
                      label: "Hand surgery",
                      note: "Handkirurgi"
                    },
                    {
                      id: "VR180203",
                      label: "Surgery",
                      note: "Kirurgi"
                    },
                    {
                      id: "VR180204",
                      label: "Vascular surgery",
                      note: "Kärlkirurgi"
                    },
                    {
                      id: "VR180205",
                      label: "Neurosurgery",
                      note: "Neurokirurgi"
                    },
                    {
                      id: "VR180206",
                      label: "Orthopaedics",
                      note: "Ortopedi"
                    },
                    {
                      id: "VR180207",
                      label: "Otoneurology",
                      note: "Otoneurologi"
                    },
                    {
                      id: "VR180208",
                      label: "Pediatric surgery",
                      note: "Pediatrisk kirurgi"
                    },
                    {
                      id: "VR180209",
                      label: "Plastic surgery",
                      note: "Plastikkirurgi"
                    },
                    {
                      id: "VR180210",
                      label: "Thoracic surgery",
                      note: "Thoraxkirurgi"
                    },
                    {
                      id: "VR180211",
                      label: "Transplantation surgery",
                      note: "Transplantationskirurgi"
                    },
                    {
                      id: "VR180212",
                      label: "Urology and andrology",
                      note: "Urologi och andrologi"
                    }
                  ]
                },
                {
                  id: "SCB1803",
                  label: "Obstetrics and women's diseases",
                  note: "Obstetrik och kvinnosjukdomar",
                  children: [
                    {
                      id: "VR180301",
                      label: "Obstetrics and gynaecology",
                      note: "Obstetrik och gynekologi"
                    },
                    {
                      id: "VR180302",
                      label: "Reproductive health",
                      note: "Reproduktiv hälsa"
                    },
                    {
                      id: "VR180303",
                      label: "Reproductive and perinatal care",
                      note: "Reproduktiv och perinatal omvårdnad"
                    }
                  ]
                },
                {
                  id: "SCB1804",
                  label: "Oncology",
                  note: "Onkologi"
                },
                {
                  id: "SCB1805",
                  label: "Otorhinolaryngology",
                  note: "Otorhinolaryngologi",
                  children: [
                    {
                      id: "VR180502",
                      label: "Audiology",
                      note: "Audiologi"
                    },
                    {
                      id: "VR180503",
                      label: "Logopedics and phoniatrics",
                      note: "Logopedi och foniatrik"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB181",
              label: "Morphology, cell biology, pathology",
              note: "Morfologi, cellbiologi, patologi",
              children: [
                {
                  id: "SCB1811",
                  label: "Cell biology",
                  note: "Cellbiologi",
                  children: [
                    {
                      id: "VR181101",
                      label: "Neuroscience",
                      note: "Neurovetenskap"
                    },
                    {
                      id: "VR181102",
                      label: "Neurobiology",
                      note: "Neurobiologi"
                    },
                    {
                      id: "VR181103",
                      label: "Medical cell biology",
                      note: "Medicinsk cellbiologi"
                    }
                  ]
                },
                {
                  id: "SCB1812",
                  label: "Morphology",
                  note: "Morfologi",
                  children: [
                    {
                      id: "VR181201",
                      label: "Anatomy",
                      note: "Anatomi"
                    },
                    {
                      id: "VR181202",
                      label: "Biomaterials",
                      note: "Biomaterial"
                    },
                    {
                      id: "VR181203",
                      label: "Histology",
                      note: "Histologi"
                    },
                    {
                      id: "VR181204",
                      label: "Tumour biology",
                      note: "Tumörbiologi"
                    }
                  ]
                },
                {
                  id: "SCB1813",
                  label: "Pathology",
                  note: "Patologi",
                  children: [
                    {
                      id: "VR181302",
                      label: "Forensic medicine",
                      note: "Rättsmedicin"
                    },
                    {
                      id: "VR181303",
                      label: "Molecular medicine",
                      note: "Molekylär medicin"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB182",
              label: "Dermatology and venerology,clinical genetics, internal medicine",
              note: "Dermatologi och venerologi, klinisk genetik, invärtesmedicin",
              children: [
                {
                  id: "SCB1821",
                  label: "Dermatology and venerology",
                  note: "Dermatologi och venerologi"
                },
                {
                  id: "SCB1822",
                  label: "Clinical genetics",
                  note: "Klinisk genetik",
                  children: [
                    {
                      id: "VR182202",
                      label: "Medical genetics",
                      note: "Medicinsk genetik"
                    },
                    {
                      id: "VR182203",
                      label: "Forensic genetics",
                      note: "Rättsgenetik"
                    },
                    {
                      id: "VR182204",
                      label: "Molecular biology",
                      note: "Molekylärbiologi"
                    },
                    {
                      id: "VR182205",
                      label: "Molecular ecogenetics",
                      note: "Molekykär ekogenetik"
                    }
                  ]
                },
                {
                  id: "SCB1823",
                  label: "Internal medicine",
                  note: "Invärtesmedicin",
                  children: [
                    {
                      id: "VR182302",
                      label: "Paediatric cardiology",
                      note: "Barnkardiologi"
                    },
                    {
                      id: "VR182303",
                      label: "Diabetology",
                      note: "Diabetologi"
                    },
                    {
                      id: "VR182304",
                      label: "Endocrinology",
                      note: "Endokrinologi"
                    },
                    {
                      id: "VR182305",
                      label: "Gastroenterology",
                      note: "Gastroenterologi"
                    },
                    {
                      id: "VR182306",
                      label: "Geriatrics and medical gerontology",
                      note: "Geriatrik och medicinsk gerontologi"
                    },
                    {
                      id: "VR182307",
                      label: "Haematology",
                      note: "Hematologi"
                    },
                    {
                      id: "VR182308",
                      label: "Cardiology",
                      note: "Kardiologi"
                    },
                    {
                      id: "VR182309",
                      label: "Cardiovascular medicine",
                      note: "Kardiovaskulär medicin"
                    },
                    {
                      id: "VR182310",
                      label: "Lung diseases",
                      note: "Lungsjukdomar"
                    },
                    {
                      id: "VR182311",
                      label: "Molecular medicine (genetics and pathology)",
                      note: "Molekylär medicin (genetik och patologi)"
                    },
                    {
                      id: "VR182312",
                      label: "Neurology",
                      note: "Neurologi"
                    },
                    {
                      id: "VR182313",
                      label: "Kidney diseases",
                      note: "Njursjukdomar"
                    },
                    {
                      id: "VR182314",
                      label: "Palliative medicine",
                      note: "Palliativ medicin"
                    },
                    {
                      id: "VR182315",
                      label: "Paediatric medicine",
                      note: "Pediatrisk medicin"
                    },
                    {
                      id: "VR182316",
                      label: "Prenatal and perinatal research",
                      note: "Prenatal- och perinatalforskning"
                    },
                    {
                      id: "VR182317",
                      label: "Rheumatology",
                      note: "Reumatologi"
                    },
                    {
                      id: "VR182318",
                      label: "Transfusion medicine",
                      note: "Transfusionsmedicin"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB183",
              label: "Physiology and pharmacology",
              note: "Fysiologi och farmakologi",
              children: [
                {
                  id: "SCB1831",
                  label: "Pharmacological research",
                  note: "Farmakologisk forskning",
                  children: [
                    {
                      id: "VR183101",
                      label: "Pharmacology",
                      note: "Farmakologi"
                    },
                    {
                      id: "VR183102",
                      label: "Clinical pharmacology",
                      note: "Klinisk farmakologi"
                    },
                    {
                      id: "VR183103",
                      label: "Toxicology",
                      note: "Toxikologi"
                    }
                  ]
                },
                {
                  id: "SCB1832",
                  label: "Physiology",
                  note: "Fysiologi",
                  children: [
                    {
                      id: "VR183201",
                      label: "Experimental brain research",
                      note: "Experimentell hjärnforskning"
                    },
                    {
                      id: "VR183203",
                      label: "Laboratory animal science",
                      note: "Försöksdjursvetenskap"
                    },
                    {
                      id: "VR183204",
                      label: "Clinical physiology",
                      note: "Klinisk fysiologi"
                    },
                    {
                      id: "VR183205",
                      label: "Clinical neurophysiology",
                      note: "Klinisk neurofysiologi"
                    },
                    {
                      id: "VR183206",
                      label: "Medical informatics",
                      note: "Medicinsk informatik"
                    },
                    {
                      id: "VR183207",
                      label: "Medical technology",
                      note: "Medicinsk teknik"
                    },
                    {
                      id: "VR183208",
                      label: "Molecular neurobiology",
                      note: "Molekylär neurobiologi"
                    },
                    {
                      id: "VR183209",
                      label: "Neurobiology",
                      note: "Neurobiologi"
                    },
                    {
                      id: "VR183210",
                      label: "Neurophysiology",
                      note: "Neurofysiologi"
                    },
                    {
                      id: "VR183211",
                      label: "Nutrition",
                      note: "Näringslära"
                    }
                  ]
                },
                {
                  id: "SCB1833",
                  label: "Ophtalmology",
                  note: "Oftalmologi",
                  children: [
                    {
                      id: "VR183302",
                      label: "Ophtalmiatrics",
                      note: "Oftalmiatrik"
                    },
                    {
                      id: "VR183303",
                      label: "Optometry",
                      note: "Optometri"
                    }
                  ]
                },
                {
                  id: "SCB1834",
                  label: "Radiological research",
                  note: "Radiologisk forskning",
                  children: [
                    {
                      id: "VR183401",
                      label: "Radiology",
                      note: "Radiologi"
                    },
                    {
                      id: "VR183402",
                      label: "Diagnostic radiology",
                      note: "Diagnostisk radiologi"
                    },
                    {
                      id: "VR183403",
                      label: "Radiological physics",
                      note: "Radiofysik"
                    },
                    {
                      id: "VR183404",
                      label: "Radiation biology",
                      note: "Strålningsbiologi"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB184",
              label: "Social medicine",
              note: "Socialmedicin",
              children: [
                {
                  id: "SCB1841",
                  label: "Public health medicine research areas",
                  note: "Folkhälsomedicinska forskningsområden",
                  children: [
                    {
                      id: "VR184101",
                      label: "Family medicine",
                      note: "Allmänmedicin"
                    },
                    {
                      id: "VR184102",
                      label: "Occupational physiology",
                      note: "Arbetsfysiologi"
                    },
                    {
                      id: "VR184103",
                      label: "Epidemiology",
                      note: "Epidemiologi"
                    },
                    {
                      id: "VR184104",
                      label: "Public health science",
                      note: "Folkhälsovetenskap"
                    },
                    {
                      id: "VR184105",
                      label: "Environmental medicine",
                      note: "Miljömedicin"
                    },
                    {
                      id: "VR184106",
                      label: "Community medicine",
                      note: "Samhällsmedicin"
                    },
                    {
                      id: "VR184108",
                      label: "Occupational medicine",
                      note: "Yrkesmedicin"
                    }
                  ]
                }
              ]
            },
            {
              id: "SCB185",
              label: "Microbiology, immunology, infectious diseases",
              note: "Mikrobiologi, immunologi, infektionssjukdomar",
              children: [
                {
                  id: "SCB1851",
                  label: "Immunology",
                  note: "Immunologi",
                  children: [
                    {
                      id: "VR185101",
                      label: "Allergology",
                      note: "Allergologi"
                    },
                    {
                      id: "VR185102",
                      label: "Immunogenetics",
                      note: "Immungenetik"
                    },
                    {
                      id: "VR185104",
                      label: "Immunobiology",
                      note: "Immunbiologi"
                    },
                    {
                      id: "VR185105",
                      label: "Clinical immunology",
                      note: "Klinisk immunologi"
                    },
                    {
                      id: "VR185106",
                      label: "Tumour immunology",
                      note: "Tumörimmunologi"
                    }
                  ]
                },
                {
                  id: "SCB1852",
                  label: "Microbiology",
                  note: "Mikrobiologi",
                  children: [
                    {
                      id: "VR185201",
                      label: "Bacteriology",
                      note: "Bakteriologi"
                    },
                    {
                      id: "VR185202",
                      label: "Clinical bacteriology",
                      note: "Klinisk bakteriologi"
                    },
                    {
                      id: "VR185203",
                      label: "Clinical virology",
                      note: "Klinisk virologi"
                    },
                    {
                      id: "VR185204",
                      label: "Medical microbiology",
                      note: "Medicinsk mikrobiologi"
                    },
                    {
                      id: "VR185205",
                      label: "Virology",
                      note: "Virologi"
                    }
                  ]
                },
                {
                  id: "SCB1853",
                  label: "Infectious diseases",
                  note: "Infektionssjukdomar"
                }
              ]
            },
            {
              id: "SCB186",
              label: "Chemistry",
              note: "Kemi",
              children: [
                {
                  id: "VR186101",
                  label: "Biochemistry",
                  note: "Biokemi"
                },
                {
                  id: "VR186102",
                  label: "Clinical chemistry",
                  note: "Klinisk kemi"
                },
                {
                  id: "VR186103",
                  label: "Neurochemistry",
                  note: "Neurokemi"
                },
                {
                  id: "VR186104",
                  label: "Forensic chemistry",
                  note: "Rättskemi"
                }
              ]
            },
            {
              id: "SCB187",
              label: "Psychiatry",
              note: "Psykiatri",
              children: [
                {
                  id: "VR187101",
                  label: "Child and adolescent psychiatry",
                  note: "Barn- och ungdomspsykiatri"
                },
                {
                  id: "VR187102",
                  label: "Addiction medicine",
                  note: "Beroendelära"
                }
              ]
            }
          ]
        },
        {
          id: "SCB19",
          label: "ODONTOLOGY",
          note: "ODONTOLOGI",
          children: [
            {
              id: "SCB1901",
              label: "Biochemistry",
              note: "Biokemi"
            },
            {
              id: "SCB1902",
              label: "Biomaterials",
              note: "Biomaterial"
            },
            {
              id: "SCB1903",
              label: "Cariology",
              note: "Cariologi"
            },
            {
              id: "SCB1904",
              label: "Cell and  molecular biology",
              note: "Cell- och molekylärbiologi"
            },
            {
              id: "SCB1905",
              label: "Endodontology",
              note: "Endodonti"
            },
            {
              id: "SCB1906",
              label: "Pharmacological research",
              note: "Farmakologisk forskning"
            },
            {
              id: "SCB1907",
              label: "Physiology",
              note: "Fysiologi"
            },
            {
              id: "SCB1908",
              label: "Gerodontology",
              note: "Gerodontologi"
            },
            {
              id: "SCB1911",
              label: "Surgical research",
              note: "Kirurgisk forskning"
            },
            {
              id: "SCB1912",
              label: "Morphology",
              note: "Morfologi"
            },
            {
              id: "SCB1913",
              label: "Odontological behavioural science",
              note: "Odontologisk beteendevetenskap"
            },
            {
              id: "SCB1914",
              label: "Oral microbiology",
              note: "Oral mikrobiologi"
            },
            {
              id: "SCB1915",
              label: "Oral pathology and forensic odontology",
              note: "Oral patologi och rättsodontologi"
            },
            {
              id: "SCB1916",
              label: "Oral prosthetics",
              note: "Oral protetik"
            },
            {
              id: "SCB1917",
              label: "Orthodontics",
              note: "Ortodonti"
            },
            {
              id: "SCB1918",
              label: "Periodontology",
              note: "Parodontologi"
            },
            {
              id: "SCB1921",
              label: "Paedodontics",
              note: "Pedodonti"
            },
            {
              id: "SCB1922",
              label: "Radiological research",
              note: "Radiologisk forskning"
            },
            {
              id: "SCB1929",
              label: "Other odontology",
              note: "Övrig odontologi"
            }
          ]
        },
        {
          id: "SCB21",
          label: "PHARMACY",
          note: "FARMACI",
          children: [
            {
              id: "SCB2101",
              label: "Biopharmacy",
              note: "Biofarmaci"
            },
            {
              id: "SCB2102",
              label: "Biological research on drug dependence",
              note: "Biologisk beroendeforskning"
            },
            {
              id: "SCB2103",
              label: "Pharmaceutical biochemistry",
              note: "Farmaceutisk biokemi"
            },
            {
              id: "SCB2104",
              label: "Pharmaceutical pharmacology",
              note: "Farmaceutisk farmakologi"
            },
            {
              id: "SCB2105",
              label: "Pharmaceutical chemistry",
              note: "Farmaceutisk kemi"
            },
            {
              id: "SCB2106",
              label: "Pharmaceutical microbiology",
              note: "Farmaceutisk mikrobiologi"
            },
            {
              id: "SCB2107",
              label: "Toxicology",
              note: "Toxikologi"
            },
            {
              id: "SCB2108",
              label: "Pharmacognosy",
              note: "Farmakognosi"
            },
            {
              id: "SCB2111",
              label: "Pharmaceutics",
              note: "Galenisk farmaci"
            },
            {
              id: "SCB2112",
              label: "Community pharmacy services",
              note: "Samhällsfarmaci"
            },
            {
              id: "SCB2119",
              label: "Other pharmacy",
              note: "Övrig farmaci"
            }
          ]
        },
        {
          id: "SCB22",
          label: "VETERINARY MEDICINE",
          note: "VETERINÄRMEDICIN",
          children: [
            {
              id: "SCB2201",
              label: "Biochemistry and clinical chemistry",
              note: "Biokemi och klinisk kemi"
            },
            {
              id: "SCB2202",
              label: "Cell biology and genome research",
              note: "Cellbiologi och genomforskning"
            },
            {
              id: "SCB2203",
              label: "Ethology of domestic animals",
              note: "Husdjurens etologi"
            },
            {
              id: "SCB2204",
              label: "Pharmacological research",
              note: "Farmakologisk forskning"
            },
            {
              id: "SCB2205",
              label: "Physiology and nutrition",
              note: "Fysiologi och näringslära"
            },
            {
              id: "SCB2206",
              label: "Animal hygiene",
              note: "Husdjurshygien"
            },
            {
              id: "SCB2207",
              label: "Surgery",
              note: "Kirurgi"
            },
            {
              id: "SCB2208",
              label: "Food hygiene",
              note: "Livsmedelshygien"
            },
            {
              id: "SCB2211",
              label: "Medicine",
              note: "Medicin"
            },
            {
              id: "SCB2212",
              label: "Microbiology and immunology",
              note: "Mikrobiologi och immunologi"
            },
            {
              id: "SCB2213",
              label: "Morphology",
              note: "Morfologi"
            },
            {
              id: "SCB2214",
              label: "Obstetrics and gynaecology",
              note: "Obstetrik och gynekologi"
            },
            {
              id: "SCB2215",
              label: "Pathology",
              note: "Patologi"
            },
            {
              id: "SCB2216",
              label: "Radiology",
              note: "Radiologi"
            },
            {
              id: "SCB2217",
              label: "Veterinary epidemiology",
              note: "Veterinärmedicinsk epidemiologi"
            },
            {
              id: "SCB2219",
              label: "Other veterinary medicine",
              note: "Övrig veterinärmedicin"
            }
          ]
        },
        {
          id: "SCB23",
          label: "INTERDISCIPLINARY RESEARCH AREAS",
          note: "TVÄRVETENSKAPLIGA FORSKNINGSOMRÅDEN",
          children: [
            {
              id: "SCB231",
              label: "Children",
              note: "Barn"
            },
            {
              id: "SCB232",
              label: "Domestic science and nutrition",
              note: "Hushålls- och kostvetenskap"
            },
            {
              id: "SCB233",
              label: "Health and medical services in society",
              note: "Hälso- och sjukvård i samhället"
            },
            {
              id: "SCB234",
              label: "Human communication",
              note: "Kommunikation mellan människor"
            },
            {
              id: "SCB235",
              label: "Technology and social change",
              note: "Teknik och social förändring"
            },
            {
              id: "SCB236",
              label: "Water in nature and society",
              note: "Vatten i natur och samhälle"
            },
            {
              id: "SCB237",
              label: "Caring sciences",
              note: "Vårdvetenskap",
              children: [
                {
                  id: "SCB2371",
                  label: "Occupational therapy",
                  note: "Arbetsterapi"
                },
                {
                  id: "SCB2372",
                  label: "Medical laboratory science",
                  note: "Medicinsk laboratorievetenskap"
                },
                {
                  id: "SCB2373",
                  label: "Nursing",
                  note: "Omvårdnad"
                },
                {
                  id: "SCB2374",
                  label: "Physiotherapy",
                  note: "Sjukgymnastik/fysioterapi"
                },
                {
                  id: "SCB2375",
                  label: "Social welfare/social pedagogics",
                  note: "Social omsorg/socialpedagogik"
                },
                {
                  id: "SCB2376",
                  label: "Theory of science regarding care and  nursing",
                  note: "Vetenskapsteori med inriktning mot vård- och omsorgsområdet"
                }
              ]
            },
            {
              id: "SCB238",
              label: "Ethnicity",
              note: "Etnicitet"
            },
            {
              id: "SCB239",
              label: "Gender studies",
              note: "Genus"
            },
            {
              id: "SCB241",
              label: "Cultural heritage and cultural production",
              note: "Kulturarv och kulturproduktion"
            },
            {
              id: "SCB242",
              label: "Sports",
              note: "Idrott"
            },
            {
              id: "SCB243",
              label: "Older people and ageing",
              note: "Äldre och åldrande"
            }
          ]
        }
      ]
    }
  }
];

export const CONTROLLED_VOCABULARIES_BY_NAME: Record<string, ControlledVocabularyConfig> =
  CONTROLLED_VOCABULARIES.reduce((acc, vocabulary) => {
    acc[vocabulary.name] = vocabulary;
    return acc;
  }, {} as Record<string, ControlledVocabularyConfig>);

function collectNodes(
  node: ControlledVocabularyNode,
  acc: Record<string, ControlledVocabularyNode>,
): void {
  acc[node.id] = node;
  for (const child of node.children ?? []) {
    collectNodes(child, acc);
  }
}

export const CONTROLLED_VOCABULARY_NODES_BY_ID: Record<string, ControlledVocabularyNode[]> =
  CONTROLLED_VOCABULARIES.reduce((acc, vocabulary) => {
    const local: Record<string, ControlledVocabularyNode> = {};
    collectNodes(vocabulary.root, local);
    for (const [id, node] of Object.entries(local)) {
      acc[id] ??= [];
      acc[id].push(node);
    }
    return acc;
  }, {} as Record<string, ControlledVocabularyNode[]>);

export function getControlledVocabulary(name: string): ControlledVocabularyConfig | undefined {
  return CONTROLLED_VOCABULARIES_BY_NAME[name];
}

export function getControlledVocabularyRoot(name: string): ControlledVocabularyNode | undefined {
  return CONTROLLED_VOCABULARIES_BY_NAME[name]?.root;
}

export function findControlledVocabularyNodesById(id: string): ControlledVocabularyNode[] {
  return CONTROLLED_VOCABULARY_NODES_BY_ID[id] ?? [];
}
