// dropbox-datastores-0.1.0-b2.js
! function() {
    var t, e, r, n, i, o, s, a, u, l, h, c, p, d, f, _, y, g, m, v, w, b, S, D, A, O, E, x, U, P, C, T, k, R, I, L, N, j, F, B, M, X, z, H, q, W, V, J, K, G, $, Z, Q, Y, te, ee, re, ne, ie, oe, se, ae, ue, le, he, ce, pe, de, fe, _e, ye, ge, me, ve, we, be, Se, De, Ae, Oe, Ee, xe, Ue, Pe, Ce, Te, ke, Re, Ie, Le, Ne, je, Fe, Be, Me, Xe, ze, He, qe, We, Ve, Je, Ke, Ge, $e, Ze, Qe, Ye, tr, er, rr, nr = [].indexOf || function(t) {
            for (var e = 0, r = this.length; r > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        }, ir = {}.hasOwnProperty,
        or = function(t, e) {
            function r() {
                this.constructor = t
            }
            for (var n in e) ir.call(e, n) && (t[n] = e[n]);
            return r.prototype = e.prototype, t.prototype = new r, t.__super__ = e.prototype, t
        }, sr = [].slice;
    p = function() {
        return null
    }, p.Util = {}, p.Http = {}, p.File = {}, p.Util.EventSource = function() {
        function t(t) {
            this._cancelable = t && t.cancelable, this._listeners = []
        }
        return t.prototype.addListener = function(t) {
            if ("function" != typeof t) throw new TypeError("Invalid listener type; expected function");
            return nr.call(this._listeners, t) < 0 && this._listeners.push(t), this
        }, t.prototype.removeListener = function(t) {
            var e, r, n, i, o, s;
            if (this._listeners.indexOf) r = this._listeners.indexOf(t), -1 !== r && this._listeners.splice(r, 1);
            else
                for (s = this._listeners, e = i = 0, o = s.length; o > i; e = ++i)
                    if (n = s[e], n === t) {
                        this._listeners.splice(e, 1);
                        break
                    } return this
        }, t.prototype.dispatch = function(t) {
            var e, r, n, i, o;
            for (o = this._listeners, n = 0, i = o.length; i > n; n++)
                if (e = o[n], r = e(t), this._cancelable && r === !1) return !1;
            return !0
        }, t
    }(), p.Util.TypedEventSource = function() {
        function t(t) {
            this.options = t, this._sources = {}
        }
        return t.prototype._getSource = function(t) {
            return this._sources[t] || (this._sources[t] = new p.Util.EventSource(this.options))
        }, t.prototype.addListener = function(t, e) {
            return this._getSource(t).addListener(e), this
        }, t.prototype.removeListener = function(t, e) {
            return this._getSource(t).removeListener(e), this
        }, t.prototype.dispatch = function(t, e) {
            return this._getSource(t).dispatch(e)
        }, t
    }(), p.AccountInfo = function() {
        function t(t) {
            var e;
            this._json = t, this.name = t.display_name, this.email = t.email, this.countryCode = t.country || null, this.uid = t.uid.toString(), t.public_app_url ? (this.publicAppUrl = t.public_app_url, e = this.publicAppUrl.length - 1, e >= 0 && "/" === this.publicAppUrl.substring(e) && (this.publicAppUrl = this.publicAppUrl.substring(0, e))) : this.publicAppUrl = null, this.referralUrl = t.referral_link, this.quota = t.quota_info.quota, this.privateBytes = t.quota_info.normal || 0, this.sharedBytes = t.quota_info.shared || 0, this.usedQuota = this.privateBytes + this.sharedBytes
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new p.AccountInfo(t) : t
        }, t.prototype.name = null, t.prototype.email = null, t.prototype.countryCode = null, t.prototype.uid = null, t.prototype.referralUrl = null, t.prototype.publicAppUrl = null, t.prototype.quota = null, t.prototype.usedQuota = null, t.prototype.privateBytes = null, t.prototype.sharedBytes = null, t.prototype.json = function() {
            return this._json
        }, t
    }(), p.ApiError = function() {
        function t(t, e, r) {
            var n, i;
            if (this.method = e, this.url = r, this.status = t.status, t.responseType) try {
                n = t.response || t.responseText
            } catch (o) {
                i = o;
                try {
                    n = t.responseText
                } catch (o) {
                    i = o, n = null
                }
            } else try {
                n = t.responseText
            } catch (o) {
                i = o, n = null
            }
            if (n) try {
                this.responseText = n.toString(), this.response = JSON.parse(n)
            } catch (o) {
                i = o, this.response = null
            } else this.responseText = "(no response)", this.response = null
        }
        return t.prototype.status = null, t.prototype.method = null, t.prototype.url = null, t.prototype.responseText = null, t.prototype.response = null, t.NETWORK_ERROR = 0, t.NO_CONTENT = 304, t.INVALID_PARAM = 400, t.INVALID_TOKEN = 401, t.OAUTH_ERROR = 403, t.NOT_FOUND = 404, t.INVALID_METHOD = 405, t.NOT_ACCEPTABLE = 406, t.CONFLICT = 409, t.RATE_LIMITED = 503, t.OVER_QUOTA = 507, t.prototype.toString = function() {
            return "Dropbox API error " + this.status + " from " + this.method + " " + this.url + " :: " + this.responseText
        }, t.prototype.inspect = function() {
            return this.toString()
        }, t
    }(), p.AuthDriver = function() {
        function t() {}
        return t.prototype.authType = function() {
            return "code"
        }, t.prototype.url = function() {
            return "https://some.url"
        }, t.prototype.doAuthorize = function(t, e, r, n) {
            return n({
                code: "access-code"
            })
        }, t.prototype.getStateParam = function(t, e) {
            return e(p.Util.Oauth.randomAuthStateParam())
        }, t.prototype.resumeAuthorize = function(t, e, r) {
            return r({
                code: "access-code"
            })
        }, t.prototype.onAuthStateChange = function(t, e) {
            return e()
        }, t.oauthQueryParams = ["access_token", "expires_in", "scope", "token_type", "code", "error", "error_description", "error_uri", "mac_key", "mac_algorithm"].sort(), t
    }(), p.AuthDriver.autoConfigure = function(t) {
        if ("undefined" != typeof chrome && (chrome.extension || chrome.app && chrome.app.runtime)) return t.authDriver(new p.AuthDriver.Chrome), void 0;
        if ("undefined" != typeof window) {
            if (window.cordova) return t.authDriver(new p.AuthDriver.Cordova), void 0;
            window && window.navigator && t.authDriver(new p.AuthDriver.Redirect)
        }
    }, p.AuthDriver.BrowserBase = function() {
        function t(t) {
            t ? (this.rememberUser = "rememberUser" in t ? t.rememberUser : !0, this.scope = t.scope || "default") : (this.rememberUser = !0, this.scope = "default"), this.storageKey = null, this.stateRe = /^[^#]+\#(.*&)?state=([^&]+)(&|$)/
        }
        return t.prototype.authType = function() {
            return "token"
        }, t.prototype.onAuthStepChange = function(t, e) {
            var r = this;
            switch (this.setStorageKey(t), t.authStep) {
                case p.Client.RESET:
                    return this.loadCredentials(function(n) {
                        return n ? (t.setCredentials(n), t.authStep !== p.Client.DONE ? e() : r.rememberUser ? (t.setCredentials(n), t.getAccountInfo(function(n) {
                            return n && n.status === p.ApiError.INVALID_TOKEN ? (t.reset(), r.forgetCredentials(e)) : e()
                        })) : r.forgetCredentials(e)) : e()
                    });
                case p.Client.DONE:
                    return this.rememberUser ? this.storeCredentials(t.credentials(), e) : this.forgetCredentials(e);
                case p.Client.SIGNED_OUT:
                    return this.forgetCredentials(e);
                case p.Client.ERROR:
                    return this.forgetCredentials(e);
                default:
                    return e(), this
            }
        }, t.prototype.setStorageKey = function(t) {
            return this.storageKey = "dropbox-auth:" + this.scope + ":" + t.appHash(), this
        }, t.prototype.storeCredentials = function(t, e) {
            return localStorage.setItem(this.storageKey, JSON.stringify(t)), e(), this
        }, t.prototype.loadCredentials = function(t) {
            var e, r;
            if (r = localStorage.getItem(this.storageKey), !r) return t(null), this;
            try {
                t(JSON.parse(r))
            } catch (n) {
                e = n, t(null)
            }
            return this
        }, t.prototype.forgetCredentials = function(t) {
            return localStorage.removeItem(this.storageKey), t(), this
        }, t.prototype.locationStateParam = function(t) {
            var e, r;
            return e = t || p.AuthDriver.BrowserBase.currentLocation(), r = this.stateRe.exec(e), r ? decodeURIComponent(r[2]) : null
        }, t.currentLocation = function() {
            return window.location.href
        }, t.cleanupLocation = function() {
            var t, e;
            window.history ? (e = this.currentLocation(), t = e.indexOf("#"), window.history.replaceState({}, document.title, e.substring(0, t))) : window.location.hash = ""
        }, t
    }(), p.AuthDriver.Redirect = function(t) {
        function e(t) {
            e.__super__.constructor.call(this, t), this.receiverUrl = this.baseUrl(t)
        }
        return or(e, t), e.prototype.baseUrl = function(t) {
            var e, r, n;
            if (n = p.AuthDriver.BrowserBase.currentLocation(), t) {
                if (t.redirectUrl) return t.redirectUrl;
                if (t && t.redirectFile) return e = p.AuthDriver.BrowserBase.currentLocation().split("/"), e[e.length - 1] = t.redirectFile, e.join("/")
            }
            return r = n.indexOf("#"), -1 !== r && (n = n.substring(0, r)), n
        }, e.prototype.url = function() {
            return this.receiverUrl
        }, e.prototype.doAuthorize = function(t, e, r) {
            return this.storeCredentials(r.credentials(), function() {
                return window.location.assign(t)
            })
        }, e.prototype.resumeAuthorize = function(t, e, r) {
            var n;
            return this.locationStateParam() === t ? (n = p.AuthDriver.BrowserBase.currentLocation(), p.AuthDriver.BrowserBase.cleanupLocation(), r(p.Util.Oauth.queryParamsFromUrl(n))) : this.forgetCredentials(function() {
                return r({
                    error: "Authorization error"
                })
            })
        }, e
    }(p.AuthDriver.BrowserBase), p.AuthDriver.Popup = function(t) {
        function e(t) {
            e.__super__.constructor.call(this, t), this.receiverUrl = this.baseUrl(t)
        }
        return or(e, t), e.prototype.url = function() {
            return this.receiverUrl
        }, e.prototype.doAuthorize = function(t, e, r, n) {
            return this.listenForMessage(e, n), this.openWindow(t)
        }, e.prototype.baseUrl = function(t) {
            var e;
            if (t) {
                if (t.receiverUrl) return t.receiverUrl;
                if (t.receiverFile) return e = p.AuthDriver.BrowserBase.currentLocation().split("/"), e[e.length - 1] = t.receiverFile, e.join("/")
            }
            return p.AuthDriver.BrowserBase.currentLocation()
       j
            return window.open(t, "_dropboxOauthSigninWindow", this.popupWindowSpec(980, 700))
        }, e.prototype.popupWindowSpec = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c;
            return s = null != (u = window.screenX) ? u : window.screenLeft, a = null != (l = window.screenY) ? l : window.screenTop, o = null != (h = window.outerWidth) ? h : document.documentElement.clientWidth, r = null != (c = window.outerHeight) ? c : document.documentElement.clientHeight, n = Math.round(s + (o - t) / 2), i = Math.round(a + (r - e) / 2.5), s > n && (n = s), a > i && (i = a), "width=" + t + ",height=" + e + "," + ("left=" + n + ",top=" + i) + "dialog=yes,dependent=yes,scrollbars=yes,location=yes"
        }, e.prototype.listenForMessage = function(t, e) {
            var r, n = this;
            return r = function(i) {
                var o;
                return o = i.data ? i.data : i, n.locationStateParam(o) === t ? (t = !1, window.removeEventListener("message", r), p.AuthDriver.Popup.onMessage.removeListener(r), e(p.Util.Oauth.queryParamsFromUrl(o))) : void 0
            }, window.addEventListener("message", r, !1), p.AuthDriver.Popup.onMessage.addListener(r)
        }, e.locationOrigin = function(t) {
            var e;
            return (e = /^(file:\/\/[^\?\#]*)(\?|\#|$)/.exec(t)) ? e[1] : (e = /^([^\:]+\:\/\/[^\/\?\#]*)(\/|\?|\#|$)/.exec(t), e ? e[1] : t)
        }, e.oauthReceiver = function() {
            window.addEventListener("load", function() {
                var t, e, r, n, i;
                if (i = window.location.href, p.AuthDriver.BrowserBase.cleanupLocation(), r = window.opener, window.parent !== window.top && (r || (r = window.parent)), r) {
                    try {
                        n = window.location.origin || locationOrigin(i), r.postMessage(i, n)
                    } catch (o) {
                        e = o
                    }
                    try {
                        r.Dropbox.AuthDriver.Popup.onMessage.dispatch(i)
                    } catch (o) {
                        t = o
                    }
                }
                return window.close()
            })
        }, e.onMessage = new p.Util.EventSource, e
    }(p.AuthDriver.BrowserBase), d = null, f = null, "undefined" != typeof chrome && null !== chrome && (chrome.runtime && (chrome.runtime.onMessage && (d = chrome.runtime.onMessage), chrome.runtime.sendMessage && (f = function(t) {
        return chrome.runtime.sendMessage(t)
    })), chrome.extension && (chrome.extension.onMessage && (d || (d = chrome.extension.onMessage)), chrome.extension.sendMessage && (f || (f = function(t) {
        return chrome.extension.sendMessage(t)
    }))), d || function() {
        var t, e;
        return e = function(t) {
            return t.Dropbox ? (p.AuthDriver.Chrome.prototype.onMessage = t.Dropbox.AuthDriver.Chrome.onMessage, p.AuthDriver.Chrome.prototype.sendMessage = t.Dropbox.AuthDriver.Chrome.sendMessage) : (t.Dropbox = p, p.AuthDriver.Chrome.prototype.onMessage = new p.Util.EventSource, p.AuthDriver.Chrome.prototype.sendMessage = function(t) {
                return p.AuthDriver.Chrome.prototype.onMessage.dispatch(t)
            })
        }, chrome.extension && chrome.extension.getBackgroundPage && (t = chrome.extension.getBackgroundPage()) ? e(t) : chrome.runtime && chrome.runtime.getBackgroundPage ? chrome.runtime.getBackgroundPage(function(t) {
            return e(t)
        }) : void 0
    }()), p.AuthDriver.Chrome = function(t) {
        function e(t) {
            var r;
            e.__super__.constructor.call(this, t), r = t && t.receiverPath || "chrome_oauth_receiver.html", this.useQuery = !0, this.receiverUrl = this.expandUrl(r), this.storageKey = "dropbox_js_" + this.scope + "_credentials"
        }
        return or(e, t), e.prototype.onMessage = d, e.prototype.sendMessage = f, e.prototype.expandUrl = function(t) {
            return chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(t) : chrome.extension && chrome.extension.getURL ? chrome.extension.getURL(t) : t
        }, e.prototype.onAuthStepChange = function(t, e) {
            var r = this;
            switch (t.authStep) {
                case p.Client.RESET:
                    return this.loadCredentials(function(n) {
                        if (n) {
                            if (n.authStep) return r.forgetCredentials(e);
                            t.setCredentials(n)
                        }
                        return e()
                    });
                case p.Client.DONE:
                    return this.storeCredentials(t.credentials(), e);
                case p.Client.SIGNED_OUT:
                    return this.forgetCredentials(e);
                case p.Client.ERROR:
                    return this.forgetCredentials(e);
                default:
                    return e()
            }
        }, e.prototype.doAuthorize = function(t, e, r, n) {
            var i, o, s, a, u = this;
            return (null != (o = chrome.identity) ? o.launchWebAuthFlow : void 0) ? chrome.identity.launchWebAuthFlow({
                url: t,
                interactive: !0
            }, function(t) {
                return u.locationStateParam(t) === e ? (e = !1, n(p.Util.Oauth.queryParamsFromUrl(t))) : void 0
            }) : (null != (s = chrome.experimental) ? null != (a = s.identity) ? a.launchWebAuthFlow : void 0 : void 0) ? chrome.experimental.identity.launchWebAuthFlow({
                url: t,
                interactive: !0
            }, function(t) {
                return u.locationStateParam(t) === e ? (e = !1, n(p.Util.Oauth.queryParamsFromUrl(t))) : void 0
            }) : (i = {
                handle: null
            }, this.listenForMessage(e, i, n), this.openWindow(t, function(t) {
                return i.handle = t
            }))
        }, e.prototype.openWindow = function(t, e) {
            return chrome.tabs && chrome.tabs.create ? (chrome.tabs.create({
                url: t,
                active: !0,
                pinned: !1
            }, function(t) {
                return e(t)
            }), this) : this
        }, e.prototype.closeWindow = function(t) {
            return chrome.tabs && chrome.tabs.remove && t.id ? (chrome.tabs.remove(t.id), this) : chrome.app && chrome.app.window && t.close ? (t.close(), this) : this
        }, e.prototype.url = function() {
            return this.receiverUrl
        }, e.prototype.listenForMessage = function(t, e, r) {
            var n, i = this;
            return n = function(o, s) {
                var a;
                if ((!s || !s.tab || s.tab.url.substring(0, i.receiverUrl.length) === i.receiverUrl) && o.dropbox_oauth_receiver_href) return a = o.dropbox_oauth_receiver_href, i.locationStateParam(a) === t ? (t = !1, e.handle && i.closeWindow(e.handle), i.onMessage.removeListener(n), r(p.Util.Oauth.queryParamsFromUrl(a))) : void 0
            }, this.onMessage.addListener(n)
        }, e.prototype.storeCredentials = function(t, e) {
            var r;
            return r = {}, r[this.storageKey] = t, chrome.storage.local.set(r, e), this
        }, e.prototype.loadCredentials = function(t) {
            var e = this;
            return chrome.storage.local.get(this.storageKey, function(r) {
                return t(r[e.storageKey] || null)
            }), this
        }, e.prototype.forgetCredentials = function(t) {
            return chrome.storage.local.remove(this.storageKey, t), this
        }, e.oauthReceiver = function() {
            return window.addEventListener("load", function() {
                var t, e;
                return t = new p.AuthDriver.Chrome, e = window.location.href, window.location.hash = "", t.sendMessage({
                    dropbox_oauth_receiver_href: e
                }), window.close ? window.close() : void 0
            })
        }, e
    }(p.AuthDriver.BrowserBase), p.AuthDriver.Cordova = function(t) {
        function e(t) {
            t ? (this.rememberUser = "rememberUser" in t ? t.rememberUser : !0, this.scope = t.scope || "default") : (this.rememberUser = !0, this.scope = "default"), this.scope = (null != t ? t.scope : void 0) || "default"
        }
        return or(e, t), e.prototype.doAuthorize = function(t, e, r, n) {
            var i, o, s, a;
            return o = window.open(t, "_blank", "location=yes"), a = !1, i = /^[^/]*\/\/[^/]*\//.exec(t)[0], s = function(e) {
                return e.url === t && a === !1 ? (a = !0, void 0) : e.url && e.url.substring(0, i.length) !== i ? (a = !1, void 0) : "exit" === e.type || a ? (o.removeEventListener("loadstop", s), o.removeEventListener("exit", s), "exit" !== e.type && o.close(), n()) : void 0
            }, o.addEventListener("loadstop", s), o.addEventListener("exit", s)
        }, e.prototype.url = function() {
            return null
        }, e
    }(p.AuthDriver.BrowserBase), p.AuthDriver.NodeServer = function() {
        function t(t) {
            this._port = (null != t ? t.port : void 0) || 8912, (null != t ? t.tls : void 0) ? (this._tlsOptions = t.tls, ("string" == typeof this._tlsOptions || this._tlsOptions instanceof Buffer) && (this._tlsOptions = {
                key: this._tlsOptions,
                cert: this._tlsOptions
            })) : this._tlsOptions = null, this._faviconFile = (null != t ? t.favicon : void 0) || null, this._fs = require("fs"), this._http = require("http"), this._https = require("https"), this._open = require("open"), this._callbacks = {}, this._nodeUrl = require("url"), this.createApp()
        }
        return t.prototype.authType = function() {
            return "code"
        }, t.prototype.url = function() {
            return "https://localhost:" + this._port + "/oauth_callback"
        }, t.prototype.doAuthorize = function(t, e, r, n) {
            return this._callbacks[e] = n, this.openBrowser(t)
        }, t.prototype.openBrowser = function(t) {
            if (!t.match(/^https?:\/\//)) throw new Error("Not a http/https URL: " + t);
            return "BROWSER" in process.env ? this._open(t, process.env.BROWSER) : this._open(t)
        }, t.prototype.createApp = function() {
            var t = this;
            return this._app = this._tlsOptions ? this._https.createServer(this._tlsOptions, function(e, r) {
                return t.doRequest(e, r)
            }) : this._http.createServer(function(e, r) {
                return t.doRequest(e, r)
            }), this._app.listen(this._port)
        }, t.prototype.closeServer = function() {
            return this._app.close()
        }, t.prototype.doRequest = function(t, e) {
            var r, n, i, o = this;
            return i = this._nodeUrl.parse(t.url, !0), "/oauth_callback" === i.pathname && (n = i.query.state, this._callbacks[n] && (this._callbacks[n](i.query), delete this._callbacks[n])), r = "", t.on("data", function(t) {
                return r += t
            }), t.on("end", function() {
                return o._faviconFile && "/favicon.ico" === i.pathname ? o.sendFavicon(e) : o.closeBrowser(e)
            })
        }, t.prototype.closeBrowser = function(t) {
            var e;
            return e = '<!doctype html>\n<script type="text/javascript">window.close();</script>\n<p>Please close this window.</p>', t.writeHead(200, {
                "Content-Length": e.length,
                "Content-Type": "text/html"
            }), t.write(e), t.end()
        }, t.prototype.sendFavicon = function(t) {
            return this._fs.readFile(this._faviconFile, function(e, r) {
                return t.writeHead(200, {
                    "Content-Length": r.length,
                    "Content-Type": "image/x-icon"
                }), t.write(r), t.end()
            })
        }, t
    }(), p.AuthError = function() {
        function t(t) {
            var e;
            if (!t.error) throw new Error("Not an OAuth 2.0 error: " + JSON.stringify(t));
            e = "object" == typeof t.error && t.error.error ? t.error : t, this.code = e.error, this.description = e.error_description || null, this.uri = e.error_uri || null
        }
        return t.prototype.code = null, t.prototype.description = null, t.prototype.uri = null, t.ACCESS_DENIED = "access_denied", t.INVALID_REQUEST = "invalid_request", t.UNAUTHORIZED_CLIENT = "unauthorized_client", t.INVALID_GRANT = "invalid_grant", t.INVALID_SCOPE = "invalid_scope", t.UNSUPPORTED_GRANT_TYPE = "unsupported_grant_type", t.UNSUPPORTED_RESPONSE_TYPE = "unsupported_response_type", t.SERVER_ERROR = "server_error", t.TEMPORARILY_UNAVAILABLE = "temporarily_unavailable", t.prototype.toString = function() {
            return "Dropbox OAuth error " + this.code + " :: " + this.description
        }, t.prototype.inspect = function() {
            return this.toString()
        }, t
    }(), p.Client = function() {
        function t(t) {
            var e = this;
            this.apiServer = t.server || this.defaultApiServer(), this.apiServers = t.server ? [t.server] : this.defaultApiServers(), this.authServer = t.authServer || this.defaultAuthServer(), this.fileServer = t.fileServer || this.defaultFileServer(), this.downloadServer = t.downloadServer || this.defaultDownloadServer(), this.onXhr = new p.Util.EventSource({
                cancelable: !0
            }), this.onError = new p.Util.EventSource, this.onAuthStepChange = new p.Util.EventSource, this.xhrOnErrorHandler = function(t, r) {
                return e.handleXhrError(t, r)
            }, this.oauth = new p.Util.Oauth(t), this.uid = t.uid || null, this.authStep = this.oauth.step(), this.driver = null, this.filter = null, this.authError = null, this._credentials = null, this._datastoreManager = null, this.setupUrls()
        }
        return t.prototype.onXhr = null, t.prototype.onError = null, t.prototype.onAuthStepChange = null, t.prototype.authDriver = function(t) {
            return this.driver = t, this
        }, t.prototype.dropboxUid = function() {
            return this.uid
        }, t.prototype.credentials = function() {
            return this._credentials || this.computeCredentials(), this._credentials
        }, t.prototype.authenticate = function(t, e) {
            var r, n, i, o, s, a = this;
            if (e || "function" != typeof t || (e = t, t = null), r = t && "interactive" in t ? t.interactive : !0, !this.driver && this.authStep !== _.DONE && (p.AuthDriver.autoConfigure(this), !this.driver)) throw new Error("OAuth driver auto-configuration failed. Call authDriver.");
            if (this.authStep === _.ERROR) throw new Error("Client got in an error state. Call reset() to reuse it!");
            return o = function() {
                return a.authStep = a.oauth.step(), a.authStep === _.ERROR && (a.authError = a.oauth.error()), a._credentials = null, a.onAuthStepChange.dispatch(a), s()
            }, i = function() {
                return a.authStep = _.ERROR, a._credentials = null, a.onAuthStepChange.dispatch(a), s()
            }, n = null, s = function() {
                var t;
                if (n !== a.authStep && (n = a.authStep, a.driver && a.driver.onAuthStepChange)) return a.driver.onAuthStepChange(a, s), void 0;
                switch (a.authStep) {
                    case _.RESET:
                        return r ? (a.driver.getStateParam && a.driver.getStateParam(function(t) {
                            return a.client.authStep === _.RESET && a.oauth.setAuthStateParam(t), o()
                        }), a.oauth.setAuthStateParam(p.Util.Oauth.randomAuthStateParam()), o()) : (e && e(null, a), void 0);
                    case _.PARAM_SET:
                        return r ? (t = a.authorizeUrl(), a.driver.doAuthorize(t, a.oauth.authStateParam(), a, function(t) {
                            return a.oauth.processRedirectParams(t), t.uid && (a.uid = t.uid), o()
                        })) : (e && e(null, a), void 0);
                    case _.PARAM_LOADED:
                        return a.driver.resumeAuthorize ? a.driver.resumeAuthorize(a.oauth.authStateParam(), a, function(t) {
                            return a.oauth.processRedirectParams(t), t.uid && (a.uid = t.uid), o()
                        }) : (a.oauth.setAuthStateParam(a.oauth.authStateParam()), o(), void 0);
                    case _.AUTHORIZED:
                        return a.getAccessToken(function(t, e) {
                            return t ? (a.authError = t, i()) : (a.oauth.processRedirectParams(e), a.uid = e.uid, o())
                        });
                    case _.DONE:
                        e && e(null, a);
                        break;
                    case _.SIGNED_OUT:
                        return a.authStep = _.RESET, a.reset(), s();
                    case _.ERROR:
                        e && e(a.authError, a)
                }
            }, s(), this
        }, t.prototype.isAuthenticated = function() {
            return this.authStep === _.DONE
        }, t.prototype.signOut = function(t, e) {
            var r, n, i = this;
            if (e || "function" != typeof t || (e = t, t = null), r = t && t.mustInvalidate, this.authStep !== _.DONE) throw new Error("This client doesn't have a user's token");
            return n = new p.Util.Xhr("POST", this.urls.signOut), n.signWithOauth(this.oauth), this.dispatchXhr(n, function(t) {
                if (t)
                    if (t.status === p.ApiError.INVALID_TOKEN) t = null;
                    else if (r) return e && e(t), void 0;
                return i.authStep = _.RESET, i.reset(), i.authStep = _.SIGNED_OUT, i.onAuthStepChange.dispatch(i), i.driver && i.driver.onAuthStepChange ? i.driver.onAuthStepChange(i, function() {
                    return e ? e(null) : void 0
                }) : e ? e(null) : void 0
            })
        }, t.prototype.signOff = function(t, e) {
            return this.signOut(t, e)
        }, t.prototype.getAccountInfo = function(t, e) {
            var r, n;
            return e || "function" != typeof t || (e = t, t = null), r = !1, t && t.httpCache && (r = !0), n = new p.Util.Xhr("GET", this.urls.accountInfo), n.signWithOauth(this.oauth, r), this.dispatchXhr(n, function(t, r) {
                return e(t, p.AccountInfo.parse(r), r)
            })
        }, t.prototype.getUserInfo = function(t, e) {
            return this.getAccountInfo(t, e)
        }, t.prototype.readFile = function(t, e, r) {
            var n, i, o, s, a, u, l;
            return r || "function" != typeof e || (r = e, e = null), i = {}, u = "text", s = null, n = !1, e && (e.versionTag ? i.rev = e.versionTag : e.rev && (i.rev = e.rev), e.arrayBuffer ? u = "arraybuffer" : e.blob ? u = "blob" : e.buffer ? u = "buffer" : e.binary && (u = "b"), e.length ? (null != e.start ? (a = e.start, o = e.start + e.length - 1) : (a = "", o = e.length), s = "bytes=" + a + "-" + o) : null != e.start && (s = "bytes=" + e.start + "-"), e.httpCache && (n = !0)), l = new p.Util.Xhr("GET", "" + this.urls.getFile + "/" + this.urlEncodePath(t)), l.setParams(i).signWithOauth(this.oauth, n), l.setResponseType(u), s && (s && l.setHeader("Range", s), l.reportResponseHeaders()), this.dispatchXhr(l, function(t, e, n, i) {
                var o;
                return o = i ? p.Http.RangeInfo.parse(i["content-range"]) : null, r(t, e, p.File.Stat.parse(n), o)
            })
        }, t.prototype.writeFile = function(t, e, r, n) {
            var i;
            return n || "function" != typeof r || (n = r, r = null), i = p.Util.Xhr.canSendForms && "object" == typeof e, i ? this.writeFileUsingForm(t, e, r, n) : this.writeFileUsingPut(t, e, r, n)
        }, t.prototype.writeFileUsingForm = function(t, e, r, n) {
            var i, o, s, a;
            return s = t.lastIndexOf("/"), -1 === s ? (i = t, t = "") : (i = t.substring(s), t = t.substring(0, s)), o = {
                file: i
            }, r && (r.noOverwrite && (o.overwrite = "false"), r.lastVersionTag ? o.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (o.parent_rev = r.parentRev || r.parent_rev)), a = new p.Util.Xhr("POST", "" + this.urls.postFile + "/" + this.urlEncodePath(t)), a.setParams(o).signWithOauth(this.oauth).setFileField("file", i, e, "application/octet-stream"), delete o.file, this.dispatchXhr(a, function(t, e) {
                return n ? n(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype.writeFileUsingPut = function(t, e, r, n) {
            var i, o;
            return i = {}, r && (r.noOverwrite && (i.overwrite = "false"), r.lastVersionTag ? i.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (i.parent_rev = r.parentRev || r.parent_rev)), o = new p.Util.Xhr("POST", "" + this.urls.putFile + "/" + this.urlEncodePath(t)), o.setBody(e).setParams(i).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, e) {
                return n ? n(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype.resumableUploadStep = function(t, e, r) {
            var n, i;
            return e ? (n = {
                offset: e.offset
            }, e.tag && (n.upload_id = e.tag)) : n = {
                offset: 0
            }, i = new p.Util.Xhr("POST", this.urls.chunkedUpload), i.setBody(t).setParams(n).signWithOauth(this.oauth), this.dispatchXhr(i, function(t, e) {
                return t && t.status === p.ApiError.INVALID_PARAM && t.response && t.response.upload_id && t.response.offset ? r(null, p.Http.UploadCursor.parse(t.response)) : r(t, p.Http.UploadCursor.parse(e))
            })
        }, t.prototype.resumableUploadFinish = function(t, e, r, n) {
            var i, o;
            return n || "function" != typeof r || (n = r, r = null), i = {
                upload_id: e.tag
            }, r && (r.lastVersionTag ? i.parent_rev = r.lastVersionTag : (r.parentRev || r.parent_rev) && (i.parent_rev = r.parentRev || r.parent_rev), r.noOverwrite && (i.overwrite = "false")), o = new p.Util.Xhr("POST", "" + this.urls.commitChunkedUpload + "/" + this.urlEncodePath(t)), o.setParams(i).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, e) {
                return n ? n(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype.stat = function(t, e, r) {
            var n, i, o;
            return r || "function" != typeof e || (r = e, e = null), i = {}, n = !1, e && (e.versionTag ? i.rev = e.versionTag : e.rev && (i.rev = e.rev), e.contentHash ? i.hash = e.contentHash : e.hash && (i.hash = e.hash), (e.removed || e.deleted) && (i.include_deleted = "true"), e.readDir && (i.list = "true", e.readDir !== !0 && (i.file_limit = e.readDir.toString())), e.cacheHash && (i.hash = e.cacheHash), e.httpCache && (n = !0)), i.include_deleted || (i.include_deleted = "false"), i.list || (i.list = "false"), o = new p.Util.Xhr("GET", "" + this.urls.metadata + "/" + this.urlEncodePath(t)), o.setParams(i).signWithOauth(this.oauth, n), this.dispatchXhr(o, function(t, e) {
                var n, i, o;
                return o = p.File.Stat.parse(e), n = (null != e ? e.contents : void 0) ? function() {
                    var t, r, n, o;
                    for (n = e.contents, o = [], t = 0, r = n.length; r > t; t++) i = n[t], o.push(p.File.Stat.parse(i));
                    return o
                }() : void 0, r(t, o, n)
            })
        }, t.prototype.readdir = function(t, e, r) {
            var n;
            return r || "function" != typeof e || (r = e, e = null), n = {
                readDir: !0
            }, e && (null != e.limit && (n.readDir = e.limit), e.versionTag ? n.versionTag = e.versionTag : e.rev && (n.versionTag = e.rev), e.contentHash ? n.contentHash = e.contentHash : e.hash && (n.contentHash = e.hash), (e.removed || e.deleted) && (n.removed = e.removed || e.deleted), e.httpCache && (n.httpCache = e.httpCache)), this.stat(t, n, function(t, e, n) {
                var i, o;
                return i = n ? function() {
                    var t, e, r;
                    for (r = [], t = 0, e = n.length; e > t; t++) o = n[t], r.push(o.name);
                    return r
                }() : null, r(t, i, e, n)
            })
        }, t.prototype.metadata = function(t, e, r) {
            return this.stat(t, e, r)
        }, t.prototype.makeUrl = function(t, e, r) {
            var n, i, o, s, a, u = this;
            return r || "function" != typeof e || (r = e, e = null), i = e && (e["long"] || e.longUrl || e.downloadHack) ? {
                short_url: "false"
            } : {}, t = this.urlEncodePath(t), o = "" + this.urls.shares + "/" + t, n = !1, s = !1, e && (e.downloadHack ? (n = !0, s = !0) : e.download && (n = !0, o = "" + this.urls.media + "/" + t)), a = new p.Util.Xhr("POST", o).setParams(i).signWithOauth(this.oauth), this.dispatchXhr(a, function(t, e) {
                return s && (null != e ? e.url : void 0) && (e.url = e.url.replace(u.authServer, u.downloadServer)), r(t, p.File.ShareUrl.parse(e, n))
            })
        }, t.prototype.history = function(t, e, r) {
            var n, i, o;
            return r || "function" != typeof e || (r = e, e = null), i = {}, n = !1, e && (null != e.limit && (i.rev_limit = e.limit), e.httpCache && (n = !0)), o = new p.Util.Xhr("GET", "" + this.urls.revisions + "/" + this.urlEncodePath(t)), o.setParams(i).signWithOauth(this.oauth, n), this.dispatchXhr(o, function(t, e) {
                var n, i;
                return i = e ? function() {
                    var t, r, i;
                    for (i = [], t = 0, r = e.length; r > t; t++) n = e[t], i.push(p.File.Stat.parse(n));
                    return i
                }() : void 0, r(t, i)
            })
        }, t.prototype.revisions = function(t, e, r) {
            return this.history(t, e, r)
        }, t.prototype.thumbnailUrl = function(t, e) {
            var r;
            return r = this.thumbnailXhr(t, e), r.paramsToUrl().url
        }, t.prototype.readThumbnail = function(t, e, r) {
            var n, i;
            return r || "function" != typeof e || (r = e, e = null), n = "b", e && (e.blob && (n = "blob"), e.arrayBuffer && (n = "arraybuffer"), e.buffer && (n = "buffer")), i = this.thumbnailXhr(t, e), i.setResponseType(n), this.dispatchXhr(i, function(t, e, n) {
                return r(t, e, p.File.Stat.parse(n))
            })
        }, t.prototype.thumbnailXhr = function(t, e) {
            var r, n;
            return r = {}, e && (e.format ? r.format = e.format : e.png && (r.format = "png"), e.size && (r.size = e.size)), n = new p.Util.Xhr("GET", "" + this.urls.thumbnails + "/" + this.urlEncodePath(t)), n.setParams(r).signWithOauth(this.oauth)
        }, t.prototype.revertFile = function(t, e, r) {
            var n;
            return n = new p.Util.Xhr("POST", "" + this.urls.restore + "/" + this.urlEncodePath(t)), n.setParams({
                rev: e
            }).signWithOauth(this.oauth), this.dispatchXhr(n, function(t, e) {
                return r ? r(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype.restore = function(t, e, r) {
            return this.revertFile(t, e, r)
        }, t.prototype.findByName = function(t, e, r, n) {
            var i, o, s;
            return n || "function" != typeof r || (n = r, r = null), o = {
                query: e
            }, i = !1, r && (null != r.limit && (o.file_limit = r.limit), (r.removed || r.deleted) && (o.include_deleted = !0), r.httpCache && (i = !0)), s = new p.Util.Xhr("GET", "" + this.urls.search + "/" + this.urlEncodePath(t)), s.setParams(o).signWithOauth(this.oauth, i), this.dispatchXhr(s, function(t, e) {
                var r, i;
                return i = e ? function() {
                    var t, n, i;
                    for (i = [], t = 0, n = e.length; n > t; t++) r = e[t], i.push(p.File.Stat.parse(r));
                    return i
                }() : void 0, n(t, i)
            })
        }, t.prototype.search = function(t, e, r, n) {
            return this.findByName(t, e, r, n)
        }, t.prototype.makeCopyReference = function(t, e) {
            var r;
            return r = new p.Util.Xhr("GET", "" + this.urls.copyRef + "/" + this.urlEncodePath(t)), r.signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
                return e(t, p.File.CopyReference.parse(r))
            })
        }, t.prototype.copyRef = function(t, e) {
            return this.makeCopyReference(t, e)
        }, t.prototype.pullChanges = function(t, e) {
            var r, n;
            return e || "function" != typeof t || (e = t, t = null), r = t ? t.cursorTag ? {
                cursor: t.cursorTag
            } : {
                cursor: t
            } : {}, n = new p.Util.Xhr("POST", this.urls.delta), n.setParams(r).signWithOauth(this.oauth), this.dispatchXhr(n, function(t, r) {
                return e(t, p.Http.PulledChanges.parse(r))
            })
        }, t.prototype.delta = function(t, e) {
            return this.pullChanges(t, e)
        }, t.prototype.mkdir = function(t, e) {
            var r;
            return r = new p.Util.Xhr("POST", this.urls.fileopsCreateFolder), r.setParams({
                root: "auto",
                path: this.normalizePath(t)
            }).signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
                return e ? e(t, p.File.Stat.parse(r)) : void 0
            })
        }, t.prototype.remove = function(t, e) {
            var r;
            return r = new p.Util.Xhr("POST", this.urls.fileopsDelete), r.setParams({
                root: "auto",
                path: this.normalizePath(t)
            }).signWithOauth(this.oauth), this.dispatchXhr(r, function(t, r) {
                return e ? e(t, p.File.Stat.parse(r)) : void 0
            })
        }, t.prototype.unlink = function(t, e) {
            return this.remove(t, e)
        }, t.prototype["delete"] = function(t, e) {
            return this.remove(t, e)
        }, t.prototype.copy = function(t, e, r) {
            var n, i, o;
            return r || "function" != typeof n || (r = n, n = null), i = {
                root: "auto",
                to_path: this.normalizePath(e)
            }, t instanceof p.File.CopyReference ? i.from_copy_ref = t.tag : i.from_path = this.normalizePath(t), o = new p.Util.Xhr("POST", this.urls.fileopsCopy), o.setParams(i).signWithOauth(this.oauth), this.dispatchXhr(o, function(t, e) {
                return r ? r(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype.move = function(t, e, r) {
            var n, i;
            return r || "function" != typeof n || (r = n, n = null), i = new p.Util.Xhr("POST", this.urls.fileopsMove), i.setParams({
                root: "auto",
                from_path: this.normalizePath(t),
                to_path: this.normalizePath(e)
            }).signWithOauth(this.oauth), this.dispatchXhr(i, function(t, e) {
                return r ? r(t, p.File.Stat.parse(e)) : void 0
            })
        }, t.prototype._listDatastores = function(t) {
            var e;
            return e = new p.Util.Xhr("GET", this.urls.listDbs), e.signWithOauth(this.oauth), this.dispatchXhr(e, function(e, r) {
                var n, i;
                return e ? t(e) : (i = r && r.dbs ? function() {
                    var t, e, i, o;
                    for (i = r.dbs, o = [], t = 0, e = i.length; e > t; t++) n = i[t], o.push(p.Datastore.Stat.parse(n));
                    return o
                }() : null, t(null, i))
            })
        }, t.prototype._getOrCreateDatastore = function(t, e) {
            var r;
            return r = new p.Util.Xhr("POST", this.urls.getOrCreateDb), r.setParams({
                path: t
            }).signWithOauth(this.oauth), this.dispatchXhr(r, function(r, n) {
                return r ? e(r) : e(null, p.Datastore.Stat.parse(n, t), n.created)
            })
        }, t.prototype._getDatastore = function(t, e) {
            var r;
            return r = new p.Util.Xhr("GET", this.urls.getDb), r.setParams({
                path: t
            }).signWithOauth(this.oauth), this.dispatchXhr(r, function(r, n) {
                return r ? e(r) : e(null, p.Datastore.Stat.parse(n, t))
            })
        }, t.prototype._deleteDatastoreByPath = function(t, e) {
            var r;
            return r = new p.Util.Xhr("POST", this.urls.deleteDb), r.setParams({
                path: t
            }), r.signWithOauth(this.oauth, !1), this.dispatchXhr(r, function(t) {
                return e(t)
            })
        }, t.prototype._getDeltas = function(t, e, r) {
            var n;
            return n = new p.Util.Xhr("GET", this.urls.getDeltas), n.setParams({
                dbid: t,
                rev: e
            }).signWithOauth(this.oauth), this.dispatchXhr(n, function(t, e) {
                return t ? r(t) : r(null, sequence, !! e.more)
            })
        }, t.prototype._putDelta = function(t, e, r) {
            var n;
            return n = new p.Util.Xhr("POST", this.urls.putDelta), n.setParams({
                dbid: t,
                rev: e.revision,
                nonce: e.nonce,
                metadata: e.metadata,
                changes: JSON.stringify(e.changes)
            }).signWithOauth(this.oauth), this.dispatchXhr(n, function(t) {
                return r(t)
            })
        }, t.prototype._getSnapshot = function(t, e) {
            var r;
            return r = new p.Util.Xhr("GET", this.urls.getSnapshot), r.setParams({
                dbid: t
            }).signWithOauth(this.oauth), this.dispatchXhr(r, function(r, n) {
                return r ? e(r) : e(null, p.Datastore.Snapshot.parse(n, t))
            })
        }, t.prototype._awaitDeltas = function(t, e) {
            var r, n;
            return r = t instanceof p.Datastore.SyncSet ? t.cursors() : t, n = new p.Util.Xhr("GET", this.urls.awaitDeltas), n.setParams({
                cursors: JSON.stringify(r)
            }).signWithOauth(this.oauth), this.dispatchLongPollXhr(n, function(t, r) {
                var n, i, o;
                if (t) return e(t);
                o = [];
                for (i in r) n = r[i], o.push(p.Datastore.DeltaSequence.parse(n, i));
                return e(null, o)
            })
        }, t.prototype._datastoreAwait = function(t, e, r) {
            var n;
            return n = new p.Util.Xhr("GET", this.urls.datastoreAwait), n.setParams({
                cursors: JSON.stringify(t),
                listdbs: JSON.stringify({
                    token: e
                })
            }).signWithOauth(this.oauth), this.dispatchLongPollXhr(n, function(t, e) {
                return r(t, e)
            })
        }, t.prototype.getDatastoreManager = function() {
            return null == this._datastoreManager && (this._datastoreManager = new p.Datastore.DatastoreManager(this)), this._datastoreManager
        }, t.prototype.openDefaultDatastore = function(t) {
            return this.getDatastoreManager().openDefaultDatastore(t)
        }, t.prototype.deleteDefaultDatastore = function(t) {
            return this.getDatastoreManager().deleteDefaultDatastore(t)
        }, t.prototype.reset = function() {
            var t;
            return this.uid = null, this.oauth.reset(), t = this.authStep, this.authStep = this.oauth.step(), t !== this.authStep && this.onAuthStepChange.dispatch(this), this.authError = null, this._credentials = null, this
        }, t.prototype.setCredentials = function(t) {
            var e;
            return e = this.authStep, this.oauth.setCredentials(t), this.authStep = this.oauth.step(), this.uid = t.uid || null, this.authError = null, this._credentials = null, e !== this.authStep && this.onAuthStepChange.dispatch(this), this
        }, t.prototype.appHash = function() {
            return this.oauth.appHash()
        }, t.prototype.setupUrls = function() {
            var t;
            return t = this.apiServers[Math.floor(Math.random() * this.apiServers.length)], this.urls = {
                authorize: "" + this.authServer + "/1/oauth2/authorize",
                token: "" + t + "/1/oauth2/token",
                signOut: "" + t + "/1/unlink_access_token",
                accountInfo: "" + t + "/1/account/info",
                getFile: "" + this.fileServer + "/1/files/auto",
                postFile: "" + this.fileServer + "/1/files/auto",
                putFile: "" + this.fileServer + "/1/files_put/auto",
                metadata: "" + t + "/1/metadata/auto",
                delta: "" + t + "/1/delta",
                revisions: "" + t + "/1/revisions/auto",
                restore: "" + t + "/1/restore/auto",
                search: "" + t + "/1/search/auto",
                shares: "" + t + "/1/shares/auto",
                media: "" + t + "/1/media/auto",
                copyRef: "" + t + "/1/copy_ref/auto",
                thumbnails: "" + this.fileServer + "/1/thumbnails/auto",
                chunkedUpload: "" + this.fileServer + "/1/chunked_upload",
                commitChunkedUpload: "" + this.fileServer + "/1/commit_chunked_upload/auto",
                fileopsCopy: "" + t + "/1/fileops/copy",
                fileopsCreateFolder: "" + t + "/1/fileops/create_folder",
                fileopsDelete: "" + t + "/1/fileops/delete",
                fileopsMove: "" + t + "/1/fileops/move",
                getDb: "" + t + "/r5/datastores/get_db",
                getOrCreateDb: "" + t + "/r5/datastores/get_or_create_db",
                listDbs: "" + t + "/r5/datastores/list_dbs",
                deleteDb: "" + t + "/r5/datastores/delete_db",
                getSnapshot: "" + t + "/r5/datastores/get_snapshot",
                getDeltas: "" + t + "/r5/datastores/get_deltas",
                putDelta: "" + t + "/r5/datastores/put_delta",
                awaitDeltas: "" + t + "/r5/datastores/await_deltas",
                datastoreAwait: "" + t + "/r5/datastores/await"
            }, this
        }, t.prototype.authStep = null, t.ERROR = 0, t.RESET = 1, t.PARAM_SET = 2, t.PARAM_LOADED = 3, t.AUTHORIZED = 4, t.DONE = 5, t.SIGNED_OUT = 6, t.prototype.urlEncodePath = function(t) {
            return p.Util.Xhr.urlEncodeValue(this.normalizePath(t)).replace(/%2F/gi, "/")
        }, t.prototype.normalizePath = function(t) {
            var e;
            if ("/" === t.substring(0, 1)) {
                for (e = 1;
                    "/" === t.substring(e, e + 1);) e += 1;
                return t.substring(e)
            }
            return t
        }, t.prototype.authorizeUrl = function() {
            var t;
            return t = this.oauth.authorizeUrlParams(this.driver.authType(), this.driver.url()), this.urls.authorize + "?" + p.Util.Xhr.urlEncode(t)
        }, t.prototype.getAccessToken = function(t) {
            var e, r;
            return e = this.oauth.accessTokenParams(this.driver.url()), r = new p.Util.Xhr("POST", this.urls.token).setParams(e).addOauthParams(this.oauth), this.dispatchXhr(r, function(e, r) {
                return e && e.status === p.ApiError.INVALID_PARAM && e.response && e.response.error && (e = new p.AuthError(e.response)), t(e, r)
            })
        }, t.prototype.dispatchLongPollXhr = function(t, e, r) {
            return null == r && (r = 6e4), this.dispatchXhr(t, e, r)
        }, t.prototype.dispatchXhr = function(t, e, r) {
            var n, i, o = this;
            return null == r && (r = 1e4), n = setTimeout(function() {
                return o.handleLongRequest(t)
            }, 2 * r), t.setCallback(function(t, r, i, o) {
                return clearTimeout(n), e(t, r, i, o)
            }), t.onError = this.xhrOnErrorHandler, t.prepare(), i = t.xhr, this.onXhr.dispatch(t) && t.send(), i
        }, t.prototype.handleXhrError = function(t, e) {
            var r = this;
            return t.status === p.ApiError.INVALID_TOKEN && this.authStep === _.DONE && (this.authError = t, this.authStep = _.ERROR, this.onAuthStepChange.dispatch(this), this.driver && this.driver.onAuthStepChange) ? (this.driver.onAuthStepChange(this, function() {
                return r.onError.dispatch(t), e(t)
            }), null) : (this.onError.dispatch(t), e(t), void 0)
        }, t.prototype.handleLongRequest = function() {
            return this.setupUrls()
        }, t.prototype.defaultApiServer = function() {
            return "https://api.dropbox.com"
        }, t.prototype.defaultApiServers = function() {
            var t, e, r;
            for (r = [], t = e = 1; 30 >= e; t = ++e) r.push("https://api" + t + ".dropbox.com");
            return r
        }, t.prototype.defaultAuthServer = function() {
            return this.apiServer.replace("api", "www")
        }, t.prototype.defaultFileServer = function() {
            return this.apiServer.replace("api", "api-content")
        }, t.prototype.defaultDownloadServer = function() {
            return this.apiServer.replace("api", "dl")
        }, t.prototype.computeCredentials = function() {
            var t;
            t = this.oauth.credentials(), this.uid && (t.uid = this.uid), this.apiServer !== this.defaultApiServer() && (t.server = this.apiServer), this.authServer !== this.defaultAuthServer() && (t.authServer = this.authServer), this.fileServer !== this.defaultFileServer() && (t.fileServer = this.fileServer), this.downloadServer !== this.defaultDownloadServer() && (t.downloadServer = this.downloadServer), this._credentials = t
        }, t
    }(), _ = p.Client, p.Datastore = function(t) {
        function e(t, r, n, i) {
            var o = this;
            this._datastore_manager = t, this._managed_datastore = r, this._dsid = n, this._path = i, e.__super__.constructor.call(this), this._record_cache = new I(this), this._last_used_timestamp = 0, this.recordsChanged = new p.Util.EventSource, this.syncStatusChanged = new p.Util.EventSource, this._timeoutWrapper = function(t) {
                return t
            }, this._evt_mgr = new D, this._evt_mgr.register(this._managed_datastore, "sync-state-changed", function() {
                return o._syncSoon(), o.dispatch("sync-status-changed", null), o.syncStatusChanged.dispatch(null)
            }), this._syncPending = !1, this._closed = !1
        }
        return or(e, t), e.prototype.recordsChanged = null, e.prototype.syncStatusChanged = null, e.openDefault = function(t, e) {
            return t.openDefaultDatastore(e), this
        }, e.int64 = function(t) {
            var e, r;
            if (be(t) && null != t[P]) return Ye(t);
            if (Se(t)) {
                if (!xe(t)) throw new Error("Not a valid int64 in string form: " + t);
                return r = new Number(parseInt(t, 10)), r[P] = t, Ye(r)
            }
            if (!be(t) || !isFinite(t)) throw new Error("Not a finite number: " + t);
            if (Number(t) !== Math.round(t)) throw new Error("Number is not an integer: " + t);
            if (e = t.toFixed(), !xe(e)) throw new Error("Number not in int64 range: " + t);
            return r = new Number(t), r[P] = e, Ye(r)
        }, e.isInt64 = function(t) {
            return ve(t)
        }, e.prototype.getTable = function(t) {
            if (this._checkNotClosed(), !p.Datastore.Table.isValidId(t)) throw new Error("Invalid table ID: " + t);
            return new p.Datastore.Table(this, t)
        }, e.prototype.listTableIds = function() {
            return this._checkNotClosed(), this._managed_datastore.list_tables()
        }, e.prototype.toString = function() {
            var t;
            return t = this._closed ? "[closed] " : "", "Dropbox.Datastore(" + t + this._path + ")"
        }, e.prototype.close = function() {
            return this._closed = !0, this._evt_mgr.unregister_all(), this._listeners = [], this._datastore_manager._datasync.obj_manager.close(this._dsid), void 0
        }, e.prototype.getId = function() {
            return this._path
        }, e.prototype.getSyncStatus = function() {
            return {
                uploading: this._managed_datastore.get_outgoing_delta_count() > 0
            }
        }, e.prototype._generateRid = function() {
            var t, e, r, n;
            for (n = "_", e = "_js_", r = Math.round(1e3 * Date.now()), r <= this._last_used_timestamp && (r = this._last_used_timestamp + 1), this._last_used_timestamp = r, t = r.toString(32); t.length < 11;) t = "0" + t;
            return n + t + e + Fe(5)
        }, e.prototype._syncSoon = function() {
            var t = this;
            if (this._managed_datastore.is_deleted()) throw new Error("Cannot sync deleted datastore " + this._path + ".");
            return this._checkNotClosed(), this._syncPending || (this._syncPending = !0, setTimeout(this._timeoutWrapper(function() {
                return t._syncPending = !1, t._sync()
            }), 0)), void 0
        }, e.prototype._sync = function() {
            var t, e, r, n, i, o, s, a, u;
            this._checkNotClosed(), i = this._managed_datastore.sync(), n = this._resolveAffectedRecordMap(i), t = !1;
            for (s in n)
                for (r = n[s], a = 0, u = r.length; u > a; a++) e = r[a], W(s === e._tid, "tid mismatch"), t = !0, o = e._rid, this._managed_datastore.query(s, o) || (e._deleted = !0, this._record_cache.remove(s, o));
            return t && (this.dispatch("records-changed", new L(n, !1)), this.recordsChanged.dispatch(new L(n, !1))), void 0
        }, e.prototype._resolveAffectedRecordMap = function(t) {
            var e, r, n, i, o;
            r = {};
            for (o in t) {
                i = t[o];
                for (n in i) e = this._record_cache.getOrCreate(o, n), null == r[o] && (r[o] = []), r[o].push(e)
            }
            return r
        }, e.prototype._recordsChangedLocally = function(t) {
            return t.length > 0 && (this.dispatch("records-changed", L._fromRecordList(t, !0)), this.recordsChanged.dispatch(L._fromRecordList(t, !0)), this._syncSoon()), void 0
        }, e.prototype._checkNotClosed = function() {
            if (this._closed) throw new Error("Datastore is already closed: " + this);
            return void 0
        }, e
    }(p.Util.TypedEventSource), ce = p.Datastore.int64, he = p.Datastore.impl = {}, M = p.Datastore.impl.T = {}, le = function(t) {
        return t
    }, M.get_coerce_fn = function(t) {
        return null != t.coerce ? t.coerce : null != t.load_json ? function(e) {
            return e instanceof t ? e : t.load_json(e)
        } : le
    }, M.get_T_fn = function(t) {
        return null != t.Type ? t.Type : t
    }, qe = function(t) {
        return M.is_string(t) ? t : "function" == typeof t ? t() : JSON.stringify(t)
    }, M.assert = function(t, e) {
        if (!t) throw new Error(qe(e))
    }, W = M.assert, M.check = function(t, e, r, n, i, o) {
        if (t) return r;
        throw M.fail(e, r, n, i, o), new Error("unreachable")
    }, se = "[object Object]", M.safe_to_string = function(t) {
        var e, r;
        try {
            if (r = t.toString(), r !== se) return r
        } catch (n) {
            e = n
        }
        try {
            return JSON.stringify(t)
        } catch (n) {
            e = n
        }
        try {
            if (r = t.constructor.name, null != r ? r.match(/^[A-Za-z0-9_]+$/) : void 0) return r
        } catch (n) {
            e = n
        }
        return "[T.safe_to_string failed]"
    }, M.fail = function(t, e, r, n, i) {
        var o, s;
        throw s = null != r ? null != n ? null != i ? "Wanted " + qe(n) + ", but " + qe(r) + " in " + qe(i) + " " + qe(t) : "Wanted " + qe(n) + ", but " + qe(r) + " " + qe(t) : "" + qe(r) + " " + qe(t) : null != n ? null != i ? "Wanted " + qe(n) + ", but in " + qe(i) + " " + qe(t) : "Wanted " + qe(n) + ", but " + t : "" + qe(t), o = new Error("" + s + ": " + M.safe_to_string(e)), console.error(o), o
    }, M.any = function(t) {
        return t
    }, M.defined = function(t, e, r, n) {
        return null == r && (r = "defined"), M.check("undefined" != typeof t, "is undefined", t, e, r, n), t
    }, M.nonnull = function(t, e, r, n) {
        return null == r && (r = "nonnull"), M.defined(t, e, r, n), M.check(null != t, "is null", t, e, r, n), t
    }, M.member = function(t) {
        var e, r;
        return r = "value in " + JSON.stringify(t), e = "not in " + JSON.stringify(t),
        function(n, i, o, s) {
            return null == o && (o = r), M.check(nr.call(t, n) >= 0, e, n, i, o, s)
        }
    }, M.object = function(t, e, r, n) {
        return null == r && (r = "object"), M.nonnull(t, e, r, n), M.check("object" == typeof t, "not an object", t, e, r, n), t
    }, M.bool = function(t, e, r, n) {
        return null == r && (r = "bool"), M.nonnull(t, e, r, n), M.check(t === !0 || t === !1, "is not bool", t, e, r, n), t
    }, M.string = function(t, e, r, n) {
        return null == r && (r = "string"), M.nonnull(t, e, r, n), M.check(M.is_string(t), "is not a string", t, e, r, n), t
    }, M.num = function(t, e, r, n) {
        return null == r && (r = "num"), M.nonnull(t, e, r, n), M.check("number" == typeof t, "is not numeric", t, e, r, n), t
    }, M.int = function(t, e, r, n) {
        return null == r && (r = "int"), M.num(t, e, r, n), M.check(0 === t % 1, "is not an integer", t, e, r, n), t
    }, M.uint = function(t, e, r, n) {
        return null == r && (r = "uint"), M.int(t, e, r, n), M.check(t >= 0, "is negative", t, e, r, n), t
    }, M.nullable = function(t) {
        var e, r;
        return r = "nullable(" + t + ")", e = function(e, n, i, o) {
            return null == i && (i = function() {
                return r
            }), M.defined(e, n, i, o), null != e && M.get_T_fn(t)(e, n, i, o), e
        }, e.toString = function() {
            return r
        }, e.coerce = function(e) {
            return null != e ? M.get_coerce_fn(t)(e) : null
        }, e
    }, M.array = function(t, e, r, n) {
        return null == r && (r = "array"), M.nonnull(t, e, r, n), M.check(M.is_array(t), "is not an array", t, e, r, n), t
    }, M.arrayOf = function(t) {
        var e, r;
        return r = "arrayOf(" + t + ")", e = function(e, n, i, o) {
            var s, a, u, l, h;
            for (null == i && (i = r), M.array(e, n, i, o), u = l = 0, h = e.length; h > l; u = ++l) s = e[u], a = function() {
                return null != n ? "element " + u + " of " + qe(n) : "element " + u
            }, M.get_T_fn(t)(s, a, i, o);
            return e
        }, e.toString = function() {
            return r
        }, e.coerce = function(e) {
            var r, n, i, o;
            for (o = [], n = 0, i = e.length; i > n; n++) r = e[n], o.push(M.get_coerce_fn(t)(r));
            return o
        }, e
    }, M.instance = function(t, e, r, n, i) {
        var o;
        if (!(e instanceof Function)) throw new Error("Invalid type given: " + e);
        return t instanceof e || (null == n && (n = e.name), M.check(!1, "got instance of " + (null != t ? null != (o = t.constructor) ? o.name : void 0 : void 0), t, r, n, i)), t
    }, M.unimplemented = function(t) {
        return function() {
            throw new Error("unimplemented " + t)
        }
    }, He = function(t, e) {
        return 0 === t.lastIndexOf(e, 0)
    }, Ve = function(t, e, r, n, i) {
        return M.string(e, r, n, i), He(e, t) || M.fail("does not start with " + t, e, r, n, i), e
    }, Je = function(t, e, r, n, i, o) {
        var s, a, u, l, h;
        for (Ve(t, r, n, i, o), s = u = l = t.length, h = r.length; h >= l ? h > u : u > h; s = h >= l ? ++u : --u) e.indexOf(r[s]) < 0 && (a = t.length > 0 ? "does not consist of " + e + " after prefix " + t : "does not consist of " + e, M.fail(a, r, n, i, o));
        return r
    }, M.string_matching = function(t) {
        var e;
        return M.string(t), M.check(/^[^].*[$]$/.test(t), "does not start with ^ and end with $", t), e = "does not match regex " + t,
        function(r, n, i, o) {
            return M.string(r, n, i, o), M.check(new RegExp(t).test(r), e, r, n, i, o), r
        }
    }, o = "0123456789", X = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", M.is_a = function(t) {
        var e;
        if (!t.dump_json && null == t.prototype.toJSON) throw new Error("Can't make T element from type " + t + ", missing dump_json or toJSON");
        return e = function(e, r, n, i) {
            var o;
            return e instanceof t || (o = t.toString(), o.length > 50 && (o = o.substring(0, 50) + "..."), M.fail('is not of type "' + o + '"', e, r, n, i)), e
        }, e.coerce = function(e) {
            var r, n;
            return r = M.get_coerce_fn(t)(e), r.toJSON = null != (n = t.prototype.toJSON) ? n : function() {
                return t.dump_json(this)
            }, r
        }, e
    }, M.is_defined = function(t) {
        return "undefined" != typeof t
    }, M.is_bool = function(t) {
        return t === !0 || t === !1
    }, M.is_number = function(t) {
        return "number" == typeof t || t && "object" == typeof t && t.constructor === Number
    }, M.is_json_number = function(t) {
        return M.is_number(t) && !isNaN(t) && isFinite(t)
    }, M.is_string = function(t) {
        return "string" == typeof t || t && "object" == typeof t && t.constructor === String
    }, M.is_array = function(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    }, M.is_empty = function(t) {
        return 0 === Object.keys(t).length
    }, M.is_uid = function(t) {
        return M.is_string(t) && null != t.match(/^u[0-9]*$/)
    }, M.is_nid = function(t) {
        return M.is_string(t) && null != t.match(/^n[0-9]*$/)
    }, M.is_db_path = function(t) {
        return M.is_string(t) && null != t.match(/^[-_.a-z0-9]{1,32}$/) && "." !== t[0] && "." !== t[t.length - 1]
    }, M.dbid_from_nid = function(t) {
        return M.nid(t), M.assert(t[0] = "n", function() {
            return "bad nid: " + t
        }), M.dbid("00" + t.slice(1))
    }, M.uid = function(t, e, r, n) {
        return null == r && (r = "uid"), Je("u", o, t, e, r, n), t
    }, M.cid = function(t, e, r, n) {
        return null == r && (r = "cid"), t.match(/^c[0-9]+_u[0-9]*$/) ? t : (Je("c", o, t, e, r, n), t)
    }, M.nid = function(t, e, r, n) {
        return null == r && (r = "nid"), M.string_matching("^n[0-9]{1,10}$")(t, e, r, n), t
    }, M.is_simple_map = function(t) {
        var e, r;
        if (null == t || "object" != typeof t) return !1;
        for (e in t)
            if (r = t[e], !Object.prototype.hasOwnProperty.call(t, e)) return !1;
        return !0
    }, M.simple_map = function(t, e, r, n) {
        var i, o;
        null == r && (r = "simple map"), M.object(t, e, r, n);
        for (i in t) o = t[i], M.check(Object.prototype.hasOwnProperty.call(t, i), function() {
            return "property " + i + " is inherited"
        }, t, e, r, t);
        return t
    }, M.simple_typed_map = function(t, e, r) {
        var n, i, o;
        return n = M.get_coerce_fn(e), i = M.get_coerce_fn(r), o = function(n, i, o, s) {
            var a, u;
            null == o && (o = t), M.simple_map(n, i, o, s);
            for (a in n) u = n[a], M.get_T_fn(e)(a, "property", null, n), M.get_T_fn(r)(u, function() {
                return "value of property " + a
            }, null, n);
            return n
        }, o.coerce = function(e) {
            var r, o, s;
            M.simple_map(e, null, t), o = {};
            for (r in e) s = e[r], o[n(r)] = i(s);
            return o
        }, o
    }, M.db_path = function(t, e, r, n) {
        return null == r && (r = "db_path"), M.check(M.is_db_path(t), "is not a valid db path", e, r, n), t
    }, M.dbid = function(t, e, r, n) {
        return null == r && (r = "dbid"), M.string(t, e, r, n), t
    }, M.delta_nonce = function(t, e, r, n) {
        return null == r && (r = "delta_nonce"), M.string_matching("^[-_0-9a-zA-Z]{0,30}$")(t, e, r, n), t
    }, M.delta_metadata = function(t, e, r, n) {
        return null == r && (r = "delta_metadata"), M.string(t, e, r, n), t
    }, ze = "^[-._+/=0-9a-zA-Z]{1,32}$", M.tid = function(t, e, r, n) {
        return null == r && (r = "tid"), M.string_matching(ze)(t, e, r, n), t
    }, M.rowid = function(t, e, r, n) {
        return null == r && (r = "rowid"), M.string_matching(ze)(t, e, r, n), t
    }, M.field_name = function(t, e, r, n) {
        return null == r && (r = "field name"), M.string_matching(ze)(t, e, r, n), t
    }, M.appid = function(t, e, r, n) {
        return null == r && (r = "appid"), M.string_matching("^[0-9]{1,15}$")(t, e, r, n), t
    }, M.floid = function(t, e, r, n) {
        return null == r && (r = "floid"), M.nid(t, e, r, n), t
    }, M.flobid = function(t, e, r, n) {
        return M.dbid(t, e, null != r ? r : "flobid", n)
    }, M.share_token = function(t, e, r, n) {
        return null == r && (r = "share_token"), Je("s", X, t, e, r, n), t
    }, M.email = function(t, e, r, n) {
        return null == r && (r = "email"), M.string(t, e, r, n), M.check(t.indexOf(!0), "contains no @", e, r, n), t
    }, M.uid_from_db_uid = function(t) {
        return M.uid("u" + M.int(t))
    }, rr = function(t) {
        return M.hasOwnProperty(t) ? Qe.toString = function() {
            return "T." + t
        } : void 0
    };
    for (Pe in M) Qe = M[Pe], rr(Pe);
    if (Ke = {}, Ke.define = function(t, e) {
        var r, n, i, o, s, a, u, l, h, c, p, d, f, _, y;
        for (M.string(t, "struct name"), M.array(e, "fields"), a = [], s = {}, u = _ = 0, y = e.length; y > _; u = ++_) {
            i = e[u], M.array(i, "field", "field descriptor", e), M.check(2 <= i.length && i.length <= 3, "does not have length 2 or 3", i, "field descriptor"), p = M.string(i[0], "field name", "field descriptor", e), f = M.nonnull(i[1], "field type", "field descriptor", e), d = i.length <= 2 ? {} : M.nonnull(i[2], "map of field options", "field descriptor", e);
            for (Pe in d) "init" !== Pe && "initFn" !== Pe && M.fail("unknown option " + Pe, d, "field options", "field descrptor", e);
            nr.call(d, "init") >= 0 && nr.call(d, "initFn") >= 0 && M.fail("both 'init' and 'initFn' specified", d, "field options", "field descriptor", e), h = "initFn" in d ? d.initFn : "init" in d ? (l = d.init, function(t) {
                return function() {
                    return t
                }
            }(l)) : null, r = {
                name: p,
                type: f,
                initFn: h
            }, o = "undefined" != typeof j && null !== j ? new j(r) : r, a.push(o), s[p] = o
        }
        return c = "initializer for " + t + " (fields " + function() {
            var t, e, r;
            for (r = [], t = 0, e = a.length; e > t; t++) i = a[t], r.push(i.name);
            return r
        }().join(", ") + ")", n = function(t) {
            var e, r, i;
            M.defined(t, "x", "initializer");
            for (p in t) e = t[p], t.hasOwnProperty(p) && M.check(null != s[p], function() {
                return "has an unexpected field " + p
            }, t, "initializer");
            for (r = 0, i = a.length; i > r; r++) o = a[r], t[o.name] && !t.hasOwnProperty(o.name) && M.fail("Has an indirect property " + o.name, t, "initializer"), t.hasOwnProperty(o.name) ? (e = t[o.name], this[o.name] = M.get_coerce_fn(o.type)(e)) : null != o.initFn ? this[o.name] = o.initFn() : M.fail("lacks the field " + o.name, t, "initializer");
            return n.Type(this, "initializer", c, this), this
        }, n.Type = function(e, r, i, u) {
            var l, h, c;
            for (M.defined(e, r, i, u), M.check(e instanceof n, function() {
                return "is not an instance of " + t
            }, e, r, i, u), h = 0, c = a.length; c > h; h++) o = a[h], M.check(e.hasOwnProperty(o.name), function() {
                return "lacks the field " + o.name
            }, e, r, i, u), M.get_T_fn(o.type)(e[o.name], o.name, i, u);
            for (p in e) l = e[p], e.hasOwnProperty(p) && M.check(null != s[p], "has an unexpected field", p, r, i, u);
            return e
        }, n.coerce = function(t) {
            return t instanceof n ? (n.Type(t), t) : new n(t)
        }, n.prototype.toString = function() {
            var t, e;
            return e = this, t = function() {
                var t, r, n;
                for (n = [], t = 0, r = a.length; r > t; t++) o = a[t], n.push("" + o.name + ": " + JSON.stringify(e[o.name]));
                return n
            }(), "{" + t.join(", ") + "}"
        }, n.prototype.toJSON = function() {
            var t, e, r;
            for (t = this, qe = function() {
                return "" + t
            }, e = 0, r = a.length; r > e; e++) o = a[e], M.get_T_fn(o.type)(this[o.name], o.name, null, qe);
            return this
        }, n.fromJSON = function(e) {
            var r, i;
            M.string(e, "input"), i = JSON.parse(e), r = [];
            for (Pe in i) Qe = i[Pe], null == s[Pe] && (r.push("" + Pe + ": " + JSON.stringify(Qe)), delete i[Pe]);
            return r.length > 0 && console.info("Ignoring unknown fields while deserializing " + t + ": " + r.join(", ")), new n(i)
        }, n.toString = function() {
            return "struct " + t
        }, n
    }, j = Ke.define("StructField", [
        ["name", M.string],
        ["type", M.defined],
        ["initFn", M.defined]
    ]), Ke.toJSO = function(t) {
        var e, r;
        if ("object" != typeof t) return t;
        if (M.is_array(t)) return function() {
            var r, n, i;
            for (i = [], r = 0, n = t.length; n > r; r++) e = t[r], i.push(Ke.toJSO(e));
            return i
        }();
        r = {};
        for (Pe in t) Qe = t[Pe], t.hasOwnProperty(Pe) && (r[Pe] = Ke.toJSO(Qe));
        return r
    }, Ke.union_as_list = function(t, e) {
        var r, n, i, o, s, a, u, l, h, c;
        for (M.string(t, "union name"), M.array(e, "variants"), a = function() {
            throw new Error("Use " + t + ".from_array instead")
        }, u = {}, s = [], l = function(e, r, n) {
            var i;
            return i = Ke.define("" + t + "." + e, n), i.prototype.tag = function() {
                return e
            }, i.prototype.toString = function() {
                return "" + t + "." + e + "(" + JSON.stringify(this) + ")"
            }, i.prototype.toJSON = function() {
                var t, n, i, o, s, a;
                for (t = [e], s = 0, a = r.length; a > s; s++) n = r[s], i = n[0], o = n[1], M.get_T_fn(o)(this[i], i), t.push(this[i]);
                return t
            }, i.from_array = function(n) {
                var o, s, a, u, l, h, c;
                for (l = "initializer for " + t, M.array(n, "initializer", l), M.check(n.length === r.length + 1, "does not have length " + (r.length + 1), n, "initializer", l), M.check(n[0] === e, "does not have tag " + e, n, "initializer", l), o = {
                    _tag: e
                }, a = h = 0, c = r.length; c > h; a = ++h) s = r[a], u = s[0], o[u] = n[a + 1];
                return new i(o)
            }, i.coerce = function(t) {
                return t instanceof i ? (i.Type(t), t) : i.from_array(t)
            }, u[e] = i, a[e] = i
        }, h = 0, c = e.length; c > h; h++) Qe = e[h], M.array(Qe, "variant", "variant descriptor", e), M.check(2 === Qe.length, "does not have length 2", Qe, "variant descriptor", e), o = M.string(Qe[0], "tag", "tag", e), r = M.array(Qe[1], "fields", "variant descriptor", e), i = r.slice(0), i.unshift(["_tag", M.member([o])]), l(o, r, i), s.push(o);
        return n = "initializer for " + t + " (variants " + s.join(", ") + ")", a.from_array = function(e) {
            var r;
            return r = "initializer for " + t, M.array(e, "initializer", r), M.check(e.length >= 1, "lacks a tag", e, "initializer", r), o = e[0], M.string(o, "tag", r, e), M.member(s)(o), u[o].from_array(e)
        }, a.Type = function(e, r, n, i) {
            return null == n && (n = "" + t + ".Type"), M.defined(e, r, n, i), M.defined(e.tag, "tag", n, i), o = e.tag(), M.string(o, "tag", "initializer", e), M.member(s)(o), u[o].Type(e, null, "object of type " + t), e
        }, a.coerce = function(t) {
            var e, r;
            for (r in u)
                if (e = u[r], t instanceof e) return e.Type(t), t;
            return a.from_array(t)
        }, a.toString = function() {
            return "union " + t
        }, a
    }, Re = new RegExp("^-?[1-9][0-9]{0,18}$"), pe = "9223372036854775807", de = "-9223372036854775808", fe = function(t, e) {
        var r, n, i;
        return t === e ? !1 : (n = "0" === t.charAt(0), i = "0" === e.charAt(0), n && !i ? !0 : i && !n ? !1 : (r = t.length === e.length ? t > e : t.length > e.length, n && i ? r : !r))
    }, xe = function(t) {
        return M.is_string(t) ? "0" === t ? !0 : Re.test(t) ? "-" === t.charAt(0) ? t.length < de.length || de >= t : t.length < pe.length || pe >= t : !1 : !1
    }, Ue = function(t) {
        var e, r, n, i;
        if (!M.is_simple_map(t)) return !1;
        if (e = Object.keys(t), 1 !== e.length) return !1;
        switch (e[0]) {
            case "B":
                return M.is_string(t.B);
            case "N":
                return "nan" === (n = t.N) || "+inf" === n || "-inf" === n;
            case "I":
            case "T":
                return r = null != (i = t.I) ? i : t.T, xe(r);
            default:
                return !1
        }
    }, Ae = function(t) {
        return M.is_bool(t) || M.is_json_number(t) || M.is_string(t) || Ue(t)
    }, Ee = function(t) {
        var e, r, n;
        if (M.is_array(t)) {
            for (r = 0, n = t.length; n > r; r++)
                if (e = t[r], !Ae(e)) return !1;
            return !0
        }
        return !1
    }, Oe = function(t) {
        return Ae(t) || Ee(t)
    }, K = function(t, e, r, n) {
        return null == r && (r = "atomic field value"), M.check(Ae(t), "is not an atomic field value", t, e, r, n), t
    }, Ce = function(t, e, r, n) {
        return null == r && (r = "list value"), M.arrayOf(K)(t, e, r, n), t
    }, ne = function(t, e, r, n) {
        return null == r && (r = "field value"), M.is_array(t) ? Ce(t, e, r, n) : K(t, e, r, n)
    }, he.FieldOp = O = Ke.union_as_list("FieldOp", [
        ["P", [
            ["value", ne]
        ]],
        ["D", []],
        ["LP", [
            ["at", M.uint],
            ["value", K]
        ]],
        ["LI", [
            ["before", M.uint],
            ["value", K]
        ]],
        ["LD", [
            ["at", M.uint]
        ]],
        ["LM", [
            ["from", M.uint],
            ["to", M.uint]
        ]]
    ]), oe = M.simple_typed_map("datadict", M.field_name, ne), Ze = M.simple_typed_map("update_datadict", M.field_name, O), he.Change = r = Ke.union_as_list("Change", [
        ["I", [
            ["tid", M.tid],
            ["rowid", M.rowid],
            ["fields", oe]
        ]],
        ["U", [
            ["tid", M.tid],
            ["rowid", M.rowid],
            ["updates", Ze]
        ]],
        ["D", [
            ["tid", M.tid],
            ["rowid", M.rowid]
        ]]
    ]), U = Ke.define("FlobDelta", [
        ["rev", M.uint],
        ["changes", M.arrayOf(r)],
        ["nonce", M.delta_nonce],
        ["metadata", M.delta_metadata]
    ]), s = Ke.define("DatastoreListItem", [
        ["dsid", M.string],
        ["path", M.string]
    ]), a = Ke.define("DatastoreListResponse", [
        ["token", M.string],
        ["datastores", M.arrayOf(s)]
    ]), c = Ke.define("DeltaStreamItem", [
        ["deltas", M.arrayOf(U)],
        ["evicted", M.nullable(M.string)]
    ]), t = Ke.define("AwaitResponse", [
        ["delta_stream_data", M.simple_typed_map("delta stream map", M.string, c)],
        ["ds_list", M.nullable(a)]
    ]), l = function() {
        function t(t) {
            this.obj_manager = e(t)
        }
        var e;
        return e = function(t) {
            var e, r;
            return r = new A(t), e = new k(r, t)
        }, t.changeFromArray = function(t) {
            return r.from_array(t)
        }, t.prototype.get_or_create = function(t, e) {
            var r = this;
            return this.obj_manager.flob_client.get_or_create_db(t, function(t, n, i) {
                return t ? e(t) : r.obj_manager.open(i, function(t, r) {
                    return t ? e(t) : e(null, i, r)
                })
            })
        }, t.prototype.get_by_path = function(t, e) {
            var r = this;
            return this.obj_manager.flob_client.get_db(t, function(t, n, i) {
                return t ? e(t) : r.obj_manager.open(i, function(t, r) {
                    return t ? e(t) : e(null, i, r)
                })
            })
        }, t.prototype.get = function(t, e) {
            return this.obj_manager.open(t, function(t, r) {
                return t ? e(t) : e(null, r)
            })
        }, t
    }(), e = function() {
        function t() {
            this.min_delay_millis = 500, this.max_delay_millis = 9e4, this.base = 1.5, this._failures = 0, this.log = !1
        }
        return t.prototype.set_log = function(t) {
            this.log = t
        }, t.prototype.set_max_delay_millis = function(t) {
            this.max_delay_millis = t
        }, t.prototype.get_backoff_millis = function() {
            var t, e;
            return this._failures += 1, e = Math.min(this.max_delay_millis, this.min_delay_millis * Math.pow(this.base, this._failures - 1)), t = (.5 + Math.random()) * e, this.log && console.log("get_backoff_millis: failures=" + this._failures + ", target_delay_millis=" + e + ", delay_millis=" + t), t
        }, t.prototype.reset = function() {
            return this._failures = 0
        }, t
    }(), N = function() {
        function t(t) {
            this.backoff = new e, this.give_up_after_absolute_millis = Date.now() + t
        }
        return t.prototype.run = function(t, e) {
            var r, n = this;
            return r = function() {
                return t(function(t) {
                    var i;
                    return null != t ? Date.now() > n.give_up_after_absolute_millis ? (console.error("Giving up due to error", t), e(t)) : (i = n.backoff.get_backoff_millis(), console.warn("Retrying in " + i + " ms due to error", t), setTimeout(r, i)) : e(null)
                })
            }, r()
        }, t
    }(), x = function() {
        function e(t) {
            this.client = t
        }
        var r, n;
        return n = 10, r = 2419200, e.prototype._run_with_retries = function(t, e, r) {
            var n, i, o;
            return n = new N(1e3 * t), i = null, o = function(t) {
                return r(function() {
                    var e, r;
                    return e = arguments[0], r = 2 <= arguments.length ? sr.call(arguments, 1) : [], i = r, t(e)
                })
            }, n.run(o, function(t) {
                return W(null != i, "no saved_args"), e.apply(null, [t].concat(sr.call(i)))
            })
        }, e.prototype.delete_db = function(t, e) {
            var r = this;
            return this._run_with_retries(n, e, function(e) {
                return r.client._deleteDatastoreByPath(t, function(t) {
                    return null != t ? e(t) : e(null)
                })
            })
        }, e.prototype.list_dbs = function(t) {
            var e = this;
            return this._run_with_retries(r, t, function(t) {
                return e.client._listDatastores(function(e, r) {
                    return e ? t(e) : t(null, r)
                })
            })
        }, e.prototype.get_or_create_db = function(t, e) {
            var r = this;
            return this._run_with_retries(n, e, function(e) {
                return r.client._getOrCreateDatastore(t, function(t, r, n) {
                    return r ? e(t, r.revision, r.dsid, n) : e(t)
                })
            })
        }, e.prototype.get_db = function(t, e) {
            var r = this;
            return this._run_with_retries(n, e, function(e) {
                return r.client._getDatastore(t, function(t, r) {
                    return r ? e(t, r.revision, r.dsid) : e(t)
                })
            })
        }, e.prototype.get_deltas = function(t, e, n) {
            var i = this;
            return this._run_with_retries(r, n, function(r) {
                return i.client._getDeltas(t, e, function(t, n, i) {
                    var o, s, a, u;
                    return n ? (s = n.deltas(), u = s.length > 0 ? s[s.length - 1].rev + 1 : e, a = function() {
                        var t, e, r;
                        for (r = [], t = 0, e = s.length; e > t; t++) o = s[t], r.push(o.json());
                        return r
                    }(), r(t, a, u, i)) : r(t)
                })
            })
        }, e.prototype.await_deltas = function(t, e) {
            var n = this;
            return this._run_with_retries(r, e, function(e) {
                return n.client._awaitDeltas(t, function(t, r) {
                    var n, i, o, s, a, u;
                    if (r) {
                        for (i = {}, a = 0, u = r.length; u > a; a++) s = r[a], o = function() {
                            var t, e, r, i;
                            for (r = s.deltas(), i = [], t = 0, e = r.length; e > t; t++) n = r[t], i.push(new U(n.json()));
                            return i
                        }(), i[s.dsid] = {
                            deltas: o
                        };
                        return e(t, i)
                    }
                    return e(t)
                })
            })
        }, e.prototype.await = function(e, n, i) {
            var o = this;
            return this._run_with_retries(r, i, function(r) {
                return o.client._datastoreAwait(e, n, function(e, n) {
                    var i, o, s, u, l, h, p, d, f, _;
                    if (e) return r(e);
                    if (d = {}, u = null, null != n.deltas) {
                        f = n.deltas;
                        for (l in f) i = f[l], s = i.deltas, h = i.evicted, d[l] = new c({
                            evicted: null != h ? h : null,
                            deltas: null != s ? s : []
                        })
                    }
                    return null != (null != (_ = n.listdbs) ? _.dbs : void 0) && (u = new a({
                        datastores: function() {
                            var t, e, r, i, s;
                            for (r = n.listdbs.dbs, s = [], t = 0, e = r.length; e > t; t++) i = r[t], o = i.dbid, p = i.path, s.push({
                                dsid: o,
                                path: p
                            });
                            return s
                        }(),
                        token: n.listdbs.token
                    })), r(null, new t({
                        delta_stream_data: d,
                        ds_list: u
                    }))
                })
            })
        }, e.prototype.put_delta = function(t, e, n) {
            var i, o = this;
            return i = function(t, e) {
                return n(e)
            }, this._run_with_retries(r, n, function(r) {
                return o.client._putDelta(t, p.Datastore.Delta.parse(e), function(t) {
                    return t && 409 === t.status ? r(null, t) : r(t, t)
                })
            })
        }, e.prototype.get_snapshot = function(t, e, r) {
            var i = this;
            return W(null === e, "rev is null"), this._run_with_retries(n, r, function(e) {
                return i.client._getSnapshot(t, function(t, r) {
                    var n, i, o, s, a, u, l;
                    if (r) {
                        for (n = {
                            data: {}
                        }, l = r.records(), s = 0, a = l.length; a > s; s++) i = l[s], (o = n.data)[u = i.tid] || (o[u] = {}), n.data[i.tid][i.rowid] = i.data;
                        return e(t, r.revision, n)
                    }
                    return e(t)
                })
            })
        }, e
    }(), C = function() {
        function t(t, e, r, n) {
            this.metadata = t, this.changes = e, this.undo_extras = r, this.finalized = null != n ? n : !1
        }
        var e;
        return e = function(t, e) {
            var n, i, o;
            switch (o = null, i = null, t.tag()) {
                case "I":
                    o = "D";
                    break;
                case "U":
                    o = "U", i = {};
                    for (Pe in e) Qe = e[Pe], i[Pe] = "undefined" == typeof Qe || null === Qe ? ["D"] : ["P", Qe];
                    break;
                case "D":
                    o = "I", i = te(e);
                    break;
                default:
                    throw new Error("Unknown change tag: " + t.tag())
            }
            return n = [o, t.tid, t.rowid], null != i && n.push(i), r.from_array(n)
        }, t.prototype.add_change = function(t, e) {
            return W(!this.finalized, "add_change: already finalized"), this.changes.push(t), this.undo_extras.push(e)
        }, t.prototype["package"] = function(t, e) {
            return W(this.finalized, "package: not finalized"), new U({
                metadata: M.string(this.metadata),
                changes: this.changes.slice(),
                nonce: t,
                rev: e
            })
        }, t.prototype.inverse_changes = function() {
            var t, r, n, i, o, s;
            for (n = [], s = this.changes, r = i = 0, o = s.length; o > i; r = ++i) t = s[r], n.push(e(t, this.undo_extras[r]));
            return n.reverse(), n
        }, t
    }(), u = function() {
        function t(t) {
            this.data = null != t ? t : {}
        }
        return t.load_from_flob = function(e) {
            return new t(te(e.data))
        }, t.prototype.apply_change = function(t) {
            switch (t.tag()) {
                case "I":
                    return this._apply_insert(t);
                case "U":
                    return this._apply_update(t);
                case "D":
                    return this._apply_delete(t);
                default:
                    throw new Error("unrecognized tag " + t.tag())
            }
        }, t.prototype._get_table = function(t) {
            return null == this.data[t] && (this.data[t] = {}), this.data[t]
        }, t.prototype._apply_insert = function(t) {
            var e;
            return e = this._get_table(t.tid), M.assert(!(t.rowid in e), function() {
                return "_apply_insert: record already exists: " + JSON.stringify(t)
            }), e[t.rowid] = te(t.fields), null
        }, t.prototype._apply_update = function(t) {
            var e, r, n, i, o, s, a;
            r = function(t, e, r) {
                return r[t] = e[t] instanceof Array ? e[t].slice() : e[t]
            }, e = function(t, e, r) {
                var n, i, o, s, a, u;
                switch (r.tag()) {
                    case "P":
                        return e[t] = te(r.value);
                    case "D":
                        return delete e[t];
                    case "LP":
                        return W(0 <= (i = r.at) && i < e[t].length, "bad index for LP"), e[t][r.at] = te(r.value);
                    case "LI":
                        return null != e[t] ? (W(0 <= (o = r.before) && o <= e[t].length, "bad index for LI"), e[t].splice(r.before, 0, te(r.value))) : (W(0 === r.before, "bad index for LI on nonexistent field"), e[t] = [te(r.value)]);
                    case "LD":
                        return W(0 <= (s = r.at) && s < e[t].length, "bad index for LD"), e[t].splice(r.at, 1);
                    case "LM":
                        return W(0 <= (a = r.from) && a < e[t].length, "bad from index for LM"), n = e[t][r.from], e[t].splice(r.from, 1), W(0 <= (u = r.to) && u <= e[t].length, "bad to index for LM"), e[t].splice(r.to, 0, n);
                    default:
                        throw new Error("field op type " + r.tag() + " is not handled yet")
                }
            }, s = this._get_table(t.tid), M.assert(t.rowid in s, function() {
                return "_apply_update: record does not exist: " + JSON.stringify(t)
            }), o = s[t.rowid], i = {}, a = t.updates;
            for (Pe in a) n = a[Pe], r(Pe, o, i), e(Pe, o, n);
            return i
        }, t.prototype._apply_delete = function(t) {
            var e, r, n, i;
            n = this._get_table(t.tid), M.assert(t.rowid in n, function() {
                return "_apply_delete: record does not exist: " + JSON.stringify(t)
            }), e = te(n[t.rowid]), delete n[t.rowid], i = !0;
            for (r in n) {
                i = !1;
                break
            }
            return i && delete this.data[t.tid], e
        }, t.prototype.query = function(t, e) {
            var r, n;
            return n = this.data[t], null == n ? null : (r = n[e], null == r ? null : te(r))
        }, t.prototype.list_tables = function() {
            var t, e;
            return t = function() {
                var t;
                t = [];
                for (e in this.data) t.push(e);
                return t
            }.call(this), t.sort(), t
        }, t.prototype.list_rows_for_table = function(t) {
            var e, r, n;
            return n = this.data[t], null == n ? [] : (e = function() {
                var e;
                e = [];
                for (r in this.data[t]) e.push(r);
                return e
            }.call(this), e.sort(), e)
        }, t
    }(), T = function(t) {
        function e(t, r, n, i, o) {
            this.dbid = t, this.resolver = r, this.datastore_model = n, this.sync_state = i, this.flob_client = o, e.__super__.constructor.call(this), this._deleted = !1, this._open = !0, this._commit_queue = new F
        }
        return or(e, t), e.prototype.on = function(t, e) {
            return this.addListener(t, e)
        }, e.prototype.emit = function(t, e, r) {
            if (r) throw new Error("Extra arg: " + JSON.stringify(r));
            return this.dispatch(t, e)
        }, e.fresh_managed_datastore = function(t, r, n, i, o) {
            var s, a, u;
            return a = function() {
                var t, e;
                for (e = [], s = t = 0; 10 > t; s = ++t) e.push(Math.floor(10 * Math.random()));
                return e
            }().join(""), u = new B(a, null, n, [], []), new e(i, r, t, u, o)
        }, e.prototype.is_deleted = function() {
            return this._deleted
        }, e.prototype.mark_deleted = function() {
            return this._deleted = !0
        }, e.prototype.open = function() {
            if (this._open) throw new Error("Attempt to open datastore multiple times");
            return this._open = !0
        }, e.prototype.close = function() {
            if (!this._open) throw new Error("Attempt to close datastore multiple times");
            return this._open = !1
        }, e.prototype._do_sync = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, p, d, f, _, y, g, m, v, w, b, S;
            if (0 === this.sync_state.server_deltas.length) return {};
            for (i = this.resolver.resolve(this.sync_state.unsynced_deltas, this.sync_state.server_deltas), n = i.rebased_deltas, t = i.affected_records, o = this.sync_state.unsynced_deltas.slice().reverse(), a = 0, c = o.length; c > a; a++)
                for (r = o[a], v = r.inverse_changes(), u = 0, p = v.length; p > u; u++) e = v[u], this.datastore_model.apply_change(e);
            for (w = this.sync_state.server_deltas, l = 0, d = w.length; d > l; l++)
                for (r = w[l], b = r.changes, h = 0, f = b.length; f > h; h++) e = b[h], this.datastore_model.apply_change(e);
            for (g = 0, _ = n.length; _ > g; g++)
                for (r = n[g], r.undo_extras = [], S = r.changes, m = 0, y = S.length; y > m; m++) e = S[m], s = this.datastore_model.apply_change(e), r.undo_extras.push(s);
            return this.sync_state.update_unsynced_deltas(n), t
        }, e.prototype._do_commit = function() {
            var t, e = this;
            if (!this.sync_state.delta_pending() && (t = this.sync_state.get_next_commit(), null != t)) return this._commit_queue.request(function() {
                return e.flob_client.put_delta(e.dbid, t, function() {
                    return e._commit_queue.finish()
                })
            })
        }, e.prototype.perform_change = function(t) {
            var e;
            return e = this.datastore_model.apply_change(t), this.sync_state.add_unsynced_change(t, e), this.emit("sync-state-changed")
        }, e.prototype.sync = function() {
            var t;
            return this.sync_state.finalize(), t = this._do_sync(), this._do_commit(), t
        }, e.prototype.get_outgoing_delta_count = function() {
            return this.sync_state.unsynced_deltas.length
        }, e.prototype.get_incoming_delta_count = function() {
            return this.sync_state.server_deltas.length
        }, e.prototype.has_unfinalized_changes = function() {
            return this.sync_state.has_unfinalized_changes()
        }, e.prototype.receive_server_delta = function(t) {
            return this.sync_state.receive_server_delta(t) ? this.emit("sync-state-changed") : this.emit("sync-state-changed")
        }, e.prototype.query = function(t, e) {
            return this.datastore_model.query(t, e)
        }, e.prototype.list_tables = function() {
            return this.datastore_model.list_tables()
        }, e.prototype.list_rows_for_table = function(t) {
            return this.datastore_model.list_rows_for_table(t)
        }, e
    }(p.Util.TypedEventSource), B = function() {
        function t(t, e, r, n, i) {
            this.last_nonce = t, this.pending_delta = e, this.last_rev = r, this.unsynced_deltas = n, this.server_deltas = i
        }
        return t.prototype.is_current = function() {
            return 0 === this.unsynced_deltas.length && 0 === this.server_deltas.length
        }, t.prototype.add_unsynced_change = function(t, e) {
            var r, n;
            return r = this.unsynced_deltas.length, 0 === r || this.unsynced_deltas[r - 1].finalized ? (n = "", this.unsynced_deltas.push(new C(n, [t], [e]))) : this.unsynced_deltas[r - 1].add_change(t, e)
        }, t.prototype._compact_deltas = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, p, d, f;
            if (n = this.unsynced_deltas.length, !(1 >= n)) {
                for (e = [], s = [], i = "", r = a = 0, p = n - 1; p >= 0 ? p > a : a > p; r = p >= 0 ? ++a : --a) {
                    for (d = this.unsynced_deltas[r].changes, u = 0, h = d.length; h > u; u++) t = d[u], e.push(t);
                    for (f = this.unsynced_deltas[r].undo_extras, l = 0, c = f.length; c > l; l++) o = f[l], s.push(o);
                    i += M.string(this.unsynced_deltas[r].metadata)
                }
                return this.unsynced_deltas = [new C(i, e, s, !0), this.unsynced_deltas[n - 1]]
            }
        }, t.prototype.get_next_commit = function() {
            var t, e, r;
            return W(null == this.pending_delta, "delta pending"), t = this.unsynced_deltas.length, 0 === t ? null : (this._compact_deltas(), e = this.unsynced_deltas[0], e.finalized ? (r = this.last_nonce, this.pending_delta = e["package"](r, this.last_rev), this.pending_delta) : null)
        }, t.prototype.clear_pending = function() {
            return this.pending_delta = null
        }, t.prototype.delta_pending = function() {
            return null != this.pending_delta
        }, t.prototype.set_metadata = function(t) {
            var e;
            return e = this.unsynced_deltas.length, W(e > 0, "no unsynced deltas"), this.unsynced_deltas[e - 1].metadata = M.string(t)
        }, t.prototype.has_unfinalized_changes = function() {
            var t, e;
            return e = this.unsynced_deltas.length, 0 === e ? !1 : (t = this.unsynced_deltas[e - 1], !t.finalized)
        }, t.prototype.finalize = function() {
            var t;
            if (this.has_unfinalized_changes()) return t = this.unsynced_deltas[this.unsynced_deltas.length - 1], W(!t.finalized, "last delta already finalized"), t.finalized = !0
        }, t.prototype.update_unsynced_deltas = function(t) {
            return this.unsynced_deltas = t, this.last_rev += this.server_deltas.length, this.server_deltas = []
        }, t.prototype.is_ours = function(t) {
            return this.last_nonce === t.nonce
        }, t.prototype.ack = function(t) {
            return W(this.is_ours(t), "not ours"), W(null != this.pending_delta, "no pending delta"), W(0 === this.server_deltas.length, "server deltas exist"), this.pending_delta = null, this.unsynced_deltas.shift(), this.last_rev++
        }, t.prototype.receive_server_delta = function(t) {
            var e, r;
            return r = this.server_deltas.length, e = r > 0 ? this.server_deltas[r - 1].rev + 1 : this.last_rev, W(t.rev <= e, "was expecting rev " + e + ", but got " + t.rev + " instead!"), t.rev < e ? (console.warn("received old delta!"), !1) : this.is_ours(t) ? (this.ack(t), !1) : (this.server_deltas.push(t), this.pending_delta = null, !0)
        }, t
    }(), he.DatastoreModel = u, R = function() {
        function t(t) {
            this.update_manager = t, this.cancelled = !1
        }
        return t.prototype.poll = function() {
            var t, e = this;
            return t = function() {
                var r;
                return r = JSON.parse(JSON.stringify(e.update_manager._flobid_version_map)), e.update_manager.flob_client.await(r, e.update_manager._last_dslist_token, function(n, i) {
                    var o, s, a, u, l, h, c, p, d, f;
                    if (!e.cancelled) {
                        if (n) return 0 === n.status ? (console.log("await deltas failed (offline):", n), setTimeout(t, 1e4)) : n.status && 500 <= (d = n.status) && 599 >= d ? (console.warn("server error:", n), setTimeout(t, 2e3)) : (console.error("Got error in longpoll:", n), setTimeout(t, 1e4));
                        f = i.delta_stream_data;
                        for (l in f) {
                            for (a = f[l], u = a.deltas, c = 0, p = u.length; p > c; c++) s = u[c], e.update_manager._data_queue.push({
                                flobid: l,
                                delta: s
                            });
                            null != a.evicted ? (e.update_manager._data_queue.push({
                                flobid: l,
                                evicted: a.evicted
                            }), delete e.update_manager._flobid_version_map[l]) : (h = r[l] + u.length, o = e.update_manager._flobid_version_map[l], null != o && (e.update_manager._flobid_version_map[l] = Math.max(o, h)))
                        }
                        return null != i.ds_list && (e.update_manager._last_dslist_token = i.ds_list.token, e.update_manager._data_queue.push({
                            dslist: i.ds_list.datastores
                        })), setTimeout(t, 0)
                    }
                })
            }, t()
        }, t
    }(), A = function() {
        function t(t) {
            this.flob_client = t, this._data_queue = null, this._flobid_version_map = {}, this._last_dslist_token = "[not a token]", this._pending_poll = null, this._running = !1
        }
        return t.prototype.run = function(t) {
            return this._data_queue = new i(t), this._running = !0, this._do_longpoll()
        }, t.prototype.add_poll = function(t, e) {
            var r, n;
            return W(this._running, "update manager is not running"), r = this._flobid_version_map[t], n = e, null != r && (n = Math.max(e, r)), this._flobid_version_map[t] = n, this._do_longpoll()
        }, t.prototype.remove_poll = function(t) {
            return W(this._running, "update manager is not running"), t in this._flobid_version_map ? (delete this._flobid_version_map[t], this._do_longpoll()) : void 0
        }, t.prototype._do_longpoll = function() {
            return W(this._running, "update manager is not running"), this._pending_poll && (this._pending_poll.cancelled = !0, this._pending_poll = null), this._pending_poll = new R(this), this._pending_poll.poll()
        }, t
    }(), k = function() {
        function t(t, e) {
            this.update_manager = t, this.flob_client = e, this.update_manager.run(this._handle_server_update.bind(this)), this.cached_objects = {}, this._dslist_listener = null
        }
        return t.prototype.set_dslist_listener = function(t) {
            return this._dslist_listener = t
        }, t.prototype.evict = function(t) {
            return t in this.cached_objects && this.cached_objects[t].mark_deleted(), this.update_manager.remove_poll(t)
        }, t.prototype.close = function(t) {
            if (t in this.cached_objects) return this.cached_objects[t].close();
            throw new Error("Attempt to close unknown datastore: " + t)
        }, t.prototype._handle_server_update = function(t, e) {
            var r, n;
            return t.dslist ? (this._dslist_listener && this._dslist_listener(t.dslist), e(null)) : (n = t.flobid, r = t.delta, null != t.evicted ? (this.evict(n), e(null)) : this.retrieve(n, function(t, n) {
                return t ? e(t) : (n.receive_server_delta(r), e(null))
            }))
        }, t.prototype.open = function(t, e) {
            return this.cached_objects[t] && this.cached_objects[t].open(), this.retrieve(t, e)
        }, t.prototype.retrieve = function(t, e) {
            var r, n = this;
            return r = this.cached_objects[t], null != r ? e(null, r) : this.flob_client.get_snapshot(t, null, function(r, i, o) {
                var s, a, l;
                return r ? e(r) : (s = u.load_from_flob(o), l = new h, a = T.fresh_managed_datastore(s, l, i, t, n.flob_client), null != n.cached_objects[t] ? e(null, n.cached_objects[t]) : (n.update_manager.add_poll(t, a.sync_state.last_rev), n.cached_objects[t] = a, e(null, a)))
            })
        }, t
    }(), he.FieldOpTransformer = E = function() {
        function t(t) {
            var i, o, s, a, l, h, c, p, d, g = this;
            for (this.rule_name = null != t ? t : "default", this.precedence = n[this.rule_name], this._transforms = {}, s = 0, h = r.length; h > s; s++) o = r[s], this._transforms[o] = {};
            for (d = ["P", "D"], a = 0, c = d.length; c > a; a++)
                for (o = d[a], l = 0, p = e.length; p > l; l++) i = e[l], this._transforms[o][i] = f, this._transforms[i][o] = _;
            this._transforms.P.P = function(t, e) {
                var r;
                return r = g.precedence(t.value, e.value), "left" === r ? [t, null] : [null, e]
            }, this._transforms.P.D = function(t, e) {
                var r;
                return r = g.precedence(t.value, null), "left" === r ? [t, null] : [null, e]
            }, this._transforms.D.P = function(t, e) {
                var r;
                return r = g.precedence(null, e.value), "left" === r ? [t, null] : [null, e]
            }, this._transforms.D.D = function(t, e) {
                var r;
                return r = g.precedence(null, null), "left" === r ? [t, null] : [null, e]
            }, this._transforms.LP.LP = function(t, e) {
                var r;
                return t.at !== e.at ? [t, e] : (r = g.precedence(t.value, e.value), "left" === r ? [t, null] : [null, e])
            }, this._transforms.LP.LI = function(t, e) {
                var r;
                return r = u(t), r.at += e.before <= t.at ? 1 : 0, [r, e]
            }, this._transforms.LP.LD = function(t, e) {
                var r;
                return t.at === e.at ? [null, e] : (r = u(t), r.at -= e.at < t.at ? 1 : 0, [r, e])
            }, this._transforms.LP.LM = function(t, e) {
                var r;
                return r = u(t), t.at === e.from ? r.at = e.to : (r.at -= e.from < r.at ? 1 : 0, r.at += e.to <= r.at ? 1 : 0), [r, e]
            }, this._transforms.LI.LP = y(this._transforms.LP.LI), this._transforms.LI.LI = function(t, e) {
                var r, n, i;
                return i = [u(t), u(e)], r = i[0], n = i[1], t.before < e.before ? n.before += 1 : r.before += 1, [r, n]
            }, this._transforms.LI.LD = function(t, e) {
                var r, n, i;
                return i = [u(t), u(e)], r = i[0], n = i[1], r.before -= e.at < t.before ? 1 : 0, n.at += t.before <= e.at ? 1 : 0, [r, n]
            }, this._transforms.LI.LM = function(t, e) {
                var r, n, i, o;
                return o = [u(t), u(e)], n = o[0], i = o[1], t.before === e.to + 1 && e.from <= e.to ? [t, e] : t.before === e.to && e.from > e.to ? (n.before++, i.from++, [n, i]) : (r = e.from < t.before ? t.before - 1 : t.before, i.from += t.before <= e.from ? 1 : 0, n.before = e.to < r ? r + 1 : r, i.to += r <= e.to ? 1 : 0, [n, i])
            }, this._transforms.LD.LP = y(this._transforms.LP.LD), this._transforms.LD.LI = y(this._transforms.LI.LD), this._transforms.LD.LD = function(t, e) {
                var r, n, i;
                return t.at === e.at ? [null, null] : (i = [u(t), u(e)], r = i[0], n = i[1], t.at < e.at ? n.at -= 1 : r.at -= 1, [r, n])
            }, this._transforms.LD.LM = function(t, e) {
                var r, n, i;
                return t.at === e.from ? (r = u(t), r.at = e.to, [r, null]) : (i = [u(t), u(e)], r = i[0], n = i[1], r.at -= e.from < r.at ? 1 : 0, r.at += e.to <= r.at ? 1 : 0, n.to += n.from < n.to ? 1 : 0, n.from -= t.at < n.from ? 1 : 0, n.to -= t.at < n.to ? 1 : 0, n.to -= n.from < n.to ? 1 : 0, [r, n])
            }, this._transforms.LM.LP = y(this._transforms.LP.LM), this._transforms.LM.LI = function(t, e) {
                var r, n, i, o;
                return o = [u(t), u(e)], n = o[0], i = o[1], e.before === t.to + 1 && t.from <= t.to ? [t, e] : e.before === t.to && t.from > t.to ? (n.from++, n.to++, [n, i]) : (r = t.from < e.before ? e.before - 1 : e.before, n.from += e.before <= t.from ? 1 : 0, i.before = t.to < r ? r + 1 : r, n.to += r <= t.to ? 1 : 0, [n, i])
            }, this._transforms.LM.LD = y(this._transforms.LD.LM), this._transforms.LM.LM = function(t, e) {
                var r, n, i, o, s, a, l, h, c, p, d;
                return t.from === e.from ? t.to === e.to ? [null, null] : e.from === e.to ? [t, e] : (o = u(e), o.from = t.to, [null, o]) : t.to === t.from ? (i = u(t), i.from += (e.to <= t.from) - (e.from < t.from), t.from === e.to && e.from < e.to && i.from--, i.to = i.from, [i, e]) : e.to === e.from ? (o = u(e), o.from += (t.to <= e.from) - (t.from < e.from), o.to = o.from, [t, o]) : (l = [u(t), u(e)], i = l[0], o = l[1], t.to === e.to && t.from > t.to && e.from > e.to ? (i.to++, e.from > t.from ? i.from++ : o.from++, [i, o]) : t.from === e.to && e.from === t.to && t.from < t.to ? (o.from--, i.from++, [i, o]) : t.from > t.to && e.from < e.to && e.to + 1 === t.to ? [t, e] : (h = [t.to, t.from], s = h[0], r = h[1], s += t.from < s ? 1 : 0, s -= e.from < s ? 1 : 0, s += e.to < s ? 1 : 0, r -= e.from < r ? 1 : 0, r += e.to <= r ? 1 : 0, s -= s > r ? 1 : 0, c = [e.to, e.from], a = c[0], n = c[1], a += e.from < a ? 1 : 0, a -= t.from < a ? 1 : 0, a += t.to <= a ? 1 : 0, n -= t.from < n ? 1 : 0, n += t.to <= n ? 1 : 0, a -= a > n ? 1 : 0, p = [s, r], i.to = p[0], i.from = p[1], d = [a, n], o.to = d[0], o.from = d[1], [i, o]))
            }
        }
        var e, r, n, i, o, s, a, u, l, h, c, p, d, f, _, y, g, m, v;
        for (y = function(t) {
            return W(null != t),
            function(e, r) {
                var n, i, o;
                return o = t(r, e), n = o[0], i = o[1], [i, n]
            }
        }, i = ["null", "bool", "num", "str", "blob", "ts", "list"], o = {}, h = m = 0, v = i.length; v > m; h = ++m) g = i[h], o[g] = h;
        return l = function(t) {
            if (null == t) return "null";
            if (M.is_bool(t)) return "bool";
            if (null != t.I || M.is_number(t)) return "num";
            if (M.is_string(t)) return "str";
            if (null != t.B) return "blob";
            if (t instanceof Date) return "ts";
            if (M.is_array(t)) return "list";
            throw new Error("Unrecognized value " + t)
        }, d = function(t) {
            return M.is_number(t) || null != t.I
        }, s = function(t) {
            return null != t.I ? parseInt(t.I) : t
        }, p = function(t, e) {
            var r, n, i;
            for (r = n = 0, i = t.length; i >= 0 ? i > n : n > i; r = i >= 0 ? ++n : --n) {
                if (r >= e.length) return !1;
                if (c(t[r], e[r])) return !0;
                if (c(e[r], t[r])) return !1
            }
            return e.length > t.length
        }, t._is_less_than = c = function(t, e) {
            var r, n;
            if (r = l(t), n = l(e), r !== n) return o[r] < o[n];
            if ("null" === r) return !1;
            if ("bool" === r) return e && !t;
            if ("num" === r) return null != t.I && null != e.I ? fe(t.I, e.I) : s(t) < s(e);
            if ("str" === r) return e > t;
            if ("blob" === r) return t.B < e;
            if ("ts" === r) return e > t;
            if ("list" === r) return p(t, e);
            throw new Error("unknown type " + r)
        }, t._compute_sum = a = function(t, e, r) {
            var n, i, o, s, a, u;
            return n = null != t.I && null != e.I && null != r.I, null != t.I && (t = parseInt(t.I)), null != e.I && (e = parseInt(e.I)), null != r.I && (r = parseInt(r.I)), s = 0x8000000000000000, a = 0x10000000000000000, u = 0xfffffffffffff800, i = e - t, o = r + i, n && (o >= s && (o -= u), -s > o && (o += u), o = {
                I: "" + o
            }), o
        }, _ = function(t, e) {
            return [null, e]
        }, f = function(t) {
            return [t, null]
        }, r = ["P", "D", "LP", "LI", "LD", "LM"], e = ["LP", "LI", "LD", "LM"], t.copy = u = function(t) {
            return O.from_array(JSON.parse(JSON.stringify(t)))
        }, n = {
            "default": function() {
                return "right"
            },
            remote: function() {
                return "right"
            },
            local: function() {
                return "left"
            },
            min: function(t, e) {
                return c(t, e) ? "left" : "right"
            },
            max: function(t, e) {
                return c(t, e) ? "right" : "left"
            },
            sum: function() {
                return "right"
            }
        }, t.prototype.transform = function(t, e, r) {
            var n, i, o, s, u;
            return null == r && (r = null), "sum" === this.rule_name && "P" === t.tag() && "P" === e.tag() && (null == r && (r = {
                I: "0"
            }), d(r) && d(t.value) && d(e.value)) ? (o = a(r, t.value, e.value), n = i = O.from_array(["P", o]), [n, i, e.value]) : (s = this._transforms[t.tag()][e.tag()](t, e), u = function() {
                switch (e.tag()) {
                    case "P":
                        return e.value;
                    case "D":
                        return null;
                    default:
                        return {
                            L: !0
                        }
                }
            }(), s.push(u), s)
        }, t
    }(), he.ChangeTransformer = n = function() {
        function t() {
            this._transform_rules = {}, this._default_transformer = new E
        }
        var e, n, i, o, s, a, u, l;
        for (e = {}, l = ["default", "local", "remote", "min", "max", "sum"], a = 0, u = l.length; u > a; a++) i = l[a], e[i] = new E(i);
        return s = function(t) {
            return W(null != t),
            function(e, r) {
                var n, i, o;
                return o = t(r, e), n = o[0], i = o[1], [i, n]
            }
        }, n = function(t) {
            return t instanceof Array ? t.slice() : t
        }, o = function(t, e) {
            return t.tid === e.tid && t.rowid === e.rowid
        }, t.is_no_op = function(t) {
            var e, r;
            if ("U" !== t.tag()) return !1;
            r = t.updates;
            for (Pe in r) return e = r[Pe], !1;
            return !0
        }, t.compact = function(t) {
            var e, r, n, i;
            for (e = [], n = 0, i = t.length; i > n; n++) r = t[n], this.is_no_op(r) || e.push(r);
            return e
        }, t.prototype.set_field_transformer = function(t, r, n) {
            var i;
            return null == (i = this._transform_rules)[t] && (i[t] = {}), this._transform_rules[t][r] = e[n]
        }, t.prototype.get_field_transformer = function(t, r) {
            var n;
            return t in this._transform_rules ? null != (n = this._transform_rules[t][r]) ? n : this._default_transformer : e["default"]
        }, t.prototype.transform_ii = function(t, e) {
            var i, s, a;
            return o(t, e) ? (i = function(t) {
                var e, i, o;
                i = {}, o = t.fields;
                for (Pe in o) Qe = o[Pe], i[Pe] = O.from_array(["P", n(Qe)]);
                return e = r.from_array(["U", t.tid, t.rowid, i]), e.undo_extra = {}, e
            }, s = i(t), a = i(e), this.transform_uu(s, a)) : [
                [t],
                [e]
            ]
        }, t.prototype.transform_iu = function(t, e) {
            return o(t, e) ? W(!1, "Couldn't have updated a row that hasn't been inserted yet!") : [
                [t],
                [e]
            ]
        }, t.prototype.transform_id = function(t, e) {
            return o(t, e) ? W(!1, "Couldn't have deleted a row that hasn't been inserted yet!") : [
                [t],
                [e]
            ]
        }, t.prototype.transform_ui = s(t.prototype.transform_iu), t.prototype.transform_uu = function(t, e) {
            var n, i, s, a, u, l, h, c, p, d, f, _, y, g, m, v, w, b;
            if (!o(t, e)) return [[t], [e]];
            y = [{}, {}], c = y[0], p = y[1], h = {}, g = t.updates;
            for (Pe in g) n = g[Pe], Pe in e.updates ? (i = e.updates[Pe], d = null != (v = t.undo_extra[Pe]) ? v : null, f = this.get_field_transformer(t.tid, Pe), w = f.transform(n, i, d), s = w[0], a = w[1], _ = w[2], null != s && (c[Pe] = s, h[Pe] = null != _ ? _ : null), null != a && (p[Pe] = a)) : (c[Pe] = n, h[Pe] = null != (m = t.undo_extra[Pe]) ? m : null);
            b = e.updates;
            for (Pe in b) i = b[Pe], Pe in t.updates || (p[Pe] = i);
            return u = r.from_array(["U", t.tid, t.rowid, c]), u.undo_extra = h, l = r.from_array(["U", e.tid, e.rowid, p]), [
                [u],
                [l]
            ]
        }, t.prototype.transform_ud = function(t, e) {
            return o(t, e) ? [
                [],
                [e]
            ] : [
                [t],
                [e]
            ]
        }, t.prototype.transform_di = s(t.prototype.transform_id), t.prototype.transform_du = s(t.prototype.transform_ud), t.prototype.transform_dd = function(t, e) {
            return o(t, e) ? [
                [],
                []
            ] : [
                [t],
                [e]
            ]
        }, t
    }(), he.DefaultResolver = h = function() {
        function t() {
            this._change_transformer = new n
        }
        return t.prototype.add_resolution_rule = function(t, e, r) {
            return this._change_transformer.set_field_transformer(t, e, r)
        }, t.prototype._transform_one = function(t, e) {
            var r, i, o, s, a;
            return r = function(t) {
                switch (t.tag()) {
                    case "I":
                        return "i";
                    case "U":
                        return "u";
                    case "D":
                        return "d";
                    default:
                        throw new Error("unrecognized op type " + t.tag())
                }
            }, s = "transform_" + r(t) + r(e), a = this._change_transformer[s](t, e), i = a[0], o = a[1], i = n.compact(i), o = n.compact(o), [i, o]
        }, t.prototype._transform_list = function(t, e) {
            var r, n, i, o, s, a, u, l, h, c, p, d, f, _;
            if (0 === t.length) return [[], e];
            if (0 === e.length) return [t, []];
            for (r = t[0], n = e[0], d = this._transform_one(r, n), o = d[0], s = d[1], f = this._transform_list(t.slice(1), s), i = f[0], s = f[1], l = 0, c = i.length; c > l; l++) a = i[l], o.push(a);
            for (_ = this._transform_list(o, e.slice(1)), o = _[0], u = _[1], h = 0, p = u.length; p > h; h++) a = u[h], s.push(a);
            return [o, s]
        }, t.prototype._resolve = function(t, e) {
            var r, n, i, o, s, a, u;
            for (o = e.slice(), n = [], s = 0, a = t.length; a > s; s++) i = t[s], u = this._transform_list(i, o), r = u[0], o = u[1], n.push(r);
            return [n, o]
        }, t.prototype.resolve = function(t, e) {
            var n, i, o, s, a, u, l, h, c, p, d, f, _, y, g, m, v, w, b, S, D, A, O, E, x, U, P, T, k, R, I, L, N;
            for (d = [], v = 0, D = t.length; D > v; v++) {
                for (h = t[v], i = [], I = h.changes, p = w = 0, A = I.length; A > w; p = ++w) s = I[p], u = r.from_array(JSON.parse(JSON.stringify(s))), u.undo_extra = te(h.undo_extras[p]), i.push(u);
                d.push(i)
            }
            for (g = [], b = 0, O = e.length; O > b; b++)
                for (h = e[b], L = h.changes, S = 0, E = L.length; E > S; S++) o = L[S], g.push(o);
            for (N = this._resolve(d, g), _ = N[0], l = N[1], y = [], p = T = 0, x = _.length; x > T; p = ++T) {
                for (a = _[p], m = null, f = "", c = t[p].finalized, k = 0, U = a.length; U > k; k++) s = a[k], delete s.undo_extra;
                a.length > 0 && y.push(new C(f, a, m, c))
            }
            for (n = {}, R = 0, P = l.length; P > R; R++) o = l[R], o.tid in n || (n[o.tid] = {}), n[o.tid][o.rowid] = !0;
            return {
                rebased_deltas: y,
                affected_records: n
            }
        }, t
    }(), F = function() {
        function t() {
            this._waiting = [], this._running = !1
        }
        return t.prototype._run_next = function() {
            var t;
            this._running || this._waiting.length > 0 && (t = this._waiting[0], this._waiting.shift(), this._running = !0, t())
        }, t.prototype.request = function(t) {
            return this._waiting.push(t), this._run_next()
        }, t.prototype.finish = function() {
            return this._running = !1, setTimeout(this._run_next.bind(this), 0)
        }, t
    }(), i = function() {
        function t(t) {
            this.consumer = t, this.items = [], this.sync_queue = new F
        }
        return t.prototype.consume = function() {
            var t = this;
            return this.sync_queue.request(function() {
                var e;
                return 0 === t.items.length ? t.sync_queue.finish() : (e = t.items.shift(), t.consumer(e, function(e) {
                    if (e) throw e;
                    return t.sync_queue.finish(), t.consume()
                }))
            })
        }, t.prototype.push = function(t) {
            return this.items.push(t), this.consume()
        }, t.prototype.run = function() {
            return this.consume()
        }, t
    }(), p.Datastore.DatastoreListChanged = function() {
        function t(t) {
            this._dsids = t
        }
        return t.prototype.toString = function() {
            return "Dropbox.Datastore.DatastoreListChanged(" + this._dsids.length + " datastores)"
        }, t.prototype.listDatastoreIds = function() {
            return this._dsids
        }, t
    }(), p.Datastore.impl.EventSourceWithInitialData = function(t) {
        function e(t) {
            this.options = t, e.__super__.constructor.call(this, t), this._have_event = !1, this._last_event = null, this._listenersChanged = new p.Util.EventSource
        }
        return or(e, t), e.prototype._clearLastEvent = function() {
            return this._have_event = !1, this._last_event = null
        }, e.prototype.addListener = function(t) {
            var r;
            return r = e.__super__.addListener.call(this, t), this._have_event && t(event), this._listenersChanged.dispatch(this._listeners), r
        }, e.prototype.removeListener = function(t) {
            var r;
            return r = e.__super__.removeListener.call(this, t), this._listenersChanged.dispatch(this._listeners), r
        }, e.prototype.dispatch = function(t) {
            return this._last_event = t, this._have_event = !0, e.__super__.dispatch.call(this, t)
        }, e
    }(p.Util.EventSource), p.Datastore.DatastoreManager = function() {
        function t(t) {
            var e = this;
            this._flob_client = new x(t), this._datasync = new l(this._flob_client), this._dslist_initialized = !1, this.datastoreListChanged = new p.Datastore.impl.EventSourceWithInitialData, this.datastoreListChanged._listenersChanged.addListener(function(t) {
                return 0 !== t.length ? e._init_live_dslist() : void 0
            })
        }
        var e;
        return e = "default", t.prototype.datastoreListChanged = null, t.prototype.toString = function() {
            return "Dropbox.Datastore.DatastoreManager()"
        }, t.prototype._getDatastoreIdsFromListResponse = function(t) {
            var e;
            return function() {
                var r, n, i;
                for (i = [], r = 0, n = t.length; n > r; r++) e = t[r], i.push(e.path);
                return i
            }()
        }, t.prototype._init_live_dslist = function() {
            var t, e = this;
            if (!this._dslist_initialized) return this._dslist_initialized = !0, t = function(t) {
                return e.datastoreListChanged.dispatch(new p.Datastore.DatastoreListChanged(e._getDatastoreIdsFromListResponse(t)))
            }, this._datasync.obj_manager.set_dslist_listener(t), this._flob_client.list_dbs(function(e, r) {
                return e ? (console.warn("Failed to get datastore list"), void 0) : t(r)
            })
        }, t.prototype._getDatastorePathById = function(t, e) {
            return this.listDatastores(function(r, n) {
                var i, o, s;
                if (r) return e(r);
                for (o = 0, s = n.length; s > o; o++)
                    if (i = n[o], i.dsid === t) return e(null, i.path);
                return e(null, null)
            })
        }, t.prototype._getOrCreateDatastoreByPath = function(t, e) {
            var r = this;
            return this._datasync.get_or_create(t, function(n, i, o) {
                return n ? e(n) : e(null, new p.Datastore(r, o, i, t))
            }), void 0
        }, t.prototype._getExistingDatastoreByPath = function(t, e) {
            var r = this;
            return this._datasync.get_by_path(t, function(n, i, o) {
                return n ? e(n) : e(null, new p.Datastore(r, o, i, t))
            }), void 0
        }, t.prototype.openDefaultDatastore = function(t) {
            return this._getOrCreateDatastoreByPath(e, t)
        }, t.prototype.openDatastore = function(t, e) {
            return this._getExistingDatastoreByPath(t, e), void 0
        }, t.prototype.createDatastore = function(t) {
            var e, r, n;
            for (r = "", e = n = 0; 20 > n; e = ++n) r += Math.floor(10 * Math.random());
            return r = "_" + r, this._getOrCreateDatastoreByPath(r, t), void 0
        }, t.prototype.deleteDatastore = function(t, e) {
            return this._flob_client.delete_db(t, function(t) {
                return t && e(t), e(null)
            }), void 0
        }, t.prototype.listDatastoreIds = function(t) {
            var e = this;
            return this.datastoreListChanged._have_event ? t(null, this.datastoreListChanged._last_event.listDatastoreIds()) : (this._flob_client.list_dbs(function(r, n) {
                return r ? t(r) : t(null, e._getDatastoreIdsFromListResponse(n))
            }), void 0)
        }, t
    }(), p.Datastore.Delta = function() {
        function t(t) {
            this.revision = t.rev, this.metadata = t.metadata, this.nonce = t.nonce || null, this.changes = t.changes, this._json = null
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new p.Datastore.Delta(t) : t
        }, t.prototype.metadata = null, t.prototype.revision = null, t.prototype.nonce = null, t.prototype.changes = null, t.changes, t.prototype.json = function() {
            return this._json || (this._json = {
                rev: this.revision,
                metadata: this.metadata,
                nonce: this.nonce,
                changes: this.changes
            })
        }, t
    }(), p.Datastore.DeltaSequence = function() {
        function t(t, e) {
            var r;
            this.dsid = e, this._deltas = function() {
                var e, n, i, o;
                for (i = t.deltas, o = [], e = 0, n = i.length; n > e; e++) r = i[e], o.push(p.Datastore.Delta.parse(r));
                return o
            }(), this._json = null
        }
        return t.parse = function(t, e) {
            return t && "object" == typeof t ? new p.Datastore.DeltaSequence(t, e) : t
        }, t.prototype.dsid = null, t.prototype.deltas = function() {
            return this._deltas
        }, t
    }(), p.Datastore.List = function() {
        function t(t, e, r) {
            this._datastore = t, this._record = e, this._field = r
        }
        return t.prototype.toString = function() {
            return "Datastore.List((" + this._record._tid + ", " + this._record._rid + ", " + this._field + "): " + JSON.stringify(this._array) + ")"
        }, t.prototype._array = function() {
            return this._record._rawFieldValues()[this._field]
        }, t.prototype._checkValid = function() {
            if (this._record._checkNotDeleted(), !M.is_array(this._array())) throw new Error("Attempt to operate on deleted list (" + this._record._tid + ", " + this._record._rid + ", " + this._field + ")")
        }, t.prototype._storeUpdate = function(t) {
            var e;
            return e = {}, e[this._field] = t, this._record._storeUpdate(e), void 0
        }, t.prototype._fixInsertionIndex = function(t) {
            var e, r;
            if (!we(t)) throw new RangeError("Index not a number: " + t);
            if (e = this._array().length, r = t >= 0 ? t : e + t, r >= 0 && e >= r) return r;
            throw new RangeError("Bad index for list of length " + e + ": " + t)
        }, t.prototype._fixIndex = function(t) {
            var e, r;
            if (r = this._fixInsertionIndex(t), e = this._array().length, e > r) return r;
            throw new RangeError("Bad index for list of length " + e + ": " + t)
        }, t.prototype.get = function(t) {
            var e;
            return this._checkValid(), e = te(this._array()[this._fixIndex(t)]), ae(void 0, void 0, void 0, e)
        }, t.prototype.set = function(t, e) {
            return this._checkValid(), t = this._fixIndex(t), this._storeUpdate(["LP", t, Ge(e, !1)]), void 0
        }, t.prototype.length = function() {
            return this._checkValid(), this._array().length
        }, t.prototype.pop = function() {
            if (this._checkValid(), 0 === this._array().length) throw new Error("List is empty");
            return this.remove(this._array.length - 1)
        }, t.prototype.push = function(t) {
            return this._checkValid(), this.insert(this._array().length, t), void 0
        }, t.prototype.shift = function() {
            if (this._checkValid(), 0 === this._array().length) throw new Error("List is empty");
            return this.remove(0)
        }, t.prototype.unshift = function(t) {
            return this.insert(0, t), void 0
        }, t.prototype.splice = function() {
            var t, e, r, n, i, o, s, a, u;
            if (n = arguments[0], e = arguments[1], t = 3 <= arguments.length ? sr.call(arguments, 2) : [], this._checkValid(), !we(e) || 0 > e) throw new RangeError("Bad second arg to splice: " + n + ", " + e);
            for (n = this._fixInsertionIndex(n), i = this.slice(n, n + e), r = s = 0; e >= 0 ? e > s : s > e; r = e >= 0 ? ++s : --s) this.remove(n);
            for (a = 0, u = t.length; u > a; a++) o = t[a], this.insert(n, o), n++;
            return i
        }, t.prototype.move = function(t, e) {
            return this._checkValid(), t = this._fixIndex(t), e = this._fixIndex(e), t === e ? void 0 : (this._storeUpdate(["LM", t, e]), void 0)
        }, t.prototype.remove = function(t) {
            return this._checkValid(), t = this._fixIndex(t), this._storeUpdate(["LD", t]), tr
        }, t.prototype.insert = function(t, e) {
            return this._checkValid(), t = this._fixInsertionIndex(t), this._storeUpdate(["LI", t, Ge(e, !1)]), void 0
        }, t.prototype.slice = function(t, e) {
            var r;
            return this._checkValid(),
            function() {
                var n, i, o, s;
                for (o = this._array().slice(t, e), s = [], n = 0, i = o.length; i > n; n++) r = o[n], s.push(ae(void 0, void 0, void 0, r));
                return s
            }.call(this)
        }, t.prototype.toArray = function() {
            var t;
            return this._checkValid(),
            function() {
                var e, r, n, i;
                for (n = this._array().slice(), i = [], e = 0, r = n.length; r > e; e++) t = n[e], i.push(ae(void 0, void 0, void 0, t));
                return i
            }.call(this)
        }, t
    }(), p.Datastore.Record = function() {
        function t(t, e, r) {
            this._datastore = t, this._tid = e, this._rid = r, this._deleted = !1, this._record_cache = this._datastore._record_cache, this._managed_datastore = this._datastore._managed_datastore
        }
        return t.prototype.get = function(t) {
            var e;
            return this._checkNotDeleted(), e = this._rawFieldValues(), t in e ? ae(this._datastore, this, t, e[t]) : null
        }, t.prototype.set = function(t, e) {
            var r;
            return r = {}, r[t] = e, this.update(r)
        }, t.prototype.getFields = function() {
            var t, e, r, n;
            this._checkNotDeleted(), t = {}, n = this._rawFieldValues();
            for (e in n) r = n[e], t[e] = ae(this._datastore, this, e, r);
            return t
        }, t.prototype.update = function(t) {
            var e, r, n;
            this._checkNotDeleted(), e = {};
            for (r in t) n = t[r], e[r] = null != n ? ["P", Ge(n)] : ["D"];
            return this._storeUpdate(e), this
        }, t.prototype.deleteRecord = function() {
            var t;
            return this._checkNotDeleted(), this._deleted = !0, this._record_cache.remove(this._tid, this._rid), t = l.changeFromArray(["D", this._tid, this._rid]), this._managed_datastore.perform_change(t), this._datastore._recordsChangedLocally([this]), this
        }, t.prototype.hasField = function(t) {
            var e;
            return e = this._rawFieldValues(), t in e
        }, t.prototype.getId = function() {
            return this._rid
        }, t.prototype.getTable = function() {
            return this._datastore.getTable(this._tid)
        }, t.prototype.isDeleted = function() {
            return this._deleted
        }, t.prototype.toString = function() {
            var t;
            return t = this.isDeleted() ? "deleted" : JSON.stringify(this.getFields()), "Dropbox.Datastore.Record((" + this._tid + ", " + this._rid + "): " + t + ")"
        }, t.prototype._rawFieldValues = function() {
            return this._managed_datastore.query(this._tid, this._rid)
        }, t.prototype._storeUpdate = function(t) {
            var e;
            e = l.changeFromArray(["U", this._tid, this._rid, t]), this._managed_datastore.perform_change(e), this._datastore._recordsChangedLocally([this])
        }, t.isValidId = function(t) {
            var e;
            return e = new RegExp("^[-._+/=0-9a-zA-Z]{1,32}$"), Se(t) && e.test(t)
        }, t.prototype._checkNotDeleted = function() {
            if (this._deleted) throw new Error("Attempt to operate on deleted record (" + this._tid + ", " + this._rid + ")")
        }, t
    }(), p.Datastore.RecordsChanged = function() {
        function t(t, e) {
            this._recordsByTable = t, this._local = e
        }
        return t.prototype.toString = function() {
            var t, e, r, n, i, o, s;
            i = 0, r = 0, s = this._recordsByTable;
            for (o in s) t = s[o], i += 1, r += t.length;
            return n = "" + i + " " + (1 === i ? "table" : "tables"), e = "" + r + " " + (1 === r ? "record" : "records"), "Dropbox.Datastore.RecordsChanged(" + e + " in " + n + " changed " + (this._local ? "locally" : "remotely") + ")"
        }, t._fromRecordList = function(e, r) {
            var n, i, o, s, a;
            for (i = {}, s = 0, a = e.length; a > s; s++) n = e[s], o = n._tid, null == i[o] && (i[o] = []), i[o].push(n);
            return new t(i, r)
        }, t.prototype.affectedRecordsByTable = function() {
            return this._recordsByTable
        }, t.prototype.affectedRecordsForTable = function(t) {
            var e;
            return null != (e = this._recordsByTable[t]) ? e : []
        }, t.prototype.isLocal = function() {
            return this._local
        }, t
    }(), L = p.Datastore.RecordsChanged, p.Datastore.Snapshot = function() {
        function t(t, e) {
            this.dsid = e, this.revision = t.rev, this._records = t.rows, this._json = null
        }
        return t.parse = function(t, e) {
            return t && "object" == typeof t ? new p.Datastore.Snapshot(t, e) : t
        }, t.prototype.dsid = null, t.prototype.revision = null, t.prototype.records = function() {
            return this._records
        }, t.prototype.json = function() {
            return this._json || (this._json = {
                dsid: this.dsid,
                rev: this.revision,
                rows: this._records
            })
        }, t
    }(), p.Datastore.Stat = function() {
        function t(t, e) {
            this.path = t.path || e || null, this.dsid = t.dbid.toString(), this.revision = "rev" in t ? t.rev : null, this._json = null
        }
        return t.parse = function(t, e) {
            return t && "object" == typeof t ? new p.Datastore.Stat(t, e) : t
        }, t.prototype.path = null, t.prototype.dsid = null, t.prototype.revision = null, t.prototype.json = function() {
            return this._json || (this._json = {
                path: this.path,
                dbid: this.dsid,
                rev: this.revision
            })
        }, t
    }(), p.Datastore.SyncSet = function() {
        function t() {
            this._cursors = {}
        }
        return t.prototype.cursors = function() {
            return this._cursors
        }, t.prototype.set = function(t, e) {
            var r;
            return "object" == typeof t ? (r = t.dsid, e = t.revision) : r = t, this._cursors[r] = e, this
        }, t.prototype.remove = function(t) {
            var e;
            return e = "object" == typeof t ? t.dsid : t, delete this._cursors[e], this
        }, t
    }(), p.Datastore.Table = function() {
        function t(t, e) {
            this._datastore = t, this._tid = e, this._record_cache = this._datastore._record_cache, this._managed_datastore = this._datastore._managed_datastore
        }
        return t.prototype.getId = function() {
            return this._tid
        }, t.prototype.get = function(t) {
            var e, r;
            if (!p.Datastore.Record.isValidId(t)) throw new Error("Invalid record ID: " + t);
            return r = this._record_cache.get(this._tid, t), null != r ? (W(!r._deleted), r) : (e = this._managed_datastore.query(this._tid, t), null == e ? null : this._record_cache.getOrCreate(this._tid, t))
        }, t.prototype.getOrInsert = function(t, e) {
            var r;
            return r = this.get(t), r ? r : this._insertWithId(t, e)
        }, t.prototype.insert = function(t) {
            var e;
            return e = this._datastore._generateRid(), W(null == this.get(e)), this._insertWithId(e, t)
        }, t.prototype.query = function(t) {
            var e, r, n, i, o, s, a;
            for (o = this._managed_datastore.list_rows_for_table(this._tid), n = [], s = 0, a = o.length; a > s; s++) i = o[s], e = this._managed_datastore.query(this._tid, i), (null == t || Te(t, e)) && (r = this.get(i), W(null != r), n.push(r));
            return n
        }, t.prototype.setResolutionRule = function(t, e) {
            if ("remote" !== e && "local" !== e && "min" !== e && "max" !== e && "sum" !== e) throw new Error("" + e + " is not a valid resolution rule. Valid rules are 'remote', 'local', 'min', 'max', and 'sum'.");
            return this._managed_datastore.resolver.add_resolution_rule(this._tid, t, rule_name), this
        }, t.isValidId = function(t) {
            var e;
            return e = new RegExp("^[-._+/=0-9a-zA-Z]{1,32}$"), Se(t) && e.test(t)
        }, t.prototype.toString = function() {
            return "Dropbox.Datastore.Table(" + this._tid + ")"
        }, t.prototype._insertWithId = function(t, e) {
            var r, n, i;
            n = {};
            for (Pe in e) Qe = e[Pe], n[Pe] = Ge(Qe);
            return r = l.changeFromArray(["I", this._tid, t, n]), this._managed_datastore.perform_change(r), i = this._record_cache.getOrCreate(this._tid, t), this._datastore._recordsChangedLocally([i]), i
        }, t
    }(), ee = function(t) {
        var e, r, n;
        for (n = [], e = 0, r = t.length; r > e; e++) Qe = t[e], n.push(te(Qe));
        return n
    }, re = function(t) {
        var e;
        e = {};
        for (Pe in t) Qe = t[Pe], e[Pe] = te(Qe);
        return e
    }, he.clone = te = function(t) {
        return t instanceof Array ? ee(t) : "object" == typeof t ? re(t) : t
    }, z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", je = function(t) {
        return t[Math.floor(Math.random() * t.length)]
    }, Fe = function(t) {
        var e;
        return function() {
            var r, n;
            for (n = [], e = r = 0; t >= 0 ? t > r : r > t; e = t >= 0 ? ++r : --r) n.push(je(z));
            return n
        }().join("")
    }, ye = function(t) {
        return t === !0 || t === !1 || t && "object" == typeof t && t.constructor === Boolean
    }, be = function(t) {
        return "number" == typeof t || t && "object" == typeof t && t.constructor === Number
    }, we = function(t) {
        return be(t) && !isNaN(t) && isFinite(t)
    }, Se = function(t) {
        return "string" == typeof t || t && "object" == typeof t && t.constructor === String
    }, _e = function(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    }, De = function(t) {
        return "[object Uint8Array]" === Object.prototype.toString.call(t)
    }, ge = function(t) {
        return "[object Date]" === Object.prototype.toString.call(t)
    }, me = function(t) {
        for (Pe in t) return !1;
        return !0
    }, he.uint8ArrayFromBase64String = $e = function(t) {
        var e, r, n, i, o;
        for (t = t.replace("-", "+").replace("_", "/"), e = V(t), n = e.length, i = new Uint8Array(n), r = o = 0; n >= 0 ? n > o : o > n; r = n >= 0 ? ++o : --o) i[r] = e.charCodeAt(r);
        return i
    }, he.base64StringFromUint8Array = $ = function(t) {
        var e, r, n, i, o;
        for (r = "", i = 0, o = t.length; o > i; i++) e = t[i], r += String.fromCharCode(e);
        return n = Q(r), n.replace("+", "-").replace("/", "_").replace(/[\=]+$/g, "")
    }, P = "dbxInt64", ve = function(t) {
        var e;
        return t && "object" == typeof t && t.constructor === Number && isFinite(t) ? (e = t[P], !Se(e) || "0" !== e && !Re.test(e) ? !1 : !0) : !1
    }, Ye = function(t) {
        var e, r;
        if (!t && "object" == typeof t && t.constructor === Number && isFinite(t)) throw new Error("Not a finite boxed number: " + t);
        if (r = t[P], !Se(r) || "0" !== r && !Re.test(r)) throw new Error("Missing or invalid tag in int64: " + r);
        if (e = parseInt(r, 10), e !== Number(t)) throw new Error("Tag in int64 does not match value " + Number(t) + ": " + r);
        return t
    }, he.toDsValue = Ge = function(t, e) {
        var r, n;
        if (null == e && (e = !0), null === t || "undefined" == typeof t) throw new Error("Bad value: " + t);
        if (Se(t)) return t;
        if (ye(t)) return t;
        if (be(t)) {
            if (null != t[P]) return Ye(t), {
                I: t[P]
            };
            if (isFinite(t)) return t;
            if (isNaN(t)) return {
                N: "nan"
            };
            if (1 / 0 === Number(t)) return {
                N: "+inf"
            };
            if (Number(t) === -1 / 0) return {
                N: "-inf"
            };
            throw new Error("Unexpected number: " + t)
        }
        if (_e(t)) {
            if (e) return function() {
                var e, r, i;
                for (i = [], e = 0, r = t.length; r > e; e++) n = t[e], i.push(Ge(n, !1));
                return i
            }();
            throw new Error("Nested array not allowed: " + JSON.stringify(t))
        }
        if (ge(t)) return r = Math.round(t.getTime()), {
            T: "" + r
        };
        if (De(t)) return {
            B: $(t)
        };
        throw new Error("Unexpected object: " + JSON.stringify(t))
    }, he.fromDsValue = ae = function(t, e, r, n) {
        if (Se(n)) return n;
        if (ye(n)) return n;
        if (be(n)) return n;
        if (_e(n)) return new p.Datastore.List(t, e, r);
        if ("object" != typeof n) throw new Error("Unexpected value: " + n);
        if (n.I) return ce(n.I);
        if (!n.N) {
            if (n.B) return $e(n.B);
            if (n.T) return new Date(parseInt(n.T, 10));
            throw new Error("Unexpected object: " + JSON.stringify(n))
        }
        switch (n.N) {
            case "nan":
                return 0 / 0;
            case "+inf":
                return 1 / 0;
            case "-inf":
                return -1 / 0;
            default:
                throw new Error("Unexpected object: " + JSON.stringify(n))
        }
    }, he.matchDsValues = Te = function(t, e) {
        var r, n, i;
        n = function(t, e) {
            if (null == t) throw new Error("Unexpected object: " + t);
            return null == e ? !1 : r(t, e)
        }, r = function(t, e) {
            var r, i, o, s, a, u;
            if (Ge(t), Se(t) && Se(e)) return String(t) === String(e);
            if (ye(t) && ye(e)) return "object" == typeof t && (t = t.valueOf()), "object" == typeof e && (e = e.valueOf()), Boolean(t) === Boolean(e);
            if (be(t) && (be(e) || null != e.N || null != e.I)) return e = ae(void 0, void 0, void 0, e), t[P] && e[P] ? (s = [ce(t), ce(e)], t = s[0], e = s[1], String(t[P]) === String(e[P])) : isNaN(t) && isNaN(e) ? !0 : Number(t) === Number(e);
            if (_e(t) && _e(e)) {
                if (t.length !== e.length) return !1;
                for (r = i = 0, a = t.length - 1; a >= 0 ? a >= i : i >= a; r = a >= 0 ? ++i : --i)
                    if (!n(t[r], e[r])) return !1;
                return !0
            }
            if (ge(t) && (ge(e) || null != e.T)) return null != e.T && (e = ae(void 0, void 0, void 0, e)), t - 0 === e - 0;
            if (De(t) && (De(e) || null != e.B)) {
                if (null != e.B && (e = ae(void 0, void 0, void 0, e)), t.length !== e.length) return !1;
                for (r = o = 0, u = t.length - 1; u >= 0 ? u >= o : o >= u; r = u >= 0 ? ++o : --o)
                    if (t[r] !== e[r]) return !1;
                return !0
            }
            return !1
        };
        for (Pe in t)
            if (Qe = t[Pe], i = n(Qe, e[Pe]), !i) return i;
        return !0
    }, I = function() {
        function t(t) {
            this._datastore = t, this._cache = {}
        }
        return t.prototype.get = function(t, e) {
            return null == this._cache[t] ? null : this._cache[t][e]
        }, t.prototype.getOrCreate = function(t, e) {
            var r;
            return null == this._cache[t] && (this._cache[t] = {}), r = this._cache[t][e], null == r && (r = this._cache[t][e] = new p.Datastore.Record(this._datastore, t, e)), r
        }, t.prototype.remove = function(t, e) {
            return delete this._cache[t][e], me(this._cache[t]) && delete this._cache[t], void 0
        }, t
    }(), D = function() {
        function t() {
            this._registered_handlers = []
        }
        return t.prototype.register = function(t, e, r) {
            return t.addListener(e, r), this._registered_handlers.push([t, e, r])
        }, t.prototype.unregister_all = function() {
            var t, e, r, n, i, o, s, a;
            for (o = this._registered_handlers, a = [], n = 0, i = o.length; i > n; n++) s = o[n], r = s[0], t = s[1], e = s[2], a.push(r.removeListener(t, e));
            return a
        }, t
    }(), p.File.ShareUrl = function() {
        function t(t, e) {
            this.url = t.url, this.expiresAt = p.Util.parseDate(t.expires), this.isDirect = e === !0 ? !0 : e === !1 ? !1 : "direct" in t ? t.direct : Date.now() - this.expiresAt <= 864e5, this.isPreview = !this.isDirect, this._json = null
        }
        return t.parse = function(t, e) {
            return t && "object" == typeof t ? new p.File.ShareUrl(t, e) : t
        }, t.prototype.url = null, t.prototype.expiresAt = null, t.prototype.isDirect = null, t.prototype.isPreview = null, t.prototype.json = function() {
            return this._json || (this._json = {
                url: this.url,
                expires: this.expiresAt.toUTCString(),
                direct: this.isDirect
            })
        }, t
    }(), p.File.CopyReference = function() {
        function t(t) {
            "object" == typeof t ? (this.tag = t.copy_ref, this.expiresAt = p.Util.parseDate(t.expires), this._json = t) : (this.tag = t, this.expiresAt = new Date(1e3 * Math.ceil(Date.now() / 1e3)), this._json = null)
        }
        return t.parse = function(t) {
            return !t || "object" != typeof t && "string" != typeof t ? t : new p.File.CopyReference(t)
        }, t.prototype.tag = null, t.prototype.expiresAt = null, t.prototype.json = function() {
            return this._json || (this._json = {
                copy_ref: this.tag,
                expires: this.expiresAt.toUTCString()
            })
        }, t
    }(), p.File.Stat = function() {
        function t(t) {
            var e, r, n, i;
            switch (this._json = t, this.path = t.path, "/" !== this.path.substring(0, 1) && (this.path = "/" + this.path), e = this.path.length - 1, e >= 0 && "/" === this.path.substring(e) && (this.path = this.path.substring(0, e)), r = this.path.lastIndexOf("/"), this.name = this.path.substring(r + 1), this.isFolder = t.is_dir || !1, this.isFile = !this.isFolder, this.isRemoved = t.is_deleted || !1, this.typeIcon = t.icon, this.modifiedAt = (null != (n = t.modified) ? n.length : void 0) ? p.Util.parseDate(t.modified) : null, this.clientModifiedAt = (null != (i = t.client_mtime) ? i.length : void 0) ? p.Util.parseDate(t.client_mtime) : null, t.root) {
                case "dropbox":
                    this.inAppFolder = !1;
                    break;
                case "app_folder":
                    this.inAppFolder = !0;
                    break;
                default:
                    this.inAppFolder = null
            }
            this.size = t.bytes || 0, this.humanSize = t.size || "", this.hasThumbnail = t.thumb_exists || !1, this.versionTag = t.rev, this.contentHash = t.hash || null, this.mimeType = this.isFolder ? t.mime_type || "inode/directory" : t.mime_type || "application/octet-stream"
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new p.File.Stat(t) : t
        }, t.prototype.path = null, t.prototype.name = null, t.prototype.inAppFolder = null, t.prototype.isFolder = null, t.prototype.isFile = null, t.prototype.isRemoved = null, t.prototype.typeIcon = null, t.prototype.versionTag = null, t.prototype.contentHash = null, t.prototype.mimeType = null, t.prototype.size = null, t.prototype.humanSize = null, t.prototype.hasThumbnail = null, t.prototype.modifiedAt = null, t.prototype.clientModifiedAt = null, t.prototype.json = function() {
            return this._json
        }, t
    }(), p.Http.PulledChanges = function() {
        function t(t) {
            var e;
            this.blankSlate = t.reset || !1, this.cursorTag = t.cursor, this.shouldPullAgain = t.has_more, this.shouldBackOff = !this.shouldPullAgain, this.changes = t.cursor && t.cursor.length ? function() {
                var r, n, i, o;
                for (i = t.entries, o = [], r = 0, n = i.length; n > r; r++) e = i[r], o.push(p.Http.PulledChange.parse(e));
                return o
            }() : []
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new p.Http.PulledChanges(t) : t
        }, t.prototype.blankSlate = void 0, t.prototype.cursorTag = void 0, t.prototype.changes = void 0, t.prototype.shouldPullAgain = void 0, t.prototype.shouldBackOff = void 0, t.prototype.cursor = function() {
            return this.cursorTag
        }, t
    }(), p.Http.PulledChange = function() {
        function t(t) {
            this.path = t[0], this.stat = p.File.Stat.parse(t[1]), this.stat ? this.wasRemoved = !1 : (this.stat = null, this.wasRemoved = !0)
        }
        return t.parse = function(t) {
            return t && "object" == typeof t ? new p.Http.PulledChange(t) : t
        }, t.prototype.path = void 0, t.prototype.wasRemoved = void 0, t.prototype.stat = void 0, t
    }(), p.Http.RangeInfo = function() {
        function t(t) {
            var e;
            (e = /^bytes (\d*)-(\d*)\/(.*)$/.exec(t)) ? (this.start = parseInt(e[1]), this.end = parseInt(e[2]), this.size = "*" === e[3] ? null : parseInt(e[3])) : (this.start = 0, this.end = 0, this.size = null)
        }
        return t.parse = function(t) {
            return "string" == typeof t ? new p.Http.RangeInfo(t) : t
        }, t.prototype.start = null, t.prototype.size = null, t.prototype.end = null, t
    }(), p.Http.UploadCursor = function() {
        function t(t) {
            this.replace(t)
        }
        return t.parse = function(t) {
            return !t || "object" != typeof t && "string" != typeof t ? t : new p.Http.UploadCursor(t)
        }, t.prototype.tag = null, t.prototype.offset = null, t.prototype.expiresAt = null, t.prototype.json = function() {
            return this._json || (this._json = {
                upload_id: this.tag,
                offset: this.offset,
                expires: this.expiresAt.toUTCString()
            })
        }, t.prototype.replace = function(t) {
            return "object" == typeof t ? (this.tag = t.upload_id || null, this.offset = t.offset || 0, this.expiresAt = p.Util.parseDate(t.expires) || Date.now(), this._json = t) : (this.tag = t || null, this.offset = 0, this.expiresAt = new Date(1e3 * Math.floor(Date.now() / 1e3)), this._json = null), this
        }, t
    }(), "function" == typeof V && "function" == typeof Q ? (V = function(t) {
        return window.atob(t)
    }, Q = function(t) {
        return window.btoa(t)
    }) : "undefined" == typeof window && "undefined" == typeof self || "undefined" == typeof navigator || "string" != typeof navigator.userAgent ? (V = function(t) {
        var e, r;
        return e = new Buffer(t, "base64"),
        function() {
            var t, n, i;
            for (i = [], r = t = 0, n = e.length; n >= 0 ? n > t : t > n; r = n >= 0 ? ++t : --t) i.push(String.fromCharCode(e[r]));
            return i
        }().join("")
    }, Q = function(t) {
        var e, r;
        return e = new Buffer(function() {
            var e, n, i;
            for (i = [], r = e = 0, n = t.length; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e) i.push(t.charCodeAt(r));
            return i
        }()), e.toString("base64")
    }) : (G = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Y = function(t, e, r) {
        var n, i;
        for (i = 3 - e, t <<= 8 * i, n = 3; n >= i;) r.push(G.charAt(63 & t >> 6 * n)), n -= 1;
        for (n = e; 3 > n;) r.push("="), n += 1;
        return null
    }, J = function(t, e, r) {
        var n, i;
        for (i = 4 - e, t <<= 6 * i, n = 2; n >= i;) r.push(String.fromCharCode(255 & t >> 8 * n)), n -= 1;
        return null
    }, Q = function(t) {
        var e, r, n, i, o, s;
        for (i = [], e = 0, r = 0, n = o = 0, s = t.length; s >= 0 ? s > o : o > s; n = s >= 0 ? ++o : --o) e = e << 8 | t.charCodeAt(n), r += 1, 3 === r && (Y(e, r, i), e = r = 0);
        return r > 0 && Y(e, r, i), i.join("")
    }, V = function(t) {
        var e, r, n, i, o, s, a;
        for (o = [], e = 0, n = 0, i = s = 0, a = t.length;
            (a >= 0 ? a > s : s > a) && (r = t.charAt(i), "=" !== r); i = a >= 0 ? ++s : --s) e = e << 6 | G.indexOf(r), n += 1, 4 === n && (J(e, n, o), e = n = 0);
        return n > 0 && J(e, n, o), o.join("")
    }), p.Util.atob = V, p.Util.btoa = Q, p.Util.hmac = function(t, e) {
        return q(ue(We(t), We(e), t.length, e.length))
    }, p.Util.sha1 = function(t) {
        return q(Xe(We(t), t.length))
    }, "undefined" != typeof require) try {
        ie = require("crypto"), ie.createHmac && ie.createHash && (p.Util.hmac = function(t, e) {
            var r;
            return r = ie.createHmac("sha1", e), r.update(t), r.digest("base64")
        }, p.Util.sha1 = function(t) {
            var e;
            return e = ie.createHash("sha1"), e.update(t), e.digest("base64")
        })
    } catch (ar) {
        Be = ar
    }
    if (ue = function(t, e, r, n) {
        var i, o, s, a;
        return e.length > 16 && (e = Xe(e, n)), s = function() {
            var t, r;
            for (r = [], o = t = 0; 16 > t; o = ++t) r.push(909522486 ^ e[o]);
            return r
        }(), a = function() {
            var t, r;
            for (r = [], o = t = 0; 16 > t; o = ++t) r.push(1549556828 ^ e[o]);
            return r
        }(), i = Xe(s.concat(t), 64 + r), Xe(a.concat(i), 84)
    }, Xe = function(t, e) {
        var r, n, i, o, s, a, u, l, h, c, p, d, f, _, y, g, m, v;
        for (t[e >> 2] |= 1 << 31 - ((3 & e) << 3), t[(e + 8 >> 6 << 4) + 15] = e << 3, g = Array(80), r = 1732584193, i = -271733879, s = -1732584194, u = 271733878, h = -1009589776, d = 0, y = t.length; y > d;) {
            for (n = r, o = i, a = s, l = u, c = h, f = v = 0; 80 > v; f = ++v) g[f] = 16 > f ? t[d + f] : Me(g[f - 3] ^ g[f - 8] ^ g[f - 14] ^ g[f - 16], 1), 20 > f ? (p = i & s | ~i & u, _ = 1518500249) : 40 > f ? (p = i ^ s ^ u, _ = 1859775393) : 60 > f ? (p = i & s | i & u | s & u, _ = -1894007588) : (p = i ^ s ^ u, _ = -899497514), m = H(H(Me(r, 5), p), H(H(h, g[f]), _)), h = u, u = s, s = Me(i, 30), i = r, r = m;
            r = H(r, n), i = H(i, o), s = H(s, a), u = H(u, l), h = H(h, c), d += 16
        }
        return [r, i, s, u, h]
    }, Me = function(t, e) {
        return t << e | t >>> 32 - e
    }, H = function(t, e) {
        var r, n;
        return n = (65535 & t) + (65535 & e), r = (t >> 16) + (e >> 16) + (n >> 16), r << 16 | 65535 & n
    }, q = function(t) {
        var e, r, n, i, o;
        for (i = "", e = 0, n = 4 * t.length; n > e;) r = e, o = (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 16, r += 1, o |= (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 8, r += 1, o |= 255 & t[r >> 2] >> (3 - (3 & r) << 3), i += er[63 & o >> 18], i += er[63 & o >> 12], e += 1, i += e >= n ? "=" : er[63 & o >> 6], e += 1, i += e >= n ? "=" : er[63 & o], e += 1;
        return i
    }, er = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", We = function(t) {
        var e, r, n, i, o;
        for (e = [], n = 255, r = i = 0, o = t.length; o >= 0 ? o > i : i > o; r = o >= 0 ? ++i : --i) e[r >> 2] |= (t.charCodeAt(r) & n) << (3 - (3 & r) << 3);
        return e
    }, p.Util.Oauth = function() {
        function t(t) {
            this._id = null, this._secret = null, this._stateParam = null, this._authCode = null, this._token = null, this._tokenKey = null, this._tokenKid = null, this._error = null, this._appHash = null, this._loaded = null, this.setCredentials(t)
        }
        return t.prototype.setCredentials = function(t) {
            if (t.key) this._id = t.key;
            else {
                if (!t.token) throw new Error("No API key supplied");
                this._id = null
            }
            return this._secret = t.secret || null, this._appHash = null, this._error = null, this._loaded = !0, this.reset(), t.token ? (this._token = t.token, t.tokenKey && (this._tokenKey = t.tokenKey, this._tokenKid = t.tokenKid)) : t.oauthCode ? this._authCode = t.oauthCode : t.oauthStateParam && (this._stateParam = t.oauthStateParam), this
        }, t.prototype.credentials = function() {
            var t;
            return t = {}, this._id && (t.key = this._id), this._secret && (t.secret = this._secret), null !== this._token ? (t.token = this._token, this._tokenKey && (t.tokenKey = this._tokenKey, t.tokenKid = this._tokenKid)) : null !== this._authCode ? t.oauthCode = this._authCode : null !== this._stateParam && (t.oauthStateParam = this._stateParam), t
        }, t.prototype.step = function() {
            return null !== this._token ? p.Client.DONE : null !== this._authCode ? p.Client.AUTHORIZED : null !== this._stateParam ? this._loaded ? p.Client.PARAM_LOADED : p.Client.PARAM_SET : null !== this._error ? p.Client.ERROR : p.Client.RESET
        }, t.prototype.setAuthStateParam = function(t) {
            if (null === this._id) throw new Error("No API key supplied, cannot do authorization");
            return this.reset(), this._loaded = !1, this._stateParam = t, this
        }, t.prototype.checkAuthStateParam = function(t) {
            return this._stateParam === t && null !== this._stateParam
        }, t.prototype.authStateParam = function() {
            return this._stateParam
        }, t.prototype.error = function() {
            return this._error
        }, t.prototype.processRedirectParams = function(t) {
            var e;
            if (t.error) {
                if (null === this._id) throw new Error("No API key supplied, cannot process errors");
                return this.reset(), this._error = new p.AuthError(t), !0
            }
            if (t.code) {
                if (null === this._id) throw new Error("No API key supplied, cannot do Authorization Codes");
                return this.reset(), this._loaded = !1, this._authCode = t.code, !0
            }
            if (e = t.token_type) {
                if (e = e.toLowerCase(), "bearer" !== e && "mac" !== e) throw new Error("Unimplemented token type " + e);
                if (this.reset(), this._loaded = !1, "mac" === e) {
                    if ("hmac-sha-1" !== t.mac_algorithm) throw new Error("Unimplemented MAC algorithms " + t.mac_algorithm);
                    this._tokenKey = t.mac_key, this._tokenKid = t.kid
                }
                return this._token = t.access_token, !0
            }
            return !1
        }, t.prototype.authHeader = function(t, e, r) {
            var n, i;
            return null === this._token ? (i = null === this._secret ? p.Util.btoa("" + this._id + ":") : p.Util.btoa("" + this._id + ":" + this._secret), "Basic " + i) : null === this._tokenKey ? "Bearer " + this._token : (n = this.macParams(t, e, r), "MAC kid=" + n.kid + " ts=" + n.ts + " " + ("access_token=" + this._token + " mac=" + n.mac))
        }, t.prototype.addAuthParams = function(t, e, r) {
            var n;
            return null === this._token ? (r.client_id = this._id, null !== this._secret && (r.client_secret = this._secret)) : (null !== this._tokenKey && (n = this.macParams(t, e, r), r.kid = n.kid, r.ts = n.ts, r.mac = n.mac), r.access_token = this._token), r
        }, t.prototype.authorizeUrlParams = function(t, e) {
            var r;
            if ("token" !== t && "code" !== t) throw new Error("Unimplemented /authorize response type " + t);
            return r = {
                client_id: this._id,
                state: this._stateParam,
                response_type: t
            }, e && (r.redirect_uri = e), r
        }, t.prototype.accessTokenParams = function(t) {
            var e;
            return e = {
                grant_type: "authorization_code",
                code: this._authCode
            }, t && (e.redirect_uri = t), e
        }, t.queryParamsFromUrl = function(t) {
            var e, r, n, i, o, s, a, u, l, h;
            if (i = /^[^?#]+(\?([^\#]*))?(\#(.*))?$/.exec(t), !i) return {};
            for (a = i[2] || "", e = i[4] || "", r = e.indexOf("?"), -1 !== r && (e = e.substring(r + 1)), s = {}, h = a.split("&").concat(e.split("&")), u = 0, l = h.length; l > u; u++) n = h[u], o = n.indexOf("="), -1 !== o && (s[decodeURIComponent(n.substring(0, o))] = decodeURIComponent(n.substring(o + 1)));
            return s
        }, t.prototype.macParams = function(t, e, r) {
            var n, i;
            return n = {
                kid: this._tokenKid,
                ts: p.Util.Oauth.timestamp()
            }, i = t.toUpperCase() + "&" + p.Util.Xhr.urlEncodeValue(e) + "&" + p.Util.Xhr.urlEncodeValue(p.Util.Xhr.urlEncode(r)), n.mac = p.Util.hmac(i, this._tokenKey), n
        }, t.prototype.appHash = function() {
            return this._appHash ? this._appHash : this._appHash = p.Util.sha1("oauth2-" + this._id).replace(/[\/+=]/g, "")
        }, t.prototype.reset = function() {
            return this._stateParam = null, this._authCode = null, this._token = null, this._tokenKey = null, this._tokenKid = null, this
        }, t.timestamp = function() {
            return Math.floor(Date.now() / 1e3)
        }, t.randomAuthStateParam = function() {
            return ["oas", Date.now().toString(36), Math.random().toString(36)].join("_")
        }, t
    }(), null == Date.now && (p.Util.Oauth.timestamp = function() {
        return Math.floor((new Date).getTime() / 1e3)
    }), 2274814865e3 === new Date("Fri, 31 Jan 2042 21:01:05 +0000").valueOf() ? Ie = function(t) {
        return new Date(t)
    } : 2274814865e3 === Date.parse("Fri, 31 Jan 2042 21:01:05 +0000") ? Ie = function(t) {
        return new Date(Date.parse(t))
    } : (Ne = /^\w+\, (\d+) (\w+) (\d+) (\d+)\:(\d+)\:(\d+) (\+\d+|UTC|GMT)$/, Le = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11
    }, Ie = function(t) {
        var e;
        return (e = Ne.exec(t)) ? new Date(Date.UTC(parseInt(e[3]), Le[e[2]], parseInt(e[1]), parseInt(e[4]), parseInt(e[5]), parseInt(e[6]), 0)) : 0 / 0
    }), p.Util.parseDate = Ie, "undefined" == typeof XMLHttpRequest || "undefined" == typeof window && "undefined" == typeof self || "undefined" == typeof navigator || "string" != typeof navigator.userAgent ? (w = require("xhr2"), v = !1, g = !1, m = !1) : ("undefined" == typeof XDomainRequest || "withCredentials" in new XMLHttpRequest ? (w = XMLHttpRequest, v = !1, g = "undefined" != typeof FormData && -1 === navigator.userAgent.indexOf("Firefox")) : (w = XDomainRequest, v = !0, g = !1), m = !0), "undefined" == typeof Uint8Array) y = null, S = !1, b = !1;
    else if (Object.getPrototypeOf ? y = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array(0))).constructor : Object.__proto__ && (y = new Uint8Array(0).__proto__.__proto__.constructor), "undefined" == typeof Blob) S = !1, b = !0;
    else {
        try {
            2 === new Blob([new Uint8Array(2)]).size ? (S = !0, b = !0) : (b = !1, S = 2 === new Blob([new ArrayBuffer(2)]).size)
        } catch (ar) {
            Z = ar, b = !1, S = !1, "undefined" != typeof WebKitBlobBuilder && -1 !== navigator.userAgent.indexOf("Android") && (g = !1)
        }
        y === Object && (b = !1)
    } if (p.Util.Xhr = function() {
        function t(t, e) {
            this.method = t, this.isGet = "GET" === this.method, this.url = e, this.wantHeaders = !1, this.headers = {}, this.params = null, this.body = null, this.preflight = !(this.isGet || "POST" === this.method), this.signed = !1, this.completed = !1, this.responseType = null, this.callback = null, this.xhr = null, this.onError = null
        }
        return t.Request = w, t.ieXdr = v, t.canSendForms = g, t.doesPreflight = m, t.ArrayBufferView = y, t.sendArrayBufferView = b, t.wrapBlob = S, t.prototype.xhr = null, t.prototype.onError = null, t.prototype.setParams = function(t) {
            if (this.signed) throw new Error("setParams called after addOauthParams or addOauthHeader");
            if (this.params) throw new Error("setParams cannot be called twice");
            return this.params = t, this
        }, t.prototype.setCallback = function(t) {
            return this.callback = t, this
        }, t.prototype.signWithOauth = function(t, e) {
            return p.Util.Xhr.ieXdr ? this.addOauthParams(t) : this.preflight || !p.Util.Xhr.doesPreflight ? this.addOauthHeader(t) : this.isGet && e ? this.addOauthHeader(t) : this.addOauthParams(t)
        }, t.prototype.addOauthParams = function(t) {
            if (this.signed) throw new Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), t.addAuthParams(this.method, this.url, this.params), this.signed = !0, this
        }, t.prototype.addOauthHeader = function(t) {
            if (this.signed) throw new Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), this.signed = !0, this.setHeader("Authorization", t.authHeader(this.method, this.url, this.params))
        }, t.prototype.setBody = function(t) {
            if (this.isGet) throw new Error("setBody cannot be called on GET requests");
            if (null !== this.body) throw new Error("Request already has a body");
            return "string" == typeof t || "undefined" != typeof FormData && t instanceof FormData || (this.headers["Content-Type"] = "application/octet-stream", this.preflight = !0), this.body = t, this
        }, t.prototype.setResponseType = function(t) {
            return this.responseType = t, this
        }, t.prototype.setHeader = function(t, e) {
            var r;
            if (this.headers[t]) throw r = this.headers[t], new Error("HTTP header " + t + " already set to " + r);
            if ("Content-Type" === t) throw new Error("Content-Type is automatically computed based on setBody");
            return this.preflight = !0, this.headers[t] = e, this
        }, t.prototype.reportResponseHeaders = function() {
            return this.wantHeaders = !0
        }, t.prototype.setFileField = function(t, e, r, n) {
            var i, o, s, a;
            if (null !== this.body) throw new Error("Request already has a body");
            if (this.isGet) throw new Error("setFileField cannot be called on GET requests");
            if ("object" == typeof r) {
                "undefined" != typeof ArrayBuffer && (r instanceof ArrayBuffer ? p.Util.Xhr.sendArrayBufferView && (r = new Uint8Array(r)) : !p.Util.Xhr.sendArrayBufferView && 0 === r.byteOffset && r.buffer instanceof ArrayBuffer && (r = r.buffer)), n || (n = "application/octet-stream");
                try {
                    r = new Blob([r], {
                        type: n
                    })
                } catch (u) {
                    Z = u, window.WebKitBlobBuilder && (s = new WebKitBlobBuilder, s.append(r), (i = s.getBlob(n)) && (r = i))
                }
                "undefined" != typeof File && r instanceof File && (r = new Blob([r], {
                    type: r.type
                })), a = r instanceof Blob
            } else a = !1;
            return a ? (this.body = new FormData, this.body.append(t, r, e)) : (n || (n = "application/octet-stream"), o = this.multipartBoundary(), this.headers["Content-Type"] = "multipart/form-data; boundary=" + o, this.body = ["--", o, "\r\n", 'Content-Disposition: form-data; name="', t, '"; filename="', e, '"\r\n', "Content-Type: ", n, "\r\n", "Content-Transfer-Encoding: binary\r\n\r\n", r, "\r\n", "--", o, "--", "\r\n"].join(""))
        }, t.prototype.multipartBoundary = function() {
            return [Date.now().toString(36), Math.random().toString(36)].join("----")
        }, t.prototype.paramsToUrl = function() {
            var t;
            return this.params && (t = p.Util.Xhr.urlEncode(this.params), 0 !== t.length && (this.url = [this.url, "?", t].join("")), this.params = null), this
        }, t.prototype.paramsToBody = function() {
            if (this.params) {
                if (null !== this.body) throw new Error("Request already has a body");
                if (this.isGet) throw new Error("paramsToBody cannot be called on GET requests");
                this.headers["Content-Type"] = "application/x-www-form-urlencoded", this.body = p.Util.Xhr.urlEncode(this.params), this.params = null
            }
            return this
        }, t.prototype.prepare = function() {
            var t, e, r, n, i = this;
            if (e = p.Util.Xhr.ieXdr, this.isGet || null !== this.body || e ? (this.paramsToUrl(), null !== this.body && "string" == typeof this.body && (this.headers["Content-Type"] = "text/plain; charset=utf8")) : this.paramsToBody(), this.xhr = new p.Util.Xhr.Request, e ? (this.xhr.onload = function() {
                return i.onXdrLoad()
            }, this.xhr.onerror = function() {
                return i.onXdrError()
            }, this.xhr.ontimeout = function() {
                return i.onXdrError()
            }, this.xhr.onprogress = function() {}) : this.xhr.onreadystatechange = function() {
                return i.onReadyStateChange()
            }, this.xhr.open(this.method, this.url, !0), !e) {
                n = this.headers;
                for (t in n) ir.call(n, t) && (r = n[t], this.xhr.setRequestHeader(t, r))
            }
            return this.responseType && ("b" === this.responseType ? this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined") : this.xhr.responseType = this.responseType), this
        }, t.prototype.send = function(t) {
            var e, r;
            if (this.callback = t || this.callback, null !== this.body) {
                e = this.body, p.Util.Xhr.sendArrayBufferView ? e instanceof ArrayBuffer && (e = new Uint8Array(e)) : 0 === e.byteOffset && e.buffer instanceof ArrayBuffer && (e = e.buffer);
                try {
                    this.xhr.send(e)
                } catch (n) {
                    if (r = n, p.Util.Xhr.sendArrayBufferView || !p.Util.Xhr.wrapBlob) throw r;
                    e = new Blob([e], {
                        type: "application/octet-stream"
                    }), this.xhr.send(e)
                }
            } else this.xhr.send();
            return this
        }, t.urlEncode = function(t) {
            var e, r, n;
            e = [];
            for (r in t) n = t[r], e.push(this.urlEncodeValue(r) + "=" + this.urlEncodeValue(n));
            return e.sort().join("&")
        }, t.urlEncodeValue = function(t) {
            return encodeURIComponent(t.toString()).replace(/\!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
        }, t.urlDecode = function(t) {
            var e, r, n, i, o, s;
            for (r = {}, s = t.split("&"), i = 0, o = s.length; o > i; i++) n = s[i], e = n.split("="), r[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            return r
        }, t.prototype.onReadyStateChange = function() {
            var t, e, r, n, i, o, s, a, u, l, h, c, d, f;
            if (4 !== this.xhr.readyState) return !0;
            if (this.completed) return !0;
            if (this.completed = !0, this.xhr.status < 200 || this.xhr.status >= 300) return e = new p.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(e, this.callback) : this.callback(e), !0;
            if (this.wantHeaders ? (t = this.xhr.getAllResponseHeaders(), o = t ? p.Util.Xhr.parseResponseHeaders(t) : this.guessResponseHeaders(), l = o["x-dropbox-metadata"]) : (o = void 0, l = this.xhr.getResponseHeader("x-dropbox-metadata")), null != l ? l.length : void 0) try {
                u = JSON.parse(l)
            } catch (_) {
                a = _, u = void 0
            } else u = void 0;
            if (this.responseType) {
                if ("b" === this.responseType) {
                    for (i = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, r = [], s = d = 0, f = i.length; f >= 0 ? f > d : d > f; s = f >= 0 ? ++d : --d) r.push(String.fromCharCode(255 & i.charCodeAt(s)));
                    c = r.join(""), this.callback(null, c, u, o)
                } else this.callback(null, this.xhr.response, u, o);
                return !0
            }
            switch (c = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, n = this.xhr.getResponseHeader("Content-Type"), n && (h = n.indexOf(";"), -1 !== h && (n = n.substring(0, h))), n) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, p.Util.Xhr.urlDecode(c), u, o);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(c), u, o);
                    break;
                default:
                    this.callback(null, c, u, o)
            }
            return !0
        }, t.parseResponseHeaders = function(t) {
            var e, r, n, i, o, s, a, u;
            for (n = {}, r = t.split("\n"), a = 0, u = r.length; u > a; a++) i = r[a], e = i.indexOf(":"), o = i.substring(0, e).trim().toLowerCase(), s = i.substring(e + 1).trim(), n[o] = s;
            return n
        }, t.prototype.guessResponseHeaders = function() {
            var t, e, r, n, i, o;
            for (t = {}, o = ["cache-control", "content-language", "content-range", "content-type", "expires", "last-modified", "pragma", "x-dropbox-metadata"], n = 0, i = o.length; i > n; n++) e = o[n], r = this.xhr.getResponseHeader(e), r && (t[e] = r);
            return t
        }, t.prototype.onXdrLoad = function() {
            var t, e, r;
            if (this.completed) return !0;
            if (this.completed = !0, r = this.xhr.responseText, t = this.wantHeaders ? {
                "content-type": this.xhr.contentType
            } : void 0, e = void 0, this.responseType) return this.callback(null, r, e, t), !0;
            switch (this.xhr.contentType) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, p.Util.Xhr.urlDecode(r), e, t);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(r), e, t);
                    break;
                default:
                    this.callback(null, r, e, t)
            }
            return !0
        }, t.prototype.onXdrError = function() {
            var t;
            return this.completed ? !0 : (this.completed = !0, t = new p.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(t, this.callback) : this.callback(t), !0)
        }, t
    }(), "undefined" != typeof module && "exports" in module) module.exports = p;
    else if ("undefined" != typeof window && null !== window)
        if (window.Dropbox)
            for (ke in p) ir.call(p, ke) && (tr = p[ke], window.Dropbox[ke] = tr);
        else window.Dropbox = p;
        else {
            if ("undefined" == typeof self || null === self) throw new Error("This library only supports node.js and modern browsers.");
            self.Dropbox = p
        }
    p.File.PublicUrl = p.File.ShareUrl, p.UserInfo = p.AccountInfo
}.call(this);
