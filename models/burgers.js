// * Inside your `burger` directory, create a folder named `models`.

//   * In `models`, make a `burger.js` file.

//     * Inside `burger.js`, import `orm.js` into `burger.js`

//     * Also inside `burger.js`, create the code that will call the ORM functions using burger specific input for the ORM.

//     * Export at the end of the `burger.js` file.

var orm = require('../config/orm.js');
var burgers = {
  getallburgers: function(cb){ orm.selectAll(cb, 'burgers')},
  insertaburger: function(cb, obj){ orm.insertOne(cb,'burgers',obj)},
  updateaburger: function(cb, setobj, burgerid){ orm.updateOne(cb,'burgers',setobj,{ID: burgerid})},
  deleteburgers: function(cb, whereobj) {orm.deleteOne(cb,'burgers',whereobj)}
}
function output(data){
console.log(data);
};
module.exports = burgers;