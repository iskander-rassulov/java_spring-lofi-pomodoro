package com.iskander.lofipomodoro;

import com.iskander.lofipomodoro.folder_music.func_start_playlist;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LofipomodoroApplication {

	public static func_start_playlist funcStartPlaylist = new func_start_playlist();

	public static void main(String[] args) {
		SpringApplication.run(LofipomodoroApplication.class, args);
		funcStartPlaylist.startDefaultPlaylist();
		funcStartPlaylist.startMevievalPlaylist();
		funcStartPlaylist.startHalloweenPlaylist();
	}

}
