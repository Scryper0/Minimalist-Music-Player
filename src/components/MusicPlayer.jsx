import PlayerControls from "./PlayerControls";
import { useState, useRef, useEffect } from "react";
import {
  RiVolumeUpFill,
  RiRepeatFill,
  RiRepeatOneFill,
  RiVolumeMuteFill,
  RiVolumeDownFill,
} from "react-icons/ri";
import songs from "../database/songs";

const MusicPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25); // 0 - 1
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "all" | "one"
  const audioRef = useRef(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnd = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === "all") {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    } else {
      // "off": stop at last song, otherwise go to next
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const cycleRepeat = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "all" : prev === "all" ? "one" : "off",
    );
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <>
      {/* MUSIC PLAYER CONTAINER */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-150 flex gap-6">
        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleSongEnd}
        />

        {/* ALBUM ARTWORK — LEFT SIDE */}
        <div className="w-56 h-56 shrink-0 rounded-xl overflow-hidden bg-stone-100">
          {currentSong.cover ? (
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-linear-to-br ${currentSong.color}`}
            />
          )}
        </div>

        {/* RIGHT SIDE — EVERYTHING ELSE */}
        <div className="flex flex-col justify-center flex-1 gap-2">
          {/* SONG INFO */}
          <div className="flex flex-col mb-5">
            <p className="font-semibold text-stone-800 text-lg tracking-tight">
              {currentSong.title}
            </p>
            <p className="text-stone-400 text-sm">{currentSong.artist}</p>
          </div>

          {/* BAR SECTION */}
          <div className="flex flex-col gap-2">
            <div
              className="w-full h-1 bg-stone-100 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-stone-800 rounded-full"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-stone-400">
                {formatTime(currentTime)}
              </span>
              <span className="text-xs text-stone-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* CONTROLS */}
          <PlayerControls
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            totalSongs={songs.length}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />

          {/* VOLUME AND REPEAT */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="text-gray-300 hover:text-gray-700 transition-colors duration-200"
              >
                {isMuted || volume === 0 ? (
                  <RiVolumeMuteFill size={20} />
                ) : volume < 0.5 ? (
                  <RiVolumeDownFill size={20} />
                ) : (
                  <RiVolumeUpFill size={20} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-0 group-hover:w-20 transition-all duration-300 accent-gray-700 cursor-pointer overflow-hidden"
              />
            </div>

            <button
              onClick={cycleRepeat}
              className={`transition-colors duration-200 ${
                repeatMode === "off"
                  ? "text-gray-300 hover:text-gray-700"
                  : "text-gray-700"
              }`}
            >
              {repeatMode === "one" ? (
                <RiRepeatOneFill size={20} />
              ) : (
                <RiRepeatFill size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
