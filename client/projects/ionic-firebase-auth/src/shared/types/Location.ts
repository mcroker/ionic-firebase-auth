export interface Location {
    lat: number;
    lon: number;
}

export interface Place {
    formatted_address?: string;
    location?: Location;
}
