// Loads the game's browser scripts into Node for headless tests.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { console, Math, Date, JSON, setTimeout, localStorage: null };
ctx.window = ctx;
vm.createContext(ctx);
function load(files) {
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  return ctx.HL;
}
module.exports = { load, ctx };
