"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var kviz_1 = __importDefault(require("./routes/kviz"));
var mongoose_1 = __importDefault(require("mongoose"));
var User_1 = __importDefault(require("./models/User"));
var body_parser_1 = __importDefault(require("body-parser"));
require("dotenv/config");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app = express_1.default();
mongoose_1.default.connect(process.env.DATABASE_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, function () { return console.log('Connected to DB'); });
app.use(cors_1.default());
app.use(body_parser_1.default());
app.use('/quiz', kviz_1.default);
app.post('/register', function (req, res) {
    var usr = User_1.default.findOne({ name: req.body.username }, function (err, usr) {
        if (usr) {
            return res.status(400).json({ error: 'Name taken' });
        }
        else {
            var user = new User_1.default({
                name: req.body.username,
                password: req.body.password,
                points: 0,
            });
            user.save();
            jsonwebtoken_1.default.sign({
                name: req.body.username,
                points: req.body.password,
            }, 'secrectkey', function (err, token) {
                res.status(200).json({
                    name: req.body.username,
                    points: req.body.password,
                    status: 'Logged in',
                    token: token,
                });
            });
        }
    });
});
app.get('/getPoints', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name;
    return __generator(this, function (_a) {
        name = req.query.name;
        User_1.default.findOne({
            name: name,
        }, function (err, user) {
            return res.json({ points: user.points });
        });
        return [2 /*return*/];
    });
}); });
app.put('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var points, bearerHeader, bearer;
    return __generator(this, function (_a) {
        points = req.body.points;
        bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            bearer = bearerHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(bearer, process.env.KEY_SECRET, function (err, data) {
                if (err) {
                    res.status(403);
                }
                else {
                    var getUser = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, User_1.default.findOne({
                                        name: data.name,
                                    }, function (err, user) {
                                        user.points += points;
                                        user.save();
                                        res.status(200).json({
                                            user: user.name,
                                            points: user.points,
                                        });
                                    }).exec()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    getUser();
                }
            });
        }
        else {
            res.status(403);
        }
        return [2 /*return*/];
    });
}); });
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ name: username }, function (err, user) {
                        if (!user)
                            return res.status(404).json({ error: 'Not found' });
                        if (user.password === password) {
                            jsonwebtoken_1.default.sign({
                                name: user.name,
                                points: user.points,
                            }, process.env.KEY_SECRET, function (err, token) {
                                res.status(200).json({
                                    name: user.name,
                                    points: user.points,
                                    status: 'Logged in',
                                    token: token,
                                });
                            });
                        }
                        else {
                            res.status(400).json({ status: 'Failed to login' });
                        }
                    }).exec()];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/verify', function (req, res) {
    var bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(bearer, process.env.KEY_SECRET, function (err, data) {
            if (err) {
                res.status(403);
            }
            else {
                res.status(200).json(__assign({ status: 'Approved' }, data));
            }
        });
    }
    else {
        res.status(403);
    }
});
app.listen(3000, function () { return console.log('Running server'); });
