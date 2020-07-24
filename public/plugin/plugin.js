(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        node.setAttribute('key', smtgs_chat_data.key);
        node.setAttribute('ck', smtgs_chat_data.ck);
        node.setAttribute('muid', smtgs_chat_data.muid);
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        style.href = 'http://3.34.185.70/plugin/chatterbox.css';
        style.media = 'all';
        document.head.appendChild(style);

        var script = document.createElement('script');
        script.src = 'http://3.34.185.70/plugin/bundle.3624cd496987f26a3c2a.js';
        document.head.appendChild(script);
    }
})();