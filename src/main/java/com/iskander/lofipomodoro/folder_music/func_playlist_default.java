package com.iskander.lofipomodoro.folder_music;

public class func_playlist_default {

    static func_create_audio funcCreateAudio = new func_create_audio();

    public static data_playlist definePlaylist() {
        data_playlist defaultPlaylist = new data_playlist(3);

        defaultPlaylist.audios.add(funcCreateAudio.createAudio
                (0, 50, "audio/memoria.mp3", "Memoria", "name surname", false));

        return defaultPlaylist;
    }
}
