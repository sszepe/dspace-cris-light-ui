/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from registries/*.xml
 * NOTE: Schemas must be activated via MetadataImporter before fields are live.
 */

export type MetadataFieldConfig = {
  schema: string;
  element: string;
  qualifier?: string;
  field: string;
  scopeNote?: string;
  source: string;
};

export type MetadataSchemaConfig = {
  name: string;
  namespace?: string;
  title?: string;
  source: string;
  fields: MetadataFieldConfig[];
};

export const METADATA_SCHEMAS: MetadataSchemaConfig[] = [
  {
    name: "bitstream",
    source: "av-types.xml",
    fields: [
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.dashbundle",
        source: "av-types.xml",
        qualifier: "dashbundle"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.height",
        source: "av-types.xml",
        qualifier: "height"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.width",
        source: "av-types.xml",
        qualifier: "width"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.duration",
        source: "av-types.xml",
        qualifier: "duration"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.format",
        source: "av-types.xml",
        qualifier: "format"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.codec",
        source: "av-types.xml",
        qualifier: "codec"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.fps",
        source: "av-types.xml",
        qualifier: "fps"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.audioformat",
        source: "av-types.xml",
        qualifier: "audioformat"
      },
      {
        schema: "bitstream",
        element: "video",
        field: "bitstream.video.audiocodec",
        source: "av-types.xml",
        qualifier: "audiocodec"
      },
      {
        schema: "bitstream",
        element: "audio",
        field: "bitstream.audio.peaks",
        source: "av-types.xml",
        qualifier: "peaks"
      },
      {
        schema: "bitstream",
        element: "scene",
        field: "bitstream.scene.timestamp",
        source: "av-types.xml",
        qualifier: "timestamp"
      },
      {
        schema: "bitstream",
        element: "category",
        field: "bitstream.category",
        source: "av-types.xml"
      },
      {
        schema: "bitstream",
        element: "transcribe",
        field: "bitstream.transcribe.request",
        source: "av-types.xml",
        qualifier: "request"
      },
      {
        schema: "bitstream",
        element: "transcribe",
        field: "bitstream.transcribe.processed",
        source: "av-types.xml",
        qualifier: "processed"
      },
      {
        schema: "bitstream",
        element: "whisper",
        field: "bitstream.whisper.model",
        source: "av-types.xml",
        qualifier: "model"
      },
      {
        schema: "bitstream",
        element: "transcribe",
        field: "bitstream.transcribe.request",
        source: "av-types.xml",
        qualifier: "request"
      },
      {
        schema: "bitstream",
        element: "transcribe",
        field: "bitstream.transcribe.processed",
        source: "av-types.xml",
        qualifier: "processed"
      },
      {
        schema: "bitstream",
        element: "whisper",
        field: "bitstream.whisper.model",
        source: "av-types.xml",
        qualifier: "model"
      }
    ],
    namespace: "https://4science.it/audiovideo",
    title: "DSpace Audio/Video Addon Schema"
  },
  {
    name: "dash",
    source: "av-types.xml",
    fields: [
      {
        schema: "dash",
        element: "manifest",
        field: "dash.manifest",
        source: "av-types.xml"
      }
    ],
    namespace: "https://4science.it/dash",
    title: "DSpace Audio/Video Addon Schema"
  },
  {
    name: "bitstream",
    source: "bitstream-types.xml",
    fields: [
      {
        schema: "bitstream",
        element: "viewer",
        field: "bitstream.viewer.provider",
        source: "bitstream-types.xml",
        qualifier: "provider",
        scopeNote: "Metadata field used to register custom viewer"
      },
      {
        schema: "bitstream",
        element: "hide",
        field: "bitstream.hide",
        source: "bitstream-types.xml",
        scopeNote: "Metadata field used to hide the bitstream"
      },
      {
        schema: "bitstream",
        element: "iiif",
        field: "bitstream.iiif.canvasid",
        source: "bitstream-types.xml",
        qualifier: "canvasid",
        scopeNote: "Metadata field used to store the canvas identifier (the UUID of the bitstream)"
      },
      {
        schema: "bitstream",
        element: "iiif",
        field: "bitstream.iiif.position",
        source: "bitstream-types.xml",
        qualifier: "position",
        scopeNote: "Metadata field used to store the position of the bitstream"
      },
      {
        schema: "bitstream",
        element: "master",
        field: "bitstream.master",
        source: "bitstream-types.xml",
        scopeNote: "Metadata field used to store the UUID of the master bitstream on the ocr bitstream"
      },
      {
        schema: "bitstream",
        element: "iiif",
        field: "bitstream.iiif.view-orientation",
        source: "bitstream-types.xml",
        qualifier: "view-orientation",
        scopeNote: "Metadata field used to store the rotation necessary to apply to the image to have a proper visualization"
      }
    ],
    namespace: "http://dspace.org/bitstream",
    title: "DSpace Bitstream"
  },
  {
    name: "coar",
    source: "coar-types.xml",
    fields: [
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.review",
        source: "coar-types.xml",
        qualifier: "review",
        scopeNote: "Reviewed by"
      },
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.endorsement",
        source: "coar-types.xml",
        qualifier: "endorsement",
        scopeNote: "Endorsement"
      },
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.examination",
        source: "coar-types.xml",
        qualifier: "examination",
        scopeNote: "Examination"
      },
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.refused",
        source: "coar-types.xml",
        qualifier: "refused",
        scopeNote: "Refused by"
      },
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.release",
        source: "coar-types.xml",
        qualifier: "release",
        scopeNote: "Released by"
      },
      {
        schema: "coar",
        element: "notify",
        field: "coar.notify.endorsedBy",
        source: "coar-types.xml",
        qualifier: "endorsedBy",
        scopeNote: "Endorsed by"
      }
    ],
    namespace: "http://dspace.org/coar",
    title: "COAR fields definition"
  },
  {
    name: "cris",
    source: "cris-types.xml",
    fields: [
      {
        schema: "cris",
        element: "sourceId",
        field: "cris.sourceId",
        source: "cris-types.xml",
        scopeNote: "Used by the cris consumer to store the source that has originated the item"
      },
      {
        schema: "cris",
        element: "policy",
        field: "cris.policy.eperson",
        source: "cris-types.xml",
        qualifier: "eperson",
        scopeNote: "Default metadata for custom policies rule"
      },
      {
        schema: "cris",
        element: "policy",
        field: "cris.policy.group",
        source: "cris-types.xml",
        qualifier: "group",
        scopeNote: "Default metadata for custom policies rule"
      },
      {
        schema: "cris",
        element: "submission",
        field: "cris.submission.definition",
        source: "cris-types.xml",
        qualifier: "definition",
        scopeNote: "Metadata to link a collection with a submission type"
      },
      {
        schema: "cris",
        element: "submission",
        field: "cris.submission.definition-correction",
        source: "cris-types.xml",
        qualifier: "definition-correction",
        scopeNote: "Metadata to link a collection with a correction submission type"
      },
      {
        schema: "cris",
        element: "workflow",
        field: "cris.workflow.name",
        source: "cris-types.xml",
        qualifier: "name",
        scopeNote: "Metadata to link a collection with a workflow type"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.email",
        source: "cris-types.xml",
        qualifier: "email"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.preTransform",
        source: "cris-types.xml",
        qualifier: "preTransform"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.postTransform",
        source: "cris-types.xml",
        qualifier: "postTransform"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.itemValidationEnabled",
        source: "cris-types.xml",
        qualifier: "itemValidationEnabled"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.recordValidationEnabled",
        source: "cris-types.xml",
        qualifier: "recordValidationEnabled"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.forceSynchronization",
        source: "cris-types.xml",
        qualifier: "forceSynchronization"
      },
      {
        schema: "cris",
        element: "harvesting",
        field: "cris.harvesting.ccAddress",
        source: "cris-types.xml",
        qualifier: "ccAddress"
      },
      {
        schema: "cris",
        element: "identifier",
        field: "cris.identifier.gscholar",
        source: "cris-types.xml",
        qualifier: "gscholar"
      },
      {
        schema: "cris",
        element: "workspace",
        field: "cris.workspace.shared",
        source: "cris-types.xml",
        qualifier: "shared"
      },
      {
        schema: "cris",
        element: "author",
        field: "cris.author.scopus-author-id",
        source: "cris-types.xml",
        qualifier: "scopus-author-id"
      },
      {
        schema: "cris",
        element: "author",
        field: "cris.author.orcid",
        source: "cris-types.xml",
        qualifier: "orcid"
      },
      {
        schema: "cris",
        element: "author",
        field: "cris.author.rid",
        source: "cris-types.xml",
        qualifier: "rid"
      },
      {
        schema: "cris",
        element: "legacyId",
        field: "cris.legacyId",
        source: "cris-types.xml"
      },
      {
        schema: "cris",
        element: "virtual",
        field: "cris.virtual.department",
        source: "cris-types.xml",
        qualifier: "department"
      },
      {
        schema: "cris",
        element: "virtual",
        field: "cris.virtual.orcid",
        source: "cris-types.xml",
        qualifier: "orcid"
      },
      {
        schema: "cris",
        element: "virtualsource",
        field: "cris.virtualsource.department",
        source: "cris-types.xml",
        qualifier: "department"
      },
      {
        schema: "cris",
        element: "virtualsource",
        field: "cris.virtualsource.orcid",
        source: "cris-types.xml",
        qualifier: "orcid"
      },
      {
        schema: "cris",
        element: "cms",
        field: "cris.cms.home-header",
        source: "cris-types.xml",
        qualifier: "home-header"
      },
      {
        schema: "cris",
        element: "cms",
        field: "cris.cms.home-news",
        source: "cris-types.xml",
        qualifier: "home-news"
      },
      {
        schema: "cris",
        element: "cms",
        field: "cris.cms.footer",
        source: "cris-types.xml",
        qualifier: "footer"
      },
      {
        schema: "cris",
        element: "customurl",
        field: "cris.customurl",
        source: "cris-types.xml"
      },
      {
        schema: "cris",
        element: "customurl",
        field: "cris.customurl.old",
        source: "cris-types.xml",
        qualifier: "old"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.ads",
        source: "cris-types.xml",
        qualifier: "ads"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.loader-ads",
        source: "cris-types.xml",
        qualifier: "loader-ads"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.scopus",
        source: "cris-types.xml",
        qualifier: "scopus"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.scopus-person",
        source: "cris-types.xml",
        qualifier: "scopus-person"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.scopus-publication",
        source: "cris-types.xml",
        qualifier: "scopus-publication"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.wos",
        source: "cris-types.xml",
        qualifier: "wos"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.wos-person",
        source: "cris-types.xml",
        qualifier: "wos-person"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.wos-publication",
        source: "cris-types.xml",
        qualifier: "wos-publication"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.loader-pubmed",
        source: "cris-types.xml",
        qualifier: "loader-pubmed"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.loader-pubmedeu",
        source: "cris-types.xml",
        qualifier: "loader-pubmedeu"
      },
      {
        schema: "cris",
        element: "lastimport",
        field: "cris.lastimport.loader-scopus",
        source: "cris-types.xml",
        qualifier: "loader-scopus"
      },
      {
        schema: "cris",
        element: "entity",
        field: "cris.entity.style",
        source: "cris-types.xml",
        qualifier: "style"
      },
      {
        schema: "cris",
        element: "virtual",
        field: "cris.virtual.journalance",
        source: "cris-types.xml",
        qualifier: "journalance"
      },
      {
        schema: "cris",
        element: "virtualsource",
        field: "cris.virtualsource.journalance",
        source: "cris-types.xml",
        qualifier: "journalance"
      },
      {
        schema: "cris",
        element: "curation",
        field: "cris.curation.process",
        source: "cris-types.xml",
        qualifier: "process"
      },
      {
        schema: "cris",
        element: "curation",
        field: "cris.curation.history",
        source: "cris-types.xml",
        qualifier: "history"
      }
    ],
    namespace: "https://www.4science.it/dspace-cris/",
    title: "DSpace Cris Types"
  },
  {
    name: "crisequipment",
    source: "crisequipment-types.xml",
    fields: [
      {
        schema: "crisequipment",
        element: "acronym",
        field: "crisequipment.acronym",
        source: "crisequipment-types.xml"
      },
      {
        schema: "crisequipment",
        element: "identifier",
        field: "crisequipment.identifier",
        source: "crisequipment-types.xml"
      },
      {
        schema: "crisequipment",
        element: "ownerou",
        field: "crisequipment.ownerou",
        source: "crisequipment-types.xml"
      },
      {
        schema: "crisequipment",
        element: "ownerrp",
        field: "crisequipment.ownerrp",
        source: "crisequipment-types.xml"
      },
      {
        schema: "crisequipment",
        element: "description",
        field: "crisequipment.description",
        source: "crisequipment-types.xml"
      },
      {
        schema: "crisequipment",
        element: "activation",
        field: "crisequipment.activation.date",
        source: "crisequipment-types.xml",
        qualifier: "date"
      },
      {
        schema: "crisequipment",
        element: "manifactured",
        field: "crisequipment.manifactured.date",
        source: "crisequipment-types.xml",
        qualifier: "date"
      },
      {
        schema: "crisequipment",
        element: "serialNumber",
        field: "crisequipment.serialNumber",
        source: "crisequipment-types.xml"
      }
    ],
    namespace: "http://dspace.org/crisequipment",
    title: "DSpace Cris researcher's page Types"
  },
  {
    name: "crisevent",
    source: "crisevents-types.xml",
    fields: [
      {
        schema: "crisevent",
        element: "acronym",
        field: "crisevent.acronym",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "type",
        field: "crisevent.type",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "organizerou",
        field: "crisevent.organizerou",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "organizerpj",
        field: "crisevent.organizerpj",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "sponsorou",
        field: "crisevent.sponsorou",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "sponsorpj",
        field: "crisevent.sponsorpj",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "partnerou",
        field: "crisevent.partnerou",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "partnerpj",
        field: "crisevent.partnerpj",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "description",
        field: "crisevent.description",
        source: "crisevents-types.xml"
      },
      {
        schema: "crisevent",
        element: "description",
        field: "crisevent.description.keywords",
        source: "crisevents-types.xml",
        qualifier: "keywords"
      }
    ],
    namespace: "http://dspace.org/crisevent",
    title: "DSpace Cris Events Types"
  },
  {
    name: "crisfund",
    source: "crisfund-types.xml",
    fields: [
      {
        schema: "crisfund",
        element: "award",
        field: "crisfund.award.url",
        source: "crisfund-types.xml",
        qualifier: "url"
      },
      {
        schema: "crisfund",
        element: "award",
        field: "crisfund.award.uri",
        source: "crisfund-types.xml",
        qualifier: "uri"
      },
      {
        schema: "crisfund",
        element: "investigators",
        field: "crisfund.investigators",
        source: "crisfund-types.xml"
      },
      {
        schema: "crisfund",
        element: "coinvestigators",
        field: "crisfund.coinvestigators",
        source: "crisfund-types.xml"
      },
      {
        schema: "crisfund",
        element: "leadorganizations",
        field: "crisfund.leadorganizations",
        source: "crisfund-types.xml"
      },
      {
        schema: "crisfund",
        element: "leadcoorganizations",
        field: "crisfund.leadcoorganizations",
        source: "crisfund-types.xml"
      }
    ],
    namespace: "http://dspace.org/crisfund",
    title: "DSpace Cris Funding Types"
  },
  {
    name: "crisou",
    source: "crisou-types.xml",
    fields: [
      {
        schema: "crisou",
        element: "acronym",
        field: "crisou.acronym",
        source: "crisou-types.xml"
      },
      {
        schema: "crisou",
        element: "director",
        field: "crisou.director",
        source: "crisou-types.xml"
      },
      {
        schema: "crisou",
        element: "relation",
        field: "crisou.relation.ispartof",
        source: "crisou-types.xml",
        qualifier: "ispartof"
      },
      {
        schema: "crisou",
        element: "date",
        field: "crisou.date",
        source: "crisou-types.xml"
      },
      {
        schema: "crisou",
        element: "boards",
        field: "crisou.boards",
        source: "crisou-types.xml"
      },
      {
        schema: "crisou",
        element: "crossrefid",
        field: "crisou.crossrefid",
        source: "crisou-types.xml"
      },
      {
        schema: "crisou",
        element: "place",
        field: "crisou.place.city",
        source: "crisou-types.xml",
        qualifier: "city"
      },
      {
        schema: "crisou",
        element: "place",
        field: "crisou.place.country",
        source: "crisou-types.xml",
        qualifier: "country"
      }
    ],
    namespace: "http://dspace.org/crisou",
    title: "DSpace Cris OrgUnit Types"
  },
  {
    name: "crispatent",
    source: "crispatent-types.xml",
    fields: [
      {
        schema: "crispatent",
        element: "kind",
        field: "crispatent.kind",
        source: "crispatent-types.xml"
      },
      {
        schema: "crispatent",
        element: "document",
        field: "crispatent.document.kind",
        source: "crispatent-types.xml",
        qualifier: "kind"
      },
      {
        schema: "crispatent",
        element: "document",
        field: "crispatent.document.issueDate",
        source: "crispatent-types.xml",
        qualifier: "issueDate"
      },
      {
        schema: "crispatent",
        element: "document",
        field: "crispatent.document.title",
        source: "crispatent-types.xml",
        qualifier: "title"
      },
      {
        schema: "crispatent",
        element: "document",
        field: "crispatent.document.description",
        source: "crispatent-types.xml",
        qualifier: "description"
      }
    ],
    namespace: "http://dspace.org/crispatent",
    title: "DSpace Cris Patent Types"
  },
  {
    name: "crispj",
    source: "crispj-types.xml",
    fields: [
      {
        schema: "crispj",
        element: "coordinator",
        field: "crispj.coordinator",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "partnerou",
        field: "crispj.partnerou",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "investigator",
        field: "crispj.investigator",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "coinvestigators",
        field: "crispj.coinvestigators",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "funder",
        field: "crispj.funder",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "openaireid",
        field: "crispj.openaireid",
        source: "crispj-types.xml"
      },
      {
        schema: "crispj",
        element: "organization",
        field: "crispj.organization",
        source: "crispj-types.xml"
      }
    ],
    namespace: "http://dspace.org/crispj",
    title: "DSpace Cris project Types"
  },
  {
    name: "crisrp",
    source: "crisrp-types.xml",
    fields: [
      {
        schema: "crisrp",
        element: "qualification",
        field: "crisrp.qualification",
        source: "crisrp-types.xml"
      },
      {
        schema: "crisrp",
        element: "qualification",
        field: "crisrp.qualification.role",
        source: "crisrp-types.xml",
        qualifier: "role"
      },
      {
        schema: "crisrp",
        element: "qualification",
        field: "crisrp.qualification.start",
        source: "crisrp-types.xml",
        qualifier: "start"
      },
      {
        schema: "crisrp",
        element: "qualification",
        field: "crisrp.qualification.end",
        source: "crisrp-types.xml",
        qualifier: "end"
      },
      {
        schema: "crisrp",
        element: "education",
        field: "crisrp.education",
        source: "crisrp-types.xml"
      },
      {
        schema: "crisrp",
        element: "education",
        field: "crisrp.education.start",
        source: "crisrp-types.xml",
        qualifier: "start"
      },
      {
        schema: "crisrp",
        element: "education",
        field: "crisrp.education.end",
        source: "crisrp-types.xml",
        qualifier: "end"
      },
      {
        schema: "crisrp",
        element: "education",
        field: "crisrp.education.role",
        source: "crisrp-types.xml",
        qualifier: "role"
      },
      {
        schema: "crisrp",
        element: "site",
        field: "crisrp.site.title",
        source: "crisrp-types.xml",
        qualifier: "title"
      },
      {
        schema: "crisrp",
        element: "name",
        field: "crisrp.name.alternative",
        source: "crisrp-types.xml",
        qualifier: "alternative"
      },
      {
        schema: "crisrp",
        element: "name",
        field: "crisrp.name.translated",
        source: "crisrp-types.xml",
        qualifier: "translated"
      },
      {
        schema: "crisrp",
        element: "name",
        field: "crisrp.name.variant",
        source: "crisrp-types.xml",
        qualifier: "variant"
      },
      {
        schema: "crisrp",
        element: "workgroup",
        field: "crisrp.workgroup",
        source: "crisrp-types.xml"
      },
      {
        schema: "crisrp",
        element: "country",
        field: "crisrp.country",
        source: "crisrp-types.xml"
      },
      {
        schema: "crisrp",
        element: "name",
        field: "crisrp.name",
        source: "crisrp-types.xml"
      }
    ],
    namespace: "http://dspace.org/crisrp",
    title: "DSpace Cris researcher's page Types"
  },
  {
    name: "datacite",
    source: "datacite-types.xml",
    fields: [
      {
        schema: "datacite",
        element: "geoLocation",
        field: "datacite.geoLocation",
        source: "datacite-types.xml",
        scopeNote: "Spatial region or named place where the data was gathered or about which the data is focused."
      },
      {
        schema: "datacite",
        element: "subject",
        field: "datacite.subject.fos",
        source: "datacite-types.xml",
        qualifier: "fos",
        scopeNote: "Fields of Science and Technology - OECD"
      },
      {
        schema: "datacite",
        element: "relation",
        field: "datacite.relation.isReviewedBy",
        source: "datacite-types.xml",
        qualifier: "isReviewedBy",
        scopeNote: "Reviewd by"
      },
      {
        schema: "datacite",
        element: "relation",
        field: "datacite.relation.isReferencedBy",
        source: "datacite-types.xml",
        qualifier: "isReferencedBy",
        scopeNote: "Referenced by"
      },
      {
        schema: "datacite",
        element: "relation",
        field: "datacite.relation.isSupplementedBy",
        source: "datacite-types.xml",
        qualifier: "isSupplementedBy",
        scopeNote: "Supplemented by"
      },
      {
        schema: "datacite",
        element: "rights",
        field: "datacite.rights",
        source: "datacite-types.xml",
        scopeNote: "Name of the TYPE_CUSTOM policy for target Bitstream, derived from OpenAIRE Access Rights"
      },
      {
        schema: "datacite",
        element: "available",
        field: "datacite.available",
        source: "datacite-types.xml",
        scopeNote: "Ending date of the policy for target Bitstream, used with datacite.rights"
      }
    ],
    namespace: "http://datacite.org/schema/kernel-4",
    title: "OpenAIRE4 Datacite fields definition"
  },
  {
    name: "dq",
    source: "dataquality-types.xml",
    fields: [
      {
        schema: "dq",
        element: "merge",
        field: "dq.merge.target-uri",
        source: "dataquality-types.xml",
        qualifier: "target-uri",
        scopeNote: "stores the value of uri of target item"
      }
    ],
    namespace: "http://dspace.org/dq",
    title: "DataQuality Addon metadata types"
  },
  {
    name: "dcterms",
    source: "dcterms-types.xml",
    fields: [
      {
        schema: "dcterms",
        element: "abstract",
        field: "dcterms.abstract",
        source: "dcterms-types.xml",
        scopeNote: "A summary of the resource."
      },
      {
        schema: "dcterms",
        element: "accessRights",
        field: "dcterms.accessRights",
        source: "dcterms-types.xml",
        scopeNote: "Information about who can access the resource or an indication of its security status. May include information regarding access or restrictions based on privacy, security, or other policies."
      },
      {
        schema: "dcterms",
        element: "accrualMethod",
        field: "dcterms.accrualMethod",
        source: "dcterms-types.xml",
        scopeNote: "The method by which items are added to a collection."
      },
      {
        schema: "dcterms",
        element: "accrualPeriodicity",
        field: "dcterms.accrualPeriodicity",
        source: "dcterms-types.xml",
        scopeNote: "The frequency with which items are added to a collection."
      },
      {
        schema: "dcterms",
        element: "accrualPolicy",
        field: "dcterms.accrualPolicy",
        source: "dcterms-types.xml",
        scopeNote: "The policy governing the addition of items to a collection."
      },
      {
        schema: "dcterms",
        element: "alternative",
        field: "dcterms.alternative",
        source: "dcterms-types.xml",
        scopeNote: "An alternative name for the resource."
      },
      {
        schema: "dcterms",
        element: "audience",
        field: "dcterms.audience",
        source: "dcterms-types.xml",
        scopeNote: "A class of entity for whom the resource is intended or useful."
      },
      {
        schema: "dcterms",
        element: "available",
        field: "dcterms.available",
        source: "dcterms-types.xml",
        scopeNote: "Date (often a range) that the resource became or will become available."
      },
      {
        schema: "dcterms",
        element: "bibliographicCitation",
        field: "dcterms.bibliographicCitation",
        source: "dcterms-types.xml",
        scopeNote: "Recommended practice is to include sufficient bibliographic detail to identify the resource as unambiguously as possible."
      },
      {
        schema: "dcterms",
        element: "conformsTo",
        field: "dcterms.conformsTo",
        source: "dcterms-types.xml",
        scopeNote: "An established standard to which the described resource conforms."
      },
      {
        schema: "dcterms",
        element: "contributor",
        field: "dcterms.contributor",
        source: "dcterms-types.xml",
        scopeNote: "An entity responsible for making contributions to the resource. Examples of a Contributor include a person, an organization, or a service."
      },
      {
        schema: "dcterms",
        element: "coverage",
        field: "dcterms.coverage",
        source: "dcterms-types.xml",
        scopeNote: "The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant."
      },
      {
        schema: "dcterms",
        element: "created",
        field: "dcterms.created",
        source: "dcterms-types.xml",
        scopeNote: "Date of creation of the resource."
      },
      {
        schema: "dcterms",
        element: "creator",
        field: "dcterms.creator",
        source: "dcterms-types.xml",
        scopeNote: "An entity primarily responsible for making the resource."
      },
      {
        schema: "dcterms",
        element: "date",
        field: "dcterms.date",
        source: "dcterms-types.xml",
        scopeNote: "A point or period of time associated with an event in the lifecycle of the resource."
      },
      {
        schema: "dcterms",
        element: "dateAccepted",
        field: "dcterms.dateAccepted",
        source: "dcterms-types.xml",
        scopeNote: "Date of acceptance of the resource."
      },
      {
        schema: "dcterms",
        element: "dateCopyrighted",
        field: "dcterms.dateCopyrighted",
        source: "dcterms-types.xml",
        scopeNote: "Date of copyright."
      },
      {
        schema: "dcterms",
        element: "dateSubmitted",
        field: "dcterms.dateSubmitted",
        source: "dcterms-types.xml",
        scopeNote: "Date of submission of the resource."
      },
      {
        schema: "dcterms",
        element: "description",
        field: "dcterms.description",
        source: "dcterms-types.xml",
        scopeNote: "An account of the resource."
      },
      {
        schema: "dcterms",
        element: "educationLevel",
        field: "dcterms.educationLevel",
        source: "dcterms-types.xml",
        scopeNote: "A class of entity, defined in terms of progression through an educational or training context, for which the described resource is intended."
      },
      {
        schema: "dcterms",
        element: "extent",
        field: "dcterms.extent",
        source: "dcterms-types.xml",
        scopeNote: "The size or duration of the resource."
      },
      {
        schema: "dcterms",
        element: "format",
        field: "dcterms.format",
        source: "dcterms-types.xml",
        scopeNote: "The file format, physical medium, or dimensions of the resource."
      },
      {
        schema: "dcterms",
        element: "hasFormat",
        field: "dcterms.hasFormat",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is substantially the same as the pre-existing described resource, but in another format."
      },
      {
        schema: "dcterms",
        element: "hasPart",
        field: "dcterms.hasPart",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is included either physically or logically in the described resource."
      },
      {
        schema: "dcterms",
        element: "hasVersion",
        field: "dcterms.hasVersion",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is a version, edition, or adaptation of the described resource."
      },
      {
        schema: "dcterms",
        element: "identifier",
        field: "dcterms.identifier",
        source: "dcterms-types.xml",
        scopeNote: "An unambiguous reference to the resource within a given context."
      },
      {
        schema: "dcterms",
        element: "instructionalMethod",
        field: "dcterms.instructionalMethod",
        source: "dcterms-types.xml",
        scopeNote: "A process, used to engender knowledge, attitudes and skills, that the described resource is designed to support."
      },
      {
        schema: "dcterms",
        element: "isFormatOf",
        field: "dcterms.isFormatOf",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is substantially the same as the described resource, but in another format."
      },
      {
        schema: "dcterms",
        element: "isPartOf",
        field: "dcterms.isPartOf",
        source: "dcterms-types.xml",
        scopeNote: "A related resource in which the described resource is physically or logically included."
      },
      {
        schema: "dcterms",
        element: "isReferencedBy",
        field: "dcterms.isReferencedBy",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that references, cites, or otherwise points to the described resource."
      },
      {
        schema: "dcterms",
        element: "isReplacedBy",
        field: "dcterms.isReplacedBy",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that supplants, displaces, or supersedes the described resource."
      },
      {
        schema: "dcterms",
        element: "isRequiredBy",
        field: "dcterms.isRequiredBy",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that requires the described resource to support its function, delivery, or coherence."
      },
      {
        schema: "dcterms",
        element: "issued",
        field: "dcterms.issued",
        source: "dcterms-types.xml",
        scopeNote: "Date of formal issuance (e.g., publication) of the resource."
      },
      {
        schema: "dcterms",
        element: "isVersionOf",
        field: "dcterms.isVersionOf",
        source: "dcterms-types.xml",
        scopeNote: "A related resource of which the described resource is a version, edition, or adaptation."
      },
      {
        schema: "dcterms",
        element: "language",
        field: "dcterms.language",
        source: "dcterms-types.xml",
        scopeNote: "A language of the resource."
      },
      {
        schema: "dcterms",
        element: "license",
        field: "dcterms.license",
        source: "dcterms-types.xml",
        scopeNote: "A legal document giving official permission to do something with the resource."
      },
      {
        schema: "dcterms",
        element: "mediator",
        field: "dcterms.mediator",
        source: "dcterms-types.xml",
        scopeNote: "An entity that mediates access to the resource and for whom the resource is intended or useful."
      },
      {
        schema: "dcterms",
        element: "medium",
        field: "dcterms.medium",
        source: "dcterms-types.xml",
        scopeNote: "The material or physical carrier of the resource."
      },
      {
        schema: "dcterms",
        element: "modified",
        field: "dcterms.modified",
        source: "dcterms-types.xml",
        scopeNote: "Date on which the resource was changed."
      },
      {
        schema: "dcterms",
        element: "provenance",
        field: "dcterms.provenance",
        source: "dcterms-types.xml",
        scopeNote: "A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation."
      },
      {
        schema: "dcterms",
        element: "publisher",
        field: "dcterms.publisher",
        source: "dcterms-types.xml",
        scopeNote: "An entity responsible for making the resource available."
      },
      {
        schema: "dcterms",
        element: "references",
        field: "dcterms.references",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is referenced, cited, or otherwise pointed to by the described resource."
      },
      {
        schema: "dcterms",
        element: "relation",
        field: "dcterms.relation",
        source: "dcterms-types.xml",
        scopeNote: "A related resource."
      },
      {
        schema: "dcterms",
        element: "replaces",
        field: "dcterms.replaces",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is supplanted, displaced, or superseded by the described resource."
      },
      {
        schema: "dcterms",
        element: "requires",
        field: "dcterms.requires",
        source: "dcterms-types.xml",
        scopeNote: "A related resource that is required by the described resource to support its function, delivery, or coherence."
      },
      {
        schema: "dcterms",
        element: "rights",
        field: "dcterms.rights",
        source: "dcterms-types.xml",
        scopeNote: "Information about rights held in and over the resource."
      },
      {
        schema: "dcterms",
        element: "rightsHolder",
        field: "dcterms.rightsHolder",
        source: "dcterms-types.xml",
        scopeNote: "A person or organization owning or managing rights over the resource."
      },
      {
        schema: "dcterms",
        element: "source",
        field: "dcterms.source",
        source: "dcterms-types.xml",
        scopeNote: "A related resource from which the described resource is derived."
      },
      {
        schema: "dcterms",
        element: "spatial",
        field: "dcterms.spatial",
        source: "dcterms-types.xml",
        scopeNote: "Spatial characteristics of the resource."
      },
      {
        schema: "dcterms",
        element: "subject",
        field: "dcterms.subject",
        source: "dcterms-types.xml",
        scopeNote: "The topic of the resource."
      },
      {
        schema: "dcterms",
        element: "tableOfContents",
        field: "dcterms.tableOfContents",
        source: "dcterms-types.xml",
        scopeNote: "A list of subunits of the resource."
      },
      {
        schema: "dcterms",
        element: "temporal",
        field: "dcterms.temporal",
        source: "dcterms-types.xml",
        scopeNote: "Temporal characteristics of the resource."
      },
      {
        schema: "dcterms",
        element: "title",
        field: "dcterms.title",
        source: "dcterms-types.xml",
        scopeNote: "A name given to the resource."
      },
      {
        schema: "dcterms",
        element: "type",
        field: "dcterms.type",
        source: "dcterms-types.xml",
        scopeNote: "The nature or genre of the resource."
      },
      {
        schema: "dcterms",
        element: "valid",
        field: "dcterms.valid",
        source: "dcterms-types.xml",
        scopeNote: "Date (often a range) of validity of a resource."
      }
    ],
    namespace: "http://purl.org/dc/terms/",
    title: "DCTerms Types Registry"
  },
  {
    name: "dspace",
    source: "dspace-types.xml",
    fields: [
      {
        schema: "dspace",
        element: "process",
        field: "dspace.process.filetype",
        source: "dspace-types.xml",
        qualifier: "filetype"
      },
      {
        schema: "dspace",
        element: "agreements",
        field: "dspace.agreements.end-user",
        source: "dspace-types.xml",
        qualifier: "end-user",
        scopeNote: "Stores whether the End User Agreement has been accepted by an EPerson. Valid values; true, false"
      },
      {
        schema: "dspace",
        element: "agreements",
        field: "dspace.agreements.cookies",
        source: "dspace-types.xml",
        qualifier: "cookies",
        scopeNote: "Stores the cookie preferences of an EPerson, as selected in last session. Value will be an array of cookieName/boolean pairs, specifying which cookies are allowed or not allowed."
      },
      {
        schema: "dspace",
        element: "agreements",
        field: "dspace.agreements.ignore",
        source: "dspace-types.xml",
        qualifier: "ignore",
        scopeNote: "Stores whether the EPerson is allowed to ignore the user agreement, useful for user account used by third party application. Valid values; true, false"
      },
      {
        schema: "dspace",
        element: "entity",
        field: "dspace.entity.type",
        source: "dspace-types.xml",
        qualifier: "type",
        scopeNote: "Stores the type of Entity that a specific Item represents"
      },
      {
        schema: "dspace",
        element: "iiif",
        field: "dspace.iiif.enabled",
        source: "dspace-types.xml",
        qualifier: "enabled",
        scopeNote: "Stores a boolean text value (true or false) to indicate if the iiif feature is enabled or not for the dspace object. If absent the value is derived from the parent dspace object"
      },
      {
        schema: "dspace",
        element: "file",
        field: "dspace.file.type",
        source: "dspace-types.xml",
        qualifier: "type",
        scopeNote: "Stores the bitstream's children file type inside the item it self"
      },
      {
        schema: "dspace",
        element: "object",
        field: "dspace.object.owner",
        source: "dspace-types.xml",
        qualifier: "owner",
        scopeNote: "Used to support researcher profiles"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.scope",
        source: "dspace-types.xml",
        qualifier: "scope",
        scopeNote: "Stores the scopes/authorizations granted by the user during authentication on ORCID"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-mode",
        source: "dspace-types.xml",
        qualifier: "sync-mode",
        scopeNote: "Stores the synchronization with ORCID mode chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-publications",
        source: "dspace-types.xml",
        qualifier: "sync-publications",
        scopeNote: "Stores the publication synchronization with ORCID preference chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-products",
        source: "dspace-types.xml",
        qualifier: "sync-products",
        scopeNote: "Stores the product synchronization with ORCID preference chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-patents",
        source: "dspace-types.xml",
        qualifier: "sync-patents",
        scopeNote: "Stores the patent synchronization with ORCID preference chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-fundings",
        source: "dspace-types.xml",
        qualifier: "sync-fundings",
        scopeNote: "Stores the funding synchronization with ORCID preference chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.sync-profile",
        source: "dspace-types.xml",
        qualifier: "sync-profile",
        scopeNote: "Stores the profile synchronization with ORCID preference chosen by the user"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.authenticated",
        source: "dspace-types.xml",
        qualifier: "authenticated",
        scopeNote: "Stores the timestamp related to the user authentication on ORCID"
      },
      {
        schema: "dspace",
        element: "orcid",
        field: "dspace.orcid.webhook",
        source: "dspace-types.xml",
        qualifier: "webhook"
      },
      {
        schema: "dspace",
        element: "legacy",
        field: "dspace.legacy.oai-identifier",
        source: "dspace-types.xml",
        qualifier: "oai-identifier"
      },
      {
        schema: "dspace",
        element: "networklab",
        field: "dspace.networklab.enabled",
        source: "dspace-types.xml",
        qualifier: "enabled"
      },
      {
        schema: "dspace",
        element: "workflow",
        field: "dspace.workflow.startDateTime",
        source: "dspace-types.xml",
        qualifier: "startDateTime"
      },
      {
        schema: "dspace",
        element: "openalex",
        field: "dspace.openalex.lastimport",
        source: "dspace-types.xml",
        qualifier: "lastimport",
        scopeNote: "Stores the timestamp related to the last import from OpenAlex"
      },
      {
        schema: "dspace",
        element: "openaire",
        field: "dspace.openaire.lastimport",
        source: "dspace-types.xml",
        qualifier: "lastimport",
        scopeNote: "Stores the timestamp related to the last import from OpenAIRE Graph"
      },
      {
        schema: "dspace",
        element: "accessibility",
        field: "dspace.accessibility.settings",
        source: "dspace-types.xml",
        qualifier: "settings",
        scopeNote: "Metadata field storing the user-configured accessibility settings values for the EPerson."
      }
    ],
    namespace: "http://dspace.org/dspace",
    title: "DSpace Internal Types Registry"
  },
  {
    name: "dc",
    source: "dublin-core-types.xml",
    fields: [
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor",
        source: "dublin-core-types.xml",
        scopeNote: "A person, organization, or service responsible for the content of the resource. Catch-all for unspecified contributors."
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.advisor",
        source: "dublin-core-types.xml",
        qualifier: "advisor",
        scopeNote: "Use primarily for thesis advisor."
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.author",
        source: "dublin-core-types.xml",
        qualifier: "author"
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.editor",
        source: "dublin-core-types.xml",
        qualifier: "editor"
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.illustrator",
        source: "dublin-core-types.xml",
        qualifier: "illustrator"
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.other",
        source: "dublin-core-types.xml",
        qualifier: "other"
      },
      {
        schema: "dc",
        element: "coverage",
        field: "dc.coverage.spatial",
        source: "dublin-core-types.xml",
        qualifier: "spatial",
        scopeNote: "Spatial characteristics of content."
      },
      {
        schema: "dc",
        element: "coverage",
        field: "dc.coverage.temporal",
        source: "dublin-core-types.xml",
        qualifier: "temporal",
        scopeNote: "Temporal characteristics of content."
      },
      {
        schema: "dc",
        element: "creator",
        field: "dc.creator",
        source: "dublin-core-types.xml",
        scopeNote: "Do not use; only for harvested metadata."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date",
        source: "dublin-core-types.xml",
        scopeNote: "Use qualified form if possible."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.accessioned",
        source: "dublin-core-types.xml",
        qualifier: "accessioned",
        scopeNote: "Date DSpace takes possession of item."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.available",
        source: "dublin-core-types.xml",
        qualifier: "available",
        scopeNote: "Date or date range item became available to the public."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.copyright",
        source: "dublin-core-types.xml",
        qualifier: "copyright",
        scopeNote: "Date of copyright."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.created",
        source: "dublin-core-types.xml",
        qualifier: "created",
        scopeNote: "Date of creation or manufacture of intellectual content if different from date.issued."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.issued",
        source: "dublin-core-types.xml",
        qualifier: "issued",
        scopeNote: "Date of publication or distribution."
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.submitted",
        source: "dublin-core-types.xml",
        qualifier: "submitted",
        scopeNote: "Recommend for theses/dissertations."
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier",
        source: "dublin-core-types.xml",
        scopeNote: "Catch-all for unambiguous identifiers not defined by qualified form; use identifier.other for a known identifier common to a local collection instead of unqualified form."
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.citation",
        source: "dublin-core-types.xml",
        qualifier: "citation",
        scopeNote: "Human-readable, standard bibliographic citation of non-DSpace format of this item"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.govdoc",
        source: "dublin-core-types.xml",
        qualifier: "govdoc",
        scopeNote: "A government document number"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.isbn",
        source: "dublin-core-types.xml",
        qualifier: "isbn",
        scopeNote: "International Standard Book Number"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.issn",
        source: "dublin-core-types.xml",
        qualifier: "issn",
        scopeNote: "International Standard Serial Number"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.sici",
        source: "dublin-core-types.xml",
        qualifier: "sici",
        scopeNote: "Serial Item and Contribution Identifier"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.ismn",
        source: "dublin-core-types.xml",
        qualifier: "ismn",
        scopeNote: "International Standard Music Number"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.other",
        source: "dublin-core-types.xml",
        qualifier: "other",
        scopeNote: "A known identifier type common to a local collection."
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.doi",
        source: "dublin-core-types.xml",
        qualifier: "doi",
        scopeNote: "The doi identifier minted by this repository."
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.scopus",
        source: "dublin-core-types.xml",
        qualifier: "scopus",
        scopeNote: "The scopus identifier"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.uri",
        source: "dublin-core-types.xml",
        qualifier: "uri",
        scopeNote: "Uniform Resource Identifier"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.isi",
        source: "dublin-core-types.xml",
        qualifier: "isi",
        scopeNote: "Web of Knowledge Identifier"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.pmid",
        source: "dublin-core-types.xml",
        qualifier: "pmid",
        scopeNote: "Pubmed ID"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.adsbibcode",
        source: "dublin-core-types.xml",
        qualifier: "adsbibcode",
        scopeNote: "ADS Identifier"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.arxiv",
        source: "dublin-core-types.xml",
        qualifier: "arxiv",
        scopeNote: "arXiv Identifier"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description",
        source: "dublin-core-types.xml",
        scopeNote: "Catch-all for any description not defined by qualifiers."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.abstract",
        source: "dublin-core-types.xml",
        qualifier: "abstract",
        scopeNote: "Abstract or summary."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.provenance",
        source: "dublin-core-types.xml",
        qualifier: "provenance",
        scopeNote: "The history of custody of the item since its creation, including any changes successive custodians made to it."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.sponsorship",
        source: "dublin-core-types.xml",
        qualifier: "sponsorship",
        scopeNote: "Information about sponsoring agencies, individuals, or contractual arrangements for the item."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.statementofresponsibility",
        source: "dublin-core-types.xml",
        qualifier: "statementofresponsibility",
        scopeNote: "To preserve statement of responsibility from MARC records."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.tableofcontents",
        source: "dublin-core-types.xml",
        qualifier: "tableofcontents",
        scopeNote: "A table of contents for a given item."
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.uri",
        source: "dublin-core-types.xml",
        qualifier: "uri",
        scopeNote: "Uniform Resource Identifier pointing to description of this item."
      },
      {
        schema: "dc",
        element: "format",
        field: "dc.format",
        source: "dublin-core-types.xml",
        scopeNote: "Catch-all for any format information not defined by qualifiers."
      },
      {
        schema: "dc",
        element: "format",
        field: "dc.format.extent",
        source: "dublin-core-types.xml",
        qualifier: "extent",
        scopeNote: "Size or duration."
      },
      {
        schema: "dc",
        element: "format",
        field: "dc.format.medium",
        source: "dublin-core-types.xml",
        qualifier: "medium",
        scopeNote: "Physical medium."
      },
      {
        schema: "dc",
        element: "format",
        field: "dc.format.mimetype",
        source: "dublin-core-types.xml",
        qualifier: "mimetype",
        scopeNote: "Registered MIME type identifiers."
      },
      {
        schema: "dc",
        element: "language",
        field: "dc.language",
        source: "dublin-core-types.xml",
        scopeNote: "Catch-all for non-ISO forms of the language of the item, accommodating harvested values."
      },
      {
        schema: "dc",
        element: "language",
        field: "dc.language.iso",
        source: "dublin-core-types.xml",
        qualifier: "iso",
        scopeNote: "Current ISO standard for language of intellectual content, including country codes (e.g. \"en_US\")."
      },
      {
        schema: "dc",
        element: "publisher",
        field: "dc.publisher",
        source: "dublin-core-types.xml",
        scopeNote: "Entity responsible for publication, distribution, or imprint."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation",
        source: "dublin-core-types.xml",
        scopeNote: "Catch-all for references to other related items."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isformatof",
        source: "dublin-core-types.xml",
        qualifier: "isformatof",
        scopeNote: "References additional physical form."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.ispartof",
        source: "dublin-core-types.xml",
        qualifier: "ispartof",
        scopeNote: "References physically or logically containing item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.ispartofseries",
        source: "dublin-core-types.xml",
        qualifier: "ispartofseries",
        scopeNote: "Series name and number within that series, if available."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.haspart",
        source: "dublin-core-types.xml",
        qualifier: "haspart",
        scopeNote: "References physically or logically contained item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isversionof",
        source: "dublin-core-types.xml",
        qualifier: "isversionof",
        scopeNote: "References earlier version."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.hasversion",
        source: "dublin-core-types.xml",
        qualifier: "hasversion",
        scopeNote: "References later version."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isbasedon",
        source: "dublin-core-types.xml",
        qualifier: "isbasedon",
        scopeNote: "References source."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isreferencedby",
        source: "dublin-core-types.xml",
        qualifier: "isreferencedby",
        scopeNote: "Pointed to by referenced resource."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.requires",
        source: "dublin-core-types.xml",
        qualifier: "requires",
        scopeNote: "Referenced resource is required to support function, delivery, or coherence of item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.replaces",
        source: "dublin-core-types.xml",
        qualifier: "replaces",
        scopeNote: "References preceeding item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isreplacedby",
        source: "dublin-core-types.xml",
        qualifier: "isreplacedby",
        scopeNote: "References succeeding item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.uri",
        source: "dublin-core-types.xml",
        qualifier: "uri",
        scopeNote: "References Uniform Resource Identifier for related item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.product",
        source: "dublin-core-types.xml",
        qualifier: "product",
        scopeNote: "References product for related item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.journal",
        source: "dublin-core-types.xml",
        qualifier: "journal",
        scopeNote: "References journal for related item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.orgunit",
        source: "dublin-core-types.xml",
        qualifier: "orgunit",
        scopeNote: "References orgunit for related item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.project",
        source: "dublin-core-types.xml",
        qualifier: "project",
        scopeNote: "References project for related item."
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.conference",
        source: "dublin-core-types.xml",
        qualifier: "conference",
        scopeNote: "References conference for related item."
      },
      {
        schema: "dc",
        element: "rights",
        field: "dc.rights",
        source: "dublin-core-types.xml",
        scopeNote: "Terms governing use and reproduction."
      },
      {
        schema: "dc",
        element: "rights",
        field: "dc.rights.uri",
        source: "dublin-core-types.xml",
        qualifier: "uri",
        scopeNote: "References terms governing use and reproduction."
      },
      {
        schema: "dc",
        element: "source",
        field: "dc.source",
        source: "dublin-core-types.xml",
        scopeNote: "Do not use; only for harvested metadata."
      },
      {
        schema: "dc",
        element: "source",
        field: "dc.source.uri",
        source: "dublin-core-types.xml",
        qualifier: "uri",
        scopeNote: "Do not use; only for harvested metadata."
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject",
        source: "dublin-core-types.xml",
        scopeNote: "Uncontrolled index term."
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.classification",
        source: "dublin-core-types.xml",
        qualifier: "classification",
        scopeNote: "Catch-all for value from local classification system; global classification systems will receive specific qualifier"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.ddc",
        source: "dublin-core-types.xml",
        qualifier: "ddc",
        scopeNote: "Dewey Decimal Classification Number"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.lcc",
        source: "dublin-core-types.xml",
        qualifier: "lcc",
        scopeNote: "Library of Congress Classification Number"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.lcsh",
        source: "dublin-core-types.xml",
        qualifier: "lcsh",
        scopeNote: "Library of Congress Subject Headings"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.mesh",
        source: "dublin-core-types.xml",
        qualifier: "mesh",
        scopeNote: "MEdical Subject Headings"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.other",
        source: "dublin-core-types.xml",
        qualifier: "other",
        scopeNote: "Local controlled vocabulary; global vocabularies will receive specific qualifier."
      },
      {
        schema: "dc",
        element: "title",
        field: "dc.title",
        source: "dublin-core-types.xml",
        scopeNote: "Title statement/title proper."
      },
      {
        schema: "dc",
        element: "title",
        field: "dc.title.alternative",
        source: "dublin-core-types.xml",
        qualifier: "alternative",
        scopeNote: "Varying (or substitute) form of title proper appearing in item, e.g. abbreviation or translation"
      },
      {
        schema: "dc",
        element: "type",
        field: "dc.type",
        source: "dublin-core-types.xml",
        scopeNote: "Nature or genre of content."
      },
      {
        schema: "dc",
        element: "provenance",
        field: "dc.provenance",
        source: "dublin-core-types.xml"
      },
      {
        schema: "dc",
        element: "rights",
        field: "dc.rights.license",
        source: "dublin-core-types.xml",
        qualifier: "license"
      },
      {
        schema: "dc",
        element: "acronym",
        field: "dc.acronym",
        source: "dublin-core-types.xml"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.publication",
        source: "dublin-core-types.xml",
        qualifier: "publication"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.isbn",
        source: "dublin-core-types.xml",
        qualifier: "isbn"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.doi",
        source: "dublin-core-types.xml",
        qualifier: "doi"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.issn",
        source: "dublin-core-types.xml",
        qualifier: "issn"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.equipment",
        source: "dublin-core-types.xml",
        qualifier: "equipment"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.references",
        source: "dublin-core-types.xml",
        qualifier: "references"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.patent",
        source: "dublin-core-types.xml",
        qualifier: "patent"
      },
      {
        schema: "dc",
        element: "coverage",
        field: "dc.coverage.publication",
        source: "dublin-core-types.xml",
        qualifier: "publication"
      },
      {
        schema: "dc",
        element: "coverage",
        field: "dc.coverage.isbn",
        source: "dublin-core-types.xml",
        qualifier: "isbn"
      },
      {
        schema: "dc",
        element: "coverage",
        field: "dc.coverage.doi",
        source: "dublin-core-types.xml",
        qualifier: "doi"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.volume",
        source: "dublin-core-types.xml",
        qualifier: "volume"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.issue",
        source: "dublin-core-types.xml",
        qualifier: "issue"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.startpage",
        source: "dublin-core-types.xml",
        qualifier: "startpage"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.endpage",
        source: "dublin-core-types.xml",
        qualifier: "endpage"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.patentno",
        source: "dublin-core-types.xml",
        qualifier: "patentno"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.patentnumber",
        source: "dublin-core-types.xml",
        qualifier: "patentnumber"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.applicationnumber",
        source: "dublin-core-types.xml",
        qualifier: "applicationnumber"
      },
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.applicant",
        source: "dublin-core-types.xml",
        qualifier: "applicant"
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.filled",
        source: "dublin-core-types.xml",
        qualifier: "filled"
      },
      {
        schema: "dc",
        element: "subject",
        field: "dc.subject.ipc",
        source: "dublin-core-types.xml",
        qualifier: "ipc"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.openalex",
        source: "dublin-core-types.xml",
        qualifier: "openalex",
        scopeNote: "The OpenAlex identifier"
      }
    ],
    namespace: "http://dublincore.org/documents/dcmi-terms/",
    title: "DSpace Dublin Core Types Registry"
  },
  {
    name: "eperson",
    source: "eperson-types.xml",
    fields: [
      {
        schema: "eperson",
        element: "firstname",
        field: "eperson.firstname",
        source: "eperson-types.xml",
        scopeNote: "Metadata field used for the first name"
      },
      {
        schema: "eperson",
        element: "lastname",
        field: "eperson.lastname",
        source: "eperson-types.xml",
        scopeNote: "Metadata field used for the last name"
      },
      {
        schema: "eperson",
        element: "phone",
        field: "eperson.phone",
        source: "eperson-types.xml",
        scopeNote: "Metadata field used for the phone number"
      },
      {
        schema: "eperson",
        element: "language",
        field: "eperson.language",
        source: "eperson-types.xml",
        scopeNote: "Metadata field used for the language"
      },
      {
        schema: "eperson",
        element: "orcid",
        field: "eperson.orcid",
        source: "eperson-types.xml",
        scopeNote: "Metadata field used for the ORCID id"
      },
      {
        schema: "eperson",
        element: "orcid",
        field: "eperson.orcid.scope",
        source: "eperson-types.xml",
        qualifier: "scope",
        scopeNote: "Metadata field used for the granted ORCID scopes"
      }
    ],
    namespace: "http://dspace.org/eperson",
    title: "DSpace EPerson"
  },
  {
    name: "iiif",
    source: "iiif-types.xml",
    fields: [
      {
        schema: "iiif",
        element: "label",
        field: "iiif.label",
        source: "iiif-types.xml",
        scopeNote: "Metadata field used to set the IIIF label associated with the resource otherwise the system will derive one according to the configuration and metadata"
      },
      {
        schema: "iiif",
        element: "description",
        field: "iiif.description",
        source: "iiif-types.xml",
        scopeNote: "Metadata field used to set the IIIF description associated with the resource"
      },
      {
        schema: "iiif",
        element: "toc",
        field: "iiif.toc",
        source: "iiif-types.xml",
        scopeNote: "Metadata field used to set the position of the iiif resource in the structure. Levels are separated by triple pipe ||| can be applied to Bundles and Bitstreams"
      },
      {
        schema: "iiif",
        element: "canvas",
        field: "iiif.canvas.naming",
        source: "iiif-types.xml",
        qualifier: "naming",
        scopeNote: "Metadata field used to set the base label used to name all the canvas in the Item. The canvas label will be generated using the value of this metadata as prefix and the canvas position"
      },
      {
        schema: "iiif",
        element: "viewing",
        field: "iiif.viewing.hint",
        source: "iiif-types.xml",
        qualifier: "hint",
        scopeNote: "Metadata field used to set the viewing hint overriding the configuration value if any"
      },
      {
        schema: "iiif",
        element: "image",
        field: "iiif.image.width",
        source: "iiif-types.xml",
        qualifier: "width",
        scopeNote: "Metadata field used to store the width of an image in px"
      },
      {
        schema: "iiif",
        element: "image",
        field: "iiif.image.height",
        source: "iiif-types.xml",
        qualifier: "height",
        scopeNote: "Metadata field used to store the height of an image in px"
      },
      {
        schema: "iiif",
        element: "search",
        field: "iiif.search.enabled",
        source: "iiif-types.xml",
        qualifier: "enabled",
        scopeNote: "Metadata field used to enable the IIIF Search service at the item level"
      }
    ],
    namespace: "http://dspace.org/iiif",
    title: "DSpace IIIF Schema"
  },
  {
    name: "local",
    source: "local-types.xml",
    fields: [],
    namespace: "http://dspace.org/namespace/local/",
    title: "Registry of instance-specific metadata fields"
  },
  {
    name: "miur",
    source: "miur-types.xml",
    fields: [
      {
        schema: "miur",
        element: "journal",
        field: "miur.journal.startdate",
        source: "miur-types.xml",
        qualifier: "startdate"
      },
      {
        schema: "miur",
        element: "journal",
        field: "miur.journal.enddate",
        source: "miur-types.xml",
        qualifier: "enddate"
      },
      {
        schema: "miur",
        element: "journal",
        field: "miur.journal.type",
        source: "miur-types.xml",
        qualifier: "type"
      },
      {
        schema: "miur",
        element: "identifier",
        field: "miur.identifier.ance",
        source: "miur-types.xml",
        qualifier: "ance"
      },
      {
        schema: "miur",
        element: "person",
        field: "miur.person.cf",
        source: "miur-types.xml",
        qualifier: "cf"
      },
      {
        schema: "miur",
        element: "type",
        field: "miur.type.referee",
        source: "miur-types.xml",
        qualifier: "referee"
      },
      {
        schema: "miur",
        element: "patent",
        field: "miur.patent.relevance",
        source: "miur-types.xml",
        qualifier: "relevance"
      },
      {
        schema: "miur",
        element: "bitstream",
        field: "miur.bitstream.synch",
        source: "miur-types.xml",
        qualifier: "synch"
      },
      {
        schema: "miur",
        element: "journal",
        field: "miur.journal.othertitle",
        source: "miur-types.xml",
        qualifier: "othertitle"
      },
      {
        schema: "miur",
        element: "journal",
        field: "miur.journal.ance",
        source: "miur-types.xml",
        qualifier: "ance"
      },
      {
        schema: "miur",
        element: "type",
        field: "miur.type",
        source: "miur-types.xml"
      }
    ],
    namespace: "http://dspace.org/miur",
    title: "DSpace Miur Types"
  },
  {
    name: "oairecerif",
    source: "openaire-cerif-types.xml",
    fields: [
      {
        schema: "oairecerif",
        element: "author",
        field: "oairecerif.author.affiliation",
        source: "openaire-cerif-types.xml",
        qualifier: "affiliation"
      },
      {
        schema: "oairecerif",
        element: "editor",
        field: "oairecerif.editor.affiliation",
        source: "openaire-cerif-types.xml",
        qualifier: "affiliation"
      },
      {
        schema: "oairecerif",
        element: "identifier",
        field: "oairecerif.identifier.url",
        source: "openaire-cerif-types.xml",
        qualifier: "url"
      },
      {
        schema: "oairecerif",
        element: "affiliation",
        field: "oairecerif.affiliation.orgunit",
        source: "openaire-cerif-types.xml",
        qualifier: "orgunit"
      },
      {
        schema: "oairecerif",
        element: "affiliation",
        field: "oairecerif.affiliation.startDate",
        source: "openaire-cerif-types.xml",
        qualifier: "startDate"
      },
      {
        schema: "oairecerif",
        element: "affiliation",
        field: "oairecerif.affiliation.endDate",
        source: "openaire-cerif-types.xml",
        qualifier: "endDate"
      },
      {
        schema: "oairecerif",
        element: "affiliation",
        field: "oairecerif.affiliation.role",
        source: "openaire-cerif-types.xml",
        qualifier: "role"
      },
      {
        schema: "oairecerif",
        element: "person",
        field: "oairecerif.person.gender",
        source: "openaire-cerif-types.xml",
        qualifier: "gender"
      },
      {
        schema: "oairecerif",
        element: "person",
        field: "oairecerif.person.affiliation",
        source: "openaire-cerif-types.xml",
        qualifier: "affiliation"
      },
      {
        schema: "oairecerif",
        element: "acronym",
        field: "oairecerif.acronym",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "internalid",
        field: "oairecerif.internalid",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "funder",
        field: "oairecerif.funder",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "oamandate",
        field: "oairecerif.oamandate",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "oamandate",
        field: "oairecerif.oamandate.url",
        source: "openaire-cerif-types.xml",
        qualifier: "url"
      },
      {
        schema: "oairecerif",
        element: "project",
        field: "oairecerif.project.startDate",
        source: "openaire-cerif-types.xml",
        qualifier: "startDate"
      },
      {
        schema: "oairecerif",
        element: "project",
        field: "oairecerif.project.endDate",
        source: "openaire-cerif-types.xml",
        qualifier: "endDate"
      },
      {
        schema: "oairecerif",
        element: "project",
        field: "oairecerif.project.status",
        source: "openaire-cerif-types.xml",
        qualifier: "status"
      },
      {
        schema: "oairecerif",
        element: "fundingProgram",
        field: "oairecerif.fundingProgram",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "fundingParent",
        field: "oairecerif.fundingParent",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "amount",
        field: "oairecerif.amount.currency",
        source: "openaire-cerif-types.xml",
        qualifier: "currency"
      },
      {
        schema: "oairecerif",
        element: "amount",
        field: "oairecerif.amount",
        source: "openaire-cerif-types.xml"
      },
      {
        schema: "oairecerif",
        element: "funding",
        field: "oairecerif.funding.identifier",
        source: "openaire-cerif-types.xml",
        qualifier: "identifier"
      },
      {
        schema: "oairecerif",
        element: "funding",
        field: "oairecerif.funding.startDate",
        source: "openaire-cerif-types.xml",
        qualifier: "startDate"
      },
      {
        schema: "oairecerif",
        element: "citation",
        field: "oairecerif.citation.number",
        source: "openaire-cerif-types.xml",
        qualifier: "number"
      },
      {
        schema: "oairecerif",
        element: "funding",
        field: "oairecerif.funding.endDate",
        source: "openaire-cerif-types.xml",
        qualifier: "endDate"
      },
      {
        schema: "oairecerif",
        element: "event",
        field: "oairecerif.event.startDate",
        source: "openaire-cerif-types.xml",
        qualifier: "startDate"
      },
      {
        schema: "oairecerif",
        element: "event",
        field: "oairecerif.event.endDate",
        source: "openaire-cerif-types.xml",
        qualifier: "endDate"
      },
      {
        schema: "oairecerif",
        element: "event",
        field: "oairecerif.event.place",
        source: "openaire-cerif-types.xml",
        qualifier: "place"
      },
      {
        schema: "oairecerif",
        element: "event",
        field: "oairecerif.event.country",
        source: "openaire-cerif-types.xml",
        qualifier: "country"
      }
    ],
    namespace: "https://www.openaire.eu/cerif-profile/1.1/",
    title: "OpenAIRE Cris Types"
  },
  {
    name: "dc",
    source: "openaire-cerif-types.xml",
    fields: [
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.project",
        source: "openaire-cerif-types.xml",
        qualifier: "project"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.funding",
        source: "openaire-cerif-types.xml",
        qualifier: "funding"
      },
      {
        schema: "dc",
        element: "relation",
        field: "dc.relation.grantno",
        source: "openaire-cerif-types.xml",
        qualifier: "grantno"
      }
    ],
    title: "OpenAIRE Cris Types"
  },
  {
    name: "oaire",
    source: "openaire4-types.xml",
    fields: [
      {
        schema: "oaire",
        element: "fundingStream",
        field: "oaire.fundingStream",
        source: "openaire4-types.xml",
        scopeNote: "Name of the funding stream"
      },
      {
        schema: "oaire",
        element: "awardNumber",
        field: "oaire.awardNumber",
        source: "openaire4-types.xml",
        scopeNote: "Project grantId or awardNumber"
      },
      {
        schema: "oaire",
        element: "awardURI",
        field: "oaire.awardURI",
        source: "openaire4-types.xml",
        scopeNote: "URI of the project landing page provided by the funder for more information about the award (grant)."
      },
      {
        schema: "oaire",
        element: "awardTitle",
        field: "oaire.awardTitle",
        source: "openaire4-types.xml",
        scopeNote: "Title of the project, award or grant."
      },
      {
        schema: "oaire",
        element: "version",
        field: "oaire.version",
        source: "openaire4-types.xml",
        scopeNote: "Use either a version number or the label of the vocabulary term as value."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.title",
        source: "openaire4-types.xml",
        qualifier: "title",
        scopeNote: "The title name of the container (e.g. journal, book, conference) this work is published in. This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.volume",
        source: "openaire4-types.xml",
        qualifier: "volume",
        scopeNote: "The volume, typically a number, of the container (e.g. journal). This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.issue",
        source: "openaire4-types.xml",
        qualifier: "issue",
        scopeNote: "The issue of the container (e.g. journal). This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.startPage",
        source: "openaire4-types.xml",
        qualifier: "startPage",
        scopeNote: "The start page is part of the pagination information of the work published in a container (e.g. journal issue). This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.endPage",
        source: "openaire4-types.xml",
        qualifier: "endPage",
        scopeNote: "The end page is part of the pagination information of the work published in a container (e.g. journal issue). This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.edition",
        source: "openaire4-types.xml",
        qualifier: "edition",
        scopeNote: "The edition the work was published in (e.g. book edition). This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.conferencePlace",
        source: "openaire4-types.xml",
        qualifier: "conferencePlace",
        scopeNote: "The place where the conference took place. This property is considered to be part of the bibliographic citation."
      },
      {
        schema: "oaire",
        element: "citation",
        field: "oaire.citation.conferenceDate",
        source: "openaire4-types.xml",
        qualifier: "conferenceDate",
        scopeNote: "The date when the conference took place. This property is considered to be part of the bibliographic citation. Recommended best practice for encoding the date value is defined in a profile of ISO 8601 [W3CDTF] and follows the YYYY-MM-DD format."
      }
    ],
    namespace: "http://namespace.openaire.eu/schema/oaire/",
    title: "OpenAIRE v4 fields definition"
  },
  {
    name: "orgunit",
    source: "orgunit-types.xml",
    fields: [
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.name",
        source: "orgunit-types.xml",
        qualifier: "name"
      },
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.id",
        source: "orgunit-types.xml",
        qualifier: "id"
      },
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.dateestablished",
        source: "orgunit-types.xml",
        qualifier: "dateestablished"
      },
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.city",
        source: "orgunit-types.xml",
        qualifier: "city"
      },
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.country",
        source: "orgunit-types.xml",
        qualifier: "country"
      },
      {
        schema: "orgunit",
        element: "identifier",
        field: "orgunit.identifier.description",
        source: "orgunit-types.xml",
        qualifier: "description"
      }
    ],
    namespace: "http://dspace.org/orgunit",
    title: "DSpace OrgUnit Types"
  },
  {
    name: "relation",
    source: "relationship-formats.xml",
    fields: [
      {
        schema: "relation",
        element: "isAuthorOfPublication",
        field: "relation.isAuthorOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" AUTHORS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any AUTHOR where the AUTHOR is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isAuthorOfPublication",
        field: "relation.isAuthorOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of AUTHORS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from an AUTHOR, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfAuthor",
        field: "relation.isPublicationOfAuthor",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current AUTHOR links to via a relationship. In other words, this stores all relationships pointing from the current AUTHOR to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfAuthor",
        field: "relation.isPublicationOfAuthor.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PUBLICATIONS which link to the current AUTHOR via a \"latest\" relationship. In other words, this stores all relationships pointing to the current AUTHOR from any PUBLICATION, implying that the AUTHOR is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfPublication",
        field: "relation.isProjectOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfPublication",
        field: "relation.isProjectOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PROJECTS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any PROJECT, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfProject",
        field: "relation.isPublicationOfProject",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfProject",
        field: "relation.isPublicationOfProject.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PUBLICATIONS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any PUBLICATION, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfPublication",
        field: "relation.isOrgUnitOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfPublication",
        field: "relation.isOrgUnitOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of ORGANISATIONAL UNITSS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any ORGANISATIONAL UNITS, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfOrgUnit",
        field: "relation.isPublicationOfOrgUnit",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfOrgUnit",
        field: "relation.isPublicationOfOrgUnit.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PUBLICATIONS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PUBLICATION, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfPerson",
        field: "relation.isProjectOfPerson",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current PERSON links to via a relationship. In other words, this stores all relationships pointing from the current PERSON to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfPerson",
        field: "relation.isProjectOfPerson.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PROJECTS which link to the current PERSON via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PERSON from any PROJECT, implying that the PERSON is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPersonOfProject",
        field: "relation.isPersonOfProject",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PERSONS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any PERSON where the PERSON is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPersonOfProject",
        field: "relation.isPersonOfProject.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PERSONS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any PERSON, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfPerson",
        field: "relation.isOrgUnitOfPerson",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PERSON links to via a relationship. In other words, this stores all relationships pointing from the current PERSON to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfPerson",
        field: "relation.isOrgUnitOfPerson.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of ORGANISATIONAL UNITS which link to the current PERSON via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PERSON from any ORGANISATIONAL UNIT, implying that the PERSON is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPersonOfOrgUnit",
        field: "relation.isPersonOfOrgUnit",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PERSONS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PERSON where the PERSON is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPersonOfOrgUnit",
        field: "relation.isPersonOfOrgUnit.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PERSONS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PERSON, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfProject",
        field: "relation.isOrgUnitOfProject",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isOrgUnitOfProject",
        field: "relation.isOrgUnitOfProject.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of ORGANISATIONAL UNITS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any ORGANISATIONAL UNIT, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfOrgUnit",
        field: "relation.isProjectOfOrgUnit",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfOrgUnit",
        field: "relation.isProjectOfOrgUnit.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PROEJCTS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PROEJCT, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isVolumeOfJournal",
        field: "relation.isVolumeOfJournal",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" VOLUMES that the current JOURNAL links to via a relationship. In other words, this stores all relationships pointing from the current JOURNAL to any VOLUME where the VOLUME is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isVolumeOfJournal",
        field: "relation.isVolumeOfJournal.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of VOLUMES which link to the current JOURNAL via a \"latest\" relationship. In other words, this stores all relationships pointing to the current JOURNAL from any VOLUME, implying that the JOURNAL is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalOfVolume",
        field: "relation.isJournalOfVolume",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" JOURNALS that the current VOLUME links to via a relationship. In other words, this stores all relationships pointing from the current VOLUME to any JOURNAL where the JOURNAL is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalOfVolume",
        field: "relation.isJournalOfVolume.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of JOURNALS which link to the current VOLUME via a \"latest\" relationship. In other words, this stores all relationships pointing to the current VOLUME from any JOURNAL, implying that the VOLUME is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isIssueOfJournalVolume",
        field: "relation.isIssueOfJournalVolume",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" ISSUES that the current VOLUME links to via a relationship. In other words, this stores all relationships pointing from the current VOLUME to any ISSUE where the ISSUE is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isIssueOfJournalVolume",
        field: "relation.isIssueOfJournalVolume.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of ISSUES which link to the current VOLUME via a \"latest\" relationship. In other words, this stores all relationships pointing to the current VOLUME from any ISSUE, implying that the VOLUME is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalVolumeOfIssue",
        field: "relation.isJournalVolumeOfIssue",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" VOLUMES that the current ISSUE links to via a relationship. In other words, this stores all relationships pointing from the current ISSUE to any VOLUME where the VOLUME is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalVolumeOfIssue",
        field: "relation.isJournalVolumeOfIssue.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of VOLUMES which link to the current ISSUE via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ISSUE from any VOLUME, implying that the ISSUE is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalOfPublication",
        field: "relation.isJournalOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" JOURNALS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any JOURNAL where the JOURNAL is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalOfPublication",
        field: "relation.isJournalOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of JOURNALS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any JOURNAL, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalIssueOfPublication",
        field: "relation.isJournalIssueOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" ISSUES that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any ISSUE where the ISSUE is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isJournalIssueOfPublication",
        field: "relation.isJournalIssueOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of ISSUES which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any ISSUE, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfJournalIssue",
        field: "relation.isPublicationOfJournalIssue",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current ISSUE links to via a relationship. In other words, this stores all relationships pointing from the current ISSUE to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfJournalIssue",
        field: "relation.isPublicationOfJournalIssue.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PUBLICATIONS which link to the current ISSUE via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ISSUE from any PUBLICATION, implying that the ISSUE is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isContributorOfPublication",
        field: "relation.isContributorOfPublication",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" CONTRIBUTORS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any CONTRIBUTOR where the CONTRIBUTOR is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isContributorOfPublication",
        field: "relation.isContributorOfPublication.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of CONTRIBUTORS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any CONTRIBUTOR, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfContributor",
        field: "relation.isPublicationOfContributor",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current CONTRIBUTOR links to via a relationship. In other words, this stores all relationships pointing from the current CONTRIBUTOR to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isPublicationOfContributor",
        field: "relation.isPublicationOfContributor.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PUBLICATIONS which link to the current CONTRIBUTOR via a \"latest\" relationship. In other words, this stores all relationships pointing to the current CONTRIBUTOR from any PUBLICATION, implying that the CONTRIBUTOR is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isFundingAgencyOfProject",
        field: "relation.isFundingAgencyOfProject",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" FUNDING AGENCIES that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any FUNDING AGENCY where the FUNDING AGENCY is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isFundingAgencyOfProject",
        field: "relation.isFundingAgencyOfProject.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of FUNDING AGENCIES which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any FUNDING AGENCY, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfFundingAgency",
        field: "relation.isProjectOfFundingAgency",
        source: "relationship-formats.xml",
        scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current FUNDING AGENCY links to via a relationship. In other words, this stores all relationships pointing from the current FUNDING AGENCY to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isProjectOfFundingAgency",
        field: "relation.isProjectOfFundingAgency.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery",
        scopeNote: "Contains all uuids of PROJECTS which link to the current FUNDING AGENCY via a \"latest\" relationship. In other words, this stores all relationships pointing to the current FUNDING AGENCY from any PROJECT, implying that the FUNDING AGENCY is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
      },
      {
        schema: "relation",
        element: "isCorrectionOfItem",
        field: "relation.isCorrectionOfItem",
        source: "relationship-formats.xml"
      },
      {
        schema: "relation",
        element: "isCorrectionOfItem",
        field: "relation.isCorrectionOfItem.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery"
      },
      {
        schema: "relation",
        element: "isCorrectedByItem",
        field: "relation.isCorrectedByItem",
        source: "relationship-formats.xml"
      },
      {
        schema: "relation",
        element: "isCorrectedByItem",
        field: "relation.isCorrectedByItem.latestForDiscovery",
        source: "relationship-formats.xml",
        qualifier: "latestForDiscovery"
      }
    ],
    namespace: "http://dspace.org/relation",
    title: "DSpace Entity Relationships"
  },
  {
    name: "organization",
    source: "schema-organization-types.xml",
    fields: [
      {
        schema: "organization",
        element: "legalName",
        field: "organization.legalName",
        source: "schema-organization-types.xml",
        scopeNote: "The official name of the organization, e.g. the registered company name."
      },
      {
        schema: "organization",
        element: "foundingDate",
        field: "organization.foundingDate",
        source: "schema-organization-types.xml",
        scopeNote: "The date that this organization was founded."
      },
      {
        schema: "organization",
        element: "endDate",
        field: "organization.endDate",
        source: "schema-organization-types.xml"
      },
      {
        schema: "organization",
        element: "address",
        field: "organization.address.addressLocality",
        source: "schema-organization-types.xml",
        qualifier: "addressLocality",
        scopeNote: "Physical address locality (ex. Mountain View) of the organization."
      },
      {
        schema: "organization",
        element: "address",
        field: "organization.address.addressCountry",
        source: "schema-organization-types.xml",
        qualifier: "addressCountry",
        scopeNote: "Physical address country (ex. USA) of the organization. You can also provide the two-letter ISO 3166-1 alpha-2 country code."
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier",
        source: "schema-organization-types.xml",
        scopeNote: "Generic Identifier"
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.isni",
        source: "schema-organization-types.xml",
        qualifier: "isni",
        scopeNote: "International Standard Name Identifier"
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.rin",
        source: "schema-organization-types.xml",
        qualifier: "rin",
        scopeNote: "Ringgold identifier"
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.ror",
        source: "schema-organization-types.xml",
        qualifier: "ror",
        scopeNote: "Research Organization Registry"
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.crossrefid",
        source: "schema-organization-types.xml",
        qualifier: "crossrefid",
        scopeNote: "Crossref identifier"
      },
      {
        schema: "organization",
        element: "parentOrganization",
        field: "organization.parentOrganization",
        source: "schema-organization-types.xml",
        scopeNote: "The larger organization that this organization is a subOrganization of, if any."
      },
      {
        schema: "organization",
        element: "alternateName",
        field: "organization.alternateName",
        source: "schema-organization-types.xml",
        scopeNote: "An alias for the organization."
      },
      {
        schema: "organization",
        element: "url",
        field: "organization.url",
        source: "schema-organization-types.xml",
        scopeNote: "Url of the organization."
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.lei",
        source: "schema-organization-types.xml",
        qualifier: "lei",
        scopeNote: "Legal Entity Identifier"
      },
      {
        schema: "organization",
        element: "identifier",
        field: "organization.identifier.crossrefid",
        source: "schema-organization-types.xml",
        qualifier: "crossrefid",
        scopeNote: "CrossRef Funder Registry"
      },
      {
        schema: "organization",
        element: "parentOrganization",
        field: "organization.parentOrganization",
        source: "schema-organization-types.xml",
        scopeNote: "The larger organization that this organization is a subOrganization of, if any."
      }
    ],
    namespace: "https://schema.org/Organization",
    title: "Organization Types"
  },
  {
    name: "periodical",
    source: "schema-periodical-types.xml",
    fields: [],
    namespace: "https://schema.org/Periodical",
    title: "Periodical Types"
  },
  {
    name: "creativework",
    source: "schema-periodical-types.xml",
    fields: [
      {
        schema: "creativework",
        element: "editor",
        field: "creativework.editor",
        source: "schema-periodical-types.xml",
        scopeNote: "Specifies the Person who edited the CreativeWork."
      },
      {
        schema: "creativework",
        element: "publisher",
        field: "creativework.publisher",
        source: "schema-periodical-types.xml",
        scopeNote: "The publisher of the creative work."
      }
    ],
    namespace: "https://schema.org/CreativeWork",
    title: "Periodical Types"
  },
  {
    name: "creativeworkseries",
    source: "schema-periodical-types.xml",
    fields: [
      {
        schema: "creativeworkseries",
        element: "issn",
        field: "creativeworkseries.issn",
        source: "schema-periodical-types.xml",
        scopeNote: "The International Standard Serial Number (ISSN) that identifies this serial publication. You can repeat this property to identify different formats of, or the linking ISSN (ISSN-L) for, this serial publication."
      }
    ],
    namespace: "https://schema.org/CreativeWorkSeries",
    title: "Periodical Types"
  },
  {
    name: "person",
    source: "schema-person-types.xml",
    fields: [
      {
        schema: "person",
        element: "givenName",
        field: "person.givenName",
        source: "schema-person-types.xml",
        scopeNote: "Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property."
      },
      {
        schema: "person",
        element: "familyName",
        field: "person.familyName",
        source: "schema-person-types.xml",
        scopeNote: "Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property."
      },
      {
        schema: "person",
        element: "telephone",
        field: "person.telephone",
        source: "schema-person-types.xml",
        scopeNote: "The telephone number."
      },
      {
        schema: "person",
        element: "knowsLanguage",
        field: "person.knowsLanguage",
        source: "schema-person-types.xml",
        scopeNote: "Of a Person, and less typically of an Organization, to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the IETF BCP 47 standard."
      },
      {
        schema: "person",
        element: "email",
        field: "person.email",
        source: "schema-person-types.xml",
        scopeNote: "Email address."
      },
      {
        schema: "person",
        element: "birthDate",
        field: "person.birthDate",
        source: "schema-person-types.xml",
        scopeNote: "Date of birth."
      },
      {
        schema: "person",
        element: "jobTitle",
        field: "person.jobTitle",
        source: "schema-person-types.xml",
        scopeNote: "The job title of the person (for example, Financial Manager)."
      },
      {
        schema: "person",
        element: "affiliation",
        field: "person.affiliation.name",
        source: "schema-person-types.xml",
        qualifier: "name",
        scopeNote: "The organizational or institutional affiliation of the creator"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier",
        source: "schema-person-types.xml",
        scopeNote: "Generic Identifier"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.scopus-author-id",
        source: "schema-person-types.xml",
        qualifier: "scopus-author-id",
        scopeNote: "Scopus Author ID"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.ciencia-id",
        source: "schema-person-types.xml",
        qualifier: "ciencia-id",
        scopeNote: "Permanent individual means of identification and authentication for citizens carrying out scientific activity. - https://www.ciencia-id.pt/"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.gsid",
        source: "schema-person-types.xml",
        qualifier: "gsid",
        scopeNote: "Google Scholar ID"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.orcid",
        source: "schema-person-types.xml",
        qualifier: "orcid",
        scopeNote: "Open Researcher and Contributor ID"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.rid",
        source: "schema-person-types.xml",
        qualifier: "rid",
        scopeNote: "Web of Science ResearcherID"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.isni",
        source: "schema-person-types.xml",
        qualifier: "isni",
        scopeNote: "International Standard Name Identifier"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.research-gate-id",
        source: "schema-person-types.xml",
        qualifier: "research-gate-id"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.twitter-id",
        source: "schema-person-types.xml",
        qualifier: "twitter-id"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.facebook-id",
        source: "schema-person-types.xml",
        qualifier: "facebook-id"
      },
      {
        schema: "person",
        element: "identifier",
        field: "person.identifier.linkedin-id",
        source: "schema-person-types.xml",
        qualifier: "linkedin-id"
      }
    ],
    namespace: "https://schema.org/Person",
    title: "Person Types"
  },
  {
    name: "project",
    source: "schema-project-types.xml",
    fields: [
      {
        schema: "project",
        element: "funder",
        field: "project.funder.name",
        source: "schema-project-types.xml",
        qualifier: "name",
        scopeNote: "Name of the funding provider."
      },
      {
        schema: "project",
        element: "funder",
        field: "project.funder.identifier",
        source: "schema-project-types.xml",
        qualifier: "identifier",
        scopeNote: "Unique identifier of the funding entity."
      },
      {
        schema: "project",
        element: "investigator",
        field: "project.investigator",
        source: "schema-project-types.xml",
        scopeNote: "Project investigator"
      },
      {
        schema: "project",
        element: "startDate",
        field: "project.startDate",
        source: "schema-project-types.xml",
        scopeNote: "The project start date"
      },
      {
        schema: "project",
        element: "endDate",
        field: "project.endDate",
        source: "schema-project-types.xml",
        scopeNote: "The project end date"
      },
      {
        schema: "project",
        element: "amount",
        field: "project.amount",
        source: "schema-project-types.xml",
        scopeNote: "The project amount"
      },
      {
        schema: "project",
        element: "amount",
        field: "project.amount.currency",
        source: "schema-project-types.xml",
        qualifier: "currency",
        scopeNote: "The project amount currency"
      }
    ],
    namespace: "https://schema.org/Project",
    title: "Project Types"
  },
  {
    name: "publicationissue",
    source: "schema-publicationIssue-types.xml",
    fields: [
      {
        schema: "publicationissue",
        element: "issueNumber",
        field: "publicationissue.issueNumber",
        source: "schema-publicationIssue-types.xml",
        scopeNote: "Identifies the issue of publication; for example, \"iii\" or \"2\"."
      }
    ],
    namespace: "https://schema.org/PublicationIssue",
    title: "Publication Issue Types"
  },
  {
    name: "creativework",
    source: "schema-publicationIssue-types.xml",
    fields: [
      {
        schema: "creativework",
        element: "keywords",
        field: "creativework.keywords",
        source: "schema-publicationIssue-types.xml",
        scopeNote: "Keywords or tags used to describe this content. Multiple entries in a keywords list are typically delimited by commas."
      }
    ],
    namespace: "https://schema.org/CreativeWork",
    title: "Publication Issue Types"
  },
  {
    name: "publicationvolume",
    source: "schema-publicationVolume-types.xml",
    fields: [
      {
        schema: "publicationvolume",
        element: "volumeNumber",
        field: "publicationvolume.volumeNumber",
        source: "schema-publicationVolume-types.xml",
        scopeNote: "Identifies the volume of publication or multi-part work; for example, \"iii\" or \"2\"."
      }
    ],
    namespace: "https://schema.org/PublicationVolume",
    title: "Publication Volume Types"
  },
  {
    name: "creativework",
    source: "schema-publicationVolume-types.xml",
    fields: [
      {
        schema: "creativework",
        element: "datePublished",
        field: "creativework.datePublished",
        source: "schema-publicationVolume-types.xml",
        scopeNote: "Date of first broadcast/publication."
      }
    ],
    namespace: "https://schema.org/CreativeWork",
    title: "Publication Volume Types"
  },
  {
    name: "thesis",
    source: "schema-thesis-types.xml",
    fields: [
      {
        schema: "thesis",
        element: "inSupportOf",
        field: "thesis.inSupportOf",
        source: "schema-thesis-types.xml",
        scopeNote: "Qualification, candidature, degree, application that Thesis supports."
      }
    ],
    namespace: "https://schema.org/Thesis",
    title: "Thesis Types"
  },
  {
    name: "dc",
    source: "sword-metadata.xml",
    fields: [
      {
        schema: "dc",
        element: "contributor",
        field: "dc.contributor.author",
        source: "sword-metadata.xml",
        qualifier: "author",
        scopeNote: "The author of the item"
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.issued",
        source: "sword-metadata.xml",
        qualifier: "issued",
        scopeNote: "The date of publication"
      },
      {
        schema: "dc",
        element: "date",
        field: "dc.date.updated",
        source: "sword-metadata.xml",
        qualifier: "updated",
        scopeNote: "The last time the item was updated via the SWORD interface"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.abstract",
        source: "sword-metadata.xml",
        qualifier: "abstract",
        scopeNote: "Item summary or abstract"
      },
      {
        schema: "dc",
        element: "description",
        field: "dc.description.version",
        source: "sword-metadata.xml",
        qualifier: "version",
        scopeNote: "The Peer Reviewed status of an item"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.uri",
        source: "sword-metadata.xml",
        qualifier: "uri",
        scopeNote: "a uri to a copy of the item"
      },
      {
        schema: "dc",
        element: "identifier",
        field: "dc.identifier.slug",
        source: "sword-metadata.xml",
        qualifier: "slug",
        scopeNote: "a uri supplied via the sword slug header, as a suggested uri for the item"
      },
      {
        schema: "dc",
        element: "language",
        field: "dc.language.rfc3066",
        source: "sword-metadata.xml",
        qualifier: "rfc3066",
        scopeNote: "the rfc3066 form of the language for the item"
      },
      {
        schema: "dc",
        element: "rights",
        field: "dc.rights.holder",
        source: "sword-metadata.xml",
        qualifier: "holder",
        scopeNote: "The owner of the copyright"
      },
      {
        schema: "dc",
        element: "title",
        field: "dc.title",
        source: "sword-metadata.xml",
        scopeNote: "The title of the item"
      },
      {
        schema: "dc",
        element: "type",
        field: "dc.type",
        source: "sword-metadata.xml",
        scopeNote: "The type of the item, as defined by the eprints application profile"
      }
    ],
    title: "Metadata Types Registry for SWORD"
  },
  {
    name: "workflow",
    source: "workflow-types.xml",
    fields: [
      {
        schema: "workflow",
        element: "score",
        field: "workflow.score",
        source: "workflow-types.xml",
        scopeNote: "Metadata field used for the score review rating"
      },
      {
        schema: "workflow",
        element: "review",
        field: "workflow.review",
        source: "workflow-types.xml",
        scopeNote: "Metadata field used for the score review description"
      }
    ],
    namespace: "http://www.dspace.org/workflow",
    title: "DSpace Submission Workflow Types Registry"
  }
];

