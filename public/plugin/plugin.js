(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        style.href = 'https://chat.smlog.co.kr/plugin/chatterbox.css';
        style.media = 'all';
        document.head.appendChild(style);

        var chatterboxScriptUrl = 'https://chat.smlog.co.kr/plugin/bundle.3624cd496987f26a3c2a.js';
        var query = _smartlog_find_query()
        if (query.dev == 'true') {
            chatterboxScriptUrl = 'https://chat.smlog.co.kr/plugin/bundle.dev.js';
        }
        var script = document.createElement('script');
        script.src = chatterboxScriptUrl;
        document.head.appendChild(script);
    }

    function _smartlog_find_query(url) {
        var qs = url ? url : document.location.search;
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
})();