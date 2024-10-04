package com.iskander.lofipomodoro.folder_music;

import java.util.ArrayList;

public class func_start_playlist {

    public void startDefaultPlaylist() {
        data_playlist defaultPlaylist = func_playlist_default.definePlaylist();
        startSout(defaultPlaylist);
    }

    public void startMevievalPlaylist() {
        data_playlist medievalPlaylist = func_playlist_medieval.definePlaylist();
        startSout(medievalPlaylist);
    }

    public void startHalloweenPlaylist() {
        data_playlist halloWeenPlaylist = func_playlist_halloween.definePlaylist();
        startSout(halloWeenPlaylist);
    }

    public void startSout(data_playlist playlist){
        ArrayList<data_audio> arr = playlist.getAudios();

        for (int i = 0; i < arr.size(); i++) {
            System.out.println("ID: " + arr.get(i).getAudio_id() + ", Name: " + arr.get(i).getAudio_name() + ", Author: " + arr.get(i).getAuthor_name());
        }
    }

}
