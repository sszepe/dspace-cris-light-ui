export type EntityCluster = {
  key: string;
  label: string;
  description?: string;
  entityTypes: string[];
};

export const ENTITY_CLUSTERS: EntityCluster[] = [
  {
    key: "research",
    label: "Research",
    description: "Research-related outputs and activities",
    entityTypes: ["Project", "Funding", "Publication", "Product", "Equipment", "Event"],
  },
  {
    key: "registry",
    label: "Entity Registry",
    description: "Authority and registry entities",
    entityTypes: ["Person", "OrgUnit", "Journal", "Place", "Work"],
  },
  {
    key: "achievements",
    label: "Achievements",
    description: "Academic, artistic, and pedagogical achievements",
    entityTypes: ["Presentation", "ArtisticAchievement", "PaedagogicalAchievement", "Award"],
  },
  {
    key: "data",
    label: "Data Catalog",
    description: "Data catalog and data publication entities",
    entityTypes: ["DataCatalog", "DataService", "Dataset", "Distribution"],
  },
];
