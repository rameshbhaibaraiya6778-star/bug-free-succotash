const video = document.getElementById('video');
const downloadBtn = document.getElementById('downloadBtn');

let videoURL = "";

// Example: API parameters
const mediaURL = encodeURIComponent("media-cdn.classplusapp.com/drm/66c1e2c5e9eabfd04b01cdb4/playlist.m3u8@Saini_bots");
const userId = "7815387564";

// Fetch video info from backend
fetch(`/get_video?url=${mediaURL}&user_id=${userId}`)
.then(res => res.json())
.then(data => {
    console.log(data); // Check the API response

    // Assume API returns fields: 'stream_url', 'handshake_key', 'drm'
    videoURL = data.stream_url || "";
    const handshakeKey = data.handshake_key || "";
    const drmProtected = data.drm || false;

    if (!videoURL) return alert("No video URL returned!");

    if (drmProtected) {
        initShakaPlayer(videoURL, handshakeKey);
    } else {
        initHLSPlayer(videoURL);
    }
})
.catch(err => console.error("Error fetching video:", err));

// Non-DRM HLS player
function initHLSPlayer(url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => video.play());
    }
}

// DRM Player using Shaka
function initShakaPlayer(url, key) {
    shaka.polyfill.installAll();
    const player = new shaka.Player(video);

    player.configure({
        drm: {
            servers: {
                'com.widevine.alpha': `https://demo-license-server.com/widevine?key=${key}`
            }
        }
    });

    player.load(url)
        .then(() => video.play())
        .catch(err => console.error("Shaka Player Error:", err));
}

// Download button for Non-DRM only
downloadBtn.addEventListener('click', () => {
    if (!videoURL) return alert("Video not loaded");
    if (videoURL.endsWith(".m3u8") || videoURL.endsWith(".mp4")) {
        const a = document.createElement("a");
        a.href = videoURL;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("DRM video cannot be downloaded");
    }
});
