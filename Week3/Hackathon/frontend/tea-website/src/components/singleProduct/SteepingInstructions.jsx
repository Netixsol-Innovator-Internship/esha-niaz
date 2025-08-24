import React from "react";
import { CiFaceSmile, CiMug1, CiTempHigh, CiTimer } from "react-icons/ci";

const SteepingInstructions = () => {
  // Hardcoded values
  const instructions = {
    servingSize: "1 tsp per 8oz cup",
    temperature: "80°C / 176°F",
    time: "3-5 minutes",
    colorNote: "Golden amber",
  };

  return (
    <div className="lg:w-[344px] lg:h-[249px] flex flex-col gap-6">
      <h3 className="text-[#282828] md:text-[32px] text-2xl leading-7 font-montserrat">
        Steeping instructions
      </h3>
      <ul className="w-fit">
        <li className="py-2 flex items-center gap-2">
          <CiMug1 className="w-6 h-6" />
          <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
            <span className="sm:text-base text-sm font-normal">SERVING SIZE: </span>
            {instructions.servingSize}
          </p>
        </li>
        <div className="mx-6 max-w-[264px] border border-[#A0A0A0]"></div>

        <li className="py-2 flex items-center gap-2">
          <CiTempHigh className="w-6 h-6" />
          <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
            <span className="sm:text-base text-sm font-normal">WATER TEMPERATURE: </span>
            {instructions.temperature}
          </p>
        </li>
        <div className="mx-6 max-w-[264px] border border-[#A0A0A0]"></div>

        <li className="py-2 flex items-center gap-2">
          <CiTimer className="w-6 h-6" />
          <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
            <span className="sm:text-base text-sm font-normal">STEEPING TIME: </span>
            {instructions.time}
          </p>
        </li>
        <div className="mx-6 max-w-[264px] border border-[#A0A0A0]"></div>

        <li className="py-2 flex items-center gap-2">
          <CiFaceSmile className="w-6 h-6" />
          <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
            <span className="sm:text-base text-sm font-normal">COLOR: </span>
            {instructions.colorNote}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(SteepingInstructions);