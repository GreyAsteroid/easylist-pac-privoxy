// PAC (Proxy Auto Configuration) Filter from EasyList rules
// 
// Copyright (C) 2017 by Steven T. Smith <steve dot t dot smith at gmail dot com>, GPL
// https://github.com/essandess/easylist-pac-privoxy/
//
// PAC file created on Sat, 03 Apr 2021 03:03:40 GMT
// Created with command: easylist_pac.py
//
// http://www.gnu.org/licenses/lgpl.txt
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// If you normally use a proxy, replace "DIRECT" below with
// "PROXY MACHINE:PORT"
// where MACHINE is the IP address or host name of your proxy
// server and PORT is the port number of your proxy server.
//
// Influenced in part by code from King of the PAC from http://securemecca.com/pac.html

// Define the blackhole proxy for blocked adware and trackware

var normal = "DIRECT";
var proxy = "DIRECT";                  // e.g. 127.0.0.1:3128
// var blackhole_ip_port = "127.0.0.1:8119";  // ngnix-hosted blackhole
// var blackhole_ip_port = "8.8.8.8:53";      // GOOG DNS blackhole; do not use: no longer works with iOS 11—causes long waits on some sites
var blackhole_ip_port = "127.0.0.1:8119";    // on iOS a working blackhole requires return code 200;
// e.g. use the adblock2privoxy nginx server as a blackhole
var blackhole = "PROXY " + blackhole_ip_port;

// The hostnames must be consistent with EasyList format.
// These special RegExp characters will be escaped below: [.?+@]
// This EasyList wildcard will be transformed to an efficient RegExp: *
// 
// EasyList format references:
// https://adblockplus.org/filters
// https://adblockplus.org/filter-cheatsheet

// Create object hashes or compile efficient NFA's from all filters
// Various alternate filtering and regex approaches were timed using node and at jsperf.com

// Too many rules (>~ 10k) bog down the browser; make reasonable exclusions here:

