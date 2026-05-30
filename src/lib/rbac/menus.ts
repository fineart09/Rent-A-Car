export type MenuItem = {
  title: string;
  href: string;
  roles?: string[];
};

export const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", roles: ["admin", "manager", "agent", "user"] },
  { title: "Cars", href: "/cars", roles: ["admin", "manager", "agent"] },
];

export default menuItems;
