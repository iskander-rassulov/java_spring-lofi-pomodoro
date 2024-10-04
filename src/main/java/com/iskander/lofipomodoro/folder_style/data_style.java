package com.iskander.lofipomodoro.folder_style;

public class data_style {

    public int style_id;
    public String background_image_url;
    public data_style playlist;

    public int getStyle_id() {
        return style_id;
    }

    public void setStyle_id(int style_id) {
        this.style_id = style_id;
    }

    public String getBackground_image_url() {
        return background_image_url;
    }

    public void setBackground_image_url(String background_image_url) {
        this.background_image_url = background_image_url;
    }

    public data_style getPlaylist() {
        return playlist;
    }

    public void setPlaylist(data_style playlist) {
        this.playlist = playlist;
    }

}
