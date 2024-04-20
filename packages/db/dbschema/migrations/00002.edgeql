CREATE MIGRATION m1ugt64ndgnirssulqcssgwy65nda7v2pieixhadd7unp3hke4kqya
    ONTO m1dnvwxfwvu5zgfglqobjjun5wwcmteoc7oplvl3qwd3yfabujt4nq
{
  ALTER TYPE default::Substance {
      CREATE PROPERTY brand_names: array<std::str>;
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY substitutive_name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
