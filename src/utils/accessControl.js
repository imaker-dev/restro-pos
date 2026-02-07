export const hasAccess = ({
  userRole,
  userPermissions = [],
  roles,
  permissions,
}) => {
  const roleAllowed =
    !roles || roles.length === 0 || roles.includes(userRole);

  const permissionAllowed =
    !permissions ||
    permissions.length === 0 ||
    permissions.every((p) => userPermissions.includes(p));

  return roleAllowed && permissionAllowed;
};
