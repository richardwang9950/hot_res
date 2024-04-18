System.register("chunks:///_virtual/protobuf.min.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      exports('default', void 0);
      let _cjsExports;
      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);
      loader.define(__cjsMetaURL, function (exports$1, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE

        /*!
         * protobuf.js v6.10.0 (c) 2016, daniel wirtz
         * compiled wed, 15 jul 2020 23:34:14 utc
         * licensed under the bsd-3-clause license
         * see: https://github.com/dcodeio/protobuf.js for details
         */
        !function (d) {
          var r, u, t, n;
          r = {
            1: [function (t, n) {
              n.exports = function (t, n) {
                var i = Array(arguments.length - 1),
                  e = 0,
                  r = 2,
                  s = !0;
                for (; r < arguments.length;) i[e++] = arguments[r++];
                return new Promise(function (r, u) {
                  i[e] = function (t) {
                    if (s) if (s = !1, t) u(t);else {
                      for (var n = Array(arguments.length - 1), i = 0; i < n.length;) n[i++] = arguments[i];
                      r.apply(null, n);
                    }
                  };
                  try {
                    t.apply(n || null, i);
                  } catch (t) {
                    s && (s = !1, u(t));
                  }
                });
              };
            }, {}],
            2: [function (t, n, i) {
              var r = i;
              r.length = function (t) {
                var n = t.length;
                if (!n) return 0;
                for (var i = 0; 1 < --n % 4 && "=" == t[0 | n];) ++i;
                return Math.ceil(3 * t.length) / 4 - i;
              };
              for (var o = Array(64), f = Array(123), u = 0; u < 64;) f[o[u] = u < 26 ? u + 65 : u < 52 ? u + 71 : u < 62 ? u - 4 : u - 59 | 43] = u++;
              r.encode = function (t, n, i) {
                for (var r, u = null, e = [], s = 0, h = 0; n < i;) {
                  var f = t[n++];
                  switch (h) {
                    case 0:
                      e[s++] = o[f >> 2], r = (3 & f) << 4, h = 1;
                      break;
                    case 1:
                      e[s++] = o[r | f >> 4], r = (15 & f) << 2, h = 2;
                      break;
                    case 2:
                      e[s++] = o[r | f >> 6], e[s++] = o[63 & f], h = 0;
                  }
                  8191 < s && ((u = u || []).push(String.fromCharCode.apply(String, e)), s = 0);
                }
                return h && (e[s++] = o[r], e[s++] = 61, 1 === h && (e[s++] = 61)), u ? (s && u.push(String.fromCharCode.apply(String, e.slice(0, s))), u.join("")) : String.fromCharCode.apply(String, e.slice(0, s));
              };
              var c = "invalid encoding";
              r.decode = function (t, n, i) {
                for (var r, u = i, e = 0, s = 0; s < t.length;) {
                  var h = t.charCodeAt(s++);
                  if (61 === h && 1 < e) break;
                  if ((h = f[h]) === d) throw Error(c);
                  switch (e) {
                    case 0:
                      r = h, e = 1;
                      break;
                    case 1:
                      n[i++] = r << 2 | (48 & h) >> 4, r = h, e = 2;
                      break;
                    case 2:
                      n[i++] = (15 & r) << 4 | (60 & h) >> 2, r = h, e = 3;
                      break;
                    case 3:
                      n[i++] = (3 & r) << 6 | h, e = 0;
                  }
                }
                if (1 === e) throw Error(c);
                return i - u;
              }, r.test = function (t) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t);
              };
            }, {}],
            3: [function (t, n) {
              function i() {
                this.t = {};
              }
              (n.exports = i).prototype.on = function (t, n, i) {
                return (this.t[t] || (this.t[t] = [])).push({
                  fn: n,
                  ctx: i || this
                }), this;
              }, i.prototype.off = function (t, n) {
                if (t === d) this.t = {};else if (n === d) this.t[t] = [];else for (var i = this.t[t], r = 0; r < i.length;) i[r].fn === n ? i.splice(r, 1) : ++r;
                return this;
              }, i.prototype.emit = function (t) {
                var n = this.t[t];
                if (n) {
                  for (var i = [], r = 1; r < arguments.length;) i.push(arguments[r++]);
                  for (r = 0; r < n.length;) n[r].fn.apply(n[r++].ctx, i);
                }
                return this;
              };
            }, {}],
            4: [function (t, n) {
              function i(t) {
                function n(t, n, i, r) {
                  var u = n < 0 ? 1 : 0;
                  if (u && (n = -n), 0 === n) t(0 < 1 / n ? 0 : 2147483648, i, r);else if (isNaN(n)) t(2143289344, i, r);else if (34028234663852886e22 < n) t((u << 31 | 2139095040) >>> 0, i, r);else if (n < 11754943508222875e-54) t((u << 31 | Math.round(n / 1401298464324817e-60)) >>> 0, i, r);else {
                    var e = Math.floor(Math.log(n) / Math.LN2);
                    t((u << 31 | 127 + e << 23 | 8388607 & Math.round(n * Math.pow(2, -e) * 8388608)) >>> 0, i, r);
                  }
                }
                function i(t, n, i) {
                  var r = t(n, i),
                    u = 2 * (r >> 31) + 1,
                    e = r >>> 23 & 255,
                    s = 8388607 & r;
                  return 255 == e ? s ? NaN : 1 / 0 * u : 0 == e ? 1401298464324817e-60 * u * s : u * Math.pow(2, e - 150) * (8388608 + s);
                }
                function r(t, n, i) {
                  h[0] = t, n[i] = f[0], n[i + 1] = f[1], n[i + 2] = f[2], n[i + 3] = f[3];
                }
                function u(t, n, i) {
                  h[0] = t, n[i] = f[3], n[i + 1] = f[2], n[i + 2] = f[1], n[i + 3] = f[0];
                }
                function e(t, n) {
                  return f[0] = t[n], f[1] = t[n + 1], f[2] = t[n + 2], f[3] = t[n + 3], h[0];
                }
                function s(t, n) {
                  return f[3] = t[n], f[2] = t[n + 1], f[1] = t[n + 2], f[0] = t[n + 3], h[0];
                }
                var h, f, o, c, a, l;
                function v(t, n, i, r, u, e) {
                  var s = r < 0 ? 1 : 0;
                  if (s && (r = -r), 0 === r) t(0, u, e + n), t(0 < 1 / r ? 0 : 2147483648, u, e + i);else if (isNaN(r)) t(0, u, e + n), t(2146959360, u, e + i);else if (17976931348623157e292 < r) t(0, u, e + n), t((s << 31 | 2146435072) >>> 0, u, e + i);else {
                    var h;
                    if (r < 22250738585072014e-324) t((h = r / 5e-324) >>> 0, u, e + n), t((s << 31 | h / 4294967296) >>> 0, u, e + i);else {
                      var f = Math.floor(Math.log(r) / Math.LN2);
                      1024 === f && (f = 1023), t(4503599627370496 * (h = r * Math.pow(2, -f)) >>> 0, u, e + n), t((s << 31 | f + 1023 << 20 | 1048576 * h & 1048575) >>> 0, u, e + i);
                    }
                  }
                }
                function w(t, n, i, r, u) {
                  var e = t(r, u + n),
                    s = t(r, u + i),
                    h = 2 * (s >> 31) + 1,
                    f = s >>> 20 & 2047,
                    o = 4294967296 * (1048575 & s) + e;
                  return 2047 == f ? o ? NaN : 1 / 0 * h : 0 == f ? 5e-324 * h * o : h * Math.pow(2, f - 1075) * (o + 4503599627370496);
                }
                function y(t, n, i) {
                  c[0] = t, n[i] = a[0], n[i + 1] = a[1], n[i + 2] = a[2], n[i + 3] = a[3], n[i + 4] = a[4], n[i + 5] = a[5], n[i + 6] = a[6], n[i + 7] = a[7];
                }
                function b(t, n, i) {
                  c[0] = t, n[i] = a[7], n[i + 1] = a[6], n[i + 2] = a[5], n[i + 3] = a[4], n[i + 4] = a[3], n[i + 5] = a[2], n[i + 6] = a[1], n[i + 7] = a[0];
                }
                function d(t, n) {
                  return a[0] = t[n], a[1] = t[n + 1], a[2] = t[n + 2], a[3] = t[n + 3], a[4] = t[n + 4], a[5] = t[n + 5], a[6] = t[n + 6], a[7] = t[n + 7], c[0];
                }
                function g(t, n) {
                  return a[7] = t[n], a[6] = t[n + 1], a[5] = t[n + 2], a[4] = t[n + 3], a[3] = t[n + 4], a[2] = t[n + 5], a[1] = t[n + 6], a[0] = t[n + 7], c[0];
                }
                return "undefined" != typeof Float32Array ? (h = new Float32Array([-0]), f = new Uint8Array(h.buffer), o = 128 === f[3], t.writeFloatLE = o ? r : u, t.writeFloatBE = o ? u : r, t.readFloatLE = o ? e : s, t.readFloatBE = o ? s : e) : (t.writeFloatLE = n.bind(null, A), t.writeFloatBE = n.bind(null, p), t.readFloatLE = i.bind(null, m), t.readFloatBE = i.bind(null, j)), "undefined" != typeof Float64Array ? (c = new Float64Array([-0]), a = new Uint8Array(c.buffer), l = 128 === a[7], t.writeDoubleLE = l ? y : b, t.writeDoubleBE = l ? b : y, t.readDoubleLE = l ? d : g, t.readDoubleBE = l ? g : d) : (t.writeDoubleLE = v.bind(null, A, 0, 4), t.writeDoubleBE = v.bind(null, p, 4, 0), t.readDoubleLE = w.bind(null, m, 0, 4), t.readDoubleBE = w.bind(null, j, 4, 0)), t;
              }
              function A(t, n, i) {
                n[i] = 255 & t, n[i + 1] = t >>> 8 & 255, n[i + 2] = t >>> 16 & 255, n[i + 3] = t >>> 24;
              }
              function p(t, n, i) {
                n[i] = t >>> 24, n[i + 1] = t >>> 16 & 255, n[i + 2] = t >>> 8 & 255, n[i + 3] = 255 & t;
              }
              function m(t, n) {
                return (t[n] | t[n + 1] << 8 | t[n + 2] << 16 | t[n + 3] << 24) >>> 0;
              }
              function j(t, n) {
                return (t[n] << 24 | t[n + 1] << 16 | t[n + 2] << 8 | t[n + 3]) >>> 0;
              }
              n.exports = i(i);
            }, {}],
            5: [function (t, n, i) {
              function r(t) {
                try {
                  var n = eval("require")(t);
                  if (n && (n.length || Object.keys(n).length)) return n;
                } catch (t) {}
                return null;
              }
              n.exports = r;
            }, {}],
            6: [function (t, n) {
              n.exports = function (i, r, t) {
                var u = t || 8192,
                  e = u >>> 1,
                  s = null,
                  h = u;
                return function (t) {
                  if (t < 1 || e < t) return i(t);
                  u < h + t && (s = i(u), h = 0);
                  var n = r.call(s, h, h += t);
                  return 7 & h && (h = 1 + (7 | h)), n;
                };
              };
            }, {}],
            7: [function (t, n, i) {
              var r = i;
              r.length = function (t) {
                for (var n = 0, i = 0, r = 0; r < t.length; ++r) (i = t.charCodeAt(r)) < 128 ? n += 1 : i < 2048 ? n += 2 : 55296 == (64512 & i) && 56320 == (64512 & t.charCodeAt(r + 1)) ? (++r, n += 4) : n += 3;
                return n;
              }, r.read = function (t, n, i) {
                if (i - n < 1) return "";
                for (var r, u = null, e = [], s = 0; n < i;) (r = t[n++]) < 128 ? e[s++] = r : 191 < r && r < 224 ? e[s++] = (31 & r) << 6 | 63 & t[n++] : 239 < r && r < 365 ? (r = ((7 & r) << 18 | (63 & t[n++]) << 12 | (63 & t[n++]) << 6 | 63 & t[n++]) - 65536, e[s++] = 55296 + (r >> 10), e[s++] = 56320 + (1023 & r)) : e[s++] = (15 & r) << 12 | (63 & t[n++]) << 6 | 63 & t[n++], 8191 < s && ((u = u || []).push(String.fromCharCode.apply(String, e)), s = 0);
                return u ? (s && u.push(String.fromCharCode.apply(String, e.slice(0, s))), u.join("")) : String.fromCharCode.apply(String, e.slice(0, s));
              }, r.write = function (t, n, i) {
                for (var r, u, e = i, s = 0; s < t.length; ++s) (r = t.charCodeAt(s)) < 128 ? n[i++] = r : (r < 2048 ? n[i++] = r >> 6 | 192 : (55296 == (64512 & r) && 56320 == (64512 & (u = t.charCodeAt(s + 1))) ? (r = 65536 + ((1023 & r) << 10) + (1023 & u), ++s, n[i++] = r >> 18 | 240, n[i++] = r >> 12 & 63 | 128) : n[i++] = r >> 12 | 224, n[i++] = r >> 6 & 63 | 128), n[i++] = 63 & r | 128);
                return i - e;
              };
            }, {}],
            8: [function (t, n, i) {
              var r = i;
              function u() {
                r.util.n(), r.Writer.n(r.BufferWriter), r.Reader.n(r.BufferReader);
              }
              r.build = "minimal", r.Writer = t(16), r.BufferWriter = t(17), r.Reader = t(9), r.BufferReader = t(10), r.util = t(15), r.rpc = t(12), r.roots = t(11), (r.configure = u)();
            }, {
              10: 10,
              11: 11,
              12: 12,
              15: 15,
              16: 16,
              17: 17,
              9: 9
            }],
            9: [function (t, n) {
              n.exports = h;
              var i,
                r = t(15),
                u = r.LongBits,
                e = r.utf8;
              function s(t, n) {
                return RangeError("index out of range: " + t.pos + " + " + (n || 1) + " > " + t.len);
              }
              function h(t) {
                this.buf = t, this.pos = 0, this.len = t.length;
              }
              function f() {
                return r.Buffer ? function (t) {
                  return (h.create = function (t) {
                    return r.Buffer.isBuffer(t) ? new i(t) : c(t);
                  })(t);
                } : c;
              }
              var o,
                c = "undefined" != typeof Uint8Array ? function (t) {
                  if (t instanceof Uint8Array || Array.isArray(t)) return new h(t);
                  throw Error("illegal buffer");
                } : function (t) {
                  if (Array.isArray(t)) return new h(t);
                  throw Error("illegal buffer");
                };
              function a() {
                var t = new u(0, 0),
                  n = 0;
                if (!(4 < this.len - this.pos)) {
                  for (; n < 3; ++n) {
                    if (this.pos >= this.len) throw s(this);
                    if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * n) >>> 0, this.buf[this.pos++] < 128) return t;
                  }
                  return t.lo = (t.lo | (127 & this.buf[this.pos++]) << 7 * n) >>> 0, t;
                }
                for (; n < 4; ++n) if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * n) >>> 0, this.buf[this.pos++] < 128) return t;
                if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 28) >>> 0, t.hi = (t.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return t;
                if (n = 0, 4 < this.len - this.pos) {
                  for (; n < 5; ++n) if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * n + 3) >>> 0, this.buf[this.pos++] < 128) return t;
                } else for (; n < 5; ++n) {
                  if (this.pos >= this.len) throw s(this);
                  if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * n + 3) >>> 0, this.buf[this.pos++] < 128) return t;
                }
                throw Error("invalid varint encoding");
              }
              function l(t, n) {
                return (t[n - 4] | t[n - 3] << 8 | t[n - 2] << 16 | t[n - 1] << 24) >>> 0;
              }
              function v() {
                if (this.pos + 8 > this.len) throw s(this, 8);
                return new u(l(this.buf, this.pos += 4), l(this.buf, this.pos += 4));
              }
              h.create = f(), h.prototype.i = r.Array.prototype.subarray || r.Array.prototype.slice, h.prototype.uint32 = (o = 4294967295, function () {
                if (o = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128) return o;
                if (o = (o | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) return o;
                if (o = (o | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) return o;
                if (o = (o | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) return o;
                if (o = (o | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128) return o;
                if ((this.pos += 5) > this.len) throw this.pos = this.len, s(this, 10);
                return o;
              }), h.prototype.int32 = function () {
                return 0 | this.uint32();
              }, h.prototype.sint32 = function () {
                var t = this.uint32();
                return t >>> 1 ^ -(1 & t) | 0;
              }, h.prototype.bool = function () {
                return 0 !== this.uint32();
              }, h.prototype.fixed32 = function () {
                if (this.pos + 4 > this.len) throw s(this, 4);
                return l(this.buf, this.pos += 4);
              }, h.prototype.sfixed32 = function () {
                if (this.pos + 4 > this.len) throw s(this, 4);
                return 0 | l(this.buf, this.pos += 4);
              }, h.prototype.float = function () {
                if (this.pos + 4 > this.len) throw s(this, 4);
                var t = r.float.readFloatLE(this.buf, this.pos);
                return this.pos += 4, t;
              }, h.prototype.double = function () {
                if (this.pos + 8 > this.len) throw s(this, 4);
                var t = r.float.readDoubleLE(this.buf, this.pos);
                return this.pos += 8, t;
              }, h.prototype.bytes = function () {
                var t = this.uint32(),
                  n = this.pos,
                  i = this.pos + t;
                if (i > this.len) throw s(this, t);
                return this.pos += t, Array.isArray(this.buf) ? this.buf.slice(n, i) : n === i ? new this.buf.constructor(0) : this.i.call(this.buf, n, i);
              }, h.prototype.string = function () {
                var t = this.bytes();
                return e.read(t, 0, t.length);
              }, h.prototype.skip = function (t) {
                if ("number" == typeof t) {
                  if (this.pos + t > this.len) throw s(this, t);
                  this.pos += t;
                } else do {
                  if (this.pos >= this.len) throw s(this);
                } while (128 & this.buf[this.pos++]);
                return this;
              }, h.prototype.skipType = function (t) {
                switch (t) {
                  case 0:
                    this.skip();
                    break;
                  case 1:
                    this.skip(8);
                    break;
                  case 2:
                    this.skip(this.uint32());
                    break;
                  case 3:
                    for (; 4 != (t = 7 & this.uint32());) this.skipType(t);
                    break;
                  case 5:
                    this.skip(4);
                    break;
                  default:
                    throw Error("invalid wire type " + t + " at offset " + this.pos);
                }
                return this;
              }, h.n = function (t) {
                i = t, h.create = f(), i.n();
                var n = r.Long ? "toLong" : "toNumber";
                r.merge(h.prototype, {
                  int64: function () {
                    return a.call(this)[n](!1);
                  },
                  uint64: function () {
                    return a.call(this)[n](!0);
                  },
                  sint64: function () {
                    return a.call(this).zzDecode()[n](!1);
                  },
                  fixed64: function () {
                    return v.call(this)[n](!0);
                  },
                  sfixed64: function () {
                    return v.call(this)[n](!1);
                  }
                });
              };
            }, {
              15: 15
            }],
            10: [function (t, n) {
              n.exports = u;
              var i = t(9);
              (u.prototype = Object.create(i.prototype)).constructor = u;
              var r = t(15);
              function u(t) {
                i.call(this, t);
              }
              u.n = function () {
                r.Buffer && (u.prototype.i = r.Buffer.prototype.slice);
              }, u.prototype.string = function () {
                var t = this.uint32();
                return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + t, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + t, this.len));
              }, u.n();
            }, {
              15: 15,
              9: 9
            }],
            11: [function (t, n) {
              n.exports = {};
            }, {}],
            12: [function (t, n, i) {
              i.Service = t(13);
            }, {
              13: 13
            }],
            13: [function (t, n) {
              n.exports = i;
              var h = t(15);
              function i(t, n, i) {
                if ("function" != typeof t) throw TypeError("rpcImpl must be a function");
                h.EventEmitter.call(this), this.rpcImpl = t, this.requestDelimited = !!n, this.responseDelimited = !!i;
              }
              ((i.prototype = Object.create(h.EventEmitter.prototype)).constructor = i).prototype.rpcCall = function t(i, n, r, u, e) {
                if (!u) throw TypeError("request must be specified");
                var s = this;
                if (!e) return h.asPromise(t, s, i, n, r, u);
                if (!s.rpcImpl) return setTimeout(function () {
                  e(Error("already ended"));
                }, 0), d;
                try {
                  return s.rpcImpl(i, n[s.requestDelimited ? "encodeDelimited" : "encode"](u).finish(), function (t, n) {
                    if (t) return s.emit("error", t, i), e(t);
                    if (null === n) return s.end(!0), d;
                    if (!(n instanceof r)) try {
                      n = r[s.responseDelimited ? "decodeDelimited" : "decode"](n);
                    } catch (t) {
                      return s.emit("error", t, i), e(t);
                    }
                    return s.emit("data", n, i), e(null, n);
                  });
                } catch (t) {
                  return s.emit("error", t, i), setTimeout(function () {
                    e(t);
                  }, 0), d;
                }
              }, i.prototype.end = function (t) {
                return this.rpcImpl && (t || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this;
              };
            }, {
              15: 15
            }],
            14: [function (t, n) {
              n.exports = u;
              var i = t(15);
              function u(t, n) {
                this.lo = t >>> 0, this.hi = n >>> 0;
              }
              var e = u.zero = new u(0, 0);
              e.toNumber = function () {
                return 0;
              }, e.zzEncode = e.zzDecode = function () {
                return this;
              }, e.length = function () {
                return 1;
              };
              var r = u.zeroHash = "\0\0\0\0\0\0\0\0";
              u.fromNumber = function (t) {
                if (0 === t) return e;
                var n = t < 0;
                n && (t = -t);
                var i = t >>> 0,
                  r = (t - i) / 4294967296 >>> 0;
                return n && (r = ~r >>> 0, i = ~i >>> 0, 4294967295 < ++i && (i = 0, 4294967295 < ++r && (r = 0))), new u(i, r);
              }, u.from = function (t) {
                if ("number" == typeof t) return u.fromNumber(t);
                if (i.isString(t)) {
                  if (!i.Long) return u.fromNumber(parseInt(t, 10));
                  t = i.Long.fromString(t);
                }
                return t.low || t.high ? new u(t.low >>> 0, t.high >>> 0) : e;
              }, u.prototype.toNumber = function (t) {
                if (!t && this.hi >>> 31) {
                  var n = 1 + ~this.lo >>> 0,
                    i = ~this.hi >>> 0;
                  return n || (i = i + 1 >>> 0), -(n + 4294967296 * i);
                }
                return this.lo + 4294967296 * this.hi;
              }, u.prototype.toLong = function (t) {
                return i.Long ? new i.Long(0 | this.lo, 0 | this.hi, !!t) : {
                  low: 0 | this.lo,
                  high: 0 | this.hi,
                  unsigned: !!t
                };
              };
              var s = String.prototype.charCodeAt;
              u.fromHash = function (t) {
                return t === r ? e : new u((s.call(t, 0) | s.call(t, 1) << 8 | s.call(t, 2) << 16 | s.call(t, 3) << 24) >>> 0, (s.call(t, 4) | s.call(t, 5) << 8 | s.call(t, 6) << 16 | s.call(t, 7) << 24) >>> 0);
              }, u.prototype.toHash = function () {
                return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
              }, u.prototype.zzEncode = function () {
                var t = this.hi >> 31;
                return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ t) >>> 0, this.lo = (this.lo << 1 ^ t) >>> 0, this;
              }, u.prototype.zzDecode = function () {
                var t = -(1 & this.lo);
                return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ t) >>> 0, this.hi = (this.hi >>> 1 ^ t) >>> 0, this;
              }, u.prototype.length = function () {
                var t = this.lo,
                  n = (this.lo >>> 28 | this.hi << 4) >>> 0,
                  i = this.hi >>> 24;
                return 0 == i ? 0 == n ? t < 16384 ? t < 128 ? 1 : 2 : t < 2097152 ? 3 : 4 : n < 16384 ? n < 128 ? 5 : 6 : n < 2097152 ? 7 : 8 : i < 128 ? 9 : 10;
              };
            }, {
              15: 15
            }],
            15: [function (t, n, i) {
              var r = i;
              function u(t, n, i) {
                for (var r = Object.keys(n), u = 0; u < r.length; ++u) t[r[u]] !== d && i || (t[r[u]] = n[r[u]]);
                return t;
              }
              function e(t) {
                function i(t, n) {
                  if (!(this instanceof i)) return new i(t, n);
                  Object.defineProperty(this, "message", {
                    get: function () {
                      return t;
                    }
                  }), Error.captureStackTrace ? Error.captureStackTrace(this, i) : Object.defineProperty(this, "stack", {
                    value: Error().stack || ""
                  }), n && u(this, n);
                }
                return (i.prototype = Object.create(Error.prototype)).constructor = i, Object.defineProperty(i.prototype, "name", {
                  get: function () {
                    return t;
                  }
                }), i.prototype.toString = function () {
                  return this.name + ": " + this.message;
                }, i;
              }
              r.asPromise = t(1), r.base64 = t(2), r.EventEmitter = t(3), r.float = t(4), r.inquire = t(5), r.utf8 = t(7), r.pool = t(6), r.LongBits = t(14), r.isNode = !!("undefined" != typeof global && global && global.process && global.process.versions && global.process.versions.node), r.global = r.isNode && global || "undefined" != typeof window && window || "undefined" != typeof self && self || this, r.emptyArray = Object.freeze ? Object.freeze([]) : [], r.emptyObject = Object.freeze ? Object.freeze({}) : {}, r.isInteger = Number.isInteger || function (t) {
                return "number" == typeof t && isFinite(t) && Math.floor(t) === t;
              }, r.isString = function (t) {
                return "string" == typeof t || t instanceof String;
              }, r.isObject = function (t) {
                return t && "object" == typeof t;
              }, r.isset = r.isSet = function (t, n) {
                var i = t[n];
                return null != i && t.hasOwnProperty(n) && ("object" != typeof i || 0 < (Array.isArray(i) ? i.length : Object.keys(i).length));
              }, r.Buffer = function () {
                try {
                  var t = r.inquire("buffer").Buffer;
                  return t.prototype.utf8Write ? t : null;
                } catch (t) {
                  return null;
                }
              }(), r.r = null, r.u = null, r.newBuffer = function (t) {
                return "number" == typeof t ? r.Buffer ? r.u(t) : new r.Array(t) : r.Buffer ? r.r(t) : "undefined" == typeof Uint8Array ? t : new Uint8Array(t);
              }, r.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array, r.Long = r.global.dcodeIO && r.global.dcodeIO.Long || r.global.Long || r.inquire("long"), r.key2Re = /^true|false|0|1$/, r.key32Re = /^-?(?:0|[1-9][0-9]*)$/, r.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, r.longToHash = function (t) {
                return t ? r.LongBits.from(t).toHash() : r.LongBits.zeroHash;
              }, r.longFromHash = function (t, n) {
                var i = r.LongBits.fromHash(t);
                return r.Long ? r.Long.fromBits(i.lo, i.hi, n) : i.toNumber(!!n);
              }, r.merge = u, r.lcFirst = function (t) {
                return t[0].toLowerCase() + t.substring(1);
              }, r.newError = e, r.ProtocolError = e("ProtocolError"), r.oneOfGetter = function (t) {
                for (var i = {}, n = 0; n < t.length; ++n) i[t[n]] = 1;
                return function () {
                  for (var t = Object.keys(this), n = t.length - 1; -1 < n; --n) if (1 === i[t[n]] && this[t[n]] !== d && null !== this[t[n]]) return t[n];
                };
              }, r.oneOfSetter = function (i) {
                return function (t) {
                  for (var n = 0; n < i.length; ++n) i[n] !== t && delete this[i[n]];
                };
              }, r.toJSONOptions = {
                longs: String,
                enums: String,
                bytes: String,
                json: !0
              }, r.n = function () {
                var i = r.Buffer;
                i ? (r.r = i.from !== Uint8Array.from && i.from || function (t, n) {
                  return new i(t, n);
                }, r.u = i.allocUnsafe || function (t) {
                  return new i(t);
                }) : r.r = r.u = null;
              };
            }, {
              1: 1,
              14: 14,
              2: 2,
              3: 3,
              4: 4,
              5: 5,
              6: 6,
              7: 7
            }],
            16: [function (t, n) {
              n.exports = c;
              var i,
                r = t(15),
                u = r.LongBits,
                e = r.base64,
                s = r.utf8;
              function h(t, n, i) {
                this.fn = t, this.len = n, this.next = d, this.val = i;
              }
              function f() {}
              function o(t) {
                this.head = t.head, this.tail = t.tail, this.len = t.len, this.next = t.states;
              }
              function c() {
                this.len = 0, this.head = new h(f, 0, 0), this.tail = this.head, this.states = null;
              }
              function a() {
                return r.Buffer ? function () {
                  return (c.create = function () {
                    return new i();
                  })();
                } : function () {
                  return new c();
                };
              }
              function l(t, n, i) {
                n[i] = 255 & t;
              }
              function v(t, n) {
                this.len = t, this.next = d, this.val = n;
              }
              function w(t, n, i) {
                for (; t.hi;) n[i++] = 127 & t.lo | 128, t.lo = (t.lo >>> 7 | t.hi << 25) >>> 0, t.hi >>>= 7;
                for (; 127 < t.lo;) n[i++] = 127 & t.lo | 128, t.lo = t.lo >>> 7;
                n[i++] = t.lo;
              }
              function y(t, n, i) {
                n[i] = 255 & t, n[i + 1] = t >>> 8 & 255, n[i + 2] = t >>> 16 & 255, n[i + 3] = t >>> 24;
              }
              c.create = a(), c.alloc = function (t) {
                return new r.Array(t);
              }, r.Array !== Array && (c.alloc = r.pool(c.alloc, r.Array.prototype.subarray)), c.prototype.e = function (t, n, i) {
                return this.tail = this.tail.next = new h(t, n, i), this.len += n, this;
              }, (v.prototype = Object.create(h.prototype)).fn = function (t, n, i) {
                for (; 127 < t;) n[i++] = 127 & t | 128, t >>>= 7;
                n[i] = t;
              }, c.prototype.uint32 = function (t) {
                return this.len += (this.tail = this.tail.next = new v((t >>>= 0) < 128 ? 1 : t < 16384 ? 2 : t < 2097152 ? 3 : t < 268435456 ? 4 : 5, t)).len, this;
              }, c.prototype.int32 = function (t) {
                return t < 0 ? this.e(w, 10, u.fromNumber(t)) : this.uint32(t);
              }, c.prototype.sint32 = function (t) {
                return this.uint32((t << 1 ^ t >> 31) >>> 0);
              }, c.prototype.int64 = c.prototype.uint64 = function (t) {
                var n = u.from(t);
                return this.e(w, n.length(), n);
              }, c.prototype.sint64 = function (t) {
                var n = u.from(t).zzEncode();
                return this.e(w, n.length(), n);
              }, c.prototype.bool = function (t) {
                return this.e(l, 1, t ? 1 : 0);
              }, c.prototype.sfixed32 = c.prototype.fixed32 = function (t) {
                return this.e(y, 4, t >>> 0);
              }, c.prototype.sfixed64 = c.prototype.fixed64 = function (t) {
                var n = u.from(t);
                return this.e(y, 4, n.lo).e(y, 4, n.hi);
              }, c.prototype.float = function (t) {
                return this.e(r.float.writeFloatLE, 4, t);
              }, c.prototype.double = function (t) {
                return this.e(r.float.writeDoubleLE, 8, t);
              };
              var b = r.Array.prototype.set ? function (t, n, i) {
                n.set(t, i);
              } : function (t, n, i) {
                for (var r = 0; r < t.length; ++r) n[i + r] = t[r];
              };
              c.prototype.bytes = function (t) {
                var n = t.length >>> 0;
                if (!n) return this.e(l, 1, 0);
                if (r.isString(t)) {
                  var i = c.alloc(n = e.length(t));
                  e.decode(t, i, 0), t = i;
                }
                return this.uint32(n).e(b, n, t);
              }, c.prototype.string = function (t) {
                var n = s.length(t);
                return n ? this.uint32(n).e(s.write, n, t) : this.e(l, 1, 0);
              }, c.prototype.fork = function () {
                return this.states = new o(this), this.head = this.tail = new h(f, 0, 0), this.len = 0, this;
              }, c.prototype.reset = function () {
                return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new h(f, 0, 0), this.len = 0), this;
              }, c.prototype.ldelim = function () {
                var t = this.head,
                  n = this.tail,
                  i = this.len;
                return this.reset().uint32(i), i && (this.tail.next = t.next, this.tail = n, this.len += i), this;
              }, c.prototype.finish = function () {
                for (var t = this.head.next, n = this.constructor.alloc(this.len), i = 0; t;) t.fn(t.val, n, i), i += t.len, t = t.next;
                return n;
              }, c.n = function (t) {
                i = t, c.create = a(), i.n();
              };
            }, {
              15: 15
            }],
            17: [function (t, n) {
              n.exports = u;
              var i = t(16);
              (u.prototype = Object.create(i.prototype)).constructor = u;
              var r = t(15);
              function u() {
                i.call(this);
              }
              function e(t, n, i) {
                t.length < 40 ? r.utf8.write(t, n, i) : n.utf8Write ? n.utf8Write(t, i) : n.write(t, i);
              }
              u.n = function () {
                u.alloc = r.u, u.writeBytesBuffer = r.Buffer && r.Buffer.prototype instanceof Uint8Array && "set" === r.Buffer.prototype.set.name ? function (t, n, i) {
                  n.set(t, i);
                } : function (t, n, i) {
                  if (t.copy) t.copy(n, i, 0, t.length);else for (var r = 0; r < t.length;) n[i++] = t[r++];
                };
              }, u.prototype.bytes = function (t) {
                r.isString(t) && (t = r.r(t, "base64"));
                var n = t.length >>> 0;
                return this.uint32(n), n && this.e(u.writeBytesBuffer, n, t), this;
              }, u.prototype.string = function (t) {
                var n = r.Buffer.byteLength(t);
                return this.uint32(n), n && this.e(e, n, t), this;
              }, u.n();
            }, {
              15: 15,
              16: 16
            }]
          }, u = {}, t = [8], n = function t(n) {
            var i = u[n];
            return i || r[n][0].call(i = u[n] = {
              exports: {}
            }, t, i, i.exports), i.exports;
          }(t[0]), n.util.global.protobuf = n, "function" == typeof define && define.amd && define(["long"], function (t) {
            return t && t.isLong && (n.util.Long = t, n.configure()), n;
          }), "object" == typeof module && module && module.exports && (module.exports = n);
        }();

        // #endregion ORIGINAL CODE

        _cjsExports = exports('default', module.exports);
      }, {});
    }
  };
});

