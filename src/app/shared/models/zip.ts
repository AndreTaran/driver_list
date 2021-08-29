export interface Zip {
  zip: number;
  latitude: number;
  longitude: number;
}

export interface zipData {
  [zip: number]: {[subZip: number]: number};
}
