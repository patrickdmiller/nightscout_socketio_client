const io = require("socket.io-client");
const logger = require("node-color-log");
const EventEmitter = require("events");
const ex = new EventEmitter();

const settings = {
  secret: null, //this is the "access token" you create in the nightscout /admin page. do not send this as settings.token because it won't work, which is a bit confusing.
  token: null,
  host: null,
  history: 0,
};

ex.cache = {}; //cache results we get from nightscout
ex.socket = null;

const authorizesocket = () => {
  logger.debug("Authorizing  socket");
  var auth_data = {
    client: "web",
    secret: settings.secret,
    token: settings.token,
  };

  ex.socket.emit("authorize", auth_data, (data) => {
    if (!data) {
      logger.error("unable to authenticate");
    } else {
      ex.emit("connect", data);
    }
  });
};

/* events */
const loadSocketListeners = () => {
  ex.socket.on("error", function (data) {
    logger.error(data);
    ex.emit("error", data);
  });

  ex.socket.on("connect_error", (data) => {
    logger.error("connect error", data);
    ex.emit("error", data);
  });

  ex.socket.on("connect_timeout", () => {
    logger.error("connect timeout");
    ex.emit("error", "connect timeout");
  });

  ex.socket.on("close");

  ex.socket.on("connect", () => {
    logger.debug("Client connected to server.");
    authorizesocket();
  });

  //retroUpdate
  ex.socket.on("retroUpdate", function retroUpdate(retroData) {
    logger.debug("got retroUpdate", retroData);
    // client.retro = {
    //   loadedMills: Date.now(),
    //   loadStartedMills: 0,
    //   data: retroData,
    // };
    ex.emit("retroUpdate", retroData);
  });

  //notification
  ex.socket.on("notification", function (notify) {
    logger.log("notification from server:", notify);
    ex.emit("notification", notify);
  });

  //announcement
  ex.socket.on("announcement", function (notify) {
    logger.debug("announcement received from server", notify);
    ex.emit("announcement", notify);
  });
  //alarm
  ex.socket.on("alarm", function (notify) {
    logger.debug("alarm received from server", notify);
    ex.emit("alarm", notify);
  });

  //urgent_alarm
  ex.socket.on("urgent_alarm", function (notify) {
    logger.debug("urgent alarm received from server", notify);
    ex.emit("urgent_alarm", notify);
  });

  //clear_alarm
  ex.socket.on("clear_alarm", function (notify) {
    logger.debug("clear alarm received from server", notify);
    ex.emit("clear_alarm", notify);
  });

  //dataUpdate
  ex.socket.on("dataUpdate", function (notify) {
    logger.debug("dataUpdate", notify);
    for (let key in notify) {
      if (key !== "dbstats") {
        ex.cache[key] = notify[key][notify[key].length - 1];
      }
    }
    ex.emit("dataUpdate", notify);
  });
};

ex.init = (configs = {}) => {
  for (let key in configs) {
    if (key in settings) {
      settings[key] = configs[key];
    } else {
      logger.warn(`Unknown config key : ${key}`);
    }
  }

  ex.socket = io.connect(`https://${settings.host}`);
  loadSocketListeners();
};

ex.logger = logger;
module.exports = ex;
