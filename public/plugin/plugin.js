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

        var script = document.createElement('script');
        script.src = 'https://chat.smlog.co.kr/plugin/bundle.3624cd496987f26a3c2a.js';
        document.head.appendChild(script);
    }
})();