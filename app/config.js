module.exports = {
    production: {
        data: {
            "mongodb": {
                provider: "mongodb",
                host: "ds043714.mongolab.com:43714",
                database: "propel",
                username: "dbuser",
                password: "NSj7ty3YW6WFhm3r"
            }
        },
        "social_media": {
            "facebook": "https://www.facebook.com/PropelSoftwareAcademy"
        }
        // cache: {
        //     provider: "redis",
        //     host: "localhost:7331",
        //     database: "test",
        //     username: "test",
        //     password: "test"
        // }
    },
    development: {
        data: {
            "mongodb": {
                provider: "mongodb",
                host: "ds041613.mongolab.com:41613",
                database: "propel-production",
                username: "dbuser",
                password: "NSj7ty3YW6WFhm3r"
            }
        }
        // cache: {
        //     provider: "redis",
        //     host: "localhost:7331",
        //     database: "test",
        //     username: "test",
        //     password: "test"
        // }
    }
};