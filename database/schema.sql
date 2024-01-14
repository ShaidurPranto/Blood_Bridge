/*
 Navicat Premium Data Transfer

 Source Server         : BB
 Source Server Type    : Oracle
 Source Server Version : 190000 (Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production)
 Source Host           : localhost:1521
 Source Schema         : BB

 Target Server Type    : Oracle
 Target Server Version : 190000 (Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production)
 File Encoding         : 65001

 Date: 09/01/2024 12:23:21
*/


-- ----------------------------
-- Table structure for DONOR
-- ----------------------------
DROP TABLE "BB"."DONOR";
CREATE TABLE "BB"."DONOR" (
  "DONORID" VARCHAR2(20 BYTE) VISIBLE NOT NULL,
  "GENDER" VARCHAR2(20 BYTE) VISIBLE,
  "BDATE" DATE VISIBLE DEFAULT SYSDATE,
  "AREA" VARCHAR2(20 BYTE) VISIBLE,
  "DISTRICT" VARCHAR2(20 BYTE) VISIBLE,
  "LAST_DONATION_DATE" DATE VISIBLE
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Records of DONOR
-- ----------------------------
INSERT INTO "BB"."DONOR" VALUES ('Navin12', 'FEMALE', TO_DATE('2002-04-12 00:00:00', 'SYYYY-MM-DD HH24:MI:SS'), 'UTTARA', 'DHAKA', TO_DATE('2024-01-09 03:09:17', 'SYYYY-MM-DD HH24:MI:SS'));
INSERT INTO "BB"."DONOR" VALUES ('Kwan9', 'MALE', TO_DATE('2004-01-20 03:09:39', 'SYYYY-MM-DD HH24:MI:SS'), 'RAIPARA', 'JESSORE', TO_DATE('2024-01-31 03:10:34', 'SYYYY-MM-DD HH24:MI:SS'));
INSERT INTO "BB"."DONOR" VALUES ('Clifford5', 'MALE', TO_DATE('1997-06-25 03:11:02', 'SYYYY-MM-DD HH24:MI:SS'), 'DAKKHINKHAN', 'CHITTAGONG', TO_DATE('2024-01-31 03:11:44', 'SYYYY-MM-DD HH24:MI:SS'));
INSERT INTO "BB"."DONOR" VALUES ('Nishimura8', 'FEMALE', TO_DATE('2003-04-13 00:00:00', 'SYYYY-MM-DD HH24:MI:SS'), 'BAZAAR', 'RAJSHAHI', TO_DATE('2024-01-25 03:12:47', 'SYYYY-MM-DD HH24:MI:SS'));
INSERT INTO "BB"."DONOR" VALUES ('Lily13', 'FEMALE', TO_DATE('1994-06-09 11:11:47', 'SYYYY-MM-DD HH24:MI:SS'), 'PALASHI', 'DHAKA', TO_DATE('2024-01-23 11:12:21', 'SYYYY-MM-DD HH24:MI:SS'));
INSERT INTO "BB"."DONOR" VALUES ('Pranto11', 'MALE', TO_DATE('2002-01-08 00:00:00', 'SYYYY-MM-DD HH24:MI:SS'), 'PALASHI', 'DHAKA', TO_DATE('2020-12-01 00:00:00', 'SYYYY-MM-DD HH24:MI:SS'));

-- ----------------------------
-- Table structure for DONOR_BLOOD_INFO
-- ----------------------------
DROP TABLE "BB"."DONOR_BLOOD_INFO";
CREATE TABLE "BB"."DONOR_BLOOD_INFO" (
  "DONORID" VARCHAR2(20 BYTE) VISIBLE NOT NULL,
  "BLOODGROUP" VARCHAR2(10 BYTE) VISIBLE NOT NULL,
  "RH" VARCHAR2(10 BYTE) VISIBLE NOT NULL
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Records of DONOR_BLOOD_INFO
-- ----------------------------
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Navin12', 'O', '+');
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Kwan9', 'A', '+');
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Clifford5', 'B', '+');
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Nishimura8', 'AB', '-');
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Lily13', 'O', '+');
INSERT INTO "BB"."DONOR_BLOOD_INFO" VALUES ('Pranto11', 'O', '+');

-- ----------------------------
-- Table structure for USERS
-- ----------------------------
DROP TABLE "BB"."USERS";
CREATE TABLE "BB"."USERS" (
  "USERID" NUMBER VISIBLE NOT NULL,
  "NAME" VARCHAR2(30 BYTE) VISIBLE NOT NULL,
  "EMAIL" VARCHAR2(30 BYTE) VISIBLE,
  "PASSWORD" VARCHAR2(20 BYTE) VISIBLE NOT NULL
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Records of USERS
-- ----------------------------
INSERT INTO "BB"."USERS" VALUES ('12', 'Navin', 'navin@gmail.com', '245');
INSERT INTO "BB"."USERS" VALUES ('13', 'LIly', 'lily@gail.com', '1');
INSERT INTO "BB"."USERS" VALUES ('1', 'Ti Ting Fung', 'tingt65@outlook.com', 't7ghLwGo8A');
INSERT INTO "BB"."USERS" VALUES ('2', 'Hara Miu', 'haramiu@gmail.com', 'RSKJZ1xaLy');
INSERT INTO "BB"."USERS" VALUES ('3', 'Tsui Ka Fai', 'tkafai@icloud.com', '0LauMSXPzS');
INSERT INTO "BB"."USERS" VALUES ('4', 'Miyazaki Akina', 'miyazakiakina@hotmail.com', 'yhZ7lg049K');
INSERT INTO "BB"."USERS" VALUES ('5', 'Clifford Torres', 'tcliff@gmail.com', 'mG3k4TxSQg');
INSERT INTO "BB"."USERS" VALUES ('6', 'Yin Jiehong', 'jiehong117@icloud.com', 'sQYmTZvBPx');
INSERT INTO "BB"."USERS" VALUES ('7', 'Liao On Kay', 'lok@icloud.com', '6CrOgbXMcD');
INSERT INTO "BB"."USERS" VALUES ('8', 'Nishimura', 'kaitonishimura@icloud.com', 'mBRcV1Bpfj');
INSERT INTO "BB"."USERS" VALUES ('9', 'Kwan', 'kwokwing72@mail.com', 'bOZVIa64hJ');
INSERT INTO "BB"."USERS" VALUES ('10', 'Kong Hiu Tung', 'kohiutung801@hotmail.com', 'HQ0EXCxGOt');
INSERT INTO "BB"."USERS" VALUES ('11', 'Pranto', 'pranto@gmail.com', '123');

-- ----------------------------
-- Table structure for USER_DONOR
-- ----------------------------
DROP TABLE "BB"."USER_DONOR";
CREATE TABLE "BB"."USER_DONOR" (
  "USERID" NUMBER VISIBLE NOT NULL,
  "DONORID" VARCHAR2(20 BYTE) VISIBLE
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Records of USER_DONOR
-- ----------------------------
INSERT INTO "BB"."USER_DONOR" VALUES ('9', 'Kwan9');
INSERT INTO "BB"."USER_DONOR" VALUES ('12', 'Navin12');
INSERT INTO "BB"."USER_DONOR" VALUES ('5', 'Clifford5');
INSERT INTO "BB"."USER_DONOR" VALUES ('8', 'Nishimura8');
INSERT INTO "BB"."USER_DONOR" VALUES ('13', 'Lily13');
INSERT INTO "BB"."USER_DONOR" VALUES ('1', 'Pranto1');

-- ----------------------------
-- Sequence structure for USERS_ID_SEQ
-- ----------------------------
DROP SEQUENCE "BB"."USERS_ID_SEQ";
CREATE SEQUENCE "BB"."USERS_ID_SEQ" MINVALUE 1 MAXVALUE 999999999999999 INCREMENT BY 1 CACHE 20;

-- ----------------------------
-- Sequence structure for USER_ID_SEQ
-- ----------------------------
DROP SEQUENCE "BB"."USER_ID_SEQ";
CREATE SEQUENCE "BB"."USER_ID_SEQ" MINVALUE 1 MAXVALUE 999999999999999 INCREMENT BY 1 CACHE 20;

-- ----------------------------
-- Checks structure for table DONOR
-- ----------------------------
ALTER TABLE "BB"."DONOR" ADD CONSTRAINT "SYS_C007612" CHECK ("DONORID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR" ADD CONSTRAINT "SYS_C008100" CHECK ("DONORID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Checks structure for table DONOR_BLOOD_INFO
-- ----------------------------
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C007606" CHECK ("DONORID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C007607" CHECK ("BLOODGROUP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C007608" CHECK ("RH" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C008101" CHECK ("DONORID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C008102" CHECK ("BLOODGROUP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."DONOR_BLOOD_INFO" ADD CONSTRAINT "SYS_C008103" CHECK ("RH" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Primary Key structure for table USERS
-- ----------------------------
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "USER_ID" PRIMARY KEY ("USERID");

-- ----------------------------
-- Uniques structure for table USERS
-- ----------------------------
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007565" UNIQUE ("EMAIL") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Checks structure for table USERS
-- ----------------------------
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007562" CHECK ("NAME" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007563" CHECK ("PASSWORD" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007618" CHECK ("USERID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007619" CHECK ("NAME" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007620" CHECK ("PASSWORD" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007705" CHECK ("USERID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007706" CHECK ("NAME" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USERS" ADD CONSTRAINT "SYS_C007707" CHECK ("PASSWORD" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Primary Key structure for table USER_DONOR
-- ----------------------------
ALTER TABLE "BB"."USER_DONOR" ADD CONSTRAINT "SYS_C007588" PRIMARY KEY ("USERID");

-- ----------------------------
-- Uniques structure for table USER_DONOR
-- ----------------------------
ALTER TABLE "BB"."USER_DONOR" ADD CONSTRAINT "SYS_C007589" UNIQUE ("DONORID") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- Checks structure for table USER_DONOR
-- ----------------------------
ALTER TABLE "BB"."USER_DONOR" ADD CONSTRAINT "SYS_C007614" CHECK ("USERID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "BB"."USER_DONOR" ADD CONSTRAINT "SYS_C008090" CHECK ("USERID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
