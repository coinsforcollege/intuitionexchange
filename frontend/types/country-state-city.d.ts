declare module 'country-state-city' {
  export interface ICountry {
    isoCode: string;
    name: string;
    phonecode: string;
    flag: string;
    currency: string;
    latitude: string;
    longitude: string;
    timezones: ITimezone[];
  }

  export interface IState {
    name: string;
    isoCode: string;
    countryCode: string;
    latitude: string | null;
    longitude: string | null;
  }

  export interface ICity {
    name: string;
    countryCode: string;
    stateCode: string;
    latitude: string | null;
    longitude: string | null;
  }

  export interface ITimezone {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }

  export const Country: {
    getAllCountries(): ICountry[];
    getCountryByCode(code: string): ICountry | undefined;
  };

  export const State: {
    getAllStates(): IState[];
    getStatesOfCountry(countryCode: string): IState[];
    getStateByCode(stateCode: string): IState | undefined;
    getStateByCodeAndCountry(stateCode: string, countryCode: string): IState | undefined;
  };

  export const City: {
    getAllCities(): ICity[];
    getCitiesOfState(countryCode: string, stateCode: string): ICity[];
    getCitiesOfCountry(countryCode: string): ICity[];
  };
}

