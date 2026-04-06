import React from "react";
import { useAuth } from "../auth/AuthContext";
import "../styles/profile.css";

const COMMUNITY_ADMIN_RE = /^COMMUNITY_([0-9a-f-]+)_ADMIN$/i;

function metaFirst(
  meta: Record<string, Array<{ value: string }>> | undefined,
  field: string,
): string | null {
  return meta?.[field]?.[0]?.value ?? null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <span className="profile-card-title">{title}</span>
        {count !== undefined && (
          <span className="profile-card-count">{count}</span>
        )}
      </div>
      <div className="profile-card-body">{children}</div>
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="profile-info-grid">{children}</div>;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="profile-info-label">{label}</div>
      <div className="profile-info-value">{children}</div>
    </>
  );
}

function Pill({ children, variant = "gray" }: {
  children: React.ReactNode;
  variant?: "gray" | "indigo" | "green" | "amber" | "teal";
}) {
  return <span className={`profile-pill profile-pill--${variant}`}>{children}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { eperson, groups, username, isLoading, isAdmin, isCommunityAdmin, communityAdminIds } = useAuth();

  if (isLoading) return <div className="profile-status">Loading…</div>;
  if (!eperson) return <div className="profile-status">No profile data available.</div>;

  const firstName = metaFirst(eperson.metadata, "eperson.firstname");
  const lastName = metaFirst(eperson.metadata, "eperson.lastname");
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || username || eperson.email || "—";

  // Split groups into community admin groups and other groups
  const communityAdminGroups = groups.filter((g) => COMMUNITY_ADMIN_RE.test(g.name));
  const otherGroups = groups.filter((g) => !COMMUNITY_ADMIN_RE.test(g.name));

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-title-row">
          <h2 className="profile-title">My Profile</h2>
          {isAdmin && <Pill variant="indigo">Administrator</Pill>}
          {!isAdmin && isCommunityAdmin && <Pill variant="teal">Community Admin</Pill>}
        </div>
        <p className="profile-subtitle">
          Account data and group memberships from DSpace CRIS.
        </p>
      </div>

      {/* Account card */}
      <Card title="Account">
        <InfoGrid>
          <InfoRow label="Display name">{fullName}</InfoRow>
          <InfoRow label="Email">{eperson.email || "—"}</InfoRow>
          <InfoRow label="NetID">{eperson.netid || "—"}</InfoRow>
          <InfoRow label="UUID">
            <code className="profile-mono">{eperson.uuid}</code>
          </InfoRow>
          <InfoRow label="Last active">
            {eperson.lastActive ? new Date(eperson.lastActive).toLocaleString() : "—"}
          </InfoRow>
          <InfoRow label="Can log in">{eperson.canLogIn ? "Yes" : "No"}</InfoRow>
          <InfoRow label="Self registered">{eperson.selfRegistered ? "Yes" : "No"}</InfoRow>
        </InfoGrid>
      </Card>

      {/* Community admin card — only shown when the user admins at least one community */}
      {communityAdminIds.size > 0 && (
        <Card title="Community Admin" count={communityAdminIds.size}>
          <div className="profile-community-list">
            {communityAdminGroups.map((group) => {
              const match = COMMUNITY_ADMIN_RE.exec(group.name);
              const communityUuid = match?.[1] ?? null;
              const linkedObject = group._embedded?.object;
              const communityName =
                linkedObject?.metadata?.["dc.title"]?.[0]?.value ??
                linkedObject?.name ??
                null;
              const description = group.metadata?.["dc.description"]?.[0]?.value ?? null;

              return (
                <div key={group.id} className="profile-community-row">
                  <div className="profile-community-icon">🏛</div>
                  <div className="profile-community-body">
                    <div className="profile-community-name">
                      {communityName ?? communityUuid ?? group.name}
                    </div>
                    {communityUuid && (
                      <code className="profile-mono profile-community-uuid">{communityUuid}</code>
                    )}
                    {description && (
                      <div className="profile-community-description">{description}</div>
                    )}
                  </div>
                  <Pill variant="teal">Admin</Pill>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Groups card */}
      <Card title="Groups" count={otherGroups.length}>
        {otherGroups.length === 0 ? (
          <div className="profile-empty">No group memberships found.</div>
        ) : (
          <div className="profile-group-list">
            {otherGroups.map((group) => {
              const linkedObject = group._embedded?.object;
              const entityType =
                linkedObject?.metadata?.["dspace.entity.type"]?.[0]?.value ?? null;
              const description = group.metadata?.["dc.description"]?.[0]?.value ?? null;
              const isAdminGroup = group.name === "Administrator";

              return (
                <div key={group.id} className="profile-group-row">
                  <div className="profile-group-name-row">
                    <span className="profile-group-name">{group.name}</span>
                    {group.permanent && <Pill variant="gray">Permanent</Pill>}
                    {isAdminGroup && <Pill variant="indigo">Administrator</Pill>}
                    {entityType && <Pill variant="indigo">{entityType}</Pill>}
                  </div>
                  {description && (
                    <div className="profile-group-meta">{description}</div>
                  )}
                  {linkedObject?.name && (
                    <div className="profile-group-meta">Linked: {linkedObject.name}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
