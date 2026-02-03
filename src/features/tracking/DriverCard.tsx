import driverTruck from "@/assets/driver-truck.png";
export const DriverCard = () => {
  return (
    <div className="bg-[#102216] text-white p-4 rounded-3xl flex items-center gap-4 ">
      
      {/* Driver Image */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10">
            <img 
              src={driverTruck} 
              alt="Driver" 
              className="w-full h-full object-cover" 
            />
        </div>
        {/* Online Status Dot */}
        {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-[#102216] rounded-full"></div> */}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h4 className="font-bold text-sm text-white">Chinedu Obi</h4>
        <p className="text-xs text-gray-400">Mercedes Sprinter • ABC-123</p>
        
      </div>
    </div>
  );
};