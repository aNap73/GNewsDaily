// Create an `orm.js` file inside `config` directory.

// * Import (require) `connection.js` into `orm.js`

// * In the `orm.js` file, create the methods that will execute the necessary MySQL commands in the controllers. These are the methods you will need to use in order to retrieve and store data in your database.

//   * `selectAll()`
//   * `insertOne()`
//   * `updateOne()`

// * Export the ORM object in `module.exports`.

var con = require('./connection.js');


var orm = {
  selectAll: function (cb, tablename) {
    con.query('Select * From ?? ORDER BY createdAt DESC', [tablename], function (err, data) {
      if (err) throw err;
      console.log('DATA DATA DATA ', data);
      return cb(data);
    });
  },
  insertOne: function (cb, tablename, obj) {
    let cols = Object.keys(obj);
    let vals = Object.values(obj);
    let ques = '?';
    let qr = ", ?"
    ques += qr.repeat(vals.length - 1);
    let sql = 'INSERT INTO ?? (' + cols + ') Values (###vals###)';
    sql = sql.replace('###vals###', ques);
    let qryvals = [];
    qryvals.push(tablename);
    qryvals = qryvals.concat(vals);
    con.query(sql, qryvals, function (err, data) {
      if (err) throw err;
      return cb(data);
    })
  },
  updateOne: function (cb, tablename, setobj, keyobj) {
    let sql = 'UPDATE ?? SET ? WHERE ?';
    con.query(sql, [tablename, setobj, keyobj], function (err, data) {
      if (err) throw err;
      return cb(data);
    })
  },
  deleteOne: function (cb, tablename, keyobj) {
    let sql = 'DELETE FROM ?? WHERE ?';
    con.query(sql, [tablename, keyobj], function (err, data) {
      if (err) throw err;
      return cb(data);
    })
  },
}


module.exports = orm;