// EasyList rules:
// https://adblockplus.org/filters
// https://adblockplus.org/filter-cheatsheet
// https://opnsrce.github.io/javascript-performance-tip-precompile-your-regular-expressions
// https://adblockplus.org/blog/investigating-filter-matching-algorithms
// 
// Strategies to convert EasyList rules to Javascript tests:
// 
// In general:
// 1. Preference for performance over 1:1 EasyList functionality
// 2. Limit number of rules to ~O(10k) to avoid computational burden on mobile devices
// 3. Exact matches: use Object hashing (very fast); use efficient NFA RegExp's for all else
// 4. Divide and conquer specific cases to avoid large RegExp's
// 5. Based on testing code performance on an iPhone: mobile Safari, Chrome with System Activity Monitor.app
// 6. Backstop these proxy.pac rules with Privoxy rules and a browser plugin
// 
// scheme://host/path?query ; FindProxyForURL(url, host) has full url and host strings
// 
// EasyList rules:
// 
// || domain anchor
// 
// ||host is exact e.g. ||a.b^ ? then hasOwnProperty(hash,host)
// ||host is wildcard e.g. ||a.* ? then RegExp.test(host)
// 
// ||host/path is exact e.g. ||a.b/c? ? then hasOwnProperty(hash,url_path_noquery) [strip ?'s]
// ||host/path is wildcard e.g. ||a.*/c? ? then RegExp.test(url_path_noquery) [strip ?'s]
// 
// ||host/path?query is exact e.g. ||a.b/c?d= ? assume none [handle small number within RegExp's]
// ||host/path?query is wildcard e.g. ||a.*/c?d= ? then RegExp.test(url)
// 
// url parts e.g. a.b^c&d|
// 
// All cases RegExp.test(url)
// Except: |http://a.b. Treat these as domain anchors after stripping the scheme
// 
// regex e.g. /r/
// 
// All cases RegExp.test(url)
// 
// @@ exceptions
// 
// Flag as "good" versus "bad" default
// 
// Variable name conventions (example that defines the rule):
// 
// bad_da_host_exact == bad domain anchor with host/path type, exact matching with Object hash
// bad_da_host_regex == bad domain anchor with host/path type, RegExp matching
// 
// 110 rules:
var good_da_host_exact_JSON = { "apple.com": null,
"albert.apple.com": null,
"captive.apple.com": null,
"gs.apple.com": null,
"humb.apple.com": null,
"static.ips.apple.com": null,
"tbsc.apple.com": null,
"time-ios.apple.com": null,
"time.apple.com": null,
"time-macos.apple.com": null,
"gdmf.apple.com": null,
"deviceenrollment.apple.com": null,
"deviceservices-external.apple.com": null,
"identity.apple.com": null,
"iprofiles.apple.com": null,
"mdmenrollment.apple.com": null,
"setup.icloud.com": null,
"appldnld.apple.com": null,
"gg.apple.com": null,
"gnf-mdn.apple.com": null,
"gnf-mr.apple.com": null,
"ig.apple.com": null,
"mesu.apple.com": null,
"oscdn.apple.com": null,
"osrecovery.apple.com": null,
"skl.apple.com": null,
"swcdn.apple.com": null,
"swdist.apple.com": null,
"swdownload.apple.com": null,
"swpost.apple.com": null,
"swscan.apple.com": null,
"updates-http.cdn-apple.com": null,
"updates.cdn-apple.com": null,
"xp.apple.com": null,
"ppq.apple.com": null,
"lcdn-registration.apple.com": null,
"crl.apple.com": null,
"crl.entrust.net": null,
"crl3.digicert.com": null,
"crl4.digicert.com": null,
"ocsp.apple.com": null,
"ocsp.digicert.com": null,
"ocsp.entrust.net": null,
"ocsp.verisign.net": null,
"icloud.com": null,
"apple-dns.net": null,
"init.itunes.apple.com": null,
"init-cdn.itunes-apple.com.akadns.net": null,
"itunes.apple.com.edgekey.net": null,
"p32-escrowproxy.icloud.com": null,
"p32-escrowproxy.fe.apple-dns.net": null,
"keyvalueservice.icloud.com": null,
"keyvalueservice.fe.apple-dns.net": null,
"p32-bookmarks.icloud.com": null,
"p32-bookmarks.fe.apple-dns.net": null,
"p32-ckdatabase.icloud.com": null,
"p32-ckdatabase.fe.apple-dns.net": null,
"configuration.apple.com": null,
"configuration.apple.com.edgekey.net": null,
"mesu-cdn.apple.com.akadns.net": null,
"mesu.g.aaplimg.com": null,
"gspe1-ssl.ls.apple.com": null,
"gspe1-ssl.ls.apple.com.edgekey.net": null,
"api-glb-bos.smoot.apple.com": null,
"query.ess.apple.com": null,
"query-geo.ess-apple.com.akadns.net": null,
"query.ess-apple.com.akadns.net": null,
"setup.fe.apple-dns.net": null,
"gsa.apple.com": null,
"gsa.apple.com.akadns.net": null,
"icloud-content.com": null,
"usbos-edge.icloud-content.com": null,
"usbos.ce.apple-dns.net": null,
"lcdn-locator.apple.com": null,
"lcdn-locator.apple.com.akadns.net": null,
"lcdn-locator-usuqo.apple.com.akadns.net": null,
"cl1.apple.com": null,
"cl2.apple.com": null,
"cl3.apple.com": null,
"cl4.apple.com": null,
"cl5.apple.com": null,
"cl1-cdn.origin-apple.com.akadns.net": null,
"cl2-cdn.origin-apple.com.akadns.net": null,
"cl3-cdn.origin-apple.com.akadns.net": null,
"cl4-cdn.origin-apple.com.akadns.net": null,
"cl5-cdn.origin-apple.com.akadns.net": null,
"cl1.apple.com.edgekey.net": null,
"cl2.apple.com.edgekey.net": null,
"cl3.apple.com.edgekey.net": null,
"cl4.apple.com.edgekey.net": null,
"cl5.apple.com.edgekey.net": null,
"xp.itunes-apple.com.akadns.net": null,
"mt-ingestion-service-pv.itunes.apple.com": null,
"p32-sharedstreams.icloud.com": null,
"p32-sharedstreams.fe.apple-dns.net": null,
"p32-fmip.icloud.com": null,
"p32-fmip.fe.apple-dns.net": null,
"gsp-ssl.ls.apple.com": null,
"gsp-ssl.ls-apple.com.akadns.net": null,
"gsp-ssl.ls2-apple.com.akadns.net": null,
"gspe35-ssl.ls.apple.com": null,
"gspe35-ssl.ls-apple.com.akadns.net": null,
"gspe35-ssl.ls.apple.com.edgekey.net": null,
"gsp64-ssl.ls.apple.com": null,
"gsp64-ssl.ls-apple.com.akadns.net": null,
"mt-ingestion-service-st11.itunes.apple.com": null,
"mt-ingestion-service-st11.itunes-apple.com.akadns.net": null,
"microsoft.com": null,
"mozilla.com": null,
"mozilla.org": null };
var good_da_host_exact_flag = 110 > 0 ? true : false;  // test for non-zero number of rules
    
