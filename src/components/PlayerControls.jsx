import {
  RiSkipBackFill,
  RiPlayFill,
  RiPauseFill,
  RiSkipForwardFill,
} from "react-icons/ri";

const PlayerControls = ({
  currentIndex,
  setCurrentIndex,
  totalSongs,
  isPlaying,
  onPlayPause,
}) => {
  return (
    <div className="flex items-center justify-center gap-8 my-2">
      {/* BACK BUTTON */}
      <button
        className="text-stone-400 hover:text-gray-700 transition-colors duration-200"
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + totalSongs) % totalSongs)
        }
      >
        <RiSkipBackFill size={20} />
      </button>

      {/* PLAY BUTTON */}
      <button
        className="w-14 h-14 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-200 shadow-md"
        onClick={onPlayPause}
      >
        {isPlaying ? <RiPauseFill size={22} /> : <RiPlayFill size={22} />}
      </button>

      {/* NEXT BUTTON */}
      <button
        className="text-stone-400 hover:text-gray-700 transition-colors duration-200"
        onClick={() => setCurrentIndex((currentIndex + 1) % totalSongs)}
      >
        <RiSkipForwardFill size={20} />
      </button>
    </div>
  );
};

export default PlayerControls;
