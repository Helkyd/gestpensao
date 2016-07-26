if(window.SS && window.SS.i18n){
 window.i18n = window.SS.i18n;
}

window.SS = (function(i18n){
    var APIRoot = "/api/v3/site",
        APISingleInitRequest = true;
    return {
        Available: function () {
            return true;
        },
        APISingleInitRequest: APISingleInitRequest,
        APIRoot: APIRoot,
        EmailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i, //Practical RFC 5322 implementation
        getPageId: function () {
            if (document.getElementsByTagName("body")) {
                return document.getElementsByTagName("body")[0].getAttribute("data-pid");
            } else if(window.location.pathname.match(/(?!\/)[0-9]*(?=\/)/i)) {
                return window.location.pathname.match(/(?!\/)[0-9]*(?=\/)/i)[0];
            }            
        },
        getItemId: function(){
            if(document.getElementsByTagName("body")){
                return document.getElementsByTagName("body")[0].getAttribute("data-iid");
            }else{
                return null;
            }
        },
        getAPIPageRoot: function(){
            var pageId = this.getPageId();
            return (pageId ? APIRoot+"/page/"+pageId : false);
        },
        setAPISingleInitRequest: function(bool){
            if(bool === true || bool === false){
                APISingleInitRequest = bool;
            }
        },
        getLanguage: function(){
            var lang = "en";
            if(document.getElementsByTagName("html")){
                lang = document.getElementsByTagName("html")[0].getAttribute("lang") || lang;
            }
            return lang;
        },
        gettext: function(key, fallback_value){
            var pattern = /\{([0-9]+)\}/gi,
                text = i18n && i18n[key] ? i18n[key] : (fallback_value ? fallback_value : key),
                args = Array.prototype.slice.call(arguments, (-(key.match(pattern)||text.match(pattern)||[]).length));
            
            return (key.match(pattern) ? key : text).replace(pattern, function(s, key){ return args[key].toString() || s; });
        }
    };
})(window.i18n);

try {
    delete window.i18n;
}catch(e){
    window.i18n = undefined;
}
