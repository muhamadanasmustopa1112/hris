import {
  IconAperture,
  IconCopy,
  IconFileCheck,
  IconFileDescription,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Karyawan",
  },
  {
    id: uniqueId(),
    title: "Data Karyawan",
    icon: IconUsers,
    href: "/employees/data-employee",
  },
  {
    id: uniqueId(),
    title: "Abseni Karyawan",
    icon: IconFileCheck,
    href: "/utilities/shadow",
  },
  {
    navlabel: true,
    subheader: "Perizinan",
  },
  {
    id: uniqueId(),
    title: "Data Perizinan",
    icon: IconFileDescription,
    href: "/perizinan/data-perizinan",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },
];

export default Menuitems;
