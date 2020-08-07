(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        node.setAttribute('key', smtgs_chat_data.key);
        node.setAttribute('ck', smtgs_chat_data.ck);
        node.setAttribute('muid', smtgs_chat_data.muid);
        node.setAttribute('ip', smtgs_chat_data.ip);
        node.setAttribute('svid', smtgs_chat_data.svid);

        // icon config
        node.setAttribute('themeColor', smtgs_chat_data.themeColor);
        node.setAttribute('position', smtgs_chat_data.position);
        node.setAttribute('pc-hide', smtgs_chat_data.pc.hide);
        node.setAttribute('pc-axisX', smtgs_chat_data.pc.axisX);
        node.setAttribute('pc-axisY', smtgs_chat_data.pc.axisY);
        node.setAttribute('pc-size', smtgs_chat_data.pc.size);
        node.setAttribute('mobile-hide', smtgs_chat_data.mobile.hide);
        node.setAttribute('mobile-axisX', smtgs_chat_data.mobile.axisX);
        node.setAttribute('mobile-axisY', smtgs_chat_data.mobile.axisY);
        node.setAttribute('mobile-size', smtgs_chat_data.mobile.size);

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