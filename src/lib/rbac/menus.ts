export type MenuItem = {
  title: string;
  href: string;
  roles?: string[];
};

export const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", roles: ["admin", "manager", "agent", "user"] },
  { title: "ระบบจัดการรถยนต์", href: "/cars", roles: ["admin", "manager", "agent"] },
  { title: "ข้อมูลลูกค้า", href: "/driver", roles: ["admin", "manager", "agent", "user"] },
  { title: "ข้อมูลบริการ/โปรโมชั่น", href: "/products", roles: ["admin", "manager", "agent", "user"] },
  { title: "บันทึกรายการเช่ารถ", href: "/booking", roles: ["admin", "manager", "agent", "user"] },
  { title: "การชำระเงิน", href: "/payments", roles: ["admin", "manager", "agent", "user"] },
  { title: "ตั้งค่าระบบ", href: "/setting/users", roles: ["admin", "manager"] },
];

export default menuItems;
