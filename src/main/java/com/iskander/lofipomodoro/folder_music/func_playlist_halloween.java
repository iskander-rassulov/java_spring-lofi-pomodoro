package com.iskander.lofipomodoro.folder_music;

public class func_playlist_halloween {

    static func_create_audio funcCreateAudio = new func_create_audio();

    public static data_playlist definePlaylist() {
        data_playlist defaultPlaylist = new data_playlist(3);

        defaultPlaylist.audios.add(funcCreateAudio.createAudio
                (0, 50, "URL1", "Halloween1", "name surname", false));

        defaultPlaylist.audios.add(funcCreateAudio.createAudio
                (1, 50, "URL2", "Halloween2", "name surname", false));

        defaultPlaylist.audios.add(funcCreateAudio.createAudio(
                2, 50, "URL3", "Halloween3", "name surname", false));

        return defaultPlaylist;
    }

}
