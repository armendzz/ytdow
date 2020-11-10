var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
    "outputPath": "/home/armendz/Projects/test/ytfire/output/mp3",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 1000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});
 
app.use(express.static('output'))

app.get('/', function(req, res){
    res.sendFile( __dirname + "/index.html" );
});

io.on('connection', function(socket){
    console.log('conected')
  socket.on('ida', function(id){
    YD.download(id);
  });

  YD.on("progress", function(progress) {
    socket.emit('progres', progress);
});

    YD.on("finished", function(err, data) {
        console.log(err)
        socket.emit('finished', data);
    });
});







http.listen(3086, function(){
  console.log('listening on *:3086');
});