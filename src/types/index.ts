export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  created_at: string;
  user_id: string;
  start_date: string;
  end_date?: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  usage_count: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface Location {
  id: string;
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}