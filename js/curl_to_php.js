/*! cURL to PHP */

curl_to_php = {}

curl_to_php.transform = function (c, w) {

    if (typeof w == "string") w = curl_to_php.container[w + '_writter']()
    if (!w) w = curl_to_php.container['php_writter']()
    try {
        c = curl_to_php.tokenize(c)
    }
    catch (e) {
        return w.error(e.message).toString()
    }
    if (typeof c.T_BINARY == "undefined") return w.toString()
    if (typeof c.T_VERSION != "undefined")
        return w.version(c.T_BINARY).toString()
    if (typeof c.T_HELP != "undefined") {
        w.comment('\n' +
            'NAME\n' +
            '       *curl-to-php* - transform curl command to PHP source code\n\n' +
            'SUPPORTED OPTIONS\n' +
            '       Options can given in short or long arguments. The short\n' +
            '       "single-dash" form with no space between it and its value is\n' +
            '       not supported.\n\n' +
            '       -V|--version\n' +
            '              Execute a system call to current installed cURL in\n' +
            '              your computer and parse version number from it.\n\n' +
            '       -h|--help\n' +
            '              Usage help. This text.\n\n' +
            '       --license\n' +
            '              Source code ISC license.\n\n' +
            'EXAMPLES\n' +
            '       `curl echoip.com`\n' +
            '       `curl -i \'https://musicbrainz.org/ws/2/artist/?query=area:Argentina\'`\n' +
            '       `curl --http2 -A "Googlebot/2.1 (+http://www.google.com/bot.html)" https://google.com`\n' +
            '       `curl -I -H "X-First-Name: Joe" http://192.168.0.1/`\n' +
            '       `curl -u "john:doe" --basic --digest ldap.intranet`\n' +
            '       `curl -L --max-redirs 3 https://goo.gl/MSOejW`\n' +
            '       `curl -H "Referer: http://localhost" -H "Cookie: ae=d; p=-1" ddg.gg --data "q=javascript+union&t=ffab"`\n' +
            '       `curl -v -k -X PURGE https://www.example.com/assets/image.jpg`\n\n' +
            'CHANGELOG\n' +
            '       Version 0.7 -- First public version.\n' +
            '       Version 0.8 -- Implement -k/--insecure and ignore -v/--verbose\n'
        )
        return w.toString()
    }
    if (typeof c.T_LICENSE != "undefined") {
        w.comment('Copyright © 2016 Juan M Martínez\n\n' +
            'Permission to use, copy, modify, and/or distribute this software for\n' +
            'any purpose with or without fee is hereby granted, provided that the\n' +
            'above copyright notice and this permission notice appear in all\n' +
            'copies.\n\n' +
            'THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH\n' +
            'REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\n' +
            'MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY\n' +
            'SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\n' +
            'WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN\n' +
            'ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT\n' +
            'OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n'
        )
        return w.toString()
    }
    if (typeof c.T_URL == "undefined")
        return w.error("undefined url").toString()
    var i, h = typeof c.T_HEADER != "undefined"
        ? (typeof c.T_HEADER == "string" ? [c.T_HEADER] : c.T_HEADER).map(unquote)
        : [], d = typeof c.T_DATA != "undefined"
        ? (typeof c.T_DATA == "string" ? [c.T_DATA] : c.T_DATA).map(unquote) : []
    var o = {
        'user-agent': 'CURLOPT_USERAGENT',
        'referer': 'CURLOPT_REFERER',
        'cookie': 'CURLOPT_COOKIE',
    }
    var m = 'GET', f = h2f(h, o), h = h.filter(function (l, x) {
        var n
        for (n in o) if (o.hasOwnProperty(n))
            if (n == l.substr(0, n.length).toLowerCase())
                return false
        return true
    })
    f['CURLOPT_RETURNTRANSFER'] = true
    f['CURLOPT_HEADER'] = false
    f['CURLOPT_HTTP_VERSION'] = 'CURL_HTTP_VERSION_1_1'
    if (typeof c.T_METHOD != "undefined")
        f['CURLOPT_CUSTOMREQUEST'] = m = unquote(typeof c.T_METHOD == "string"
            ? c.T_METHOD : c.T_METHOD.pop()).toUpperCase()
    if (typeof c.T_GET != "undefined") {
        m = 'GET';
        c['CURLOPT_HTTPGET'] = true
    }
    if (typeof c.T_URL == "string")
        f['CURLOPT_URL'] = unquote(c.T_URL)
    if (typeof c.T_HTTP10 != "undefined")
        f['CURLOPT_HTTP_VERSION'] = "CURL_HTTP_VERSION_1_0"
    if (typeof c.T_HTTP2 != "undefined")
        f['CURLOPT_HTTP_VERSION'] = "CURL_HTTP_VERSION_2_0"
    if (typeof c.T_USER_AGENT != "undefined")
        f['CURLOPT_USERAGENT'] = unquote(c.T_USER_AGENT)
    if (typeof c.T_INSECURE != "undefined")
        f['CURLOPT_SSL_VERIFYPEER'] = false
    if (typeof c.T_INCLUDE != "undefined")
        f['CURLOPT_HEADER'] = true
    if (typeof c.T_HEAD != "undefined") {
        f['CURLOPT_CUSTOMREQUEST'] = "HEAD"
        f['CURLOPT_NOBODY'] = true
        delete f['CURLOPT_FILE']
        delete f['CURLOPT_INFILE']
    }
    if (typeof c.T_LOCATION != "undefined")
        f['CURLOPT_FOLLOWLOCATION'] = true
    if (typeof c.T_MAXREDIRS != "undefined")
        f['CURLOPT_MAXREDIRS'] = typeof c.T_MAXREDIRS == "string"
            ? c.T_MAXREDIRS : c.T_MAXREDIRS.pop()
    if (typeof c.T_MAXTIME != "undefined")
        f['CURLOPT_CONNECTTIMEOUT'] = typeof c.T_MAXTIME == "string"
            ? c.T_MAXTIME : c.T_MAXTIME.pop()
    if (typeof c.T_USER != "undefined") {
        f['CURLOPT_USERPWD'] = unquote(typeof c.T_USER == "string"
            ? c.T_USER : c.T_USER.pop())
        if (typeof c.T_BASIC != "undefined")
            f['CURLOPT_HTTPAUTH'] = "CURLAUTH_BASIC"
        if (typeof c.T_DIGEST != "undefined")
            f['CURLOPT_HTTPAUTH'] = typeof f['CURLOPT_HTTPAUTH'] == "undefined"
                ? "CURLAUTH_DIGEST" : f['CURLOPT_HTTPAUTH'] + " | CURLAUTH_DIGEST"
    }
    if (typeof c.T_COOKIE != "undefined")
        f['CURLOPT_COOKIE'] = unquote(typeof c.T_COOKIE == "string"
            ? c.T_COOKIE : c.T_COOKIE.pop())
    if (typeof c.T_COOKIEJAR != "undefined")
        f['CURLOPT_COOKIEJAR'] = unquote(typeof c.T_COOKIEJAR == "string"
            ? c.T_COOKIEJAR : c.T_COOKIEJAR.pop())
    if (typeof c.T_DATA != "undefined")
        f['CURLOPT_CUSTOMREQUEST'] = m = 'POST'
    if (m == 'PUT' || m == 'POST')
        f['CURLOPT_POSTFIELDS'] = d.join('&')
    w = w.curl_init().curl_setopt(f).curl_setheaders(h)
    if (typeof c.T_URL == "string") w = w.curl_exec(); else
        for (i = 0; i < c.T_URL.length; i++) w = w.curl_exec(c.T_URL[i])
    w = w.curl_close()
    return w.toString()
    function h2f(h, o) {
        var i = 0, f = {}, n
        for (; i < h.length; i++) for (n in o) {
            if (!o.hasOwnProperty(n)) continue
            if (n == h[i].substr(0, n.length).toLowerCase())
                f[o[n]] = h[i].substr(n.length + 1).trim()
        }
        return f
    }

    function unquote(s) {
        return s.replace(/^['"]+|['"]+$/g, '')
    }
}

curl_to_php.tokenize = function (c) {
    var i, t, s = {}, o = 0
    c = c.trim()
    if (c[0] == '$' || c[0] == '#') c = c.substr(1).trim()
    while (o < c.length) {
        t = curl_to_php.tokenize.match(c.substring(o))
        if (!t) throw new Error("argument *" + c.substring(o).replace(/\s+.*$/g, "") + "* not reconized")
        o = o + t.length
        if (typeof s[t.token] == "undefined") s[t.token] = t.match
        else if (typeof s[t.token] == "string") s[t.token] = [s[t.token], t.match]
        else s[t.token].push(t.match)
    }
    return s
}

curl_to_php.tokenize.match = function (c) {
    var t, d, s = curl_to_php.tokenize.tokens
    for (t in s) {
        if (!s.hasOwnProperty(t)) continue
        d = c.match(s[t])
        if (d) return {token: t, match: d[1], length: d[0].length}
    }
}

curl_to_php.tokenize.tokens = {
    T_BINARY: /^(curl)(\s+|$)/,
    T_VERSION: /^\s*(-V|--version)(\s+|$)/,
    T_HELP: /^\s*(-h|--help)(\s+|$)/,
    T_LICENSE: /^\s*(--license)(\s+|$)/,

    T_HTTP10: /^\s*(-0|--http1.0)(\s+|$)/,
    T_HTTP11: /^\s*(--http1.1)(\s+|$)/,
    T_HTTP2: /^\s*(--http2)(\s+|$)/,

    T_INSECURE: /^\s*(-k|--insecure)(\s+|$)/,
    T_INCLUDE: /^\s*(-i|--include)(\s+|$)/,
    T_HEAD: /^\s*(-I|--head)(\s+|$)/,
    T_HEADER: /^\s*(?:-H|--header)\s+(['"][^"']+['"]|[^-\s]+)(\s+|$)/,
    T_METHOD: /^\s*(?:-X|--method)\s+(['"][^"']+['"]|[^-\s]+)(\s+|$)/,
    T_USER_AGENT: /^\s*(?:-A|--user-agent)\s+(['"][^"']+['"]|[^-\s]+)(\s+|$)/,

    T_VERBOSE: /^\s*(-v|--verbose)(\s+|$)/,
    /* T_SILENT: /^\s*(-s|--silent)(\s+|$)/, */
    /* T_SHOWERROR: /^\s*(-S|--show-error)(\s+|$)/, */
    T_LOCATION: /^\s*(-L|--location)(\s+|$)/,
    T_MAXREDIRS: /^\s*--max-redirs\s+([^-\s]+)(\s+|$)/,
    T_MAXTIME: /^\s*(-m|--max-time)\s+([^-\s]+)(\s+|$)/,

    T_GET: /^\s*(-G|--get)(\s+|$)/,
    T_USER: /^\s*(?:-u|--user)\s+(['"][^":]+:[^":]+['"]|[^-\s]+:[^-\s]+)(\s+|$)/,
    T_BASIC: /^\s*(--basic)(\s+|$)/,
    T_DIGEST: /^\s*(--digest)(\s+|$)/,
    /* T_NTLM: /^\s*(--ntlm)(\s+|$)/, */

    T_COOKIE: /^\s*(?:-b|--cookie)\s+(['"][^"=]+=[^"]+['"]|[^-\s]+=[^-\s]+)(\s+|$)/,
    T_COOKIEJAR: /^\s*(?:-c|--cookie-jar)\s+(['"][^"]+['"]|[^-\s]+)(\s+|$)/,

    T_DATA: /^\s*(?:-d|--data)\s+(['"][^"=]+=[^"]+['"]|[^-\s]+=[^-\s]+)(\s+|$)/,

    // must be the last one
    T_URL: /^\s*(?!-)([-"'A-Za-z0-9+&@#/%?=~_|!:,.;]+)(\s+|$)/,
}

curl_to_php.container = {}

curl_to_php.container['php_writter'] = function () {
    return new curl_to_php.PHPWriter()
}

curl_to_php.PHPWriter = function () {
    this.s = "<&#63;php \n\n"
}

curl_to_php.PHPWriter.prototype.toString = function () {
    return this.s
}

curl_to_php.PHPWriter.prototype.comment = function (c) {
    var i = 0, l = c.split("\n")
    for (; i < l.length; i++) this.s += "// " + l[i] + "\n"
    this.s += "\n"
    return this
}

curl_to_php.PHPWriter.prototype.error = function (e) {
    return this.comment("parse failed: " + e)
        .comment("curl-to-php: try `curl --help` for more information")
}

curl_to_php.PHPWriter.prototype.version = function (b) {
    this.s += "$ret = exec('" + b + " --version', $out);\n"
        + "$ver = $ret ? current(explode(\"\\n\", $out)) : 'curl 42';\n\n"
        + "if (version_compare($ver, '7.47.0', '>=')) {\n   print('OK');\n}"
    return this
}

curl_to_php.PHPWriter.prototype.curl_init = function () {
    this.s += "$curl = curl_init();\n"
    return this
}

curl_to_php.PHPWriter.prototype.curl_close = function () {
    this.s += "curl_close($curl);\n"
    return this
}

curl_to_php.PHPWriter.prototype.curl_setopt = function (o) {
    this.s += "curl_setopt_array($curl, " + this.array(o) + ");\n"
    return this
}

curl_to_php.PHPWriter.prototype.curl_setheaders = function (s) {
    if (s.length > 0)
        this.s += "curl_setopt($curl, CURLOPT_HTTPHEADER, " + this.seq(s) + ");\n"
    return this
}

curl_to_php.PHPWriter.prototype.curl_exec = function (u) {
    if (typeof u == "string")
        this.s += "curl_setopt($curl, CURLOPT_URL, " + this.param(u) + ");\n"
    this.s += "$response = curl_exec($curl);\n"
        + "if (curl_errno($curl)) {\n"
        + "   throw new \\RuntimeException(sprintf('cURL error %s: %s'"
        + ", curl_errno($curl), curl_error($curl)));\n"
        + "}\n"
    return this
}

curl_to_php.PHPWriter.prototype.param = function (v) {
    if (typeof v == "boolean") return v ? 'true' : 'false'
    if (typeof v == "string") {
        if (v == v.toUpperCase() && v.substr(0, 4) == "CURL") return v
        return "'" + v + "'"
    }
    return v
}

curl_to_php.PHPWriter.prototype.array = function (a) {
    var k, l = []
    for (k in a) {
        if (!a.hasOwnProperty(k)) continue
        l.push("   " + this.param(k) + " => " + this.param(a[k]) + ",")
    }
    return "array(\n" + l.join("\n") + "\n)"
}

curl_to_php.PHPWriter.prototype.seq = function (a) {
    var i, l = []
    for (i = 0; i < a.length; i++) {
        l.push("   " + this.param(a[i]) + ",")
    }
    return "array(\n" + l.join("\n") + "\n)"
}

curl_to_php.tokenize_test = function () {
    var e, a, p = curl_to_php.tokenize_test.data
    for (c in p) {
        if (!p.hasOwnProperty(c)) continue
        a = curl_to_php.tokenize(c)
        if (cmp(p[c], a)) console.info('OK "' + c + '"')
        else {
            console.error({exp: p[c], act: a, sub: c})
            return false
        }
    }
    return true
    function cmp(a, b) {
        var k, sa = 0, sb = 0
        for (k in a) if (a.hasOwnProperty(k)) sa++
        for (k in b) if (b.hasOwnProperty(k)) sb++
        if (sa != sb) return false
        for (k in a) if (a.hasOwnProperty(k) && b.hasOwnProperty(k))
            if (a[k].toString() !== b[k].toString()) return false
        return true
    }
}

curl_to_php.tokenize_test.data = {
    'carl': {T_URL: 'carl'},
    'curl': {T_BINARY: 'curl'},
    'curl -V': {T_BINARY: 'curl', T_VERSION: '-V'},
    'curl --version': {T_BINARY: 'curl', T_VERSION: '--version'},
    'curl echoip.com': {T_BINARY: 'curl', T_URL: 'echoip.com'},
    'curl --http1.0': {T_BINARY: 'curl', T_HTTP10: '--http1.0'},
    'curl --http1.1': {T_BINARY: 'curl', T_HTTP11: '--http1.1'},
    'curl --http2': {T_BINARY: 'curl', T_HTTP2: '--http2'},
    'curl -L --max-redirs 1 goo.gl': {
        T_BINARY: 'curl', T_URL: 'goo.gl',
        T_LOCATION: '-L', T_MAXREDIRS: '1',
    },
    'curl google.com yahoo.com microsoft.com': {
        T_BINARY: 'curl', T_URL: ['google.com', 'yahoo.com', 'microsoft.com'],
    },
}


var hljs = new function () {
    function l(o) {
        return o.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
    }

    function b(p) {
        for (var o = p.firstChild; o; o = o.nextSibling) {
            if (o.nodeName == "CODE") {
                return o
            }
            if (!(o.nodeType == 3 && o.nodeValue.match(/\s+/))) {
                break
            }
        }
    }

    function h(p, o) {
        return Array.prototype.map.call(p.childNodes, function (q) {
            if (q.nodeType == 3) {
                return o ? q.nodeValue.replace(/\n/g, "") : q.nodeValue
            }
            if (q.nodeName == "BR") {
                return "\n"
            }
            return h(q, o)
        }).join("")
    }

    function a(q) {
        var p = (q.className + " " + q.parentNode.className).split(/\s+/);
        p = p.map(function (r) {
            return r.replace(/^language-/, "")
        });
        for (var o = 0; o < p.length; o++) {
            if (e[p[o]] || p[o] == "no-highlight") {
                return p[o]
            }
        }
    }

    function c(q) {
        var o = [];
        (function p(r, s) {
            for (var t = r.firstChild; t; t = t.nextSibling) {
                if (t.nodeType == 3) {
                    s += t.nodeValue.length
                } else {
                    if (t.nodeName == "BR") {
                        s += 1
                    } else {
                        if (t.nodeType == 1) {
                            o.push({event: "start", offset: s, node: t});
                            s = p(t, s);
                            o.push({event: "stop", offset: s, node: t})
                        }
                    }
                }
            }
            return s
        })(q, 0);
        return o
    }

    function j(x, v, w) {
        var p = 0;
        var y = "";
        var r = [];

        function t() {
            if (x.length && v.length) {
                if (x[0].offset != v[0].offset) {
                    return (x[0].offset < v[0].offset) ? x : v
                } else {
                    return v[0].event == "start" ? x : v
                }
            } else {
                return x.length ? x : v
            }
        }

        function s(A) {
            function z(B) {
                return " " + B.nodeName + '="' + l(B.value) + '"'
            }

            return "<" + A.nodeName + Array.prototype.map.call(A.attributes, z).join("") + ">"
        }

        while (x.length || v.length) {
            var u = t().splice(0, 1)[0];
            y += l(w.substr(p, u.offset - p));
            p = u.offset;
            if (u.event == "start") {
                y += s(u.node);
                r.push(u.node)
            } else {
                if (u.event == "stop") {
                    var o, q = r.length;
                    do {
                        q--;
                        o = r[q];
                        y += ("</" + o.nodeName.toLowerCase() + ">")
                    } while (o != u.node);
                    r.splice(q, 1);
                    while (q < r.length) {
                        y += s(r[q]);
                        q++
                    }
                }
            }
        }
        return y + l(w.substr(p))
    }

    function f(q) {
        function o(s, r) {
            return RegExp(s, "m" + (q.cI ? "i" : "") + (r ? "g" : ""))
        }

        function p(y, w) {
            if (y.compiled) {
                return
            }
            y.compiled = true;
            var s = [];
            if (y.k) {
                var r = {};

                function z(A, t) {
                    t.split(" ").forEach(function (B) {
                        var C = B.split("|");
                        r[C[0]] = [A, C[1] ? Number(C[1]) : 1];
                        s.push(C[0])
                    })
                }

                y.lR = o(y.l || hljs.IR, true);
                if (typeof y.k == "string") {
                    z("keyword", y.k)
                } else {
                    for (var x in y.k) {
                        if (!y.k.hasOwnProperty(x)) {
                            continue
                        }
                        z(x, y.k[x])
                    }
                }
                y.k = r
            }
            if (w) {
                if (y.bWK) {
                    y.b = "\\b(" + s.join("|") + ")\\s"
                }
                y.bR = o(y.b ? y.b : "\\B|\\b");
                if (!y.e && !y.eW) {
                    y.e = "\\B|\\b"
                }
                if (y.e) {
                    y.eR = o(y.e)
                }
                y.tE = y.e || "";
                if (y.eW && w.tE) {
                    y.tE += (y.e ? "|" : "") + w.tE
                }
            }
            if (y.i) {
                y.iR = o(y.i)
            }
            if (y.r === undefined) {
                y.r = 1
            }
            if (!y.c) {
                y.c = []
            }
            for (var v = 0; v < y.c.length; v++) {
                if (y.c[v] == "self") {
                    y.c[v] = y
                }
                p(y.c[v], y)
            }
            if (y.starts) {
                p(y.starts, w)
            }
            var u = [];
            for (var v = 0; v < y.c.length; v++) {
                u.push(y.c[v].b)
            }
            if (y.tE) {
                u.push(y.tE)
            }
            if (y.i) {
                u.push(y.i)
            }
            y.t = u.length ? o(u.join("|"), true) : {
                    exec: function (t) {
                        return null
                    }
                }
        }

        p(q)
    }

    function d(D, E) {
        function o(r, M) {
            for (var L = 0; L < M.c.length; L++) {
                var K = M.c[L].bR.exec(r);
                if (K && K.index == 0) {
                    return M.c[L]
                }
            }
        }

        function s(K, r) {
            if (K.e && K.eR.test(r)) {
                return K
            }
            if (K.eW) {
                return s(K.parent, r)
            }
        }

        function t(r, K) {
            return K.i && K.iR.test(r)
        }

        function y(L, r) {
            var K = F.cI ? r[0].toLowerCase() : r[0];
            return L.k.hasOwnProperty(K) && L.k[K]
        }

        function G() {
            var K = l(w);
            if (!A.k) {
                return K
            }
            var r = "";
            var N = 0;
            A.lR.lastIndex = 0;
            var L = A.lR.exec(K);
            while (L) {
                r += K.substr(N, L.index - N);
                var M = y(A, L);
                if (M) {
                    v += M[1];
                    r += '<span class="' + M[0] + '">' + L[0] + "</span>"
                } else {
                    r += L[0]
                }
                N = A.lR.lastIndex;
                L = A.lR.exec(K)
            }
            return r + K.substr(N)
        }

        function z() {
            if (A.sL && !e[A.sL]) {
                return l(w)
            }
            var r = A.sL ? d(A.sL, w) : g(w);
            if (A.r > 0) {
                v += r.keyword_count;
                B += r.r
            }
            return '<span class="' + r.language + '">' + r.value + "</span>"
        }

        function J() {
            return A.sL !== undefined ? z() : G()
        }

        function I(L, r) {
            var K = L.cN ? '<span class="' + L.cN + '">' : "";
            if (L.rB) {
                x += K;
                w = ""
            } else {
                if (L.eB) {
                    x += l(r) + K;
                    w = ""
                } else {
                    x += K;
                    w = r
                }
            }
            A = Object.create(L, {parent: {value: A}});
            B += L.r
        }

        function C(K, r) {
            w += K;
            if (r === undefined) {
                x += J();
                return 0
            }
            var L = o(r, A);
            if (L) {
                x += J();
                I(L, r);
                return L.rB ? 0 : r.length
            }
            var M = s(A, r);
            if (M) {
                if (!(M.rE || M.eE)) {
                    w += r
                }
                x += J();
                do {
                    if (A.cN) {
                        x += "</span>"
                    }
                    A = A.parent
                } while (A != M.parent);
                if (M.eE) {
                    x += l(r)
                }
                w = "";
                if (M.starts) {
                    I(M.starts, "")
                }
                return M.rE ? 0 : r.length
            }
            if (t(r, A)) {
                throw"Illegal"
            }
            w += r;
            return r.length || 1
        }

        var F = e[D];
        f(F);
        var A = F;
        var w = "";
        var B = 0;
        var v = 0;
        var x = "";
        try {
            var u, q, p = 0;
            while (true) {
                A.t.lastIndex = p;
                u = A.t.exec(E);
                if (!u) {
                    break
                }
                q = C(E.substr(p, u.index - p), u[0]);
                p = u.index + q
            }
            C(E.substr(p));
            return {r: B, keyword_count: v, value: x, language: D}
        } catch (H) {
            if (H == "Illegal") {
                return {r: 0, keyword_count: 0, value: l(E)}
            } else {
                throw H
            }
        }
    }

    function g(s) {
        var o = {keyword_count: 0, r: 0, value: l(s)};
        var q = o;
        for (var p in e) {
            if (!e.hasOwnProperty(p)) {
                continue
            }
            var r = d(p, s);
            r.language = p;
            if (r.keyword_count + r.r > q.keyword_count + q.r) {
                q = r
            }
            if (r.keyword_count + r.r > o.keyword_count + o.r) {
                q = o;
                o = r
            }
        }
        if (q.language) {
            o.second_best = q
        }
        return o
    }

    function i(q, p, o) {
        if (p) {
            q = q.replace(/^((<[^>]+>|\t)+)/gm, function (r, v, u, t) {
                return v.replace(/\t/g, p)
            })
        }
        if (o) {
            q = q.replace(/\n/g, "<br>")
        }
        return q
    }

    function m(r, u, p) {
        var v = h(r, p);
        var t = a(r);
        if (t == "no-highlight") {
            return
        }
        var w = t ? d(t, v) : g(v);
        t = w.language;
        var o = c(r);
        if (o.length) {
            var q = document.createElement("pre");
            q.innerHTML = w.value;
            w.value = j(o, c(q), v)
        }
        w.value = i(w.value, u, p);
        var s = r.className;
        if (!s.match("(\\s|^)(language-)?" + t + "(\\s|$)")) {
            s = s ? (s + " " + t) : t
        }
        r.innerHTML = w.value;
        r.className = s;
        r.result = {language: t, kw: w.keyword_count, re: w.r};
        if (w.second_best) {
            r.second_best = {
                language: w.second_best.language,
                kw: w.second_best.keyword_count,
                re: w.second_best.r
            }
        }
    }

    function n() {
        if (n.called) {
            return
        }
        n.called = true;
        Array.prototype.map.call(document.getElementsByTagName("pre"), b).filter(Boolean).forEach(function (o) {
            m(o, hljs.tabReplace)
        })
    }

    function k() {
        window.addEventListener("DOMContentLoaded", n, false);
        window.addEventListener("load", n, false)
    }

    var e = {};
    this.LANGUAGES = e;
    this.highlight = d;
    this.highlightAuto = g;
    this.fixMarkup = i;
    this.highlightBlock = m;
    this.initHighlighting = n;
    this.initHighlightingOnLoad = k;
    this.IR = "[a-zA-Z][a-zA-Z0-9_]*";
    this.UIR = "[a-zA-Z_][a-zA-Z0-9_]*";
    this.NR = "\\b\\d+(\\.\\d+)?";
    this.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    this.BNR = "\\b(0b[01]+)";
    this.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    this.BE = {b: "\\\\[\\s\\S]", r: 0};
    this.ASM = {cN: "string", b: "'", e: "'", i: "\\n", c: [this.BE], r: 0};
    this.QSM = {cN: "string", b: '"', e: '"', i: "\\n", c: [this.BE], r: 0};
    this.CLCM = {cN: "comment", b: "//", e: "$"};
    this.CBLCLM = {cN: "comment", b: "/\\*", e: "\\*/"};
    this.HCM = {cN: "comment", b: "#", e: "$"};
    this.NM = {cN: "number", b: this.NR, r: 0};
    this.CNM = {cN: "number", b: this.CNR, r: 0};
    this.BNM = {cN: "number", b: this.BNR, r: 0};
    this.inherit = function (q, r) {
        var o = {};
        for (var p in q) {
            o[p] = q[p]
        }
        if (r) {
            for (var p in r) {
                o[p] = r[p]
            }
        }
        return o
    }
}();
