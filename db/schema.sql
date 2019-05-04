SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- 
DROP TABLE ticket;
DROP TABLE plate;
DROP TABLE plate_type;
DROP TABLE vehicle_make;
DROP TABLE vehicle_body_type;
DROP TABLE vehicle_color;
DROP TABLE us_state;
DROP TABLE county;
DROP TABLE nyc_street;
--

CREATE TABLE plate_type (
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vehicle_make (
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vehicle_body_type (
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE vehicle_color(
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE us_state (
  id TINYINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE county (
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nyc_street (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE plate (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    type_id SMALLINT NOT NULL,
    registration_state_id TINYINT NOT NULL,

    UNIQUE INDEX (plate),

    FOREIGN KEY (type_id) REFERENCES plate_type(id),
    FOREIGN KEY (registration_state_id) REFERENCES us_state(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ticket (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    summons_number VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    plate_id INT(11) NOT NULL,
    issue_date VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_code INT(11) NOT NULL,
    vehicle_body_type_id SMALLINT NOT NULL,
    vehicle_make_id SMALLINT NOT NULL,
    issuing_agency VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    street_code_1 INT(11) NULL,
    street_code_2 INT(11) NULL,
    street_code_3 INT(11) NULL,
    vehicle_expiration_date VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_location VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_precinct VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    issuer_precinct VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    issuer_code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    issuer_command VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    issuer_squad VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_time VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    time_first_observed VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_county_id SMALLINT NULL,
    violation_in_front_or_opposit ENUM('F', 'O') NULL,
    house_number VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    street_name_id INT(11) NULL,
    street_intersecting_id INT(11) NULL,
    date_first_observed VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    law_section VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    law_sub_division VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    violation_legal_code VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    days_parking_in_effect VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    from_hours_in_effect VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    to_hours_in_effect VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    vehicle_color_id SMALLINT NULL,
    vehicle_unregistered VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    vehicle_year SMALLINT NOT NULL,
    meter_number  VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    feet_from_curb INT NULL,
    violation_post_code VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_description VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    violation_no_standing_or_stopping VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_hydrant VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_double_parking VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    UNIQUE INDEX (summons_number),

    FOREIGN KEY (vehicle_body_type_id) REFERENCES vehicle_body_type(id),
    FOREIGN KEY (vehicle_make_id) REFERENCES vehicle_make(id),
    FOREIGN KEY (violation_county_id) REFERENCES county(id),
    FOREIGN KEY (street_name_id) REFERENCES nyc_street(id),
    FOREIGN KEY (street_intersecting_id) REFERENCES nyc_street(id),
    FOREIGN KEY (vehicle_color_id) REFERENCES vehicle_color(id),
    FOREIGN KEY (plate_id) REFERENCES plate(id)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