// 4 rules as an efficient NFA RegExp:
var good_da_host_regex_RegExp = /^(?:[\w-]+\.)*?(?:^(?:[\w-]+\.)*?push\.apple\.com[^\w.%-]|^(?:[\w-]+\.)*?itunes\.apple\.com[^\w.%-]|^(?:[\w-]+\.)*?apps\.apple\.com[^\w.%-]|^(?:[\w-]+\.)*?mzstatic\.com[^\w.%-])/i;
var good_da_host_regex_flag = 4 > 0 ? true : false;  // test for non-zero number of rules

// 0 rules:
var good_da_hostpath_exact_JSON = {  };
var good_da_hostpath_exact_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var good_da_hostpath_regex_RegExp = /^$/;
var good_da_hostpath_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var good_da_regex_RegExp = /^$/;
var good_da_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules

// 0 rules:
var good_da_host_exceptions_exact_JSON = {  };
var good_da_host_exceptions_exact_flag = 0 > 0 ? true : false;  // test for non-zero number of rules

// 3 rules:
var bad_da_host_exact_JSON = { "mobile.wal-mart.com": null,
"outbrain.com": null,
"taboola.com": null };
var bad_da_host_exact_flag = 3 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var bad_da_host_regex_RegExp = /^$/;
var bad_da_host_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules

// 0 rules:
var bad_da_hostpath_exact_JSON = {  };
var bad_da_hostpath_exact_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var bad_da_hostpath_regex_RegExp = /^$/;
var bad_da_hostpath_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var bad_da_regex_RegExp = /^$/;
var bad_da_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var good_url_parts_RegExp = /^$/;
var good_url_parts_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var bad_url_parts_RegExp = /^$/;
var bad_url_parts_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var good_url_regex_RegExp = /^$/;
var good_url_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules
    
// 0 rules as an efficient NFA RegExp:
var bad_url_regex_RegExp = /^$/;
var bad_url_regex_flag = 0 > 0 ? true : false;  // test for non-zero number of rules

// Add any good networks here. Format is network folowed by a comma and
// optional white space, and then the netmask.
// LAN, loopback, Apple (direct and Akamai e.g. e4805.a.akamaiedge.net), Microsoft (updates and services)
// Apple Enterprise Network; https://support.apple.com/en-us/HT210060
var GoodNetworks_Array = [ "10.0.0.0,     255.0.0.0",
"172.16.0.0,        255.240.0.0",
"17.248.128.0,      255.255.192.0",
"17.250.64.0,       255.255.192.0",
"17.248.192.0,      255.255.224.0",
"192.168.0.0,       255.255.0.0",
"127.0.0.0,         255.0.0.0",
"17.0.0.0,          255.0.0.0",
"23.2.8.68,         255.255.255.255",
"23.2.145.78,       255.255.255.255",
"23.39.179.17,      255.255.255.255",
"23.63.98.0,        255.255.254.0",
"104.70.71.223,     255.255.255.255",
"104.73.77.224,     255.255.255.255",
"104.96.184.235,    255.255.255.255",
"104.96.188.194,    255.255.255.255",
"65.52.0.0,         255.255.252.0" ];

