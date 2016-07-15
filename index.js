var fs = require('fs');
var BSONStream = require('bson-stream');
module.exports.start = (bsonFilePath) => {
    return new Promise((resolve, reject) => {
        var rs = fs.createReadStream(bsonFilePath);
        var proxyArray = [];

        function typeProxy(type) {
            switch (type) {
                case 1:
                    return 'http://';

                case 2:
                    return 'https://';

                case 3:
                    return 'socks4://';

                case 4:
                    return 'socks5://';
            }
        }

        function addressVersion(object) {
            if (object.ipv4) {
                return object.ipv4;
            } else {
                return object.ipv6;
            }
        }
        rs.pipe(new BSONStream()).on('data', function(object) {
            proxyArray.push(`${typeProxy(object.type)}${addressVersion(object)}:${object.port}`);
        });
        resolve(proxyArray);
    });
};