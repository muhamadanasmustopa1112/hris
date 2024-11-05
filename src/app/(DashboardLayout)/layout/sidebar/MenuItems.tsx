import {
  IconAlarm,
  IconBriefcase,
  IconBriefcase2,
  IconCalendarTime,
  IconFileCheck,
  IconFileDelta,
  IconFileDescription,
  IconFileDiff,
  IconLayoutDashboard,
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
    subheader: "Master Data",
  },
  {
    id: uniqueId(),
    title: "Shift",
    icon: IconCalendarTime,
    href: "/shift",
  },
  {
    id: uniqueId(),
    title: "Jam",
    icon: IconAlarm,
    href: "/jam",
  },
  {
    id: uniqueId(),
    title: "Divisi",
    icon: IconBriefcase2,
    href: "/divisions",
  },
  {
    id: uniqueId(),
    title: "Jabatan",
    icon: IconBriefcase,
    href: "/jabatan",
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
    title: "Presensi Karyawan",
    icon: IconFileCheck,
    href: "/presensi",
  },
  {
    navlabel: true,
    subheader: "Pengajuan Karyawan",
  },
  {
    id: uniqueId(),
    title: "Pengajuan Cuti/Izin",
    icon: IconFileDescription,
    href: "/perizinan/data-perizinan",
  },
  {
    id: uniqueId(),
    title: "Pengajuan Lembur",
    icon: IconFileDelta,
    href: "/lembur",
  },
  {
    id: uniqueId(),
    title: "Pengajuan Kasbon",
    icon: IconFileDiff,
    href: "/kasbon",
  },

];

export default Menuitems;
