import type { LinguisticTerm } from "@/types";

export const CRITERIA = [
  "Робочий діапазон частот",
  "Смуга / частота дискретизації",
  "Динамічний діапазон / розрядність",
  "ПЗ та екосистема",
  "Надійність апаратури",
  "Вартість / бюджетна доцільність",
];

export const ALTERNATIVES = [
  "USRP B200 mini",
  "HackRF One",
  "AntSDR E200",
  "bladeRF 2.0 micro XA4",
];

// початкові лінгвістичні оцінки (можна редагувати в UI)
export const DEFAULT_TERMS: LinguisticTerm[][] = [
  // A1 – USRP B200 mini
  ["VG", "VG", "VG", "VG", "VG", "MP"],
  // A2 – HackRF One
  ["M", "MP", "P", "MP", "P", "VG"],
  // A3 – AntSDR E200
  ["MG", "G", "MG", "M", "MG", "M"],
  // A4 – bladeRF 2.0 micro XA4
  ["VG", "EG", "VG", "MG", "G", "P"],
];
