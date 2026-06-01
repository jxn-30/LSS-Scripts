// requires this script to be installed and enabled:
// https://github.com/jxn-30/LSS-Scripts/raw/master/src/lufsiInConsole.user.js

v = await sharedAPIStorage.getVehicles();
vt = await fetch('https://api.lss-manager.de/de_DE/vehicles').then(res => res.json());
console.log(v.length + ' Fahrzeuge mit einem Gesamtwert von ' + v.map(v => vt[v.vehicle_type].credits).reduce((a, b) => a + b, 0).toLocaleString() + ' Credits.');
