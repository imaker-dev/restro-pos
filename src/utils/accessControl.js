export const hasAccess = ({
  userRole,
  userPermissions = [],
  roles,
  permissions,
  public: isPublic,
}) => {
  // PUBLIC ROUTE → ALWAYS ALLOW
  if (isPublic) return true;

  const roleAllowed =
    !roles || roles.length === 0 || roles.includes(userRole);

  const permissionAllowed =
    !permissions ||
    permissions.length === 0 ||
    permissions.every((p) => userPermissions.includes(p));

  return roleAllowed && permissionAllowed;
};
