var _SMARTLOG_CHAT = _SMARTLOG_CHAT || (function() {
    var _smartlog_chat_args = {}; // private
    return {
        init: function(Args) {
            _smartlog_chat_args = Args
        },
        start: function() {
            if (!document.getElementById('chatterbox-root')) {
                var node = document.createElement('div');
                node.id = 'chatterbox-root';
                node.setAttribute('key', _smartlog_chat_args.key);
                node.setAttribute('ck', _smartlog_chat_args.key);
                node.setAttribute('muid', _smartlog_chat_args.key);
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
        }
    }    
}());
