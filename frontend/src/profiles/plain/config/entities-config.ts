/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Generated from entities/*.xml
 * NOTE: Entity types must be activated via EntityTypeInstaller before use.
 */

export type EntityRelationship = {
  leftType?: string;
  rightType?: string;
  leftwardType: string;
  rightwardType: string;
  leftMin?: number;
  leftMax?: number;
  rightMin?: number;
  rightMax?: number;
  copyToLeft?: boolean;
  copyToRight?: boolean;
  source: string;
};

/**
 * All entity type names declared in entities/*.xml.
 * Not all of these are necessarily active in the running DSpace instance.
 */
export const DECLARED_ENTITY_TYPES: string[] = [
  "Equipment",
  "Event",
  "Funding",
  "Journal",
  "JournalIssue",
  "JournalVolume",
  "OrgUnit",
  "Patent",
  "Person",
  "Product",
  "Project",
  "Publication",
];

export const ENTITY_RELATIONSHIPS: EntityRelationship[] = [
  { leftType: "Person", rightType: "Person", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Project", rightType: "Project", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Funding", rightType: "Funding", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "OrgUnit", rightType: "OrgUnit", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Journal", rightType: "Journal", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "JournalVolume", rightType: "JournalVolume", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "JournalIssue", rightType: "JournalIssue", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Publication", rightType: "Publication", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Patent", rightType: "Patent", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Product", rightType: "Product", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Event", rightType: "Event", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: "Equipment", rightType: "Equipment", leftwardType: "isCorrectionOfItem", rightwardType: "isCorrectedByItem", leftMin: 0, leftMax: 1, rightMin: 0, rightMax: 1, source: "correction-relationship-types.xml" },
  { leftType: undefined, rightType: "Person", leftwardType: "isResearchoutputsHiddenFor", rightwardType: "notDisplayingResearchoutputs", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Person", leftwardType: "isProjectsHiddenFor", rightwardType: "notDisplayingProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Person", leftwardType: "isResearchoutputsSelectedFor", rightwardType: "hasSelectedResearchoutputs", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Person", leftwardType: "isProjectsSelectedFor", rightwardType: "hasSelectedProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isRpprojectsHiddenFor", rightwardType: "notDisplayingRpprojects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isRpprojectsSelectedFor", rightwardType: "hasSelectedRpprojects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isPublicationsHiddenFor", rightwardType: "notDisplayingPublications", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isPublicationsSelectedFor", rightwardType: "hasSelectedPublications", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isRppublicationsHiddenFor", rightwardType: "notDisplayingRppublications", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isRppublicationsSelectedFor", rightwardType: "hasSelectedRppublications", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isPeopleHiddenFor", rightwardType: "notDisplayingPeople", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isPeopleSelectedFor", rightwardType: "hasSelectedPeople", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isProjectsHiddenFor", rightwardType: "notDisplayingProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isProjectsSelectedFor", rightwardType: "hasSelectedProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isOrganizationsHiddenFor", rightwardType: "notDisplayingOrganizations", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "OrgUnit", leftwardType: "isOrganizationsSelectedFor", rightwardType: "hasSelectedOrganizations", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isProjectsHiddenFor", rightwardType: "notDisplayingProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isProjectsSelectedFor", rightwardType: "hasSelectedProjects", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isGrantsHiddenFor", rightwardType: "notDisplayingGrants", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isGrantsSelectedFor", rightwardType: "hasSelectedGrants", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isResearchoutputsHiddenFor", rightwardType: "notDisplayingResearchoutputs", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: undefined, rightType: "Project", leftwardType: "isResearchoutputsSelectedFor", rightwardType: "hasSelectedResearchoutputs", leftMin: 0, rightMin: 0, source: "hide-sort-relationship-types.xml" },
  { leftType: "Project", rightType: "Project", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Person", rightType: "Person", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Funding", rightType: "Funding", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "OrgUnit", rightType: "OrgUnit", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Journal", rightType: "Journal", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Publication", rightType: "Publication", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Product", rightType: "Product", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Patent", rightType: "Patent", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Event", rightType: "Event", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Equipment", rightType: "Equipment", leftwardType: "isMergedFromItem", rightwardType: "isMergedInItem", leftMin: 0, rightMin: 0, source: "merge-relationship-types.xml" },
  { leftType: "Publication", rightType: "Person", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Publication", rightType: "Person", leftwardType: "isContributorOfPublication", rightwardType: "isPublicationOfContributor", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isContributorOfPublication", rightwardType: "isPublicationOfContributor", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Publication", rightType: "Project", leftwardType: "isProjectOfPublication", rightwardType: "isPublicationOfProject", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Project", rightType: "OrgUnit", leftwardType: "isFundingAgencyOfProject", rightwardType: "isProjectOfFundingAgency", leftMin: 0, rightMin: 0, source: "openaire4-relationships.xml" },
  { leftType: "Publication", rightType: "Person", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, copyToLeft: true, source: "relationship-types.xml" },
  { leftType: "Publication", rightType: "Project", leftwardType: "isProjectOfPublication", rightwardType: "isPublicationOfProject", leftMin: 0, rightMin: 0, copyToLeft: true, source: "relationship-types.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isOrgUnitOfPublication", rightwardType: "isPublicationOfOrgUnit", leftMin: 0, rightMin: 0, copyToLeft: true, source: "relationship-types.xml" },
  { leftType: "Person", rightType: "Project", leftwardType: "isProjectOfPerson", rightwardType: "isPersonOfProject", leftMin: 0, rightMin: 0, source: "relationship-types.xml" },
  { leftType: "Person", rightType: "OrgUnit", leftwardType: "isOrgUnitOfPerson", rightwardType: "isPersonOfOrgUnit", leftMin: 0, rightMin: 0, source: "relationship-types.xml" },
  { leftType: "Project", rightType: "OrgUnit", leftwardType: "isOrgUnitOfProject", rightwardType: "isProjectOfOrgUnit", leftMin: 0, rightMin: 0, source: "relationship-types.xml" },
  { leftType: "Journal", rightType: "JournalVolume", leftwardType: "isVolumeOfJournal", rightwardType: "isJournalOfVolume", leftMin: 0, rightMin: 0, source: "relationship-types.xml" },
  { leftType: "JournalVolume", rightType: "JournalIssue", leftwardType: "isIssueOfJournalVolume", rightwardType: "isJournalVolumeOfIssue", leftMin: 0, rightMin: 0, source: "relationship-types.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, copyToLeft: true, source: "relationship-types.xml" },
  { leftType: "JournalIssue", rightType: "Publication", leftwardType: "isPublicationOfJournalIssue", rightwardType: "isJournalIssueOfPublication", leftMin: 0, rightMin: 0, copyToRight: true, source: "relationship-types.xml" },
  { leftType: "Publication", rightType: "Person", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isAuthorOfPublication", rightwardType: "isPublicationOfAuthor", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" },
  { leftType: "Publication", rightType: "Person", leftwardType: "isContributorOfPublication", rightwardType: "isPublicationOfContributor", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" },
  { leftType: "Publication", rightType: "OrgUnit", leftwardType: "isContributorOfPublication", rightwardType: "isPublicationOfContributor", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" },
  { leftType: "Publication", rightType: "Project", leftwardType: "isProjectOfPublication", rightwardType: "isPublicationOfProject", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" },
  { leftType: "Project", rightType: "OrgUnit", leftwardType: "isFundingAgencyOfProject", rightwardType: "isProjectOfFundingAgency", leftMin: 0, rightMin: 0, source: "rioxx3-relationships.xml" }
];

export const RELATIONSHIPS_BY_TYPE: Record<string, EntityRelationship[]> =
  ENTITY_RELATIONSHIPS.reduce((acc, r) => {
    const key = `${r.leftType || "*"}→${r.rightType || "*"}`;
    acc[key] ??= [];
    acc[key].push(r);
    return acc;
  }, {} as Record<string, EntityRelationship[]>);