// Apple iAd, Microsoft telemetry
var GoodNetworks_Exceptions_Array = [];

// Akamai: 23.64.0.0/14, 23.0.0.0/12, 23.32.0.0/11, 104.64.0.0/10

// Add any bad networks here. Format is network folowed by a comma and
// optional white space, and then the netmask.
// From securemecca.com: Adobe marketing cloud, 2o7, omtrdc, Sedo domain parking, flyingcroc, accretive
var BadNetworks_Array = [];

// block these schemes; use the command line for ftp, rsync, etc. instead
var bad_schemes_RegExp = RegExp("^(?:ftp|sftp|tftp|ftp-data|rsync|finger|gopher)", "i")

// RegExp for schemes; lengths from
// perl -lane 'BEGIN{$l=0;} {!/^#/ && do{$ll=length($F[0]); if($ll>$l){$l=$ll;}};} END{print $l;}' /etc/services
var schemepart_RegExp = RegExp("^([\\w*+-]{2,15}):\\/{0,2}","i");
var hostpart_RegExp = RegExp("^((?:[\\w-]+\\.)+[a-zA-Z0-9-]{2,24}\\.?)", "i");
var querypart_RegExp = RegExp("^((?:[\\w-]+\\.)+[a-zA-Z0-9-]{2,24}\\.?[\\w~%.\\/^*-]*)(\\??\\S*?)$", "i");
var domainpart_RegExp = RegExp("^(?:[\\w-]+\\.)*((?:[\\w-]+\\.)[a-zA-Z0-9-]{2,24})\\.?", "i");

//////////////////////////////////////////////////
// Define the is_ipv4_address function and vars //
//////////////////////////////////////////////////

var ipv4_RegExp = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function is_ipv4_address(host)
{
    var ipv4_pentary = host.match(ipv4_RegExp);
    var is_valid_ipv4 = false;

    if (ipv4_pentary) {
        is_valid_ipv4 = true;
        for( i = 1; i <= 4; i++) {
            if (ipv4_pentary[i] >= 256) {
                is_valid_ipv4 = false;
            }
        }
    }
    return is_valid_ipv4;
}

// object hashes
// Note: original stackoverflow-based hasOwnProperty does not woth within iOS kernel 
var hasOwnProperty = function(obj, prop) {
    return obj.hasOwnProperty(prop);
}

/////////////////////
// Done Setting Up //
/////////////////////

// debug with Chrome at chrome://net-export
// alert("Debugging message.")

//////////////////////////////////
// Define the FindProxyFunction //
//////////////////////////////////

var use_pass_rules_parts_flag = true;  // use the pass rules for url parts, then apply the block rules
var alert_flag = false;                // use for short-circuit '&&' to print debugging statements
var debug_flag = false;               // use for short-circuit '&&' to print debugging statements

