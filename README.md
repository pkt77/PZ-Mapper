# Project Zomboid Map Merger

Project Zomboid saves all map data to each player's computer, so the server is not aware of their progress.
This tool reads from multiple map_symbols.bin files to convert into a single one. It supports any mod that adds more symbols such as [Extra Map Symbols](https://steamcommunity.com/sharedfiles/filedetails/?id=2701170568)
Use this to share your maps with friends.

Currently, this tool only merges symbols, but I'd like to add support for the map view and also be able to edit it.

Yes I know the site looks ugly. I'm just a programmer, not a designer. Feel free to redesign and submit a pull request.

I don't think it is possible to make a mod for this in Lua, but if someone makes one, please send it to me, and I'll link it here.

## How to use

1. Go to your Project Zomboid Saves folder, i.e. C:\Users\YOUR USER\Zomboid\Saves
2. Go into a single or multiplayer folder. If Multiplayer, select the server folder.
3. Make a backup of your map_symbols.bin file. I AM NOT RESPONSIBLE IF YOU LOSE DATA.
4. Either send your file to friends or ask for theirs.
5. Go to [The Website](https://pkt77.github.io/PZ-Mapper/) and select the files to merge.
6. Send the downloaded file to your friends to replace their original file.
7. Reload the game for it to read the new data.

If there are any problems, please tell me and send your files so that I can test.

Hopefully Indie Stone makes this a feature in-game so there's no need for this hassle.