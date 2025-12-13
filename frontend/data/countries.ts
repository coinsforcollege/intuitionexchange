/**
 * Countries data using country-state-city library
 * No hardcoded data - everything comes from the library
 */

import { Country, ICountry } from 'country-state-city';

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

// Get all countries from library
const allCountries = Country.getAllCountries();

// Transform to our format
export const countries: CountryData[] = allCountries.map((country: ICountry) => ({
  code: country.isoCode,
  name: country.name,
  flag: country.flag || '',
  phoneCode: country.phonecode || '',
}));

// Get country options for Select component (for residence)
export const getCountryOptions = () =>
  countries.map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.name}`,
    searchValue: `${c.name} ${c.code}`,
  }));

// Get phone code options for Select component
export const getPhoneCodeOptions = () => {
  // Filter out countries without phone codes and deduplicate by phone code
  const seen = new Set<string>();
  
  return countries
    .filter((c) => c.phoneCode && c.phoneCode.length > 0)
    .filter((c) => {
      // Keep only first occurrence of each phone code
      if (seen.has(c.phoneCode)) return false;
      seen.add(c.phoneCode);
      return true;
    })
    .sort((a, b) => {
      // Sort numerically by phone code
      const numA = parseInt(a.phoneCode, 10);
      const numB = parseInt(b.phoneCode, 10);
      return numA - numB;
    })
    .map((c) => ({
      value: c.phoneCode,
      label: `${c.flag} +${c.phoneCode} (${c.code})`,
      searchValue: `${c.name} ${c.code} ${c.phoneCode}`,
    }));
};

// Get country by code
export const getCountryByCode = (code: string): CountryData | undefined =>
  countries.find((c) => c.code === code);

// Get country by phone code
export const getCountryByPhoneCode = (phoneCode: string): CountryData | undefined =>
  countries.find((c) => c.phoneCode === phoneCode);

// Get country with full library data
export const getFullCountryData = (code: string) => Country.getCountryByCode(code);
