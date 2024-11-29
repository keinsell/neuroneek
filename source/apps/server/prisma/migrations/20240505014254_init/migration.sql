-- CreateTable
CREATE TABLE "Account"
(
    "id"       TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subject"
(
    "id"          TEXT NOT NULL PRIMARY KEY,
    "firstName"   TEXT,
    "lastName"    TEXT,
    "dateOfBirth" DATETIME,
    "weight"      INTEGER,
    "height"      INTEGER,
    "account_id"  TEXT,
    CONSTRAINT "Subject_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Substance"
(
    "id"                 TEXT NOT NULL PRIMARY KEY,
    "name"               TEXT NOT NULL,
    "common_names"       TEXT,
    "brand_names"        TEXT,
    "substitutive_name"  TEXT,
    "systematic_name"    TEXT,
    "unii"               TEXT,
    "cas_number"         TEXT,
    "inchi_key"          TEXT,
    "iupac"              TEXT,
    "smiles"             TEXT,
    "psychoactive_class" TEXT NOT NULL,
    "chemical_class"     TEXT,
    "description"        TEXT
);

-- CreateTable
CREATE TABLE "RouteOfAdministration"
(
    "id"              TEXT NOT NULL PRIMARY KEY,
    "substanceName"   TEXT,
    "name"            TEXT NOT NULL,
    "bioavailability" REAL NOT NULL,
    CONSTRAINT "RouteOfAdministration_substanceName_fkey" FOREIGN KEY ("substanceName") REFERENCES "Substance" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Phase"
(
    "id"                      TEXT NOT NULL PRIMARY KEY,
    "from"                    INTEGER,
    "to"                      INTEGER,
    "routeOfAdministrationId" TEXT,
    CONSTRAINT "Phase_routeOfAdministrationId_fkey" FOREIGN KEY ("routeOfAdministrationId") REFERENCES "RouteOfAdministration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dosage"
(
    "id"                      TEXT    NOT NULL PRIMARY KEY,
    "intensivity"             TEXT    NOT NULL,
    "amount_min"              REAL    NOT NULL,
    "amount_max"              REAL    NOT NULL,
    "unit"                    TEXT    NOT NULL,
    "perKilogram"             BOOLEAN NOT NULL DEFAULT false,
    "routeOfAdministrationId" TEXT,
    CONSTRAINT "Dosage_routeOfAdministrationId_fkey" FOREIGN KEY ("routeOfAdministrationId") REFERENCES "RouteOfAdministration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Effect"
(
    "id"             TEXT NOT NULL PRIMARY KEY,
    "name"           TEXT NOT NULL,
    "slug"           TEXT NOT NULL,
    "category"       TEXT,
    "type"           TEXT,
    "tags"           TEXT NOT NULL,
    "summary"        TEXT,
    "description"    TEXT NOT NULL,
    "parameters"     TEXT NOT NULL,
    "see_also"       TEXT NOT NULL,
    "effectindex"    TEXT,
    "psychonautwiki" TEXT
);

-- CreateTable
CREATE TABLE "Ingestion"
(
    "id"                    TEXT NOT NULL PRIMARY KEY,
    "substanceName"         TEXT,
    "routeOfAdministration" TEXT,
    "dosage_unit"           TEXT,
    "dosage_amount"         INTEGER,
    "isEstimatedDosage"     BOOLEAN DEFAULT false,
    "date"                  DATETIME,
    "subject_id"            TEXT,
    "stashId"               TEXT,
    CONSTRAINT "Ingestion_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingestion_substanceName_fkey" FOREIGN KEY ("substanceName") REFERENCES "Substance" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingestion_stashId_fkey" FOREIGN KEY ("stashId") REFERENCES "Stash" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stash"
(
    "id"           TEXT NOT NULL PRIMARY KEY,
    "owner_id"     TEXT NOT NULL,
    "substance_id" TEXT NOT NULL,
    "addedDate"    DATETIME DEFAULT CURRENT_TIMESTAMP,
    "expiration"   DATETIME,
    "amount"       INTEGER,
    "price"        TEXT,
    "vendor"       TEXT,
    "description"  TEXT,
    "purity"       INTEGER  DEFAULT 100,
    CONSTRAINT "Stash_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stash_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "Substance" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubstanceInteraction"
(
    "id"          TEXT NOT NULL PRIMARY KEY,
    "substanceId" TEXT,
    CONSTRAINT "SubstanceInteraction_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "Substance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EffectToPhase"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EffectToPhase_A_fkey" FOREIGN KEY ("A") REFERENCES "Effect" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EffectToPhase_B_fkey" FOREIGN KEY ("B") REFERENCES "Phase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_account_id_key" ON "Subject" ("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_name_key" ON "Substance" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_substitutive_name_key" ON "Substance" ("substitutive_name");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_systematic_name_key" ON "Substance" ("systematic_name");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_cas_number_key" ON "Substance" ("cas_number");

-- CreateIndex
CREATE UNIQUE INDEX "RouteOfAdministration_name_substanceName_key" ON "RouteOfAdministration" ("name", "substanceName");

-- CreateIndex
CREATE UNIQUE INDEX "Dosage_intensivity_routeOfAdministrationId_key" ON "Dosage" ("intensivity", "routeOfAdministrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Effect_name_key" ON "Effect" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Effect_slug_key" ON "Effect" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_EffectToPhase_AB_unique" ON "_EffectToPhase" ("A", "B");

-- CreateIndex
CREATE INDEX "_EffectToPhase_B_index" ON "_EffectToPhase" ("B");

insert into main.Substance (id, name, common_names, brand_names, substitutive_name, systematic_name, unii, cas_number,
                            inchi_key, iupac, smiles, psychoactive_class, chemical_class, description)
values ('clvdzrfzj0000f2ftr6cm3fjr', '1,3-dimethylbutylamine', '', null, null, null, null, null, null, null, null,
        'Stimulants', 'Amine', null),
       ('clvdzrfzp0001f2ftmaj6vcgx', '1,4-Butanediol',
        '1,4-Butanediol,1,4-B,BD,BDO,One Comma Four,One Four Bee,Butylene Glycol,One Four B-D-O', null, null, null,
        null, null, null, null, null, 'Depressant', 'Alkanediol,Diol', null),
       ('clvdzrfzu0002f2ftvfqsazl7', '1P-ETH-LAD', '1P-ETH-LAD,1-Propionyl-6-ethyl-6-nor-lysergic acid diethyamide',
        null, null, null, null, null, null, null, null, 'Psychedelic', 'Lysergamides', null),
       ('clvdzrg000003f2ftwlzzelog', '1P-LSD', '1P-LSD', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Lysergamides', null),
       ('clvdzrg050004f2ftht4o0t2p', '1V-LSD', '1V-LSD', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Lysergamides', null),
       ('clvdzrg0a0005f2ftvdlu01ng', '1cP-AL-LAD', '1cP-AL-LAD', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrg0f0006f2ftcn5ocy4p', '1cP-LSD', '1cP-LSD', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrg0k0007f2ftgq69ufsq', '1cP-MiPLA', '1cP-MiPLA', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrg0q0008f2ftrsa4ipae', '2,5-DMA', '2,5-DMA,DOH', null, null, null, null, null, null, null, null,
        'Psychedelic,Stimulants', 'Amphetamine', null),
       ('clvdzrg0v0009f2ft1vmtmoil', '2-Aminoindane', '2-AI', null, null, null, null, null, null, null, null,
        'Stimulants', 'Aminoindane', null),
       ('clvdzrg10000af2fthjzfqejh', '2-FA', '2-FA', null, null, null, null, null, null, null, null, 'Stimulants',
        'Substituted amphetamines', null),
       ('clvdzrg15000bf2ft1chxtzox', '2-FEA', '2-FEA', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Substituted amphetamines', null),
       ('clvdzrg1a000cf2ft7zdx2bk4', '2-FMA', '2-FMA', null, null, null, null, null, null, null, null, 'Stimulants',
        'Amphetamine,Substituted amphetamines', null),
       ('clvdzrg1f000df2ft1hcshmwc', '2-Fluorodeschloroketamine', '2-Fluoroketamine,Fluoroketamine,2-FK,2-FDCK', null,
        null, null, null, null, null, null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrg1k000ef2ft623rh0qb', '2-Methyl-AP-237', '2-Methyl-AP-237,Apex,2-MAP', null, null, null, null, null,
        null, null, null, '', '', null),
       ('clvdzrg1o000ff2ftmwm3jttw', '25B-NBOH', '25B-NBOH', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg1t000gf2ftevwuaep7', '25B-NBOMe', '25B-NBOMe', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg1y000hf2ftwfun5j11', '25C-NBOH', '25C-NBOH', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg23000if2ftk0hbmhms', '25C-NBOMe', '25C-NBOMe,Cimbi-82,NBOMe-2C-C,2C-C-NBOMe', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg28000jf2ftt7g9up4s', '25D-NBOMe', '25D-NBOMe', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg2d000kf2ftyjechkbc', '25E-NBOH', '', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted phenethylamines', null),
       ('clvdzrg2i000lf2ftrwnmz3a3', '25I-NBOH', '25i-NBOH,Cimbi-27', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg2r000mf2ftyb7gvcaq', '25I-NBOMe', '25i-NBOMe,25i,Cimbi-5', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg2y000nf2ft5pk4k8jm', '25N-NBOMe', '25N-NBOMe', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg35000of2ftplp0kw5o', '25x-NBOH', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrg3b000pf2ftgzjkybjb', '25x-NBOMe', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrg3k000qf2ftqp5mcxos', '2C-B', '2C-B,Nexus,Bees', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg3s000rf2ftp5up9yfc', '2C-B-FLY', '2C-B-FLY', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines,Substituted benzofurans', null),
       ('clvdzrg3y000sf2ft75ax0gvq', '2C-C', '2C-C', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted phenethylamines', null),
       ('clvdzrg43000tf2ft2o8jz8sn', '2C-D', '2C-D,2C-M,LE-25', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg4b000uf2ftbptllu8g', '2C-E', '2C-E,Eternity', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg4i000vf2fthuwm53ab', '2C-H', '2C-H,DMPEA', null, null, null, null, null, null, null, null,
        'Psychedelic,Stimulants', 'Substituted phenethylamines', null),
       ('clvdzrg4q000wf2ft4wibknja', '2C-I', '2C-I', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted phenethylamines', null),
       ('clvdzrg4y000xf2ftc2v6kd34', '2C-P', '2C-P', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted phenethylamines', null),
       ('clvdzrg56000yf2ftm6usojnj', '2C-T', '2C-T,Tesseract', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg5c000zf2fty1zoga8b', '2C-T-2', '2C-T-2,Rosy', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg5i0010f2ftgivv8pbq', '2C-T-21', '2C-T-21,Aurora', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg5p0011f2fty3r1ohx6', '2C-T-7', '2C-T-7,Beautiful,Blue Mystic,7th Heaven', null, null, null, null, null,
        null, null, null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrg5w0012f2ftgushvlad', '2C-T-x', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrg620013f2ftc5guwr1h', '2C-x', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrg660014f2ft473hrv68', '2M2B', '2M2B,2-methyl-2-butanol', null, null, null, null, null, null, null, null,
        'Depressant', 'Alcohol', null),
       ('clvdzrg6f0015f2ftav4kouuc', '3,4-CTMP', '3,4-CTMP', null, null, null, null, null, null, null, null,
        'Stimulants', 'Substituted phenidates', null),
       ('clvdzrg6n0016f2ftqxhl2gk0', '3-Cl-PCP', '', null, null, null, null, null, null, null, null, 'Dissociatives',
        'Arylcyclohexylamines', null),
       ('clvdzrg6u0017f2ft5kiapln2', '3-FA', '3-FA,PAL-353', null, null, null, null, null, null, null, null,
        'Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrg720018f2fthyp5v44a', '3-FEA', '3-FEA', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrg7a0019f2ftzx3m9qgl', '3-FMA', '3-FMA', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrg7g001af2ftk4c4vppn', '3-FPM', '3-FPM,PAL-593', null, null, null, null, null, null, null, null,
        'Stimulants', 'Substituted amphetamines,Phenylmorpholine', null),
       ('clvdzrg7o001bf2ftkxxpbhts', '3-HO-PCE', '3-HO-PCE,Hydroxyeticyclidine', null, null, null, null, null, null,
        null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrg7w001cf2ftzm5kthj6', '3-HO-PCP', '3-HO-PCP,Hydroxyphencyclidine', null, null, null, null, null, null,
        null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrg82001df2ft7taa9wzf', '3-MMC', '3-MMC,Metaphedrone', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Cathinone', null),
       ('clvdzrg88001ef2ft6rwkjcn0', '3-MeO-PCE', '3-MeO-PCE,Methoxyeticyclidine', null, null, null, null, null, null,
        null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrg8f001ff2ftlyej02rb', '3-MeO-PCMo', '', null, null, null, null, null, null, null, null, 'Dissociatives',
        'Arylcyclohexylamines', null),
       ('clvdzrg8n001gf2ft2lkub5gf', '3-MeO-PCP', '3-MeO-PCP,3-MeO', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrg8s001hf2ft78ds2wxf', '3C-E', '3C-E,3C-Escaline', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted amphetamines', null),
       ('clvdzrg8z001if2ftwwmj5dux', '3C-P', '', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted amphetamines', null),
       ('clvdzrg97001jf2ft64037lh8', '4-AcO-DET', '4-AcO-DET,4-Acetoxy-DET,Ethacetin', null, null, null, null, null,
        null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrg9e001kf2ftfu1axzd8', '4-AcO-DMT',
        '4-AcO-DMT,4-Acetoxy-DMT,Psilacetin,O-Acetylpsilocin,Synthetic mushrooms', null, null, null, null, null, null,
        null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrg9k001lf2fthnoop4k5', '4-AcO-DiPT', '4-AcO-DiPT,4-Acetoxy-DiPT,Ipracetin,Aces', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrg9t001mf2ft15hc5enw', '4-AcO-MET', '4-AcO-MET,4-Acetoxy-MET,Metacetin,O-Acetylmetocin', null, null, null,
        null, null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrga0001nf2ftzayurz69', '4-AcO-MiPT', '4-AcO-MiPT,Mipracetin,O-Acetylmiprocin', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrga7001of2fte3ownzqn', '4-FA', '4-FA,4-FMP,PAL-303,Flux', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Substituted amphetamines', null),
       ('clvdzrgah001pf2ftj51yufef', '4-FMA', '4-FMA', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Substituted amphetamines', null),
       ('clvdzrgap001qf2ftlku8m4fu', '4-HO-DET', '4-HO-DET,Ethocin,CZ-74', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgaw001rf2ftx3xy2enr', '4-HO-DPT', '4-HO-DPT,Procin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgb2001sf2fteo6kq2n4', '4-HO-DiPT', '4-HO-DiPT,Iprocin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgbb001tf2ftj2qjcn5m', '4-HO-EPT', '4-HO-EPT,Eprocin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgbj001uf2ft9itm75s0', '4-HO-MET', '4-HO-MET,Metocin,Methylcybin,Colour', null, null, null, null, null,
        null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgbr001vf2ftvo7nl64x', '4-HO-MPT', '4-HO-MPT,Meprocin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgbz001wf2ftxsm8rw2n', '4-HO-MiPT', '4-HO-MiPT,Miprocin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgc6001xf2ftxn6q2nkf', '4-MeO-PCP', '4-MeO-PCP,Methoxydine', null, null, null, null, null, null, null,
        null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrgcd001yf2ft4s7uxrp6', '4F-EPH', '4F-EPH,4FEPH', null, null, null, null, null, null, null, null,
        'Stimulants', 'Substituted phenidates', null),
       ('clvdzrgcl001zf2ftimb7y3a9', '4F-MPH', '4F-MPH', null, null, null, null, null, null, null, null, 'Stimulants',
        'Substituted phenidates', null),
       ('clvdzrgct0020f2ft2dknzmv0', '5-APB', '5-APB', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Substituted amphetamines,Substituted benzofurans', null),
       ('clvdzrgd10021f2ftbxglwqrg', '5-Hydroxytryptophan',
        '5-HTP,Oxitriptan,Cincofarm,Levothym,Levotonine,Oxyfan,Telesol,Tript-OH,Triptum', null, null, null, null, null,
        null, null, null, 'Nootropic', 'Substituted tryptamines,Amino acid', null),
       ('clvdzrgd70022f2ft93j9jz7u', '5-MAPB', '5-MAPB', null, null, null, null, null, null, null, null, 'Entactogen',
        'Substituted amphetamines,Substituted benzofurans', null),
       ('clvdzrgde0023f2fthkba4xl4', '5-MeO-DALT', '5-MeO-DALT,Foxtrot', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgdm0024f2ftirdnntqj', '5-MeO-DMT', '5-MeO-DMT,The God Molecule,Toad,Jaguar', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgdr0025f2ftdiysyp6s', '5-MeO-DiBF', '5-MeO-DiBF', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted benzofurans', null),
       ('clvdzrgdz0026f2ftldf665vf', '5-MeO-DiPT', '5-MeO-DiPT,Foxy Methoxy,Foxy', null, null, null, null, null, null,
        null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrge70027f2ftvoo4sp2m', '5-MeO-MiPT', '5-MeO-MiPT,Moxy', null, null, null, null, null, null, null, null,
        'Psychedelic,Entactogen', 'Substituted tryptamines', null),
       ('clvdzrgef0028f2ft73mz5emi', '5F-AKB48', '5F-AKB48,5F-APINACA', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Indazolecarboxamide,Adamantanes', null),
       ('clvdzrges0029f2ft48cg4fri', '5F-PB-22', '', null, null, null, null, null, null, null, null, 'Cannabinoid',
        'Indolecarboxylate', null),
       ('clvdzrgf2002af2ftb4rflhpr', '6-APB', '6-APB,Benzofury', null, null, null, null, null, null, null, null,
        'Psychedelic,Entactogen', 'Substituted amphetamines,Substituted benzofurans', null),
       ('clvdzrgf8002bf2ft6q2bhut8', '6-APDB', '6-APDB', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'Substituted amphetamines,Substituted phenethylamines,Substituted benzofurans', null),
       ('clvdzrgfh002cf2ftyq8yvqbj', '8-Chlorotheophylline', '', null, null, null, null, null, null, null, null,
        'Stimulants', 'Xanthines', null),
       ('clvdzrgfr002df2ftddx6a7g5', 'A-PHP', 'α-PHP,alpha-PHP,PV7', null, null, null, null, null, null, null, null,
        'Stimulants', 'Cathinone,Substituted cathinones,Substituted pyrrolidines', null),
       ('clvdzrgfz002ef2ftsctuuh91', 'A-PVP',
        'α-PVP,alpha-PVP,Flakka,Flak,O-2387,β-ketone-prolintane,Prolintanone,Gravel', null, null, null, null, null,
        null, null, null, 'Stimulants', 'Cathinone,Substituted cathinones,Substituted pyrrolidines', null),
       ('clvdzrgg8002ff2ftjvba87qz', 'AB-FUBINACA', 'Ab-fubi', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Indazolecarboxamide', null),
       ('clvdzrggh002gf2ftgllu9l82', 'AL-LAD', 'AL-LAD,Aladdin', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrggo002hf2fth51pfdkb', 'ALD-52', 'ALD-52,1-Acetyl-LSD,1A-LSD,1A-LAD,Orange Sunshine', null, null, null,
        null, null, null, null, null, 'Psychedelic', 'Lysergamides', null),
       ('clvdzrggw002if2ftntieijtc', 'APICA', 'APICA,SDB-001,2NE1', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Indolecarboxamide,Indole cannabinoid', null),
       ('clvdzrgh4002jf2ftinse7b1b', 'Acetylfentanyl', 'Acetylfentanyl', null, null, null, null, null, null, null, null,
        'Opioids', 'Anilidopiperidine', null),
       ('clvdzrghb002kf2ft1c3562ra', 'Adrafinil', 'Adrafinil,Olmifon', null, null, null, null, null, null, null, null,
        'Nootropic', '', null),
       ('clvdzrghh002lf2ftnhbu51at', 'Alcohol', 'Alcohol,Booze,Liquor,Moonshine,Sauce,Juice,Bevvy', null, null, null,
        null, null, null, null, null, 'Depressant', 'Alcohol', null),
       ('clvdzrghp002mf2ftqnpknnh2', 'Allylescaline', 'Allylescaline,AL', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrghv002nf2ftasdxzogg', 'Alpha-GPC', 'Alpha-GPC,Choline Alfoscerate,L-Alpha Glycerylphosphorylcholine',
        null, null, null, null, null, null, null, null, 'Nootropic', 'Choline derivative', null),
       ('clvdzrgi2002of2ftptx3ffg3', 'Alprazolam', 'Xanax,Alprazolam,Ksalol', null, null, null, null, null, null, null,
        null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrgia002pf2ftzn5hmsvl', 'Amanita muscaria', 'Fly agaric,Fly amanita', null, null, null, null, null, null,
        null, null, '', '', null),
       ('clvdzrgij002qf2ft8vysmr6v', 'Amphetamine', 'Amphetamine,Speed,Adderall,Pep', null, null, null, null, null,
        null, null, null, 'Stimulants', 'Substituted phenethylamines', null),
       ('clvdzrgiq002rf2ftqk1jqisu', 'Amphetamine (disambiguation)', '', null, null, null, null, null, null, null, null,
        '', '', null),
       ('clvdzrgix002sf2fteoqkmfv4', 'Anadenanthera peregrina', 'Yopo,Jopo,Cohoba', null, null, null, null, null, null,
        null, null, '', '', null),
       ('clvdzrgj4002tf2ftwy679wq4', 'Aniracetam', 'Aniracetam', null, null, null, null, null, null, null, null,
        'Nootropic', 'Racetams', null),
       ('clvdzrgj9002uf2ftmlvmi0fc', 'Antidepressants', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrgjg002vf2ft1w8yglqh', 'Antihistamine', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgjp002wf2ftu10uvklb', 'Antipsychotic', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgjx002xf2ftz4723syt', 'Armodafinil', 'Armodafinil,Nuvigil,Waklert,Artvigil,R-Modawake,Neoresotyl', null,
        null, null, null, null, null, null, null, 'Eugeroics', 'Benzhydryl', null),
       ('clvdzrgk3002yf2ft5d4serf7', 'Arylcyclohexylamines', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrgk8002zf2ftpe6j5mdj', 'Atropa belladonna', 'Belladonna,Deadly nightshade', null, null, null, null, null,
        null, null, null, 'Deliriant', 'Substituted tropanes', null),
       ('clvdzrgkg0030f2ft71yujkcc', 'Ayahuasca', 'Ayahuasca,Aya,Caapi,Cipó,Hoasca,Vegetal,Yagé,Yajé,Natem,Shori', null,
        null, null, null, null, null, null, null, 'Psychedelic', '', null),
       ('clvdzrgko0031f2fthw4in0r8', 'Baclofen', 'Baclofen,Lioresal', null, null, null, null, null, null, null, null,
        'Depressant', 'Butyric acid,Gabapentinoids', null),
       ('clvdzrgku0032f2ftnentipgf', 'Banisteriopsis caapi', 'Ayahuasca,Caapi,Yagé', null, null, null, null, null, null,
        null, null, '', '', null),
       ('clvdzrgl20033f2ftffvdsiy2', 'Barbiturates', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgl90034f2ftkm7xkxg5', 'Benzodiazepines', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrglf0035f2ft2ds3fq2a', 'Benzydamine', 'Benzydamine,Tantum Verde', null, null, null, null, null, null,
        null, null, 'Deliriant,Stimulants', 'Indazole', null),
       ('clvdzrgll0036f2ft4vpmohl7', 'Bromantane', 'Bromantane,Bromantan,Ladasten', null, null, null, null, null, null,
        null, null, 'Stimulants,Nootropic', 'Adamantanes', null),
       ('clvdzrglr0037f2ft1ksjfilb', 'Bromazepam',
        'Bromazepam,Brozam,Lectopam,Lexomil,Lexotan,Lexilium,Lexaurin,Brazepam,Rekotnil,Bromaze,Somalium,Lexatin,Calmepam,Zepam,Lexotanil',
        null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrglx0038f2ftpnb9idix', 'Bromazolam', '', null, null, null, null, null, null, null, null, 'Depressant', '',
        null),
       ('clvdzrgm40039f2ft28xe3nea', 'Bromo-DragonFLY', 'Bromo-DragonFLY,DOB-DragonFLY,B-DFLY,Dragonfly', null, null,
        null, null, null, null, null, null, 'Psychedelic', 'Substituted amphetamines,Substituted benzofurans', null),
       ('clvdzrgmb003af2ft7n1yqi2v', 'Bufotenin', 'Bufotenin,5-HO-DMT', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgmi003bf2ftav6ara6z', 'Buprenorphine', 'Buprenex,Subutex,Butrans,Cizdol,Addnok,Transtec', null, null,
        null, null, null, null, null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrgmp003cf2ftvdgbvb20', 'Buspirone', '', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted tryptamines', null),
       ('clvdzrgmw003df2ft210zf2um', 'Butylone', 'Butylone,bk-MBDB,B1', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'MDxx,Cathinone,Substituted cathinones', null),
       ('clvdzrgn6003ef2ftau8csdb0', 'Caffeine', 'Caffeine', null, null, null, null, null, null, null, null,
        'Stimulants', 'Xanthines', null),
       ('clvdzrgnc003ff2ftp4woe8fc', 'Cake', 'Cake,Caky,Cokoo', null, null, null, null, null, null, null, null,
        'Depressant', '', null),
       ('clvdzrgnk003gf2ft9r1a2vrg', 'CanKet', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgnp003hf2ft3q5vrm6n', 'Cannabidiol', 'Cannabidiol,CBD,Epidiolex', null, null, null, null, null, null,
        null, null, 'Cannabinoid', 'Cannabinoid', null),
       ('clvdzrgnx003if2ftfnk9a3kf', 'Cannabinoid', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgo3003jf2ftnkkag4if', 'Cannabis', 'Cannabis,Marijuana,Weed,Pot,Mary Jane,Grass,Herb,Green,Bud,Tree',
        null, null, null, null, null, null, null, null, '', 'Cannabinoid', null),
       ('clvdzrgo8003kf2ft7a72hgdx', 'Carisoprodol', 'Carisoprodol,Soma', null, null, null, null, null, null, null,
        null, 'Depressant', 'Carbamate', null),
       ('clvdzrgoi003lf2ftcaskmwz6', 'Changa', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgor003mf2ft3l0bbc21', 'Chlordiazepoxide', 'Librium', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrgoy003nf2fty19335n2', 'Choline bitartrate', 'Choline', null, null, null, null, null, null, null, null,
        'Nootropic', 'Ammonium salt', null),
       ('clvdzrgp4003of2ftdakxprjn', 'Cinolazepam', 'Cinolazepam,Gerodorm', null, null, null, null, null, null, null,
        null, '', 'Benzodiazepines', null),
       ('clvdzrgpd003pf2ftlqieo85z', 'Citicoline', 'Citicoline', null, null, null, null, null, null, null, null,
        'Nootropic', 'Ammonium salt', null),
       ('clvdzrgpn003qf2ftykhthcvp', 'Classical psychedelics', '', null, null, null, null, null, null, null, null, '',
        '', null),
       ('clvdzrgpt003rf2ft09t4rimc', 'Clonazepam', 'Clonazepam,Klonopin,K-Pins,Rivotril', null, null, null, null, null,
        null, null, null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrgq0003sf2ftvpwgskba', 'Clonazolam', 'Clonazolam,Clonitrazolam', null, null, null, null, null, null, null,
        null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrgq8003tf2fto982y24c', 'Clonidine', 'Catapres,Catapres-TTS,Kapvay,Nexiclon XR', null, null, null, null,
        null, null, null, null, 'Depressant', 'Imidazoline', null),
       ('clvdzrgqd003uf2ft24mu6pbs', 'Cocaine', 'Cocaine,Coke,Coca,Crack,Blow,Girl,White,Snow,Nose Candy,Chari', null,
        null, null, null, null, null, null, null, 'Stimulants', 'Substituted tropanes', null),
       ('clvdzrgqi003vf2ftwn9efscs', 'Cocoa', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgqp003wf2ft9ukzm18d', 'Codeine', 'Codeine,Lean,Purple Drank,Syrup', null, null, null, null, null, null,
        null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrgqx003xf2ftnb09j7xt', 'Coluracetam', 'Coluracetam', null, null, null, null, null, null, null, null,
        'Nootropic', 'Racetams', null),
       ('clvdzrgr2003yf2ftddwe6zzc', 'Creatine', 'Creatine,N-Carbamimidoyl-N-methylglycine,Methylguanidoacetic acid',
        null, null, null, null, null, null, null, null, 'Nootropic', 'Nitrogenous organic acid', null),
       ('clvdzrgr7003zf2ft6lto19xl', 'Cyclazodone', 'Cyclazodone', null, null, null, null, null, null, null, null,
        'Stimulants', 'Substituted aminorexes,4-oxazolidinone', null),
       ('clvdzrgrf0040f2ftk19l87k4', 'DET', 'Diethyltryptamine,DET', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgrr0041f2ftuy7z29d9', 'DMT', 'DMT,N,N-DMT,Dmitry,The Glory,The Spirit Molecule', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgrz0042f2ft96oanqye', 'DOB', 'DOB,Brolamfetamine,Bromo-DMA', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted amphetamines', null),
       ('clvdzrgs50043f2ftv6rifuvo', 'DOC', 'DOC', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted amphetamines', null),
       ('clvdzrgsd0044f2ftvx01wik5', 'DOI', 'DOI', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted amphetamines', null),
       ('clvdzrgsi0045f2fto64h62u7', 'DOM', 'DOM,STP (Serenity, Tranquility, and Peace)', null, null, null, null, null,
        null, null, null, 'Psychedelic', 'Substituted amphetamines', null),
       ('clvdzrgsn0046f2ft2g58z45j', 'DOx', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgsv0047f2ftcfkcwk8u', 'DPT', 'DPT,Dipropyltryptamine,The Light', null, null, null, null, null, null,
        null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrgt20048f2ftz75ywha4', 'Datura', 'Datura,Jimson Weed', null, null, null, null, null, null, null, null,
        'Deliriant', '', null),
       ('clvdzrgt90049f2fteuhazmq2', 'Datura (botany)', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrgtf004af2ft9imw3hxd', 'Deschloroetizolam', 'Deschloroetizolam', null, null, null, null, null, null, null,
        null, 'Depressant', 'Thienodiazepines', null),
       ('clvdzrgto004bf2ftyxv0p8dd', 'Deschloroketamine', 'Deschloroketamine,DCK,DXE,O-PCM', null, null, null, null,
        null, null, null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrgtw004cf2ftgcn74j82', 'Desomorphine', 'Desomorphine,Krokodil,Krok', null, null, null, null, null, null,
        null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrgu6004df2ft2p73o989', 'Desoxypipradrol', 'Desoxypipradol,2-DPMP,Ivory Wave', null, null, null, null,
        null, null, null, null, 'Stimulants', 'Substituted piperidines', null),
       ('clvdzrgue004ef2ftkonuld28', 'Dextromethorphan', 'DXM,DMO,DM,Dex,Robitussin,Delsym,DexAlone,Duract', null, null,
        null, null, null, null, null, null, 'Dissociatives', 'Substituted morphinans', null),
       ('clvdzrgul004ff2ft2uqkxsp4', 'Dextropropoxyphene', 'Dextropropoxyphene,Propoxyphene,Darvon', null, null, null,
        null, null, null, null, null, 'Opioids', 'Phenylpropylamine', null),
       ('clvdzrgur004gf2ft9iux0u94', 'DiPT', 'DiPT', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted tryptamines', null),
       ('clvdzrgv0004hf2ft9xmfhlvd', 'Diarylethylamines', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrgv8004if2ft4mq2ovct', 'Diazepam', 'Valium,Diastat,Mother''s Little Helper,Apaurin', null, null, null,
        null, null, null, null, null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrgvf004jf2ftv5astnw8', 'Dichloropane', 'Dichloropane,RTI-111', null, null, null, null, null, null, null,
        null, 'Stimulants', 'Substituted tropanes', null),
       ('clvdzrgvn004kf2ftf2wijdye', 'Diclazepam', 'Diclazepam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrgvu004lf2fttyu0d6pu', 'Dihydrocodeine', 'Dihydrocodeine', null, null, null, null, null, null, null, null,
        'Opioids', 'Substituted morphinans', null),
       ('clvdzrgw0004mf2ft10zta5wi', 'Diphenhydramine', 'DPH,Benadryl,Nytol,Sominex,Unisom SleepMelts,ZzzQuil', null,
        null, null, null, null, null, null, null, 'Deliriant,Depressant', 'Ethanolamine#1#', null),
       ('clvdzrgw8004nf2ft9gbtevdj', 'Diphenidine', 'Diphenidine', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Diarylethylamines', null),
       ('clvdzrgwh004of2fthisdetfp', 'Dissociatives', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgwo004pf2ftrks2bykc', 'EPT', 'EPT', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted tryptamines', null),
       ('clvdzrgwv004qf2ftpi0811rw', 'ETH-CAT', 'ETH-CAT,Ethcathinone,Ethylpropion', null, null, null, null, null, null,
        null, null, 'Stimulants', 'Cathinone', null),
       ('clvdzrgx3004rf2ftwxkbkch1', 'ETH-LAD', 'ETH-LAD', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrgxb004sf2fttmah3uzy', 'Efavirenz', 'Efavirenz,Sustiva', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Benzoxazine', null),
       ('clvdzrgxi004tf2ft1n7bgzfm', 'Entactogen', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgxq004uf2ft5m8v7ikp', 'Entheogen', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrgxy004vf2ft8k30n9b6', 'Ephedrine', 'Ephedrine,Ephedra', null, null, null, null, null, null, null, null,
        'Stimulants', 'Amphetamine', null),
       ('clvdzrgy5004wf2ftta9gzpxs', 'Ephenidine', 'Ephenidine,NEDPA', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Diarylethylamines', null),
       ('clvdzrgyd004xf2ftvbrld4wn', 'Ephylone', 'Ephylone,bk-EBDP,βk-EBDP,bk-ethyl-K', null, null, null, null, null,
        null, null, null, 'Entactogen,Stimulants', 'Cathinone', null),
       ('clvdzrgyk004yf2ftal2s685p', 'Escaline', 'Escaline', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrgys004zf2ft7l4wk6fu', 'Eszopiclone', 'Lunesta,Eszop', null, null, null, null, null, null, null, null,
        'Hallucinogens,Depressant,Hypnotic', 'Cyclopyrrolone', null),
       ('clvdzrgz40050f2ftmlv8yrwr', 'Ethylmorphine', 'Ethylmorphine,Codethyline,Dionine', null, null, null, null, null,
        null, null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrgzb0051f2ftixmdp46r', 'Ethylone', 'Ethylone,bk-MDEA,MDEC', null, null, null, null, null, null, null,
        null, 'Stimulants', '', null),
       ('clvdzrgzg0052f2ftw2xurjp6', 'Ethylphenidate', 'Ethylphenidate,EPH', null, null, null, null, null, null, null,
        null, 'Stimulants', 'Substituted phenidates', null),
       ('clvdzrgzm0053f2ftncmztduz', 'Etizolam', 'Etizolam,Etilaam,Etizest', null, null, null, null, null, null, null,
        null, 'Depressant', 'Thienodiazepines', null),
       ('clvdzrgzt0054f2ftbz9654b0', 'Etomidate', '', null, null, null, null, null, null, null, null, 'Depressant',
        'Cathinone', null),
       ('clvdzrh000055f2fttjae5rb2', 'Eugeroics', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh050056f2ftoxfcugfx', 'Experience:"DPH (700mg, Oral) - Arachnophobia Awakened',
        'DPH,Benadryl,Nytol,Sominex,Unisom SleepMelts,ZzzQuil', null, null, null, null, null, null, null, null,
        'Deliriant,Depressant', 'Ethanolamine#1#', null),
       ('clvdzrh0b0057f2ft2lsaagjk', 'F-Phenibut', 'F-Phenibut,Fluorophenibut,Fluorobut', null, null, null, null, null,
        null, null, null, 'Depressant', 'Gabapentinoids', null),
       ('clvdzrh0i0058f2ft83qkgbdp', 'Fentanyl',
        'Fentanyl,fentanil,Sublimaze,Actiq,Durogesic,Duragesic,Fentora,Matrifen,Haldid,Onsolis,Instanyl,Abstral,Lazanda',
        null, null, null, null, null, null, null, null, 'Opioids', 'Anilidopiperidine,Substituted piperidines', null),
       ('clvdzrh0p0059f2ft09jed5rr', 'Flualprazolam', 'Flualprazolam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrh0w005af2fth7zyflki', 'Flubromazepam', 'Flubromazepam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrh14005bf2ft25tue1z6', 'Flubromazolam', 'Flubromazolam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrh1d005cf2ftomh15wca', 'Flunitrazepam',
        'Rohypnol,Flunitrazepam,Roofies,Roches,Ruffies,Circles,Forget Pill,Forget Me Pill,La Rocha,Mexican Valium,R2,Roach 2,Rophies,Wolfies',
        null, null, null, null, null, null, null, null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrh1k005df2ftoabjgr97', 'Flunitrazolam', 'Flunitrazolam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrh1p005ef2ft1qa9mvxe', 'GBL', 'GBL,gamma-Butyrolactone', null, null, null, null, null, null, null, null,
        'Depressant', 'Lactone', null),
       ('clvdzrh1y005ff2ftowg1ooq4', 'GHB', 'GHB,G,Xyrem,Sodium oxybate', null, null, null, null, null, null, null,
        null, 'Depressant', 'Butyric acid', null),
       ('clvdzrh27005gf2ftvplwn0ki', 'Gabapentin', 'Gabapentin,Neurontin,Gabarone,Gralise', null, null, null, null,
        null, null, null, null, 'Depressant', 'Gabapentinoids', null),
       ('clvdzrh2e005hf2ftyoqir1z6', 'Gabapentinoids', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrh2m005if2ftr0i6rbco', 'Gaboxadol', '', null, null, null, null, null, null, null, null,
        'Hallucinogens,Depressant', 'Tetrahydroisoxazole,Tetrahydroisoxazolopyridine', null),
       ('clvdzrh2u005jf2ft7h73i5mw', 'Galantamine', 'Galantamine', null, null, null, null, null, null, null, null,
        'Oneirogen,Nootropic', 'Benzazepine', null),
       ('clvdzrh30005kf2ftwhk203py', 'HXE', 'HXE', null, null, null, null, null, null, null, null, 'Dissociatives',
        'Arylcyclohexylamines', null),
       ('clvdzrh38005lf2ftxfz0nln7', 'Hallucinogens', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh3h005mf2ftf4tyfqmn', 'Haloperidol', 'Haldol', null, null, null, null, null, null, null, null,
        'Antipsychotic', 'Substituted piperidines,Butyrophenone', null),
       ('clvdzrh3o005nf2ftmayadcv9', 'Harmala alkaloid', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrh3w005of2ftj9qpvtfv', 'Heroin', 'Heroin,H,Smack,Junk,Brown', null, null, null, null, null, null, null,
        null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrh44005pf2ftk75luxa5', 'Hexedrone', 'Hexedrone', null, null, null, null, null, null, null, null,
        'Stimulants', 'Cathinone', null),
       ('clvdzrh4a005qf2ft865xkd30', 'Hydrocodone', 'Vicodin (with paracetamol),Zohydro ER (extended-release)', null,
        null, null, null, null, null, null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrh4f005rf2fte90935vx', 'Hydromorphone', 'Dilaudid,Jurnista,Palladone', null, null, null, null, null, null,
        null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrh4m005sf2ftii1zurrw', 'Hyoscyamus niger (botany)', '', null, null, null, null, null, null, null, null,
        '', '', null),
       ('clvdzrh4v005tf2fteyg6op0x', 'Hypnotic', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh52005uf2ft610k6loi', 'Ibogaine', 'Ibogaine,Endabuse,Iboga', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrh5b005vf2ft88nyb7zo', 'Inhalants', '', null, null, null, null, null, null, null, null, 'Dissociatives',
        'Inorganic molecule', null),
       ('clvdzrh5j005wf2ft7o79xgri', 'Isopropylphenidate', 'Isopropylphenidate,IPH,IPPH', null, null, null, null, null,
        null, null, null, 'Stimulants', 'Substituted phenidates', null),
       ('clvdzrh5p005xf2ft1ph4tei8', 'JWH-018', '', null, null, null, null, null, null, null, null, 'Cannabinoid',
        'Naphthoylindole', null),
       ('clvdzrh60005yf2ftstyjy6me', 'JWH-073', 'JWH-073,Spice', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Naphthoylindole', null),
       ('clvdzrh67005zf2ft784pm7kw', 'Kava', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh6g0060f2ften0wdr2n', 'Ketamine',
        'Ketamine,K,Ket,Kitty,Special K,Cat Tranquilizer,Ketaset,Ketalar,Ketanest,Vitamin K,Purple,Jet', null, null,
        null, null, null, null, null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrh6n0061f2ft6kcx0pmc', 'Kratom', 'Mitragyna Speciosa,กระท่อม (Thai),Ketum,Kratom,Kratum', null, null,
        null, null, null, null, null, null, 'Stimulants,Opioids', 'Indole alkaloids', null),
       ('clvdzrh6w0062f2ft8e4j5m1j', 'LAE-32', '', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Lysergamides', null),
       ('clvdzrh740063f2ft5cy9w5xt', 'LSA', 'LSA,Ergine', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Lysergamides', null),
       ('clvdzrh7c0064f2ft309mp2z8', 'LSD', 'LSD,LSD-25,Lucy,L,Acid,Cid,Tabs,Blotter', null, null, null, null, null,
        null, null, null, 'Psychedelic', 'Lysergamides', null),
       ('clvdzrh7k0065f2ft232wn50k', 'LSM-775', 'LSM-775', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrh7u0066f2ft3zo14na5', 'LSZ', 'LSZ,LA-SS-Az,Diazedine,Lambda', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Lysergamides', null),
       ('clvdzrh810067f2fthuhf2fi8', 'Lisdexamfetamine', 'Lisdexamfetamine,Vyvanse,Elvanse', null, null, null, null,
        null, null, null, null, 'Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrh890068f2ft1xl1qdq4', 'List of prodrugs', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrh8h0069f2ftonv31oho', 'Lorazepam', 'Lorazepam,Ativan,Orfidal,Lorsilan', null, null, null, null, null,
        null, null, null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrh8p006af2ftg0slq7wg', 'Lysergamides', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh90006bf2ftnvyfbaug', 'MAOI', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrh99006cf2ft6efqwmmm', 'MCPP', 'mCPP', null, null, null, null, null, null, null, null, 'Stimulants',
        'Substituted piperazines', null),
       ('clvdzrh9f006df2ft2qpiovxp', 'MDA', 'MDA,Sass,Sally,Tenamfetamine', null, null, null, null, null, null, null,
        null, 'Psychedelic,Entactogen,Stimulants', 'Amphetamine', null),
       ('clvdzrh9p006ef2ft3mct4elu', 'MDAI', 'MDAI', null, null, null, null, null, null, null, null, 'Entactogen',
        'Aminoindane', null),
       ('clvdzrh9w006ff2ftuiz7bvzd', 'MDEA', 'MDEA,MDE,Eve', null, null, null, null, null, null, null, null,
        'Entactogen', 'Amphetamine,MDxx,Substituted amphetamines', null),
       ('clvdzrha3006gf2ftiuqjlajz', 'MDMA', 'MDMA,Molly,Mandy,Emma,MD,Ecstasy,E,X,XTC,Rolls,Beans,Pingers', null, null,
        null, null, null, null, null, null, 'Entactogen,Stimulants', 'Amphetamine,MDxx,Substituted amphetamines', null),
       ('clvdzrhab006hf2ft45pl84w3', 'MDPV', 'MDPV,Bath Salts,NRG-1', null, null, null, null, null, null, null, null,
        'Entactogen,Stimulants', 'MDxx,Substituted cathinones,Substituted pyrrolidines', null),
       ('clvdzrhai006if2ft1g9g6dt7', 'MET', 'MET,Methylethyltryptamine', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrhap006jf2ftu1kz25sf', 'MPT', 'MPT,Methylpropyltryptamine', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrhaw006kf2ft7gcx7qsz', 'MXiPr', 'MXiPR,MXiP', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhb3006lf2ftyo0pk123', 'Mandragora', 'Mandrake', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrhbb006mf2ftvbtqtsuz', 'Mandragora officinarum (botany)', '', null, null, null, null, null, null, null,
        null, '', '', null),
       ('clvdzrhbg006nf2fto9l6qsib', 'Mebroqualone', '', null, null, null, null, null, null, null, null, 'Depressant',
        'Quinazolinone', null),
       ('clvdzrhbl006of2ftdw8psw6z', 'Meclofenoxate', '', null, null, null, null, null, null, null, null, 'Nootropic',
        'Cholinergic', null),
       ('clvdzrhbr006pf2ftsx0s45q2', 'Melatonin', 'Melatonin', null, null, null, null, null, null, null, null,
        'Oneirogen', 'Substituted tryptamines', null),
       ('clvdzrhbz006qf2ft2uy0j2g0', 'Memantine',
        'Memantine,Memaxa,Ebixa,Namenda,Namenda XR,Namzaric (with donepezil,both extended-release)', null, null, null,
        null, null, null, null, null, 'Dissociatives,Deliriant', 'Adamantanes', null),
       ('clvdzrhc4006rf2ftf6k2550r', 'Mephedrone', 'Mephedrone,4-MMC,Drone,M-CAT,Meow Meow', null, null, null, null,
        null, null, null, null, 'Entactogen,Stimulants', 'Cathinone,Substituted cathinones', null),
       ('clvdzrhc9006sf2ftnxwrd6ee', 'Mescaline', 'Mescaline,Peyote,San Pedro,Cactus,Buttons', null, null, null, null,
        null, null, null, null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrhch006tf2ftqx5x1u6t', 'Methadone', 'Methadone,Dolophine,Methadose', null, null, null, null, null, null,
        null, null, 'Opioids', 'Diphenylpropylamine', null),
       ('clvdzrhcp006uf2ftqy4df167', 'Methallylescaline', 'Methallylescaline,MAL', null, null, null, null, null, null,
        null, null, 'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrhcw006vf2ftm59z5qo2', 'Methamphetamine',
        'Methamphetamine,Meth,Speed,Ice,Glass,Shard,Tina,Crank,Desoxyn,Crystal,Ma,T,Tweak,Shabu,Yaba', null, null, null,
        null, null, null, null, null, 'Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrhd2006wf2fta23x384o', 'Methaqualone',
        'Methaqualone,Quaaludes,Ludes,Mandrax,Sopor,Quack,Vitamin Q,Soaper', null, null, null, null, null, null, null,
        null, 'Depressant', 'Quinazolinone', null),
       ('clvdzrhd9006xf2ft6fifvb70', 'Methiopropamine', 'MPA', null, null, null, null, null, null, null, null,
        'Stimulants', 'Thiophene', null),
       ('clvdzrhdf006yf2ftocx8o4fd', 'Methoxetamine', 'Methoxetamine,MXE,Mexxy', null, null, null, null, null, null,
        null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhdk006zf2ft3rduopwe', 'Methoxphenidine', 'Methoxphenidine,Methoxyphenidine,MXP,2-MXP', null, null, null,
        null, null, null, null, null, 'Dissociatives', 'Diarylethylamines', null),
       ('clvdzrhdp0070f2ft9kir7no6', 'Methylnaphthidate', 'Methylnaphthidate,HDMP-28', null, null, null, null, null,
        null, null, null, 'Stimulants', 'Substituted phenidates', null),
       ('clvdzrhdy0071f2ft2q5y2lhf', 'Methylone', 'Methylone,bk-MDMA,M1,MDMC', null, null, null, null, null, null, null,
        null, 'Entactogen,Stimulants', 'Cathinone', null),
       ('clvdzrhe50072f2ftlvjrfdtg', 'Methylphenidate', 'Methylphenidate,Concerta,Methylin,Ritalin,Equasym XL', null,
        null, null, null, null, null, null, null, 'Stimulants', 'Substituted phenidates', null),
       ('clvdzrheb0073f2fta6ddgysy', 'Metizolam', 'Metizolam,Desmethyletizolam', null, null, null, null, null, null,
        null, null, 'Depressant', 'Thienodiazepines', null),
       ('clvdzrhej0074f2ftcs7hcu8h', 'Mexedrone', 'Mexedrone,4-MMC-MeO', null, null, null, null, null, null, null, null,
        'Stimulants', 'Cathinone', null),
       ('clvdzrher0075f2ftwc8zok39', 'MiPLA', 'MiPLA,Lamide', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrhf00076f2ft269pfzd2', 'MiPT', 'MiPT', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted tryptamines', null),
       ('clvdzrhf80077f2ft0dfxvntu', 'Midazolam', 'Midazolam,Versed', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrhff0078f2ft8wg6ibzo', 'Mirtazapine', 'Avanza,Axit,Mirtaz,Mirtazon,Remeron,Zispin', null, null, null,
        null, null, null, null, null, 'Deliriant,Depressant,Antidepressants', 'Piperazinoazepine', null),
       ('clvdzrhfl0079f2ft56epc29j', 'Modafinil', 'Modafinil,Alertec,Modavigil,Modiodal,Provigil,Modalert', null, null,
        null, null, null, null, null, null, 'Eugeroics', 'Benzhydryl', null),
       ('clvdzrhft007af2ftg9awkxp9', 'Morning glory', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhg1007bf2ftt8r3vo4o', 'Morphine', 'Morphine,MS-Contin,Oramorph,Zomorph,Sevredol,Duramorph', null, null,
        null, null, null, null, null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrhg8007cf2ft3jh7zyn3', 'Myristicin', 'Nutmeg', null, null, null, null, null, null, null, null,
        'Deliriant', 'Phenylpropenes', null),
       ('clvdzrhgc007df2ftlf9a51v7', 'N-(2C)-fentanyl', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrhgh007ef2ftt74wiemt', 'N-Acetylcysteine', 'N-Acetylcysteine', null, null, null, null, null, null, null,
        null, 'Nootropic', 'Cysteine', null),
       ('clvdzrhgn007ff2ftvth7f6o6', 'N-Ethylhexedrone', 'Hexen,Hex-en,NEH,Ethyl-Hexedrone', null, null, null, null,
        null, null, null, null, 'Stimulants', 'Cathinone', null),
       ('clvdzrhgx007gf2ft7h4vnhtd', 'N-Methylbisfluoromodafinil',
        'N-Methylbisfluoromodafinil,Dehydroxyfluorafinil,Modafiendz', null, null, null, null, null, null, null, null,
        'Nootropic', 'Benzhydryl', null),
       ('clvdzrhh2007hf2ft2kcdu4lm', 'NEP', 'N-Ethylpentedrone,NEP,Ethyl-Pentedrone', null, null, null, null, null,
        null, null, null, 'Stimulants', 'Cathinone', null),
       ('clvdzrhh7007if2ftluqn2up3', 'NM-2-AI', '', null, null, null, null, null, null, null, null, 'Stimulants',
        'Amphetamine,Aminoindane', null),
       ('clvdzrhhe007jf2ft5guhfga0', 'Naloxone', 'Naloxone,Narcan,Evzio', null, null, null, null, null, null, null,
        null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrhhl007kf2ftwenglz0l', 'Nicotine', 'Nicotine', null, null, null, null, null, null, null, null,
        'Stimulants', 'Pyridine,Substituted pyrrolidines', null),
       ('clvdzrhhq007lf2fttuccmz0l', 'Nifoxipam', 'Nifoxipam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrhhy007mf2ft5rvt9lq1', 'Nitazene', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhi9007nf2ftte4y4z1i', 'Nitromethaqualone', '', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrhih007of2ft1oz8k4rd', 'Nitrous', 'Nitrous Oxide,Laughing Gas,Nitrous,Hippy Crack,NOS,Nitro,N2O,Nangs',
        null, null, null, null, null, null, null, null, 'Dissociatives', '', null),
       ('clvdzrhin007pf2ft3yxn9odx', 'Nootropic', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhiw007qf2fty64ipyxi', 'O-Desmethyltramadol', 'O-Desmethyltramadol', null, null, null, null, null, null,
        null, null, 'Opioids', 'Phenylpropylamine', null),
       ('clvdzrhj3007rf2ftfli6cui5', 'O-PCE', 'O-PCE,Eticyclidone', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhja007sf2ftnry3houf', 'Omberacetam', 'Noopept,Ноопепт,GVS-111,Omberacetam', null, null, null, null, null,
        null, null, null, 'Nootropic', 'Peptide', null),
       ('clvdzrhji007tf2fteeg5lo8e', 'Opioids', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhjq007uf2fts8sgn3f3', 'Oroxylin A', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhjv007vf2ftpp23fj7l', 'Oxazepam', 'Oxazepam,Serax,Ceresta', null, null, null, null, null, null, null,
        null, '', '', null),
       ('clvdzrhk4007wf2ft3vpiudm3', 'Oxiracetam', 'Oxiracetam', null, null, null, null, null, null, null, null,
        'Stimulants,Nootropic', 'Racetams', null),
       ('clvdzrhkb007xf2ftsnvz0jl9', 'Oxycodone',
        'OxyContin,Oxy,Roxicodone,Oxecta,OxyIR,Endone,Oxynor,Codilek,Oxydor,Redocam,Oxygesic', null, null, null, null,
        null, null, null, null, 'Opioids', 'Substituted morphinans', null),
       ('clvdzrhki007yf2ftoqxvtzgd', 'Oxymorphone', 'Opana', null, null, null, null, null, null, null, null, 'Opioids',
        'Substituted morphinans', null),
       ('clvdzrhkp007zf2ft1k0wtnhk', 'PARGY-LAD', 'PARGY-LAD', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrhkw0080f2ftjvzs5le4', 'PCE', 'PCE,Eticyclidine', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhl40081f2ftsxu2texl', 'PCP', 'PCP,Angel Dust,Sherman,Sernyl,Wet,Dust,Supergrass,Boat,Tic Tac,Zoom', null,
        null, null, null, null, null, null, null, 'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhlb0082f2ftzkcmt6hz', 'PMA', 'PMA', null, null, null, null, null, null, null, null,
        'Entactogen,Hallucinogens', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrhli0083f2ftcyhp1yyu', 'PMMA', 'PMMA', null, null, null, null, null, null, null, null, 'Entactogen',
        'Amphetamine,Substituted amphetamines', null),
       ('clvdzrhlp0084f2ftaz3ro7dz', 'PRO-LAD', 'PRO-LAD', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Lysergamides', null),
       ('clvdzrhlz0085f2ftks7mqwr6', 'Peganum harmala', 'Espand,Esfand,Syrian rue', null, null, null, null, null, null,
        null, null, '', '', null),
       ('clvdzrhm50086f2ftqnrli80o', 'Pentedrone', 'Pentedrone,Drone', null, null, null, null, null, null, null, null,
        'Stimulants', 'Cathinone', null),
       ('clvdzrhmd0087f2ftfddwt8d7', 'Pentobarbital', 'Pentobarbital,pentobarbitone,Nembutal', null, null, null, null,
        null, null, null, null, 'Depressant', 'Barbiturates', null),
       ('clvdzrhml0088f2ftsubddx97', 'Pethidine', 'Pethidine,Meperidine,Demerol,Dolantin,Dolcontral', null, null, null,
        null, null, null, null, null, 'Opioids', 'Substituted piperidines', null),
       ('clvdzrhms0089f2ft3ruotywl', 'Phenazepam', '', null, null, null, null, null, null, null, null, 'Depressant',
        'Benzodiazepines', null),
       ('clvdzrhn0008af2fter9kxjiv', 'Phenethylamine (compound)', '', null, null, null, null, null, null, null, null,
        '', '', null),
       ('clvdzrhn7008bf2ftkrp5z6d0', 'Phenibut', 'Phenibut,Fenibut,Phenybut,PhGABA', null, null, null, null, null, null,
        null, null, 'Depressant', 'Gabapentinoids', null),
       ('clvdzrhnc008cf2ftq6qiy6k6', 'Phenobarbital', 'Phenobarbital,Phenobarbitone,Luminal,Phenobarb', null, null,
        null, null, null, null, null, null, 'Depressant', 'Barbiturates', null),
       ('clvdzrhni008df2ftkd7ix9r5', 'Phenylpiracetam', 'Phenylpiracetam,Phenotropil,Carphedon', null, null, null, null,
        null, null, null, null, 'Stimulants,Nootropic', 'Racetams', null),
       ('clvdzrhno008ef2ftr7s842hp', 'Piper nigrum (botany)', '', null, null, null, null, null, null, null, null, '',
        '', null),
       ('clvdzrhnw008ff2ft49a0j3ic', 'Piracetam', 'Piracetam', null, null, null, null, null, null, null, null,
        'Nootropic', 'Racetams', null),
       ('clvdzrho1008gf2ftynfjmk4p', 'Poppers', '', null, null, null, null, null, null, null, null, '', 'Poppers',
        null),
       ('clvdzrho7008hf2fto6p18pet', 'Pramiracetam', 'Pramiracetam', null, null, null, null, null, null, null, null,
        'Nootropic', 'Racetams', null),
       ('clvdzrhof008if2ftithu91fv', 'Pregabalin', 'Pregabalin,Lyrica,Nervalin', null, null, null, null, null, null,
        null, null, 'Depressant', 'Gabapentinoids', null),
       ('clvdzrhom008jf2ftyef1kpp4', 'Prochlorperazine', 'Compazine,Stemzine,Buccastem,Stemetil,Phenotil', null, null,
        null, null, null, null, null, null, 'Antipsychotic', 'Phenothiazine', null),
       ('clvdzrhor008kf2ft1n9c3e0j', 'Prolintane', 'Prolintane', null, null, null, null, null, null, null, null,
        'Stimulants', 'Amphetamine,Substituted amphetamines,Substituted pyrrolidines', null),
       ('clvdzrhox008lf2ftjauveem2', 'Promethazine', 'Phenergan,Lergigan', null, null, null, null, null, null, null,
        null, 'Deliriant,Depressant', 'Phenothiazine', null),
       ('clvdzrhp5008mf2ft2g873xie', 'Propylhexedrine', 'Propylhexedrine,Benzedrex', null, null, null, null, null, null,
        null, null, 'Stimulants', 'Cycloalkylamines', null),
       ('clvdzrhpg008nf2ft5mxte7ij', 'Proscaline', 'Proscaline', null, null, null, null, null, null, null, null,
        'Psychedelic', 'Substituted phenethylamines', null),
       ('clvdzrhpn008of2ftmfdnias6', 'Psilocin', 'Psilocin,Psilocine,Psilocyn,Psilotsin,4-HO-DMT,4-OH-DMT', null, null,
        null, null, null, null, null, null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrhpw008pf2fta5qdnwgo', 'Psilocybe cubensis', 'Shrooms,Magic mushroom', null, null, null, null, null, null,
        null, null, '', '', null),
       ('clvdzrhq5008qf2ft13tcfu1u', 'Psilocybin mushrooms',
        'Psilocybin,Psilocybin mushrooms,Magic Mushrooms,Shrooms,4-PO-DMT', null, null, null, null, null, null, null,
        null, 'Psychedelic', 'Substituted tryptamines', null),
       ('clvdzrhqb008rf2ftkwne70re', 'Psychedelic', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhqk008sf2ftd4nztnlg', 'Pyrazolam', 'Pyrazolam', null, null, null, null, null, null, null, null,
        'Depressant', 'Benzodiazepines', null),
       ('clvdzrhqr008tf2ft40mpsjxm', 'Quetiapine', 'Quetiapine,Seroquel', null, null, null, null, null, null, null,
        null, 'Antipsychotic,Atypical neuroleptic', 'Dibenzothiazepine', null),
       ('clvdzrhqx008uf2ftaw3n2pvl', 'RIMA', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhr6008vf2ftku92iab1', 'Racetams', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhrh008wf2fthkl8u631', 'Risperidone', 'Risperdal', null, null, null, null, null, null, null, null,
        'Antipsychotic', 'Benzisoxazole', null),
       ('clvdzrhrn008xf2ftveer1pj3', 'Rolicyclidine', 'PCPy', null, null, null, null, null, null, null, null,
        'Dissociatives', 'Arylcyclohexylamines', null),
       ('clvdzrhru008yf2ftt904guj5', 'SAM-e', 'S-Adenosyl Methionine,SAM-e,Methylguanidoacetic Acid', null, null, null,
        null, null, null, null, null, 'Nootropic', 'Nitrogenous organic acid', null),
       ('clvdzrhs1008zf2fthsv4dddw', 'STS-135', 'STS-135', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Indolecarboxamide,Adamantanes', null),
       ('clvdzrhs70090f2fterok19ib', 'Salvia divinorum',
        'Salvia,Sage of the Diviners,ska maría pastora,seer''s sage,yerba de la pastora,Sally', null, null, null, null,
        null, null, null, null, '', '', null),
       ('clvdzrhse0091f2ft35av2tr9', 'Salvinorin A',
        'Salvia,Salvia divinorum,Diviner''s Sage,Ska María Pastora,Seer''s Sage,Sally', null, null, null, null, null,
        null, null, null, 'Hallucinogens', 'Salvinorin,Terpenoid', null),
       ('clvdzrhsm0092f2fthkh90uqw', 'Salvinorin B methoxymethyl ether', '', null, null, null, null, null, null, null,
        null, 'Hallucinogens', 'Salvinorin', null),
       ('clvdzrhsu0093f2ftn6zmnbid', 'Secobarbital', 'Secobarbital,Secobarbitone,Seconal', null, null, null, null, null,
        null, null, null, 'Depressant', 'Barbiturates', null),
       ('clvdzrht10094f2ftul9v5a2z', 'Sufentanil', 'Sufentanil,Sufentanyl,Sufenta,Chronogesic', null, null, null, null,
        null, null, null, null, 'Opioids', 'Anilidopiperidine', null),
       ('clvdzrht60095f2ftsres3clm', 'Synthetic cannabinoid', '', null, null, null, null, null, null, null, null, '',
        '', null),
       ('clvdzrhte0096f2ftvq0oremf', 'THCP', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhtl0097f2fth4xlo9qn', 'THJ-018', 'THJ-018', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Naphthoylindazole', null),
       ('clvdzrhts0098f2ft316cp6lm', 'THJ-2201', 'THJ-2201', null, null, null, null, null, null, null, null,
        'Cannabinoid', 'Naphthoylindazole', null),
       ('clvdzrhu30099f2ftzpygbj9u', 'TMA-2', 'TMA-2', null, null, null, null, null, null, null, null,
        'Psychedelic,Stimulants', 'Substituted amphetamines', null),
       ('clvdzrhuc009af2ftuazfnyph', 'TMA-6', 'TMA-6', null, null, null, null, null, null, null, null,
        'Psychedelic,Stimulants', 'Amphetamine,Substituted amphetamines', null),
       ('clvdzrhuj009bf2ftxwt5f33t', 'Tabernanthe iboga (botany)', '', null, null, null, null, null, null, null, null,
        '', '', null),
       ('clvdzrhuq009cf2ftidgbqohc', 'Tapentadol', 'Tapentadol,Nucynta,Palexia,Yantil,Yantil SR', null, null, null,
        null, null, null, null, null, 'Opioids', 'Phenylpropylamine', null),
       ('clvdzrhv0009df2fthsbeile1', 'Temazepam', 'Temazepam,Restoril,Normison', null, null, null, null, null, null,
        null, null, 'Depressant', 'Benzodiazepines', null),
       ('clvdzrhv7009ef2ftozsmrm6q', 'Theacrine', 'Theacrine,Temurin,Temorine', null, null, null, null, null, null,
        null, null, 'Stimulants,Nootropic', 'Xanthines,Purine alkaloid', null),
       ('clvdzrhvh009ff2ftn76wvlb5', 'Theanine', 'Theanine,L-Theanine,L-γ-glutamylethylamide and N5-ethyl-L-glutamine',
        null, null, null, null, null, null, null, null, 'Nootropic', 'Amino acid analogue', null),
       ('clvdzrhvp009gf2ft4usp04sc', 'Thebaine', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhvv009hf2ftlfxm2h39', 'Thienodiazepines', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrhw2009if2ftj9jyy6be', 'Tianeptine', 'Tianeptine,Stablon,Coaxil,Tatinol', null, null, null, null, null,
        null, null, null, 'Nootropic,Opioids,Antidepressants', 'Dibenzothiazepine,Antidepressants', null),
       ('clvdzrhw9009jf2ft02vwjraz', 'Tilidin', 'Tilidine,Tilidin,Darby,Valoron,Generika', null, null, null, null, null,
        null, null, null, '', '', null),
       ('clvdzrhwg009kf2ftmhyd7fmd', 'Tizanidine', '', null, null, null, null, null, null, null, null, 'Depressant',
        'Imidazoline', null),
       ('clvdzrhwn009lf2ftk8sfukie', 'Tramadol', 'Tramadol,Tramal,Tadol,Tramacur,Tramundin', null, null, null, null,
        null, null, null, null, 'Opioids', 'Phenylpropylamine', null),
       ('clvdzrhwu009mf2ft8tdz7xub', 'Tryptamine (compound)', '', null, null, null, null, null, null, null, null, '',
        '', null),
       ('clvdzrhx1009nf2ftzb5dbil1', 'Tyrosine', 'Tyrosine,L-Tyrosine,4-Hydroxyphenylalanine', null, null, null, null,
        null, null, null, null, 'Stimulants', 'Substituted phenethylamines,Amino acid', null),
       ('clvdzrhx9009of2ftet0uinx0', 'U-47700', 'U-47700', null, null, null, null, null, null, null, null, 'Opioids',
        'Benzamide', null),
       ('clvdzrhxe009pf2ftetyo1wgv', 'Xanthines', '', null, null, null, null, null, null, null, null, '', '', null),
       ('clvdzrhxn009qf2fta7g8dxiy', 'Zolpidem', 'Ambien,Intermezzo,Edluar,Zolpimist', null, null, null, null, null,
        null, null, null, 'Hallucinogens,Depressant', 'Imidazopyridine', null),
       ('clvdzrhxu009rf2ftnuftqxwg', 'Zopiclone', 'Zimovane,Imovane', null, null, null, null, null, null, null, null,
        'Hallucinogens,Depressant', 'Cyclopyrrolone', null),
       ('clvdzrhy1009sf2ft6d78tvwp', 'Beta-Carboline', '', null, null, null, null, null, null, null, null, '', '',
        null),
       ('clvdzrhyd009tf2ftq0obayyc', 'ΑMT', 'AMT,αMT,Indopan', null, null, null, null, null, null, null, null,
        'Psychedelic,Entactogen', 'Substituted tryptamines', null),
       ('clvdzrhyl009uf2ft0a27r604', 'ΒOH-2C-B', '', null, null, null, null, null, null, null, null, 'Psychedelic',
        'Substituted phenethylamines', null),
       ('clvdzrhyw009vf2ft1ggonlgo', 'Βk-2C-B', 'βk-2C-B,beta-keto 2C-B,bk-2C-B', null, null, null, null, null, null,
        null, null, 'Psychedelic', 'Substituted phenethylamines', null);

insert into main.RouteOfAdministration (id, substanceName, name, bioavailability)
values ('clvdzrihz0001i8bauf2fhwal', '1,3-dimethylbutylamine', 'oral', 100),
       ('clvdzrii70003i8ba05if1k7w', '1,4-Butanediol', 'oral', 100),
       ('clvdzrij4000fi8ba0u4dwj2o', '1P-ETH-LAD', 'oral', 100),
       ('clvdzrik0000ri8ba08z2rzgi', '1P-LSD', 'oral', 100),
       ('clvdzriky0013i8bahc563zp5', '1V-LSD', 'oral', 100),
       ('clvdzrim9001fi8ba5bz15dsy', '1cP-AL-LAD', 'oral', 100),
       ('clvdzrinm001ri8bazus0mx33', '1cP-LSD', 'oral', 100),
       ('clvdzrior0023i8ba9ncfm6dx', '1cP-MiPLA', 'oral', 100),
       ('clvdzripx002fi8ba7cqrousu', '2-Aminoindane', 'oral', 100),
       ('clvdzrirh002ri8bax48qps1a', '2-FA', 'oral', 100),
       ('clvdzrisq0033i8bapwga3jbl', '2-FEA', 'insufflated', 100),
       ('clvdzriu2003fi8ba2pfgu7b2', '2-FMA', 'insufflated', 100),
       ('clvdzriu8003hi8ba8fm5oev3', '2-FMA', 'oral', 100),
       ('clvdzriw80043i8bafctua30t', '2-Fluorodeschloroketamine', 'insufflated', 100),
       ('clvdzriwf0045i8bavsu9prbz', '2-Fluorodeschloroketamine', 'oral', 100),
       ('clvdzriyi004ri8baeu4j8t5o', '2-Methyl-AP-237', 'oral', 100),
       ('clvdzrizq0053i8bav2mnpwqy', '25B-NBOMe', 'insufflated', 100),
       ('clvdzrizw0055i8baujxpao4r', '25B-NBOMe', 'sublingual', 100),
       ('clvdzrj1n005ni8basqxxwee1', '25C-NBOH', 'sublingual', 100),
       ('clvdzrj2n005xi8bayge773pp', '25C-NBOMe', 'sublingual', 100),
       ('clvdzrj3s0067i8ba7zrwkdq9', '25D-NBOMe', 'sublingual', 100),
       ('clvdzrj4z006hi8baxvwzqy7t', '25I-NBOH', 'sublingual', 100),
       ('clvdzrj6a006ri8ba0ihsnci1', '25I-NBOMe', 'insufflated', 100),
       ('clvdzrj6h006ti8bacivh7jtz', '25I-NBOMe', 'sublingual', 100),
       ('clvdzrj840079i8bax6wqvr4l', '25N-NBOMe', 'sublingual', 100),
       ('clvdzrj93007ji8bacswpzph0', '2C-B', 'insufflated', 100),
       ('clvdzrj99007li8bafclzdq1p', '2C-B', 'oral', 100),
       ('clvdzrj9h007ni8bas2790prv', '2C-B', 'rectal', 100),
       ('clvdzrjck008ji8baq14fs7q4', '2C-B-FLY', 'oral', 100),
       ('clvdzrjdm008vi8babeebv87v', '2C-C', 'oral', 100),
       ('clvdzrjer0097i8ba71ltvjhk', '2C-D', 'oral', 100),
       ('clvdzrjfv009ji8bazpo2ov2o', '2C-E', 'insufflated', 100),
       ('clvdzrjg1009li8bawufcvmee', '2C-E', 'oral', 100),
       ('clvdzrji900a7i8bahar8ky6w', '2C-I', 'oral', 100),
       ('clvdzrjjn00aji8baol4wci3l', '2C-P', 'oral', 100),
       ('clvdzrjl300avi8baazisjvfp', '2C-T', 'oral', 100),
       ('clvdzrjmc00b7i8bayv68zn0q', '2C-T-2', 'insufflated', 100),
       ('clvdzrjmh00b9i8ba03gwcerm', '2C-T-2', 'oral', 100),
       ('clvdzrjor00bvi8baf1125fah', '2C-T-21', 'oral', 100),
       ('clvdzrjq100c7i8bai5oq2xxc', '2C-T-7', 'insufflated', 100),
       ('clvdzrjq900c9i8ba56d8n6w7', '2C-T-7', 'oral', 100),
       ('clvdzrjso00cti8bat9j58hxw', '2M2B', 'oral', 100),
       ('clvdzrjtx00d5i8baytuenwe8', '3,4-CTMP', 'oral', 100),
       ('clvdzrjv500dhi8bao1967x6r', '3-FA', 'oral', 100),
       ('clvdzrjwl00dti8baxjktxwiz', '3-FEA', 'insufflated', 100),
       ('clvdzrjws00dvi8baox7lp281', '3-FEA', 'oral', 100),
       ('clvdzrjyz00ehi8baczu0k1a6', '3-FMA', 'oral', 100),
       ('clvdzrk0100eti8basn99tgsj', '3-FPM', 'insufflated', 100),
       ('clvdzrk0900evi8ba11qx1gvn', '3-FPM', 'oral', 100),
       ('clvdzrk2500ffi8baoc5ak49g', '3-HO-PCE', 'oral', 100),
       ('clvdzrk3800fri8ba530rieo5', '3-HO-PCP', 'oral', 100),
       ('clvdzrk4f00g3i8ba5a2robhl', '3-MMC', 'insufflated', 100),
       ('clvdzrk4k00g5i8bayc4n2yhw', '3-MMC', 'oral', 100),
       ('clvdzrk6w00gri8ba4fjqn0wg', '3-MeO-PCE', 'insufflated', 100),
       ('clvdzrk7500gti8ba7wx602qn', '3-MeO-PCE', 'oral', 100),
       ('clvdzrk9400hfi8baula0udey', '3-MeO-PCMo', 'oral', 100),
       ('clvdzrkak00hri8bafph9p7lm', '3-MeO-PCP', 'insufflated', 100),
       ('clvdzrkas00hti8ba1t2680no', '3-MeO-PCP', 'oral', 100),
       ('clvdzrkb000hvi8baq05zd065', '3-MeO-PCP', 'smoked', 100),
       ('clvdzrkea00ipi8ba6j38e9fx', '3C-E', 'insufflated', 100),
       ('clvdzrkeg00iri8baoxmof44q', '3C-E', 'oral', 100),
       ('clvdzrkgk00jdi8ba2284ka6j', '3C-P', 'oral', 100),
       ('clvdzrkgp00jfi8ba4alrpdby', '4-AcO-DET', 'oral', 100),
       ('clvdzrkhv00jri8bac476awoa', '4-AcO-DMT', 'insufflated', 100),
       ('clvdzrki100jti8ba8qzy8yc0', '4-AcO-DMT', 'oral', 100),
       ('clvdzrkk300kfi8bay43t9mcg', '4-AcO-DiPT', 'oral', 100),
       ('clvdzrkl800kri8ba4azkmv82', '4-AcO-MET', 'oral', 100),
       ('clvdzrkme00l3i8ba62qju2rs', '4-AcO-MiPT', 'oral', 100),
       ('clvdzrknn00lfi8ba2z0er445', '4-FA', 'oral', 100),
       ('clvdzrkoy00lri8ba12x2a21z', '4-FMA', 'oral', 100),
       ('clvdzrkq100m3i8ba6e8fb8yl', '4-HO-DET', 'oral', 100),
       ('clvdzrkr000mfi8bahhy1fbxo', '4-HO-DPT', 'insufflated', 100),
       ('clvdzrkr600mhi8ba62hrodte', '4-HO-DPT', 'oral', 100),
       ('clvdzrkt800n3i8badrnqcu5d', '4-HO-DiPT', 'oral', 100),
       ('clvdzrkuf00nfi8ba0fr34zyr', '4-HO-EPT', 'oral', 100),
       ('clvdzrkv600nni8ba6zqo2ykp', '4-HO-MET', 'oral', 100),
       ('clvdzrkvc00npi8banyga4s6k', '4-HO-MET', 'smoked', 100),
       ('clvdzrkxe00obi8ban98aprfe', '4-HO-MPT', 'oral', 100),
       ('clvdzrkyl00oni8barzbr8srs', '4-HO-MiPT', 'oral', 100),
       ('clvdzrkzn00ozi8ba9gheywi3', '4-MeO-PCP', 'insufflated', 100),
       ('clvdzrkzv00p1i8ba2ps63fs6', '4-MeO-PCP', 'oral', 100),
       ('clvdzrl2a00pli8baated1j7u', '4F-EPH', 'oral', 100),
       ('clvdzrl3u00pxi8baveou57jz', '4F-MPH', 'insufflated', 100),
       ('clvdzrl4000pzi8bawsjmyv8h', '4F-MPH', 'oral', 100),
       ('clvdzrl6e00qli8bagq4bv8nm', '5-APB', 'oral', 100),
       ('clvdzrl7o00qxi8bayg910rd1', '5-Hydroxytryptophan', 'oral', 100),
       ('clvdzrl8s00r9i8baprnaczas', '5-MAPB', 'oral', 100),
       ('clvdzrl9y00rli8ba83bhum11', '5-MeO-DALT', 'oral', 100),
       ('clvdzrla500rni8bagv2o83na', '5-MeO-DALT', 'smoked', 100),
       ('clvdzrlbr00s3i8baekx83pzo', '5-MeO-DMT', 'insufflated', 100),
       ('clvdzrlbz00s5i8ba0r6dyv2n', '5-MeO-DMT', 'smoked', 100),
       ('clvdzrle200spi8bayhg41abm', '5-MeO-DiBF', 'oral', 100),
       ('clvdzrlf400t1i8baknhpqsu9', '5-MeO-DiPT', 'oral', 100),
       ('clvdzrlgb00tdi8baju4vcik1', '5-MeO-MiPT', 'oral', 100),
       ('clvdzrlgh00tfi8bakwwtbjl4', '5-MeO-MiPT', 'smoked', 100),
       ('clvdzrlip00u1i8ba3p60q36r', '5F-AKB48', 'smoked', 100),
       ('clvdzrljv00udi8bauytlwr6t', '5F-PB-22', 'oral', 100),
       ('clvdzrlk000ufi8baynio90xg', '5F-PB-22', 'smoked', 100),
       ('clvdzrlm500v1i8ba1ueqdkm5', '6-APB', 'oral', 100),
       ('clvdzrlnf00vdi8bauvgdoh1s', '6-APDB', 'oral', 100),
       ('clvdzrlon00vpi8bahh4dz4r9', 'A-PHP', 'insufflated', 100),
       ('clvdzrlos00vri8ba3r1o4i54', 'A-PHP', 'oral', 100),
       ('clvdzrlox00vti8bajbcwf1eh', 'A-PHP', 'smoked', 100),
       ('clvdzrlsb00wli8bavj353s7r', 'A-PVP', 'insufflated', 100),
       ('clvdzrlsh00wni8bambs85jdw', 'A-PVP', 'oral', 100),
       ('clvdzrlsp00wpi8bajvd22e5b', 'A-PVP', 'smoked', 100),
       ('clvdzrlw600xli8bahlj5otej', 'AB-FUBINACA', 'smoked', 100),
       ('clvdzrlxe00xxi8ba4e2lly5b', 'AL-LAD', 'oral', 100),
       ('clvdzrlyr00y9i8ba8zpfee06', 'ALD-52', 'oral', 100),
       ('clvdzrlzx00yli8bayr7y3xc2', 'APICA', 'smoked', 100),
       ('clvdzrm0z00yxi8ba0ivk9ry0', 'Acetylfentanyl', 'insufflated', 100),
       ('clvdzrm1700yzi8bav2rt2n1h', 'Acetylfentanyl', 'sublingual', 100),
       ('clvdzrm2v00zhi8ban9ejyvcz', 'Adrafinil', 'oral', 100),
       ('clvdzrm4100zti8ba99iet4tr', 'Alcohol', 'oral', 100),
       ('clvdzrm5a0105i8bayicao93s', 'Allylescaline', 'oral', 100),
       ('clvdzrm6d010hi8ba6acg5rws', 'Alpha-GPC', 'oral', 100),
       ('clvdzrm7c010ti8baq4i17c72', 'Alprazolam', 'inhaled', 100),
       ('clvdzrm7k010vi8bajwuvdsrk', 'Alprazolam', 'oral', 100),
       ('clvdzrm9n011hi8baxn4usvv8', 'Amphetamine', 'insufflated', 100),
       ('clvdzrm9t011ji8bay0kbrbvv', 'Amphetamine', 'intravenous', 100),
       ('clvdzrma0011li8bacozk8fd6', 'Amphetamine', 'oral', 100),
       ('clvdzrmd9012hi8ba7uvr0b1d', 'Aniracetam', 'oral', 100),
       ('clvdzrmec012ti8ba76s7spy7', 'Armodafinil', 'oral', 100),
       ('clvdzrmfk0135i8ba0o0xs4xk', 'Ayahuasca', 'oral', 100),
       ('clvdzrmfr0137i8baydvqcmxa', 'Baclofen', 'oral', 100),
       ('clvdzrmgx013ji8banv27jmno', 'Benzydamine', 'oral', 100),
       ('clvdzrmi4013vi8bavovvvbuq', 'Bromantane', 'oral', 42),
       ('clvdzrmjd0147i8baib2f5jzy', 'Bromazepam', 'oral', 100),
       ('clvdzrmkm014ji8ba56a4svzt', 'Bromo-DragonFLY', 'oral', 100),
       ('clvdzrmm4014vi8bacoyp2vxj', 'Bufotenin', 'smoked', 100),
       ('clvdzrmnc0157i8ba6n2ej7ex', 'Buprenorphine', 'insufflated', 100),
       ('clvdzrmnk0159i8baa77y9eet', 'Buprenorphine', 'sublingual', 100),
       ('clvdzrmpw015vi8ba10y1f2sg', 'Buspirone', 'oral', 100),
       ('clvdzrmq1015xi8baq5thp62z', 'Buspirone', 'sublingual', 100),
       ('clvdzrmq8015zi8baqphkid97', 'Butylone', 'oral', 100),
       ('clvdzrmrf016bi8baeqnn18av', 'Caffeine', 'insufflated', 100),
       ('clvdzrmrk016di8ba7e3vhuj7', 'Caffeine', 'oral', 100),
       ('clvdzrmts016zi8ba0nnh2lf0', 'Cake', 'oral', 100),
       ('clvdzrmva017bi8bazz880t7n', 'Cannabidiol', 'oral', 100),
       ('clvdzrmwp017ni8babduglhp0', 'Cannabis', 'oral', 100),
       ('clvdzrmwy017pi8bavmgdoe1b', 'Cannabis', 'smoked', 100),
       ('clvdzrmx6017ri8baqph3nmah', 'Cannabis', 'sublingual', 100),
       ('clvdzrmz8018di8ba39j4cia2', 'Carisoprodol', 'oral', 100),
       ('clvdzrn0i018pi8basmykgbmi', 'Chlordiazepoxide', 'oral', 100),
       ('clvdzrn1p0191i8bamrrhbwyy', 'Choline bitartrate', 'oral', 100),
       ('clvdzrn2v019di8baevow978s', 'Cinolazepam', 'oral', 100),
       ('clvdzrn41019pi8baai787pai', 'Citicoline', 'oral', 100),
       ('clvdzrn5901a1i8balbi6r964', 'Clonazepam', 'oral', 100),
       ('clvdzrn6b01adi8ba6n04jnbj', 'Clonazolam', 'oral', 100),
       ('clvdzrn7m01api8ba6xt7prbj', 'Clonidine', 'oral', 100),
       ('clvdzrn8u01b1i8baaw73st7a', 'Cocaine', 'insufflated', 100),
       ('clvdzrn9201b3i8bae2iuiwgq', 'Cocaine', 'smoked', 100),
       ('clvdzrnae01bfi8ba5h7j7x89', 'Codeine', 'oral', 100),
       ('clvdzrnbn01bri8baov4qx62s', 'Coluracetam', 'insufflated', 100),
       ('clvdzrnbt01bti8baypui4g7w', 'Coluracetam', 'oral', 100),
       ('clvdzrned01cfi8ba55t0f0l1', 'Creatine', 'oral', 100),
       ('clvdzrnfe01cri8ba239ogo93', 'Cyclazodone', 'oral', 100),
       ('clvdzrngn01d3i8bajoluuixq', 'DET', 'oral', 100),
       ('clvdzrnil01dfi8ba7s2iefoh', 'DMT', 'intravenous', 100),
       ('clvdzrniw01dhi8ba2osrwhqg', 'DMT', 'smoked', 100),
       ('clvdzrnl601e3i8bau70n0vut', 'DOB', 'oral', 100),
       ('clvdzrnmc01efi8ba90w5pkaj', 'DOC', 'insufflated', 100),
       ('clvdzrnmk01ehi8basww90qp2', 'DOC', 'oral', 100),
       ('clvdzrnor01f3i8bafvy0vka0', 'DOI', 'oral', 100),
       ('clvdzrnpz01ffi8bafyn0nih1', 'DOM', 'oral', 100),
       ('clvdzrnr401fri8badzpk197a', 'DPT', 'insufflated', 100),
       ('clvdzrnra01fti8ba045sngo3', 'DPT', 'oral', 100),
       ('clvdzrnrg01fvi8bagwmsdogz', 'DPT', 'smoked', 100),
       ('clvdzrnum01gri8ba3jh9v60p', 'Datura', 'oral', 100),
       ('clvdzrnus01gti8baxskbadii', 'Deschloroetizolam', 'oral', 100),
       ('clvdzrnvw01h5i8ba27pnenly', 'Deschloroketamine', 'insufflated', 100),
       ('clvdzrnw201h7i8ba25hypjm8', 'Deschloroketamine', 'oral', 100),
       ('clvdzrnw701h9i8bai6qay9sw', 'Deschloroketamine', 'smoked', 100),
       ('clvdzrnzk01i5i8ba5swvql54', 'Desomorphine', 'oral', 100),
       ('clvdzro0q01ihi8bafp9ap5h9', 'Desoxypipradrol', 'insufflated', 100),
       ('clvdzro0x01iji8bas53ca8h7', 'Desoxypipradrol', 'oral', 100),
       ('clvdzro3u01j5i8baonr067hc', 'Dextromethorphan', 'oral', 100),
       ('clvdzro5b01jhi8bams5gfttv', 'Dextropropoxyphene', 'oral', 100),
       ('clvdzro6p01jti8baxui58476', 'DiPT', 'oral', 100),
       ('clvdzro6y01jvi8ba68pon9mf', 'DiPT', 'smoked', 100),
       ('clvdzro9201kfi8bapnjq32dd', 'Diazepam', 'oral', 100),
       ('clvdzroa701kri8bacrtwrtcp', 'Dichloropane', 'insufflated', 100),
       ('clvdzroag01kti8bauqs1rhn2', 'Dichloropane', 'smoked', 100),
       ('clvdzrocm01lfi8bausus2rqt', 'Diclazepam', 'oral', 100),
       ('clvdzroe001lri8basyamaztm', 'Dihydrocodeine', 'oral', 100),
       ('clvdzrof701m3i8baohsx95dx', 'Diphenhydramine', 'oral', 100),
       ('clvdzroge01mfi8bae09z0f8r', 'Diphenidine', 'oral', 100),
       ('clvdzrogm01mhi8ba1af0yh0m', 'Diphenidine', 'rectal', 100),
       ('clvdzrogu01mji8bac8gkq6ri', 'Diphenidine', 'smoked', 100),
       ('clvdzrojo01nbi8bae6hpzdt1', 'EPT', 'insufflated', 100),
       ('clvdzrokk01nli8barm4ek4n9', 'ETH-CAT', 'insufflated', 100),
       ('clvdzrokr01nni8batltucv9r', 'ETH-CAT', 'oral', 100),
       ('clvdzromw01o9i8baxizfdqr3', 'ETH-LAD', 'oral', 100),
       ('clvdzroo101oli8ba6yaeulf9', 'Efavirenz', 'smoked', 100),
       ('clvdzrooe01opi8ba5ms8fb0o', 'Ephedrine', 'oral', 100),
       ('clvdzropo01p1i8ba1da1w0f0', 'Ephenidine', 'oral', 100),
       ('clvdzroqx01pdi8babync8yru', 'Ephylone', 'oral', 100),
       ('clvdzrorv01pni8baykfaja8g', 'Escaline', 'oral', 100),
       ('clvdzrot601pzi8bar4hieo6q', 'Eszopiclone', 'oral', 100),
       ('clvdzrouc01qbi8babe9ntfos', 'Ethylmorphine', 'oral', 100),
       ('clvdzrovi01qni8ba2m42p4k2', 'Ethylone', 'oral', 100),
       ('clvdzrowv01qzi8balmnwretc', 'Ethylphenidate', 'oral', 100),
       ('clvdzrox301r1i8batd56ek3o', 'Ethylphenidate', 'rectal', 100),
       ('clvdzroz801rni8bawurmx2mk', 'Etizolam', 'oral', 100),
       ('clvdzrp0f01rzi8bajysq1b1j', 'Etomidate', 'insufflated', 100),
       ('clvdzrp0l01s1i8bauxvg6464', 'Etomidate', 'oral', 100),
       ('clvdzrp2v01sni8baw7ssek43', 'Experience:"DPH (700mg, Oral) - Arachnophobia Awakened', 'oral', 100),
       ('clvdzrp4201szi8bahlahc5bk', 'F-Phenibut', 'oral', 100),
       ('clvdzrp5901tbi8bar1bjc2om', 'Fentanyl', 'insufflated', 100),
       ('clvdzrp5h01tdi8ba1thshmns', 'Fentanyl', 'sublingual', 100),
       ('clvdzrp5o01tfi8bagg70eesi', 'Fentanyl', 'transdermal', 100),
       ('clvdzrp8v01u9i8baae51bfs4', 'Flualprazolam', 'oral', 100),
       ('clvdzrpa001uli8ba7mtmx8i4', 'Flubromazepam', 'oral', 100),
       ('clvdzrpb601uxi8bat68uc6uv', 'Flubromazolam', 'oral', 100),
       ('clvdzrpcf01v9i8bayipsdiar', 'Flunitrazepam', 'oral', 100),
       ('clvdzrpdl01vli8bac6z8h7h6', 'Flunitrazolam', 'oral', 100),
       ('clvdzrpeu01vxi8babkm6hqaj', 'GBL', 'oral', 100),
       ('clvdzrpg601w9i8ba8d6hgob4', 'GHB', 'oral', 100),
       ('clvdzrphe01wli8bavca7zobg', 'Gabapentin', 'oral', 27),
       ('clvdzrpik01wxi8bawpkffanp', 'Gaboxadol', 'oral', 100),
       ('clvdzrpjt01x9i8badcjq61n7', 'Galantamine', 'oral', 90),
       ('clvdzrpl201xli8ba0b7uav8i', 'HXE', 'insufflated', 100),
       ('clvdzrpl801xni8bawb4gxv7p', 'HXE', 'oral', 100),
       ('clvdzrplg01xpi8bahbno0s6o', 'HXE', 'sublingual', 100),
       ('clvdzrpoo01yli8ba7so7qj2h', 'Haloperidol', 'oral', 100),
       ('clvdzrppw01yxi8bauckcf6wl', 'Heroin', 'insufflated', 100),
       ('clvdzrpq201yzi8baj0no5749', 'Heroin', 'intravenous', 100),
       ('clvdzrpqc01z1i8baukibjlxu', 'Heroin', 'smoked', 100),
       ('clvdzrpt301zti8ba89z094z2', 'Hexedrone', 'oral', 100),
       ('clvdzrpua0205i8baj2uh12ca', 'Hydrocodone', 'oral', 100),
       ('clvdzrpvj020hi8baa5osuxn7', 'Hydromorphone', 'intravenous', 100),
       ('clvdzrpvq020ji8baje8u54uu', 'Hydromorphone', 'oral', 100),
       ('clvdzrpy70215i8bao4qj0hfs', 'Ibogaine', 'oral', 100),
       ('clvdzrpyl0219i8bawanvgeis', 'Isopropylphenidate', 'insufflated', 100),
       ('clvdzrpyt021bi8baa778omq9', 'Isopropylphenidate', 'oral', 100),
       ('clvdzrq1a021xi8ba57ti8813', 'JWH-018', 'smoked', 100),
       ('clvdzrq2x0227i8batrfphluw', 'JWH-073', 'smoked', 100),
       ('clvdzrq3r022fi8ba591svvdh', 'Ketamine', 'insufflated', 45),
       ('clvdzrq41022hi8bala9q5ont', 'Ketamine', 'oral', 17),
       ('clvdzrq48022ji8ba1cyb5dsq', 'Ketamine', 'sublingual', 20),
       ('clvdzrq6t0235i8bazopzlefi', 'Kratom', 'oral', 100),
       ('clvdzrq83023hi8ba41gx3nra', 'LAE-32', 'oral', 100),
       ('clvdzrq8h023li8baqrbkv07w', 'LSA', 'oral', 100),
       ('clvdzrq8n023ni8bayihh1rj8', 'LSA', 'sublingual', 100),
       ('clvdzrqax0249i8baryem810x', 'LSD', 'sublingual', 71),
       ('clvdzrqc7024li8ba4x1z67xz', 'LSM-775', 'oral', 100),
       ('clvdzrqdj024xi8ba002maqku', 'LSZ', 'oral', 100),
       ('clvdzrqeu0259i8balulew4am', 'Lisdexamfetamine', 'oral', 100),
       ('clvdzrqg9025li8baoctqrrnn', 'Lorazepam', 'oral', 100),
       ('clvdzrqhm025xi8bami0sufki', 'MCPP', 'oral', 100),
       ('clvdzrqip0269i8barn7kwwp2', 'MDA', 'oral', 100),
       ('clvdzrqjx026li8baki9rsgwq', 'MDAI', 'oral', 100),
       ('clvdzrqlb026xi8ba37ytiqza', 'MDEA', 'oral', 100),
       ('clvdzrqmi0279i8bafxugmhup', 'MDMA', 'oral', 100),
       ('clvdzrqns027li8barx14ugqk', 'MDPV', 'oral', 100),
       ('clvdzrqot027xi8baokg60vwo', 'MET', 'insufflated', 100),
       ('clvdzrqp2027zi8ba16eggbk1', 'MET', 'oral', 100),
       ('clvdzrqp90281i8bayz2denq4', 'MET', 'smoked', 100),
       ('clvdzrqsa028xi8ba75b0osui', 'MPT', 'oral', 100),
       ('clvdzrqsj028zi8barihemrh8', 'MXiPr', 'insufflated', 100),
       ('clvdzrqsr0291i8bav1ch2ibz', 'MXiPr', 'oral', 100),
       ('clvdzrqv4029ni8ba7t4stuf2', 'Mebroqualone', 'oral', 100),
       ('clvdzrqvb029pi8ba9ux2h8lc', 'Mebroqualone', 'smoked', 100),
       ('clvdzrqx202a7i8bamqgngv34', 'Meclofenoxate', 'oral', 100),
       ('clvdzrqy002ahi8bawu6nwglq', 'Melatonin', 'oral', 15),
       ('clvdzrqz702ati8bayxlz9lp9', 'Memantine', 'oral', 100),
       ('clvdzrr0c02b5i8ba955yvl7n', 'Mephedrone', 'insufflated', 100),
       ('clvdzrr0i02b7i8ba1125qky2', 'Mephedrone', 'oral', 100),
       ('clvdzrr2p02bti8bam24ytn7z', 'Mescaline', 'oral', 100),
       ('clvdzrr3s02c5i8bawmt743ka', 'Methadone', 'oral', 100),
       ('clvdzrr4z02chi8baa339dj64', 'Methallylescaline', 'oral', 100),
       ('clvdzrr6c02cti8ba6ixpdp72', 'Methamphetamine', 'insufflated', 100),
       ('clvdzrr6i02cvi8baytrmafu2', 'Methamphetamine', 'intravenous', 100),
       ('clvdzrr6q02cxi8bauh3bsrnf', 'Methamphetamine', 'oral', 100),
       ('clvdzrr6w02czi8ba502qq1j7', 'Methamphetamine', 'rectal', 100),
       ('clvdzrr7202d1i8barkktcpqn', 'Methamphetamine', 'smoked', 100),
       ('clvdzrrcu02ehi8bajnjexec6', 'Methaqualone', 'oral', 100),
       ('clvdzrrd002eji8balo6bag2q', 'Methaqualone', 'smoked', 100),
       ('clvdzrreo02f1i8ban7p077zf', 'Methiopropamine', 'insufflated', 100),
       ('clvdzrres02f3i8ba0gxn5m0n', 'Methiopropamine', 'oral', 100),
       ('clvdzrrgw02fni8ba33tnrw1u', 'Methoxetamine', 'insufflated', 100),
       ('clvdzrrh402fpi8ba86a9tyr0', 'Methoxetamine', 'oral', 100),
       ('clvdzrrj502gbi8bagmirqq9i', 'Methoxphenidine', 'oral', 100),
       ('clvdzrrk302gli8bagfq9j2ni', 'Methylnaphthidate', 'insufflated', 100),
       ('clvdzrrk902gni8bax9i9bm02', 'Methylnaphthidate', 'oral', 100),
       ('clvdzrrmg02h7i8bag3ozg3k4', 'Methylone', 'oral', 100),
       ('clvdzrrnl02hji8bajhctf3rx', 'Methylphenidate', 'insufflated', 100),
       ('clvdzrrnq02hli8bav8c5yi3l', 'Methylphenidate', 'oral', 100),
       ('clvdzrrpz02i7i8ba05f03gio', 'Metizolam', 'oral', 100),
       ('clvdzrrqy02ihi8ba7mrlu4ga', 'Mexedrone', 'oral', 100),
       ('clvdzrrrw02iri8babd6r6d3t', 'MiPLA', 'oral', 100),
       ('clvdzrrt202j3i8ba1be26pfy', 'MiPT', 'oral', 100),
       ('clvdzrrtw02jbi8bat4eshoca', 'Mirtazapine', 'oral', 100),
       ('clvdzrrv102jni8baxffkozxt', 'Modafinil', 'oral', 100),
       ('clvdzrrw402jzi8batt11q3rm', 'Morphine', 'oral', 100),
       ('clvdzrrxc02kbi8bat8b7553s', 'Myristicin', 'oral', 100),
       ('clvdzrryb02kli8ba3km81bav', 'N-Acetylcysteine', 'oral', 100),
       ('clvdzrrzm02kxi8ba0amavmei', 'N-Ethylhexedrone', 'insufflated', 100),
       ('clvdzrrzt02kzi8ba9odq6pyy', 'N-Ethylhexedrone', 'smoked', 100),
       ('clvdzrs2902lli8baym8etaqm', 'N-Methylbisfluoromodafinil', 'oral', 100),
       ('clvdzrs3e02lxi8bakb37ejb2', 'NEP', 'insufflated', 100),
       ('clvdzrs3m02lzi8bakdc6pbje', 'NEP', 'oral', 100),
       ('clvdzrs3u02m1i8basrhxhwva', 'NEP', 'smoked', 100),
       ('clvdzrs6w02mxi8bagzodx4ly', 'NM-2-AI', 'oral', 100),
       ('clvdzrs8002n9i8ba0lwlscua', 'Naloxone', 'insufflated', 100),
       ('clvdzrs8602nbi8bajnijho6u', 'Naloxone', 'intramuscular', 100),
       ('clvdzrs8b02ndi8ba4hfemb0n', 'Naloxone', 'intravenous', 100),
       ('clvdzrs9702nli8bau6ddw1q8', 'Nicotine', 'buccal', 100),
       ('clvdzrs9d02nni8bal37a7erm', 'Nicotine', 'smoked', 100),
       ('clvdzrsbk02o9i8ba20mopv0x', 'Nifoxipam', 'oral', 100),
       ('clvdzrscr02oli8baqy9zc8gx', 'Nitromethaqualone', 'oral', 100),
       ('clvdzrsd202oni8bao93s2pkh', 'Nitromethaqualone', 'sublingual', 100),
       ('clvdzrsda02opi8bah30goifc', 'Nitrous', 'inhaled', 100),
       ('clvdzrsef02p1i8bac4g7bfqb', 'O-Desmethyltramadol', 'oral', 100),
       ('clvdzrsel02p3i8bam0ytm5x7', 'O-Desmethyltramadol', 'sublingual', 100),
       ('clvdzrsgx02ppi8ba929oqgzj', 'O-PCE', 'insufflated', 100),
       ('clvdzrsh302pri8bauzj8z90q', 'O-PCE', 'oral', 100),
       ('clvdzrsj802qdi8bacdymeedk', 'Omberacetam', 'insufflated', 100),
       ('clvdzrsje02qfi8bast9dvg1t', 'Omberacetam', 'oral', 100),
       ('clvdzrslk02r1i8ba3j5kspm3', 'Oxazepam', 'oral', 100),
       ('clvdzrsmq02rdi8baxxboco5m', 'Oxiracetam', 'oral', 100),
       ('clvdzrsnx02rpi8ba8dpc1w83', 'Oxycodone', 'insufflated', 100),
       ('clvdzrso402rri8bauzz7aylh', 'Oxycodone', 'oral', 100),
       ('clvdzrsqe02sdi8bapnbs56b5', 'Oxymorphone', 'oral', 100),
       ('clvdzrsrp02spi8baevknkori', 'PARGY-LAD', 'oral', 100),
       ('clvdzrst302t1i8bavemrslc7', 'PCE', 'insufflated', 100),
       ('clvdzrsta02t3i8bas3m0wzu6', 'PCE', 'oral', 100),
       ('clvdzrsti02t5i8bavk78vhx5', 'PCE', 'smoked', 100),
       ('clvdzrsw902tvi8ba60on5qgp', 'PCP', 'insufflated', 100),
       ('clvdzrswg02txi8bahpez67oj', 'PCP', 'oral', 100),
       ('clvdzrswn02tzi8baeg3iprem', 'PCP', 'smoked', 100),
       ('clvdzrsz502upi8baiozql0xj', 'PMA', 'oral', 100),
       ('clvdzrszy02uxi8baggo6knaw', 'PMMA', 'oral', 100),
       ('clvdzrt0c02v1i8bale06dv41', 'PRO-LAD', 'oral', 100),
       ('clvdzrt1m02vdi8ba2fsahcxo', 'Pentedrone', 'insufflated', 100),
       ('clvdzrt1r02vfi8batcxi117e', 'Pentedrone', 'oral', 100),
       ('clvdzrt4502w1i8baw14x6vft', 'Pentobarbital', 'oral', 100),
       ('clvdzrt5402wbi8ba3cn0r76a', 'Pethidine', 'oral', 100),
       ('clvdzrt6402wli8baqx80czir', 'Phenazepam', 'oral', 100),
       ('clvdzrt7802wxi8bae5i6kubd', 'Phenibut', 'oral', 100),
       ('clvdzrt8h02x9i8ba3lvrzvrv', 'Phenobarbital', 'oral', 100),
       ('clvdzrt9d02xji8bafbv3478z', 'Phenylpiracetam', 'oral', 100),
       ('clvdzrtag02xvi8babjiru4xv', 'Piracetam', 'oral', 100),
       ('clvdzrtbn02y7i8baqbdhf0j0', 'Pramiracetam', 'oral', 100),
       ('clvdzrtcr02yji8bau7zq2tn6', 'Pregabalin', 'oral', 90),
       ('clvdzrtcz02yli8ba3r3wi376', 'Pregabalin', 'rectal', 100),
       ('clvdzrtf202z7i8baj0aqzkti', 'Prochlorperazine', 'oral', 100),
       ('clvdzrtg102zhi8bakoqvyzgt', 'Prolintane', 'oral', 100),
       ('clvdzrth502zti8ba7rndwwgo', 'Promethazine', 'oral', 100),
       ('clvdzrtic0305i8bayygjkxgm', 'Propylhexedrine', 'oral', 100),
       ('clvdzrtjv030hi8ba1uaplgiy', 'Proscaline', 'oral', 100),
       ('clvdzrtl5030ti8baj9srgm5h', 'Psilocin', 'oral', 100),
       ('clvdzrtmd0315i8badwmuai6f', 'Psilocybin mushrooms', 'oral', 100),
       ('clvdzrtng031hi8basqhkz7vn', 'Pyrazolam', 'oral', 100),
       ('clvdzrtoj031ti8baxmrggr0h', 'Quetiapine', 'oral', 100),
       ('clvdzrtpr0325i8ba2vk9hxt6', 'Risperidone', 'oral', 100),
       ('clvdzrtqu032hi8ba69yh4r9o', 'Rolicyclidine', 'insufflated', 100),
       ('clvdzrtr0032ji8bayl0j51cc', 'Rolicyclidine', 'oral', 100),
       ('clvdzrtr6032li8ba0rng560d', 'Rolicyclidine', 'smoked', 100),
       ('clvdzrttt033bi8ba1cta0yx9', 'SAM-e', 'oral', 100),
       ('clvdzrtv6033ni8ba3yvi52eg', 'STS-135', 'smoked', 100),
       ('clvdzrtwg033zi8bathcdkjfm', 'Salvinorin A', 'smoked', 100),
       ('clvdzrtwm0341i8ba942lxb8b', 'Salvinorin A', 'sublingual', 100),
       ('clvdzrtwx0343i8baabvfsyok', 'Secobarbital', 'oral', 100),
       ('clvdzrtxv034di8ba0qp6yzn0', 'Sufentanil', 'intravenous', 100),
       ('clvdzrtz0034pi8baqawk18tz', 'THJ-018', 'smoked', 100),
       ('clvdzru040351i8baqu5n5dii', 'THJ-2201', 'smoked', 100),
       ('clvdzru1e035di8bacttclkk7', 'TMA-2', 'oral', 100),
       ('clvdzru2n035pi8ba0bcnzpk8', 'TMA-6', 'oral', 100),
       ('clvdzru3w0361i8bawc7nk8lt', 'Tapentadol', 'oral', 100),
       ('clvdzru59036di8barjw7jtli', 'Temazepam', 'oral', 100),
       ('clvdzru6d036pi8ba7zmp34ij', 'Theacrine', 'insufflated', 100),
       ('clvdzru6l036ri8ba292a0h0l', 'Theacrine', 'oral', 100),
       ('clvdzru8k0377i8bact6krrud', 'Theanine', 'oral', 100),
       ('clvdzru9r037ji8baabqjssfd', 'Tianeptine', 'oral', 100),
       ('clvdzrub0037vi8baw2b6vgmj', 'Tilidin', 'oral', 100),
       ('clvdzruc90387i8ba0wky7fof', 'Tizanidine', 'oral', 100),
       ('clvdzrudk038ji8ba1h0y7a6h', 'Tramadol', 'oral', 70),
       ('clvdzrueu038vi8bak8qv1bpl', 'Tyrosine', 'oral', 100),
       ('clvdzrug40397i8bav6oepoxy', 'U-47700', 'insufflated', 100),
       ('clvdzruh9039ji8bak9nnrdpb', 'Zolpidem', 'oral', 100),
       ('clvdzruid039vi8bare17s0fh', 'Zopiclone', 'oral', 100),
       ('clvdzrujp03a7i8badoyocqhc', 'ΑMT', 'oral', 100),
       ('clvdzrul203aji8batmuvpstg', 'Βk-2C-B', 'oral', 100);

insert into main.Dosage (id, intensivity, amount_min, amount_max, unit, perKilogram, routeOfAdministrationId)
values ('clvdzriif0005i8baijl7g2pi', 'threshold', 0.5, 0.5, 'mL', 0, 'clvdzrii70003i8ba05if1k7w'),
       ('clvdzriik0007i8ba9gmdmuwx', 'light', 0.5, 1, 'mL', 0, 'clvdzrii70003i8ba05if1k7w'),
       ('clvdzriio0009i8ba1qaey840', 'common', 1, 2.5, 'mL', 0, 'clvdzrii70003i8ba05if1k7w'),
       ('clvdzriiu000bi8ba0mz0vtag', 'strong', 2.5, 4, 'mL', 0, 'clvdzrii70003i8ba05if1k7w'),
       ('clvdzriiy000di8badmef9gkg', 'heavy', 4, 4, 'mL', 0, 'clvdzrii70003i8ba05if1k7w'),
       ('clvdzrij9000hi8baxnam59y9', 'threshold', 25, 25, 'µg', 0, 'clvdzrij4000fi8ba0u4dwj2o'),
       ('clvdzrije000ji8ba6zm5d54k', 'light', 30, 60, 'µg', 0, 'clvdzrij4000fi8ba0u4dwj2o'),
       ('clvdzrijj000li8bao8w8ywst', 'common', 60, 100, 'µg', 0, 'clvdzrij4000fi8ba0u4dwj2o'),
       ('clvdzrijo000ni8bayvdata2w', 'strong', 100, 200, 'µg', 0, 'clvdzrij4000fi8ba0u4dwj2o'),
       ('clvdzriju000pi8bahjg0xlbb', 'heavy', 200, 200, 'µg', 0, 'clvdzrij4000fi8ba0u4dwj2o'),
       ('clvdzrik8000ti8ba33nyqyeh', 'threshold', 15, 15, 'µg', 0, 'clvdzrik0000ri8ba08z2rzgi'),
       ('clvdzrike000vi8ba61kvwoh5', 'light', 25, 75, 'µg', 0, 'clvdzrik0000ri8ba08z2rzgi'),
       ('clvdzrikj000xi8baicoaz8bx', 'common', 75, 150, 'µg', 0, 'clvdzrik0000ri8ba08z2rzgi'),
       ('clvdzriko000zi8barkswsuxn', 'strong', 150, 300, 'µg', 0, 'clvdzrik0000ri8ba08z2rzgi'),
       ('clvdzrikt0011i8ba0ryzjq5e', 'heavy', 300, 300, 'µg', 0, 'clvdzrik0000ri8ba08z2rzgi'),
       ('clvdzril40015i8ba9y2152l3', 'threshold', 15, 15, 'µg', 0, 'clvdzriky0013i8bahc563zp5'),
       ('clvdzrila0017i8barkik5vl3', 'light', 25, 75, 'µg', 0, 'clvdzriky0013i8bahc563zp5'),
       ('clvdzrili0019i8baqmj51g14', 'common', 75, 150, 'µg', 0, 'clvdzriky0013i8bahc563zp5'),
       ('clvdzrils001bi8bax4hd3zc9', 'strong', 150, 300, 'µg', 0, 'clvdzriky0013i8bahc563zp5'),
       ('clvdzrim1001di8ban6ockowt', 'heavy', 300, 300, 'µg', 0, 'clvdzriky0013i8bahc563zp5'),
       ('clvdzrimk001hi8badxdi7ztg', 'threshold', 20, 20, 'µg', 0, 'clvdzrim9001fi8ba5bz15dsy'),
       ('clvdzrims001ji8bafyzosm7l', 'light', 50, 100, 'µg', 0, 'clvdzrim9001fi8ba5bz15dsy'),
       ('clvdzrin1001li8bahokhf6fa', 'common', 100, 225, 'µg', 0, 'clvdzrim9001fi8ba5bz15dsy'),
       ('clvdzrin9001ni8ba2p4mxsba', 'strong', 225, 350, 'µg', 0, 'clvdzrim9001fi8ba5bz15dsy'),
       ('clvdzrinf001pi8ba33qmn2m8', 'heavy', 350, 350, 'µg', 0, 'clvdzrim9001fi8ba5bz15dsy'),
       ('clvdzrinu001ti8bafz0rigfz', 'threshold', 15, 15, 'µg', 0, 'clvdzrinm001ri8bazus0mx33'),
       ('clvdzrinz001vi8bavgfb8n5p', 'light', 25, 75, 'µg', 0, 'clvdzrinm001ri8bazus0mx33'),
       ('clvdzrio5001xi8baja8tikbb', 'common', 75, 150, 'µg', 0, 'clvdzrinm001ri8bazus0mx33'),
       ('clvdzrioe001zi8badd6rvqxb', 'strong', 150, 300, 'µg', 0, 'clvdzrinm001ri8bazus0mx33'),
       ('clvdzriol0021i8baqrfj14u2', 'heavy', 300, 300, 'µg', 0, 'clvdzrinm001ri8bazus0mx33'),
       ('clvdzrioz0025i8bareec2ass', 'threshold', 50, 50, 'µg', 0, 'clvdzrior0023i8ba9ncfm6dx'),
       ('clvdzrip60027i8bar3q5i47i', 'light', 100, 150, 'µg', 0, 'clvdzrior0023i8ba9ncfm6dx'),
       ('clvdzripc0029i8bay7e1941t', 'common', 150, 200, 'µg', 0, 'clvdzrior0023i8ba9ncfm6dx'),
       ('clvdzripj002bi8bad0n95ydq', 'strong', 200, 250, 'µg', 0, 'clvdzrior0023i8ba9ncfm6dx'),
       ('clvdzripq002di8bat58vm8c5', 'heavy', 300, 300, 'µg', 0, 'clvdzrior0023i8ba9ncfm6dx'),
       ('clvdzriqa002hi8baqgr9i3n8', 'threshold', 3, 3, 'mg', 0, 'clvdzripx002fi8ba7cqrousu'),
       ('clvdzriqk002ji8ba35jlcbi3', 'light', 5, 10, 'mg', 0, 'clvdzripx002fi8ba7cqrousu'),
       ('clvdzriqq002li8ba4uwdnxed', 'common', 10, 20, 'mg', 0, 'clvdzripx002fi8ba7cqrousu'),
       ('clvdzriqy002ni8barzjncuj8', 'strong', 20, 40, 'mg', 0, 'clvdzripx002fi8ba7cqrousu'),
       ('clvdzrir8002pi8ba18prl3zk', 'heavy', 40, 40, 'mg', 0, 'clvdzripx002fi8ba7cqrousu'),
       ('clvdzrirq002ti8bawcce35do', 'threshold', 5, 5, 'mg', 0, 'clvdzrirh002ri8bax48qps1a'),
       ('clvdzrirz002vi8ba3jwcqhjh', 'light', 15, 30, 'mg', 0, 'clvdzrirh002ri8bax48qps1a'),
       ('clvdzris5002xi8bacg8gxrr3', 'common', 30, 50, 'mg', 0, 'clvdzrirh002ri8bax48qps1a'),
       ('clvdzrisa002zi8ba1gdwd308', 'strong', 50, 60, 'mg', 0, 'clvdzrirh002ri8bax48qps1a'),
       ('clvdzrisj0031i8ba5w60gjwo', 'heavy', 60, 60, 'mg', 0, 'clvdzrirh002ri8bax48qps1a'),
       ('clvdzrisz0035i8bax6tdyblb', 'threshold', 15, 15, 'mg', 0, 'clvdzrisq0033i8bapwga3jbl'),
       ('clvdzrit70037i8bajkuozilw', 'light', 20, 30, 'mg', 0, 'clvdzrisq0033i8bapwga3jbl'),
       ('clvdzritf0039i8bawc2de75v', 'common', 30, 40, 'mg', 0, 'clvdzrisq0033i8bapwga3jbl'),
       ('clvdzritl003bi8bafdtcjv8e', 'strong', 40, 60, 'mg', 0, 'clvdzrisq0033i8bapwga3jbl'),
       ('clvdzritt003di8ban2zefsa1', 'heavy', 60, 60, 'mg', 0, 'clvdzrisq0033i8bapwga3jbl'),
       ('clvdzriud003ji8bays6x2ovz', 'threshold', 5, 5, 'mg', 0, 'clvdzriu2003fi8ba2pfgu7b2'),
       ('clvdzriuk003li8bavdtkydd5', 'light', 5, 15, 'mg', 0, 'clvdzriu2003fi8ba2pfgu7b2'),
       ('clvdzrius003ni8ba7dosjgq3', 'common', 15, 30, 'mg', 0, 'clvdzriu2003fi8ba2pfgu7b2'),
       ('clvdzriuz003pi8baaxbm3d2e', 'strong', 30, 50, 'mg', 0, 'clvdzriu2003fi8ba2pfgu7b2'),
       ('clvdzriv4003ri8ba8in2sslb', 'heavy', 50, 50, 'mg', 0, 'clvdzriu2003fi8ba2pfgu7b2'),
       ('clvdzrivb003ti8bajt474fbk', 'threshold', 5, 5, 'mg', 0, 'clvdzriu8003hi8ba8fm5oev3'),
       ('clvdzrivj003vi8ba6zjv3h4f', 'light', 5, 15, 'mg', 0, 'clvdzriu8003hi8ba8fm5oev3'),
       ('clvdzrivp003xi8bayq6ax8ul', 'common', 15, 30, 'mg', 0, 'clvdzriu8003hi8ba8fm5oev3'),
       ('clvdzrivw003zi8ba4566orve', 'strong', 30, 50, 'mg', 0, 'clvdzriu8003hi8ba8fm5oev3'),
       ('clvdzriw20041i8babqyolf77', 'heavy', 50, 50, 'mg', 0, 'clvdzriu8003hi8ba8fm5oev3'),
       ('clvdzriwn0047i8babwvoasev', 'threshold', 5, 5, 'mg', 0, 'clvdzriw80043i8bafctua30t'),
       ('clvdzriwv0049i8bae7i01mxa', 'light', 10, 45, 'mg', 0, 'clvdzriw80043i8bafctua30t'),
       ('clvdzrix1004bi8bao1v0pech', 'common', 45, 100, 'mg', 0, 'clvdzriw80043i8bafctua30t'),
       ('clvdzrix6004di8bakzdfa2sd', 'strong', 100, 175, 'mg', 0, 'clvdzriw80043i8bafctua30t'),
       ('clvdzrixe004fi8ba7g9l5qus', 'heavy', 175, 175, 'mg', 0, 'clvdzriw80043i8bafctua30t'),
       ('clvdzrixm004hi8ba494gdnh8', 'threshold', 5, 5, 'mg', 0, 'clvdzriwf0045i8bavsu9prbz'),
       ('clvdzrixs004ji8ba3pjnn9np', 'light', 10, 25, 'mg', 0, 'clvdzriwf0045i8bavsu9prbz'),
       ('clvdzrixx004li8bawmvk0bll', 'common', 25, 70, 'mg', 0, 'clvdzriwf0045i8bavsu9prbz'),
       ('clvdzriy5004ni8bak88wrwed', 'strong', 70, 140, 'mg', 0, 'clvdzriwf0045i8bavsu9prbz'),
       ('clvdzriyc004pi8ba7dkvw33r', 'heavy', 140, 140, 'mg', 0, 'clvdzriwf0045i8bavsu9prbz'),
       ('clvdzriyq004ti8bacq973rcb', 'threshold', 10, 10, 'mg', 0, 'clvdzriyi004ri8baeu4j8t5o'),
       ('clvdzriyx004vi8ba940czrgq', 'light', 10, 15, 'mg', 0, 'clvdzriyi004ri8baeu4j8t5o'),
       ('clvdzriz3004xi8bab5qb005b', 'common', 15, 20, 'mg', 0, 'clvdzriyi004ri8baeu4j8t5o'),
       ('clvdzrizb004zi8ba0o56y52c', 'strong', 20, 25, 'mg', 0, 'clvdzriyi004ri8baeu4j8t5o'),
       ('clvdzrizj0051i8bayrcc6yz8', 'heavy', 25, 25, 'mg', 0, 'clvdzriyi004ri8baeu4j8t5o'),
       ('clvdzrj030057i8bal36b2n1l', 'threshold', 25, 25, 'µg', 0, 'clvdzrizq0053i8bav2mnpwqy'),
       ('clvdzrj0b0059i8ba5g1jt57b', 'light', 50, 200, 'µg', 0, 'clvdzrizq0053i8bav2mnpwqy'),
       ('clvdzrj0i005bi8ba40vsweun', 'common', 200, 350, 'µg', 0, 'clvdzrizq0053i8bav2mnpwqy'),
       ('clvdzrj0o005di8baz8h1vplp', 'strong', 350, 500, 'µg', 0, 'clvdzrizq0053i8bav2mnpwqy'),
       ('clvdzrj0u005fi8badjjbsmof', 'threshold', 50, 50, 'µg', 0, 'clvdzrizw0055i8baujxpao4r'),
       ('clvdzrj10005hi8barlfo5abv', 'light', 100, 300, 'µg', 0, 'clvdzrizw0055i8baujxpao4r'),
       ('clvdzrj16005ji8baicp6v5zz', 'common', 300, 500, 'µg', 0, 'clvdzrizw0055i8baujxpao4r'),
       ('clvdzrj1e005li8ba5p17oua7', 'strong', 500, 700, 'µg', 0, 'clvdzrizw0055i8baujxpao4r'),
       ('clvdzrj1v005pi8bap1qtqlfd', 'threshold', 100, 100, 'µg', 0, 'clvdzrj1n005ni8basqxxwee1'),
       ('clvdzrj21005ri8ba5frwrn84', 'light', 250, 500, 'µg', 0, 'clvdzrj1n005ni8basqxxwee1'),
       ('clvdzrj28005ti8bauyx1dvbe', 'common', 500, 750, 'µg', 0, 'clvdzrj1n005ni8basqxxwee1'),
       ('clvdzrj2h005vi8ba6om9gmy6', 'strong', 750, 1000, 'µg', 0, 'clvdzrj1n005ni8basqxxwee1'),
       ('clvdzrj2u005zi8balpnk3w86', 'threshold', 50, 50, 'µg', 0, 'clvdzrj2n005xi8bayge773pp'),
       ('clvdzrj350061i8ba11k3tckb', 'light', 100, 300, 'µg', 0, 'clvdzrj2n005xi8bayge773pp'),
       ('clvdzrj3f0063i8ba3bknr8nm', 'common', 300, 700, 'µg', 0, 'clvdzrj2n005xi8bayge773pp'),
       ('clvdzrj3k0065i8bap2gnkhld', 'strong', 700, 1000, 'µg', 0, 'clvdzrj2n005xi8bayge773pp'),
       ('clvdzrj3z0069i8bavwjns041', 'threshold', 300, 300, 'µg', 0, 'clvdzrj3s0067i8ba7zrwkdq9'),
       ('clvdzrj47006bi8ba2lkz1mpl', 'light', 300, 800, 'µg', 0, 'clvdzrj3s0067i8ba7zrwkdq9'),
       ('clvdzrj4h006di8bajm3gxphb', 'common', 800, 1000, 'µg', 0, 'clvdzrj3s0067i8ba7zrwkdq9'),
       ('clvdzrj4q006fi8baq43oys15', 'strong', 1000, 1200, 'µg', 0, 'clvdzrj3s0067i8ba7zrwkdq9'),
       ('clvdzrj5c006ji8bazxrzhxlt', 'threshold', 50, 50, 'µg', 0, 'clvdzrj4z006hi8baxvwzqy7t'),
       ('clvdzrj5j006li8ba37dz8gis', 'light', 200, 500, 'µg', 0, 'clvdzrj4z006hi8baxvwzqy7t'),
       ('clvdzrj5s006ni8bafprdmf81', 'common', 500, 900, 'µg', 0, 'clvdzrj4z006hi8baxvwzqy7t'),
       ('clvdzrj62006pi8bain1npm4s', 'strong', 900, 1400, 'µg', 0, 'clvdzrj4z006hi8baxvwzqy7t'),
       ('clvdzrj6o006vi8baisx2f5e9', 'threshold', 50, 50, 'µg', 0, 'clvdzrj6a006ri8ba0ihsnci1'),
       ('clvdzrj6w006xi8ba7d0ptl87', 'light', 200, 500, 'µg', 0, 'clvdzrj6a006ri8ba0ihsnci1'),
       ('clvdzrj72006zi8bamt4k6gm8', 'common', 500, 700, 'µg', 0, 'clvdzrj6a006ri8ba0ihsnci1'),
       ('clvdzrj7a0071i8ba7x1vgeod', 'threshold', 50, 50, 'µg', 0, 'clvdzrj6h006ti8bacivh7jtz'),
       ('clvdzrj7i0073i8baa0xd3pfa', 'light', 200, 500, 'µg', 0, 'clvdzrj6h006ti8bacivh7jtz'),
       ('clvdzrj7p0075i8ba6j0soptb', 'common', 500, 700, 'µg', 0, 'clvdzrj6h006ti8bacivh7jtz'),
       ('clvdzrj7x0077i8ba54kq0jpn', 'strong', 700, 1000, 'µg', 0, 'clvdzrj6h006ti8bacivh7jtz'),
       ('clvdzrj8c007bi8bai770866u', 'threshold', 100, 100, 'µg', 0, 'clvdzrj840079i8bax6wqvr4l'),
       ('clvdzrj8h007di8ba2yat1h9u', 'light', 100, 300, 'µg', 0, 'clvdzrj840079i8bax6wqvr4l'),
       ('clvdzrj8p007fi8baiguz8m7q', 'common', 300, 800, 'µg', 0, 'clvdzrj840079i8bax6wqvr4l'),
       ('clvdzrj8w007hi8bafyy78df8', 'strong', 800, 1300, 'µg', 0, 'clvdzrj840079i8bax6wqvr4l'),
       ('clvdzrj9o007pi8ba83veow1c', 'threshold', 1, 1, 'mg', 0, 'clvdzrj93007ji8bacswpzph0'),
       ('clvdzrj9t007ri8baxu5ucb4q', 'light', 5, 8, 'mg', 0, 'clvdzrj93007ji8bacswpzph0'),
       ('clvdzrja0007ti8baqkvbi4nt', 'common', 8, 12, 'mg', 0, 'clvdzrj93007ji8bacswpzph0'),
       ('clvdzrja8007vi8baid1rk3lm', 'strong', 12, 23, 'mg', 0, 'clvdzrj93007ji8bacswpzph0'),
       ('clvdzrjaf007xi8basri2q4gx', 'heavy', 23, 23, 'mg', 0, 'clvdzrj93007ji8bacswpzph0'),
       ('clvdzrjak007zi8bakmpdr2re', 'threshold', 5, 5, 'mg', 0, 'clvdzrj99007li8bafclzdq1p'),
       ('clvdzrjau0081i8baywipyrej', 'light', 10, 15, 'mg', 0, 'clvdzrj99007li8bafclzdq1p'),
       ('clvdzrjb20083i8ba706077iv', 'common', 15, 25, 'mg', 0, 'clvdzrj99007li8bafclzdq1p'),
       ('clvdzrjb90085i8ba0xn5r3zd', 'strong', 25, 45, 'mg', 0, 'clvdzrj99007li8bafclzdq1p'),
       ('clvdzrjbh0087i8bahg623pcx', 'heavy', 45, 45, 'mg', 0, 'clvdzrj99007li8bafclzdq1p'),
       ('clvdzrjbp0089i8ba3q1op33b', 'threshold', 1, 1, 'mg', 0, 'clvdzrj9h007ni8bas2790prv'),
       ('clvdzrjbu008bi8bahl71vhmm', 'light', 5, 8, 'mg', 0, 'clvdzrj9h007ni8bas2790prv'),
       ('clvdzrjbz008di8bavf6bh54v', 'common', 8, 12, 'mg', 0, 'clvdzrj9h007ni8bas2790prv'),
       ('clvdzrjc5008fi8badauqmqsk', 'strong', 12, 23, 'mg', 0, 'clvdzrj9h007ni8bas2790prv'),
       ('clvdzrjce008hi8baf3h3jp8p', 'heavy', 23, 23, 'mg', 0, 'clvdzrj9h007ni8bas2790prv'),
       ('clvdzrjcs008li8bag3mycqyn', 'threshold', 2, 2, 'mg', 0, 'clvdzrjck008ji8baq14fs7q4'),
       ('clvdzrjcy008ni8baflexia6r', 'light', 5, 10, 'mg', 0, 'clvdzrjck008ji8baq14fs7q4'),
       ('clvdzrjd4008pi8ba73iq0pq6', 'common', 10, 18, 'mg', 0, 'clvdzrjck008ji8baq14fs7q4'),
       ('clvdzrjd9008ri8balme0p8vv', 'strong', 18, 25, 'mg', 0, 'clvdzrjck008ji8baq14fs7q4'),
       ('clvdzrjde008ti8ba16q4ys4a', 'heavy', 25, 25, 'mg', 0, 'clvdzrjck008ji8baq14fs7q4'),
       ('clvdzrjdt008xi8bahhakdq95', 'threshold', 5, 5, 'mg', 0, 'clvdzrjdm008vi8babeebv87v'),
       ('clvdzrjdz008zi8baw4b8yh1k', 'light', 15, 30, 'mg', 0, 'clvdzrjdm008vi8babeebv87v'),
       ('clvdzrje50091i8baj18t7a4m', 'common', 30, 50, 'mg', 0, 'clvdzrjdm008vi8babeebv87v'),
       ('clvdzrjec0093i8baf6uv1esn', 'strong', 50, 90, 'mg', 0, 'clvdzrjdm008vi8babeebv87v'),
       ('clvdzrjek0095i8bawpd5ex0i', 'heavy', 90, 90, 'mg', 0, 'clvdzrjdm008vi8babeebv87v'),
       ('clvdzrjf10099i8babgb74tkq', 'threshold', 3, 3, 'mg', 0, 'clvdzrjer0097i8ba71ltvjhk'),
       ('clvdzrjf7009bi8babsbenjx5', 'light', 10, 25, 'mg', 0, 'clvdzrjer0097i8ba71ltvjhk'),
       ('clvdzrjfd009di8baybbecxbn', 'common', 25, 50, 'mg', 0, 'clvdzrjer0097i8ba71ltvjhk'),
       ('clvdzrjfi009fi8ba7r3w09y3', 'strong', 50, 100, 'mg', 0, 'clvdzrjer0097i8ba71ltvjhk'),
       ('clvdzrjfp009hi8ba2b9njqlu', 'heavy', 100, 100, 'mg', 0, 'clvdzrjer0097i8ba71ltvjhk'),
       ('clvdzrjg9009ni8bazpzqtcbl', 'threshold', 1, 1, 'mg', 0, 'clvdzrjfv009ji8bazpo2ov2o'),
       ('clvdzrjgg009pi8barpn9up96', 'light', 1, 4, 'mg', 0, 'clvdzrjfv009ji8bazpo2ov2o'),
       ('clvdzrjgm009ri8ba2bcfb597', 'common', 4, 7, 'mg', 0, 'clvdzrjfv009ji8bazpo2ov2o'),
       ('clvdzrjgs009ti8bag8o2ai88', 'strong', 7, 14, 'mg', 0, 'clvdzrjfv009ji8bazpo2ov2o'),
       ('clvdzrjgx009vi8baoja2n63v', 'heavy', 14, 14, 'mg', 0, 'clvdzrjfv009ji8bazpo2ov2o'),
       ('clvdzrjh5009xi8baq9hj29mf', 'threshold', 2, 2, 'mg', 0, 'clvdzrjg1009li8bawufcvmee'),
       ('clvdzrjhg009zi8bap8evabib', 'light', 5, 10, 'mg', 0, 'clvdzrjg1009li8bawufcvmee'),
       ('clvdzrjhm00a1i8baqo2clc8h', 'common', 10, 15, 'mg', 0, 'clvdzrjg1009li8bawufcvmee'),
       ('clvdzrjhu00a3i8ba348yx588', 'strong', 15, 30, 'mg', 0, 'clvdzrjg1009li8bawufcvmee'),
       ('clvdzrji100a5i8ba7ajuz8eu', 'heavy', 30, 30, 'mg', 0, 'clvdzrjg1009li8bawufcvmee'),
       ('clvdzrjii00a9i8bafczfluof', 'threshold', 2, 2, 'mg', 0, 'clvdzrji900a7i8bahar8ky6w'),
       ('clvdzrjio00abi8baptuxjh09', 'light', 5, 10, 'mg', 0, 'clvdzrji900a7i8bahar8ky6w'),
       ('clvdzrjiv00adi8ba0ow30sgg', 'common', 10, 20, 'mg', 0, 'clvdzrji900a7i8bahar8ky6w'),
       ('clvdzrjj300afi8ba32nh0wc9', 'strong', 20, 30, 'mg', 0, 'clvdzrji900a7i8bahar8ky6w'),
       ('clvdzrjjg00ahi8bawlis8n5f', 'heavy', 30, 30, 'mg', 0, 'clvdzrji900a7i8bahar8ky6w'),
       ('clvdzrjjv00ali8babnxhnhin', 'threshold', 1, 1, 'mg', 0, 'clvdzrjjn00aji8baol4wci3l'),
       ('clvdzrjk600ani8bano3ynr5u', 'light', 2, 6, 'mg', 0, 'clvdzrjjn00aji8baol4wci3l'),
       ('clvdzrjkd00api8batqwjcxsz', 'common', 6, 10, 'mg', 0, 'clvdzrjjn00aji8baol4wci3l'),
       ('clvdzrjkl00ari8baf374zgnv', 'strong', 10, 16, 'mg', 0, 'clvdzrjjn00aji8baol4wci3l'),
       ('clvdzrjkw00ati8ba415i1n20', 'heavy', 16, 16, 'mg', 0, 'clvdzrjjn00aji8baol4wci3l'),
       ('clvdzrjlc00axi8bar818ae83', 'threshold', 20, 20, 'mg', 0, 'clvdzrjl300avi8baazisjvfp'),
       ('clvdzrjli00azi8ba76xorup1', 'light', 40, 60, 'mg', 0, 'clvdzrjl300avi8baazisjvfp'),
       ('clvdzrjlp00b1i8bavwn595qb', 'common', 60, 100, 'mg', 0, 'clvdzrjl300avi8baazisjvfp'),
       ('clvdzrjlw00b3i8bas0wu9yzs', 'strong', 100, 120, 'mg', 0, 'clvdzrjl300avi8baazisjvfp'),
       ('clvdzrjm500b5i8badd95ohx2', 'heavy', 125, 125, 'mg', 0, 'clvdzrjl300avi8baazisjvfp'),
       ('clvdzrjmp00bbi8ba1i7axkr6', 'threshold', 1, 1, 'mg', 0, 'clvdzrjmc00b7i8bayv68zn0q'),
       ('clvdzrjmw00bdi8ba7fy54u26', 'light', 5, 10, 'mg', 0, 'clvdzrjmc00b7i8bayv68zn0q'),
       ('clvdzrjn400bfi8baaintbg1s', 'common', 10, 20, 'mg', 0, 'clvdzrjmc00b7i8bayv68zn0q'),
       ('clvdzrjnc00bhi8baho9e7a5e', 'strong', 20, 25, 'mg', 0, 'clvdzrjmc00b7i8bayv68zn0q'),
       ('clvdzrjnh00bji8ba5fhdq2m7', 'heavy', 25, 25, 'mg', 0, 'clvdzrjmc00b7i8bayv68zn0q'),
       ('clvdzrjnp00bli8bawdjcmkxq', 'threshold', 3, 3, 'mg', 0, 'clvdzrjmh00b9i8ba03gwcerm'),
       ('clvdzrjnv00bni8bafu6xf3wl', 'light', 5, 10, 'mg', 0, 'clvdzrjmh00b9i8ba03gwcerm'),
       ('clvdzrjo400bpi8bazzx6ihp5', 'common', 10, 20, 'mg', 0, 'clvdzrjmh00b9i8ba03gwcerm'),
       ('clvdzrjoc00bri8baluxw6ly2', 'strong', 20, 30, 'mg', 0, 'clvdzrjmh00b9i8ba03gwcerm'),
       ('clvdzrjok00bti8baboz8sewt', 'heavy', 30, 30, 'mg', 0, 'clvdzrjmh00b9i8ba03gwcerm'),
       ('clvdzrjoz00bxi8baktfsw9o5', 'threshold', 5, 5, 'mg', 0, 'clvdzrjor00bvi8baf1125fah'),
       ('clvdzrjp700bzi8bawsxmb56p', 'light', 5, 10, 'mg', 0, 'clvdzrjor00bvi8baf1125fah'),
       ('clvdzrjpf00c1i8ba98542izh', 'common', 10, 12, 'mg', 0, 'clvdzrjor00bvi8baf1125fah'),
       ('clvdzrjpn00c3i8baawgc5myi', 'strong', 12, 15, 'mg', 0, 'clvdzrjor00bvi8baf1125fah'),
       ('clvdzrjpu00c5i8ba4ljclo27', 'heavy', 15, 15, 'mg', 0, 'clvdzrjor00bvi8baf1125fah'),
       ('clvdzrjql00cbi8bamyy1g5nk', 'threshold', 1, 1, 'mg', 0, 'clvdzrjq100c7i8bai5oq2xxc'),
       ('clvdzrjqs00cdi8ba3jn14uww', 'light', 2, 5, 'mg', 0, 'clvdzrjq100c7i8bai5oq2xxc'),
       ('clvdzrjr100cfi8ba2mt2bnzj', 'common', 5, 10, 'mg', 0, 'clvdzrjq100c7i8bai5oq2xxc'),
       ('clvdzrjra00chi8ba3fz417sm', 'strong', 10, 15, 'mg', 0, 'clvdzrjq100c7i8bai5oq2xxc'),
       ('clvdzrjrj00cji8bao61nrc8k', 'threshold', 3, 3, 'mg', 0, 'clvdzrjq900c9i8ba56d8n6w7'),
       ('clvdzrjrs00cli8ba4ngokop5', 'light', 10, 15, 'mg', 0, 'clvdzrjq900c9i8ba56d8n6w7'),
       ('clvdzrjrz00cni8baq6s879c7', 'common', 15, 25, 'mg', 0, 'clvdzrjq900c9i8ba56d8n6w7'),
       ('clvdzrjs800cpi8bag3gkykb5', 'strong', 25, 40, 'mg', 0, 'clvdzrjq900c9i8ba56d8n6w7'),
       ('clvdzrjsg00cri8bax75sq3gk', 'heavy', 40, 40, 'mg', 0, 'clvdzrjq900c9i8ba56d8n6w7'),
       ('clvdzrjsu00cvi8ba75lr9yer', 'threshold', 0.5, 0.5, 'mL', 0, 'clvdzrjso00cti8bat9j58hxw'),
       ('clvdzrjt200cxi8badriyusa7', 'light', 1, 5, 'mL', 0, 'clvdzrjso00cti8bat9j58hxw'),
       ('clvdzrjta00czi8ba0m9kv6rs', 'common', 5, 10, 'mL', 0, 'clvdzrjso00cti8bat9j58hxw'),
       ('clvdzrjth00d1i8bad60qcdtz', 'strong', 10, 15, 'mL', 0, 'clvdzrjso00cti8bat9j58hxw'),
       ('clvdzrjto00d3i8ba6ki1bn3c', 'heavy', 15, 15, 'mL', 0, 'clvdzrjso00cti8bat9j58hxw'),
       ('clvdzrju600d7i8baibces6jk', 'threshold', 2, 2, 'mg', 0, 'clvdzrjtx00d5i8baytuenwe8'),
       ('clvdzrjuf00d9i8ba16tor5pd', 'light', 2, 4, 'mg', 0, 'clvdzrjtx00d5i8baytuenwe8'),
       ('clvdzrjum00dbi8badp9bngu6', 'common', 4, 6, 'mg', 0, 'clvdzrjtx00d5i8baytuenwe8'),
       ('clvdzrjus00ddi8baux0tq872', 'strong', 6, 8, 'mg', 0, 'clvdzrjtx00d5i8baytuenwe8'),
       ('clvdzrjuy00dfi8ba2tka3r0l', 'heavy', 8, 8, 'mg', 0, 'clvdzrjtx00d5i8baytuenwe8'),
       ('clvdzrjve00dji8barpwkjbn6', 'threshold', 10, 10, 'mg', 0, 'clvdzrjv500dhi8bao1967x6r'),
       ('clvdzrjvm00dli8baje5y0yua', 'light', 20, 30, 'mg', 0, 'clvdzrjv500dhi8bao1967x6r'),
       ('clvdzrjvw00dni8baczxwz5p8', 'common', 30, 50, 'mg', 0, 'clvdzrjv500dhi8bao1967x6r'),
       ('clvdzrjw400dpi8batohxqwcd', 'strong', 50, 70, 'mg', 0, 'clvdzrjv500dhi8bao1967x6r'),
       ('clvdzrjwb00dri8bahq6nlj8f', 'heavy', 70, 70, 'mg', 0, 'clvdzrjv500dhi8bao1967x6r'),
       ('clvdzrjwz00dxi8bacsimhvl6', 'threshold', 15, 15, 'mg', 0, 'clvdzrjwl00dti8baxjktxwiz'),
       ('clvdzrjx900dzi8bafywl2jk6', 'light', 20, 35, 'mg', 0, 'clvdzrjwl00dti8baxjktxwiz'),
       ('clvdzrjxh00e1i8ba8fzagapk', 'common', 35, 60, 'mg', 0, 'clvdzrjwl00dti8baxjktxwiz'),
       ('clvdzrjxo00e3i8baqlj4sjza', 'strong', 50, 60, 'mg', 0, 'clvdzrjwl00dti8baxjktxwiz'),
       ('clvdzrjxw00e5i8bacz36rgwc', 'heavy', 60, 60, 'mg', 0, 'clvdzrjwl00dti8baxjktxwiz'),
       ('clvdzrjy300e7i8bavqfeyvqf', 'threshold', 15, 15, 'mg', 0, 'clvdzrjws00dvi8baox7lp281'),
       ('clvdzrjy900e9i8bahlh4hi70', 'light', 20, 35, 'mg', 0, 'clvdzrjws00dvi8baox7lp281'),
       ('clvdzrjye00ebi8ba65akzogh', 'common', 35, 70, 'mg', 0, 'clvdzrjws00dvi8baox7lp281'),
       ('clvdzrjym00edi8barj25d9cn', 'strong', 70, 90, 'mg', 0, 'clvdzrjws00dvi8baox7lp281'),
       ('clvdzrjyt00efi8ba8hhray9w', 'heavy', 90, 90, 'mg', 0, 'clvdzrjws00dvi8baox7lp281'),
       ('clvdzrjz600eji8babi0lhnf7', 'threshold', 5, 5, 'mg', 0, 'clvdzrjyz00ehi8baczu0k1a6'),
       ('clvdzrjzd00eli8babfxyb14k', 'light', 10, 20, 'mg', 0, 'clvdzrjyz00ehi8baczu0k1a6'),
       ('clvdzrjzk00eni8bajru7yo54', 'common', 20, 35, 'mg', 0, 'clvdzrjyz00ehi8baczu0k1a6'),
       ('clvdzrjzp00epi8ban0zqibpn', 'strong', 35, 50, 'mg', 0, 'clvdzrjyz00ehi8baczu0k1a6'),
       ('clvdzrjzu00eri8bayx9c2i7v', 'heavy', 50, 50, 'mg', 0, 'clvdzrjyz00ehi8baczu0k1a6'),
       ('clvdzrk0e00exi8ba07lw7rpa', 'threshold', 5, 5, 'mg', 0, 'clvdzrk0100eti8basn99tgsj'),
       ('clvdzrk0j00ezi8ban885rhkh', 'light', 10, 20, 'mg', 0, 'clvdzrk0100eti8basn99tgsj'),
       ('clvdzrk0p00f1i8bamwwys9h8', 'common', 20, 35, 'mg', 0, 'clvdzrk0100eti8basn99tgsj'),
       ('clvdzrk0x00f3i8ba1c132wzf', 'strong', 35, 50, 'mg', 0, 'clvdzrk0100eti8basn99tgsj'),
       ('clvdzrk1400f5i8baw2lgxo3n', 'threshold', 10, 10, 'mg', 0, 'clvdzrk0900evi8ba11qx1gvn'),
       ('clvdzrk1b00f7i8baf07um6cp', 'light', 10, 30, 'mg', 0, 'clvdzrk0900evi8ba11qx1gvn'),
       ('clvdzrk1k00f9i8ba74z67hqw', 'common', 30, 60, 'mg', 0, 'clvdzrk0900evi8ba11qx1gvn'),
       ('clvdzrk1r00fbi8baoz46bgel', 'strong', 60, 90, 'mg', 0, 'clvdzrk0900evi8ba11qx1gvn'),
       ('clvdzrk1x00fdi8bago3kp6gq', 'heavy', 90, 90, 'mg', 0, 'clvdzrk0900evi8ba11qx1gvn'),
       ('clvdzrk2c00fhi8ba213k8h40', 'threshold', 5, 5, 'mg', 0, 'clvdzrk2500ffi8baoc5ak49g'),
       ('clvdzrk2h00fji8ba65hj5k1f', 'light', 5, 10, 'mg', 0, 'clvdzrk2500ffi8baoc5ak49g'),
       ('clvdzrk2o00fli8bacjhrskof', 'common', 10, 15, 'mg', 0, 'clvdzrk2500ffi8baoc5ak49g'),
       ('clvdzrk2v00fni8baamwumjyj', 'strong', 15, 25, 'mg', 0, 'clvdzrk2500ffi8baoc5ak49g'),
       ('clvdzrk3200fpi8bae1qwyth7', 'heavy', 25, 25, 'mg', 0, 'clvdzrk2500ffi8baoc5ak49g'),
       ('clvdzrk3g00fti8bavzwwftsb', 'threshold', 1, 1, 'mg', 0, 'clvdzrk3800fri8ba530rieo5'),
       ('clvdzrk3n00fvi8ba9biir4rr', 'light', 2, 4, 'mg', 0, 'clvdzrk3800fri8ba530rieo5'),
       ('clvdzrk3t00fxi8basbfhdm1b', 'common', 4, 6, 'mg', 0, 'clvdzrk3800fri8ba530rieo5'),
       ('clvdzrk4100fzi8bawoci99of', 'strong', 6, 8, 'mg', 0, 'clvdzrk3800fri8ba530rieo5'),
       ('clvdzrk4800g1i8ba1mhgyybp', 'heavy', 8, 8, 'mg', 0, 'clvdzrk3800fri8ba530rieo5'),
       ('clvdzrk4q00g7i8bauesrey6u', 'threshold', 10, 10, 'mg', 0, 'clvdzrk4f00g3i8ba5a2robhl'),
       ('clvdzrk4w00g9i8baubqr78w5', 'light', 20, 40, 'mg', 0, 'clvdzrk4f00g3i8ba5a2robhl'),
       ('clvdzrk5400gbi8ba0ovcvyxe', 'common', 40, 60, 'mg', 0, 'clvdzrk4f00g3i8ba5a2robhl'),
       ('clvdzrk5a00gdi8baqe3gxl3v', 'strong', 60, 120, 'mg', 0, 'clvdzrk4f00g3i8ba5a2robhl'),
       ('clvdzrk5k00gfi8badwmgdktv', 'heavy', 120, 120, 'mg', 0, 'clvdzrk4f00g3i8ba5a2robhl'),
       ('clvdzrk5s00ghi8ba02qah8uz', 'threshold', 25, 25, 'mg', 0, 'clvdzrk4k00g5i8bayc4n2yhw'),
       ('clvdzrk6000gji8bausdce0q2', 'light', 50, 150, 'mg', 0, 'clvdzrk4k00g5i8bayc4n2yhw'),
       ('clvdzrk6700gli8ba3tsylmhj', 'common', 150, 250, 'mg', 0, 'clvdzrk4k00g5i8bayc4n2yhw'),
       ('clvdzrk6f00gni8bavl6xkw20', 'strong', 250, 350, 'mg', 0, 'clvdzrk4k00g5i8bayc4n2yhw'),
       ('clvdzrk6q00gpi8ba3wl2o715', 'heavy', 350, 350, 'mg', 0, 'clvdzrk4k00g5i8bayc4n2yhw'),
       ('clvdzrk7d00gvi8baarlt91kg', 'threshold', 1, 1, 'mg', 0, 'clvdzrk6w00gri8ba4fjqn0wg'),
       ('clvdzrk7i00gxi8baoqk20aex', 'light', 3, 6, 'mg', 0, 'clvdzrk6w00gri8ba4fjqn0wg'),
       ('clvdzrk7p00gzi8bax63gnicn', 'common', 6, 12, 'mg', 0, 'clvdzrk6w00gri8ba4fjqn0wg'),
       ('clvdzrk7w00h1i8ba53anrrr6', 'strong', 12, 20, 'mg', 0, 'clvdzrk6w00gri8ba4fjqn0wg'),
       ('clvdzrk8300h3i8baqhqxkcq0', 'heavy', 20, 20, 'mg', 0, 'clvdzrk6w00gri8ba4fjqn0wg'),
       ('clvdzrk8a00h5i8badew1r569', 'threshold', 2, 2, 'mg', 0, 'clvdzrk7500gti8ba7wx602qn'),
       ('clvdzrk8h00h7i8baomv1x6br', 'light', 4, 8, 'mg', 0, 'clvdzrk7500gti8ba7wx602qn'),
       ('clvdzrk8n00h9i8ba1qoh6sok', 'common', 8, 15, 'mg', 0, 'clvdzrk7500gti8ba7wx602qn'),
       ('clvdzrk8s00hbi8bafyfnc4mi', 'strong', 15, 25, 'mg', 0, 'clvdzrk7500gti8ba7wx602qn'),
       ('clvdzrk8x00hdi8bacwswe06t', 'heavy', 25, 25, 'mg', 0, 'clvdzrk7500gti8ba7wx602qn'),
       ('clvdzrk9e00hhi8baf7o8danh', 'threshold', 50, 50, 'mg', 0, 'clvdzrk9400hfi8baula0udey'),
       ('clvdzrk9p00hji8baw07dca17', 'light', 100, 200, 'mg', 0, 'clvdzrk9400hfi8baula0udey'),
       ('clvdzrk9y00hli8ba8j25b07j', 'common', 200, 300, 'mg', 0, 'clvdzrk9400hfi8baula0udey'),
       ('clvdzrka500hni8ba70z4ihxz', 'strong', 300, 400, 'mg', 0, 'clvdzrk9400hfi8baula0udey'),
       ('clvdzrkad00hpi8baw0u4vw42', 'heavy', 400, 400, 'mg', 0, 'clvdzrk9400hfi8baula0udey'),
       ('clvdzrkb900hxi8balfqrktlq', 'threshold', 1, 1, 'mg', 0, 'clvdzrkak00hri8bafph9p7lm'),
       ('clvdzrkbh00hzi8bazym78vg3', 'light', 2, 5, 'mg', 0, 'clvdzrkak00hri8bafph9p7lm'),
       ('clvdzrkbn00i1i8ba8l3cqj2g', 'common', 5, 10, 'mg', 0, 'clvdzrkak00hri8bafph9p7lm'),
       ('clvdzrkbt00i3i8baljg391qz', 'strong', 10, 15, 'mg', 0, 'clvdzrkak00hri8bafph9p7lm'),
       ('clvdzrkc100i5i8badk2iyevb', 'threshold', 2, 2, 'mg', 0, 'clvdzrkas00hti8ba1t2680no'),
       ('clvdzrkc800i7i8bauolojnsd', 'light', 4, 8, 'mg', 0, 'clvdzrkas00hti8ba1t2680no'),
       ('clvdzrkci00i9i8baopmwoprl', 'common', 8, 15, 'mg', 0, 'clvdzrkas00hti8ba1t2680no'),
       ('clvdzrkcp00ibi8bayfifb41w', 'strong', 15, 25, 'mg', 0, 'clvdzrkas00hti8ba1t2680no'),
       ('clvdzrkcz00idi8ba8ka5hbuv', 'heavy', 25, 25, 'mg', 0, 'clvdzrkas00hti8ba1t2680no'),
       ('clvdzrkd600ifi8bay3oiqyee', 'threshold', 2, 2, 'mg', 0, 'clvdzrkb000hvi8baq05zd065'),
       ('clvdzrkdg00ihi8badrip7s3o', 'light', 5, 10, 'mg', 0, 'clvdzrkb000hvi8baq05zd065'),
       ('clvdzrkdn00iji8baiy2w82kf', 'common', 10, 20, 'mg', 0, 'clvdzrkb000hvi8baq05zd065'),
       ('clvdzrkdt00ili8bax8rx40da', 'strong', 20, 25, 'mg', 0, 'clvdzrkb000hvi8baq05zd065'),
       ('clvdzrke100ini8bauef21wo7', 'heavy', 25, 25, 'mg', 0, 'clvdzrkb000hvi8baq05zd065'),
       ('clvdzrken00iti8banxhpmn2x', 'threshold', 15, 15, 'mg', 0, 'clvdzrkea00ipi8ba6j38e9fx'),
       ('clvdzrkev00ivi8bay8dr3l7u', 'light', 20, 35, 'mg', 0, 'clvdzrkea00ipi8ba6j38e9fx'),
       ('clvdzrkf200ixi8bagemg7xyn', 'common', 35, 60, 'mg', 0, 'clvdzrkea00ipi8ba6j38e9fx'),
       ('clvdzrkf800izi8baeq67816j', 'strong', 60, 70, 'mg', 0, 'clvdzrkea00ipi8ba6j38e9fx'),
       ('clvdzrkfg00j1i8ba188wlgia', 'heavy', 70, 70, 'mg', 0, 'clvdzrkea00ipi8ba6j38e9fx'),
       ('clvdzrkfn00j3i8bappjprkbf', 'threshold', 20, 20, 'mg', 0, 'clvdzrkeg00iri8baoxmof44q'),
       ('clvdzrkft00j5i8ba0ezqykvq', 'light', 30, 40, 'mg', 0, 'clvdzrkeg00iri8baoxmof44q'),
       ('clvdzrkfz00j7i8ba2yds3q97', 'common', 40, 60, 'mg', 0, 'clvdzrkeg00iri8baoxmof44q'),
       ('clvdzrkg600j9i8ba6ld6e1ia', 'strong', 60, 80, 'mg', 0, 'clvdzrkeg00iri8baoxmof44q'),
       ('clvdzrkge00jbi8bacwngvtm3', 'heavy', 80, 80, 'mg', 0, 'clvdzrkeg00iri8baoxmof44q'),
       ('clvdzrkgx00jhi8ba9rsz4nxt', 'threshold', 5, 5, 'mg', 0, 'clvdzrkgp00jfi8ba4alrpdby'),
       ('clvdzrkh400jji8ba0p4ll9y7', 'light', 10, 15, 'mg', 0, 'clvdzrkgp00jfi8ba4alrpdby'),
       ('clvdzrkha00jli8baa85f81w1', 'common', 15, 20, 'mg', 0, 'clvdzrkgp00jfi8ba4alrpdby'),
       ('clvdzrkhg00jni8ba493naj75', 'strong', 20, 35, 'mg', 0, 'clvdzrkgp00jfi8ba4alrpdby'),
       ('clvdzrkho00jpi8ba8yqyme56', 'heavy', 35, 35, 'mg', 0, 'clvdzrkgp00jfi8ba4alrpdby'),
       ('clvdzrkia00jvi8bav71mqbm4', 'threshold', 5, 5, 'mg', 0, 'clvdzrkhv00jri8bac476awoa'),
       ('clvdzrkig00jxi8bak0jicn5n', 'light', 10, 15, 'mg', 0, 'clvdzrkhv00jri8bac476awoa'),
       ('clvdzrkim00jzi8ba1flwr431', 'common', 15, 25, 'mg', 0, 'clvdzrkhv00jri8bac476awoa'),
       ('clvdzrkis00k1i8ba7anowds8', 'strong', 25, 50, 'mg', 0, 'clvdzrkhv00jri8bac476awoa'),
       ('clvdzrkj000k3i8bar27c0ywu', 'heavy', 50, 50, 'mg', 0, 'clvdzrkhv00jri8bac476awoa'),
       ('clvdzrkj800k5i8ba1b2r3zfy', 'threshold', 5, 5, 'mg', 0, 'clvdzrki100jti8ba8qzy8yc0'),
       ('clvdzrkjc00k7i8ba4te69xm4', 'light', 7.5, 15, 'mg', 0, 'clvdzrki100jti8ba8qzy8yc0'),
       ('clvdzrkjh00k9i8bazzdrccde', 'common', 15, 25, 'mg', 0, 'clvdzrki100jti8ba8qzy8yc0'),
       ('clvdzrkjo00kbi8ba9cuuikne', 'strong', 25, 45, 'mg', 0, 'clvdzrki100jti8ba8qzy8yc0'),
       ('clvdzrkjx00kdi8ba9poy3h9o', 'heavy', 45, 45, 'mg', 0, 'clvdzrki100jti8ba8qzy8yc0'),
       ('clvdzrkkc00khi8bakvuudlkz', 'threshold', 3, 3, 'mg', 0, 'clvdzrkk300kfi8bay43t9mcg'),
       ('clvdzrkki00kji8bauj191zlv', 'light', 5, 15, 'mg', 0, 'clvdzrkk300kfi8bay43t9mcg'),
       ('clvdzrkko00kli8bap9rk7ly6', 'common', 15, 30, 'mg', 0, 'clvdzrkk300kfi8bay43t9mcg'),
       ('clvdzrkku00kni8balliz2466', 'strong', 30, 45, 'mg', 0, 'clvdzrkk300kfi8bay43t9mcg'),
       ('clvdzrkl000kpi8badvcx9wth', 'heavy', 45, 45, 'mg', 0, 'clvdzrkk300kfi8bay43t9mcg'),
       ('clvdzrkle00kti8bajn1ufjsk', 'threshold', 5, 5, 'mg', 0, 'clvdzrkl800kri8ba4azkmv82'),
       ('clvdzrklk00kvi8bakumhbibf', 'light', 10, 20, 'mg', 0, 'clvdzrkl800kri8ba4azkmv82'),
       ('clvdzrklt00kxi8baherwbaq9', 'common', 20, 30, 'mg', 0, 'clvdzrkl800kri8ba4azkmv82'),
       ('clvdzrkm100kzi8ba0fdqhqfl', 'strong', 30, 50, 'mg', 0, 'clvdzrkl800kri8ba4azkmv82'),
       ('clvdzrkm700l1i8ba2mmi3lb8', 'heavy', 50, 50, 'mg', 0, 'clvdzrkl800kri8ba4azkmv82'),
       ('clvdzrkmo00l5i8bai6q5tqzr', 'threshold', 5, 5, 'mg', 0, 'clvdzrkme00l3i8ba62qju2rs'),
       ('clvdzrkmu00l7i8bac16zasoy', 'light', 10, 15, 'mg', 0, 'clvdzrkme00l3i8ba62qju2rs'),
       ('clvdzrkmz00l9i8ba2ur9nodw', 'common', 15, 20, 'mg', 0, 'clvdzrkme00l3i8ba62qju2rs'),
       ('clvdzrkn800lbi8bab4fldjdw', 'strong', 20, 35, 'mg', 0, 'clvdzrkme00l3i8ba62qju2rs'),
       ('clvdzrknh00ldi8baq4lmwusq', 'heavy', 35, 35, 'mg', 0, 'clvdzrkme00l3i8ba62qju2rs'),
       ('clvdzrknv00lhi8bapkqe0d2x', 'threshold', 40, 40, 'mg', 0, 'clvdzrknn00lfi8ba2z0er445'),
       ('clvdzrko400lji8bacyu16sut', 'light', 40, 100, 'mg', 0, 'clvdzrknn00lfi8ba2z0er445'),
       ('clvdzrkob00lli8bazzej7swy', 'common', 100, 130, 'mg', 0, 'clvdzrknn00lfi8ba2z0er445'),
       ('clvdzrkok00lni8babimrtw6t', 'strong', 130, 150, 'mg', 0, 'clvdzrknn00lfi8ba2z0er445'),
       ('clvdzrkos00lpi8ba392tgqpi', 'heavy', 150, 150, 'mg', 0, 'clvdzrknn00lfi8ba2z0er445'),
       ('clvdzrkp400lti8bal42j5j2n', 'threshold', 10, 10, 'mg', 0, 'clvdzrkoy00lri8ba12x2a21z'),
       ('clvdzrkp900lvi8bax2ojw0si', 'light', 25, 50, 'mg', 0, 'clvdzrkoy00lri8ba12x2a21z'),
       ('clvdzrkph00lxi8bakb7jg5q8', 'common', 50, 75, 'mg', 0, 'clvdzrkoy00lri8ba12x2a21z'),
       ('clvdzrkpn00lzi8ba3rj011l7', 'strong', 100, 125, 'mg', 0, 'clvdzrkoy00lri8ba12x2a21z'),
       ('clvdzrkps00m1i8bankzqbabz', 'heavy', 125, 125, 'mg', 0, 'clvdzrkoy00lri8ba12x2a21z'),
       ('clvdzrkq800m5i8bagznmoy80', 'threshold', 5, 5, 'mg', 0, 'clvdzrkq100m3i8ba6e8fb8yl'),
       ('clvdzrkqd00m7i8ba2tyjqnyv', 'light', 10, 15, 'mg', 0, 'clvdzrkq100m3i8ba6e8fb8yl'),
       ('clvdzrkqi00m9i8bakew9z3fe', 'common', 20, 30, 'mg', 0, 'clvdzrkq100m3i8ba6e8fb8yl'),
       ('clvdzrkqo00mbi8ba2doj7lbo', 'strong', 30, 45, 'mg', 0, 'clvdzrkq100m3i8ba6e8fb8yl'),
       ('clvdzrkqu00mdi8baufpq3wyv', 'heavy', 45, 45, 'mg', 0, 'clvdzrkq100m3i8ba6e8fb8yl'),
       ('clvdzrkre00mji8bahlxrxhz9', 'threshold', 5, 5, 'mg', 0, 'clvdzrkr000mfi8bahhy1fbxo'),
       ('clvdzrkrl00mli8bayjtwpiun', 'light', 10, 15, 'mg', 0, 'clvdzrkr000mfi8bahhy1fbxo'),
       ('clvdzrkrr00mni8bahfdz58ut', 'common', 15, 25, 'mg', 0, 'clvdzrkr000mfi8bahhy1fbxo'),
       ('clvdzrkrw00mpi8bawrmnydbk', 'strong', 25, 35, 'mg', 0, 'clvdzrkr000mfi8bahhy1fbxo'),
       ('clvdzrks400mri8balzqsa2k2', 'heavy', 35, 35, 'mg', 0, 'clvdzrkr000mfi8bahhy1fbxo'),
       ('clvdzrksc00mti8ba6rq2ddjm', 'threshold', 20, 20, 'mg', 0, 'clvdzrkr600mhi8ba62hrodte'),
       ('clvdzrksi00mvi8baudyxqtzq', 'light', 40, 60, 'mg', 0, 'clvdzrkr600mhi8ba62hrodte'),
       ('clvdzrkso00mxi8ba1k9zkkzc', 'common', 60, 90, 'mg', 0, 'clvdzrkr600mhi8ba62hrodte'),
       ('clvdzrksw00mzi8bagog2dr7i', 'strong', 90, 130, 'mg', 0, 'clvdzrkr600mhi8ba62hrodte'),
       ('clvdzrkt200n1i8ba48zdteta', 'heavy', 130, 130, 'mg', 0, 'clvdzrkr600mhi8ba62hrodte'),
       ('clvdzrktf00n5i8bawtv7c1ca', 'threshold', 3, 3, 'mg', 0, 'clvdzrkt800n3i8badrnqcu5d'),
       ('clvdzrktl00n7i8baji925sqe', 'light', 3, 10, 'mg', 0, 'clvdzrkt800n3i8badrnqcu5d'),
       ('clvdzrkts00n9i8baxuzfykah', 'common', 10, 20, 'mg', 0, 'clvdzrkt800n3i8badrnqcu5d'),
       ('clvdzrkty00nbi8banhglzwcf', 'strong', 20, 30, 'mg', 0, 'clvdzrkt800n3i8badrnqcu5d'),
       ('clvdzrku700ndi8ba4lv152h8', 'heavy', 30, 30, 'mg', 0, 'clvdzrkt800n3i8badrnqcu5d'),
       ('clvdzrkuk00nhi8ba4x854qpp', 'light', 15, 20, 'mg', 0, 'clvdzrkuf00nfi8ba0fr34zyr'),
       ('clvdzrkuq00nji8bav8m2g7pn', 'common', 30, 40, 'mg', 0, 'clvdzrkuf00nfi8ba0fr34zyr'),
       ('clvdzrkuy00nli8bawadp2gyz', 'strong', 40, 60, 'mg', 0, 'clvdzrkuf00nfi8ba0fr34zyr'),
       ('clvdzrkvj00nri8bamqtn2nm2', 'threshold', 5, 5, 'mg', 0, 'clvdzrkv600nni8ba6zqo2ykp'),
       ('clvdzrkvp00nti8baim3hp72m', 'light', 5, 15, 'mg', 0, 'clvdzrkv600nni8ba6zqo2ykp'),
       ('clvdzrkvv00nvi8ba8zu9o2xx', 'common', 15, 25, 'mg', 0, 'clvdzrkv600nni8ba6zqo2ykp'),
       ('clvdzrkw100nxi8ba3086z0xk', 'strong', 25, 45, 'mg', 0, 'clvdzrkv600nni8ba6zqo2ykp'),
       ('clvdzrkw600nzi8batt2uy752', 'heavy', 45, 45, 'mg', 0, 'clvdzrkv600nni8ba6zqo2ykp'),
       ('clvdzrkwg00o1i8baf0erdr7w', 'threshold', 5, 5, 'mg', 0, 'clvdzrkvc00npi8banyga4s6k'),
       ('clvdzrkwn00o3i8bayxa6ftue', 'light', 10, 25, 'mg', 0, 'clvdzrkvc00npi8banyga4s6k'),
       ('clvdzrkwt00o5i8baboi60ly2', 'common', 25, 35, 'mg', 0, 'clvdzrkvc00npi8banyga4s6k'),
       ('clvdzrkx100o7i8ba8839l1n9', 'strong', 35, 60, 'mg', 0, 'clvdzrkvc00npi8banyga4s6k'),
       ('clvdzrkx800o9i8bauyv7zipa', 'heavy', 60, 60, 'mg', 0, 'clvdzrkvc00npi8banyga4s6k'),
       ('clvdzrkxm00odi8bankwdc2z4', 'threshold', 5, 5, 'mg', 0, 'clvdzrkxe00obi8ban98aprfe'),
       ('clvdzrkxt00ofi8ba73v2miyn', 'light', 10, 20, 'mg', 0, 'clvdzrkxe00obi8ban98aprfe'),
       ('clvdzrkxz00ohi8bawg6kokoc', 'common', 20, 30, 'mg', 0, 'clvdzrkxe00obi8ban98aprfe'),
       ('clvdzrky700oji8bam123ow3n', 'strong', 30, 50, 'mg', 0, 'clvdzrkxe00obi8ban98aprfe'),
       ('clvdzrkye00oli8baa10x44i3', 'heavy', 50, 50, 'mg', 0, 'clvdzrkxe00obi8ban98aprfe'),
       ('clvdzrkys00opi8bas22edmk0', 'threshold', 5, 5, 'mg', 0, 'clvdzrkyl00oni8barzbr8srs'),
       ('clvdzrkyy00ori8bapy1n1k3d', 'light', 10, 15, 'mg', 0, 'clvdzrkyl00oni8barzbr8srs'),
       ('clvdzrkz400oti8bajzx4y0w9', 'common', 15, 25, 'mg', 0, 'clvdzrkyl00oni8barzbr8srs'),
       ('clvdzrkzb00ovi8bay1so6a2a', 'strong', 25, 35, 'mg', 0, 'clvdzrkyl00oni8barzbr8srs'),
       ('clvdzrkzh00oxi8bayrqk3zxh', 'heavy', 35, 35, 'mg', 0, 'clvdzrkyl00oni8barzbr8srs'),
       ('clvdzrl0500p3i8bazv8y0lkh', 'threshold', 15, 15, 'mg', 0, 'clvdzrkzn00ozi8ba9gheywi3'),
       ('clvdzrl0b00p5i8bae53spt43', 'light', 30, 75, 'mg', 0, 'clvdzrkzn00ozi8ba9gheywi3'),
       ('clvdzrl0i00p7i8ba81wwbac5', 'common', 75, 150, 'mg', 0, 'clvdzrkzn00ozi8ba9gheywi3'),
       ('clvdzrl0r00p9i8ba6ad9bb1p', 'heavy', 150, 150, 'mg', 0, 'clvdzrkzn00ozi8ba9gheywi3'),
       ('clvdzrl0x00pbi8badwxhbel5', 'threshold', 25, 25, 'mg', 0, 'clvdzrkzv00p1i8ba2ps63fs6'),
       ('clvdzrl1800pdi8baa85w37ku', 'light', 75, 100, 'mg', 0, 'clvdzrkzv00p1i8ba2ps63fs6'),
       ('clvdzrl1k00pfi8bagpfssp2n', 'common', 100, 170, 'mg', 0, 'clvdzrkzv00p1i8ba2ps63fs6'),
       ('clvdzrl1t00phi8banbdcpy0w', 'strong', 170, 250, 'mg', 0, 'clvdzrkzv00p1i8ba2ps63fs6'),
       ('clvdzrl2200pji8bawc0vv8z6', 'heavy', 250, 250, 'mg', 0, 'clvdzrkzv00p1i8ba2ps63fs6'),
       ('clvdzrl2h00pni8bao1f7u8ps', 'threshold', 5, 5, 'mg', 0, 'clvdzrl2a00pli8baated1j7u'),
       ('clvdzrl2o00ppi8baf3p6hm1z', 'light', 5, 10, 'mg', 0, 'clvdzrl2a00pli8baated1j7u'),
       ('clvdzrl3100pri8bajmreu53d', 'common', 10, 15, 'mg', 0, 'clvdzrl2a00pli8baated1j7u'),
       ('clvdzrl3a00pti8banc1qacvt', 'strong', 15, 30, 'mg', 0, 'clvdzrl2a00pli8baated1j7u'),
       ('clvdzrl3l00pvi8baglgmjbhc', 'heavy', 30, 30, 'mg', 0, 'clvdzrl2a00pli8baated1j7u'),
       ('clvdzrl4900q1i8baqcl1z14j', 'threshold', 5, 5, 'mg', 0, 'clvdzrl3u00pxi8baveou57jz'),
       ('clvdzrl4g00q3i8ba8v40ebvo', 'light', 5, 8, 'mg', 0, 'clvdzrl3u00pxi8baveou57jz'),
       ('clvdzrl4o00q5i8ba0dolynyr', 'common', 8, 14, 'mg', 0, 'clvdzrl3u00pxi8baveou57jz'),
       ('clvdzrl4w00q7i8barabknt0k', 'strong', 14, 20, 'mg', 0, 'clvdzrl3u00pxi8baveou57jz'),
       ('clvdzrl5200q9i8bam28mtzc7', 'heavy', 20, 20, 'mg', 0, 'clvdzrl3u00pxi8baveou57jz'),
       ('clvdzrl5b00qbi8ba9ntwfrhv', 'threshold', 5, 5, 'mg', 0, 'clvdzrl4000pzi8bawsjmyv8h'),
       ('clvdzrl5j00qdi8ba493tsr4q', 'light', 5, 10, 'mg', 0, 'clvdzrl4000pzi8bawsjmyv8h'),
       ('clvdzrl5r00qfi8batjy0aer5', 'common', 10, 15, 'mg', 0, 'clvdzrl4000pzi8bawsjmyv8h'),
       ('clvdzrl5y00qhi8banyqo85dg', 'strong', 15, 20, 'mg', 0, 'clvdzrl4000pzi8bawsjmyv8h'),
       ('clvdzrl6500qji8baz21e0l48', 'heavy', 20, 20, 'mg', 0, 'clvdzrl4000pzi8bawsjmyv8h'),
       ('clvdzrl6k00qni8ba0fwq6lea', 'threshold', 20, 20, 'mg', 0, 'clvdzrl6e00qli8bagq4bv8nm'),
       ('clvdzrl6q00qpi8ba57biq7d5', 'light', 40, 60, 'mg', 0, 'clvdzrl6e00qli8bagq4bv8nm'),
       ('clvdzrl7000qri8batwg1wd1t', 'common', 60, 80, 'mg', 0, 'clvdzrl6e00qli8bagq4bv8nm'),
       ('clvdzrl7700qti8bah0st4zq8', 'strong', 80, 100, 'mg', 0, 'clvdzrl6e00qli8bagq4bv8nm'),
       ('clvdzrl7e00qvi8bau54x571n', 'heavy', 100, 100, 'mg', 0, 'clvdzrl6e00qli8bagq4bv8nm'),
       ('clvdzrl7v00qzi8baw4vsc23n', 'threshold', 25, 25, 'mg', 0, 'clvdzrl7o00qxi8bayg910rd1'),
       ('clvdzrl8100r1i8ba4cxszo5o', 'light', 50, 100, 'mg', 0, 'clvdzrl7o00qxi8bayg910rd1'),
       ('clvdzrl8900r3i8bajx33bjtc', 'common', 100, 300, 'mg', 0, 'clvdzrl7o00qxi8bayg910rd1'),
       ('clvdzrl8h00r5i8ba27i90jp3', 'strong', 300, 500, 'mg', 0, 'clvdzrl7o00qxi8bayg910rd1'),
       ('clvdzrl8n00r7i8ba10u9apmv', 'heavy', 500, 500, 'mg', 0, 'clvdzrl7o00qxi8bayg910rd1'),
       ('clvdzrl8z00rbi8ba7povgncc', 'threshold', 20, 20, 'mg', 0, 'clvdzrl8s00r9i8baprnaczas'),
       ('clvdzrl9600rdi8bauu478a74', 'light', 40, 60, 'mg', 0, 'clvdzrl8s00r9i8baprnaczas'),
       ('clvdzrl9c00rfi8ba15hitr7k', 'common', 60, 80, 'mg', 0, 'clvdzrl8s00r9i8baprnaczas'),
       ('clvdzrl9i00rhi8ba75496fps', 'strong', 80, 100, 'mg', 0, 'clvdzrl8s00r9i8baprnaczas'),
       ('clvdzrl9o00rji8bawwpb9qbw', 'heavy', 100, 100, 'mg', 0, 'clvdzrl8s00r9i8baprnaczas'),
       ('clvdzrlad00rpi8bar488uux4', 'threshold', 4, 4, 'mg', 0, 'clvdzrl9y00rli8ba83bhum11'),
       ('clvdzrlam00rri8baltkwl6md', 'light', 5, 12, 'mg', 0, 'clvdzrl9y00rli8ba83bhum11'),
       ('clvdzrlat00rti8bap8r9v2nq', 'common', 12, 25, 'mg', 0, 'clvdzrl9y00rli8ba83bhum11'),
       ('clvdzrlb000rvi8baeapo10qs', 'strong', 25, 35, 'mg', 0, 'clvdzrl9y00rli8ba83bhum11'),
       ('clvdzrlb900rxi8batq9idddd', 'heavy', 35, 35, 'mg', 0, 'clvdzrl9y00rli8ba83bhum11'),
       ('clvdzrlbf00rzi8baf9kv6gwf', 'threshold', 3, 3, 'mg', 0, 'clvdzrla500rni8bagv2o83na'),
       ('clvdzrlbl00s1i8baauzab9um', 'common', 5, 10, 'mg', 0, 'clvdzrla500rni8bagv2o83na'),
       ('clvdzrlc600s7i8bar8qrytsa', 'threshold', 3, 3, 'mg', 0, 'clvdzrlbr00s3i8baekx83pzo'),
       ('clvdzrlce00s9i8bazezpdjjh', 'light', 5, 8, 'mg', 0, 'clvdzrlbr00s3i8baekx83pzo'),
       ('clvdzrlcm00sbi8ba9no0dp96', 'common', 8, 15, 'mg', 0, 'clvdzrlbr00s3i8baekx83pzo'),
       ('clvdzrlcs00sdi8ba2y0mu3z5', 'strong', 15, 25, 'mg', 0, 'clvdzrlbr00s3i8baekx83pzo'),
       ('clvdzrld000sfi8ba9gjre9ks', 'threshold', 1, 1, 'mg', 0, 'clvdzrlbz00s5i8ba0r6dyv2n'),
       ('clvdzrld700shi8baplhwviu6', 'light', 3, 6, 'mg', 0, 'clvdzrlbz00s5i8ba0r6dyv2n'),
       ('clvdzrldf00sji8badsw17y76', 'common', 6, 12, 'mg', 0, 'clvdzrlbz00s5i8ba0r6dyv2n'),
       ('clvdzrldn00sli8ba7kgosw4h', 'strong', 12, 20, 'mg', 0, 'clvdzrlbz00s5i8ba0r6dyv2n'),
       ('clvdzrldv00sni8bax8dj3q5l', 'heavy', 20, 20, 'mg', 0, 'clvdzrlbz00s5i8ba0r6dyv2n'),
       ('clvdzrleb00sri8bapuu3uzqh', 'threshold', 20, 20, 'mg', 0, 'clvdzrle200spi8bayhg41abm'),
       ('clvdzrlej00sti8bafohunudb', 'light', 50, 80, 'mg', 0, 'clvdzrle200spi8bayhg41abm'),
       ('clvdzrlep00svi8bapjjb1j7d', 'common', 80, 110, 'mg', 0, 'clvdzrle200spi8bayhg41abm'),
       ('clvdzrleu00sxi8babvjvkle6', 'strong', 110, 140, 'mg', 0, 'clvdzrle200spi8bayhg41abm'),
       ('clvdzrlez00szi8batyjktfd6', 'heavy', 140, 140, 'mg', 0, 'clvdzrle200spi8bayhg41abm'),
       ('clvdzrlfc00t3i8bajvmmxuq1', 'threshold', 3, 3, 'mg', 0, 'clvdzrlf400t1i8baknhpqsu9'),
       ('clvdzrlfl00t5i8baau1dwmdn', 'light', 3, 10, 'mg', 0, 'clvdzrlf400t1i8baknhpqsu9'),
       ('clvdzrlfr00t7i8baeomynj7z', 'common', 10, 15, 'mg', 0, 'clvdzrlf400t1i8baknhpqsu9'),
       ('clvdzrlfx00t9i8baylckp9nd', 'strong', 15, 20, 'mg', 0, 'clvdzrlf400t1i8baknhpqsu9'),
       ('clvdzrlg400tbi8bado8ky0mq', 'heavy', 20, 20, 'mg', 0, 'clvdzrlf400t1i8baknhpqsu9'),
       ('clvdzrlgq00thi8bahydr6pd6', 'threshold', 3, 3, 'mg', 0, 'clvdzrlgb00tdi8baju4vcik1'),
       ('clvdzrlgx00tji8barzp6coy1', 'light', 3, 7, 'mg', 0, 'clvdzrlgb00tdi8baju4vcik1'),
       ('clvdzrlh300tli8bay5c8nrcl', 'common', 7, 15, 'mg', 0, 'clvdzrlgb00tdi8baju4vcik1'),
       ('clvdzrlh800tni8bakxyna6ge', 'strong', 15, 20, 'mg', 0, 'clvdzrlgb00tdi8baju4vcik1'),
       ('clvdzrlhg00tpi8ba3spqo734', 'heavy', 20, 20, 'mg', 0, 'clvdzrlgb00tdi8baju4vcik1'),
       ('clvdzrlho00tri8banvsbav03', 'threshold', 5, 5, 'mg', 0, 'clvdzrlgh00tfi8bakwwtbjl4'),
       ('clvdzrlhw00tti8ba9zsrqi7p', 'light', 5, 10, 'mg', 0, 'clvdzrlgh00tfi8bakwwtbjl4'),
       ('clvdzrli300tvi8ba7gixfnsq', 'common', 10, 15, 'mg', 0, 'clvdzrlgh00tfi8bakwwtbjl4'),
       ('clvdzrlib00txi8baoxeg3ffq', 'strong', 15, 20, 'mg', 0, 'clvdzrlgh00tfi8bakwwtbjl4'),
       ('clvdzrlii00tzi8baby6wqz4j', 'heavy', 20, 20, 'mg', 0, 'clvdzrlgh00tfi8bakwwtbjl4'),
       ('clvdzrliy00u3i8ba9ptu2wfe', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrlip00u1i8ba3p60q36r'),
       ('clvdzrlj300u5i8baavtx0amk', 'light', 0.5, 1, 'mg', 0, 'clvdzrlip00u1i8ba3p60q36r'),
       ('clvdzrlja00u7i8ba7v8j52rb', 'common', 1, 2, 'mg', 0, 'clvdzrlip00u1i8ba3p60q36r'),
       ('clvdzrlji00u9i8bay4frof2f', 'strong', 2, 4, 'mg', 0, 'clvdzrlip00u1i8ba3p60q36r'),
       ('clvdzrljo00ubi8bajasjgunf', 'heavy', 4, 4, 'mg', 0, 'clvdzrlip00u1i8ba3p60q36r'),
       ('clvdzrlk800uhi8baav0ssulo', 'threshold', 1, 1, 'mg', 0, 'clvdzrljv00udi8bauytlwr6t'),
       ('clvdzrlke00uji8bapbpdmtl0', 'light', 1, 3, 'mg', 0, 'clvdzrljv00udi8bauytlwr6t'),
       ('clvdzrlkl00uli8baq3w7qkuv', 'common', 3, 5, 'mg', 0, 'clvdzrljv00udi8bauytlwr6t'),
       ('clvdzrlks00uni8ba9zvddquv', 'strong', 5, 8, 'mg', 0, 'clvdzrljv00udi8bauytlwr6t'),
       ('clvdzrll000upi8bamj6qru3o', 'heavy', 8, 8, 'mg', 0, 'clvdzrljv00udi8bauytlwr6t'),
       ('clvdzrll800uri8baa89bcnnn', 'threshold', 1, 1, 'mg', 0, 'clvdzrlk000ufi8baynio90xg'),
       ('clvdzrllf00uti8bawnd9dx79', 'light', 1, 3, 'mg', 0, 'clvdzrlk000ufi8baynio90xg'),
       ('clvdzrlll00uvi8ba8d11upvh', 'common', 3, 5, 'mg', 0, 'clvdzrlk000ufi8baynio90xg'),
       ('clvdzrllu00uxi8bamnfrgwi3', 'strong', 5, 8, 'mg', 0, 'clvdzrlk000ufi8baynio90xg'),
       ('clvdzrlm000uzi8bavianlld7', 'heavy', 8, 8, 'mg', 0, 'clvdzrlk000ufi8baynio90xg'),
       ('clvdzrlmd00v3i8ba2iiafxn2', 'threshold', 15, 15, 'mg', 0, 'clvdzrlm500v1i8ba1ueqdkm5'),
       ('clvdzrlmk00v5i8ba3b9lsajr', 'light', 30, 60, 'mg', 0, 'clvdzrlm500v1i8ba1ueqdkm5'),
       ('clvdzrlmq00v7i8bas5eu4ma4', 'common', 60, 90, 'mg', 0, 'clvdzrlm500v1i8ba1ueqdkm5'),
       ('clvdzrlmw00v9i8baujs34406', 'strong', 90, 120, 'mg', 0, 'clvdzrlm500v1i8ba1ueqdkm5'),
       ('clvdzrln300vbi8bagu54fvio', 'heavy', 120, 120, 'mg', 0, 'clvdzrlm500v1i8ba1ueqdkm5'),
       ('clvdzrlnn00vfi8badq7h5j13', 'threshold', 20, 20, 'mg', 0, 'clvdzrlnf00vdi8bauvgdoh1s'),
       ('clvdzrlnv00vhi8bajlr3kn0j', 'light', 30, 70, 'mg', 0, 'clvdzrlnf00vdi8bauvgdoh1s'),
       ('clvdzrlo100vji8bad6jn0q5d', 'common', 70, 100, 'mg', 0, 'clvdzrlnf00vdi8bauvgdoh1s'),
       ('clvdzrlo800vli8bakv599qof', 'strong', 100, 130, 'mg', 0, 'clvdzrlnf00vdi8bauvgdoh1s'),
       ('clvdzrlof00vni8bae6jurpcx', 'heavy', 130, 130, 'mg', 0, 'clvdzrlnf00vdi8bauvgdoh1s'),
       ('clvdzrlp500vvi8baekwon5jo', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrlon00vpi8bahh4dz4r9'),
       ('clvdzrlph00vxi8bavjqmhab9', 'light', 1, 5, 'mg', 0, 'clvdzrlon00vpi8bahh4dz4r9'),
       ('clvdzrlpr00vzi8bajdgkm49v', 'common', 5, 15, 'mg', 0, 'clvdzrlon00vpi8bahh4dz4r9'),
       ('clvdzrlpx00w1i8baeqm0fewt', 'strong', 15, 25, 'mg', 0, 'clvdzrlon00vpi8bahh4dz4r9'),
       ('clvdzrlq700w3i8bab3wg6ejr', 'threshold', 1, 1, 'mg', 0, 'clvdzrlos00vri8ba3r1o4i54'),
       ('clvdzrlqc00w5i8ba6e1bw69y', 'light', 5, 10, 'mg', 0, 'clvdzrlos00vri8ba3r1o4i54'),
       ('clvdzrlqm00w7i8baxwh2m4z2', 'common', 10, 25, 'mg', 0, 'clvdzrlos00vri8ba3r1o4i54'),
       ('clvdzrlqt00w9i8bafq59tf0c', 'strong', 25, 40, 'mg', 0, 'clvdzrlos00vri8ba3r1o4i54'),
       ('clvdzrlr500wbi8ba7v3ol8ck', 'heavy', 40, 40, 'mg', 0, 'clvdzrlos00vri8ba3r1o4i54'),
       ('clvdzrlre00wdi8baqy24owus', 'threshold', 1, 1, 'mg', 0, 'clvdzrlox00vti8bajbcwf1eh'),
       ('clvdzrlrl00wfi8batlpsxmsp', 'light', 2, 5, 'mg', 0, 'clvdzrlox00vti8bajbcwf1eh'),
       ('clvdzrlru00whi8badarhho9o', 'common', 5, 10, 'mg', 0, 'clvdzrlox00vti8bajbcwf1eh'),
       ('clvdzrls200wji8basl8bewp6', 'strong', 10, 20, 'mg', 0, 'clvdzrlox00vti8bajbcwf1eh'),
       ('clvdzrlsz00wri8bahnsp2xxl', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrlsb00wli8bavj353s7r'),
       ('clvdzrlt600wti8ba0fdov7k6', 'light', 1, 5, 'mg', 0, 'clvdzrlsb00wli8bavj353s7r'),
       ('clvdzrltg00wvi8bap0rtakhg', 'common', 5, 15, 'mg', 0, 'clvdzrlsb00wli8bavj353s7r'),
       ('clvdzrltp00wxi8bae7fo3a9t', 'strong', 15, 25, 'mg', 0, 'clvdzrlsb00wli8bavj353s7r'),
       ('clvdzrltu00wzi8baki2iojt6', 'heavy', 25, 25, 'mg', 0, 'clvdzrlsb00wli8bavj353s7r'),
       ('clvdzrlu300x1i8bahtnu8t0s', 'threshold', 1, 1, 'mg', 0, 'clvdzrlsh00wni8bambs85jdw'),
       ('clvdzrluc00x3i8banm18rlr0', 'light', 5, 10, 'mg', 0, 'clvdzrlsh00wni8bambs85jdw'),
       ('clvdzrluk00x5i8baqbjltyiz', 'common', 10, 25, 'mg', 0, 'clvdzrlsh00wni8bambs85jdw'),
       ('clvdzrlus00x7i8baidtqoeve', 'strong', 25, 40, 'mg', 0, 'clvdzrlsh00wni8bambs85jdw'),
       ('clvdzrluz00x9i8ba67zhkhnn', 'heavy', 40, 40, 'mg', 0, 'clvdzrlsh00wni8bambs85jdw'),
       ('clvdzrlv600xbi8bag237im2q', 'threshold', 1, 1, 'mg', 0, 'clvdzrlsp00wpi8bajvd22e5b'),
       ('clvdzrlvd00xdi8ba00iip0ai', 'light', 2, 5, 'mg', 0, 'clvdzrlsp00wpi8bajvd22e5b'),
       ('clvdzrlvl00xfi8baqc0qfu57', 'common', 5, 15, 'mg', 0, 'clvdzrlsp00wpi8bajvd22e5b'),
       ('clvdzrlvs00xhi8baz112nxod', 'strong', 15, 25, 'mg', 0, 'clvdzrlsp00wpi8bajvd22e5b'),
       ('clvdzrlvy00xji8babar59cqg', 'heavy', 25, 25, 'mg', 0, 'clvdzrlsp00wpi8bajvd22e5b'),
       ('clvdzrlwc00xni8bayw4adnad', 'threshold', 1, 1, 'mg', 0, 'clvdzrlw600xli8bahlj5otej'),
       ('clvdzrlwi00xpi8baqgto7701', 'light', 1, 2, 'mg', 0, 'clvdzrlw600xli8bahlj5otej'),
       ('clvdzrlwu00xri8bavqd4criv', 'common', 2, 3, 'mg', 0, 'clvdzrlw600xli8bahlj5otej'),
       ('clvdzrlx300xti8ba84b0i1ni', 'strong', 3, 5, 'mg', 0, 'clvdzrlw600xli8bahlj5otej'),
       ('clvdzrlx900xvi8baw5dh9mvw', 'heavy', 5, 5, 'mg', 0, 'clvdzrlw600xli8bahlj5otej'),
       ('clvdzrlxn00xzi8babt3scd1r', 'threshold', 20, 20, 'µg', 0, 'clvdzrlxe00xxi8ba4e2lly5b'),
       ('clvdzrlxv00y1i8bathsh0wnv', 'light', 50, 100, 'µg', 0, 'clvdzrlxe00xxi8ba4e2lly5b'),
       ('clvdzrly300y3i8bas5va4nmn', 'common', 100, 225, 'µg', 0, 'clvdzrlxe00xxi8ba4e2lly5b'),
       ('clvdzrlyc00y5i8bacn5p6bhh', 'strong', 225, 350, 'µg', 0, 'clvdzrlxe00xxi8ba4e2lly5b'),
       ('clvdzrlyk00y7i8bae91lpahz', 'heavy', 350, 350, 'µg', 0, 'clvdzrlxe00xxi8ba4e2lly5b'),
       ('clvdzrlyz00ybi8batoum7fl8', 'threshold', 30, 30, 'µg', 0, 'clvdzrlyr00y9i8ba8zpfee06'),
       ('clvdzrlz600ydi8ba8pqdg3bu', 'light', 30, 100, 'µg', 0, 'clvdzrlyr00y9i8ba8zpfee06'),
       ('clvdzrlzd00yfi8bahehrgt37', 'common', 100, 175, 'µg', 0, 'clvdzrlyr00y9i8ba8zpfee06'),
       ('clvdzrlzj00yhi8baziktzhcb', 'strong', 175, 325, 'µg', 0, 'clvdzrlyr00y9i8ba8zpfee06'),
       ('clvdzrlzq00yji8baovphx0cz', 'heavy', 325, 325, 'µg', 0, 'clvdzrlyr00y9i8ba8zpfee06'),
       ('clvdzrm0400yni8baozo8ius5', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrlzx00yli8bayr7y3xc2'),
       ('clvdzrm0a00ypi8ba2jf5unxo', 'light', 0.5, 1.5, 'mg', 0, 'clvdzrlzx00yli8bayr7y3xc2'),
       ('clvdzrm0g00yri8baawab6dle', 'common', 1.5, 2, 'mg', 0, 'clvdzrlzx00yli8bayr7y3xc2'),
       ('clvdzrm0m00yti8ba44w7vg7m', 'strong', 2, 4, 'mg', 0, 'clvdzrlzx00yli8bayr7y3xc2'),
       ('clvdzrm0t00yvi8ba48lf903h', 'heavy', 4, 4, 'mg', 0, 'clvdzrlzx00yli8bayr7y3xc2'),
       ('clvdzrm1e00z1i8bay6lko9aw', 'threshold', 2, 2, 'mg', 0, 'clvdzrm0z00yxi8ba0ivk9ry0'),
       ('clvdzrm1k00z3i8ba81afx7km', 'light', 5, 10, 'mg', 0, 'clvdzrm0z00yxi8ba0ivk9ry0'),
       ('clvdzrm1u00z5i8bauhpwtm3g', 'common', 10, 15, 'mg', 0, 'clvdzrm0z00yxi8ba0ivk9ry0'),
       ('clvdzrm2100z7i8ba6pfn9fqe', 'strong', 15, 20, 'mg', 0, 'clvdzrm0z00yxi8ba0ivk9ry0'),
       ('clvdzrm2700z9i8ba6ywadsj6', 'threshold', 2, 2, 'mg', 0, 'clvdzrm1700yzi8bav2rt2n1h'),
       ('clvdzrm2d00zbi8baugx81abr', 'light', 5, 10, 'mg', 0, 'clvdzrm1700yzi8bav2rt2n1h'),
       ('clvdzrm2k00zdi8bak0j7az9t', 'common', 10, 15, 'mg', 0, 'clvdzrm1700yzi8bav2rt2n1h'),
       ('clvdzrm2q00zfi8banrn1xjl8', 'strong', 15, 20, 'mg', 0, 'clvdzrm1700yzi8bav2rt2n1h'),
       ('clvdzrm3200zji8ba7qpremsd', 'threshold', 100, 100, 'mg', 0, 'clvdzrm2v00zhi8ban9ejyvcz'),
       ('clvdzrm3a00zli8basertjgqf', 'light', 150, 250, 'mg', 0, 'clvdzrm2v00zhi8ban9ejyvcz'),
       ('clvdzrm3g00zni8baazllp2wf', 'common', 250, 400, 'mg', 0, 'clvdzrm2v00zhi8ban9ejyvcz'),
       ('clvdzrm3n00zpi8baa2bd7us0', 'strong', 400, 600, 'mg', 0, 'clvdzrm2v00zhi8ban9ejyvcz'),
       ('clvdzrm3u00zri8bapxz0lcg5', 'heavy', 600, 600, 'mg', 0, 'clvdzrm2v00zhi8ban9ejyvcz'),
       ('clvdzrm4700zvi8ba5vwek5r3', 'threshold', 10, 10, 'g', 0, 'clvdzrm4100zti8ba99iet4tr'),
       ('clvdzrm4d00zxi8ba7e0qc0by', 'light', 10, 20, 'g', 0, 'clvdzrm4100zti8ba99iet4tr'),
       ('clvdzrm4n00zzi8bau8mm14f6', 'common', 20, 30, 'g', 0, 'clvdzrm4100zti8ba99iet4tr'),
       ('clvdzrm4w0101i8bagvxo0913', 'strong', 30, 40, 'g', 0, 'clvdzrm4100zti8ba99iet4tr'),
       ('clvdzrm530103i8baax11ppp1', 'heavy', 40, 40, 'g', 0, 'clvdzrm4100zti8ba99iet4tr'),
       ('clvdzrm5i0107i8ba2ux3z9b3', 'threshold', 15, 15, 'mg', 0, 'clvdzrm5a0105i8bayicao93s'),
       ('clvdzrm5q0109i8ba1z2pu3yg', 'light', 20, 30, 'mg', 0, 'clvdzrm5a0105i8bayicao93s'),
       ('clvdzrm5w010bi8bavwp0w65u', 'common', 30, 40, 'mg', 0, 'clvdzrm5a0105i8bayicao93s'),
       ('clvdzrm63010di8ba6xbt05mi', 'strong', 40, 60, 'mg', 0, 'clvdzrm5a0105i8bayicao93s'),
       ('clvdzrm68010fi8bae4wbfdd1', 'heavy', 60, 60, 'mg', 0, 'clvdzrm5a0105i8bayicao93s'),
       ('clvdzrm6i010ji8bak8wr0g1o', 'threshold', 50, 50, 'mg', 0, 'clvdzrm6d010hi8ba6acg5rws'),
       ('clvdzrm6q010li8balj1q9hvy', 'light', 100, 300, 'mg', 0, 'clvdzrm6d010hi8ba6acg5rws'),
       ('clvdzrm6x010ni8ba0yy37jqb', 'common', 300, 500, 'mg', 0, 'clvdzrm6d010hi8ba6acg5rws'),
       ('clvdzrm72010pi8bacpu6q3r8', 'strong', 500, 1000, 'mg', 0, 'clvdzrm6d010hi8ba6acg5rws'),
       ('clvdzrm77010ri8ba92jvro8i', 'heavy', 1000, 1000, 'mg', 0, 'clvdzrm6d010hi8ba6acg5rws'),
       ('clvdzrm7r010xi8bamycbahbj', 'threshold', 0.05, 0.05, 'mg', 0, 'clvdzrm7c010ti8baq4i17c72'),
       ('clvdzrm7x010zi8ba8qon3ban', 'light', 0.05, 0.25, 'mg', 0, 'clvdzrm7c010ti8baq4i17c72'),
       ('clvdzrm860111i8ba6ky9vwnu', 'common', 0.25, 0.5, 'mg', 0, 'clvdzrm7c010ti8baq4i17c72'),
       ('clvdzrm8c0113i8bakyz8rmv5', 'strong', 0.5, 1, 'mg', 0, 'clvdzrm7c010ti8baq4i17c72'),
       ('clvdzrm8j0115i8ba7wftxie6', 'heavy', 1, 1, 'mg', 0, 'clvdzrm7c010ti8baq4i17c72'),
       ('clvdzrm8q0117i8ba741ix4sf', 'threshold', 0.1, 0.1, 'mg', 0, 'clvdzrm7k010vi8bajwuvdsrk'),
       ('clvdzrm8x0119i8bag2u9xw8i', 'light', 0.25, 0.5, 'mg', 0, 'clvdzrm7k010vi8bajwuvdsrk'),
       ('clvdzrm93011bi8bav83a4wdp', 'common', 0.5, 1.5, 'mg', 0, 'clvdzrm7k010vi8bajwuvdsrk'),
       ('clvdzrm99011di8ba5hcp1g6j', 'strong', 1.5, 2, 'mg', 0, 'clvdzrm7k010vi8bajwuvdsrk'),
       ('clvdzrm9g011fi8ba6rngw8s2', 'heavy', 2, 2, 'mg', 0, 'clvdzrm7k010vi8bajwuvdsrk'),
       ('clvdzrma9011ni8ba1j74589o', 'threshold', 4, 4, 'mg', 0, 'clvdzrm9n011hi8baxn4usvv8'),
       ('clvdzrmai011pi8bao09vncy4', 'light', 6, 15, 'mg', 0, 'clvdzrm9n011hi8baxn4usvv8'),
       ('clvdzrmap011ri8ba3zpjxfgs', 'common', 15, 30, 'mg', 0, 'clvdzrm9n011hi8baxn4usvv8'),
       ('clvdzrmax011ti8ba8ynrdcsc', 'strong', 30, 50, 'mg', 0, 'clvdzrm9n011hi8baxn4usvv8'),
       ('clvdzrmb4011vi8balgeledsf', 'heavy', 50, 50, 'mg', 0, 'clvdzrm9n011hi8baxn4usvv8'),
       ('clvdzrmbb011xi8ba4pllhyf9', 'threshold', 4, 4, 'mg', 0, 'clvdzrm9t011ji8bay0kbrbvv'),
       ('clvdzrmbg011zi8baz85k2gr0', 'light', 6, 15, 'mg', 0, 'clvdzrm9t011ji8bay0kbrbvv'),
       ('clvdzrmbn0121i8bajf4picwm', 'common', 15, 30, 'mg', 0, 'clvdzrm9t011ji8bay0kbrbvv'),
       ('clvdzrmbv0123i8ba7pvui1br', 'strong', 30, 50, 'mg', 0, 'clvdzrm9t011ji8bay0kbrbvv'),
       ('clvdzrmc10125i8bajsdsmyel', 'heavy', 50, 50, 'mg', 0, 'clvdzrm9t011ji8bay0kbrbvv'),
       ('clvdzrmca0127i8bawbius75y', 'threshold', 2.5, 2.5, 'mg', 0, 'clvdzrma0011li8bacozk8fd6'),
       ('clvdzrmch0129i8ba5zhui96y', 'light', 5, 10, 'mg', 0, 'clvdzrma0011li8bacozk8fd6'),
       ('clvdzrmco012bi8bahzuuyo4e', 'common', 10, 25, 'mg', 0, 'clvdzrma0011li8bacozk8fd6'),
       ('clvdzrmcu012di8banwi38w9x', 'strong', 25, 50, 'mg', 0, 'clvdzrma0011li8bacozk8fd6'),
       ('clvdzrmd1012fi8baru6p2pb6', 'heavy', 50, 50, 'mg', 0, 'clvdzrma0011li8bacozk8fd6'),
       ('clvdzrmdg012ji8balxgyu43m', 'threshold', 350, 350, 'mg', 0, 'clvdzrmd9012hi8ba7uvr0b1d'),
       ('clvdzrmdk012li8babj52afyr', 'light', 500, 1200, 'mg', 0, 'clvdzrmd9012hi8ba7uvr0b1d'),
       ('clvdzrmds012ni8ba0kcjj5px', 'common', 1200, 1800, 'mg', 0, 'clvdzrmd9012hi8ba7uvr0b1d'),
       ('clvdzrmdz012pi8bas2l9eezr', 'strong', 1800, 2400, 'mg', 0, 'clvdzrmd9012hi8ba7uvr0b1d'),
       ('clvdzrme6012ri8bay7r29vlw', 'heavy', 2400, 2400, 'mg', 0, 'clvdzrmd9012hi8ba7uvr0b1d'),
       ('clvdzrmem012vi8bahlcwmuok', 'threshold', 20, 20, 'mg', 0, 'clvdzrmec012ti8ba76s7spy7'),
       ('clvdzrmes012xi8ba532v4ytn', 'light', 40, 100, 'mg', 0, 'clvdzrmec012ti8ba76s7spy7'),
       ('clvdzrmex012zi8baiysvndt7', 'common', 100, 200, 'mg', 0, 'clvdzrmec012ti8ba76s7spy7'),
       ('clvdzrmf50131i8ba4ecws7g1', 'strong', 200, 300, 'mg', 0, 'clvdzrmec012ti8ba76s7spy7'),
       ('clvdzrmfd0133i8baimwahb8z', 'heavy', 300, 300, 'mg', 0, 'clvdzrmec012ti8ba76s7spy7'),
       ('clvdzrmg00139i8bap53wkz64', 'threshold', 5, 5, 'mg', 0, 'clvdzrmfr0137i8baydvqcmxa'),
       ('clvdzrmg4013bi8bad0zdlcdk', 'light', 10, 20, 'mg', 0, 'clvdzrmfr0137i8baydvqcmxa'),
       ('clvdzrmgb013di8ba4rq4mac3', 'common', 20, 50, 'mg', 0, 'clvdzrmfr0137i8baydvqcmxa'),
       ('clvdzrmgk013fi8bas8uci7p0', 'strong', 50, 100, 'mg', 0, 'clvdzrmfr0137i8baydvqcmxa'),
       ('clvdzrmgs013hi8ba19qx6560', 'heavy', 100, 100, 'mg', 0, 'clvdzrmfr0137i8baydvqcmxa'),
       ('clvdzrmh5013li8bagbg30hgt', 'threshold', 0.25, 0.25, 'g', 0, 'clvdzrmgx013ji8banv27jmno'),
       ('clvdzrmhe013ni8badr5j5zsl', 'light', 0.5, 1, 'g', 0, 'clvdzrmgx013ji8banv27jmno'),
       ('clvdzrmhk013pi8bazduqg21l', 'common', 1, 1.5, 'g', 0, 'clvdzrmgx013ji8banv27jmno'),
       ('clvdzrmhr013ri8bamtopronc', 'strong', 1.5, 2, 'g', 0, 'clvdzrmgx013ji8banv27jmno'),
       ('clvdzrmhx013ti8ba6rcqf6yf', 'heavy', 2, 2, 'g', 0, 'clvdzrmgx013ji8banv27jmno'),
       ('clvdzrmib013xi8baz8zyoigd', 'threshold', 10, 10, 'mg', 0, 'clvdzrmi4013vi8bavovvvbuq'),
       ('clvdzrmig013zi8balv8wxmsg', 'light', 10, 50, 'mg', 0, 'clvdzrmi4013vi8bavovvvbuq'),
       ('clvdzrmiq0141i8bahvgl89mu', 'common', 50, 100, 'mg', 0, 'clvdzrmi4013vi8bavovvvbuq'),
       ('clvdzrmj00143i8bassz4pkbh', 'strong', 100, 200, 'mg', 0, 'clvdzrmi4013vi8bavovvvbuq'),
       ('clvdzrmj50145i8bagrysu6c0', 'heavy', 200, 200, 'mg', 0, 'clvdzrmi4013vi8bavovvvbuq'),
       ('clvdzrmjl0149i8ba3zprhwid', 'threshold', 3, 3, 'mg', 0, 'clvdzrmjd0147i8baib2f5jzy'),
       ('clvdzrmjs014bi8bag5lhypmi', 'light', 3, 6, 'mg', 0, 'clvdzrmjd0147i8baib2f5jzy'),
       ('clvdzrmk0014di8ba4kcsn2yx', 'common', 6, 9, 'mg', 0, 'clvdzrmjd0147i8baib2f5jzy'),
       ('clvdzrmka014fi8bae519ye1g', 'strong', 9, 12, 'mg', 0, 'clvdzrmjd0147i8baib2f5jzy'),
       ('clvdzrmkg014hi8baa5u4jg9w', 'heavy', 12, 12, 'mg', 0, 'clvdzrmjd0147i8baib2f5jzy'),
       ('clvdzrml0014li8ba2wz53r13', 'threshold', 75, 75, 'µg', 0, 'clvdzrmkm014ji8ba56a4svzt'),
       ('clvdzrml6014ni8babeak5ofm', 'light', 100, 300, 'µg', 0, 'clvdzrmkm014ji8ba56a4svzt'),
       ('clvdzrmle014pi8ba6gd487us', 'common', 300, 500, 'µg', 0, 'clvdzrmkm014ji8ba56a4svzt'),
       ('clvdzrmlo014ri8baklicxf55', 'strong', 500, 750, 'µg', 0, 'clvdzrmkm014ji8ba56a4svzt'),
       ('clvdzrmlu014ti8barshmlaqv', 'heavy', 750, 750, 'µg', 0, 'clvdzrmkm014ji8ba56a4svzt'),
       ('clvdzrmma014xi8baxrpj0pmx', 'threshold', 2, 2, 'mg', 0, 'clvdzrmm4014vi8bacoyp2vxj'),
       ('clvdzrmmh014zi8baxyt70q9d', 'light', 5, 20, 'mg', 0, 'clvdzrmm4014vi8bacoyp2vxj'),
       ('clvdzrmms0151i8ba8mbz4osh', 'common', 20, 40, 'mg', 0, 'clvdzrmm4014vi8bacoyp2vxj'),
       ('clvdzrmn20153i8ba4y196gno', 'strong', 40, 60, 'mg', 0, 'clvdzrmm4014vi8bacoyp2vxj'),
       ('clvdzrmn70155i8bamvllm5ts', 'heavy', 60, 60, 'mg', 0, 'clvdzrmm4014vi8bacoyp2vxj'),
       ('clvdzrmnt015bi8bao7ehm6cl', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzrmnc0157i8ba6n2ej7ex'),
       ('clvdzrmo1015di8ba6wfkai6j', 'light', 0.2, 0.4, 'mg', 0, 'clvdzrmnc0157i8ba6n2ej7ex'),
       ('clvdzrmo9015fi8babsm47wm8', 'common', 0.4, 0.8, 'mg', 0, 'clvdzrmnc0157i8ba6n2ej7ex'),
       ('clvdzrmoh015hi8bak0fknthn', 'strong', 0.8, 1.5, 'mg', 0, 'clvdzrmnc0157i8ba6n2ej7ex'),
       ('clvdzrmon015ji8bavmb9c4co', 'heavy', 1.5, 1.5, 'mg', 0, 'clvdzrmnc0157i8ba6n2ej7ex'),
       ('clvdzrmow015li8ba5hdkh4hp', 'threshold', 0.3, 0.3, 'mg', 0, 'clvdzrmnk0159i8baa77y9eet'),
       ('clvdzrmp5015ni8bat9pc0vvm', 'light', 1, 2, 'mg', 0, 'clvdzrmnk0159i8baa77y9eet'),
       ('clvdzrmpa015pi8ba38bz0pe0', 'common', 2, 4, 'mg', 0, 'clvdzrmnk0159i8baa77y9eet'),
       ('clvdzrmpf015ri8badbhjhf5n', 'strong', 4, 8, 'mg', 0, 'clvdzrmnk0159i8baa77y9eet'),
       ('clvdzrmpm015ti8ba0rfiuc0i', 'heavy', 8, 8, 'mg', 0, 'clvdzrmnk0159i8baa77y9eet'),
       ('clvdzrmqg0161i8ba8bjbcizw', 'threshold', 20, 20, 'mg', 0, 'clvdzrmq8015zi8baqphkid97'),
       ('clvdzrmqn0163i8ba1g4vt1zb', 'light', 40, 80, 'mg', 0, 'clvdzrmq8015zi8baqphkid97'),
       ('clvdzrmqt0165i8ba0submyyz', 'common', 80, 125, 'mg', 0, 'clvdzrmq8015zi8baqphkid97'),
       ('clvdzrmr00167i8ba85i4kaq6', 'strong', 125, 225, 'mg', 0, 'clvdzrmq8015zi8baqphkid97'),
       ('clvdzrmr90169i8babhi5qvr8', 'heavy', 225, 225, 'mg', 0, 'clvdzrmq8015zi8baqphkid97'),
       ('clvdzrmru016fi8babgrikjpm', 'threshold', 2.5, 2.5, 'mg', 0, 'clvdzrmrf016bi8baeqnn18av'),
       ('clvdzrms2016hi8bamgocaquk', 'light', 10, 25, 'mg', 0, 'clvdzrmrf016bi8baeqnn18av'),
       ('clvdzrms8016ji8bawwnii6sv', 'common', 25, 40, 'mg', 0, 'clvdzrmrf016bi8baeqnn18av'),
       ('clvdzrmsh016li8bak7de6soh', 'strong', 40, 80, 'mg', 0, 'clvdzrmrf016bi8baeqnn18av'),
       ('clvdzrmsl016ni8baoi2p8d2l', 'heavy', 80, 80, 'mg', 0, 'clvdzrmrf016bi8baeqnn18av'),
       ('clvdzrmsr016pi8ba9xu1ryhr', 'threshold', 10, 10, 'mg', 0, 'clvdzrmrk016di8ba7e3vhuj7'),
       ('clvdzrmsx016ri8bahr5syjy7', 'light', 20, 50, 'mg', 0, 'clvdzrmrk016di8ba7e3vhuj7'),
       ('clvdzrmt4016ti8bai81oo5tg', 'common', 50, 150, 'mg', 0, 'clvdzrmrk016di8ba7e3vhuj7'),
       ('clvdzrmtb016vi8ba867042ks', 'strong', 150, 500, 'mg', 0, 'clvdzrmrk016di8ba7e3vhuj7'),
       ('clvdzrmti016xi8ba3snt539n', 'heavy', 500, 500, 'mg', 0, 'clvdzrmrk016di8ba7e3vhuj7'),
       ('clvdzrmu50171i8bamx5l9mhj', 'threshold', 30, 30, 'g', 0, 'clvdzrmts016zi8ba0nnh2lf0'),
       ('clvdzrmuc0173i8banawuiss6', 'light', 30, 65, 'g', 0, 'clvdzrmts016zi8ba0nnh2lf0'),
       ('clvdzrmuj0175i8bayzox0c0v', 'common', 65, 100, 'g', 0, 'clvdzrmts016zi8ba0nnh2lf0'),
       ('clvdzrmus0177i8bau3394pg1', 'strong', 100, 300, 'g', 0, 'clvdzrmts016zi8ba0nnh2lf0'),
       ('clvdzrmv10179i8baoxn0nct2', 'heavy', 300, 300, 'g', 0, 'clvdzrmts016zi8ba0nnh2lf0'),
       ('clvdzrmvi017di8bakuhhbfub', 'threshold', 2, 2, 'mg', 0, 'clvdzrmva017bi8bazz880t7n'),
       ('clvdzrmvp017fi8babg0c0urj', 'light', 5, 15, 'mg', 0, 'clvdzrmva017bi8bazz880t7n'),
       ('clvdzrmw0017hi8baqt98jjeu', 'common', 15, 30, 'mg', 0, 'clvdzrmva017bi8bazz880t7n'),
       ('clvdzrmw9017ji8basvt006g6', 'strong', 30, 60, 'mg', 0, 'clvdzrmva017bi8bazz880t7n'),
       ('clvdzrmwh017li8bac4frduym', 'heavy', 60, 60, 'mg', 0, 'clvdzrmva017bi8bazz880t7n'),
       ('clvdzrmxd017ti8bajgpc5ruz', 'threshold', 1, 1, 'mg', 0, 'clvdzrmwp017ni8babduglhp0'),
       ('clvdzrmxl017vi8ba7dqc1zvc', 'light', 2.5, 5, 'mg', 0, 'clvdzrmwp017ni8babduglhp0'),
       ('clvdzrmxq017xi8ba88clyy58', 'common', 5, 10, 'mg', 0, 'clvdzrmwp017ni8babduglhp0'),
       ('clvdzrmxx017zi8bag33tqdo3', 'strong', 10, 25, 'mg', 0, 'clvdzrmwp017ni8babduglhp0'),
       ('clvdzrmy50181i8ba577rzjdy', 'heavy', 25, 25, 'mg', 0, 'clvdzrmwp017ni8babduglhp0'),
       ('clvdzrmyc0183i8badxn8ritt', 'threshold', 0.4, 0.4, 'mg', 0, 'clvdzrmwy017pi8bavmgdoe1b'),
       ('clvdzrmyi0185i8bao7xvhdq9', 'light', 0.4, 2, 'mg', 0, 'clvdzrmwy017pi8bavmgdoe1b'),
       ('clvdzrmyp0187i8baz4uzb72e', 'common', 2, 4, 'mg', 0, 'clvdzrmwy017pi8bavmgdoe1b'),
       ('clvdzrmyv0189i8bapvvxfgtz', 'strong', 4, 10, 'mg', 0, 'clvdzrmwy017pi8bavmgdoe1b'),
       ('clvdzrmz1018bi8basesjcil9', 'heavy', 10, 10, 'mg', 0, 'clvdzrmwy017pi8bavmgdoe1b'),
       ('clvdzrmzf018fi8bam2irhv7g', 'threshold', 50, 50, 'mg', 0, 'clvdzrmz8018di8ba39j4cia2'),
       ('clvdzrmzq018hi8bakcfxj7nv', 'light', 100, 325, 'mg', 0, 'clvdzrmz8018di8ba39j4cia2'),
       ('clvdzrmzv018ji8ba5xurdpcl', 'common', 325, 500, 'mg', 0, 'clvdzrmz8018di8ba39j4cia2'),
       ('clvdzrn02018li8bamm8w8spa', 'strong', 500, 750, 'mg', 0, 'clvdzrmz8018di8ba39j4cia2'),
       ('clvdzrn0c018ni8bakmsqyrwf', 'heavy', 750, 750, 'mg', 0, 'clvdzrmz8018di8ba39j4cia2'),
       ('clvdzrn0o018ri8baskwjy2cz', 'threshold', 5, 5, 'mg', 0, 'clvdzrn0i018pi8basmykgbmi'),
       ('clvdzrn0w018ti8bajobhozvf', 'light', 5, 10, 'mg', 0, 'clvdzrn0i018pi8basmykgbmi'),
       ('clvdzrn15018vi8bacjg7um3a', 'common', 10, 25, 'mg', 0, 'clvdzrn0i018pi8basmykgbmi'),
       ('clvdzrn1b018xi8ba990hjs5i', 'strong', 50, 100, 'mg', 0, 'clvdzrn0i018pi8basmykgbmi'),
       ('clvdzrn1j018zi8bae1az5r1k', 'heavy', 100, 100, 'mg', 0, 'clvdzrn0i018pi8basmykgbmi'),
       ('clvdzrn1u0193i8bapqlwf1q1', 'threshold', 50, 50, 'mg', 0, 'clvdzrn1p0191i8bamrrhbwyy'),
       ('clvdzrn210195i8barno2pht3', 'light', 100, 250, 'mg', 0, 'clvdzrn1p0191i8bamrrhbwyy'),
       ('clvdzrn290197i8baowfunbn6', 'common', 250, 1000, 'mg', 0, 'clvdzrn1p0191i8bamrrhbwyy'),
       ('clvdzrn2h0199i8bano44tmny', 'strong', 1000, 2000, 'mg', 0, 'clvdzrn1p0191i8bamrrhbwyy'),
       ('clvdzrn2n019bi8baaddc4kkl', 'heavy', 2000, 2000, 'mg', 0, 'clvdzrn1p0191i8bamrrhbwyy'),
       ('clvdzrn33019fi8bavlispgp1', 'threshold', 20, 20, 'mg', 0, 'clvdzrn2v019di8baevow978s'),
       ('clvdzrn3a019hi8bang5xrfe1', 'light', 20, 40, 'mg', 0, 'clvdzrn2v019di8baevow978s'),
       ('clvdzrn3g019ji8bacrk3ey4r', 'common', 40, 80, 'mg', 0, 'clvdzrn2v019di8baevow978s'),
       ('clvdzrn3o019li8ba59vfu7wt', 'strong', 80, 200, 'mg', 0, 'clvdzrn2v019di8baevow978s'),
       ('clvdzrn3w019ni8ba3bm1gkor', 'heavy', 200, 200, 'mg', 0, 'clvdzrn2v019di8baevow978s'),
       ('clvdzrn47019ri8bah2xsxqxr', 'threshold', 50, 50, 'mg', 0, 'clvdzrn41019pi8baai787pai'),
       ('clvdzrn4f019ti8ba953kef13', 'light', 100, 250, 'mg', 0, 'clvdzrn41019pi8baai787pai'),
       ('clvdzrn4l019vi8babo69hsel', 'common', 250, 1000, 'mg', 0, 'clvdzrn41019pi8baai787pai'),
       ('clvdzrn4r019xi8ba6xlw1c6w', 'strong', 1000, 2000, 'mg', 0, 'clvdzrn41019pi8baai787pai'),
       ('clvdzrn50019zi8ba9v2dhwtb', 'heavy', 2000, 2000, 'mg', 0, 'clvdzrn41019pi8baai787pai'),
       ('clvdzrn5g01a3i8ban747lvok', 'threshold', 0.1, 0.1, 'mg', 0, 'clvdzrn5901a1i8balbi6r964'),
       ('clvdzrn5n01a5i8badjjjxclj', 'light', 0.25, 0.5, 'mg', 0, 'clvdzrn5901a1i8balbi6r964'),
       ('clvdzrn5u01a7i8baa3s73fnh', 'common', 0.5, 1, 'mg', 0, 'clvdzrn5901a1i8balbi6r964'),
       ('clvdzrn6001a9i8ba05lkp0ee', 'strong', 1, 2, 'mg', 0, 'clvdzrn5901a1i8balbi6r964'),
       ('clvdzrn6501abi8ba073nzx3f', 'heavy', 2, 2, 'mg', 0, 'clvdzrn5901a1i8balbi6r964'),
       ('clvdzrn6j01afi8baj674ft5h', 'threshold', 50, 50, 'µg', 0, 'clvdzrn6b01adi8ba6n04jnbj'),
       ('clvdzrn6r01ahi8ba3l8ho60l', 'light', 75, 200, 'µg', 0, 'clvdzrn6b01adi8ba6n04jnbj'),
       ('clvdzrn6y01aji8baq336qiyu', 'common', 200, 400, 'µg', 0, 'clvdzrn6b01adi8ba6n04jnbj'),
       ('clvdzrn7601ali8balmoyqgt0', 'strong', 400, 1, 'µg', 0, 'clvdzrn6b01adi8ba6n04jnbj'),
       ('clvdzrn7f01ani8ba9jv64xft', 'heavy', 1, 1, 'µg', 0, 'clvdzrn6b01adi8ba6n04jnbj'),
       ('clvdzrn7v01ari8bai5yw7quk', 'threshold', 25, 25, 'μg', 0, 'clvdzrn7m01api8ba6xt7prbj'),
       ('clvdzrn8501ati8baf5zcfb0t', 'light', 50, 75, 'μg', 0, 'clvdzrn7m01api8ba6xt7prbj'),
       ('clvdzrn8a01avi8ba6bhg5e37', 'common', 75, 100, 'μg', 0, 'clvdzrn7m01api8ba6xt7prbj'),
       ('clvdzrn8i01axi8batc7s91q8', 'strong', 100, 300, 'μg', 0, 'clvdzrn7m01api8ba6xt7prbj'),
       ('clvdzrn8p01azi8bay2u90s7s', 'heavy', 300, 300, 'μg', 0, 'clvdzrn7m01api8ba6xt7prbj'),
       ('clvdzrn9b01b5i8bahobfpbej', 'threshold', 5, 5, 'mg', 0, 'clvdzrn8u01b1i8baaw73st7a'),
       ('clvdzrn9k01b7i8ba4zffspbn', 'light', 10, 30, 'mg', 0, 'clvdzrn8u01b1i8baaw73st7a'),
       ('clvdzrn9s01b9i8bazhjqmzh5', 'common', 30, 60, 'mg', 0, 'clvdzrn8u01b1i8baaw73st7a'),
       ('clvdzrn9z01bbi8ba3fmswjeh', 'strong', 60, 90, 'mg', 0, 'clvdzrn8u01b1i8baaw73st7a'),
       ('clvdzrna701bdi8bani0m3z9f', 'heavy', 90, 90, 'mg', 0, 'clvdzrn8u01b1i8baaw73st7a'),
       ('clvdzrnal01bhi8bapzf5klbz', 'threshold', 30, 30, 'mg', 0, 'clvdzrnae01bfi8ba5h7j7x89'),
       ('clvdzrnas01bji8baq8rvmf57', 'light', 50, 100, 'mg', 0, 'clvdzrnae01bfi8ba5h7j7x89'),
       ('clvdzrnay01bli8ba3hj2cq2o', 'common', 100, 150, 'mg', 0, 'clvdzrnae01bfi8ba5h7j7x89'),
       ('clvdzrnb501bni8bakztj5upn', 'strong', 150, 200, 'mg', 0, 'clvdzrnae01bfi8ba5h7j7x89'),
       ('clvdzrnbe01bpi8bame8dxrqh', 'heavy', 200, 200, 'mg', 0, 'clvdzrnae01bfi8ba5h7j7x89'),
       ('clvdzrnc001bvi8bad17os2y9', 'threshold', 1, 1, 'mg', 0, 'clvdzrnbn01bri8baov4qx62s'),
       ('clvdzrnc801bxi8balhq1wruu', 'light', 2, 5, 'mg', 0, 'clvdzrnbn01bri8baov4qx62s'),
       ('clvdzrncf01bzi8bao0jvd41a', 'common', 5, 10, 'mg', 0, 'clvdzrnbn01bri8baov4qx62s'),
       ('clvdzrncs01c1i8ba7z7tp8mt', 'strong', 10, 20, 'mg', 0, 'clvdzrnbn01bri8baov4qx62s'),
       ('clvdzrnd301c3i8ba1sd4vrz2', 'heavy', 20, 20, 'mg', 0, 'clvdzrnbn01bri8baov4qx62s'),
       ('clvdzrnda01c5i8baalxzpvec', 'threshold', 1, 1, 'mg', 0, 'clvdzrnbt01bti8baypui4g7w'),
       ('clvdzrndi01c7i8baqt0arf0a', 'light', 3, 5, 'mg', 0, 'clvdzrnbt01bti8baypui4g7w'),
       ('clvdzrndo01c9i8ba6gnc8iv2', 'common', 5, 10, 'mg', 0, 'clvdzrnbt01bti8baypui4g7w'),
       ('clvdzrndv01cbi8ba9eete9by', 'strong', 10, 20, 'mg', 0, 'clvdzrnbt01bti8baypui4g7w'),
       ('clvdzrne301cdi8baeb9twhu2', 'heavy', 20, 20, 'mg', 0, 'clvdzrnbt01bti8baypui4g7w'),
       ('clvdzrnek01chi8bah84bvzqd', 'threshold', 0.25, 0.25, 'g', 0, 'clvdzrned01cfi8ba55t0f0l1'),
       ('clvdzrneq01cji8bajndkfxpf', 'light', 1, 5, 'g', 0, 'clvdzrned01cfi8ba55t0f0l1'),
       ('clvdzrnew01cli8bajvghz1vt', 'common', 5, 10, 'g', 0, 'clvdzrned01cfi8ba55t0f0l1'),
       ('clvdzrnf301cni8bam4tca3f4', 'strong', 10, 20, 'g', 0, 'clvdzrned01cfi8ba55t0f0l1'),
       ('clvdzrnf901cpi8bae2pehckq', 'heavy', 20, 20, 'g', 0, 'clvdzrned01cfi8ba55t0f0l1'),
       ('clvdzrnfk01cti8ba0ev2ngp1', 'threshold', 5, 5, 'mg', 0, 'clvdzrnfe01cri8ba239ogo93'),
       ('clvdzrnft01cvi8ba95yttrlk', 'light', 5, 15, 'mg', 0, 'clvdzrnfe01cri8ba239ogo93'),
       ('clvdzrnfz01cxi8basn9fmsmd', 'common', 15, 25, 'mg', 0, 'clvdzrnfe01cri8ba239ogo93'),
       ('clvdzrng701czi8baqd5juc0n', 'strong', 25, 40, 'mg', 0, 'clvdzrnfe01cri8ba239ogo93'),
       ('clvdzrngh01d1i8bavmjseqt7', 'heavy', 40, 40, 'mg', 0, 'clvdzrnfe01cri8ba239ogo93'),
       ('clvdzrngu01d5i8bapn4k49m2', 'threshold', 10, 10, 'mg', 0, 'clvdzrngn01d3i8bajoluuixq'),
       ('clvdzrnh201d7i8baagcjt2lc', 'light', 20, 40, 'mg', 0, 'clvdzrngn01d3i8bajoluuixq'),
       ('clvdzrnhh01d9i8baq2eqrhc1', 'common', 40, 70, 'mg', 0, 'clvdzrngn01d3i8bajoluuixq'),
       ('clvdzrnhu01dbi8balwqu26pa', 'strong', 70, 100, 'mg', 0, 'clvdzrngn01d3i8bajoluuixq'),
       ('clvdzrnib01ddi8bajtx9yrow', 'heavy', 100, 100, 'mg', 0, 'clvdzrngn01d3i8bajoluuixq'),
       ('clvdzrnj601dji8bap1zgqli9', 'threshold', 4, 4, 'mg', 0, 'clvdzrnil01dfi8ba7s2iefoh'),
       ('clvdzrnjb01dli8bamr3sxnys', 'light', 4, 10, 'mg', 0, 'clvdzrnil01dfi8ba7s2iefoh'),
       ('clvdzrnji01dni8bantmmwsvi', 'common', 10, 15, 'mg', 0, 'clvdzrnil01dfi8ba7s2iefoh'),
       ('clvdzrnjr01dpi8bafxptlc06', 'strong', 15, 20, 'mg', 0, 'clvdzrnil01dfi8ba7s2iefoh'),
       ('clvdzrnk101dri8ba9ati32he', 'heavy', 20, 20, 'mg', 0, 'clvdzrnil01dfi8ba7s2iefoh'),
       ('clvdzrnk701dti8ba7ofz7f2b', 'threshold', 2, 2, 'mg', 0, 'clvdzrniw01dhi8ba2osrwhqg'),
       ('clvdzrnke01dvi8batxduhbpb', 'light', 10, 20, 'mg', 0, 'clvdzrniw01dhi8ba2osrwhqg'),
       ('clvdzrnkm01dxi8ba1f15oqv2', 'common', 20, 40, 'mg', 0, 'clvdzrniw01dhi8ba2osrwhqg'),
       ('clvdzrnks01dzi8bau6ppa8qs', 'strong', 40, 60, 'mg', 0, 'clvdzrniw01dhi8ba2osrwhqg'),
       ('clvdzrnkz01e1i8bao1axss2f', 'heavy', 60, 60, 'mg', 0, 'clvdzrniw01dhi8ba2osrwhqg'),
       ('clvdzrnle01e5i8bacwz4q6on', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzrnl601e3i8bau70n0vut'),
       ('clvdzrnlj01e7i8baiyrvsrdc', 'light', 0.2, 0.75, 'mg', 0, 'clvdzrnl601e3i8bau70n0vut'),
       ('clvdzrnlo01e9i8baw5kshbb0', 'common', 0.75, 1.75, 'mg', 0, 'clvdzrnl601e3i8bau70n0vut'),
       ('clvdzrnlx01ebi8ba46uc6a8p', 'strong', 1.75, 3, 'mg', 0, 'clvdzrnl601e3i8bau70n0vut'),
       ('clvdzrnm601edi8bamr1x6o05', 'heavy', 3, 3, 'mg', 0, 'clvdzrnl601e3i8bau70n0vut'),
       ('clvdzrnms01eji8bafmlmrwos', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzrnmc01efi8ba90w5pkaj'),
       ('clvdzrnmy01eli8ba7vk2udzk', 'light', 0.25, 1, 'mg', 0, 'clvdzrnmc01efi8ba90w5pkaj'),
       ('clvdzrnn401eni8ba8cuuji8w', 'common', 1, 2, 'mg', 0, 'clvdzrnmc01efi8ba90w5pkaj'),
       ('clvdzrnnb01epi8bah2v4mc2h', 'strong', 2, 3.5, 'mg', 0, 'clvdzrnmc01efi8ba90w5pkaj'),
       ('clvdzrnnh01eri8ba0fmmu7ra', 'heavy', 3.5, 3.5, 'mg', 0, 'clvdzrnmc01efi8ba90w5pkaj'),
       ('clvdzrnnp01eti8baglp9q5am', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrnmk01ehi8basww90qp2'),
       ('clvdzrnnw01evi8baf7zbw4ov', 'light', 1, 2, 'mg', 0, 'clvdzrnmk01ehi8basww90qp2'),
       ('clvdzrno601exi8ba4rddkdtn', 'common', 2, 4, 'mg', 0, 'clvdzrnmk01ehi8basww90qp2'),
       ('clvdzrnoc01ezi8bac0h78e1j', 'strong', 4, 6, 'mg', 0, 'clvdzrnmk01ehi8basww90qp2'),
       ('clvdzrnoj01f1i8bai8l9f4d0', 'heavy', 6, 6, 'mg', 0, 'clvdzrnmk01ehi8basww90qp2'),
       ('clvdzrnp001f5i8bak9kixn7b', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrnor01f3i8bafvy0vka0'),
       ('clvdzrnp601f7i8bah5on2nrr', 'light', 0.5, 1, 'mg', 0, 'clvdzrnor01f3i8bafvy0vka0'),
       ('clvdzrnpd01f9i8baj0jrrvo4', 'common', 1, 2, 'mg', 0, 'clvdzrnor01f3i8bafvy0vka0'),
       ('clvdzrnpk01fbi8bal061xbdu', 'strong', 2, 3, 'mg', 0, 'clvdzrnor01f3i8bafvy0vka0'),
       ('clvdzrnpr01fdi8basi21bm2u', 'heavy', 3, 3, 'mg', 0, 'clvdzrnor01f3i8bafvy0vka0'),
       ('clvdzrnq901fhi8bagobi5tou', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrnpz01ffi8bafyn0nih1'),
       ('clvdzrnqe01fji8ba5729tqik', 'light', 1, 3, 'mg', 0, 'clvdzrnpz01ffi8bafyn0nih1'),
       ('clvdzrnql01fli8bana6irt69', 'common', 3, 5, 'mg', 0, 'clvdzrnpz01ffi8bafyn0nih1'),
       ('clvdzrnqr01fni8baehndmol9', 'strong', 5, 10, 'mg', 0, 'clvdzrnpz01ffi8bafyn0nih1'),
       ('clvdzrnqz01fpi8babwdlnwlw', 'heavy', 10, 10, 'mg', 0, 'clvdzrnpz01ffi8bafyn0nih1'),
       ('clvdzrnro01fxi8bahsl01i8d', 'threshold', 5, 5, 'mg', 0, 'clvdzrnr401fri8badzpk197a'),
       ('clvdzrnru01fzi8baqmeqyu5k', 'light', 20, 50, 'mg', 0, 'clvdzrnr401fri8badzpk197a'),
       ('clvdzrns001g1i8ba3zu9bms8', 'common', 50, 100, 'mg', 0, 'clvdzrnr401fri8badzpk197a'),
       ('clvdzrns701g3i8ba5s79pggh', 'strong', 100, 200, 'mg', 0, 'clvdzrnr401fri8badzpk197a'),
       ('clvdzrnsf01g5i8bar24ombhy', 'heavy', 200, 200, 'mg', 0, 'clvdzrnr401fri8badzpk197a'),
       ('clvdzrnsm01g7i8bapywahg1q', 'threshold', 50, 50, 'mg', 0, 'clvdzrnra01fti8ba045sngo3'),
       ('clvdzrnst01g9i8baxpwws3xo', 'light', 75, 150, 'mg', 0, 'clvdzrnra01fti8ba045sngo3'),
       ('clvdzrnt001gbi8batrl679g0', 'common', 150, 250, 'mg', 0, 'clvdzrnra01fti8ba045sngo3'),
       ('clvdzrnt801gdi8baspzyinz8', 'strong', 250, 350, 'mg', 0, 'clvdzrnra01fti8ba045sngo3'),
       ('clvdzrnte01gfi8ba7dc4u0zq', 'heavy', 350, 350, 'mg', 0, 'clvdzrnra01fti8ba045sngo3'),
       ('clvdzrntm01ghi8bamscr2u3p', 'threshold', 10, 10, 'mg', 0, 'clvdzrnrg01fvi8bagwmsdogz'),
       ('clvdzrntt01gji8ba6glzyc23', 'light', 15, 20, 'mg', 0, 'clvdzrnrg01fvi8bagwmsdogz'),
       ('clvdzrntz01gli8baon6wx6jj', 'common', 20, 50, 'mg', 0, 'clvdzrnrg01fvi8bagwmsdogz'),
       ('clvdzrnu701gni8bal13goe13', 'strong', 50, 100, 'mg', 0, 'clvdzrnrg01fvi8bagwmsdogz'),
       ('clvdzrnuf01gpi8bak3r5xtsk', 'heavy', 100, 100, 'mg', 0, 'clvdzrnrg01fvi8bagwmsdogz'),
       ('clvdzrnuz01gvi8bai5uguhxo', 'threshold', 1, 1, 'mg', 0, 'clvdzrnus01gti8baxskbadii'),
       ('clvdzrnv601gxi8baz7l5a9oj', 'light', 2, 4, 'mg', 0, 'clvdzrnus01gti8baxskbadii'),
       ('clvdzrnvc01gzi8baul18cp9f', 'common', 4, 6, 'mg', 0, 'clvdzrnus01gti8baxskbadii'),
       ('clvdzrnvi01h1i8ba2pl0si1o', 'strong', 6, 12, 'mg', 0, 'clvdzrnus01gti8baxskbadii'),
       ('clvdzrnvq01h3i8ba5jwxf8oe', 'heavy', 12, 12, 'mg', 0, 'clvdzrnus01gti8baxskbadii'),
       ('clvdzrnwi01hbi8baiem6h62x', 'threshold', 5, 5, 'mg', 0, 'clvdzrnvw01h5i8ba27pnenly'),
       ('clvdzrnwp01hdi8bahwknpw1h', 'light', 10, 15, 'mg', 0, 'clvdzrnvw01h5i8ba27pnenly'),
       ('clvdzrnwv01hfi8ba9eahl5gk', 'common', 15, 25, 'mg', 0, 'clvdzrnvw01h5i8ba27pnenly'),
       ('clvdzrnx301hhi8baw6x7gw61', 'strong', 25, 40, 'mg', 0, 'clvdzrnvw01h5i8ba27pnenly'),
       ('clvdzrnxb01hji8bathbfa6u5', 'heavy', 40, 40, 'mg', 0, 'clvdzrnvw01h5i8ba27pnenly'),
       ('clvdzrnxi01hli8bacqvaxzbp', 'threshold', 10, 10, 'mg', 0, 'clvdzrnw201h7i8ba25hypjm8'),
       ('clvdzrnxn01hni8baams05177', 'light', 10, 20, 'mg', 0, 'clvdzrnw201h7i8ba25hypjm8'),
       ('clvdzrnxv01hpi8balrc824vc', 'common', 20, 30, 'mg', 0, 'clvdzrnw201h7i8ba25hypjm8'),
       ('clvdzrny001hri8bawjjwaalx', 'strong', 30, 50, 'mg', 0, 'clvdzrnw201h7i8ba25hypjm8'),
       ('clvdzrny601hti8badvr9pbh2', 'heavy', 50, 50, 'mg', 0, 'clvdzrnw201h7i8ba25hypjm8'),
       ('clvdzrnyc01hvi8ba9v3gtjda', 'threshold', 5, 5, 'mg', 0, 'clvdzrnw701h9i8bai6qay9sw'),
       ('clvdzrnyl01hxi8ba52fl0dq4', 'light', 5, 10, 'mg', 0, 'clvdzrnw701h9i8bai6qay9sw'),
       ('clvdzrnyt01hzi8baamcwu86o', 'common', 10, 20, 'mg', 0, 'clvdzrnw701h9i8bai6qay9sw'),
       ('clvdzrnz001i1i8bactvn1lad', 'strong', 20, 40, 'mg', 0, 'clvdzrnw701h9i8bai6qay9sw'),
       ('clvdzrnza01i3i8ba9j0c6h46', 'heavy', 40, 40, 'mg', 0, 'clvdzrnw701h9i8bai6qay9sw'),
       ('clvdzrnzq01i7i8baczoq6pmw', 'threshold', 10, 10, 'mg', 0, 'clvdzrnzk01i5i8ba5swvql54'),
       ('clvdzrnzx01i9i8bakoi2cj7f', 'light', 10, 15, 'mg', 0, 'clvdzrnzk01i5i8ba5swvql54'),
       ('clvdzro0601ibi8ba3dcbwcfk', 'common', 15, 20, 'mg', 0, 'clvdzrnzk01i5i8ba5swvql54'),
       ('clvdzro0c01idi8baluvmhvxb', 'strong', 20, 30, 'mg', 0, 'clvdzrnzk01i5i8ba5swvql54'),
       ('clvdzro0k01ifi8bapixfzkps', 'heavy', 30, 30, 'mg', 0, 'clvdzrnzk01i5i8ba5swvql54'),
       ('clvdzro1401ili8baq4yvax4u', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzro0q01ihi8bafp9ap5h9'),
       ('clvdzro1c01ini8ba7maddpcz', 'light', 0.5, 1.5, 'mg', 0, 'clvdzro0q01ihi8bafp9ap5h9'),
       ('clvdzro1n01ipi8ba6vjrsn1g', 'common', 1.5, 3.5, 'mg', 0, 'clvdzro0q01ihi8bafp9ap5h9'),
       ('clvdzro1u01iri8ba2y2f1q41', 'strong', 3.5, 5, 'mg', 0, 'clvdzro0q01ihi8bafp9ap5h9'),
       ('clvdzro2c01iti8ba7o9dq3x3', 'heavy', 5, 5, 'mg', 0, 'clvdzro0q01ihi8bafp9ap5h9'),
       ('clvdzro2n01ivi8bahnobrl27', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzro0x01iji8bas53ca8h7'),
       ('clvdzro2w01ixi8bamsqspatj', 'light', 1, 2, 'mg', 0, 'clvdzro0x01iji8bas53ca8h7'),
       ('clvdzro3401izi8ba5xx1e3mh', 'common', 2, 6, 'mg', 0, 'clvdzro0x01iji8bas53ca8h7'),
       ('clvdzro3b01j1i8badw9l1us3', 'strong', 6, 8, 'mg', 0, 'clvdzro0x01iji8bas53ca8h7'),
       ('clvdzro3m01j3i8ba6zzmfw7j', 'heavy', 8, 8, 'mg', 0, 'clvdzro0x01iji8bas53ca8h7'),
       ('clvdzro4901j7i8bax738n9ag', 'threshold', 75, 75, 'mg', 0, 'clvdzro3u01j5i8baonr067hc'),
       ('clvdzro4g01j9i8bajy6jx6vs', 'light', 100, 200, 'mg', 0, 'clvdzro3u01j5i8baonr067hc'),
       ('clvdzro4n01jbi8badi3xg6ch', 'common', 200, 400, 'mg', 0, 'clvdzro3u01j5i8baonr067hc'),
       ('clvdzro4u01jdi8baqpxdvcy5', 'strong', 400, 700, 'mg', 0, 'clvdzro3u01j5i8baonr067hc'),
       ('clvdzro5301jfi8ba9tfyhf1e', 'heavy', 700, 700, 'mg', 0, 'clvdzro3u01j5i8baonr067hc'),
       ('clvdzro5l01jji8baeuck9ttk', 'threshold', 15, 15, 'mg', 0, 'clvdzro5b01jhi8bams5gfttv'),
       ('clvdzro5s01jli8ba1t4uck5d', 'light', 30, 65, 'mg', 0, 'clvdzro5b01jhi8bams5gfttv'),
       ('clvdzro5y01jni8baasusx4xa', 'common', 65, 100, 'mg', 0, 'clvdzro5b01jhi8bams5gfttv'),
       ('clvdzro6801jpi8bavvmmvtom', 'strong', 100, 200, 'mg', 0, 'clvdzro5b01jhi8bams5gfttv'),
       ('clvdzro6i01jri8bau0jynxh6', 'heavy', 200, 200, 'mg', 0, 'clvdzro5b01jhi8bams5gfttv'),
       ('clvdzro7701jxi8baisfygxmr', 'threshold', 15, 15, 'mg', 0, 'clvdzro6p01jti8baxui58476'),
       ('clvdzro7f01jzi8bappkvczfe', 'light', 15, 30, 'mg', 0, 'clvdzro6p01jti8baxui58476'),
       ('clvdzro7m01k1i8barpdjkj8b', 'common', 30, 75, 'mg', 0, 'clvdzro6p01jti8baxui58476'),
       ('clvdzro7u01k3i8ba4hzis0pi', 'strong', 75, 150, 'mg', 0, 'clvdzro6p01jti8baxui58476'),
       ('clvdzro8001k5i8ba5hh5k3xd', 'heavy', 150, 150, 'mg', 0, 'clvdzro6p01jti8baxui58476'),
       ('clvdzro8801k7i8bav3ojt14v', 'threshold', 5, 5, 'mg', 0, 'clvdzro6y01jvi8ba68pon9mf'),
       ('clvdzro8g01k9i8ba96bs4p3q', 'light', 10, 15, 'mg', 0, 'clvdzro6y01jvi8ba68pon9mf'),
       ('clvdzro8o01kbi8ba81qkigiu', 'common', 15, 20, 'mg', 0, 'clvdzro6y01jvi8ba68pon9mf'),
       ('clvdzro8u01kdi8baolt23fon', 'strong', 20, 30, 'mg', 0, 'clvdzro6y01jvi8ba68pon9mf'),
       ('clvdzro9a01khi8bawoirurw4', 'threshold', 1, 1, 'mg', 0, 'clvdzro9201kfi8bapnjq32dd'),
       ('clvdzro9g01kji8bavrqldz9p', 'light', 2.5, 5, 'mg', 0, 'clvdzro9201kfi8bapnjq32dd'),
       ('clvdzro9o01kli8banyf7bfxj', 'common', 5, 15, 'mg', 0, 'clvdzro9201kfi8bapnjq32dd'),
       ('clvdzro9u01kni8batiq8pqj0', 'strong', 15, 30, 'mg', 0, 'clvdzro9201kfi8bapnjq32dd'),
       ('clvdzroa101kpi8bajrp0hnfy', 'heavy', 30, 30, 'mg', 0, 'clvdzro9201kfi8bapnjq32dd'),
       ('clvdzroan01kvi8ba757rkjus', 'threshold', 3, 3, 'mg', 0, 'clvdzroa701kri8bacrtwrtcp'),
       ('clvdzroat01kxi8bab9ulnczh', 'light', 10, 20, 'mg', 0, 'clvdzroa701kri8bacrtwrtcp'),
       ('clvdzroay01kzi8baw7ddi55p', 'common', 20, 40, 'mg', 0, 'clvdzroa701kri8bacrtwrtcp'),
       ('clvdzrob401l1i8batvfhjzl2', 'strong', 40, 60, 'mg', 0, 'clvdzroa701kri8bacrtwrtcp'),
       ('clvdzrob901l3i8bas8u47tu4', 'heavy', 60, 60, 'mg', 0, 'clvdzroa701kri8bacrtwrtcp'),
       ('clvdzrobg01l5i8ba5v792zts', 'threshold', 2.5, 2.5, 'mg', 0, 'clvdzroag01kti8bauqs1rhn2'),
       ('clvdzrobm01l7i8bag4gf7kdo', 'light', 2.5, 7.5, 'mg', 0, 'clvdzroag01kti8bauqs1rhn2'),
       ('clvdzrobt01l9i8ba7dxv189z', 'common', 7.5, 20, 'mg', 0, 'clvdzroag01kti8bauqs1rhn2'),
       ('clvdzroc501lbi8ba30dzxdto', 'strong', 20, 50, 'mg', 0, 'clvdzroag01kti8bauqs1rhn2'),
       ('clvdzrocd01ldi8barx48j42c', 'heavy', 50, 50, 'mg', 0, 'clvdzroag01kti8bauqs1rhn2'),
       ('clvdzrocw01lhi8bae2zykfqb', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrocm01lfi8bausus2rqt'),
       ('clvdzrod101lji8bakdwycwt1', 'light', 0.5, 1, 'mg', 0, 'clvdzrocm01lfi8bausus2rqt'),
       ('clvdzroda01lli8baz63pzim4', 'common', 1, 3, 'mg', 0, 'clvdzrocm01lfi8bausus2rqt'),
       ('clvdzrodm01lni8bakfq39uxw', 'strong', 3, 4, 'mg', 0, 'clvdzrocm01lfi8bausus2rqt'),
       ('clvdzrodt01lpi8ba6e69mkua', 'heavy', 4, 4, 'mg', 0, 'clvdzrocm01lfi8bausus2rqt'),
       ('clvdzroea01lti8banhifvbda', 'threshold', 20, 20, 'mg', 0, 'clvdzroe001lri8basyamaztm'),
       ('clvdzroeg01lvi8bayq4naf1i', 'light', 50, 100, 'mg', 0, 'clvdzroe001lri8basyamaztm'),
       ('clvdzroeo01lxi8bama6ucetk', 'common', 100, 150, 'mg', 0, 'clvdzroe001lri8basyamaztm'),
       ('clvdzroev01lzi8bap5anr19s', 'strong', 150, 200, 'mg', 0, 'clvdzroe001lri8basyamaztm'),
       ('clvdzrof201m1i8ba8ctqln1n', 'heavy', 200, 200, 'mg', 0, 'clvdzroe001lri8basyamaztm'),
       ('clvdzroff01m5i8baen8cde89', 'threshold', 25, 25, 'mg', 0, 'clvdzrof701m3i8baohsx95dx'),
       ('clvdzrofm01m7i8ba1jkcwyrd', 'light', 100, 200, 'mg', 0, 'clvdzrof701m3i8baohsx95dx'),
       ('clvdzrofs01m9i8bahf6x3kx5', 'common', 200, 400, 'mg', 0, 'clvdzrof701m3i8baohsx95dx'),
       ('clvdzrog001mbi8ba1d8v19ki', 'strong', 400, 700, 'mg', 0, 'clvdzrof701m3i8baohsx95dx'),
       ('clvdzrog801mdi8ba2zi7sq9m', 'heavy', 700, 700, 'mg', 0, 'clvdzrof701m3i8baohsx95dx'),
       ('clvdzroh201mli8baq811j41p', 'threshold', 30, 30, 'mg', 0, 'clvdzroge01mfi8bae09z0f8r'),
       ('clvdzroha01mni8bayybr265h', 'light', 40, 65, 'mg', 0, 'clvdzroge01mfi8bae09z0f8r'),
       ('clvdzrohi01mpi8baah7n7v5s', 'common', 65, 100, 'mg', 0, 'clvdzroge01mfi8bae09z0f8r'),
       ('clvdzrohq01mri8baepkzu2vh', 'strong', 100, 130, 'mg', 0, 'clvdzroge01mfi8bae09z0f8r'),
       ('clvdzrohw01mti8bab3zpsv2f', 'heavy', 130, 130, 'mg', 0, 'clvdzroge01mfi8bae09z0f8r'),
       ('clvdzroi201mvi8ba0ykd7g2u', 'threshold', 5, 5, 'mg', 0, 'clvdzrogm01mhi8ba1af0yh0m'),
       ('clvdzroi901mxi8ba8m0mtosf', 'light', 10, 20, 'mg', 0, 'clvdzrogm01mhi8ba1af0yh0m'),
       ('clvdzroih01mzi8ba705i0qt2', 'common', 20, 40, 'mg', 0, 'clvdzrogm01mhi8ba1af0yh0m'),
       ('clvdzroio01n1i8ba2c5cqyxr', 'strong', 40, 80, 'mg', 0, 'clvdzrogm01mhi8ba1af0yh0m'),
       ('clvdzroiw01n3i8baey7sue6b', 'heavy', 80, 80, 'mg', 0, 'clvdzrogm01mhi8ba1af0yh0m'),
       ('clvdzroj301n5i8bafke78lrd', 'common', 20, 40, 'mg', 0, 'clvdzrogu01mji8bac8gkq6ri'),
       ('clvdzroj901n7i8banko70be3', 'strong', 40, 55, 'mg', 0, 'clvdzrogu01mji8bac8gkq6ri'),
       ('clvdzrojh01n9i8bajemshyce', 'heavy', 55, 55, 'mg', 0, 'clvdzrogu01mji8bac8gkq6ri'),
       ('clvdzrojt01ndi8ba1a5t8do9', 'light', 20, 40, 'mg', 0, 'clvdzrojo01nbi8bae6hpzdt1'),
       ('clvdzrok101nfi8ba0dedx2v3', 'common', 40, 80, 'mg', 0, 'clvdzrojo01nbi8bae6hpzdt1'),
       ('clvdzrok701nhi8babuvi74kn', 'strong', 80, 110, 'mg', 0, 'clvdzrojo01nbi8bae6hpzdt1'),
       ('clvdzroke01nji8baxwohcqei', 'heavy', 110, 110, 'mg', 0, 'clvdzrojo01nbi8bae6hpzdt1'),
       ('clvdzrol001npi8bahw2gxl90', 'threshold', 5, 5, 'mg', 0, 'clvdzrokk01nli8barm4ek4n9'),
       ('clvdzrol701nri8baftac9fln', 'light', 15, 35, 'mg', 0, 'clvdzrokk01nli8barm4ek4n9'),
       ('clvdzrold01nti8ba05pwp4ps', 'common', 35, 70, 'mg', 0, 'clvdzrokk01nli8barm4ek4n9'),
       ('clvdzrolk01nvi8baf68we9go', 'strong', 70, 100, 'mg', 0, 'clvdzrokk01nli8barm4ek4n9'),
       ('clvdzrolq01nxi8bajfw8rci9', 'heavy', 100, 100, 'mg', 0, 'clvdzrokk01nli8barm4ek4n9'),
       ('clvdzroly01nzi8bau03wi7c1', 'threshold', 60, 60, 'mg', 0, 'clvdzrokr01nni8batltucv9r'),
       ('clvdzrom501o1i8baldl5h96i', 'light', 100, 150, 'mg', 0, 'clvdzrokr01nni8batltucv9r'),
       ('clvdzromd01o3i8bahvt4hvb8', 'common', 150, 225, 'mg', 0, 'clvdzrokr01nni8batltucv9r'),
       ('clvdzromk01o5i8bakew200t6', 'strong', 225, 325, 'mg', 0, 'clvdzrokr01nni8batltucv9r'),
       ('clvdzromr01o7i8ban0jarhqm', 'heavy', 325, 325, 'mg', 0, 'clvdzrokr01nni8batltucv9r'),
       ('clvdzron201obi8ba0k6dtr9t', 'threshold', 15, 15, 'µg', 0, 'clvdzromw01o9i8baxizfdqr3'),
       ('clvdzronb01odi8bawuaus040', 'light', 30, 60, 'µg', 0, 'clvdzromw01o9i8baxizfdqr3'),
       ('clvdzronh01ofi8ba7dxwr0xk', 'common', 60, 150, 'µg', 0, 'clvdzromw01o9i8baxizfdqr3'),
       ('clvdzronn01ohi8bapo9jndx2', 'strong', 150, 225, 'µg', 0, 'clvdzromw01o9i8baxizfdqr3'),
       ('clvdzronu01oji8baat357y36', 'heavy', 225, 225, 'µg', 0, 'clvdzromw01o9i8baxizfdqr3'),
       ('clvdzroo801oni8bay5n3av1d', 'common', 600, 1800, 'mg', 0, 'clvdzroo101oli8ba6yaeulf9'),
       ('clvdzroom01ori8batedl0tm0', 'threshold', 5, 5, 'mg', 0, 'clvdzrooe01opi8ba5ms8fb0o'),
       ('clvdzroos01oti8bahgc2ldjt', 'light', 10, 20, 'mg', 0, 'clvdzrooe01opi8ba5ms8fb0o'),
       ('clvdzrooz01ovi8banoikw1os', 'common', 20, 30, 'mg', 0, 'clvdzrooe01opi8ba5ms8fb0o'),
       ('clvdzropa01oxi8bawekm5i92', 'strong', 30, 50, 'mg', 0, 'clvdzrooe01opi8ba5ms8fb0o'),
       ('clvdzropi01ozi8bagattsld0', 'heavy', 50, 50, 'mg', 0, 'clvdzrooe01opi8ba5ms8fb0o'),
       ('clvdzropy01p3i8basxbyzutv', 'threshold', 30, 30, 'mg', 0, 'clvdzropo01p1i8ba1da1w0f0'),
       ('clvdzroq501p5i8baz122vllx', 'light', 30, 70, 'mg', 0, 'clvdzropo01p1i8ba1da1w0f0'),
       ('clvdzroqb01p7i8ba1yw2fyuu', 'common', 70, 100, 'mg', 0, 'clvdzropo01p1i8ba1da1w0f0'),
       ('clvdzroqj01p9i8bayw1v20t6', 'strong', 100, 150, 'mg', 0, 'clvdzropo01p1i8ba1da1w0f0'),
       ('clvdzroqq01pbi8barvnj047l', 'heavy', 150, 150, 'mg', 0, 'clvdzropo01p1i8ba1da1w0f0'),
       ('clvdzror701pfi8ba25qsdw2h', 'threshold', 5, 5, 'mg', 0, 'clvdzroqx01pdi8babync8yru'),
       ('clvdzrord01phi8batgzv3ab2', 'light', 10, 20, 'mg', 0, 'clvdzroqx01pdi8babync8yru'),
       ('clvdzrorj01pji8ba9aqeijno', 'common', 20, 40, 'mg', 0, 'clvdzroqx01pdi8babync8yru'),
       ('clvdzrorp01pli8ba8zv4hmdo', 'strong', 40, 80, 'mg', 0, 'clvdzroqx01pdi8babync8yru'),
       ('clvdzros301ppi8ba3dcvkioh', 'threshold', 20, 20, 'mg', 0, 'clvdzrorv01pni8baykfaja8g'),
       ('clvdzrosc01pri8bay7hucf8g', 'light', 30, 50, 'mg', 0, 'clvdzrorv01pni8baykfaja8g'),
       ('clvdzrosi01pti8ba170ybizd', 'common', 50, 100, 'mg', 0, 'clvdzrorv01pni8baykfaja8g'),
       ('clvdzrosq01pvi8ba3d4xcvc5', 'strong', 100, 150, 'mg', 0, 'clvdzrorv01pni8baykfaja8g'),
       ('clvdzrot001pxi8basr4fid6k', 'heavy', 150, 150, 'mg', 0, 'clvdzrorv01pni8baykfaja8g'),
       ('clvdzrotd01q1i8baosawel0v', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrot601pzi8bar4hieo6q'),
       ('clvdzrotl01q3i8bait1wvj0r', 'light', 1, 1.5, 'mg', 0, 'clvdzrot601pzi8bar4hieo6q'),
       ('clvdzrotu01q5i8ba9psn8a6z', 'common', 2, 3, 'mg', 0, 'clvdzrot601pzi8bar4hieo6q'),
       ('clvdzroty01q7i8babtcixdr4', 'strong', 4, 5, 'mg', 0, 'clvdzrot601pzi8bar4hieo6q'),
       ('clvdzrou501q9i8bagsriqosp', 'heavy', 6, 6, 'mg', 0, 'clvdzrot601pzi8bar4hieo6q'),
       ('clvdzrouk01qdi8ba9iajfor4', 'threshold', 20, 20, 'mg', 0, 'clvdzrouc01qbi8babe9ntfos'),
       ('clvdzrous01qfi8bar5lc7log', 'light', 40, 50, 'mg', 0, 'clvdzrouc01qbi8babe9ntfos'),
       ('clvdzrov001qhi8ba2hhije36', 'common', 50, 100, 'mg', 0, 'clvdzrouc01qbi8babe9ntfos'),
       ('clvdzrov601qji8ball5pegv1', 'strong', 100, 200, 'mg', 0, 'clvdzrouc01qbi8babe9ntfos'),
       ('clvdzrovb01qli8ba1opfqm0i', 'heavy', 200, 200, 'mg', 0, 'clvdzrouc01qbi8babe9ntfos'),
       ('clvdzrovp01qpi8ba78olpa28', 'threshold', 75, 75, 'mg', 0, 'clvdzrovi01qni8ba2m42p4k2'),
       ('clvdzrovv01qri8batfkr3mrv', 'light', 75, 150, 'mg', 0, 'clvdzrovi01qni8ba2m42p4k2'),
       ('clvdzrow001qti8baquh0swhi', 'common', 150, 225, 'mg', 0, 'clvdzrovi01qni8ba2m42p4k2'),
       ('clvdzrowe01qvi8bastn6d9fx', 'strong', 225, 325, 'mg', 0, 'clvdzrovi01qni8ba2m42p4k2'),
       ('clvdzrown01qxi8bahwyqspdw', 'heavy', 325, 325, 'mg', 0, 'clvdzrovi01qni8ba2m42p4k2'),
       ('clvdzroxa01r3i8ba1bhtojvx', 'threshold', 10, 10, 'mg', 0, 'clvdzrowv01qzi8balmnwretc'),
       ('clvdzroxf01r5i8bae7zctdqh', 'light', 20, 40, 'mg', 0, 'clvdzrowv01qzi8balmnwretc'),
       ('clvdzroxn01r7i8banzbb85cm', 'common', 40, 80, 'mg', 0, 'clvdzrowv01qzi8balmnwretc'),
       ('clvdzroxu01r9i8ba5n9bb4or', 'strong', 80, 120, 'mg', 0, 'clvdzrowv01qzi8balmnwretc'),
       ('clvdzroy001rbi8bar4366tub', 'heavy', 120, 120, 'mg', 0, 'clvdzrowv01qzi8balmnwretc'),
       ('clvdzroy701rdi8bawooksg69', 'threshold', 5, 5, 'mg', 0, 'clvdzrox301r1i8batd56ek3o'),
       ('clvdzroyh01rfi8baytxeddmb', 'light', 5, 15, 'mg', 0, 'clvdzrox301r1i8batd56ek3o'),
       ('clvdzroyn01rhi8balwsed39a', 'common', 15, 30, 'mg', 0, 'clvdzrox301r1i8batd56ek3o'),
       ('clvdzroyt01rji8ba510hy8js', 'strong', 30, 50, 'mg', 0, 'clvdzrox301r1i8batd56ek3o'),
       ('clvdzroyz01rli8batk9spvo6', 'heavy', 50, 50, 'mg', 0, 'clvdzrox301r1i8batd56ek3o'),
       ('clvdzroze01rpi8bakgiopa5j', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzroz801rni8bawurmx2mk'),
       ('clvdzrozj01rri8baq3lcrdtm', 'light', 0.5, 1, 'mg', 0, 'clvdzroz801rni8bawurmx2mk'),
       ('clvdzrozs01rti8bam0p9t26a', 'common', 1, 2, 'mg', 0, 'clvdzroz801rni8bawurmx2mk'),
       ('clvdzrozz01rvi8baes01urgs', 'strong', 2, 5, 'mg', 0, 'clvdzroz801rni8bawurmx2mk'),
       ('clvdzrp0601rxi8bao4qup010', 'heavy', 5, 5, 'mg', 0, 'clvdzroz801rni8bawurmx2mk'),
       ('clvdzrp0s01s3i8basckbab74', 'threshold', 5, 5, 'mg', 0, 'clvdzrp0f01rzi8bajysq1b1j'),
       ('clvdzrp0y01s5i8bac83nzl2z', 'light', 5, 15, 'mg', 0, 'clvdzrp0f01rzi8bajysq1b1j'),
       ('clvdzrp1801s7i8baipb8dgwr', 'common', 15, 40, 'mg', 0, 'clvdzrp0f01rzi8bajysq1b1j'),
       ('clvdzrp1h01s9i8ba7b1dmdaq', 'strong', 40, 80, 'mg', 0, 'clvdzrp0f01rzi8bajysq1b1j'),
       ('clvdzrp1n01sbi8ba52t3jth6', 'heavy', 80, 80, 'mg', 0, 'clvdzrp0f01rzi8bajysq1b1j'),
       ('clvdzrp1w01sdi8bajvpvo0kl', 'threshold', 20, 20, 'mg', 0, 'clvdzrp0l01s1i8bauxvg6464'),
       ('clvdzrp2301sfi8bajl49m07j', 'light', 20, 50, 'mg', 0, 'clvdzrp0l01s1i8bauxvg6464'),
       ('clvdzrp2901shi8bas01fb4af', 'common', 50, 100, 'mg', 0, 'clvdzrp0l01s1i8bauxvg6464'),
       ('clvdzrp2e01sji8bafzrk7bcu', 'strong', 100, 135, 'mg', 0, 'clvdzrp0l01s1i8bauxvg6464'),
       ('clvdzrp2l01sli8bajj9lqm5d', 'heavy', 135, 135, 'mg', 0, 'clvdzrp0l01s1i8bauxvg6464'),
       ('clvdzrp3201spi8ba039mvoj6', 'threshold', 25, 25, 'mg', 0, 'clvdzrp2v01sni8baw7ssek43'),
       ('clvdzrp3a01sri8ba434gqur5', 'light', 100, 200, 'mg', 0, 'clvdzrp2v01sni8baw7ssek43'),
       ('clvdzrp3i01sti8baf8c6t2e4', 'common', 200, 400, 'mg', 0, 'clvdzrp2v01sni8baw7ssek43'),
       ('clvdzrp3o01svi8bai0j1expn', 'strong', 400, 700, 'mg', 0, 'clvdzrp2v01sni8baw7ssek43'),
       ('clvdzrp3t01sxi8baev4jcajq', 'heavy', 700, 700, 'mg', 0, 'clvdzrp2v01sni8baw7ssek43'),
       ('clvdzrp4a01t1i8baodd9bfri', 'threshold', 50, 50, 'mg', 0, 'clvdzrp4201szi8bahlahc5bk'),
       ('clvdzrp4g01t3i8bajqb8563z', 'light', 100, 150, 'mg', 0, 'clvdzrp4201szi8bahlahc5bk'),
       ('clvdzrp4o01t5i8bargwgsol3', 'common', 150, 400, 'mg', 0, 'clvdzrp4201szi8bahlahc5bk'),
       ('clvdzrp4v01t7i8ba16l8ihrz', 'strong', 400, 600, 'mg', 0, 'clvdzrp4201szi8bahlahc5bk'),
       ('clvdzrp5101t9i8baxpr6mzvu', 'heavy', 600, 600, 'mg', 0, 'clvdzrp4201szi8bahlahc5bk'),
       ('clvdzrp5v01thi8bajhxiibfp', 'threshold', 5, 5, 'μg', 0, 'clvdzrp5901tbi8bar1bjc2om'),
       ('clvdzrp6301tji8badm2ylklg', 'light', 10, 25, 'μg', 0, 'clvdzrp5901tbi8bar1bjc2om'),
       ('clvdzrp6b01tli8baovuk8qvk', 'common', 25, 50, 'μg', 0, 'clvdzrp5901tbi8bar1bjc2om'),
       ('clvdzrp6i01tni8ba40kuk75d', 'strong', 50, 75, 'μg', 0, 'clvdzrp5901tbi8bar1bjc2om'),
       ('clvdzrp6p01tpi8ba3y8gwflv', 'threshold', 5, 5, 'μg', 0, 'clvdzrp5h01tdi8ba1thshmns'),
       ('clvdzrp6x01tri8badtvkcxhw', 'light', 10, 25, 'μg', 0, 'clvdzrp5h01tdi8ba1thshmns'),
       ('clvdzrp7401tti8ba89ca53gt', 'common', 25, 50, 'μg', 0, 'clvdzrp5h01tdi8ba1thshmns'),
       ('clvdzrp7c01tvi8baomz2alwn', 'strong', 50, 75, 'μg', 0, 'clvdzrp5h01tdi8ba1thshmns'),
       ('clvdzrp7k01txi8baj1vck596', 'heavy', 75, 75, 'μg', 0, 'clvdzrp5h01tdi8ba1thshmns'),
       ('clvdzrp7u01tzi8bazsas1i5c', 'threshold', 5, 5, 'μg', 0, 'clvdzrp5o01tfi8bagg70eesi'),
       ('clvdzrp8001u1i8banqp2vnnm', 'light', 12, 25, 'μg', 0, 'clvdzrp5o01tfi8bagg70eesi'),
       ('clvdzrp8901u3i8bajczt7ivb', 'common', 25, 50, 'μg', 0, 'clvdzrp5o01tfi8bagg70eesi'),
       ('clvdzrp8h01u5i8bax7fmrdk8', 'strong', 50, 100, 'μg', 0, 'clvdzrp5o01tfi8bagg70eesi'),
       ('clvdzrp8o01u7i8baehrk06lx', 'heavy', 100, 100, 'μg', 0, 'clvdzrp5o01tfi8bagg70eesi'),
       ('clvdzrp9301ubi8bas46efryz', 'threshold', 0.05, 0.05, 'mg', 0, 'clvdzrp8v01u9i8baae51bfs4'),
       ('clvdzrp9901udi8ba2alht3ix', 'light', 0.1, 0.3, 'mg', 0, 'clvdzrp8v01u9i8baae51bfs4'),
       ('clvdzrp9e01ufi8banss8nctp', 'common', 0.3, 0.5, 'mg', 0, 'clvdzrp8v01u9i8baae51bfs4'),
       ('clvdzrp9m01uhi8bayxkgsf15', 'strong', 0.5, 1, 'mg', 0, 'clvdzrp8v01u9i8baae51bfs4'),
       ('clvdzrp9u01uji8ba1fxu0m8u', 'heavy', 1, 1, 'mg', 0, 'clvdzrp8v01u9i8baae51bfs4'),
       ('clvdzrpa801uni8bawqrlmucf', 'threshold', 2, 2, 'mg', 0, 'clvdzrpa001uli8ba7mtmx8i4'),
       ('clvdzrpaf01upi8ba6fg8l8ze', 'light', 3, 5, 'mg', 0, 'clvdzrpa001uli8ba7mtmx8i4'),
       ('clvdzrpal01uri8bablqyul7b', 'common', 5, 8, 'mg', 0, 'clvdzrpa001uli8ba7mtmx8i4'),
       ('clvdzrpar01uti8bau08zmqsv', 'strong', 8, 12, 'mg', 0, 'clvdzrpa001uli8ba7mtmx8i4'),
       ('clvdzrpaz01uvi8baikls13j0', 'heavy', 12, 12, 'mg', 0, 'clvdzrpa001uli8ba7mtmx8i4'),
       ('clvdzrpbe01uzi8basyswfw78', 'threshold', 50, 50, 'μg', 0, 'clvdzrpb601uxi8bat68uc6uv'),
       ('clvdzrpbk01v1i8ba3opw1k7w', 'light', 100, 150, 'μg', 0, 'clvdzrpb601uxi8bat68uc6uv'),
       ('clvdzrpbs01v3i8barpbmcu9v', 'common', 150, 250, 'μg', 0, 'clvdzrpb601uxi8bat68uc6uv'),
       ('clvdzrpbz01v5i8baxw9pancc', 'strong', 250, 400, 'μg', 0, 'clvdzrpb601uxi8bat68uc6uv'),
       ('clvdzrpc501v7i8bat9wp4oht', 'heavy', 400, 400, 'μg', 0, 'clvdzrpb601uxi8bat68uc6uv'),
       ('clvdzrpcm01vbi8barsc7goba', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzrpcf01v9i8bayipsdiar'),
       ('clvdzrpcs01vdi8baw2ha29nh', 'light', 0.5, 1, 'mg', 0, 'clvdzrpcf01v9i8bayipsdiar'),
       ('clvdzrpcx01vfi8ba2anvyz7c', 'common', 1, 3, 'mg', 0, 'clvdzrpcf01v9i8bayipsdiar'),
       ('clvdzrpd601vhi8baay388ioq', 'strong', 3, 4, 'mg', 0, 'clvdzrpcf01v9i8bayipsdiar'),
       ('clvdzrpdd01vji8baotf08i98', 'heavy', 4, 4, 'mg', 0, 'clvdzrpcf01v9i8bayipsdiar'),
       ('clvdzrpdv01vni8baypyoy15j', 'threshold', 0.1, 0.1, 'mg', 0, 'clvdzrpdl01vli8bac6z8h7h6'),
       ('clvdzrpe201vpi8ba8hd35n6o', 'light', 0.1, 0.2, 'mg', 0, 'clvdzrpdl01vli8bac6z8h7h6'),
       ('clvdzrpe801vri8bagq1py6po', 'common', 0.2, 0.3, 'mg', 0, 'clvdzrpdl01vli8bac6z8h7h6'),
       ('clvdzrpef01vti8bav2grs7sp', 'strong', 0.3, 0.5, 'mg', 0, 'clvdzrpdl01vli8bac6z8h7h6'),
       ('clvdzrpen01vvi8ba27f4a04v', 'heavy', 0.5, 0.5, 'mg', 0, 'clvdzrpdl01vli8bac6z8h7h6'),
       ('clvdzrpf401vzi8ba2z881aaj', 'threshold', 0.3, 0.3, 'mL', 0, 'clvdzrpeu01vxi8babkm6hqaj'),
       ('clvdzrpfd01w1i8ba6c1w22z3', 'light', 0.3, 0.9, 'mL', 0, 'clvdzrpeu01vxi8babkm6hqaj'),
       ('clvdzrpfk01w3i8ba3c4i68sr', 'common', 0.9, 1.5, 'mL', 0, 'clvdzrpeu01vxi8babkm6hqaj'),
       ('clvdzrpfp01w5i8bah1fmhkoq', 'strong', 1.5, 3, 'mL', 0, 'clvdzrpeu01vxi8babkm6hqaj'),
       ('clvdzrpfy01w7i8baf5xyhdco', 'heavy', 3, 3, 'mL', 0, 'clvdzrpeu01vxi8babkm6hqaj'),
       ('clvdzrpgc01wbi8bat64kzzzi', 'threshold', 0.5, 0.5, 'g', 0, 'clvdzrpg601w9i8ba8d6hgob4'),
       ('clvdzrpgk01wdi8baa4jssvd1', 'light', 0.5, 1, 'g', 0, 'clvdzrpg601w9i8ba8d6hgob4'),
       ('clvdzrpgt01wfi8ba4g5ujl37', 'common', 1, 2.5, 'g', 0, 'clvdzrpg601w9i8ba8d6hgob4'),
       ('clvdzrph001whi8ba6c7j20oo', 'strong', 2.5, 4, 'g', 0, 'clvdzrpg601w9i8ba8d6hgob4'),
       ('clvdzrph801wji8bawrkusnsd', 'heavy', 4, 4, 'g', 0, 'clvdzrpg601w9i8ba8d6hgob4'),
       ('clvdzrphm01wni8ba0afn0fvb', 'threshold', 200, 200, 'mg', 0, 'clvdzrphe01wli8bavca7zobg'),
       ('clvdzrphs01wpi8bapl66tzd4', 'light', 200, 900, 'mg', 0, 'clvdzrphe01wli8bavca7zobg'),
       ('clvdzrpi001wri8ba4bogu7gl', 'common', 900, 1500, 'mg', 0, 'clvdzrphe01wli8bavca7zobg'),
       ('clvdzrpi801wti8backrhr610', 'strong', 1500, 2400, 'mg', 0, 'clvdzrphe01wli8bavca7zobg'),
       ('clvdzrpie01wvi8bao8u5q1ec', 'heavy', 2400, 2400, 'mg', 0, 'clvdzrphe01wli8bavca7zobg'),
       ('clvdzrpis01wzi8baylh22idj', 'threshold', 5, 5, 'mg', 0, 'clvdzrpik01wxi8bawpkffanp'),
       ('clvdzrpj001x1i8bajq31v3b9', 'light', 10, 15, 'mg', 0, 'clvdzrpik01wxi8bawpkffanp'),
       ('clvdzrpj601x3i8bafesiwy7f', 'common', 15, 30, 'mg', 0, 'clvdzrpik01wxi8bawpkffanp'),
       ('clvdzrpjf01x5i8ba1xjf6afa', 'strong', 30, 45, 'mg', 0, 'clvdzrpik01wxi8bawpkffanp'),
       ('clvdzrpjn01x7i8bajnm72nkw', 'heavy', 45, 45, 'mg', 0, 'clvdzrpik01wxi8bawpkffanp'),
       ('clvdzrpk201xbi8bap9sx9rhe', 'threshold', 1, 1, 'mg', 0, 'clvdzrpjt01x9i8badcjq61n7'),
       ('clvdzrpka01xdi8baqqb0i8ox', 'light', 4, 8, 'mg', 0, 'clvdzrpjt01x9i8badcjq61n7'),
       ('clvdzrpkg01xfi8bagn6lwxdr', 'common', 8, 16, 'mg', 0, 'clvdzrpjt01x9i8badcjq61n7'),
       ('clvdzrpkl01xhi8balpdnclii', 'strong', 16, 24, 'mg', 0, 'clvdzrpjt01x9i8badcjq61n7'),
       ('clvdzrpku01xji8bauieni5af', 'heavy', 24, 24, 'mg', 0, 'clvdzrpjt01x9i8badcjq61n7'),
       ('clvdzrpln01xri8baucj88cmv', 'threshold', 20, 20, 'mg', 0, 'clvdzrpl201xli8ba0b7uav8i'),
       ('clvdzrplt01xti8bajeph7q8c', 'light', 40, 20, 'mg', 0, 'clvdzrpl201xli8ba0b7uav8i'),
       ('clvdzrplz01xvi8ba662d7ghw', 'common', 40, 70, 'mg', 0, 'clvdzrpl201xli8ba0b7uav8i'),
       ('clvdzrpm801xxi8bal09o3cdh', 'strong', 70, 120, 'mg', 0, 'clvdzrpl201xli8ba0b7uav8i'),
       ('clvdzrpmf01xzi8bazl98xzoq', 'heavy', 120, 120, 'mg', 0, 'clvdzrpl201xli8ba0b7uav8i'),
       ('clvdzrpmn01y1i8bar9msoyrh', 'threshold', 30, 30, 'mg', 0, 'clvdzrpl801xni8bawb4gxv7p'),
       ('clvdzrpmv01y3i8barx3tkso7', 'light', 30, 60, 'mg', 0, 'clvdzrpl801xni8bawb4gxv7p'),
       ('clvdzrpn201y5i8ba0pwkl6hs', 'common', 60, 100, 'mg', 0, 'clvdzrpl801xni8bawb4gxv7p'),
       ('clvdzrpn801y7i8batl9n7mvi', 'strong', 100, 130, 'mg', 0, 'clvdzrpl801xni8bawb4gxv7p'),
       ('clvdzrpne01y9i8ba7vtwve7h', 'heavy', 130, 130, 'mg', 0, 'clvdzrpl801xni8bawb4gxv7p'),
       ('clvdzrpnl01ybi8batibhmat8', 'threshold', 30, 30, 'mg', 0, 'clvdzrplg01xpi8bahbno0s6o'),
       ('clvdzrpnv01ydi8ba4q8167vt', 'light', 30, 60, 'mg', 0, 'clvdzrplg01xpi8bahbno0s6o'),
       ('clvdzrpo301yfi8badig2h9uy', 'common', 60, 100, 'mg', 0, 'clvdzrplg01xpi8bahbno0s6o'),
       ('clvdzrpoa01yhi8ba8zq3t11n', 'strong', 100, 130, 'mg', 0, 'clvdzrplg01xpi8bahbno0s6o'),
       ('clvdzrpoh01yji8bagp7tlkas', 'heavy', 130, 130, 'mg', 0, 'clvdzrplg01xpi8bahbno0s6o'),
       ('clvdzrpow01yni8bab6oi6yiz', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzrpoo01yli8ba7so7qj2h'),
       ('clvdzrpp501ypi8baocfxdejg', 'light', 0.25, 1, 'mg', 0, 'clvdzrpoo01yli8ba7so7qj2h'),
       ('clvdzrppc01yri8bazng850f9', 'common', 1, 5, 'mg', 0, 'clvdzrpoo01yli8ba7so7qj2h'),
       ('clvdzrppi01yti8ba3p6heee6', 'strong', 5, 10, 'mg', 0, 'clvdzrpoo01yli8ba7so7qj2h'),
       ('clvdzrppq01yvi8baz5chwpa1', 'heavy', 10, 10, 'mg', 0, 'clvdzrpoo01yli8ba7so7qj2h'),
       ('clvdzrpqj01z3i8ba8zukz3jv', 'threshold', 5, 5, 'mg', 0, 'clvdzrppw01yxi8bauckcf6wl'),
       ('clvdzrpqq01z5i8bap2riv6y9', 'light', 7.5, 20, 'mg', 0, 'clvdzrppw01yxi8bauckcf6wl'),
       ('clvdzrpqz01z7i8bafmvowf40', 'common', 20, 35, 'mg', 0, 'clvdzrppw01yxi8bauckcf6wl'),
       ('clvdzrpr601z9i8ba7id0835f', 'strong', 35, 50, 'mg', 0, 'clvdzrppw01yxi8bauckcf6wl'),
       ('clvdzrprd01zbi8bayxah9wa0', 'heavy', 50, 50, 'mg', 0, 'clvdzrppw01yxi8bauckcf6wl'),
       ('clvdzrprk01zdi8baxwfbei0t', 'common', 5, 8, 'mg', 0, 'clvdzrpq201yzi8baj0no5749'),
       ('clvdzrprq01zfi8balyr080t5', 'strong', 8, 15, 'mg', 0, 'clvdzrpq201yzi8baj0no5749'),
       ('clvdzrprw01zhi8bahmh2an6m', 'heavy', 15, 15, 'mg', 0, 'clvdzrpq201yzi8baj0no5749'),
       ('clvdzrps301zji8babbcpaisw', 'threshold', 2, 2, 'mg', 0, 'clvdzrpqc01z1i8baukibjlxu'),
       ('clvdzrpsb01zli8balwqrzzhl', 'light', 5, 15, 'mg', 0, 'clvdzrpqc01z1i8baukibjlxu'),
       ('clvdzrpsi01zni8badyn1ti2r', 'common', 15, 25, 'mg', 0, 'clvdzrpqc01z1i8baukibjlxu'),
       ('clvdzrpsq01zpi8babtf3k6rt', 'strong', 25, 50, 'mg', 0, 'clvdzrpqc01z1i8baukibjlxu'),
       ('clvdzrpsw01zri8bathdmqa7z', 'heavy', 50, 50, 'mg', 0, 'clvdzrpqc01z1i8baukibjlxu'),
       ('clvdzrptb01zvi8bab5rwvroe', 'threshold', 30, 30, 'mg', 0, 'clvdzrpt301zti8ba89z094z2'),
       ('clvdzrpti01zxi8bah849691p', 'light', 50, 70, 'mg', 0, 'clvdzrpt301zti8ba89z094z2'),
       ('clvdzrptp01zzi8ba0qxu09fj', 'common', 70, 100, 'mg', 0, 'clvdzrpt301zti8ba89z094z2'),
       ('clvdzrptw0201i8ba9zo6vz0o', 'strong', 100, 125, 'mg', 0, 'clvdzrpt301zti8ba89z094z2'),
       ('clvdzrpu30203i8baapqppigm', 'heavy', 125, 125, 'mg', 0, 'clvdzrpt301zti8ba89z094z2'),
       ('clvdzrpuf0207i8bajl7z37r8', 'threshold', 3, 3, 'mg', 0, 'clvdzrpua0205i8baj2uh12ca'),
       ('clvdzrpuo0209i8babab22juv', 'light', 5, 10, 'mg', 0, 'clvdzrpua0205i8baj2uh12ca'),
       ('clvdzrpuv020bi8bagof40sjm', 'common', 10, 25, 'mg', 0, 'clvdzrpua0205i8baj2uh12ca'),
       ('clvdzrpv3020di8ba4kt5sszq', 'strong', 25, 40, 'mg', 0, 'clvdzrpua0205i8baj2uh12ca'),
       ('clvdzrpvc020fi8bamyn37owp', 'heavy', 40, 40, 'mg', 0, 'clvdzrpua0205i8baj2uh12ca'),
       ('clvdzrpvw020li8ba9xntiujt', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrpvj020hi8baa5osuxn7'),
       ('clvdzrpw4020ni8baf1n8ko59', 'light', 1, 2, 'mg', 0, 'clvdzrpvj020hi8baa5osuxn7'),
       ('clvdzrpwc020pi8bawze9k3vc', 'common', 2, 4, 'mg', 0, 'clvdzrpvj020hi8baa5osuxn7'),
       ('clvdzrpwl020ri8badfa9imed', 'strong', 4, 6, 'mg', 0, 'clvdzrpvj020hi8baa5osuxn7'),
       ('clvdzrpww020ti8baebul9bq5', 'heavy', 6, 6, 'mg', 0, 'clvdzrpvj020hi8baa5osuxn7'),
       ('clvdzrpx5020vi8bai9jaqexe', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrpvq020ji8baje8u54uu'),
       ('clvdzrpxc020xi8bavo6ck0nu', 'light', 1, 2, 'mg', 0, 'clvdzrpvq020ji8baje8u54uu'),
       ('clvdzrpxl020zi8ba9yfn8138', 'common', 2, 4, 'mg', 0, 'clvdzrpvq020ji8baje8u54uu'),
       ('clvdzrpxs0211i8baezgqq73n', 'strong', 4, 8, 'mg', 0, 'clvdzrpvq020ji8baje8u54uu'),
       ('clvdzrpxz0213i8bavt234hdy', 'heavy', 8, 8, 'mg', 0, 'clvdzrpvq020ji8baje8u54uu'),
       ('clvdzrpye0217i8baw5m1g18v', 'common', 15, 22, 'mg/kg of body weight', 0, 'clvdzrpy70215i8bao4qj0hfs'),
       ('clvdzrpz4021di8batkq6ypsu', 'threshold', 2, 2, 'mg', 0, 'clvdzrpyl0219i8bawanvgeis'),
       ('clvdzrpzc021fi8bam0gsf835', 'light', 5, 10, 'mg', 0, 'clvdzrpyl0219i8bawanvgeis'),
       ('clvdzrpzj021hi8bavnjgpukg', 'common', 10, 20, 'mg', 0, 'clvdzrpyl0219i8bawanvgeis'),
       ('clvdzrpzr021ji8banb163xw0', 'strong', 20, 35, 'mg', 0, 'clvdzrpyl0219i8bawanvgeis'),
       ('clvdzrpzx021li8baof03gifk', 'heavy', 35, 35, 'mg', 0, 'clvdzrpyl0219i8bawanvgeis'),
       ('clvdzrq02021ni8ba4ch0lfys', 'threshold', 2, 2, 'mg', 0, 'clvdzrpyt021bi8baa778omq9'),
       ('clvdzrq0b021pi8bacokl5s1o', 'light', 5, 15, 'mg', 0, 'clvdzrpyt021bi8baa778omq9'),
       ('clvdzrq0j021ri8baicwf952y', 'common', 15, 25, 'mg', 0, 'clvdzrpyt021bi8baa778omq9'),
       ('clvdzrq0r021ti8bab3ts9zkz', 'strong', 25, 45, 'mg', 0, 'clvdzrpyt021bi8baa778omq9'),
       ('clvdzrq11021vi8bayt7wc891', 'heavy', 45, 45, 'mg', 0, 'clvdzrpyt021bi8baa778omq9'),
       ('clvdzrq1k021zi8bakdre1tpk', 'threshold', 1, 1, 'mg', 0, 'clvdzrq1a021xi8ba57ti8813'),
       ('clvdzrq1y0221i8bam0nhon7j', 'light', 1, 2, 'mg', 0, 'clvdzrq1a021xi8ba57ti8813'),
       ('clvdzrq2a0223i8bap9oenrpb', 'common', 2, 3, 'mg', 0, 'clvdzrq1a021xi8ba57ti8813'),
       ('clvdzrq2n0225i8ba2knpe966', 'strong', 3, 5, 'mg', 0, 'clvdzrq1a021xi8ba57ti8813'),
       ('clvdzrq340229i8barai8jti1', 'light', 3, 5, 'mg', 0, 'clvdzrq2x0227i8batrfphluw'),
       ('clvdzrq3c022bi8ba7huv0ov6', 'common', 5, 10, 'mg', 0, 'clvdzrq2x0227i8batrfphluw'),
       ('clvdzrq3k022di8ba0knedx84', 'strong', 10, 15, 'mg', 0, 'clvdzrq2x0227i8batrfphluw'),
       ('clvdzrq4f022li8baqwhiuvan', 'threshold', 5, 5, 'mg', 0, 'clvdzrq3r022fi8ba591svvdh'),
       ('clvdzrq4o022ni8baiot94mrk', 'light', 10, 30, 'mg', 0, 'clvdzrq3r022fi8ba591svvdh'),
       ('clvdzrq4w022pi8batedq86w9', 'common', 30, 75, 'mg', 0, 'clvdzrq3r022fi8ba591svvdh'),
       ('clvdzrq54022ri8bayon9m2fm', 'strong', 75, 150, 'mg', 0, 'clvdzrq3r022fi8ba591svvdh'),
       ('clvdzrq5g022ti8ba1dduhwib', 'heavy', 150, 150, 'mg', 0, 'clvdzrq3r022fi8ba591svvdh'),
       ('clvdzrq5q022vi8bajtokvvqd', 'threshold', 50, 50, 'mg', 0, 'clvdzrq41022hi8bala9q5ont'),
       ('clvdzrq5v022xi8bazk9sydaq', 'light', 50, 100, 'mg', 0, 'clvdzrq41022hi8bala9q5ont'),
       ('clvdzrq65022zi8bagv8p6y31', 'common', 100, 300, 'mg', 0, 'clvdzrq41022hi8bala9q5ont'),
       ('clvdzrq6c0231i8ba2zdh6q38', 'strong', 300, 450, 'mg', 0, 'clvdzrq41022hi8bala9q5ont'),
       ('clvdzrq6k0233i8ba7wfuxrb1', 'heavy', 450, 450, 'mg', 0, 'clvdzrq41022hi8bala9q5ont'),
       ('clvdzrq720237i8baxvdi0ls1', 'threshold', 1, 1, 'g', 0, 'clvdzrq6t0235i8bazopzlefi'),
       ('clvdzrq770239i8bajzr0azlo', 'light', 2, 3, 'g', 0, 'clvdzrq6t0235i8bazopzlefi'),
       ('clvdzrq7f023bi8bapvkrvrhl', 'common', 3, 5, 'g', 0, 'clvdzrq6t0235i8bazopzlefi'),
       ('clvdzrq7o023di8ba12d6t29x', 'strong', 5, 8, 'g', 0, 'clvdzrq6t0235i8bazopzlefi'),
       ('clvdzrq7v023fi8bao63yrqyv', 'heavy', 8, 8, 'g', 0, 'clvdzrq6t0235i8bazopzlefi'),
       ('clvdzrq8a023ji8baedzgkd7a', 'common', 500, 1500, 'µg', 0, 'clvdzrq83023hi8ba41gx3nra'),
       ('clvdzrq8v023pi8basbkcpbcd', 'threshold', 20, 20, 'seeds', 0, 'clvdzrq8h023li8baqrbkv07w'),
       ('clvdzrq92023ri8baurllcry9', 'light', 50, 100, 'seeds', 0, 'clvdzrq8h023li8baqrbkv07w'),
       ('clvdzrq99023ti8bakn3reka0', 'common', 100, 250, 'seeds', 0, 'clvdzrq8h023li8baqrbkv07w'),
       ('clvdzrq9f023vi8baear66bu0', 'strong', 250, 400, 'seeds', 0, 'clvdzrq8h023li8baqrbkv07w'),
       ('clvdzrq9n023xi8bawn3cg6dk', 'heavy', 400, 400, 'seeds', 0, 'clvdzrq8h023li8baqrbkv07w'),
       ('clvdzrq9x023zi8bageitnuki', 'threshold', 1, 1, 'seeds', 0, 'clvdzrq8n023ni8bayihh1rj8'),
       ('clvdzrqa30241i8bawdkf3mrm', 'light', 3, 5, 'seeds', 0, 'clvdzrq8n023ni8bayihh1rj8'),
       ('clvdzrqaa0243i8baftxaj3ir', 'common', 5, 7, 'seeds', 0, 'clvdzrq8n023ni8bayihh1rj8'),
       ('clvdzrqaj0245i8bapd4n4lyj', 'strong', 7, 12, 'seeds', 0, 'clvdzrq8n023ni8bayihh1rj8'),
       ('clvdzrqar0247i8bannp5ur6o', 'heavy', 12, 12, 'seeds', 0, 'clvdzrq8n023ni8bayihh1rj8'),
       ('clvdzrqb6024bi8bag7aumswi', 'threshold', 15, 15, 'µg', 0, 'clvdzrqax0249i8baryem810x'),
       ('clvdzrqbc024di8badnikr7km', 'light', 15, 75, 'µg', 0, 'clvdzrqax0249i8baryem810x'),
       ('clvdzrqbm024fi8baxh18r638', 'common', 75, 150, 'µg', 0, 'clvdzrqax0249i8baryem810x'),
       ('clvdzrqbv024hi8ba3x2qy1vu', 'strong', 150, 300, 'µg', 0, 'clvdzrqax0249i8baryem810x'),
       ('clvdzrqc1024ji8ba380e20lj', 'heavy', 300, 300, 'µg', 0, 'clvdzrqax0249i8baryem810x'),
       ('clvdzrqce024ni8baf5vx4omx', 'threshold', 250, 250, 'µg', 0, 'clvdzrqc7024li8ba4x1z67xz'),
       ('clvdzrqcm024pi8ba9caewq5a', 'light', 500, 750, 'µg', 0, 'clvdzrqc7024li8ba4x1z67xz'),
       ('clvdzrqcu024ri8bazb1ymncg', 'common', 750, 1250, 'µg', 0, 'clvdzrqc7024li8ba4x1z67xz'),
       ('clvdzrqd1024ti8bakbbkpafy', 'strong', 1250, 1500, 'µg', 0, 'clvdzrqc7024li8ba4x1z67xz'),
       ('clvdzrqdb024vi8baef2gviip', 'heavy', 1500, 1500, 'µg', 0, 'clvdzrqc7024li8ba4x1z67xz'),
       ('clvdzrqds024zi8batbzzi7ef', 'threshold', 50, 50, 'µg', 0, 'clvdzrqdj024xi8ba002maqku'),
       ('clvdzrqe10251i8banlgl2n1m', 'light', 100, 150, 'µg', 0, 'clvdzrqdj024xi8ba002maqku'),
       ('clvdzrqe60253i8baostrl2b4', 'common', 150, 300, 'µg', 0, 'clvdzrqdj024xi8ba002maqku'),
       ('clvdzrqed0255i8baeaqk1hiw', 'strong', 300, 400, 'µg', 0, 'clvdzrqdj024xi8ba002maqku'),
       ('clvdzrqem0257i8ba98m11tze', 'heavy', 400, 400, 'µg', 0, 'clvdzrqdj024xi8ba002maqku'),
       ('clvdzrqf2025bi8baymn3z6fp', 'threshold', 10, 10, 'mg', 0, 'clvdzrqeu0259i8balulew4am'),
       ('clvdzrqfa025di8baupvvceqn', 'light', 20, 30, 'mg', 0, 'clvdzrqeu0259i8balulew4am'),
       ('clvdzrqfg025fi8ba3c4lme1c', 'common', 30, 60, 'mg', 0, 'clvdzrqeu0259i8balulew4am'),
       ('clvdzrqfm025hi8ba2hv656y2', 'strong', 60, 90, 'mg', 0, 'clvdzrqeu0259i8balulew4am'),
       ('clvdzrqfy025ji8bav7gffjtr', 'heavy', 90, 90, 'mg', 0, 'clvdzrqeu0259i8balulew4am'),
       ('clvdzrqgg025ni8babiq37mlx', 'threshold', 0.1, 0.1, 'mg', 0, 'clvdzrqg9025li8baoctqrrnn'),
       ('clvdzrqgo025pi8bas0g2eq9s', 'light', 0.25, 0.5, 'mg', 0, 'clvdzrqg9025li8baoctqrrnn'),
       ('clvdzrqgv025ri8baod4c04v4', 'common', 0.5, 1.5, 'mg', 0, 'clvdzrqg9025li8baoctqrrnn'),
       ('clvdzrqh2025ti8bav31go39g', 'strong', 1.5, 2, 'mg', 0, 'clvdzrqg9025li8baoctqrrnn'),
       ('clvdzrqhc025vi8baw5tswegc', 'heavy', 2, 2, 'mg', 0, 'clvdzrqg9025li8baoctqrrnn'),
       ('clvdzrqht025zi8bajgscd9cl', 'threshold', 15, 15, 'mg', 0, 'clvdzrqhm025xi8bami0sufki'),
       ('clvdzrqi10261i8ba6fz3gv64', 'light', 20, 50, 'mg', 0, 'clvdzrqhm025xi8bami0sufki'),
       ('clvdzrqi60263i8balp6vry7t', 'common', 50, 120, 'mg', 0, 'clvdzrqhm025xi8bami0sufki'),
       ('clvdzrqib0265i8batq9q0b1u', 'strong', 120, 150, 'mg', 0, 'clvdzrqhm025xi8bami0sufki'),
       ('clvdzrqih0267i8bae5spjye2', 'heavy', 150, 150, 'mg', 0, 'clvdzrqhm025xi8bami0sufki'),
       ('clvdzrqix026bi8ba8le8wlpt', 'threshold', 20, 20, 'mg', 0, 'clvdzrqip0269i8barn7kwwp2'),
       ('clvdzrqj2026di8batk6wv7p6', 'light', 40, 60, 'mg', 0, 'clvdzrqip0269i8barn7kwwp2'),
       ('clvdzrqj9026fi8ba2orpcy5f', 'common', 60, 100, 'mg', 0, 'clvdzrqip0269i8barn7kwwp2'),
       ('clvdzrqji026hi8bat8yd7o26', 'strong', 100, 145, 'mg', 0, 'clvdzrqip0269i8barn7kwwp2'),
       ('clvdzrqjq026ji8baxq0qtiuv', 'heavy', 145, 145, 'mg', 0, 'clvdzrqip0269i8barn7kwwp2'),
       ('clvdzrqkb026ni8banbawwre1', 'threshold', 40, 40, 'mg', 0, 'clvdzrqjx026li8baki9rsgwq'),
       ('clvdzrqkj026pi8ba6t2u2x8g', 'light', 40, 100, 'mg', 0, 'clvdzrqjx026li8baki9rsgwq'),
       ('clvdzrqkp026ri8baldn97md6', 'common', 100, 175, 'mg', 0, 'clvdzrqjx026li8baki9rsgwq'),
       ('clvdzrqkw026ti8baqxke7psc', 'strong', 175, 300, 'mg', 0, 'clvdzrqjx026li8baki9rsgwq'),
       ('clvdzrql3026vi8ba1fc22iy2', 'heavy', 300, 300, 'mg', 0, 'clvdzrqjx026li8baki9rsgwq'),
       ('clvdzrqlj026zi8bafxivhhrb', 'threshold', 40, 40, 'mg', 0, 'clvdzrqlb026xi8ba37ytiqza'),
       ('clvdzrqlq0271i8bam81dgv2t', 'light', 70, 120, 'mg', 0, 'clvdzrqlb026xi8ba37ytiqza'),
       ('clvdzrqlw0273i8bal4ofx2ko', 'common', 120, 180, 'mg', 0, 'clvdzrqlb026xi8ba37ytiqza'),
       ('clvdzrqm40275i8bal0nay4tn', 'strong', 180, 225, 'mg', 0, 'clvdzrqlb026xi8ba37ytiqza'),
       ('clvdzrqmc0277i8baitealxho', 'heavy', 225, 225, 'mg', 0, 'clvdzrqlb026xi8ba37ytiqza'),
       ('clvdzrqmp027bi8badafxu8kj', 'threshold', 20, 20, 'mg', 0, 'clvdzrqmi0279i8bafxugmhup'),
       ('clvdzrqn0027di8bak0a080m2', 'light', 20, 80, 'mg', 0, 'clvdzrqmi0279i8bafxugmhup'),
       ('clvdzrqn6027fi8barwkwwsm8', 'common', 80, 120, 'mg', 0, 'clvdzrqmi0279i8bafxugmhup'),
       ('clvdzrqnc027hi8ba6hb393t0', 'strong', 120, 150, 'mg', 0, 'clvdzrqmi0279i8bafxugmhup'),
       ('clvdzrqnk027ji8ba1zd0zsgj', 'heavy', 150, 150, 'mg', 0, 'clvdzrqmi0279i8bafxugmhup'),
       ('clvdzrqnz027ni8ba7rwfpqwq', 'threshold', 2, 2, 'mg', 0, 'clvdzrqns027li8barx14ugqk'),
       ('clvdzrqo4027pi8badrtlodcc', 'light', 4, 8, 'mg', 0, 'clvdzrqns027li8barx14ugqk'),
       ('clvdzrqob027ri8baj43brcvm', 'common', 8, 14, 'mg', 0, 'clvdzrqns027li8barx14ugqk'),
       ('clvdzrqoi027ti8ba5tl59fi6', 'strong', 14, 25, 'mg', 0, 'clvdzrqns027li8barx14ugqk'),
       ('clvdzrqoo027vi8ba1jpf3ger', 'heavy', 25, 25, 'mg', 0, 'clvdzrqns027li8barx14ugqk'),
       ('clvdzrqpg0283i8bajosxnmbc', 'threshold', 5, 5, 'mg', 0, 'clvdzrqot027xi8baokg60vwo'),
       ('clvdzrqpm0285i8barjlg95k8', 'light', 10, 20, 'mg', 0, 'clvdzrqot027xi8baokg60vwo'),
       ('clvdzrqpu0287i8badmxc8fxv', 'common', 20, 25, 'mg', 0, 'clvdzrqot027xi8baokg60vwo'),
       ('clvdzrqq00289i8bayu8vsw09', 'strong', 25, 35, 'mg', 0, 'clvdzrqot027xi8baokg60vwo'),
       ('clvdzrqq6028bi8barg39ardl', 'heavy', 35, 35, 'mg', 0, 'clvdzrqot027xi8baokg60vwo'),
       ('clvdzrqqd028di8bakn6slxqt', 'threshold', 40, 40, 'mg', 0, 'clvdzrqp2027zi8ba16eggbk1'),
       ('clvdzrqqk028fi8bah0i0an51', 'light', 60, 120, 'mg', 0, 'clvdzrqp2027zi8ba16eggbk1'),
       ('clvdzrqqq028hi8bavcf8uiut', 'common', 120, 150, 'mg', 0, 'clvdzrqp2027zi8ba16eggbk1'),
       ('clvdzrqqv028ji8ba79kg7e45', 'strong', 150, 200, 'mg', 0, 'clvdzrqp2027zi8ba16eggbk1'),
       ('clvdzrqr3028li8bau2jphc3p', 'heavy', 200, 200, 'mg', 0, 'clvdzrqp2027zi8ba16eggbk1'),
       ('clvdzrqrc028ni8ba5ye472mo', 'threshold', 10, 10, 'mg', 0, 'clvdzrqp90281i8bayz2denq4'),
       ('clvdzrqri028pi8bau6v09ljz', 'light', 20, 40, 'mg', 0, 'clvdzrqp90281i8bayz2denq4'),
       ('clvdzrqrq028ri8ba7vgo44ap', 'common', 40, 60, 'mg', 0, 'clvdzrqp90281i8bayz2denq4'),
       ('clvdzrqrx028ti8bak2ofsmfp', 'strong', 60, 90, 'mg', 0, 'clvdzrqp90281i8bayz2denq4'),
       ('clvdzrqs4028vi8ba467so514', 'heavy', 90, 90, 'mg', 0, 'clvdzrqp90281i8bayz2denq4'),
       ('clvdzrqsx0293i8baf0upvr3y', 'threshold', 5, 5, 'mg', 0, 'clvdzrqsj028zi8barihemrh8'),
       ('clvdzrqt40295i8bahpgdvwse', 'light', 10, 20, 'mg', 0, 'clvdzrqsj028zi8barihemrh8'),
       ('clvdzrqtc0297i8ba87xrvda2', 'common', 20, 40, 'mg', 0, 'clvdzrqsj028zi8barihemrh8'),
       ('clvdzrqti0299i8bad1xutk9o', 'strong', 40, 60, 'mg', 0, 'clvdzrqsj028zi8barihemrh8'),
       ('clvdzrqtp029bi8badcs1vhlx', 'heavy', 60, 60, 'mg', 0, 'clvdzrqsj028zi8barihemrh8'),
       ('clvdzrqty029di8baq6tg6doi', 'threshold', 5, 5, 'mg', 0, 'clvdzrqsr0291i8bav1ch2ibz'),
       ('clvdzrqub029fi8ba9vjycutt', 'light', 10, 20, 'mg', 0, 'clvdzrqsr0291i8bav1ch2ibz'),
       ('clvdzrquj029hi8bas6nry7l9', 'common', 20, 40, 'mg', 0, 'clvdzrqsr0291i8bav1ch2ibz'),
       ('clvdzrquq029ji8ba5cwy0w1q', 'strong', 40, 60, 'mg', 0, 'clvdzrqsr0291i8bav1ch2ibz'),
       ('clvdzrquy029li8bazj9ovbnx', 'heavy', 60, 60, 'mg', 0, 'clvdzrqsr0291i8bav1ch2ibz'),
       ('clvdzrqvj029ri8bau3045lvt', 'threshold', 3, 3, 'mg', 0, 'clvdzrqv4029ni8ba7t4stuf2'),
       ('clvdzrqvq029ti8baecukq039', 'light', 3, 5, 'mg', 0, 'clvdzrqv4029ni8ba7t4stuf2'),
       ('clvdzrqvy029vi8ba9zbfpw88', 'common', 5, 10, 'mg', 0, 'clvdzrqv4029ni8ba7t4stuf2'),
       ('clvdzrqw4029xi8baohcvz4pm', 'strong', 10, 15, 'mg', 0, 'clvdzrqv4029ni8ba7t4stuf2'),
       ('clvdzrqwb029zi8bacuib9pjw', 'threshold', 2, 2, 'mg', 0, 'clvdzrqvb029pi8ba9ux2h8lc'),
       ('clvdzrqwi02a1i8babwgtgv8g', 'light', 2, 4, 'mg', 0, 'clvdzrqvb029pi8ba9ux2h8lc'),
       ('clvdzrqwp02a3i8ba2c23nf75', 'common', 4, 8, 'mg', 0, 'clvdzrqvb029pi8ba9ux2h8lc'),
       ('clvdzrqwv02a5i8ba99jcmn31', 'strong', 8, 12, 'mg', 0, 'clvdzrqvb029pi8ba9ux2h8lc'),
       ('clvdzrqx702a9i8baao6rxvio', 'light', 50, 200, 'mg', 0, 'clvdzrqx202a7i8bamqgngv34'),
       ('clvdzrqxg02abi8bamjoz4tka', 'common', 400, 800, 'mg', 0, 'clvdzrqx202a7i8bamqgngv34'),
       ('clvdzrqxn02adi8baf9zg3l8d', 'strong', 800, 1000, 'mg', 0, 'clvdzrqx202a7i8bamqgngv34'),
       ('clvdzrqxt02afi8baiohm0p89', 'heavy', 600, 600, 'mg', 0, 'clvdzrqx202a7i8bamqgngv34'),
       ('clvdzrqy902aji8ba1pnnsiht', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzrqy002ahi8bawu6nwglq'),
       ('clvdzrqyg02ali8bak4ste0oh', 'light', 0.5, 1, 'mg', 0, 'clvdzrqy002ahi8bawu6nwglq'),
       ('clvdzrqyl02ani8ba703priia', 'common', 1, 3, 'mg', 0, 'clvdzrqy002ahi8bawu6nwglq'),
       ('clvdzrqyu02api8baeycd03h3', 'strong', 3, 6, 'mg', 0, 'clvdzrqy002ahi8bawu6nwglq'),
       ('clvdzrqz002ari8bai75tb6ez', 'heavy', 6, 6, 'mg', 0, 'clvdzrqy002ahi8bawu6nwglq'),
       ('clvdzrqze02avi8baw3ud2uwh', 'threshold', 10, 10, 'mg', 0, 'clvdzrqz702ati8bayxlz9lp9'),
       ('clvdzrqzn02axi8ba8hce9qr7', 'light', 30, 70, 'mg', 0, 'clvdzrqz702ati8bayxlz9lp9'),
       ('clvdzrqzv02azi8babwewigml', 'common', 70, 110, 'mg', 0, 'clvdzrqz702ati8bayxlz9lp9'),
       ('clvdzrr0002b1i8ba4dtqa73g', 'strong', 110, 170, 'mg', 0, 'clvdzrqz702ati8bayxlz9lp9'),
       ('clvdzrr0602b3i8barj1wn1hm', 'heavy', 170, 170, 'mg', 0, 'clvdzrqz702ati8bayxlz9lp9'),
       ('clvdzrr0p02b9i8bac9r6x84m', 'threshold', 5, 5, 'mg', 0, 'clvdzrr0c02b5i8ba955yvl7n'),
       ('clvdzrr0w02bbi8banxrrwk6j', 'light', 15, 45, 'mg', 0, 'clvdzrr0c02b5i8ba955yvl7n'),
       ('clvdzrr1402bdi8bacdnmg7fb', 'common', 45, 80, 'mg', 0, 'clvdzrr0c02b5i8ba955yvl7n'),
       ('clvdzrr1b02bfi8ba13288nza', 'strong', 80, 125, 'mg', 0, 'clvdzrr0c02b5i8ba955yvl7n'),
       ('clvdzrr1i02bhi8bak5tcgu4z', 'heavy', 125, 125, 'mg', 0, 'clvdzrr0c02b5i8ba955yvl7n'),
       ('clvdzrr1q02bji8bapvhm33e2', 'threshold', 15, 15, 'mg', 0, 'clvdzrr0i02b7i8ba1125qky2'),
       ('clvdzrr1x02bli8ba0alk6sd4', 'light', 50, 100, 'mg', 0, 'clvdzrr0i02b7i8ba1125qky2'),
       ('clvdzrr2502bni8ba80novh6v', 'common', 100, 200, 'mg', 0, 'clvdzrr0i02b7i8ba1125qky2'),
       ('clvdzrr2b02bpi8bam4bk91cd', 'strong', 200, 300, 'mg', 0, 'clvdzrr0i02b7i8ba1125qky2'),
       ('clvdzrr2i02bri8ba7vsx21p8', 'heavy', 300, 300, 'mg', 0, 'clvdzrr0i02b7i8ba1125qky2'),
       ('clvdzrr2u02bvi8bay867951q', 'threshold', 50, 50, 'mg', 0, 'clvdzrr2p02bti8bam24ytn7z'),
       ('clvdzrr3202bxi8ba4l5p9p7t', 'light', 50, 200, 'mg', 0, 'clvdzrr2p02bti8bam24ytn7z'),
       ('clvdzrr3802bzi8baotogkymt', 'common', 200, 400, 'mg', 0, 'clvdzrr2p02bti8bam24ytn7z'),
       ('clvdzrr3e02c1i8bas1hdzb00', 'strong', 400, 800, 'mg', 0, 'clvdzrr2p02bti8bam24ytn7z'),
       ('clvdzrr3j02c3i8bawbw4bhb9', 'heavy', 800, 800, 'mg', 0, 'clvdzrr2p02bti8bam24ytn7z'),
       ('clvdzrr3z02c7i8bata09cycn', 'threshold', 1, 1, 'mg', 0, 'clvdzrr3s02c5i8bawmt743ka'),
       ('clvdzrr4602c9i8bawge4rhij', 'light', 3, 5, 'mg', 0, 'clvdzrr3s02c5i8bawmt743ka'),
       ('clvdzrr4e02cbi8baoiisb9so', 'common', 5, 15, 'mg', 0, 'clvdzrr3s02c5i8bawmt743ka'),
       ('clvdzrr4l02cdi8bas3j8qmj5', 'strong', 15, 30, 'mg', 0, 'clvdzrr3s02c5i8bawmt743ka'),
       ('clvdzrr4r02cfi8bage48xsbw', 'heavy', 30, 30, 'mg', 0, 'clvdzrr3s02c5i8bawmt743ka'),
       ('clvdzrr5702cji8balqpde3kh', 'threshold', 5, 5, 'mg', 0, 'clvdzrr4z02chi8baa339dj64'),
       ('clvdzrr5h02cli8bam06nw6a3', 'light', 15, 25, 'mg', 0, 'clvdzrr4z02chi8baa339dj64'),
       ('clvdzrr5o02cni8ba9i4h9f5e', 'common', 25, 40, 'mg', 0, 'clvdzrr4z02chi8baa339dj64'),
       ('clvdzrr5w02cpi8ba6jtduwhl', 'strong', 40, 60, 'mg', 0, 'clvdzrr4z02chi8baa339dj64'),
       ('clvdzrr6502cri8baz7rhpsfc', 'heavy', 60, 60, 'mg', 0, 'clvdzrr4z02chi8baa339dj64'),
       ('clvdzrr7a02d3i8ba42t7dqa7', 'threshold', 5, 5, 'mg', 0, 'clvdzrr6c02cti8ba6ixpdp72'),
       ('clvdzrr7l02d5i8ba99w8hz6v', 'light', 5, 10, 'mg', 0, 'clvdzrr6c02cti8ba6ixpdp72'),
       ('clvdzrr7u02d7i8ba5q6cwtb7', 'common', 10, 30, 'mg', 0, 'clvdzrr6c02cti8ba6ixpdp72'),
       ('clvdzrr8302d9i8bayhckyqq3', 'strong', 30, 60, 'mg', 0, 'clvdzrr6c02cti8ba6ixpdp72'),
       ('clvdzrr8b02dbi8ba94oesn57', 'heavy', 60, 60, 'mg', 0, 'clvdzrr6c02cti8ba6ixpdp72'),
       ('clvdzrr8h02ddi8bau1pyn5up', 'threshold', 5, 5, 'mg', 0, 'clvdzrr6i02cvi8baytrmafu2'),
       ('clvdzrr8p02dfi8bayeykjhn7', 'light', 5, 10, 'mg', 0, 'clvdzrr6i02cvi8baytrmafu2'),
       ('clvdzrr8z02dhi8bahzc3ydvl', 'common', 10, 30, 'mg', 0, 'clvdzrr6i02cvi8baytrmafu2'),
       ('clvdzrr9602dji8bar813mevq', 'strong', 30, 40, 'mg', 0, 'clvdzrr6i02cvi8baytrmafu2'),
       ('clvdzrr9g02dli8ba66hdimbv', 'heavy', 40, 40, 'mg', 0, 'clvdzrr6i02cvi8baytrmafu2'),
       ('clvdzrr9o02dni8baqiih8my0', 'threshold', 5, 5, 'mg', 0, 'clvdzrr6q02cxi8bauh3bsrnf'),
       ('clvdzrr9v02dpi8bap07qkuak', 'light', 5, 10, 'mg', 0, 'clvdzrr6q02cxi8bauh3bsrnf'),
       ('clvdzrra802dri8bahz5id836', 'common', 10, 25, 'mg', 0, 'clvdzrr6q02cxi8bauh3bsrnf'),
       ('clvdzrrag02dti8bavdslbqbj', 'strong', 25, 50, 'mg', 0, 'clvdzrr6q02cxi8bauh3bsrnf'),
       ('clvdzrraq02dvi8baddx7ibpx', 'heavy', 50, 50, 'mg', 0, 'clvdzrr6q02cxi8bauh3bsrnf'),
       ('clvdzrrax02dxi8bak575b8l8', 'threshold', 5, 5, 'mg', 0, 'clvdzrr6w02czi8ba502qq1j7'),
       ('clvdzrrb502dzi8bayg2jvjx5', 'light', 5, 10, 'mg', 0, 'clvdzrr6w02czi8ba502qq1j7'),
       ('clvdzrrba02e1i8ba0x8w266t', 'common', 10, 30, 'mg', 0, 'clvdzrr6w02czi8ba502qq1j7'),
       ('clvdzrrbh02e3i8ba2qk8jtm5', 'strong', 30, 40, 'mg', 0, 'clvdzrr6w02czi8ba502qq1j7'),
       ('clvdzrrbo02e5i8babv652j6w', 'heavy', 40, 40, 'mg', 0, 'clvdzrr6w02czi8ba502qq1j7'),
       ('clvdzrrbv02e7i8ba8nadxmps', 'threshold', 5, 5, 'mg', 0, 'clvdzrr7202d1i8barkktcpqn'),
       ('clvdzrrc002e9i8bac3j24fa1', 'light', 5, 10, 'mg', 0, 'clvdzrr7202d1i8barkktcpqn'),
       ('clvdzrrc702ebi8ba14xvzmor', 'common', 10, 20, 'mg', 0, 'clvdzrr7202d1i8barkktcpqn'),
       ('clvdzrrcf02edi8bapf527vgu', 'strong', 20, 60, 'mg', 0, 'clvdzrr7202d1i8barkktcpqn'),
       ('clvdzrrcm02efi8baypk0ura4', 'heavy', 60, 60, 'mg', 0, 'clvdzrr7202d1i8barkktcpqn'),
       ('clvdzrrd702eli8baro7ly0e2', 'threshold', 75, 75, 'mg', 0, 'clvdzrrcu02ehi8bajnjexec6'),
       ('clvdzrrdd02eni8baosfqkgqk', 'light', 150, 300, 'mg', 0, 'clvdzrrcu02ehi8bajnjexec6'),
       ('clvdzrrdk02epi8baqch7vm19', 'common', 300, 500, 'mg', 0, 'clvdzrrcu02ehi8bajnjexec6'),
       ('clvdzrrds02eri8ba13br2xma', 'strong', 500, 600, 'mg', 0, 'clvdzrrcu02ehi8bajnjexec6'),
       ('clvdzrrdz02eti8ba5n163tii', 'threshold', 50, 50, 'mg', 0, 'clvdzrrd002eji8balo6bag2q'),
       ('clvdzrre402evi8baatlcnyix', 'light', 50, 100, 'mg', 0, 'clvdzrrd002eji8balo6bag2q'),
       ('clvdzrre902exi8ba1kf6a65m', 'common', 100, 200, 'mg', 0, 'clvdzrrd002eji8balo6bag2q'),
       ('clvdzrrei02ezi8bazr6eto92', 'strong', 200, 300, 'mg', 0, 'clvdzrrd002eji8balo6bag2q'),
       ('clvdzrrf102f5i8bak4juyw8t', 'threshold', 5, 5, 'mg', 0, 'clvdzrreo02f1i8ban7p077zf'),
       ('clvdzrrf802f7i8ba0nqpnftd', 'light', 5, 20, 'mg', 0, 'clvdzrreo02f1i8ban7p077zf'),
       ('clvdzrrfe02f9i8ba2x105lf2', 'common', 20, 40, 'mg', 0, 'clvdzrreo02f1i8ban7p077zf'),
       ('clvdzrrfq02fbi8banwecxhks', 'strong', 40, 60, 'mg', 0, 'clvdzrreo02f1i8ban7p077zf'),
       ('clvdzrrfz02fdi8baopptjhaw', 'threshold', 10, 10, 'mg', 0, 'clvdzrres02f3i8ba0gxn5m0n'),
       ('clvdzrrg502ffi8bakxukggdx', 'light', 20, 30, 'mg', 0, 'clvdzrres02f3i8ba0gxn5m0n'),
       ('clvdzrrgc02fhi8bayhplsfw2', 'common', 30, 50, 'mg', 0, 'clvdzrres02f3i8ba0gxn5m0n'),
       ('clvdzrrgi02fji8ba5fljx8h0', 'strong', 50, 60, 'mg', 0, 'clvdzrres02f3i8ba0gxn5m0n'),
       ('clvdzrrgo02fli8ba12dkjgfx', 'heavy', 60, 60, 'mg', 0, 'clvdzrres02f3i8ba0gxn5m0n'),
       ('clvdzrrhc02fri8balzl0a9to', 'threshold', 5, 5, 'mg', 0, 'clvdzrrgw02fni8ba33tnrw1u'),
       ('clvdzrrhj02fti8banc117fzs', 'light', 10, 20, 'mg', 0, 'clvdzrrgw02fni8ba33tnrw1u'),
       ('clvdzrrhp02fvi8ba4x42gs2d', 'common', 20, 35, 'mg', 0, 'clvdzrrgw02fni8ba33tnrw1u'),
       ('clvdzrrhv02fxi8bahu0yk335', 'strong', 35, 60, 'mg', 0, 'clvdzrrgw02fni8ba33tnrw1u'),
       ('clvdzrri502fzi8bas4x50wws', 'heavy', 60, 60, 'mg', 0, 'clvdzrrgw02fni8ba33tnrw1u'),
       ('clvdzrria02g1i8bau4wiwrlu', 'threshold', 5, 5, 'mg', 0, 'clvdzrrh402fpi8ba86a9tyr0'),
       ('clvdzrrif02g3i8bawvlwsvyx', 'light', 10, 25, 'mg', 0, 'clvdzrrh402fpi8ba86a9tyr0'),
       ('clvdzrrim02g5i8ba6ert3j4o', 'common', 25, 45, 'mg', 0, 'clvdzrrh402fpi8ba86a9tyr0'),
       ('clvdzrris02g7i8ba3qw28kjl', 'strong', 45, 70, 'mg', 0, 'clvdzrrh402fpi8ba86a9tyr0'),
       ('clvdzrriy02g9i8ba0hq2ekdr', 'heavy', 70, 70, 'mg', 0, 'clvdzrrh402fpi8ba86a9tyr0'),
       ('clvdzrrje02gdi8bapq0z0xpk', 'threshold', 30, 30, 'mg', 0, 'clvdzrrj502gbi8bagmirqq9i'),
       ('clvdzrrjk02gfi8ba6kbybs4r', 'light', 50, 75, 'mg', 0, 'clvdzrrj502gbi8bagmirqq9i'),
       ('clvdzrrjo02ghi8baxxsu1xm9', 'common', 75, 120, 'mg', 0, 'clvdzrrj502gbi8bagmirqq9i'),
       ('clvdzrrjx02gji8basxr68cf1', 'strong', 120, 150, 'mg', 0, 'clvdzrrj502gbi8bagmirqq9i'),
       ('clvdzrrkh02gpi8baru9tovmc', 'light', 4, 8, 'mg', 0, 'clvdzrrk302gli8bagfq9j2ni'),
       ('clvdzrrkp02gri8baopt1yovy', 'common', 8, 14, 'mg', 0, 'clvdzrrk302gli8bagfq9j2ni'),
       ('clvdzrrkv02gti8bappnkmn3h', 'strong', 14, 28, 'mg', 0, 'clvdzrrk302gli8bagfq9j2ni'),
       ('clvdzrrl302gvi8baiab3s1ln', 'heavy', 28, 28, 'mg', 0, 'clvdzrrk302gli8bagfq9j2ni'),
       ('clvdzrrld02gxi8ba6jkleu3j', 'threshold', 4, 4, 'mg', 0, 'clvdzrrk902gni8bax9i9bm02'),
       ('clvdzrrlm02gzi8ba1ckog7lf', 'light', 10, 15, 'mg', 0, 'clvdzrrk902gni8bax9i9bm02'),
       ('clvdzrrls02h1i8ba8awm6vnk', 'common', 15, 30, 'mg', 0, 'clvdzrrk902gni8bax9i9bm02'),
       ('clvdzrrm002h3i8ba9wchvpkf', 'strong', 30, 50, 'mg', 0, 'clvdzrrk902gni8bax9i9bm02'),
       ('clvdzrrm802h5i8batzp976fv', 'heavy', 50, 50, 'mg', 0, 'clvdzrrk902gni8bax9i9bm02'),
       ('clvdzrrmm02h9i8bamti3ctif', 'threshold', 75, 75, 'mg', 0, 'clvdzrrmg02h7i8bag3ozg3k4'),
       ('clvdzrrms02hbi8batv8ixdsn', 'light', 75, 150, 'mg', 0, 'clvdzrrmg02h7i8bag3ozg3k4'),
       ('clvdzrrmz02hdi8babcbgtoal', 'common', 150, 225, 'mg', 0, 'clvdzrrmg02h7i8bag3ozg3k4'),
       ('clvdzrrn702hfi8bauoplcf0l', 'strong', 225, 325, 'mg', 0, 'clvdzrrmg02h7i8bag3ozg3k4'),
       ('clvdzrrng02hhi8bag7spqli7', 'heavy', 325, 325, 'mg', 0, 'clvdzrrmg02h7i8bag3ozg3k4'),
       ('clvdzrrnx02hni8bage311tiv', 'threshold', 5, 5, 'mg', 0, 'clvdzrrnl02hji8bajhctf3rx'),
       ('clvdzrro602hpi8ba8d26wwow', 'light', 10, 15, 'mg', 0, 'clvdzrrnl02hji8bajhctf3rx'),
       ('clvdzrroe02hri8bajtmhk7p2', 'common', 15, 30, 'mg', 0, 'clvdzrrnl02hji8bajhctf3rx'),
       ('clvdzrrol02hti8bar0l8i4vn', 'strong', 30, 60, 'mg', 0, 'clvdzrrnl02hji8bajhctf3rx'),
       ('clvdzrrot02hvi8ba5jd2ibmc', 'heavy', 60, 60, 'mg', 0, 'clvdzrrnl02hji8bajhctf3rx'),
       ('clvdzrrp202hxi8baisdaga2p', 'threshold', 5, 5, 'mg', 0, 'clvdzrrnq02hli8bav8c5yi3l'),
       ('clvdzrrp902hzi8bahcbw5uc2', 'light', 10, 20, 'mg', 0, 'clvdzrrnq02hli8bav8c5yi3l'),
       ('clvdzrrpf02i1i8ba3xldvr7s', 'common', 20, 40, 'mg', 0, 'clvdzrrnq02hli8bav8c5yi3l'),
       ('clvdzrrpm02i3i8baptcd55dw', 'strong', 40, 60, 'mg', 0, 'clvdzrrnq02hli8bav8c5yi3l'),
       ('clvdzrrpt02i5i8baaugta4o1', 'heavy', 60, 60, 'mg', 0, 'clvdzrrnq02hli8bav8c5yi3l'),
       ('clvdzrrq802i9i8ba30ybpr60', 'light', 1, 2, 'mg', 0, 'clvdzrrpz02i7i8ba05f03gio'),
       ('clvdzrrqe02ibi8bamjkabfpo', 'common', 2, 4, 'mg', 0, 'clvdzrrpz02i7i8ba05f03gio'),
       ('clvdzrrql02idi8bazm8gdmm0', 'strong', 4, 6, 'mg', 0, 'clvdzrrpz02i7i8ba05f03gio'),
       ('clvdzrrqq02ifi8baywvbpnms', 'heavy', 6, 6, 'mg', 0, 'clvdzrrpz02i7i8ba05f03gio'),
       ('clvdzrrr502iji8barjwi8dnf', 'threshold', 50, 50, 'mg', 0, 'clvdzrrqy02ihi8ba7mrlu4ga'),
       ('clvdzrrrb02ili8baak6m5hfo', 'light', 100, 150, 'mg', 0, 'clvdzrrqy02ihi8ba7mrlu4ga'),
       ('clvdzrrri02ini8baegs6s941', 'common', 150, 250, 'mg', 0, 'clvdzrrqy02ihi8ba7mrlu4ga'),
       ('clvdzrrrp02ipi8baiqob6v5q', 'strong', 250, 350, 'mg', 0, 'clvdzrrqy02ihi8ba7mrlu4ga'),
       ('clvdzrrs302iti8ba9883yyxt', 'threshold', 50, 50, 'µg', 0, 'clvdzrrrw02iri8babd6r6d3t'),
       ('clvdzrrsa02ivi8baxl37ilod', 'light', 100, 150, 'µg', 0, 'clvdzrrrw02iri8babd6r6d3t'),
       ('clvdzrrsh02ixi8ba78efegdw', 'common', 150, 200, 'µg', 0, 'clvdzrrrw02iri8babd6r6d3t'),
       ('clvdzrrsn02izi8ba5epbgum2', 'strong', 200, 250, 'µg', 0, 'clvdzrrrw02iri8babd6r6d3t'),
       ('clvdzrrst02j1i8ba4calcuw4', 'heavy', 300, 300, 'µg', 0, 'clvdzrrrw02iri8babd6r6d3t'),
       ('clvdzrrta02j5i8babn2qmf8c', 'common', 10, 25, 'mg', 0, 'clvdzrrt202j3i8ba1be26pfy'),
       ('clvdzrrtg02j7i8bauypr10le', 'strong', 25, 75, 'mg', 0, 'clvdzrrt202j3i8ba1be26pfy'),
       ('clvdzrrto02j9i8bag43a5jb4', 'heavy', 75, 75, 'mg', 0, 'clvdzrrt202j3i8ba1be26pfy'),
       ('clvdzrru302jdi8baycohnodv', 'threshold', 3.5, 3.5, 'mg', 0, 'clvdzrrtw02jbi8bat4eshoca'),
       ('clvdzrru902jfi8bar0vehtk5', 'light', 70, 130, 'mg', 0, 'clvdzrrtw02jbi8bat4eshoca'),
       ('clvdzrrug02jhi8badmakftqy', 'common', 130, 190, 'mg', 0, 'clvdzrrtw02jbi8bat4eshoca'),
       ('clvdzrrum02jji8ba0ntxxfln', 'strong', 190, 250, 'mg', 0, 'clvdzrrtw02jbi8bat4eshoca'),
       ('clvdzrrut02jli8banyhy368n', 'heavy', 250, 250, 'mg', 0, 'clvdzrrtw02jbi8bat4eshoca'),
       ('clvdzrrv702jpi8basvxbbzcl', 'threshold', 25, 25, 'mg', 0, 'clvdzrrv102jni8baxffkozxt'),
       ('clvdzrrve02jri8bav3g34o55', 'light', 50, 100, 'mg', 0, 'clvdzrrv102jni8baxffkozxt'),
       ('clvdzrrvj02jti8ba9ugiuvcg', 'common', 100, 200, 'mg', 0, 'clvdzrrv102jni8baxffkozxt'),
       ('clvdzrrvo02jvi8ba0cvwvbha', 'strong', 200, 300, 'mg', 0, 'clvdzrrv102jni8baxffkozxt'),
       ('clvdzrrvw02jxi8bahn5h5ssa', 'heavy', 300, 300, 'mg', 0, 'clvdzrrv102jni8baxffkozxt'),
       ('clvdzrrwa02k1i8ba5xc3j6pd', 'threshold', 10, 10, 'mg', 0, 'clvdzrrw402jzi8batt11q3rm'),
       ('clvdzrrwh02k3i8badw934j01', 'light', 10, 15, 'mg', 0, 'clvdzrrw402jzi8batt11q3rm'),
       ('clvdzrrwo02k5i8bajjr6h5nl', 'common', 15, 20, 'mg', 0, 'clvdzrrw402jzi8batt11q3rm'),
       ('clvdzrrwv02k7i8bagtbsz5aq', 'strong', 20, 30, 'mg', 0, 'clvdzrrw402jzi8batt11q3rm'),
       ('clvdzrrx302k9i8bay8r4kx73', 'heavy', 30, 30, 'mg', 0, 'clvdzrrw402jzi8batt11q3rm'),
       ('clvdzrrxj02kdi8bazsl1z3g2', 'light', 50, 200, 'mg', 0, 'clvdzrrxc02kbi8bat8b7553s'),
       ('clvdzrrxp02kfi8badll52l9r', 'common', 200, 500, 'mg', 0, 'clvdzrrxc02kbi8bat8b7553s'),
       ('clvdzrrxx02khi8ba3du43km9', 'strong', 500, 800, 'mg', 0, 'clvdzrrxc02kbi8bat8b7553s'),
       ('clvdzrry502kji8bapct4qjb1', 'heavy', 800, 800, 'mg', 0, 'clvdzrrxc02kbi8bat8b7553s'),
       ('clvdzrryh02kni8bai97q1kq1', 'threshold', 100, 100, 'mg', 0, 'clvdzrryb02kli8ba3km81bav'),
       ('clvdzrryo02kpi8bafwcq08q6', 'light', 400, 600, 'mg', 0, 'clvdzrryb02kli8ba3km81bav'),
       ('clvdzrryu02kri8bamihk3415', 'common', 600, 1000, 'mg', 0, 'clvdzrryb02kli8ba3km81bav'),
       ('clvdzrrz002kti8baezgfb6mc', 'strong', 1000, 1500, 'mg', 0, 'clvdzrryb02kli8ba3km81bav'),
       ('clvdzrrzc02kvi8ba7buon2yq', 'heavy', 1500, 1500, 'mg', 0, 'clvdzrryb02kli8ba3km81bav'),
       ('clvdzrs0302l1i8bawy4q7b6h', 'threshold', 5, 5, 'mg', 0, 'clvdzrrzm02kxi8ba0amavmei'),
       ('clvdzrs0b02l3i8bay5k7w72p', 'light', 15, 30, 'mg', 0, 'clvdzrrzm02kxi8ba0amavmei'),
       ('clvdzrs0j02l5i8ba1hq4lt9s', 'common', 30, 40, 'mg', 0, 'clvdzrrzm02kxi8ba0amavmei'),
       ('clvdzrs0r02l7i8bawjx3xwzr', 'strong', 40, 50, 'mg', 0, 'clvdzrrzm02kxi8ba0amavmei'),
       ('clvdzrs0z02l9i8ba1ayk1mzl', 'heavy', 50, 50, 'mg', 0, 'clvdzrrzm02kxi8ba0amavmei'),
       ('clvdzrs1702lbi8ba6i9grgk9', 'threshold', 1, 1, 'mg', 0, 'clvdzrrzt02kzi8ba9odq6pyy'),
       ('clvdzrs1d02ldi8baxcx67xqq', 'light', 2, 5, 'mg', 0, 'clvdzrrzt02kzi8ba9odq6pyy'),
       ('clvdzrs1m02lfi8ban0b5dapo', 'common', 5, 10, 'mg', 0, 'clvdzrrzt02kzi8ba9odq6pyy'),
       ('clvdzrs1t02lhi8banx17mxla', 'strong', 10, 20, 'mg', 0, 'clvdzrrzt02kzi8ba9odq6pyy'),
       ('clvdzrs2102lji8baj8whylcv', 'heavy', 20, 20, 'mg', 0, 'clvdzrrzt02kzi8ba9odq6pyy'),
       ('clvdzrs2h02lni8basxtxt92r', 'threshold', 25, 25, 'mg', 0, 'clvdzrs2902lli8baym8etaqm'),
       ('clvdzrs2o02lpi8ba5ek2z0lw', 'light', 50, 100, 'mg', 0, 'clvdzrs2902lli8baym8etaqm'),
       ('clvdzrs2v02lri8bakjt02zq8', 'common', 100, 150, 'mg', 0, 'clvdzrs2902lli8baym8etaqm'),
       ('clvdzrs3302lti8bam8r70qre', 'strong', 150, 200, 'mg', 0, 'clvdzrs2902lli8baym8etaqm'),
       ('clvdzrs3802lvi8banl7szpmw', 'heavy', 200, 200, 'mg', 0, 'clvdzrs2902lli8baym8etaqm'),
       ('clvdzrs4002m3i8basa0vr2c1', 'threshold', 10, 10, 'mg', 0, 'clvdzrs3e02lxi8bakb37ejb2'),
       ('clvdzrs4602m5i8bagzk8k0gm', 'light', 10, 20, 'mg', 0, 'clvdzrs3e02lxi8bakb37ejb2'),
       ('clvdzrs4e02m7i8ba9595su8s', 'common', 20, 40, 'mg', 0, 'clvdzrs3e02lxi8bakb37ejb2'),
       ('clvdzrs4l02m9i8baztyko9ta', 'strong', 40, 60, 'mg', 0, 'clvdzrs3e02lxi8bakb37ejb2'),
       ('clvdzrs4r02mbi8bastmhfemf', 'heavy', 60, 60, 'mg', 0, 'clvdzrs3e02lxi8bakb37ejb2'),
       ('clvdzrs4y02mdi8bagypa9jjo', 'threshold', 10, 10, 'mg', 0, 'clvdzrs3m02lzi8bakdc6pbje'),
       ('clvdzrs5402mfi8baugxrd5l2', 'light', 10, 25, 'mg', 0, 'clvdzrs3m02lzi8bakdc6pbje'),
       ('clvdzrs5a02mhi8ban1k0fasx', 'common', 25, 40, 'mg', 0, 'clvdzrs3m02lzi8bakdc6pbje'),
       ('clvdzrs5g02mji8baqgj8lh69', 'strong', 40, 60, 'mg', 0, 'clvdzrs3m02lzi8bakdc6pbje'),
       ('clvdzrs5o02mli8baeqpj49qn', 'heavy', 60, 60, 'mg', 0, 'clvdzrs3m02lzi8bakdc6pbje'),
       ('clvdzrs5x02mni8bawv2ay2nj', 'threshold', 5, 5, 'mg', 0, 'clvdzrs3u02m1i8basrhxhwva'),
       ('clvdzrs6302mpi8ba3i40nil3', 'light', 5, 15, 'mg', 0, 'clvdzrs3u02m1i8basrhxhwva'),
       ('clvdzrs6b02mri8bab0ybaxse', 'common', 15, 30, 'mg', 0, 'clvdzrs3u02m1i8basrhxhwva'),
       ('clvdzrs6j02mti8ba0l1mzevi', 'strong', 30, 50, 'mg', 0, 'clvdzrs3u02m1i8basrhxhwva'),
       ('clvdzrs6p02mvi8bas8zkumu0', 'heavy', 50, 50, 'mg', 0, 'clvdzrs3u02m1i8basrhxhwva'),
       ('clvdzrs7202mzi8baszbvj67s', 'threshold', 5, 5, 'mg', 0, 'clvdzrs6w02mxi8bagzodx4ly'),
       ('clvdzrs7902n1i8batnln1w3y', 'light', 50, 100, 'mg', 0, 'clvdzrs6w02mxi8bagzodx4ly'),
       ('clvdzrs7f02n3i8ba8ltt97ri', 'common', 100, 150, 'mg', 0, 'clvdzrs6w02mxi8bagzodx4ly'),
       ('clvdzrs7l02n5i8ba3yhfo4t8', 'strong', 150, 200, 'mg', 0, 'clvdzrs6w02mxi8bagzodx4ly'),
       ('clvdzrs7u02n7i8baou3vprfl', 'heavy', 200, 200, 'mg', 0, 'clvdzrs6w02mxi8bagzodx4ly'),
       ('clvdzrs8j02nfi8bauxf52nz1', 'common', 1, 4, 'mg', 0, 'clvdzrs8002n9i8ba0lwlscua'),
       ('clvdzrs8t02nhi8baj36vd3y8', 'common', 0.4, 2, 'mg', 0, 'clvdzrs8602nbi8bajnijho6u'),
       ('clvdzrs9002nji8batelngvu2', 'common', 0.4, 2, 'mg', 0, 'clvdzrs8b02ndi8ba4hfemb0n'),
       ('clvdzrs9k02npi8ba9313ioza', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzrs9702nli8bau6ddw1q8'),
       ('clvdzrs9q02nri8bagxu5wsn1', 'light', 0.5, 2, 'mg', 0, 'clvdzrs9702nli8bau6ddw1q8'),
       ('clvdzrs9y02nti8bautljppu9', 'common', 2, 4, 'mg', 0, 'clvdzrs9702nli8bau6ddw1q8'),
       ('clvdzrsa502nvi8bayb6ev89d', 'strong', 4, 6, 'mg', 0, 'clvdzrs9702nli8bau6ddw1q8'),
       ('clvdzrsac02nxi8ba2y81v8h4', 'heavy', 6, 6, 'mg', 0, 'clvdzrs9702nli8bau6ddw1q8'),
       ('clvdzrsai02nzi8ba9l90d6up', 'threshold', 0.2, 0.2, 'mg', 0, 'clvdzrs9d02nni8bal37a7erm'),
       ('clvdzrsaq02o1i8ba9pcfyl1u', 'light', 0.3, 0.8, 'mg', 0, 'clvdzrs9d02nni8bal37a7erm'),
       ('clvdzrsaw02o3i8ba1e7z3umu', 'common', 0.8, 1.5, 'mg', 0, 'clvdzrs9d02nni8bal37a7erm'),
       ('clvdzrsb302o5i8baxpmov4jj', 'strong', 1.5, 3.5, 'mg', 0, 'clvdzrs9d02nni8bal37a7erm'),
       ('clvdzrsba02o7i8bao4rtpzvu', 'heavy', 3.5, 3.5, 'mg', 0, 'clvdzrs9d02nni8bal37a7erm'),
       ('clvdzrsbp02obi8bavjqj9jbg', 'threshold', 0.1, 0.1, 'mg', 0, 'clvdzrsbk02o9i8ba20mopv0x'),
       ('clvdzrsbx02odi8bayrm4fovr', 'light', 0.25, 0.5, 'mg', 0, 'clvdzrsbk02o9i8ba20mopv0x'),
       ('clvdzrsc502ofi8ba50oq5l8s', 'common', 0.5, 1, 'mg', 0, 'clvdzrsbk02o9i8ba20mopv0x'),
       ('clvdzrscb02ohi8bazbbzc42v', 'strong', 1, 2, 'mg', 0, 'clvdzrsbk02o9i8ba20mopv0x'),
       ('clvdzrscj02oji8bak26qtrrx', 'heavy', 2, 2, 'mg', 0, 'clvdzrsbk02o9i8ba20mopv0x'),
       ('clvdzrsdl02ori8bag722k50s', 'threshold', 4, 4, 'g', 0, 'clvdzrsda02opi8bah30goifc'),
       ('clvdzrsds02oti8ba1hs1t3wq', 'light', 4, 8, 'g', 0, 'clvdzrsda02opi8bah30goifc'),
       ('clvdzrsdx02ovi8barvk9vshb', 'common', 8, 16, 'g', 0, 'clvdzrsda02opi8bah30goifc'),
       ('clvdzrse202oxi8baetop0agk', 'strong', 16, 40, 'g', 0, 'clvdzrsda02opi8bah30goifc'),
       ('clvdzrse902ozi8ba31e132sp', 'heavy', 40, 40, 'g', 0, 'clvdzrsda02opi8bah30goifc'),
       ('clvdzrses02p5i8baxddh98h3', 'threshold', 5, 5, 'mg', 0, 'clvdzrsef02p1i8bac4g7bfqb'),
       ('clvdzrsf002p7i8bavbur9r8k', 'light', 10, 25, 'mg', 0, 'clvdzrsef02p1i8bac4g7bfqb'),
       ('clvdzrsf702p9i8ba8motzvr4', 'common', 25, 50, 'mg', 0, 'clvdzrsef02p1i8bac4g7bfqb'),
       ('clvdzrsfc02pbi8barun2uck7', 'strong', 50, 100, 'mg', 0, 'clvdzrsef02p1i8bac4g7bfqb'),
       ('clvdzrsfl02pdi8baydm09abd', 'heavy', 100, 100, 'mg', 0, 'clvdzrsef02p1i8bac4g7bfqb'),
       ('clvdzrsfw02pfi8baiztbyokl', 'threshold', 5, 5, 'mg', 0, 'clvdzrsel02p3i8bam0ytm5x7'),
       ('clvdzrsg402phi8ba03h52gdi', 'light', 10, 25, 'mg', 0, 'clvdzrsel02p3i8bam0ytm5x7'),
       ('clvdzrsgb02pji8bahlyblu8e', 'common', 25, 50, 'mg', 0, 'clvdzrsel02p3i8bam0ytm5x7'),
       ('clvdzrsgj02pli8ba431p5re8', 'strong', 50, 80, 'mg', 0, 'clvdzrsel02p3i8bam0ytm5x7'),
       ('clvdzrsgq02pni8ba54p74fbz', 'heavy', 80, 80, 'mg', 0, 'clvdzrsel02p3i8bam0ytm5x7'),
       ('clvdzrshb02pti8ban47rd1j9', 'threshold', 2, 2, 'mg', 0, 'clvdzrsgx02ppi8ba929oqgzj'),
       ('clvdzrshg02pvi8bawzke0dv5', 'light', 3, 6, 'mg', 0, 'clvdzrsgx02ppi8ba929oqgzj'),
       ('clvdzrsho02pxi8bai0fabjth', 'common', 6, 12, 'mg', 0, 'clvdzrsgx02ppi8ba929oqgzj'),
       ('clvdzrshw02pzi8baiepjbtsr', 'strong', 12, 20, 'mg', 0, 'clvdzrsgx02ppi8ba929oqgzj'),
       ('clvdzrsi202q1i8ba6uzyawmo', 'heavy', 20, 20, 'mg', 0, 'clvdzrsgx02ppi8ba929oqgzj'),
       ('clvdzrsia02q3i8baz4fjaq4w', 'threshold', 1, 1, 'mg', 0, 'clvdzrsh302pri8bauzj8z90q'),
       ('clvdzrsii02q5i8ba4b9k9q9v', 'light', 3, 5, 'mg', 0, 'clvdzrsh302pri8bauzj8z90q'),
       ('clvdzrsip02q7i8bags9ln9cq', 'common', 5, 15, 'mg', 0, 'clvdzrsh302pri8bauzj8z90q'),
       ('clvdzrsit02q9i8ba94qvcp9n', 'strong', 15, 25, 'mg', 0, 'clvdzrsh302pri8bauzj8z90q'),
       ('clvdzrsj102qbi8ba5bwz6fhw', 'heavy', 25, 25, 'mg', 0, 'clvdzrsh302pri8bauzj8z90q'),
       ('clvdzrsjl02qhi8bacpomv6hb', 'threshold', 1, 1, 'mg', 0, 'clvdzrsj802qdi8bacdymeedk'),
       ('clvdzrsjs02qji8batsmgf21h', 'light', 1, 5, 'mg', 0, 'clvdzrsj802qdi8bacdymeedk'),
       ('clvdzrsjz02qli8ba0kcd1ki5', 'common', 5, 10, 'mg', 0, 'clvdzrsj802qdi8bacdymeedk'),
       ('clvdzrsk502qni8bafzwwp4pk', 'strong', 10, 20, 'mg', 0, 'clvdzrsj802qdi8bacdymeedk'),
       ('clvdzrskd02qpi8bauyekk6ey', 'heavy', 20, 20, 'mg', 0, 'clvdzrsj802qdi8bacdymeedk'),
       ('clvdzrskl02qri8baq6m7ozjt', 'threshold', 5, 5, 'mg', 0, 'clvdzrsje02qfi8bast9dvg1t'),
       ('clvdzrskr02qti8bapm0kp5b5', 'light', 5, 10, 'mg', 0, 'clvdzrsje02qfi8bast9dvg1t'),
       ('clvdzrskx02qvi8bayarbsiz8', 'common', 10, 20, 'mg', 0, 'clvdzrsje02qfi8bast9dvg1t'),
       ('clvdzrsl502qxi8ba3z6q3i18', 'strong', 20, 40, 'mg', 0, 'clvdzrsje02qfi8bast9dvg1t'),
       ('clvdzrsld02qzi8ba8v5slqo3', 'heavy', 40, 40, 'mg', 0, 'clvdzrsje02qfi8bast9dvg1t'),
       ('clvdzrsls02r3i8ba6l9rle2e', 'threshold', 10, 10, 'mg', 0, 'clvdzrslk02r1i8ba3j5kspm3'),
       ('clvdzrsly02r5i8bafpy4nxpy', 'light', 10, 15, 'mg', 0, 'clvdzrslk02r1i8ba3j5kspm3'),
       ('clvdzrsm502r7i8baxwat8q4p', 'common', 15, 25, 'mg', 0, 'clvdzrslk02r1i8ba3j5kspm3'),
       ('clvdzrsmb02r9i8baxfcrwyj4', 'strong', 30, 45, 'mg', 0, 'clvdzrslk02r1i8ba3j5kspm3'),
       ('clvdzrsmj02rbi8bavqkupf25', 'heavy', 45, 45, 'mg', 0, 'clvdzrslk02r1i8ba3j5kspm3'),
       ('clvdzrsmw02rfi8balt4a90hd', 'threshold', 250, 250, 'mg', 0, 'clvdzrsmq02rdi8baxxboco5m'),
       ('clvdzrsn402rhi8ba1d1yp2oh', 'light', 500, 1200, 'mg', 0, 'clvdzrsmq02rdi8baxxboco5m'),
       ('clvdzrsnd02rji8bax28s6jj9', 'common', 1200, 1800, 'mg', 0, 'clvdzrsmq02rdi8baxxboco5m'),
       ('clvdzrsnk02rli8ba9tyusdts', 'strong', 1800, 2400, 'mg', 0, 'clvdzrsmq02rdi8baxxboco5m'),
       ('clvdzrsnq02rni8bax510hize', 'heavy', 2400, 2400, 'mg', 0, 'clvdzrsmq02rdi8baxxboco5m'),
       ('clvdzrsob02rti8ba3oj9brag', 'threshold', 1, 1, 'mg', 0, 'clvdzrsnx02rpi8ba8dpc1w83'),
       ('clvdzrsog02rvi8ba03x013gy', 'light', 2.5, 7.5, 'mg', 0, 'clvdzrsnx02rpi8ba8dpc1w83'),
       ('clvdzrsoo02rxi8bac8s255v1', 'common', 7.5, 15, 'mg', 0, 'clvdzrsnx02rpi8ba8dpc1w83'),
       ('clvdzrsov02rzi8bahgxaejy8', 'strong', 15, 25, 'mg', 0, 'clvdzrsnx02rpi8ba8dpc1w83'),
       ('clvdzrsp102s1i8batomvcpcn', 'heavy', 25, 25, 'mg', 0, 'clvdzrsnx02rpi8ba8dpc1w83'),
       ('clvdzrspc02s3i8ba3gdqnojz', 'threshold', 1, 1, 'mg', 0, 'clvdzrso402rri8bauzz7aylh'),
       ('clvdzrspi02s5i8ba4qi7cxo9', 'light', 2.5, 10, 'mg', 0, 'clvdzrso402rri8bauzz7aylh'),
       ('clvdzrspp02s7i8baxk08k1v1', 'common', 10, 25, 'mg', 0, 'clvdzrso402rri8bauzz7aylh'),
       ('clvdzrspy02s9i8bavz98i9fm', 'strong', 25, 40, 'mg', 0, 'clvdzrso402rri8bauzz7aylh'),
       ('clvdzrsq702sbi8banoqznpxc', 'heavy', 40, 40, 'mg', 0, 'clvdzrso402rri8bauzz7aylh'),
       ('clvdzrsqj02sfi8bal1rpp3op', 'threshold', 2.5, 2.5, 'mg', 0, 'clvdzrsqe02sdi8bapnbs56b5'),
       ('clvdzrsqs02shi8baifsqt338', 'light', 5, 10, 'mg', 0, 'clvdzrsqe02sdi8bapnbs56b5'),
       ('clvdzrsqz02sji8ba2g0lukrs', 'common', 10, 20, 'mg', 0, 'clvdzrsqe02sdi8bapnbs56b5'),
       ('clvdzrsr702sli8bahdvgvosk', 'strong', 20, 30, 'mg', 0, 'clvdzrsqe02sdi8bapnbs56b5'),
       ('clvdzrsrg02sni8baiyniv9zd', 'heavy', 30, 30, 'mg', 0, 'clvdzrsqe02sdi8bapnbs56b5'),
       ('clvdzrsry02sri8bayb4y3ym9', 'threshold', 50, 50, 'µg', 0, 'clvdzrsrp02spi8baevknkori'),
       ('clvdzrss602sti8bauwa19ljz', 'light', 125, 275, 'µg', 0, 'clvdzrsrp02spi8baevknkori'),
       ('clvdzrssd02svi8banaiipueh', 'common', 275, 500, 'µg', 0, 'clvdzrsrp02spi8baevknkori'),
       ('clvdzrssk02sxi8baby4cz84a', 'strong', 500, 700, 'µg', 0, 'clvdzrsrp02spi8baevknkori'),
       ('clvdzrssu02szi8baz8vipf9l', 'heavy', 700, 700, 'µg', 0, 'clvdzrsrp02spi8baevknkori'),
       ('clvdzrstr02t7i8baxehkkwa1', 'threshold', 1, 1, 'mg', 0, 'clvdzrst302t1i8bavemrslc7'),
       ('clvdzrsu002t9i8ba94kfjv4m', 'light', 2, 4, 'mg', 0, 'clvdzrst302t1i8bavemrslc7'),
       ('clvdzrsua02tbi8baz2ropnm1', 'common', 4, 8, 'mg', 0, 'clvdzrst302t1i8bavemrslc7'),
       ('clvdzrsui02tdi8bat1jpbfcv', 'strong', 8, 15, 'mg', 0, 'clvdzrst302t1i8bavemrslc7'),
       ('clvdzrsup02tfi8baavkbjxf9', 'threshold', 1, 1, 'mg', 0, 'clvdzrsta02t3i8bas3m0wzu6'),
       ('clvdzrsux02thi8barg9a679y', 'light', 3, 5, 'mg', 0, 'clvdzrsta02t3i8bas3m0wzu6'),
       ('clvdzrsv402tji8ba0uge84ur', 'common', 5, 10, 'mg', 0, 'clvdzrsta02t3i8bas3m0wzu6'),
       ('clvdzrsva02tli8ba61en3x57', 'strong', 10, 15, 'mg', 0, 'clvdzrsta02t3i8bas3m0wzu6'),
       ('clvdzrsvf02tni8bazeiyal91', 'threshold', 1, 1, 'mg', 0, 'clvdzrsti02t5i8bavk78vhx5'),
       ('clvdzrsvp02tpi8basmqzkvr8', 'light', 2, 4, 'mg', 0, 'clvdzrsti02t5i8bavk78vhx5'),
       ('clvdzrsvv02tri8ba0hnhgfi7', 'common', 4, 8, 'mg', 0, 'clvdzrsti02t5i8bavk78vhx5'),
       ('clvdzrsw202tti8banjybzh35', 'strong', 8, 12, 'mg', 0, 'clvdzrsti02t5i8bavk78vhx5'),
       ('clvdzrswu02u1i8batkpknyd2', 'threshold', 1, 1, 'mg', 0, 'clvdzrsw902tvi8ba60on5qgp'),
       ('clvdzrsx102u3i8bai4gw3qpb', 'light', 2, 4, 'mg', 0, 'clvdzrsw902tvi8ba60on5qgp'),
       ('clvdzrsx702u5i8basiqwyyfy', 'common', 4, 8, 'mg', 0, 'clvdzrsw902tvi8ba60on5qgp'),
       ('clvdzrsxd02u7i8bauvcgv89b', 'strong', 8, 15, 'mg', 0, 'clvdzrsw902tvi8ba60on5qgp'),
       ('clvdzrsxl02u9i8bar87opbt3', 'threshold', 1, 1, 'mg', 0, 'clvdzrswg02txi8bahpez67oj'),
       ('clvdzrsxt02ubi8baqkfhdvx3', 'light', 3, 5, 'mg', 0, 'clvdzrswg02txi8bahpez67oj'),
       ('clvdzrsy102udi8ba9kglzbsl', 'common', 5, 10, 'mg', 0, 'clvdzrswg02txi8bahpez67oj'),
       ('clvdzrsy702ufi8ba2u7gfvbb', 'strong', 10, 15, 'mg', 0, 'clvdzrswg02txi8bahpez67oj'),
       ('clvdzrsyf02uhi8ba8zgppkqk', 'threshold', 1, 1, 'mg', 0, 'clvdzrswn02tzi8baeg3iprem'),
       ('clvdzrsyn02uji8ba9s741u6v', 'light', 2, 4, 'mg', 0, 'clvdzrswn02tzi8baeg3iprem'),
       ('clvdzrsyt02uli8bajbg8sxrr', 'common', 4, 8, 'mg', 0, 'clvdzrswn02tzi8baeg3iprem'),
       ('clvdzrsyy02uni8baer1awas9', 'strong', 8, 12, 'mg', 0, 'clvdzrswn02tzi8baeg3iprem'),
       ('clvdzrszc02uri8ba6117i95i', 'threshold', 10, 10, 'mg', 0, 'clvdzrsz502upi8baiozql0xj'),
       ('clvdzrszi02uti8baijbrd83w', 'light', 20, 40, 'mg', 0, 'clvdzrsz502upi8baiozql0xj'),
       ('clvdzrszq02uvi8bawqq02zt1', 'common', 40, 60, 'mg', 0, 'clvdzrsz502upi8baiozql0xj'),
       ('clvdzrt0502uzi8baqs9kg1nk', 'common', 100, 120, 'mg', 0, 'clvdzrszy02uxi8baggo6knaw'),
       ('clvdzrt0l02v3i8baa2u0hieq', 'threshold', 20, 20, 'µg', 0, 'clvdzrt0c02v1i8bale06dv41'),
       ('clvdzrt0t02v5i8bajo59jbfa', 'light', 50, 100, 'µg', 0, 'clvdzrt0c02v1i8bale06dv41'),
       ('clvdzrt0z02v7i8baxnx8dt16', 'common', 100, 200, 'µg', 0, 'clvdzrt0c02v1i8bale06dv41'),
       ('clvdzrt1602v9i8babpo4iwjq', 'strong', 200, 350, 'µg', 0, 'clvdzrt0c02v1i8bale06dv41'),
       ('clvdzrt1e02vbi8bajy5nu8e3', 'heavy', 350, 350, 'µg', 0, 'clvdzrt0c02v1i8bale06dv41'),
       ('clvdzrt2002vhi8ba7wnjgue6', 'threshold', 1, 1, 'mg', 0, 'clvdzrt1m02vdi8ba2fsahcxo'),
       ('clvdzrt2a02vji8bal41thu00', 'light', 2, 5, 'mg', 0, 'clvdzrt1m02vdi8ba2fsahcxo'),
       ('clvdzrt2h02vli8baj37i19tp', 'common', 5, 10, 'mg', 0, 'clvdzrt1m02vdi8ba2fsahcxo'),
       ('clvdzrt2o02vni8baaxe9l61f', 'strong', 10, 20, 'mg', 0, 'clvdzrt1m02vdi8ba2fsahcxo'),
       ('clvdzrt2v02vpi8babcxtkh9b', 'heavy', 20, 20, 'mg', 0, 'clvdzrt1m02vdi8ba2fsahcxo'),
       ('clvdzrt3202vri8bav19osfax', 'threshold', 2, 2, 'mg', 0, 'clvdzrt1r02vfi8batcxi117e'),
       ('clvdzrt3b02vti8bafiwpc0fg', 'light', 5, 10, 'mg', 0, 'clvdzrt1r02vfi8batcxi117e'),
       ('clvdzrt3k02vvi8ba6ih8m646', 'common', 10, 15, 'mg', 0, 'clvdzrt1r02vfi8batcxi117e'),
       ('clvdzrt3q02vxi8ba4k28hwlf', 'strong', 15, 25, 'mg', 0, 'clvdzrt1r02vfi8batcxi117e'),
       ('clvdzrt3x02vzi8banauh69ef', 'heavy', 25, 25, 'mg', 0, 'clvdzrt1r02vfi8batcxi117e'),
       ('clvdzrt4d02w3i8baar9dbyqx', 'threshold', 25, 25, 'mg', 0, 'clvdzrt4502w1i8baw14x6vft'),
       ('clvdzrt4j02w5i8bapsnsdd43', 'light', 50, 100, 'mg', 0, 'clvdzrt4502w1i8baw14x6vft'),
       ('clvdzrt4r02w7i8ba2rtmmm68', 'common', 100, 200, 'mg', 0, 'clvdzrt4502w1i8baw14x6vft'),
       ('clvdzrt4x02w9i8basei1m40i', 'strong', 200, 300, 'mg', 0, 'clvdzrt4502w1i8baw14x6vft'),
       ('clvdzrt5a02wdi8ba3s7wcnu9', 'threshold', 25, 25, 'mg', 0, 'clvdzrt5402wbi8ba3cn0r76a'),
       ('clvdzrt5i02wfi8ba7w6f7xjh', 'light', 50, 100, 'mg', 0, 'clvdzrt5402wbi8ba3cn0r76a'),
       ('clvdzrt5r02whi8ba59vdsng2', 'common', 100, 200, 'mg', 0, 'clvdzrt5402wbi8ba3cn0r76a'),
       ('clvdzrt5x02wji8bamm0ivkmz', 'strong', 200, 400, 'mg', 0, 'clvdzrt5402wbi8ba3cn0r76a'),
       ('clvdzrt6c02wni8bar4q9jdca', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrt6402wli8baqx80czir'),
       ('clvdzrt6j02wpi8bapo272uy4', 'light', 1, 2, 'mg', 0, 'clvdzrt6402wli8baqx80czir'),
       ('clvdzrt6n02wri8bafnipi8ka', 'common', 2, 3, 'mg', 0, 'clvdzrt6402wli8baqx80czir'),
       ('clvdzrt6v02wti8bardq6l82o', 'strong', 4, 5, 'mg', 0, 'clvdzrt6402wli8baqx80czir'),
       ('clvdzrt7102wvi8bas7j71849', 'heavy', 5, 5, 'mg', 0, 'clvdzrt6402wli8baqx80czir'),
       ('clvdzrt7f02wzi8ba04xh41my', 'threshold', 0.25, 0.25, 'g', 0, 'clvdzrt7802wxi8bae5i6kubd'),
       ('clvdzrt7m02x1i8bada58k9lb', 'light', 0.5, 1, 'g', 0, 'clvdzrt7802wxi8bae5i6kubd'),
       ('clvdzrt7u02x3i8bah15wd9yu', 'common', 1, 2, 'g', 0, 'clvdzrt7802wxi8bae5i6kubd'),
       ('clvdzrt8302x5i8bapx1pu8n4', 'strong', 2, 3.5, 'g', 0, 'clvdzrt7802wxi8bae5i6kubd'),
       ('clvdzrt8a02x7i8baaw69h4gq', 'heavy', 3.5, 3.5, 'g', 0, 'clvdzrt7802wxi8bae5i6kubd'),
       ('clvdzrt8o02xbi8baja9i4drg', 'threshold', 25, 25, 'mg', 0, 'clvdzrt8h02x9i8ba3lvrzvrv'),
       ('clvdzrt8u02xdi8bat3vschjq', 'light', 50, 100, 'mg', 0, 'clvdzrt8h02x9i8ba3lvrzvrv'),
       ('clvdzrt9102xfi8babnunxj7n', 'common', 100, 150, 'mg', 0, 'clvdzrt8h02x9i8ba3lvrzvrv'),
       ('clvdzrt9802xhi8balivz2cr9', 'strong', 150, 300, 'mg', 0, 'clvdzrt8h02x9i8ba3lvrzvrv'),
       ('clvdzrt9i02xli8bavu31r82o', 'threshold', 50, 50, 'mg', 0, 'clvdzrt9d02xji8bafbv3478z'),
       ('clvdzrt9p02xni8bacdyhkk8g', 'light', 50, 100, 'mg', 0, 'clvdzrt9d02xji8bafbv3478z'),
       ('clvdzrt9w02xpi8barg1axdfe', 'common', 100, 200, 'mg', 0, 'clvdzrt9d02xji8bafbv3478z'),
       ('clvdzrta202xri8bas2gvdtz0', 'strong', 200, 400, 'mg', 0, 'clvdzrt9d02xji8bafbv3478z'),
       ('clvdzrta802xti8ba5gqb2xoy', 'heavy', 400, 400, 'mg', 0, 'clvdzrt9d02xji8bafbv3478z'),
       ('clvdzrtao02xxi8balfgaubog', 'threshold', 0.25, 0.25, 'g', 0, 'clvdzrtag02xvi8babjiru4xv'),
       ('clvdzrtau02xzi8ba9r149gkf', 'light', 0.5, 2, 'g', 0, 'clvdzrtag02xvi8babjiru4xv'),
       ('clvdzrtb202y1i8bav56q6r1t', 'common', 2, 3, 'g', 0, 'clvdzrtag02xvi8babjiru4xv'),
       ('clvdzrtba02y3i8baybk14xxj', 'strong', 3, 5, 'g', 0, 'clvdzrtag02xvi8babjiru4xv'),
       ('clvdzrtbh02y5i8ban9g79kqn', 'heavy', 5, 5, 'g', 0, 'clvdzrtag02xvi8babjiru4xv'),
       ('clvdzrtbw02y9i8baz7apaou1', 'threshold', 100, 100, 'mg', 0, 'clvdzrtbn02y7i8baqbdhf0j0'),
       ('clvdzrtc202ybi8ba79mmxack', 'light', 250, 500, 'mg', 0, 'clvdzrtbn02y7i8baqbdhf0j0'),
       ('clvdzrtc802ydi8balgoy8txn', 'common', 500, 800, 'mg', 0, 'clvdzrtbn02y7i8baqbdhf0j0'),
       ('clvdzrtce02yfi8bapfoo0aa6', 'strong', 800, 1200, 'mg', 0, 'clvdzrtbn02y7i8baqbdhf0j0'),
       ('clvdzrtcl02yhi8ba2owa0es8', 'heavy', 1200, 1200, 'mg', 0, 'clvdzrtbn02y7i8baqbdhf0j0'),
       ('clvdzrtd702yni8bab8q6mgjx', 'threshold', 50, 50, 'mg', 0, 'clvdzrtcr02yji8bau7zq2tn6'),
       ('clvdzrtdg02ypi8ba6o7boexk', 'light', 50, 225, 'mg', 0, 'clvdzrtcr02yji8bau7zq2tn6'),
       ('clvdzrtdl02yri8baamus4iir', 'common', 225, 600, 'mg', 0, 'clvdzrtcr02yji8bau7zq2tn6'),
       ('clvdzrtds02yti8bao081dj69', 'strong', 600, 900, 'mg', 0, 'clvdzrtcr02yji8bau7zq2tn6'),
       ('clvdzrtdy02yvi8bav1tzqco9', 'heavy', 900, 900, 'mg', 0, 'clvdzrtcr02yji8bau7zq2tn6'),
       ('clvdzrte502yxi8bao0b8c3iv', 'threshold', 40, 40, 'mg', 0, 'clvdzrtcz02yli8ba3r3wi376'),
       ('clvdzrtea02yzi8basaodimst', 'light', 40, 200, 'mg', 0, 'clvdzrtcz02yli8ba3r3wi376'),
       ('clvdzrteg02z1i8bammxh6jnh', 'common', 200, 450, 'mg', 0, 'clvdzrtcz02yli8ba3r3wi376'),
       ('clvdzrten02z3i8bajeuz04tj', 'strong', 450, 600, 'mg', 0, 'clvdzrtcz02yli8ba3r3wi376'),
       ('clvdzrtew02z5i8babdky8t2f', 'heavy', 600, 600, 'mg', 0, 'clvdzrtcz02yli8ba3r3wi376'),
       ('clvdzrtfa02z9i8bayzab6iyn', 'threshold', 2, 2, 'mg', 0, 'clvdzrtf202z7i8baj0aqzkti'),
       ('clvdzrtfh02zbi8ba4p5478zr', 'light', 2.5, 5, 'mg', 0, 'clvdzrtf202z7i8baj0aqzkti'),
       ('clvdzrtfo02zdi8baoufrhgeq', 'common', 5, 20, 'mg', 0, 'clvdzrtf202z7i8baj0aqzkti'),
       ('clvdzrtfu02zfi8banw7xs7t6', 'strong', 20, 40, 'mg', 0, 'clvdzrtf202z7i8baj0aqzkti'),
       ('clvdzrtg802zji8bacmblyx6l', 'threshold', 5, 5, 'mg', 0, 'clvdzrtg102zhi8bakoqvyzgt'),
       ('clvdzrtge02zli8banet2gal3', 'light', 15, 25, 'mg', 0, 'clvdzrtg102zhi8bakoqvyzgt'),
       ('clvdzrtgj02zni8ba2y2bcsmk', 'common', 25, 45, 'mg', 0, 'clvdzrtg102zhi8bakoqvyzgt'),
       ('clvdzrtgr02zpi8baubwmd88q', 'strong', 45, 60, 'mg', 0, 'clvdzrtg102zhi8bakoqvyzgt'),
       ('clvdzrtgy02zri8ba9qw5hhg8', 'heavy', 60, 60, 'mg', 0, 'clvdzrtg102zhi8bakoqvyzgt'),
       ('clvdzrthc02zvi8baqv31cqx8', 'threshold', 5, 5, 'mg', 0, 'clvdzrth502zti8ba7rndwwgo'),
       ('clvdzrthl02zxi8ba4k5qzqma', 'light', 12.5, 25, 'mg', 0, 'clvdzrth502zti8ba7rndwwgo'),
       ('clvdzrthr02zzi8bam27ybkcz', 'common', 25, 50, 'mg', 0, 'clvdzrth502zti8ba7rndwwgo'),
       ('clvdzrthw0301i8bah91aiicw', 'strong', 50, 100, 'mg', 0, 'clvdzrth502zti8ba7rndwwgo'),
       ('clvdzrti40303i8ba6hipmn06', 'heavy', 100, 100, 'mg', 0, 'clvdzrth502zti8ba7rndwwgo'),
       ('clvdzrtij0307i8baav2gwyau', 'threshold', 10, 10, 'mg', 0, 'clvdzrtic0305i8bayygjkxgm'),
       ('clvdzrtiq0309i8baz07a3pnz', 'light', 31.25, 62.5, 'mg', 0, 'clvdzrtic0305i8bayygjkxgm'),
       ('clvdzrtj4030bi8banlqm6un6', 'common', 62.5, 125, 'mg', 0, 'clvdzrtic0305i8bayygjkxgm'),
       ('clvdzrtjb030di8baua0al8p7', 'strong', 125, 187.5, 'mg', 0, 'clvdzrtic0305i8bayygjkxgm'),
       ('clvdzrtjn030fi8bag2cvsbop', 'heavy', 187.5, 187.5, 'mg', 0, 'clvdzrtic0305i8bayygjkxgm'),
       ('clvdzrtk4030ji8ba3iugynk8', 'threshold', 10, 10, 'mg', 0, 'clvdzrtjv030hi8ba1uaplgiy'),
       ('clvdzrtkb030li8baidk3bzky', 'light', 15, 30, 'mg', 0, 'clvdzrtjv030hi8ba1uaplgiy'),
       ('clvdzrtki030ni8ba5v2qou5v', 'common', 30, 40, 'mg', 0, 'clvdzrtjv030hi8ba1uaplgiy'),
       ('clvdzrtko030pi8baw523u576', 'strong', 40, 60, 'mg', 0, 'clvdzrtjv030hi8ba1uaplgiy'),
       ('clvdzrtky030ri8baowe419d1', 'heavy', 60, 60, 'mg', 0, 'clvdzrtjv030hi8ba1uaplgiy'),
       ('clvdzrtlc030vi8bapp69x0ng', 'threshold', 5, 5, 'mg', 0, 'clvdzrtl5030ti8baj9srgm5h'),
       ('clvdzrtlk030xi8bau8r6l639', 'light', 10, 15, 'mg', 0, 'clvdzrtl5030ti8baj9srgm5h'),
       ('clvdzrtlq030zi8baj4930940', 'common', 15, 25, 'mg', 0, 'clvdzrtl5030ti8baj9srgm5h'),
       ('clvdzrtlw0311i8baf40t25at', 'strong', 25, 40, 'mg', 0, 'clvdzrtl5030ti8baj9srgm5h'),
       ('clvdzrtm30313i8barjvpufud', 'heavy', 40, 40, 'mg', 0, 'clvdzrtl5030ti8baj9srgm5h'),
       ('clvdzrtml0317i8baupv2reci', 'threshold', 2.5, 2.5, 'mg', 0, 'clvdzrtmd0315i8badwmuai6f'),
       ('clvdzrtmr0319i8baef1v9veb', 'light', 2.5, 10, 'mg', 0, 'clvdzrtmd0315i8badwmuai6f'),
       ('clvdzrtmy031bi8bacu16cgtd', 'common', 10, 25, 'mg', 0, 'clvdzrtmd0315i8badwmuai6f'),
       ('clvdzrtn5031di8baj6munh9j', 'strong', 25, 50, 'mg', 0, 'clvdzrtmd0315i8badwmuai6f'),
       ('clvdzrtna031fi8ba3hbpaniv', 'heavy', 50, 50, 'mg', 0, 'clvdzrtmd0315i8badwmuai6f'),
       ('clvdzrtnp031ji8bapqnx97l8', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrtng031hi8basqhkz7vn'),
       ('clvdzrtnu031li8bafzxl8e0w', 'light', 1, 2, 'mg', 0, 'clvdzrtng031hi8basqhkz7vn'),
       ('clvdzrtnz031ni8bai9yddm1z', 'common', 2, 3, 'mg', 0, 'clvdzrtng031hi8basqhkz7vn'),
       ('clvdzrto5031pi8baw136ffkt', 'strong', 3, 4, 'mg', 0, 'clvdzrtng031hi8basqhkz7vn'),
       ('clvdzrtod031ri8barxoycu8c', 'heavy', 4, 4, 'mg', 0, 'clvdzrtng031hi8basqhkz7vn'),
       ('clvdzrtoq031vi8ba2w0jya7n', 'threshold', 10, 10, 'mg', 0, 'clvdzrtoj031ti8baxmrggr0h'),
       ('clvdzrtow031xi8batn8elsoi', 'light', 25, 50, 'mg', 0, 'clvdzrtoj031ti8baxmrggr0h'),
       ('clvdzrtp3031zi8ba643d6a5a', 'common', 50, 150, 'mg', 0, 'clvdzrtoj031ti8baxmrggr0h'),
       ('clvdzrtpb0321i8baorss8l2s', 'strong', 150, 300, 'mg', 0, 'clvdzrtoj031ti8baxmrggr0h'),
       ('clvdzrtph0323i8baqsnbu4o6', 'heavy', 300, 300, 'mg', 0, 'clvdzrtoj031ti8baxmrggr0h'),
       ('clvdzrtq00327i8baoi05gfcq', 'threshold', 0.25, 0.25, 'mg', 0, 'clvdzrtpr0325i8ba2vk9hxt6'),
       ('clvdzrtq60329i8baelo8x9rz', 'light', 0.5, 1, 'mg', 0, 'clvdzrtpr0325i8ba2vk9hxt6'),
       ('clvdzrtqb032bi8bafthdh7af', 'common', 1, 3, 'mg', 0, 'clvdzrtpr0325i8ba2vk9hxt6'),
       ('clvdzrtqh032di8ba9ep4k8gc', 'strong', 3, 6, 'mg', 0, 'clvdzrtpr0325i8ba2vk9hxt6'),
       ('clvdzrtqo032fi8ba8uyiz3dj', 'heavy', 6, 6, 'mg', 0, 'clvdzrtpr0325i8ba2vk9hxt6'),
       ('clvdzrtrd032ni8ba1hy1jrbj', 'threshold', 1, 1, 'mg', 0, 'clvdzrtqu032hi8ba69yh4r9o'),
       ('clvdzrtrj032pi8ba475j2u8o', 'light', 2, 4, 'mg', 0, 'clvdzrtqu032hi8ba69yh4r9o'),
       ('clvdzrtrq032ri8baae1fccie', 'common', 4, 8, 'mg', 0, 'clvdzrtqu032hi8ba69yh4r9o'),
       ('clvdzrtrx032ti8ba9mr0wuym', 'strong', 8, 15, 'mg', 0, 'clvdzrtqu032hi8ba69yh4r9o'),
       ('clvdzrts4032vi8bafr04hvrp', 'threshold', 1, 1, 'mg', 0, 'clvdzrtr0032ji8bayl0j51cc'),
       ('clvdzrtsa032xi8banohmerrp', 'light', 3, 5, 'mg', 0, 'clvdzrtr0032ji8bayl0j51cc'),
       ('clvdzrtsf032zi8baf9ooruaa', 'common', 5, 9, 'mg', 0, 'clvdzrtr0032ji8bayl0j51cc'),
       ('clvdzrtsp0331i8bal1qs6x01', 'strong', 9, 13, 'mg', 0, 'clvdzrtr0032ji8bayl0j51cc'),
       ('clvdzrtt20333i8bacxwtc5kc', 'threshold', 1, 1, 'mg', 0, 'clvdzrtr6032li8ba0rng560d'),
       ('clvdzrtt80335i8baop3opoos', 'light', 2, 4, 'mg', 0, 'clvdzrtr6032li8ba0rng560d'),
       ('clvdzrttg0337i8bak5g5dxpb', 'common', 4, 8, 'mg', 0, 'clvdzrtr6032li8ba0rng560d'),
       ('clvdzrttm0339i8bam9ym2hhn', 'strong', 8, 12, 'mg', 0, 'clvdzrtr6032li8ba0rng560d'),
       ('clvdzrtu2033di8baq3i61844', 'threshold', 200, 200, 'mg', 0, 'clvdzrttt033bi8ba1cta0yx9'),
       ('clvdzrtub033fi8bavzj3z2xl', 'light', 400, 800, 'mg', 0, 'clvdzrttt033bi8ba1cta0yx9'),
       ('clvdzrtui033hi8baopdrtjg5', 'common', 800, 1200, 'mg', 0, 'clvdzrttt033bi8ba1cta0yx9'),
       ('clvdzrtur033ji8ba50v5jgnr', 'strong', 1200, 1600, 'mg', 0, 'clvdzrttt033bi8ba1cta0yx9'),
       ('clvdzrtuz033li8batt2yisa0', 'heavy', 1600, 1600, 'mg', 0, 'clvdzrttt033bi8ba1cta0yx9'),
       ('clvdzrtve033pi8bapijyu0wb', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzrtv6033ni8ba3yvi52eg'),
       ('clvdzrtvl033ri8basfzxcvyg', 'light', 0.5, 1.5, 'mg', 0, 'clvdzrtv6033ni8ba3yvi52eg'),
       ('clvdzrtvr033ti8bavvgvzif7', 'common', 1.5, 2, 'mg', 0, 'clvdzrtv6033ni8ba3yvi52eg'),
       ('clvdzrtvz033vi8baw8dusbxu', 'strong', 2, 4, 'mg', 0, 'clvdzrtv6033ni8ba3yvi52eg'),
       ('clvdzrtw6033xi8bate75oler', 'heavy', 4, 4, 'mg', 0, 'clvdzrtv6033ni8ba3yvi52eg'),
       ('clvdzrtx40345i8ba07btgzkg', 'threshold', 20, 20, 'mg', 0, 'clvdzrtwx0343i8baabvfsyok'),
       ('clvdzrtxa0347i8bas5boq91t', 'light', 25, 50, 'mg', 0, 'clvdzrtwx0343i8baabvfsyok'),
       ('clvdzrtxg0349i8ba9dhyys79', 'common', 50, 150, 'mg', 0, 'clvdzrtwx0343i8baabvfsyok'),
       ('clvdzrtxp034bi8bavk1ycho5', 'strong', 150, 300, 'mg', 0, 'clvdzrtwx0343i8baabvfsyok'),
       ('clvdzrty1034fi8bajq5zj5z4', 'threshold', 0.1, 0.1, 'μg', 0, 'clvdzrtxv034di8ba0qp6yzn0'),
       ('clvdzrty9034hi8baqweugjd6', 'light', 1, 5, 'μg', 0, 'clvdzrtxv034di8ba0qp6yzn0'),
       ('clvdzrtyh034ji8bahjqmeyar', 'common', 5, 10, 'μg', 0, 'clvdzrtxv034di8ba0qp6yzn0'),
       ('clvdzrtym034li8bauqkd147z', 'strong', 10, 25, 'μg', 0, 'clvdzrtxv034di8ba0qp6yzn0'),
       ('clvdzrtyr034ni8baeurtu291', 'heavy', 25, 25, 'μg', 0, 'clvdzrtxv034di8ba0qp6yzn0'),
       ('clvdzrtz8034ri8bayhwd2pxb', 'threshold', 1, 1, 'mg', 0, 'clvdzrtz0034pi8baqawk18tz'),
       ('clvdzrtze034ti8ban9y0eq24', 'light', 1, 2, 'mg', 0, 'clvdzrtz0034pi8baqawk18tz'),
       ('clvdzrtzk034vi8bal2vvx3pr', 'common', 2, 3, 'mg', 0, 'clvdzrtz0034pi8baqawk18tz'),
       ('clvdzrtzt034xi8bawfigixa3', 'strong', 3, 5, 'mg', 0, 'clvdzrtz0034pi8baqawk18tz'),
       ('clvdzrtzz034zi8basq0nrnz3', 'heavy', 5, 5, 'mg', 0, 'clvdzrtz0034pi8baqawk18tz'),
       ('clvdzru0b0353i8baht0201oc', 'threshold', 0.5, 0.5, 'mg', 0, 'clvdzru040351i8baqu5n5dii'),
       ('clvdzru0j0355i8bay8gpwqgc', 'light', 0.5, 1, 'mg', 0, 'clvdzru040351i8baqu5n5dii'),
       ('clvdzru0q0357i8bawajmxxze', 'common', 1, 2, 'mg', 0, 'clvdzru040351i8baqu5n5dii'),
       ('clvdzru100359i8bafd55jlry', 'strong', 2, 5, 'mg', 0, 'clvdzru040351i8baqu5n5dii'),
       ('clvdzru18035bi8bayn7q9p87', 'heavy', 5, 5, 'mg', 0, 'clvdzru040351i8baqu5n5dii'),
       ('clvdzru1n035fi8bamvu7fa1z', 'threshold', 5, 5, 'mg', 0, 'clvdzru1e035di8bacttclkk7'),
       ('clvdzru1u035hi8bazfxh2wuo', 'light', 10, 20, 'mg', 0, 'clvdzru1e035di8bacttclkk7'),
       ('clvdzru21035ji8ba38p74o7d', 'common', 20, 40, 'mg', 0, 'clvdzru1e035di8bacttclkk7'),
       ('clvdzru28035li8bakbsutlpe', 'strong', 40, 60, 'mg', 0, 'clvdzru1e035di8bacttclkk7'),
       ('clvdzru2g035ni8bat5wqiqbg', 'heavy', 60, 60, 'mg', 0, 'clvdzru1e035di8bacttclkk7'),
       ('clvdzru2u035ri8ba3dbs8gex', 'threshold', 5, 5, 'mg', 0, 'clvdzru2n035pi8ba0bcnzpk8'),
       ('clvdzru31035ti8bafh370vcr', 'light', 10, 20, 'mg', 0, 'clvdzru2n035pi8ba0bcnzpk8'),
       ('clvdzru39035vi8bamh7sqf5l', 'common', 20, 35, 'mg', 0, 'clvdzru2n035pi8ba0bcnzpk8'),
       ('clvdzru3g035xi8bakos7j5gw', 'strong', 35, 50, 'mg', 0, 'clvdzru2n035pi8ba0bcnzpk8'),
       ('clvdzru3m035zi8baydq1fq3p', 'heavy', 50, 50, 'mg', 0, 'clvdzru2n035pi8ba0bcnzpk8'),
       ('clvdzru440363i8ba5pzk02bx', 'threshold', 12.5, 12.5, 'mg', 0, 'clvdzru3w0361i8bawc7nk8lt'),
       ('clvdzru4a0365i8batuw908pw', 'light', 25, 50, 'mg', 0, 'clvdzru3w0361i8bawc7nk8lt'),
       ('clvdzru4i0367i8bage98jhfm', 'common', 50, 75, 'mg', 0, 'clvdzru3w0361i8bawc7nk8lt'),
       ('clvdzru4s0369i8banqwgirk1', 'strong', 75, 150, 'mg', 0, 'clvdzru3w0361i8bawc7nk8lt'),
       ('clvdzru4y036bi8baubd4x2kx', 'heavy', 150, 150, 'mg', 0, 'clvdzru3w0361i8bawc7nk8lt'),
       ('clvdzru5e036fi8bak12c83pf', 'threshold', 2, 2, 'mg', 0, 'clvdzru59036di8barjw7jtli'),
       ('clvdzru5m036hi8bazj1flb7d', 'light', 5, 10, 'mg', 0, 'clvdzru59036di8barjw7jtli'),
       ('clvdzru5r036ji8bawmhlhwfv', 'common', 10, 30, 'mg', 0, 'clvdzru59036di8barjw7jtli'),
       ('clvdzru5z036li8ba6ewmqilf', 'strong', 30, 40, 'mg', 0, 'clvdzru59036di8barjw7jtli'),
       ('clvdzru67036ni8ba4m3jiale', 'heavy', 40, 40, 'mg', 0, 'clvdzru59036di8barjw7jtli'),
       ('clvdzru6z036ti8bavuw3oxiy', 'threshold', 25, 25, 'mg', 0, 'clvdzru6d036pi8ba7zmp34ij'),
       ('clvdzru76036vi8bangtst6uj', 'common', 25, 100, 'mg', 0, 'clvdzru6d036pi8ba7zmp34ij'),
       ('clvdzru7f036xi8bazuv6djmt', 'threshold', 25, 25, 'mg', 0, 'clvdzru6l036ri8ba292a0h0l'),
       ('clvdzru7m036zi8bancr1jcff', 'light', 50, 100, 'mg', 0, 'clvdzru6l036ri8ba292a0h0l'),
       ('clvdzru7t0371i8bahceujtkb', 'common', 100, 150, 'mg', 0, 'clvdzru6l036ri8ba292a0h0l'),
       ('clvdzru810373i8bao8ej4mqn', 'strong', 150, 300, 'mg', 0, 'clvdzru6l036ri8ba292a0h0l'),
       ('clvdzru8b0375i8bakcoeh5hx', 'heavy', 300, 300, 'mg', 0, 'clvdzru6l036ri8ba292a0h0l'),
       ('clvdzru8s0379i8bayoezg2k7', 'threshold', 50, 50, 'mg', 0, 'clvdzru8k0377i8bact6krrud'),
       ('clvdzru8z037bi8bagocgowxt', 'light', 75, 175, 'mg', 0, 'clvdzru8k0377i8bact6krrud'),
       ('clvdzru95037di8bab82knshh', 'common', 175, 300, 'mg', 0, 'clvdzru8k0377i8bact6krrud'),
       ('clvdzru9c037fi8bajlhhl1h4', 'strong', 300, 500, 'mg', 0, 'clvdzru8k0377i8bact6krrud'),
       ('clvdzru9k037hi8bastsykkzg', 'heavy', 500, 500, 'mg', 0, 'clvdzru8k0377i8bact6krrud'),
       ('clvdzru9y037li8bai40a8juw', 'threshold', 3, 3, 'mg', 0, 'clvdzru9r037ji8baabqjssfd'),
       ('clvdzrua6037ni8ba1xusv10g', 'light', 6, 12, 'mg', 0, 'clvdzru9r037ji8baabqjssfd'),
       ('clvdzruad037pi8baeqnz4i8u', 'common', 12, 35, 'mg', 0, 'clvdzru9r037ji8baabqjssfd'),
       ('clvdzruai037ri8baw5sf18kz', 'strong', 35, 100, 'mg', 0, 'clvdzru9r037ji8baabqjssfd'),
       ('clvdzruao037ti8bavqvgv2mn', 'heavy', 100, 100, 'mg', 0, 'clvdzru9r037ji8baabqjssfd'),
       ('clvdzrub9037xi8bagcg0sabf', 'threshold', 25, 25, 'mg', 0, 'clvdzrub0037vi8baw2b6vgmj'),
       ('clvdzrubf037zi8ba4owwzzzp', 'light', 25, 50, 'mg', 0, 'clvdzrub0037vi8baw2b6vgmj'),
       ('clvdzrubn0381i8basmx5lj3z', 'common', 50, 100, 'mg', 0, 'clvdzrub0037vi8baw2b6vgmj'),
       ('clvdzrubu0383i8bamzcs5uhk', 'strong', 100, 150, 'mg', 0, 'clvdzrub0037vi8baw2b6vgmj'),
       ('clvdzruc10385i8bazsapssob', 'heavy', 200, 200, 'mg', 0, 'clvdzrub0037vi8baw2b6vgmj'),
       ('clvdzruck0389i8badzcmgpjm', 'threshold', 25, 25, 'μg', 0, 'clvdzruc90387i8ba0wky7fof'),
       ('clvdzrucr038bi8baq7akkr3i', 'light', 2, 3, 'μg', 0, 'clvdzruc90387i8ba0wky7fof'),
       ('clvdzrucy038di8badjmu278c', 'common', 4, 5, 'μg', 0, 'clvdzruc90387i8ba0wky7fof'),
       ('clvdzrud6038fi8ba1qljiw0t', 'strong', 6, 8, 'μg', 0, 'clvdzruc90387i8ba0wky7fof'),
       ('clvdzrudd038hi8baroz9ie89', 'heavy', 8, 8, 'μg', 0, 'clvdzruc90387i8ba0wky7fof'),
       ('clvdzrudu038li8bafwp9yew1', 'threshold', 25, 25, 'mg', 0, 'clvdzrudk038ji8ba1h0y7a6h'),
       ('clvdzrue3038ni8bawsge7280', 'light', 25, 100, 'mg', 0, 'clvdzrudk038ji8ba1h0y7a6h'),
       ('clvdzrue9038pi8baz1w54aef', 'common', 100, 250, 'mg', 0, 'clvdzrudk038ji8ba1h0y7a6h'),
       ('clvdzrueg038ri8ba9wpn9uev', 'strong', 250, 300, 'mg', 0, 'clvdzrudk038ji8ba1h0y7a6h'),
       ('clvdzruem038ti8baeslk4qj9', 'heavy', 300, 300, 'mg', 0, 'clvdzrudk038ji8ba1h0y7a6h'),
       ('clvdzruf2038xi8ba48wsd2o3', 'threshold', 300, 300, 'mg', 0, 'clvdzrueu038vi8bak8qv1bpl'),
       ('clvdzruf9038zi8bar83ntvee', 'light', 500, 1000, 'mg', 0, 'clvdzrueu038vi8bak8qv1bpl'),
       ('clvdzrufh0391i8bah1amg1rb', 'common', 1000, 2000, 'mg', 0, 'clvdzrueu038vi8bak8qv1bpl'),
       ('clvdzrufo0393i8ba5806unui', 'strong', 2000, 3000, 'mg', 0, 'clvdzrueu038vi8bak8qv1bpl'),
       ('clvdzrufx0395i8basqoih2gr', 'heavy', 3000, 3000, 'mg', 0, 'clvdzrueu038vi8bak8qv1bpl'),
       ('clvdzruga0399i8ban8rnumtw', 'threshold', 1, 1, 'mg', 0, 'clvdzrug40397i8bav6oepoxy'),
       ('clvdzrugi039bi8ba33zhfl30', 'light', 4, 6, 'mg', 0, 'clvdzrug40397i8bav6oepoxy'),
       ('clvdzrugp039di8bax2woplos', 'common', 6, 8, 'mg', 0, 'clvdzrug40397i8bav6oepoxy'),
       ('clvdzrugv039fi8baoaq3x21n', 'strong', 8, 10, 'mg', 0, 'clvdzrug40397i8bav6oepoxy'),
       ('clvdzruh0039hi8bahaigx4lk', 'heavy', 10, 10, 'mg', 0, 'clvdzrug40397i8bav6oepoxy'),
       ('clvdzruhg039li8baorke5x4r', 'threshold', 5, 5, 'mg', 0, 'clvdzruh9039ji8bak9nnrdpb'),
       ('clvdzruhn039ni8baq5ffy4zv', 'light', 10, 20, 'mg', 0, 'clvdzruh9039ji8bak9nnrdpb'),
       ('clvdzruhu039pi8bajlg50wo2', 'common', 20, 30, 'mg', 0, 'clvdzruh9039ji8bak9nnrdpb'),
       ('clvdzrui2039ri8bao3oxgdj6', 'strong', 30, 50, 'mg', 0, 'clvdzruh9039ji8bak9nnrdpb'),
       ('clvdzrui8039ti8babyy08cgt', 'heavy', 50, 50, 'mg', 0, 'clvdzruh9039ji8bak9nnrdpb'),
       ('clvdzruim039xi8baqqg0zlss', 'threshold', 2, 2, 'mg', 0, 'clvdzruid039vi8bare17s0fh'),
       ('clvdzruiu039zi8ba98j1fe31', 'light', 3.5, 5, 'mg', 0, 'clvdzruid039vi8bare17s0fh'),
       ('clvdzruj003a1i8baewkaooa0', 'common', 5, 7.5, 'mg', 0, 'clvdzruid039vi8bare17s0fh'),
       ('clvdzruj803a3i8baqyoutc0b', 'strong', 7.5, 15, 'mg', 0, 'clvdzruid039vi8bare17s0fh'),
       ('clvdzrujh03a5i8basrpdgk8k', 'heavy', 15, 15, 'mg', 0, 'clvdzruid039vi8bare17s0fh'),
       ('clvdzrujy03a9i8baas6w3jyp', 'threshold', 5, 5, 'mg', 0, 'clvdzrujp03a7i8badoyocqhc'),
       ('clvdzruk803abi8bamhjvgvrs', 'light', 10, 25, 'mg', 0, 'clvdzrujp03a7i8badoyocqhc'),
       ('clvdzrukf03adi8baai825i86', 'common', 25, 40, 'mg', 0, 'clvdzrujp03a7i8badoyocqhc'),
       ('clvdzrukn03afi8baufst4nzk', 'strong', 40, 60, 'mg', 0, 'clvdzrujp03a7i8badoyocqhc'),
       ('clvdzrukw03ahi8bafpn7563z', 'heavy', 60, 60, 'mg', 0, 'clvdzrujp03a7i8badoyocqhc'),
       ('clvdzrula03ali8bazve6zfs3', 'threshold', 50, 50, 'mg', 0, 'clvdzrul203aji8batmuvpstg'),
       ('clvdzrulk03ani8basnlgdhdt', 'light', 60, 80, 'mg', 0, 'clvdzrul203aji8batmuvpstg'),
       ('clvdzruls03api8bar8rb2n60', 'common', 80, 100, 'mg', 0, 'clvdzrul203aji8batmuvpstg'),
       ('clvdzrulz03ari8ba89wd21ga', 'strong', 100, 150, 'mg', 0, 'clvdzrul203aji8batmuvpstg'),
       ('clvdzrum603ati8ba93fpk1ee', 'heavy', 150, 150, 'mg', 0, 'clvdzrul203aji8batmuvpstg');

insert into main.Effect (id, name, slug, category, type, tags, summary, description, parameters, see_also, effectindex,
                         psychonautwiki)
values ('clvdzrvgh00001vcv31bl24se', 'Abnormal heartbeat', 'abnormal-heartbeat', null, null, '',
        'An abnormal heartbeat is any of a group of conditions in which the electrical activity of the heart is irregular. During this state, the heartbeat may be too fast (over 100 beats per minute) or too slow (less than 60 beats per minute) and may be regular or irregular. An abnormal heartbeat is most commonly induced under the influence of moderate dosages of stimulant and depressant compounds, such as cocaine, methamphetamine, and GABAergics.', 'An abnormal heartbeat (also called an arrhythmia or dysrhythmia) is any of a group of conditions in which the electrical activity of the heart is irregular. During this state, the heartbeat may be too fast (over 100 beats per minute) or too slow (less than 60 beats per minute) and may be regular or irregular. A heartbeat that is too fast is called tachycardia and a heartbeat that is too slow is called bradycardia. Although many arrhythmias are not life-threatening, it is worth noting that some can cause cardiac arrest in extreme cases.

An abnormal heartbeat is most commonly induced under the influence of moderate dosages of stimulant and depressant compounds, such as cocaine, methamphetamine, and GABAergics. While stimulants tend to increase a person''s heart rate, depressants tend to decrease it. Combining the two can often result in dangerously irregular heartbeats. However, this effect can also occur under the influence of deliriants.',
        '', '', 'https://www.effectindex.com/effects/abnormal-heartbeat',
        'https://psychonautwiki.org/wiki/Abnormal_heartbeat'),
       ('clvdzrvgp00011vcv411dn1v6', 'Addiction suppression', 'addiction-suppression', null, null, '',
        'Addiction suppression can be described as the experience of a total or partial suppression of a psychological addiction to a specific substance and the cravings associated with it. It is a rare effect that is most commonly associated with psychedelics, psilocin, LSD, ibogaine, and N-acetylcysteine (NAC).', 'Addiction suppression is the experience of a total or partial suppression of a psychological addiction to a specific substance and the cravings associated with it. This can occur as an effect which lasts long after the compound which induced it wears off or it can last only while the compound is still active.

Addiction suppression is a rare effect that is most commonly associated with psychedelics

[1]

, psilocin

[2]

, LSD

[3]

, ibogaine

[4]

, and N-acetylcysteine (NAC)

[5]', '', '', 'https://www.effectindex.com/effects/addiction-suppression',
        'https://psychonautwiki.org/wiki/Addiction_suppression'),
       ('clvdzrvgv00021vcveefu8dhv', 'After images', 'after-images', null, null, '',
        'After images (also known as palinopsia) are visual perceptions that continue to appear in one''s vision after exposure to the original image has ceased. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'After images (also known as palinopsia) are visual perceptions that continue to appear in one''s vision after exposure to the original image has ceased.

[1]

[2]

[3]

A common form of after image is the bright glow that seems to float in one''s vision after looking into a light source for a few seconds. This effect is similar to tracers but differs in that it does not create smooth blurs behind moving objects.

During hallucinogenic experiences, moving objects can produce a trail of overlayed, still images behind their path of motion.

[3]

[4]

[5]

[6]

[7]

[8]

This creates a series of overlayed images of a moving object across one''s visual field that progressively fade away. Another common manifestation of this effect is being able to see a residual image of the external environment for several seconds after one closes their eyes before it gradually fades away.

After images are often accompanied by other coinciding effects, such as tracers

[5]

[9]

[10]

and drifting.

[4]

They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.

[11]

However, trailing effects have also been experienced with other drugs of a very different pharmacology, such as GABA potentiators.

[7]', '', '', 'https://www.effectindex.com/effects/after-images', 'https://psychonautwiki.org/wiki/After_images'),
       ('clvdzrvh100031vcvyzi9sj9o', 'Amnesia', 'amnesia', null, null, '',
        'Amnesia is a global impairment in the ability to acquire new memories regardless of sensory modality, and a loss of some memories, especially recent ones, from the period before amnesia began.  It is most commonly induced under the influence of heavy dosages of GABAergic depressants, such as alcohol, benzodiazepines, GHB, and zolpidem.', 'Amnesia is a global impairment in the ability to acquire new memories regardless of sensory modality, and a loss of some memories, especially recent ones, from the period before amnesia began.

[1]

During states of amnesia a person will usually retain functional perceptual abilities and short-term memory which can still be used to recall events that recently occurred; this effect is distinct from the memory impairment produced by sedation.

[2]

As such, a person experiencing amnesia may not obviously appear to be doing so, as they can often carry on normal conversations and perform complex tasks.

This state of mind is commonly referred to as a "blackout", an experience that can be divided into 2 formal categories: "fragmentary" blackouts and "en bloc" blackouts

[3]

. Fragmentary blackouts, sometimes known as "brownouts", are characterized by having the ability to recall specific events from an intoxicated period but remaining unaware that certain memories are missing until reminded of the existence of those gaps in memory. Studies suggest that fragmentary blackouts are far more common than "en bloc" blackouts.

[4]

In comparison, En bloc blackouts are characterized by a complete inability to later recall any memories from an intoxicated period, even when prompted. It is usually difficult to determine the point at which this type of blackout has ended as sleep typically occurs before this happens.

[5]

Amnesia is often accompanied by other coinciding effects such as disinhibition, sedation, and memory suppression. It is most commonly induced under the influence of heavy dosages of GABAergic depressants, such as alcohol

[6]

, benzodiazepines

[7]

, GHB

[8]

, and zolpidem

[9]

. However, it can also occur to a much lesser extent under the influence of extremely heavy dosages of hallucinogenic compounds such as psychedelics, dissociatives, Salvia divinorum, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/amnesia', 'https://psychonautwiki.org/wiki/Amnesia'),
       ('clvdzrvh800041vcvau0yq8t1', 'Analysis enhancement', 'analysis-enhancement', null, null, '',
        'Analysis enhancement is a perceived improvement of a person''s overall ability to logically process information or creatively analyze concepts, ideas, and scenarios.  It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, nicotine, and caffeine.', 'Analysis enhancement is a perceived improvement of a person''s overall ability to logically process information

[1]

[2]

[3]

or creatively analyze concepts, ideas, and scenarios. This effect can lead to a deep state of contemplation, which often results in an abundance of new and insightful ideas. It can give the person a perceived ability to better analyze concepts and problems, allowing them to reach new conclusions, perspectives, and solutions that would have been otherwise difficult to conceive.

Although this effect will often result in deep states of introspection, in other cases it can produce states that are not introspective but instead result in a deep analysis of the exterior world, both taken as a whole and as the things comprising it. This can result in a perceived abundance of insightful ideas and conclusions with powerful themes pertaining to what is often described as "the bigger picture". These ideas generally involve (but are not limited to) insights into philosophy, science, spirituality, society, culture, universal progress, humanity, loved ones, the finite nature of our lives, history, the present moment, and future possibilities.

Analysis enhancement is often accompanied by other coinciding effects, such as stimulation, personal bias suppression, conceptual thinking, and thought connectivity. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, nicotine, and caffeine.

[1]

[3]

However, it can also occur in a more powerful although less consistent form under the influence of psychedelics, such as certain LSD, psilocybin, and mescaline.

[5]', '', '', 'https://www.effectindex.com/effects/analysis-enhancement',
        'https://psychonautwiki.org/wiki/Analysis_enhancement'),
       ('clvdzrvhe00051vcvwx1yiyv5', 'Analysis suppression', 'analysis-suppression', null, null, '',
        'Analysis suppression is a distinct decrease in a person''s overall ability to process information and logically or creatively analyze concepts, ideas, and scenarios. It is most commonly induced under the influence of heavy dosages of antipsychotic compounds, and is associated with long term use of such drugs like quetiapine, haloperidol, and risperidone.',
        'This effect seems to be mentioned within the following trip reports:', '', '',
        'https://www.effectindex.com/effects/analysis-suppression', null),
       ('clvdzrvhj00061vcvwn0nzl98', 'Anticipatory response', 'anticipatory-response', null, null, '',
        'An anticipatory response is the experience of a wide range of potential cognitive and physical effects that can occur immediately before the administration of a substance that the user is experienced with or addicted to.', 'An anticipatory response is the experience of a wide range of potential cognitive and physical effects that can occur immediately before the administration of a substance that the user is experienced with or addicted to. For example, benzodiazepine addicts will often find that their anxiety and nervousness is significantly reduced during the minutes preceding its ingestion, and many users who are addicted to intravenous heroin report that their body begins to subjectively slow down and relax in the moments prior to its injection. These changes typically feel as if they are a combination of both standard emotional responses to the current situation and more deeply rooted physiological changes that seem to arise from a form of unintentional Pavlovian conditioning.

Anticipatory response is most commonly induced under the influence of any substance that is sporadically or regularly taken over a long period of time, particularly when these substances become both familiar and addictive to their user.',
        '', '', 'https://www.effectindex.com/effects/anticipatory-response', null),
       ('clvdzrvho00071vcvcckfw2ez', 'Anxiety', 'anxiety', null, null, '',
        'Anxiety is medically recognized as the experience of negative feelings of apprehension, worry, and general unease. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as cannabinoids, psychedelics, dissociatives, and deliriants', 'Anxiety is medically recognized as the experience of negative feelings of apprehension, worry, and general unease.

[1]

These feelings can range from subtle and ignorable to intense and overwhelming enough to trigger panic attacks or feelings of impending doom. Anxiety is often accompanied by nervous behaviour, such as restlessness, difficulty concentrating, irritability, and muscular tension.

[2]

Fear is the emotional response to a real or perceived imminent threat, whereas anxiety is the anticipation of a future threat. These two states often overlap, but they also differ in that fear is more often associated with surges of autonomic arousal necessary for fight or flight, thoughts of immediate danger, and escape behaviours, while anxiety is more often associated with muscle tension and vigilance in preparation for future danger and cautious or avoidant behaviours.

[2]

[3]

This focus of anticipated danger may be internally or externally derived.

[1]

Psychoactive substance-induced anxiety can be caused as an inescapable effect of the drug itself,

[2]

by a lack of experience with the substance or its intensity, as an enhancement of a pre-existing state of mind, or by the experience of negative hallucinations.

Anxiety is often accompanied by other coinciding effects, such as depression and irritability. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as cannabinoids

[4]

, psychedelics

[5]

, dissociatives, and deliriants

[6]

. However, it can also occur during the withdrawal symptoms of GABAergic depressants

[7]

and during stimulant comedowns

[8]', '', '', 'https://www.effectindex.com/effects/anxiety', 'https://psychonautwiki.org/wiki/Anxiety'),
       ('clvdzrvht00081vcv3auepdqg', 'Anxiety suppression', 'anxiety-suppression', null, null, '',
        'Anxiety suppression (also known as anxiolysis or minimal sedation) is medically recognized as a partial to complete suppression of a person’s ability to feel anxiety, general unease, and negative feelings of both psychological and physiological tension. It is most commonly induced under the influence of moderate dosages of anxiolytic compounds which primarily include GABAergic depressants, such as benzodiazepines, alcohol, GHB, and gabapentinoids.', 'Schmidt-Mutter, C., Pain, L., Sandner, G., Gobaille, S., & Maitre, M. (1998). The anxiolytic effect of γ-hydroxybutyrate in the elevated plus maze is reversed by the benzodiazepine receptor antagonist, flumazenil. European journal of pharmacology, 342(1), 21-27.

https://doi.org/10.1016/S0014-2999(97)01503-3', '', '', 'https://www.effectindex.com/effects/anxiety-suppression',
        'https://psychonautwiki.org/wiki/Anxiety_suppression'),
       ('clvdzrvhy00091vcva7cb9i22', 'Appetite enhancement', 'appetite-enhancement', null, null, '',
        'Appetite enhancement (also known as "the munchies") can be described as the experience of a distinct increase in a person''s sense of hunger and appetite.  It is most commonly induced under the influence of moderate dosages of orexigenic compounds, such as cannabinoids, mirtazapine, and quetiapine.', 'Appetite enhancement (also known as "the munchies"

[1]

) can be described as the experience of a distinct increase in a person''s sense of hunger and appetite. This results in both an increased desire to eat food and an increased enjoyment of its taste.

Appetite enhancement is most commonly induced under the influence of moderate dosages of orexigenic compounds, such as cannabinoids,

[2]

mirtazapine,

[3]

and quetiapine

[4]

. However, it may also occur under the influence of other compounds such as GABAergic depressants, tricyclic antidepressants (TCAs), tetracyclic antidepressants, first-generation antihistamines, most antipsychotics, and many steroid hormones.',
        '', '', 'https://www.effectindex.com/effects/appetite-enhancement', null),
       ('clvdzrvi3000a1vcvjc8wfmsw', 'Appetite suppression', 'appetite-suppression', null, null, '',
        'Appetite suppression can be described as the experience of a distinct decrease in a person''s sense of hunger and appetite in a manner which can result in both a lesser desire to eat food and a decreased enjoyment of its taste. It is most commonly induced under the influence of moderate dosages of stimulant compounds, such as amphetamine, methylphenidate, nicotine, MDMA, and cocaine.', 'Appetite suppression can be described as the experience of a distinct decrease in a person''s sense of hunger and appetite in a manner which can result in both a lesser desire to eat food and a decreased enjoyment of its taste.

[1]

[2]

This typically results in the person undergoing prolonged periods of time without eating food.

Depending on the intensity, this effect can result in a sense of complete disinterest or even disgust concerning food. At times, it can often result in physical discomfort (such as Nausea) when attempting to eat food. In cases of severe appetite suppression, it is often easier for a person to consume liquid food, such as protein shakes, in order to receive the nutrition needed to function.

Appetite suppression is often accompanied by other coinciding effects such as stimulation or pain relief in a manner which can lead to feeling as if one either has enough energy to not need food or has enough anaesthesia to not feel the pain of hunger. It is most commonly induced under the influence of moderate dosages of stimulant

[3]

compounds, such as amphetamine

[4]

, methylphenidate,

[5]

nicotine,

[6]

MDMA,

[7]

and cocaine. However, it may also occur under the influence of other compounds such as opioids, psychedelics, dissociatives, and selective serotonin reuptake inhibitors (SSRIs). It is worth noting that if these substances are used for prolonged periods of time, weight loss often occurs as a result.',
        '', '', 'https://www.effectindex.com/effects/appetite-suppression',
        'https://psychonautwiki.org/wiki/Appetite_suppression'),
       ('clvdzrvi9000b1vcv1jd2wzo8', 'Auditory distortion', 'auditory-distortion', null, null, '',
        'An auditory distortion is the experience of perceived alterations in how audible noises present and structure themselves. They are most commonly induced under the influence of hallucinogenic compounds.', 'An auditory distortion is the experience of perceived alterations in how audible noises present and structure themselves.

[1]

[2]

[3]

[4]

These distortions can manifest in many styles, but commonly take the form of echoes or murmurs arise from sounds and are accompanied by fluctuating changes in speed and pitch.

[4]

[5]

[6]

This can intensify to the point where sounds are consistently followed by continuous reverberation,

[7]

often rendering the original sound completely unrecognizable. However, it often quickly resets to base level and starts over if the source of noise is stopped or changed.

The experience of this effect can be broken down into three distinct levels of intensity. These are described and documented below:

- At the lowest level of intensity, auditory distortions consist of subtle and spontaneous reverberations, echoes, and changes in the pitch of noises within the external environment. They are fleeting, low in intensity, and easy to ignore.

- At this level, auditory distortions consist of more noticeable and spontaneous echo effects alongside changes in pitch attributed to noises within the external environment. They are longer, more drawn out and loud enough that they become increasingly difficult to ignore.

- At the highest level, auditory distortions become constant and impossible to ignore. The complexity of the resulting alterations quickly renders the original sound as unintelligible.

Auditory distortions are often accompanied by other coinciding effects, such as auditory hallucinations,

[6]

[8]

[1]

auditory suppression, and auditory enhancement.

[2]

[4]

They are most commonly induced under the influence of moderate dosages of psychedelic compounds,

[10]

[11]

[12]

such as LSD, 5-MeO-DiPT, and DMT. However, they can also occur less commonly under the influence of dissociatives, such as ketamine,

[13]

[14]

PCP, and nitrous.

[4]

[5]', '', '', 'https://www.effectindex.com/effects/auditory-distortion',
        'https://psychonautwiki.org/wiki/Auditory_distortion'),
       ('clvdzrvig000c1vcv2yrwki6e', 'Auditory enhancement', 'auditory-enhancement', null, null, '',
        'An auditory enhancement is the experience of an increase or improvement of the acuteness and clarity of sound. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'An auditory enhancement is an increase or improvement in the detail and clarity of sound.

[1]

This can result in the person becoming extremely aware of all the sounds around them with an enhanced ability to comprehend multiple layers of sound and better identify their direction and location.

The most common manifestation of this effect is a greatly enhanced appreciation of music. This can allow people to experience music in a level of detail that is unparalleled during everyday sober living.

Auditory enhancements are often accompanied by other coinciding effects, such as auditory distortion and auditory hallucinations

[1]

. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, they can also occur less commonly under the influence of stimulants, cannabinoids, and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/auditory-enhancement', null),
       ('clvdzrvin000d1vcvndu5n6gz', 'Auditory hallucination', 'auditory-hallucination', null, null, '',
        'An auditory hallucination is the experience of hearing spontaneous and imaginary noises. They are most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, deliriants, and dissociatives.', 'An auditory hallucination is the experience of hearing spontaneous and imaginary noises.

[1]

[2]

[3]

The most common examples of this include hearing clips of sound such as imagined music,

[1]

[4]

voices,

[1]

[5]

[6]

[7]

[8]

[9]

[10]

tones,

[1]

popping,

[1]

[11]

and scraping,

[11]

but can also be an infinite variety of other potential noises that are stored within one''s memory.

In terms of their behaviour, these sounds will often be based on noises that were expected to occur or have been genuinely heard on a frequent basis within the external environment. For example, a person may repeatedly hear a knock at the door when they are expecting a visitor or hear music they were listening to earlier on in the day. However, at other times, auditory hallucinations may also present themselves as completely new or unusual sounds unlike anything that could currently occur within the external environment.

Auditory hallucinations are often accompanied by other coinciding effects, such as auditory distortion

[8]

[9]

[10]

and auditory enhancement

[1]

[7]

. They are most commonly induced under the influence of moderate dosages of hallucinogenic compounds

[12]

, such as psychedelics, deliriants, and dissociatives. However, they can also occur less commonly under the influence of stimulant psychosis, cannabinoids, and during sleep deprivation.

[13]

[14]

This effect can be broken into two specific subtypes, which are described and documented below:

An internal auditory hallucination is the perception of hallucinated audio that sounds as if the specific location of its source does not have a particular sense of distance or direction attributed to it; instead, the sound originates from within a person''s own head. This is in contrast to external auditory hallucinations, which sound as if they are occurring seamlessly within the external environment as if they were physically present.',
        '', '', 'https://www.effectindex.com/effects/auditory-hallucination',
        'https://psychonautwiki.org/wiki/Auditory_hallucination'),
       ('clvdzrvis000e1vcvi8ipzdgl', 'Auditory misinterpretation', 'auditory-misinterpretation', null, null, '',
        'Auditory misinterpretation is the fleeting experience of a sound or noise being mistaken as something else. It is most commonly induced under the influence of moderate dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'Auditory misinterpretation is a fleeting experience in which an external sound or noise is mistaken for another notably distinct sound or noise. The type of faulty perception experienced during this state can vary. For example, one may interpret noises as intricate voices, elaborately detailed music, or other (unrelated) everyday sounds.

Experiences of auditory misinterpretation are typically sudden and brief in duration. As a result, it is common for people to internally reflect upon the event after recognizing the unusual nature of what they heard and quickly recognize that misinterpretation has taken place. In such a situation, once the sound has been consciously identified as being initially misinterpreted, the effect immediately ceases, sometimes happening quickly enough for the sound to be correctly resolved while it is being heard.

It is worth noting that while auditory misinterpretation often arises as an isolated effect component, it can also arise as the result of the combination of other coinciding effects, such as auditory hallucinations, auditory distortions, delirium, and confusion. It is most commonly induced under the influence of moderate dosages of deliriant compounds, such as DPH, datura, and benzydamine. However, it can also occur under the influence of other hallucinogens, such as psychedelics, dissociatives and heavy or paranoid cannabis experiences.',
        '', '', 'https://www.effectindex.com/effects/auditory-misinterpretation', null),
       ('clvdzrvix000f1vcv4myuveu2', 'Auditory suppression', 'auditory-suppression', null, null, '',
        'Auditory suppression is the experience of sound becoming perceived as more distant, quiet, and muffled than they actually are.  It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Auditory suppression is the experience of sound becoming perceived as more distant, quiet, and muffled than they actually are. This effect can significantly decrease both the volume of a noise, as well as its perceived quality. It is usually described as making it difficult to comprehend or fully pay attention to music and other sounds.

Auditory suppression is often accompanied by other coinciding effects, such as auditory distortions and auditory hallucinations. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur less commonly under the influence of GABAergic depressants and antipsychotics such as alcohol and quetiapine.',
        '', '', 'https://www.effectindex.com/effects/auditory-suppression', null),
       ('clvdzrvj2000g1vcvnrvhwxtk', 'Autonomous entity', 'autonomous-entity', null, null, '',
        'An autonomous entity is the experience of perceived contact with beings that appear to be sentient in their behaviour. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds.', 'An autonomous entity is the experience of perceived contact with hallucinated beings that appear to be sentient and autonomous in their behaviour.

[1]

[2]

[3]

[4]

[5]

[6]

[7]

[8]

[9]

These entities can manifest within both external and internal hallucinations.

[8]

Autonomous entities will frequently act as the inhabitants of a perceived independent reality.

[7]

They most commonly appear alone but can also often be within small or large groups alongside of other entities. While some entities do not seem to be aware of a person''s presence, others are often precognizant of a person''s appearance into their realm and usually choose to interact with them in various ways. For example, they will often display behaviours such as showing a person around the realm that they inhabit, presenting them with objects, holding spontaneous celebrations of their arrival, engaging them in conversation, merging into and out of the person''s body or consciousness, and attempting to impart knowledge of various kinds.

Entities can take any form, but certain archetypes are present and commonly include:

Humans,

[4]

[9]

shadow people, bodiless super intelligent humanoids, aliens,

[4]

[9]

elves,

[4]

animals,

[4]

[9]

giant spheres, insectoids,

[4]

[9]

beings of light, anthropomorphic beings,

[4]

[9]

plants,

[4]

[9]

conscious inanimate objects, fictional characters, cartoons, robotic machines, gods,

[4]

demigods, goddesses, bio-mechanical intelligences, hooded figures, demons, indescribable monstrosities, spirits,

[4]

angels,

[4]

shamans, ghosts, souls, ancestors, fantastical or mythological beasts, glitch creatures, and more.

The appearance, personality, and behaviour of an autonomous entity often correlates with the psychological state of the person experiencing it. For example, a person with a positive mindset will more commonly experience loving, kind, and healing entities. In contrast, a person with a negative mindset may experience hateful, sinister, and mocking entities.

In terms of their overall visibility and clarity, this effect is capable of manifesting itself across the 3 different levels of intensity described below:

The experience of seeing autonomous entities is also often accompanied by other coinciding effects such as geometry,

[5]

internal hallucinations, and delusions. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, it can also occur under the influence of stimulant psychosis, with extreme sleep deprivation, or during dreams.

Autonomous entities can communicate with a person via a combination of spoken word, “telepathy”, conceptual thoughts, choreographed movements, mathematics, and geometry-based visual linguistics that generally consist of morphing coloured structures of different textures that are innately understandable as representations of specific concepts. They will often convey insights regarding overcoming personal issues within a person’s life and will occasionally help clarify philosophical or spiritual ideas. However, more often than not, entities are very likely to speak in a cryptic or nonsensical manner that seems to have no clear meaning behind it.

It is important to note that autonomous entities can never convey novel information to the person experiencing them. For example, they cannot provide insights about the external world that a person did not already know on some level. Instead, they can only provide alternative perspectives and help build upon existing ideas. This is presumably because autonomous entities do not have access to any knowledge not already contained within one''s conscious or subconscious memories.

When communicated with through spoken word, the level of coherency in which these entities can communicate with is highly variable but can be broken down into five distinct levels. These are described and listed below:

Autonomous entities will often embody at least one of a few approximate personality types. Although there is considerable overlap between them, these personality types can typically be identified primarily through their behaviour, their appearance, and an innate sense of their character that is often felt during the interaction.

The individual types are broken down and described within the four separate categories listed below:

This personality type can be described as a seemingly sentient representation of any hallucinatory character that the brain has either spontaneously generated during the trip or was already aware of at a prior time. These entities can include newly hallucinated characters of any sort, people that the person has met in real life, people that the person is aware of as existing in the real world, or characters from fictional media. These entities will usually adopt an appropriate personality and set of mannerisms to fit the chosen concept with an impressive degree of detail. An example of this might be meeting an insectoid mantis like creature that is playing the role of a shamanic teacher and acting accordingly. Another might include meeting the hallucination of a deceased loved one or a currently living family friend.

This personality type can be described as a seemingly sentient representation of any known concept or idea. These specific concepts could include personified representations of abstract ideas, events, and emotions. An example of this might be meeting a mocking jester that feels and acts as if it represents one''s own insecurities. Another might include meeting a group of hooded figures that feel as if they represent the very concept of organized religion itself.

This personality type can be described as an entity that may take any visible form, but is also subjectively perceived to be an autonomous controller behind the continuous generation of the details of the person’s current hallucinations. They may also be felt to simultaneously control or manage one’s current perspective, personality, and internally stored model of reality. When interacted with, this category of entity can often possess abilities that allow them to directly alter and manipulate one’s current experiences. They commonly want to teach or guide the person and will operate under the assumption that they know what is best for them. However, although a relatively common experience, it still cannot be known whether this type of autonomous entity is genuinely a representation of the "subconscious" or is merely an approximation that behaves in a convincing manner.

This personality type can be described as a direct copy of one’s own personality. It can take any visible form, but when conversed with, it clearly adopts an identical vocabulary and set of mannerisms to one’s own consciousness. This entity will often take on a similar appearance to oneself, but could theoretically take on any other appearance too. During this experience, there is also a distinct feeling that one''s own consciousness is somehow being mirrored and duplicated into the hallucinated autonomous entity that is being interacted with.',
        '', '', 'https://www.effectindex.com/effects/autonomous-entity',
        'https://psychonautwiki.org/wiki/Autonomous_entity'),
       ('clvdzrvj9000h1vcv2hv0svtp', 'Autonomous voice communication', 'autonomous-voice-communication', null, null, '',
        'Autonomous voice communication is the experience of being able to hear and converse with a disembodied and audible voice of unknown origin which seemingly resides within one''s own head. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds such as psychedelics, dissociatives, and deliriants.', 'Autonomous voice communication (also known as auditory verbal hallucinations (AVHs))

[1]

is the experience of being able to hear and converse with a disembodied and audible voice of unknown origin which seemingly resides within one''s own head.

[2]

[3]

[4]

[5]

This voice is often capable of high levels of complex and detailed speech which are typically on par with the intelligence and vocabulary of ones own conversational abilities.

As a whole, the effect itself can be broken down into 5 distinct levels of progressive intensity, each of which are described below:

The speaker behind this voice is commonly interpreted by those who it to be the voice of their own subconscious, the psychoactive substance itself, a specific autonomous entity, or even supernatural concepts such as god, spirits, souls, and ancestors.

At higher levels, the conversational style of that which is discussed between both the voice and its host can be described as essentially identical in terms of its coherency and linguistic intelligibility as that of any other everyday interaction between the self and another human being of any age with which one might engage in conversation with. Higher levels may also manifest itself in multiple voices or even an ambiguous collection of voices such as a crowd.

[3]

However, there are some subtle but identifiable differences between this experience and that of normal everyday conversations. These stem from the fact that one''s specific set of knowledge, memories and experiences are identical to that of the voice which is being communicated with.

[3]

[5]

This results in conversations in which both participants often share an identical vocabulary down to the very use of their colloquial slang and subtle mannerisms. As a result of this, no matter how in-depth and detailed the discussion becomes, no entirely new information is ever exchanged between the two communicators. Instead, the discussion focuses primarily on building upon old ideas and discussing new opinions or perspectives regarding the previously established content of one''s life.

Autonomous voice communication is often accompanied by other coinciding effects such as delusions, autonomous entities, auditory hallucinations, and psychosis in a manner which can sometimes lead the person into believing the voices'' statements unquestionably in a delusional manner. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds such as psychedelics, dissociatives, and deliriants. However, it may also occur during the offset of prolonged stimulant binges and less consistently under the influence of heavy dosages of cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/autonomous-voice-communication',
        'https://psychonautwiki.org/wiki/Autonomous_voice_communication'),
       ('clvdzrvjg000i1vcvh0dgvm5d', 'Back pain', 'back-pain', null, null, '',
        'Back pain can be described as feelings of aches and pain located throughout a person''s back. It is most commonly induced under the influence of heavy dosages of stimulating psychedelics compounds, such as LSD, 2C-B, and mescaline.', 'Back pain can be described as feelings of aches and pain located throughout a person''s back. It may occur as neck pain (cervical), middle back pain (thoracic), lower back pain (lumbar), or coccydynia (tailbone or sacral pain). However, the lumbar region is the most common area for pain, as it supports most of the weight in the upper body. The pain itself can range from mild and ignorable to intense and distinctly uncomfortable.

Within the context of psychoactive substances, this effect can occur through tactile enhancement which increases the symptoms of a pre-existing condition which is usually otherwise not noticeable, as a result of muscle tension, as a result of kidney problems, and also as a symptom of withdrawal symptoms from substances which are used for pain relief such as opioids.

Back pain is most commonly induced under the influence of heavy dosages of stimulating psychedelics compounds, such as LSD, 2C-B, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/back-pain', null),
       ('clvdzrvjm000j1vcvx11bsnyb', 'Bodily control enhancement', 'bodily-control-enhancement', null, null, '',
        'Bodily control enhancement can be described as feeling as if there has been a distinct increase in a person''s ability to control their physical body with precision, balance, coordination, and dexterity. It is most commonly induced under the influence of moderate dosages of stimulating psychedelics, such as LSD, 2C-B, and DOC.', 'Bodily control enhancement can be described as feeling as if there has been a distinct increase in a person''s ability to control their physical body with precision, balance, coordination, and dexterity. This results in the feeling that they can accurately control a much greater variety of muscles across their body with the tiniest of subtle mental triggers.

The experience of this effect is often subjectively interpreted by people as a profound and primal feeling of being put back in touch with the animal body.

Bodily control enhancement is most commonly induced under the influence of moderate dosages of stimulating psychedelics, such as LSD, 2C-B, and DOC. However, it may also occur to a lesser extent under the influence of other compounds such as traditional stimulants and light dosages of stimulating dissociatives.',
        '', '', 'https://www.effectindex.com/effects/bodily-control-enhancement',
        'https://psychonautwiki.org/wiki/Bodily_control_enhancement'),
       ('clvdzrvjs000k1vcveuppvk83', 'Bodily pressures', 'bodily-pressures', null, null, '',
        'Bodily pressures can be described as the physical experience of spontaneous pressures across different parts of the body. They are most commonly induced under the influence of heavy dosages of stimulating psychedelics, such as 2C-E, DPT, and 5-MeO-DMT.', 'Bodily pressures can be described as the physical experience of spontaneous pressures across different parts of the body. These can occur as static and fixed in their location or they can occur at seemingly random varying points across the body. Depending on the intensity of the sensation, this can result in pressures which range from neutral to extremely uncomfortable in their experience.

Bodily pressures are most commonly induced under the influence of heavy dosages of stimulating psychedelics, such as 2C-E, DPT, and 5-MeO-DMT.',
        '', '', 'https://www.effectindex.com/effects/bodily-pressures',
        'https://psychonautwiki.org/wiki/Bodily_pressures'),
       ('clvdzrvjx000l1vcvhu4csdez', 'Body odour alteration', 'body-odour-alteration', null, null, '',
        'Body odour alteration can be described as a distinct change in the body''s natural odour that can occur in response to the ingestion of a psychoactive substance, nootropic, or medicine. It is most commonly induced under the influence of heavy dosages of stimulant compounds, such as methamphetamine and mephedrone which are often said to result in an ammonia-like odour.', 'Body odour alteration can be described as a distinct change in the body''s natural odour that can occur in response to the ingestion of a psychoactive substance, nootropic, or medicine. Depending on the biochemical makeup of the substance the alterations in body odour can vary significantly.

Body odour alteration is often accompanied by other coinciding effects such as increased perspiration and temperature regulation suppression. It is most commonly induced under the influence of heavy dosages of stimulant compounds, such as methamphetamine and mephedrone which are often said to result in an ammonia-like odour.',
        '', '', 'https://www.effectindex.com/effects/body-odour-alteration', null),
       ('clvdzrvk2000m1vcvuste7ass', 'Brain zaps', 'brain-zaps', null, null, '',
        'Brain zaps can be described as sharp electrical shock sensations which originate within the head or brain and sometimes extend throughout the body. They are most commonly induced under the influence of withdrawal, dose reduction, and discontinuation of antidepressant drugs, including selective serotonin reuptake inhibitors (SSRIs) or serotonin-norepinephrine reuptake inhibitors (SNRIs) such as sertraline, paroxetine, and venlafaxine.', 'Brain zaps can be described as sharp electrical shock sensations which originate within the head or brain and sometimes extend throughout the body.

[1]

For many people, it feels as though their brain has experienced a sudden series of brief vibrations or jolts of electricity that can cause intense discomfort, disorientation, and distress.

[2]

Brain zaps are most commonly induced under the influence of withdrawal, dose reduction, and discontinuation of antidepressant drugs, including selective serotonin reuptake inhibitors (SSRIs) or serotonin-norepinephrine reuptake inhibitors (SNRIs) such as sertraline, paroxetine, and venlafaxine. Tramadol, an opioid painkiller with SNRI properties, has also been reported to cause brain zaps upon abrupt discontinuation.

[3]

[4]

If caused by antidepressant withdrawal, it is strongly recommended that one taper or reduce their dose gradually instead of stopping abruptly. This effect has been reported by anecdotal sources to occur in the days after a heavy dosage of MDMA.

[5]

Fish oil has been reported to provide temporary relief from this affliction, although scientific literature supporting this claim is sparse.',
        '', '', 'https://www.effectindex.com/effects/brain-zaps', 'https://psychonautwiki.org/wiki/Brain_zaps'),
       ('clvdzrvk9000n1vcv930g7sr8', 'Brightness alteration', 'brightness-alteration', null, null, '',
        'Brightness alteration is a distortion or change in the intensity of perceived brightness comprising a person''s vision.  It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.', 'This effect seems to be mentioned within the following trip reports:

My skin didn''t look like this before', '', '', 'https://www.effectindex.com/effects/brightness-alteration',
        'https://psychonautwiki.org/wiki/Brightness_alteration'),
       ('clvdzrvkh000o1vcvicdnbm1s', 'Bronchodilation', 'bronchodilation', null, null, '',
        'Bronchodilation can be described as the expansion of the bronchial air passages in the respiratory tract. A bronchodilator is a substance that dilates the bronchial tubes resulting in decreased resistance in the respiratory airway and increased airflow to the lungs.', 'Bronchodilation can be described as the expansion of the bronchial air passages in the respiratory tract. A bronchodilator is a substance that dilates the bronchial tubes resulting in decreased resistance in the respiratory airway and increased airflow to the lungs. From a subjective standpoint, this effect makes it feel as if has become significantly easier and more comfortable to breathe.

Bronchodilation is often accompanied by other coinciding effects such as stimulation. It is most commonly induced under the influence of moderate dosages of stimulant compounds, such as amphetamine,

[1]

methamphetamine, and cocaine,

[2]

. These compounds were historically used often for treating asthma but are now rarely if ever, used medically for their bronchodilation effect.',
        '', '', 'https://www.effectindex.com/effects/bronchodilation',
        'https://psychonautwiki.org/wiki/Bronchodilation'),
       ('clvdzrvkp000p1vcvohlv3091', 'Catharsis', 'catharsis', null, null, '',
        'Catharsis is a psychological state defined as an extremely therapeutic, healing, and intense release of repressed emotions in which many people describe reliving traumatic events, crying, witnessing painful memories, having enhanced mental imagery, and reliving past experiences. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Wolfson, P. E. (2014). Psychedelic experiential pharmacology: pioneering clinical explorations with Salvador Roquet (How i came to all of this: ketamine, admixtures and adjuvants, Don Juan and Carlos Castaneda too): an interview with Richard Yensen. International Journal of Transpersonal Studies, 33(2), 11.

http://dx.doi.org/10.24972/ijts.2014.33.2.160', '', '', 'https://www.effectindex.com/effects/catharsis',
        'https://psychonautwiki.org/wiki/Catharsis'),
       ('clvdzrvkw000q1vcv6m2j4aph', 'Changes in felt bodily form', 'changes-in-felt-bodily-form', null, null, '',
        'Changes in felt bodily form can be described as feelings of the body shifting in its perceived physical shape, organization and form in a manner which is typically devoid of accompanying visual alterations. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and Salvinorin A.', 'Changes in felt bodily form can be described as feelings of the body shifting in its perceived physical shape, organization and form in a manner which is typically devoid of accompanying visual alterations. For example, feelings of the body folding into itself many times over, stretching, gaining additional limbs or body parts, splitting into separate parts, expanding, or condensing into, over, and across itself in extremely complex forms are all entirely possible. It is worth noting that although this effect is usually perfectly comfortable to undergo, it can sometimes be somewhat uncomfortable under certain circumstances.

Changes in felt bodily form are often accompanied by other coinciding effects such as perspective hallucinations, perspective distortions, and changes in felt gravity. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and Salvinorin A.',
        '', '', 'https://www.effectindex.com/effects/changes-in-felt-bodily-form',
        'https://psychonautwiki.org/wiki/Changes_in_felt_bodily_form'),
       ('clvdzrvl4000r1vcvvx8v6pai', 'Changes in felt gravity', 'changes-in-felt-gravity', null, null, '',
        'Changes in felt gravity can be described as feeling that the pull of gravity has shifted in its direction. For example, during this state one may feel as if they are floating forwards, backwards, upwards, downwards, or in an unspecifiable direction.', 'Changes in felt gravity can be described as feeling that the pull of gravity has shifted in its direction, orientation, and speed. For example, during this state one may feel as if they are floating, moving, or accelerating forwards, backwards, upwards, downwards, or in an unspecifiable direction.

Changes in felt gravity are often accompanied by other coinciding effects such as geometry, internal hallucinations, and holes, spaces and voids. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, cannabinoids, and salvinorin A. This holds particularly true during the rapid onset of DMT, with users commonly reporting an intense feeling of acceleration as they begin to come up on the substance.',
        '', '', 'https://www.effectindex.com/effects/changes-in-felt-gravity',
        'https://psychonautwiki.org/wiki/Changes_in_felt_gravity'),
       ('clvdzrvld000s1vcvu0ff99cu', 'Chromatic aberration', 'chromatic-aberration', null, null, '',
        'Chromatic aberration is when the colours reflected off of an object''s surface become distinctly split into three overlapping offset layers. These split layers can potentially be any colour, but are most commonly reported to be red, green, and blue.  It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Chromatic aberration, also known as chromatic distortion and colour fringing, is when the colours reflected off of an object''s surface become distinctly split into three overlapping offset layers. These split layers can potentially be any colour, but are most commonly reported to be red, green, and blue. This distortion results in the surrounding environment looking somewhat similar to how things look when a person is wearing red blue anaglyph 3D glasses.

Chromatic aberration is often accompanied by other coinciding effects such as colour enhancement and colour shifting. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/chromatic-aberration', null),
       ('clvdzrvlk000t1vcvxp0bfy40', 'Cognitive disconnection', 'cognitive-disconnection', null, null, '',
        'Cognitive disconnection is the experience of feeling distant and detached from one''s sense of identity, thought stream, and general cognitive processes. It is a near-universal effect under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Cognitive disconnection is the experience of feeling distant and detached from one''s sense of identity, thought stream, and general cognitive processes. This may lead to or be complemented by other effects, such as depersonalization, derealization, memory suppression, "ego death", and a general array of cognitive suppressions. The experience of this can also create a wide range of subjective changes to a person''s perception of their own consciousness. These are described and documented in the list below:

*  Feeling as though one''s conscious thought stream and memories are not one''s own

*  Feeling as if one''s conscious thought processes are distant and vague

*  Feeling as if one''s conscious thought processes have become autonomous and mechanical in their structure or behaviour

*  Feeling a decrease in the overall speed, connectivity, and analytical abilities of one''s cognitive abilities

Cognitive disconnection is often accompanied by other coinciding effects, such as visual disconnection and physical disconnection. This results in the sensation that one is partially or completely detaching from both their sensory input and their conscious faculties. It is a near-universal effect under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/cognitive-disconnection',
        'https://psychonautwiki.org/wiki/Cognitive_disconnection'),
       ('clvdzrvls000u1vcv9sofiruc', 'Cognitive dysphoria', 'cognitive-dysphoria', null, null, '',
        'Cognitive dysphoria (semantically the opposite of euphoria) is medically recognized as a cognitive and emotional state in which a person experiences intense feelings of dissatisfaction, and in some cases indifference to the world around them.  It is most commonly induced under the influence of moderate dosages of deliriant compounds, such as DPH and datura. However, it can also occur during a stimulant''s offset and during the withdrawal symptoms of almost any substance.', 'Epkins, C. C. (1996). Cognitive specificity and affective confounding in social anxiety and dysphoria in children. Journal of Psychopathology and Behavioral Assessment, 18(1), 83-101.

https://doi.org/10.1007%2FBF02229104', '', '', 'https://www.effectindex.com/effects/cognitive-dysphoria',
        'https://psychonautwiki.org/wiki/Cognitive_dysphoria'),
       ('clvdzrvm4000v1vcvxwgj78xw', 'Cognitive euphoria', 'cognitive-euphoria', null, null, '',
        'Cognitive euphoria (semantically the opposite of cognitive dysphoria) is medically recognized as a cognitive and emotional state in which a person experiences intense feelings of well-being, elation, happiness, excitement, and joy.  It is most commonly induced under the influence of moderate dosages of opioids, entactogens, stimulants, and GABAergic depressants. However, it can also occur to a lesser extent under the influence of hallucinogenic compounds such as psychedelics, dissociatives, and cannabinoids.', 'Cognitive euphoria (semantically the opposite of cognitive dysphoria) is medically recognized as a cognitive and emotional state in which a person experiences intense feelings of well-being, elation, happiness, excitement, and joy.

[1]

Although euphoria is an effect (i.e. a substance is euphorigenic),

[2]

[3]

the term is also used colloquially to define a state of transcendent happiness combined with an intense sense of contentment.

[4]

However, recent psychological research suggests euphoria can largely contribute to but should not be equated with happiness.

[5]

Cognitive euphoria is often accompanied by other coinciding effects such as physical euphoria and tactile enhancement. It is most commonly induced under the influence of moderate dosages of opioids, entactogens, stimulants, and GABAergic depressants. However, it can also occur to a lesser extent under the influence of hallucinogenic compounds such as psychedelics, dissociatives, and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/cognitive-euphoria',
        'https://psychonautwiki.org/wiki/Cognitive_euphoria'),
       ('clvdzrvmc000w1vcv1e8tw0ck', 'Cognitive fatigue', 'cognitive-fatigue', null, null, '',
        'Cognitive fatigue (also called exhaustion, tiredness, lethargy, languidness, languor, lassitude, and listlessness) is medically recognized as a state usually associated with a weakening or depletion of one''s mental resources. It is most commonly induced under the influence of moderate dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone.', 'Wittkampf, L. C., Arends, J., Timmerman, L., & Lancel, M. (2012). A review of modafinil and armodafinil as add-on therapy in antipsychotic-treated patients with schizophrenia. Therapeutic advances in psychopharmacology, 2(3), 115-125.

https://dx.doi.org/10.1177%2F2045125312441815', '', '', 'https://www.effectindex.com/effects/cognitive-fatigue',
        'https://psychonautwiki.org/wiki/Cognitive_fatigue'),
       ('clvdzrvmm000x1vcvjyd8n182', 'Colour enhancement', 'colour-enhancement', null, null, '',
        'Colour enhancement is a perceived intensification of the brightness and vividness of colours in the external environment.  It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'This effect seems to be mentioned within the following trip reports:

My Second Experience with Unity

You do not need to understand

I designed it this way myself', '', '', 'https://www.effectindex.com/effects/colour-enhancement', null),
       ('clvdzrvmv000y1vcvidzm61hv', 'Colour replacement', 'colour-replacement', null, null, '',
        'Colour replacement is the experience of a person''s entire visual field or specific objects and sections within it becoming replaced with an alternative colour that differs from its original appearance. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Colour replacement is the experience of a person''s entire visual field or specific objects and sections within it becoming replaced with an alternative colour that differs from its original appearance.

[1]

For example, the person''s vision could become tinted purple, the green leaves of a tree could become red, or a black car could become white.

Although similar, this component differs from colour shifting as it is a static change in colour that remains still and semi-permanent as opposed to constantly cycling between various hues, tints and shades.

Colour replacement is often accompanied by other coinciding effects, such as colour enhancement and colour shifting. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/colour-replacement', null),
       ('clvdzrvn3000z1vcvag4xq3oh', 'Colour shifting', 'colour-shifting', null, null, '',
        'Colour shifting is when objects within the environment fluidly change their colour through a continuously repeating cycle. It is most commonly induced under the influence of psychedelic compounds.', 'Colour shifting is when objects within the environment fluidly shift and change their colour through a continuously repeating cycle.

[1]

For example, moss on a rock could visibly shift from green, to red, to blue, to any other colour, and then back to green again in a smooth and seamless animated loop. This effect is particularly strong and likely to occur if the objects original colour was bright or out of place.

Colour shifting is often accompanied by other coinciding effects, such as colour enhancement and colour replacement. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of certain stimulants such as MDMA.',
        '', '', 'https://www.effectindex.com/effects/colour-shifting', null),
       ('clvdzrvnc00101vcvw78xlsxf', 'Colour suppression', 'colour-suppression', null, null, '',
        'Colour suppression is the experience of colours becoming darker, less saturated, and less distinguishable from one another. It is most commonly induced under the influence of heavy dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone.', 'Colour suppression is the experience of colours becoming darker and less distinguishable from one another.

[1]

[2]

During this experience, reds may seem “less red”, greens may seem “less green”, and all colours will likely appear greyer and less saturated than they comparatively would be during everyday sober living. At higher levels, this effect can result in the external environment appearing to be black and white, monochrome, and completely devoid of colour.

Colour suppression is often accompanied by other coinciding effects such as acuity suppression and double vision. It is most commonly induced under the influence of heavy dosages of antipsychotic

[3]

compounds, such as quetiapine, haloperidol, and risperidone.', '', '',
        'https://www.effectindex.com/effects/colour-suppression', null),
       ('clvdzrvnk00111vcv48anjv29', 'Component controllability', 'component-controllability', null, null, '',
        'Component controllability is the rare experience of gaining partial or complete conscious control over the details, content, and intensity of other currently occurring subjective effects. It is a very rare experience that mostly occurs under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Component controllability is the rare experience of gaining partial to complete conscious control over the details, content, and intensity of other currently occurring subjective effects. This occurs in a manner that is extremely similar to the level of control experienced by well-practised lucid dreamers during an ordinary dream.

For example, this state could give a person the ability to manually manipulate and direct their current visual effects by allowing them to will specific components into occurring, stopping, increasing, decreasing or changing their behaviour. It could also allow the person to manipulate their cognitive or physical state by letting them select and control the presence and intensity of potentially any combination of specific components present within the subjective effect index. However, it is worth noting that it''s questionable whether or not this experience is reflective of genuine control over the effects observed as it may simply be a delusion that gives one the feeling and perception of control.

Component controllability is a very rare experience that mostly occurs under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/component-controllability',
        'https://psychonautwiki.org/wiki/Component_controllability'),
       ('clvdzrvnr00121vcvmbzp4gzr', 'Compulsive redosing', 'compulsive-redosing', null, null, '',
        'Compulsive redosing is the experience of a powerful and difficult to resist urge to continuously redose a psychoactive substance in an effort to increase or maintain the subjective effects which it induces. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as opioids, stimulants, GABAergics, and entactogens.', 'Compulsive redosing is the experience of a powerful and difficult to resist urge to continuously redose a psychoactive substance in an effort to increase or maintain the subjective effects which it induces.

[1]

[2]

[3]

[4]

This effect is considerably more likely to manifest itself when the user has a large supply of the given substance within their possession. It can be partially avoided by pre-weighing dosages, not keeping the remaining material within sight, exerting self-control, and giving the compound to a trusted individual to keep until they deem it safe to return.

Compulsive redosing is often accompanied by other coinciding effects such as cognitive euphoria, physical euphoria, or anxiety suppression alongside of other effects which inhibit the clarity of one''s decision-making processes such as disinhibition, motivation enhancement, and ego inflation. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as opioids, stimulants,

[2]

[4]

[5]

GABAergics,

[2]

and entactogens.

[3]

However, it can also occur to a lesser extent under the influence of dissociatives and cannabinoids.

[3]', '', '', 'https://www.effectindex.com/effects/compulsive-redosing',
        'https://psychonautwiki.org/wiki/Compulsive_redosing'),
       ('clvdzrvny00131vcvxmvcy5o7', 'Conceptual thinking', 'conceptual-thinking', null, null, '', 'Conceptual thinking is an alteration to the nature and content of one''s internal thought stream. This alteration predisposes a user to think thoughts that are no longer primarily comprised of words and linear sentence structures. Instead, thoughts become equally comprised of what is perceived to be extremely detailed renditions of the innately understandable and internally stored concepts that words exist to label.

It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives.', 'Conceptual thinking is an alteration to the nature and content of one''s internal thought stream. This alteration predisposes a user to have thoughts that are no longer primarily comprised of words and linear sentence structures. Instead, thoughts become equally comprised of what is perceived to be extremely detailed renditions of the innately understandable and internally stored concepts that words exist to label. Essentially, thoughts cease to be spoken by an internal narrator and are instead “felt” and intuitively understood.

For example, if a person were to think of an idea, such as a chair, during this state, one would not hear the word as part of an internal thought stream, but would feel the internally stored, non-linguistic, and innately understandable data that comprises the specific concept labelled within one''s memory as a chair. These conceptual thoughts are felt in a comprehensive level of detail that feels as if it is unparalleled within the primarily linguistic thought structure of everyday life. This is sometimes interpreted by those who undergo it as a sort of "higher level of understanding".

During this experience, conceptual thinking can cause one to feel not just the entirety of a concept''s attributed data, but also how a given concept relates to and depends upon other known concepts. This can result in the perception that the person can better comprehend the complex interplay between the idea that is being contemplated and how it relates to other ideas.

Conceptual thinking is often accompanied by other coinciding effects such as personal bias suppression and analysis enhancement. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives. However, it can also occur to a lesser extent under the influence of entactogens, cannabinoids, and meditation.',
        '', '', 'https://www.effectindex.com/effects/conceptual-thinking',
        'https://psychonautwiki.org/wiki/Conceptual_thinking'),
       ('clvdzrvo800141vcvh203yvbp', 'Confusion', 'confusion', null, null, '',
        'Confusion is an impairment of abstract thinking demonstrated by an inability to think with one’s customary clarity and coherence. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics,  dissociatives,  synthetic cannabinoids, and deliriants.', 'Confusion is an impairment of abstract thinking demonstrated by an inability to think with one’s customary clarity and coherence.

[1]

Within the context of substance use, it is commonly experienced as a persistent inability to grasp or comprehend concepts and situations which would otherwise be perfectly understandable during sobriety. The intensity of this effect seems to to be further increased with unfamiliarity

[2]

in either setting or substance ingested.

Confusion is often accompanied by other coinciding effects such as delirium, delusions, and short-term memory suppression in a manner which further increases the person''s lack of comprehension. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics

[3]

, dissociatives

[4]

, synthetic cannabinoids

[5]

, and deliriants

[6]

[7]

. However, it can also occur to a lesser extent under the influence of heavy dosages of benzodiazepines

[8]

and antipsychotics

[7]', '', '', 'https://www.effectindex.com/effects/confusion', 'https://psychonautwiki.org/wiki/Confusion'),
       ('clvdzrvof00151vcv4lh9g40a', 'Constipation', 'constipation', null, null, '',
        'Constipation can be described as bowel movements that are infrequent or hard to pass. It usually results in painful defecation and small, compact faeces. It is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, tramadol, fentanyl, and kratom.', 'Constipation can be described as bowel movements that are infrequent or hard to pass. It usually results in painful defecation and small, compact faeces. Symptoms of substance constipation may be reduced by increasing the amount of dietary fruit, fibre, and water consumed. Laxatives may also be used for temporary relief.

Constipation is often accompanied by other coinciding effects such as nausea, dehydration, and difficulty urinating. It is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, tramadol, fentanyl, and kratom.',
        '', '', 'https://www.effectindex.com/effects/constipation', 'https://psychonautwiki.org/wiki/Constipation'),
       ('clvdzrvok00161vcvovlb7etq', 'Cough suppression', 'cough-suppression', null, null, '',
        'Cough suppression can be described as a decreased desire and need to cough. It is most commonly induced under the influence of moderate dosages of antitussive compounds such as, codeine, pholcodine, dextromethorphan, noscapine, and butamirate.', 'Cough suppression can be described as a decreased desire and need to cough.

[1]

[2]

This is typically regarded as a positive effect which helps alleviate a pre-existing ailment. In certain contexts, it can also allow an individual to inhale much larger amounts of smoke than they would usually be able to, without accompanying pain or the desire to cough. However, it is worth noting that the efficacy of many over the counter cough medication is questionable, particularly in children.

[3]

Cough suppression is most commonly induced under the influence of moderate dosages of antitussive compounds such as codeine

[4]

, pholcodine, dextromethorphan

[5]

, noscapine, and butamirate. However, it may also occur under the influence of certain antihistamines such as promethazine.',
        '', '', 'https://www.effectindex.com/effects/cough-suppression',
        'https://psychonautwiki.org/wiki/Cough_suppression'),
       ('clvdzrvos00171vcvrdg4whfj', 'Creativity enhancement', 'creativity-enhancement', null, null, '',
        'Creativity enhancement is a perceived increase in one''s capability to imagine new ideas, create art, or think about existing concepts in a novel manner. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Creativity enhancement is a perceived increase in one''s capability to imagine new ideas, create art, or think about existing concepts in a novel manner.

[1]

[2]

[3]

This effect is particularly useful to artists of any sort as it can help a person overcome creative blocks on existing projects and induce inspiration for entirely new projects. Creativity enhancement can make imaginative activities more enjoyable and effortless in the moment and the inspiration from it can benefit the individual even after the effect has worn off.

A well-known example of psychedelic creativity enhancement comes from the Nobel Prize winning chemist Dr. Kary Mullis, who invented a method for copying DNA segments known as the PCR, and is quoted as saying: "Would I have invented PCR if I hadn''t taken LSD? I seriously doubt it. I could sit on a DNA molecule and watch the polymers go by. I learned that partly on psychedelic drugs".

[4]

In addition, although dubious, it has been claimed Francis Crick experimented with LSD during the time he helped elucidate the structure of DNA.

[5]

Creativity enhancement is often accompanied by other coinciding effects, such as thought connectivity, motivation enhancement, personal bias suppression, analysis enhancement, and thought acceleration, in a manner that further amplifies a person''s creativity. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.

[6]

[7]

[8]

However, it can also occur to a lesser extent under the influence of cannabinoids

[9]

[10]

, dissociatives

[11]

, and stimulants.', '', '', 'https://www.effectindex.com/effects/creativity-enhancement',
        'https://psychonautwiki.org/wiki/Creativity_enhancement'),
       ('clvdzrvp100181vcvg8j4fxq9', 'Creativity suppression', 'creativity-suppression', null, null, '',
        'Creativity suppression is a decrease in both a person''s motivation and capabilities when performing tasks that involve producing artistic output or novel problem-solving.  It is most commonly induced under the influence of moderate dosages of antipsychotics.', 'Creativity suppression is a decrease in both a person''s motivation and capabilities when performing tasks that involve producing artistic output or novel problem-solving.

[1]

This effect may be particularly frustrating to deal with for artists of any sort as it will induce a temporary creative block.

Although creative subjects paradoxically more often have a history of depression than the average, their creative work is not done during their depressions, but in rebound periods of increased energy between depressions.

[1]

[2]

Creativity suppression is often accompanied by other coinciding effects such as depression

[3]

, anxiety, and emotion suppression in a manner which further decreases the person''s creative abilities.

[1]

It is most commonly induced under the influence of moderate dosages of antipsychotics

[1]

[4]

[5]

. However, it can also occur due to SSRI''s

[6]

and during the withdrawal symptoms of almost any dopaminergic compound.

[5]', '', '', 'https://www.effectindex.com/effects/creativity-suppression', null),
       ('clvdzrvp900191vcvoyen5dki', 'Decreased blood pressure', 'decreased-blood-pressure', null, null, '',
        'Decreased blood pressure can be described as a condition in which the pressure in the systemic arteries is decreased to abnormal levels. It is most commonly induced under the influence of moderate dosages of GABAergic depressant compounds, such as benzodiazepines and barbiturates.', 'Decreased blood pressure can be described as a condition in which the pressure in the systemic arteries is decreased to abnormal levels. A blood pressure of 120/80 is considered normal for an adult. A blood pressure of 90/60 or lower is considered hypotension and a blood pressure between 120/80 and 90/60 is considered .

[1]

Decreased blood pressure is most commonly induced under the influence of moderate dosages of GABAergic depressant compounds, such as benzodiazepines and barbiturates. However, it can also occur under the influence of vasodilating compounds such as poppers as well as certain psychedelics and stimulants in an unpredictable manner.',
        '', '', 'https://www.effectindex.com/effects/decreased-blood-pressure',
        'https://psychonautwiki.org/wiki/Decreased_blood_pressure'),
       ('clvdzrvpg001a1vcv3glkpixw', 'Decreased heart rate', 'decreased-heart-rate', null, null, '',
        'Decreased heart rate or bradycardia can be described as a heart rate that is lower than the normal heart rate at rest. It is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics, and opioids.', 'Decreased heart rate or bradycardia can be described as a heart rate that is lower than the normal heart rate at rest. The average healthy human heart normally beats 60 to 100 times a minute when a person is at rest. When the heart rate fluctuates to lower levels under 60 BPM, it is described as bradycardia or an abnormally low heart rate.

It is worth noting that decreased heart rate can often be a result of psychological symptoms as a natural response to relaxation, anxiety suppression, sedation, and mindfulness.

Decreased heart rate is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics, and opioids. However, it can also occur under the influence of cannabinoids, dissociatives, and stimulants.',
        '', '', 'https://www.effectindex.com/effects/decreased-heart-rate',
        'https://psychonautwiki.org/wiki/Decreased_heart_rate'),
       ('clvdzrvpp001b1vcv52mou31s', 'Decreased libido', 'decreased-libido', null, null, '',
        'Decreased libido can be described as a distinct decrease in feelings of sexual desire, the anticipation of sexual activity, and the likelihood that a person will view the context of a given situation as sexual in nature. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as, opioids, antipsychotics and SSRI''s, and dissociatives.', 'Decreased libido can be described as a distinct decrease in feelings of sexual desire, the anticipation of sexual activity, and the likelihood that a person will view the context of a given situation as sexual in nature. When experienced, this effect can result in a general difficulty or complete inability to become aroused by sexual stimuli.

Decreased libido is often accompanied by other coinciding effects such as emotion suppression, temporary erectile dysfunction, pain relief, and sedation. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as, opioids, antipsychotics and SSRI''s, and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/decreased-libido',
        'https://psychonautwiki.org/wiki/Decreased_libido'),
       ('clvdzrvpv001c1vcvvccn9s13', 'Dehydration', 'dehydration', null, null, '',
        'Dehydration can be described as an uncomfortably dry mouth and feelings of general thirstiness that results due to a lack of water intake. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds such as, stimulants, psychedelics, opioids, dissociatives, deliriants, cannabinoids, alcohol, and antipsychotics.', 'Dehydration can be described as an uncomfortably dry mouth and feelings of general thirstiness that results due to a lack of water intake. Untreated dehydration generally results in delirium, unconsciousness, swelling of the tongue, and (in extreme cases) death. The formal definition of dehydration is defined as an excessive loss of body water within a living organism which results in an accompanying disruption of metabolic processes.

At lower levels, substance-induced dehydration can be generally described as a sense of consistent and uncomfortable thirst which necessitates sipping at a drink to maintain fluid levels and to avoid an uncomfortably dry mouth. At extreme levels (which generally only occur through the use of deliriants), the dehydration can become so powerful that the person may find themselves with painfully dry eyes and mucous membranes in a manner which results in extreme difficulty swallowing.

Dehydration is often accompanied by other coinciding effects such as dry mouth, headaches, dizziness, decreased blood pressure, and fainting when standing up. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds such as, stimulants, psychedelics, opioids, dissociatives, deliriants, cannabinoids, alcohol, and antipsychotics.

It''s important to note that regardless of how dehydrated a person may become under the influence of any substance, careful effort and consideration should always be put into ensuring that they do not drink water excessively as it can result in a state known as water intoxication. This can be potentially fatal and is classed as a disturbance in brain functions that results when the normal balance of electrolytes in the body is pushed outside of safe limits by over-hydration. Although extremely rare, there have been a few notable deaths which were clearly triggered by the excessive overconsumption of water under the influence of drug-induced dehydration.

The average toxic dosage of water in a human being is roughly ten litres. However, water intoxication can be easily avoided by simply being aware of it and taking care to sip at water while avoiding the consumption of unnecessarily large amounts.',
        '', '', 'https://www.effectindex.com/effects/dehydration', 'https://psychonautwiki.org/wiki/Dehydration'),
       ('clvdzrvq4001d1vcvnb3837sy', 'Déjà Vu', 'deja-vu', null, null, '',
        'Déjà Vu or Deja Vu can be described as the sudden sensation that a current event or situation has already been experienced at some point in the past when, in actuality, it hasn''t. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.', 'Déjà Vu or Deja Vu can be described as the sudden sensation that a current event or situation has already been experienced at some point in the past when, in actuality, it hasn''t.

[1]

[2]

[3]

[4]

This term is a common phrase from the French language which translates literally into “already seen” and is directly related to the lesser known state referred to as "jamais-vu". It is a well-documented phenomenon that can commonly occur throughout both sober living and under the influence of hallucinogens.

Within the context of psychoactive substance usage, many compounds are commonly capable of inducing spontaneous and often prolonged states of mild to intense sensations of déjà vu. This can provide one with an overwhelming sense that they have “been here before”. The sensation is also often accompanied by a feeling of familiarity with the current location or setting, the current physical actions being performed, the situation as a whole, or the effects of the substance itself.

This effect is often triggered despite the fact that during the experience of it, the person can be rationally aware that the circumstances of the “previous” experience (when, where, and how the earlier experience occurred) are uncertain or believed to be impossible.

Déjà vu is often accompanied by other coinciding effects such as short-term memory suppression and thought loops. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/deja-vu', null),
       ('clvdzrvqc001e1vcvojbu5qfj', 'Delirium', 'delirium', null, null, '',
        'Delirium (also known as acute confusion) is medically recognized as a physiological disturbance of awareness that is accompanied by a change in baseline cognition which cannot be better explained by a preexisting or evolving neurocognitive disorder. The disturbance in awareness is manifested by a reduced ability to direct, focus, sustain, and shift attention and the accompanying cognitive change in at least one other area may include memory and learning (particularly recent memory), disorientation (particularly to time and place), alteration in language, or perceptual distortions or a perceptual-motor disturbance. It is most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'Delirium (also known as acute confusion)

[1]

is medically recognized as a physiological disturbance of awareness that is accompanied by a change in baseline cognition which cannot be better explained by a preexisting or evolving neurocognitive disorder. The disturbance in awareness is manifested by a reduced ability to direct, focus, sustain, and shift attention and the accompanying cognitive change in at least one other area may include memory and learning (particularly recent memory), disorientation (particularly to time and place), alteration in language, or perceptual distortions or a perceptual-motor disturbance. The perceptual disturbances accompanying delirium include misinterpretations, illusions, or hallucinations; these disturbances are typically visual but may occur in other modalities as well, and range from simple and uniform to highly complex. An individual with delirium may also exhibit emotional disturbances, such as anxiety, fear, depression, irritability, anger, euphoria, and apathy with rapid and unpredictable shifts from one emotional state to another.

[2]

This disturbance develops over a short period of time, usually hours to a few days, and tends to fluctuate during the course of the day, often with worsening in the evening and night when external orienting stimuli decrease. It has been proposed that a core criterion for delirium is a disturbance in the sleep-wake cycle. Normal attention/arousal, delirium, and coma lie on a continuum, with coma defined as the lack of any response to verbal stimuli.

[2]

Delirium may present itself in three distinct forms. These are referred to in the scientific literature as hyperactive, hypoactive, or mixed forms.

[3]

In its hyperactive form, it is manifested as severe confusion and disorientation, with a sudden onset and a fluctuating intensity.

[4]

In its hypoactive (i.e. underactive) form, it is manifested by an equally sudden withdrawal from interaction with the outside world accompanied by symptoms such as drowsiness and general inactivity.

[5]

Delirium may also occur in a mixed type in which one can fluctuate between both hyper and hypoactive periods.

Delirium is most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH

[6]

, datura

[7]

, and benzydamine. However, it can also occur as a result of an extremely wide range of health problems such as urinary tract infections

[8]

, influenza

[9]

, and alzheimer’s

[10]', '', '', 'https://www.effectindex.com/effects/delirium', 'https://psychonautwiki.org/wiki/Delirium'),
       ('clvdzrvql001f1vcvs7ghne2b', 'Runny nose', 'delusion', null, null, '',
        'A delusion is a false idea or belief that is held with strong conviction and subjective certainty and is inconsistent with an individual’s educational, cultural and social background. Delusions are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, deliriants, and dissociatives.', 'A delusion is a false idea or belief that is held with strong conviction and subjective certainty and is inconsistent with an individual’s educational, cultural and social background. Delusions are not usually amenable to logic and are often immediately recognizable as false and absurd to others.

[1]

[2]

[3]

Delusions are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, deliriants, and dissociatives. However, they can also occur to a lesser extent under the influence of cannabinoids, stimulant psychosis, and sleep deprivation.

This article focuses primarily on the types of delusion that are commonly induced with hallucinogens and other psychoactive substances. It therefore is not an exhaustive examination of all delusions listed within the Diagnostic and Statistical Manual of Mental Disorders (DSM) that are known to occur to people who suffer from chronic psychological conditions, such as bipolar disorder and schizophrenia.

When associated with psychoactive substance use, delusions tend to occur during the peak of a substance’s effect, though they may also occur as a result of withdrawal from substances such as benzodiazepines. In contrast to disease-based delusions, substance-induced delusions are often ‘broken-out of’ after the duration of the substance’s effect, or when they are provided enough evidence to contradict their delusion. It is rare for a delusion to persist after the effects of a substance have waned.

It is difficult to clearly define the boundary between ‘normal’ beliefs and the delusions that occur while on psychoactive substances. In the context of psychoactive substance use, there is a discernible continuum between beliefs held while sober and the fully delusional beliefs held by those experiencing psychosis. Beliefs that are overvalued yet not delusional are commonly encountered at moderate substance intensity levels. Overvalued beliefs are those which are held with unusual fervency, but are not clearly absurd, such as the paranoid conviction that one’s friends are going to call emergency services imminently. With an increase in substance intensity overvalued beliefs can potentially develop into delusions proper.

A common component to delusions and overvalued beliefs is a markedly increased sense of conviction in one’s beliefs. The intensity of this conviction roughly corresponds to the intensity of the substance’s effect. When conviction is increased, intuitive thinking is likewise increased, resulting in abnormally bold (and often tenuous) ideas and claims about science, metaphysics, politics, art and religion.

Although substance-induced delusions can occur in myriad forms, they can be often categorized as belonging to particular types, the most common of which are documented and described below:

Grandiose delusions are those where there is an inflated sense of personal accomplishment or status, possibly as a product of effects experienced while under the influence of psychedelics or stimulants, including ego-inflation, mania, geometry and internal hallucinations. These delusions persist for the duration of the substance’s effect, but will often be recognized as absurd upon obtaining sobriety.

The idea that one has ‘transcended to a higher level of being’ and is destined to solve the multitude of the world’s problems using extra-dimensional knowledge.

The idea that one has obtained an enlightened or god-like status comparable to The Buddha or Jesus and now comprehends the simple answer to life, the universe and everything. This individual may make claims that they have obtained a permanent enlightened status, eliminated their ego, and shall become historically noteworthy. This delusion is more common amongst users of short-acting ego death inducing hallucinogenic substances, such as DMT, nitrous oxide and salvia.

The idea that one has figured out, due to their supreme genius, the mathematical, scientific, and philosophical problems that no one before them could.

The idea that one has obtained an (often supernatural) ability that few others have. This may include abilities such as telepathy, levitation or willing the universe into producing particular outcomes.

The idea that one knows or can determine events that are bound to occur in the future. These predicted events can range from the mundane (‘My friend is going to call me.’) to the calamitous (‘Russia is about to invade the United States.’)

While these delusions are most often applied to the individual who is undergoing the effects of the substance, they may also be applied to others, such as believing a close friend is in some way extraordinary. This projection may be influenced by a disparity in psychological states, such as that between those who are sober and those under the influence of a psychoactive substance.

Paranoid Delusions are delusions where there is a tremendous sense of fear and conviction that one is being watched, monitored, spied upon, and/or plotted against despite there being no evidence to substantiate such a claim.

Paranoid delusions are most commonly experienced under the influence of heavy dosages of psychedelic compounds. However, they can also occur during extreme sleep deprivation and stimulant psychosis.

Somatic Delusions are delusions that involve the belief that the body, or part of it, is missing, broken, deformed, diseased or dysfunctional. These beliefs are typically bizarre and are distinguished from tactile hallucination by seeming so real to the individual experiencing them as to cause significant emotional distress.

*  The belief that one’s intestines are decomposing.

*  That the tension in one’s throat is the result of the vocal cords becoming knotted.

*  That there is a parasitic worm crawling around in one’s stomach.

*  That a limb is dead, dying or missing.

Delusions of Reference (also referred to as ideas of reference) are one of the most common types of delusion. This delusion typically involves the falsely held belief that an insignificant remark, event, coincidence, or object in the person''s environment is either a reaction to the individual or has significant personal meaning relating directly back to their life.

[6]

[7]

[8]

In psychiatry, delusions of reference form part of the diagnostic criteria for illnesses such as schizophrenia, delusional disorder, bipolar disorder, and schizotypal personality disorder. To a lesser extent, they can also be a symptom of paranoid personality disorder. However, delusions of reference are especially common under the influence of heavy dosages of hallucinogens or during stimulant psychosis.

A list of common examples of this type of delusion are described and documented below:

*  Believing that people in a passing car are talking about you.

*  Believing that people on television or in other forms of media are talking about or directly to you.

*  Believing that headlines and news articles are written specifically for or about you.

*  Believing that events (even world events) have been deliberately planned for you, or have special personal significance for you.

*  Believing that the lyrics of a song are specifically about or for you.

*  Believing that electronic devices are sending you secret and significant messages that only you are capable of understanding.

*  Believing that objects, situations, and events are being deliberately organized to convey a special or particular meaning to you.

*  Believing that the slightest  bodily movement of another person has a significant and deliberate meaning.

*  Believing that posts on social media have hidden meanings pertaining to you.

Delusions of Death & Dying are distressing, falsely-held beliefs that one is about to die, is currently dying, no longer exists, or has already died. This delusion may be a result of a diminished sense of self or identity that usually occurs during states of high-level ego death.

These delusions are most commonly experienced under the influence of heavy doses of psychedelics and to a lesser extent dissociatives.

Delusions of Guilt are caused by unfounded and intense feelings of remorse or guilt that lead the person to conclude that one must have committed some sort of deeply unethical act. The supposed unethical act can range from something relatively mild, such as the belief that the person has cheated on their partner; it can also be something much more serious, such as the belief that they have murdered their friends and family.

Delusions of guilt are most commonly experienced under the influence of heavy dosages of psychedelic and dissociative compounds.

Delusions of reified fiction are the unfounded belief that something fictional, such as the plot of a TV show, film, video game, or book, is an actual real-life event. This delusion may manifest as the perception that the fictional events within media that is currently being consumed are genuinely occurring in one''s immediate vicinity, or simply that the events in the media are real and currently occurring somewhere in the world. This delusion seems to be a result of high-level immersion enhancement combined with memory suppression creating a state of mind in which somebody is highly engrossed in media while no longer having a functional long-term memory that can recall the difference between reality and fiction.

Delusions of reified fiction are most commonly experienced under the influence of heavy dosages of dissociative and occasionally psychedelic compounds.

is the unfounded belief that the person is currently inside of a video game, dream, or movie and therefore their current actions will not have any real-life consequences. In extreme situations and depending on the person, this delusion can sometimes result in committing crimes or violent acts. It seems to be a result of intense psychosis, derealization, disinhibition and memory suppression combining to create an altered state of mind in which somebody mistakes reality for a fictional hallucination.

Delusional derealization is most commonly experienced under the influence of heavy dosages of hallucinogens and occasionally during stimulant psychosis.

A delusion of sobriety typically involves the falsely held belief that one is perfectly sober despite obvious evidence to the contrary, such as severe cognitive impairment, significant motor control loss, and an inability to fully communicate with others.

Delusions of sobriety are most commonly experienced under the influence of GABAergic compounds such as alcohol and benzodiazepines. However, in many cases, this state of mind can stem not just from the delusional belief of one''s own sobriety, but also from a sense of denial that is motivated by a need to protect one''s ego, or a genuine inability to identify one''s own intoxication.

A delusion of permanent unsobriety is the belief that has permanently changed the operation of their mind and will remain in an unsober state. This can also manifest as a fear that one has broken their brain through substance abuse, despite there being no convincing evidence to substantiate such a claim.

Delusions of permanent unsobriety are most commonly experienced under the influence of heavy dosages of dissociative and occasionally psychedelic compounds.

Shared delusions are when a delusional belief is experienced in a group setting and it begins to spread between individuals who are similarly intoxicated.

[4]

For example, if one person makes a verbal statement regarding a delusional belief that they are currently holding while in the presence of other similarly intoxicated people, they may also begin to hold the same delusion. This can result in shared hallucinations and a general reinforcement of the level of conviction in which they are each holding the delusional belief.

Shared delusions are most commonly experienced under the influence of heavy dosages of psychedelic compounds.

Delusional parasitosis, also known as Ekbom''s syndrome,

[13]

[14]

is a form of delusion in which victims acquire a strongly held belief that they are infested with parasites, bugs, and insects, whereas in reality, no such parasites are present.

[15]

Sufferers may injure themselves in attempts to rid themselves of the "parasites." Some are able to induce the condition in others through suggestion, in which case the term "folie à deux" may be applicable.

[14]

[16]

During this state, nearly any marking upon the skin, small object or particle found on the person or their clothing can be interpreted as evidence for the parasitic infestation. If this delusion is ongoing, sufferers may compulsively gather such "evidence" and then present it to medical professionals when seeking help.

[17]

In the context of psychoactive substances this effect is common during stimulant psychosis, often after chronic usage of cocaine or methamphetamine.

[18]', '', '', 'https://www.effectindex.com/effects/delusion', 'https://psychonautwiki.org/wiki/Runny_nose'),
       ('clvdzrvqz001g1vcv4kysimej', 'Depersonalization', 'depersonalization', null, null, '',
        'Depersonalization is medically recognized as the experience of feeling detached from one''s mental processes, body, or actions as if they are an outside observer. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Depersonalization is an effect that I have experienced during almost every waking second of my adult life. It started as a young teenager when I began to realise that I no longer felt as if I was myself or that I even had a sense of self, alongside the sensation that my entire body and consciousness was in a state of mechanical autopilot. However, at the age of 17, my feelings of depersonalisation were spontaneously eradicated during a single LSD trip. This experience returned my sense of selfhood and gave me the profound sensation that I was not an electrochemical machine responding to external sensory input with fully pre-programmed responses. Instead, I realised that I was, in fact, a conscious agent living in an external world and completely capable of making my own choices through the application of free will, a state of mind which I have come to realise most people take entirely for granted.

Although this feeling of "normalcy" lasted the better part of 3 years, it eventually began to fade back into depersonalisation. It''s been 6 years now and I have not experienced that sense of selfhood or free will since I was a teenager. I''ve given up hope that I ever will again. However, it''s important to note that despite this persistent and continuous depersonalisation, my ability to function and live a happy life remains completely unaffected. This has left me with the impression that those who experience fear or disorientation when undergoing this state are not experiencing feelings that are intrinsic to the condition itself, but are instead responding to a forced change in their culturally embedded assumptions on the nature of human identity.',
        '', '', 'https://www.effectindex.com/effects/depersonalization',
        'https://psychonautwiki.org/wiki/Depersonalization'),
       ('clvdzrvr8001h1vcvl5z81dg0', 'Depression', 'depression', null, null, '',
        'Depression medically encompasses a large variety of different mood disorders whose common features are a sad, empty, or irritable mood co-occurring with bodily and cognitive changes that significantly disrupt an individual''s ability to function. Within the context of psychoactive substance usage, depressivity is often accompanied by other coinciding effects such as anxiety, irritability and dysphoria.', 'Depression medically encompasses a large variety of different mood disorders whose common features are a sad, empty, or irritable mood co-occurring with bodily and cognitive changes that significantly disrupt an individual''s ability to function.

[1]

These different mood disorders have different durations, timing, or presumed origin. However, differentiating normal sadness/grief from a depressive episode requires a careful and meticulous examination. For example: the death of a loved one may cause great suffering, but it does not typically produce a medically defined depressive episode.

[1]

Within the context of psychoactive substance usage, depressivity is often accompanied by other coinciding effects such as anxiety, irritability and dysphoria. It is most commonly induced through prolonged chronic stimulant or depressant use, during the withdrawal symptoms of almost any substance, or during the comedown/crash of a stimulant. It is associated specifically with higher alcohol consumption.

[4]

However, it is worth noting that substance-induced depressivity is often much shorter lasting than clinical depression, usually subsiding once the effects or withdrawal symptoms of a drug have ended.

If you suspect that you are experiencing symptoms of depression, it is highly recommended to seek out therapeutic medical attention and/or a support group. Additionally, you may want to read our depression reduction effect and Psychedelic Therapy review.

It is worth noting that depression as an effect has an unfortunately non-specific definition. It is due to this that there are a number of other relevant terms which should be taken into account when trying to understand this state of mind. These are listed and described below:

Depressivity is medically recognized as feelings of being intensely sad, miserable, and/or hopeless. Some patients describe an absence of feelings and/or dysphoria; difficulty recovering from such moods; pessimism about the future; pervasive shame and/or guilt; feelings of inferior self-worth; and thoughts of suicide and suicidal behavior.Depressive symptoms may include fatigue, lack of ability to concentrate, or significant changes in weight or sleep.

Major Depressive Disorder (MDD) is medically recognized as discrete episodes of depressivity lasting at least two weeks (although most episodes last considerably longer).

[1]

This is the traditional characterization for the term medical term depression.

Dysthymia is medically recognized as a chronic major depressive disorder and is typically diagnosed after two years of continued mood disturbance.

[1]

[2]

Acute depressivity (colloquially referred to as "feeling depressed"), when indicated by either self-report or observation made by others, encompasses the following symptoms:

*  Feeling intensely sad, miserable, and/or hopeless along with pessimism about the future.

*  Anhedonia: a markedly diminished interest or pleasure in all, or almost all, activities.

*  Inability to sleep or sleeping too much.

*  Feelings worthless or excessive/inappropriate guilt (which may be delusional)

*  Recurrent thoughts of death (not just fear of dying).

*  Recurrent suicidal ideation: without a specific plan, having a plan, or a suicide attempt.

For a diagnosis of major depressive disorder to be accurate, the symptoms must cause readily observable distress or impairment in social, occupational, or other important areas of functioning for an extended period of time. The episode must not be better explained by a different mood disorder. The symptoms also cannot be attributable to the physiological effects of a substance or another medical condition.

Unless otherwise noted, the studies referenced here will refer to Depression as it is traditionally defined in medical and scientific literature AKA Major Depressive Disorder (MDD).

Major depression affects 5-20% of the population at some point in their life.

[3]

It results from the combination of genetics and environments with a heritability of greater than 30%. Common environmental influences (parenting style, socioeconomic status, or local environmental qualities) are quite small; however this does not mean these influences are irrelevant. What seems to matter is how a specific individual interacts with their environment across developmental stages.

[5]

Stressful life events are significantly associated with depression.

[6]

Depression is a life-threatening disorder. Both depression and subclinical depression increase all-cause mortality similarly;

[7]

[8]

however subclinical depression does not have an exact definition yet (making it harder to study). The impact depression has on quality of life is comparable or greater than other chronic medical illnesses.

[3]

Cognitive impairment is a core feature of depression that remains after remission and cannot be considered a result of low mood.

[9]

[10]

Although there is some evidence associating depressivity and functionality, depression severity accounts for -at most- 10% of the variability in cognitive dysfunction. Both age of onset and depression severity also modify this effect’s magnitude and what cognitive deficits arise.

[11]

As a generality (not developed in parallel), more severe depression correlates with significant decreases in cognitive performance.

[9]

[11]

These cognitive deficits are significantly associated with poor psychosocial functioning (psychological factors combined with the surrounding social environment).

Psychosocial impairment is also a core feature of depression that remains after remission. Psychosocial stressors are associated with the onset, severity, and progression of MDD.

[12]

More severe depression can be considered a disability, or disorder, of psychosocial function.

[3]

Even brief psychosocial interventions in the form of collaborative care (e.g. a telephone call reminding to take medication) may be comparably effective to more intensive forms of face-to-face psychotherapy.

[13]

Improving cognitive deficits may also improve psychosocial functioning. Although impaired attention and executive functions remain in patients whose depressive symptoms alleviate, memory functions may improve to only a small deficit.

[9]

Improvements in mood are most closely related to improvements in verbal memory, verbal fluency, and psychomotor speed.

Depression is accompanied by immune system dysregulation and activation of the body’s inflammatory response system.

[3]

[7]

[14]

Specific biomarkers have small but significantly higher concentrations associated with the incidence and severity of depression.

It is difficult to say how biological sex interacts due to increasing the number of females in a sample causing the relationship between depression and inflammation to become nonsignificant.

[7]

Estrogen interacts with CRP and IL6, thus fluctuations in menstrual cycles and hormonal contraceptives may affect these results. Yet, overall the fundamental genetic architecture appears the same across samples and genders.

[5]

These proinflammatory small protein messengers, called cytokines, increase indoleamine-2,3-dioxygenase (IDO) expression in both central and peripheral immune-competent cells. IDO increases the synthesis of kynurenine from dietary tryptophan, so this may cause a decrease in tryptophan availability. Tryptophan is required to synthesize serotonin and melatonin.

[3]

Additionally, there is no evidence the serotonin transporter genotype alone or in interaction with stressful life events is associated with an elevated risk of depression.

[6]

Kynurenine also produces endogenous NMDA agonist metabolites that could disrupt neurotransmission along glutaminergic pathways and lead to excitotoxicity in the form of hippocampal neuron damage/death.

[3]

Within the central nervous system, proinflammatory cytokines play important roles in the body’s stress response system and within the regulation of neurogenesis.

[3]

Stress response is mediated by the hypothalamic-pituitary-adrenal (HPA) axis.The HPA axis allows organisms to adapt to physical and psychosocial changes in their environments. There is a substantial link between MDD and HPA abnormalities and it is well established that approximately half of depressed patients have HPA axis hyperactivity.',
        '', '', 'https://www.effectindex.com/effects/depression', 'https://psychonautwiki.org/wiki/Depression'),
       ('clvdzrvrg001i1vcvqqk2dc77', 'Depression reduction', 'depression-reduction', null, null, '',
        'Depression reduction is the experience of minimizing the symptoms associated with depression and low mood states. It most commonly occurs at varying levels of efficacy under the influence of a range of different substances, primarily psychedelics in combination with psychotherapy, or dissociatives.', 'Depression reduction is the experience of minimizing the symptoms associated with depression and low mood states. It is distinct from effects such as cognitive euphoria, as it does not simply elevate the user''s mood but instead results in a sense of stable emotional well-being.

Depression reduction most commonly occurs with adequate nutritional intake.

[1]

[2]

[3]

[4]

[5]

Severe depression is effectively reduced with conventional antidepressants; although in mild to moderate depression, SSRI''s and tricyclic antidepressants appear (on average) to be either only minimally helpful or completely ineffective.

[6]

However, depression reduction can also occur under the influence of hormone replacement therapies

[7]

and modafinil.

[8]

Euthymia (semantically the opposite of dysthymia) is a long-lasting and self‐sustaining experience of stable emotional well-being. This state is characterized by:

[9]

*  A lack disordered mood in patients with prior clinically diagnosed mood disorders; if sadness/anxiety/irritability are experienced they are short-lived and do not significantly impact everyday life.

*  A unifying outlook on life which guides actions and feelings to shape the future.

*  Being resistant to stress (resilience and anxiety or frustration tolerance).

It is worth noting that this is unlikely to be an isolated effect component but rather the result of combining an appropriate environment with other coinciding effects such as rejuvenation, introspection, personal bias suppression, and spirituality enhancement. In many cases, it may also stem from the direct neurological changes that occur as a result of a substances’ pharmacological action.

Euthymia most commonly occurs at varying levels of efficacy under the influence of a range of different substances, primarily psychedelics in combination with psychotherapy

[30]

[31]

, or dissociatives.

[26]

However, it can also occur throughout the course of prescribed psychiatric medications and under the influence of certain entactogens.

A 2021 meta analysis examined 12 double-blind randomized controlled trials for classical psychedelics treating depressive symptoms.

[30]

A single-dose in combination with a psychotherapy treatment program created moderate to large reductions in negative mood symptoms. This reduction remained consistent at several intervals throughout the examined time-frame of 3 hours to 60 days; there were simply not enough randomized clinical trials to extend their timeframe. This effect was present in both healthy and disordered patients.

A 2020 meta analysis examined 9 placebo-controlled studies for psychedelic psychotherapy.

[31]

The studies had one to three doses in combination with a psychotherapy treatment program and results were measured several times over the course of 6 months. The authors'' effect size indicated an 80% probability that a randomly selected patient receiving psychedelic psychotherapy outperforms a patient receiving placebo. Additionally, there were no incidents of severe adverse effects. The authors even compared their results to other meta analyses examining "gold standard" treatments for several mental health problems: psychedelic psychotherapy greatly outperformed.

Psychotherapy with 1-3 doses of a classical psychedelic greatly outperforms current pharmacological standards in regards to producing a depression reduction all while having minimal to no adverse effects. The benefits of only needing a single dose over the course of 6 months as opposed to a daily administration of a substance incurring larger side effects and not producing desired effects until the 2-4 week mark appear obvious.

Scheduling activities is a behavioral treatment for depression that appears as effective as other psychological or pharmacological treatments.

[10]

There is a significant relationship between mood and the number of pleasant activities engaged in. Depressed individuals find fewer activities pleasant, engage in pleasant activities less frequently, and obtain less positive reinforcement.

Exercise is an evidence-based treatment for depression.

[11]

[12]

[13]

[14]

[23]

It also has the advantage of preventing the increased risk of drug-drug interactions. Moderate to heavy exercise of any type (including yoga) appears as effective, and do not significantly differ from, other pure forms of depression treatment such as psychotherapy or pharmacological treatment. Large changes in fitness do not appear necessary either.

WARNING

[27]

[28]

- Ketamine possesses a strong abuse potential at typical antidepressive doses. Ketamine has reported cases of severe bladder and liver injury. Esketamine, a newer nasal spray formulation of Ketamine, does not have any reported cases and is purported to have a better safety profile. However, in recent short-term clinical trials esketamine still more-than-doubled the amount of adverse bladder events when compared to placebo (6-10% vs 1-4%).  Although 2/3 of esketamine incidents resolved themselves either without intervention or through a lowering of dosage, any physiological damage is acute and immediate: in typical dose regimens steady-state concentrations are not reached.

Ketamine offers a (dose-dependent) large immediate depression reduction for 30-50% of patients; its effect-sizes become moderate to small by day 7.

[24]

[25]

[29]

Weekly to biweekly dosing maintains a statistically significant depression reduction measured at Day 28 and repeated administration has resulted in cases of euthymia.

[26]

[28]

A family history of alcohol-use-disorder in a first-degree relative is associated with an improved antidepressive response, and a reduction of adverse mental effects such as dysphoria. Its antidepressant properties may also stem more generally from dissociatives'' novelty and/or immersion enhancements.

There is no doubt Cognitive Behavioral Therapy is an effective treatment for adult depression.

[15]

There are no large differences in efficacy between major psychotherapies for mild to moderate depression.

[16]

There is also a large body of evidence supporting computerized care, and psychoeducational interventions.

[17]

[18]

[19]

[20]

[21]

For patients with mild or moderate depression in natural settings, antidepressant relapse rate is high. Behavioral therapy may prevent relapses in the long-term.

[22]', '', '', 'https://www.effectindex.com/effects/depression-reduction',
        'https://psychonautwiki.org/wiki/Depression_reduction'),
       ('clvdzrvrq001j1vcvc2lf5xhh', 'Depth perception distortions', 'depth-perception-distortions', null, null, '',
        'Depth perception distortions are alterations in how a person perceives the distance of various objects within their visual field. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Depth perception distortions are alterations in how a person perceives the distance of various objects within their visual field.

[1]

During this state, the various layers of scenery can become exaggerated, skewed, or completely rearranged.

[2]

[3]

[4]

[5]

An example of this could be the swapping of layers in a given environment, in which objects in the background begin to appear as if they are in the foreground and objects in the foreground appear as if they are in the background. In other instances, the same distortion is applied to the entire visual field, such as everything appearing small and distant or large and near.

Another example of these distortions is the complete loss of depth perception.

[5]

[6]

This occurs when the different sections of a scene appear to unify into a flat 2-dimensional image regardless of their actual distance from each other and the observer.

Depth perception distortions are often accompanied by other coinciding effects, such as perspective distortions and drifting. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/depth-perception-distortions',
        'https://psychonautwiki.org/wiki/Depth_perception_distortions'),
       ('clvdzrvry001k1vcv5a3tmsi6', 'Derealization', 'derealization', null, null, '',
        'Derealization or derealisation (sometimes abbreviated as DR) is the experience of feeling detached from, and as if one is an outside observer of, one''s surroundings (e.g., individuals or objects are experienced as unreal, dreamlike, foggy, lifeless, or visually distorted). It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Derealization or derealisation (sometimes abbreviated as DR) is the experience of feeling detached from, and as if one is an outside observer of, one''s surroundings (e.g., individuals or objects are experienced as unreal, dreamlike, foggy, lifeless, or visually distorted).

[1]

It''s a type of cognitive and perceptual dysregulation.

[1]

People experiencing derealization often claim that reality persistently feels as if it is a dream, or something watched through a screen,

[2]

like a film or video game. These feelings can sometimes instill the person with a sensation of alienation and distance from those around them.

Derealization is not an inherently negative altered state of awareness, as it does not directly affect one''s emotions or thought patterns. However, derealization can sometimes be distressing to the user, who may become disoriented by the loss of the innate sense that their external environment is genuinely real. This loss of the sense that the external world is real can in some cases make interacting with it feel inherently inauthentic and pointless.

This state of mind is commonly associated with and often coincides with the very similar psychological state known as depersonalization. While derealization is a perception of the unreality of the outside world, depersonalization is a subjective experience of unreality in one''s sense of self.

Derealization is often accompanied by other coinciding effects such as anxiety and depersonalization.

[2]

It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur to a less consistent extent with any anxiety ridden drug experience or during the withdrawal symptoms of stimulants and depressants.',
        '', '', 'https://www.effectindex.com/effects/derealization', 'https://psychonautwiki.org/wiki/Derealization'),
       ('clvdzrvs7001l1vcvb4he6y0a', 'Diarrhea', 'diarrhea', null, null, '',
        'Diarrhea or diarrhoea is the condition of having at least three loose or liquid bowel movements each day.  It is most commonly induced under the influence of heavy dosages of certain psychedelic compounds, such as ayahuasca, mescaline, and psilocybin mushrooms.', 'Diarrhea or diarrhoea is the condition of having at least three loose or liquid bowel movements each day. It often lasts for a few days and can result in dehydration due to fluid loss. This can progress to decreased urination, loss of skin colour, a fast heart rate, and a decrease in responsiveness as it becomes more severe. In the context of psychoactive substance usage, certain compounds have been known to induce diarrhea or can at least increase the likelihood of it occurring. This is not as dangerous as the same condition when it occurs through infection as it only remains until the person is no longer under the influence of the drug.

Diarrhea is often accompanied by other coinciding effects such as nausea and dehydration. It is most commonly induced under the influence of heavy dosages of certain psychedelic compounds, such as ayahuasca, mescaline, and psilocybin mushrooms. However, it can also occur under the influence of certain stimulants, modafinil, and caffeine.',
        '', '', 'https://www.effectindex.com/effects/diarrhea', 'https://psychonautwiki.org/wiki/Diarrhea'),
       ('clvdzrvsh001m1vcvfq4ho1lb', 'Difficulty urinating', 'difficulty-urinating', null, null, '',
        'Difficulty urinating (also known as urinary retention) can be described as the experience of a decreased ability to pass urine. It is most commonly induced under the influence of heavy dosages of stimulant and opioid compounds, such as heroin, fentanyl, kratom, amphetamine, MDMA, and 4-FA.', 'Difficulty urinating (also known as urinary retention) can be described as the experience of a decreased ability to pass urine. This can be due to painful burning sensations within the urethra or a due to a loss of bladder control which prevents or inhibits one from urinating even with a full bladder.

Difficulty urinating is often accompanied by other coinciding effects such as stimulation and constipation. It is most commonly induced under the influence of heavy dosages of stimulant and opioid compounds, such as heroin, fentanyl, kratom, amphetamine, MDMA, and 4-FA. However, it can also occur under the influence of stimulating psychedelics and deliriants.',
        '', '', 'https://www.effectindex.com/effects/difficulty-urinating',
        'https://psychonautwiki.org/wiki/Difficulty_urinating'),
       ('clvdzrvsp001n1vcvkxjdppk6', 'Diffraction', 'diffraction', null, null, '',
        'Diffraction is the experience of seeing rainbows and spectrums of colour embedded within the brighter parts of a person''s visual field. It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Diffraction is the experience of seeing rainbows and spectrums of colour embedded within the brighter parts of a person''s visual field. This visual effect is likely due to pupil dilation, resulting in some light sources hitting the lens of the eye in a manner that appears to spread into a larger range of the spectrum rather than a consolidated wavelength.

Diffraction is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, this effect is also experienced during everyday sober living for certain people.',
        '', '', 'https://www.effectindex.com/effects/diffraction', 'https://psychonautwiki.org/wiki/Diffraction'),
       ('clvdzrvsz001o1vcvyld5rxea', 'Disinhibition', 'disinhibition', null, null, '',
        'Disinhibition is medically recognized as an orientation towards immediate gratification, leading to impulsive behavior driven by current thoughts, feelings, and external stimuli, without regard for past learning or consideration of future consequences. It is most commonly induced under the influence of moderate dosages of GABAergic depressants, such as alcohol, benzodiazepines, phenibut, and GHB.', 'Disinhibition is medically recognized as an orientation towards immediate gratification, leading to impulsive behavior driven by current thoughts, feelings, and external stimuli, without regard for past learning or consideration of future consequences.

[1]

[2]

[3]

This is usually manifested through recklessness, poor risk assessment, and a disregard for social conventions.

At its lower levels of intensity, disinhibition can allow one to overcome emotional apprehension and suppressed social skills in a manner that is moderated and controllable for the average person. This can often prove useful for those who suffer from social anxiety or a general lack of self-confidence.

However, at its higher levels of intensity, the disinhibited individual may be completely unable to maintain any semblance of self-restraint, at the expense of politeness, sensitivity, or social appropriateness. This lack of constraint can be negative, neutral, or positive depending on the individual and their current environment.

Disinhibition is often accompanied by other coinciding effects such as amnesia and anxiety suppression in a manner which can further decrease the person''s observance of and regard for social norms. It is most commonly induced under the influence of moderate dosages of GABAergic depressants, such as alcohol

[4]

, benzodiazepines

[5]

, phenibut, and GHB. However, it may also occur under the influence of certain stimulants

[6]

, entactogens

[7]

, and dissociatives

[8]', '', '', 'https://www.effectindex.com/effects/disinhibition', 'https://psychonautwiki.org/wiki/Disinhibition'),
       ('clvdzrvt9001p1vcvt8mqcv77', 'Dizziness', 'dizziness', null, null, '',
        'Dizziness can be described as the perception of a spinning or swaying motion which typically causes a difficulty in standing or walking. It is most commonly induced under the influence of heavy dosages of GABAergic depressant compounds, such as benzodiazepines, alcohol, and GHB.', 'Dizziness can be described as the perception of a spinning or swaying motion which typically causes a difficulty in standing or walking. It is commonly associated with a loss of balance and feelings of lightheadedness.

Within the medical literature, this effect is considered to be capable of manifesting itself across the 3 variations described below:

*  - The first is known as objective and refers to when the person has the sensation that objects in the environment are moving.

*  - The second is known as subjective and refers to when the person feels as if they are moving.

*  - The third is known as pseudovertigo and refers to an intensive sensation of rotation inside the person''s head.

Dizziness is often accompanied by other coinciding effects such as nausea and motor control loss. It is most commonly induced under the influence of heavy dosages of GABAergic depressant compounds, such as benzodiazepines, alcohol, and GHB. However, it can also occur to a lesser extent under the influence of heavy dosages of psychedelics, dissociatives, and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/dizziness', 'https://psychonautwiki.org/wiki/Dizziness'),
       ('clvdzrvth001q1vcvj9h1lawx', 'Dosage independent intensity', 'dosage-independent-intensity', null, null, '',
        'Dosage independent intensity is the particularly rare and inconsistent experience of spontaneously amplified psychedelic effects that are extremely disproportionate to the dosage consumed. It is most commonly induced under the influence of mild dosages of psychedelic tryptamine compounds, such as ayahuasca, psilocybin, 4-AcO-DMT, and DMT.', 'Dosage independent intensity is the particularly rare and inconsistent experience of spontaneously amplified psychedelic effects that are extremely disproportionate to the dosage consumed. For example, a user may ingest a threshold dosage but spontaneously experience high-intensity effects, such as moderate to overwhelming geometry, distortions, internal hallucinations, spirituality enhancement, and even ego death.

This experience can often feel like a defiance of normal pharmacology. It usually takes the user by surprise and most commonly occurs during the peak of the trip. Individuals who experience this effect often describe it as being very profound and intense due to its unexpected and spontaneous nature. It is also worth noting that this effect seems to be most commonly reported by users that are already somewhat experienced with the substance being consumed.

Dosage independent intensity is most commonly induced under the influence of mild dosages of psychedelic tryptamine compounds, such as ayahuasca, psilocybin, 4-AcO-DMT, and DMT.

Outside of miscalculating the amount of substance that the person is consuming, dosage independent intensity seems to be quite a rare event. However, I have heard a number of credible accounts over the years from friends, as well as a first hand experience, that truly felt as if it defied all conventional models of pharmacology.

For example, my own experience with this was under the influence of a very non-traditional ayahuasca brew. During this phase of my life, my entire circle of friends had taken to no longer bothering to brew mimosa hostilis root bark over the course of several hours into a foul tasting liquid, but were instead simply blending the product into a fine, stringy powder and masking it within banana smoothies. In conjunction with Syrian Rue taken 45 minutes beforehand, this worked incredibly well and allowed all of us to use ayahuasca in a surprisingly accessible and casual manner. On this particular night, it was my friends birthday and the two of us were planning on tripping together to celebrate it. However, when we finally got around to consuming the root bark smoothie, a single tiny strand of the root bark immediately got stuck in the back of my throat on the first sip and made me almost vomit to the point where I knew that I could not drink any further and would not be tripping tonight. I had consumed what I would estimate to be less than 1% out of what was likely in the 15 gram range of material.

However, as we waited for my friend to come up on what was quite a heavy dosage, I began to notice that I was also coming up at the same rate and intensity as him. I was experiencing incredibly intense geometry to the point where I was having trouble seeing the room around me, alongside intense visual distortions and a multitude of cognitive effects. While this was happening, I heard a voice in my head tell me that I was being allowed to trip at this level despite my miniscule dosage because it was my friends birthday and that it would be more conducive for him to have an enjoyable evening if we were both tripping. At the time, this absolutely blew my mind and continues to baffle me to this very day.

While I am not sure what could have caused this experience, I suspect it was because I had used ayahuasca several times before and that despite the dosage, some sort of unknown subconscious process was apparently both present and actively capable of allowing that door in my mind to open regardless. From what I have gathered, other accounts of this seem to follow similar themes that, in my opinion, have some potentially interesting implications in regards to how the subconscious mind can impact a psychedelic experience and to what extent.    This effect seems to be mentioned within the following trip reports:           The following people contributed to the content of this article:',
        '', '', 'https://www.effectindex.com/effects/dosage-independent-intensity',
        'https://psychonautwiki.org/wiki/Dosage_independent_intensity'),
       ('clvdzrvtw001r1vcvu1b2jnz0', 'Double vision', 'double-vision', null, null, '',
        'Double vision is the experience of seeing duplicated vision, similar to when one crosses their eyes. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as alcohol, quetiapine, ketamine, and DXM.', 'Double vision is the experience of seeing duplicated vision,

[1]

[2]

similar to when one crosses their eyes. Depending on the intensity, this effect can result in a reduced ability to function and perform basic tasks that necessitate the use of sight.

The effect can easily be suppressed by closing one eye. This suggests that double vision may occur when the brain overlays the data received from both eyes on top of each other incorrectly, failing to properly merge the information into a singular 3-dimensional image as it normally would during everyday life.

This effect is capable of manifesting across the 3 different levels of intensity described below:

Double vision is often accompanied by other coinciding effects, such as visual acuity suppression and visual agnosia. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as alcohol, quetiapine, ketamine, and DXM.

[3]

However, it can also occur much less consistently under a wide range of other classes of compounds, such as hallucinogens, stimulants, anticholinergics, SSRIs, opioids, GABAergics, and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/double-vision', 'https://psychonautwiki.org/wiki/Double_vision'),
       ('clvdzrvu3001s1vcvvm6grfql', 'Dream potentiation', 'dream-potentiation', null, null, '',
        'Dream potentiation is an effect that increases the subjective intensity, vividness, and frequency of sleeping dream states. It is most commonly induced under the influence of moderate dosages of oneirogenic compounds, a class of hallucinogen that is used to specifically potentiate dreams when taken before sleep.', 'Dream potentiation is an effect that increases the subjective intensity, vividness, and frequency of sleeping dream states.

[1]

[2]

This effect also results in dreams having a more complex and cohesive plot with a higher level of detail and definition.

[2]

Additionally, the effect causes a greatly increased likelihood of them becoming lucid dreams.

Dream potentiation is most commonly induced under the influence of moderate dosages of oneirogenic compounds, a class of hallucinogen that is used to specifically potentiate dreams when taken before sleep.

[3]

However, it can also occur as a residual side effect from falling asleep under the influence of an extremely wide variety of substances. At other times, it can occur as a relatively persistent effect that has arisen as a symptom of hallucinogen persisting perception disorder (HPPD).',
        '', '', 'https://www.effectindex.com/effects/dream-potentiation',
        'https://psychonautwiki.org/wiki/Dream_potentiation'),
       ('clvdzrvub001t1vcvkx8apkpp', 'Dream suppression', 'dream-suppression', null, null, '',
        'Dream suppression is a decrease in the vividness, intensity, frequency, and recollection of a person''s dreams. It is most commonly induced under the influence of moderate dosages of cannabinoids and most types of antidepressants.', 'Dream suppression is a decrease in the vividness, intensity, frequency, and recollection of a person''s dreams. At its lower levels, this can be a partial suppression which results in the person having dreams of a lesser intensity and a lower rate of frequency. However, at its higher levels, this can be a complete suppression which results in the person not experiencing any dreams at all.

Dream suppression is most commonly induced under the influence of moderate dosages of cannabinoids

[1]

and most types of antidepressants

[2]

[3]

[4]

. This is due to the way in which they increase REM latency, decrease REM sleep, reduce total sleep time and efficiency, and increase wakefulness.

[1]

[2]

[3]

[5]

REM sleep is where majority of dreams occur.

[6]', '', '', 'https://www.effectindex.com/effects/dream-suppression',
        'https://psychonautwiki.org/wiki/Dream_suppression'),
       ('clvdzrvuk001u1vcvj1an0970', 'Drifting', 'drifting', null, null, '',
        'Drifting is the experience of the texture, shape, and general structure of objects and scenery appearing progressively warped, melted, and morphed across themselves. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Drifting is the experience of the texture, shape, and general structure of objects and scenery appearing progressively warped, melted, and morphed across themselves.

[1]

[2]

[3]

These alterations gradually intensify as a person stares, but are temporary and will reset to normality the moment a person refocuses their gaze.

Drifting is often accompanied by other coinciding effects, such as texture liquidation and tracers.

[3]

[4]

It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of MDMA, cannabis, and certain dissociatives, such as DXM or 3-MeO-PCP.

The various subtypes of this visual effect are defined by the continuously changing direction, speed, and rhythm of the distortion. This results in a small variety of different manifestations which are defined and listed below:

Morphing can be described as a style of visual drifting that is completely disorganised and spontaneous in both its rhythm and direction. It results in objects and scenery appearing to progressively morph and warp in their size, shape, and configuration.

Breathing can be described as a style of visual drifting that results in objects and scenery appearing to steadily contract inwards and expand outwards in a consistent rhythm, similar to the lungs of a living organism.

Melting can be described as a style of visual drifting that results in the texture of objects and scenery appearing to completely or partially melt. It begins at lower intensities as a gradual distortion of an object''s texture which causes them to subtly droop, wobble, and lose their structural integrity. This gradually increases until it becomes impossible to ignore as the lines, textures, and colour between solid objects melt into one another in an extremely fluid style.

Flowing can be described as a style of visual drifting that seems to occur almost exclusively on textures (particularly if they are highly detailed, complex, or rough in appearance). It results in the textures appearing to flow like a river in a seamless, looped animation. It is particularly common on wood grain or the fur of animals.

Regardless of sub-type, this effect is capable of manifesting itself across the 4 different levels of intensity described below:',
        '', '', 'https://www.effectindex.com/effects/drifting', 'https://psychonautwiki.org/wiki/Drifting'),
       ('clvdzrvur001v1vcvzdddmqhz', 'Dry mouth', 'dry-mouth', null, null, '',
        'Dry mouth can be described as having a dry-feeling mouth often accompanied by a difficulty swallowing. It is usually a direct result of dehydration but can be felt to occur regardless of the actual dryness of a person''s mouth. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as stimulants, psychedelics, opioids, antispychotics, deliriants, SSRI''s, and cannabinoids.', 'Dry mouth (formally known as xerostomia) can be described as having a dry-feeling mouth often accompanied by a difficulty swallowing. It is usually a direct result of dehydration but can be felt to occur regardless of the actual dryness of a person''s mouth. At extreme levels, this effect can become so strong that it becomes extremely difficult and uncomfortable to swallow.

Chronic xerostomia or "dry mouth syndrome" is the regular and/or consistent experience of having a dry mouth that can result due to natural causes or as a product of the prolonged usage of mouth-drying substances. To treat this condition, substances such as cevimeline which stimulate the release of saliva are typically used. However, a problem noted with repeated use of such treatments is the overall worsening of the dry mouth symptoms over time. If the body adjusts to having chemical assistance in increasing saliva production cessation of treatment with the chemical can lead to physiological dependence wherein there is a rebound effect upon abrupt stopping of treatment.

In general, if the cause of dry mouth is due to a psychoactive substance, medication, or combination, medical treatment is not recommended. Dry mouth as an effect of substances is considered to be benign unless the effect is chronic and continues to bother or cause tooth/gum issues in the person experiencing it. As a basic harm reduction practice one should be mindful to stay consistently well hydrated, avoid breathing through the mouth, and limit substance usage if the effect becomes uncomfortable, unmanageable, or persists even when not under the influence of a psychoactive substance.

Dry mouth is often accompanied by other coinciding effects such as frequent urination (due to drinking excessive amounts of water) and dehydration. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as stimulants, psychedelics, opioids, antispychotics, deliriants, SSRI''s, and cannabinoids. It is also a common side effect of many substances, especially the combination of more than one substance which can produce or amplify already present experience of a dry mouth, which can interact significantly.',
        '', '', 'https://www.effectindex.com/effects/dry-mouth', 'https://psychonautwiki.org/wiki/Dry_mouth'),
       ('clvdzrvuy001w1vcv51id75f8', 'Ego death', 'ego-death', null, null, '',
        'Ego death (also known as ego suppression, ego loss or ego dissolution) is the temporary experience of a partial to complete disruption of a person''s sense of self, which often results in a range of profound changes to how the person perceives and interprets their otherwise usually stable sense of identity, agency, and self-hood.', 'Ego death (also known as ego suppression, ego loss or ego dissolution) is the temporary experience of a partial or complete disruption of a person''s sense of self, which often results in a range of profound changes to how the person perceives and interprets their own sense of identity and the nature of agency and self-hood.

[1]

[2]

[3]

[4]

[5]

These changes can include but are not limited to any combination of the following three subcategories.

Fear of losing control is a very common occurrence when a person who undergoes ego death is not emotionally prepared, not in an appropriate set or setting, or is simply unwilling to relinquish their sense of selfhood. During this experience, the person will often find themselves experiencing overwhelming fear and anxiety relating to the fear of losing control. This fear and anxiety is especially common in those who have not experienced ego death before.

To overcome this fear, it is recommended that the person does their best to stop fighting the loss of control, and simply surrender themselves to the experience of ego death. Upon successfully relaxing into ego death, the person will often experience a radical and positive change in their emotional state.

Ego death is well known for the transformative and significant impacts it can have on a person''s perception of both themselves and the world around them. These responses and alterations can occur during the experience of ego death, but also in the hours, days, or weeks afterwards.

A few of the most common examples of this phenomenon are described and listed below:

Within the context of psychedelic use, ego death is most commonly triggered at heavy doses by states of high level memory suppression which causes the person to forget who they are. At other times it can be triggered by or in combination with sensory overload consuming the person''s consciousness with information and overwhelming their sense of self.

Within the context of dissociative use, ego death seems to be triggered at heavy doses by increasingly intense cognitive disconnection causing a person to become dissociated from cognitive functions such as the maintenance of a sense of identity.

Psychedelic ego death usually occurs alongside states of level 6-7 geometry and internal hallucinations of an intense and often overwhelming nature. It may synergize with other coinciding effects such as personal bias suppression, unity and interconnectedness, spirituality enhancement, and delusions. These accompanying effects further elevate the subjective intensity and transpersonal significance of ego death experiences.

Dissociative ego death usually occurs alongside high level sensory disconnection and out of body experiences which may take place within voids or holes filled with hallucinatory structures. Dissociative ego death is less likely to cause an anxious response for those who are inexperienced compared to psychedelic ego death. This is because many people experience dissociatives as inherently calming and tranquil while high doses of psychedelics are quite often experienced as the opposite.

Outside of psychedelics and dissociatives, it is also possible to experience ego death under the influence of a few other classes of psychoactive compounds. For example, extremely heavy doses of deliriants such as DPH or datura can result in ego death that is accompanied by delusions, psychosis, and external hallucinations. Heavy doses of salvia divinorum are extremely effective at inducing ego death that is accompanied by bizarre internal hallucinations, autonomous entity contact, and machinescapes. Although these two classes of hallucinogens function very differently on both a subjective and neuropharmacological level, both of their variations on ego death feel as if they stem from a break down or deterioration in the brain''s ability to maintain normal levels of cognitive functioning.',
        '', '', 'https://www.effectindex.com/effects/ego-death', null),
       ('clvdzrvv4001x1vcvc5ur063d', 'Ego inflation', 'ego-inflation', null, null, '',
        'Ego inflation is an effect that magnifies and enhances one''s own ego and self-regard, resulting in the person feeling an increased sense of confidence, superiority, and general arrogance. It is most commonly induced under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants, such as methamphetamine and cocaine.', 'Ego inflation is an effect that magnifies and enhances one''s own ego and self-regard, resulting in the person feeling an increased sense of confidence, superiority, and general arrogance.

[1]

During this state, it can often feel as if one is considerably more intelligent, important, and capable in comparison to those around them. This occurs in a manner similar to the psychiatric condition known as narcissistic personality disorder.

[2]

At lower levels, this experience can result in an enhanced ability to handle social situations due to a heightened sense of confidence.

[3]

However, at higher levels, it can result in a reduced ability to handle social situations due to magnifying egoistic behavioural traits that may come across as distinctly obnoxious, narcissistic, and selfish to other people.

It is worth noting that regular and repeated long-term exposure to this effect can leave certain individuals with persistent behavioural traits of ego inflation, even when sober, within their day to day life.

Ego inflation is often accompanied by other coinciding effects, such as disinhibition, irritability, and paranoia, which can lead to destructive behaviors and violent tendencies.

[3]

It is most commonly induced under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants, such as methamphetamine and cocaine.

[1]

[3]

[4]

[5]

However, it may also occur under the influence of other compounds, such as GABAergic depressants

[1]

and certain dissociatives.', '', '', 'https://www.effectindex.com/effects/ego-inflation',
        'https://psychonautwiki.org/wiki/Ego_inflation'),
       ('clvdzrvvc001y1vcvqcark8mw', 'Ego replacement', 'ego-replacement', null, null, '',
        'Ego replacement can be described as the sudden perception that one''s sense of self and personality has been replaced with that of another person''s, a fictional character''s, an animal''s, or an inanimate object''s perspective. It is most commonly induced under the influence of moderate dosages of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Ego replacement can be described as the sudden perception that one''s sense of self and personality has been replaced with that of another person''s, a fictional character''s, an animal''s, or an inanimate object''s perspective. This can manifest in a number of ways which include but are not limited to feeling is one has literally become another human, animal, or alien consciousness. During this state, the person will be unlikely to realize that their personality has been temporarily swapped with anothers and will usually not remember their previous life.

Ego replacement is often accompanied by other coinciding effects such as delusions, psychosis, and memory suppression. It is most commonly induced under the influence of moderate dosages of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.             The following people contributed to the content of this article:',
        '', '', 'https://www.effectindex.com/effects/ego-replacement',
        'https://psychonautwiki.org/wiki/Ego_replacement'),
       ('clvdzrvvj001z1vcvc3nkw62a', 'Emotion intensification', 'emotion-intensification', null, null, '',
        'Emotion intensification is an increase in a person''s current emotional state beyond normal levels of intensity. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'This effect seems to be mentioned within the following trip reports:

I saw an angry god-like figure made of clouds glaring down at me

I was overcome with feelings about my family

A River of Gravel Drowning in my Mind', '', '', 'https://www.effectindex.com/effects/emotion-intensification',
        'https://psychonautwiki.org/wiki/Emotion_intensification'),
       ('clvdzrvvr00201vcvh5t8wcp4', 'Emotion suppression', 'emotion-suppression', null, null, '',
        'Emotion suppression (also known as flat affect, apathy, or emotional blunting) is medically recognized as a flattening or decrease in the intensity of one''s current emotional state below normal levels. It is most commonly induced under the influence of moderate dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone.', 'Emotion suppression (also known as flat affect, apathy, or emotional blunting) is medically recognized as a flattening or decrease in the intensity of one''s current emotional state below normal levels.

[1]

[2]

[3]

This dulls or suppresses the genuine emotions that a person was already feeling prior to ingesting the drug. For example, an individual who is currently feeling somewhat anxious or emotionally unstable may begin to feel very apathetic, neutral, uncaring, and emotionally blank. This also impacts the degree to which the person will express their emotional state through body language, tone of voice, and facial expressions.

It is worth noting that although a reduction in the intensity of one''s emotions may be beneficial at times (e.g., the blunting of an anger response in a volatile patient), it may be detrimental at other times (e.g., emotional indifference at the funeral of a close family member).

[4]

Emotion suppression is often accompanied by other coinciding effects such as motivation suppression, thought-deceleration, and analysis suppression. It is most commonly induced under the influence of moderate dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone.

[1]

[5]

However, it can also occur in less consistent form under the influence of heavy dosages of dissociatives

[6]

[7]

, SSRI''s

[4]

[8]

, and GABAergic depressants

[9]', '', '', 'https://www.effectindex.com/effects/emotion-suppression',
        'https://psychonautwiki.org/wiki/Emotion_suppression'),
       ('clvdzrvw000211vcvs0xsy797', 'Empathy, affection, and sociability enhancement',
        'empathy-affection-and-sociability-enhancement', null, null, '',
        'Empathy, affection, and sociability enhancement is the experience of a mind state that is dominated by intense feelings of compassion, talkativeness, and happiness. It is most commonly induced under the influence of moderate dosages of entactogenic compounds, such as MDMA, 4-FA, and 2C-B.', 'Empathy, affection, and sociability enhancement is the experience of a mind state that is dominated by intense feelings of compassion, talkativeness, and happiness.

[1]

[2]

[3]

The experience of this effect creates a wide range of subjective changes to a person''s perception of their feelings towards other people and themselves. These are described and documented in the list below:

*  Increased sociability and the feeling that communication comes easier and more naturally.

*  Increased urge to communicate or express one''s affectionate feelings towards others, even if they happen to be strangers.

*  Increased feelings of empathy, love, and connection with others.

*  Decreased negative emotions and mental states such as stress, anxiety, and fear.

*  Decreased insecurity, defensiveness, and fear of emotional injury or rejection from others.

Empathy, affection, and sociability enhancement is often accompanied by other coinciding effects, such as stimulation, personal bias suppression, motivation enhancement, and anxiety suppression. It is most commonly induced under the influence of moderate dosages of entactogenic compounds, such as MDMA

[4]

[5]

, 4-FA

[6]

[7]

, and 2C-B

[8]

[9]

. However, it can also subtly occur to a much lesser extent under the influence of GABAergic depressants and certain stimulants.

[10]', '', '', 'https://www.effectindex.com/effects/empathy-affection-and-sociability-enhancement', null),
       ('clvdzrvw900221vcv6jyle6hh', 'Enhancement and suppression cycles', 'enhancement-and-suppression-cycles', null,
        null, '', 'Enhancement and suppression cycles is an effect which results in two opposite states of mind that do not occur simultaneously but instead swap between each other at seemingly random intervals. The first of these two alternate states can be described as the experience of cognitive enhancements which feel is if they drastically improve the person''s ability to think clearly. The second of these two alternate states can be described as the experience of a range of cognitive suppressions which feel as if they drastically inhibit the person''s ability to think clearly.

They are most commonly induced under the influence of heavy dosages of psychedelic tryptamines, such as psilocybin, ayahuasca, and 4-AcO-DMT.', 'Enhancement and suppression cycles is an effect which results in two opposite states of mind that do not occur simultaneously but instead swap between each other at seemingly random intervals. These intervals are generally 10-30 minutes in length but can occasionally be considerably shorter.

The first of these two alternate states can be described as the experience of cognitive enhancements which feel is if they drastically improve the person''s ability to think clearly. This includes analysis enhancement, thought organization, thought acceleration, creativity enhancement, and thought connectivity.

The second of these two alternate states can be described as the experience of a range of cognitive suppressions which feel as if they drastically inhibit the person''s ability to think clearly. These typically include specific effects such as thought deceleration, thought disorganization, creativity suppression, language suppression, and analysis suppression.

Enhancement and suppression cycles are most commonly induced under the influence of heavy dosages of psychedelic tryptamines, such as psilocybin, ayahuasca, and 4-AcO-DMT.',
        '', '', 'https://www.effectindex.com/effects/enhancement-and-suppression-cycles',
        'https://psychonautwiki.org/wiki/Enhancement_and_suppression_cycles'),
       ('clvdzrvwf00231vcvc1nobbgl', 'Environmental cubism', 'environmental-cubism', null, null, '',
        'Environmental cubism is a visual segmentation of the external environment into squares and cubes of varying amounts and sizes. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Environmental cubism is a visual segmentation of the external environment into squares and cubes of varying amounts and sizes.

[1]

Once established, these segments can begin to slowly drift away from their original location and will often change in size, leaving gaps in-between them. The space within these gaps can either be completely dark or composed of tightly bound visual geometry. This effect is remarkably similar in its appearance to cubist photography and artwork.

This dark space can eventually grow, progressively decreasing the size of the cubes until a person finds themselves surrounded by a dissociative hole. It is not uncommon to be able to innately feel and detect the details and layout of both the different sections of the distortion and the gaps between them.

Environmental cubism is often accompanied by other coinciding effects, such as scenery slicing and visual disconnection. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/environmental-cubism',
        'https://psychonautwiki.org/wiki/Environmental_cubism'),
       ('clvdzrvwm00241vcva1xlamqu', 'Environmental patterning', 'environmental-patterning', null, null, '',
        'Environmental patterning is the experience of certain textures or objects, such as carpets, clouds, and dense vegetation, drifting into increasingly complex geometric patterns that are clearly comprised of the original material they are manifesting from. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Environmental patterning is the experience of certain textures or objects, such as carpets, clouds, and dense vegetation, shifting into increasingly complex geometric patterns that are clearly comprised of the original material they are manifesting from. These structures can be symmetrical in nature, but often include form constants, fractals, and disorganised geometric patterns.

Although similar in appearance, environmental patterning is distinct from that of geometry due to the way in which the geometric forms it produces are consistently comprised of pre-existing sensory data from within the external environment. In contrast, more standard geometry is largely separate from it''s environment and is at most merely overlaid onto its surfaces instead of being entirely comprised of its materials.

Environmental patterning is often accompanied by other coinciding effects such as symmetrical texture repetition, geometry, and drifting. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/environmental-patterning',
        'https://psychonautwiki.org/wiki/Environmental_patterning'),
       ('clvdzrvwt00251vcvb8irzzqh', 'Excessive yawning', 'excessive-yawning', null, null, '',
        'Excessive yawning can be described as the experience of repeated, intensified, overly frequent, and spontaneous yawning despite a complete absence of genuine sedation or sleepiness. It is most commonly induced under the influence of moderate dosages of tryptamine psychedelic compounds, such as psilocybin, 4-AcO-DMT, 4-HO-MET, and ayahuasca.', 'Excessive yawning can be described as the experience of repeated, intensified, overly frequent, and spontaneous yawning despite a complete absence of genuine sedation or sleepiness.

Excessive yawning is often accompanied by other coinciding effects such as increased salivation and a runny nose. It is most commonly induced under the influence of moderate dosages of tryptamine psychedelics compounds, such as psilocybin, 4-AcO-DMT, 4-HO-MET, and ayahuasca.',
        '', '', 'https://www.effectindex.com/effects/excessive-yawning',
        'https://psychonautwiki.org/wiki/Excessive_yawning'),
       ('clvdzrvwz00261vcvb3vzvk1u', 'Existential self-realization', 'existential-self-realization', null, null, '',
        'Existential self-realization can be described as a sudden realization, revelation, or reaffirmation of a person''s existence within this universe. Existential self-realization is most commonly induced under the influence of moderate dosages of psychedelic and dissociative compounds such as ketamine, LSD, 4-AcO-DMT, and DCK.', 'Existential self-realization can be described as a sudden realization, revelation, or reaffirmation of a person''s existence within this world. This typically feels like a sudden and profound "waking up" or "rebirth" that results in an intense sense of motivation, an added sense of purpose to one’s life, a sudden comprehension of their own situation, an appreciation for life, and a sense of urgency to make the most out of it while it lasts. During this state, no new knowledge is learned but the previously known information regarding their existence is reintegrated in a sudden and profound manner that results in a deep sense of appreciation for the unlikely circumstances of their own existence. The residual impacts of this effect often carry over into sobriety, potentially resulting in lasting positive benefits for the person.

Existential self-realization is most commonly induced under the influence of moderate dosages of psychedelic and dissociatives compounds such as ketamine, LSD, 4-AcO-DMT, and DCK. However, it can also occur to a lesser extent after near-death experiences and under the influence of entacogens such as MDMA.',
        '', '', 'https://www.effectindex.com/effects/existential-self-realization',
        'https://psychonautwiki.org/wiki/Existential_self-realization'),
       ('clvdzrvxa00271vcvwdskey8x', 'External hallucination', 'external-hallucination', null, null, '',
        'An external hallucination is the perception of a visual hallucination that displays itself seamlessly into the external environment as if it were physically present. They are most commonly induced under the influence of heavy dosages of deliriant compounds.', 'An external hallucination is the perception of a visual hallucination that displays itself seamlessly into the external environment as if it were physically present.

[1]

[2]

This is in stark contrast to internal hallucinations, such as dreams, that occur exclusively within an imagined environment and can typically only be viewed with closed eyes.

This effect is capable of manifesting itself across the 4 different levels of intensity described below:

Alongside a specific levelling system, there are also environmental factors that directly alter both the likelihood of external hallucinations manifesting themselves and the level of detail they are rendered at. For example, the more unfamiliar with the external environment a person is, the more likely it is that this effect will manifest itself. Cluttered areas tend to produce more external hallucinations. The amount of light within a room is inversely proportional to the intensity of them, with less light leading to significantly more hallucinations and more light leading to fewer, although more detailed, hallucinations.

The content within these external hallucinations can be further broken down into four distinct subcomponents. These are described and documented within their own dedicated articles, each of which are listed below:

It is worth noting that the content, style, and general behaviour of an external hallucination is often largely dependent on the emotional state of the person experiencing it. For example, a person who is emotionally stable and generally happy will usually be more prone to experiencing neutral, interesting, or positive hallucinations. In contrast, a person who is emotionally unstable and generally unhappy will usually be more prone to experiencing sinister, fear-inducing, and negative hallucinations.

External hallucinations are often accompanied by other coinciding effects such as delirium, internal hallucinations and delusions. They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine. However, they can also occur less commonly under the influence of psychedelics, dissociatives, stimulant psychosis, and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/external-hallucination',
        'https://psychonautwiki.org/wiki/External_hallucination'),
       ('clvdzrvxj00281vcv2sx4f3xj', 'Feelings of impending doom', 'feelings-of-impending-doom', null, null, '',
        'Feelings of impending doom can be described as sudden sensations of overwhelming fear and urgency based upon the unfounded belief that a negative event is about to occur in the immediate future. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Feelings of impending doom can be described as sudden sensations of overwhelming fear and urgency based upon the unfounded belief that a negative event is about to occur in the immediate future.

[1]

[2]

These expected negative events typically include some kind of medical emergency, a person''s death, or the world coming to an end. This effect can be the result of real evidence but is usually based on an unfounded delusion or negative hallucinations. The intensity of these feelings can range from subtle to overwhelming enough to trigger panic attacks and a strong sense of urgency.

Feelings of impending doom are often accompanied by other coinciding effects such as anxiety and unspeakable horrors. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, they can also occur during medical issues, cardiac arrest, mental illness, or interpersonal problems.

[3]', '', '', 'https://www.effectindex.com/effects/feelings-of-impending-doom',
        'https://psychonautwiki.org/wiki/Feelings_of_impending_doom'),
       ('clvdzrvxs00291vcvswlwwpfr', 'Field of view alteration', 'field-of-view-alteration', null, null, '',
        'Field of view alteration is the experience of a perceived change in the open observable area a person can visibly see. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Field of view alteration is the experience of a perceived change in the observable open area a person can visibly see. This commonly results in visual distortions most commonly compared to that of fisheye lens photography or "seeing the world through that of a fishbowl". In addition to this, the effect can also manifest in the form of seeing the world with a horizontally wider field of view that is comparable to that of a panoramic photo, or with an entirely reduced field of view that is commonly referred to as "tunnel vision".

However, it is worth noting that since a drug-induced increase in one''s visible field of view is most likely a physiological impossibility, it suggests that this effect is simply an optical illusion that merely distorts the appearance of a person''s visual perception.

Field of view alteration is often accompanied by other coinciding effects, such as acuity enhancement and depth perception distortions. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/field-of-view-alteration', null),
       ('clvdzrvy2002a1vcvuqdp5bd1', 'Focus enhancement', 'focus-enhancement', null, null, '',
        'Focus enhancement is the experience of an increased ability to selectively concentrate on an aspect of the environment while ignoring other things. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, modafinil, and caffeine', 'Focus enhancement is the experience of an increased ability to selectively concentrate on an aspect of the environment while ignoring other things. These feelings of intense concentration can allow one to continuously focus on and perform tasks that would otherwise be considered too monotonous, boring, or dull to not get distracted from.

[1]

[2]

The degree of focus induced by this effect can be much stronger than what a person is capable of sober. It can allow for hours of effortless, single-minded, and continuous focus on a particular activity to the exclusion of all other considerations such as eating and attending to bodily functions. Although focus enhancement can improve a person’s ability to engage in tasks and use time effectively, it is worth noting that it can also cause a person to focus intensely and spend excess time on unimportant activities.

Focus enhancement is often accompanied by other coinciding effects, such as motivation enhancement, thought acceleration, and stimulation. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine

[3]

. methylphenidate

[4]

, modafinil

[5]

, and caffeine

[6]

[7]

. However, the same compounds that induce this mind state at moderate dosages will also often result in the opposite effect of focus suppression at heavier dosages.

[8]', '', '', 'https://www.effectindex.com/effects/focus-enhancement', null),
       ('clvdzrvya002b1vcvuz5qm7yw', 'Focus suppression', 'focus-suppression', null, null, '',
        'Focus suppression is medically recognized as a decreased ability to selectively concentrate on an aspect of the environment while ignoring other things. It is most commonly induced under the influence of moderate or heavy dosages of antipsychotics, benzodiazepines, cannabinoids, and hallucinogens.', 'Lleras, A., Buetti, S., & Mordkoff, J. T. (2013). When Do the Effects of Distractors Provide a Measure of Distractibility?. In Psychology of Learning and Motivation (Vol. 59, pp. 261-315). Academic Press.

https://doi.org/10.1016/B978-0-12-407187-2.00007-1', '', '', 'https://www.effectindex.com/effects/focus-suppression',
        'https://psychonautwiki.org/wiki/Focus_suppression'),
       ('clvdzrvyi002c1vcvm2eb64yf', 'Frame rate suppression', 'frame-rate-suppression', null, null, '',
        'Frame rate suppression is the perceived reduction in speed at which visual information is processed.  It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, MXE, PCP, and DXM.', 'Frame rate suppression is the perceived reduction in speed at which visual information is processed.

[1]

While under the influence of this effect, one may feel as if their vision is lagging and displaying in a manner similar to a buffering video, a stop-motion animation, film strip, a computer monitor, or a strobe light. At higher levels of intensity, it can result in a person''s vision temporarily ceasing to move all together as if it has frozen. It is also worth noting that this effect is comparable to, but not necessarily related to, the visual disorder known as motion blindness or akinetopsia.

[2]

Frame rate suppression is often accompanied by other coinciding effects, such as acuity suppression and double vision. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, MXE, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/frame-rate-suppression', null),
       ('clvdzrvyo002d1vcv9jv3x17i', 'Frequent urination', 'frequent-urination', null, null, '',
        'Frequent urination, or urinary frequency, can be defined as the need to urinate more often than usual. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as stimulants, psychedelics, dissociatives, and deliriants.', 'Frequent urination, or urinary frequency, can be defined as the need to urinate more often than usual. It is often, though not necessarily, associated with urinary incontinence and large total volumes of urine. However, in other cases, urinary frequency involves only normal volumes of urine overall.

Frequent urination is often accompanied by other coinciding effects such as dehydration and dry mouth in a manner which further amplifies the needs to urinate through excessive consumption of water. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as stimulants, psychedelics, dissociatives, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/frequent-urination',
        'https://psychonautwiki.org/wiki/Frequent_urination'),
       ('clvdzrvyv002e1vcvhxalkftc', 'Gait alteration', 'gait-alteration', null, null, '',
        'Gait alteration is a change in the manner that a person walks and generally moves about throughout their environment. It is most commonly induced under the influence of moderate dosages of dissociatives such as ketamine, and especially DXM.', 'Gait alteration is a change in the manner that a person walks and generally moves about throughout their environment. Depending on the substance, this can often be described as walking in a "robotic", "mechanical", or "zombie-like" manner that although unusual in appearance, does not necessarily impede the person''s ability to exert coordination or fine motor control.

Gait alteration is often accompanied by other coinciding effects such as motor control loss and sedation. It is most commonly induced under the influence of moderate dosages of dissociatives such as ketamine, and especially DXM.

[1]

However, it may also occur to a lesser extent under the influence of other compounds such as depressants, psychedelics and deliriants.',
        '', '', 'https://www.effectindex.com/effects/gait-alteration',
        'https://psychonautwiki.org/wiki/Gait_alteration'),
       ('clvdzrvz2002f1vcvgbmroqnw', 'Geometry', 'geometry', null, null, '',
        'Geometry is the experience of a person''s field of vision becoming partially or completely encompassed by fast-moving, colourful, and extremely complex geometric patterns, form constants, shapes, fractals, and colours.', 'Visual geometry was the aspect of the psychedelic experience that most quickly convinced me that these substances are incredibly profound and essential .tools for humanity. Almost a decade ago as a young 17-year-old undergoing my first couple of hallucinogenic experiences, I found myself immediately fascinated by the sheer incomprehensibility of the beautiful patterns which my mind was producing. Not only were these geometric patterns complex beyond anything I had ever seen, but they were so impossibly complex in their forms that I perhaps naively believed if even a short recording of high-level geometry could be somehow brought back to the real world, it would change the face of society forever.

Based on my personal experiences, I firmly believe that geometry is not simply another form of hallucination, but instead a result of neurological signals and processes from various regions of the brain bleeding into the visual cortex and being reinterpreted as complex geometric forms in a manner which is comparable to that of synaesthesia. This would explain multiple aspects of the effects behaviour, such as the way in which geometry commonly feels as if it is an innately understandable visual representation of one''s emotional state, sensory input, and even complex concepts or thoughts. If this is true, it implies that psychedelic geometry is the profound experience of being able to indirectly see the hidden architecture and complex programming of human consciousness.

Another aspect of geometry that myself and others have found very intriguing is that psychedelic geometry often follows the aesthetic themes of various artwork and writing styles from historical societies, such as Aztecs, Mayans, Egyptians, Tibetans, etc.

Based purely upon my own potentially flawed speculation, there are a couple of relatively plausible explanations behind this. Perhaps our culture simply associates psychedelia with mysticism and ancient societies in a manner which results in these themes displaying themselves within our collective experience of psychedelic geometry. Perhaps these societies experienced the very same imagery under the influence of psychedelic plants and took inspiration from this within their artwork, architecture, and alphabets. Maybe psychedelic geometry manifests itself in a manner which is, on some level, a visual representation of the same neurological processes that allowed ancient humans to create language and artwork in the first place, thus generating a variety of somewhat consistent aesthetic themes throughout the humans that experience them, regardless of their cultural or historical context.

Nevertheless, none of these speculative ideas feel particularly satisfactory to me, but I do still hope that this particular aspect of psychedelic geometry is more closely examined and understood on a a scientific level within my lifetime.',
        '', '', 'https://www.effectindex.com/effects/geometry', 'https://psychonautwiki.org/wiki/Geometry'),
       ('clvdzrvz9002g1vcve8tf4usf', 'Geometry Video Script', 'geometry-video-script', null, null, '', '', '', '', '',
        'https://www.effectindex.com/effects/geometry-video-script', null),
       ('clvdzrvzg002h1vcv7nblx1o2', 'Glossolalia', 'glossolalia', null, null, '',
        'Glossolalia is an effect in which a person finds themselves involuntarily speaking and/or thinking in nonsensical speech which is structured in a manner that resembles an actual language. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, deliriants, and dissociatives.', 'Glossolalia is an effect in which a person finds themselves involuntarily speaking and/or thinking in nonsensical speech which is structured in a manner that resembles an actual language.

[1]

[2]

This is often defined by linguists as a melodic and fluid vocalizing of speech-like syllables that lack any readily comprehended meaning.

[3]

[4]

It is important to note that this effect is distinctly different from the thought disorganization characterized by a schizophrenic''s word salad.

[2]

[3]

Although there is a litany of research describing this effect in a religious context, this setting is not required; two types of glossolalia have been suggested:

[2]

[5]

*   Occurs in private, mundane settings. Context-dependent with the person self-aware while ‘speaking’ i.e. they can attend to other claims on attention. Appears frequently (daily or several times weekly).

*  Occurs in public settings as an intense uprush of vocalizations that is a product of a religious altered state. This person is not self-aware and cannot attend to others'' claims on attention. Appears occasionally (weekly or less).

During the experience of this effect, it''s possible the person who is speaking will be completely unaware that they are speaking in anything but their native language. This can result in confusion and frustration as they struggle to understand why the people around cannot comprehend what they are saying.

Glossolalia is often accompanied by other coinciding effects such as language suppression, catharsis, spirituality enhancement, and delirium. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, deliriants, and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/glossolalia', null),
       ('clvdzrvzn002i1vcvf7ps4zay', 'Gustatory enhancement', 'gustatory-enhancement', null, null, '',
        'Gustatory enhancement is the experience of tastes becoming significantly richer, stronger, and more noticeable than that of everyday sobriety. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur under the influence of cannabinoids and stimulants', 'Gustatory enhancement is the experience of tastes becoming significantly richer, stronger, and more noticeable than they would be during everyday sobriety. This experience can either be positive or negative depending on the substance, the taste, and the person''s prior opinion of the taste. For example, while certain tastes may become a true delight in a manner that results in appetite enhancement, other tastes may become overpowering in an unpleasant manner, which can potentially trigger nausea or even vomiting.

Gustatory enhancement is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur under the influence of cannabinoids and stimulants.',
        '', '', 'https://www.effectindex.com/effects/gustatory-enhancement', null),
       ('clvdzrvzv002j1vcvnqcph59h', 'Gustatory hallucination', 'gustatory-hallucination', null, null, '',
        'A gustatory hallucination is any hallucination that involves one''s sense of taste. A common example of this is a strong, unpleasant metallic taste in one''s mouth. They are most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'A gustatory hallucination is any hallucination that involves one''s sense of taste.

[1]

A common example of this is a strong, unpleasant metallic taste in one''s mouth. Another example is a strong sweet taste in one''s saliva, which makes it taste like molten sugar. These types of hallucinations can cover a wide range of potential tastes and are relatively uncommon compared to other types of hallucinations. They can be either pleasant or unpleasant, depending on the users like or dislike of the given taste.

Gustatory hallucinations are most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/gustatory-hallucination',
        'https://psychonautwiki.org/wiki/Gustatory_hallucination'),
       ('clvdzrw01002k1vcvnsnw1mms', 'Gustatory suppression', 'gustatory-suppression', null, null, '',
        'Gustatory suppression is the experience of tastes becoming significantly vaguer, weaker, and less noticeable than they would be during everyday sobriety. At higher levels, this can result in food becoming completely tasteless and significantly less appealing. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Gustatory suppression is the experience of tastes becoming significantly vaguer, weaker, and less noticeable than they would be during everyday sobriety. At higher levels, this can result in food becoming completely tasteless and significantly less appealing.

Gustatory suppression is often accompanied by other coinciding effects, such as tactile suppression and pain relief. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur under the influence of depressants, such as opioids and antipsychotics.',
        '', '', 'https://www.effectindex.com/effects/gustatory-suppression', null),
       ('clvdzrw0a002l1vcvkhlx17nk', 'Identity alteration', 'identity-alteration', null, null, '',
        'Identity alteration can be defined as the experience of one''s sense of self becoming temporarily changed to feel as if it is comprised of different concepts than that which it previously did. This most commonly occurs during intense states of focus, meditation, or under the influence of hallucinogens such as psychedelics.',
        'This effect seems to be mentioned within the following trip reports:           The following people contributed to the content of this article:',
        '', '', 'https://www.effectindex.com/effects/identity-alteration',
        'https://psychonautwiki.org/wiki/Identity_alteration'),
       ('clvdzrw0h002m1vcvfymlyqr4', 'Immersion enhancement', 'immersion-enhancement', null, null, '',
        'Immersion enhancement is an effect that results in a pronounced increase in one''s tendency to become fully captivated and engrossed by external stimuli, such as film, TV shows, video games, and various other forms of media. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Immersion enhancement is an effect that results in a pronounced increase in one''s tendency to become fully captivated and engrossed by external stimuli, such as film, TV shows, video games, and various other forms of media.

[1]

[2]

[3]

[4]

This greatly increases one''s suspension of disbelief, increases one’s empathy with the characters, suppresses one''s memory of the "outside world", and allows one to become engaged on a level that is largely unattainable during everyday sober living.

At its highest point of intensity, immersion enhancement can reach a level at which a person begins to truly believe the media they are consuming is a real-life event that is actually occurring in front of them or being relayed through a screen. This is likely a result of the effect synergizing with other accompanying components, such as internal or external hallucinations, delusions, memory suppression, and increased suggestibility. Immersion enhancement often exaggerates the emotional response a person has towards media they are engaged with. Whether or not this experience is enjoyable can differ drastically depending on various factors, such as the emotional tone and familiarity of what is being perceived.

Immersion enhancement is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur to a lesser extent under the influence of psychedelics

[4]

and cannabinoids.', '', '', 'https://www.effectindex.com/effects/immersion-enhancement', null),
       ('clvdzrw0o002n1vcvtvn8tj7p', 'Increased blood pressure', 'increased-blood-pressure', null, null, '',
        'Increased blood pressure can be described as a condition in which the pressure in the systemic arteries is elevated to abnormal levels. It is most commonly induced under the influence of heavy dosages of deliriants and vasoconstricting compounds, such as traditional stimulants and stimulating psychedelics.', 'Increased blood pressure can be described as a condition in which the pressure in the systemic arteries is elevated to abnormal levels. A blood pressure of 120/80 is considered normal for an adult. A blood pressure of 90/60 or lower is considered hypotension and a blood pressure between 120/80 and 90/60 is considered prehypotension.

[1]

Conversely a blood pressure greater than 120/80 and less than 139/89 is considered prehypertension.

[2]

Within the medical literature, a situation in which a person''s blood pressure is very high (e.g., >180/>110 mmHg) with minimal or no symptoms, and no signs or symptoms indicating acute organ damage is referred to as a "hypertensive urgency".

[3]

[4]

In contrast, a situation where severe blood pressure is accompanied by evidence of progressive organ or system damage is referred to as a "hypertensive emergency".

[5]

Increased blood pressure is most commonly induced under the influence of heavy dosages of deliriants and vasoconstricting compounds, such as traditional stimulants and stimulating psychedelics.',
        '', '', 'https://www.effectindex.com/effects/increased-blood-pressure',
        'https://psychonautwiki.org/wiki/Increased_blood_pressure'),
       ('clvdzrw0w002o1vcvmszl71wo', 'Increased bodily temperature', 'increased-bodily-temperature', null, null, '',
        'Increased bodily temperature or pyrexia can be described as having a body temperature which is above normal baseline. It is most commonly induced under the influence of heavy dosages of stimulant compounds which affect serotonin and 5-HT receptors, dopamine and D receptors and norepinephrine.', 'Increased bodily temperature or pyrexia can be described as having a body temperature which is above the normal baseline.

[1]

While there is no universally agreed upon value at which pyrexia occurs, its diagnoses ranges between 37.5 - 38.3°C (99.5 - 100.9°F).

[2]

For comparison, the average temperature of a healthy person is around 37°C (98.6°F). It is worth noting that a bodily temperature which exceeds 41.5°C (106.7°F) is an emergency which requires immediate medical attention and can potentially result in physical injury, long-term side effects, and death.

[3]

This effect is capable of manifesting itself in the two different forms which are described below:

*  is used to describe the body raising its core temperature due to illness. For example, a fever may be caused by a bacterial infection.

*  is classified as an uncontrollable increase in body temperature that typically originates from an external source. This most frequently involves heat strokes or the use of certain drugs.

Increased bodily temperature is often accompanied by other coinciding effects such as increased perspiration, dehydration, headaches, and serotonin syndrome. It is most commonly induced under the influence of heavy dosages of stimulant compounds which affect serotonin and 5-HT receptors

[4]

, dopamine and D receptors

[5]

and norepinephrine

[6]

. These substances include amphetamine, methylphenidate, MDMA, and cocaine. However, it can also occur under the influence of deliriants and certain stimulating psychedelics such as AMT, 2C-P, and DOC.',
        '', '', 'https://www.effectindex.com/effects/increased-bodily-temperature',
        'https://psychonautwiki.org/wiki/Increased_bodily_temperature'),
       ('clvdzrw13002p1vcvd7a5u0po', 'Increased heart rate', 'increased-heart-rate', null, null, '',
        'Increased heart rate or tachycardia is described as a heart rate that is faster than the normal heart rate at rest. It is most commonly induced under the influence of heavy dosages of stimulating compounds, such as traditional stimulants, certain psychedelics, and certain dissociatives.', 'Increased heart rate or tachycardia is described as a heart rate that is faster than the normal heart rate at rest. The average healthy human heart normally beats 60 to 100 times a minute when a person is at rest.

[1]

When the heart rate fluctuates to higher levels over 100 BPM, it is described as tachychardia or an abnormally high heart rate.

It is worth noting that increased heart rate can often be a result of psychological symptoms as a natural adrenal response to anxiety, paranoia, shock, and fear.

Increased heart rate is most commonly induced under the influence of heavy dosages of stimulating compounds, such as traditional stimulants, certain psychedelics, and certain dissociatives. This is thought to occur as a direct result of dopaminergic or adrenergic modulation.

[2]

[3]

However, it can also occur under the influence of deliriants due to the way in which they inhibit acetylcholine, one of the main modulators of heart rate in the peripheral nervous system.

[4]

[5]', '', '', 'https://www.effectindex.com/effects/increased-heart-rate',
        'https://psychonautwiki.org/wiki/Increased_heart_rate'),
       ('clvdzrw1a002q1vcvnkfl4mbi', 'Increased libido', 'increased-libido', null, null, '',
        'Increased libido can be described as a distinct increase in feelings of sexual desire, the anticipation of sexual activity, and the likelihood that a person will view the context of a given situation as sexual in nature. It is most commonly induced under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants such as methamphetamine and cocaine.', 'Increased libido can be described as a distinct increase in feelings of sexual desire, the anticipation of sexual activity, and the likelihood that a person will view the context of a given situation as sexual in nature.

[1]

[2]

When experienced, this sensation is not overwhelming or out of control, but simply remains something that one is constantly aware of.

Increased libido is often accompanied by other coinciding effects such as tactile enhancement, and stimulation in a manner which can lead to greatly intensified feelings of sexual pleasure. It is most commonly induced under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants such as methamphetamine

[3]

and cocaine

[4]

. However, it may also occur under the influence of other compounds such as GABAergic depressants and psychedelics.',
        '', '', 'https://www.effectindex.com/effects/increased-libido',
        'https://psychonautwiki.org/wiki/Increased_libido'),
       ('clvdzrw1j002r1vcv8boto6ve', 'Increased music appreciation', 'increased-music-appreciation', null, null, '',
        'Increased music appreciation is a general sense of an increased enjoyment of music. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics,  dissociatives,  and cannabinoids', 'Increased music appreciation is a general sense of an increased enjoyment of music. When music is listened to during this state, not only does it subjectively sound better, but the perceived music and lyrical content may have a profound impact on the listener.

[1]

[2]

[3]

[4]

[5]

[6]

This experience can give one a sense of hyper-awareness of every sound, lyric, melody, and complex layer of noise within a song in addition to an enhanced ability to individually comprehend their significance and interplay. The perceived emotional intent of the musician and the meaning of the music may also be felt in a greater level of clarity than it would be during everyday sober living.

[3]

This effect can result in the belief, legitimate or delusional, that one has connected with the “true meaning” or “spirit” behind an artist’s song. During particularly enjoyable songs, this effect can result in feelings of overwhelming harmony

[5]

and a general sense of appreciation that can leave the person with a deep sense of connection towards the artist they are listening to.

Increased music appreciation is commonly mistaken as a purely auditory effect, but it is more likely the result of several coinciding components, such as novelty enhancement, personal meaning enhancement, emotion intensification, and auditory enhancement. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics

[1]

[4]

[7]

,  dissociatives

[8]

,  and cannabinoids

[3]

.  However, it can also occur to a lesser extent under the influence of stimulants

[3]

[7]

and GABAergic depressants.', '', '', 'https://www.effectindex.com/effects/increased-music-appreciation',
        'https://psychonautwiki.org/wiki/Increased_music_appreciation'),
       ('clvdzrw1s002s1vcvko5a3vft', 'Increased pareidolia', 'increased-pareidolia', null, null, '',
        'Increased pareidolia is an increase in a person''s ability and tendency to recognise patterns (usually faces) within vague stimuli. It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Increased pareidolia is an often drastic enhancement of a person''s ability and tendency to recognise patterns and meaning within vague stimuli, such as seeing shapes in clouds and seeing faces in inanimate objects or abstract patterns.

[4]

Seeing patterns that resemble human faces is an innate ability humans possess in everyday life and is well documented in scientific literature under the term pareidolia.

[1]

[2]

[3]

However, during this effect, pareidolia can be significantly more pronounced than it would usually be during a sober state.

[5]

[6]

For example, remarkably detailed images may appear embedded in scenery, everyday objects may look like faces, and clouds may appear as fantastical objects, all without any visual alterations taking place. Once an image has been perceived within an object or landscape, the mind may further exaggerate this recognition through the hallucinatory effect known as transformations, which goes beyond pareidolia and becomes a more standard visual hallucination.

Increased pareidolia is often accompanied by other coinciding effects, such as visual acuity enhancement and colour enhancement.

[7]

[8]

It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/increased-pareidolia', null),
       ('clvdzrw22002t1vcvvs4q45qv', 'Increased perspiration', 'increased-perspiration', null, null, '',
        'Increased perspiration, or hyperhidrosis, can be described as a condition characterized by increased sweat which is in excess of that required for the regulation of body temperature. It is most commonly induced under the influence of stimulants, psychedelics, and benzodiapine or alcohol withdrawals.', 'Increased perspiration, or hyperhidrosis, can be described as a condition characterized by increased sweat which is in excess of that required for the regulation of body temperature.

Increased perspiration is a hallmark symptom of sympathetic arousal (the "fight-or-flight" response) and is a common effect of stimulant drugs. Any psychoactive drug which exerts considerable serotonergic, dopaminergic, or adrenergic effects may cause increased perspiration. It is also a common symptom of benzodiazepine and alcohol withdrawal.

[1]

Cholinergic and, to a lesser extent, opioids have been additionally implicated in causing this as well.', '', '',
        'https://www.effectindex.com/effects/increased-perspiration',
        'https://psychonautwiki.org/wiki/Increased_perspiration'),
       ('clvdzrw29002u1vcv79e3zu1e', 'Increased phlegm production', 'increased-phlegm-production', null, null, '',
        'Increased phlegm production can be described as the experience of the throat and respiratory system producing excessive amounts of mucous fluid that is often expelled via coughing.  It is most commonly induced under the influence of heavy dosages of tryptamine psychedelic compounds, such as psilocybin, 5-MeO-MiPT, 4-AcO-DMT, and 4-HO-MET.', 'Increased phlegm production can be described as the experience of the throat and respiratory system producing excessive amounts of mucous fluid that is often expelled via coughing. This typically feels as if a person''s throat and the back of the mouth are becoming repeatedly filled with a thick slime like substance which needs to be either periodically swallowed or spat out to avoid discomfort.

Increased phlegm production is often accompanied by other coinciding effects such as excessive yawning, increased salivation, a runny nose, and watery eyes. It is most commonly induced under the influence of heavy dosages of tryptamine psychedelic compounds, such as psilocybin, 5-MeO-MiPT, 4-AcO-DMT, and 4-HO-MET.',
        '', '', 'https://www.effectindex.com/effects/increased-phlegm-production', null),
       ('clvdzrw2f002v1vcv5dpybotw', 'Increased salivation', 'increased-salivation', null, null, '',
        'Increased salivation can be described as the production and excretion of excess saliva within the mouth, which may also be caused by decreased clearance of saliva. It is most commonly induced under the influence of heavy dosages of psychedelic tryptamine compounds, such as psilocybin, 4-AcO-DMT, and 4-HO-MET.', 'Increased salivation can be described as the production and excretion of excess saliva within the mouth, which may also be caused by decreased clearance of saliva. This can contribute to drooling if there is an inability to keep the mouth closed or difficulty in swallowing the excess saliva, which can lead to excessive spitting.

Increased salivation is often accompanied by other coinciding effects such as excessive yawning, watery eyes, runny nose, and increased phlegm production. It is most commonly induced under the influence of heavy dosages of psychedelic tryptamine compounds, such as psilocybin, 4-AcO-DMT, and 4-HO-MET.',
        '', '', 'https://www.effectindex.com/effects/increased-salivation',
        'https://psychonautwiki.org/wiki/Increased_salivation'),
       ('clvdzrw2l002w1vcvzypn82hu', 'Increased sense of humor', 'increased-sense-of-humor', null, null, '',
        'Increased sense of humor is as a general enhancement of the likelihood and degree to which a person finds stimuli to be humorous and amusing. It is most commonly induced under the influence of moderate dosages of certain hallucinogenic compounds, such as psychedelics, mescaline, and cannabinoids.', 'Increased sense of humour is as a general enhancement of the likelihood and degree to which a person finds stimuli to be humorous and amusing. During this state, a person''s sensitivity to finding things funny is noticeably amplified, often to the point that they will begin uncontrollably laughing at trivial things without any intelligible reason or apparent cause.

[1]

[2]

[3]

[4]

In group settings, the experience of witnessing another person who is laughing intensely for no apparent reason can itself become a contagious trigger which induces semi-uncontrollable laughter within the people around them. In extreme cases, this can often form a lengthy feedback loop in which people begin to laugh hysterically at the absurdity of not being able to stop laughing and not knowing what started the laughter to begin with.

Increased sense of humor is often accompanied by other coinciding effects such as emotion intensification and novelty enhancement. It is most commonly induced under the influence of moderate dosages of certain hallucinogenic compounds, such as psychedelics, mescaline

[5]

, and cannabinoids.

[1]

[6]

However, it can also occur to a much lesser extent under the influence of stimulants

[7]

, GABAergic depressants, and dissociatives.

[1]

[6]', '', '', 'https://www.effectindex.com/effects/increased-sense-of-humor',
        'https://psychonautwiki.org/wiki/Increased_sense_of_humor'),
       ('clvdzrw2s002x1vcv1nzlvdh0', 'Increased suggestibility', 'increased-suggestibility', null, null, '',
        'Increased suggestibility is a greater tendency to accept and act on the suggestions of others. It most commonly occurs under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, deliriants, and cannabinoids.', 'Increased suggestibility is a greater tendency to accept and act on the suggestions of others.

[1]

[2]

A common example of increased suggestibility in action would be a trip sitter deliberately making a person believe a false statement without question simply by telling it to them as true, even if the statement would usually be easily recognizable as impossible or absurd. If this is successfully accomplished, it can potentially result in the experience of relevant accompanying hallucinations and delusions which further solidify the belief which has been suggested to them.

Increased suggestibility most commonly occurs under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, deliriants, and cannabinoids. This holds particularly true for users who are inexperienced or currently undergoing delusions and memory suppression. It''s worth noting that this effect has been studied extensively by the scientific literature and has a relatively large body of data confirming its presence across multiple hallucinogens. These include LSD

[3]

, mescaline

[1]

, psilocybin

[1]

, cannabis

[4]

, ketamine

[5]

, and nitrous oxide

[6]

. However, anecdotal reports suggest that it may also occur to a lesser extent under the influence of GABAergic depressants such as alcohol and benzodiazepines.',
        '', '', 'https://www.effectindex.com/effects/increased-suggestibility', null),
       ('clvdzrw32002y1vcvnsi7pxva', 'Internal hallucination', 'internal-hallucination', null, null, '',
        'An internal hallucination is the perception of a visual hallucination that exclusively occurs within an imagined environment that can typically only be viewed with closed eyes, similar to those found within dreams. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'An internal hallucination is the perception of a visual hallucination that exclusively occurs within an imagined environment that can typically only be viewed with closed eyes,

[1]

[2]

similar to those found within dreams.

[3]

[4]

[5]

This is in stark contrast to external hallucinations, which display themselves seamlessly into the person''s surrounding environment as if they were physically present.

At lower levels, internal hallucinations begin with imagery on the back of a person''s eyelids, which do not take up the entirety of one''s visual field and are distinct from their background. These can be described as spontaneous moving or still images of scenes, concepts, places, or anything one could imagine. The imagery is manifested in varying levels of realism ranging from ill-defined and cartoon-like to wholly realistic. They rarely hold their form for more than a few seconds before fading or shifting into another image. It is worth noting that this level of intensity occurs in a manner similar to that of hypnagogia, the state between sleep and wakefulness.

At higher levels, internal hallucinations become increasingly elaborate as they eventually become all-encompassing, fully-fledged 3D scenes that surround the person in a manner similar to that of dreams. This can create the feeling that one has "broken-through" into another reality. The things that occur within this perceived alternate reality can be anything, but fall under common archetypes such as contact with autonomous entities, alongside a wide variety of imagined landscapes and scenarios.

This effect is capable of manifesting itself across the 5 different levels of intensity described below:

Outside of this levelling system, the subjective intensity of internal hallucinations are not only dependent on their detail or level of immersion, but also upon the speed and rate at which they successively occur between each other. For example, during the experience of internal hallucinations, it is possible to find oneself in a state that presents a relentless stream of intensely vivid hallucinations. This occurs at such a rapid rate that it eventually becomes psychologically exhausting to endure them, regardless of their thematic content. The sheer amount of content experienced in this state often results in powerful time dilation, which seems to stem from the fact that abnormally large amounts of experiences are being felt in very short periods of time. This is also consistently accompanied by states of sensory overload and ego death in a manner that can subjectively feel as if it is a consequence of the brain allocating all of its processing power into rendering hallucinations at the expense of other cognitive faculties.

The content within these internal hallucinations can be further broken down into four distinct sub-components. These are described and documented within their own dedicated articles, each of which are listed below:

It is worth noting that the content, style, and general behaviour of an internal hallucination is often largely dependent on the emotional state of the person experiencing it. For example, a person who is emotionally stable and generally happy will usually be more prone to experiencing neutral, interesting, or positive hallucinations. In contrast, however, a person who is emotionally unstable and generally unhappy will usually be more prone to experiencing sinister, fear-inducing, and negative hallucinations.

Internal hallucinations are often accompanied by other coinciding effects such as geometry, external hallucinations and delusions. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, they can also occur under the influence of stimulant psychosis, sleep deprivation, and during dreams.',
        '', '', 'https://www.effectindex.com/effects/internal-hallucination',
        'https://psychonautwiki.org/wiki/Internal_hallucination'),
       ('clvdzrw39002z1vcvlrd3ebrw', 'Introspection', 'introspection', null, null, '',
        'Introspection can be described as the experience of a state of mind in which a person feels as if they are being encouraged or forced to reflect upon and examine aspects of their life, thoughts, and feelings. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives.', 'Introspection can be described as the experience of a state of mind in which a person feels as if they are being encouraged or forced to reflect upon and examine aspects of their life, thoughts, and feelings.

[1]

[2]

[3]

This state is often felt to be extremely effective at facilitating therapeutic self-improvement and positive personal growth on a level that remains largely unparalleled by that of everyday sober living. This is due to the way in which it often results in logical resolutions to the present situation, future possibilities, insecurities, and goals or personal acceptance of insecurities, fears, hopes, struggles, and traumas.

Introspection is unlikely to be an isolated effect component but rather the result of a combination of an appropriate setting in conjunction with other coinciding effects such as analysis enhancement, empathy, affection, and sociability enhancement, and personal bias suppression. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives. However, it can also occur in a less consistent form under the influence of entactogens and meditation.

Relational embeddedness is defined as a remarkable insight or transformation involving a significant personal relationship.

[4]

A small sample size of psilocybin therapy patients unanimously addressed crucial aspects of their personal relationship histories without interviewer prompting. These insights are most likely to be about immediate family members or loved ones.

This experienced is marked by radical acceptance and forgiveness for the focused loved one along with a catharsis. Occasionally participants describe loved ones appearing as spirits sent to guide them.',
        '', '', 'https://www.effectindex.com/effects/introspection', null),
       ('clvdzrw3g00301vcvfucau0am', 'Irritability', 'irritability', null, null, '',
        'Irritability is medically recognized as the pervasive and sustained emotional state of being easily annoyed and provoked to anger. It is most commonly induced during the after effects of heavy dosages of stimulant compounds, such as cocaine,  methamphetamine, and methylphenidate.', 'Irritability is medically recognized as the pervasive and sustained emotional state of being easily annoyed and provoked to anger.

[1]

It may be expressed outwardly in the cases of violence towards others, or directed inwards towards oneself in the form of self-harm.

[2]

This effect, especially when strong, can sometimes cause violent or aggressive outbursts in a small subset of people who may be predisposed to it. The chances of somebody responding in such a way differs wildly between people and depends on how susceptible an individual is to irritability and how well they cope with it. It is also worth noting that this typically only affects those who were already susceptible to aggressive behaviours. However, regardless of the person, this effect results in a lower ability to tolerate frustrations, negative stimuli, and other people. A person undergoing this effect may be prone to lashing out at others, fits of anger, or other behaviours that would be uncharacteristic for them sober.

Irritability is often accompanied by other coinciding effects such as anxiety, paranoia, and ego inflation. It is most commonly induced during the after-effects of heavy dosages of stimulant compounds, such as cocaine

[3]

,  methamphetamine

[4]

, and methylphenidate

[5]

.  However, it can be a withdrawal symptom of almost any substance, and can to a lesser extent present itself during alcohol intoxication

[6]', '', '', 'https://www.effectindex.com/effects/irritability', 'https://psychonautwiki.org/wiki/Irritability'),
       ('clvdzrw3p00311vcv5bgzwxn8', 'Itchiness', 'itchiness', null, null, '',
        'Itchiness is the sensation that causes a person the desire or reflex to scratch at their skin. It is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, fentanyl, tramadol, and kratom.', 'Itchiness is the sensation that causes a person the desire or reflex to scratch at their skin. At lower levels, itchiness can occur as a subtle and minor annoyance which is easy to ignore. However, at higher levels, itchiness can become so intense that is incredibly uncomfortable and can even result in the person damaging their skin through repetitive scratching motions.

Itchiness is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, fentanyl, tramadol, and kratom. This is due to the way in which opioids activate histamine receptors and trigger histamine release. An effective technique for counteracting itchiness in cases of substance use is to take an antihistamine such as diphenhydramine (DPH, Benadryl).',
        '', '', 'https://www.effectindex.com/effects/itchiness', 'https://psychonautwiki.org/wiki/Itchiness'),
       ('clvdzrw3z00321vcvsdwxzaaw', 'Jamais', 'jamais-vu', null, null, '',
        'Jamais vu can be described as the sudden sensation that a current event or situation is unfamiliar and being experienced for the very first time. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.', 'Jamais vu can be described as the sudden sensation that a previously known concept or currently-occurring situation is unfamiliar and being experienced for the very first time. This is often triggered despite the fact that during the experience of it, the person is rationally aware that the circumstances of the previous experience have definitely occurred.

The term itself is a common phrase of French origin which translates literally into “never seen” and is complementary to the more well-known state referred to as "deja vu". It is a well-documented phenomenon that can commonly occur both when sober as well as under the influence of hallucinogens.

Within the context of psychoactive substance usage, many compounds are commonly capable of inducing spontaneous and often prolonged states of mild to intense sensations of jamais vu. The effect can manifest as an overwhelming sense of eeriness and the impression that one has “never been here before”.

Jamais vu is often accompanied by other coinciding effects such as short-term memory suppression and time distortion. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/jamais-vu', null),
       ('clvdzrw4700331vcv2fjc4227', 'Language suppression', 'language-suppression', null, null, '',
        'Language suppression is the decreased ability to use and understand speech. It is most commonly induced under the influence of heavy dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone.', 'Language suppression (also known as aphasia) is medically recognized as the decreased ability to use and understand speech.

[1]

[2]

This creates the feeling of finding it difficult or even impossible to vocalize one''s own thoughts and to process the speech of others. However, the ability to speak and to process the speech of others does necessarily become suppressed simultaneously. For example, a person may find themselves unable to formulate a coherent sentence while still being able to perfectly understand the speech of others.

Generally, this effect can be divided into four broad categories:

[1]

[2]

*   (also called Broca''s aphasia): difficulty in conveying thoughts through speech or writing. The person knows what she/he wants to say, but cannot find the words he needs. For example, a person with Broca''s aphasia may say,  meaning, "I will take the dog for a walk," or  for "There are two books on the table."

*   (Wernicke''s aphasia): difficulty understanding spoken or written language. The individual hears the voice or sees the print but cannot make sense of the words. These people may speak in long, complete sentences that have no meaning, adding unnecessary words and even creating made-up words. For example,  "You know that smoodle pinkered and that I want to get him round and take care of him like you want before."  As a result, it is often difficult to follow what the person is trying to say and the speakers are often unaware of their spoken mistakes.

*  : People lose almost all language function, both comprehension and expression. They cannot speak or understand speech, nor can they read or write. This results from severe and extensive damage to the language areas of the brain. They may be unable to say even a few words or may repeat the same words or phrases over and over again.

*   (or amnesiac):  the least severe form of aphasia; people have difficulty in using the correct names for particular objects, people, places, or events.

Language suppression is often accompanied by other coinciding effects such as analysis suppression and thought deceleration. It is most commonly induced under the influence of heavy dosages of antipsychotic compounds, such as quetiapine

[3]

, haloperidol

[4]

, and risperidone

[5]

. However, it can also occur in a less consistent form under the influence of extremely heavy dosages of hallucinogenic compounds such as psychedelics

[6]

, dissociatives

[6]

[7]

, and deliriants

[8]

. This is far more likely to occur when the person is inexperienced with that particular hallucinogen.', '', '',
        'https://www.effectindex.com/effects/language-suppression', null),
       ('clvdzrw4i00341vcv564h69d5', 'Laughter fits', 'laughter-fits', null, null, '',
        'Laughter fits can be described as the experience of uncontrollable, intense, and spontaneous laughter which continue to occur despite a lack of any identifiable trigger or a feeling of humorousness. They are most commonly induced under the influence of moderate dosages of psychedelic and dissociative compounds, such as LSD, psilocybin, and nitrous oxide.', 'Laughter fits can be described as the experience of uncontrollable, intense, and spontaneous laughter which continue to occur despite a lack of any identifiable trigger or a feeling of humorousness. The physical action itself typically consists of rhythmical, often audible contractions of the diaphragm and other parts of the respiratory system. At higher levels, laughter fits can make it extremely difficult to function due to crying and a difficulty talking or keeping one''s eyes open.

Laughter fits are often accompanied by other coinciding effects such as an increased sense of humor and emotion enhancement. They are most commonly induced under the influence of moderate dosages of psychedelic and dissociative compounds, such as LSD, psilocybin, and nitrous oxide.',
        '', '', 'https://www.effectindex.com/effects/laughter-fits', 'https://psychonautwiki.org/wiki/Laughter_fits'),
       ('clvdzrw4p00351vcvmva7kbtc', 'Machinescapes', 'machinescapes', null, null, '',
        'Machinescapes are a complex visual and tactile experience where one perceives hallucinatory mechanical landscapes that are vast in both size and intricacy. They are most commonly induced under the influence of heavy dosages of salvia divinorum. However, they can also occur less commonly under the influence of psychedelic compounds, such as LSD, psilocybin, and 2C-P.', 'This particular subjective effect component may not be the most profound, therapeutic, or spiritual state of mind available within the hallucinogenic experience. However, in my personal opinion, it is quite likely to be one of the most uniquely baffling and inexplicable effects when it comes to both undergoing it and considering the causes behind it. While I may not have a particularly in-depth academic knowledge of neurology and psychopharmacology, the vast majority of subjective effects that occur under the influence of hallucinogenic substances at least have some sort of vaguely plausible mechanism or cause that I can immediately speculate upon. In contrast, however, I have struggled for years to come up with a satisfying hypothesis on why Salvia Divinorum can cause human brains to quite reliably create states in which a person''s awareness and felt bodily form suddenly becomes enveloped by rotating panels, conveyer belts, pulleys, gears, and all manner of other interlocking mechanical parts.

At face value, I would initially assume that machinescapes are simply a type of hallucination that occurs among people as a result of the cultural influence of living in a world in which we are all acutely aware of the existence of machinery. However, the fact that this experience is so consistently reported by people under the influence of a very specific compound leads me to believe that there is at least a little more to it than that. This is especially interesting to consider in the context of Salvia Divinorum''s unique pharmacology, in which it functions as a potent k-opioid receptor agonist. While the k-opioid receptor system is not well understood, it is known that these receptors have the highest prevalence within the claustrum, a system that is the most densely connected structure in the brain and that''s been shown to have widespread activity throughout numerous cortical components. These are associated with playing key roles in consciousness, higher cognitive functioning, and sustained attention. It is further theorised that the claustrum harmonises and coordinates activity in various parts of the cortex in a manner that leads to the seamlessly integrated nature of subjective conscious experience. All of this suggests to me that this unique hallucinogen is creating disruptions and changes to brain function that occur on a much deeper, widespread, and fundamental level than that of psychedelics, dissociatives, and deliriants.

When taking this knowledge into consideration, I am led to suspect that machinescapes may occur under the influence of salvia due to the way this substance reliably disrupts consciousness on an all-encompassing level. If I had to guess I would say that this could potentially cause the experience of machinescapes to occur in a number of ways. For example, perhaps it causes the brain''s internal map of the bodies form to reassemble in complex and unpredictable ways, which are then accompanied by visual hallucinations that are commonly interpreted as interlocking mechanical parts. It may also trigger data from various parts of the brain to spill over into areas in unusual and complex ways, that they would usually otherwise not, resulting in this data being interpreted as a more simplistic but mechanical-esque equivalent to psychedelic geometry accompanied by an equivalent tactile sensation. It could also potentially be a unique form of internal hallucination that the brain will often render when it is largely incapable of drawing from its memory database of more coherent everyday concepts. Alternatively, however, this experience may be a result of a combination of these factors, or an entirely different process altogether. Unfortunately, none of these speculative ideas feel particularly satisfactory to me and I also sincerely doubt that the causes behind this incredibly niche experience will be understood at a scientific level within my lifetime.',
        '', '', 'https://www.effectindex.com/effects/machinescapes', 'https://psychonautwiki.org/wiki/Machinescapes'),
       ('clvdzrw4w00361vcvt640frb8', 'Magnification', 'magnification', null, null, '',
        'Magnification is the experience of distant details within one''s visual field appearing magnified and closer than they actually are due to both visual enhancements and hallucinatory effects. It is a rare effect that is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Magnification is the experience of distant details within one''s visual field appearing magnified and closer than they actually are.

[1]

This can give the perception that one is seeing objects from greater distances than is usually possible within everyday life.

At its lower levels, this can allow people to see nearby objects (such as within reaching distance) as much closer than they really are, resulting in the perception that their visual capabilities have been somewhat enhanced.

[1]

At its higher levels, this can induce the perception of seeing distant objects as if they were right in front of the user despite their distance. These distances can range from several feet to hundreds of meters. Alternatively, it can also result in states in which a person''s vision will zoom into the minute details of a small object, allowing them to see it from a perspective similar to that of a microscope. Since this is almost certainly a physiological impossibility, it suggests that higher level magnification may actually be a seamless hallucinatory state in which the details of distant visual input are predictively simulated in a realistic and convincing manner.

This effect is considerably more likely to occur if a person spends extended periods of time staring at an object or scene within the distance.

Magnification is often accompanied by other coinciding effects such as visual acuity enhancement and increased pareidolia. It is a rare effect that is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/magnification', 'https://psychonautwiki.org/wiki/Magnification'),
       ('clvdzrw5600371vcvwjholznn', 'Mania', 'mania', null, null, '',
        'Mania can be described as a state of abnormally elevated energy levels and general arousal. It is most commonly induced under the influence of heavy dosages of stimulant or dissociative compounds, such as methamphetamine, PCP, 2-Oxo-PCE, and cocaine.', 'Mania can be described as a state of abnormally elevated energy levels and general arousal. The typical symptoms of mania are the following: heightened mood (either euphoric or irritable), thought acceleration, a flooding of ideas, extreme talkativeness, increased energy, a decreased need for sleep, and hyperactivity.

[1]

This state of mind can vary wildly in its intensity, from mild mania (hypomania)

[2]

to full-on manic psychosis

[3]

. The accompanying symptoms are most obvious during states of fully developed delirious mania in which the person exhibits increasingly severe manic tendencies that become more and more obscured by other signs and symptoms, such as delusions, psychosis, incoherence, catatonia and extreme disorderly behaviour.

[4]

Within the context of clinical psychology, standardized .tools such as Altman Self-Rating Mania Scale

[5]

and Young Mania Rating Scale

[6]

can be used to measure the severity of manic episodes. It is worth noting that since mania and hypomania is often associated with creativity and artistic talent,

[7]

it is not always the case that a clearly manic person needs or wants medical help; such persons often either retain sufficient self-control to function normally or are simply unaware that they are severely manic enough to be committed to a psychiatric ward or to commit themselves.

Although mania is often stereotyped as a “mirror image” of depression, the heightened mood can be either euphoric or irritable. As irritable mania worsens, the irritability often becomes more pronounced and may eventually result in violent behaviour.

Mania is often accompanied by other coinciding effects such as ego inflation and stimulation. It is most commonly induced under the influence of heavy dosages of stimulant or dissociative compounds, such as methamphetamine, PCP, 2-Oxo-PCE, and cocaine.

Hypomania is a lowered state of mania that does little to impair function or decrease the person''s quality of life. It may, in fact, increase productivity and creativity. In hypomania, there is less need for sleep and an increase in both goal-motivated behaviour and physical metabolism. Though the elevated mood and energy levels typical of hypomania could be seen as a benefit, mania itself generally has many undesirable consequences including suicidal tendencies, and hypomania can, if the prominent mood is irritable rather than euphoric, be a rather unpleasant experience. By definition, hypomania cannot feature psychosis, nor does it require psychiatric hospitalisation (voluntary or involuntary).',
        '', '', 'https://www.effectindex.com/effects/mania', 'https://psychonautwiki.org/wiki/Mania'),
       ('clvdzrw5c00381vcvbjbagipw', 'Memory enhancement', 'memory-enhancement', null, null, '',
        'Memory enhancement is an improvement in a person''s ability to recall or retain memories.  It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as methylphenidate, caffeine, Noopept, nicotine, and modafinil.', 'Memory enhancement is an improvement in a person''s ability to recall or retain memories.

[1]

[2]

[3]

[4]

The experience of this effect can make it easier for a person to access and remember past memories at a greater level of detail when compared to that of everyday sober living. It can also help one retain new information that may then be more easily recalled once the person is no longer under the influence of the psychoactive substance.

Memory enhancement is often accompanied by other coinciding effects such as analysis enhancement and thought acceleration. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as methylphenidate

[5]

, caffeine

[3]

, Noopept

[6]

, nicotine

[7]

, and modafinil

[8]

Different substances can enhance different kinds of memory with some considerable overlap. Generally, there are three types:',
        '', '', 'https://www.effectindex.com/effects/memory-enhancement',
        'https://psychonautwiki.org/wiki/Memory_enhancement'),
       ('clvdzrw5k00391vcvokwcj0dl', 'Memory replays', 'memory-replays', null, null, '',
        'Memory replays are a multisensory subtype of internal hallucinations that result in a person reliving memories through the experience of vivid daydreams, reoccurring emotions or sensations, and hallucinations. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Memory replays are a multisensory subtype of internal hallucinations that result in a person reliving memories through the experience of vivid daydreams, reoccurring emotions or sensations, and hallucinations. At higher levels of intensity, these are often referred to as "flashbacks". The memories themselves can be significant life events with high levels of personal meaning attributed to them, generic recent occurrences, or long forgotten experiences from childhood.

[1]

[2]

At extremely high levels of this experience, the effect can result in the person experiencing every memory they''ve ever had. These memories can be presented in linear order as the person''s life flashes before their eyes, or they can be presented simultaneously in the often overwhelming form of a vast network of memories that the person sees, experiences, and innately understands.

Memory replays are often accompanied by other coinciding effects, such as scenarios and plots, internal hallucinations, and introspection. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, they can also commonly occur during sobriety as a result of traumatic experiences, particularly when the person suffers from post-traumatic stress disorder.

[3]', '', '', 'https://www.effectindex.com/effects/memory-replays', null),
       ('clvdzrw5r003a1vcvyb1qiq4s', 'Memory suppression', 'memory-suppression', null, null, '',
        'Memory suppression is an inhibition of a person''s ability to maintain a functional short and long-term memory. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Memory suppression is an inhibition of a person''s ability to maintain a functional short and long-term memory.

[1]

[2]

[3]

This occurs in a manner that is directly proportional to the dosage consumed, and often begins with the degradation of one''s short-term memory.

Memory suppression is a process that may be broken down into the 4 basic levels described below:

It is worth noting that although memory suppression is vaguely similar in its effects to amnesia, it differs in that it directly suppresses one''s usage of their long or short term memory without inhibiting the person''s ability to recall what happened during the experience afterwards. In contrast, amnesia does not directly affect the usage of one''s short or long-term memory during its experience; instead, it renders a person incapable of recalling events after it has worn off. A person experiencing memory suppression cannot access their existing memory, while a person with drug-induced amnesia cannot properly store new memories. As such, a person experiencing amnesia may not obviously appear to be doing so, as they can often carry on normal conversations and perform complex tasks. This is not the case with memory suppression.

Memory suppression is often accompanied by other coinciding effects such as thought loops, personal bias suppression, amnesia, and delusions. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.

[4]', '', '', 'https://www.effectindex.com/effects/memory-suppression',
        'https://psychonautwiki.org/wiki/Memory_suppression'),
       ('clvdzrw5y003b1vcvtg7i7tmo', 'Mindfulness', 'mindfulness', null, null, '',
        'Mindfulness is the self-regulation of attention so that focus is directed towards immediate experience alongside of an orientation characterized by acceptance and a lack of judgement. It can occur under the influence of substances but is also practiced during meditation.', 'Mindfulness is a psychological concept that is well established within scientific literature and commonly discussed in association with meditation.

[1]

[2]

It is often broken down into two separate subcomponents that comprise this effect. The first of these components involves the self-regulation of attention so that focus is completely directed towards immediate experience, thereby quietening one''s internal narrative and allowing for increased recognition of external and mental events within the present moment.

[3]

[4]

The second of these components involves adopting a particular orientation toward one’s experiences in the present moment that is characterized by a lack of judgement, curiosity, openness, and acceptance.

[5]

Within meditation, this state of mind is deliberately practised and maintained via the conscious and manual redirection of one''s awareness towards a singular point of focus for extended periods of time. However, within the context of psychoactive substance usage, this state is often spontaneously induced without any conscious effort or the need for any prior knowledge regarding meditative techniques.

Mindfulness is often accompanied by other coinciding effects such as anxiety suppression and focus enhancement. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids. However, it can also occur on entactogens, certain nootropics such as L-theanine, and during simultaneous doses of benzodiazepines and stimulants.',
        '', '', 'https://www.effectindex.com/effects/mindfulness', 'https://psychonautwiki.org/wiki/Mindfulness'),
       ('clvdzrw64003c1vcvh42s45dw', 'Mixed emotions', 'mixed-emotions', null, null, '',
        'Mixed emotions is the experience of feeling multiple emotions simultaneously without an obvious external trigger. They are most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Mixed emotions is the experience of feeling multiple emotions simultaneously with or without an obvious external trigger. For example, during this state, a user may suddenly feel intense conflicting emotions such as simultaneous happiness, sadness, love, hate, etc. This can result in states of mind in which the user can potentially feel any number of conflicting emotions in any possible combination.

Mixed emotions are often accompanied by other coinciding effects such as memory suppression and emotion enhancement. They are most commonly induced under the influence of heavy dosages of psychedelics compounds, such as LSD, psilocybin, and mescaline.

All experiences with mixed emotions can be categorized into four distinct types or “patterns”. These various different classifications are described and documented below:

*   This is when one emotion appears first and is then replaced by a second emotion without either of the emotions occurring simultaneously.

*   This is when the two emotions occur simultaneously but, throughout the emotional episode, one is of moderate or high intensity while the other is of very comparatively low intensity.

*   This is when the two emotions occur in an inverse fashion; that is, while the intensity of one emotion progressively decreases as the intensity of the other emotion proportionally increases.

*   This is when both emotions are of moderate or high intensity and the two occur simultaneously, whether throughout the entirety of the emotional episode or simply during a portion of it.

It is worth noting that mixed emotions are a complex subjective experience and not merely a collection of independent feelings elicited in response to separate triggers. Although people can usually identify the environmental triggers responsible for their mixed emotions, the subjective feeling reflects the simultaneous occurrence of both positive and negative emotions. It can therefore be said that this state of mind is more than the sum of the emotions involved; mixed feelings are in themselves a distinct and integral emotional experience.',
        '', '', 'https://www.effectindex.com/effects/mixed-emotions', null),
       ('clvdzrw6e003d1vcvjbbpla14', 'Motivation enhancement', 'motivation-enhancement', null, null, '',
        'Motivation enhancement is an increased desire to perform tasks and accomplish goals in a productive manner. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, nicotine, and modafinil.', 'Motivation enhancement is an increased desire to perform tasks and accomplish goals in a productive manner.

[1]

[2]

[3]

This includes tasks and goals that would normally be considered too monotonous or overwhelming to fully commit oneself to.

A number of factors (which often, but not always, co-occur) reflect or contribute to task motivation: namely, wanting to complete a task, enjoying it or being interested in it.

[3]

Motivation may also be supported by closely related factors, such as positive mood, alertness, energy, and the absence of anxiety. Although motivation is a state, there are trait-like differences in the motivational states that people typically bring to tasks, just as there are differences in cognitive ability.

[2]

Motivation enhancement is often accompanied by other coinciding effects such as stimulation and thought acceleration in a manner which further increases one''s productivity. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine

[2]

[4]

, methylphenidate

[2]

, nicotine

[5]

, and modafinil

[6]

. However, it may also occur to a much lesser extent under the influence of certain opioids

[7]

[8]

, and GABAergic depressants

[7]', '', '', 'https://www.effectindex.com/effects/motivation-enhancement',
        'https://psychonautwiki.org/wiki/Motivation_enhancement'),
       ('clvdzrw6l003e1vcvtz7wxpyg', 'Motivation suppression', 'motivation-suppression', null, null, '',
        'Motivation suppression (also known as avolition or amotivation) is a decreased desire to initiate or persist in goal-directed behavior. It is most commonly induced under the influence of an acute dosage of an antipsychotic compound, such as quetiapine, haloperidol, and risperidone. However, it is worth noting that chronic treatment with any dose of antipsychotic medication does not cause this effect.', 'Motivation suppression (also known as avolition or amotivation)

[1]

is a decreased desire to to initiate or persist in goal-directed behavior.

[2]

[3]

Motivation suppression prevents an individual the ability to sustain the rewarding value of an action into an uncertain future; this includes tasks deemed challenging or unpleasant, such as working, studying, cleaning, and doing general chores. At its higher levels, motivation suppression can cause one to lose their desire to engage in any activities, even the ones that would usually be considered entertaining or rewarding to the user. This effect can lead onto severe states of boredom and even mild depression when experienced at a high level of intensity for prolonged periods of time.

Motivation suppression is often accompanied by other coinciding effects such as sedation and thought deceleration. It is most commonly induced under the influence of an acute dosage of an antipsychotic compound, such as quetiapine, haloperidol, and risperidone.

[4]

[5]

However, it is worth noting that chronic treatment with any dose of antipsychotic medication does not cause this effect.

[1]

It can also occur under the influence of heavy dosages of cannabinoids

[6]

, benzodiazepines, as a result of long-term SSRI usage

[7]

, during the offset of stimulants, and during the withdrawal symptoms of almost any compound.', '', '',
        'https://www.effectindex.com/effects/motivation-suppression', null),
       ('clvdzrw6s003f1vcv96fszy0y', 'Motor control loss', 'motor-control-loss', null, null, '',
        'Motor control loss can be described as feeling as if there has been a distinct decrease in a person''s ability to control their physical body with precision, balance, coordination, and dexterity. Motor control loss is often accompanied by other coinciding effects such as sedation and disinhibition. It is most commonly induced under the influence of moderate dosages of GABAergic depressant compounds, such as, alcohol, benzodiazepines, GHB, and phenibut.', 'Motor control loss can be described as feeling as if there has been a distinct decrease in a person''s ability to control their physical body with precision, balance, coordination, and dexterity.

At lower levels, this results in experiencing much more difficulty performing tasks which require movement of any sort. For example, simple tasks such as typing without making spelling errors, walking without staggering, or carrying a glass of water without spilling it may all become much more challenging. At higher levels, however, this state can move beyond subtle in its effects and become capable of completely disabling the person''s ability to use any level of fine or gross motor control. This typically results in catatonic states in which a person cannot even walk without falling over.

Motor control loss is often accompanied by other coinciding effects such as sedation and disinhibition. It is most commonly induced under the influence of moderate dosages of GABAergic depressant compounds, such as, alcohol, benzodiazepines, GHB, and phenibut. However, it may also occur to a lesser extent under the influence of other compounds such as dissociatives.',
        '', '', 'https://www.effectindex.com/effects/motor-control-loss',
        'https://psychonautwiki.org/wiki/Motor_control_loss'),
       ('clvdzrw72003g1vcv1yuotcbq', 'Mouth numbing', 'mouth-numbing', null, null, '',
        'Mouth numbing is a physical side effect of administering certain drugs sublingually (under the tongue) or buccally (via the cheeks and gum). The effect can be described as a distinct feeling of general numbness or tactile suppression around the tongue and mouth which can last for up to an hour after the drug has been administered.', 'Mouth numbing is a physical side effect of administering certain drugs sublingually (under the tongue) or buccally (via the cheeks and gum). The effect can be described as a distinct feeling of general numbness or tactile suppression around the tongue and mouth which can last for up to an hour after the drug has been administered.

The NBOMe series (25C-NBOMe, 25B-NBOMe, and 25I-NBOMe) cause this effect consistently and it is accompanied by a strong, unpleasant, metallic chemical taste immediately after sublingual absorption.

The stimulant known as cocaine also causes numbing of the tongue, gums, and mouth when administered sublingually. Many people test the purity of their cocaine by rubbing it in their mouth. This, however, is not a guarantee of the drug''s quality as it is common for cocaine to be cut with various other numbing agents and local anaesthetics, such as novocaine, lidocaine, or benzocaine, which mimic or add to cocaine''s numbing effect.',
        '', '', 'https://www.effectindex.com/effects/mouth-numbing', 'https://psychonautwiki.org/wiki/Mouth_numbing'),
       ('clvdzrw7b003h1vcv6l6uykb2', 'Multiple thought streams', 'multiple-thought-streams', null, null, '',
        'Multiple thought streams is a state of mind in which a person has more than one internal narrative or stream of consciousness simultaneously occurring within their head. They are most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Multiple thought streams is a state of mind in which a person has more than one internal narrative or stream of consciousness simultaneously occurring within their head. This can result in any number of independent thought streams occurring at the same time, each of which are often controllable in a similar manner to that of one''s everyday thought stream.

These multiple coinciding thought streams can be experienced simultaneously in a manner which is evenly distributed and does not prioritize the awareness of any particular thought stream over another. However, they can also be experienced in a manner which feels as if it brings awareness of a particular thought stream to the foreground while the others continue processing information in the background. This form of multiple thought streams typically swaps between specific trains of thought at seemingly random intervals.

The experience of this effect can sometimes allow one to analyse many different ideas simultaneously and can be a source of great insight. However, it will usually overwhelm the person with an abundance of information that becomes difficult or impossible to fully process at a normal speed.

Multiple thought streams are often accompanied by other coinciding effects such as memory suppression and thought disorganization. They are most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/multiple-thought-streams',
        'https://psychonautwiki.org/wiki/Multiple_thought_streams'),
       ('clvdzrw7h003i1vcvhhqlvszf', 'Muscle cramp', 'muscle-cramp', null, null, '',
        'A muscle cramp can be described as an involuntary temporary contraction or over shortening of muscles which may cause severe aches and pains. They are most commonly induced under the influence of heavy dosages of stimulating psychedelic compounds, such as LSD, 2C-E, DOC, and AMT.  However, they can also occur under the influence of certain GABAergic depressants such as GHB and phenibut.', 'A muscle cramp can be described as an involuntary temporary contraction or over shortening of muscles which may cause severe aches and pains. The onset of these muscle cramps is usually sudden while the cramp typically resolves itself spontaneously within a few seconds or minutes.

Muscle cramps are often accompanied by other coinciding effects such as muscle twitching and stimulation. They are most commonly induced under the influence of heavy dosages of stimulating psychedelics compounds, such as LSD, 2C-E, DOC, and AMT. However, they can also occur under the influence of deliriants and certain GABAergic depressants such as GHB and phenibut.',
        '', '', 'https://www.effectindex.com/effects/muscle-cramp', 'https://psychonautwiki.org/wiki/Muscle_cramp'),
       ('clvdzrw7m003j1vcvaz78bb0z', 'Muscle relaxation', 'muscle-relaxation', null, null, '',
        'Muscle relaxation can be described as the experience of muscles losing their rigidity or tenseness while becoming relaxed and comfortable. It is most commonly induced under the influence of moderate dosages of depressant compounds, such as various benzodiazepines, GABAergics, and opioids.', 'Muscle relaxation can be described as the experience of muscles losing their rigidity or tenseness while becoming relaxed and comfortable. This effect is particularly useful for those who are currently suffering from muscle spasms, pain, and hyperreflexia.

Muscle relaxation is often accompanied by other coinciding effects such as sedation and anxiety suppression. It is most commonly induced under the influence of moderate dosages of depressant compounds, such as various benzodiazepines, GABAergics, and opioids. However, it can also occur to a lesser extent under the influence of cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/muscle-relaxation',
        'https://psychonautwiki.org/wiki/Muscle_relaxation'),
       ('clvdzrw7u003k1vcvjdqx3htc', 'Muscle tension', 'muscle-tension', null, null, '',
        'Muscle tension can be described as extended partial contractions or over shortening of muscles which can cause persistent low-level aches and pains. It is most commonly induced under the influence of heavy dosages of stimulating psychedelic compounds, such as LSD, 2C-E, DOC, and AMT.', 'Muscle tension can be described as extended partial contractions or over shortening of muscles which can cause persistent low-level aches and pains. Muscle tension is typically caused by the physiological effects of stress and can lead to episodes of back pain.

Muscle tension is often accompanied by other coinciding effects such as muscle twitching and muscle cramps. It is most commonly induced under the influence of heavy dosages of stimulating psychedelics compounds, such as LSD, 2C-E, DOC, and AMT. However, it can also occur under the influence of certain GABAergic depressants such as GHB and phenibut.',
        '', '', 'https://www.effectindex.com/effects/muscle-tension', 'https://psychonautwiki.org/wiki/Muscle_tension'),
       ('clvdzrw82003l1vcvxluaw3vc', 'Muscle twitching', 'muscle-twitching', null, null, '',
        'Muscle twitching can be described as the sensation of small and localised tremblings of muscle groups. These vibrations are often powerful enough to be visibly seen through the skin. It is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds such as LSD, 2C-E, DOC, and AMT.', 'Muscle twitching can be described as the sensation of small and localised tremblings of muscle groups. These vibrations are often powerful enough to be visibly seen through the skin. The sensations they induce can be uncomfortable in certain contexts but are usually neutral to experience.

Muscle twitching is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds such as LSD, 2C-E, DOC, and AMT. However, it can also occur under the influence of traditional stimulants.',
        '', '', 'https://www.effectindex.com/effects/muscle-twitching',
        'https://psychonautwiki.org/wiki/Muscle_twitching'),
       ('clvdzrw88003m1vcvsf9asc11', 'Nausea', 'nausea', null, null, '',
        'Nausea can be described as a sensation of unease and discomfort in the upper stomach combined with an involuntary urge to vomit. It is most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as psychedelics, opioids, GABAergics, deliriants, dissociatives, and stimulants.', 'Nausea can be described as a sensation of unease and discomfort in the upper stomach combined with an involuntary urge to vomit.

[1]

[2]

[3]

It often, but not always, precedes vomiting. This effect usually occurs at the onset of the experience and dissipates as the peak takes its toll.

In the context of substance usage, nausea and vomiting can occur as a result of stomach irritation through the consumption of materials which it is not used to digesting. These materials can include things such as chemical powders or plant matter. Alternatively, nausea may occur as a direct pharmacological result of how the particular substance affects the brain. If this is the case, the nausea is therefore inseparable from the experience itself and will likely occur to varying extents regardless of the route of administration.

Nausea is often accompanied by other coinciding effects such as stomach bloating, stomach cramps, and dizziness. It is most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as psychedelics, opioids, GABAergics, deliriants, dissociatives, and stimulants.

Vomiting, also known as purging, puking and throwing up, among other terms, is the involuntary, forceful expulsion of the contents of one''s stomach through the mouth and sometimes the nose. This effect typically occurs during the peak of a substance''s effects. It can often greatly relieve the person''s physical side effects once it is over. For example, under the influence of many hallucinogenic compounds, it is common for a person to feel that their trip has become significantly more enjoyable after the act of vomiting due to their uncomfortable stomach symptoms suddenly subsiding as a result.

It is worth noting that a person should not brush their teeth immediately after vomiting. This is because the corrosiveness of stomach acid combined with the abrasiveness of brushing can cause permanent damage to a person''s teeth when repeated over time. Instead, a person should wash their mouth out with water, mouthwash, a water flosser, or a mixture of baking soda and water (to neutralise the acidity).',
        '', '', 'https://www.effectindex.com/effects/nausea', 'https://psychonautwiki.org/wiki/Nausea'),
       ('clvdzrw8f003n1vcv4a5fclpd', 'Nausea suppression', 'nausea-suppression', null, null, '',
        'Nausea suppression can be described as a reduction in vomiting, stomach cramps, and general feelings of nausea. It is most commonly induced under the influence of 5-HT3 receptor antagonists, cannabinoids, benzodiazepines, antihistamines, and others.', 'Nausea suppression can be described as a reduction in vomiting, stomach cramps, and general feelings of nausea.

A mostly comprehensive list of common substances which induce this effect can be found below.

Drugs which bind to 5-HT3 receptors in the central nervous system and gastrointestinal tract are known to reduce nausea by inhibiting binding to the receptor which induces vomiting.

can be administered in tablet form or in an injection.

can be administered in tablet (Kytril), oral solution (Kytril), injection (Kytril), or in a single transdermal patch to the upper arm (Sancuso).

is administered in an oral tablet, orally dissolving tablet, orally dissolving film, or in an IV/IM injection.

can be administered in oral capsules or in injection form.

can be administered in an injection or in oral capsules.

is an antidepressant that has antiemetic effects and is also a potent histamine H1 antagonist.

Cannabinoids are used in patients with cachexia, cytotoxic nausea, and vomiting or for those who are unresponsive to other agents. These may cause changes in perception, dizziness, and loss of coordination.

In the United States, this is a Schedule I drug.

is a Schedule III drug in the United States.

such as nabilone (Cesamet), the JWH series, or 5F-PB-22.

is an oral spray containing THC and CBD. It is currently legal in Canada and a few countries in Europe, but is not legal in the United States.

given at the onset of anaesthesia has been shown in recent trials to be as effective as ondansetron.

is said to be very good as an adjunct treatment for nausea along with first line medications such as Compazine or Zofran.

H1 histamine receptor antagonists are effective for many conditions including motion sickness, morning sickness in pregnancy, and to combat opioid nausea.

can be administered via a rectal suppository for adults and children over 2 years of age.

contains the 5-HT3 antagonists gingerols and shogaols.

is reported to be an effective anti-nausea agent. The oil can be consumed in a capsule or applied to the skin via a carrier oil.

is claimed to be an effective antiemetic.

given intravenously has been used in an acute care setting in hospitals as a rescue therapy for emesis.

is claimed to help nausea or stomach pain when added into tea or peppermint candies.

is a popular nausea relieving spice in India, Ethiopia and Eritrea.

The following people contributed to the content of this article:', '', '',
        'https://www.effectindex.com/effects/nausea-suppression', 'https://psychonautwiki.org/wiki/Nausea_suppression'),
       ('clvdzrw8n003o1vcvvk5wamwq', 'Novelty enhancement', 'novelty-enhancement', null, null, '',
        'Novelty enhancement is a feeling of increased fascination, awe, and appreciation attributed to specific parts or the entirety of one''s external environment. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Novelty enhancement is a feeling of increased fascination

[1]

, awe

[1]

[2]

[3]

, and appreciation

[3]

[4]

attributed to specific parts or the entirety of one''s external environment. This can result in an often overwhelming impression that everyday concepts such as nature, existence, common events, and even household objects are now considerably more profound, interesting, and important.

[5]

[6]

The experience of this effect commonly forces those who undergo it to acknowledge, consider, and appreciate the things around them in a level of detail and intensity which remains largely unparalleled throughout every day sobriety. It is often generally described using phrases such as  "a sense of wonder"

[1]

[3]

or  "seeing the world as new"

[4]

Novelty enhancement is often accompanied by other coinciding effects such as personal bias suppression, motivation enhancement, and spirituality enhancement in a manner which further intensifies the experience. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of cannabinoids, dissociatives, and entactogens.',
        '', '', 'https://www.effectindex.com/effects/novelty-enhancement',
        'https://psychonautwiki.org/wiki/Novelty_enhancement'),
       ('clvdzrw8v003p1vcvoqa8vdeh', 'Object activation', 'object-activation', null, null, '',
        'Object activation is the experience of looking at an object and perceiving it to move, become alive, or become fully animated and autonomous of its own accord. It is most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'Object activation is the experience of looking at an object and perceiving it to move, become alive, or become fully animated and autonomous of its own accord. For example, a door may open and close on its own or a cup on the table may start to slide or tilt over. The "activated object" usually moves in a familiar way that would happen in day to day life, implying that the person is experiencing a combination of both object alterations and external hallucinations being applied to their environment.

However, certain activated objects may also perform actions that are completely unrealistic. For example, an item of furniture may appear to disassemble into many complex, floating, and rotating sections before reassembling into its previous form. Stationary objects, such as rugs, may activate themselves and begin crawling on the floor and up onto other stationary pieces of furniture. These hallucinations usually only occur when one looks directly at an object for an extended period of time and are rare and extreme signs of an advanced hallucinatory state.

In rare cases, autonomous entities such as shadow people may aid in an object''s activation. A shadow person or other autonomous entity may pick up, rearrange, or move a stationary object in front of the observer and act as a "cause" of the object''s activation.

Object activation is often accompanied by other coinciding effects, such as delirium, psychosis, cognitive dysphoria, and delusions in a manner that can result in the hallucinations being perceived to have distinctly sinister and unsettling undertones. It is most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine. However, they can also occur to a lesser extent under the influence of

psychedelics, dissociatives, stimulant psychosis, and sleep deprivation.', '', '',
        'https://www.effectindex.com/effects/object-activation', 'https://psychonautwiki.org/wiki/Object_activation'),
       ('clvdzrw90003q1vcvqr5lkc1a', 'Object alteration', 'object-alteration', null, null, '',
        'An object alteration is the experience of perceiving objects and scenes to be progressively warping, moving, stretching, animating, and shifting in their 3-dimensional form. They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH and datura.', 'An object alteration is the experience of perceiving objects and scenes to be progressively warping, moving, stretching, animating, and shifting in their 3-dimensional form.

[1]

[2]

[3]

[4]

When the person double takes, the object returns to its original shape until it is looked at directly once again, whereafter it begins distorting again in a similar or different manner. The manner in which the alterations occur is not uniform and cannot be reliably predicted. The intensity of the effect is often linked to the intensity and progression of the mental state that precludes this effect.

For example, when staring at an object, such as a chair, its 3-dimensional shape may begin to drastically elongate or tilt into an exaggerated form while retaining its original colours and textures.

Another common manifestation of this effect is the perception of textures progressively extending and stretching outward from surfaces of objects in the form of a detailed 3-dimensional structure

[4]

somewhat similar to complex, opaque, and solidified smoke. These structures usually maintain a size consistent with the width of the texture it is extending from. They can also range from anywhere between several inches to several meters in length. For example, if one is staring at a painting on the wall, it may extend in one direction on a 2-dimensional plane until the observer looks away.

[4]

[5]

[6]

This is likely an indirect result of external hallucinations being applied to objects within the user''s environment in a manner that does not introduce new data, but simply alters the perception of a 3-dimensional structure''s content.

Object alterations are often accompanied by other coinciding effects, such as delirium and psychosis.

[6]

They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH and datura. However, they can also occur under the influence of stimulant psychosis and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/object-alteration',
        'https://psychonautwiki.org/wiki/Object_alteration'),
       ('clvdzrw96003r1vcvawrqx44g', 'Olfactory enhancement', 'olfactory-enhancement', null, null, '',
        'Olfactory enhancement (also known as hyperosmia) is the experience of smells becoming significantly richer, stronger, and more noticeable than they would be during everyday sobriety. This experience can either be positive or negative depending on the smell and the person''s prior opinion of them. For example, while certain smells such as food or flowers may become a true delight during this experience, other smells such as pollution or body odour may become overpoweringly uncomfortable, which can potentially trigger nausea and vomiting.', 'Olfactory enhancement (also known as hyperosmia

[1]

) is the experience of smells becoming significantly richer, stronger, and more noticeable than they would be during everyday sobriety. This experience can either be positive or negative depending on the smell and the person''s prior opinion of them. For example, while certain smells such as food or flowers may become a true delight during this experience, other smells such as pollution or body odour may become overpoweringly uncomfortable, which can potentially trigger nausea and vomiting.

Olfactory enhancement is often accompanied by other coinciding effects, such as acuity enhancement, tactile enhancement, and auditory enhancement. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of certain stimulants and dissociatives, such as MDMA or 3-MeO-PCP.',
        '', '', 'https://www.effectindex.com/effects/olfactory-enhancement', null),
       ('clvdzrw9d003s1vcvsob6emgb', 'Olfactory hallucination', 'olfactory-hallucination', null, null, '',
        'An olfactory hallucination (also known as phantosmia) is the detection or perception of a convincing imaginary smell that is not actually present in the person''s environment. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as deliriants and psychedelics.', 'An olfactory hallucination (also known as phantosmia) is the detection or perception of a convincing imaginary smell that is not actually present in the person''s environment.

[1]

[2]

[3]

This can occur in one or both nostrils. The specific hallucinatory odours perceived can vary from person to person and can vary depending on set and setting as well as the dosage taken. The smells themselves can range from pleasant to foul and are often described as being very odd and random in nature.

Olfactory hallucinations are often accompanied by other coinciding effects, such as external hallucinations, delusions, and gustatory hallucinations. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as deliriants and psychedelics. However, they can also occur under the influence of stimulant psychosis and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/olfactory-hallucination',
        'https://psychonautwiki.org/wiki/Olfactory_hallucination'),
       ('clvdzrw9n003t1vcv35ll7ith', 'Olfactory suppression', 'olfactory-suppression', null, null, '',
        'Olfactory suppression (also known as anosmia) is the experience of smells becoming significantly vaguer, weaker, and less noticeable than they would be during everyday sobriety. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Olfactory suppression (also known as anosmia) is the experience of smells becoming significantly vaguer, weaker, and less noticeable than they would be during everyday sobriety.

Olfactory suppression is often accompanied by other coinciding effects, such as tactile suppression and gustatory suppression. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/olfactory-suppression', null),
       ('clvdzrw9t003u1vcvmy8dhmnm', 'Optical sliding', 'optical-sliding', null, null, '',
        'Optical sliding can be described as a physical effect which inhibits the coordination and control of a person''s eyes by suppressing their ability to keep them still. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Optical sliding can be described as a physical effect which inhibits the coordination and control of a person''s eyes by suppressing their ability to keep them still. This results in the eyes continuously moving in a variety of directions combined with the sensation of not being able to stare motionless at any particular point.

Optical sliding is often accompanied by other coinciding effects such as acuity suppression and double vision. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur to a lesser extent under the influence of extremely heavy dosages GABAergic depressants.',
        '', '', 'https://www.effectindex.com/effects/optical-sliding',
        'https://psychonautwiki.org/wiki/Optical_sliding'),
       ('clvdzrw9y003v1vcvix7uzqim', 'Orgasm suppression', 'orgasm-suppression', null, null, '',
        'Orgasm suppression (formally known as anorgasmia) can be described as a difficulty or complete inability to achieve orgasm despite adequate sexual stimulation. This effect commonly occurs on opioids and dissociatives which have been reported to decrease one''s ability to feel sexual pleasure, which may be attributed to their tactile suppressing effects or through some other biological mechanism. It is also a well-known side effect of selective serotonin reuptake inhibitors (SSRIs).', 'Orgasm suppression (formally known as anorgasmia) can be described as a difficulty or complete inability to achieve orgasm despite adequate sexual stimulation.

[1]

This effect commonly occurs on opioids and dissociatives which have been reported to decrease one''s ability to feel sexual pleasure, which may be attributed to their tactile suppressing effects or through some other biological mechanism. It is also a well-known side effect of selective serotonin reuptake inhibitors (SSRIs).

[2]

It may also be a result of the effect known as difficulty urinating which can occur on certain stimulants and entactogens. This effect has been reported to occur alongside a decrease in the strength of one''s kegel muscles, which may account for the inability to achieve ejaculation and orgasm within males.',
        '', '', 'https://www.effectindex.com/effects/orgasm-suppression', null),
       ('clvdzrwa4003w1vcv6w6s1by3', 'Pain relief', 'pain-relief', null, null, '',
        'Pain relief can be described as an effect which suppresses negative sensations such as aches and pains. It is most commonly induced under the influence of moderate dosages of a very wide variety of compounds, such as opioids, GABAergics, GABApentinoids, cannabinoids, dissociatives, muscle relaxants, and NSAID''s.', 'Pain relief can be described as an effect which suppresses negative sensations such as aches and pains. This can occur through a variety of different pharmacological and subjective mechanisms such as blocking the physical sensations from reaching one''s conscious faculties, by covering the sensation with feelings of physical and cognitive euphoria, or by directly targetting the body part which the sensation is arising from.

Pain relief is often accompanied by other coinciding effects such as muscle relaxation, physical euphoria, and sedation. It is most commonly induced under the influence of moderate dosages of a very wide variety of compounds, such as opioids, GABAergics, GABApentinoids, cannabinoids, dissociatives, muscle relaxants, and NSAIDs.',
        '', '', 'https://www.effectindex.com/effects/pain-relief', 'https://psychonautwiki.org/wiki/Pain_relief'),
       ('clvdzrwa9003x1vcv07zraj0z', 'Panic attack', 'panic-attack', null, null, '',
        'A panic attack is a discrete period of sudden onset of intense fear or terror. During these attacks there are symptoms such as shortness of breath or smothering sensations; palpitations, pounding heart, or accelerated heart rate; chest pain or discomfort; choking; and fear of going crazy or losing control.', 'A panic attack is a discrete period of sudden onset of intense fear or terror. During these attacks there are symptoms such as shortness of breath or smothering sensations; palpitations, pounding heart, or accelerated heart rate; chest pain or discomfort; choking, and fear of going crazy or losing control. Panic attacks may be unexpected, in which the onset of the attack is not associated with an obvious trigger and instead occurs "out of the blue," or expected, in which the panic attack is associated with an obvious trigger, either internal or external.

[1]

Panic attacks are usually triggered in moments of severe anxiety, such as that caused by a bad trip. They are so subjectively overwhelming both physically and mentally that the user may believe they are dying, or that some great calamity is imminent, and are commonly mistaken for heart attacks. The subjective sensations can overwhelm rational thought even when the user recognizes that they are having a panic attack, especially in those who have not experienced them before.

Panic attacks are often accompanied by uncomfortable physical symptoms that may further aggravate a person’s anxiety as they may be mistaken for a serious health problem. The strongest mental effect of panic attacks is a crushing sense of impending doom,

[1]

accompanied by despair, panic, and dread. These usually begin abruptly and may reach their peak within 10 to 20 minutes, but may also continue for hours in extreme cases before subsiding on their own. Although this experience is incredibly stressful it is important to note that it is not physically dangerous or harmful.

The various cognitive and physical symptoms of a panic attack are described and listed below:

*   - Hyperventilation occurs when one breathes deeper and more rapidly than usual. When hyperventilating, one may feel as though they are struggling to get enough air. As this causes a decrease of carbon dioxide in the blood, it may result in lightheadedness, a rapid heartbeat, chest pain, or a tingling sensation in a person''s limbs.

*   - Due to the release of stress hormones, one may experience heart symptoms including missed beats, palpitations, chest pain, and an accelerated heart rate.

*   - This can be described as a loss of sensation as well as numbness and tingling sensations throughout the body. It may feel as if one''s skin or body parts are numb to the touch, and this can occur in a small area or become all-encompassing throughout multiple body parts or the entire body. Numbness most frequently occurs within the hands, legs, arms, feet, and face. This effect is often accompanied by a pins and needle sensation and it generally increases alongside of - hyperventilation.

*   Fear of losing control or going insane', '', '', 'https://www.effectindex.com/effects/panic-attack', null),
       ('clvdzrwae003y1vcvmql1kbuc', 'Paranoia', 'paranoia', null, null, '',
        'Paranoia is the suspiciousness or the belief that one is being harassed, persecuted, or unfairly treated. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as cannabinoids, psychedelics, dissociatives, and deliriants.', 'Paranoia is the suspiciousness or the belief that one is being harassed, persecuted, or unfairly treated.

[1]

These feelings can range from subtle and ignorable to intense and overwhelming enough to trigger panic attacks and feelings of impending doom. Paranoia also frequently leads to excessively secretive and overcautious behaviour which stems from the perceived ideation of one or more scenarios, some of which commonly include: fear of surveillance, imprisonment, conspiracies, plots against an individual, betrayal, and being caught. This effect can be the result of real evidence but is often based on assumption and false pretence.

Paranoia is often accompanied by other coinciding effects such as anxiety and delusions. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as cannabinoids,

[2]

psychedelics, dissociatives, and deliriants. However, it can also occur during the withdrawal symptoms of GABAergic depressants and during stimulant comedowns.',
        '', '', 'https://www.effectindex.com/effects/paranoia', 'https://psychonautwiki.org/wiki/Paranoia'),
       ('clvdzrwak003z1vcvzfttj9vz', 'Perception of bodily heaviness', 'perception-of-bodily-heaviness', null, null, '',
        'Perception of bodily heaviness can be described as feeling as if one''s body has significantly increased in its weight. This can result in feelings of slowness and sluggishness due to the body seeming difficult, uncomfortable, or impossible to move. It is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics, opioids, and antipsychotics.', 'Perception of bodily heaviness can be described as feeling as if one''s body has significantly increased in its weight. This can result in feelings of slowness and sluggishness due to the body seeming difficult, uncomfortable, or impossible to move.

Perception of bodily heaviness is often accompanied by other coinciding effects such as sedation and muscle relaxation. It is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics, opioids, and antipsychotics. However, it can also occur under the influence of deliriants and certain sedating psychedelics such as certain LSA, psilocybin, and 2C-C.',
        '', '', 'https://www.effectindex.com/effects/perception-of-bodily-heaviness',
        'https://psychonautwiki.org/wiki/Perception_of_bodily_heaviness'),
       ('clvdzrwas00401vcvu6fslwe5', 'Perception of bodily lightness', 'perception-of-bodily-lightness', null, null, '',
        'Perception of bodily lightness can be described as feeling as if one''s body has significantly decreased in its weight. This can result in feelings of increased energy and a general sense of bounciness due to the body seeming weightless and therefore effortless to move. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Perception of bodily lightness can be described as feeling as if one''s body has significantly decreased in its weight. This can result in feelings of increased energy and a general sense of bounciness due to the body seeming weightless and therefore effortless to move.

Perception of bodily lightness is often accompanied by other coinciding effects such as stimulation and physical disconnection. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur under the influence of certain stimulating psychedelics such as certain LSD, 4-HO-MET, and 2C-B.',
        '', '', 'https://www.effectindex.com/effects/perception-of-bodily-lightness',
        'https://psychonautwiki.org/wiki/Perception_of_bodily_lightness'),
       ('clvdzrwb200411vcvmbutkcob', 'Perception of eternalism', 'perception-of-eternalism', null, null, '',
        'Perception of eternalism can be described as the experience of a major alteration of one''s perspective of the fundamental mechanics behind the linear continuity of time moving from the past, to the present, to the future. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Perception of eternalism is one of a handful of subjective effect components that has had a substantial impact on how I view myself and the universe around me. I first experienced this effect during a state of level 4 unity and interconnectedness while under the influence of a heavy dose of Ayahuasca. It was one of the most profound experiences of my entire life. I truly felt that not only was I the entirety of existence experiencing itself through this body, but that this moment and all other moments would continue to exist eternally within their specific time frames. Although I am acutely aware of how it is impossible for me to genuinely know if this is true or not, I have found it to be a perspective that is very difficult to shake off after having this experience a number of times.

Before experiencing this effect, I had never considered or even heard of the various similar metaphysical schools of thought that exist as relatively mainstream concepts within the field of philosophy. However, after having had experienced this state of mind numerous times, I happened upon a large number of relevant concepts that include ideas such as eternalism, four dimensionalism, growing block universe, perdurantism, and the b-theory of time. Each of these concepts have their Wikipedia articles linked to within the See Also section of this page.

As an intellectual concept, the B-theory of time is especially interesting to me as it is relatively well supported by the physics community. In summary, B-theory posits that the flow of time is an illusion, that the past, present, and future are equally real and that time is tenseless. Its support is seemingly due to its apparent compatibility with theoretical physics and the fact that many theories such as special relativity, the ADD model, and brane cosmology are considered to point to a theory of time similar to B-theory. However, I feel that it is important to note that I do not have a remotely in-depth understanding of theoretical physics and that although these theories are in support of notions similar to this experience, I am not entirely sure that their ontological implications can be asserted within science and outside the realm of philosophy or metaphysics.

Regardless of whether or not the nature of time is genuinely illusory, it is truly fascinating to me that without any prior knowledge, myself and many other psychedelic users can experience incredibly specific states of mind that seem to line up with entire philosophical theories. This holds true for a number of transpersonal effects and is something that I''m deeply passionate about doing my absolute best to both document and discuss without descending into any degree of pseudoscience or hippy babble.',
        '', '', 'https://www.effectindex.com/effects/perception-of-eternalism',
        'https://psychonautwiki.org/wiki/Perception_of_eternalism'),
       ('clvdzrwb800421vcv0590lgm5', 'Perception of interdependent opposites', 'perception-of-interdependent-opposites',
        null, null, '',
        'Perception of interdependent opposites can be described as the experience of a powerful subjective feeling that reality is based upon a binary system in which the existence of fundamentally important concepts or situations logically arise from and depend upon the co-existence of their opposite.  It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Perception of interdependent opposites can be described as the experience of a powerful subjective feeling that reality is based upon a binary system in which the existence of fundamentally important concepts or situations logically arise from and depend upon the co-existence of their opposite. This perception is not just understood at a cognitive level but manifests as intuitive sensations which are felt rather than thought by the person.

This experience is usually interpreted as providing a deep insight into the fundamental nature of reality. For example, concepts such as existence and non-existence, life and death, up and down, self and other, light and dark, good and bad, big and small, pleasure and suffering, yes and no, internal and external, hot and cold, young and old, etc are felt to exist as harmonious forces which necessarily contrast their opposite force in a state of equilibrium.

Perception of interdependent opposites is often accompanied by other coinciding transpersonal effects such as ego death, unity and interconnectedness, and perception of eternalism. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/perception-of-interdependent-opposites',
        'https://psychonautwiki.org/wiki/Perception_of_interdependent_opposites'),
       ('clvdzrwbe00431vcv51koxzqm', 'Perception of predeterminism', 'perception-of-predeterminism', null, null, '',
        'Perception of predeterminism can be described as the sensation that all physical and mental processes are the result of prior causes, that every event and choice is an inevitable outcome that could not have happened differently, and that all of reality is a complex causal chain that can be traced back to the beginning of time. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Perception of predeterminism can be described as the sensation that all physical and mental processes are the result of prior causes, that every event and choice is an inevitable outcome that could not have happened differently, and that all of reality is a complex causal chain that can be traced back to the beginning of time. This is accompanied by the absence of the feeling that a person''s decision-making processes and general cognitive faculties inherently possess "free will”. This sudden change in perspective causes the person to feel as if their personal choices, physical actions, and individual personality traits have always been completely predetermined by prior causes and are, therefore, outside of their conscious control.

During this state, a person begins to feel as if their decisions arise from a complex set of internally stored, pre-programmed, and completely autonomous, instant electrochemical responses to perceived sensory input. These sensations are often interpreted as somehow disproving the concept of free will, as the experience of this effect feels as if it is fundamentally incompatible with the notion of being self-determined. This state can also lead a person to the conclusion that their very identity and selfhood are the cumulative results of their biology and past experiences.

Once the effect begins to wear off, a person will often return to their everyday feelings of freedom and independence. Despite this, however, they will often retain realizations regarding what is often interpreted as a profound insight into the apparent illusory nature of free will.

Perception of predeterminism is often accompanied by other coinciding effects such as ego death and physical autonomy. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/perception-of-predeterminism',
        'https://psychonautwiki.org/wiki/Perception_of_predeterminism'),
       ('clvdzrwbj00441vcv9efdkx9l', 'Perception of self-design', 'perception-of-self-design', null, null, '',
        'Perception of self-design can be described as the experience of feeling that one is personally responsible for the creation, design, manifestation of a concept, process, or event which is normally seen as the result of unrelated external causes. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Perception of self-design can be described as the experience of feeling that one is personally responsible for the creation, design, manifestation of a concept, process, or event which is normally seen as the result of unrelated external causes. It can be broken down into two separate sub-components which include:

* Feeling as if one designed, planned out, and created certain, or even all, aspects of one''s life such as current or past events, loved ones, and key events.

* Feeling as if one designed, planned out and created certain, or even all, aspects of the external world such as current or historical events, nature, life, the universe as a whole, and the physical laws which it abides by.

This effect typically occurs suddenly and spontaneously. However, it is most commonly felt during emotionally significant situations which are so enjoyable and fulfilling that they are exactly how the person would have designed it had they have somehow been given the conscious choice to do so in advance. This is especially true of situations that seem improbable or are completely unexpected.

Perception of self-design is often accompanied by other coinciding effects such as ego death, delusions of grandiosity, and high-level unity and interconnectedness. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/perception-of-self-design',
        'https://psychonautwiki.org/wiki/Perception_of_self-design'),
       ('clvdzrwbp00451vcv0fgzci5p', 'Peripheral information misinterpretation',
        'peripheral-information-misinterpretation', null, null, '',
        'Peripheral information misinterpretation is a fleeting experience of an object or detail within one''s peripheral vision being interpreted and displayed incorrectly. It is most commonly induced under the influence of moderate dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'Peripheral information misinterpretation is a fleeting experience of an object or detail within one''s peripheral vision being interpreted and displayed incorrectly. During this state, a person may briefly see elaborate details within their peripheral vision that, after a more direct analysis, turn out to be entirely fabricated. For example, a person may momentarily notice fleeting objects, people, or events within their peripheral vision that are not actually present. Once the detail or object is realized to be incorrect, the misinterpretation is overwritten with the correct perception.

Peripheral information misinterpretation is often accompanied and enhanced by other coinciding effects, such as pattern recognition enhancement and external hallucinations. It is most commonly induced under the influence of moderate dosages of deliriant compounds, such as DPH, datura, and benzydamine. However, it can also occur under the influence of stimulant psychosis and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/peripheral-information-misinterpretation',
        'https://psychonautwiki.org/wiki/Peripheral_information_misinterpretation'),
       ('clvdzrwbu00461vcvtvsryg85', 'Personal bias suppression', 'personal-bias-suppression', null, null, '',
        'Personal bias suppression is a decrease in the cultural biases that a person filters their perception through. It is most commonly induced under the influence of hallucinogenic substances.', 'Personal bias suppression (also called cultural filter suppression) is a decrease in the personal or cultural biases, preferences, and associations a person knowingly or unknowingly filters and interprets their perception of the world through.

[1]

Analyzing one''s beliefs, preferences, or associations while experiencing personal bias suppression can lead to new perspectives that one could not reach while sober. The suppression of this innate tendency often induces the realization that certain aspects of a person''s personality, worldview and culture are not reflective of objective truths about reality, but are in fact subjective or even delusional opinions.

[1]

This realization often leads to or accompanies deep states of insight and critical introspection that can create significant alterations in a person''s perspective that last anywhere from days, weeks, months, or even years after the experience itself.

Personal bias suppression is often accompanied by other coinciding effects such as conceptual thinking, analysis enhancement, and especially ego death. It is most commonly induced under the influence of heavy dosages of hallucinogens such as dissociatives and psychedelics. However, it can also occur to a much lesser extent under the influence of very heavy dosages of entactogens and cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/personal-bias-suppression',
        'https://psychonautwiki.org/wiki/Personal_bias_suppression'),
       ('clvdzrwc100471vcvp3cjkwon', 'Personal meaning enhancement', 'personal-meaning-enhancement', null, null, '',
        'Personal meaning enhancement (also known as aberrant salience) is the experience of a considerably increased sense of personal significance becoming attributed to innocuous situations, and coincidences. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, cannabinoids, and deliriants.', 'Personal meaning enhancement (also known as aberrant salience) is the experience of a considerably increased sense of personal significance becoming attributed to innocuous situations, and coincidences.

[1]

[2]

[3]

[4]

[5]

[6]

For example, one may feel that the lyrics of a song or events in a film directly relate to their life in a meaningful and distinct manner that is not usually felt during everyday sobriety. This feeling can continue to occur even when it is rationally understood that the external stimuli do not genuinely relate to the person experiencing it in such a direct manner.

At its highest level, this effect will often synergize with delusions in a manner which can result in one genuinely believing that innocuous events are directly related to them.

[1]

For example, one may begin to believe that the plot of a film is about their life or that a song was written for them. This phenomenon is well established within psychiatry and is commonly known as a "delusion of reference"

[8]

[9]

Personal meaning enhancement is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics

[2]

[3]

, dissociatives

[1]

, cannabinoids

[6]

, and deliriants. However, it can also occur under the influence of sleep deprivation and stimulant psychosis.

[7]', '', '', 'https://www.effectindex.com/effects/personal-meaning-enhancement', null),
       ('clvdzrwc700481vcvgzv10sof', 'Personality regression', 'personality-regression', null, null, '',
        'Personality regression is a mental state in which one suddenly adopts an identical or similar personality, thought structure, mannerisms and behaviours to that of their past self from a younger age.  It is a relatively rare effect that is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, most notably Ayahuasca, LSD and Ibogaine in particular as well as certain dissociatives.', 'Personality regression is a mental state in which one suddenly adopts an identical or similar personality, thought structure, mannerisms and behaviours to that of their past self from a younger age.

[1]

[2]

[3]

During this state, the person will often believe that they are literally a child again and begin outwardly exhibiting behaviours which are consistent to this belief. These behaviours can include talking in a childlike manner, engaging in childish activities, and temporarily requiring another person to act as a caregiver or guardian. There are also anecdotal reports of people speaking in languages which they have not used for many years under the influence of this effect.

[4]

Personality regression is often accompanied by other coinciding effects such as anxiety, memory suppression, and ego death. It is a relatively rare effect that is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur for people during times of stress,

[1]

as a response to childhood trauma,

[5]

as a symptom of borderline personality disorder, or as a regularly reoccurring facet of certain peoples lives that is not necessarily associated with any psychological problems.',
        '', '', 'https://www.effectindex.com/effects/personality-regression',
        'https://psychonautwiki.org/wiki/Personality_regression'),
       ('clvdzrwcd00491vcvs2h3j20g', 'Perspective distortion', 'perspective-distortion', null, null, '',
        'A perspective distortion is a subtle to extreme change in how a person perceives the size and distance attributed to their body, specific parts of the external environment, or the external environment as a whole.  They are most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, MXE, and DXM.', 'A perspective distortion is a subtle to extreme change in how a person perceives the size and distance attributed to their body, specific parts of the external environment, or the external environment as a whole.

[1]

This effect is capable of manifesting itself in 4 different ways, which may reflect the failure of each respective responsible visual function.

[2]

[3]

[4]

[5]

[6]

*  - Objects are perceived larger than their actual size.

*  - Objects are perceived smaller than their actual size.

*  - Objects are perceived to be nearer than they actually are.

*  - Objects are perceived to be much further away than they actually are.

When affecting distance, perspective distortions can make things seem as if they are physically closer or further away than they usually would be. This can range from a subtle experience, such as the other side of the room feeling marginally further away than it usually would be, to an extreme experience, such as feeling as if the horizon is right in front of you.

In relation to size, perspective distortions can make things seem as if they are physically smaller or larger than normal.

[7]

[8]

[9]

This can range from a subtle experience, with the room feeling marginally smaller and more cramped than it usually would be, to an extreme experience, such as feeling as if the room is hundreds of miles wide.

Perspective distortions are often accompanied by other coinciding effects, such as depth perception distortions and visual disconnection. They are most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, MXE, and DXM.

Feelings of suddenly having an impossibly giant or tiny body are also a very common manifestation of this effect. This feeling is already known by scientific literature as “Alice in Wonderland Syndrome”, where it is seen as a temporary condition often associated with migraines, brain tumours, and the use of psychoactive drugs.

[1]

[10]

The effect can either be attributed to the body as a whole or specific parts of it. For example, feelings of having a huge head or tiny limbs are possible.',
        '', '', 'https://www.effectindex.com/effects/perspective-distortion',
        'https://psychonautwiki.org/wiki/Perspective_distortion'),
       ('clvdzrwci004a1vcvmpz09yxe', 'Perspective hallucination', 'perspective-hallucination', null, null, '',
        'A perspective hallucination is an alteration of the perspective through which a given internal or external hallucination is seen through. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'A perspective hallucination is an alteration of the perspective through which a given internal or external hallucination is seen.

[1]

[2]

[3]

[4]

[5]

This effect is capable of manifesting itself across the four different perspectives described below:

[6]

[7]

*  - The most common form of perspective can be described as the normal experience of perceiving a hallucination from the person''s everyday self and body.

*  - This perspective can be described as the experience of perceiving a hallucination from the viewpoint of an external source of consciousness, such as another person, an animal, or an inanimate object.

* - This perspective can be described as an out-of-body experience where a person''s viewpoint is floating above, below, behind, or in front of their physical body.

*  - The least common form of perspective can be described as the experience of perceiving a hallucination from multiple or even seemingly infinite viewpoints and angles simultaneously.

Perspective hallucinations are often accompanied by other coinciding effects, such as delirium, and memory suppression. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/perspective-hallucination',
        'https://psychonautwiki.org/wiki/Perspective_hallucination'),
       ('clvdzrwco004b1vcvt3c5ranc', 'Photophobia', 'photophobia', null, null, '',
        'Photophobia can be described as an abnormal physical intolerance to the visual perception of light. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Photophobia can be described as an abnormal physical intolerance to the visual perception of light. As a medical symptom, photophobia is not a morbid fear or psychological phobia, but an experience of discomfort or pain to the eyes due to light exposure.

Photophobia is almost always accompanied by other coinciding effects such as pupil dilation which may trigger this effect by disabling the eye''s ability to adjust itself accordingly depending on current levels of light exposure. It is most commonly induced under the influence of heavy dosages of psychedelics compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of certain stimulants.',
        '', '', 'https://www.effectindex.com/effects/photophobia', 'https://psychonautwiki.org/wiki/Photophobia'),
       ('clvdzrwct004c1vcvm8gw5ec9', 'Physical autonomy', 'physical-autonomy', null, null, '',
        'Physical autonomy can be described as the experience of a person''s own body performing simple or complex actions entirely of its own accord. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Physical autonomy can be described as the experience of a person''s own body performing simple or complex actions entirely of its own accord. Depending on the intensity, this results in the carrying out of a given task becoming partially to completely automatic in nature without the requirement of decision-making skills or attentive conscious input.

At lower levels, the effect is partially controllable by commanding the body with simple thoughts. For example, thoughts such as "go to the toilet" or "go drink a glass of water" can result in the body performing these actions autonomously. This can often help the person perform necessary physical actions such as tending to bodily functions or avoiding danger when they would otherwise be too incapable, unconscious, or distractible to perform them manually in their current state.

At higher levels, this effect no longer requires verbal commands and becomes entirely automatic. It''s worth noting that although this technically results in a loss of cognitive control, the body only performs actions which the owner would have decided to perform were they capable of it themselves.

Physical autonomy is often accompanied by other coinciding effects such as physical disconnection and cognitive disconnection. It is most commonly induced under the influence of heavy dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur to a lesser extent under the influence of heavy dosages of psychedelics such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/physical-autonomy',
        'https://psychonautwiki.org/wiki/Physical_autonomy'),
       ('clvdzrwcy004d1vcvoav6892p', 'Physical disconnection', 'physical-disconnection', null, null, '',
        'Physical disconnection is the experience of feeling distant and detached from one''s sense of touch and their feelings of ownership and control over their own physical body. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as, ketamine, PCP, and DXM.', 'Physical disconnection is the experience of feeling distant and detached from one''s sense of touch and their feelings of ownership and control over their own physical body. This may lead to or be complemented by other effects, such as tactile suppression, physical autonomy, pain relief, changes in felt bodily form, a perception of bodily lightness, and a general array of physical suppressions. The experience of this effect can also create a wide range of subjective changes to a person''s perception of their own body. These are described and documented in the list below:

*  Feeling as if one''s body is not their own

*  Feeling as if one''s body is controlling itself

*  Feeling as if one''s body is distant and far away

*  Feeling as if one''s bodily movement is mechanical and robotic

*  Feeling a decrease in one''s ability to use fine motor control

*  Feeling a decrease in one''s ability to use and perceive their sense of touch

Physical disconnection is often accompanied by other coinciding effects, such as cognitive disconnection and visual disconnection, which results in the sensation that one is partially or completely detaching from both their sensory input and their cognitive faculties. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as, ketamine, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/physical-disconnection',
        'https://psychonautwiki.org/wiki/Physical_disconnection'),
       ('clvdzrwd3004e1vcvm3bzrbmm', 'Physical euphoria', 'physical-euphoria', null, null, '',
        'Physical euphoria can be described as feelings of pleasure and comfort within and across one''s body. This euphoria typically feels somewhat comparable to the endorphin rushes felt during states of excitement or love, the coziness of a comfortable bed, and the rush of an orgasm. It is most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as opioids, stimulants, psychedelics, and GABAergics.', 'Physical euphoria can be described as feelings of pleasure and comfort within and across one''s body. This euphoria typically feels somewhat comparable to the endorphin rushes felt during states of excitement or love, the coziness of a comfortable bed, and the rush of an orgasm. The forcefulness of this effect can range from subtle to overwhelmingly pleasurable beyond even the most intense full body orgasm possible.

Physical euphoria is often accompanied by other coinciding effects such as cognitive euphoria and muscle relaxation. It is most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as opioids, stimulants, and GABAergics. Although less consistent, it can also occur in a more powerful form under the influence of psychedelics and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/physical-euphoria',
        'https://psychonautwiki.org/wiki/Physical_euphoria'),
       ('clvdzrwd8004f1vcvqzpseqg0', 'Physical fatigue', 'physical-fatigue', null, null, '',
        'Physical fatigue can be described as a general feeling of bodily exhaustion. It is most commonly induced under the influence of moderate dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone. However, it can also occur during the withdrawal symptoms of many depressants, and during the offset of many stimulants.', 'Physical fatigue can be described as a general feeling of bodily exhaustion. The intensity and duration of this effect typically depends on the substance consumed and its dosage. It can also be further exacerbated by various factors such as a lack of sleep or food. These feelings of exhaustion involve a wide variety of symptoms which generally include some or all of the following effects:

People who are fatigued may find it difficult to complete physical actions and may not be capable of getting out of bed or performing everyday household tasks. It can generally be treated with a period of rest or sleep.

Physical fatigue is often accompanied by other coinciding effects such as cognitive fatigue. It is most commonly induced under the influence of moderate dosages of antipsychotic compounds, such as quetiapine, haloperidol, and risperidone. However, it can also occur during the withdrawal symptoms of many depressants, and during the offset of many stimulants.',
        '', '', 'https://www.effectindex.com/effects/physical-fatigue',
        'https://psychonautwiki.org/wiki/Physical_fatigue'),
       ('clvdzrwdg004g1vcv701w6z5w', 'Psychosis', 'psychosis', null, null, '',
        'Psychosis is as an abnormal condition of the mind and a general psychiatric term for a mental state in which one experiences a "loss of contact with reality." It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as deliriants, psychedelics, dissociatives, and cannabinoids.', 'Psychosis is as an abnormal condition of the mind and a general psychiatric term for a mental state in which one experiences a "loss of contact with reality."

[1]

[2]

The features of psychoticism are characterized by delusions, hallucinations, and formal thought disorders exhibiting a wide range of culturally incongruent, odd, eccentric, or unusual behaviours and cognitions, including both process (e.g., perception, dissociation) and content (e.g., beliefs).

[3]

Depending on its severity, this may also be accompanied by difficulty with social interaction and a general impairment in carrying out daily life activities.

Within the context of clinical psychology, psychosis is a very broad term that can mean anything from relatively mild delusions to the complex and catatonic expressions of schizophrenia and bipolar type 1 disorder.

[4]

[5]

[6]

Generally speaking, however, psychosis involves noticeable deficits in cognitive functioning and diverse types of hallucinations or delusional beliefs, particularly those that are in regard to the relation between self and others such as delusions of grandiosity, paranoia, or conspiracy. The most common of these signs and symptoms of psychosis are listed as separate subcomponents below:

Psychosis is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as deliriants,

[7]

[8]

psychedelics,

[9]

dissociatives,

[1]

[1]

and cannabinoids

[1]

[1]

. However, it can also occur under the influence of stimulants,

[1]

[1]

particularly during the comedown or as a result of prolonged binges. It may also manifest from abrupt discontinuation of long-term or heavy usage of certain drugs such as benzodiazepines

[1]

or alcohol

[1]

; this is known as delirium tremens (DTs). Aside from substance abuse, it may also occur as a result of sleep deprivation,

[1]

emotional trauma, urinary tract infections, and various other medical conditions.', '', '',
        'https://www.effectindex.com/effects/psychosis', 'https://psychonautwiki.org/wiki/Psychosis'),
       ('clvdzrwdo004h1vcvst9z08tf', 'Pupil constriction', 'pupil-constriction', null, null, '',
        'Pupil constriction (also called pinpoint pupils or miosis) can be described as the reduction of the size of a person''s pupils under normal lighting conditions. It is most commonly induced under the influence of moderate dosages of opioid compounds, such as heroin, kratom, tramadol, and fentanyl.', 'Pupil constriction (also called pinpoint pupils or miosis) can be described as the reduction of the size of a person''s pupils under normal lighting conditions. This typically decreases a person''s ability to see in low light conditions.

Pupil constriction is most commonly induced under the influence of moderate dosages of opioid compounds, such as heroin, kratom, tramadol, and fentanyl.',
        '', '', 'https://www.effectindex.com/effects/pupil-constriction',
        'https://psychonautwiki.org/wiki/Pupil_constriction'),
       ('clvdzrwdu004i1vcv0yxgqenm', 'Pupil dilation', 'pupil-dilation', null, null, '',
        'Pupil dilation can be described as the enlargement of the size of a person''s pupils under normal lighting conditions. This is most commonly induced under the influence of moderate dosages of a wide variety of serotonergic compounds, such as psychedelics, dissociatives, deliriants, entactogens, various stimulants, and some antidepressants.', 'Pupil dilation (also called mydriasis) can be described as the enlargement of the size of a person''s pupils under normal lighting conditions. Normally, the pupil size increases in the dark and shrinks in the light, however, a dilated pupil will remain excessively large even in a bright environment.

Pupil dilation is most commonly induced under the influence of moderate dosages of a wide variety of serotonergic compounds, such as psychedelics, dissociatives, deliriants, entactogens, various stimulants and some antidepressants.',
        '', '', 'https://www.effectindex.com/effects/pupil-dilation', 'https://psychonautwiki.org/wiki/Pupil_dilation'),
       ('clvdzrwe0004j1vcv27bp42at', 'Recursion', 'recursion', null, null, '',
        'Recursion is a visual distortion that alters the appearance of one''s external environment by repeating specific sections of itself across itself in a self-similar fashion. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Recursion is a visual distortion that alters the appearance of one''s external environment by repeating specific sections of itself across itself in a self-similar fashion. It results in the appearance of fractal-like patterns that often zoom into or away from the original image. This effect typically occurs spontaneously and rarely sustains itself for more than several seconds.

Recursion is often accompanied by other coinciding effects, such as geometry and symmetrical texture repetition. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/recursion', 'https://psychonautwiki.org/wiki/Recursion'),
       ('clvdzrwe6004k1vcv9x08gjk6', 'Rejuvenation', 'rejuvenation', null, null, '',
        'Rejuvenation can be described as feelings of mild to extreme cognitive refreshment which are felt during the afterglow of certain compounds. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives.', 'Rejuvenation is a feeling of mild to extreme cognitive refreshment which is felt during the afterglow of certain compounds. The symptoms of rejuvenation often include a sustained sense of heightened mental clarity, increased emotional stability, increased calmness, mindfulness, increased motivation, personal bias suppression, increased focus, and decreased depression. At its highest level, feelings of rejuvenation can become so intense that they manifest as the profound and overwhelming sensation of being "reborn" anew. This mindstate can potentially last anywhere from several hours to several months after the substance has worn off.

Rejuvenation is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics and dissociatives. However, it can also occur to a lesser extent under the influence of entactogens, cannabinoids, and meditation.',
        '', '', 'https://www.effectindex.com/effects/rejuvenation', 'https://psychonautwiki.org/wiki/Rejuvenation'),
       ('clvdzrweb004l1vcvxfezztqf', 'Respiratory depression', 'respiratory-depression', null, null, '',
        'Respiratory depression can be described as a reduced urge to breathe that can be fatal depending on its intensity. It is most commonly induced under the influence of heavy dosages of depressant compounds, particularly opioids, such as heroin and fentanyl, or GABAergics, such as alcohol and GHB. However, it is worth noting that otherwise safe dosages of these compounds can become fatal when combined with even small amounts of other classes of depressant.', 'Respiratory depression can be described as a reduced urge to breathe that can be fatal depending on its intensity. At relatively safe levels, this effect typically causes a "sighing" pattern of breathing which can be described as deep breaths separated by abnormally long pauses. At higher levels, however, an individual may cease breathing entirely in a manner which is rapidly fatal without immediate treatment.

This effect is capable of manifesting itself across the 4 different levels of intensity described below:

Respiratory depression is often accompanied by other coinciding effects such as sedation and sleepiness. It is most commonly induced under the influence of heavy dosages of depressant compounds, particularly opioids, such as heroin and fentanyl, or GABAergics, such as alcohol and GHB. However, it is worth noting that otherwise safe dosages of these compounds can become fatal when combined with even small amounts of other classes of depressant. For example, benzodiazepines combined with opioids are an extremely common cause of fatal respiratory depression. It is therefore strongly discouraged to combine these depressants at any dosage range.

To prevent death, it is recommended to contact emergency medical services immediately in case of severe respiratory depression. If caused by an opioid overdose, an opioid antagonist, such as naloxone, should be administered. Many harm reduction organizations provide naloxone to users for free or it can be bought at pharmacies (including Walgreens and CVS in the U. S.). Naloxone will rapidly reverse the respiratory depression unless complicated by other depressants.

For other drug-induced respiratory depression, hospitalization and the assistance of a mechanical breathing machine may be necessary.',
        '', '', 'https://www.effectindex.com/effects/respiratory-depression',
        'https://psychonautwiki.org/wiki/Respiratory_depression'),
       ('clvdzrwei004m1vcvgh2byfuh', 'Restless legs', 'restless-legs', null, null, '',
        'Restless legs (also known as restless legs syndrome or RLS) is a neurological disorder characterized by an irresistible urge to move one''s body to stop uncomfortable or odd sensations. Restless legs syndrome is most commonly induced during the withdrawal symptoms of many depressants, such as opioids or benzodiazepines, and during the offset of many stimulants, such as methamphetamine, cocaine, and MDMA. However, it can also occur under the influence of deliriants such as DPH and datura.', 'Restless legs (also known as restless legs syndrome or RLS) is a neurological disorder characterized by an irresistible urge to move one''s body to stop uncomfortable or odd sensations. It most commonly affects the legs but can also affect the arms, torso, and head. During this state, moving the affected body part reduces the uncomfortable sensations, providing temporary relief.

RLS sensations can range from pain, an aching in the muscles, "an itch you can''t scratch", an unpleasant "tickle that won''t stop", or even a crawling feeling. The sensations typically begin or intensify during quiet wakefulness, such as when relaxing, reading, studying, or trying to sleep.

Restless legs syndrome is most commonly induced during the withdrawal symptoms of many depressants, such as opioids or benzodiazepines, and during the offset of many stimulants, such as methamphetamine, cocaine, and MDMA. However, it can also occur under the influence of deliriants such as DPH and datura.',
        '', '', 'https://www.effectindex.com/effects/restless-legs', 'https://psychonautwiki.org/wiki/Restless_legs'),
       ('clvdzrwep004n1vcvv8kyfg3k', 'Scenarios and plots', 'scenarios-and-plots', null, null, '',
        'Scenarios and plots are the situations, stories, and events that occur within both external and internal hallucinations. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Scenarios and plots are the situations, stories, and events that occur within both external and internal hallucinations. These behave in an almost identical fashion to the plots and scenarios that occur during ordinary dream states and often include cognitive delusions that result in one accepting the plot as a real-life event. On rare occasions, however, they will be immediately recognized as a mere hallucination and not a real-life event.

During this effect, the typical components that comprise standard hallucinatory states (settings, sceneries, and landscapes and autonomous entities) begin behaving and co-operating in a manner that results in the experience of events occurring within the hallucination itself. These are often perceived as linear and coherent plots that occur in a logical sequence by leading into other events through normal cause and effect. However, they are equally likely to present themselves as completely nonsensical and incoherent. For example, they may consist of nonlinear or spontaneous events that are capable of ending, starting, and changing between each other repeatedly in quick succession.

These hallucinated plots can consist of new experiences that are completely unlike the real world, old experiences such as accurate memory replays, or a combination of the two. However, in terms of their precise content, this effect is impossible to define in a comprehensive manner in much the same way that one cannot predict the exact plot of unknown literature and films. They can, however, be summarized as basic occurrences that often entail visiting a setting containing interactive objects and autonomous entities. It is also worth noting that the possible situations one may find themselves in as a result of this effect can be either positive or negative to experience depending on both its content and the individual undergoing them.

Hallucinatory plots and scenarios usually feel as if they are being experienced in real-time. For example, when 20 seconds has passed within the hallucination, the same amount of time will usually have passed in the real world. At other points, however, time-distortions can cause plots and scenarios to feel as if they last days, weeks, months, years, aeons, or infinitely extended periods of time.

Scenarios and plots are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, they can also occur less commonly under the influence of stimulant psychosis and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/scenarios-and-plots',
        'https://psychonautwiki.org/wiki/Scenarios_and_plots'),
       ('clvdzrweu004o1vcvmoppiyv1', 'Scenery slicing', 'scenery-slicing', null, null, '',
        'Scenery slicing is the experience of a person''s visual field appearing to split into separate, cleanly cut sections. These individual slices then proceed to drift slowly away from their original position before disappearing and resetting to normal. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Scenery slicing is the experience of a person''s visual field appearing to split into separate, cleanly cut sections. These individual slices then proceed to drift slowly away from their original position before disappearing and resetting to normal. This effect typically occurs spontaneously and rarely sustains itself for more than several seconds.

The organisation of these slices can be quite varied; they can be as simple as three separate sections or extremely complex, with formations such as multiple intricate slices of moving interlocking spirals, or an infinite variety of other potential geometric designs.

Scenery slicing is often accompanied by other coinciding effects, such as environmental cubism and visual disconnection. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur to a lesser extent under the influence of psychedelics,

[1]

such as LSD, psilocybin, and mescaline.', '', '', 'https://www.effectindex.com/effects/scenery-slicing',
        'https://psychonautwiki.org/wiki/Scenery_slicing'),
       ('clvdzrwez004p1vcv0ot38mgb', 'Sedation', 'sedation', null, null, '',
        'Sedation can be described as a decrease in a person''s physical energy levels which are interpreted as discouraging when it comes to wakefulness, movement, performing tasks, talkativeness, and general exercise. It is most commonly induced under the influence of moderate dosages of depressant compounds, such as opioids, GABAergics, and antipsychotics.', 'Sedation can be described as a decrease in a person''s physical energy levels which are interpreted as discouraging when it comes to wakefulness, movement, performing tasks, talkativeness, and general exercise. At lower levels, sedation typically results in feelings of general relaxation and a loss of energy. At higher levels, however, sedation typically results in the person passing out into temporary unconsciousness.

This effect is capable of manifesting itself across the 4 different levels of intensity described below:

Sedation is often accompanied by other coinciding effects such as muscle relaxation, thought deceleration, and sleepiness in a manner which further intensifies the person''s feelings of relaxation. It is most commonly induced under the influence of moderate dosages of depressant compounds, such as opioids, GABAergics, and antipsychotics. However, it may also occur to a lesser extent under the influence of other compounds such as antihistamines, deliriants, cannabinoids and certain psychedelics.',
        '', '', 'https://www.effectindex.com/effects/sedation', 'https://psychonautwiki.org/wiki/Sedation'),
       ('clvdzrwf4004q1vcvw10unir5', 'Epileptic seizure', 'seizure', null, null, '',
        'An epileptic seizure (colloquially a fit) can be described as a brief episode of signs and/or symptoms which are due to abnormal, excessive, or synchronous neuronal activity in the brain. They are most commonly induced under the influence of withdrawals from prolonged chronic benzodiazepine or alcohol usage.', 'An epileptic seizure (colloquially a fit) can be described as a brief episode of signs and/or symptoms which are due to abnormal, excessive, or synchronous neuronal activity in the brain.

[1]

The outward effect can vary from uncontrolled jerking movement (tonic-clonic seizure) to as subtle as a momentary loss of awareness (absence seizure).

An  (colloquially a ) can be described as a brief episode of signs and/or symptoms which are due to abnormal, excessive, or synchronous neuronal activity in the brain.  The outward effect can vary from uncontrolled jerking movement (tonic-clonic seizure) to as subtle as a momentary loss of awareness (absence seizure).

The following list contains a more comprehensive set of symptoms:

*  Losing consciousness and then exhibiting confusion afterwards.

*  Having uncontrollable muscle spasms which often result in falling.

*  Drooling or frothing at the mouth.

The disease of the brain characterized by an enduring predisposition to generate epileptic seizures is known as epilepsy,

[1]

[2]

but seizures can also occur in people who do not have epilepsy. Depending on the cause, epilepsy is generally treated with anticonvulsant drugs such as diazepam and pregabalin.

Seizures are most commonly induced under the influence of withdrawals from prolonged chronic benzodiazepine or alcohol usage. However, they can also occur under the influence of moderate dosages of stimulants, certain opioids, synthetic cannabinoids, and the 25x-NBOMe series of psychedelics.',
        '', '', 'https://www.effectindex.com/effects/seizure', null),
       ('clvdzrwfa004r1vcvar0ards6', 'Seizure suppression', 'seizure-suppression', null, null, '',
        'Seizure suppression is an effect caused by drugs known as "anticonvulsants". These drugs prevent or reduce the severity and frequency of seizures in various types of epilepsy. It is most commonly induced under the influence of moderate dosages of certain GABAergic compounds and certain cannabinoids.', 'Seizure suppression is an effect caused by drugs known as "anticonvulsants". These drugs prevent or reduce the severity and frequency of seizures in various types of epilepsy.

The different types of anticonvulsants may act on different receptors in the brain and have different modes of action. Two mechanisms that appear to be important in anticonvulsants are an enhancement of GABA action and inhibition of sodium channel activity. Other mechanisms are the inhibition of calcium channels and glutamate receptors.

Seizure suppression is most commonly induced under the influence of moderate dosages of certain GABAergic compounds and certain cannabinoids.',
        '', '', 'https://www.effectindex.com/effects/seizure-suppression',
        'https://psychonautwiki.org/wiki/Seizure_suppression'),
       ('clvdzrwfg004s1vcv7zu1knvd', 'Sensed presence', 'sensed-presence', null, null, '',
        'A sensed presence is the distinctive feeling that another conscious agent is present alongside one''s own self. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'A sensed presence is the distinctive feeling that another conscious agent is present alongside one''s own self.

[1]

[2]

This occurs despite a complete absence of clear sensory or perceptual evidence to justify the feeling. In terms of its general location, the consciousness can be perceived as either present in a nonspecific part of the external environment, within one''s own head, or as embedded within a specific object, such as a tree or an inanimate object.

While its intentions are often felt to be unknown, it can also interpreted as some kind of a malicious predator or a loving guardian. This is seemingly dependent on the person''s current emotional state and is often further elaborated upon by the feeling that the presence is following the person, spying on them, protecting them, or simply observing them.

Sensed presence often precedes and leads into hallucinatory effects, such as autonomous entities and autonomous voice communication. It is also often accompanied by other coinciding effects, such as paranoia and delusion. It is most commonly induced under the influence of moderate dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, it is also relatively normal to experience this state of mind outside of psychoactive substance usage and mental illness.

[3]

In fact, it is quite common during high pressure situations, sleep paralysis, after the death of a loved one, as a child, as a symptom of parkinson''s disease,

[4]

and within dark environments of any sort.', '', '', 'https://www.effectindex.com/effects/sensed-presence', null),
       ('clvdzrwfp004t1vcvzclj018q', 'Sensory overload', 'sensory-overload', null, null, '',
        'Sensory overload within the context of psychoactive substance usage is the experience of feeling overwhelmed by the sheer amount of sensory inputs occurring as a result of various other subjective effects.  It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Sensory overload within the context of psychoactive substance usage is the experience of feeling overwhelmed by the sheer amount of sensory inputs occurring as a result of various other subjective effects.

The specific effects that can result in sensory overload commonly include prolonged exposure to any combination of tactile enhancement, spontaneous bodily sensations, stimulation, high-level geometry, internal hallucinations, and auditory hallucinations.  This can often result in feelings of physical discomfort, cognitive impairment, memory suppression, ego death, anxiety, and a general sense of cognitive fatigue.

Sensory overload is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur much less consistently under the influence of other classes of compounds, such as dissociatives, cannabinoids, and stimulants.',
        '', '', 'https://www.effectindex.com/effects/sensory-overload', null),
       ('clvdzrwfz004u1vcv2qzjx4dk', 'Serotonin syndrome', 'serotonin-syndrome', null, null, '', '', 'Serotonin syndrome is an uncomfortable physical effect that can occur when there is a dangerously high excess of serotonin within the brain and body. Its symptoms can range from mild, to severe, and even fatal.

In milder cases, symptoms include high blood pressure and a fast heart rate; usually without a fever. In moderate cases, symptoms include a high body temperature, agitation, increased reflexes, shakiness, sweating, dilated pupils, and diarrhea. In severe cases, however, body temperature can increase to greater than 41.1 C (106.0 F). This can result in complications including seizures, extensive muscle breakdown, and even death.

Serotonin syndrome is most commonly induced when recklessly combining multiple serotonergic substances, especially those which function as serotonin releasers or reuptake inhibitors. To varying degrees, common examples of these  include various combinations of the following substances:

However, this list is far from comprehensive. If you are considering combining multiple substances, it is incredibly important to do your own research. For useful advice on this topic, please also see TripSit''s incredibly detailed substance combination chart.',
        '', '', 'https://www.effectindex.com/effects/serotonin-syndrome', null),
       ('clvdzrwg4004v1vcvj4x2f4mp', 'Settings, sceneries, and landscapes', 'settings-sceneries-and-landscapes', null,
        null, '',
        'Settings, sceneries, and landscapes are the perceived environments in which the plot of an internal or external hallucination occurs. This effect is capable of manifesting in a seemingly infinite variety of potential places and settings. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Settings, sceneries, and landscapes are the perceived environments in which the plot of an internal or external hallucination occurs.

[1]

This effect is capable of manifesting in a seemingly infinite variety of places and settings.

When explored, the geography of these settings is capable of organizing itself as static and coherent. However, they may also manifest as a non-linear, nonsensical, and continuously changing layout that does not obey the laws of physics. The chosen locations, appearance, and style of these settings may be entirely new and previously unseen locations; however, there is a large influence towards replicating and combining real-life locations stored within a person''s memories. There are some common themes and archetypes within this component which generally include:

Jungles, rainforests, deserts, ice-scapes, cities, natural environments, caves, space habitats, vast structures, civilizations, technological utopias, ancient ruins, machinescapes, historical settings, rooms and other indoor environments, real-life locations, incomprehensible geometric landscapes, and more.

It is worth noting that the content, style, and general behaviour of a setting is often largely dependent on the emotional state of the person experiencing it. For example, a person who is emotionally stable and generally happy will be more prone to experiencing neutral, interesting, or positive settings. In contrast, however, a person who is emotionally unstable and generally unhappy will be more prone to experiencing sinister, fear-inducing, and negative settings.

Settings, sceneries, and landscapes are often accompanied by other coinciding effects, such as autonomous entities and delusions. They are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants. However, they can also occur under the influence of stimulant psychosis and during dreams.',
        '', '', 'https://www.effectindex.com/effects/settings-sceneries-and-landscapes',
        'https://psychonautwiki.org/wiki/Settings,_sceneries,_and_landscapes'),
       ('clvdzrwg9004w1vcv2a3mldrf', 'Shadow people', 'shadow-people', null, null, '',
        'Shadow people are the experience of perceiving patches of shadow in one''s peripheral or direct line of sight to appear and behave as living, autonomous beings. They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'Shadow people are the experience of perceiving patches of shadow in one''s peripheral or direct line of sight to appear and behave as living, autonomous beings.

[1]

[2]

[3]

Due to the unique behaviour of these hallucinations, they can be considered a distinct subtype of autonomous entities.

Shadow people usually appear initially as fleeting images in a person''s peripheral vision. However, at higher levels of intensity, shadow people may appear in full view. This allows the user to directly look at one in their central line of sight. At higher levels of intensity, it becomes possible to look away from and back to a shadow person without a change in the presence or appearance of the hallucination.

The bodies of shadow people are usually perceived as being comprised of blackness that has a sense of depth and few facial or body features. The blackness of their bodies often seem almost opaque, as if one is looking into a "black hole" in humanoid form. They may also appear in the shape of animals, uniform blobs, disembodied body parts, or a myriad of other indescribable shapes. They sometimes appear to have faces, eyes, or mouths and are able to move or change shape. The movement exhibited can be normal human movement or it can be faster, slower, or choppier than a normal person''s gait. It is also possible for multiple shadow people to occupy one''s field of vision simultaneously while acting autonomously from one another, sometimes even interacting with each other.

It is worth noting that the style and general behaviour of a shadow person are often largely dependent on the emotional state of the person experiencing it. For example, a person who is emotionally stable and generally happy will be more prone to experiencing neutral, interesting, or friendly shadow people. In contrast, however, a person who is emotionally unstable and generally unhappy will be more prone to experiencing sinister and fear-inducing shadow people.

Shadow people are often accompanied by other coinciding effects, such as delirium, paranoia, anxiety, and feelings of impending doom. They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine. However, they can also occur under the influence of stimulant psychosis, sleep deprivation, and during sleep paralysis.

[4]

Although it is uncommon and not an intrinsic part of this hallucinatory effect, shadow people can be accompanied by other sensory components alongside of the person''s visual perception of them. This usually only occurs during very intense states of sleep deprivation, delirium, or psychosis. For example, shadow people can potentially have an accompanying "voice", despite the lack of a visible mouth structure. This auditory communication follows an identical levelling system of progressively more detailed and coherent speech similar to a generic autonomous entity. Shadow people may converse with the person experiencing them or they may converse amongst each other, sometimes talking about the person going through the experience.

Alongside accompanying auditory hallucinations, shadow people may also present tactile and gustatory hallucinations. This is even rarer than their potential auditory effects and typically only occurs in particularly intense and advanced hallucinatory states. Their tactile effects can be indistinguishable from a real human touch and may vary in temperature. They can also include physical actions, such as pulling on clothing, hair, or one''s skin.',
        '', '', 'https://www.effectindex.com/effects/shadow-people', 'https://psychonautwiki.org/wiki/Shadow_people'),
       ('clvdzrwge004x1vcvcow1tcfo', 'Shakiness', 'shakiness', null, null, '',
        'Shakiness is the experience of vibrations and trembling throughout a person''s body, their limbs, or most commonly, their hands. It is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds', 'Shakiness is the experience of vibrations and trembling throughout a person''s body, their limbs, or most commonly, their hands. It is somewhat similar in appearance and sensation to that of the shivering which occurs when a person is cold. This trembling is also often accompanied by a feeling of general weakness and unsteadiness within the areas of one''s body that are currently affected.

Shakiness is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds such as LSD, 2C-E, DOC, and AMT. However, it can also occur under the influence of MDMA and traditional stimulants.',
        '', '', 'https://www.effectindex.com/effects/shakiness', null),
       ('clvdzrwgj004y1vcvo4s88jsn', 'Skin flushing', 'skin-flushing', null, null, '',
        'Skin flushing can be described as the experience of a sudden reddening of the skin which is usually accompanied by feelings of rushing blood and warm skin. It is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, tramadol, fentanyl, and kratom. However, it can also occur under the influence of alcohol, certain psychedelics such as 5-MeO-DMT, and stimulants, such as caffeine.', 'Skin flushing can be described as the experience of a sudden reddening of the skin which is usually accompanied by feelings of rushing blood and warm skin. In terms of its appearance, it manifests itself in an identical although more intense fashion to that which occurs across the face when one is embarrassed. Blotchiness or solid patches of redness are also often visible during states of skin flushing.

Skin flushing is most commonly induced under the influence of heavy dosages of opioid compounds, such as heroin, tramadol, fentanyl, and kratom. However, it can also occur under the influence of alcohol, certain psychedelics such as 5-MeO-DMT, and stimulants, such as caffeine.',
        '', '', 'https://www.effectindex.com/effects/skin-flushing', 'https://psychonautwiki.org/wiki/Skin_flushing'),
       ('clvdzrwgp004z1vcv8mmnbzo8', 'Sleepiness', 'sleepiness', null, null, '',
        'Sleepiness (also known as drowsiness) is medically recognized as a state of near-sleep, or a strong desire for sleep without feeling a decrease in one''s physical energy levels. This state is independent of a circadian rhythm; so, unlike sedation, this effect does not necessarily decrease physical energy levels but instead decreases wakefulness. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds such as cannabinoids, GABAergic depressants, opioids, antipsychotics, some antihistamines, and certain psychedelics.', 'Artaloytia, J. F., Arango, C., Lahti, A., Sanz, J., Pascual, A., Cubero, P., ... & Palomo, T. (2006). Negative signs and symptoms secondary to antipsychotics: a double-blind, randomized trial of a single dose of placebo, haloperidol, and risperidone in healthy volunteers. American Journal of Psychiatry, 163(3), 488-493.

https://doi.org/10.1176%2Fappi.ajp.163.3.488', '', '', 'https://www.effectindex.com/effects/sleepiness',
        'https://psychonautwiki.org/wiki/Sleepiness'),
       ('clvdzrwgu00501vcvc99tt8mc', 'Spatial disorientation', 'spatial-disorientation', null, null, '',
        'Spatial disorientation is the failure to perceive or perceiving incorrectly the position, motion, or altitude of oneself within the fixed coordinate system provided by the surface of the Earth and the gravitational vertical. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as diphenidine, ketamine, and DXM.', 'Spatial disorientation  is the failure to perceive or perceiving incorrectly the position, motion, or altitude of oneself

[1]

within the fixed coordinate system provided by the surface of the Earth and the gravitational vertical.

[2]

In this state, a person may have trouble distinguishing up from down, right from left, or any two different directions from another. The person might also perceive the world or their own body as being flipped sideways or upside down.

Spatial disorientation is often accompanied by other coinciding effects such as holes, spaces and voids, changes in felt gravity

[3]

, and dizziness.

[4]

It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as diphenidine,

[4]

ketamine,

[5]

and DXM.', '', '', 'https://www.effectindex.com/effects/spatial-disorientation',
        'https://psychonautwiki.org/wiki/Spatial_disorientation'),
       ('clvdzrwh100511vcvzt75tkki', 'Spirituality enhancement', 'spirituality-enhancement', null, null, '',
        'Spirituality enhancement can be described as the experience of a shift in a person’s personal beliefs regarding their existence and place within the universe, their relationship to others, and what they value as meaningful in life. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Spirituality enhancement is the experience of a shift in a person’s personal beliefs regarding their existence and place within the universe, their relationship to others, and what they value as meaningful in life. It results in a person rethinking the significance they place on certain key concepts, holding some in higher regard than they did previously, and dismissing others as less important.

[1]

These concepts and notions are not limited to but generally include:

Although difficult to fully specify due to the subjective aspect of spirituality enhancement, these changes in a person''s belief system can often result in profound changes in their personality

[5]

[7]

[13]

, which can sometimes be distinctively noticeable to the people around those who undergo it. This shift can occur suddenly, but will usually increase gradually over time as a person repeatedly uses the psychoactive substance inducing it.

Spirituality enhancement is unlikely to be an isolated effect component but rather the result of a combination of an appropriate setting

[3]

in conjunction with other coinciding effects such as analysis enhancement, novelty enhancement, perception of interdependent opposites, perception of predeterminism, perception of self-design, personal bias suppression, introspection, and unity and interconnectedness. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of dissociatives, such as ketamine, PCP, and DXM.',
        '', '', 'https://www.effectindex.com/effects/spirituality-enhancement', null),
       ('clvdzrwh800521vcvt8fmu787', 'Spontaneous physical movements', 'spontaneous-physical-movements', null, null, '',
        'Spontaneous physical movements are the experience of seemingly random yet structured movements or twitches in groups of muscles throughout the body. They most commonly occur under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Spontaneous physical movements are the experience of seemingly random yet structured movements or twitches in groups of muscles throughout the body. These are not typically uncomfortable to experience and often feel as if they somehow occur in conjunction with or as a direct representation of both a person''s current cognitive state and their sensory input.

Spontaneous physical movements are often accompanied by other coinciding effects, such as ego death, synaesthesia, and spontaneous bodily sensations. They most commonly occur under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/spontaneous-physical-movements', null),
       ('clvdzrwhe00531vcveifycs3f', 'Spontaneous tactile sensations', 'spontaneous-tactile-sensations', null, null, '',
        'Spontaneous tactile sensations are the experience of sensations across the body occurring without any obvious or immediate physical trigger. This results in feelings of seemingly random yet distinct tingling sensations that occur across the skin and within the body. Depending on the psychoactive substance consumed, these vary greatly in their styles of sensation.', 'Spontaneous tactile sensations are the experience of sensations across the body occurring without any obvious or immediate physical trigger. This results in feelings of seemingly random yet distinct tingling sensations that occur across the skin and within the body. Depending on the psychoactive substance consumed, these vary greatly in their styles of sensation.

This effect is capable of manifesting itself across the three different levels of intensity described below:

Spontaneous tactile sensations are often accompanied by other coinciding effects, such as tactile enhancement and physical euphoria. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, they can also occur under the influence of stimulants, cannabinoids, and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/spontaneous-tactile-sensations', null),
       ('clvdzrwhj00541vcv8v0vpgug', 'Stamina enhancement', 'stamina-enhancement', null, null, '',
        'Stamina enhancement can be described as an increased ability to engage in physically and mentally taxing activities without the development of fatigue. It most commonly occurs under the influence of stimulants such as amphetamine and specific psychedelics such as LSD.', 'Stamina enhancement can be described as an increased ability to engage in physically and mentally taxing activities without the development of fatigue. Although this effect is commonly mistaken for stimulation, it differs as it is not a direct increase in one''s energy levels. Instead, it is an increase in one''s resilience in performing an activity combined with a mitigation of general fatigue.

Psychoactive substances that directly increase a person''s endurance without stimulation are known as actoprotectors. These are defined as "substances that enhance body stability against physical or mental loads without increasing oxygen consumption or heat production."

[1]

Although actoprotetors are extremely uncommon, there are many compounds are capable of inducing endurance enhancement alongside other effects such as stimulation, focus enhancement, and motivation enhancement. These commonly include most stimulants such as amphetamine

[2]

and specific psychedelics

[3]

such as LSD.', '', '', 'https://www.effectindex.com/effects/stamina-enhancement', null),
       ('clvdzrwho00551vcv9993dtvz', 'Stimulation', 'stimulation', null, null, '',
        'Stimulation can be described as an increase in a person''s physical energy levels. It is most commonly induced under the influence of stimulant compounds, such as amphetamine, MDMA, and cocaine.', 'Stimulation can be described as an increase in a person''s physical energy levels and are beneficial when it comes to feelings of wakefulness, movement, performing tasks, talkativeness, and general exercise.

[1]

[2]

[3]

At lower levels, stimulation typically presents itself as encouraged more so than forced. This can be described as feeling distinctly energetic, but in a purely controllable fashion that does not overwhelm the person with involuntary movements should they choose to stop expending large amounts of energy. It is often accompanied by other coinciding effects, such as motivation enhancement, analysis enhancement, thought acceleration, focus enhancement, and appetite suppression, which can result in a distinct increase in the person''s overall productivity.

At higher levels, stimulation typically presents itself as forced more so than encouraged. This can be described as the effects of increased energy becoming so pronounced that the person will be incapable of relaxing and feel an irresistible urge to perform some sort of physical task. It is often accompanied by other coinciding effects such as thought disorganization, focus suppression, short-term memory suppression, increased heart rate, teeth grinding, temporary erectile dysfunction, sweating, and dehydration, which can lead to a distinct decrease in the person''s overall productivity.

Stimulation is most commonly induced under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants such as amphetamine, methylphenidate, MDMA, and cocaine. However, it may also occur under the influence of other compounds such as certain psychedelics and dissociatives.',
        '', '', 'https://www.effectindex.com/effects/stimulation', 'https://psychonautwiki.org/wiki/Stimulation'),
       ('clvdzrwht00561vcvxpyjkq1z', 'Stomach bloating', 'stomach-bloating', null, null, '',
        'Stomach bloating can be described as an uncomfortable physical side effect which results in one''s stomach becoming temporarily bloated and expanded in a manner which looks somewhat similar to pregnancy. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur under the influence of stimulants, opioids, and depressants.', 'Stomach bloating can be described as an uncomfortable physical side effect which results in one''s stomach becoming temporarily bloated and expanded in a manner which looks somewhat similar to pregnancy. This effect can be moderately uncomfortable but is not painful or dangerous. Its overall duration can last anywhere from a couple of hours to a couple of days and can be reduced by drinking plenty of water.

In the context of substance usage, stomach bloating can occur as a result of stomach irritation through the consumption of materials which it is not used to digesting. These materials can include things such as chemical powders or plant matter. Alternatively, stomach bloating may occur as a direct pharmacological result of how the particular substance affects the large amount of serotonin receptors present within the intestinal wall.

Stomach bloating is often accompanied by other coinciding effects such as nausea and vomiting. It is most commonly induced under the influence of heavy dosages of psychedelics compounds, such as LSD, psilocybin, and mescaline. However, it can also occur under the influence of stimulants, opioids, and depressants.',
        '', '', 'https://www.effectindex.com/effects/stomach-bloating',
        'https://psychonautwiki.org/wiki/Stomach_bloating'),
       ('clvdzrwhy00571vcvpy76usdd', 'Stomach cramp', 'stomach-cramp', null, null, '',
        'A stomach cramp can be described as an intense feeling of sudden pain or discomfort which occurs within the stomach. They are most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as psychedelics, opioids, GABAergics, and deliriants.', 'A stomach cramp can be described as an intense feeling of sudden pain or discomfort which occurs within the stomach.

In the context of substance usage, stomach cramps can occur as a result of stomach irritation through the consumption of materials which it is not used to digesting. These materials can include things such as chemical powders or plant matter. Alternatively, cramps may occur as a direct pharmacological result of how the particular substance affects the brain. If this is the case, the stomach cramps are therefore inseparable from the experience itself and will likely occur to varying extents regardless of the route of administration.

Stomach cramps are often accompanied by other coinciding effects such as stomach bloating, nausea, and vomiting. They are most commonly induced under the influence of heavy dosages of a wide variety of compounds, such as psychedelics, opioids, GABAergics, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/stomach-cramp', 'https://psychonautwiki.org/wiki/Stomach_cramp'),
       ('clvdzrwi500581vcvic9pfjy8', 'Suggestibility suppression', 'suggestibility-suppression', null, null, '',
        'Suggestibility suppression is a decreased tendency to accept and act on the suggestions of others. It is most commonly induced under the influence of GABAergic depressants.', 'Suggestibility suppression is a decreased tendency to accept and act on the suggestions of others. A common example of suggestibility suppression in action would be a person being unwilling to believe or trust another person''s suggestions without a greater amount of prior discussion than would usually be considered necessary during every day sobriety.

Although this effect can occur as a distinct mindstate, it may also arise due to interactions between a number of other effects. For example, a person who is currently experiencing mild paranoia combined with analysis enhancement may find themselves less trusting and more inclined to think through the suggestions of others before acting upon them, alternatively, a person who is experiencing ego inflation may find that they value their own opinion over others and are therefore equally less likely to follow the suggestions of others.

Alcohol has been shown to decrease suggestibility in a dose-dependent manner,

[1]

[2]

while its withdrawals increases suggestibility.

[3]

A large proportion of individuals who come in contact with law enforcement personnel are under the influence of alcohol, including perpetrators, victims, and witnesses of crimes. This has to be taken into account when investigative interviews are planned and conducted, and when the reliability of the information derived from such interviews is evaluated.

[1]

[2]

[3]

Suggestibility suppression is often accompanied by other coinciding effects such as irritability

[1]

and ego inflation. It is most commonly induced under the influence of GABAergic depressants.

[1]

[2]

[3]

It may also be induced in an inconsistent manner under the influence of moderate dosages of stimulant compounds, particularly dopaminergic stimulants such as nicotine

[4]

, amphetamine, and cocaine. However, the specific situations in which suggestibility suppression will or will not occur under the influence of these compounds remains unpredictable and seemingly depends on the individual''s gender or specific personality traits.

[4]

[5]', '', '', 'https://www.effectindex.com/effects/suggestibility-suppression',
        'https://psychonautwiki.org/wiki/Suggestibility_suppression'),
       ('clvdzrwid00591vcvsg5uso96', 'Suicidal ideation', 'suicidal-ideation', null, null, '',
        'Suicidal ideation can be described as the experience of compulsive suicidal thoughts and a general desire to end one''s own life.  It is most commonly induced under the influence of moderate dosages of various antidepressants of the selective serotonin reuptake inhibitor class.', 'Suicidal ideation can be described as the experience of compulsive suicidal thoughts and a general desire to end one''s own life. These thoughts patterns and desires range in intensity from fleeting thoughts to an intense fixation. This effect can also create a predisposition to other self-destructive behaviors such as self-harm or drug abuse and, if left unresolved, can eventually lead to attempts of suicide.

Suicidal ideation is often accompanied by other coinciding effects such as depression and motivation enhancement in a manner which maintains the person''s negative view on life but also increases their will to take immediate action. It is most commonly induced under the influence of moderate dosages of various antidepressants of the selective serotonin reuptake inhibitor class. However, outside of psychoactive substance usage, it can also occur as a manifestation of a number of things including mental illness, traumatic life events, and interpersonal problems.

If you suspect that you are experiencing symptoms of suicidal ideation, it is highly recommended that you seek out therapy, medical attention, or a support group.',
        '', '', 'https://www.effectindex.com/effects/suicidal-ideation',
        'https://psychonautwiki.org/wiki/Suicidal_ideation'),
       ('clvdzrwil005a1vcvjxygyqy0', 'Symmetrical texture repetition', 'symmetrical-texture-repetition', null, null, '',
        'Symmetrical texture repetition is the perception of textures becoming mirrored repeatedly over their own surface in an intricate and symmetrical fashion that is consistent across itself. It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Symmetrical texture repetition is the perception of textures becoming mirrored repeatedly over their own surface in an intricate and symmetrical fashion that is consistent across itself. This maintains the same level of detail no matter how closely one attempts to look at the distortion and tends to remain most prominent within one''s peripheral vision. It usually manifests itself in rough textures, such as grass, carpets, tree bark, and asphalt.

If one stares at a fixed point during this state, the symmetrical texture repetition may progressively increase and further tesselate into more complex forms. However, this progression of complexity will usually reset back to baseline as soon as one double takes.

Symmetrical texture repetition is often accompanied by other coinciding effects, such as increased pareidolia

[1]

[2]

and transformations. This can result in the appearance of an array of abstract forms and imagery embedded within the symmetry. It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur less commonly under the influence of MDMA and certain dissociatives, such as 3-MeO-PCP or DXM.',
        '', '', 'https://www.effectindex.com/effects/symmetrical-texture-repetition',
        'https://psychonautwiki.org/wiki/Symmetrical_texture_repetition'),
       ('clvdzrwir005b1vcv0ti9t9b9', 'Synaesthesia', 'synaesthesia', null, null, '',
        'Synaesthesia (also spelt synesthesia or synæsthesia) is the experience of a blending, merging, or mixing of the senses. Synaesthesia is commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Synaesthesia (also spelled synesthesia or synæsthesia) is the experience of a blending, merging, or mixing of the senses.

[1]

For example, a person experiencing synaesthesia may begin seeing music, tasting colors, hearing smells, or any other potential combination of the senses.

[2]

At its highest level, synaesthesia becomes so all-encompassing that each of the senses become completely intertwined with the rest of one''s senses. This is a complete blending of human perception and is usually interpreted as extremely profound when experienced. It is worth noting that a significant percentage of the population experience synaesthesia to varying extents during everyday life without the use of drugs.

[3]

[4]

Synaesthesia is commonly induced under the influence of heavy dosages of psychedelic compounds,

[5]

such as LSD, psilocybin, and mescaline. However, it is seemingly most commonly experienced under the influence of stimulating psychedelics such as the 2C-x, DOx, and Nbome series.',
        '', '', 'https://www.effectindex.com/effects/synaesthesia', 'https://psychonautwiki.org/wiki/Synaesthesia'),
       ('clvdzrwix005c1vcvfy4jrss2', 'Tactile distortion', 'tactile-distortion', null, null, '',
        'A tactile distortion is the experience of a perceived alteration in one''s sense of touch. This is distinct from that of a tactile hallucination, as it exclusively alters the perception of pre-existing sensations and does not add any new content. They are most commonly induced under the influence of hallucinogenic compounds, such as psychedelics, deliriants, and salvia divinorum.', 'A tactile distortion is the experience of a perceived alteration in one''s sense of touch. This is distinct from that of a tactile hallucination, as it exclusively alters the perception of pre-existing sensations and does not add any new content.

Tactile distortions can manifest in a variety of different styles, but the most common examples include:

* Textures and surfaces feeling softer, sharper, smoother, rougher, hotter, colder, etc, than they usually would.

* Tactile sensations persisting longer than they usually would, often well after the person has stopped touching the initial object that triggered it.

* The spreading of tactile sensations throughout the rest of the body, often starting at its genuine origin point before propagating across the skin.

* Tactile sensations occurring in regions of the body other than their specific origin point.

Tactile distortions are often accompanied by other coinciding effects, such as tactile hallucinations and changes in felt bodily form. They are most commonly induced under the influence of hallucinogenic compounds, such as psychedelics, deliriants, and salvia divinorum.',
        '', '', 'https://www.effectindex.com/effects/tactile-distortion', null),
       ('clvdzrwj2005d1vcv697ndmkt', 'Tactile enhancement', 'tactile-enhancement', null, null, '',
        'Tactile enhancement is an overall increase in both the intensity of a person''s sense of touch and their awareness of the physical sensations across their body. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Tactile enhancement is an overall increase in both the intensity of a person''s sense of touch and their awareness of the physical sensations across their body. At its highest level, this becomes extreme enough that the exact location and current sensation of every single nerve ending across one''s skin can be felt all at once. In contrast, most people can only maintain awareness of the tactile sensations that are relevant to their current situation in their sober state.

This effect can result in tactile sensations such as touching, hugging, kissing, and sex becoming greatly enhanced in terms of the pleasure they induce. However, it can also result in an over-sensitivity of the skin, which causes the same sensations to become uncomfortable and overwhelming.

Tactile enhancement is often accompanied by other coinciding effects, such as spontaneous bodily sensations and physical euphoria. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur under the influence of stimulants, cannabinoids, and certain dissociatives, such as 3-MeO-PCP.',
        '', '', 'https://www.effectindex.com/effects/tactile-enhancement', null),
       ('clvdzrwj7005e1vcv7bv8r0p2', 'Tactile hallucination', 'tactile-hallucination', null, null, '',
        'A tactile hallucination is the experience of perceiving a convincing physical sensation that is not actually occurring. They are most commonly induced under the influence of heavy dosages of deliriant compounds, such as DPH, datura, and benzydamine.', 'A tactile hallucination is the experience of perceiving a convincing physical sensation that is not actually occurring.

[1]

[2]

Common examples of this can include people or insects

[3]

touching the body in various places and in a wide variety of ways. Alternatively, these hallucinations can be felt as complex and structured arrangements of vibration or pressure across the skin.

This effect may be also accompanied by visual hallucinations of a plausible cause related to the sensation. For example, during internal and external hallucinations, one may be able to touch and feel imagined objects or autonmous entities just as convincingly as within normal everyday dreams. The sensations that are possible within these hallucinations are nearly limitless and can even include pain or sexual pleasure.

Tactile hallucinations are most commonly induced under the influence of heavy dosages of deliriants compounds, such as DPH, datura, and benzydamine. However, they can also occur to a lesser extent under the influence of psychedelics, stimulant psychosis

[4]

and extreme sleep deprivation.', '', '', 'https://www.effectindex.com/effects/tactile-hallucination',
        'https://psychonautwiki.org/wiki/Tactile_hallucination'),
       ('clvdzrwjd005f1vcviub5k885', 'Tactile suppression', 'tactile-suppression', null, null, '',
        'Tactile suppression is a decrease in one''s ability to feel their sense of touch, which may result in a general numbness across the body. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Tactile suppression is a decrease in one''s ability to feel their sense of touch, which may result in a general numbness across the body. At higher levels, this can eventually increase to the point where physical sensations have been completely blocked and the body is fully anaesthetized.

Tactile suppression is often accompanied by other coinciding effects, such as pain relief and physical euphoria. It is most commonly induced under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM. However, it can also occur under the influence of opioids and certain GABAergic depressants.',
        '', '', 'https://www.effectindex.com/effects/tactile-suppression',
        'https://psychonautwiki.org/wiki/Tactile_suppression'),
       ('clvdzrwji005g1vcvj4ba7x18', 'Teeth chattering', 'teeth-chattering', null, null, '',
        'Teeth chattering is the experience of a compulsive and often uncontrollably rapid slight opening and closing of a person''s mouth, similar to that of when a person is cold or afraid. It is most commonly induced under the influence of heavy dosages of serotonergic compounds, such as MDMA and DXM.', 'Teeth chattering is the experience of a compulsive and often uncontrollably rapid slight opening and closing of a person''s mouth. The effect is similar to that of when a person is cold or afraid, though it should be noted that in this context (whereby the effect is a result of psychoactive compounds), teeth chattering occurs independently of such external stimuli.

Teeth chattering is often accompanied by other coinciding effects such as teeth grinding and vibrating vision. It is most commonly induced under the influence of heavy dosages of serotonergic compounds, such as MDMA and DXM. However, it can also occur under the influence of certain stimulating psychedelics such as 2C-E, DOC, and AMT.',
        '', '', 'https://www.effectindex.com/effects/teeth-chattering', null),
       ('clvdzrwjr005h1vcvr6lxngpp', 'Teeth grinding', 'teeth-grinding', null, null, '',
        'Teeth grinding (also known as bruxism, jaw clenching, and gurning) can be described as a compulsive and often uncontrollable urge to grind one''s teeth. It is most commonly induced under the influence of common dosages of stimulant compounds, such as methamphetamine, MDMA, methylphenidate, and cocaine. However, it can also occur under the influence of certain stimulating psychedelics such as 2C-E, DOC, and AMT.', 'Teeth grinding (also known as bruxism, jaw clenching, and gurning) can be described as a compulsive and often uncontrollable urge to grind one''s teeth. In extreme cases, this can result in painful damage to one''s tongue, teeth and inner cheek.

The most effective methods for quickly alleviating uncomfortable teeth grinding include using chewing gum or a baby''s pacifier (also called a dummy) to occupy one''s jaws without causing damage. Magnesium, preferably glycinate, is also very effective at alleviating bruxism when it is taken at a dosage of 200mg once 6 hours before and again at 1-3 hours before ingesting a stimulant such as MDMA or amphetamine.

[1]

Teeth grinding is often accompanied by other coinciding effects such as stimulation and wakefulness. It is most commonly induced under the influence of common dosages of stimulant compounds, such as methamphetamine, MDMA, methylphenidate, and cocaine. However, it can also occur under the influence of certain stimulating psychedelics such as 2C-E, DOC, and AMT.',
        '', '', 'https://www.effectindex.com/effects/teeth-grinding', 'https://psychonautwiki.org/wiki/Teeth_grinding'),
       ('clvdzrwk0005i1vcvpyozuu3g', 'Temperature regulation suppression', 'temperature-regulation-suppression', null,
        null, '',
        'Temperature regulation suppression can be defined as an inability to maintain a normal temperature. It is most commonly induced under the influence of heavy dosages of stimulating psychedelic compounds, such as LSD, 2C-B, and AMT.', 'Temperature regulation suppression can be defined as an inability to maintain a normal temperature. This results in feelings of constantly fluctuating between being uncomfortably cold and uncomfortably hot. At points, this can even result in the sensation of being uncomfortably warm and cold simultaneously.

Temperature regulation suppression is often accompanied by other coinciding effects such as stimulation and increased perspiration. It is most commonly induced under the influence of heavy dosages of stimulating psychedelics compounds, such as LSD, 2C-B, and AMT. However, it can also occur under the influence of stimulants such as MDMA and methamphetamine.',
        '', '', 'https://www.effectindex.com/effects/temperature-regulation-suppression',
        'https://psychonautwiki.org/wiki/Temperature_regulation_suppression'),
       ('clvdzrwk6005j1vcv8mkvcexr', 'Temporary erectile dysfunction', 'temporary-erectile-dysfunction', null, null, '',
        'Temporary erectile dysfunction can be described as a difficulty in achieving and maintaining an adequately erect penis for the purpose of sexual intercourse. It is most commonly induced under the influence of heavy dosages of stimulating compounds, such as traditional stimulants and certain psychedelics. However, it can also occur under the influence of opioids, dissociatives, GABAergics, and deliriants.', 'Temporary erectile dysfunction can be described as a difficulty in achieving and maintaining an adequately erect penis for the purpose of sexual intercourse. This effect occurs under the influence of certain substances in various degrees of intensity.

Temporary erectile dysfunction is often accompanied by other coinciding effects such as stimulation, difficulty urinating, and temperature regulation suppression in a manner which further amplifies the problem. It is most commonly induced under the influence of heavy dosages of stimulating compounds, such as traditional stimulants and certain psychedelics. However, it can also occur under the influence of opioids, dissociatives, GABAergics, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/temporary-erectile-dysfunction',
        'https://psychonautwiki.org/wiki/Temporary_erectile_dysfunction'),
       ('clvdzrwkb005k1vcv3yjmfi6z', 'Texture liquidation', 'texture-liquidation', null, null, '',
        'Texture liquidation is the experience of the texture, shape, and general structure of objects and scenery appearing progressively simplified, smudged and stylized in such a way that one''s external environment begins to take on the aesthetic of a painting or cartoon.  It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Texture liquidation is the experience of the texture, shape, and general structure of objects and scenery appearing progressively simplified, smudged and stylized in such a way that one''s external environment begins to take on the general appearance of a painting or cartoon.

Texture liquidation is often accompanied by other coinciding effects, such as visual acuity enhancement and drifting. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/texture-liquidation', null),
       ('clvdzrwkg005l1vcvsoqtmy39', 'Thought acceleration', 'thought-acceleration', null, null, '',
        'Thought acceleration (also known as racing thoughts) is the experience of thought processes being sped up significantly in comparison to that of everyday sobriety. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, modafinil, and MDMA.', 'Thought acceleration (also known as racing thoughts

[1]

) is the experience of thought processes being sped up significantly in comparison to that of everyday sobriety.

[2]

[3]

When experiencing this effect, it will often feel as if one rapid-fire thought after the other is being generated in incredibly quick succession. Thoughts while undergoing this effect are not necessarily qualitatively different, but greater in their volume and speed. However, they are commonly associated with a change in mood that can be either positive or negative.

[4]

Thought acceleration is often accompanied by other coinciding effects such as stimulation, anxiety, and analysis enhancement in a manner which not only increases the speed of thought but also significantly enhances the sharpness of a person''s mental clarity. It is most commonly induced under the influence of moderate dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, modafinil, and MDMA. However, it can also occur under the influence of certain stimulating psychedelics such as LSD, 2C-E, DOC, AMT.',
        '', '', 'https://www.effectindex.com/effects/thought-acceleration',
        'https://psychonautwiki.org/wiki/Thought_acceleration'),
       ('clvdzrwkm005m1vcvygineqr1', 'Thought connectivity', 'thought-connectivity', null, null, '',
        'Thought connectivity is an alteration of a person''s thought stream which is characterized by a distinct increase in wandering thoughts which connect into each other through a fluid association of ideas. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Thought connectivity is an alteration of a person''s thought stream which is characterized by a distinct increase in wandering thoughts which connect into each other through a fluid association of ideas.

[1]

[2]

[3]

[4]

During this state, thoughts may be subjectively experienced as a continuous stream of vaguely related ideas which tenuously connect into each other by incorporating a concept that was contained within the previous thought. When experienced, it is often likened to a complex game of word association.

During this state, it is often difficult for the person to consciously guide the direction of their thoughts in a manner that leads into a state of increased distractibility. This will usually also result in one''s train of thought contemplating an extremely broad variety of subjects, which can range from important, trivial, insightful, and nonsensical topics.

Thought connectivity is often accompanied by other coinciding effects such as thought acceleration and creativity enhancement. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of dissociatives, stimulants, and cannabinoids.

Semantic associativity is a specific subtype of thought connectivity. It is characterized by an increased association of words or phrases with others which are related in language or meaning.

The most common features of semantic associativity are novel word substitutions and an increased duration taken to put names to things.

[5]

[6]

[7]

During this state, word substitution and misnaming occur more frequently when identifying items within a given category: these substitutions may be unpredictable or free-associative, such as saying "dog" when "cat" is meant.

[8]

These changes in cognition indicate an alteration of what researchers call "semantic priming", or the kind of words that are evoked when related or competing ideas are discussed.

[9]

It is worth noting that depending on whether a more loosely associative vocabulary is considered creatively valuable or cognitively undesirable for a given situation or context, semantic associativity may be considered as either a cognitive enhancement or a cognitive depression.

Semantic associativity most commonly occurs under the influence of moderate dosages of hallucinogens

[3]

such as cannabis, LSD, and psilocybin.

[5]

[8]

[9]

In cannabis research, the increase of semantic priming is often considered characteristic of a broad disruption of conventional thought and language.

[6]

[10]

[11]

[12]', '', '', 'https://www.effectindex.com/effects/thought-connectivity',
        'https://psychonautwiki.org/wiki/Thought_connectivity'),
       ('clvdzrwkt005n1vcvx5aaembo', 'Thought deceleration', 'thought-deceleration', null, null, '',
        'Thought deceleration is the process of thought being slowed down significantly in comparison to that of normal sobriety. It is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics, antipsychotics, and opioids.', 'Thought deceleration (also known as bradyphrenia)

[1]

is the process of thought being slowed down significantly in comparison to that of normal sobriety. When experiencing this effect, it will feel as if the time it takes to think a thought and the amount of time which occurs between each thought has been slowed down to the point of greatly impairing cognitive processes. It can manifest itself in delayed recognition, slower reaction times, and fine motor skills deficits.

Thought deceleration is often accompanied by other coinciding effects such as analysis suppression and sedation in a manner which not only decreases the person''s speed of thought, but also significantly decreases the sharpness of a person''s mental clarity. It is most commonly induced under the influence of heavy dosages of depressant compounds, such as GABAergics

[2]

[3]

[4]

, antipsychotics

[5]

, and opioids

[6]

[7]

[8]

. However, it can also occur to a lesser extent under the influence of heavy dosages of hallucinogens such as psychedelics

[9]

, dissociatives

[10]

, deliriants

[4]

[11]

, and cannabinoids

[12]

[13]

[14]

[15]', '', '', 'https://www.effectindex.com/effects/thought-deceleration',
        'https://psychonautwiki.org/wiki/Thought_deceleration'),
       ('clvdzrwl0005o1vcv6k8inguk', 'Thought disorganization', 'thought-disorganization', null, null, '',
        'Thought disorganization is a state in which one''s ability to analyze and categorize conceptual information using a systematic and logical thought process is considerably decreased. It is most commonly induced under the influence of heavy dosages of hallucinogenic and depressant compounds, such as dissociatives, psychedelics, cannabinoids, and GABAergics.', 'Thought disorganization is a state in which one''s ability to analyze and categorize conceptual information using a systematic and logical thought process is considerably decreased. It seemingly occurs through an increase in thoughts that are unrelated or irrelevant to the topic at hand, thus decreasing one''s capacity for a structured and cohesive thought stream. This effect also seems to allow the user to hold a significantly lower amount of relevant information in their train of thought that can be useful for extended mental calculations, articulating ideas, and analyzing logical arguments.

Thought disorganization is often accompanied by other coinciding effects, such as analysis suppression and thought acceleration. It is most commonly induced under the influence of heavy dosages of hallucinogenic and depressant compounds, such as  dissociatives

[1]

[2]

[3]

[4]

, psychedelics

[1]

[5]

, cannabinoids

[1]

[6]

[7]

, and GABAergics

[8]

[9]

. However, it is worth noting that the same stimulant or nootropics compounds that induce thought organization at lower dosages can also often result in the opposite effect of thought disorganization at higher dosages.

[1]

[9]

[10]

[11]', '', '', 'https://www.effectindex.com/effects/thought-disorganization',
        'https://psychonautwiki.org/wiki/Thought_disorganization'),
       ('clvdzrwl6005p1vcvbv0pxu52', 'Thought loops', 'thought-loops', null, null, '',
        'A thought loop is the experience of becoming trapped within a chain of thoughts, actions and emotions which repeats itself over and over again in a cyclic loop. Thought loops are most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics and dissociatives. However, they can also occur to a lesser extent under the influence of extremely heavy dosages of stimulants and benzodiazepines.', 'Thought loops are the experience of becoming trapped within a chain of thoughts, actions and emotions which repeats itself over and over again in a cyclic loop. These loops usually range from anywhere between 5 seconds and 2 minutes in length. However, some users have reported them to be up to a few hours in length. It can be extremely disorientating to undergo this effect and it often triggers states of progressive anxiety within people who may be unfamiliar with the experience. The most effective way to end a cycle of thought loops is to simply sit down and try to let go.

This state of mind is most likely to occur during states of memory suppression in which there is a partial or complete failure of the person''s short-term memory. This may suggest that thought loops are the result of cognitive processes becoming unable to sustain themselves for appropriate lengths of time due to a lapse in short-term memory, resulting in the thought process attempting to restart from the beginning only to fall short once again in a perpetual cycle.

When this effect occurs in conjunction with high level internal hallucinations, it often results in the hallucinatory scenarios repeating themselves in the same way the person''s thoughts are. These looped hallucinations can remain exactly the same with each repetition, but will often change in their overall details while maintaining specific themes and elements throughout each iteration.

Thought loops are most commonly induced under the influence of heavy dosages of hallucinogenic compounds,

[1]

such as psychedelics and dissociatives. However, they can also occur to a lesser extent under the influence of extremely heavy dosages of stimulants and benzodiazepines.',
        '', '', 'https://www.effectindex.com/effects/thought-loops', null),
       ('clvdzrwld005q1vcvmho3g357', 'Thought organization', 'thought-organization', null, null, '',
        'Thought organization (also known as fluid intelligence) is as a state of mind in which one''s ability to analyze and categorize conceptual information using a systematic and logical thought process is considerably increased. It is most commonly induced under the influence of mild dosages of stimulant and nootropic compounds, such as amphetamine, methylphenidate, and Noopept', 'Lundqvist, T. (2005). Cognitive consequences of cannabis use: comparison with abuse of stimulants and heroin with regard to attention, memory and executive functions. Pharmacology Biochemistry and Behavior, 81(2), 319-330.

https://doi.org/10.1016/j.pbb.2005.02.017', '', '', 'https://www.effectindex.com/effects/thought-organization',
        'https://psychonautwiki.org/wiki/Thought_organization'),
       ('clvdzrwli005r1vcvcdf2trz5', 'Time distortion', 'time-distortion', null, null, '',
        'Time distortion is an effect that makes the passage of time feel wildly altered and difficult to keep track of.   is most commonly induced under the influence of strong dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and cannabinoids.', 'Time distortion is an effect that makes the passage of time feel wildly altered and difficult to keep track of.

[1]

[2]

[3]

It can occur in form of four distinct subtypes, which are documented below.

Time dilation is the feeling that time has slowed down.

[4]

[5]

This can create the perception that more time has passed than it actually has. For example, at the end of hallucinogenic experiences which typically last no longer than several hours, one may feel that they have subjectively undergone days, weeks, months, years, or even infinite periods of time.

Time dilation is often accompanied by other coinciding effects such as spirituality enhancement, novelty enhancement, thought loops, novelty enhancement, and internal hallucinations. This is seemingly because these particular effects can result in a person perceiving a disproportionately large number of novel events occurring within a much smaller frame of time than they usually would.

Time dilation is most commonly induced under the influence of strong dosages of hallucinogenic compounds, such as psychedelics

[6]

, dissociatives

[7]

, and cannabinoids

[8]

. However, it also commonly occurs during moments of extreme stress and fear.

[9]

Time compression is the experience of time speeding up and passing much quicker than it usually would.

[1]

[2]

[10]

For example, during this state, a person may realize that an entire day or evening has passed them by in what feels like only a couple of hours.

This commonly occurs under the influence of stimulating compounds such as amphetamines and entactogens. With these particular substances, time compression seems to at least partially stem from the fact that during intense levels of stimulation and focus-enhancement, people typically become hyper-fixated on activities and tasks in a manner that causes them to both keep track of time less effectively and also become more likely to ignore any events which may be unfolding around them.

However, the same experience also commonly occurs in a different manner while under the influence of depressant compounds which induce amnesia, such as alcohol, GHB, and benzodiazepines. This is seemingly due to the way in which a person can forget events that occurred under the influence of the particular substance, thus giving the impression that they have suddenly jumped forward in time.

Time reversal is the experience of perceiving the events that occurred around oneself within the previous several minutes or several hours, spontaneously playing backwards in a manner similar to that of a rewinding VHS tape. During this reversal, the person''s cognition and train of thought typically continues to play forward in a coherent and linear manner while they watch the external environment around them and their body''s physical actions play in reverse. It is speculated that the experience of time reversal may potentially occur through a combination of visual hallucinations and errors in memory encoding.

Time reversal is often accompanied by other coinciding effects such as internal hallucinations, thought loops, and deja vu. It is most commonly induced under the influence of extremely heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.

Atemporality is the experience of feeling as if one''s conscious awareness is now outside of, disconnected from, and uninfluenced by the normal passage of linear time. During this state, there is often a sense that the flow of time has ceased to function and has also become inherently meaningless.

While experiencing atemporality, one’s ability to conceptualize ordinary time may be compromised in several ways. For example, the concept of ‘one hour’ may no longer make any sense. As a different example, the concepts of ‘one second’ and ‘one year’ may both seem like a single well-defined unit. The paradoxical sensation of ‘existing’ outside of time is also often connected to reports of being unable to adequately describe this effect using ordinary language.

Atemporality is often accompanied by other coinciding effects such as perception of eternalism and ego death. It is most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, DMT, psilocybin, and mescaline.

An experience of transcending time is also one among many criteria assessed by the MEQ-30, which is a standardized questionnaire used in clinical research observing how psychedelic-induced mystical experiences can occasion positive long-term changes in patients’ mental health.

[11]', '', '', 'https://www.effectindex.com/effects/time-distortion',
        'https://psychonautwiki.org/wiki/Time_distortion'),
       ('clvdzrwln005s1vcvucud0yo6', 'Tinnitus', 'tinnitus', null, null, '',
        'Tinnitus is the experience of a sound which is usually described as a ringing, humming, buzzing, roaring, hissing, or clicking that occurs when no corresponding external sound is present. It can occur under the influence of a wide variety of compounds', 'Tinnitus is the experience of a sound which is usually described as a ringing, humming, buzzing, roaring, hissing, or clicking that occurs when no corresponding external sound is present.

[1]

[2]

This sound can be quiet or loud in volume, low or high in pitch, and can sound as if it is coming from either both ears, one ear, or from an internal location within the head itself. At higher levels of intensity or with prolonged persistence, tinnitus can significantly interfere with a person''s concentration in a manner that is distinctly uncomfortable and associated with increased anxiety or depression.

Tinnitus is a relatively common experience that regularly affects around 5-10% of the population.

[3]

Within the context of psychoactive substance usage, however, it can occur under the influence of a wide variety of compounds such DMT, 5-MeO-DMT, nitrous oxide, aspirin, tricyclic antidepressants, and buproprion. It can also occur under the influence of benzodiazepine withdrawals, sleep deprivation, and stimulant comedowns.',
        '', '', 'https://www.effectindex.com/effects/tinnitus', 'https://psychonautwiki.org/wiki/Tinnitus'),
       ('clvdzrwls005t1vcvjdi4pzey', 'Tracers', 'tracers', null, null, '',
        'Tracers are the experience of visual trails of varying lengths and opacity being left behind moving objects. They are most commonly induced under the influence of mild dosages of psychedelic compounds.', 'Tracers are the experience of visual trails of varying lengths and opacity being left behind moving objects in a manner that is similar to those found in long exposure photography.

[1]

They will usually manifest as exactly the same colour of the moving object producing it or can sometimes be a randomly selected colour of their own.

A relatively consistent way to reproduce this visual effect is to simply move one''s hand in front of their face or throw an object under the influence of a moderate dose of psychedelics.

This effect is capable of manifesting itself across the 4 different levels of intensity described below:

Tracers are often accompanied by other coinciding effects, such as drifting and after images. They are most commonly induced under the influence of mild dosages of psychedelic

[2]

[3]

compounds, such as LSD

[4]

[5]

[6]

[7]

, psilocybin, and mescaline. However, they can also occur less commonly under the influence of MDMA and certain dissociatives, such as 3-MeO-PCP or DXM.',
        '', '', 'https://www.effectindex.com/effects/tracers', 'https://psychonautwiki.org/wiki/Tracers'),
       ('clvdzrwlx005u1vcvpy4pvnff', 'Transformations', 'transformations', null, null, '',
        'Transformations are the experience of a perceived visual metamorphosis that specific parts of one''s external environment undergo as they shapeshift into other objects. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Transformations are the experience of a perceived visual metamorphosis that specific parts of one''s external environment undergo as they shapeshift into other objects. For example, people who experience this effect will often report seeing parts of their environment shifting into completely different things. These transformations have a huge variety of potential artistic styles and differing levels of detail, realism, and animation.

These hallucinations are progressive in nature. They form from patterns or objects and their appearance fluidly drifts into an entirely new form over several seconds. This is caused and enhanced by a separate visual effect known as increased pareidolia, which can cause vague stimuli and objects to transform into incredibly detailed versions of what they were already perceived as.

At lower levels, the process of transformations can require a minimal amount of focus and concentration to sustain. Losing concentration for an instant can cause the image to fade away or shift into another image. Holding the eyes still will usually increase the intensity of the progressive transformation. However, this becomes completely unnecessary at higher levels.

It is worth noting that the content, style, and general behaviour of a transformation is often largely dependent on the emotional state of the person experiencing it. For example, a person who is emotionally stable and generally happy will be more prone to experiencing neutral and interesting transformations. In contrast, however, a person who is emotionally unstable and generally unhappy will be more prone to experiencing sinister and fear-inducing transformations.

Transformations are often accompanied by other coinciding effects, such as drifting, increased pareidolia and external hallucinations. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, they can also occur under the influence of deliriants such as DPH, datura, and benzydamine.',
        '', '', 'https://www.effectindex.com/effects/transformations',
        'https://psychonautwiki.org/wiki/Transformations'),
       ('clvdzrwm8005v1vcvfxrnyrcx', 'Unity and interconnectedness', 'unity-and-interconnectedness', null, null, '',
        'Unity and interconnectedness refers to a feeling in which one''s sense of self becomes temporarily expanded to include one or more concepts or systems that would not typically be included within one’s sense of individual identity. It most commonly occurs under the influence of psychedelic and dissociative compounds, such as LSD, DMT, ayahuasca, mescaline, and ketamine.', 'Without any question or hesitation, I undoubtedly believe that this particular transpersonal effect is by far the most important and significant state of mind the psychedelic experience has to offer. I have been fascinated by this effect for around a decade now and first came to learn of its existence as a teenager through the numerous first hand accounts given to me by my close friends. This effect was further solidified in my mind as something of extreme significance after I found the works of Alan Watts through his philosophical lectures and writings. I then proceeded to dive headfirst into meditation and obsessively contemplating the supposedly illusory nature of the self on a daily basis. I even found that on more than one occasion, I could lead people into experiencing states of high level unity by simply saying the right words to them during heavy psychedelic trips.

However, despite my borderline obsession with this subjective effect and its associated philosophical frameworks, I found that no matter how heavy a dosage of a psychedelic I consumed, I could never experience this state of mind for myself. This led me to the conclusion that regardless of how common an occurrence this effect was for many other experienced psychedelic users, my extreme fascination with it must be the exact thing that is preventing me from experiencing it for myself. This caused me to inevitably let my guard down for what was to come. Approximately two years later while under the influence of ayahuasca, I spontaneously found myself undergoing a state of level 4 unity for the first time in my life. This happened on two separate occasions within a month and, at the time, were by far the most profound and lifechanging psychedelic experiences I had ever undergone in my entire life.

In the years after these two experiences, I have since undergone states of unity on two other occasions, both of which were under the influence of 4-HO-MET and also less than a month apart. These experiences seemingly came out of nowhere and I cannot for the life of me understand or figure out any causal factors or correlations behind the triggering of this state of mind.  As far as I can tell, it seems that certain individuals are much more prone to it than others, but almost everybody will inevitably experience this if they trip regularly enough over a long period of time. It does not seem to be dependent on the dosage or the psychedelic in question, although set and setting seems to be at least somewhat of a factor. Situations involving beautiful nature, deep contemplation, and philosophical conversation can often cause it to come about, but not in a reliable or reproducible fashion. It therefore seems that states of unity and interconnectedness must arise organically and out of a situation in which the person either comes to a conclusion of their own accord, or perhaps where some subconscious process of the mind is allowed to independently arise in an autonomous manner.

At this point, I cannot deny that I personally believe the common conception of a separate self is merely a construct of human perception. In fact, I would go even further and state that based upon my extensive research, this widely held position is both philosophically and scientifically justifiable. However, I want to make it clear that I do not have any desire to convince people of that here. Instead, I simply aim to document the subjective experience of this perspective in a manner that is as comprehensive and reasonable as possible. This is with the hope that people far more intelligent than me can someday use this article as a template for furthering our collective understanding of this profound and absolutely fascinating state of mind.',
        '', '', 'https://www.effectindex.com/effects/unity-and-interconnectedness',
        'https://psychonautwiki.org/wiki/Unity_and_interconnectedness'),
       ('clvdzrwmg005w1vcvctwe37hd', 'Unspeakable horrors', 'unspeakable-horrors', null, null, '',
        'Unspeakable horrors describe the experience of prolonged exposure to indescribable scenarios and hallucinatory content of a scary and disturbing nature, which are often directly influenced by a person''s fears. They are most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and 2C-P.', 'Unspeakable horrors are the experience of prolonged exposure to scenarios and hallucinatory content of a nightmarish, scary, threatening, and disturbing nature, which are often directly influenced by a person''s fears. This can occur during high dose hallucinogenic experiences, particularly those in which the user is currently undergoing negative emotional stressors and personal problems of an introspective nature.

Although the content that comprises these states are generally ineffable and largely dependent on the fears of those who experience them, certain tropes, themes, and archetypes often manifest themselves. These consist of, but are not limited to:

The experience of this component and how it is interpreted by those who undergo it seems to differ wildly between people. While  certain individuals can find this state to be traumatizing if unprepared, many people find that, although terrifying, these experiences can be exhilarating and help to build character. To ensure that one does not find themselves in this state unwittingly, heavy dosages of hallucinogens should be avoided without prior practice. A person should always work their way up to the higher levels from lower dosages in small increments as they feel comfortable doing so.

Unspeakable horrors are often accompanied by other coinciding effects, such as anxiety, psychosis, and memory suppression. They are most commonly induced under the influence of heavy dosages of psychedelic compounds, such as LSD, psilocybin, and 2C-P. They can also occur under the influence of deliriants, such as DPH, datura, and benzydamine. It is also possible to experience unspeakable horrors while under the influence of dissociatives, such as DXM and PCP, but particularly when combined with other hallucinogenic substances, such as LSD or DPH.',
        '', '', 'https://www.effectindex.com/effects/unspeakable-horrors',
        'https://psychonautwiki.org/wiki/Unspeakable_horrors'),
       ('clvdzrwmn005x1vcv42kj3nhl', 'Vasoconstriction', 'vasoconstriction', null, null, '',
        'Vasoconstriction can be described as a narrowing of the veins and blood vessels which results from a contraction of their muscular wall. It is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds, such as LSD, 2C-E, and DOC.', 'Vasoconstriction can be described as a narrowing of the veins and blood vessels which results from a contraction of their muscular wall. It is particularly prevalent in the large arteries and small arterioles.

This effect typically results in feelings of tightness, achiness, and numbness within a person''s arms and legs. It can range from mild in its effects to extremely uncomfortable.

Vasoconstriction is often accompanied by other coinciding effects such as stimulation. It is most commonly induced under the influence of moderate dosages of stimulating psychedelic compounds, such as LSD, 2C-E, and DOC. However, it can also occur under the influence of traditional stimulants such as methamphetamine, caffeine, and MDMA.',
        '', '', 'https://www.effectindex.com/effects/vasoconstriction',
        'https://psychonautwiki.org/wiki/Vasoconstriction'),
       ('clvdzrwms005y1vcv2fvm78ue', 'Vasodilation', 'vasodilation', null, null, '',
        'Vasodilation can be described as a widening of the veins and blood vessels which results from the relaxation of smooth muscle cells within the vessel walls. It is most commonly induced under the influence of moderate dosages of cannabinoid compounds, such as cannabis, JWH-018, and THJ-018. However, it can also occur under the influence of poppers and viagra.', 'Vasodilation can be described as a widening of the veins and blood vessels which results from the relaxation of smooth muscle cells within the vessel walls. It is particularly prevalent in the large arteries and small arterioles. The primary function of vasodilation is to increase blood flow in the body to tissues that need it most. In essence, this process is the opposite of vasoconstriction, which is the narrowing of blood vessels.

This effect is typically very difficult to consciously perceive but often results in a bloodshot red eye effect and relief from glaucoma.

[1]

[2]

Vasodilation is often accompanied by other coinciding effects such as decreased blood pressure. It is most commonly induced under the influence of moderate dosages of cannabinoid compounds, such as cannabis, JWH-018, and THJ-018. However, it can also occur under the influence of poppers and viagra.',
        '', '', 'https://www.effectindex.com/effects/vasodilation', 'https://psychonautwiki.org/wiki/Vasodilation'),
       ('clvdzrwmx005z1vcvz8a6bbsl', 'Vibrating vision', 'vibrating-vision', null, null, '',
        'Vibrating vision, also known as nystagmus, is the experience of constant, rapid involuntary eye movements in which the eyes shift from left to right in such quick succession that the person''s vision begins to vibrate and blur. It is most commonly induced under the influence of heavy dosages of stimulant compounds, such as MDMA, amphetamine, and 4-FA.', 'Vibrating vision, also known as nystagmus, is the experience of constant, rapid involuntary eye movements in which the eyes shift from left to right in such quick succession that the person''s vision begins to vibrate and blur. This can severely impair vision and result in a reduced ability to function and perform basic tasks which necessitate the use of sight.

Vibrating vision is often accompanied and enhanced by other coinciding effects such as stimulation and thought acceleration. It is most commonly induced under the influence of heavy dosages of stimulant compounds, such as MDMA, amphetamine, and 4-FA.',
        '', '', 'https://www.effectindex.com/effects/vibrating-vision',
        'https://psychonautwiki.org/wiki/Vibrating_vision'),
       ('clvdzrwn200601vcvj3zzmo76', 'Visual acuity enhancement', 'visual-acuity-enhancement', null, null, '',
        'Visual acuity enhancement is a heightening of the clearness and clarity of vision. It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Visual acuity enhancement is a heightening of the clearness and clarity of vision. This results in the visual details of the external environment becoming sharpened, to the point where the edges of objects are perceived as extremely focused, clear, and defined. The experience of acuity enhancement can be likened to bringing a camera or projector lens that was slightly blurry into focus. At its highest level, a person may experience an enhancement in their ability to observe and comprehend their entire visual field and peripheral vision simultaneously. This is in contrast to the default sober state, where a person is only able to perceive the small area of central vision in detail.

[1]

Visual acuity enhancement is often accompanied by other coinciding effects such as colour enhancement and increased pareidolia.

[2]

[3]

It is most commonly induced under the influence of mild dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline. However, it can also occur to a lesser extent under the influence of certain stimulants, nootropics, and dissociatives, such as MDMA, piracetam, aniracetam, or 3-MeO-PCP.',
        '', '', 'https://www.effectindex.com/effects/visual-acuity-enhancement',
        'https://psychonautwiki.org/wiki/Visual_acuity_enhancement'),
       ('clvdzrwn700611vcvxmton3ml', 'Visual acuity suppression', 'visual-acuity-suppression', null, null, '',
        'Acuity suppression is the degradation of the sharpness and clarity of one''s vision, resulting in vision becoming partially to completely blurred and indistinct. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as alcohol, quetiapine, ketamine, and DXM.', 'Visual acuity suppression is the degradation of the sharpness and clarity of one''s vision, resulting in vision becoming partially to completely blurred and indistinct.

[1]

[2]

This may affect either the entirety of the person''s vision or specific sections of it. The experience of acuity suppression is comparable to looking through an out of focus lens that degrades the detail one can see in the external environment. Depending on its intensity, this can often result in a reduced ability to function and perform basic tasks that necessitate the use of sight.

Visual acuity suppression is often accompanied by other coinciding effects, such as double vision and visual agnosia. This effect is most commonly induced under the influence of moderate dosages of depressant and dissociative compounds, such as alcohol

[3]

, quetiapine

[4]

, ketamine

[5]

, and DXM

[6]', '', '', 'https://www.effectindex.com/effects/visual-acuity-suppression',
        'https://psychonautwiki.org/wiki/Visual_acuity_suppression'),
       ('clvdzrwnd00621vcvuu928zpt', 'Visual agnosia', 'visual-agnosia', null, null, '',
        'Visual agnosia is a partial to complete inability to mentally process visual information, regardless of its clarity. It is most commonly induced under the influence of heavy dosages of dissociative or antipsychotic compounds, such as ketamine, quetiapine, PCP, and DXM.', 'Visual agnosia is a partial to complete inability to mentally process visual information, regardless of its clarity. For example, although one may be able to see what is in front of them in perfect detail, they will have a reduced ability to recognize what they are looking at. This can render even the most common everyday objects as unrecognizable, but holds particularly true with faces. It is also worth noting that this effect is directly comparable to the visual disorder known as visual apperceptive agnosia.

[1]

Visual agnosia is often accompanied by other coinciding effects, such as analysis suppression and thought deceleration. It is most commonly induced under the influence of heavy dosages of dissociative or antipsychotic compounds, such as ketamine, quetiapine, PCP, and DXM. However, it can also occur to a lesser extent under the influence of extremely heavy dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/visual-agnosia', null),
       ('clvdzrwnk00631vcve0dwwnu9', 'Visual auras', 'visual-auras', null, null, '',
        'Visual auras are the experience of glowing fields of translucent emanating colour which surround the edges of a person, an object, or any part of the environment. They are most commonly induced under the influence of moderate dosages of psychedelic compounds.', 'Visual auras are the experience of glowing fields of translucent emanating colour which surround the edges of a person, an object, or any part of the environment. These auras can vary greatly in their colour, thickness, opacity, and the sharpness of their edges. At lower levels, they are typically highly transparent and not particularly large in size with a thickness that barely extends beyond the edge of the thing which it is emanating from. At higher levels, however, auras can extend well beyond the thing which which they are emanating from, with vivid colours that that are almost entirely opaque in their transparency.

Auras are often accompanied by other coinciding effects, such as colour enhancement, colour shifting, and chromatic aberration. They are most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/visual-auras', null),
       ('clvdzrwns00641vcv77brwl8k', 'Visual disconnection', 'visual-disconnection', null, null, '',
        'Visual disconnection is the experience of becoming distanced and/or detached from one''s sense of vision.  It is a near-universal effect under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.', 'Visual disconnection is the experience of becoming distanced and/or detached from one''s sense of vision. At its lower levels, this results in visual acuity suppression, double-vision, visual agnosia, and frame rate suppression. This experience can create a wide range of subjective changes to a person''s perception of their own vision. These are described and documented in the list below:

* Feeling as if one is watching the world through a screen

* Feeling as if the visually perceivable world is further away in distance

* Feeling as if one is looking at the world through someone else''s eyes

* Double vision that, at higher levels, forces the user to close one eye if they need to read or perceive fine visual details

Visual disconnection is often accompanied by other coinciding effects, such as cognitive disconnection and physical disconnection. This results in the sensation that one is partially or completely detaching from both their sensory input and their conscious faculties. It is a near-universal effect under the influence of moderate dosages of dissociative compounds, such as ketamine, PCP, and DXM.

At its higher levels, visual disconnection can become all-encompassing in its effects. This results in a complete perceptual disconnection from one''s sense of sight, which can be described as the experience of being completely blinded and unable to tell whether the eyes are open or closed due to a total lack of sensory input. During this state, the effect often leads one into the experience of finding themselves floating through a dark and mostly empty hallucinatory void.

Holes, spaces and voids are a sub-component of visual disconnection that manifest when it has become all-encompassing in its intensity. This experience is more commonly known as a "K-hole"

[1]

[2]

and is generally discussed as something that is specifically associated with ketamine, despite being present within most traditional dissociatives. A K-hole can be described as the place a person finds themselves in once visual disconnection becomes powerful enough to leave the person incapable of receiving external sensory input, replacing their visual input with a space that subjectively feels as if it is outside of normal reality.

The visual appearance of this space, hole, or void can be described as a vast, mostly empty and darkened chamber that often feels and appears to be infinite in size. This space is usually dark black in its colour, but can occasionally display itself with large patches of slow-moving amorphous colour clouds or subtle geometric patterns across its horizon. At its higher levels, these voids are often populated with hallucinatory structures, which are comprehensively described and documented in the subsection below.

Alongside this visual experience, changes in gravity and a powerful sense of tactile disconnection are also usually present. This can result in one feeling as if they are undergoing an out-of-body experience while weightlessly floating through a void over great distances in a variety of different speeds, directions, and orientations. This is a feeling that is interpreted by many people as floating through space or the night sky.

Structures are the only feature found within what would otherwise be completely empty and uninhabited voids. These manifest as monolithic 3-dimensional shapes or structures of an infinite variety and size that float above, below, around, or in front of a person as they gradually zoom, rotate, transform, or pan into focus, gradually unveiling before the person''s line of sight.

These structures can take the form of any shape, but common examples include vast and giant pillars, columns, tunnels, blocks, buildings, slides, monuments, wheels, pyramids, caves, and a variety of abstract shapes. They are often fractal in shape and can manifest in a variety of colours, but usually follow darker themes and tones with an associated aesthetic that is sometimes subjectively interpreted as "alien" in nature.

Structures can be broken down into the 4 basic levels of complexity and visual intensity described below:

Structures typically display themselves anywhere between 30 seconds to several minutes before the person experiencing them slips back into reality or into the presence of another structure. In terms of how these structures shift between each other, their transition processes can be broken down into 4 basic categories. These are described and documented below:

*  - Structures can switch between each other by transforming or shapeshifting in a static and comprehensible way. This is something that usually unfolds in a gradual step-by-step morphing process.

*  - Structures can switch between each other by remaining completely static in their shape and simply panning out of view until they are no longer within one''s field of vision. It’s from here that another structure usually comes into view from outside of one''s peripheral vision within a few seconds to a couple of minutes.

*  - Structures can switch between each other by disassembling into many tiny sections that resemble pixels, or building blocks. This occurs in a manner that is reminiscent of smoke or dust blowing in the wind. When forming through this style, the structure will appear to assemble itself step-by-step, becoming increasingly complex as it occurs.

*  - The third method of transitioning is experienced when the structures appear to be stationary whilst one is floating silently between them over what can feel like extreme physical distances. This floating is sometimes felt to occur on an invisible rail through the vast and infinite dissociative hole."',
        '', '', 'https://www.effectindex.com/effects/visual-disconnection',
        'https://psychonautwiki.org/wiki/Visual_disconnection'),
       ('clvdzrwny00651vcvqjg9cbdu', 'Visual exposure to inner mechanics of consciousness',
        'visual-exposure-to-inner-mechanics-of-consciousness', null, null, '',
        'Visual exposure to inner mechanics of consciousness is the experience of being exposed to a mass of visual geometry comprised entirely of innately readable representations which subjectively feel as if they convey the inner mechanics that compose all underlying neurological processes.', 'Visual exposure to inner mechanics of consciousness is the experience of being exposed to masses of visual geometry comprised entirely of innately readable representations which subjectively feel as if they convey the inner mechanics that compose all underlying neurological processes. These processes often include concepts such as the structure of one''s neurology, identity, memories, perspectives, emotions, and general cognitive functions.

As a direct result of this, the organization, structure, and programming behind a person''s conscious mind are felt to be conceptually understood through the perception of these geometric forms. This is generally interpreted by those who undergo it as visually perceiving the supposed inner workings of either "the universe", "consciousness", or "reality".

During the experience, some users feel as though the effect is capable of bestowing specific pieces of information onto them regarding the nature of reality and consciousness. These specific pieces of information are usually felt and understood to be a profound unveiling of an undeniable truth at the time. Afterward, however, they are often found to be meaningless, nonsensical, or delusional. Although, genuine lessons or coherent messages can occasionally be taken away from these experiences. It’s extremely important to note that the scientific validity of these lessons is very uncertain and should never be immediately accepted as true without an extremely thorough and sober analysis.

Perceived exposure to inner mechanics of consciousness is often accompanied by other coinciding effects such as ego death and high level geometry. It is most commonly induced under the influence of heavy dosages of sedating psychedelic compounds with high amounts of hallucinatory content, such as psilocybin, ayahuasca, DMT, and 2C-C.',
        '', '', 'https://www.effectindex.com/effects/visual-exposure-to-inner-mechanics-of-consciousness', null),
       ('clvdzrwo300661vcvxpglmxi2', 'Visual exposure to semantic concept network',
        'visual-exposure-to-semantic-concept-network', null, null, '',
        'Visual exposure to semantic concept network is the experience of percieving a seemingly infinite mass of complex interconnected geometric forms  comprised entirely of innately understandable representations. These individual geometric representations are perceived to simultaneously convey every internally stored concept and memory contained within the mind.', 'Visual exposure to semantic concept network is the experience of percieving a seemingly infinite mass of complex interconnected geometric forms which are comprised entirely of innately understandable representations. Together, these individual geometric representations are perceived to simultaneously convey every internally stored concept and memory contained within the mind.

At its lower end, this effect is something that fluctuates wildly and is neither constant or consistent in its intensity. Instead, it is momentarily triggered by the experience of a concept. For example, if someone were to say the word "Internet" to a person who is currently undergoing this state, they would see the mind''s concept of the Internet immediately manifested in a geometric form amidst the very centre of their visual field. This form will then quickly branch out from itself in a manner similar to a spider diagram or mind map chart.

For example, the concept "Internet" may have dozens of immediate child nodes that are representative of computers, which may have associated descendant nodes involving technologies. This may branch out further to include concepts representing human intelligence, which may then branch out into concepts related to the evolution of humanity, and so on until all concepts known to the person are represented within the network.

Once this occurs, the sensory overload can temporarily disconnect one from their external environment and result in simultaneous long-term memory suppression, or "ego death",  for several seconds to a minute before a person is briefly returned to reality. This is usually triggered again and again in quick succession. However, it is worth noting that this process can, to a certain extent, be disabled through continuous physical movements. This may be because movement stops the process of thoughts branching out by not giving one''s brain the time it needs to lock onto new concepts as it is focused on movement rather than processing thoughts.

As the dose of the psychoactive substance is increased, the process becomes easier to trigger while extending its length and duration. This eventually results in a stable state of complete disconnection from the external environment alongside sustained "ego death", as well as feelings of experiencing "all of existence" in a single instant.

Visual exposure to inner mechanics of consciousness is often accompanied by other coinciding effects such as ego death and high level geometry. It is most commonly induced under the influence of heavy dosages of stimulating psychedelic compounds with little hallucinatory content, such as LSD, 2C-B, and 4-HO-MET.',
        '', '', 'https://www.effectindex.com/effects/visual-exposure-to-semantic-concept-network', null),
       ('clvdzrwo900671vcvkj5o29r0', 'Visual flipping', 'visual-flipping', null, null, '',
        'Visual flipping distorts the surrounding environment to make it appear as if it has been rotated, mirrored, or flipped into an alternative orientation. For example, one''s vision may suddenly be viewed as upside down or sideways. This effect is usually very fleeting in its occurrence, typically ranging from a few seconds to less than a minute.', 'Visual flipping distorts the surrounding environment to make it appear as if it has been rotated, mirrored, or flipped into an alternative orientation. For example, one''s vision may suddenly be viewed as upside down or sideways. This effect is usually very fleeting in its occurrence, typically ranging from a few seconds to less than a minute.

Visual flipping is an uncommon and rare effect that is often accompanied by other coinciding effects, such as visual stretching, double vision, and visual disconnection. It is most commonly induced under the influence of heavy dosages of

dissociative compounds, such as ketamine, PCP, and DXM. However, this holds particularly true for the onset of nitrous oxide and salvia divinorum, especially in the moments immediately preceding ego death.',
        '', '', 'https://www.effectindex.com/effects/visual-flipping', null),
       ('clvdzrwoe00681vcvw02ab9s8', 'Visual haze', 'visual-haze', null, null, '',
        'Visual haze distorts the surrounding environment to make it appear as if the air is shrouded in an imaginary cloud of smoke, fog, or haze.  It is most commonly induced under the influence of mild dosages of hallucinogenic compounds, such as psychedelics, deliriants, and cannabinoids.', 'Visual haze distorts the surrounding environment to make it appear as if the air is shrouded in an imaginary cloud of smoke, fog, or haze. This effect varies in its intensity, ranging from subtle and barely visible to extreme and all-encompassing in a manner that can significantly impair a person''s vision.

Visual haze is often accompanied by other coinciding effects, such as visual acuity suppression and external hallucinations. It is most commonly induced under the influence of mild dosages of hallucinogenic compounds, such as psychedelics, deliriants, and cannabinoids. However, it can also occur less commonly under the influence of stimulant psychosis and sleep deprivation.',
        '', '', 'https://www.effectindex.com/effects/visual-haze', 'https://psychonautwiki.org/wiki/Visual_haze'),
       ('clvdzrwoj00691vcvr7t1vn6d', 'Visual processing acceleration', 'visual-processing-acceleration', null, null, '',
        'Visual processing acceleration increases the speed at which a person can perceive and interpret rapidly occurring events. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.', 'Visual processing acceleration increases the speed at which a person can perceive and interpret rapidly occurring events. It is most commonly experienced during events that are felt to be either dangerous, intense, or highly novel.

[1]

[2]

[3]

[4]

The effect gives the appearance that the external environment is being viewed in slow motion and that brief moments of time have been "stretched out". For example, fast-moving objects such as birds, insects, and cars may begin to present themselves as clearly viewable instead of fleeting blurs of motion, as they may during everyday sobriety.

In terms of its intensity, this effect usually manifests subtly, only slightly slowing down a person''s perception of motion. However, in rare cases, this effect can temporarily slow the visual perception of time to a near stand-still, causing events to appear dramatically slower.

Visual processing acceleration is often accompanied by other coinciding effects, such as visual acuity enhancement and thought acceleration. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, psilocybin, and mescaline.',
        '', '', 'https://www.effectindex.com/effects/visual-processing-acceleration',
        'https://psychonautwiki.org/wiki/Visual_processing_acceleration'),
       ('clvdzrwoo006a1vcv653vpphl', 'Visual stretching', 'visual-stretching', null, null, '',
        'Visual stretching distorts a person''s field of view to make it appear as if it is horizontally or vertically stretching in its size. It is most commonly induced under the influence of heavy dosages of sudden onset hallucinogenic compounds, such as nitrous oxide, DMT, and salvia divinorum. This holds particularly true in the moments immediately preceding ego death.', 'Visual stretching distorts a person''s field of view to make it appear as if it is horizontally or vertically stretching in its size. This effect varies in its intensity, ranging from subtle and barely visible to extreme and all-encompassing in a manner that can completely impair a person''s sense of sight. At higher levels, it can stretch a person''s vision into a seemingly infinite length, which typically renders their field of view as a thin strip of sensory data surrounded on either side by empty space or subtle geometry.

Visual stretching is most commonly induced under the influence of heavy dosages of sudden onset hallucinogenic compounds, such as nitrous oxide, DMT, and salvia divinorum. This holds particularly true in the moments immediately preceding ego death.',
        '', '', 'https://www.effectindex.com/effects/visual-stretching',
        'https://psychonautwiki.org/wiki/Visual_stretching'),
       ('clvdzrwox006b1vcvw3y08z3v', 'Visual strobing', 'visual-strobing', null, null, '',
        'Visual strobing is the experience of a fast-paced and bright flashing light which can occur within one''s visual field in manner similar to that of a strobe light. It is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, DMT, psilocybin, and mescaline.', 'Visual strobing is the experience of a fast-paced and bright flashing light which can occur within one''s visual field in manner similar to that of a strobe light. This flashing light may be spread out across one''s visual field evenly, or it can sometimes be concentrated within the peripheral vision. It is typically more pronounced within darkened environments or with closed eyes, but can also often be seen to a somewhat lesser extent within well lit environments with open eyes.

[p]When directly focused on, this strobing effect can sometimes begin to gradually increase in speed and intensity until appearing to become a steady permanent light which then gives way to closed eye geometry of a greater intensity than that which preceded it. At points, visual strobing can often further intermix with psychedelic geometry in a manner that results in the complex patterns and shapes starting to rapidly flash and potentially also appearing to be the source of the strobing light itself.[p]

Visual strobing is most commonly induced under the influence of moderate dosages of psychedelic compounds, such as LSD, DMT, psilocybin, and mescaline. However, it is particularly common during the onset and comeup of these experiences, often building up before giving way to the other visual effects that present themselves during the peak.',
        '', '', 'https://www.effectindex.com/effects/visual-strobing', null),
       ('clvdzrwp4006c1vcvo0boz5mn', 'Visual twisting', 'visual-twisting', null, null, '',
        'Visual twisting distorts a person''s field of view to make it appear as if it curling into itself, similar to the shape of a spiral. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.', 'Visual twisting is a distortion of a person''s field of view, in which regions of one’s visual space appear to be curling or spiraling about a common center. This effect varies in its intensity, ranging from subtle and barely visible to extreme and all-encompassing. At its stronger levels, visual twisting can render an individual unable to resolve objects or have any sense of depth perception, completely impairing their sense of sight.

Visual twisting is often accompanied by other coinciding effects, such as drifting and visual stretching. It is most commonly induced under the influence of heavy dosages of hallucinogenic compounds, such as psychedelics, dissociatives, and deliriants.',
        '', '', 'https://www.effectindex.com/effects/visual-twisting', null),
       ('clvdzrwp9006d1vcv8sqtiw27', 'Wakefulness', 'wakefulness', null, null, '',
        'Wakefulness is an increased ability to stay conscious without feeling sleepy combined with a decreased need to sleep. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds such as stimulants, nootropics, and psychedelics.', 'Engber, T. M., Dennis, S. A., Jones, B. E., Miller, M. S., & Contreras, P. C. (1998). Brain regional substrates for the actions of the novel wake-promoting agent modafinil in the rat: comparison with amphetamine. Neuroscience, 87(4), 905-911.

https://doi.org/10.1016/S0306-4522(98)00015-3', '', '', 'https://www.effectindex.com/effects/wakefulness',
        'https://psychonautwiki.org/wiki/Wakefulness'),
       ('clvdzrwpe006e1vcvpe1i98l2', 'Watery eyes', 'watery-eyes', null, null, '',
        'Watery eyes can be described as a physical effect which results in a state of continuous involuntary streaming, tearing, crying, and watering of the tear ducts within one''s eyes.  It is most commonly induced under the influence of moderate dosages of psychedelic tryptamine compounds, such as psilocybin, 4-AcO-DMT, and 4-HO-MET.', 'Watery eyes are a physical effect which results in a state of continuous involuntary streaming, tearing, crying, and watering of the tear ducts within one''s eyes. The experience of this effect often leads to the feeling that a person is crying for no reason despite a complete absence of the relevant emotions one would usually expect during such a state.

Watery eyes is often accompanied by other coinciding effects such as excessive yawning and a runny nose. It is most commonly induced under the influence of moderate dosages of psychedelics tryptamine compounds, such as psilocybin, 4-AcO-DMT, and 4-HO-MET.',
        '', '', 'https://www.effectindex.com/effects/watery-eyes', 'https://psychonautwiki.org/wiki/Watery_eyes');