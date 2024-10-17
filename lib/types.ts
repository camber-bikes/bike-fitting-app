export type Person = {
  name: string;
  uuid: string | null;
  height: number;
};

export type Scan = {
  scan_uuid: string | null;
  person_uuid: string | null;
};
