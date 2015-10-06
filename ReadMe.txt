Team Members:
Allan J Luke 100916046
Abhinav Thukral 100871855

Run Instructions:
In the command line, run the server.js located in the root directory of the assignment

$ node server.js

By default the server will be bound to the localhost (127.0.0.1) and Port 3000

Open your favorite browser (Preferably Chrome) and type in localhost:3000 in the address bar

Once the web page opens you can type in the name of the song in the input field and it will be loaded.
The song names are case sensitive:

As of now, 3 test cases can be loaded by typing the following:
These files are located under the songs folder

Brown Eyed Girl
Peaceful Easy Feeling
Sister Golden Hair

Note: Brown Eyed Girl is loaded by default

If you add songs to the folder, you must add it to the songs object in server.js. The key must be the song name and the value must be the file name without the '.txt' extension. Users can request the songs by entering the key specified in the song array.
