package com.iskander.lofipomodoro.folder_music;

public class func_create_audio {

    public data_audio createAudio(int audioId, int volume, String audioURL, String audioName, String authorName, boolean isPlaying) {
        data_audio audio = new data_audio();

        audio.setAudio_id(audioId);
        audio.setVolume(volume);
        audio.setAudio_url(audioURL);
        audio.setAudio_name(audioName);
        audio.setAuthor_name(authorName);
        audio.setIs_playing(isPlaying);

        return audio;
    }

}
