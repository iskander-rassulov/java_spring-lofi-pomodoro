package com.iskander.lofipomodoro.folder_music;

import java.util.ArrayList;

public class data_playlist {

    public int size;
    public ArrayList<data_audio> audios;

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public ArrayList<data_audio> getAudios() {
        return audios;
    }

    public void setAudios(ArrayList<data_audio> audios) {
        this.audios = audios;
    }

    public data_playlist(int size) {
        this.size = size;
        this.audios = new ArrayList<>(size);  // Инициализация ArrayList
    }
}
