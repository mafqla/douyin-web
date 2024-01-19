export default {
  // ----------------- 登录 -----------------
  login: `/as/accounts/login`,
  logout: `/as/accounts/logout`,
  refreshToken: `/as/accounts/refresh`,
  // ----------------- 用户 -----------------
  // 获取用户信息
  getUserInfo: `/us/users/me`,

  // ----------------- 角色 -----------------
  // 获取角色列表
  getRoleList: `/as/roles/list`,
  // 新增角色
  addRole: `/as/roles`,
  // 编辑角色 /as/roles/{id}
  editRole: `/as/roles`,
  // 删除角色 /as/roles/{id}
  deleteRole: `/as/roles`

  // ----------------- 权限 -----------------
}
