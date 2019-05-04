SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- 

--

CREATE TABLE plate_type (
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE plate (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    type_id SMALLINT NOT NULL,
    registration_state_id TINYINT NOT NULL,

    UNIQUE INDEX (plate)
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
  id TINYINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nyc_street (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  UNIQUE INDEX (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ticket ()
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    summons_number INT(11) NOT NULL,
    issue_date DATETIME NOT NULL,
    violation_code INT(11) NOT NULL,
    vechicle_body_type_id SMALLINT NOT NULL,
    vechicle_make_id SMALLINT NOT NULL,
    issuing_agency VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    street_code_1 INT(11) NULL,
    street_code_2 INT(11) NULL,
    street_code_3 INT(11) NULL,
    vehicle_expiration_date DATETIME NULL,
    violation_location INT(11) NULL,
    violation_precinct INT(11) NULL,
    issuer_precinct INT(11) NULL,
    issuer_code INT(11) NULL,
    issuer_command INT(11) NULL,
    issuer_squad INT(11) NULL,
    violation_time TIME NULL,
    time_first_observed TIME NULL,
    violation_county_id SMALLINT NULL,
    violation_in_front_or_opposit ENUM('F', 'O') NULL,
    house_number VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    street_name_id INT(11) NULL,
    street_intersecting_id INT(11) NULL,
    date_first_observed DATETIME NULL,
    law_section VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    law_sub_division VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    violation_legal_code VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    days_parking_in_effect SMALLINT NULL,
    from_hours_in_effect TINYINT NULL,
    to_hours_in_effect TINYINT NULL,
    vehicle_color_id SMALLINT NULL,
    vehicle_unregistered BIT NOT NULL,
    vehicle_year SMALLINT NOT NULL,
    meter_number INT(11) NOT NULL,
    feet_from_curb INT NULL,
    violation_post_code VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_description VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    violation_no_standing_or_stopping VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_hydrant VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    violation_double_parking VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    UNIQUE INDEX (summons_number),

    FOREIGN KEY (vechicle_body_type_id) REFERENCES vehicle_body_type(id),
    FOREIGN KEY (vechicle_make_id) REFERENCES vechicle_make(id),
    FOREIGN KEY (violation_county_id) REFERENCES county(id),
    FOREIGN KEY (street_name_id) REFERENCES nyc_street(id),
    FOREIGN KEY (street_intersecting_id) REFERENCES nyc_street(id),
    FOREIGN KEY (vehicle_color_id) REFERENCES vehicle_color(id)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
