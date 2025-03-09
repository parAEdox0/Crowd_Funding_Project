const Card = ({
  category,
  daysLeft,
  title,
  raised,
  percentage,
  goal,
  image,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-sm">
      <img
        src={image}
        alt={title}
        className="w-full h-48 sm:h-52 lg:h-56 object-cover"
      />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
          <span className="text-gray-500 text-sm flex items-center">
            ⏳ {daysLeft} Days Left
          </span>
        </div>
        <h3 className="text-lg font-semibold mt-2 truncate">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">
          Raised: {raised} ({percentage})
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${parseFloat(percentage)}%` }}
          ></div>
        </div>
        <p className="text-sm mt-2">
          <span className="font-bold">Goal:</span>{" "}
          <span className="text-blue-600">{goal}</span>
        </p>
      </div>
    </div>
  );
};

export default Card;
