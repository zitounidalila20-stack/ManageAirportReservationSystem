import flightHEROSECTION from "../../assets/flightHEROSECTION.mp4";

export default function Herosection() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <video
        src={flightHEROSECTION}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
}