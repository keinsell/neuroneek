CREATE MIGRATION m1dnvwxfwvu5zgfglqobjjun5wwcmteoc7oplvl3qwd3yfabujt4nq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::Person {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::Movie {
      CREATE MULTI LINK actors: default::Person;
      CREATE PROPERTY title: std::str;
  };
  CREATE TYPE default::Substance {
      CREATE PROPERTY common_names: array<std::str>;
      CREATE PROPERTY name: std::str;
  };
};
