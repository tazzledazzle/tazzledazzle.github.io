function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function isActiveNavPath(currentPath: string, navUrl: string): boolean {
  const current = normalizePath(currentPath);
  const nav = normalizePath(navUrl);

  if (nav === "/") {
    return current === "/";
  }

  return current === nav || current.startsWith(nav);
}
