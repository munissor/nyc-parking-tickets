'use strict';

function createLookupTable(knex, name) {
  return knex.schema.createTable(name, (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 256).notNullable();

    table.unique(['name']);

    table.charset('utf8mb4');
    table.collate('utf8mb4_unicode_ci');
  });
}

function createPlateTable(knex) {
  return knex.schema.createTable('plate', (table) => {
    table.increments('id').unsigned().primary();
    table.string('plate', 256).notNullable();
    table.integer('type_id').unsigned().notNullable();
    table.integer('registration_state_id').unsigned().notNullable();

    table.unique(['plate']);

    table.foreign('type_id').references('plate_type.id');
    table.foreign('registration_state_id').references('us_state.id');

    table.charset('utf8mb4');
    table.collate('utf8mb4_unicode_ci');
  });
}

function createTicketTable(knex) {
  return knex.schema.createTable('ticket', (table) => {
    table.increments('id').unsigned().primary();
    table.string('summons_number', 50).notNullable();
    table.integer('plate_id').unsigned().notNullable();
    table.string('issue_date', 50);
    table.integer('violation_code').notNullable();
    table.integer('vehicle_body_type_id').unsigned().notNullable();
    table.integer('vehicle_make_id').unsigned().notNullable();
    table.string('issuing_agency', 50).notNullable();
    table.integer('street_code_1');
    table.integer('street_code_2');
    table.integer('street_code_3');
    table.string('vehicle_expiration_date', 50);
    table.string('violation_location', 50);
    table.string('violation_precinct', 50);
    table.string('issuer_precinct', 50);
    table.string('issuer_code', 50);
    table.string('issuer_command', 50);
    table.string('issuer_squad', 50);
    table.string('violation_time', 50);
    table.string('time_first_observed', 10);
    table.integer('violation_county_id').unsigned();
    table.enu('violation_in_front_or_opposit', ['F', 'O']);
    table.string('house_number', 20);
    table.integer('street_name_id').unsigned();
    table.integer('street_intersecting_id').unsigned();
    table.string('date_first_observed', 50);
    table.string('law_section', 10);
    table.string('law_sub_division', 10);
    table.string('violation_legal_code', 10);
    table.string('days_parking_in_effect', 10);
    table.string('from_hours_in_effect', 10);
    table.string('to_hours_in_effect', 10);
    table.integer('vehicle_color_id').unsigned();
    table.string('vehicle_unregistered', 10);
    table.integer('vehicle_year');
    table.string('meter_number', 10);
    table.string('feet_from_curb', 10);
    table.string('violation_post_code', 10);
    table.string('violation_description', 256);
    table.string('violation_no_standing_or_stopping', 10);
    table.string('violation_hydrant', 10);
    table.string('violation_double_parking', 10);

    table.unique(['summons_number']);

    table.foreign('plate_id').references('plate.id');
    table.foreign('vehicle_body_type_id').references('vehicle_body_type.id');
    table.foreign('vehicle_make_id').references('vehicle_make.id');
    table.foreign('street_name_id').references('nyc_street.id');
    table.foreign('street_intersecting_id').references('nyc_street.id');
    table.foreign('vehicle_color_id').references('vehicle_color.id');
    table.foreign('violation_county_id').references('county.id');

    table.charset('utf8mb4');
    table.collate('utf8mb4_unicode_ci');
  });
}

function up(knex) {
  return createLookupTable(knex, 'plate_type')
    .then(() => createLookupTable(knex, 'vehicle_make'))
    .then(() => createLookupTable(knex, 'vehicle_body_type'))
    .then(() => createLookupTable(knex, 'vehicle_color'))
    .then(() => createLookupTable(knex, 'us_state'))
    .then(() => createLookupTable(knex, 'county'))
    .then(() => createLookupTable(knex, 'nyc_street'))
    .then(() => createPlateTable(knex))
    .then(() => createTicketTable(knex));
}

function down(knex) {
  return knex.schema.dropTable('ticket')
    .then(() => knex.schema.dropTable('plate'))
    .then(() => knex.schema.dropTable('nyc_street'))
    .then(() => knex.schema.dropTable('county'))
    .then(() => knex.schema.dropTable('us_state'))
    .then(() => knex.schema.dropTable('vehicle_body_type'))
    .then(() => knex.schema.dropTable('vehicle_color'))
    .then(() => knex.schema.dropTable('vehicle_make'))
    .then(() => knex.schema.dropTable('plate_type'));
}

module.exports = {
  up,
  down
};
