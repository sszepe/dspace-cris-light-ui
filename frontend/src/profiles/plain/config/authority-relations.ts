/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from authority.cfg
 */

export type ReciprocalRelation = {
  entityType: string;
  field: string;
  reciprocalField: string;
  reciprocalEntityType?: string;
  note?: string;
};

export type AuthorityFieldConfig = {
  field: string;
  plugin: string;
  presentation?: string;
  controlled: boolean;
  externalSource?: string;
  category?: string;
};

export const RECIPROCAL_RELATIONS: ReciprocalRelation[] = [
  {
    entityType: "Publication",
    field: "dc.relation.product",
    reciprocalField: "dc.relation.publication",
    reciprocalEntityType: "Product",
    note: "Code and name are both available as data"
  },
  {
    entityType: "Product",
    field: "dc.relation.publication",
    reciprocalField: "dc.relation.product",
    reciprocalEntityType: "Publication",
    note: "Code and name are both available as data"
  }
];

export const AUTHORITY_FIELDS: AuthorityFieldConfig[] = [
  {
    field: "dc.contributor.author",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "oairecerif.author.affiliation",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.contributor.editor",
    plugin: "EditorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "oairecerif.editor.affiliation",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.relation.product",
    plugin: "DataSetAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.relation.publication",
    plugin: "PublicationAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.relation.journal",
    plugin: "SherpaAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.relation.project",
    plugin: "ProjectAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.publisher",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "dc.relation.funding",
    plugin: "FundingAuthority",
    presentation: "suggest",
    controlled: true,
    externalSource: "fundingAuthority",
    category: "Person"
  },
  {
    field: "dc.description.sponsorship",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "crispj.coordinator",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "crispj.organization",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "crispj.partnerou",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "crispj.investigator",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "crispj.coinvestigators",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "dc.relation.equipment",
    plugin: "EquipmentAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Project"
  },
  {
    field: "person.affiliation.name",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "oairecerif.person.affiliation",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Person"
  },
  {
    field: "crisrp.qualification",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "OrgUnit"
  },
  {
    field: "crisrp.education",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "OrgUnit"
  },
  {
    field: "organization.parentOrganization",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "OrgUnit"
  },
  {
    field: "crisou.director",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "OrgUnit"
  },
  {
    field: "oairecerif.funder",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "oairecerif.fundingParent",
    plugin: "FundingAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "crisfund.investigators",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "crisfund.coinvestigators",
    plugin: "AuthorAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "crisfund.leadorganizations",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "crisfund.leadcoorganizations",
    plugin: "OrgUnitAuthority",
    presentation: "suggest",
    controlled: true,
    category: "Funding"
  },
  {
    field: "cris.policy.eperson",
    plugin: "EPersonAuthority",
    presentation: "suggest",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "cris.policy.group",
    plugin: "GroupAuthority",
    presentation: "suggest",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "dspace.object.owner",
    plugin: "EPersonAuthority",
    presentation: "suggest",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "dc.identifier.issn",
    plugin: "ZDBAuthority",
    presentation: "suggest",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "dc.type",
    plugin: "ControlledVocabularyAuthority",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "cris.virtual.department",
    plugin: "ControlledVocabularyAuthority",
    controlled: true,
    category: "CRIS / policy"
  },
  {
    field: "oairecerif.identifier.url",
    plugin: "ControlledVocabularyAuthority",
    controlled: true,
    category: "CRIS / policy"
  }
];

export const AUTHORITY_FIELDS_BY_NAME: Record<string, AuthorityFieldConfig[]> = AUTHORITY_FIELDS.reduce(
  (acc, entry) => {
    acc[entry.field] ??= [];
    acc[entry.field].push(entry);
    return acc;
  },
  {} as Record<string, AuthorityFieldConfig[]>,
);

export const RECIPROCAL_RELATIONS_BY_FIELD: Record<string, ReciprocalRelation[]> = RECIPROCAL_RELATIONS.reduce(
  (acc, entry) => {
    acc[entry.field] ??= [];
    acc[entry.field].push(entry);
    return acc;
  },
  {} as Record<string, ReciprocalRelation[]>,
);

export function getAuthorityConfigs(field: string): AuthorityFieldConfig[] {
  return AUTHORITY_FIELDS_BY_NAME[field] ?? [];
}

export function getReciprocalRelations(field: string, entityType?: string): ReciprocalRelation[] {
  const matches = RECIPROCAL_RELATIONS_BY_FIELD[field] ?? [];
  return entityType ? matches.filter((entry) => entry.entityType === entityType) : matches;
}

export function isAuthorityControlledField(field: string): boolean {
  return field in AUTHORITY_FIELDS_BY_NAME;
}
