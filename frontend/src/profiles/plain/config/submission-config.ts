/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from item-submission.xml and submission-forms.xml
 */

export type SubmissionField = {
  schema?: string;
  element?: string;
  qualifier?: string;
  field?: string;
  label?: string;
  inputType?: string;
  repeatable?: boolean;
  required?: string;
  isRequired: boolean;
  hint?: string;
  readonly?: string;
  style?: string;
  regex?: string;
  valuePairsName?: string;
  vocabulary?: string;
  vocabularyClosed?: boolean;
  languageCodes?: string[];
  typeBinds?: string[];
  childFormName?: string;
  childForm?: SubmissionFormResolved;
};

export type SubmissionRow = SubmissionField[];

export type SubmissionFormResolved = {
  name: string;
  rows: SubmissionRow[];
  containsRequiredFields: boolean;
};

export type SubmissionStepResolved = {
  id: string;
  heading?: string;
  mandatory?: boolean;
  type?: string;
  processingClass?: string;
  workflow?: string;
  visibility?: string;
  formName?: string;
  form?: SubmissionFormResolved;
};

export type SubmissionProcessResolved = {
  name: string;
  steps: SubmissionStepResolved[];
};

export const DEFAULT_SUBMISSION_NAME: string | undefined = "publication";

export const ENTITY_TYPE_TO_SUBMISSION: Record<string, string> = {};

