export type { VATData, PilotData, ControllerData };

type ControllerData = {
  cid: number;
  name: string;
  callsign: string;
  frequency: string;
  facility: number;
  rating: number;
  server: string;
  visual_range: number;
  text_atis: string;
  last_updated: string;
  logon_time: string;
};

type PilotData = {
  cid: number;
  name: string;
  callsign: string;
  server: string;
  pilot_rating: number;
  latitude: number;
  longitude: number;
  altitude: number;
  groundspeed: number;
  transponder: string;
  heading: number;
  qnh_i_hg: number;
  qnh_mb: number;
  flight_plan: {
    flight_rules: string;
    aircraft: string;
    aircraft_faa: string;
    aircraft_short: string;
    departure: string;
    arrival: string;
    alternate: string;
    cruise_tas: string;
    altitude: string;
    deptime: string;
    enroute_time: string;
    fuel_time: string;
    remarks: string;
    route: string;
    revision_id: number;
    assigned_transponder: string;
  };
  logon_time: string;
  last_updated: string;
};

type VATData = {
  general: {
    version: string;
    reload: number;
    update: string;
    update_timestamp: number;
    connected_clients: number;
    unique_users: number;
  };
  pilots: PilotData[];
  controllers: ControllerData[];
};
