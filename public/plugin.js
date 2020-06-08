(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        style.href = 'http://localhost:3000/chatterbox.css';
        style.media = 'all';
        document.head.appendChild(style);

        var script = document.createElement('script');
        script.src = 'http://localhost:3000/bundle.cb9d7b06f62e4294e521.js';
        document.head.appendChild(script);
    }
})();