export const SUBMISSION_PROCESSES: Record<string, SubmissionProcessResolved> = {
  product: {
    name: "product",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "product",
        heading: "submit.progressbar.describe.product",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product",
        form: {
          name: "product",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                hint: "If the item has any identification numbers or codes associated with it, please enter the types and the actual numbers or codes.",
                valuePairsName: "common_identifiers"
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item.",
                hint: "Enter the main title of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title.alternative",
                label: "Other Titles",
                inputType: "onebox",
                isRequired: false,
                qualifier: "alternative",
                repeatable: true,
                hint: "If the item has any alternative titles, please enter them here."
              }
            ],
            [
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Date of Issue",
                inputType: "date",
                isRequired: true,
                qualifier: "issued",
                repeatable: false,
                required: "You must enter at least the year.",
                hint: "Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren't applicable."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.version",
                label: "Version",
                inputType: "onebox",
                isRequired: false,
                qualifier: "version",
                repeatable: false,
                hint: "If applicable, the version of the product"
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Authors",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "Enter the names of the authors of this item.",
                childFormName: "product-dc-contributor-author",
                childForm: {
                  name: "product-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "Nothing to do here. Note for administrators, this metadata could be completely hide using template item",
                vocabulary: "product-coar-types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "product_indexing",
        heading: "submit.progressbar.describe.product_indexing",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product_indexing",
        form: {
          name: "product_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select, if applicable, the language of the main content of the item. If the language does not appear in the list, please select 'Other'. If the content does not really have a language (for example, if it is a dataset or an image) please select 'N/A'.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the abstract of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Other information",
                inputType: "textarea",
                isRequired: false,
                repeatable: false,
                hint: "Enter any other relevant information about the dataset."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "product_references",
        heading: "submit.progressbar.describe.product_references",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product_references",
        form: {
          name: "product_references",
          rows: [
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The publisher or publishers of this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.ispartofseries",
                label: "Series/Report No.",
                inputType: "series",
                isRequired: false,
                qualifier: "ispartofseries",
                repeatable: true,
                hint: "Link to the research output of which this product is a part (e.g. a data set collection that contains it)."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false,
                hint: "The journal or Serie ISSN if it was not found in the system"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this product.",
                childFormName: "product_references-dc-relation-funding",
                childForm: {
                  name: "product_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this product"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this product. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.conference",
                label: "Conference",
                inputType: "onebox",
                isRequired: false,
                qualifier: "conference",
                repeatable: false,
                hint: "The event where this product was presented or that is recorded in the product."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.equipment",
                label: "Generated by",
                inputType: "onebox",
                isRequired: false,
                qualifier: "equipment",
                repeatable: true,
                hint: "The equipment that generated this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.references",
                label: "References",
                inputType: "onebox",
                isRequired: false,
                qualifier: "references",
                repeatable: true,
                hint: "Result outputs that are referenced by this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.publication",
                label: "Used by",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "publication",
                repeatable: true,
                hint: "Result outputs that use this product",
                childFormName: "product_references-dc-relation-publication",
                childForm: {
                  name: "product_references-dc-relation-publication",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.publication",
                        label: "Publication",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "publication",
                        repeatable: false,
                        required: "You must enter at least the publication title / citation",
                        hint: "Enter the publication title or citation, if any, that uses this product",
                        style: "col-xs-12 col-md-9"
                      },
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.doi",
                        label: "DOI",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "doi",
                        repeatable: false,
                        hint: "If the publication is not found in the system please enter the DOI identifier",
                        style: "col-xs-12 col-md-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "cclicense",
        heading: "submit.progressbar.CClicense",
        mandatory: false,
        type: "cclicense",
        processingClass: "org.dspace.app.rest.submit.step.CCLicenseStep"
      },
      {
        id: "identifiers",
        heading: "submit.progressbar.identifiers",
        mandatory: true,
        type: "identifiers",
        processingClass: "org.dspace.app.rest.submit.step.ShowIdentifiersStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "product-edit": {
    name: "product-edit",
    steps: [
      {
        id: "product",
        heading: "submit.progressbar.describe.product",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product",
        form: {
          name: "product",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                hint: "If the item has any identification numbers or codes associated with it, please enter the types and the actual numbers or codes.",
                valuePairsName: "common_identifiers"
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item.",
                hint: "Enter the main title of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title.alternative",
                label: "Other Titles",
                inputType: "onebox",
                isRequired: false,
                qualifier: "alternative",
                repeatable: true,
                hint: "If the item has any alternative titles, please enter them here."
              }
            ],
            [
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Date of Issue",
                inputType: "date",
                isRequired: true,
                qualifier: "issued",
                repeatable: false,
                required: "You must enter at least the year.",
                hint: "Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren't applicable."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.version",
                label: "Version",
                inputType: "onebox",
                isRequired: false,
                qualifier: "version",
                repeatable: false,
                hint: "If applicable, the version of the product"
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Authors",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "Enter the names of the authors of this item.",
                childFormName: "product-dc-contributor-author",
                childForm: {
                  name: "product-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "Nothing to do here. Note for administrators, this metadata could be completely hide using template item",
                vocabulary: "product-coar-types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "product_indexing",
        heading: "submit.progressbar.describe.product_indexing",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product_indexing",
        form: {
          name: "product_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select, if applicable, the language of the main content of the item. If the language does not appear in the list, please select 'Other'. If the content does not really have a language (for example, if it is a dataset or an image) please select 'N/A'.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the abstract of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Other information",
                inputType: "textarea",
                isRequired: false,
                repeatable: false,
                hint: "Enter any other relevant information about the dataset."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "product_references",
        heading: "submit.progressbar.describe.product_references",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "product_references",
        form: {
          name: "product_references",
          rows: [
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The publisher or publishers of this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.ispartofseries",
                label: "Series/Report No.",
                inputType: "series",
                isRequired: false,
                qualifier: "ispartofseries",
                repeatable: true,
                hint: "Link to the research output of which this product is a part (e.g. a data set collection that contains it)."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false,
                hint: "The journal or Serie ISSN if it was not found in the system"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this product.",
                childFormName: "product_references-dc-relation-funding",
                childForm: {
                  name: "product_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this product"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this product. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.conference",
                label: "Conference",
                inputType: "onebox",
                isRequired: false,
                qualifier: "conference",
                repeatable: false,
                hint: "The event where this product was presented or that is recorded in the product."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.equipment",
                label: "Generated by",
                inputType: "onebox",
                isRequired: false,
                qualifier: "equipment",
                repeatable: true,
                hint: "The equipment that generated this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.references",
                label: "References",
                inputType: "onebox",
                isRequired: false,
                qualifier: "references",
                repeatable: true,
                hint: "Result outputs that are referenced by this product"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.publication",
                label: "Used by",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "publication",
                repeatable: true,
                hint: "Result outputs that use this product",
                childFormName: "product_references-dc-relation-publication",
                childForm: {
                  name: "product_references-dc-relation-publication",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.publication",
                        label: "Publication",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "publication",
                        repeatable: false,
                        required: "You must enter at least the publication title / citation",
                        hint: "Enter the publication title or citation, if any, that uses this product",
                        style: "col-xs-12 col-md-9"
                      },
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.doi",
                        label: "DOI",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "doi",
                        repeatable: false,
                        hint: "If the publication is not found in the system please enter the DOI identifier",
                        style: "col-xs-12 col-md-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  orgunit: {
    name: "orgunit",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "orgunit",
        heading: "submit.progressbar.describe.orgunit",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "orgunit",
        form: {
          name: "orgunit",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Organization name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the oganization name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym or short form of title",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "parentOrganization",
                field: "organization.parentOrganization",
                label: "Parent Organisation",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisou",
                element: "director",
                field: "crisou.director",
                label: "Director",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "foundingDate",
                field: "organization.foundingDate",
                label: "Established",
                inputType: "date",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisou",
                element: "boards",
                field: "crisou.boards",
                label: "Scientifics Board",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "organization",
                element: "identifier",
                field: "organization.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                valuePairsName: "orgunit_identifiers"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Website(s)",
                inputType: "link",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Description for OrgUnit",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "address",
                field: "organization.address.addressLocality",
                label: "City",
                inputType: "onebox",
                isRequired: false,
                qualifier: "addressLocality",
                repeatable: false
              },
              {
                schema: "organization",
                element: "address",
                field: "organization.address.addressCountry",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "addressCountry",
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "dropdown",
                isRequired: true,
                repeatable: false,
                required: "You must specify the organisation type",
                valuePairsName: "orgunit_types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "orgunit-edit": {
    name: "orgunit-edit",
    steps: [
      {
        id: "orgunit",
        heading: "submit.progressbar.describe.orgunit",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "orgunit",
        form: {
          name: "orgunit",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Organization name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the oganization name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym or short form of title",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "parentOrganization",
                field: "organization.parentOrganization",
                label: "Parent Organisation",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisou",
                element: "director",
                field: "crisou.director",
                label: "Director",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "foundingDate",
                field: "organization.foundingDate",
                label: "Established",
                inputType: "date",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisou",
                element: "boards",
                field: "crisou.boards",
                label: "Scientifics Board",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "organization",
                element: "identifier",
                field: "organization.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                valuePairsName: "orgunit_identifiers"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Website(s)",
                inputType: "link",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Description for OrgUnit",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "organization",
                element: "address",
                field: "organization.address.addressLocality",
                label: "City",
                inputType: "onebox",
                isRequired: false,
                qualifier: "addressLocality",
                repeatable: false
              },
              {
                schema: "organization",
                element: "address",
                field: "organization.address.addressCountry",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "addressCountry",
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "dropdown",
                isRequired: true,
                repeatable: false,
                required: "You must specify the organisation type",
                valuePairsName: "orgunit_types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  project: {
    name: "project",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "project",
        heading: "submit.progressbar.describe.project",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "project",
        form: {
          name: "project",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Project title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the project name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Project Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "coordinator",
                field: "crispj.coordinator",
                label: "Consortium Coordinator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Internal project ID",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "partnerou",
                field: "crispj.partnerou",
                label: "Partner Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crispj",
                element: "investigator",
                field: "crispj.investigator",
                label: "Project Coordinator",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the project coordinator."
              }
            ],
            [
              {
                schema: "crispj",
                element: "openaireid",
                field: "crispj.openaireid",
                label: "OpenAIRE ID",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "organization",
                field: "crispj.organization",
                label: "Participant Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Project URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate",
                label: "OA Mandate",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "truefalse"
              },
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate.url",
                label: "OA Policy URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.endDate",
                label: "Expected Completion",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.status",
                label: "Status",
                inputType: "onebox",
                isRequired: false,
                qualifier: "status",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Project type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "project_types"
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "coinvestigators",
                field: "crispj.coinvestigators",
                label: "Co-Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Keyword(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.equipment",
                label: "Uses equipment(s)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "equipment",
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "project-edit": {
    name: "project-edit",
    steps: [
      {
        id: "project",
        heading: "submit.progressbar.describe.project",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "project",
        form: {
          name: "project",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Project title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the project name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Project Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "coordinator",
                field: "crispj.coordinator",
                label: "Consortium Coordinator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Internal project ID",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "partnerou",
                field: "crispj.partnerou",
                label: "Partner Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crispj",
                element: "investigator",
                field: "crispj.investigator",
                label: "Project Coordinator",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the project coordinator."
              }
            ],
            [
              {
                schema: "crispj",
                element: "openaireid",
                field: "crispj.openaireid",
                label: "OpenAIRE ID",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "organization",
                field: "crispj.organization",
                label: "Participant Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Project URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate",
                label: "OA Mandate",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "truefalse"
              },
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate.url",
                label: "OA Policy URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.endDate",
                label: "Expected Completion",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "project",
                field: "oairecerif.project.status",
                label: "Status",
                inputType: "onebox",
                isRequired: false,
                qualifier: "status",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Project type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "project_types"
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "crispj",
                element: "coinvestigators",
                field: "crispj.coinvestigators",
                label: "Co-Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Keyword(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.equipment",
                label: "Uses equipment(s)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "equipment",
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  journal: {
    name: "journal",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "journal",
        heading: "submit.progressbar.describe.journal",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "journal",
        form: {
          name: "journal",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item."
              }
            ],
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "journal-edit": {
    name: "journal-edit",
    steps: [
      {
        id: "journal",
        heading: "submit.progressbar.describe.journal",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "journal",
        form: {
          name: "journal",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item."
              }
            ],
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  publication: {
    name: "publication",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "extractionstep",
        heading: "submit.progressbar.ExtractMetadataStep",
        mandatory: true,
        type: "extract",
        processingClass: "org.dspace.app.rest.submit.step.ExtractMetadataStep"
      },
      {
        id: "publication",
        heading: "submit.progressbar.describe.publication",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication",
        form: {
          name: "publication",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                hint: "If the item has any identification numbers or codes associated with it, please enter the types and the actual numbers or codes.",
                valuePairsName: "common_identifiers"
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item.",
                hint: "Enter the main title of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title.alternative",
                label: "Other Titles",
                inputType: "onebox",
                isRequired: false,
                qualifier: "alternative",
                repeatable: true,
                hint: "If the item has any alternative titles, please enter them here."
              }
            ],
            [
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Date of Issue",
                inputType: "date",
                isRequired: true,
                qualifier: "issued",
                repeatable: false,
                required: "You must enter at least the year.",
                hint: "Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren't applicable."
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Authors",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "Enter the names of the authors of this item.",
                childFormName: "publication-dc-contributor-author",
                childForm: {
                  name: "publication-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.editor",
                label: "Editors",
                inputType: "group",
                isRequired: false,
                qualifier: "editor",
                repeatable: true,
                hint: "The editors of this publication.",
                childFormName: "publication-dc-contributor-editor",
                childForm: {
                  name: "publication-dc-contributor-editor",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.editor",
                        label: "Editor",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "editor",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "The editors of this publication."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "editor",
                        field: "oairecerif.editor.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the editor as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must select a publication type",
                hint: "Select the type(s) of content of the item.",
                vocabulary: "publication-coar-types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "publication_indexing",
        heading: "submit.progressbar.describe.publication_indexing",
        mandatory: false,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_indexing",
        form: {
          name: "publication_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select the language of the main content of the item. If the language does not appear in the list, please select 'Other'. If the content does not really have a language (for example, if it is a dataset or an image) please select 'N/A'.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the abstract of the item."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "publication_bibliographic_details",
        heading: "submit.progressbar.describe.publication_bibliographic_details",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_bibliographic_details",
        form: {
          name: "publication_bibliographic_details",
          rows: [
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The publisher or publishers of this publication"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.publication",
                label: "Part Of",
                inputType: "onebox",
                isRequired: false,
                qualifier: "publication",
                repeatable: false,
                hint: "The publication where this publication is included. E.g. a book chapter lists here the book, a contribution to a conference lists here the conference proceeding.",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.isbn",
                label: "ISBN (of the container)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "isbn",
                repeatable: false,
                hint: "The ISBN of the book/report if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.doi",
                label: "DOI (of the container)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "doi",
                repeatable: false,
                hint: "The DOI of the book/report if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.journal",
                label: "Journal or Serie",
                inputType: "onebox",
                isRequired: false,
                qualifier: "journal",
                repeatable: false,
                hint: "The journal or Serie where this publication has been published"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.ispartofseries",
                label: "Series/Report No.",
                inputType: "series",
                isRequired: false,
                qualifier: "ispartofseries",
                repeatable: true,
                hint: "Enter the series and number assigned to this item by your community."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false,
                hint: "The journal or Serie ISSN if it was not found in the system"
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.publication",
                label: "Review of",
                inputType: "onebox",
                isRequired: false,
                qualifier: "publication",
                repeatable: false,
                hint: "The publication object of the review",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.isbn",
                label: "ISBN (of the reviewed item)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "isbn",
                repeatable: false,
                hint: "The ISBN of the reviewed item if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.doi",
                label: "DOI (of the reviewed item)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "doi",
                repeatable: false,
                hint: "The DOI of the reviewed item if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.volume",
                label: "Volume",
                inputType: "onebox",
                isRequired: false,
                qualifier: "volume",
                repeatable: false,
                hint: "If applicable, the volume of the publishing channel where this publication appeared"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.issue",
                label: "Issue",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issue",
                repeatable: false,
                hint: "If applicable, the issue of the publishing channel where this publication appeared"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.startPage",
                label: "Start Page",
                inputType: "onebox",
                isRequired: false,
                qualifier: "startPage",
                repeatable: false,
                hint: "If applicable, the page where this publication starts"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.endPage",
                label: "End Page",
                inputType: "onebox",
                isRequired: false,
                qualifier: "endPage",
                repeatable: false,
                hint: "If applicable, the page where this publication ends"
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "publication_references",
        heading: "submit.progressbar.describe.publication_references",
        mandatory: false,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_references",
        form: {
          name: "publication_references",
          rows: [
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this publication.",
                childFormName: "publication_references-dc-relation-funding",
                childForm: {
                  name: "publication_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this publication"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this publication. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.conference",
                label: "Conference",
                inputType: "onebox",
                isRequired: false,
                qualifier: "conference",
                repeatable: true,
                hint: "Enter the name of the conference where the item has been presented, if any."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.product",
                label: "Dataset or product",
                inputType: "onebox",
                isRequired: false,
                qualifier: "product",
                repeatable: true,
                hint: "Link the item to one or more existent dataset in the repository used or described by the publication or, put here the dataset citation"
              }
            ],
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.citation",
                label: "Citation",
                inputType: "onebox",
                isRequired: false,
                qualifier: "citation",
                repeatable: false,
                hint: "Enter the standard citation for the previously issued instance of this item."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false,
                hint: "Enter any other description or comments in this box."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.sponsorship",
                label: "Sponsors",
                inputType: "onebox",
                isRequired: false,
                qualifier: "sponsorship",
                repeatable: true,
                hint: "Enter the name of any sponsors."
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "publication-edit": {
    name: "publication-edit",
    steps: [
      {
        id: "extractionstep",
        heading: "submit.progressbar.ExtractMetadataStep",
        mandatory: true,
        type: "extract",
        processingClass: "org.dspace.app.rest.submit.step.ExtractMetadataStep"
      },
      {
        id: "publication",
        heading: "submit.progressbar.describe.publication",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication",
        form: {
          name: "publication",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier",
                label: "Identifiers",
                inputType: "qualdrop_value",
                isRequired: false,
                repeatable: true,
                hint: "If the item has any identification numbers or codes associated with it, please enter the types and the actual numbers or codes.",
                valuePairsName: "common_identifiers"
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter a main title for this item.",
                hint: "Enter the main title of the item."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title.alternative",
                label: "Other Titles",
                inputType: "onebox",
                isRequired: false,
                qualifier: "alternative",
                repeatable: true,
                hint: "If the item has any alternative titles, please enter them here."
              }
            ],
            [
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Date of Issue",
                inputType: "date",
                isRequired: true,
                qualifier: "issued",
                repeatable: false,
                required: "You must enter at least the year.",
                hint: "Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren't applicable."
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Authors",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "Enter the names of the authors of this item.",
                childFormName: "publication-dc-contributor-author",
                childForm: {
                  name: "publication-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.editor",
                label: "Editors",
                inputType: "group",
                isRequired: false,
                qualifier: "editor",
                repeatable: true,
                hint: "The editors of this publication.",
                childFormName: "publication-dc-contributor-editor",
                childForm: {
                  name: "publication-dc-contributor-editor",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.editor",
                        label: "Editor",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "editor",
                        repeatable: false,
                        required: "You must enter at least the author.",
                        hint: "The editors of this publication."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "editor",
                        field: "oairecerif.editor.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the editor as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must select a publication type",
                hint: "Select the type(s) of content of the item.",
                vocabulary: "publication-coar-types"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "publication_indexing",
        heading: "submit.progressbar.describe.publication_indexing",
        mandatory: false,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_indexing",
        form: {
          name: "publication_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select the language of the main content of the item. If the language does not appear in the list, please select 'Other'. If the content does not really have a language (for example, if it is a dataset or an image) please select 'N/A'.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the abstract of the item."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "publication_bibliographic_details",
        heading: "submit.progressbar.describe.publication_bibliographic_details",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_bibliographic_details",
        form: {
          name: "publication_bibliographic_details",
          rows: [
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Publisher",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The publisher or publishers of this publication"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.publication",
                label: "Part Of",
                inputType: "onebox",
                isRequired: false,
                qualifier: "publication",
                repeatable: false,
                hint: "The publication where this publication is included. E.g. a book chapter lists here the book, a contribution to a conference lists here the conference proceeding.",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.isbn",
                label: "ISBN (of the container)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "isbn",
                repeatable: false,
                hint: "The ISBN of the book/report if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.doi",
                label: "DOI (of the container)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "doi",
                repeatable: false,
                hint: "The DOI of the book/report if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_3248,publication-coar-types:c_5794,publication-coar-types:c_6670"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.journal",
                label: "Journal or Serie",
                inputType: "onebox",
                isRequired: false,
                qualifier: "journal",
                repeatable: false,
                hint: "The journal or Serie where this publication has been published"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.ispartofseries",
                label: "Series/Report No.",
                inputType: "series",
                isRequired: false,
                qualifier: "ispartofseries",
                repeatable: true,
                hint: "Enter the series and number assigned to this item by your community."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.issn",
                label: "ISSN",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issn",
                repeatable: false,
                hint: "The journal or Serie ISSN if it was not found in the system"
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.publication",
                label: "Review of",
                inputType: "onebox",
                isRequired: false,
                qualifier: "publication",
                repeatable: false,
                hint: "The publication object of the review",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.isbn",
                label: "ISBN (of the reviewed item)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "isbn",
                repeatable: false,
                hint: "The ISBN of the reviewed item if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "dc",
                element: "coverage",
                field: "dc.coverage.doi",
                label: "DOI (of the reviewed item)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "doi",
                repeatable: false,
                hint: "The DOI of the reviewed item if it was not found in the system",
                typeBinds: [
                  "publication-coar-types:c_efa0,publication-coar-types:c_ba08"
                ]
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.volume",
                label: "Volume",
                inputType: "onebox",
                isRequired: false,
                qualifier: "volume",
                repeatable: false,
                hint: "If applicable, the volume of the publishing channel where this publication appeared"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.issue",
                label: "Issue",
                inputType: "onebox",
                isRequired: false,
                qualifier: "issue",
                repeatable: false,
                hint: "If applicable, the issue of the publishing channel where this publication appeared"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.startPage",
                label: "Start Page",
                inputType: "onebox",
                isRequired: false,
                qualifier: "startPage",
                repeatable: false,
                hint: "If applicable, the page where this publication starts"
              }
            ],
            [
              {
                schema: "oaire",
                element: "citation",
                field: "oaire.citation.endPage",
                label: "End Page",
                inputType: "onebox",
                isRequired: false,
                qualifier: "endPage",
                repeatable: false,
                hint: "If applicable, the page where this publication ends"
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "publication_references",
        heading: "submit.progressbar.describe.publication_references",
        mandatory: false,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "publication_references",
        form: {
          name: "publication_references",
          rows: [
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this publication.",
                childFormName: "publication_references-dc-relation-funding",
                childForm: {
                  name: "publication_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this publication"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this publication. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.conference",
                label: "Conference",
                inputType: "onebox",
                isRequired: false,
                qualifier: "conference",
                repeatable: true,
                hint: "Enter the name of the conference where the item has been presented, if any."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.product",
                label: "Dataset or product",
                inputType: "onebox",
                isRequired: false,
                qualifier: "product",
                repeatable: true,
                hint: "Link the item to one or more existent dataset in the repository used or described by the publication or, put here the dataset citation"
              }
            ],
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.citation",
                label: "Citation",
                inputType: "onebox",
                isRequired: false,
                qualifier: "citation",
                repeatable: false,
                hint: "Enter the standard citation for the previously issued instance of this item."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false,
                hint: "Enter any other description or comments in this box."
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.sponsorship",
                label: "Sponsors",
                inputType: "onebox",
                isRequired: false,
                qualifier: "sponsorship",
                repeatable: true,
                hint: "Enter the name of any sponsors."
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  person: {
    name: "person",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "person",
        heading: "submit.progressbar.describe.person",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "person",
        form: {
          name: "person",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Preferred Name",
                inputType: "name",
                isRequired: true,
                repeatable: false,
                required: "You must enter least at the Surname."
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name",
                label: "Fullname",
                inputType: "name",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.translated",
                label: "Vernacular Name",
                inputType: "name",
                isRequired: false,
                qualifier: "translated",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.variant",
                label: "Variants",
                inputType: "name",
                isRequired: false,
                qualifier: "variant",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "givenName",
                field: "person.givenName",
                label: "First name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "familyName",
                field: "person.familyName",
                label: "Family name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "person",
                element: "birthDate",
                field: "person.birthDate",
                label: "Birth Date",
                inputType: "date",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.gender",
                label: "Gender",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "gender",
                repeatable: false,
                valuePairsName: "gender"
              }
            ],
            [
              {
                schema: "person",
                element: "jobTitle",
                field: "person.jobTitle",
                label: "Job Title",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "affiliation",
                field: "person.affiliation.name",
                label: "Main Affiliation",
                inputType: "onebox",
                isRequired: false,
                qualifier: "name",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "workgroup",
                field: "crisrp.workgroup",
                label: "Working group(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Personal Site(s)",
                inputType: "link",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "email",
                field: "person.email",
                label: "Email",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Interest(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.orcid",
                label: "ORCID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "orcid",
                repeatable: false,
                hint: "Settable by connecting the entity with ORCID",
                readonly: "all"
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.scopus-author-id",
                label: "Scopus Author ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "scopus-author-id",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.rid",
                label: "Researcher ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "rid",
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.affiliation",
                label: "Affiliation(s)",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "affiliation",
                repeatable: true,
                childFormName: "person-oairecerif-person-affiliation",
                childForm: {
                  name: "person-oairecerif-person-affiliation",
                  rows: [
                    [
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.role",
                        label: "Role",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "role",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "person",
                        field: "oairecerif.person.affiliation",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "affiliation",
                        repeatable: false,
                        required: "You must enter at least the organisation of your affiliation.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.startDate",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "startDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.endDate",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "endDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Biography",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "education",
                field: "crisrp.education",
                label: "Education(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-education",
                childForm: {
                  name: "person-crisrp-education",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.role",
                        label: "Degree/Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the degree/title",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "crisrp",
                element: "country",
                field: "crisrp.country",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "crisrp",
                element: "qualification",
                field: "crisrp.qualification",
                label: "Qualification(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-qualification",
                childForm: {
                  name: "person-crisrp-qualification",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.role",
                        label: "Qualification Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the qualification title.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "person",
                element: "knowsLanguage",
                field: "person.knowsLanguage",
                label: "Written Language(s)",
                inputType: "dropdown",
                isRequired: false,
                repeatable: true,
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.eperson",
                label: "Eperson Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "eperson",
                repeatable: false
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.group",
                label: "Group Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "group",
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "custom-url",
        heading: "submit.progressbar.custom-url",
        mandatory: false,
        type: "custom-url",
        processingClass: "org.dspace.app.rest.submit.step.CustomUrlStep"
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "person-edit": {
    name: "person-edit",
    steps: [
      {
        id: "person",
        heading: "submit.progressbar.describe.person",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "person",
        form: {
          name: "person",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Preferred Name",
                inputType: "name",
                isRequired: true,
                repeatable: false,
                required: "You must enter least at the Surname."
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name",
                label: "Fullname",
                inputType: "name",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.translated",
                label: "Vernacular Name",
                inputType: "name",
                isRequired: false,
                qualifier: "translated",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.variant",
                label: "Variants",
                inputType: "name",
                isRequired: false,
                qualifier: "variant",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "givenName",
                field: "person.givenName",
                label: "First name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "familyName",
                field: "person.familyName",
                label: "Family name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "person",
                element: "birthDate",
                field: "person.birthDate",
                label: "Birth Date",
                inputType: "date",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.gender",
                label: "Gender",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "gender",
                repeatable: false,
                valuePairsName: "gender"
              }
            ],
            [
              {
                schema: "person",
                element: "jobTitle",
                field: "person.jobTitle",
                label: "Job Title",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "affiliation",
                field: "person.affiliation.name",
                label: "Main Affiliation",
                inputType: "onebox",
                isRequired: false,
                qualifier: "name",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "workgroup",
                field: "crisrp.workgroup",
                label: "Working group(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Personal Site(s)",
                inputType: "link",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "email",
                field: "person.email",
                label: "Email",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Interest(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.orcid",
                label: "ORCID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "orcid",
                repeatable: false,
                hint: "Settable by connecting the entity with ORCID",
                readonly: "all"
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.scopus-author-id",
                label: "Scopus Author ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "scopus-author-id",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.rid",
                label: "Researcher ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "rid",
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.affiliation",
                label: "Affiliation(s)",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "affiliation",
                repeatable: true,
                childFormName: "person-oairecerif-person-affiliation",
                childForm: {
                  name: "person-oairecerif-person-affiliation",
                  rows: [
                    [
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.role",
                        label: "Role",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "role",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "person",
                        field: "oairecerif.person.affiliation",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "affiliation",
                        repeatable: false,
                        required: "You must enter at least the organisation of your affiliation.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.startDate",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "startDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.endDate",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "endDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Biography",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "education",
                field: "crisrp.education",
                label: "Education(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-education",
                childForm: {
                  name: "person-crisrp-education",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.role",
                        label: "Degree/Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the degree/title",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "crisrp",
                element: "country",
                field: "crisrp.country",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "crisrp",
                element: "qualification",
                field: "crisrp.qualification",
                label: "Qualification(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-qualification",
                childForm: {
                  name: "person-crisrp-qualification",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.role",
                        label: "Qualification Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the qualification title.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "person",
                element: "knowsLanguage",
                field: "person.knowsLanguage",
                label: "Written Language(s)",
                inputType: "dropdown",
                isRequired: false,
                repeatable: true,
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.eperson",
                label: "Eperson Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "eperson",
                repeatable: false
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.group",
                label: "Group Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "group",
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "custom-url",
        heading: "submit.progressbar.custom-url",
        mandatory: false,
        type: "custom-url",
        processingClass: "org.dspace.app.rest.submit.step.CustomUrlStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  "admin-person-edit": {
    name: "admin-person-edit",
    steps: [
      {
        id: "person",
        heading: "submit.progressbar.describe.person",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "person",
        form: {
          name: "person",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Preferred Name",
                inputType: "name",
                isRequired: true,
                repeatable: false,
                required: "You must enter least at the Surname."
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name",
                label: "Fullname",
                inputType: "name",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.translated",
                label: "Vernacular Name",
                inputType: "name",
                isRequired: false,
                qualifier: "translated",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "name",
                field: "crisrp.name.variant",
                label: "Variants",
                inputType: "name",
                isRequired: false,
                qualifier: "variant",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "givenName",
                field: "person.givenName",
                label: "First name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "familyName",
                field: "person.familyName",
                label: "Family name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "person",
                element: "birthDate",
                field: "person.birthDate",
                label: "Birth Date",
                inputType: "date",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.gender",
                label: "Gender",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "gender",
                repeatable: false,
                valuePairsName: "gender"
              }
            ],
            [
              {
                schema: "person",
                element: "jobTitle",
                field: "person.jobTitle",
                label: "Job Title",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "person",
                element: "affiliation",
                field: "person.affiliation.name",
                label: "Main Affiliation",
                inputType: "onebox",
                isRequired: false,
                qualifier: "name",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "workgroup",
                field: "crisrp.workgroup",
                label: "Working group(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "identifier",
                field: "oairecerif.identifier.url",
                label: "Personal Site(s)",
                inputType: "link",
                isRequired: false,
                qualifier: "url",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "email",
                field: "person.email",
                label: "Email",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Interest(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.orcid",
                label: "ORCID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "orcid",
                repeatable: false,
                hint: "Settable by connecting the entity with ORCID",
                readonly: "all"
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.scopus-author-id",
                label: "Scopus Author ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "scopus-author-id",
                repeatable: true
              }
            ],
            [
              {
                schema: "person",
                element: "identifier",
                field: "person.identifier.rid",
                label: "Researcher ID",
                inputType: "onebox",
                isRequired: false,
                qualifier: "rid",
                repeatable: true
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "person",
                field: "oairecerif.person.affiliation",
                label: "Affiliation(s)",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "affiliation",
                repeatable: true,
                childFormName: "person-oairecerif-person-affiliation",
                childForm: {
                  name: "person-oairecerif-person-affiliation",
                  rows: [
                    [
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.role",
                        label: "Role",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "role",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "person",
                        field: "oairecerif.person.affiliation",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "affiliation",
                        repeatable: false,
                        required: "You must enter at least the organisation of your affiliation.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.startDate",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "startDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "oairecerif",
                        element: "affiliation",
                        field: "oairecerif.affiliation.endDate",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "endDate",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Biography",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "crisrp",
                element: "education",
                field: "crisrp.education",
                label: "Education(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-education",
                childForm: {
                  name: "person-crisrp-education",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.role",
                        label: "Degree/Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the degree/title",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "education",
                        field: "crisrp.education.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "crisrp",
                element: "country",
                field: "crisrp.country",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "crisrp",
                element: "qualification",
                field: "crisrp.qualification",
                label: "Qualification(s)",
                inputType: "inline-group",
                isRequired: false,
                repeatable: true,
                childFormName: "person-crisrp-qualification",
                childForm: {
                  name: "person-crisrp-qualification",
                  rows: [
                    [
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification",
                        label: "Organisation name",
                        inputType: "onebox",
                        isRequired: true,
                        repeatable: false,
                        required: "You must enter the organisation",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.role",
                        label: "Qualification Title",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "role",
                        repeatable: false,
                        required: "You must enter the qualification title.",
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.start",
                        label: "Start Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "start",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      },
                      {
                        schema: "crisrp",
                        element: "qualification",
                        field: "crisrp.qualification.end",
                        label: "End Date",
                        inputType: "date",
                        isRequired: false,
                        qualifier: "end",
                        repeatable: false,
                        style: "col-xs-12 col-md-6 col-lg-3"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "person",
                element: "knowsLanguage",
                field: "person.knowsLanguage",
                label: "Written Language(s)",
                inputType: "dropdown",
                isRequired: false,
                repeatable: true,
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.eperson",
                label: "Eperson Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "eperson",
                repeatable: false
              }
            ],
            [
              {
                schema: "cris",
                element: "policy",
                field: "cris.policy.group",
                label: "Group Policy",
                inputType: "onebox",
                isRequired: false,
                qualifier: "group",
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "custom-url",
        heading: "submit.progressbar.custom-url",
        mandatory: false,
        type: "custom-url",
        processingClass: "org.dspace.app.rest.submit.step.CustomUrlStep"
      },
      {
        id: "owner",
        heading: "submit.progressbar.describe.owner",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "owner",
        form: {
          name: "owner",
          rows: [
            [
              {
                schema: "dspace",
                element: "object",
                field: "dspace.object.owner",
                label: "Owner",
                inputType: "onebox",
                isRequired: false,
                qualifier: "owner",
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  event: {
    name: "event",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "event",
        heading: "submit.progressbar.describe.event",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "event",
        form: {
          name: "event",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Event name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Event type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "event_types"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.endDate",
                label: "End date",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.place",
                label: "Location",
                inputType: "onebox",
                isRequired: false,
                qualifier: "place",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.country",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "country",
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "crisevent",
                element: "organizerou",
                field: "crisevent.organizerou",
                label: "Organizer(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "organizerpj",
                field: "crisevent.organizerpj",
                label: "Organizer(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "sponsorou",
                field: "crisevent.sponsorou",
                label: "Sponsor(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "sponsorpj",
                field: "crisevent.sponsorpj",
                label: "Sponsor(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "partnerou",
                field: "crisevent.partnerou",
                label: "Partner(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "partnerpj",
                field: "crisevent.partnerpj",
                label: "Partner(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Event Description",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Keyword(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "event-edit": {
    name: "event-edit",
    steps: [
      {
        id: "event",
        heading: "submit.progressbar.describe.event",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "event",
        form: {
          name: "event",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Event name",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Event type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "event_types"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.endDate",
                label: "End date",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.place",
                label: "Location",
                inputType: "onebox",
                isRequired: false,
                qualifier: "place",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "event",
                field: "oairecerif.event.country",
                label: "Country",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "country",
                repeatable: false,
                valuePairsName: "common_iso_countries"
              }
            ],
            [
              {
                schema: "crisevent",
                element: "organizerou",
                field: "crisevent.organizerou",
                label: "Organizer(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "organizerpj",
                field: "crisevent.organizerpj",
                label: "Organizer(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "sponsorou",
                field: "crisevent.sponsorou",
                label: "Sponsor(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "sponsorpj",
                field: "crisevent.sponsorpj",
                label: "Sponsor(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "partnerou",
                field: "crisevent.partnerou",
                label: "Partner(s) of the Event",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisevent",
                element: "partnerpj",
                field: "crisevent.partnerpj",
                label: "Partner(s) of the Event (project)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Event Description",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Keyword(s)",
                inputType: "tag",
                isRequired: false,
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  equipment: {
    name: "equipment",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "equipment",
        heading: "submit.progressbar.describe.equipment",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "equipment",
        form: {
          name: "equipment",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the equipment name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Institution Unique Identifier",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisequipment",
                element: "ownerou",
                field: "crisequipment.ownerou",
                label: "Owner (Organisations)",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisequipment",
                element: "ownerrp",
                field: "crisequipment.ownerrp",
                label: "Owner (Persons)",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Equipment Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "equipment-edit": {
    name: "equipment-edit",
    steps: [
      {
        id: "equipment",
        heading: "submit.progressbar.describe.equipment",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "equipment",
        form: {
          name: "equipment",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the equipment name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Institution Unique Identifier",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisequipment",
                element: "ownerou",
                field: "crisequipment.ownerou",
                label: "Owner (Organisations)",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisequipment",
                element: "ownerrp",
                field: "crisequipment.ownerrp",
                label: "Owner (Persons)",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Equipment Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  patent: {
    name: "patent",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "extractionstep",
        heading: "submit.progressbar.ExtractMetadataStep",
        mandatory: true,
        type: "extract",
        processingClass: "org.dspace.app.rest.submit.step.ExtractMetadataStep"
      },
      {
        id: "patent",
        heading: "submit.progressbar.describe.patent",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent",
        form: {
          name: "patent",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.patentno",
                label: "Patent Number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "patentno",
                repeatable: false,
                hint: "The patent number"
              }
            ],
            [
              {
                schema: "crispatent",
                element: "kind",
                field: "crispatent.kind",
                label: "Kind Code",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "The kind code"
              },
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.applicationnumber",
                label: "Application Number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "applicationnumber",
                repeatable: false,
                hint: "The application number"
              },
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Publication Date",
                inputType: "date",
                isRequired: false,
                qualifier: "issued",
                repeatable: false,
                hint: "Date on which the application was physically received at the Patent Authority. Also named Filling Date."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must specify a title for the patent",
                hint: "The title of the patent"
              }
            ],
            [
              {
                schema: "dcterms",
                element: "dateAccepted",
                field: "dcterms.dateAccepted",
                label: "Approval Date",
                inputType: "date",
                isRequired: false,
                repeatable: false,
                hint: "Date on which the application has been granted by the Patent Office."
              }
            ],
            [
              {
                schema: "dcterms",
                element: "dateSubmitted",
                field: "dcterms.dateSubmitted",
                label: "Registration Date",
                inputType: "date",
                isRequired: false,
                repeatable: false,
                hint: "Date of making available to the public by printing or similar process of a patent document on which grant has taken place on or before the said date."
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Inventor(s)",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "The inventor: The actual devisor of an invention that is the subject of a patent.",
                childFormName: "patent-dc-contributor-author",
                childForm: {
                  name: "patent-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the inventor.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dcterms",
                element: "rightsHolder",
                field: "dcterms.rightsHolder",
                label: "Holder",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The holders of this patent"
              }
            ],
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Issuer",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The issuer of the patent: the patent office"
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must select a patent type",
                hint: "Select the type of content of the patent.",
                vocabulary: "patent-coar-types"
              }
            ],
            [
              {
                schema: "crispatent",
                element: "document",
                field: "crispatent.document.kind",
                label: "Patent History",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "kind",
                repeatable: true,
                childFormName: "patent-crispatent-document-kind",
                childForm: {
                  name: "patent-crispatent-document-kind",
                  rows: [
                    [
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.kind",
                        label: "Kind Code",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "kind",
                        repeatable: false,
                        required: "You must enter the kind code.",
                        style: "col-xs-12 col-md-6"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.issueDate",
                        label: "Publication Date",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "issueDate",
                        repeatable: false,
                        required: "You must enter the publication date.",
                        style: "col-xs-12 col-md-6"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.title",
                        label: "Title",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "title",
                        repeatable: false,
                        style: "col-12"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.description",
                        label: "Abstract",
                        inputType: "textarea",
                        isRequired: false,
                        qualifier: "description",
                        repeatable: false,
                        style: "col-12"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "patent_indexing",
        heading: "submit.progressbar.describe.patent_indexing",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent_indexing",
        form: {
          name: "patent_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select the country and its language.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the description of the patent."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "patent_references",
        heading: "submit.progressbar.describe.patent_references",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent_references",
        form: {
          name: "patent_references",
          rows: [
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this patent.",
                childFormName: "patent_references-dc-relation-funding",
                childForm: {
                  name: "patent_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this patent"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this patent. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.patent",
                label: "Predecessor",
                inputType: "onebox",
                isRequired: false,
                qualifier: "patent",
                repeatable: true,
                hint: "Patents that precede (i.e., have priority over) this patent"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.references",
                label: "References",
                inputType: "onebox",
                isRequired: false,
                qualifier: "references",
                repeatable: true,
                hint: "Result outputs that are referenced by this patent"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "patent-edit": {
    name: "patent-edit",
    steps: [
      {
        id: "extractionstep",
        heading: "submit.progressbar.ExtractMetadataStep",
        mandatory: true,
        type: "extract",
        processingClass: "org.dspace.app.rest.submit.step.ExtractMetadataStep"
      },
      {
        id: "patent",
        heading: "submit.progressbar.describe.patent",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent",
        form: {
          name: "patent",
          rows: [
            [
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.patentno",
                label: "Patent Number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "patentno",
                repeatable: false,
                hint: "The patent number"
              }
            ],
            [
              {
                schema: "crispatent",
                element: "kind",
                field: "crispatent.kind",
                label: "Kind Code",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "The kind code"
              },
              {
                schema: "dc",
                element: "identifier",
                field: "dc.identifier.applicationnumber",
                label: "Application Number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "applicationnumber",
                repeatable: false,
                hint: "The application number"
              },
              {
                schema: "dc",
                element: "date",
                field: "dc.date.issued",
                label: "Publication Date",
                inputType: "date",
                isRequired: false,
                qualifier: "issued",
                repeatable: false,
                hint: "Date on which the application was physically received at the Patent Authority. Also named Filling Date."
              }
            ],
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Title",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must specify a title for the patent",
                hint: "The title of the patent"
              }
            ],
            [
              {
                schema: "dcterms",
                element: "dateAccepted",
                field: "dcterms.dateAccepted",
                label: "Approval Date",
                inputType: "date",
                isRequired: false,
                repeatable: false,
                hint: "Date on which the application has been granted by the Patent Office."
              }
            ],
            [
              {
                schema: "dcterms",
                element: "dateSubmitted",
                field: "dcterms.dateSubmitted",
                label: "Registration Date",
                inputType: "date",
                isRequired: false,
                repeatable: false,
                hint: "Date of making available to the public by printing or similar process of a patent document on which grant has taken place on or before the said date."
              }
            ],
            [
              {
                schema: "dc",
                element: "contributor",
                field: "dc.contributor.author",
                label: "Inventor(s)",
                inputType: "group",
                isRequired: false,
                qualifier: "author",
                repeatable: true,
                hint: "The inventor: The actual devisor of an invention that is the subject of a patent.",
                childFormName: "patent-dc-contributor-author",
                childForm: {
                  name: "patent-dc-contributor-author",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "contributor",
                        field: "dc.contributor.author",
                        label: "Author",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "author",
                        repeatable: false,
                        required: "You must enter at least the inventor.",
                        hint: "Enter the names of the authors of this item in the form Lastname, Firstname [i.e. Smith, Josh or Smith, J]."
                      }
                    ],
                    [
                      {
                        schema: "oairecerif",
                        element: "author",
                        field: "oairecerif.author.affiliation",
                        label: "Affiliation",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "affiliation",
                        repeatable: false,
                        hint: "Enter the affiliation of the author as stated on the publication."
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dcterms",
                element: "rightsHolder",
                field: "dcterms.rightsHolder",
                label: "Holder",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The holders of this patent"
              }
            ],
            [
              {
                schema: "dc",
                element: "publisher",
                field: "dc.publisher",
                label: "Issuer",
                inputType: "onebox",
                isRequired: false,
                repeatable: true,
                hint: "The issuer of the patent: the patent office"
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must select a patent type",
                hint: "Select the type of content of the patent.",
                vocabulary: "patent-coar-types"
              }
            ],
            [
              {
                schema: "crispatent",
                element: "document",
                field: "crispatent.document.kind",
                label: "Patent History",
                inputType: "inline-group",
                isRequired: false,
                qualifier: "kind",
                repeatable: true,
                childFormName: "patent-crispatent-document-kind",
                childForm: {
                  name: "patent-crispatent-document-kind",
                  rows: [
                    [
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.kind",
                        label: "Kind Code",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "kind",
                        repeatable: false,
                        required: "You must enter the kind code.",
                        style: "col-xs-12 col-md-6"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.issueDate",
                        label: "Publication Date",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "issueDate",
                        repeatable: false,
                        required: "You must enter the publication date.",
                        style: "col-xs-12 col-md-6"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.title",
                        label: "Title",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "title",
                        repeatable: false,
                        style: "col-12"
                      },
                      {
                        schema: "crispatent",
                        element: "document",
                        field: "crispatent.document.description",
                        label: "Abstract",
                        inputType: "textarea",
                        isRequired: false,
                        qualifier: "description",
                        repeatable: false,
                        style: "col-12"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "patent_indexing",
        heading: "submit.progressbar.describe.patent_indexing",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent_indexing",
        form: {
          name: "patent_indexing",
          rows: [
            [
              {
                schema: "dc",
                element: "language",
                field: "dc.language.iso",
                label: "Language",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "iso",
                repeatable: false,
                hint: "Select the country and its language.",
                valuePairsName: "common_iso_languages"
              }
            ],
            [
              {
                schema: "dc",
                element: "subject",
                field: "dc.subject",
                label: "Subject Keywords",
                inputType: "tag",
                isRequired: false,
                repeatable: true,
                hint: "Type the appropriate keyword or phrase and press Enter to add it."
              }
            ],
            [
              {
                schema: "datacite",
                element: "subject",
                field: "datacite.subject.fos",
                label: "Fields of Science and Technology (OECD)",
                inputType: "onebox",
                isRequired: false,
                qualifier: "fos",
                repeatable: true,
                vocabulary: "oecd",
                vocabularyClosed: true
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description.abstract",
                label: "Abstract",
                inputType: "textarea",
                isRequired: false,
                qualifier: "abstract",
                repeatable: false,
                hint: "Enter the description of the patent."
              }
            ]
          ],
          containsRequiredFields: false
        }
      },
      {
        id: "patent_references",
        heading: "submit.progressbar.describe.patent_references",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "patent_references",
        form: {
          name: "patent_references",
          rows: [
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.funding",
                label: "Funding",
                inputType: "group",
                isRequired: false,
                qualifier: "funding",
                repeatable: true,
                hint: "Acknowledge the funding received for this patent.",
                childFormName: "patent_references-dc-relation-funding",
                childForm: {
                  name: "patent_references-dc-relation-funding",
                  rows: [
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.funding",
                        label: "Funding",
                        inputType: "onebox",
                        isRequired: true,
                        qualifier: "funding",
                        repeatable: false,
                        required: "You must enter at least the funding name.",
                        hint: "Enter the name of funding, if any, that has supported this patent"
                      }
                    ],
                    [
                      {
                        schema: "dc",
                        element: "relation",
                        field: "dc.relation.grantno",
                        label: "Grant Number / Funding identifier",
                        inputType: "onebox",
                        isRequired: false,
                        qualifier: "grantno",
                        repeatable: false,
                        hint: "If the funding is not found in the system please enter the funding identifier / grant no"
                      }
                    ]
                  ],
                  containsRequiredFields: true
                }
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Projects",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: true,
                hint: "Enter the name of project, if any, that has produced this patent. It is NOT necessary to list the projects connected with an acknowledge funding."
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.patent",
                label: "Predecessor",
                inputType: "onebox",
                isRequired: false,
                qualifier: "patent",
                repeatable: true,
                hint: "Patents that precede (i.e., have priority over) this patent"
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.references",
                label: "References",
                inputType: "onebox",
                isRequired: false,
                qualifier: "references",
                repeatable: true,
                hint: "Result outputs that are referenced by this patent"
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  },
  funding: {
    name: "funding",
    steps: [
      {
        id: "collection",
        heading: "submit.progressbar.collection",
        mandatory: true,
        type: "collection",
        processingClass: "org.dspace.app.rest.submit.step.CollectionStep"
      },
      {
        id: "funding",
        heading: "submit.progressbar.describe.funding",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "funding",
        form: {
          name: "funding",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the equipment name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Internal Funding code",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Funded project",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "funder",
                field: "oairecerif.funder",
                label: "Funder",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "fundingParent",
                field: "oairecerif.fundingParent",
                label: "Program",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "Link this funding with its upper level if applicable"
              }
            ],
            [
              {
                schema: "crisfund",
                element: "award",
                field: "crisfund.award.url",
                label: "Award Url",
                inputType: "onebox",
                isRequired: true,
                qualifier: "url",
                repeatable: false,
                required: "The url preferably on the funder website of the award notice"
              }
            ],
            [
              {
                schema: "crisfund",
                element: "award",
                field: "crisfund.award.uri",
                label: "Award URI",
                inputType: "onebox",
                isRequired: true,
                qualifier: "uri",
                repeatable: false,
                required: "The Award URI"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate",
                label: "OA Mandate",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "truefalse"
              },
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate.url",
                label: "OA Policy URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "amount",
                field: "oairecerif.amount",
                label: "Amount",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "amount",
                field: "oairecerif.amount.currency",
                label: "Currency",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "currency",
                repeatable: false,
                valuePairsName: "currency"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.identifier",
                label: "Grant number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "identifier",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.endDate",
                label: "End date",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "funding_types"
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Funding Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisfund",
                element: "investigators",
                field: "crisfund.investigators",
                label: "Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "coinvestigators",
                field: "crisfund.coinvestigators",
                label: "Co-Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "leadorganizations",
                field: "crisfund.leadorganizations",
                label: "Lead Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "leadcoorganizations",
                field: "crisfund.leadcoorganizations",
                label: "Lead Co-Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "correction",
        heading: "submit.progressbar.correction",
        mandatory: true,
        type: "correction",
        processingClass: "org.dspace.app.rest.submit.step.CorrectionStep"
      },
      {
        id: "detect-duplicate",
        heading: "submit.progressbar.detect-duplicate",
        mandatory: true,
        type: "detect-duplicate",
        processingClass: "org.dspace.app.rest.submit.step.DetectPotentialDuplicateStep"
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      },
      {
        id: "license",
        heading: "submit.progressbar.license",
        mandatory: true,
        type: "license",
        processingClass: "org.dspace.app.rest.submit.step.LicenseStep"
      }
    ]
  },
  "funding-edit": {
    name: "funding-edit",
    steps: [
      {
        id: "funding",
        heading: "submit.progressbar.describe.funding",
        mandatory: true,
        type: "submission-form",
        processingClass: "org.dspace.app.rest.submit.step.DescribeStep",
        formName: "funding",
        form: {
          name: "funding",
          rows: [
            [
              {
                schema: "dc",
                element: "title",
                field: "dc.title",
                label: "Name",
                inputType: "onebox",
                isRequired: true,
                repeatable: false,
                required: "You must enter the equipment name."
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "acronym",
                field: "oairecerif.acronym",
                label: "Acronym",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "internalid",
                field: "oairecerif.internalid",
                label: "Internal Funding code",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "relation",
                field: "dc.relation.project",
                label: "Funded project",
                inputType: "onebox",
                isRequired: false,
                qualifier: "project",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "funder",
                field: "oairecerif.funder",
                label: "Funder",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "fundingParent",
                field: "oairecerif.fundingParent",
                label: "Program",
                inputType: "onebox",
                isRequired: false,
                repeatable: false,
                hint: "Link this funding with its upper level if applicable"
              }
            ],
            [
              {
                schema: "crisfund",
                element: "award",
                field: "crisfund.award.url",
                label: "Award Url",
                inputType: "onebox",
                isRequired: true,
                qualifier: "url",
                repeatable: false,
                required: "The url preferably on the funder website of the award notice"
              }
            ],
            [
              {
                schema: "crisfund",
                element: "award",
                field: "crisfund.award.uri",
                label: "Award URI",
                inputType: "onebox",
                isRequired: true,
                qualifier: "uri",
                repeatable: false,
                required: "The Award URI"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate",
                label: "OA Mandate",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "truefalse"
              },
              {
                schema: "oairecerif",
                element: "oamandate",
                field: "oairecerif.oamandate.url",
                label: "OA Policy URL",
                inputType: "onebox",
                isRequired: false,
                qualifier: "url",
                repeatable: false
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "amount",
                field: "oairecerif.amount",
                label: "Amount",
                inputType: "onebox",
                isRequired: false,
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "amount",
                field: "oairecerif.amount.currency",
                label: "Currency",
                inputType: "dropdown",
                isRequired: false,
                qualifier: "currency",
                repeatable: false,
                valuePairsName: "currency"
              }
            ],
            [
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.identifier",
                label: "Grant number",
                inputType: "onebox",
                isRequired: false,
                qualifier: "identifier",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.startDate",
                label: "Start date",
                inputType: "date",
                isRequired: false,
                qualifier: "startDate",
                repeatable: false
              },
              {
                schema: "oairecerif",
                element: "funding",
                field: "oairecerif.funding.endDate",
                label: "End date",
                inputType: "date",
                isRequired: false,
                qualifier: "endDate",
                repeatable: false
              }
            ],
            [
              {
                schema: "dc",
                element: "type",
                field: "dc.type",
                label: "Type",
                inputType: "dropdown",
                isRequired: false,
                repeatable: false,
                valuePairsName: "funding_types"
              }
            ],
            [
              {
                schema: "dc",
                element: "description",
                field: "dc.description",
                label: "Funding Description",
                inputType: "textarea",
                isRequired: false,
                repeatable: false
              }
            ],
            [
              {
                schema: "crisfund",
                element: "investigators",
                field: "crisfund.investigators",
                label: "Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "coinvestigators",
                field: "crisfund.coinvestigators",
                label: "Co-Investigator(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "leadorganizations",
                field: "crisfund.leadorganizations",
                label: "Lead Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ],
            [
              {
                schema: "crisfund",
                element: "leadcoorganizations",
                field: "crisfund.leadcoorganizations",
                label: "Lead Co-Organization(s)",
                inputType: "onebox",
                isRequired: false,
                repeatable: true
              }
            ]
          ],
          containsRequiredFields: true
        }
      },
      {
        id: "upload",
        heading: "submit.progressbar.upload",
        mandatory: true,
        type: "upload",
        processingClass: "org.dspace.app.rest.submit.step.UploadStep"
      }
    ]
  }
};

export function getSubmissionProcess(name: string): SubmissionProcessResolved | undefined {
  return SUBMISSION_PROCESSES[name];
}

export function getSubmissionProcessForEntityType(entityType: string): SubmissionProcessResolved | undefined {
  const processName = ENTITY_TYPE_TO_SUBMISSION[entityType] ?? DEFAULT_SUBMISSION_NAME;
  return processName ? SUBMISSION_PROCESSES[processName] : undefined;
}
