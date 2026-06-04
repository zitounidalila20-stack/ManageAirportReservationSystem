import landingmain from "../assets/landingmain.mp4";

export default function LandingmainVideo() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* VIDEO */}
      <video
        src={landingmain}
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
</div>
  );
}