// EasyList filtering for FindProxyForURL(url, host)
function EasyListFindProxyForURL(url, host)
{
    var host_is_ipv4 = is_ipv4_address(host);
    var host_ipv4_address;

    alert_flag && alert("url is: " + url);
    alert_flag && alert("host is: " + host);

    // Extract scheme and url without scheme
    var scheme = url.match(schemepart_RegExp)
    scheme = scheme.length > 0? scheme[1] : "";

    // Remove the scheme and extract the path for regex efficiency
    var url_noscheme = url.replace(schemepart_RegExp,"");
    var url_pathonly = url_noscheme.replace(hostpart_RegExp,"");
    var url_noquery = url_noscheme.replace(querypart_RegExp,"$1");
    // Remove the server name from the url and host if host is not an IPv4 address
    var url_noserver = !host_is_ipv4 ? url_noscheme.replace(domainpart_RegExp,"$1") : url_noscheme;
    var url_noservernoquery = !host_is_ipv4 ? url_noquery.replace(domainpart_RegExp,"$1") : url_noscheme;
    var host_noserver =  !host_is_ipv4 ? host.replace(domainpart_RegExp,"$1") : host;

    // Debugging results
    if (debug_flag && alert_flag) {
        alert("url_noscheme is: " + url_noscheme);
        alert("url_pathonly is: " + url_pathonly);
        alert("url_noquery is: " + url_noquery);
        alert("url_noserver is: " + url_noserver);
        alert("url_noservernoquery is: " + url_noservernoquery);
        alert("host_noserver is: " + host_noserver);
    }

    // Short circuit to blackhole for good_da_host_exceptions
    if ( hasOwnProperty(good_da_host_exceptions_exact_JSON,host) ) {
        alert_flag && alert("good_da_host_exceptions_exact_JSON blackhole!");
        return blackhole;
    }

    ///////////////////////////////////////////////////////////////////////
    // Check to make sure we can get an IPv4 address from the given host //
    // name.  If we cannot do that then skip the Networks tests.         //
    ///////////////////////////////////////////////////////////////////////

    host_ipv4_address = host_is_ipv4 ? host : (isResolvable(host) ? dnsResolve(host) : false);

    if (host_ipv4_address) {
        alert_flag && alert("host ipv4 address is: " + host_ipv4_address);
        /////////////////////////////////////////////////////////////////////////////
        // If the IP translates to one of the GoodNetworks_Array (with exceptions) //
        // we pass it because it is considered safe.                               //
        /////////////////////////////////////////////////////////////////////////////

        for (i in GoodNetworks_Exceptions_Array) {
            tmpNet = GoodNetworks_Exceptions_Array[i].split(/,\s*/);
            if (isInNet(host_ipv4_address, tmpNet[0], tmpNet[1])) {
                alert_flag && alert("GoodNetworks_Exceptions_Array Blackhole: " + host_ipv4_address);
                return blackhole;
            }
        }
        for (i in GoodNetworks_Array) {
            tmpNet = GoodNetworks_Array[i].split(/,\s*/);
            if (isInNet(host_ipv4_address, tmpNet[0], tmpNet[1])) {
                alert_flag && alert("GoodNetworks_Array PASS: " + host_ipv4_address);
                return proxy;
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // If the IP translates to one of the BadNetworks_Array we fail it   //
        // because it is not considered safe.                                //
        ///////////////////////////////////////////////////////////////////////

        for (i in BadNetworks_Array) {
            tmpNet = BadNetworks_Array[i].split(/,\s*/);
            if (isInNet(host_ipv4_address, tmpNet[0], tmpNet[1])) {
                alert_flag && alert("BadNetworks_Array Blackhole: " + host_ipv4_address);
                return blackhole;
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    // HTTPS: https scheme can only use domain information                      //
    // unless PacHttpsUrlStrippingEnabled == false [Chrome] or                  //
    // network.proxy.autoconfig_url.include_path == true [Firefox, about:config]              //
    // E.g. on macOS:                                                           //
    // defaults write com.google.Chrome PacHttpsUrlStrippingEnabled -bool false //
    // Check setting at page chrome://policy                                    //
    //////////////////////////////////////////////////////////////////////////////

    // Assume browser has disabled path access if scheme is https and path is '/'
    if ( scheme == "https" && url_pathonly == "/" ) {

        ///////////////////////////////////////////////////////////////////////
        // PASS LIST:   domains matched here will always be allowed.         //
        ///////////////////////////////////////////////////////////////////////

        if ( (good_da_host_exact_flag && (hasOwnProperty(good_da_host_exact_JSON,host_noserver)||hasOwnProperty(good_da_host_exact_JSON,host)))
            && !hasOwnProperty(good_da_host_exceptions_exact_JSON,host) ) {
                alert_flag && alert("HTTPS PASS: " + host + ", " + host_noserver);
            return proxy;
        }

        //////////////////////////////////////////////////////////
        // BLOCK LIST:	stuff matched here here will be blocked //
        //////////////////////////////////////////////////////////

        if ( (bad_da_host_exact_flag && (hasOwnProperty(bad_da_host_exact_JSON,host_noserver)||hasOwnProperty(bad_da_host_exact_JSON,host))) ) {
            alert_flag && alert("HTTPS blackhole: " + host + ", " + host_noserver);
            return blackhole;
        }
    }

    ////////////////////////////////////////
    // HTTPS and HTTP: full path analysis //
    ////////////////////////////////////////

    if (scheme == "https" || scheme == "http") {

        ///////////////////////////////////////////////////////////////////////
        // PASS LIST:   domains matched here will always be allowed.         //
        ///////////////////////////////////////////////////////////////////////

        if ( !hasOwnProperty(good_da_host_exceptions_exact_JSON,host)
            && ((good_da_host_exact_flag && (hasOwnProperty(good_da_host_exact_JSON,host_noserver)||hasOwnProperty(good_da_host_exact_JSON,host))) ||  // fastest test first
                (use_pass_rules_parts_flag &&
                    (good_da_hostpath_exact_flag && (hasOwnProperty(good_da_hostpath_exact_JSON,url_noservernoquery)||hasOwnProperty(good_da_hostpath_exact_JSON,url_noquery)) ) ||
                    // test logic: only do the slower test if the host has a (non)suspect fqdn
                    (good_da_host_regex_flag && (good_da_host_regex_RegExp.test(host_noserver)||good_da_host_regex_RegExp.test(host))) ||
                    (good_da_hostpath_regex_flag && (good_da_hostpath_regex_RegExp.test(url_noservernoquery)||good_da_hostpath_regex_RegExp.test(url_noquery))) ||
                    (good_da_regex_flag && (good_da_regex_RegExp.test(url_noserver)||good_da_regex_RegExp.test(url_noscheme))) ||
                    (good_url_parts_flag && good_url_parts_RegExp.test(url)) ||
                    (good_url_regex_flag && good_url_regex_RegExp.test(url)))) ) {
            return proxy;
        }

        //////////////////////////////////////////////////////////
        // BLOCK LIST:	stuff matched here here will be blocked //
        //////////////////////////////////////////////////////////
        // Debugging results
        if (debug_flag && alert_flag) {
            alert("hasOwnProperty(bad_da_host_exact_JSON," + host_noserver + "): " + (bad_da_host_exact_flag && hasOwnProperty(bad_da_host_exact_JSON,host_noserver)));
            alert("hasOwnProperty(bad_da_host_exact_JSON," + host + "): " + (bad_da_host_exact_flag && hasOwnProperty(bad_da_host_exact_JSON,host)));
            alert("hasOwnProperty(bad_da_hostpath_exact_JSON," + url_noservernoquery + "): " + (bad_da_hostpath_exact_flag && hasOwnProperty(bad_da_hostpath_exact_JSON,url_noservernoquery)));
            alert("hasOwnProperty(bad_da_hostpath_exact_JSON," + url_noquery + "): " + (bad_da_hostpath_exact_flag && hasOwnProperty(bad_da_hostpath_exact_JSON,url_noquery)));
            alert("bad_da_host_regex_RegExp.test(" + host_noserver + "): " + (bad_da_host_regex_flag && bad_da_host_regex_RegExp.test(host_noserver)));
            alert("bad_da_host_regex_RegExp.test(" + host + "): " + (bad_da_host_regex_flag && bad_da_host_regex_RegExp.test(host)));
            alert("bad_da_hostpath_regex_RegExp.test(" + url_noservernoquery + "): " + (bad_da_hostpath_regex_flag && bad_da_hostpath_regex_RegExp.test(url_noservernoquery)));
            alert("bad_da_hostpath_regex_RegExp.test(" + url_noquery + "): " + (bad_da_hostpath_regex_flag && bad_da_hostpath_regex_RegExp.test(url_noquery)));
            alert("bad_da_regex_RegExp.test(" + url_noserver + "): " + (bad_da_regex_flag && bad_da_regex_RegExp.test(url_noserver)));
            alert("bad_da_regex_RegExp.test(" + url_noscheme + "): " + (bad_da_regex_flag && bad_da_regex_RegExp.test(url_noscheme)));
            alert("bad_url_parts_RegExp.test(" + url + "): " + (bad_url_parts_flag && bad_url_parts_RegExp.test(url)));
            alert("bad_url_regex_RegExp.test(" + url + "): " + (bad_url_regex_flag && bad_url_regex_RegExp.test(url)));
        }

        if ( (bad_da_host_exact_flag && (hasOwnProperty(bad_da_host_exact_JSON,host_noserver)||hasOwnProperty(bad_da_host_exact_JSON,host))) ||  // fastest test first
            (bad_da_hostpath_exact_flag && (hasOwnProperty(bad_da_hostpath_exact_JSON,url_noservernoquery)||hasOwnProperty(bad_da_hostpath_exact_JSON,url_noquery)) ) ||
            // test logic: only do the slower test if the host has a (non)suspect fqdn
            (bad_da_host_regex_flag && (bad_da_host_regex_RegExp.test(host_noserver)||bad_da_host_regex_RegExp.test(host))) ||
            (bad_da_hostpath_regex_flag && (bad_da_hostpath_regex_RegExp.test(url_noservernoquery)||bad_da_hostpath_regex_RegExp.test(url_noquery))) ||
            (bad_da_regex_flag && (bad_da_regex_RegExp.test(url_noserver)||bad_da_regex_RegExp.test(url_noscheme))) ||
            (bad_url_parts_flag && bad_url_parts_RegExp.test(url)) ||
            (bad_url_regex_flag && bad_url_regex_RegExp.test(url)) ) {
            alert_flag && alert("Blackhole: " + url + ", " + host);
            return blackhole;
        }
    }

    // default pass
    alert_flag && alert("Default PASS: " + url + ", " + host);
    return proxy;
}

// User-supplied FindProxyForURL()
function FindProxyForURL(url, host)
{
if (
   isPlainHostName(host) ||
   shExpMatch(host, "10.*") ||
   shExpMatch(host, "172.16.*") ||
   shExpMatch(host, "192.168.*") ||
   shExpMatch(host, "127.*") ||
   dnsDomainIs(host, ".local") || dnsDomainIs(host, ".LOCAL")
)
        return "DIRECT";
else if (
   /*
       Proxy bypass hostnames
   */
   /*
       Fix iOS 13 PAC file issue with Mail.app
       See: https://forums.developer.apple.com/thread/121928
   */
   // Apple
   (host == "imap.mail.me.com") || (host == "smtp.mail.me.com") ||
   dnsDomainIs(host, "imap.mail.me.com") || dnsDomainIs(host, "smtp.mail.me.com") ||
   (host == "p03-imap.mail.me.com") || (host == "p03-smtp.mail.me.com") ||
   dnsDomainIs(host, "p03-imap.mail.me.com") || dnsDomainIs(host, "p03-smtp.mail.me.com") ||
   (host == "p66-imap.mail.me.com") || (host == "p66-smtp.mail.me.com") ||
   dnsDomainIs(host, "p66-imap.mail.me.com") || dnsDomainIs(host, "p66-smtp.mail.me.com") ||
   // Apple Enterprise Network Domains; https://support.apple.com/en-us/HT210060
   (host == "albert.apple.com") || dnsDomainIs(host, "albert.apple.com") ||
   (host == "captive.apple.com") || dnsDomainIs(host, "captive.apple.com") ||
   (host == "gs.apple.com") || dnsDomainIs(host, "gs.apple.com") ||
   (host == "humb.apple.com") || dnsDomainIs(host, "humb.apple.com") ||
   (host == "static.ips.apple.com") || dnsDomainIs(host, "static.ips.apple.com") ||
   (host == "tbsc.apple.com") || dnsDomainIs(host, "tbsc.apple.com") ||
   (host == "time-ios.apple.com") || dnsDomainIs(host, "time-ios.apple.com") ||
   (host == "time.apple.com") || dnsDomainIs(host, "time.apple.com") ||
   (host == "time-macos.apple.com") || dnsDomainIs(host, "time-macos.apple.com") ||
   dnsDomainIs(host, ".push.apple.com") ||
   (host == "gdmf.apple.com") || dnsDomainIs(host, "gdmf.apple.com") ||
   (host == "deviceenrollment.apple.com") || dnsDomainIs(host, "deviceenrollment.apple.com") ||
   (host == "deviceservices-external.apple.com") || dnsDomainIs(host, "deviceservices-external.apple.com") ||
   (host == "identity.apple.com") || dnsDomainIs(host, "identity.apple.com") ||
   (host == "iprofiles.apple.com") || dnsDomainIs(host, "iprofiles.apple.com") ||
   (host == "mdmenrollment.apple.com") || dnsDomainIs(host, "mdmenrollment.apple.com") ||
   (host == "setup.icloud.com") || dnsDomainIs(host, "setup.icloud.com") ||
   (host == "appldnld.apple.com") || dnsDomainIs(host, "appldnld.apple.com") ||
   (host == "gg.apple.com") || dnsDomainIs(host, "gg.apple.com") ||
   (host == "gnf-mdn.apple.com") || dnsDomainIs(host, "gnf-mdn.apple.com") ||
   (host == "gnf-mr.apple.com") || dnsDomainIs(host, "gnf-mr.apple.com") ||
   (host == "gs.apple.com") || dnsDomainIs(host, "gs.apple.com") ||
   (host == "ig.apple.com") || dnsDomainIs(host, "ig.apple.com") ||
   (host == "mesu.apple.com") || dnsDomainIs(host, "mesu.apple.com") ||
   (host == "oscdn.apple.com") || dnsDomainIs(host, "oscdn.apple.com") ||
   (host == "osrecovery.apple.com") || dnsDomainIs(host, "osrecovery.apple.com") ||
   (host == "skl.apple.com") || dnsDomainIs(host, "skl.apple.com") ||
   (host == "swcdn.apple.com") || dnsDomainIs(host, "swcdn.apple.com") ||
   (host == "swdist.apple.com") || dnsDomainIs(host, "swdist.apple.com") ||
   (host == "swdownload.apple.com") || dnsDomainIs(host, "swdownload.apple.com") ||
   (host == "swpost.apple.com") || dnsDomainIs(host, "swpost.apple.com") ||
   (host == "swscan.apple.com") || dnsDomainIs(host, "swscan.apple.com") ||
   (host == "updates-http.cdn-apple.com") || dnsDomainIs(host, "updates-http.cdn-apple.com") ||
   (host == "updates.cdn-apple.com") || dnsDomainIs(host, "updates.cdn-apple.com") ||
   (host == "xp.apple.com") || dnsDomainIs(host, "xp.apple.com") ||
   dnsDomainIs(host, ".itunes.apple.com") ||
   dnsDomainIs(host, ".apps.apple.com") ||
   dnsDomainIs(host, ".mzstatic.com") ||
   (host == "ppq.apple.com") || dnsDomainIs(host, "ppq.apple.com") ||
   (host == "lcdn-registration.apple.com") || dnsDomainIs(host, "lcdn-registration.apple.com") ||
   (host == "crl.apple.com") || dnsDomainIs(host, "crl.apple.com") ||
   (host == "crl.entrust.net") || dnsDomainIs(host, "crl.entrust.net") ||
   (host == "crl3.digicert.com") || dnsDomainIs(host, "crl3.digicert.com") ||
   (host == "crl4.digicert.com") || dnsDomainIs(host, "crl4.digicert.com") ||
   (host == "ocsp.apple.com") || dnsDomainIs(host, "ocsp.apple.com") ||
   (host == "ocsp.digicert.com") || dnsDomainIs(host, "ocsp.digicert.com") ||
   (host == "ocsp.entrust.net") || dnsDomainIs(host, "ocsp.entrust.net") ||
   (host == "ocsp.verisign.net") || dnsDomainIs(host, "ocsp.verisign.net") ||
)
        return "PROXY localhost:3128";
else
        return EasyListFindProxyForURL(url, host);
}
