var torrentId = 'https://webtorrent.io/torrents/sintel.torrent';

var client = new WebTorrent()
console.log("WebTorrent.WEBRTC_SUPPORT");
console.log(WebTorrent.WEBRTC_SUPPORT);
// HTML elements
var $body = document.body
var $progressBar = document.querySelector('#progressBar')
var $numPeers = document.querySelector('#numPeers')
var $downloaded = document.querySelector('#downloaded')
var $total = document.querySelector('#total')
var $remaining = document.querySelector('#remaining')
var $uploadSpeed = document.querySelector('#uploadSpeed')
var $downloadSpeed = document.querySelector('#downloadSpeed')
var $totalUploaded = document.querySelector('#totalUploaded')
var $maxWebConns = document.querySelector('#maxWebConns')
// Download the torrent
client.add(torrentId, function (torrent) {

    // Stream the file in the browser
    //   torrent.files[0].appendTo('#output')
    console.log(torrent.path)

    torrent.files.forEach(file => {
        if (file.name.slice(-3) == "mp4") {
            file.appendTo('#output', {autoplay: true, controls: true});
        }

    });

    torrent.on('wire', function (wire, addr) {
        console.log('connected to peer with address ' + addr);
        console.log("wire");
        console.log(wire);
      })

    torrent.announce.forEach(tracker=>{
        console.log("tracker: "+tracker);
    });

    // Trigger statistics refresh
    torrent.on('done', onDone);
    setInterval(onProgress, 500);
    onProgress();

    // Statistics
    function onProgress() {
        // Peers
        $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');

        // Progress
        var percent = Math.round(torrent.progress * 100 * 100) / 100;
        $progressBar.style.width = percent + '%';
        $downloaded.innerHTML = prettyBytes(torrent.downloaded);
        $total.innerHTML = prettyBytes(torrent.length);

        // Remaining time
        // var remaining
        // if (torrent.done) {
        //   remaining = 'Done.'
        // } else {
        //   remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
        //   remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
        // }
        // $remaining.innerHTML = remaining

        // Speed rates
        $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s';
        $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s';
        $totalUploaded.innerHTML=prettyBytes(torrent.uploaded);
        $maxWebConns.innerHTML=torrent.maxWebConns;

    }

    function onDone() {
        $body.className += ' is-seed';
        onProgress();
    }
});

// Human readable bytes util
function prettyBytes(num) {
    var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (neg) {
        num = -num;
    }
    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
    num = Number((num / Math.pow(1000, exponent)).toFixed(2));
    unit = units[exponent];
    return (neg ? '-' : '') + num + ' ' + unit;
}