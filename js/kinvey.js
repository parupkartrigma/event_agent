(function() {
    var l = new function() {
            function d(a) {
                return a ? 0 : -1
            }
            var f = this.priority = function(a, b) {
                for (var c = a.exprs, e = 0, f = 0, d = c.length; f < d; f++) {
                    var g = c[f];
                    if (!~(g = g.e(g.v, b instanceof Date ? b.getTime() : b, b))) return -1;
                    e += g
                }
                return e
            }, e = this.parse = function(a, b) {
                    a || (a = {
                        $eq: a
                    });
                    var c = [];
                    if (a.constructor == Object)
                        for (var d in a) {
                            var m = k[d] ? d : "$trav",
                                j = a[d],
                                g = j;
                            if (h[m]) {
                                if (~d.indexOf(".")) {
                                    g = d.split(".");
                                    d = g.shift();
                                    for (var n = {}, l = n, p = 0, s = g.length - 1; p < s; p++) l = l[g[p]] = {};
                                    l[g[p]] = j;
                                    g = j = n
                                }
                                if (j instanceof Array) {
                                    g =
                                        [];
                                    for (n = j.length; n--;) g.push(e(j[n]))
                                } else g = e(j, d)
                            }
                            c.push(r(m, d, g))
                        } else c.push(r("$eq", d, a));
                    var q = {
                        exprs: c,
                        k: b,
                        test: function(a) {
                            return !!~q.priority(a)
                        },
                        priority: function(a) {
                            return f(q, a)
                        }
                    };
                    return q
                }, h = this.traversable = {
                    $and: !0,
                    $or: !0,
                    $nor: !0,
                    $trav: !0,
                    $not: !0
                }, k = this.testers = {
                    $eq: function(a, b) {
                        return d(a.test(b))
                    },
                    $ne: function(a, b) {
                        return d(!a.test(b))
                    },
                    $lt: function(a, b) {
                        return a > b ? 0 : -1
                    },
                    $gt: function(a, b) {
                        return a < b ? 0 : -1
                    },
                    $lte: function(a, b) {
                        return a >= b ? 0 : -1
                    },
                    $gte: function(a, b) {
                        return a <= b ? 0 : -1
                    },
                    $exists: function(a, b) {
                        return a === (null != b) ? 0 : -1
                    },
                    $in: function(a, b) {
                        if (b instanceof Array)
                            for (var c = b.length; c--;) {
                                if (~a.indexOf(b[c])) return c
                            } else return d(~a.indexOf(b));
                        return -1
                    },
                    $not: function(a, b) {
                        if (!a.test) throw Error("$not test should include an expression, not a value. Use $ne instead.");
                        return d(!a.test(b))
                    },
                    $type: function(a, b, c) {
                        return c ? c instanceof a || c.constructor == a ? 0 : -1 : -1
                    },
                    $nin: function(a, b) {
                        return~ k.$in(a, b) ? -1 : 0
                    },
                    $mod: function(a, b) {
                        return b % a[0] == a[1] ? 0 : -1
                    },
                    $all: function(a, b) {
                        for (var c =
                            a.length; c--;)
                            if (-1 == b.indexOf(a[c])) return -1;
                        return 0
                    },
                    $size: function(a, b) {
                        return b ? a == b.length ? 0 : -1 : -1
                    },
                    $or: function(a, b) {
                        for (var c = a.length, d = c; c--;)
                            if (~f(a[c], b)) return c;
                        return 0 == d ? 0 : -1
                    },
                    $nor: function(a, b) {
                        for (var c = a.length; c--;)
                            if (~f(a[c], b)) return -1;
                        return 0
                    },
                    $and: function(a, b) {
                        for (var c = a.length; c--;)
                            if (!~f(a[c], b)) return -1;
                        return 0
                    },
                    $trav: function(a, b) {
                        if (b instanceof Array) {
                            for (var c = b.length; c--;) {
                                var d = b[c];
                                if (d[a.k] && ~f(a, d[a.k])) return c
                            }
                            return -1
                        }
                        return f(a, b ? b[a.k] : void 0)
                    }
                }, m = {
                    $eq: function(a) {
                        return a instanceof
                        RegExp ? a : {
                            test: a instanceof Function ? a : function(b) {
                                return b instanceof Array ? ~b.indexOf(a) : a == b
                            }
                        }
                    },
                    $ne: function(a) {
                        return m.$eq(a)
                    }
                }, r = function(a, b, c) {
                    c = c instanceof Date ? c.getTime() : c;
                    return {
                        k: b,
                        v: m[a] ? m[a](c) : c,
                        e: k[a]
                    }
                }
        }, h = function(d, f, e) {
            "object" != typeof f && (e = f, f = void 0);
            if (e) {
                if ("function" != typeof e) throw Error("Unknown sift selector " + e);
            } else e = function(d) {
                return d
            };
            var h = e,
                k = l.parse(d);
            e = function(d) {
                for (var e = [], a, b, c = 0, f = d.length; c < f; c++) a = h(d[c]), ~ (b = k.priority(a)) && e.push({
                    value: a,
                    priority: b
                });
                e.sort(function(a, b) {
                    return a.priority > b.priority ? -1 : 1
                });
                d = Array(e.length);
                for (c = e.length; c--;) d[c] = e[c].value;
                return d
            };
            e.test = k.test;
            e.score = k.priority;
            e.query = d;
            return f ? e(f) : e
        };
    h.use = function(d) {
        d.operators && h.useOperators(d.operators)
    };
    h.useOperators = function(d) {
        for (var f in d) h.useOperator(f, d[f])
    };
    h.useOperator = function(d, f) {
        var e = {}, e = "object" == typeof f ? f : {
                test: f
            }, h = "$" + d;
        l.testers[h] = e.test;
        if (e.traversable || e.traverse) l.traversable[h] = !0
    };
    "undefined" != typeof module && "undefined" != typeof module.exports ?
        module.exports = h : "undefined" != typeof window && (window.sift = h)
})();;
/*!
 * Copyright (c) 2014 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
    var a = this,
        b = function() {
            var c = function(a) {
                var c = b();
                return null != a && c.init(a), c
            };
            c.API_ENDPOINT = "https://baas.kinvey.com", c.API_VERSION = "3", c.SDK_VERSION = "1.1.7", c.appKey = null, c.appSecret = null, c.masterSecret = null;
            var d = "appdata",
                e = "blob",
                f = "rpc",
                g = "user",
                h = null,
                i = !1,
                j = function(a) {
                    var b = y.get("activeUser");
                    return b.then(function(b) {
                        if (null == b) return c.setActiveUser(null);
                        var d = c.setActiveUser({
                            _id: b[0],
                            _kmd: {
                                authtoken: b[1]
                            }
                        });
                        if (!1 === a.refresh) return c.getActiveUser();
                        var e = a.success,
                            f = a.error;
                        return delete a.success, delete a.error, c.User.me(a).then(function(b) {
                            return a.success = e, a.error = f, b
                        }, function(b) {
                            return c.Error.INVALID_CREDENTIALS === b.name && c.setActiveUser(d), a.success = e, a.error = f, c.Defer.reject(b)
                        })
                    })
                };
            c.setToken = function(a) {
                this.token = a;
            },
            c.getToken = function() {
                return this.token;
            },
            c.getActiveUser = function() {
                if (!1 === i) throw new c.Error("Kinvey.getActiveUser can only be called after the promise returned by Kinvey.init fulfills or rejects.");
                return h
            }, c.setActiveUser = function(a) {
                if (null != a && (null == a._id || null == a._kmd || null == a._kmd.authtoken)) throw new c.Error("user argument must contain: _id, _kmd.authtoken.");
                !1 === i && (i = !0);
                var b = c.getActiveUser();
                return h = a, null != a ? y.save("activeUser", [a._id, a._kmd.authtoken]) : y.destroy("activeUser"), b
            }, c.init = function(a) {
                if (a = a || {}, null == a.appKey) throw new c.Error("options argument must contain: appKey.");
                if (null == a.appSecret && null == a.masterSecret) throw new c.Error("options argument must contain: appSecret and/or masterSecret.");
                i = !1, c.appKey = a.appKey, c.appSecret = null != a.appSecret ? a.appSecret : null, c.masterSecret = null != a.masterSecret ? a.masterSecret : null, c.encryptionKey = null != a.encryptionKey ? a.encryptionKey : null;
                var b = c.Sync.init(a.sync).then(function() {
                    return j(a)
                });
                return o(b, a)
            }, c.ping = function(a) {
                a = a || {}, a.nocache = null == c.appKey ? !1 : a.nocache;
                var b = c.Persistence.read({
                    namespace: d,
                    auth: null != c.appKey ? z.All : z.None
                }, a);
                return o(b, a)
            }, c.Error = function(a) {
                this.name = "Kinvey.Error", this.message = a, this.stack = (new Error).stack
            }, c.Error.prototype = new Error, c.Error.prototype.constructor = c.Error, c.Error.ENTITY_NOT_FOUND = "EntityNotFound", c.Error.COLLECTION_NOT_FOUND = "CollectionNotFound", c.Error.APP_NOT_FOUND = "AppNotFound", c.Error.USER_NOT_FOUND = "UserNotFound", c.Error.BLOB_NOT_FOUND = "BlobNotFound", c.Error.INVALID_CREDENTIALS = "InvalidCredentials", c.Error.KINVEY_INTERNAL_ERROR_RETRY = "KinveyInternalErrorRetry", c.Error.KINVEY_INTERNAL_ERROR_STOP = "KinveyInternalErrorStop", c.Error.USER_ALREADY_EXISTS = "UserAlreadyExists", c.Error.USER_UNAVAILABLE = "UserUnavailable", c.Error.DUPLICATE_END_USERS = "DuplicateEndUsers", c.Error.INSUFFICIENT_CREDENTIALS = "InsufficientCredentials", c.Error.WRITES_TO_COLLECTION_DISALLOWED = "WritesToCollectionDisallowed", c.Error.INDIRECT_COLLECTION_ACCESS_DISALLOWED = "IndirectCollectionAccessDisallowed", c.Error.APP_PROBLEM = "AppProblem", c.Error.PARAMETER_VALUE_OUT_OF_RANGE = "ParameterValueOutOfRange", c.Error.CORS_DISABLED = "CORSDisabled", c.Error.INVALID_QUERY_SYNTAX = "InvalidQuerySyntax", c.Error.MISSING_QUERY = "MissingQuery", c.Error.JSON_PARSE_ERROR = "JSONParseError", c.Error.MISSING_REQUEST_HEADER = "MissingRequestHeader", c.Error.INCOMPLETE_REQUEST_BODY = "IncompleteRequestBody", c.Error.MISSING_REQUEST_PARAMETER = "MissingRequestParameter", c.Error.INVALID_IDENTIFIER = "InvalidIdentifier", c.Error.BAD_REQUEST = "BadRequest", c.Error.FEATURE_UNAVAILABLE = "FeatureUnavailable", c.Error.API_VERSION_NOT_IMPLEMENTED = "APIVersionNotImplemented", c.Error.API_VERSION_NOT_AVAILABLE = "APIVersionNotAvailable", c.Error.INPUT_VALIDATION_FAILED = "InputValidationFailed", c.Error.BL_RUNTIME_ERROR = "BLRuntimeError", c.Error.BL_SYNTAX_ERROR = "BLSyntaxError", c.Error.BL_TIMEOUT_ERROR = "BLTimeoutError", c.Error.OAUTH_TOKEN_REFRESH_ERROR = "OAuthTokenRefreshError", c.Error.BL_VIOLATION_ERROR = "BLViolationError", c.Error.BL_INTERNAL_ERROR = "BLInternalError", c.Error.THIRD_PARTY_TOS_UNACKED = "ThirdPartyTOSUnacked", c.Error.STALE_REQUEST = "StaleRequest", c.Error.DATA_LINK_PARSE_ERROR = "DataLinkParseError", c.Error.NOT_IMPLEMENTED_ERROR = "NotImplementedError", c.Error.EMAIL_VERIFICATION_REQUIRED = "EmailVerificationRequired", c.Error.SORT_LIMIT_EXCEEDED = "SortLimitExceeded", c.Error.INVALID_SHORT_URL = "InvalidShortURL", c.Error.INVALID_OR_MISSING_NONCE = "InvalidOrMissingNonce", c.Error.MISSING_CONFIGURATION = "MissingConfiguration", c.Error.ENDPOINT_DOES_NOT_EXIST = "EndpointDoesNotExist", c.Error.DISALLOWED_QUERY_SYNTAX = "DisallowedQuerySyntax", c.Error.MALFORMED_AUTHENTICATION_HEADER = "MalformedAuthenticationHeader", c.Error.APP_ARCHIVED = "AppArchived", c.Error.BL_NOT_SUPPORTED_FOR_ROUTE = "BLNotSupportedForRoute", c.Error.USER_LOCKED_DOWN = "UserLockedDown", c.Error.ALREADY_LOGGED_IN = "AlreadyLoggedIn", c.Error.DATABASE_ERROR = "DatabaseError", c.Error.MISSING_APP_CREDENTIALS = "MissingAppCredentials", c.Error.MISSING_MASTER_CREDENTIALS = "MissingMasterCredentials", c.Error.NO_ACTIVE_USER = "NoActiveUser", c.Error.REQUEST_ABORT_ERROR = "RequestAbortError", c.Error.REQUEST_ERROR = "RequestError", c.Error.REQUEST_TIMEOUT_ERROR = "RequestTimeoutError", c.Error.SOCIAL_ERROR = "SocialError", c.Error.SYNC_ERROR = "SyncError";
            var k = {};
            k[c.Error.ALREADY_LOGGED_IN] = {
                name: c.Error.ALREADY_LOGGED_IN,
                description: "You are already logged in with another user.",
                debug: "If you want to switch users, logout the active user first using `Kinvey.User.logout`, then try again."
            }, k[c.Error.DATABASE_ERROR] = {
                name: c.Error.DATABASE_ERROR,
                description: "The database used for local persistence encountered an error.",
                debug: ""
            }, k[c.Error.MISSING_APP_CREDENTIALS] = {
                name: c.Error.MISSING_APP_CREDENTIALS,
                description: "Missing credentials: `Kinvey.appKey` and/or `Kinvey.appSecret`.",
                debug: "Did you forget to call `Kinvey.init`?"
            }, k[c.Error.MISSING_MASTER_CREDENTIALS] = {
                name: c.Error.MISSING_MASTER_CREDENTIALS,
                description: "Missing credentials: `Kinvey.appKey` and/or `Kinvey.masterSecret`.",
                debug: "Did you forget to call `Kinvey.init` with your Master Secret?"
            }, k[c.Error.NO_ACTIVE_USER] = {
                name: c.Error.NO_ACTIVE_USER,
                description: "You need to be logged in to execute this request.",
                debug: "Try creating a user using `Kinvey.User.signup`, or login an existing user using `Kinvey.User.login`."
            }, k[c.Error.REQUEST_ABORT_ERROR] = {
                name: c.Error.REQUEST_TIMEOUT_ERROR,
                description: "The request was aborted.",
                debug: ""
            }, k[c.Error.REQUEST_ERROR] = {
                name: c.Error.REQUEST_ERROR,
                description: "The request failed.",
                debug: ""
            }, k[c.Error.REQUEST_TIMEOUT_ERROR] = {
                name: c.Error.REQUEST_TIMEOUT_ERROR,
                description: "The request timed out.",
                debug: ""
            }, k[c.Error.SOCIAL_ERROR] = {
                name: c.Error.SOCIAL_ERROR,
                description: "The social identity cannot be obtained.",
                debug: ""
            }, k[c.Error.SYNC_ERROR] = {
                name: c.Error.SYNC_ERROR,
                description: "The synchronization operation cannot be completed.",
                debug: ""
            };
            var l, m = function(a, b) {
                    var c = k[a] || {
                        name: a
                    };
                    return b = b || {}, {
                        name: c.name,
                        description: b.description || c.description || "",
                        debug: b.debug || c.debug || ""
                    }
                }, n = function(a, b, c) {
                    if (!b) return a = "undefined" == typeof c ? a : c;
                    for (var d, e = a, f = b.split(".");
                        (d = f.shift()) && null != e && e.hasOwnProperty(d);) {
                        if (0 === f.length) return e[d] = "undefined" == typeof c ? e[d] : c, e[d];
                        e = e[d]
                    }
                    return null
                };
            l = "function" == typeof a.setImmediate ? a.setImmediate : "undefined" != typeof process && process.nextTick ? process.nextTick : function(b) {
                a.setTimeout(b, 0)
            };
            var o = function(a, b) {
                return a.then(function(a) {
                    b.success && b.success(a)
                }, function(a) {
                    b.error && b.error(a)
                }).then(null, function(a) {
                    l(function() {
                        throw a
                    })
                }), a
            }, p = Array.isArray || function(a) {
                    return "[object Array]" === Object.prototype.toString.call(a)
                }, q = function(a) {
                    return "function" != typeof / . / ? "function" == typeof a : "[object Function]" === Object.prototype.toString.call(a)
                }, r = function(a) {
                    return "[object Number]" === Object.prototype.toString.call(a) && !isNaN(a)
                }, s = function(a) {
                    return Object(a) === a
                }, t = function(a) {
                    return "[object RegExp]" === Object.prototype.toString.call(a)
                }, u = function(a) {
                    return "[object String]" === Object.prototype.toString.call(a)
                }, v = function(a) {
                    if (null == a) return !0;
                    if (p(a) || u(a)) return 0 === a.length;
                    for (var b in a)
                        if (a.hasOwnProperty(b)) return !1;
                    return !0
                }, w = function(a) {
                    return function() {
                        throw new c.Error("Method not implemented: " + a)
                    }
                }, x = function(a) {
                    return function(b) {
                        var d = this;
                        b = b || {}, a.forEach(function(a) {
                            if ("function" != typeof b[a]) throw new c.Error("Adapter must implement method: " + a)
                        }), a.forEach(function(a) {
                            d[a] = function() {
                                return b[a].apply(b, arguments)
                            }
                        })
                    }
                }, y = {
                    destroy: function(a) {
                        return y._destroy(y._key(a))
                    },
                    get: function(a) {
                        return y._get(y._key(a))
                    },
                    save: function(a, b) {
                        return y._save(y._key(a), b)
                    },
                    _destroy: w("Storage.destroy"),
                    _get: w("Storage.get"),
                    _key: function(a) {
                        return ["Kinvey", c.appKey, a].join(".")
                    },
                    _save: w("Storage.set"),
                    use: x(["_destroy", "_get", "_save"])
                };
            c.Defer = {
                all: function(a) {
                    if (!p(a)) throw new c.Error("promises argument must be of type: Array.");
                    var b = a.length;
                    if (0 === b) return c.Defer.resolve([]);
                    var d = c.Defer.deferred(),
                        e = [];
                    return a.forEach(function(a, c) {
                        a.then(function(a) {
                            b -= 1, e[c] = a, 0 === b && d.resolve(e)
                        }, function(a) {
                            d.reject(a)
                        })
                    }), d.promise
                },
                resolve: function(a) {
                    var b = c.Defer.deferred();
                    return b.resolve(a), b.promise
                },
                reject: function(a) {
                    var b = c.Defer.deferred();
                    return b.reject(a), b.promise
                },
                deferred: w("Kinvey.Defer.deferred"),
                use: x(["deferred"])
            };
            var z = {
                All: function() {
                    return z.Session().then(null, z.Basic)
                },
                App: function() {
                    if (null == c.appKey || null == c.appSecret) {
                        var a = m(c.Error.MISSING_APP_CREDENTIALS);
                        return c.Defer.reject(a)
                    }
                    var b = c.Defer.resolve({
                        scheme: "Basic",
                        username: c.appKey,
                        password: c.appSecret
                    });
                    return b
                },
                Basic: function() {
                    return z.Master().then(null, z.App)
                },
                Default: function() {
                    return z.Session().then(null, function(a) {
                        return z.Master().then(null, function() {
                            return c.Defer.reject(a)
                        })
                    })
                },
                Master: function() {
                    if (null == c.appKey || null == c.masterSecret) {
                        var a = m(c.Error.MISSING_MASTER_CREDENTIALS);
                        return c.Defer.reject(a)
                    }
                    var b = c.Defer.resolve({
                        scheme: "Basic",
                        username: c.appKey,
                        password: c.masterSecret
                    });
                    return b
                },
                None: function() {
                    return c.Defer.resolve(null)
                },
                Session: function() {
                    var a = c.getActiveUser();
                    if (null === a) {
                        var b = m(c.Error.NO_ACTIVE_USER);
                        return c.Defer.reject(b)
                    }
                    var d = c.Defer.resolve({
                        scheme: "Kinvey",
                        credentials: a._kmd.authtoken
                    });
                    return d
                }
            }, A = function() {
                    var b, c, d, e, f, g = [],
                        h = function(a) {
                            a = a.toLowerCase();
                            var b = /(chrome)\/([\w]+)/,
                                c = /(firefox)\/([\w.]+)/,
                                d = /(msie) ([\w.]+)/i,
                                e = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                                f = /(safari)\/([\w.]+)/;
                            return b.exec(a) || c.exec(a) || d.exec(a) || e.exec(a) || f.exec(a) || []
                        };
                    if ("undefined" != typeof a.cordova && "undefined" != typeof a.device) {
                        var i = a.device;
                        g.push("phonegap/" + i.cordova), c = i.platform, d = i.version, e = i.model, f = i.uuid
                    } else "undefined" != typeof Titanium ? (g.push("titanium/" + Titanium.getVersion()), "mobileweb" === Titanium.Platform.getName() ? (b = h(Titanium.Platform.getModel()), c = b[1], d = b[2], e = Titanium.Platform.getOstype()) : (c = Titanium.Platform.getOsname(), d = Titanium.Platform.getVersion(), e = Titanium.Platform.getManufacturer()), f = Titanium.Platform.getId()) : "undefined" != typeof forge ? (g.push("triggerio/" + (forge.config.platform_version || "")), f = forge.config.uuid) : "undefined" != typeof process && (c = process.title, d = process.version, e = process.platform);
                    "undefined" != typeof angular && g.push("angularjs/" + angular.version.full), "undefined" != typeof Backbone && g.push("backbonejs/" + Backbone.VERSION), "undefined" != typeof Ember && g.push("emberjs/" + Ember.VERSION), "undefined" != typeof jQuery && g.push("jquery/" + jQuery.fn.jquery), "undefined" != typeof ko && g.push("knockout/" + ko.version), "undefined" != typeof Zepto && g.push("zeptojs"), null == c && a.navigator && (b = h(a.navigator.userAgent), c = b[1], d = b[2], e = a.navigator.platform);
                    var j = ["js-angular/1.1.7"];
                    return 0 !== g.length && j.push("(" + g.sort().join(", ") + ")"), j.concat([c, d, e, f].map(function(a) {
                        return null != a ? a.toString().replace(/\s/g, "_").toLowerCase() : "unknown"
                    })).join(" ")
                };
            c.Acl = function(a) {
                if (null != a && !s(a)) throw new c.Error("document argument must be of type: Object.");
                a = a || {}, a._acl = a._acl || {}, this._acl = a._acl
            }, c.Acl.prototype = {
                addReader: function(a) {
                    return this._acl.r = this._acl.r || [], -1 === this._acl.r.indexOf(a) && this._acl.r.push(a), this
                },
                addReaderGroup: function(a) {
                    return this._acl.groups = this._acl.groups || {}, this._acl.groups.r = this._acl.groups.r || [], -1 === this._acl.groups.r.indexOf(a) && this._acl.groups.r.push(a), this
                },
                addWriterGroup: function(a) {
                    return this._acl.groups = this._acl.groups || {}, this._acl.groups.w = this._acl.groups.w || [], -1 === this._acl.groups.w.indexOf(a) && this._acl.groups.w.push(a), this
                },
                addWriter: function(a) {
                    return this._acl.w = this._acl.w || [], -1 === this._acl.w.indexOf(a) && this._acl.w.push(a), this
                },
                getCreator: function() {
                    return this._acl.creator || null
                },
                getReaders: function() {
                    return this._acl.r || []
                },
                getReaderGroups: function() {
                    return this._acl.groups ? this._acl.groups.r : []
                },
                getWriterGroups: function() {
                    return this._acl.groups ? this._acl.groups.w : []
                },
                getWriters: function() {
                    return this._acl.w || []
                },
                isGloballyReadable: function() {
                    return this._acl.gr || !1
                },
                isGloballyWritable: function() {
                    return this._acl.gw || !1
                },
                removeReader: function(a) {
                    var b;
                    return this._acl.r && -1 !== (b = this._acl.r.indexOf(a)) && this._acl.r.splice(b, 1), this
                },
                removeReaderGroup: function(a) {
                    var b;
                    return this._acl.groups && this._acl.groups.r && -1 !== (b = this._acl.groups.r.indexOf(a)) && this._acl.groups.r.splice(b, 1), this
                },
                removeWriterGroup: function(a) {
                    var b;
                    return this._acl.groups && this._acl.groups.w && -1 !== (b = this._acl.groups.w.indexOf(a)) && this._acl.groups.w.splice(b, 1), this
                },
                removeWriter: function(a) {
                    var b;
                    return this._acl.w && -1 !== (b = this._acl.w.indexOf(a)) && this._acl.w.splice(b, 1), this
                },
                setGloballyReadable: function(a) {
                    return this._acl.gr = a || !1, this
                },
                setGloballyWritable: function(a) {
                    return this._acl.gw = a || !1, this
                },
                toJSON: function() {
                    return this._acl
                }
            }, c.Group = function() {
                this._query = null, this._initial = {}, this._key = {}, this._reduce = function() {}.toString()
            }, c.Group.prototype = {
                by: function(a) {
                    return this._key[a] = !0, this
                },
                initial: function(a, b) {
                    if ("undefined" == typeof b && !s(a)) throw new c.Error("objectOrKey argument must be of type: Object.");
                    return s(a) ? this._initial = a : this._initial[a] = b, this
                },
                postProcess: function(a) {
                    return null === this._query ? a : this._query._postProcess(a)
                },
                query: function(a) {
                    if (!(a instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    return this._query = a, this
                },
                reduce: function(a) {
                    if (q(a) && (a = a.toString()), !u(a)) throw new c.Error("fn argument must be of type: function or string.");
                    return this._reduce = a, this
                },
                toJSON: function() {
                    return {
                        key: this._key,
                        initial: this._initial,
                        reduce: this._reduce,
                        condition: null !== this._query ? this._query.toJSON().filter : {}
                    }
                }
            }, c.Group.count = function(a) {
                var b = new c.Group;
                return null != a && b.by(a), b.initial({
                    result: 0
                }), b.reduce(function(a, b) {
                    b.result += 1
                }), b
            }, c.Group.sum = function(a) {
                a = a.replace("'", "\\'");
                var b = new c.Group;
                return b.initial({
                    result: 0
                }), b.reduce('function(doc, out) { out.result += doc["' + a + '"]; }'), b
            }, c.Group.min = function(a) {
                a = a.replace("'", "\\'");
                var b = new c.Group;
                return b.initial({
                    result: "Infinity"
                }), b.reduce('function(doc, out) { out.result = Math.min(out.result, doc["' + a + '"]); }'), b
            }, c.Group.max = function(a) {
                a = a.replace("'", "\\'");
                var b = new c.Group;
                return b.initial({
                    result: "-Infinity"
                }), b.reduce('function(doc, out) { out.result = Math.max(out.result, doc["' + a + '"]); }'), b
            }, c.Group.average = function(a) {
                a = a.replace("'", "\\'");
                var b = new c.Group;
                return b.initial({
                    count: 0,
                    result: 0
                }), b.reduce('function(doc, out) {  out.result = (out.result * out.count + doc["' + a + '"]) / (out.count + 1);  out.count += 1;}'), b
            }, c.execute = function(a, b, d) {
                d = d || {};
                var e = c.Persistence.create({
                    namespace: f,
                    collection: "custom",
                    id: a,
                    data: b,
                    auth: z.Default
                }, d).then(null, function(a) {
                    return c.Defer.reject(c.Error.REQUEST_ERROR === a.name && s(a.debug) ? a.debug : a)
                });
                return o(e, d)
            }, c.DataStore = {
                find: function(a, b, e) {
                    if (null != b && !(b instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    e = e || {};
                    var f = c.Persistence.read({
                        namespace: d,
                        collection: a,
                        query: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e);
                    return o(f, e)
                },
                get: function(a, b, e) {
                    e = e || {};
                    var f = c.Persistence.read({
                        namespace: d,
                        collection: a,
                        id: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e);
                    return o(f, e)
                },
                save: function(a, b, e) {
                    if (e = e || {}, null != b._id) return c.DataStore.update(a, b, e);
                    var f = c.Persistence.create({
                        namespace: d,
                        collection: a,
                        data: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e);
                    return o(f, e)
                },
                update: function(a, b, e) {
                    if (null == b._id) throw new c.Error("document argument must contain: _id");
                    e = e || {};
                    var f = c.Persistence.update({
                        namespace: d,
                        collection: a,
                        id: b._id,
                        data: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e);
                    return o(f, e)
                },
                clean: function(a, b, e) {
                    if (e = e || {}, b = b || new c.Query, !(b instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    var f = c.Persistence.destroy({
                        namespace: d,
                        collection: a,
                        query: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e);
                    return o(f, e)
                },
                destroy: function(a, b, e) {
                    e = e || {};
                    var f = c.Persistence.destroy({
                        namespace: d,
                        collection: a,
                        id: b,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, e).then(null, function(a) {
                        return e.silent && c.Error.ENTITY_NOT_FOUND === a.name ? {
                            count: 0
                        } : c.Defer.reject(a)
                    });
                    return o(f, e)
                },
                count: function(a, b, e) {
                    if (null != b && !(b instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    e = e || {};
                    var f = c.Persistence.read({
                        namespace: d,
                        collection: a,
                        id: "_count",
                        query: b,
                        auth: z.Default,
                        local: {
                            req: !0
                        }
                    }, e).then(function(a) {
                        return a.count
                    });
                    return o(f, e)
                },
                group: function(a, b, e) {
                    if (!(b instanceof c.Group)) throw new c.Error("aggregation argument must be of type: Kinvey.Group.");
                    e = e || {};
                    var f = c.Persistence.create({
                        namespace: d,
                        collection: a,
                        id: "_group",
                        data: b.toJSON(),
                        auth: z.Default,
                        local: {
                            req: !0
                        }
                    }, e).then(function(a) {
                        return b.postProcess(a)
                    });
                    return o(f, e)
                }
            }, c.File = {
                destroy: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.destroy({
                        namespace: e,
                        id: a,
                        auth: z.Default
                    }, b).then(null, function(a) {
                        return b.silent && c.Error.BLOB_NOT_FOUND === a.name ? {
                            count: 0
                        } : c.Defer.reject(a)
                    });
                    return o(d, b)
                },
                download: function(a, b) {
                    b = b || {};
                    var d = {};
                    !1 !== b.tls && (d.tls = !0), b.ttl && (d.ttl_in_seconds = b.ttl);
                    var f = c.Persistence.read({
                        namespace: e,
                        id: a,
                        flags: d,
                        auth: z.Default
                    }, b).then(function(a) {
                        if (b.stream) return a;
                        var d = b.success,
                            e = b.error;
                        return delete b.success, delete b.error, c.File.downloadByUrl(a, b).then(function(a) {
                            return b.success = d, b.error = e, a
                        }, function(a) {
                            return b.success = d, b.error = e, c.Defer.reject(a)
                        })
                    });
                    return o(f, b)
                },
                downloadByUrl: function(a, b) {
                    var d = s(a) ? a : {
                        _downloadURL: a
                    };
                    b = b || {}, b.file = d.mimeType || "application-octet-stream", b.headers = b.headers || {}, delete b.headers["Content-Type"];
                    var e = d._downloadURL,
                        f = c.Persistence.Net.request("GET", e, null, b.headers, b);
                    return f = f.then(function(a) {
                        return d._data = a, d
                    }, function(a) {
                        var b = m(c.Error.REQUEST_ERROR, {
                            description: "This file could not be downloaded from the provided URL.",
                            debug: a
                        });
                        return c.Defer.reject(b)
                    }), o(f, b)
                },
                find: function(a, b) {
                    if (null != a && !(a instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    b = b || {};
                    var d = {};
                    !1 !== b.tls && (d.tls = !0), b.ttl && (d.ttl_in_seconds = b.ttl);
                    var f = c.Persistence.read({
                        namespace: e,
                        query: a,
                        flags: d,
                        auth: z.Default
                    }, b).then(function(a) {
                        if (b.download) {
                            var d = b.success,
                                e = b.error;
                            delete b.success, delete b.error;
                            var f = a.map(function(a) {
                                return c.File.downloadByUrl(a, b)
                            });
                            return c.Defer.all(f).then(function(a) {
                                return b.success = d, b.error = e, a
                            }, function(a) {
                                return b.success = d, b.error = e, c.Defer.reject(a)
                            })
                        }
                        return a
                    });
                    return o(f, b)
                },
                stream: function(a, b) {
                    return b = b || {}, b.stream = !0, c.File.download(a, b)
                },
                upload: function(a, b, d) {
                    a = a || {}, b = b || {}, d = d || {}, null != b._filename || null == a._filename && null == a.name || (b._filename = a._filename || a.name), null != b.size || null == a.size && null == a.length || (b.size = a.size || a.length), b.mimeType = b.mimeType || a.mimeType || a.type || "application/octet-stream", d["public"] && (b._public = !0), d.contentType = b.mimeType;
                    var f = null != b._id ? c.Persistence.update({
                        namespace: e,
                        id: b._id,
                        data: b,
                        flags: !1 !== d.tls ? {
                            tls: !0
                        } : null,
                        auth: z.Default
                    }, d) : c.Persistence.create({
                        namespace: e,
                        data: b,
                        flags: !1 !== d.tls ? {
                            tls: !0
                        } : null,
                        auth: z.Default
                    }, d);
                    return f = f.then(function(b) {
                        var e = b._uploadURL,
                            f = b._requiredHeaders || {};
                        f["Content-Type"] = d.contentType, delete b._expiresAt, delete b._requiredHeaders, delete b._uploadURL;
                        var g = c.Persistence.Net.request("PUT", e, a, f, d);
                        return g.then(function() {
                            return b._data = a, b
                        })
                    }), o(f, d)
                }
            };
            var B = function(b) {
                var c = Date.parse(b);
                if (c) return new Date(c);
                var d = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/,
                    e = b.match(d);
                if (null != e[1]) {
                    var f = e[1].split(/\D/).map(function(b) {
                        return a.parseInt(b, 10) || 0
                    });
                    if (f[1] -= 1, f = new Date(Date.UTC.apply(Date, f)), null != e[5]) {
                        var g = a.parseInt(e[5], 10) / 100 * 60;
                        g += null != e[6] ? a.parseInt(e[6], 10) : 0, g *= "+" === e[4] ? -1 : 1, g && f.setUTCMinutes(f.getUTCMinutes() * g)
                    }
                    return f
                }
                return 0 / 0
            };
            c.Metadata = function(a) {
                if (!s(a)) throw new c.Error("document argument must be of type: Object.");
                this._acl = null, this._document = a
            }, c.Metadata.prototype = {
                getAcl: function() {
                    return null === this._acl && (this._acl = new c.Acl(this._document)), this._acl
                },
                getCreatedAt: function() {
                    return null != this._document._kmd && null != this._document._kmd.ect ? B(this._document._kmd.ect) : null
                },
                getEmailVerification: function() {
                    return null != this._document._kmd && null != this._document._kmd.emailVerification ? this._document._kmd.emailVerification.status : null
                },
                getLastModified: function() {
                    return null != this._document._kmd && null != this._document._kmd.lmt ? B(this._document._kmd.lmt) : null
                },
                setAcl: function(a) {
                    if (!(a instanceof c.Acl)) throw new c.Error("acl argument must be of type: Kinvey.Acl.");
                    return this._acl = null, this._document._acl = a.toJSON(), this
                },
                toJSON: function() {
                    return this._document
                }
            };
            var C = ["facebook", "google", "linkedIn", "twitter"],
                D = {
                    use: x(C)
                };
            C.forEach(function(a) {
                D[a] = w("Social." + a)
            }), c.Social = {
                connect: function(a, b, d) {
                    if (d = d || {}, d.create = "undefined" != typeof d.create ? d.create : !0, !c.Social.isSupported(b)) throw new c.Error("provider argument is not supported.");
                    var e = d.success,
                        f = d.error;
                    delete d.success, delete d.error;
                    var g = D[b](d).then(function(e) {
                        a = a || {};
                        var f = c.getActiveUser();
                        return a._socialIdentity = a._socialIdentity || {}, a._socialIdentity[b] = e, null !== f && f._id === a._id ? (d._provider = b, c.User.update(a, d)) : (a._socialIdentity = {}, a._socialIdentity[b] = e, c.User.login(a, null, d).then(null, function(b) {
                            return d.create && c.Error.USER_NOT_FOUND === b.name ? c.User.signup(a, d) : c.Defer.reject(b)
                        }))
                    });
                    return g = g.then(function(a) {
                        return d.success = e, d.error = f, a
                    }), o(g, d)
                },
                disconnect: function(a, b, d) {
                    if (!c.Social.isSupported(b)) throw new c.Error("provider argument is not supported.");
                    if (a._socialIdentity = a._socialIdentity || {}, a._socialIdentity[b] = null, null == a._id) {
                        var e = c.Defer.resolve(a);
                        return o(e, d)
                    }
                    return c.User.update(a, d)
                },
                facebook: function(a, b) {
                    return c.Social.connect(a, "facebook", b)
                },
                google: function(a, b) {
                    return c.Social.connect(a, "google", b)
                },
                isSupported: function(a) {
                    return -1 !== C.indexOf(a)
                },
                linkedIn: function(a, b) {
                    return c.Social.connect(a, "linkedIn", b)
                },
                twitter: function(a, b) {
                    return c.Social.connect(a, "twitter", b)
                }
            }, c.User = {
                signup: function(a, b) {
                    return b = b || {}, b.state = !0, c.User.create(a, b)
                },
                login: function(a, b, d) {
                    if (s(a) ? d = "undefined" != typeof d ? d : b : a = {
                        username: a,
                        password: b
                    }, d = d || {}, null == a.username && null == a.password && null == a._socialIdentity) throw new c.Error("Argument must contain: username and password, or _socialIdentity.");
                    if (null !== c.getActiveUser()) {
                        var e = m(c.Error.ALREADY_LOGGED_IN);
                        return o(c.Defer.reject(e), d)
                    }
                    var f = c.Persistence.create({
                        namespace: g,
                        collection: d._provider ? null : "login",
                        data: a,
                        flags: d._provider ? {
                            provider: d._provider
                        } : {},
                        auth: z.App,
                        local: {
                            res: !0
                        }
                    }, d).then(function(a) {
                        c.setToken(a._kmd.authtoken);
                        if (a.status == 'approved') {
                            return c.setActiveUser(a), a;
                        } else if (a.status == 'expired') {
                            var a = c.setActiveUser(null);
                            return null !== a && delete a._kmd.authtoken, a, o(c.Defer.reject({
                                error: 'expired',
                                description: 'Your trial account expired!,you will be redirect to upgrade page!'
                            }), d)
                        } else if (a.status == 'canceled') {
                            var a = c.setActiveUser(null);
                            return null !== a && delete a._kmd.authtoken, a, o(c.Defer.reject({
                                error: 'canceled',
                                description: 'Your account is canceled!'
                            }), d)
                        } else if (a.status == 'pending') {
                            var user = a;
                            var a = c.setActiveUser(null);

                            return null !== a && delete a._kmd.authtoken, a, o(c.Defer.reject({
                                user: user,
                                error: 'pending',
                                description: 'Your account is pending! please  select your plan & continue with subscription process.'
                            }), d)
                        }


                    });
                    return o(f, d)
                },
                logout: function(a) {
                    a = a || {};
                    var b;
                    return b = a.silent && null === c.getActiveUser() ? c.Defer.resolve(null) : c.Persistence.create({
                        namespace: g,
                        collection: "_logout",
                        auth: z.Session
                    }, a).then(null, function(b) {
                        return !a.force || c.Error.INVALID_CREDENTIALS !== b.name && c.Error.EMAIL_VERIFICATION_REQUIRED !== b.name ? c.Defer.reject(b) : null
                    }).then(function() {
                        var a = c.setActiveUser(null);
                        return null !== a && delete a._kmd.authtoken, a
                    }), o(b, a)
                },
                me: function(a) {
                    a = a || {};
                    var b = c.Persistence.read({
                        namespace: g,
                        collection: "_me",
                        auth: z.Session,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, a).then(function(a) {
                        return a._kmd = a._kmd || {}, null == a._kmd.authtoken && (a._kmd.authtoken = c.getActiveUser()._kmd.authtoken), c.setActiveUser(a), a
                    });
                    return o(b, a)
                },
                verifyEmail: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: f,
                        collection: a,
                        id: "user-email-verification-initiate",
                        auth: z.App
                    }, b);
                    return o(d, b)
                },
                forgotUsername: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: f,
                        id: "user-forgot-username",
                        data: {
                            email: a
                        },
                        auth: z.App
                    }, b);
                    return o(d, b)
                },
                resetPassword: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: f,
                        collection: a,
                        id: "user-password-reset-initiate",
                        auth: z.App
                    }, b);
                    return o(d, b)
                },
                exists: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: f,
                        id: "check-username-exists",
                        data: {
                            username: a
                        },
                        auth: z.App
                    }, b).then(function(a) {
                        return a.usernameExists
                    });
                    return o(d, b)
                },
                create: function(a, b) {
                    if (b = b || {}, !1 !== b.state && null !== c.getActiveUser()) {
                        var d = m(c.Error.ALREADY_LOGGED_IN);
                        return o(c.Defer.reject(d), b)
                    }
                    var e = c.Persistence.create({
                        namespace: g,
                        data: a || {},
                        auth: z.App
                    }, b).then(function(a) {
                        c.setToken(a._kmd.authtoken);
                        return !1 !== b.state && a;
                    });
                    return o(e, b)
                },
                update: function(a, b) {
                    if (null == a._id) throw new c.Error("data argument must contain: _id");
                    b = b || {};
                    var d = [];
                    if (null != a._socialIdentity)
                        for (var e in a._socialIdentity) a._socialIdentity.hasOwnProperty(e) && null != a._socialIdentity[e] && e !== b._provider && (d.push({
                            provider: e,
                            access_token: a._socialIdentity[e].access_token,
                            access_token_secret: a._socialIdentity[e].access_token_secret
                        }), delete a._socialIdentity[e].access_token, delete a._socialIdentity[e].access_token_secret);
                    var f = c.Persistence.update({
                        namespace: g,
                        id: a._id,
                        data: a,
                        auth: z.Default,
                        local: {
                            res: !0
                        }
                    }, b).then(function(a) {
                        d.forEach(function(b) {
                            var c = b.provider;
                            null != a._socialIdentity && null != a._socialIdentity[c] && ["access_token", "access_token_secret"].forEach(function(d) {
                                null != b[d] && (a._socialIdentity[c][d] = b[d])
                            })
                        });
                        var b = c.getActiveUser();
                        return null !== b && b._id === a._id && c.setActiveUser(a), a
                    });
                    return o(f, b)
                },
                find: function(a, b) {
                    if (null != a && !(a instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    b = b || {};
                    var d;
                    return d = b.discover ? c.Persistence.create({
                        namespace: g,
                        collection: "_lookup",
                        data: null != a ? a.toJSON().filter : null,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, b) : c.Persistence.read({
                        namespace: g,
                        query: a,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, b), o(d, b)
                },
                get: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.read({
                        namespace: g,
                        id: a,
                        auth: z.Default,
                        local: {
                            req: !0,
                            res: !0
                        }
                    }, b);
                    return o(d, b)
                },
                destroy: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.destroy({
                        namespace: g,
                        id: a,
                        flags: b.hard ? {
                            hard: !0
                        } : {},
                        auth: z.Default,
                        local: {
                            res: !0
                        }
                    }, b).then(function(b) {
                        var d = c.getActiveUser();
                        return null !== d && d._id === a && c.setActiveUser(null), b
                    }, function(a) {
                        return b.silent && c.Error.USER_NOT_FOUND === a.name ? null : c.Defer.reject(a)
                    });
                    return o(d, b)
                },
                restore: function(a, b) {
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: g,
                        collection: a,
                        id: "_restore",
                        auth: z.Master
                    }, b);
                    return o(d, b)
                },
                count: function(a, b) {
                    if (null != a && !(a instanceof c.Query)) throw new c.Error("query argument must be of type: Kinvey.Query.");
                    b = b || {};
                    var d = c.Persistence.read({
                        namespace: g,
                        id: "_count",
                        query: a,
                        auth: z.Default,
                        local: {
                            req: !0
                        }
                    }, b).then(function(a) {
                        return a.count
                    });
                    return o(d, b)
                },
                group: function(a, b) {
                    if (!(a instanceof c.Group)) throw new c.Error("aggregation argument must be of type: Kinvey.Group.");
                    b = b || {};
                    var d = c.Persistence.create({
                        namespace: g,
                        id: "_group",
                        data: a.toJSON(),
                        auth: z.Default,
                        local: {
                            req: !0
                        }
                    }, b).then(function(b) {
                        return a.postProcess(b)
                    });
                    return o(d, b)
                }
            }, c.Query = function(a) {
                a = a || {}, this._fields = a.fields || [], this._filter = a.filter || {}, this._sort = a.sort || {}, this._limit = a.limit || null, this._skip = a.skip || 0, this._parent = null
            }, c.Query.prototype = {
                equalTo: function(a, b) {
                    return this._filter[a] = b, this
                },
                contains: function(a, b) {
                    if (!p(b)) throw new c.Error("values argument must be of type: Array.");
                    return this._addFilter(a, "$in", b)
                },
                containsAll: function(a, b) {
                    if (!p(b)) throw new c.Error("values argument must be of type: Array.");
                    return this._addFilter(a, "$all", b)
                },
                greaterThan: function(a, b) {
                    if (!r(b) && !u(b)) throw new c.Error("value argument must be of type: number or string.");
                    return this._addFilter(a, "$gt", b)
                },
                greaterThanOrEqualTo: function(a, b) {
                    if (!r(b) && !u(b)) throw new c.Error("value argument must be of type: number or string.");
                    return this._addFilter(a, "$gte", b)
                },
                lessThan: function(a, b) {
                    if (!r(b) && !u(b)) throw new c.Error("value argument must be of type: number or string.");
                    return this._addFilter(a, "$lt", b)
                },
                lessThanOrEqualTo: function(a, b) {
                    if (!r(b) && !u(b)) throw new c.Error("value argument must be of type: number or string.");
                    return this._addFilter(a, "$lte", b)
                },
                notEqualTo: function(a, b) {
                    return this._addFilter(a, "$ne", b)
                },
                notContainedIn: function(a, b) {
                    if (!p(b)) throw new c.Error("values argument must be of type: Array.");
                    return this._addFilter(a, "$nin", b)
                },
                and: function() {
                    return this._join("$and", Array.prototype.slice.call(arguments))
                },
                nor: function() {
                    return null !== this._parent && null != this._parent._filter.$and ? this._parent.nor.apply(this._parent, arguments) : this._join("$nor", Array.prototype.slice.call(arguments))
                },
                or: function() {
                    return null !== this._parent ? this._parent.or.apply(this._parent, arguments) : this._join("$or", Array.prototype.slice.call(arguments))
                },
                exists: function(a, b) {
                    return b = "undefined" == typeof b ? !0 : b || !1, this._addFilter(a, "$exists", b)
                },
                mod: function(a, b, d) {
                    if (u(b) && (b = parseFloat(b)), "undefined" == typeof d ? d = 0 : u(d) && (d = parseFloat(d)), !r(b)) throw new c.Error("divisor arguments must be of type: number.");
                    if (!r(d)) throw new c.Error("remainder argument must be of type: number.");
                    return this._addFilter(a, "$mod", [b, d])
                },
                matches: function(a, b, c) {
                    if (t(b) || (b = new RegExp(b)), c = c || {}, (b.ignoreCase || c.ignoreCase) && !1 !== c.ignoreCase) throw new Error("ignoreCase flag is not supported.");
                    if (0 !== b.source.indexOf("^")) throw new Error("regExp must be an anchored expression.");
                    var d = [];
                    (b.multiline || c.multiline) && !1 !== c.multiline && d.push("m"), c.extended && d.push("x"), c.dotMatchesAll && d.push("s");
                    var e = this._addFilter(a, "$regex", b.source);
                    return 0 !== d.length && this._addFilter(a, "$options", d.join("")), e
                },
                near: function(a, b, d) {
                    if (!p(b) || null == b[0] || null == b[1]) throw new c.Error("coord argument must be of type: Array.<number, number>.");
                    b[0] = parseFloat(b[0]), b[1] = parseFloat(b[1]);
                    var e = this._addFilter(a, "$nearSphere", [b[0], b[1]]);
                    return null != d && this._addFilter(a, "$maxDistance", d), e
                },
                withinBox: function(a, b, d) {
                    if (!p(b) || null == b[0] || null == b[1]) throw new c.Error("bottomLeftCoord argument must be of type: Array.<number, number>.");
                    if (!p(d) || null == d[0] || null == d[1]) throw new c.Error("upperRightCoord argument must be of type: Array.<number, number>.");
                    b[0] = parseFloat(b[0]), b[1] = parseFloat(b[1]), d[0] = parseFloat(d[0]), d[1] = parseFloat(d[1]);
                    var e = [
                        [b[0], b[1]],
                        [d[0], d[1]]
                    ];
                    return this._addFilter(a, "$within", {
                        $box: e
                    })
                },
                withinPolygon: function(a, b) {
                    if (!p(b) || 3 > b.length) throw new c.Error("coords argument must be of type: Array.Array.<number, number>.");
                    return b = b.map(function(a) {
                        if (null == a[0] || null == a[1]) throw new c.Error("coords argument must be of type: Array.Array.<number, number>.");
                        return [parseFloat(a[0]), parseFloat(a[1])]
                    }), this._addFilter(a, "$within", {
                        $polygon: b
                    })
                },
                size: function(a, b) {
                    if (u(b) && (b = parseFloat(b)), !r(b)) throw new c.Error("size argument must be of type: number.");
                    return this._addFilter(a, "$size", b)
                },
                fields: function(a) {
                    if (a = a || [], !p(a)) throw new c.Error("fields argument must be of type: Array.");
                    return null !== this._parent ? this._parent.fields(a) : this._fields = a, this
                },
                limit: function(a) {
                    if (a = a || null, u(a) && (a = parseFloat(a)), null != a && !r(a)) throw new c.Error("limit argument must be of type: number.");
                    return null !== this._parent ? this._parent.limit(a) : this._limit = a, this
                },
                skip: function(a) {
                    if (u(a) && (a = parseFloat(a)), !r(a)) throw new c.Error("skip argument must be of type: number.");
                    return null !== this._parent ? this._parent.skip(a) : this._skip = a, this
                },
                ascending: function(a) {
                    return null !== this._parent ? this._parent.ascending(a) : this._sort[a] = 1, this
                },
                descending: function(a) {
                    return null !== this._parent ? this._parent.descending(a) : this._sort[a] = -1, this
                },
                sort: function(a) {
                    if (null != a && !s(a)) throw new c.Error("sort argument must be of type: Object.");
                    return null !== this._parent ? this._parent.sort(a) : this._sort = a || {}, this
                },
                toJSON: function() {
                    return null !== this._parent ? this._parent.toJSON() : {
                        fields: this._fields,
                        filter: this._filter,
                        sort: this._sort,
                        skip: this._skip,
                        limit: this._limit
                    }
                },
                _addFilter: function(a, b, c) {
                    return s(this._filter[a]) || (this._filter[a] = {}), this._filter[a][b] = c, this
                },
                _join: function(a, b) {
                    var d = this;
                    b = b.map(function(a) {
                        if (!(a instanceof c.Query)) {
                            if (!s(a)) throw new c.Error("query argument must be of type: Kinvey.Query[] or Object[].");
                            a = new c.Query(a)
                        }
                        return a.toJSON().filter
                    }), 0 === b.length && (d = new c.Query, b = [d.toJSON().filter], d._parent = this);
                    var e = {};
                    for (var f in this._filter) this._filter.hasOwnProperty(f) && (e[f] = this._filter[f], delete this._filter[f]);
                    return this._filter[a] = [e].concat(b), d
                },
                _postProcess: function(a) {
                    if (!p(a)) throw new c.Error("response argument must be of type: Array.");
                    var b = this;
                    return a = a.sort(function(a, c) {
                        for (var d in b._sort)
                            if (b._sort.hasOwnProperty(d)) {
                                var e = n(a, d),
                                    f = n(c, d);
                                if (null != e && null == f) return -1;
                                if (null != f && null == e) return 1;
                                if (e !== f) {
                                    var g = b._sort[d];
                                    return (f > e ? -1 : 1) * g
                                }
                            }
                        return 0
                    }), null !== this._limit ? a.slice(this._skip, this._skip + this._limit) : a.slice(this._skip)
                }
            };
            var E = {
                get: function(a, b) {
                    if (p(a)) {
                        var d = a.map(function(a) {
                            return E.get(a, b)
                        });
                        return c.Defer.all(d)
                    }
                    b = b || {}, b.exclude = b.exclude || [], b.relations = b.relations || {};
                    var e = b.error,
                        f = b.relations,
                        h = b.success;
                    delete b.error, delete b.relations, delete b.success;
                    var i = [];
                    Object.keys(f).forEach(function(a) {
                        var b = a.split(".").length;
                        i[b] = (i[b] || []).concat(a)
                    });
                    var j = c.Defer.resolve(null);
                    return i.forEach(function(d) {
                        j = j.then(function() {
                            var e = d.map(function(d) {
                                var e = n(a, d),
                                    f = p(e),
                                    h = (f ? e : [e]).map(function(a) {
                                        if (null == a || "KinveyRef" !== a._type || -1 !== b.exclude.indexOf(d)) return c.Defer.resolve(a);
                                        var e;
                                        return e = g === a._collection ? c.User.get(a._id, b) : c.DataStore.get(a._collection, a._id, b), e.then(null, function() {
                                            return c.Defer.resolve(a)
                                        })
                                    });
                                return c.Defer.all(h).then(function(b) {
                                    n(a, d, f ? b : b[0])
                                })
                            });
                            return c.Defer.all(e)
                        })
                    }), j.then(function() {
                        return b.error = e, b.relations = f, b.success = h, a
                    }, function(a) {
                        return b.error = e, b.relations = f, b.success = h, c.Defer.reject(a)
                    })
                },
                save: function(a, b, d) {
                    if (p(b)) {
                        var e = b.map(function(b) {
                            return E.save(a, b, d)
                        });
                        return c.Defer.all(e)
                    }
                    d = d || {}, d.exclude = d.exclude || [], d.relations = d.relations || {};
                    var f = d.error,
                        h = d.relations,
                        i = d.success;
                    delete d.error, delete d.relations, delete d.success;
                    var j = [];
                    h[""] = a, Object.keys(h).forEach(function(a) {
                        var b = "" === a ? 0 : a.split(".").length;
                        j[b] = (j[b] || []).concat(a)
                    });
                    var k = {}, l = c.Defer.resolve(null);
                    return j.reverse().forEach(function(a) {
                        l = l.then(function() {
                            var e = a.map(function(a) {
                                var e = h[a],
                                    f = n(b, a),
                                    i = p(f),
                                    j = (i ? f : [f]).map(function(b) {
                                        if (null == b || "KinveyRef" === b._type || -1 !== d.exclude.indexOf(a)) return c.Defer.resolve(b);
                                        var f, h = d.offline && !1 === d.track;
                                        if (g !== e || h) f = c.DataStore.save(e, b, d);
                                        else {
                                            var i = null == b._id;
                                            d.state = i && "" !== a ? d.state || !1 : d.state, f = c.User[i ? "create" : "update"](b, d)
                                        }
                                        return f.then(null, function(e) {
                                            return d.force && "" !== a ? b : c.Defer.reject(e)
                                        })
                                    });
                                return c.Defer.all(j).then(function(c) {
                                    var d = c.map(function(a) {
                                        return null == a || null == a._id ? a : {
                                            _type: "KinveyRef",
                                            _collection: e,
                                            _id: a._id
                                        }
                                    });
                                    i || (d = d[0], c = c[0]), n(b, a, d), k[a] = c
                                })
                            });
                            return c.Defer.all(e)
                        })
                    }), l.then(function() {
                        var a = k[""];
                        return j.reverse().forEach(function(b) {
                            b.forEach(function(b) {
                                n(a, b, k[b])
                            })
                        }), delete h[""], d.error = f, d.relations = h, d.success = i, a
                    }, function(a) {
                        return delete h[""], d.error = f, d.relations = h, d.success = i, c.Defer.reject(a)
                    })
                }
            }, F = function(a) {
                    var b = c.Sync.isEnabled(),
                        d = c.Sync.isOnline();
                    return a.fallback = b && d && !1 !== a.fallback, a.offline = b && (!d || a.offline), a.refresh = b && d && !1 !== a.refresh, a
                }, G = {
                    addMetadata: function(a, b) {
                        var c = (new Date).toISOString(),
                            d = p(a),
                            e = d ? a : [a];
                        return e = e.map(function(a) {
                            return null != a && (a._kmd = a._kmd || {}, a._kmd.lastRefreshedAt = c, null != b && (a._kmd.maxAge = b)), a
                        }), d ? e : e[0]
                    },
                    removeMetadata: function(a) {
                        var b = p(a),
                            c = b ? a : [a];
                        return c = c.map(function(a) {
                            return null != a && null != a._kmd && (delete a._kmd.lastRefreshedAt, delete a._kmd.maxAge), a
                        }), b ? c : c[0]
                    },
                    status: function(a, b) {
                        for (var c = !1, d = p(a) ? a : [a], e = d.length, f = (new Date).getTime(), g = 0; e > g; g += 1) {
                            var h = d[g];
                            if (null != h && null != h._kmd && null != h._kmd.lastRefreshedAt) {
                                var i = 1e3 * (b || h._kmd.maxAge),
                                    j = B(h._kmd.lastRefreshedAt).getTime(),
                                    k = j + i;
                                if (f > k) return !1;
                                var l = j + .9 * i;
                                f > l && (c = !0)
                            }
                        }
                        return c ? {
                            refresh: !0
                        } : !0
                    }
                };
            c.Persistence = {
                create: function(a, b) {
                    if (b.relations) {
                        var d = g === a.namespace ? g : a.collection;
                        return E.save(d, a.data, b)
                    }
                    if (a.local = a.local || {}, b = F(b), a.local.req && b.offline) return c.Persistence.Local.create(a, b).then(null, function(d) {
                        return b.fallback && "_group" === a.id ? (b.offline = !1, c.Persistence.create(a, b)) : c.Defer.reject(d)
                    });
                    var e = c.Persistence.Net.create(a, b);
                    return a.local.res && b.refresh ? e.then(function(d) {
                        return a.data = d, c.Persistence.Local.create(a, b).then(function() {
                            return d
                        })
                    }) : e
                },
                read: function(a, b) {
                    if (a.local = a.local || {}, b = F(b), a.local.req && b.offline) return c.Persistence.Local.read(a, b).then(null, function(d) {
                        return b.fallback ? (b.offline = !1, c.Persistence.read(a, b)) : c.Defer.reject(d)
                    });
                    var d = c.Persistence.Net.read(a, b),
                        e = b.fields || a.query && !v(a.query._fields);
                    return a.local.res && b.refresh && !e ? d.then(function(d) {
                        var e;
                        if (b.relations) {
                            var f = b.offline;
                            b.offline = !0, b.track = !1;
                            var h = g === a.namespace ? g : a.collection;
                            e = E.save(h, d, b).then(function() {
                                b.offline = f, delete b.track
                            })
                        } else a.data = d, e = c.Persistence.Local.create(a, b);
                        return e.then(function() {
                            return d
                        })
                    }, function(d) {
                        return c.Error.ENTITY_NOT_FOUND === d.name ? c.Persistence.Local.destroy(a, b).then(function() {
                            return c.Defer.reject(d)
                        }) : c.Defer.reject(d)
                    }) : d
                },
                update: function(a, b) {
                    if (b.relations) {
                        var d = g === a.namespace ? g : a.collection;
                        return E.save(d, a.data, b)
                    }
                    if (a.local = a.local || {}, b = F(b), a.local.req && b.offline) return c.Persistence.Local.update(a, b);
                    var e = c.Persistence.Net.update(a, b);
                    return a.local.res && b.refresh ? e.then(function(d) {
                        return a.data = d, c.Persistence.Local.update(a, b).then(function() {
                            return d
                        })
                    }) : e
                },
                destroy: function(a, b) {
                    if (a.local = a.local || {}, b = F(b), a.local.req && b.offline) return c.Persistence.Local.destroy(a, b);
                    var d = c.Persistence.Net.destroy(a, b);
                    return a.local.res && b.refresh ? d.then(function(d) {
                        return c.Persistence.Local.destroy(a, b).then(function() {
                            return d
                        }, function(a) {
                            return c.Error.ENTITY_NOT_FOUND === a.name ? d : c.Defer.reject(a)
                        })
                    }) : d
                }
            };
            var H = {
                batch: w("Database.batch"),
                clean: w("Database.clean"),
                count: w("Database.count"),
                destroy: w("Database.destroy"),
                destruct: w("Database.destruct"),
                find: w("Database.find"),
                findAndModify: w("Database.findAndModify"),
                get: w("Database.get"),
                group: w("Database.group"),
                save: w("Database.save"),
                update: w("Database.update"),
                use: x(["batch", "clean", "count", "destroy", "destruct", "find", "findAndModify", "get", "group", "save", "update"])
            };
            c.Persistence.Local = {
                create: function(a, b) {
                    b = b || {};
                    var c = g === a.namespace ? g : a.collection;
                    if ("_group" === a.id) return H.group(c, a.data, b);
                    a.data = G.addMetadata(a.data, b.maxAge);
                    var d = p(a.data) ? "batch" : "save",
                        e = H[d](c, a.data, b);
                    return e.then(function(a) {
                        return b.offline && !1 !== b.track ? J.notify(c, a, b).then(function() {
                            return a
                        }) : a
                    })
                },
                read: function(a, b) {
                    b = b || {};
                    var d = g === a.namespace ? g : a.collection;
                    if ("_count" === a.id) return H.count(d, a.query, b);
                    if ("_me" === a.collection) {
                        var e = c.getActiveUser();
                        if (null !== e) return H.get(d, e._id, b).then(null, function(a) {
                            return a.name === c.Error.ENTITY_NOT_FOUND ? e : c.Defer.reject(a)
                        });
                        var f = m(c.Error.NO_ACTIVE_USER);
                        return c.Defer.reject(f)
                    }
                    var h;
                    return h = null == a.id ? H.find(d, a.query, b) : H.get(d, a.id, b), h.then(function(d) {
                        var e = G.status(d);
                        return !1 === e && c.Sync.isOnline() ? (b.offline = !1, c.Persistence.read(a, b)) : b.relations ? E.get(d, b).then(function(d) {
                            return !0 === e.refresh && c.Sync.isOnline() && (b.offline = !1, c.Persistence.read(a, b)), d
                        }) : (!0 === e.refresh && c.Sync.isOnline() && (b.offline = !1, c.Persistence.read(a, b)), d)
                    })
                },
                update: function(a, b) {
                    b = b || {};
                    var c = g === a.namespace ? g : a.collection;
                    a.data = G.addMetadata(a.data, b.maxAge);
                    var d = H.update(c, a.data, b);
                    return d.then(function(a) {
                        return b.offline && !1 !== b.track ? J.notify(c, a, b).then(function() {
                            return a
                        }) : a
                    })
                },
                destroy: function(a, b) {
                    b = b || {};
                    var c, d = g === a.namespace ? g : a.collection;
                    return c = null == a.id ? H.clean(d, a.query, b) : H.destroy(d, a.id, b), c.then(function(a) {
                        return b.offline && !1 !== b.track ? J.notify(d, a.documents, b).then(function() {
                            return a
                        }) : a
                    })
                }
            };
            var I = null;
            c.Persistence.Net = {
                create: function(a, b) {
                    return a.data = G.removeMetadata(a.data), a.method = "POST", c.Persistence.Net._request(a, b)
                },
                read: function(a, b) {
                    if (a.flags = a.flags || {}, b = b || {}, p(b.fields) && (a.flags.fields = b.fields.join(",")), null != a.collection && (!1 !== b.fileTls && (a.flags.kinveyfile_tls = !0), b.fileTtl && (a.flags.kinveyfile_ttl = b.fileTtl)), b.relations) {
                        b.exclude = b.exclude || [];
                        var d = Object.keys(b.relations).filter(function(a) {
                            return -1 === b.exclude.indexOf(a)
                        });
                        0 !== d.length && (a.flags.retainReferences = !1, a.flags.resolve = d.join(","))
                    }
                    return a.method = "GET", c.Persistence.Net._request(a, b)
                },
                update: function(a, b) {
                    return a.data = G.removeMetadata(a.data), a.method = "PUT", c.Persistence.Net._request(a, b)
                },
                destroy: function(a, b) {
                    return a.method = "DELETE", c.Persistence.Net._request(a, b)
                },
                _request: function(a, b) {
                    if (null == a.method) throw new c.Error("request argument must contain: method.");
                    if (null == a.namespace) throw new c.Error("request argument must contain: namespace.");
                    if (null == a.auth) throw new c.Error("request argument must contain: auth.");
                    var d;
                    if (null == c.appKey && z.None !== a.auth) return d = m(c.Error.MISSING_APP_CREDENTIALS), c.Defer.reject(d);
                    if (null == c.masterSecret && b.skipBL) return d = m(c.Error.MISSING_MASTER_CREDENTIALS), c.Defer.reject(d);
                    b.trace = b.trace || !1;
                    var e = [a.namespace, c.appKey, a.collection, a.id];
                    e = e.filter(function(a) {
                        return null != a
                    }).map(c.Persistence.Net.encode);
                    var f = [c.API_ENDPOINT].concat(e).join("/") + "/",
                        g = a.flags || {};
                    if (a.query) {
                        var h = a.query.toJSON();
                        g.query = h.filter, v(h.fields) || (g.fields = h.fields.join(",")), null !== h.limit && (g.limit = h.limit), 0 !== h.skip && (g.skip = h.skip), v(h.sort) || (g.sort = h.sort)
                    }!1 !== b.nocache && (g._ = Math.random().toString(36).substr(2));
                    var i = [];
                    for (var j in g)
                        if (g.hasOwnProperty(j)) {
                            var k = u(g[j]) ? g[j] : JSON.stringify(g[j]);
                            i.push(c.Persistence.Net.encode(j) + "=" + c.Persistence.Net.encode(k))
                        }
                    0 < i.length && (f += "?" + i.join("&")), null === I && (I = A());
                    var l = {
                        Accept: "application/json",
                        "X-Kinvey-API-Version": c.API_VERSION,
                        "X-Kinvey-Device-Information": I
                    };
                    null != a.data && (l["Content-Type"] = "application/json; charset=utf-8"), b.contentType && (l["X-Kinvey-Content-Type"] = b.contentType), b.skipBL && (l["X-Kinvey-Skip-Business-Logic"] = "true"), b.trace && (l["X-Kinvey-Include-Headers-In-Response"] = "X-Kinvey-Request-Id", l["X-Kinvey-ResponseWrapper"] = "true");
                    var n = a.auth().then(function(a) {
                        if (null !== a) {
                            var b = a.credentials;
                            null != a.username && (b = c.Persistence.Net.base64(a.username + ":" + a.password)), l.Authorization = a.scheme + " " + b
                        }
                    });
                    return n.then(function() {
                        var d = c.Persistence.Net.request(a.method, f, a.data, l, b).then(function(a) {
                            try {
                                a = JSON.parse(a)
                            } catch (c) {}
                            return b.trace && s(a) ? a.result : a
                        }, function(a) {
                            try {
                                a = JSON.parse(a)
                            } catch (d) {}
                            var e = null;
                            if (b.trace && (e = a.headers["X-Kinvey-Request-Id"], a = a.result), null != a && null != a.error) a = {
                                name: a.error,
                                description: a.description || "",
                                debug: a.debug || ""
                            }, b.trace && (a.requestId = e);
                            else {
                                var f = {
                                    abort: c.Error.REQUEST_ABORT_ERROR,
                                    error: c.Error.REQUEST_ERROR,
                                    timeout: c.Error.REQUEST_TIMEOUT_ERROR
                                };
                                a = m(f[a] || f.error, {
                                    debug: a
                                })
                            }
                            return c.Defer.reject(a)
                        });
                        return d.then(null, function(a) {
                            if (c.Error.USER_LOCKED_DOWN === a.name) {
                                if (c.setActiveUser(null), "undefined" != typeof H) {
                                    var b = function() {
                                        c.Defer.reject(a)
                                    };
                                    return c.Sync.destruct().then(b, b)
                                }
                            } else c.Error.INVALID_CREDENTIALS === a.name && (a.debug += " It is possible the tokens used to execute the request are expired. In that case, please run `Kinvey.User.logout({ force: true })`, and then log back in  using`Kinvey.User.login(username, password)` to solve this issue.");
                            return c.Defer.reject(a)
                        })
                    })
                },
                base64: w("Kinvey.Persistence.Net.base64"),
                encode: w("Kinvey.Persistence.Net.encode"),
                request: w("Kinvey.Persistence.Net.request"),
                use: x(["base64", "encode", "request"])
            };
            var J = {
                enabled: !1,
                online: !0,
                system: "system.sync",
                count: function(a, b) {
                    if (b = b || {}, null != a) return H.get(J.system, a, b).then(function(a) {
                        return a.size
                    }, function(a) {
                        return c.Error.ENTITY_NOT_FOUND === a.name ? 0 : c.Defer.reject(a)
                    });
                    var d = c.Group.sum("size").toJSON();
                    return H.group(J.system, d, b).then(function(a) {
                        return a[0] ? a[0].result : 0
                    })
                },
                execute: function(a) {
                    var b = (new c.Query).greaterThan("size", 0);
                    return H.find(J.system, b, a).then(function(b) {
                        var d = b.map(function(b) {
                            return J._collection(b._id, b.documents, a)
                        });
                        return c.Defer.all(d)
                    })
                },
                notify: function(a, b, c) {
                    return H.findAndModify(J.system, a, function(c) {
                        return b = p(b) ? b : [b], c = c || {
                            _id: a,
                            documents: {},
                            size: 0
                        }, b.forEach(function(a) {
                            c.documents.hasOwnProperty(a._id) || (c.size += 1);
                            var b = null != a._kmd ? a._kmd.lmt : null;
                            c.documents[a._id] = b || null
                        }), c
                    }, c).then(function() {
                        return null
                    })
                },
                _collection: function(a, b, e) {
                    var f = {
                        collection: a,
                        success: [],
                        error: []
                    }, h = Object.keys(b),
                        i = {
                            namespace: g === a ? g : d,
                            collection: g === a ? null : a,
                            query: (new c.Query).contains("_id", h),
                            auth: z.Default
                        }, j = [c.Persistence.Local.read(i, e), c.Persistence.Net.read(i, e)];
                    return c.Defer.all(j).then(function(a) {
                        var b = {
                            local: {},
                            net: {}
                        };
                        return a[0].forEach(function(a) {
                            b.local[a._id] = a
                        }), a[1].forEach(function(a) {
                            b.net[a._id] = a
                        }), b
                    }).then(function(d) {
                        var g = h.map(function(c) {
                            var g = {
                                id: c,
                                timestamp: b[c]
                            };
                            return J._document(a, g, d.local[c] || null, d.net[c] || null, e).then(null, function(a) {
                                return f.error.push(a.id), null
                            })
                        });
                        return c.Defer.all(g)
                    }).then(function(b) {
                        var d = b.filter(function(a) {
                            return null != a && null !== a.document
                        }),
                            f = b.filter(function(a) {
                                return null != a && null === a.document
                            }),
                            g = [J._save(a, d, e), J._destroy(a, f, e)];
                        return c.Defer.all(g)
                    }).then(function(b) {
                        return f.success = f.success.concat(b[0].success, b[1].success), f.error = f.error.concat(b[0].error, b[1].error), H.findAndModify(J.system, a, function(a) {
                            return f.success.forEach(function(b) {
                                a.documents.hasOwnProperty(b) && (a.size -= 1, delete a.documents[b])
                            }), a
                        }, e)
                    }).then(function() {
                        return f
                    })
                },
                _destroy: function(a, b, e) {
                    if (b = b.map(function(a) {
                        return a.id
                    }), 0 === b.length) return c.Defer.resolve({
                        success: [],
                        error: []
                    });
                    var f = {
                        namespace: g === a ? g : d,
                        collection: g === a ? null : a,
                        query: (new c.Query).contains("_id", b),
                        auth: z.Default
                    }, h = [c.Persistence.Local.destroy(f, e), c.Persistence.Net.destroy(f, e)];
                    return c.Defer.all(h).then(function() {
                        return {
                            success: b,
                            error: []
                        }
                    }, function() {
                        return {
                            success: [],
                            error: b
                        }
                    })
                },
                _document: function(a, b, d, e, f) {
                    return null === e || null != e._kmd && b.timestamp === e._kmd.lmt ? c.Defer.resolve({
                        id: b.id,
                        document: d
                    }) : null != f.conflict ? f.conflict(a, d, e).then(function(a) {
                        return {
                            id: b.id,
                            document: a
                        }
                    }, function() {
                        return c.Defer.reject({
                            id: b.id,
                            document: [d, e]
                        })
                    }) : c.Defer.reject({
                        id: b.id,
                        document: [d, e]
                    })
                },
                _save: function(a, b, e) {
                    b = b.map(function(a) {
                        return a.document
                    });
                    var f = [],
                        h = b.map(function(b) {
                            return c.Persistence.Net.update({
                                namespace: g === a ? g : d,
                                collection: g === a ? null : a,
                                id: b._id,
                                data: b,
                                auth: z.Default
                            }, e).then(null, function() {
                                return f.push(b._id), null
                            })
                        });
                    return c.Defer.all(h).then(function(b) {
                        return c.Persistence.Local.create({
                            namespace: g === a ? g : d,
                            collection: g === a ? null : a,
                            data: b,
                            auth: z.Default
                        }, e)
                    }).then(function(a) {
                        return {
                            success: a.map(function(a) {
                                return a._id
                            }),
                            error: f
                        }
                    }, function() {
                        return {
                            success: [],
                            error: b.map(function(a) {
                                return a._id
                            })
                        }
                    })
                }
            };
            c.Sync = {
                count: function(a, b) {
                    b = b || {};
                    var c = J.count(a, b);
                    return o(c, b)
                },
                destruct: function(a) {
                    a = a || {};
                    var b = H.destruct(a);
                    return o(b, a)
                },
                execute: function(a) {
                    if (!c.Sync.isOnline()) {
                        var b = m(c.Error.SYNC_ERROR, {
                            debug: "Sync is not enabled, or the application resides in offline mode."
                        });
                        return c.Defer.reject(b)
                    }
                    a = a || {};
                    var d;
                    return null != a.user ? (d = c.User.login(a.user).then(function() {
                        return delete a.user, c.Sync.execute(a)
                    }), delete a.success, o(d, a)) : (d = J.execute(a), o(d, a))
                },
                init: function(a) {
                    return a = a || {}, J.enabled = null != a ? a.enable : !1, J.online = "undefined" != typeof a.online ? a.online : J.online, c.Defer.resolve(null)
                },
                isEnabled: function() {
                    return J.enabled
                },
                isOnline: function() {
                    return J.online
                },
                offline: function() {
                    if (!c.Sync.isEnabled()) {
                        var a = m(c.Error.SYNC_ERROR, {
                            debug: "Sync is not enabled."
                        });
                        return c.Defer.reject(a)
                    }
                    return J.online = !1, c.Defer.resolve(null)
                },
                online: function(a) {
                    if (!c.Sync.isEnabled()) {
                        var b = m(c.Error.SYNC_ERROR, {
                            debug: "Sync is not enabled."
                        });
                        return c.Defer.reject(b)
                    }
                    a = a || {};
                    var d = J.online;
                    return J.online = !0, !1 !== a.sync && d !== J.online ? c.Sync.execute(a) : c.Defer.resolve(null)
                },
                clientAlwaysWins: function(a, b) {
                    return c.Defer.resolve(b)
                },
                serverAlwaysWins: function(a, b, d) {
                    return c.Defer.resolve(d)
                }
            };
            var K = {
                db: null,
                dbName: function() {
                    if (null == c.appKey) throw new c.Error("Kinvey.appKey must not be null.");
                    return "Kinvey." + c.appKey
                },
                size: 5242880,
                open: function() {
                    return a.openDatabase(K.dbName(), 1, "", K.size)
                },
                transaction: function(a, b, d, e) {
                    var f;
                    if (!u(a) || !/^[a-zA-Z0-9\-]{1,128}/.test(a)) return f = m(c.Error.INVALID_IDENTIFIER, {
                        description: "The collection name has an invalid format.",
                        debug: 'The collection name must be a string containing only alphanumeric characters and dashes, "' + a + '" given.'
                    }), c.Defer.reject(f);
                    var g = '"' + a + '"',
                        h = "sqlite_master" === a,
                        i = p(b);
                    b = i ? b : [
                        [b, d]
                    ], e = e || !1, null === K.db && (K.db = K.open());
                    var j = c.Defer.deferred(),
                        k = e || !q(K.db.readTransaction);
                    return K.db[k ? "transaction" : "readTransaction"](function(a) {
                        e && !h && a.executeSql("CREATE TABLE IF NOT EXISTS " + g + " (key BLOB PRIMARY KEY NOT NULL, value BLOB NOT NULL)");
                        var c = b.length,
                            d = [];
                        b.forEach(function(b) {
                            var e = b[0].replace("#{collection}", g);
                            a.executeSql(e, b[1], function(a, b) {
                                var e = {
                                    rowCount: b.rowsAffected,
                                    result: []
                                };
                                if (b.rows.length)
                                    for (var f = 0; f < b.rows.length; f += 1) {
                                        var g = b.rows.item(f).value,
                                            k = h ? g : JSON.parse(g);
                                        e.result.push(k)
                                    }
                                d.push(e), c -= 1, 0 === c && j.resolve(i ? d : d.shift())
                            })
                        })
                    }, function(b) {
                        b = u(b) ? b : b.message, f = -1 !== b.indexOf("no such table") ? m(c.Error.COLLECTION_NOT_FOUND, {
                            description: "This collection not found for this app backend",
                            debug: {
                                collection: a
                            }
                        }) : m(c.Error.DATABASE_ERROR, {
                            debug: b
                        }), j.reject(f)
                    }), j.promise
                },
                objectID: function(a) {
                    a = a || 24;
                    for (var b = "abcdef0123456789", c = "", d = 0, e = b.length; a > d; d += 1) {
                        var f = Math.floor(Math.random() * e);
                        c += b.substring(f, f + 1)
                    }
                    return c
                },
                batch: function(a, b, d) {
                    if (0 === b.length) return c.Defer.resolve(b);
                    var e = [];
                    b = b.map(function(a) {
                        return a._id = a._id || K.objectID(), e.push(["REPLACE INTO #{collection} (key, value) VALUES (?, ?)", [a._id, JSON.stringify(a)]]), a
                    });
                    var f = K.transaction(a, e, null, !0, d);
                    return f.then(function() {
                        return b
                    })
                },
                clean: function(a, b, c) {
                    return null != b && b.sort(null).limit(null).skip(0), K.find(a, b, c).then(function(b) {
                        if (0 === b.length) return {
                            count: 0,
                            documents: []
                        };
                        var d = [],
                            e = b.map(function(a) {
                                return d.push("?"), a._id
                            }),
                            f = "DELETE FROM #{collection} WHERE key IN(" + d.join(",") + ")",
                            g = K.transaction(a, f, e, !0, c);
                        return g.then(function(a) {
                            return a.rowCount = null != a.rowCount ? a.rowCount : b.length, {
                                count: a.rowCount,
                                documents: b
                            }
                        })
                    })
                },
                count: function(a, b, c) {
                    return null != b && b.sort(null).limit(null).skip(0), K.find(a, b, c).then(function(a) {
                        return {
                            count: a.length
                        }
                    })
                },
                destroy: function(a, b, d) {
                    var e = K.transaction(a, [
                        ["SELECT value FROM #{collection} WHERE key = ?", [b]],
                        ["DELETE       FROM #{collection} WHERE key = ?", [b]]
                    ], null, !0, d);
                    return e.then(function(d) {
                        var e = d[1].rowCount,
                            f = d[0].result;
                        if (e = null != e ? e : d[0].result.length, 0 === e) {
                            var g = m(c.Error.ENTITY_NOT_FOUND, {
                                description: "This entity not found in the collection",
                                debug: {
                                    collection: a,
                                    id: b
                                }
                            });
                            return c.Defer.reject(g)
                        }
                        return {
                            count: e,
                            documents: f
                        }
                    })
                },
                destruct: function(a) {
                    var b = "SELECT name AS value FROM #{collection} WHERE type = ?",
                        c = ["table"],
                        d = K.transaction("sqlite_master", b, c, !1, a);
                    return d.then(function(b) {
                        var c = b.result;
                        if (0 === c.length) return null;
                        var d = c.filter(function(a) {
                            return /^[a-zA-Z0-9\-]{1,128}/.test(a)
                        }).map(function(a) {
                            return ["DROP TABLE IF EXISTS '" + a + "'"]
                        });
                        return K.transaction("sqlite_master", d, null, !0, a)
                    }).then(function() {
                        return null
                    })
                },
                find: function(b, d, e) {
                    var f = "SELECT value FROM #{collection}",
                        g = K.transaction(b, f, [], !1, e);
                    return g.then(function(b) {
                        return b = b.result, null == d ? b : (b = a.sift(d.toJSON().filter, b), d._postProcess(b))
                    }, function(a) {
                        return c.Error.COLLECTION_NOT_FOUND === a.name ? [] : c.Defer.reject(a)
                    })
                },
                findAndModify: function(a, b, d, e) {
                    var f = K.get(a, b, e).then(null, function(a) {
                        return c.Error.ENTITY_NOT_FOUND === a.name ? null : c.Defer.reject(a)
                    });
                    return f.then(function(b) {
                        var c = d(b);
                        return K.save(a, c, e)
                    })
                },
                get: function(a, b, d) {
                    var e = "SELECT value FROM #{collection} WHERE key = ?",
                        f = K.transaction(a, e, [b], !1, d);
                    return f.then(function(d) {
                        var e = d.result;
                        if (0 === e.length) {
                            var f = m(c.Error.ENTITY_NOT_FOUND, {
                                description: "This entity not found in the collection",
                                debug: {
                                    collection: a,
                                    id: b
                                }
                            });
                            return c.Defer.reject(f)
                        }
                        return e[0]
                    }, function(d) {
                        return c.Error.COLLECTION_NOT_FOUND === d.name && (d = m(c.Error.ENTITY_NOT_FOUND, {
                            description: "This entity not found in the collection",
                            debug: {
                                collection: a,
                                id: b
                            }
                        })), c.Defer.reject(d)
                    })
                },
                group: function(a, b, d) {
                    var e = b.reduce.replace(/function[\s\S]*?\([\s\S]*?\)/, "");
                    b.reduce = new Function(["doc", "out"], e);
                    var f = new c.Query({
                        filter: b.condition
                    });
                    return K.find(a, f, d).then(function(a) {
                        var c = {};
                        a.forEach(function(a) {
                            var d = {};
                            for (var e in b.key) b.key.hasOwnProperty(e) && (d[e] = a[e]);
                            var f = JSON.stringify(d);
                            if (null == c[f]) {
                                c[f] = d;
                                for (var g in b.initial) b.initial.hasOwnProperty(g) && (c[f][g] = b.initial[g])
                            }
                            b.reduce(a, c[f])
                        });
                        var d = [];
                        for (var e in c) c.hasOwnProperty(e) && d.push(c[e]);
                        return d
                    })
                },
                save: function(a, b, c) {
                    b._id = b._id || K.objectID();
                    var d = "REPLACE INTO #{collection} (key, value) VALUES (?, ?)",
                        e = [b._id, JSON.stringify(b)],
                        f = K.transaction(a, d, e, !0, c);
                    return f.then(function() {
                        return b
                    })
                },
                update: function(a, b, c) {
                    return K.save(a, b, c)
                }
            };
            "undefined" != typeof a.openDatabase && "undefined" != typeof a.sift && (H.use(K), ["near", "regex", "within"].forEach(function(b) {
                a.sift.useOperator(b, function() {
                    throw new c.Error(b + " query operator is not supported locally.")
                })
            }));
            var L = {
                db: null,
                dbName: function() {
                    if (null == c.appKey) throw new c.Error("Kinvey.appKey must not be null.");
                    return "Kinvey." + c.appKey
                },
                impl: a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.oIndexedDB || a.msIndexedDB,
                inTransaction: !1,
                objectID: function(a) {
                    a = a || 24;
                    for (var b = "abcdef0123456789", c = "", d = 0, e = b.length; a > d; d += 1) {
                        var f = Math.floor(Math.random() * e);
                        c += b.substring(f, f + 1)
                    }
                    return c
                },
                pending: [],
                transaction: function(a, b, d, e, f) {
                    if (!u(a) || !/^[a-zA-Z0-9\-]{1,128}/.test(a)) return e(m(c.Error.INVALID_IDENTIFIER, {
                        description: "The collection name has an invalid format.",
                        debug: 'The collection name must be a string containing only alphanumeric characters and dashes, "' + a + '" given.'
                    }));
                    if (b = b || !1, null !== L.db) {
                        if (L.db.objectStoreNames.contains(a)) {
                            var g = b ? "readwrite" : "readonly",
                                h = L.db.transaction([a], g),
                                i = h.objectStore(a);
                            return d(i)
                        }
                        if (!b) return e(m(c.Error.COLLECTION_NOT_FOUND, {
                            description: "This collection not found for this app backend",
                            debug: {
                                collection: a
                            }
                        }))
                    }
                    if (!0 !== f && L.inTransaction) return L.pending.push(function() {
                        L.transaction(a, b, d, e)
                    });
                    L.inTransaction = !0;
                    var j;
                    if (null !== L.db) {
                        var k = L.db.version + 1;
                        L.db.close(), j = L.impl.open(L.dbName(), k)
                    } else {
                        if (null == c.appKey) return L.inTransaction = !1, e(m(c.Error.MISSING_APP_CREDENTIALS));
                        j = L.impl.open(L.dbName())
                    }
                    j.onupgradeneeded = function() {
                        L.db = j.result, b && L.db.createObjectStore(a, {
                            keyPath: "_id"
                        })
                    }, j.onsuccess = function() {
                        L.db = j.result, L.db.onversionchange = function() {
                            null !== L.db && (L.db.close(), L.db = null)
                        };
                        var c = function(a) {
                            return function(b) {
                                var c = a(b);
                                if (L.inTransaction = !1, 0 !== L.pending.length) {
                                    var d = L.pending;
                                    L.pending = [], d.forEach(function(a) {
                                        a()
                                    })
                                }
                                return c
                            }
                        };
                        L.transaction(a, b, c(d), c(e), !0)
                    }, j.onerror = function(a) {
                        e(m(c.Error.DATABASE_ERROR, {
                            debug: a
                        }))
                    }
                },
                batch: function(a, b) {
                    if (0 === b.length) return c.Defer.resolve(b);
                    var d = c.Defer.deferred();
                    return L.transaction(a, !0, function(a) {
                        var e = a.transaction;
                        b.forEach(function(b) {
                            b._id = b._id || L.objectID(), a.put(b)
                        }), e.oncomplete = function() {
                            d.resolve(b)
                        }, e.onerror = function(a) {
                            var b = m(c.Error.DATABASE_ERROR, {
                                debug: a
                            });
                            d.reject(b)
                        }
                    }, function(a) {
                        d.reject(a)
                    }), d.promise
                },
                clean: function(a, b, d) {
                    return null != b && b.sort(null).limit(null).skip(0), L.find(a, b, d).then(function(b) {
                        if (0 === b.length) return {
                            count: 0,
                            documents: []
                        };
                        var d = c.Defer.deferred();
                        return L.transaction(a, !0, function(a) {
                            var e = a.transaction;
                            b.forEach(function(b) {
                                a["delete"](b._id)
                            }), e.oncomplete = function() {
                                d.resolve({
                                    count: b.length,
                                    documents: b
                                })
                            }, e.onerror = function(a) {
                                var b = m(c.Error.DATABASE_ERROR, {
                                    debug: a
                                });
                                d.reject(b)
                            }
                        }), d.promise
                    })
                },
                count: function(a, b, c) {
                    return null != b && b.sort(null).limit(null).skip(0), L.find(a, b, c).then(function(a) {
                        return {
                            count: a.length
                        }
                    })
                },
                destroy: function(a, b) {
                    var d = c.Defer.deferred();
                    return L.transaction(a, !0, function(e) {
                        var f = e.transaction,
                            g = e.get(b);
                        e["delete"](b), f.oncomplete = function() {
                            return null == g.result ? d.reject(m(c.Error.ENTITY_NOT_FOUND, {
                                description: "This entity not found in the collection",
                                debug: {
                                    collection: a,
                                    id: b
                                }
                            })) : void d.resolve({
                                count: 1,
                                documents: [g.result]
                            })
                        }, f.onerror = function(a) {
                            var b = m(c.Error.DATABASE_ERROR, {
                                debug: a
                            });
                            d.reject(b)
                        }
                    }, function(a) {
                        d.reject(a)
                    }), d.promise
                },
                destruct: function() {
                    if (null == c.appKey) {
                        var a = m(c.Error.MISSING_APP_CREDENTIALS);
                        return c.Defer.reject(a)
                    }
                    var b = c.Defer.deferred();
                    null !== L.db && (L.db.close(), L.db = null);
                    var d = L.impl.deleteDatabase(L.dbName());
                    return d.onsuccess = function() {
                        b.resolve(null)
                    }, d.onerror = function(a) {
                        var d = m(c.Error.DATABASE_ERROR, {
                            debug: a
                        });
                        b.reject(d)
                    }, b.promise
                },
                find: function(b, d) {
                    var e = c.Defer.deferred();
                    return L.transaction(b, !1, function(a) {
                        var b = a.openCursor(),
                            d = [];
                        b.onsuccess = function() {
                            var a = b.result;
                            null != a ? (d.push(a.value), a["continue"]()) : e.resolve(d)
                        }, b.onerror = function(a) {
                            e.reject(m(c.DATABASE_ERROR, {
                                debug: a
                            }))
                        }
                    }, function(a) {
                        return c.Error.COLLECTION_NOT_FOUND === a.name ? e.resolve([]) : e.reject(a)
                    }), e.promise.then(function(b) {
                        return null == d ? b : (b = a.sift(d.toJSON().filter, b), d._postProcess(b))
                    })
                },
                findAndModify: function(a, b, d) {
                    var e = c.Defer.deferred();
                    return L.transaction(a, !0, function(a) {
                        var f = null,
                            g = a.get(b);
                        g.onsuccess = function() {
                            f = d(g.result || null), a.put(f)
                        };
                        var h = a.transaction;
                        h.oncomplete = function() {
                            e.resolve(f)
                        }, h.onerror = function(a) {
                            var b = m(c.Error.DATABASE_ERROR, {
                                debug: a
                            });
                            e.reject(b)
                        }
                    }, function(a) {
                        e.reject(a)
                    }), e.promise
                },
                get: function(a, b) {
                    var d = c.Defer.deferred();
                    return L.transaction(a, !1, function(e) {
                        var f = e.get(b);
                        f.onsuccess = function() {
                            return null != f.result ? d.resolve(f.result) : void d.reject(m(c.Error.ENTITY_NOT_FOUND, {
                                description: "This entity not found in the collection",
                                debug: {
                                    collection: a,
                                    id: b
                                }
                            }))
                        }, f.onerror = function(a) {
                            d.reject(m(c.Error.DATABASE_ERROR, {
                                debug: a
                            }))
                        }
                    }, function(e) {
                        c.Error.COLLECTION_NOT_FOUND === e.name && (e = m(c.Error.ENTITY_NOT_FOUND, {
                            description: "This entity not found in the collection",
                            debug: {
                                collection: a,
                                id: b
                            }
                        })), d.reject(e)
                    }), d.promise
                },
                group: function(a, b, d) {
                    var e = b.reduce.replace(/function[\s\S]*?\([\s\S]*?\)/, "");
                    b.reduce = new Function(["doc", "out"], e);
                    var f = new c.Query({
                        filter: b.condition
                    });
                    return L.find(a, f, d).then(function(a) {
                        var c = {};
                        a.forEach(function(a) {
                            var d = {};
                            for (var e in b.key) b.key.hasOwnProperty(e) && (d[e] = a[e]);
                            var f = JSON.stringify(d);
                            if (null == c[f]) {
                                c[f] = d;
                                for (var g in b.initial) b.initial.hasOwnProperty(g) && (c[f][g] = b.initial[g])
                            }
                            b.reduce(a, c[f])
                        });
                        var d = [];
                        for (var e in c) c.hasOwnProperty(e) && d.push(c[e]);
                        return d
                    })
                },
                save: function(a, b) {
                    b._id = b._id || L.objectID();
                    var d = c.Defer.deferred();
                    return L.transaction(a, !0, function(a) {
                        var e = a.put(b);
                        e.onsuccess = function() {
                            d.resolve(b)
                        }, e.onerror = function(a) {
                            var b = m(c.Error.DATABASE_ERROR, {
                                debug: a
                            });
                            d.reject(b)
                        }
                    }, function(a) {
                        d.reject(a)
                    }), d.promise
                },
                update: function(a, b, c) {
                    return L.save(a, b, c)
                }
            };
            "undefined" != typeof L.impl && "undefined" != typeof a.sift && (H.use(L), ["near", "regex", "within"].forEach(function(b) {
                a.sift.useOperator(b, function() {
                    throw new c.Error(b + " query operator is not supported locally.")
                })
            }));
            var M = {
                facebook: function(a) {
                    return M.oAuth2("facebook", a)
                },
                google: function(a) {
                    return M.oAuth2("google", a)
                },
                linkedIn: function(a) {
                    return M.oAuth1("linkedIn", a)
                },
                twitter: function(a) {
                    return M.oAuth1("twitter", a)
                },
                oAuth1: function(a, b) {
                    return M.requestToken(a, b).then(function(a) {
                        if (a.error || a.denied) {
                            var b = m(c.Error.SOCIAL_ERROR, {
                                debug: a
                            });
                            return c.Defer.reject(b)
                        }
                        return {
                            oauth_token: a.oauth_token,
                            oauth_token_secret: a.oauth_token_secret,
                            oauth_verifier: a.oauth_verifier
                        }
                    }).then(function(d) {
                        return c.Persistence.Net.create({
                            namespace: g,
                            data: d,
                            flags: {
                                provider: a,
                                step: "verifyToken"
                            },
                            auth: z.App
                        }, b)
                    }).then(function(c) {
                        return b._provider = a, c
                    })
                },
                oAuth2: function(a, b) {
                    return b.state = Math.random().toString(36).substr(2), M.requestToken(a, b).then(function(a) {
                        var d;
                        return a.state !== b.state ? (d = m(c.Error.SOCIAL_ERROR, {
                            debug: "The state parameters did not match (CSRF attack?)."
                        }), c.Defer.reject(d)) : a.error ? (d = m(c.Error.SOCIAL_ERROR, {
                            debug: a
                        }), c.Defer.reject(d)) : {
                            access_token: a.access_token,
                            expires_in: a.expires_in
                        }
                    })
                },
                requestToken: function(b, d) {
                    var e = "about:blank",
                        f = a.open(e, "KinveyOAuth2"),
                        h = d.redirect || a.location.toString();
                    return c.Persistence.Net.create({
                        namespace: g,
                        data: {
                            redirect: h,
                            state: d.state
                        },
                        flags: {
                            provider: b,
                            step: "requestToken"
                        },
                        auth: z.App
                    }, d).then(function(b) {
                        var g = c.Defer.deferred();
                        null != f && (f.location = b.url);
                        var h = 0,
                            i = 100,
                            j = a.setInterval(function() {
                                var k;
                                if (null == f) a.clearTimeout(j), k = m(c.Error.SOCIAL_ERROR, {
                                    debug: "The popup was blocked."
                                }), g.reject(k);
                                else if (f.closed) a.clearTimeout(j), k = m(c.Error.SOCIAL_ERROR, {
                                    debug: "The popup was closed unexpectedly."
                                }), g.reject(k);
                                else if (d.timeout && h > d.timeout) a.clearTimeout(j), f.close(), k = m(c.Error.SOCIAL_ERROR, {
                                    debug: "The authorization request timed out."
                                }), g.reject(k);
                                else {
                                    var l = !1;
                                    try {
                                        l = e !== f.location.toString()
                                    } catch (n) {}
                                    if (l) {
                                        a.clearTimeout(j);
                                        var o = f.location,
                                            p = o.search.substring(1) + "&" + o.hash.substring(1),
                                            q = M.tokenize(p);
                                        null != b.oauth_token_secret && (q.oauth_token_secret = b.oauth_token_secret), g.resolve(q), f.close()
                                    }
                                }
                                h += i
                            }, i);
                        return g.promise
                    })
                },
                tokenize: function(b) {
                    var c = {};
                    return b.split("&").forEach(function(b) {
                        var d = b.split("=", 2).map(a.decodeURIComponent);
                        d[0] && (c[d[0]] = d[1])
                    }), c
                }
            };
            D.use(M);
            var N = angular.injector(["ng"]).get("$q");
            c.Defer.use({
                deferred: N.defer
            });
            var O = angular.module("kinvey", []);
            if (O.factory("$kinvey", ["$http", "$q",
                function(b, d) {
                    c.Defer.use({
                        deferred: d.defer
                    });
                    var e = {
                        base64: function(b) {
                            return a.btoa(b)
                        },
                        supportsBlob: function() {
                            try {
                                return new a.Blob && !0
                            } catch (b) {
                                return !1
                            }
                        }(),
                        encode: a.encodeURIComponent,
                        request: function(f, g, h, i, j) {
                            if (h = h || {}, i = i || {}, j = j || {}, 0 === g.indexOf(c.API_ENDPOINT) && "GET" === f) {
                                var k = a.location;
                                null != k && null != k.protocol && (i["X-Kinvey-Origin"] = k.protocol + "//" + k.host)
                            }
                            return s(h) && !(null != a.ArrayBuffer && h instanceof a.ArrayBuffer || null != a.Blob && h instanceof a.Blob) && (h = JSON.stringify(h)), b({
                                data: h,
                                headers: i,
                                method: f,
                                timeout: j.timeout,
                                url: g
                            }).then(function(b) {
                                if (b = b.data, j.file && null != b && null != a.ArrayBuffer) {
                                    for (var c = new a.ArrayBuffer(b.length), d = new a.Uint8Array(c), f = 0, g = b.length; g > f; f += 1) d[f] = b.charCodeAt(f);
                                    e.supportsBlob && (c = new a.Blob([d], {
                                        type: j.file
                                    })), b = c
                                }
                                return b || null
                            }, function(a) {
                                return d.reject(a.data || null)
                            })
                        }
                    };
                    return c.Persistence.Net.use(e), c
                }
            ]), "undefined" != typeof localStorage) {
                var P = c.Defer.resolve(null),
                    Q = {
                        _destroy: function(a) {
                            return P = P.then(function() {
                                return localStorage.removeItem(a), c.Defer.resolve(null)
                            })
                        },
                        _get: function(a) {
                            return P = P.then(function() {
                                var b = localStorage.getItem(a);
                                return c.Defer.resolve(b ? JSON.parse(b) : null)
                            })
                        },
                        _save: function(a, b) {
                            return P = P.then(function() {
                                return localStorage.setItem(a, JSON.stringify(b)), c.Defer.resolve(null)
                            })
                        }
                    };
                y.use(Q)
            }
            return c
        }, c = b();
    "object" == typeof module && "object" == typeof module.exports ? module.exports = c : "function" == typeof define && define.amd ? define("kinvey", [], function() {
        return c
    }) : a.Kinvey = c
}).call(this);