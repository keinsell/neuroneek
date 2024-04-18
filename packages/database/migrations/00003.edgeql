CREATE MIGRATION m1lyce4el5ol5hicbrsprfh5f2b7bwoxjtminis5l26itkv2whp3pq
    ONTO m1ugt64ndgnirssulqcssgwy65nda7v2pieixhadd7unp3hke4kqya
{
  DROP TYPE default::Movie;
  DROP TYPE default::Person;
  ALTER TYPE default::Substance {
      CREATE PROPERTY cas_number: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY chemical_class: std::str;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY inchi_key: std::str;
      CREATE PROPERTY iupac: std::str;
      ALTER PROPERTY name {
          SET REQUIRED USING (<std::str>{'migrated'});
      };
      CREATE PROPERTY psychoactive_class: array<std::str>;
      CREATE PROPERTY smiles: std::str;
      CREATE PROPERTY systematic_name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY unii: std::str;
  };
};
