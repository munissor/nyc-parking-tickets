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
  },
  debug: false
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
    db.select('*').from('ticket').where(function () {
      this.where('id', '>=', from).andWhere('id', '<=', to);
    })
      .pipe(through2.obj(function (data, enc, callback) {
        const sep = first ? '' : ',';
        first = false;
        this.push(`${sep}${JSON.stringify(data)}\n`);
        callback();
      }, function (flush) {
        this.push(']');
        flush();
      }))
      .pipe(writer);

    // stream.on('finish', () => {
    //   writer.write('\n]');
    //   writer.end();
    // });

    writer.on('finish', () => {
      process.exit();
    });
  }
}

