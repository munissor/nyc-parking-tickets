'use strict';

const fs = require('fs');
const config = require('config');
const through2 = require('through2');
const knex = require('knex');
const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  }
});

if (process.argv.length !== 5) {
  // eslint-disable-next-line no-console
  console.log('Usage: export [fromid] [toid] [file]');
}
else {
  const from = Number(process.argv[2]);
  const to = Number(process.argv[3]);

  if (to < from) {
    // eslint-disable-next-line no-console
    console.log('Error: [to] is smaller than [from]');
  }
  else {
    const file = process.argv[4];
    const writer = fs.createWriteStream(file);
    writer.write('[\n');
    let first = true;

    const q = db.select(
      'ticket.*',
      'vehicle_body_type.name as vehicle_body_type',
      'vehicle_make.name as vehicle_make',
      'county.name as violation_county',
      's1.name as street_name',
      's1.name as street_intersecting',
      'vehicle_color.name as vehicle_color',
      'plate.plate as plate_number',
      'plate_type.name as plate_type',
      'us_state.name as registration_state'
    )
      .from('ticket')
      .innerJoin('vehicle_body_type', 'ticket.vehicle_body_type_id', '=', 'vehicle_body_type.id')
      .innerJoin('vehicle_make', 'ticket.vehicle_make_id', '=', 'vehicle_make.id')
      .innerJoin('county', 'ticket.violation_county_id', '=', 'county.id')
      .leftJoin('nyc_street as s1', 'ticket.street_name_id', '=', 's1.id')
      .leftJoin('nyc_street as s2', 'ticket.street_intersecting_id', '=', 's2.id')
      .innerJoin('vehicle_color', 'ticket.vehicle_color_id', '=', 'vehicle_color.id')
      .innerJoin('plate', 'ticket.plate_id', '=', 'plate.id')
      .innerJoin('plate_type', 'plate.type_id', '=', 'plate_type.id')
      .innerJoin('us_state', 'plate.registration_state_id', '=', 'us_state.id')
      .where(function () {
        this.where('ticket.id', '>=', from).andWhere('ticket.id', '<=', to);
      });

    q.pipe(through2.obj(function (data, enc, callback) {
      const sep = first ? '' : ',';
      first = false;

      delete data.vehicle_body_type_id;
      delete data.vehicle_make_id;
      delete data.violation_county_id;
      delete data.street_name_id;
      delete data.street_intersecting_id;
      delete data.vehicle_color_id;
      delete data.plate_id;

      this.push(`${sep}${JSON.stringify(data)}\n`);
      callback();
    }, function (flush) {
      this.push(']');
      flush();
    }))
      .pipe(writer);

    writer.on('finish', () => {
      process.exit();
    });
  }
}