export const METADATA_FIELDS: MetadataFieldConfig[] = [
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.dashbundle",
    source: "av-types.xml",
    qualifier: "dashbundle"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.height",
    source: "av-types.xml",
    qualifier: "height"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.width",
    source: "av-types.xml",
    qualifier: "width"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.duration",
    source: "av-types.xml",
    qualifier: "duration"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.format",
    source: "av-types.xml",
    qualifier: "format"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.codec",
    source: "av-types.xml",
    qualifier: "codec"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.fps",
    source: "av-types.xml",
    qualifier: "fps"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.audioformat",
    source: "av-types.xml",
    qualifier: "audioformat"
  },
  {
    schema: "bitstream",
    element: "video",
    field: "bitstream.video.audiocodec",
    source: "av-types.xml",
    qualifier: "audiocodec"
  },
  {
    schema: "bitstream",
    element: "audio",
    field: "bitstream.audio.peaks",
    source: "av-types.xml",
    qualifier: "peaks"
  },
  {
    schema: "bitstream",
    element: "scene",
    field: "bitstream.scene.timestamp",
    source: "av-types.xml",
    qualifier: "timestamp"
  },
  {
    schema: "bitstream",
    element: "category",
    field: "bitstream.category",
    source: "av-types.xml"
  },
  {
    schema: "bitstream",
    element: "transcribe",
    field: "bitstream.transcribe.request",
    source: "av-types.xml",
    qualifier: "request"
  },
  {
    schema: "bitstream",
    element: "transcribe",
    field: "bitstream.transcribe.processed",
    source: "av-types.xml",
    qualifier: "processed"
  },
  {
    schema: "bitstream",
    element: "whisper",
    field: "bitstream.whisper.model",
    source: "av-types.xml",
    qualifier: "model"
  },
  {
    schema: "bitstream",
    element: "transcribe",
    field: "bitstream.transcribe.request",
    source: "av-types.xml",
    qualifier: "request"
  },
  {
    schema: "bitstream",
    element: "transcribe",
    field: "bitstream.transcribe.processed",
    source: "av-types.xml",
    qualifier: "processed"
  },
  {
    schema: "bitstream",
    element: "whisper",
    field: "bitstream.whisper.model",
    source: "av-types.xml",
    qualifier: "model"
  },
  {
    schema: "dash",
    element: "manifest",
    field: "dash.manifest",
    source: "av-types.xml"
  },
  {
    schema: "bitstream",
    element: "viewer",
    field: "bitstream.viewer.provider",
    source: "bitstream-types.xml",
    qualifier: "provider",
    scopeNote: "Metadata field used to register custom viewer"
  },
  {
    schema: "bitstream",
    element: "hide",
    field: "bitstream.hide",
    source: "bitstream-types.xml",
    scopeNote: "Metadata field used to hide the bitstream"
  },
  {
    schema: "bitstream",
    element: "iiif",
    field: "bitstream.iiif.canvasid",
    source: "bitstream-types.xml",
    qualifier: "canvasid",
    scopeNote: "Metadata field used to store the canvas identifier (the UUID of the bitstream)"
  },
  {
    schema: "bitstream",
    element: "iiif",
    field: "bitstream.iiif.position",
    source: "bitstream-types.xml",
    qualifier: "position",
    scopeNote: "Metadata field used to store the position of the bitstream"
  },
  {
    schema: "bitstream",
    element: "master",
    field: "bitstream.master",
    source: "bitstream-types.xml",
    scopeNote: "Metadata field used to store the UUID of the master bitstream on the ocr bitstream"
  },
  {
    schema: "bitstream",
    element: "iiif",
    field: "bitstream.iiif.view-orientation",
    source: "bitstream-types.xml",
    qualifier: "view-orientation",
    scopeNote: "Metadata field used to store the rotation necessary to apply to the image to have a proper visualization"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.review",
    source: "coar-types.xml",
    qualifier: "review",
    scopeNote: "Reviewed by"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.endorsement",
    source: "coar-types.xml",
    qualifier: "endorsement",
    scopeNote: "Endorsement"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.examination",
    source: "coar-types.xml",
    qualifier: "examination",
    scopeNote: "Examination"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.refused",
    source: "coar-types.xml",
    qualifier: "refused",
    scopeNote: "Refused by"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.release",
    source: "coar-types.xml",
    qualifier: "release",
    scopeNote: "Released by"
  },
  {
    schema: "coar",
    element: "notify",
    field: "coar.notify.endorsedBy",
    source: "coar-types.xml",
    qualifier: "endorsedBy",
    scopeNote: "Endorsed by"
  },
  {
    schema: "cris",
    element: "sourceId",
    field: "cris.sourceId",
    source: "cris-types.xml",
    scopeNote: "Used by the cris consumer to store the source that has originated the item"
  },
  {
    schema: "cris",
    element: "policy",
    field: "cris.policy.eperson",
    source: "cris-types.xml",
    qualifier: "eperson",
    scopeNote: "Default metadata for custom policies rule"
  },
  {
    schema: "cris",
    element: "policy",
    field: "cris.policy.group",
    source: "cris-types.xml",
    qualifier: "group",
    scopeNote: "Default metadata for custom policies rule"
  },
  {
    schema: "cris",
    element: "submission",
    field: "cris.submission.definition",
    source: "cris-types.xml",
    qualifier: "definition",
    scopeNote: "Metadata to link a collection with a submission type"
  },
  {
    schema: "cris",
    element: "submission",
    field: "cris.submission.definition-correction",
    source: "cris-types.xml",
    qualifier: "definition-correction",
    scopeNote: "Metadata to link a collection with a correction submission type"
  },
  {
    schema: "cris",
    element: "workflow",
    field: "cris.workflow.name",
    source: "cris-types.xml",
    qualifier: "name",
    scopeNote: "Metadata to link a collection with a workflow type"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.email",
    source: "cris-types.xml",
    qualifier: "email"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.preTransform",
    source: "cris-types.xml",
    qualifier: "preTransform"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.postTransform",
    source: "cris-types.xml",
    qualifier: "postTransform"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.itemValidationEnabled",
    source: "cris-types.xml",
    qualifier: "itemValidationEnabled"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.recordValidationEnabled",
    source: "cris-types.xml",
    qualifier: "recordValidationEnabled"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.forceSynchronization",
    source: "cris-types.xml",
    qualifier: "forceSynchronization"
  },
  {
    schema: "cris",
    element: "harvesting",
    field: "cris.harvesting.ccAddress",
    source: "cris-types.xml",
    qualifier: "ccAddress"
  },
  {
    schema: "cris",
    element: "identifier",
    field: "cris.identifier.gscholar",
    source: "cris-types.xml",
    qualifier: "gscholar"
  },
  {
    schema: "cris",
    element: "workspace",
    field: "cris.workspace.shared",
    source: "cris-types.xml",
    qualifier: "shared"
  },
  {
    schema: "cris",
    element: "author",
    field: "cris.author.scopus-author-id",
    source: "cris-types.xml",
    qualifier: "scopus-author-id"
  },
  {
    schema: "cris",
    element: "author",
    field: "cris.author.orcid",
    source: "cris-types.xml",
    qualifier: "orcid"
  },
  {
    schema: "cris",
    element: "author",
    field: "cris.author.rid",
    source: "cris-types.xml",
    qualifier: "rid"
  },
  {
    schema: "cris",
    element: "legacyId",
    field: "cris.legacyId",
    source: "cris-types.xml"
  },
  {
    schema: "cris",
    element: "virtual",
    field: "cris.virtual.department",
    source: "cris-types.xml",
    qualifier: "department"
  },
  {
    schema: "cris",
    element: "virtual",
    field: "cris.virtual.orcid",
    source: "cris-types.xml",
    qualifier: "orcid"
  },
  {
    schema: "cris",
    element: "virtualsource",
    field: "cris.virtualsource.department",
    source: "cris-types.xml",
    qualifier: "department"
  },
  {
    schema: "cris",
    element: "virtualsource",
    field: "cris.virtualsource.orcid",
    source: "cris-types.xml",
    qualifier: "orcid"
  },
  {
    schema: "cris",
    element: "cms",
    field: "cris.cms.home-header",
    source: "cris-types.xml",
    qualifier: "home-header"
  },
  {
    schema: "cris",
    element: "cms",
    field: "cris.cms.home-news",
    source: "cris-types.xml",
    qualifier: "home-news"
  },
  {
    schema: "cris",
    element: "cms",
    field: "cris.cms.footer",
    source: "cris-types.xml",
    qualifier: "footer"
  },
  {
    schema: "cris",
    element: "customurl",
    field: "cris.customurl",
    source: "cris-types.xml"
  },
  {
    schema: "cris",
    element: "customurl",
    field: "cris.customurl.old",
    source: "cris-types.xml",
    qualifier: "old"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.ads",
    source: "cris-types.xml",
    qualifier: "ads"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.loader-ads",
    source: "cris-types.xml",
    qualifier: "loader-ads"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.scopus",
    source: "cris-types.xml",
    qualifier: "scopus"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.scopus-person",
    source: "cris-types.xml",
    qualifier: "scopus-person"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.scopus-publication",
    source: "cris-types.xml",
    qualifier: "scopus-publication"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.wos",
    source: "cris-types.xml",
    qualifier: "wos"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.wos-person",
    source: "cris-types.xml",
    qualifier: "wos-person"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.wos-publication",
    source: "cris-types.xml",
    qualifier: "wos-publication"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.loader-pubmed",
    source: "cris-types.xml",
    qualifier: "loader-pubmed"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.loader-pubmedeu",
    source: "cris-types.xml",
    qualifier: "loader-pubmedeu"
  },
  {
    schema: "cris",
    element: "lastimport",
    field: "cris.lastimport.loader-scopus",
    source: "cris-types.xml",
    qualifier: "loader-scopus"
  },
  {
    schema: "cris",
    element: "entity",
    field: "cris.entity.style",
    source: "cris-types.xml",
    qualifier: "style"
  },
  {
    schema: "cris",
    element: "virtual",
    field: "cris.virtual.journalance",
    source: "cris-types.xml",
    qualifier: "journalance"
  },
  {
    schema: "cris",
    element: "virtualsource",
    field: "cris.virtualsource.journalance",
    source: "cris-types.xml",
    qualifier: "journalance"
  },
  {
    schema: "cris",
    element: "curation",
    field: "cris.curation.process",
    source: "cris-types.xml",
    qualifier: "process"
  },
  {
    schema: "cris",
    element: "curation",
    field: "cris.curation.history",
    source: "cris-types.xml",
    qualifier: "history"
  },
  {
    schema: "crisequipment",
    element: "acronym",
    field: "crisequipment.acronym",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisequipment",
    element: "identifier",
    field: "crisequipment.identifier",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisequipment",
    element: "ownerou",
    field: "crisequipment.ownerou",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisequipment",
    element: "ownerrp",
    field: "crisequipment.ownerrp",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisequipment",
    element: "description",
    field: "crisequipment.description",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisequipment",
    element: "activation",
    field: "crisequipment.activation.date",
    source: "crisequipment-types.xml",
    qualifier: "date"
  },
  {
    schema: "crisequipment",
    element: "manifactured",
    field: "crisequipment.manifactured.date",
    source: "crisequipment-types.xml",
    qualifier: "date"
  },
  {
    schema: "crisequipment",
    element: "serialNumber",
    field: "crisequipment.serialNumber",
    source: "crisequipment-types.xml"
  },
  {
    schema: "crisevent",
    element: "acronym",
    field: "crisevent.acronym",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "type",
    field: "crisevent.type",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "organizerou",
    field: "crisevent.organizerou",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "organizerpj",
    field: "crisevent.organizerpj",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "sponsorou",
    field: "crisevent.sponsorou",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "sponsorpj",
    field: "crisevent.sponsorpj",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "partnerou",
    field: "crisevent.partnerou",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "partnerpj",
    field: "crisevent.partnerpj",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "description",
    field: "crisevent.description",
    source: "crisevents-types.xml"
  },
  {
    schema: "crisevent",
    element: "description",
    field: "crisevent.description.keywords",
    source: "crisevents-types.xml",
    qualifier: "keywords"
  },
  {
    schema: "crisfund",
    element: "award",
    field: "crisfund.award.url",
    source: "crisfund-types.xml",
    qualifier: "url"
  },
  {
    schema: "crisfund",
    element: "award",
    field: "crisfund.award.uri",
    source: "crisfund-types.xml",
    qualifier: "uri"
  },
  {
    schema: "crisfund",
    element: "investigators",
    field: "crisfund.investigators",
    source: "crisfund-types.xml"
  },
  {
    schema: "crisfund",
    element: "coinvestigators",
    field: "crisfund.coinvestigators",
    source: "crisfund-types.xml"
  },
  {
    schema: "crisfund",
    element: "leadorganizations",
    field: "crisfund.leadorganizations",
    source: "crisfund-types.xml"
  },
  {
    schema: "crisfund",
    element: "leadcoorganizations",
    field: "crisfund.leadcoorganizations",
    source: "crisfund-types.xml"
  },
  {
    schema: "crisou",
    element: "acronym",
    field: "crisou.acronym",
    source: "crisou-types.xml"
  },
  {
    schema: "crisou",
    element: "director",
    field: "crisou.director",
    source: "crisou-types.xml"
  },
  {
    schema: "crisou",
    element: "relation",
    field: "crisou.relation.ispartof",
    source: "crisou-types.xml",
    qualifier: "ispartof"
  },
  {
    schema: "crisou",
    element: "date",
    field: "crisou.date",
    source: "crisou-types.xml"
  },
  {
    schema: "crisou",
    element: "boards",
    field: "crisou.boards",
    source: "crisou-types.xml"
  },
  {
    schema: "crisou",
    element: "crossrefid",
    field: "crisou.crossrefid",
    source: "crisou-types.xml"
  },
  {
    schema: "crisou",
    element: "place",
    field: "crisou.place.city",
    source: "crisou-types.xml",
    qualifier: "city"
  },
  {
    schema: "crisou",
    element: "place",
    field: "crisou.place.country",
    source: "crisou-types.xml",
    qualifier: "country"
  },
  {
    schema: "crispatent",
    element: "kind",
    field: "crispatent.kind",
    source: "crispatent-types.xml"
  },
  {
    schema: "crispatent",
    element: "document",
    field: "crispatent.document.kind",
    source: "crispatent-types.xml",
    qualifier: "kind"
  },
  {
    schema: "crispatent",
    element: "document",
    field: "crispatent.document.issueDate",
    source: "crispatent-types.xml",
    qualifier: "issueDate"
  },
  {
    schema: "crispatent",
    element: "document",
    field: "crispatent.document.title",
    source: "crispatent-types.xml",
    qualifier: "title"
  },
  {
    schema: "crispatent",
    element: "document",
    field: "crispatent.document.description",
    source: "crispatent-types.xml",
    qualifier: "description"
  },
  {
    schema: "crispj",
    element: "coordinator",
    field: "crispj.coordinator",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "partnerou",
    field: "crispj.partnerou",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "investigator",
    field: "crispj.investigator",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "coinvestigators",
    field: "crispj.coinvestigators",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "funder",
    field: "crispj.funder",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "openaireid",
    field: "crispj.openaireid",
    source: "crispj-types.xml"
  },
  {
    schema: "crispj",
    element: "organization",
    field: "crispj.organization",
    source: "crispj-types.xml"
  },
  {
    schema: "crisrp",
    element: "qualification",
    field: "crisrp.qualification",
    source: "crisrp-types.xml"
  },
  {
    schema: "crisrp",
    element: "qualification",
    field: "crisrp.qualification.role",
    source: "crisrp-types.xml",
    qualifier: "role"
  },
  {
    schema: "crisrp",
    element: "qualification",
    field: "crisrp.qualification.start",
    source: "crisrp-types.xml",
    qualifier: "start"
  },
  {
    schema: "crisrp",
    element: "qualification",
    field: "crisrp.qualification.end",
    source: "crisrp-types.xml",
    qualifier: "end"
  },
  {
    schema: "crisrp",
    element: "education",
    field: "crisrp.education",
    source: "crisrp-types.xml"
  },
  {
    schema: "crisrp",
    element: "education",
    field: "crisrp.education.start",
    source: "crisrp-types.xml",
    qualifier: "start"
  },
  {
    schema: "crisrp",
    element: "education",
    field: "crisrp.education.end",
    source: "crisrp-types.xml",
    qualifier: "end"
  },
  {
    schema: "crisrp",
    element: "education",
    field: "crisrp.education.role",
    source: "crisrp-types.xml",
    qualifier: "role"
  },
  {
    schema: "crisrp",
    element: "site",
    field: "crisrp.site.title",
    source: "crisrp-types.xml",
    qualifier: "title"
  },
  {
    schema: "crisrp",
    element: "name",
    field: "crisrp.name.alternative",
    source: "crisrp-types.xml",
    qualifier: "alternative"
  },
  {
    schema: "crisrp",
    element: "name",
    field: "crisrp.name.translated",
    source: "crisrp-types.xml",
    qualifier: "translated"
  },
  {
    schema: "crisrp",
    element: "name",
    field: "crisrp.name.variant",
    source: "crisrp-types.xml",
    qualifier: "variant"
  },
  {
    schema: "crisrp",
    element: "workgroup",
    field: "crisrp.workgroup",
    source: "crisrp-types.xml"
  },
  {
    schema: "crisrp",
    element: "country",
    field: "crisrp.country",
    source: "crisrp-types.xml"
  },
  {
    schema: "crisrp",
    element: "name",
    field: "crisrp.name",
    source: "crisrp-types.xml"
  },
  {
    schema: "datacite",
    element: "geoLocation",
    field: "datacite.geoLocation",
    source: "datacite-types.xml",
    scopeNote: "Spatial region or named place where the data was gathered or about which the data is focused."
  },
  {
    schema: "datacite",
    element: "subject",
    field: "datacite.subject.fos",
    source: "datacite-types.xml",
    qualifier: "fos",
    scopeNote: "Fields of Science and Technology - OECD"
  },
  {
    schema: "datacite",
    element: "relation",
    field: "datacite.relation.isReviewedBy",
    source: "datacite-types.xml",
    qualifier: "isReviewedBy",
    scopeNote: "Reviewd by"
  },
  {
    schema: "datacite",
    element: "relation",
    field: "datacite.relation.isReferencedBy",
    source: "datacite-types.xml",
    qualifier: "isReferencedBy",
    scopeNote: "Referenced by"
  },
  {
    schema: "datacite",
    element: "relation",
    field: "datacite.relation.isSupplementedBy",
    source: "datacite-types.xml",
    qualifier: "isSupplementedBy",
    scopeNote: "Supplemented by"
  },
  {
    schema: "datacite",
    element: "rights",
    field: "datacite.rights",
    source: "datacite-types.xml",
    scopeNote: "Name of the TYPE_CUSTOM policy for target Bitstream, derived from OpenAIRE Access Rights"
  },
  {
    schema: "datacite",
    element: "available",
    field: "datacite.available",
    source: "datacite-types.xml",
    scopeNote: "Ending date of the policy for target Bitstream, used with datacite.rights"
  },
  {
    schema: "dq",
    element: "merge",
    field: "dq.merge.target-uri",
    source: "dataquality-types.xml",
    qualifier: "target-uri",
    scopeNote: "stores the value of uri of target item"
  },
  {
    schema: "dcterms",
    element: "abstract",
    field: "dcterms.abstract",
    source: "dcterms-types.xml",
    scopeNote: "A summary of the resource."
  },
  {
    schema: "dcterms",
    element: "accessRights",
    field: "dcterms.accessRights",
    source: "dcterms-types.xml",
    scopeNote: "Information about who can access the resource or an indication of its security status. May include information regarding access or restrictions based on privacy, security, or other policies."
  },
  {
    schema: "dcterms",
    element: "accrualMethod",
    field: "dcterms.accrualMethod",
    source: "dcterms-types.xml",
    scopeNote: "The method by which items are added to a collection."
  },
  {
    schema: "dcterms",
    element: "accrualPeriodicity",
    field: "dcterms.accrualPeriodicity",
    source: "dcterms-types.xml",
    scopeNote: "The frequency with which items are added to a collection."
  },
  {
    schema: "dcterms",
    element: "accrualPolicy",
    field: "dcterms.accrualPolicy",
    source: "dcterms-types.xml",
    scopeNote: "The policy governing the addition of items to a collection."
  },
  {
    schema: "dcterms",
    element: "alternative",
    field: "dcterms.alternative",
    source: "dcterms-types.xml",
    scopeNote: "An alternative name for the resource."
  },
  {
    schema: "dcterms",
    element: "audience",
    field: "dcterms.audience",
    source: "dcterms-types.xml",
    scopeNote: "A class of entity for whom the resource is intended or useful."
  },
  {
    schema: "dcterms",
    element: "available",
    field: "dcterms.available",
    source: "dcterms-types.xml",
    scopeNote: "Date (often a range) that the resource became or will become available."
  },
  {
    schema: "dcterms",
    element: "bibliographicCitation",
    field: "dcterms.bibliographicCitation",
    source: "dcterms-types.xml",
    scopeNote: "Recommended practice is to include sufficient bibliographic detail to identify the resource as unambiguously as possible."
  },
  {
    schema: "dcterms",
    element: "conformsTo",
    field: "dcterms.conformsTo",
    source: "dcterms-types.xml",
    scopeNote: "An established standard to which the described resource conforms."
  },
  {
    schema: "dcterms",
    element: "contributor",
    field: "dcterms.contributor",
    source: "dcterms-types.xml",
    scopeNote: "An entity responsible for making contributions to the resource. Examples of a Contributor include a person, an organization, or a service."
  },
  {
    schema: "dcterms",
    element: "coverage",
    field: "dcterms.coverage",
    source: "dcterms-types.xml",
    scopeNote: "The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant."
  },
  {
    schema: "dcterms",
    element: "created",
    field: "dcterms.created",
    source: "dcterms-types.xml",
    scopeNote: "Date of creation of the resource."
  },
  {
    schema: "dcterms",
    element: "creator",
    field: "dcterms.creator",
    source: "dcterms-types.xml",
    scopeNote: "An entity primarily responsible for making the resource."
  },
  {
    schema: "dcterms",
    element: "date",
    field: "dcterms.date",
    source: "dcterms-types.xml",
    scopeNote: "A point or period of time associated with an event in the lifecycle of the resource."
  },
  {
    schema: "dcterms",
    element: "dateAccepted",
    field: "dcterms.dateAccepted",
    source: "dcterms-types.xml",
    scopeNote: "Date of acceptance of the resource."
  },
  {
    schema: "dcterms",
    element: "dateCopyrighted",
    field: "dcterms.dateCopyrighted",
    source: "dcterms-types.xml",
    scopeNote: "Date of copyright."
  },
  {
    schema: "dcterms",
    element: "dateSubmitted",
    field: "dcterms.dateSubmitted",
    source: "dcterms-types.xml",
    scopeNote: "Date of submission of the resource."
  },
  {
    schema: "dcterms",
    element: "description",
    field: "dcterms.description",
    source: "dcterms-types.xml",
    scopeNote: "An account of the resource."
  },
  {
    schema: "dcterms",
    element: "educationLevel",
    field: "dcterms.educationLevel",
    source: "dcterms-types.xml",
    scopeNote: "A class of entity, defined in terms of progression through an educational or training context, for which the described resource is intended."
  },
  {
    schema: "dcterms",
    element: "extent",
    field: "dcterms.extent",
    source: "dcterms-types.xml",
    scopeNote: "The size or duration of the resource."
  },
  {
    schema: "dcterms",
    element: "format",
    field: "dcterms.format",
    source: "dcterms-types.xml",
    scopeNote: "The file format, physical medium, or dimensions of the resource."
  },
  {
    schema: "dcterms",
    element: "hasFormat",
    field: "dcterms.hasFormat",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is substantially the same as the pre-existing described resource, but in another format."
  },
  {
    schema: "dcterms",
    element: "hasPart",
    field: "dcterms.hasPart",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is included either physically or logically in the described resource."
  },
  {
    schema: "dcterms",
    element: "hasVersion",
    field: "dcterms.hasVersion",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is a version, edition, or adaptation of the described resource."
  },
  {
    schema: "dcterms",
    element: "identifier",
    field: "dcterms.identifier",
    source: "dcterms-types.xml",
    scopeNote: "An unambiguous reference to the resource within a given context."
  },
  {
    schema: "dcterms",
    element: "instructionalMethod",
    field: "dcterms.instructionalMethod",
    source: "dcterms-types.xml",
    scopeNote: "A process, used to engender knowledge, attitudes and skills, that the described resource is designed to support."
  },
  {
    schema: "dcterms",
    element: "isFormatOf",
    field: "dcterms.isFormatOf",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is substantially the same as the described resource, but in another format."
  },
  {
    schema: "dcterms",
    element: "isPartOf",
    field: "dcterms.isPartOf",
    source: "dcterms-types.xml",
    scopeNote: "A related resource in which the described resource is physically or logically included."
  },
  {
    schema: "dcterms",
    element: "isReferencedBy",
    field: "dcterms.isReferencedBy",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that references, cites, or otherwise points to the described resource."
  },
  {
    schema: "dcterms",
    element: "isReplacedBy",
    field: "dcterms.isReplacedBy",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that supplants, displaces, or supersedes the described resource."
  },
  {
    schema: "dcterms",
    element: "isRequiredBy",
    field: "dcterms.isRequiredBy",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that requires the described resource to support its function, delivery, or coherence."
  },
  {
    schema: "dcterms",
    element: "issued",
    field: "dcterms.issued",
    source: "dcterms-types.xml",
    scopeNote: "Date of formal issuance (e.g., publication) of the resource."
  },
  {
    schema: "dcterms",
    element: "isVersionOf",
    field: "dcterms.isVersionOf",
    source: "dcterms-types.xml",
    scopeNote: "A related resource of which the described resource is a version, edition, or adaptation."
  },
  {
    schema: "dcterms",
    element: "language",
    field: "dcterms.language",
    source: "dcterms-types.xml",
    scopeNote: "A language of the resource."
  },
  {
    schema: "dcterms",
    element: "license",
    field: "dcterms.license",
    source: "dcterms-types.xml",
    scopeNote: "A legal document giving official permission to do something with the resource."
  },
  {
    schema: "dcterms",
    element: "mediator",
    field: "dcterms.mediator",
    source: "dcterms-types.xml",
    scopeNote: "An entity that mediates access to the resource and for whom the resource is intended or useful."
  },
  {
    schema: "dcterms",
    element: "medium",
    field: "dcterms.medium",
    source: "dcterms-types.xml",
    scopeNote: "The material or physical carrier of the resource."
  },
  {
    schema: "dcterms",
    element: "modified",
    field: "dcterms.modified",
    source: "dcterms-types.xml",
    scopeNote: "Date on which the resource was changed."
  },
  {
    schema: "dcterms",
    element: "provenance",
    field: "dcterms.provenance",
    source: "dcterms-types.xml",
    scopeNote: "A statement of any changes in ownership and custody of the resource since its creation that are significant for its authenticity, integrity, and interpretation."
  },
  {
    schema: "dcterms",
    element: "publisher",
    field: "dcterms.publisher",
    source: "dcterms-types.xml",
    scopeNote: "An entity responsible for making the resource available."
  },
  {
    schema: "dcterms",
    element: "references",
    field: "dcterms.references",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is referenced, cited, or otherwise pointed to by the described resource."
  },
  {
    schema: "dcterms",
    element: "relation",
    field: "dcterms.relation",
    source: "dcterms-types.xml",
    scopeNote: "A related resource."
  },
  {
    schema: "dcterms",
    element: "replaces",
    field: "dcterms.replaces",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is supplanted, displaced, or superseded by the described resource."
  },
  {
    schema: "dcterms",
    element: "requires",
    field: "dcterms.requires",
    source: "dcterms-types.xml",
    scopeNote: "A related resource that is required by the described resource to support its function, delivery, or coherence."
  },
  {
    schema: "dcterms",
    element: "rights",
    field: "dcterms.rights",
    source: "dcterms-types.xml",
    scopeNote: "Information about rights held in and over the resource."
  },
  {
    schema: "dcterms",
    element: "rightsHolder",
    field: "dcterms.rightsHolder",
    source: "dcterms-types.xml",
    scopeNote: "A person or organization owning or managing rights over the resource."
  },
  {
    schema: "dcterms",
    element: "source",
    field: "dcterms.source",
    source: "dcterms-types.xml",
    scopeNote: "A related resource from which the described resource is derived."
  },
  {
    schema: "dcterms",
    element: "spatial",
    field: "dcterms.spatial",
    source: "dcterms-types.xml",
    scopeNote: "Spatial characteristics of the resource."
  },
  {
    schema: "dcterms",
    element: "subject",
    field: "dcterms.subject",
    source: "dcterms-types.xml",
    scopeNote: "The topic of the resource."
  },
  {
    schema: "dcterms",
    element: "tableOfContents",
    field: "dcterms.tableOfContents",
    source: "dcterms-types.xml",
    scopeNote: "A list of subunits of the resource."
  },
  {
    schema: "dcterms",
    element: "temporal",
    field: "dcterms.temporal",
    source: "dcterms-types.xml",
    scopeNote: "Temporal characteristics of the resource."
  },
  {
    schema: "dcterms",
    element: "title",
    field: "dcterms.title",
    source: "dcterms-types.xml",
    scopeNote: "A name given to the resource."
  },
  {
    schema: "dcterms",
    element: "type",
    field: "dcterms.type",
    source: "dcterms-types.xml",
    scopeNote: "The nature or genre of the resource."
  },
  {
    schema: "dcterms",
    element: "valid",
    field: "dcterms.valid",
    source: "dcterms-types.xml",
    scopeNote: "Date (often a range) of validity of a resource."
  },
  {
    schema: "dspace",
    element: "process",
    field: "dspace.process.filetype",
    source: "dspace-types.xml",
    qualifier: "filetype"
  },
  {
    schema: "dspace",
    element: "agreements",
    field: "dspace.agreements.end-user",
    source: "dspace-types.xml",
    qualifier: "end-user",
    scopeNote: "Stores whether the End User Agreement has been accepted by an EPerson. Valid values; true, false"
  },
  {
    schema: "dspace",
    element: "agreements",
    field: "dspace.agreements.cookies",
    source: "dspace-types.xml",
    qualifier: "cookies",
    scopeNote: "Stores the cookie preferences of an EPerson, as selected in last session. Value will be an array of cookieName/boolean pairs, specifying which cookies are allowed or not allowed."
  },
  {
    schema: "dspace",
    element: "agreements",
    field: "dspace.agreements.ignore",
    source: "dspace-types.xml",
    qualifier: "ignore",
    scopeNote: "Stores whether the EPerson is allowed to ignore the user agreement, useful for user account used by third party application. Valid values; true, false"
  },
  {
    schema: "dspace",
    element: "entity",
    field: "dspace.entity.type",
    source: "dspace-types.xml",
    qualifier: "type",
    scopeNote: "Stores the type of Entity that a specific Item represents"
  },
  {
    schema: "dspace",
    element: "iiif",
    field: "dspace.iiif.enabled",
    source: "dspace-types.xml",
    qualifier: "enabled",
    scopeNote: "Stores a boolean text value (true or false) to indicate if the iiif feature is enabled or not for the dspace object. If absent the value is derived from the parent dspace object"
  },
  {
    schema: "dspace",
    element: "file",
    field: "dspace.file.type",
    source: "dspace-types.xml",
    qualifier: "type",
    scopeNote: "Stores the bitstream's children file type inside the item it self"
  },
  {
    schema: "dspace",
    element: "object",
    field: "dspace.object.owner",
    source: "dspace-types.xml",
    qualifier: "owner",
    scopeNote: "Used to support researcher profiles"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.scope",
    source: "dspace-types.xml",
    qualifier: "scope",
    scopeNote: "Stores the scopes/authorizations granted by the user during authentication on ORCID"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-mode",
    source: "dspace-types.xml",
    qualifier: "sync-mode",
    scopeNote: "Stores the synchronization with ORCID mode chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-publications",
    source: "dspace-types.xml",
    qualifier: "sync-publications",
    scopeNote: "Stores the publication synchronization with ORCID preference chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-products",
    source: "dspace-types.xml",
    qualifier: "sync-products",
    scopeNote: "Stores the product synchronization with ORCID preference chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-patents",
    source: "dspace-types.xml",
    qualifier: "sync-patents",
    scopeNote: "Stores the patent synchronization with ORCID preference chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-fundings",
    source: "dspace-types.xml",
    qualifier: "sync-fundings",
    scopeNote: "Stores the funding synchronization with ORCID preference chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.sync-profile",
    source: "dspace-types.xml",
    qualifier: "sync-profile",
    scopeNote: "Stores the profile synchronization with ORCID preference chosen by the user"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.authenticated",
    source: "dspace-types.xml",
    qualifier: "authenticated",
    scopeNote: "Stores the timestamp related to the user authentication on ORCID"
  },
  {
    schema: "dspace",
    element: "orcid",
    field: "dspace.orcid.webhook",
    source: "dspace-types.xml",
    qualifier: "webhook"
  },
  {
    schema: "dspace",
    element: "legacy",
    field: "dspace.legacy.oai-identifier",
    source: "dspace-types.xml",
    qualifier: "oai-identifier"
  },
  {
    schema: "dspace",
    element: "networklab",
    field: "dspace.networklab.enabled",
    source: "dspace-types.xml",
    qualifier: "enabled"
  },
  {
    schema: "dspace",
    element: "workflow",
    field: "dspace.workflow.startDateTime",
    source: "dspace-types.xml",
    qualifier: "startDateTime"
  },
  {
    schema: "dspace",
    element: "openalex",
    field: "dspace.openalex.lastimport",
    source: "dspace-types.xml",
    qualifier: "lastimport",
    scopeNote: "Stores the timestamp related to the last import from OpenAlex"
  },
  {
    schema: "dspace",
    element: "openaire",
    field: "dspace.openaire.lastimport",
    source: "dspace-types.xml",
    qualifier: "lastimport",
    scopeNote: "Stores the timestamp related to the last import from OpenAIRE Graph"
  },
  {
    schema: "dspace",
    element: "accessibility",
    field: "dspace.accessibility.settings",
    source: "dspace-types.xml",
    qualifier: "settings",
    scopeNote: "Metadata field storing the user-configured accessibility settings values for the EPerson."
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor",
    source: "dublin-core-types.xml",
    scopeNote: "A person, organization, or service responsible for the content of the resource. Catch-all for unspecified contributors."
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.advisor",
    source: "dublin-core-types.xml",
    qualifier: "advisor",
    scopeNote: "Use primarily for thesis advisor."
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.author",
    source: "dublin-core-types.xml",
    qualifier: "author"
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.editor",
    source: "dublin-core-types.xml",
    qualifier: "editor"
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.illustrator",
    source: "dublin-core-types.xml",
    qualifier: "illustrator"
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.other",
    source: "dublin-core-types.xml",
    qualifier: "other"
  },
  {
    schema: "dc",
    element: "coverage",
    field: "dc.coverage.spatial",
    source: "dublin-core-types.xml",
    qualifier: "spatial",
    scopeNote: "Spatial characteristics of content."
  },
  {
    schema: "dc",
    element: "coverage",
    field: "dc.coverage.temporal",
    source: "dublin-core-types.xml",
    qualifier: "temporal",
    scopeNote: "Temporal characteristics of content."
  },
  {
    schema: "dc",
    element: "creator",
    field: "dc.creator",
    source: "dublin-core-types.xml",
    scopeNote: "Do not use; only for harvested metadata."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date",
    source: "dublin-core-types.xml",
    scopeNote: "Use qualified form if possible."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.accessioned",
    source: "dublin-core-types.xml",
    qualifier: "accessioned",
    scopeNote: "Date DSpace takes possession of item."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.available",
    source: "dublin-core-types.xml",
    qualifier: "available",
    scopeNote: "Date or date range item became available to the public."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.copyright",
    source: "dublin-core-types.xml",
    qualifier: "copyright",
    scopeNote: "Date of copyright."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.created",
    source: "dublin-core-types.xml",
    qualifier: "created",
    scopeNote: "Date of creation or manufacture of intellectual content if different from date.issued."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.issued",
    source: "dublin-core-types.xml",
    qualifier: "issued",
    scopeNote: "Date of publication or distribution."
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.submitted",
    source: "dublin-core-types.xml",
    qualifier: "submitted",
    scopeNote: "Recommend for theses/dissertations."
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier",
    source: "dublin-core-types.xml",
    scopeNote: "Catch-all for unambiguous identifiers not defined by qualified form; use identifier.other for a known identifier common to a local collection instead of unqualified form."
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.citation",
    source: "dublin-core-types.xml",
    qualifier: "citation",
    scopeNote: "Human-readable, standard bibliographic citation of non-DSpace format of this item"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.govdoc",
    source: "dublin-core-types.xml",
    qualifier: "govdoc",
    scopeNote: "A government document number"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.isbn",
    source: "dublin-core-types.xml",
    qualifier: "isbn",
    scopeNote: "International Standard Book Number"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.issn",
    source: "dublin-core-types.xml",
    qualifier: "issn",
    scopeNote: "International Standard Serial Number"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.sici",
    source: "dublin-core-types.xml",
    qualifier: "sici",
    scopeNote: "Serial Item and Contribution Identifier"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.ismn",
    source: "dublin-core-types.xml",
    qualifier: "ismn",
    scopeNote: "International Standard Music Number"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.other",
    source: "dublin-core-types.xml",
    qualifier: "other",
    scopeNote: "A known identifier type common to a local collection."
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.doi",
    source: "dublin-core-types.xml",
    qualifier: "doi",
    scopeNote: "The doi identifier minted by this repository."
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.scopus",
    source: "dublin-core-types.xml",
    qualifier: "scopus",
    scopeNote: "The scopus identifier"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.uri",
    source: "dublin-core-types.xml",
    qualifier: "uri",
    scopeNote: "Uniform Resource Identifier"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.isi",
    source: "dublin-core-types.xml",
    qualifier: "isi",
    scopeNote: "Web of Knowledge Identifier"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.pmid",
    source: "dublin-core-types.xml",
    qualifier: "pmid",
    scopeNote: "Pubmed ID"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.adsbibcode",
    source: "dublin-core-types.xml",
    qualifier: "adsbibcode",
    scopeNote: "ADS Identifier"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.arxiv",
    source: "dublin-core-types.xml",
    qualifier: "arxiv",
    scopeNote: "arXiv Identifier"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description",
    source: "dublin-core-types.xml",
    scopeNote: "Catch-all for any description not defined by qualifiers."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.abstract",
    source: "dublin-core-types.xml",
    qualifier: "abstract",
    scopeNote: "Abstract or summary."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.provenance",
    source: "dublin-core-types.xml",
    qualifier: "provenance",
    scopeNote: "The history of custody of the item since its creation, including any changes successive custodians made to it."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.sponsorship",
    source: "dublin-core-types.xml",
    qualifier: "sponsorship",
    scopeNote: "Information about sponsoring agencies, individuals, or contractual arrangements for the item."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.statementofresponsibility",
    source: "dublin-core-types.xml",
    qualifier: "statementofresponsibility",
    scopeNote: "To preserve statement of responsibility from MARC records."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.tableofcontents",
    source: "dublin-core-types.xml",
    qualifier: "tableofcontents",
    scopeNote: "A table of contents for a given item."
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.uri",
    source: "dublin-core-types.xml",
    qualifier: "uri",
    scopeNote: "Uniform Resource Identifier pointing to description of this item."
  },
  {
    schema: "dc",
    element: "format",
    field: "dc.format",
    source: "dublin-core-types.xml",
    scopeNote: "Catch-all for any format information not defined by qualifiers."
  },
  {
    schema: "dc",
    element: "format",
    field: "dc.format.extent",
    source: "dublin-core-types.xml",
    qualifier: "extent",
    scopeNote: "Size or duration."
  },
  {
    schema: "dc",
    element: "format",
    field: "dc.format.medium",
    source: "dublin-core-types.xml",
    qualifier: "medium",
    scopeNote: "Physical medium."
  },
  {
    schema: "dc",
    element: "format",
    field: "dc.format.mimetype",
    source: "dublin-core-types.xml",
    qualifier: "mimetype",
    scopeNote: "Registered MIME type identifiers."
  },
  {
    schema: "dc",
    element: "language",
    field: "dc.language",
    source: "dublin-core-types.xml",
    scopeNote: "Catch-all for non-ISO forms of the language of the item, accommodating harvested values."
  },
  {
    schema: "dc",
    element: "language",
    field: "dc.language.iso",
    source: "dublin-core-types.xml",
    qualifier: "iso",
    scopeNote: "Current ISO standard for language of intellectual content, including country codes (e.g. \"en_US\")."
  },
  {
    schema: "dc",
    element: "publisher",
    field: "dc.publisher",
    source: "dublin-core-types.xml",
    scopeNote: "Entity responsible for publication, distribution, or imprint."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation",
    source: "dublin-core-types.xml",
    scopeNote: "Catch-all for references to other related items."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isformatof",
    source: "dublin-core-types.xml",
    qualifier: "isformatof",
    scopeNote: "References additional physical form."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.ispartof",
    source: "dublin-core-types.xml",
    qualifier: "ispartof",
    scopeNote: "References physically or logically containing item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.ispartofseries",
    source: "dublin-core-types.xml",
    qualifier: "ispartofseries",
    scopeNote: "Series name and number within that series, if available."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.haspart",
    source: "dublin-core-types.xml",
    qualifier: "haspart",
    scopeNote: "References physically or logically contained item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isversionof",
    source: "dublin-core-types.xml",
    qualifier: "isversionof",
    scopeNote: "References earlier version."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.hasversion",
    source: "dublin-core-types.xml",
    qualifier: "hasversion",
    scopeNote: "References later version."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isbasedon",
    source: "dublin-core-types.xml",
    qualifier: "isbasedon",
    scopeNote: "References source."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isreferencedby",
    source: "dublin-core-types.xml",
    qualifier: "isreferencedby",
    scopeNote: "Pointed to by referenced resource."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.requires",
    source: "dublin-core-types.xml",
    qualifier: "requires",
    scopeNote: "Referenced resource is required to support function, delivery, or coherence of item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.replaces",
    source: "dublin-core-types.xml",
    qualifier: "replaces",
    scopeNote: "References preceeding item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isreplacedby",
    source: "dublin-core-types.xml",
    qualifier: "isreplacedby",
    scopeNote: "References succeeding item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.uri",
    source: "dublin-core-types.xml",
    qualifier: "uri",
    scopeNote: "References Uniform Resource Identifier for related item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.product",
    source: "dublin-core-types.xml",
    qualifier: "product",
    scopeNote: "References product for related item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.journal",
    source: "dublin-core-types.xml",
    qualifier: "journal",
    scopeNote: "References journal for related item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.orgunit",
    source: "dublin-core-types.xml",
    qualifier: "orgunit",
    scopeNote: "References orgunit for related item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.project",
    source: "dublin-core-types.xml",
    qualifier: "project",
    scopeNote: "References project for related item."
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.conference",
    source: "dublin-core-types.xml",
    qualifier: "conference",
    scopeNote: "References conference for related item."
  },
  {
    schema: "dc",
    element: "rights",
    field: "dc.rights",
    source: "dublin-core-types.xml",
    scopeNote: "Terms governing use and reproduction."
  },
  {
    schema: "dc",
    element: "rights",
    field: "dc.rights.uri",
    source: "dublin-core-types.xml",
    qualifier: "uri",
    scopeNote: "References terms governing use and reproduction."
  },
  {
    schema: "dc",
    element: "source",
    field: "dc.source",
    source: "dublin-core-types.xml",
    scopeNote: "Do not use; only for harvested metadata."
  },
  {
    schema: "dc",
    element: "source",
    field: "dc.source.uri",
    source: "dublin-core-types.xml",
    qualifier: "uri",
    scopeNote: "Do not use; only for harvested metadata."
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject",
    source: "dublin-core-types.xml",
    scopeNote: "Uncontrolled index term."
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.classification",
    source: "dublin-core-types.xml",
    qualifier: "classification",
    scopeNote: "Catch-all for value from local classification system; global classification systems will receive specific qualifier"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.ddc",
    source: "dublin-core-types.xml",
    qualifier: "ddc",
    scopeNote: "Dewey Decimal Classification Number"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.lcc",
    source: "dublin-core-types.xml",
    qualifier: "lcc",
    scopeNote: "Library of Congress Classification Number"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.lcsh",
    source: "dublin-core-types.xml",
    qualifier: "lcsh",
    scopeNote: "Library of Congress Subject Headings"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.mesh",
    source: "dublin-core-types.xml",
    qualifier: "mesh",
    scopeNote: "MEdical Subject Headings"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.other",
    source: "dublin-core-types.xml",
    qualifier: "other",
    scopeNote: "Local controlled vocabulary; global vocabularies will receive specific qualifier."
  },
  {
    schema: "dc",
    element: "title",
    field: "dc.title",
    source: "dublin-core-types.xml",
    scopeNote: "Title statement/title proper."
  },
  {
    schema: "dc",
    element: "title",
    field: "dc.title.alternative",
    source: "dublin-core-types.xml",
    qualifier: "alternative",
    scopeNote: "Varying (or substitute) form of title proper appearing in item, e.g. abbreviation or translation"
  },
  {
    schema: "dc",
    element: "type",
    field: "dc.type",
    source: "dublin-core-types.xml",
    scopeNote: "Nature or genre of content."
  },
  {
    schema: "dc",
    element: "provenance",
    field: "dc.provenance",
    source: "dublin-core-types.xml"
  },
  {
    schema: "dc",
    element: "rights",
    field: "dc.rights.license",
    source: "dublin-core-types.xml",
    qualifier: "license"
  },
  {
    schema: "dc",
    element: "acronym",
    field: "dc.acronym",
    source: "dublin-core-types.xml"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.publication",
    source: "dublin-core-types.xml",
    qualifier: "publication"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.isbn",
    source: "dublin-core-types.xml",
    qualifier: "isbn"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.doi",
    source: "dublin-core-types.xml",
    qualifier: "doi"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.issn",
    source: "dublin-core-types.xml",
    qualifier: "issn"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.equipment",
    source: "dublin-core-types.xml",
    qualifier: "equipment"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.references",
    source: "dublin-core-types.xml",
    qualifier: "references"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.patent",
    source: "dublin-core-types.xml",
    qualifier: "patent"
  },
  {
    schema: "dc",
    element: "coverage",
    field: "dc.coverage.publication",
    source: "dublin-core-types.xml",
    qualifier: "publication"
  },
  {
    schema: "dc",
    element: "coverage",
    field: "dc.coverage.isbn",
    source: "dublin-core-types.xml",
    qualifier: "isbn"
  },
  {
    schema: "dc",
    element: "coverage",
    field: "dc.coverage.doi",
    source: "dublin-core-types.xml",
    qualifier: "doi"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.volume",
    source: "dublin-core-types.xml",
    qualifier: "volume"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.issue",
    source: "dublin-core-types.xml",
    qualifier: "issue"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.startpage",
    source: "dublin-core-types.xml",
    qualifier: "startpage"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.endpage",
    source: "dublin-core-types.xml",
    qualifier: "endpage"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.patentno",
    source: "dublin-core-types.xml",
    qualifier: "patentno"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.patentnumber",
    source: "dublin-core-types.xml",
    qualifier: "patentnumber"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.applicationnumber",
    source: "dublin-core-types.xml",
    qualifier: "applicationnumber"
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.applicant",
    source: "dublin-core-types.xml",
    qualifier: "applicant"
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.filled",
    source: "dublin-core-types.xml",
    qualifier: "filled"
  },
  {
    schema: "dc",
    element: "subject",
    field: "dc.subject.ipc",
    source: "dublin-core-types.xml",
    qualifier: "ipc"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.openalex",
    source: "dublin-core-types.xml",
    qualifier: "openalex",
    scopeNote: "The OpenAlex identifier"
  },
  {
    schema: "eperson",
    element: "firstname",
    field: "eperson.firstname",
    source: "eperson-types.xml",
    scopeNote: "Metadata field used for the first name"
  },
  {
    schema: "eperson",
    element: "lastname",
    field: "eperson.lastname",
    source: "eperson-types.xml",
    scopeNote: "Metadata field used for the last name"
  },
  {
    schema: "eperson",
    element: "phone",
    field: "eperson.phone",
    source: "eperson-types.xml",
    scopeNote: "Metadata field used for the phone number"
  },
  {
    schema: "eperson",
    element: "language",
    field: "eperson.language",
    source: "eperson-types.xml",
    scopeNote: "Metadata field used for the language"
  },
  {
    schema: "eperson",
    element: "orcid",
    field: "eperson.orcid",
    source: "eperson-types.xml",
    scopeNote: "Metadata field used for the ORCID id"
  },
  {
    schema: "eperson",
    element: "orcid",
    field: "eperson.orcid.scope",
    source: "eperson-types.xml",
    qualifier: "scope",
    scopeNote: "Metadata field used for the granted ORCID scopes"
  },
  {
    schema: "iiif",
    element: "label",
    field: "iiif.label",
    source: "iiif-types.xml",
    scopeNote: "Metadata field used to set the IIIF label associated with the resource otherwise the system will derive one according to the configuration and metadata"
  },
  {
    schema: "iiif",
    element: "description",
    field: "iiif.description",
    source: "iiif-types.xml",
    scopeNote: "Metadata field used to set the IIIF description associated with the resource"
  },
  {
    schema: "iiif",
    element: "toc",
    field: "iiif.toc",
    source: "iiif-types.xml",
    scopeNote: "Metadata field used to set the position of the iiif resource in the structure. Levels are separated by triple pipe ||| can be applied to Bundles and Bitstreams"
  },
  {
    schema: "iiif",
    element: "canvas",
    field: "iiif.canvas.naming",
    source: "iiif-types.xml",
    qualifier: "naming",
    scopeNote: "Metadata field used to set the base label used to name all the canvas in the Item. The canvas label will be generated using the value of this metadata as prefix and the canvas position"
  },
  {
    schema: "iiif",
    element: "viewing",
    field: "iiif.viewing.hint",
    source: "iiif-types.xml",
    qualifier: "hint",
    scopeNote: "Metadata field used to set the viewing hint overriding the configuration value if any"
  },
  {
    schema: "iiif",
    element: "image",
    field: "iiif.image.width",
    source: "iiif-types.xml",
    qualifier: "width",
    scopeNote: "Metadata field used to store the width of an image in px"
  },
  {
    schema: "iiif",
    element: "image",
    field: "iiif.image.height",
    source: "iiif-types.xml",
    qualifier: "height",
    scopeNote: "Metadata field used to store the height of an image in px"
  },
  {
    schema: "iiif",
    element: "search",
    field: "iiif.search.enabled",
    source: "iiif-types.xml",
    qualifier: "enabled",
    scopeNote: "Metadata field used to enable the IIIF Search service at the item level"
  },
  {
    schema: "miur",
    element: "journal",
    field: "miur.journal.startdate",
    source: "miur-types.xml",
    qualifier: "startdate"
  },
  {
    schema: "miur",
    element: "journal",
    field: "miur.journal.enddate",
    source: "miur-types.xml",
    qualifier: "enddate"
  },
  {
    schema: "miur",
    element: "journal",
    field: "miur.journal.type",
    source: "miur-types.xml",
    qualifier: "type"
  },
  {
    schema: "miur",
    element: "identifier",
    field: "miur.identifier.ance",
    source: "miur-types.xml",
    qualifier: "ance"
  },
  {
    schema: "miur",
    element: "person",
    field: "miur.person.cf",
    source: "miur-types.xml",
    qualifier: "cf"
  },
  {
    schema: "miur",
    element: "type",
    field: "miur.type.referee",
    source: "miur-types.xml",
    qualifier: "referee"
  },
  {
    schema: "miur",
    element: "patent",
    field: "miur.patent.relevance",
    source: "miur-types.xml",
    qualifier: "relevance"
  },
  {
    schema: "miur",
    element: "bitstream",
    field: "miur.bitstream.synch",
    source: "miur-types.xml",
    qualifier: "synch"
  },
  {
    schema: "miur",
    element: "journal",
    field: "miur.journal.othertitle",
    source: "miur-types.xml",
    qualifier: "othertitle"
  },
  {
    schema: "miur",
    element: "journal",
    field: "miur.journal.ance",
    source: "miur-types.xml",
    qualifier: "ance"
  },
  {
    schema: "miur",
    element: "type",
    field: "miur.type",
    source: "miur-types.xml"
  },
  {
    schema: "oairecerif",
    element: "author",
    field: "oairecerif.author.affiliation",
    source: "openaire-cerif-types.xml",
    qualifier: "affiliation"
  },
  {
    schema: "oairecerif",
    element: "editor",
    field: "oairecerif.editor.affiliation",
    source: "openaire-cerif-types.xml",
    qualifier: "affiliation"
  },
  {
    schema: "oairecerif",
    element: "identifier",
    field: "oairecerif.identifier.url",
    source: "openaire-cerif-types.xml",
    qualifier: "url"
  },
  {
    schema: "oairecerif",
    element: "affiliation",
    field: "oairecerif.affiliation.orgunit",
    source: "openaire-cerif-types.xml",
    qualifier: "orgunit"
  },
  {
    schema: "oairecerif",
    element: "affiliation",
    field: "oairecerif.affiliation.startDate",
    source: "openaire-cerif-types.xml",
    qualifier: "startDate"
  },
  {
    schema: "oairecerif",
    element: "affiliation",
    field: "oairecerif.affiliation.endDate",
    source: "openaire-cerif-types.xml",
    qualifier: "endDate"
  },
  {
    schema: "oairecerif",
    element: "affiliation",
    field: "oairecerif.affiliation.role",
    source: "openaire-cerif-types.xml",
    qualifier: "role"
  },
  {
    schema: "oairecerif",
    element: "person",
    field: "oairecerif.person.gender",
    source: "openaire-cerif-types.xml",
    qualifier: "gender"
  },
  {
    schema: "oairecerif",
    element: "person",
    field: "oairecerif.person.affiliation",
    source: "openaire-cerif-types.xml",
    qualifier: "affiliation"
  },
  {
    schema: "oairecerif",
    element: "acronym",
    field: "oairecerif.acronym",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "internalid",
    field: "oairecerif.internalid",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "funder",
    field: "oairecerif.funder",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "oamandate",
    field: "oairecerif.oamandate",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "oamandate",
    field: "oairecerif.oamandate.url",
    source: "openaire-cerif-types.xml",
    qualifier: "url"
  },
  {
    schema: "oairecerif",
    element: "project",
    field: "oairecerif.project.startDate",
    source: "openaire-cerif-types.xml",
    qualifier: "startDate"
  },
  {
    schema: "oairecerif",
    element: "project",
    field: "oairecerif.project.endDate",
    source: "openaire-cerif-types.xml",
    qualifier: "endDate"
  },
  {
    schema: "oairecerif",
    element: "project",
    field: "oairecerif.project.status",
    source: "openaire-cerif-types.xml",
    qualifier: "status"
  },
  {
    schema: "oairecerif",
    element: "fundingProgram",
    field: "oairecerif.fundingProgram",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "fundingParent",
    field: "oairecerif.fundingParent",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "amount",
    field: "oairecerif.amount.currency",
    source: "openaire-cerif-types.xml",
    qualifier: "currency"
  },
  {
    schema: "oairecerif",
    element: "amount",
    field: "oairecerif.amount",
    source: "openaire-cerif-types.xml"
  },
  {
    schema: "oairecerif",
    element: "funding",
    field: "oairecerif.funding.identifier",
    source: "openaire-cerif-types.xml",
    qualifier: "identifier"
  },
  {
    schema: "oairecerif",
    element: "funding",
    field: "oairecerif.funding.startDate",
    source: "openaire-cerif-types.xml",
    qualifier: "startDate"
  },
  {
    schema: "oairecerif",
    element: "citation",
    field: "oairecerif.citation.number",
    source: "openaire-cerif-types.xml",
    qualifier: "number"
  },
  {
    schema: "oairecerif",
    element: "funding",
    field: "oairecerif.funding.endDate",
    source: "openaire-cerif-types.xml",
    qualifier: "endDate"
  },
  {
    schema: "oairecerif",
    element: "event",
    field: "oairecerif.event.startDate",
    source: "openaire-cerif-types.xml",
    qualifier: "startDate"
  },
  {
    schema: "oairecerif",
    element: "event",
    field: "oairecerif.event.endDate",
    source: "openaire-cerif-types.xml",
    qualifier: "endDate"
  },
  {
    schema: "oairecerif",
    element: "event",
    field: "oairecerif.event.place",
    source: "openaire-cerif-types.xml",
    qualifier: "place"
  },
  {
    schema: "oairecerif",
    element: "event",
    field: "oairecerif.event.country",
    source: "openaire-cerif-types.xml",
    qualifier: "country"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.project",
    source: "openaire-cerif-types.xml",
    qualifier: "project"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.funding",
    source: "openaire-cerif-types.xml",
    qualifier: "funding"
  },
  {
    schema: "dc",
    element: "relation",
    field: "dc.relation.grantno",
    source: "openaire-cerif-types.xml",
    qualifier: "grantno"
  },
  {
    schema: "oaire",
    element: "fundingStream",
    field: "oaire.fundingStream",
    source: "openaire4-types.xml",
    scopeNote: "Name of the funding stream"
  },
  {
    schema: "oaire",
    element: "awardNumber",
    field: "oaire.awardNumber",
    source: "openaire4-types.xml",
    scopeNote: "Project grantId or awardNumber"
  },
  {
    schema: "oaire",
    element: "awardURI",
    field: "oaire.awardURI",
    source: "openaire4-types.xml",
    scopeNote: "URI of the project landing page provided by the funder for more information about the award (grant)."
  },
  {
    schema: "oaire",
    element: "awardTitle",
    field: "oaire.awardTitle",
    source: "openaire4-types.xml",
    scopeNote: "Title of the project, award or grant."
  },
  {
    schema: "oaire",
    element: "version",
    field: "oaire.version",
    source: "openaire4-types.xml",
    scopeNote: "Use either a version number or the label of the vocabulary term as value."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.title",
    source: "openaire4-types.xml",
    qualifier: "title",
    scopeNote: "The title name of the container (e.g. journal, book, conference) this work is published in. This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.volume",
    source: "openaire4-types.xml",
    qualifier: "volume",
    scopeNote: "The volume, typically a number, of the container (e.g. journal). This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.issue",
    source: "openaire4-types.xml",
    qualifier: "issue",
    scopeNote: "The issue of the container (e.g. journal). This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.startPage",
    source: "openaire4-types.xml",
    qualifier: "startPage",
    scopeNote: "The start page is part of the pagination information of the work published in a container (e.g. journal issue). This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.endPage",
    source: "openaire4-types.xml",
    qualifier: "endPage",
    scopeNote: "The end page is part of the pagination information of the work published in a container (e.g. journal issue). This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.edition",
    source: "openaire4-types.xml",
    qualifier: "edition",
    scopeNote: "The edition the work was published in (e.g. book edition). This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.conferencePlace",
    source: "openaire4-types.xml",
    qualifier: "conferencePlace",
    scopeNote: "The place where the conference took place. This property is considered to be part of the bibliographic citation."
  },
  {
    schema: "oaire",
    element: "citation",
    field: "oaire.citation.conferenceDate",
    source: "openaire4-types.xml",
    qualifier: "conferenceDate",
    scopeNote: "The date when the conference took place. This property is considered to be part of the bibliographic citation. Recommended best practice for encoding the date value is defined in a profile of ISO 8601 [W3CDTF] and follows the YYYY-MM-DD format."
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.name",
    source: "orgunit-types.xml",
    qualifier: "name"
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.id",
    source: "orgunit-types.xml",
    qualifier: "id"
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.dateestablished",
    source: "orgunit-types.xml",
    qualifier: "dateestablished"
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.city",
    source: "orgunit-types.xml",
    qualifier: "city"
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.country",
    source: "orgunit-types.xml",
    qualifier: "country"
  },
  {
    schema: "orgunit",
    element: "identifier",
    field: "orgunit.identifier.description",
    source: "orgunit-types.xml",
    qualifier: "description"
  },
  {
    schema: "relation",
    element: "isAuthorOfPublication",
    field: "relation.isAuthorOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" AUTHORS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any AUTHOR where the AUTHOR is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isAuthorOfPublication",
    field: "relation.isAuthorOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of AUTHORS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from an AUTHOR, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfAuthor",
    field: "relation.isPublicationOfAuthor",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current AUTHOR links to via a relationship. In other words, this stores all relationships pointing from the current AUTHOR to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfAuthor",
    field: "relation.isPublicationOfAuthor.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PUBLICATIONS which link to the current AUTHOR via a \"latest\" relationship. In other words, this stores all relationships pointing to the current AUTHOR from any PUBLICATION, implying that the AUTHOR is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfPublication",
    field: "relation.isProjectOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfPublication",
    field: "relation.isProjectOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PROJECTS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any PROJECT, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfProject",
    field: "relation.isPublicationOfProject",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfProject",
    field: "relation.isPublicationOfProject.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PUBLICATIONS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any PUBLICATION, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfPublication",
    field: "relation.isOrgUnitOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfPublication",
    field: "relation.isOrgUnitOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of ORGANISATIONAL UNITSS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any ORGANISATIONAL UNITS, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfOrgUnit",
    field: "relation.isPublicationOfOrgUnit",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfOrgUnit",
    field: "relation.isPublicationOfOrgUnit.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PUBLICATIONS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PUBLICATION, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfPerson",
    field: "relation.isProjectOfPerson",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current PERSON links to via a relationship. In other words, this stores all relationships pointing from the current PERSON to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfPerson",
    field: "relation.isProjectOfPerson.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PROJECTS which link to the current PERSON via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PERSON from any PROJECT, implying that the PERSON is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPersonOfProject",
    field: "relation.isPersonOfProject",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PERSONS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any PERSON where the PERSON is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPersonOfProject",
    field: "relation.isPersonOfProject.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PERSONS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any PERSON, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfPerson",
    field: "relation.isOrgUnitOfPerson",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PERSON links to via a relationship. In other words, this stores all relationships pointing from the current PERSON to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfPerson",
    field: "relation.isOrgUnitOfPerson.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of ORGANISATIONAL UNITS which link to the current PERSON via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PERSON from any ORGANISATIONAL UNIT, implying that the PERSON is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPersonOfOrgUnit",
    field: "relation.isPersonOfOrgUnit",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PERSONS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PERSON where the PERSON is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPersonOfOrgUnit",
    field: "relation.isPersonOfOrgUnit.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PERSONS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PERSON, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfProject",
    field: "relation.isOrgUnitOfProject",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" ORGANISATIONAL UNITS that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any ORGANISATIONAL UNIT where the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isOrgUnitOfProject",
    field: "relation.isOrgUnitOfProject.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of ORGANISATIONAL UNITS which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any ORGANISATIONAL UNIT, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfOrgUnit",
    field: "relation.isProjectOfOrgUnit",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current ORGANISATIONAL UNIT links to via a relationship. In other words, this stores all relationships pointing from the current ORGANISATIONAL UNIT to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfOrgUnit",
    field: "relation.isProjectOfOrgUnit.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PROEJCTS which link to the current ORGANISATIONAL UNIT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ORGANISATIONAL UNIT from any PROEJCT, implying that the ORGANISATIONAL UNIT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isVolumeOfJournal",
    field: "relation.isVolumeOfJournal",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" VOLUMES that the current JOURNAL links to via a relationship. In other words, this stores all relationships pointing from the current JOURNAL to any VOLUME where the VOLUME is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isVolumeOfJournal",
    field: "relation.isVolumeOfJournal.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of VOLUMES which link to the current JOURNAL via a \"latest\" relationship. In other words, this stores all relationships pointing to the current JOURNAL from any VOLUME, implying that the JOURNAL is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalOfVolume",
    field: "relation.isJournalOfVolume",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" JOURNALS that the current VOLUME links to via a relationship. In other words, this stores all relationships pointing from the current VOLUME to any JOURNAL where the JOURNAL is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalOfVolume",
    field: "relation.isJournalOfVolume.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of JOURNALS which link to the current VOLUME via a \"latest\" relationship. In other words, this stores all relationships pointing to the current VOLUME from any JOURNAL, implying that the VOLUME is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isIssueOfJournalVolume",
    field: "relation.isIssueOfJournalVolume",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" ISSUES that the current VOLUME links to via a relationship. In other words, this stores all relationships pointing from the current VOLUME to any ISSUE where the ISSUE is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isIssueOfJournalVolume",
    field: "relation.isIssueOfJournalVolume.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of ISSUES which link to the current VOLUME via a \"latest\" relationship. In other words, this stores all relationships pointing to the current VOLUME from any ISSUE, implying that the VOLUME is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalVolumeOfIssue",
    field: "relation.isJournalVolumeOfIssue",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" VOLUMES that the current ISSUE links to via a relationship. In other words, this stores all relationships pointing from the current ISSUE to any VOLUME where the VOLUME is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalVolumeOfIssue",
    field: "relation.isJournalVolumeOfIssue.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of VOLUMES which link to the current ISSUE via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ISSUE from any VOLUME, implying that the ISSUE is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalOfPublication",
    field: "relation.isJournalOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" JOURNALS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any JOURNAL where the JOURNAL is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalOfPublication",
    field: "relation.isJournalOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of JOURNALS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any JOURNAL, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalIssueOfPublication",
    field: "relation.isJournalIssueOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" ISSUES that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any ISSUE where the ISSUE is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isJournalIssueOfPublication",
    field: "relation.isJournalIssueOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of ISSUES which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any ISSUE, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfJournalIssue",
    field: "relation.isPublicationOfJournalIssue",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current ISSUE links to via a relationship. In other words, this stores all relationships pointing from the current ISSUE to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfJournalIssue",
    field: "relation.isPublicationOfJournalIssue.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PUBLICATIONS which link to the current ISSUE via a \"latest\" relationship. In other words, this stores all relationships pointing to the current ISSUE from any PUBLICATION, implying that the ISSUE is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isContributorOfPublication",
    field: "relation.isContributorOfPublication",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" CONTRIBUTORS that the current PUBLICATION links to via a relationship. In other words, this stores all relationships pointing from the current PUBLICATION to any CONTRIBUTOR where the CONTRIBUTOR is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isContributorOfPublication",
    field: "relation.isContributorOfPublication.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of CONTRIBUTORS which link to the current PUBLICATION via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PUBLICATION from any CONTRIBUTOR, implying that the PUBLICATION is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfContributor",
    field: "relation.isPublicationOfContributor",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PUBLICATIONS that the current CONTRIBUTOR links to via a relationship. In other words, this stores all relationships pointing from the current CONTRIBUTOR to any PUBLICATION where the PUBLICATION is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isPublicationOfContributor",
    field: "relation.isPublicationOfContributor.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PUBLICATIONS which link to the current CONTRIBUTOR via a \"latest\" relationship. In other words, this stores all relationships pointing to the current CONTRIBUTOR from any PUBLICATION, implying that the CONTRIBUTOR is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isFundingAgencyOfProject",
    field: "relation.isFundingAgencyOfProject",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" FUNDING AGENCIES that the current PROJECT links to via a relationship. In other words, this stores all relationships pointing from the current PROJECT to any FUNDING AGENCY where the FUNDING AGENCY is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isFundingAgencyOfProject",
    field: "relation.isFundingAgencyOfProject.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of FUNDING AGENCIES which link to the current PROJECT via a \"latest\" relationship. In other words, this stores all relationships pointing to the current PROJECT from any FUNDING AGENCY, implying that the PROJECT is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfFundingAgency",
    field: "relation.isProjectOfFundingAgency",
    source: "relationship-formats.xml",
    scopeNote: "Contains all uuids of the \"latest\" PROJECTS that the current FUNDING AGENCY links to via a relationship. In other words, this stores all relationships pointing from the current FUNDING AGENCY to any PROJECT where the PROJECT is marked as \"latest\". Internally used by DSpace. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isProjectOfFundingAgency",
    field: "relation.isProjectOfFundingAgency.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery",
    scopeNote: "Contains all uuids of PROJECTS which link to the current FUNDING AGENCY via a \"latest\" relationship. In other words, this stores all relationships pointing to the current FUNDING AGENCY from any PROJECT, implying that the FUNDING AGENCY is marked as \"latest\". Internally used by DSpace to support versioning. Do not manually add, remove or edit values."
  },
  {
    schema: "relation",
    element: "isCorrectionOfItem",
    field: "relation.isCorrectionOfItem",
    source: "relationship-formats.xml"
  },
  {
    schema: "relation",
    element: "isCorrectionOfItem",
    field: "relation.isCorrectionOfItem.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery"
  },
  {
    schema: "relation",
    element: "isCorrectedByItem",
    field: "relation.isCorrectedByItem",
    source: "relationship-formats.xml"
  },
  {
    schema: "relation",
    element: "isCorrectedByItem",
    field: "relation.isCorrectedByItem.latestForDiscovery",
    source: "relationship-formats.xml",
    qualifier: "latestForDiscovery"
  },
  {
    schema: "organization",
    element: "legalName",
    field: "organization.legalName",
    source: "schema-organization-types.xml",
    scopeNote: "The official name of the organization, e.g. the registered company name."
  },
  {
    schema: "organization",
    element: "foundingDate",
    field: "organization.foundingDate",
    source: "schema-organization-types.xml",
    scopeNote: "The date that this organization was founded."
  },
  {
    schema: "organization",
    element: "endDate",
    field: "organization.endDate",
    source: "schema-organization-types.xml"
  },
  {
    schema: "organization",
    element: "address",
    field: "organization.address.addressLocality",
    source: "schema-organization-types.xml",
    qualifier: "addressLocality",
    scopeNote: "Physical address locality (ex. Mountain View) of the organization."
  },
  {
    schema: "organization",
    element: "address",
    field: "organization.address.addressCountry",
    source: "schema-organization-types.xml",
    qualifier: "addressCountry",
    scopeNote: "Physical address country (ex. USA) of the organization. You can also provide the two-letter ISO 3166-1 alpha-2 country code."
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier",
    source: "schema-organization-types.xml",
    scopeNote: "Generic Identifier"
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.isni",
    source: "schema-organization-types.xml",
    qualifier: "isni",
    scopeNote: "International Standard Name Identifier"
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.rin",
    source: "schema-organization-types.xml",
    qualifier: "rin",
    scopeNote: "Ringgold identifier"
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.ror",
    source: "schema-organization-types.xml",
    qualifier: "ror",
    scopeNote: "Research Organization Registry"
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.crossrefid",
    source: "schema-organization-types.xml",
    qualifier: "crossrefid",
    scopeNote: "Crossref identifier"
  },
  {
    schema: "organization",
    element: "parentOrganization",
    field: "organization.parentOrganization",
    source: "schema-organization-types.xml",
    scopeNote: "The larger organization that this organization is a subOrganization of, if any."
  },
  {
    schema: "organization",
    element: "alternateName",
    field: "organization.alternateName",
    source: "schema-organization-types.xml",
    scopeNote: "An alias for the organization."
  },
  {
    schema: "organization",
    element: "url",
    field: "organization.url",
    source: "schema-organization-types.xml",
    scopeNote: "Url of the organization."
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.lei",
    source: "schema-organization-types.xml",
    qualifier: "lei",
    scopeNote: "Legal Entity Identifier"
  },
  {
    schema: "organization",
    element: "identifier",
    field: "organization.identifier.crossrefid",
    source: "schema-organization-types.xml",
    qualifier: "crossrefid",
    scopeNote: "CrossRef Funder Registry"
  },
  {
    schema: "organization",
    element: "parentOrganization",
    field: "organization.parentOrganization",
    source: "schema-organization-types.xml",
    scopeNote: "The larger organization that this organization is a subOrganization of, if any."
  },
  {
    schema: "creativework",
    element: "editor",
    field: "creativework.editor",
    source: "schema-periodical-types.xml",
    scopeNote: "Specifies the Person who edited the CreativeWork."
  },
  {
    schema: "creativework",
    element: "publisher",
    field: "creativework.publisher",
    source: "schema-periodical-types.xml",
    scopeNote: "The publisher of the creative work."
  },
  {
    schema: "creativeworkseries",
    element: "issn",
    field: "creativeworkseries.issn",
    source: "schema-periodical-types.xml",
    scopeNote: "The International Standard Serial Number (ISSN) that identifies this serial publication. You can repeat this property to identify different formats of, or the linking ISSN (ISSN-L) for, this serial publication."
  },
  {
    schema: "person",
    element: "givenName",
    field: "person.givenName",
    source: "schema-person-types.xml",
    scopeNote: "Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property."
  },
  {
    schema: "person",
    element: "familyName",
    field: "person.familyName",
    source: "schema-person-types.xml",
    scopeNote: "Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property."
  },
  {
    schema: "person",
    element: "telephone",
    field: "person.telephone",
    source: "schema-person-types.xml",
    scopeNote: "The telephone number."
  },
  {
    schema: "person",
    element: "knowsLanguage",
    field: "person.knowsLanguage",
    source: "schema-person-types.xml",
    scopeNote: "Of a Person, and less typically of an Organization, to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the IETF BCP 47 standard."
  },
  {
    schema: "person",
    element: "email",
    field: "person.email",
    source: "schema-person-types.xml",
    scopeNote: "Email address."
  },
  {
    schema: "person",
    element: "birthDate",
    field: "person.birthDate",
    source: "schema-person-types.xml",
    scopeNote: "Date of birth."
  },
  {
    schema: "person",
    element: "jobTitle",
    field: "person.jobTitle",
    source: "schema-person-types.xml",
    scopeNote: "The job title of the person (for example, Financial Manager)."
  },
  {
    schema: "person",
    element: "affiliation",
    field: "person.affiliation.name",
    source: "schema-person-types.xml",
    qualifier: "name",
    scopeNote: "The organizational or institutional affiliation of the creator"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier",
    source: "schema-person-types.xml",
    scopeNote: "Generic Identifier"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.scopus-author-id",
    source: "schema-person-types.xml",
    qualifier: "scopus-author-id",
    scopeNote: "Scopus Author ID"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.ciencia-id",
    source: "schema-person-types.xml",
    qualifier: "ciencia-id",
    scopeNote: "Permanent individual means of identification and authentication for citizens carrying out scientific activity. - https://www.ciencia-id.pt/"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.gsid",
    source: "schema-person-types.xml",
    qualifier: "gsid",
    scopeNote: "Google Scholar ID"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.orcid",
    source: "schema-person-types.xml",
    qualifier: "orcid",
    scopeNote: "Open Researcher and Contributor ID"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.rid",
    source: "schema-person-types.xml",
    qualifier: "rid",
    scopeNote: "Web of Science ResearcherID"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.isni",
    source: "schema-person-types.xml",
    qualifier: "isni",
    scopeNote: "International Standard Name Identifier"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.research-gate-id",
    source: "schema-person-types.xml",
    qualifier: "research-gate-id"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.twitter-id",
    source: "schema-person-types.xml",
    qualifier: "twitter-id"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.facebook-id",
    source: "schema-person-types.xml",
    qualifier: "facebook-id"
  },
  {
    schema: "person",
    element: "identifier",
    field: "person.identifier.linkedin-id",
    source: "schema-person-types.xml",
    qualifier: "linkedin-id"
  },
  {
    schema: "project",
    element: "funder",
    field: "project.funder.name",
    source: "schema-project-types.xml",
    qualifier: "name",
    scopeNote: "Name of the funding provider."
  },
  {
    schema: "project",
    element: "funder",
    field: "project.funder.identifier",
    source: "schema-project-types.xml",
    qualifier: "identifier",
    scopeNote: "Unique identifier of the funding entity."
  },
  {
    schema: "project",
    element: "investigator",
    field: "project.investigator",
    source: "schema-project-types.xml",
    scopeNote: "Project investigator"
  },
  {
    schema: "project",
    element: "startDate",
    field: "project.startDate",
    source: "schema-project-types.xml",
    scopeNote: "The project start date"
  },
  {
    schema: "project",
    element: "endDate",
    field: "project.endDate",
    source: "schema-project-types.xml",
    scopeNote: "The project end date"
  },
  {
    schema: "project",
    element: "amount",
    field: "project.amount",
    source: "schema-project-types.xml",
    scopeNote: "The project amount"
  },
  {
    schema: "project",
    element: "amount",
    field: "project.amount.currency",
    source: "schema-project-types.xml",
    qualifier: "currency",
    scopeNote: "The project amount currency"
  },
  {
    schema: "publicationissue",
    element: "issueNumber",
    field: "publicationissue.issueNumber",
    source: "schema-publicationIssue-types.xml",
    scopeNote: "Identifies the issue of publication; for example, \"iii\" or \"2\"."
  },
  {
    schema: "creativework",
    element: "keywords",
    field: "creativework.keywords",
    source: "schema-publicationIssue-types.xml",
    scopeNote: "Keywords or tags used to describe this content. Multiple entries in a keywords list are typically delimited by commas."
  },
  {
    schema: "publicationvolume",
    element: "volumeNumber",
    field: "publicationvolume.volumeNumber",
    source: "schema-publicationVolume-types.xml",
    scopeNote: "Identifies the volume of publication or multi-part work; for example, \"iii\" or \"2\"."
  },
  {
    schema: "creativework",
    element: "datePublished",
    field: "creativework.datePublished",
    source: "schema-publicationVolume-types.xml",
    scopeNote: "Date of first broadcast/publication."
  },
  {
    schema: "thesis",
    element: "inSupportOf",
    field: "thesis.inSupportOf",
    source: "schema-thesis-types.xml",
    scopeNote: "Qualification, candidature, degree, application that Thesis supports."
  },
  {
    schema: "dc",
    element: "contributor",
    field: "dc.contributor.author",
    source: "sword-metadata.xml",
    qualifier: "author",
    scopeNote: "The author of the item"
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.issued",
    source: "sword-metadata.xml",
    qualifier: "issued",
    scopeNote: "The date of publication"
  },
  {
    schema: "dc",
    element: "date",
    field: "dc.date.updated",
    source: "sword-metadata.xml",
    qualifier: "updated",
    scopeNote: "The last time the item was updated via the SWORD interface"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.abstract",
    source: "sword-metadata.xml",
    qualifier: "abstract",
    scopeNote: "Item summary or abstract"
  },
  {
    schema: "dc",
    element: "description",
    field: "dc.description.version",
    source: "sword-metadata.xml",
    qualifier: "version",
    scopeNote: "The Peer Reviewed status of an item"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.uri",
    source: "sword-metadata.xml",
    qualifier: "uri",
    scopeNote: "a uri to a copy of the item"
  },
  {
    schema: "dc",
    element: "identifier",
    field: "dc.identifier.slug",
    source: "sword-metadata.xml",
    qualifier: "slug",
    scopeNote: "a uri supplied via the sword slug header, as a suggested uri for the item"
  },
  {
    schema: "dc",
    element: "language",
    field: "dc.language.rfc3066",
    source: "sword-metadata.xml",
    qualifier: "rfc3066",
    scopeNote: "the rfc3066 form of the language for the item"
  },
  {
    schema: "dc",
    element: "rights",
    field: "dc.rights.holder",
    source: "sword-metadata.xml",
    qualifier: "holder",
    scopeNote: "The owner of the copyright"
  },
  {
    schema: "dc",
    element: "title",
    field: "dc.title",
    source: "sword-metadata.xml",
    scopeNote: "The title of the item"
  },
  {
    schema: "dc",
    element: "type",
    field: "dc.type",
    source: "sword-metadata.xml",
    scopeNote: "The type of the item, as defined by the eprints application profile"
  },
  {
    schema: "workflow",
    element: "score",
    field: "workflow.score",
    source: "workflow-types.xml",
    scopeNote: "Metadata field used for the score review rating"
  },
  {
    schema: "workflow",
    element: "review",
    field: "workflow.review",
    source: "workflow-types.xml",
    scopeNote: "Metadata field used for the score review description"
  }
];

export const METADATA_SCHEMAS_BY_NAME: Record<string, MetadataSchemaConfig> =
  METADATA_SCHEMAS.reduce((acc, schema) => {
    acc[schema.name] = schema;
    return acc;
  }, {} as Record<string, MetadataSchemaConfig>);

export const METADATA_FIELDS_BY_NAME: Record<string, MetadataFieldConfig[]> =
  METADATA_FIELDS.reduce((acc, field) => {
    acc[field.field] ??= [];
    acc[field.field].push(field);
    return acc;
  }, {} as Record<string, MetadataFieldConfig[]>);

export function getMetadataSchema(name: string): MetadataSchemaConfig | undefined {
  return METADATA_SCHEMAS_BY_NAME[name];
}

export function getMetadataField(field: string): MetadataFieldConfig[] {
  return METADATA_FIELDS_BY_NAME[field] ?? [];
}

export function isKnownMetadataField(field: string): boolean {
  return field in METADATA_FIELDS_BY_NAME;
}
