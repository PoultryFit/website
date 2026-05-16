export const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa","Homa Bay",
  "Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii",
  "Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera",
  "Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi",
  "Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita Taveta",
  "Tana River","Tharaka Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga",
  "Wajir","West Pokot"
] as const;

export const SPACE_TYPES = [
  "Shop","Stall","Office","Godown","Warehouse","Container","Market Space","Other"
] as const;

export const AMENITY_GROUPS = {
  Internal: [
    "Private Washroom","Reception Area","Storage Room","Partitioned Offices",
    "CCTV Inside","Air Conditioning","Tiled Flooring","Natural Lighting","Fitted Shelving"
  ],
  Security: [
    "Security Guard","Gated Compound","Electric Fence","CCTV Outside","Alarm System","Perimeter Wall"
  ],
  Utilities: [
    "Electricity Token Meter","Three Phase Power","Borehole Water","City Water",
    "Water 24/7","Free Waste Disposal","Generator Backup","Fibre Internet Ready"
  ],
  External: [
    "Parking","Near Main Road","Near Public Transport","Signage Space Available",
    "Loading Bay","Shared Compound","Busy Foot Traffic Area"
  ],
} as const;

export const ALL_AMENITIES = Object.values(AMENITY_GROUPS).flat();