System.register("chunks:///_virtual/protobuf.min.mjs_cjs=&original=.js", ['./protobuf.min.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;
  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './protobuf.min.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./protobuf.min.js', module.meta.url);
      }
      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/protobufoops-framework.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      exports('default', void 0);
      let _cjsExports;
      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);
      loader.define(__cjsMetaURL, function (exports$1, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE

        // Common aliases
        var $Reader = protobuf.Reader,
          $Writer = protobuf.Writer,
          $util = protobuf.util;

        // Exported root namespace
        var $root = protobuf.roots.creator || (protobuf.roots.creator = $util.global);
        $root.Person = function () {
          /**
           * Properties of a Person.
           * @exports IPerson
           * @interface IPerson
           * @property {string|null} [name] Person name
           * @property {number|null} [id] Person id
           */

          /**
           * Constructs a new Person.
           * @exports Person
           * @classdesc Represents a Person.
           * @implements IPerson
           * @constructor
           * @param {IPerson=} [p] Properties to set
           */
          function Person(p) {
            if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
          }

          /**
           * Person name.
           * @member {string} name
           * @memberof Person
           * @instance
           */
          Person.prototype.name = "";

          /**
           * Person id.
           * @member {number} id
           * @memberof Person
           * @instance
           */
          Person.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

          /**
           * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
           * @function encode
           * @memberof Person
           * @static
           * @param {IPerson} m Person message or plain object to encode
           * @param {protobuf.Writer} [w] Writer to encode to
           * @returns {protobuf.Writer} Writer
           */
          Person.encode = function encode(m, w) {
            if (!w) w = $Writer.create();
            if (m.name != null && Object.hasOwnProperty.call(m, "name")) w.uint32(10).string(m.name);
            if (m.id != null && Object.hasOwnProperty.call(m, "id")) w.uint32(16).uint64(m.id);
            return w;
          };

          /**
           * Decodes a Person message from the specified reader or buffer.
           * @function decode
           * @memberof Person
           * @static
           * @param {protobuf.Reader|Uint8Array} r Reader or buffer to decode from
           * @param {number} [l] Message length if known beforehand
           * @returns {Person} Person
           * @throws {Error} If the payload is not a reader or valid buffer
           * @throws {protobuf.util.ProtocolError} If required fields are missing
           */
          Person.decode = function decode(r, l) {
            if (!(r instanceof $Reader)) r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l,
              m = new $root.Person();
            while (r.pos < c) {
              var t = r.uint32();
              switch (t >>> 3) {
                case 1:
                  m.name = r.string();
                  break;
                case 2:
                  m.id = r.uint64();
                  break;
                default:
                  r.skipType(t & 7);
                  break;
              }
            }
            return m;
          };
          return Person;
        }();

        // #endregion ORIGINAL CODE

        _cjsExports = exports('default', module.exports);
      }, {});
    }
  };
});

System.register("chunks:///_virtual/protobufoops-framework.mjs_cjs=&original=.js", ['./protobufoops-framework.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;
  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './protobufoops-framework.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./protobufoops-framework.js', module.meta.url);
      }
      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/resources", ['./protobuf.min.mjs_cjs=&original=.js', './protobufoops-framework.mjs_cjs=&original=.js'], function () {
  return {
    setters: [null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/resources', 'chunks:///_virtual/resources'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});