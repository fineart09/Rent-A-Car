export type MenuItem = {
  title: string;
  href: string;
  roles?: string[];
};

export const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", roles: ["admin", "manager", "agent", "user"] },
  { title: "จัดการรถ", href: "/cars", roles: ["admin", "manager", "agent"] },
  { title: "รายการเช่า", href: "/bookings", roles: ["admin", "manager", "agent"] },
  { title: "การชำระเงิน", href: "/payments", roles: ["admin", "manager"] },
  { title: "บำรุงรักษา", href: "/maintenance", roles: ["admin", "manager"] },
  { title: "ผู้ใช้และสิทธิ์", href: "/users", roles: ["admin"] },
];

export default menuItems;
