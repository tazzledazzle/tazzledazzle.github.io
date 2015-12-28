var dns = require('dns');
dns.resolve4('tazzledazzle.github.io', function (err, addresses) {
    if (err)
        console.log(err);
    console.log('addresses: ' + JSON.stringify(addresses));
});
dns.lookup('tazzledazzle.github.io', function (err, address, family) {
    if (err)
        console.log(err);
    console.log('addresses: ' + JSON.stringify(address));
    console.log('family: ' + JSON.stringify(family));
});
