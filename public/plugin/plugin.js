(function() {
    console.log('smtgs_chat_data', smtgs_chat_data)
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        node.setAttribute('key', smtgs_chat_data.key);
        node.setAttribute('ck', smtgs_chat_data.ck);
        node.setAttribute('muid', smtgs_chat_data.muid);
        node.setAttribute('ip', smtgs_chat_data.ip);
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