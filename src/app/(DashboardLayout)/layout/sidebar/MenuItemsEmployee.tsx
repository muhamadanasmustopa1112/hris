import {
    IconAlarm,
    IconFileDelta,
    IconFileDescription,
    IconFileDiff,
  } from "@tabler/icons-react";
  
  import { uniqueId } from "lodash";
  
  const MenuitemsEmployee = [
    {
      navlabel: true,
      subheader: "Presensi Karyawan",
    },
  
    {
      id: uniqueId(),
      title: "Masuk",
      icon: IconAlarm,
      href: "/presensi/masuk",
    },

    {
      id: uniqueId(),
      title: "Keluar",
      icon: IconAlarm,
      href: "/presensi/keluar",
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
  
  export default MenuitemsEmployee;
  