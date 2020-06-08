(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        style.href = 'http://ec2-13-124-219-39.ap-northeast-2.compute.amazonaws.com/chatterbox.css';
        style.media = 'all';
        document.head.appendChild(style);

        var script = document.createElement('script');
        script.src = 'http://ec2-13-124-219-39.ap-northeast-2.compute.amazonaws.com/bundle.092af1c3547273f393d0.js';
        document.head.appendChild(script);
    }
})();
